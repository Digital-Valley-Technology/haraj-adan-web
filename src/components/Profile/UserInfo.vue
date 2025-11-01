<script setup>
import { ref, watch, computed } from "vue";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import { useI18n } from "vue-i18n";
import requestService from "../../services/api/requestService";
import { showError, showSuccess } from "../../utils/notifications";
import { parsePhoneNumberFromString } from "libphonenumber-js";

// VueTelInput imports
import { VueTelInput } from "vue-tel-input";
import "vue-tel-input/vue-tel-input.css"; // Assuming CSS import is handled in the project or via a style block
import { useAuthStore } from "../../store/auth";

const { locale } = useI18n();

const currentLocale = computed(() => locale || "ar");

const authStore = useAuthStore();
// Define Props
const props = defineProps({
  // Initial user data to populate the form, passed from Pinia in the parent
  initialUser: {
    type: Object,
    default: () => ({
      name: "User Name",
      phone: "",
      email: "user@example.com",
    }),
  },
});

// Define Emits (Simplified to only emit for info saving)
const emit = defineEmits(["saveInfo"]);

// --- Custom Local Translation Function ---
const t = (key) => {
  const translations = {
    name_required:
      currentLocale.value === "ar" ? "الاسم مطلوب" : "Name is required",
    email_invalid:
      currentLocale.value === "ar"
        ? "البريد الإلكتروني غير صالح"
        : "Must be a valid email",
    phone_invalid:
      currentLocale.value === "ar"
        ? "رقم الهاتف غير صالح"
        : "Must be a valid phone number",
    contact_required:
      currentLocale.value === "ar"
        ? "يجب تقديم بريد إلكتروني أو رقم هاتف واحد على الأقل"
        : "You must provide either an email or a phone number",
  };
  return translations[key] || key;
};

// --- Phone Validation Logic ---
const phoneValidator = (value) => {
  if (!value) return true;
  try {
    const phoneNumber = parsePhoneNumberFromString(value);
    return phoneNumber?.isValid() || false;
  } catch {
    return false;
  }
};

// --- Form Validation Setup for User Info ---
const schema = computed(() =>
  yup
    .object({
      name: yup.string().required(() => t("name_required")),
      // Nullable phone, transforming empty strings to null for validation
      phone: yup
        .string()
        .nullable()
        .transform((v) => v || null)
        .test("is-valid-phone", () => t("phone_invalid"), phoneValidator),
      // Nullable email with email format check
      email: yup
        .string()
        .nullable()
        .transform((v) => v || null)
        .email(() => t("email_invalid")),
    })
    .test(
      // Custom validation: Must have email OR phone
      "email-or-phone-required",
      () => t("contact_required"),
      (value) => !!value.email || !!value.phone
    )
);

// Configure vee-validate with initial values
const { handleSubmit, isSubmitting, setValues } = useForm({
  validationSchema: schema,
  initialValues: {
    name: props.initialUser.name,
    phone: props.initialUser.phone,
    email: props.initialUser.email,
  },
});

// Watch for changes in the initialUser prop (data coming from Pinia) and reset the form
watch(
  () => props.initialUser,
  (newVal) => {
    if (newVal) {
      setValues({
        name: newVal.name || "",
        phone: newVal.phone || "",
        email: newVal.email || "",
      });
    }
  },
  { immediate: true, deep: true }
);

// Fields and Error Messages
const { value: name, errorMessage: nameError } = useField("name");
const { value: phone, errorMessage: phoneError } = useField("phone");
const { value: email, errorMessage: emailError } = useField("email");

// --- Submission Handler ---
const isSaving = ref(false);

const onSubmit = handleSubmit(async (values) => {
  isSaving.value = true;
  const payload = { ...values };

  // Transform phone to E.164 format if provided and valid
  if (payload.phone) {
    const parsed = parsePhoneNumberFromString(payload.phone);
    if (parsed?.isValid()) {
      payload.phone = parsed.number; // E.164 format
    }
    // Note: If it's invalid, the vee-validate schema check should have already blocked this.
  }
  if (!payload.phone && !payload.email) {
    // This case should be blocked by validation, but just in case
    isSaving.value = false;
    showError(t("profile.validation.contact_required"));
    return;
  }
  if (!payload.phone) {
    payload.phone = null; // Ensure empty phone is sent as null
  }
  if (!payload.email) {
    payload.email = null; // Ensure empty email is sent as null
  }

  try {
    // Send the transformed payload
    const res = await requestService.patch("/auth/profile", payload);

    showSuccess(res?.message);

    // Emit event to parent to update Pinia store
    if (res?.data?.id) {
      authStore.user.name = res?.data?.name;
      authStore.user.phone = res?.data?.phone;
      authStore.user.email = res?.data?.email;
    }
  } catch (error) {
    console.log(error);
    showError(error);
  } finally {
    isSaving.value = false;
  }
});
</script>

<template>
  <div
    class="flex flex-col gap-4 bg-white rounded-lg py-4 px-6 shadow-xl border border-gray-100"
  >
    <!-- --- User Information Form --- -->
    <form @submit.prevent="onSubmit">
      <p class="text-sm font-semibold mb-4 text-gray-800">
        <i class="fas fa-user-circle mr-2"></i>
        {{ locale === "ar" ? "معلومات المستخدم" : "User Information" }}
      </p>
      <div class="space-y-4">
        <!-- Name -->
        <div class="flex flex-col">
          <label
            for="name"
            class="mb-1 text-xs font-medium"
            :class="nameError ? 'text-red-500' : 'text-[#030712]'"
          >
            {{ locale === "ar" ? "الاسم" : "Name" }}
          </label>
          <input
            id="name"
            v-model="name"
            type="text"
            :placeholder="locale === 'ar' ? 'اسمك الكامل' : 'Your Full Name'"
            class="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition"
            :class="
              nameError
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            "
          />
          <p v-if="nameError" class="text-red-500 text-xs mt-1">
            {{ nameError }}
          </p>
        </div>

        <!-- Phone - USING VueTelInput -->
        <div class="flex flex-col">
          <label
            for="phone"
            class="mb-1 text-xs font-medium"
            :class="phoneError ? 'text-red-500' : 'text-[#030712]'"
          >
            {{ locale === "ar" ? "رقم الهاتف" : "Phone Number" }}
          </label>
          <VueTelInput
            id="phone"
            v-model="phone"
            mode="international"
            :dir="currentLocale === 'ar' ? 'rtl' : 'ltr'"
            :autoDefaultCountry="true"
            :inputOptions="{
              placeholder:
                locale === 'ar' ? '05xxxxxxxx' : 'e.g., +1 555-555-1212',
              autocomplete: 'tel',
            }"
            class="w-full"
            :class="[
              'w-full transition',
              // Custom class for styling the border based on vee-validate error
              phoneError ? 'vue-tel-input-error' : 'vue-tel-input-default',
            ]"
          />
          <p
            v-if="phoneError && phoneError !== t('contact_required')"
            class="text-red-500 text-xs mt-1"
          >
            {{ phoneError }}
          </p>
        </div>

        <!-- Email -->
        <div class="flex flex-col">
          <label
            for="email"
            class="mb-1 text-xs font-medium"
            :class="emailError ? 'text-red-500' : 'text-[#030712]'"
          >
            {{ locale === "ar" ? "البريد الإلكتروني" : "Email" }}
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            :placeholder="locale === 'ar' ? 'بريدك الإلكتروني' : 'Your Email'"
            class="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition"
            :class="
              emailError
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            "
          />
          <p
            v-if="emailError && emailError !== t('contact_required')"
            class="text-red-500 text-xs mt-1"
          >
            {{ emailError }}
          </p>
        </div>

        <!-- General Error message for the mandatory email-or-phone validation -->
        <div
          v-if="
            phoneError === t('contact_required') ||
            emailError === t('contact_required')
          "
          class="p-2 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md mt-4"
        >
          <p class="text-xs font-medium">
            <i class="fas fa-exclamation-triangle mr-1"></i>
            {{ t("contact_required") }}
          </p>
        </div>
      </div>

      <!-- Save Button with Yellow Color -->
      <button
        type="submit"
        class="w-full bg-[#FFE800] text-black px-4 py-2 rounded-lg hover:bg-[#f5e103] transition mt-6 disabled:opacity-50 flex items-center justify-center font-medium"
        :disabled="isSaving || isSubmitting"
      >
        <i v-if="isSaving" class="fas fa-spinner fa-spin mr-2"></i>
        <span v-if="isSaving">{{
          locale === "ar" ? "جاري الحفظ..." : "Saving..."
        }}</span>
        <span v-else>{{
          locale === "ar" ? "حفظ التغييرات" : "Save Changes"
        }}</span>
      </button>
    </form>
  </div>
</template>

<style scoped>
/* Base styling for the VueTelInput container to match form fields */
.vue-tel-input {
  border-radius: 0.5rem !important; /* rounded-lg */
  transition: all 0.2s;
  padding: 0 !important;
  border: 1px solid #d1d5db !important; /* border-gray-300 */
}

/* Default focus state (focus:ring-blue-500) */
.vue-tel-input:focus-within {
  box-shadow: 0 0 0 2px #3b82f6;
  border-color: #3b82f6 !important;
}

/* Error state (border-red-500) */
.vue-tel-input.vue-tel-input-error {
  border-color: #ef4444 !important;
}
.vue-tel-input.vue-tel-input-error:focus-within {
  box-shadow: 0 0 0 2px #ef4444; /* focus:ring-red-500 */
  border-color: #ef4444 !important;
}

/* Styles for the input element inside VTI to apply padding and remove its inner border */
.vue-tel-input .vti__input {
  border: none !important;
  /* Equivalent to px-3 py-2, but VTI handles the height differently */
  padding-left: 0.75rem !important;
  padding-right: 0.75rem !important;
  padding-top: 0.5rem !important;
  padding-bottom: 0.5rem !important;
  height: auto !important;
  font-size: 1rem; /* Default size */
}

/* Style the dropdown to match the height */
.vue-tel-input .vti__dropdown {
  padding: 0.5rem 0; /* Align height with input padding */
}
</style>
