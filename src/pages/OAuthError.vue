<script setup>
import { useRouter } from "vue-router";
import { useCustomToast } from "../composables/toast";
import { useI18n } from "vue-i18n";
import AppLayout from "../Layout/AppLayout.vue";
import Button from "primevue/button";

const router = useRouter();
const { showError } = useCustomToast();
const { t } = useI18n();

// Show error toast on mount
onMounted(() => {
  showError(t("auth.google_login_cancelled"));
});

// Function to handle retry button click
const handleRetry = () => {
  router.push("/login");
};
</script>

<template>
  <app-layout>
    <main class="flex items-center justify-center h-screen">
      <div class="text-center">
        <i class="pi pi-exclamation-circle text-5xl text-red-500 mb-4"></i>
        <h1 class="text-2xl font-bold mb-2">{{ $t("auth.access_denied") }}</h1>
        <p class="text-lg text-gray-600 mb-6">
          {{ $t("auth.google_login_cancelled") }}
        </p>
        <Button
          :label="$t('auth.retry_login')"
          icon="pi pi-sign-in"
          class="p-button-primary"
          @click="handleRetry"
        />
      </div>
    </main>
  </app-layout>
</template>

<style scoped>
main {
  background-color: #f9fafb; /* Light background for contrast */
}

.p-button-primary {
  background-color: #2563eb; /* Blue to match common primary buttons */
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

.p-button-primary:hover {
  background-color: #1e40af; /* Darker blue on hover */
}
</style>
