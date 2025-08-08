<script setup>
import { useRouter, useRoute } from "vue-router";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import { useCustomToast } from "../composables/toast";
import { useAuthStore } from "../store/auth";
import requestService from "../services/api/requestService";
import { useI18n } from "vue-i18n";
import AppLayout from "../Layout/AppLayout.vue";
import { ref, computed, onMounted } from "vue";

const { t, locale } = useI18n();
const router = useRouter();
const route = useRoute();
const { showError, showSuccess } = useCustomToast();
const authStore = useAuthStore();

// Get phone number from route query
const phone = ref(route.query.phone || "");

// Determine text direction based on locale
const isRtl = computed(() => {
  const rtlLocales = ["ar", "he", "fa", "ur"]; // Add other RTL locales as needed
  return rtlLocales.includes(locale.value);
});

// Define schema for 6-digit OTP validation
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

// Array to store individual OTP digits
const otpDigits = ref(["", "", "", "", "", ""]);

// Update the otp field in vee-validate whenever otpDigits changes
const updateOtp = () => {
  const otpValue = otpDigits.value.join("");
  setFieldValue("otp", otpValue);
};

const onSubmit = handleSubmit(async (values) => {
  try {
    const response = await requestService.create("auth/verify-otp", {
      otp: values.otp,
    });

    localStorage.setItem("token", response?.access_token);
    showSuccess(response?.status?.message || t("otp.verified"));
    authStore.user = response?.data;
    authStore.isAuthenticated = true;

    router.push("/");
  } catch (error) {
    showError(error?.status?.message || t("otp.invalid"));
  }
});

const moveFocus = (event, index) => {
  const inputs = document.querySelectorAll('input[maxlength="1"]');
  const value = event.target.value;

  // Update the corresponding digit
  otpDigits.value[index] = value;
  updateOtp();

  // Move to next input when a digit is entered
  if (value && value.length === 1 && index < 5) {
    inputs[index + 1].focus();
  }
  // Move to previous input on backspace if current input is empty
  else if (!value && event.key === "Backspace" && index > 0) {
    inputs[index - 1].focus();
  }
};

const resendCode = async () => {
  try {
    await requestService.create("auth/resend-otp", { phone: phone.value });
    showSuccess(t("otp.resend_success"));
  } catch (error) {
    showError(error?.status?.message || t("otp.resend_error"));
  }
};

onMounted(() => {
  const inputs = document.querySelectorAll('input[maxlength="1"]');
  if (inputs.length > 0) {
    inputs[0].focus();
  }
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
          {{ t("otp.instruction") }} {{ phone }}
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

        <!-- Resend Code -->
        <p class="text-center text-sm">
          {{ t("otp.no_code") }}
          <a
            href="#"
            class="text-blue-600 hover:underline"
            @click.prevent="resendCode"
            >{{ t("otp.resend") }}</a
          >
        </p>
      </div>
    </main>
  </app-layout>
</template>
