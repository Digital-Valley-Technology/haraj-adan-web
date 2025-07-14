<script setup>
import { useRouter, useRoute } from "vue-router";
import AppLayout from "../Layout/AppLayout.vue";
import { useCustomToast } from "../composables/toast";
import { useAuthStore } from "../store/auth";
import requestService from "../services/api/requestService";
import { useI18n } from "vue-i18n";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import { ref } from "vue";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const { showError, showSuccess } = useCustomToast();
const authStore = useAuthStore();

// Define schema using Yup with i18n messages
const schema = yup.object({
  email: yup.string().email(t("validation.email.invalid")).required(t("validation.email.required")),
  password: yup.string().required(t("validation.password.required")),
});

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: schema,
});

const { value: email, errorMessage: emailError } = useField("email");
const { value: password, errorMessage: passwordError } = useField("password");

const onSubmit = handleSubmit(async (values) => {
  try {
    const response = await requestService.create("auth/signin", {...values, source: "web"});
    localStorage.setItem("token", response?.access_token);

    showSuccess(response?.message || t("register.login_success"));
    authStore.user = response?.data;
    authStore.isAuthenticated = true;

    const redirectTo = route.query.redirect || "/";
    router.push(redirectTo);
  } catch (error) {
    showError(error?.message || t("register.login_failed"));
  }
});
</script>

<template>
  <app-layout>
    <main class="relative py-32 px-6">
      <div
        class="card px-6 py-8 mx-auto max-w-[600px] shadow-lg border border-gray-200 rounded-lg"
      >
        <!-- email -->
        <IconField class="mb-4">
          <InputIcon size="large" class="pi pi-envelope" />
          <InputText
            v-model="email"
            class="w-full !border-gray-300"
            size="large"
            type="email"
            :placeholder="$t('register.email')"
          />
        </IconField>
        <p v-if="emailError" class="text-red-500 text-sm mt-1">{{ emailError }}</p>

        <!-- password -->
        <IconField class="mb-4">
          <InputIcon size="large" class="pi pi-lock" />
          <InputText
            v-model="password"
            class="w-full !border-gray-300"
            size="large"
            type="password"
            :placeholder="$t('register.password')"
          />
        </IconField>
        <p v-if="passwordError" class="text-red-500 text-sm mt-1">{{ passwordError }}</p>

        <!-- login button -->
        <Button
          type="button"
          class="!block w-full !rounded-md mb-4 !bg-[var(--primary-clr)] !border-[var(--primary-clr)]"
          size="large"
          @click="onSubmit"
          :disabled="isSubmitting"
        >
          <i v-if="isSubmitting" class="pi pi-spinner pi-spin me-2"></i>
          <i v-else class="pi pi-sign-in me-2"></i>
          <span>
            {{
              isSubmitting ? $t("register.logging_in") : $t("register.login")
            }}
          </span>
        </Button>

        <!-- register link -->
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
