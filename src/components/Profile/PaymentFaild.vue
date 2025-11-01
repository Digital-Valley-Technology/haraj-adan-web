<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();

// Emits events to let the parent handle navigation or re-showing the form
const emit = defineEmits(["goToHome", "retryPayment"]);

const handleRetry = () => {
  emit("retryPayment");
};

const handleGoToHome = () => {
  emit("goToHome");
};
</script>

<template>
  <div class="bg-white p-4 rounded-lg">
    <div class="p-10">
      <div class="flex flex-col justify-center items-center gap-2 text-center">
        <!-- Failure Icon (Using 'pi-times' for error) -->
        <i class="pi pi-times text-4xl text-red-500 mb-2"></i>

        <!-- Failure Title -->
        <p class="text-sm font-semibold text-red-700">
          {{ t("profile.payment.fail_title") }}
        </p>

        <!-- Failure Details -->
        <p class="text-xs text-gray-500 mb-6">
          {{ t("profile.payment.fail_details") }}
        </p>

        <!-- Retry Button (Primary action) -->
        <button
          class="w-64 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition cursor-pointer mb-3"
          @click="handleRetry"
        >
          {{ t("profile.payment.retry_button") }}
        </button>

        <!-- Home Button (Secondary action) -->
        <button
          class="w-64 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition cursor-pointer"
          @click="handleGoToHome"
        >
          {{ t("profile.payment.home_button") }}
        </button>
      </div>
    </div>
  </div>
</template>
