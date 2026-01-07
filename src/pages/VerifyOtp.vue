<script setup>
import { useRouter, useRoute } from "vue-router";
import { useCustomToast } from "../composables/toast";
import { useAuthStore } from "../store/auth";
import requestService from "../services/api/requestService";
import { useI18n } from "vue-i18n";
import AppLayout from "../Layout/AppLayout.vue";
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";

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

const otpDigits = ref(["", "", "", "", "", ""]);
const inputRefs = ref([]);
const isSubmitting = ref(false);
const validationError = ref("");

// Handle input - only allow digits
const handleInput = (event, index) => {
  const input = event.target;
  let value = input.value;

  // Clear any validation error when user types
  validationError.value = "";

  // Take only the last character if multiple entered
  if (value.length > 1) {
    value = value.charAt(value.length - 1);
  }

  // Only allow digits
  if (value && !/^\d$/.test(value)) {
    input.value = otpDigits.value[index];
    return;
  }

  // Update digit
  otpDigits.value[index] = value;

  // Auto-focus next input
  if (value && index < 5 && inputRefs.value[index + 1]) {
    inputRefs.value[index + 1].focus();
  }

  // Auto-submit when all filled (NO validation error shown)
  const code = otpDigits.value.join("");
  if (code.length === 6 && /^\d{6}$/.test(code)) {
    // Small delay for better UX
    setTimeout(() => {
      onSubmit();
    }, 200);
  }
};

// Handle keydown for backspace and arrow navigation
const handleKeyDown = (event, index) => {
  if (event.key === "Backspace") {
    event.preventDefault();

    // Clear validation error
    validationError.value = "";

    if (otpDigits.value[index]) {
      // Clear current digit
      otpDigits.value[index] = "";
    } else if (index > 0) {
      // Move to previous input and clear it
      otpDigits.value[index - 1] = "";
      if (inputRefs.value[index - 1]) {
        inputRefs.value[index - 1].focus();
      }
    }
  } else if (event.key === "ArrowLeft" && index > 0) {
    event.preventDefault();
    if (inputRefs.value[index - 1]) {
      inputRefs.value[index - 1].focus();
    }
  } else if (event.key === "ArrowRight" && index < 5) {
    event.preventDefault();
    if (inputRefs.value[index + 1]) {
      inputRefs.value[index + 1].focus();
    }
  } else if (event.key === "Delete") {
    event.preventDefault();
    validationError.value = "";
    otpDigits.value[index] = "";
  }
};

// Handle paste
const handlePaste = (event, index) => {
  event.preventDefault();
  const paste = event.clipboardData.getData("text").trim();

  // Clear validation error
  validationError.value = "";

  // Check if it's a 6-digit code
  if (/^\d{6}$/.test(paste)) {
    const digits = paste.split("");
    otpDigits.value = digits;

    // Focus last input
    if (inputRefs.value[5]) {
      inputRefs.value[5].focus();
    }

    // Auto-submit after paste
    setTimeout(() => {
      onSubmit();
    }, 200);
  }
};

// Handle focus - select all for easy replacement
const handleFocus = (event) => {
  event.target.select();
};

// Validate OTP before submit
const validateOtp = () => {
  const code = otpDigits.value.join("");

  // Check if empty
  if (code.length === 0) {
    validationError.value = t("otp.required");
    return false;
  }

  // Check if incomplete
  if (code.length !== 6) {
    validationError.value = t("otp.invalid_length");
    return false;
  }

  // Check if contains only digits
  if (!/^\d{6}$/.test(code)) {
    validationError.value = t("otp.invalid_length");
    return false;
  }

  return true;
};

// Submit handler
const onSubmit = async () => {
  // Validate ONLY when submitting
  if (!validateOtp()) {
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await requestService.create("auth/verify-otp", {
      otp: otpDigits.value.join(""),
    });

    const access = response?.tokens?.access_token ?? null;
    if (access) localStorage.setItem("token", access);

    // Properly set user and trigger socket initialization
    authStore.grantAccess(response?.data);

    showSuccess(response?.message || t("otp.verified"));
    router.push("/");
  } catch (err) {
    showError(err);

    // Clear OTP inputs on error
    otpDigits.value = ["", "", "", "", "", ""];
    validationError.value = "";

    // Focus first input
    nextTick(() => {
      if (inputRefs.value[0]) {
        inputRefs.value[0].focus();
      }
    });
  } finally {
    isSubmitting.value = false;
  }
};

// Manual submit when clicking button
const handleManualSubmit = () => {
  onSubmit();
};

// Countdown timer
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

    // Clear OTP inputs
    otpDigits.value = ["", "", "", "", "", ""];
    validationError.value = "";

    // Focus first input
    nextTick(() => {
      if (inputRefs.value[0]) {
        inputRefs.value[0].focus();
      }
    });

    startTimer(DEFAULT_COOLDOWN);
  } catch (err) {
    const backendMsg = err?.response?.message || err?.message || "";

    // Check if backend sends cooldown time
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
  // Focus first input on mount
  nextTick(() => {
    if (inputRefs.value[0]) {
      inputRefs.value[0].focus();
    }
  });

  // Start countdown timer
  startTimer(DEFAULT_COOLDOWN);
});

onUnmounted(() => {
  stopTimer();
});
</script>

<template>
  <app-layout>
    <main
      class="flex items-center justify-center min-h-screen px-4"
      :dir="isRtl ? 'rtl' : 'ltr'"
    >
      <div class="w-full max-w-md">
        <!-- Title -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">
            {{ t("otp.title") }}
          </h1>
          <p class="text-sm text-gray-600">
            {{ t("otp.instruction") }}
            <span class="font-semibold text-gray-900 block mt-1">
              {{ phone || email }}
            </span>
          </p>
        </div>

        <!-- OTP Input - Always LTR for numbers -->
        <div class="flex justify-center gap-3 mb-6" dir="ltr">
          <input
            v-for="(digit, index) in otpDigits"
            :key="index"
            :ref="(el) => (inputRefs[index] = el)"
            v-model="otpDigits[index]"
            type="text"
            inputmode="numeric"
            maxlength="1"
            autocomplete="one-time-code"
            class="w-12 h-12 sm:w-14 sm:h-14 border-2 rounded-xl text-center text-xl font-bold focus:outline-none transition-all duration-200"
            :class="{
              'border-red-400 bg-red-50': validationError,
              'border-gray-300 hover:border-gray-400':
                !digit && !validationError,
              'border-yellow-400 bg-yellow-50': digit && !validationError,
              'focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100': true,
            }"
            @input="handleInput($event, index)"
            @keydown="handleKeyDown($event, index)"
            @paste="handlePaste($event, index)"
            @focus="handleFocus"
          />
        </div>

        <!-- Error Message - Only shows when validation fails -->
        <div class="mb-6 min-h-[24px]">
          <p
            v-if="validationError"
            class="text-red-500 text-sm text-center animate-shake"
          >
            {{ validationError }}
          </p>
        </div>

        <!-- Verify Button -->
        <button
          @click="handleManualSubmit"
          :disabled="isSubmitting"
          class="w-full bg-yellow-400 text-gray-900 font-bold py-3.5 rounded-xl mb-6 hover:bg-yellow-500 active:bg-yellow-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        >
          <span
            v-if="isSubmitting"
            class="flex items-center justify-center gap-2"
          >
            <svg
              class="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {{ t("otp.verifying") }}...
          </span>
          <span v-else>{{ t("otp.verify") }}</span>
        </button>

        <!-- Resend Code Section -->
        <div class="text-center">
          <p class="text-sm text-gray-600">
            {{ t("otp.no_code") }}
          </p>
          <button
            v-if="canResend"
            @click="resendCode"
            class="mt-2 text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors"
          >
            {{ t("otp.resend") }}
          </button>
          <p v-else class="mt-2 text-gray-500 font-medium">
            {{ t("otp.resend_in", { seconds: countdown }) }}
          </p>
        </div>
      </div>
    </main>
  </app-layout>
</template>

<style scoped>
/* Remove input spinner for number inputs */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="text"] {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: textfield;
}

/* Shake animation for errors */
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-4px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(4px);
  }
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

/* Prevent text selection on rapid clicking */
input {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
}
</style>
