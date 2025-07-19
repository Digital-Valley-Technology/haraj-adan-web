<script setup>
import { onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../store/auth";
import { useCustomToast } from "../composables/toast";
import AppLayout from "../Layout/AppLayout.vue";
import { showSuccess } from "../utils/notifications";
import { useI18n } from "vue-i18n";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const { showError } = useCustomToast();
const { t } = useI18n();

onMounted(async () => {
  const token = route.query.token;

  try {
    if (token) {
      localStorage.setItem("token", token);
    }
    await authStore.getMe();
    router.replace("/");
    showSuccess(t("register.login_success"));
  } catch (err) {
    showError(t("otp.invalid"));
    router.replace("/login");
  }
});
</script>

<template>
  <app-layout>
    <main class="flex items-center justify-center h-screen">
      <div class="text-center">
        <i class="pi pi-spin pi-spinner text-3xl mb-4"></i>
        <p class="text-lg">{{ $t("register.logging_in") }}</p>
      </div>
    </main>
  </app-layout>
</template>
