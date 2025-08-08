<script setup>
import { useRouter } from "vue-router";
import AppLayout from "../Layout/AppLayout.vue";
import { useCustomToast } from "../composables/toast";
import requestService from "../services/api/requestService";
import { useI18n } from "vue-i18n";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import { BASE_URL } from "../services/axios";

const { t } = useI18n();
const router = useRouter();
const { showError, showSuccess } = useCustomToast();

// Validation schema
const schema = yup.object({
  phone: yup
    .string()
    .matches(/^[0-9]{8,15}$/, t("validation.phone.invalid"))
    .required(t("validation.phone.required")),
});

const { handleSubmit, isSubmitting } = useForm({ validationSchema: schema });
const { value: phone, errorMessage: phoneError } = useField("phone");

const onSubmit = handleSubmit(async (values) => {
  try {
    const response = await requestService.create("auth/otp-request", values);
    showSuccess(response?.status?.message || t("otp.sent_successfully"));
    router.push({ path: "/verify-otp", query: { phone: response.data.phone } });
  } catch (error) {
    showError(error || t("otp.send_failed"));
  }
});

const loginWithGoogle = () => {
  window.location.href = `${BASE_URL}/auth/google`;
};
</script>

<template>
  <app-layout>
    <main class="relative py-20 px-6">
      <div class="mx-auto max-w-[400px]">
        <!-- Title -->
        <h1 class="text-2xl font-semibold text-center mb-8">
          {{ $t("login.login") }}
        </h1>

        <!-- Phone Input -->
        <label class="block mb-1 font-medium text-sm">
          {{ $t("register.phone") }}
        </label>
        <input
          v-model="phone"
          type="text"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          :placeholder="$t('register.phone')"
        />
        <p v-if="phoneError" class="text-red-500 text-xs mb-3">
          {{ phoneError }}
        </p>

        <!-- Login Button -->
        <button
          type="button"
          @click="onSubmit"
          :disabled="isSubmitting"
          class="w-full bg-yellow-300 text-gray-800 font-medium py-3 rounded-lg mb-6 disabled:opacity-50"
        >
          <span v-if="isSubmitting">{{ $t("otp.sending") }}...</span>
          <span v-else>{{ $t("otp.send_code") }}</span>
        </button>

        <!-- Register link -->
        <p class="text-center text-sm mb-4">
          {{ $t("register.no-account") }}
          <RouterLink to="/register" class="text-blue-600">
            {{ $t("register.register-account") }}
          </RouterLink>
        </p>

        <!-- Divider -->
        <div class="flex items-center my-4">
          <hr class="flex-grow border-gray-300" />
          <span class="px-2 text-gray-400 text-sm">{{ $t("generic.or") }}</span>
          <hr class="flex-grow border-gray-300" />
        </div>

        <!-- Google Login -->
        <button
          type="button"
          @click="loginWithGoogle"
          class="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            class="w-5 h-5"
          />
          <span class="text-sm font-medium text-gray-700">
            {{ $t("login.login_with_google") }}
          </span>
        </button>
      </div>
    </main>
  </app-layout>
</template>
