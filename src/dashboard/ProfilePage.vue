<script setup>
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "../store/auth";
import { useGeneralStore } from "../store/general";
import requestService from "../services/api/requestService";
import { showError, showSuccess } from "../utils/notifications";
import person from "../assets/person.png";
import DashboardLayout from "../Layout/DashboardLayout.vue";
import { InputText, FloatLabel, Select, Button, Avatar } from "primevue";

const { t, locale } = useI18n();
const authStore = useAuthStore();
const generalStore = useGeneralStore();

const name = ref("");
const email = ref("");
const phone = ref("");
const originalPhone = ref("");
const originalName = ref("");
const editingAccount = ref(false);
const editingProfile = ref(false);
const nameError = ref("");
const phoneError = ref("");

const languages = ref([
  { name: "اللغة العربية", code: "ar" },
  { name: "English", code: "en" },
]);

const selectedLang = ref(
  languages.value.find((x) => x.code === generalStore?.lang) ||
    languages.value[0]
);

// New computed flags
const needsGoogleLink = computed(() => !authStore.user?.email);
const needsPhoneAdd = computed(() => !authStore.user?.phone);

const savingProfile = ref(false);
const savingAccount = ref(false);
const linkingGoogle = ref(false);

const formatPhone = (value) => {
  const cleaned = value.replace(/\D/g, "").slice(0, 10);
  const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
  if (match) return [match[1], match[2], match[3]].filter(Boolean).join("-");
  return cleaned;
};

const validateName = (value) => {
  if (!value.trim()) return t("dashboard.profile.name-required");
  if (value.length < 2) return t("dashboard.profile.name-too-short");
  return "";
};

const validatePhone = (value) => {
  const cleaned = value.replace(/\D/g, "");
  if (!cleaned) return t("dashboard.profile.phone-required");
  if (cleaned.length < 8) return t("dashboard.profile.invalid-phone");
  return "";
};

const toggleLang = () => {
  if (selectedLang.value?.code) {
    generalStore.toggleLang(locale, selectedLang.value.code);
  }
};

onMounted(async () => {
  try {
    if (!authStore.user) await authStore.fetchUser();
    const user = authStore.user || {};
    name.value = user.name || "";
    originalName.value = user.name || "";
    email.value = user.email || "";
    phone.value = formatPhone(user.phone || "");
    originalPhone.value = phone.value;
  } catch {
    showError(t("dashboard.profile.load-error"));
  }
});

const saveProfileInfo = async () => {
  const error = validateName(name.value);
  if (error) {
    nameError.value = error;
    return;
  }
  savingProfile.value = true;
  try {
    await requestService.update("auth/update", authStore.user?.id, {
      name: name.value.trim(),
    });
    await authStore.fetchUser();
    showSuccess(t("dashboard.profile.profile-updated"));
    originalName.value = name.value;
    editingProfile.value = false;
    nameError.value = "";
  } catch (err) {
    showError(
      err?.response?.data?.message || t("dashboard.profile.update-error")
    );
  } finally {
    savingProfile.value = false;
  }
};

const saveAccountSettings = async () => {
  const error = validatePhone(phone.value);
  if (error) {
    phoneError.value = error;
    return;
  }
  savingAccount.value = true;
  try {
    await requestService.update("auth/update", authStore.user?.id, {
      phone: phone.value.replace(/\D/g, ""),
    });
    await authStore.fetchUser();
    showSuccess(t("dashboard.profile.account-updated"));
    originalPhone.value = phone.value;
    editingAccount.value = false;
    phoneError.value = "";
  } catch (err) {
    showError(
      err?.response?.data?.message || t("dashboard.profile.update-error")
    );
  } finally {
    savingAccount.value = false;
  }
};

const cancelEdit = () => {
  phone.value = originalPhone.value;
  editingAccount.value = false;
  phoneError.value = "";
};

const cancelProfileEdit = () => {
  name.value = originalName.value;
  editingProfile.value = false;
  nameError.value = "";
};

const linkWithGoogle = async () => {
  window.location.href = `${BASE_URL}/auth/link/google`;
};

const handlePhoneInput = (event) => {
  phone.value = formatPhone(event.target.value);
  phoneError.value = validatePhone(phone.value);
};

const handleNameInput = () => {
  nameError.value = validateName(name.value);
};
</script>

<template>
  <dashboard-layout>
    <main class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-5xl mx-auto space-y-8">
        <!-- Profile Header -->
        <div
          class="bg-white rounded-2xl shadow-lg p-6 text-center flex flex-col items-center animate-fadeIn hover:shadow-xl transition-shadow"
        >
          <Avatar
            :image="person"
            size="xlarge"
            class="w-32 h-32 mb-4 shadow-md ring-4 ring-blue-100"
            shape="circle"
          />
          <h2 class="text-2xl font-semibold text-gray-800">
            {{ name || t("dashboard.profile.no-name") }}
          </h2>
          <div class="mt-2 flex flex-wrap justify-center gap-2">
            <!-- Email Verified -->
            <span
              v-if="email"
              class="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-4 h-4 mr-1"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                />
              </svg>
              {{ t("dashboard.profile.email-verified") }}
            </span>

            <!-- No Email -->
            <span
              v-else
              class="flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-4 h-4 mr-1"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                />
              </svg>
              {{ t("dashboard.profile.no-email") }}
            </span>

            <!-- Phone -->
            <span
              v-if="phone"
              class="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-4 h-4 mr-1"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                />
              </svg>
              {{ phone }}
            </span>

            <!-- No Phone -->
            <span
              v-else
              class="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-4 h-4 mr-1"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                />
              </svg>
              {{ t("dashboard.profile.no-phone") }}
            </span>
          </div>
        </div>

        <!-- Alerts for Missing Info -->
        <div
          v-if="needsGoogleLink"
          class="bg-red-50 border border-red-200 rounded-2xl p-6 animate-fadeIn flex items-center justify-between hover:bg-red-100 transition-colors"
        >
          <div>
            <h3 class="text-lg font-semibold text-red-800">
              {{ t("dashboard.profile.missing-email") }}
            </h3>
            <p class="text-sm text-red-600">
              {{ t("dashboard.profile.link-google-desc") }}
            </p>
          </div>
          <Button
            class="rounded-xl bg-red-500 hover:bg-red-600 text-white"
            icon="pi pi-google"
            :label="t('dashboard.profile.link-google')"
            @click="linkWithGoogle"
            :loading="linkingGoogle"
          />
        </div>

        <div
          v-if="needsPhoneAdd"
          class="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 animate-fadeIn hover:bg-yellow-100 transition-colors"
        >
          <h3 class="text-lg font-semibold text-yellow-800 mb-3">
            {{ t("dashboard.profile.add-phone") }}
          </h3>
          <FloatLabel class="w-full mb-4">
            <InputText
              v-model="phone"
              type="tel"
              placeholder="05X-XXX-XXXX"
              class="w-full rounded-lg border-gray-300 focus:ring-yellow-500 focus:border-yellow-500"
              :class="{ 'border-red-500': phoneError }"
              @input="handlePhoneInput"
            />
            <label>{{ t("dashboard.profile.phone") }}</label>
            <small v-if="phoneError" class="text-red-500">{{
              phoneError
            }}</small>
          </FloatLabel>
          <Button
            class="w-full rounded-xl bg-green-600 hover:bg-green-700 text-white"
            icon="pi pi-check"
            :disabled="!!phoneError"
            @click="saveAccountSettings"
            :loading="savingAccount"
            >{{ t("dashboard.profile.add-phone") }}</Button
          >
        </div>

        <!-- Info Sections in 2 Columns -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Account Info -->
          <div
            class="bg-white rounded-2xl shadow-lg p-6 animate-fadeIn hover:shadow-xl transition-shadow"
          >
            <h2 class="text-xl font-semibold mb-6 text-gray-800">
              {{ t("dashboard.profile.account-settings") }}
            </h2>

            <!-- Email Display -->
            <FloatLabel class="w-full mb-6">
              <InputText
                v-model="email"
                type="email"
                readonly
                disabled
                class="w-full rounded-lg border-gray-300 disabled:bg-gray-100"
              />
              <label>{{ t("dashboard.profile.email") }}</label>
            </FloatLabel>

            <!-- Phone Edit if exists -->
            <div v-if="!needsPhoneAdd">
              <FloatLabel class="w-full mb-4">
                <InputText
                  v-model="phone"
                  type="tel"
                  placeholder="05X-XXX-XXXX"
                  class="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-500': phoneError }"
                  :disabled="!editingAccount"
                  @input="handlePhoneInput"
                />
                <label>{{ t("dashboard.profile.phone") }}</label>
                <small v-if="phoneError" class="text-red-500">{{
                  phoneError
                }}</small>
              </FloatLabel>

              <div v-if="!editingAccount" class="flex justify-center">
                <Button
                  class="w-full max-w-xs rounded-xl bg-blue-500 hover:bg-blue-600 text-white"
                  icon="pi pi-pencil"
                  :label="t('dashboard.profile.edit-account')"
                  @click="editingAccount = true"
                />
              </div>

              <div v-else class="grid grid-cols-2 gap-3">
                <Button
                  class="rounded-xl bg-green-600 hover:bg-green-700 text-white"
                  icon="pi pi-check"
                  :disabled="!!phoneError"
                  @click="saveAccountSettings"
                  :loading="savingAccount"
                  >{{ t("dashboard.profile.save-account") }}</Button
                >
                <Button
                  class="rounded-xl bg-gray-400 hover:bg-gray-500 text-white"
                  icon="pi pi-times"
                  @click="cancelEdit"
                  >{{ t("generic.cancel") }}</Button
                >
              </div>
            </div>
          </div>

          <!-- Profile Info -->
          <div
            class="bg-white rounded-2xl shadow-lg p-6 animate-fadeIn hover:shadow-xl transition-shadow"
          >
            <h2 class="text-xl font-semibold mb-6 text-gray-800">
              {{ t("dashboard.profile.profile-info") }}
            </h2>

            <FloatLabel class="w-full mb-4">
              <InputText
                v-model="name"
                type="text"
                class="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'border-red-500': nameError }"
                :disabled="!editingProfile"
                @input="handleNameInput"
              />
              <label>{{ t("dashboard.profile.name") }}</label>
              <small v-if="nameError" class="text-red-500">{{
                nameError
              }}</small>
            </FloatLabel>

            <div v-if="!editingProfile" class="flex justify-center">
              <Button
                class="w-full max-w-xs rounded-xl bg-blue-500 hover:bg-blue-600 text-white"
                icon="pi pi-pencil"
                :label="t('dashboard.profile.edit-profile')"
                @click="editingProfile = true"
              />
            </div>

            <div v-else class="grid grid-cols-2 gap-3">
              <Button
                class="rounded-xl bg-green-600 hover:bg-green-700 text-white"
                icon="pi pi-check"
                :disabled="!!nameError"
                @click="saveProfileInfo"
                :loading="savingProfile"
                >{{ t("dashboard.profile.save-profile") }}</Button
              >
              <Button
                class="rounded-xl bg-gray-400 hover:bg-gray-500 text-white"
                icon="pi pi-times"
                @click="cancelProfileEdit"
                >{{ t("generic.cancel") }}</Button
              >
            </div>
          </div>
        </div>

        <!-- Language Selector -->
        <div
          class="bg-white rounded-2xl shadow-lg p-6 animate-fadeIn hover:shadow-xl transition-shadow"
        >
          <h2 class="text-xl font-semibold mb-6 text-gray-800">
            {{ t("register.platform-language") }}
          </h2>
          <FloatLabel class="w-full">
            <Select
              v-model="selectedLang"
              :options="languages"
              class="w-full rounded-lg border-gray-300 bg-white"
              optionLabel="name"
              @change="toggleLang"
            >
              <template #dropdownicon>
                <i class="pi pi-language text-gray-500" />
              </template>
            </Select>
            <label>{{ t("register.platform-language") }}</label>
          </FloatLabel>
        </div>
      </div>
    </main>
  </dashboard-layout>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.4s ease-out;
}
button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
