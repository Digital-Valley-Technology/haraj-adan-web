<script setup>
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import DashboardLayout from "../Layout/DashboardLayout.vue";
import { useAuthStore } from "../store/auth";
import { useGeneralStore } from "../store/general";
import { showSuccess, showError } from "../utils/notifications";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { VueTelInput } from "vue-tel-input";
import requestService from "../services/api/requestService";
import "vue-tel-input/vue-tel-input.css";

const { t, locale } = useI18n();
const authStore = useAuthStore();
const generalStore = useGeneralStore();

const currentLocale = computed(() => locale || "ar");

const getDefaultCountry = (phone) => {
  if (!phone) return "SD"; // fallback to Sudan or your preferred default
  try {
    const parsed = parsePhoneNumberFromString(phone);
    return parsed?.country || "SD";
  } catch {
    return "SD";
  }
};

const languages = ref([
  { name: "اللغة العربية", code: "ar" },
  { name: "English", code: "en" },
]);

const selectedLang = ref(
  languages.value.find((x) => x.code === generalStore?.lang) ||
    languages.value[0]
);

const name = ref("");
const email = ref("");
const phone = ref("");
const provider = ref("local");

const editingField = ref(null);

onMounted(async () => {
  try {
    if (!authStore.user) {
      await authStore.fetchUser();
    }
    const user = authStore.user || {};
    name.value = user.name || "";
    email.value = user.email || "";
    phone.value = user.phone || "";
    provider.value = user.provider || "local";
  } catch {
    showError(t("dashboard.profile.load-error"));
  }
});

const enableEdit = (field) => {
  editingField.value = field;
};

const cancelEdit = () => {
  editingField.value = null;
};

const saveField = async (field) => {
  try {
    let payload = {};

    if (field === "name") {
      if (!name.value.trim()) {
        showError(t("validation.name.required"));
        return;
      }
      payload = { name: name.value.trim() };
    }

    if (field === "email") {
      if (email.value && email.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
          showError(t("validation.email.invalid"));
          return;
        }
        payload = { email: email.value.trim().toLowerCase() };
      } else {
        payload = { email: null };
      }
    }

    if (field === "phone") {
      if (phone.value && phone.value.trim()) {
        const phoneNumber = parsePhoneNumberFromString(phone.value);
        if (!phoneNumber || !phoneNumber.isValid()) {
          showError(t("validation.phone.invalid"));
          return;
        }
        payload = { phone: phoneNumber.number };
      } else {
        payload = { phone: null };
      }
    }

    // Check rule: not both null
    const nextEmail = field === "email" ? payload.email : email.value;
    const nextPhone = field === "phone" ? payload.phone : phone.value;
    if (!nextEmail && !nextPhone) {
      showError(t("validation.email_or_phone_required"));
      return;
    }

    // API call
    const res = await requestService.patch("/auth/profile", payload);

    authStore.user = {
      ...authStore.user,
      ...res.data,
    };

    showSuccess(res?.message || t("dashboard.profile.updated"));
    editingField.value = null;
  } catch (err) {
    showError(
      err ||
        err?.response?.data?.message ||
        err?.response?.data?.message ||
        t("dashboard.profile.update-error")
    );
  }
};

const toggleLang = () => {
  if (selectedLang.value?.code) {
    generalStore.toggleLang(locale, selectedLang.value.code);
  }
};
</script>

<template>
  <dashboard-layout>
    <main
      class="py-[var(--padding-dashboard-section)] px-4 md:px-8 custom-container space-y-8"
    >
      <div
        class="card w-full mx-auto px-4 md:px-8 py-8 shadow-md border border-gray-200 rounded-lg"
      >
        <!-- Title -->
        <h1 class="text-2xl font-bold text-gray-800 mb-6">
          {{ t("sidebar.profile") }}
        </h1>

        <!-- Name -->
        <div>
          <label class="block mb-4 font-medium text-sm text-gray-700">
            {{ t("register.name") }}
          </label>
          <div class="flex items-center gap-3">
            <input
              v-model="name"
              type="text"
              class="flex-1 h-11 border rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 disabled:bg-gray-100"
              :disabled="editingField !== 'name'"
            />
            <div class="flex gap-2">
              <template v-if="editingField === 'name'">
                <button
                  @click="saveField('name')"
                  class="h-11 px-4 bg-yellow-400 text-gray-800 rounded-lg font-medium hover:bg-yellow-300"
                >
                  {{ t("generic.save") }}
                </button>
                <button
                  @click="cancelEdit"
                  class="h-11 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
                >
                  {{ t("generic.cancel") }}
                </button>
              </template>
              <button
                v-else
                @click="enableEdit('name')"
                class="h-11 px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
              >
                {{ t("dashboard.actions.edit") }}
              </button>
            </div>
          </div>
        </div>

        <!-- Phone -->
        <div>
          <label class="block mb-4 font-medium text-sm text-gray-700">
            {{ t("register.phone") }}
          </label>
          <div class="flex items-center gap-3">
            <VueTelInput
              v-model="phone"
              :dir="currentLocale === 'ar' ? 'rtl' : 'ltr'"
              mode="international"
              :defaultCountry="getDefaultCountry(phone)"
              :autoDefaultCountry="false"
              :inputOptions="{
                placeholder: t('register.phone'),
                autocomplete: 'tel',
              }"
              class="flex-1 h-11 vue-tel-input-custom"
              :disabled="editingField !== 'phone'"
            />

            <div class="flex gap-2">
              <template v-if="editingField === 'phone'">
                <button
                  @click="saveField('phone')"
                  class="h-11 px-4 bg-yellow-400 text-gray-800 rounded-lg font-medium hover:bg-yellow-300"
                >
                  {{ t("generic.save") }}
                </button>
                <button
                  @click="cancelEdit"
                  class="h-11 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
                >
                  {{ t("generic.cancel") }}
                </button>
              </template>
              <button
                v-else
                @click="enableEdit('phone')"
                class="h-11 px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
              >
                {{ t("dashboard.actions.edit") }}
              </button>
            </div>
          </div>
        </div>

        <!-- Email -->
        <div>
          <label class="block mb-4 font-medium text-sm text-gray-700">
            {{ t("register.email") }}
          </label>
          <div class="flex items-center gap-3">
            <input
              v-model="email"
              type="email"
              class="flex-1 h-11 border rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 disabled:bg-gray-100"
              :disabled="editingField !== 'email'"
            />
            <div class="flex gap-2">
              <template v-if="editingField === 'email'">
                <button
                  @click="saveField('email')"
                  class="h-11 px-4 bg-yellow-400 text-gray-800 rounded-lg font-medium hover:bg-yellow-300"
                >
                  {{ t("generic.save") }}
                </button>
                <button
                  @click="cancelEdit"
                  class="h-11 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
                >
                  {{ t("generic.cancel") }}
                </button>
              </template>
              <button
                v-else
                @click="enableEdit('email')"
                class="h-11 px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
              >
                {{ t("dashboard.actions.edit") }}
              </button>
            </div>
          </div>
        </div>

        <!-- Language -->
        <div>
          <label class="block mb-4 font-medium text-sm text-gray-700">
            {{ t("register.platform-language") }}
          </label>
          <Select
            v-model="selectedLang"
            :options="languages"
            optionLabel="name"
            class="w-full h-11 rounded-lg border-gray-300"
            @change="toggleLang"
          >
            <template #dropdownicon>
              <i class="pi pi-language text-gray-500" />
            </template>
          </Select>
        </div>
      </div>
    </main>
  </dashboard-layout>
</template>

<style scoped>
.vue-tel-input input {
  width: 100%;
  height: 100% !important;
}
.vue-tel-input-custom input:disabled {
  color: #9ca3af;
  cursor: not-allowed;
  border-color: #d1d5db;
}
.vue-tel-input-custom:has(input:disabled) {
  opacity: 0.7;
  background-color: #f3f4f6;
}
</style>
