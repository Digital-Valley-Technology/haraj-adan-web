<script setup>
import { useRouter } from "vue-router";
import AppLayout from "../Layout/AppLayout.vue";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import { useI18n } from "vue-i18n";
import requestService from "../services/api/requestService";
import { showError, showSuccess } from "../utils/notifications";
import { BASE_URL } from "../services/axios";

const { t } = useI18n();
const router = useRouter();

// Form schema
const schema = yup.object({
  name: yup.string().when("identifier", {
    is: (val) => !!val,
    then: (schema) => schema.required(t("validation.name.required")),
    otherwise: (schema) => schema,
  }),
  identifier: yup
    .string()
    .nullable()
    .test("emailOrPhone", t("validation.email_or_phone.required"), (value) => {
      return !!value;
    }),
});

const { handleSubmit, isSubmitting } = useForm({ validationSchema: schema });

const { value: name, errorMessage: nameError } = useField("name");
const { value: identifier, errorMessage: identifierError } =
  useField("identifier");

// Submit handler
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

const registerWithGoogle = () => {
  window.location.href = `${BASE_URL}/auth/google`;
};
</script>

<template>
  <app-layout>
    <main class="relative py-32 px-6">
      <div
        class="card px-6 py-8 mx-auto max-w-[600px] shadow-lg border border-gray-200 rounded-lg"
      >
        <!-- Google register -->
        <Button
          class="!block w-full !rounded-md mb-6 !bg-red-500 !border-red-500 text-white"
          size="large"
          @click="registerWithGoogle"
        >
          <i class="pi pi-google me-2"></i>
          {{ $t("register.register_with_google") }}
        </Button>

        <!-- Name -->
        <IconField class="mb-4">
          <InputIcon size="large" class="pi pi-user" />
          <InputText
            v-model="name"
            class="w-full !border-gray-300"
            size="large"
            type="text"
            :placeholder="$t('register.name')"
          />
        </IconField>
        <p v-if="nameError" class="text-red-500 text-sm mt-1">
          {{ nameError }}
        </p>

        <!-- Email or Phone -->
        <IconField class="mb-4">
          <InputIcon size="large" class="pi pi-envelope" />
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

        <!-- Register button -->
        <Button
          type="button"
          class="!block w-full !rounded-md mb-4 !bg-[var(--primary-clr)] !border-[var(--primary-clr)]"
          size="large"
          @click="onSubmit"
          :disabled="isSubmitting"
        >
          <i v-if="isSubmitting" class="pi pi-spinner pi-spin me-2"></i>
          <i v-else class="pi pi-user-plus me-2"></i>
          {{
            isSubmitting ? $t("register.registering") : $t("register.register")
          }}
        </Button>

        <!-- Login link -->
        <p class="text-center text-sm">
          <span class="inline-block me-2">{{
            $t("register.has-account")
          }}</span>
          <RouterLink to="/login" class="text-[#596e60]">
            {{ $t("register.login") }}
          </RouterLink>
        </p>
      </div>
    </main>
  </app-layout>
</template>
