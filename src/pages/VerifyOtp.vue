<script setup>
import { useRouter, useRoute } from "vue-router";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import { useCustomToast } from "../composables/toast";
import { useAuthStore } from "../store/auth";
import requestService from "../services/api/requestService";
import { useI18n } from "vue-i18n";
import AppLayout from "../Layout/AppLayout.vue";
import { ref, computed, onMounted, onUnmounted, watch } from "vue";

const { t, locale } = useI18n();
const router = useRouter();
const route = useRoute();
const { showError, showSuccess } = useCustomToast();
const authStore = useAuthStore();

const phone = ref(route.query.phone || "");
const email = ref(route.query.email || "");

const isRtl = computed(() => {
  const rtlLocales = ["ar", "he", "fa", "ur"];
  return rtlLocales.includes(locale.value);
});

const schema = yup.object({
  otp: yup
    .string()
    .required(t("otp.required"))
    .length(6, t("otp.invalid_length")),
});
const { handleSubmit, isSubmitting, setFieldValue } = useForm({
  validationSchema: schema,
});
const { errorMessage: otpError } = useField("otp");

const otpDigits = ref(["", "", "", "", "", ""]);
const updateOtp = () => {
  setFieldValue("otp", otpDigits.value.join(""));
};

// 👇 watch OTP and auto-submit when full
watch(otpDigits, (digits) => {
  const code = digits.join("");
  if (code.length === 6 && code.match(/^\d{6}$/)) {
    onSubmit(); // trigger submit automatically
  }
});

const moveFocus = (event, index) => {
  const inputs = document.querySelectorAll('input[maxlength="1"]');
  const value = event.target.value;
  otpDigits.value[index] = value;
  updateOtp();

  if (value && value.length === 1 && index < inputs.length - 1) {
    inputs[index + 1].focus();
  }

  if (!value && event.key === "Backspace" && index > 0) {
    inputs[index - 1].focus();
  }
};

// 👇 handle paste (fill all inputs)
const handlePaste = (event) => {
  const paste = event.clipboardData.getData("text").trim();
  if (paste.length === 6 && /^\d{6}$/.test(paste)) {
    otpDigits.value = paste.split("");
    updateOtp();
    event.preventDefault();
  }
};

const onSubmit = handleSubmit(async (values) => {
  try {
    const response = await requestService.create("auth/verify-otp", {
      otp: values.otp,
    });

    const access = response?.tokens?.access_token ?? null;
    if (access) localStorage.setItem("token", access);

    authStore.user = response?.data;
    authStore.isAuthenticated = true;

    showSuccess(response?.message || t("otp.verified"));
    router.push("/");
  } catch (err) {
    showError(err);
  }
});

const DEFAULT_COOLDOWN = 60;
const countdown = ref(0);
let intervalId = null;

const canResend = computed(() => countdown.value <= 0);

function startTimer(seconds = DEFAULT_COOLDOWN) {
  stopTimer();
  countdown.value = seconds;
  intervalId = window.setInterval(() => {
    if (countdown.value > 0) {
      countdown.value -= 1;
    } else {
      stopTimer();
    }
  }, 1000);
}

function stopTimer() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

const resendCode = async () => {
  if (!canResend.value) return;

  try {
    const payload = phone.value
      ? { phone: phone.value }
      : { email: email.value };
    const response = await requestService.create("auth/resend-otp", payload);

    showSuccess(response?.message || t("otp.resend_success"));
    startTimer(DEFAULT_COOLDOWN);
  } catch (err) {
    const backendMsg = err?.response?.message || err?.message || "";

    const match = backendMsg.match(/(\d+)\s*s?/);
    if (match) {
      const seconds = parseInt(match[1], 10);
      if (!isNaN(seconds) && seconds > 0) {
        startTimer(seconds);
      }
    }

    showError(backendMsg || t("otp.resend_error"));
  }
};

onMounted(() => {
  const inputs = document.querySelectorAll('input[maxlength="1"]');
  if (inputs.length > 0) inputs[0].focus();
  startTimer(DEFAULT_COOLDOWN);
});

onUnmounted(() => {
  stopTimer();
});
</script>

<template>
  <app-layout>
    <main class="flex items-center justify-center min-h-screen px-4">
      <div class="w-full max-w-md">
        <!-- Title -->
        <h1 class="text-2xl font-semibold text-center mb-8">
          {{ t("otp.title") }}
        </h1>

        <!-- Instruction -->
        <p class="text-center text-sm mb-6">
          {{ t("otp.instruction") }}
          <span class="font-semibold">
            {{ phone || email }}
          </span>
        </p>

        <!-- OTP input -->
        <div class="flex justify-between mb-6">
          <input
            v-for="(digit, index) in otpDigits"
            :key="index"
            v-model="otpDigits[index]"
            type="text"
            maxlength="1"
            class="w-12 h-12 border border-gray-300 rounded-lg text-center text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
            :class="{ 'ml-2': !isRtl, 'mr-2': isRtl }"
            @input="moveFocus($event, index)"
            @keyup="moveFocus($event, index)"
            @paste="handlePaste"
          />
        </div>

        <p v-if="otpError" class="text-red-500 text-xs mt-1 mb-4">
          {{ otpError }}
        </p>

        <!-- Verify button -->
        <button
          @click="onSubmit"
          :disabled="isSubmitting"
          class="w-full bg-yellow-300 text-gray-800 font-medium py-2 rounded-lg mb-6 hover:bg-yellow-400 transition disabled:opacity-50"
        >
          <span v-if="isSubmitting">{{ $t("otp.verifying") }}...</span>
          <span v-else>{{ $t("otp.verify") }}</span>
        </button>

        <!-- Resend Code with countdown -->
        <p class="text-center text-sm">
          {{ t("otp.no_code") }}
          <a
            v-if="canResend"
            href="#"
            class="text-blue-600 hover:underline"
            @click.prevent="resendCode"
          >
            {{ t("otp.resend") }}
          </a>
          <span v-else class="text-gray-500">
            {{ t("otp.resend_in", { seconds: countdown }) }}
          </span>
        </p>
      </div>
    </main>
  </app-layout>
</template>
