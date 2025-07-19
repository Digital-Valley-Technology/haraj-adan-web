<script setup>
import { useRouter } from "vue-router";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import { useCustomToast } from "../composables/toast";
import { useAuthStore } from "../store/auth";
import requestService from "../services/api/requestService";
import { useI18n } from "vue-i18n";
import AppLayout from "../Layout/AppLayout.vue";

const { t } = useI18n();
const router = useRouter();
const { showError, showSuccess } = useCustomToast();
const authStore = useAuthStore();

const schema = yup.object({
  otp: yup.string().required(t("otp.required")),
});

const { handleSubmit, isSubmitting } = useForm({ validationSchema: schema });
const { value: otp, errorMessage: otpError } = useField("otp");

const onSubmit = handleSubmit(async (values) => {
  try {
    const response = await requestService.create("auth/verify-otp", {
      otp: values.otp,
    });

    localStorage.setItem("token", response?.access_token);
    showSuccess(response?.message || t("otp.verified"));
    authStore.user = response?.data;
    authStore.isAuthenticated = true;

    router.push("/");
  } catch (error) {
    showError(error?.message || t("otp.invalid"));
  }
});

</script>

<template>
  <app-layout>
    <main class="relative py-32 px-6">
      <div
        class="card px-6 py-8 mx-auto max-w-[400px] shadow-lg border border-gray-200 rounded-lg"
      >
        <h2 class="text-center text-xl font-semibold mb-6">
          {{ $t("otp.enter_code") }}
        </h2>

        <!-- OTP input -->
        <IconField class="mb-4">
          <InputIcon size="large" class="pi pi-shield" />
          <InputText
            v-model="otp"
            class="w-full !border-gray-300"
            size="large"
            type="text"
            :placeholder="$t('otp.code_placeholder')"
          />
        </IconField>
        <p v-if="otpError" class="text-red-500 text-sm mt-1">{{ otpError }}</p>

        <!-- Verify button -->
        <Button
          class="!block w-full !rounded-md !bg-[var(--primary-clr)] !border-[var(--primary-clr)]"
          size="large"
          @click="onSubmit"
          :disabled="isSubmitting"
        >
          <i v-if="isSubmitting" class="pi pi-spinner pi-spin me-2"></i>
          <i v-else class="pi pi-check-circle me-2"></i>
          {{ isSubmitting ? $t("otp.verifying") : $t("otp.verify") }}
        </Button>
      </div>
    </main>
  </app-layout>
</template>
