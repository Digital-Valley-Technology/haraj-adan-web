<script setup>
import { useRouter } from "vue-router";
import AppLayout from "../Layout/AppLayout.vue";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import { useI18n } from "vue-i18n";
import requestService from "../services/api/requestService";
import { useCustomToast } from "../composables/toast";
import { BASE_URL } from "../services/axios";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { VueTelInput } from "vue-tel-input";
import "vue-tel-input/vue-tel-input.css";
import { computed } from "vue";

const { t, locale } = useI18n();

const router = useRouter();
const { showError, showSuccess } = useCustomToast();

// RTL / LTR direction
const currentLocale = computed(() => locale || "ar");

// Custom phone validator
const phoneValidator = (value) => {
  if (!value) return true; // allow empty (optional)
  try {
    const phoneNumber = parsePhoneNumberFromString(value);
    return phoneNumber?.isValid() || false;
  } catch {
    return false;
  }
};

// Validation schema
const schema = yup.object({
  name: yup.string().required(t("validation.name.required")),
  phone: yup
    .string()
    .test("is-valid-phone", t("validation.phone.invalid"), phoneValidator),
  email: yup.string().email(t("validation.email.invalid")).nullable(),
});

// vee-validate form
const { handleSubmit, isSubmitting } = useForm({
  validationSchema: schema,
  validateOnMount: false,
  validateOnBlur: true,
  validateOnChange: false,
  validateOnInput: false,
});

// Fields
const { value: name, errorMessage: nameError } = useField("name");
const { value: phone, errorMessage: phoneError } = useField("phone");
const { value: email, errorMessage: emailError } = useField("email");

// Submit
const onSubmit = handleSubmit(async (values) => {
  try {
    if (!values.phone && !values.email) {
      showError(t("validation.contact_required"));
      return;
    }

    let payload = { name: values.name };
    if (values.phone) {
      const parsed = parsePhoneNumberFromString(values.phone);
      if (!parsed?.isValid()) throw new Error(t("validation.phone.invalid"));
      payload.phone = parsed.number; // normalized
    }
    if (values.email) {
      payload.email = values.email.trim().toLowerCase();
    }

    const response = await requestService.create("auth/register", payload);

    showSuccess(response?.status?.message || t("otp.sent_successfully"));

    router.push({
      path: "/verify-otp",
      query: {
        phone: response.data.phone || undefined,
        email: response.data.email || undefined,
      },
    });
  } catch (error) {
    showError(error || t("otp.send_failed"));
  }
});

// Google registration
const registerWithGoogle = () => {
  window.location.href = `${BASE_URL}/auth/google`;
};
</script>

<template>
  <app-layout>
    <main class="relative py-20 px-6">
      <div class="mx-auto max-w-[400px]">
        <!-- Title -->
        <h1 class="text-2xl font-semibold text-center mb-8">
          {{ $t("register.register") }}
        </h1>

        <!-- Name -->
        <label class="block mb-1 font-medium text-sm">
          {{ $t("register.name") }}
        </label>
        <input
          v-model="name"
          type="text"
          class="w-full border rounded-lg px-4 py-2 mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="nameError ? 'border-red-500' : 'border-gray-300'"
          :placeholder="$t('register.name')"
        />
        <p v-if="nameError" class="text-red-500 text-xs mb-3">
          {{ nameError }}
        </p>

        <!-- Phone -->
        <label class="block mb-1 font-medium text-sm">
          {{ $t("register.phone") }}
        </label>
        <VueTelInput
          v-model="phone"
          :dir="currentLocale === 'ar' ? 'rtl' : 'ltr'"
          mode="international"
          :autoDefaultCountry="true"
          :inputOptions="{
            placeholder: $t('register.phone'),
            autocomplete: 'tel',
          }"
          :class="[
            'w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-1',
            phoneError ? 'border-red-500' : 'border-gray-300',
          ]"
        />
        <p v-if="phoneError" class="text-red-500 text-xs mb-3">
          {{ phoneError }}
        </p>

        <!-- Email -->
        <label class="block mb-1 font-medium text-sm">
          {{ $t("register.email") }}
        </label>
        <input
          v-model="email"
          type="email"
          class="w-full border rounded-lg px-4 py-2 mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="emailError ? 'border-red-500' : 'border-gray-300'"
          :placeholder="$t('register.email')"
        />
        <p v-if="emailError" class="text-red-500 text-xs">
          {{ emailError }}
        </p>

        <!-- Register Button -->
        <button
          type="button"
          @click="onSubmit"
          :disabled="isSubmitting"
          class="w-full mt-3 bg-yellow-300 text-gray-800 font-medium py-3 rounded-lg mb-6 disabled:opacity-50"
        >
          <span v-if="isSubmitting">{{ $t("register.registering") }}...</span>
          <span v-else>{{ $t("register.register") }}</span>
        </button>

        <!-- Login link -->
        <p class="text-center text-sm mb-4">
          {{ $t("register.has-account") }}
          <RouterLink to="/login" class="text-blue-600">
            {{ $t("register.login") }}
          </RouterLink>
        </p>

        <!-- Divider -->
        <div class="flex items-center my-4">
          <hr class="flex-grow border-gray-300" />
          <span class="px-2 text-gray-400 text-sm">{{ $t("generic.or") }}</span>
          <hr class="flex-grow border-gray-300" />
        </div>

        <!-- Google Register -->
        <button
          type="button"
          @click="registerWithGoogle"
          class="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            class="w-5 h-5"
          />
          <span class="text-sm font-medium text-gray-700">
            {{ $t("register.register_with_google") }}
          </span>
        </button>
      </div>
    </main>
  </app-layout>
</template>

<style scoped>
.vue-tel-input input {
  width: 100%;
}
</style>
