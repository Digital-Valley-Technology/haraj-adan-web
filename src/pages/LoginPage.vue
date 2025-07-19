<script setup>
import { useRouter, useRoute } from "vue-router";
import AppLayout from "../Layout/AppLayout.vue";
import { useCustomToast } from "../composables/toast";
import { useAuthStore } from "../store/auth";
import requestService from "../services/api/requestService";
import { useI18n } from "vue-i18n";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import { BASE_URL } from "../services/axios";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const { showError, showSuccess } = useCustomToast();
const authStore = useAuthStore();

const schema = yup.object({
  identifier: yup.string().required(t("validation.email_or_phone.required")),
});

const { handleSubmit, isSubmitting } = useForm({ validationSchema: schema });
const { value: identifier, errorMessage: identifierError } =
  useField("identifier");

const onSubmit = handleSubmit(async (values) => {
  try {
    const response = await requestService.create("auth/otp-request", {
      ...values,
    });

    showSuccess(response?.message || t("otp.sent_successfully"));
    router.push("/verify-otp");
  } catch (error) {
    showError(error?.message || t("otp.send_failed"));
  }
});

const loginWithGoogle = async () => {
  try {
    window.location.href = `${BASE_URL}/auth/google`;
  } catch (err) {
    showError(t("login.google_failed"));
  }
};
</script>

<template>
  <app-layout>
    <main class="relative py-32 px-6">
      <div
        class="card px-6 py-8 mx-auto max-w-[600px] shadow-lg border border-gray-200 rounded-lg"
      >
        <!-- Google login -->
        <Button
          class="!block w-full !rounded-md mb-6 !bg-red-500 !border-red-500 text-white"
          size="large"
          @click="loginWithGoogle"
        >
          <i class="pi pi-google me-2"></i>
          {{ $t("login.login_with_google") }}
        </Button>

        <!-- Email or phone input -->
        <IconField class="mb-4">
          <InputIcon size="large" class="pi pi-user" />
          <InputText
            v-model="identifier"
            class="w-full !border-gray-300"
            size="large"
            type="text"
            :placeholder="$t('register.email_or_phone')"
          />
        </IconField>
        <p v-if="identifierError" class="text-red-500 text-sm mt-1">
          {{ identifierError }}
        </p>

        <!-- Send OTP button -->
        <Button
          type="button"
          class="!block w-full !rounded-md mb-4 !bg-[var(--primary-clr)] !border-[var(--primary-clr)]"
          size="large"
          @click="onSubmit"
          :disabled="isSubmitting"
        >
          <i v-if="isSubmitting" class="pi pi-spinner pi-spin me-2"></i>
          <i v-else class="pi pi-key me-2"></i>
          {{ isSubmitting ? $t("otp.sending") : $t("otp.send_code") }}
        </Button>

        <!-- Register -->
        <p class="text-center text-sm">
          <span class="inline-block me-2">{{ $t("register.no-account") }}</span>
          <RouterLink to="/register" class="text-[#596e60]">
            {{ $t("register.register-account") }}
          </RouterLink>
        </p>
      </div>
    </main>
  </app-layout>
</template>
