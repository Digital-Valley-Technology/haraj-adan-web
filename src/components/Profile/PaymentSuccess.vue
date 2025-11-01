<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();

// Emits an event to notify the parent to navigate away
const emit = defineEmits(["goToHome"]);

const handleGoToHome = () => {
  emit("goToHome");
};
</script>

<template>
  <div class="bg-white p-4 rounded-lg">
    <div class="p-10">
      <div class="flex flex-col justify-center items-center gap-2 text-center">
        <!-- Success Icon -->
        <i class="pi pi-check text-4xl text-[#09B285] mb-2"></i>

        <!-- Success Title -->
        <p class="text-sm">
          {{ t("profile.payment.success_title") }}
        </p>

        <!-- Success Details -->
        <p class="text-xs text-gray-500 mb-4">
          {{ t("profile.payment.success_details") }}
        </p>

        <!-- Home Button -->
        <button
          class="w-64 bg-[#FFE800] text-black px-4 py-2 rounded-lg hover:bg-[#f5e103] transition cursor-pointer"
          @click="handleGoToHome"
        >
          {{ t("profile.payment.home_button") }}
        </button>
      </div>
    </div>
  </div>
</template>
