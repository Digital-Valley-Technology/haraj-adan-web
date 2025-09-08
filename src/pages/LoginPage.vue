<script setup>
import { useRouter } from "vue-router";
import AppLayout from "../Layout/AppLayout.vue";
import { useCustomToast } from "../composables/toast";
import requestService from "../services/api/requestService";
import { useI18n } from "vue-i18n";
import { computed, ref, watch } from "vue";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import { BASE_URL } from "../services/axios";
import { parsePhoneNumberFromString } from "libphonenumber-js";

// VueTelInput import for Vue 3
import { VueTelInput } from "vue-tel-input";
import "vue-tel-input/vue-tel-input.css";

const { t, locale } = useI18n();
const router = useRouter();
const { showError, showSuccess } = useCustomToast();

const currentLocale = computed(() => locale || "ar");

const loginMethod = ref("email"); // default login method

// Phone validator with libphonenumber-js
const phoneValidator = (value) => {
  if (!value) return true;
  try {
    const phoneNumber = parsePhoneNumberFromString(value);
    return phoneNumber?.isValid() || false;
  } catch {
    return false;
  }
};

// Validation schema
const schema = yup.object({
  phone: yup.string().when([], {
    is: () => loginMethod.value === "phone",
    then: (s) =>
      s
        .required(t("validation.phone.required")) // required handled here
        .test("is-valid-phone", t("validation.phone.invalid"), phoneValidator),
    otherwise: (s) => s.strip(),
  }),
  email: yup.string().when([], {
    is: () => loginMethod.value === "email",
    then: (s) =>
      s
        .required(t("validation.email.required"))
        .email(t("validation.email.invalid")),
    otherwise: (s) => s.strip(),
  }),
});

// Configure vee-validate behavior
const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: schema,
  validateOnMount: false,
  validateOnBlur: true,
  validateOnChange: false,
  validateOnInput: false,
});

// Fields
const { value: phone, errorMessage: phoneError } = useField("phone");
const { value: email, errorMessage: emailError } = useField("email");

// Reset form when switching method
watch(loginMethod, () => {
  resetForm({ values: { phone: "", email: "" } });
});

// Submit
const onSubmit = handleSubmit(async (values) => {
  try {
    let payload;
    if (loginMethod.value === "phone") {
      const parsed = parsePhoneNumberFromString(values.phone);
      if (!parsed?.isValid()) throw new Error(t("validation.phone.invalid"));
      payload = { phone: parsed.number }; // send in E.164 format
    } else {
      payload = { email: values.email };
    }

    const response = await requestService.create("auth/login", payload);

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

// Google login
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

        <!-- Toggle Buttons -->
        <div class="flex justify-center mb-6 gap-4">
          <button
            type="button"
            @click="loginMethod = 'email'"
            :class="[
              'px-4 py-2 rounded-md border',
              loginMethod === 'email'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300',
            ]"
          >
            {{ $t("register.email") }}
          </button>
          <button
            type="button"
            @click="loginMethod = 'phone'"
            :class="[
              'px-4 py-2 rounded-md border',
              loginMethod === 'phone'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300',
            ]"
          >
            {{ $t("register.phone") }}
          </button>
        </div>

        <!-- Phone Input -->
        <div v-if="loginMethod === 'phone'" class="relative">
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
        </div>

        <!-- Email Input -->
        <div v-else>
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
        </div>

        <!-- Login Button -->
        <button
          type="button"
          @click="onSubmit"
          :disabled="isSubmitting"
          class="w-full mt-3 bg-yellow-300 text-gray-800 font-medium py-3 rounded-lg mb-6 disabled:opacity-50"
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

<style scoped>
.vue-tel-input input {
  width: 100%;
}
</style>
