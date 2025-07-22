<script setup>
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "../store/auth";
import { useGeneralStore } from "../store/general";
import requestService from "../services/api/requestService";
import { showError, showSuccess } from "../utils/notifications";
import person from "../assets/person.png";
import { InputText, FloatLabel, Select, Button, Avatar } from "primevue";
import AppLayout from "../Layout/AppLayout.vue";
import { BASE_URL } from "../services/axios";

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

const isGoogleLinked = computed(
  () => authStore.user?.provider === "google" || authStore.user?.googleId
);

const savingProfile = ref(false);
const savingAccount = ref(false);
const linkingGoogle = ref(false);

const formatPhone = (value) => {
  // Remove non-digits and limit to 10 digits
  const cleaned = value.replace(/\D/g, "").slice(0, 10);
  const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
  if (match) {
    return [match[1], match[2], match[3]].filter(Boolean).join("-");
  }
  return cleaned;
};

const validateName = (value) => {
  if (!value.trim()) {
    return t("dashboard.profile.name-required");
  }
  if (value.length < 2) {
    return t("dashboard.profile.name-too-short");
  }
  return "";
};

const validatePhone = (value) => {
  const cleaned = value.replace(/\D/g, "");
  if (!cleaned) {
    return t("dashboard.profile.phone-required");
  }
  if (cleaned.length < 8) {
    return t("dashboard.profile.invalid-phone");
  }
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
  } catch (err) {
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
  window.location.href = `${BASE_URL}/auth/google`;
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
  <app-layout>
    <main class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto space-y-8">
        <!-- Avatar Section -->
        <div
          class="bg-white rounded-2xl shadow-lg p-6 text-center transform transition-all hover:scale-[1.01]"
        >
          <Avatar
            :image="person"
            size="xlarge"
            class="w-32 h-32 mb-4 shadow-md mx-auto ring-4 ring-blue-100"
            shape="circle"
            alt="User avatar"
          />
          <h2 class="text-xl font-semibold text-gray-800">
            {{ name || t("dashboard.profile.no-name") }}
          </h2>
          <p class="text-gray-500 text-sm mt-1">
            {{ authStore.user?.email || t("dashboard.profile.no-email") }}
          </p>
        </div>

        <!-- Account Settings -->
        <div
          class="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300"
        >
          <h2 class="text-xl font-semibold mb-6 text-gray-800">
            {{ t("dashboard.profile.account-settings") }}
          </h2>

          <div class="space-y-6">
            <FloatLabel class="w-full" v-if="email">
              <InputText
                id="email"
                v-model="email"
                type="email"
                readonly
                disabled
                class="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                aria-describedby="email-help"
              />
              <label for="email" class="font-medium">{{
                t("dashboard.profile.email")
              }}</label>
              <small id="email-help" class="text-gray-500">{{
                t("dashboard.profile.email-readonly")
              }}</small>
            </FloatLabel>

            <FloatLabel class="w-full">
              <InputText
                id="phone"
                v-model="phone"
                type="tel"
                placeholder="05X-XXX-XXXX"
                class="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'border-red-500': phoneError }"
                :disabled="!editingAccount"
                @input="handlePhoneInput"
                aria-describedby="phone-error"
              />
              <label for="phone" class="font-medium">{{
                t("dashboard.profile.phone")
              }}</label>
              <small v-if="phoneError" id="phone-error" class="text-red-500">{{
                phoneError
              }}</small>
            </FloatLabel>

            <FloatLabel class="w-full">
              <Select
                id="platform-language"
                v-model="selectedLang"
                :options="languages"
                class="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white"
                optionLabel="name"
                @change="toggleLang"
                aria-describedby="language-help"
              >
                <template #dropdownicon>
                  <i class="pi pi-language text-gray-500" />
                </template>
              </Select>
              <label for="platform-language" class="font-medium">{{
                t("register.platform-language")
              }}</label>
              <small id="language-help" class="text-gray-500">{{
                t("dashboard.profile.language-help")
              }}</small>
            </FloatLabel>

            <div class="space-y-4">
              <Button
                v-if="!isGoogleLinked"
                class="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
                type="button"
                icon="pi pi-google"
                :label="t('dashboard.profile.link-google')"
                :loading="linkingGoogle"
                :disabled="linkingGoogle"
                @click="linkWithGoogle"
                aria-label="Link Google account"
              />

              <div v-if="!editingAccount" class="flex justify-center">
                <Button
                  class="w-full max-w-xs rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
                  type="button"
                  icon="pi pi-pencil"
                  :label="t('dashboard.profile.edit-account')"
                  @click="editingAccount = true"
                  aria-label="Edit account settings"
                />
              </div>

              <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  class="rounded-xl bg-green-600 hover:bg-green-700 text-white transition-colors duration-200"
                  type="button"
                  icon="pi pi-check"
                  :label="t('dashboard.profile.save-account')"
                  :loading="savingAccount"
                  :disabled="savingAccount || !!phoneError"
                  @click="saveAccountSettings"
                  aria-label="Save account settings"
                />
                <Button
                  class="rounded-xl bg-gray-400 hover:bg-gray-500 text-white transition-colors duration-200"
                  type="button"
                  icon="pi pi-times"
                  :label="t('generic.cancel')"
                  @click="cancelEdit"
                  aria-label="Cancel account edits"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Profile Info -->
        <div
          class="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300"
        >
          <h2 class="text-xl font-semibold mb-6 text-gray-800">
            {{ t("dashboard.profile.profile-info") }}
          </h2>

          <div class="space-y-6">
            <FloatLabel class="w-full">
              <InputText
                id="name"
                v-model="name"
                type="text"
                class="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'border-red-500': nameError }"
                :disabled="!editingProfile"
                @input="handleNameInput"
                aria-describedby="name-error"
              />
              <label for="name" class="font-medium">{{
                t("dashboard.profile.name")
              }}</label>
              <small v-if="nameError" id="name-error" class="text-red-500">{{
                nameError
              }}</small>
            </FloatLabel>

            <div v-if="!editingProfile" class="flex justify-center">
              <Button
                class="w-full max-w-xs rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
                type="button"
                icon="pi pi-pencil"
                :label="t('dashboard.profile.edit-profile')"
                @click="editingProfile = true"
                aria-label="Edit profile information"
              />
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                class="rounded-xl bg-green-600 hover:bg-green-700 text-white transition-colors duration-200"
                type="button"
                icon="pi pi-check"
                :label="t('dashboard.profile.save-profile')"
                :loading="savingProfile"
                :disabled="savingProfile || !!nameError"
                @click="saveProfileInfo"
                aria-label="Save profile information"
              />
              <Button
                class="rounded-xl bg-gray-400 hover:bg-gray-500 text-white transition-colors duration-200"
                type="button"
                icon="pi pi-times"
                :label="t('generic.cancel')"
                @click="cancelProfileEdit"
                aria-label="Cancel profile edits"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  </app-layout>
</template>

<style scoped>
main {
  min-height: calc(100vh - var(--padding-app-layout-top));
}

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

.card {
  animation: fadeIn 0.5s ease-out;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
