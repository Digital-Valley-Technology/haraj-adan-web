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
import ToggleSwitch from "primevue/toggleswitch";

const { t, locale } = useI18n();
const authStore = useAuthStore();
const generalStore = useGeneralStore();
const i18 = useI18n();

const name = ref("");
const email = ref("");
const phone = ref("");
const originalPhone = ref("");
const originalName = ref("");
const editingAccount = ref(false);
const editingProfile = ref(false);
const nameError = ref("");
const phoneError = ref("");
const activeTab = ref("My Account Information");
const permission = ref(false);
const permission2 = ref(false);

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
      <div class="flex gap-4">
        <!-- Profile Category -->
        <div class="w-96 bg-white rounded-lg p-4">
          <!-- Ad -->
          <div class="p-4 mb-4 bg-[#146AAB] rounded-lg text-white">
            <div class="flex items-center gap-2 mb-2">
              <i class="pi pi-megaphone text-yellow-500 text-2xl"></i>
              <p class="text-lg font-bold">
                {{
                  i18.locale.value == "ar"
                    ? "اجعل إعلانك مميزًا"
                    : "MAKE YOUR AD STAND OUT"
                }}
              </p>
            </div>
            <p class="text-xs font-normal uppercase">
              {{
                i18.locale.value == "ar"
                  ? "فيما يلي نص توضيحي حول كيفية صنع"
                  : "here is an explanatory text on how to make the"
              }}
            </p>
            <p class="text-xs font-normal uppercase">
              {{
                i18.locale.value == "ar"
                  ? "فيما يلي نص توضيحي حول كيفية صنع"
                  : "here is an explanatory text on how to make the"
              }}
            </p>
            <button
              class="mt-4 bg-[#FFE800] text-sm text-black px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
              @click="activeTab = 'deposit'"
            >
              {{ i18.locale.value == "ar" ? "إيداع" : "Deposit" }}
            </button>
          </div>
          <!-- Categories -->
          <div class="flex flex-col gap-2">
            <!-- My Account -->
            <button
              @click="activeTab = 'My Account Information'"
              :class="[
                'flex justify-between items-center px-2 py-2  hover:text-[#146AAB] cursor-pointer group border-1 border-solid border-[#EEEEEEEE] rounded-lg',
                activeTab === 'My Account Information'
                  ? 'bg-[#EEEEEEEE] text-[#146AAB]'
                  : 'text-black',
              ]"
            >
              <span
                :class="[
                  'text-xs font-normal group-hover:text-[#146AAB] uppercase',
                  activeTab === 'My Account Information'
                    ? 'text-[#146AAB]'
                    : 'text-black',
                ]"
              >
                {{
                  i18.locale.value == "ar"
                    ? "معلومات حسابي"
                    : "My Account Information"
                }}
              </span>
              <span>
                <i
                  class="pi pi-chevron-left group-hover:text-[#146AAB]"
                  style="font-size: 0.9rem"
                ></i>
              </span>
            </button>

            <!-- Wallet -->
            <button
              @click="activeTab = 'wallet'"
              :class="[
                'flex justify-between items-center px-2 py-2  hover:text-[#146AAB] cursor-pointer group border-1 border-solid border-[#EEEEEEEE] rounded-lg',
                activeTab === 'wallet'
                  ? 'bg-[#EEEEEEEE] text-[#146AAB]'
                  : 'text-black',
              ]"
            >
              <span
                :class="[
                  'text-xs font-normal group-hover:text-[#146AAB] uppercase',
                  activeTab === 'wallet' ? 'text-[#146AAB]' : 'text-black',
                ]"
              >
                {{ i18.locale.value == "ar" ? "المحفظة" : "Wallet" }}
              </span>
              <span>
                <i
                  class="pi pi-chevron-left group-hover:text-[#146AAB]"
                  style="font-size: 0.9rem"
                ></i>
              </span>
            </button>

            <!-- Deposit -->
            <button
              @click="activeTab = 'deposit'"
              :class="[
                'flex justify-between items-center px-2 py-2  hover:text-[#146AAB] cursor-pointer group border-1 border-solid border-[#EEEEEEEE] rounded-lg',
                activeTab === 'deposit'
                  ? 'bg-[#EEEEEEEE] text-[#146AAB]'
                  : 'text-black',
              ]"
            >
              <span
                :class="[
                  'text-xs font-normal group-hover:text-[#146AAB] uppercase',
                  activeTab === 'deposit' ? 'text-[#146AAB]' : 'text-black',
                ]"
              >
                {{ i18.locale.value == "ar" ? "إيداع" : "Deposit" }}
              </span>
              <span>
                <i
                  class="pi pi-chevron-left group-hover:text-[#146AAB]"
                  style="font-size: 0.9rem"
                ></i>
              </span>
            </button>

            <h3 class="uppercase text-xs">
              {{
                i18.locale.value == "ar"
                  ? "الرسائل والمعلومات"
                  : "Messages and Information"
              }}
            </h3>

            <!-- messages -->
            <button
              @click="activeTab = 'messages'"
              :class="[
                'flex justify-between items-center px-2 py-2  hover:text-[#146AAB] cursor-pointer group border-1 border-solid border-[#EEEEEEEE] rounded-lg',
                activeTab === 'messages'
                  ? 'bg-[#EEEEEEEE] text-[#146AAB]'
                  : 'text-black',
              ]"
            >
              <span
                :class="[
                  'text-xs font-normal group-hover:text-[#146AAB] uppercase',
                  activeTab === 'messages' ? 'text-[#146AAB]' : 'text-black',
                ]"
              >
                {{ i18.locale.value == "ar" ? "الرسائل" : "Messages" }}
              </span>
              <span>
                <i
                  class="pi pi-chevron-left group-hover:text-[#146AAB]"
                  style="font-size: 0.9rem"
                ></i>
              </span>
            </button>

            <!-- Permissions -->
            <button
              @click="activeTab = 'permissions'"
              :class="[
                'flex justify-between items-center px-2 py-2  hover:text-[#146AAB] cursor-pointer group border-1 border-solid border-[#EEEEEEEE] rounded-lg',
                activeTab === 'permissions'
                  ? 'bg-[#EEEEEEEE] text-[#146AAB]'
                  : 'text-black',
              ]"
            >
              <span
                :class="[
                  'text-xs font-normal group-hover:text-[#146AAB] uppercase',
                  activeTab === 'permissions' ? 'text-[#146AAB]' : 'text-black',
                ]"
              >
                {{ i18.locale.value == "ar" ? "أذونات" : "Permissions" }}
              </span>
              <span>
                <i
                  class="pi pi-chevron-left group-hover:text-[#146AAB]"
                  style="font-size: 0.9rem"
                ></i>
              </span>
            </button>

            <h3 class="uppercase text-xs">
              {{
                i18.locale.value == "ar"
                  ? "إدارة الإعلانات"
                  : "Advertisement Management"
              }}
            </h3>

            <!-- On Air -->
            <button
              @click="activeTab = 'on air'"
              :class="[
                'flex justify-between items-center px-2 py-2  hover:text-[#146AAB] cursor-pointer group border-1 border-solid border-[#EEEEEEEE] rounded-lg',
                activeTab === 'on air'
                  ? 'bg-[#EEEEEEEE] text-[#146AAB]'
                  : 'text-black',
              ]"
            >
              <span
                :class="[
                  'text-xs font-normal group-hover:text-[#146AAB] uppercase',
                  activeTab === 'on air' ? 'text-[#146AAB]' : 'text-black',
                ]"
              >
                {{ i18.locale.value == "ar" ? "نشط" : "On Air" }}
              </span>
              <span> (0) </span>
            </button>

            <!-- Not Published -->
            <button
              @click="activeTab = 'not published'"
              :class="[
                'flex justify-between items-center px-2 py-2  hover:text-[#146AAB] cursor-pointer group border-1 border-solid border-[#EEEEEEEE] rounded-lg',
                activeTab === 'not published'
                  ? 'bg-[#EEEEEEEE] text-[#146AAB]'
                  : 'text-black',
              ]"
            >
              <span
                :class="[
                  'text-xs font-normal group-hover:text-[#146AAB] uppercase',
                  activeTab === 'not published'
                    ? 'text-[#146AAB]'
                    : 'text-black',
                ]"
              >
                {{ i18.locale.value == "ar" ? "غير منشور" : "Not Published" }}
              </span>
              <span> (0) </span>
            </button>

            <!-- Rejected -->
            <button
              @click="activeTab = 'Rejected'"
              :class="[
                'flex justify-between items-center px-2 py-2  hover:text-[#146AAB] cursor-pointer group border-1 border-solid border-[#EEEEEEEE] rounded-lg',
                activeTab === 'Rejected'
                  ? 'bg-[#EEEEEEEE] text-[#146AAB]'
                  : 'text-black',
              ]"
            >
              <span
                :class="[
                  'text-xs font-normal group-hover:text-[#146AAB] uppercase',
                  activeTab === 'Rejected' ? 'text-[#146AAB]' : 'text-black',
                ]"
              >
                {{
                  i18.locale.value == "ar" ? "الإعلانات المرفوضة" : "Rejected"
                }}
              </span>
              <span> (0) </span>
            </button>

            <!-- Featured -->
            <button
              @click="activeTab = 'Featured'"
              :class="[
                'flex justify-between items-center px-2 py-2  hover:text-[#146AAB] cursor-pointer group border-1 border-solid border-[#EEEEEEEE] rounded-lg',
                activeTab === 'Featured'
                  ? 'bg-[#EEEEEEEE] text-[#146AAB]'
                  : 'text-black',
              ]"
            >
              <span
                :class="[
                  'text-xs font-normal group-hover:text-[#146AAB] uppercase',
                  activeTab === 'Featured' ? 'text-[#146AAB]' : 'text-black',
                ]"
              >
                {{ i18.locale.value == "ar" ? "إعلانات مميزة" : "Featured" }}
              </span>
              <span> (0) </span>
            </button>

            <h3 class="uppercase text-xs">
              {{ i18.locale.value == "ar" ? "المفضلة" : "favorites" }}
            </h3>

            <!-- favorites -->
            <button
              @click="activeTab = 'favorites'"
              :class="[
                'flex justify-between items-center px-2 py-2  hover:text-[#146AAB] cursor-pointer group border-1 border-solid border-[#EEEEEEEE] rounded-lg',
                activeTab === 'favorites'
                  ? 'bg-[#EEEEEEEE] text-[#146AAB]'
                  : 'text-black',
              ]"
            >
              <span
                :class="[
                  'text-xs font-normal group-hover:text-[#146AAB] uppercase',
                  activeTab === 'favorites' ? 'text-[#146AAB]' : 'text-black',
                ]"
              >
                {{ i18.locale.value == "ar" ? "المفضلة" : "Favorites" }}
              </span>
              <span> (0) </span>
            </button>

            <h3 class="uppercase text-xs">
              {{ i18.locale.value == "ar" ? "عام" : "general" }}
            </h3>

            <!-- Pollicy -->
            <button
              @click="activeTab = 'privacy and policy'"
              :class="[
                'flex justify-between items-center px-2 py-2  hover:text-[#146AAB] cursor-pointer group border-1 border-solid border-[#EEEEEEEE] rounded-lg',
                activeTab === 'privacy and policy'
                  ? 'bg-[#EEEEEEEE] text-[#146AAB]'
                  : 'text-black',
              ]"
            >
              <span
                :class="[
                  'text-xs font-normal group-hover:text-[#146AAB] uppercase',
                  activeTab === 'privacy and policy'
                    ? 'text-[#146AAB]'
                    : 'text-black',
                ]"
              >
                {{
                  i18.locale.value == "ar"
                    ? "الخصوصية والسياسة"
                    : "privacy and policy"
                }}
              </span>
              <span>
                <i
                  class="pi pi-chevron-left group-hover:text-[#146AAB]"
                  style="font-size: 0.9rem"
                ></i>
              </span>
            </button>
            <!-- Other Pages -->
            <!-- <button
              @click="activeTab = 'other pages'"
              :class="[
                'flex justify-between items-center px-2 py-2  hover:text-[#146AAB] cursor-pointer group border-1 border-solid border-[#EEEEEEEE] rounded-lg',
                activeTab === 'other pages'
                  ? 'bg-[#EEEEEEEE] text-[#146AAB]'
                  : 'text-black',
              ]"
            >
              <span
                :class="[
                  'text-xs font-normal group-hover:text-[#146AAB] uppercase',
                  activeTab === 'other pages' ? 'text-[#146AAB]' : 'text-black',
                ]"
              >
                {{ i18.locale.value == "ar" ? "صفحات أخرى" : "other pages" }}
              </span>
              <span>
                <i
                  class="pi pi-chevron-left group-hover:text-[#146AAB]"
                  style="font-size: 0.9rem"
                ></i>
              </span>
            </button> -->
            <!-- Logout -->
            <button
              class="flex items-center justify-center gap-2 cursor-pointer group text-[#FE3333]"
              active-class="text-[#c41c1c] "
            >
              <span>
                <i class="pi pi-sign-out" style="font-size: 0.9rem"></i>
              </span>
              <span>
                {{ i18.locale.value == "ar" ? "تسجيل الخروج" : "Log Out" }}
              </span>
            </button>
          </div>
        </div>
        <!-- Profile Details -->
        <div v-if="activeTab === 'My Account Information'" class="flex-1 h-fit">
          <!-- Avatar + user name -->
          <div
            class="flex flex-col justify-center bg-white rounded-lg items-center py-2 px-4 mb-4"
          >
            <Avatar
              :image="authStore.user?.avatar || person"
              shape="circle"
              size="xlarge"
              class=""
            />
            <div class="flex flex-col items-center">
              <h2 class="text-sm font-semibold">
                {{ i18.locale.value == "ar" ? "اسم المستخدم" : "User Name" }}
              </h2>
              <p class="text-[#9CA3AF] text-xs">
                {{ authStore.user?.email || "gmail@gmail.com" }}
              </p>
            </div>
          </div>
          <!-- User Information -->
          <div class="flex flex-col gap-1 bg-white rounded-lg py-2 px-4">
            <p class="text-sm font-semibold mb-4">
              {{
                i18.locale.value == "ar"
                  ? "معلومات المستخدم"
                  : "User information"
              }}
            </p>
            <div class="space-y-4">
              <!-- Name -->
              <div class="flex flex-col">
                <label
                  for="name"
                  class="mb-1 text-xs font-medium text-[#030712]"
                >
                  {{ i18.locale.value == "ar" ? "اسم" : "Name" }}
                </label>
                <input
                  id="name"
                  type="text"
                  :placeholder="i18.locale.value == 'ar' ? 'اسمك' : 'Your Name'"
                  class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <!-- Email -->
              <div class="flex flex-col">
                <label
                  for="email"
                  class="mb-1 text-xs font-medium text-[#030712]"
                >
                  {{ i18.locale.value == "ar" ? "البريد الإلكتروني" : "Email" }}
                </label>
                <input
                  id="email"
                  type="email"
                  :placeholder="
                    i18.locale.value == 'ar' ? 'بريدك الإلكتروني' : 'Your Email'
                  "
                  class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <hr class="my-6 text-gray-200" />
            </div>
            <!-- Reset password -->
            <p class="text-sm font-semibold mb-4">
              {{
                i18.locale.value == "ar"
                  ? "إعادة تعيين كلمة المرور"
                  : "Reset Password"
              }}
            </p>
            <div class="space-y-4 mb-4">
              <!-- old password -->
              <div class="flex flex-col">
                <label
                  for="password"
                  class="mb-1 text-xs font-medium text-[#030712]"
                >
                  {{
                    i18.locale.value == "ar"
                      ? "كلمة المرور القديمة"
                      : " old password"
                  }}
                </label>
                <input
                  id="oldPassword"
                  type="password"
                  :placeholder="
                    i18.locale.value == 'ar'
                      ? 'كلمة المرور القديمة'
                      : ' old password'
                  "
                  class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <!-- New password -->
              <div class="flex flex-col">
                <label
                  for="password"
                  class="mb-1 text-xs font-medium text-[#030712]"
                >
                  {{
                    i18.locale.value == "ar"
                      ? "كلمة المرور الجديدة"
                      : " New password"
                  }}
                </label>
                <input
                  id="newPassword"
                  type="password"
                  :placeholder="
                    i18.locale.value == 'ar'
                      ? 'كلمة المرور الجديدة'
                      : ' New password'
                  "
                  class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <!-- Confirm new password -->
              <div class="flex flex-col">
                <label
                  for="password"
                  class="mb-1 text-xs font-medium text-[#030712]"
                >
                  {{
                    i18.locale.value == "ar"
                      ? "تأكيد كلمة المرور الجديدة"
                      : " Confirm new password"
                  }}
                </label>
                <input
                  id="confirmNewPassword"
                  type="password"
                  :placeholder="
                    i18.locale.value == 'ar'
                      ? 'تأكيد كلمة المرور الجديدة'
                      : ' Confirm new password'
                  "
                  class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              class="bg-[#FFE800] text-black px-4 py-2 rounded-lg hover:bg-[#f5e103] transition mb-4"
            >
              {{ i18.locale.value == "ar" ? "حفظ" : " save" }}
            </button>
          </div>
        </div>
        <!-- Wallet Details -->
        <div v-if="activeTab === 'wallet'" class="flex-1 h-fit">
          <div class="flex flex-col bg-white px-4 rounded-lg py-10">
            <div
              class="bg-linear-to-r from-[#146AAB] to-[#0E5082] rounded-lg p-4 mb-4"
            >
              <div class="flex justify-between items-start">
                <div class="flex flex-col">
                  <div class="flex items-center gap-2">
                    <i class="pi pi-bitcoin text-yellow-400"></i>
                    <p class="text-[#EEEEEEEE]">
                      {{ i18.locale.value == "ar" ? "الرصيد" : "Balance" }}
                    </p>
                  </div>
                  <div>
                    <span class="text-lg text-[#EEEEEEEE]">30,00 </span>
                    <span class="text-xs text-[#EEEEEEEE]">{{
                      i18.locale.value == "ar" ? "ريال سعودي" : "SAR"
                    }}</span>
                  </div>
                  <div>
                    <span class="text-[#EEEEEEEE] text-xs">{{
                      i18.locale.value == "ar"
                        ? "الرصيد المتاح"
                        : "Available Balance"
                    }}</span>
                  </div>
                </div>
                <div>
                  <img src="/images/visa.png" alt="visa" />
                </div>
              </div>
            </div>
            <div class="mb-4">
              <button
                class="flex justify-between items-center w-full px-2 py-2 text-black hover:text-[#146AAB] cursor-pointer group border-1 border-solid border-[#EEEEEEEE] rounded-lg"
                active-class="bg-[#EEEEEEEE] text-[#146AAB]"
              >
                <span
                  class="text-xs font-normal group-hover:text-[#146AAB] uppercase"
                >
                  {{ i18.locale.value == "ar" ? "إيداع" : "Deposit" }}
                </span>
                <span>
                  <i
                    class="pi pi-chevron-right text-[#146AAB]"
                    style="font-size: 0.9rem"
                  ></i>
                </span>
              </button>
            </div>
            <!-- Transaction History -->
            <div
              class="border border-x-gray-200 border-y-0 rounded-lg shadow-xs p-2"
            >
              <h3 class="text-xs mb-4">
                {{
                  i18.locale.value == "ar"
                    ? "تاريخ المعاملات"
                    : "Transaction History"
                }}
              </h3>
              <!-- success -->
              <div class="flex flex-col items-center gap-1 mb-4">
                <div class="flex justify-between items-center w-full">
                  <p class="text-xs">
                    {{
                      i18.locale.value == "ar"
                        ? "تم استلام العربون"
                        : "Deposit received"
                    }}
                  </p>
                  <p
                    class="uppercase py-0.5 px-1 text-[8px] bg-[#5CCC3733] rounded-lg text-[#5CCC37]"
                  >
                    {{ i18.locale.value == "ar" ? "مكتمل" : "completed" }}
                  </p>
                </div>
                <div class="flex justify-between items-center w-full">
                  <p class="text-[8px] text-[#525252]">12/12/2025 | 02:40 pm</p>
                  <p class="uppercase px-1 text-xs">
                    234 {{ i18.locale.value == "ar" ? "ريال سعودي" : "SAR" }}
                  </p>
                </div>
              </div>

              <!-- pending -->
              <div class="flex flex-col items-center gap-1 mb-4">
                <div class="flex justify-between items-center w-full">
                  <p class="text-xs">
                    {{
                      i18.locale.value == "ar"
                        ? "المنتج المشتراة"
                        : "Product Purchased"
                    }}
                  </p>
                  <p
                    class="uppercase py-0.5 px-1 text-[8px] bg-[#FBC97433] rounded-lg text-[#FBC974]"
                  >
                    {{ i18.locale.value == "ar" ? "معلق" : "Pending" }}
                  </p>
                </div>
                <div class="flex justify-between items-center w-full">
                  <p class="text-[8px] text-[#525252]">12/12/2025 | 02:40 pm</p>
                  <p class="uppercase px-1 text-xs">
                    234 {{ i18.locale.value == "ar" ? "ريال سعودي" : "SAR" }}
                  </p>
                </div>
              </div>

              <!-- cancelled -->
              <div class="flex flex-col items-center gap-1 mb-4">
                <div class="flex justify-between items-center w-full">
                  <p class="text-xs">
                    {{
                      i18.locale.value == "ar"
                        ? "المنتج المشتراة"
                        : "Product Purchased"
                    }}
                  </p>
                  <p
                    class="uppercase py-0.5 px-1 text-[8px] bg-[#EF667633] rounded-lg text-[#EF6676]"
                  >
                    {{ i18.locale.value == "ar" ? "ملغى" : "Cancelled" }}
                  </p>
                </div>
                <div class="flex justify-between items-center w-full">
                  <p class="text-[8px] text-[#525252]">12/12/2025 | 02:40 pm</p>
                  <p class="uppercase px-1 text-xs">
                    234 {{ i18.locale.value == "ar" ? "ريال سعودي" : "SAR" }}
                  </p>
                </div>
              </div>

              <!-- cancelled -->
              <div class="flex flex-col items-center gap-1 mb-4">
                <div class="flex justify-between items-center w-full">
                  <p class="text-xs">
                    {{
                      i18.locale.value == "ar"
                        ? "المنتج المشتراة"
                        : "Product Purchased"
                    }}
                  </p>
                  <p
                    class="uppercase py-0.5 px-1 text-[8px] bg-[#EF667633] rounded-lg text-[#EF6676]"
                  >
                    {{ i18.locale.value == "ar" ? "ملغى" : "Cancelled" }}
                  </p>
                </div>
                <div class="flex justify-between items-center w-full">
                  <p class="text-[8px] text-[#525252]">12/12/2025 | 02:40 pm</p>
                  <p class="uppercase px-1 text-xs">
                    234 {{ i18.locale.value == "ar" ? "ريال سعودي" : "SAR" }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Deposit Details -->
        <div v-if="activeTab === 'deposit'" class="flex-1 h-fit">
          <div class="bg-white p-4 rounded-lg">
            <p class="text-xs mb-2">
              {{
                i18.locale.value == "ar"
                  ? "أرقام الحسابات لتحويل المبلغ"
                  : "Account numbers for transferring the amount"
              }}
            </p>
            <div class="bg-[#F5F6F7] py-4 px-2 rounded-lg mb-4">
              <div class="flex gap-2 items-center mb-4">
                <p>
                  {{ i18.locale.value == "ar" ? "العمقي" : "alomqy" }}:
                  3453453435
                </p>
                <span>
                  <i class="pi pi-clone text-[#146AAB]"></i>
                </span>
              </div>
              <div class="flex gap-2 items-center mb-4">
                <p>
                  {{ i18.locale.value == "ar" ? "البوسري" : "Albosaery" }}:
                  3453453435
                </p>
                <span>
                  <i class="pi pi-clone text-[#146AAB]"></i>
                </span>
              </div>
              <div class="flex gap-2 items-center">
                <p>
                  {{
                    i18.locale.value == "ar" ? "كورايميمبانك" : "Kuraimimibank"
                  }}: 3453453435
                </p>
                <span>
                  <i class="pi pi-clone text-[#146AAB]"></i>
                </span>
              </div>
            </div>
            <!-- download -->
            <p class="text-xs mb-2">
              {{
                i18.locale.value == "ar"
                  ? "تحميل إيصال الدفع"
                  : "Download Payment Receipt"
              }}
            </p>
            <div
              class="flex flex-col justify-center items-center gap-1 border-2 border-dashed rounded-lg py-20 text-[#146AAB] mb-4"
            >
              <i class="pi pi-cloud-upload text-2xl"></i>
              <div class="ml-2 text-xs">
                {{
                  i18.locale.value == "ar" ? "انقر لتحميل" : "Click to Download"
                }}
              </div>
            </div>
            <p class="text-xs mb-1">
              {{ i18.locale.value == "ar" ? "المبلغ" : "Amount" }}
            </p>
            <input
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <button
              class="w-full bg-[#FFE800] text-black px-4 py-2 rounded-lg hover:bg-[#f5e103] transition mb-4 cursor-pointer"
              @click="activeTab = 'save'"
            >
              {{ i18.locale.value == "ar" ? "حفظ" : " Save" }}
            </button>
          </div>
        </div>
        <!-- Success Deposit -->
        <div v-if="activeTab === 'save'" class="flex-1 h-fit">
          <div class="bg-white p-10 rounded-lg">
            <div class="flex flex-col justify-center items-center gap-2">
              <i class="pi pi-check text-[#09B285]"></i>
              <p class="text-sm">
                {{
                  i18.locale.value == "ar"
                    ? "تم إرسال إيصال الدفع بنجاح."
                    : "Payment receipt sent successfully."
                }}
              </p>
              <p class="text-xs text-center">
                {{
                  i18.locale.value == "ar"
                    ? "سيتم مراجعة إيصال الدفع الخاص بك في غضون 24 ساعة وسيتم تحديث رصيدك بعد الموافقة."
                    : "Your payment receipt will be reviewed within 24 hours and your balance will be updated upon approval."
                }}
              </p>
              <button
                class="w-64 bg-[#FFE800] text-black px-4 py-2 rounded-lg hover:bg-[#f5e103] transition mb-4 cursor-pointer"
                @click="activeTab = 'deposit'"
              >
                {{ i18.locale.value == "ar" ? "الصفحة الرئيسية" : "Home" }}
              </button>
            </div>
          </div>
        </div>
        <!-- Messages -->
        <div v-if="activeTab === 'messages'" class="flex-1 h-fit">
          <div class="bg-white p-4 rounded-lg">
            <div>
              <input
                type="text"
                :placeholder="i18.locale.value == 'ar' ? 'بحث' : 'Search'"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              />
              <!-- Message 1 -->
              <button
                @click="activeTab = 'Athalia Putri'"
                class="flex flex-col gap-2 w-full mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
              >
                <div class="flex justify-between items-center">
                  <div class="flex gap-2 items-center">
                    <Avatar
                      :image="authStore.user?.avatar || person"
                      shape="circle"
                      size="large"
                      class=""
                    />
                    <div
                      class="flex flex-col items-center justify-center gap-0.5"
                    >
                      <h3 class="text-sm">
                        {{
                          i18.locale.value == "ar"
                            ? "أثاليا بوتري"
                            : "Athalia Putri"
                        }}
                      </h3>
                      <div class="flex items-center gap-1">
                        <i class="pi pi-check text-[5px] text-[#ADB5BD]"></i>
                        <p class="text-xs text-[#ADB5BD]">
                          {{
                            i18.locale.value == "ar"
                              ? "صباح الخير"
                              : "Good morning"
                          }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col items-center gap-1">
                    <p class="text-xs text-[#ADB5BD]">
                      {{ i18.locale.value == "ar" ? "اليوم" : "Today" }}
                    </p>
                    <p
                      class="text-xs bg-[#146AAB] p-1 text-center w-5 h-5 rounded-full text-white"
                    >
                      1
                    </p>
                  </div>
                </div>
              </button>
              <!-- Message 2 -->
              <button
                class="flex flex-col gap-2 w-full mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-lgbutton"
              >
                <div class="flex justify-between items-center">
                  <div class="flex gap-2 items-center">
                    <Avatar
                      :image="authStore.user?.avatar || person"
                      shape="circle"
                      size="large"
                      class=""
                    />
                    <div
                      class="flex flex-col items-center justify-center gap-0.5"
                    >
                      <h3 class="text-sm">
                        {{
                          i18.locale.value == "ar" ? "راكي ديفون" : "Raki Devon"
                        }}
                      </h3>
                      <div class="flex items-center gap-1">
                        <i class="pi pi-check text-[5px] text-[#ADB5BD]"></i>
                        <p class="text-xs text-[#ADB5BD]">
                          {{
                            i18.locale.value == "ar"
                              ? "كيف حالك؟"
                              : "How is it going?"
                          }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col items-center gap-1">
                    <p class="text-xs text-[#ADB5BD]">17/6</p>
                    <p
                      class="text-xs bg-[#146AAB] p-1 text-center w-5 h-5 rounded-full text-white"
                    >
                      1
                    </p>
                  </div>
                </div>
              </button>
              <!-- Message 3 -->
              <button
                class="flex flex-col gap-2 w-full mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-lgbutton"
              >
                <div class="flex justify-between items-center">
                  <div class="flex gap-2 items-center">
                    <Avatar
                      :image="authStore.user?.avatar || person"
                      shape="circle"
                      size="large"
                      class=""
                    />
                    <div
                      class="flex flex-col items-center justify-center gap-0.5"
                    >
                      <h3 class="text-sm">
                        {{
                          i18.locale.value == "ar" ? "راكي ديفون" : "Raki Devon"
                        }}
                      </h3>
                      <div class="flex items-center gap-1">
                        <i class="pi pi-check text-[5px] text-[#ADB5BD]"></i>
                        <p class="text-xs text-[#ADB5BD]">
                          {{
                            i18.locale.value == "ar"
                              ? "كيف حالك؟"
                              : "How is it going?"
                          }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col items-center gap-1">
                    <p class="text-xs text-[#ADB5BD]">17/6</p>
                    <p
                      class="text-xs bg-[#146AAB] p-1 text-center w-5 h-5 rounded-full text-white"
                    >
                      1
                    </p>
                  </div>
                </div>
              </button>
              <!-- Message 4 -->
              <button
                class="flex flex-col gap-2 w-full mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
              >
                <div class="flex justify-between items-center">
                  <div class="flex gap-2 items-center">
                    <Avatar
                      :image="authStore.user?.avatar || person"
                      shape="circle"
                      size="large"
                      class=""
                    />
                    <div
                      class="flex flex-col items-center justify-center gap-0.5"
                    >
                      <h3 class="text-sm">
                        {{
                          i18.locale.value == "ar"
                            ? "أثاليا بوتري"
                            : "Athalia Putri"
                        }}
                      </h3>
                      <div class="flex items-center gap-1">
                        <i class="pi pi-check text-[5px] text-[#ADB5BD]"></i>
                        <p class="text-xs text-[#ADB5BD]">
                          {{
                            i18.locale.value == "ar"
                              ? "صباح الخير"
                              : "Good morning"
                          }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col items-center gap-1">
                    <p class="text-xs text-[#ADB5BD]">
                      {{ i18.locale.value == "ar" ? "اليوم" : "Today" }}
                    </p>
                    <p
                      class="text-xs bg-[#146AAB] p-1 text-center w-5 h-5 rounded-full text-white"
                    >
                      1
                    </p>
                  </div>
                </div>
              </button>
              <!-- Message 5 -->
              <button
                class="flex flex-col gap-2 w-full mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
              >
                <div class="flex justify-between items-center">
                  <div class="flex gap-2 items-center">
                    <Avatar
                      :image="authStore.user?.avatar || person"
                      shape="circle"
                      size="large"
                      class=""
                    />
                    <div
                      class="flex flex-col items-center justify-center gap-0.5"
                    >
                      <h3 class="text-sm">
                        {{
                          i18.locale.value == "ar" ? "راكي ديفون" : "Raki Devon"
                        }}
                      </h3>
                      <div class="flex items-center gap-1">
                        <i class="pi pi-check text-[5px] text-[#ADB5BD]"></i>
                        <p class="text-xs text-[#ADB5BD]">
                          {{
                            i18.locale.value == "ar"
                              ? "كيف حالك؟"
                              : "How is it going?"
                          }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col items-center gap-1">
                    <p class="text-xs text-[#ADB5BD]">17/6</p>
                    <p
                      class="text-xs bg-[#146AAB] p-1 text-center w-5 h-5 rounded-full text-white"
                    >
                      1
                    </p>
                  </div>
                </div>
              </button>
              <!-- Message 6 -->
              <button
                class="flex flex-col gap-2 w-full mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
              >
                <div class="flex justify-between items-center">
                  <div class="flex gap-2 items-center">
                    <Avatar
                      :image="authStore.user?.avatar || person"
                      shape="circle"
                      size="large"
                      class=""
                    />
                    <div
                      class="flex flex-col items-center justify-center gap-0.5"
                    >
                      <h3 class="text-sm">
                        {{
                          i18.locale.value == "ar"
                            ? "أثاليا بوتري"
                            : "Athalia Putri"
                        }}
                      </h3>
                      <div class="flex items-center gap-1">
                        <i class="pi pi-check text-[5px] text-[#ADB5BD]"></i>
                        <p class="text-xs text-[#ADB5BD]">
                          {{
                            i18.locale.value == "ar"
                              ? "صباح الخير"
                              : "Good morning"
                          }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col items-center gap-1">
                    <p class="text-xs text-[#ADB5BD]">
                      {{ i18.locale.value == "ar" ? "اليوم" : "Today" }}
                    </p>
                    <p
                      class="text-xs bg-[#146AAB] p-1 text-center w-5 h-5 rounded-full text-white"
                    >
                      1
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
        <!-- Message 1 Details -->
        <div
          v-if="activeTab === 'Athalia Putri'"
          class="bg-white rounded-lg h-fit flex-1"
        >
          <div
            class="flex justify-between items-center py-2 px-4 mb-4 rounded-t-lg p-1 bg-[#146AAB]"
          >
            <div class="flex items-center gap-2">
              <button
                @click="activeTab = 'messages'"
                class="bg-[#0d548bfe] rounded-lg px-2 py-1 cursor-pointer"
              >
                <i class="pi pi-angle-right text-white"></i>
              </button>
              <p class="text-white text-sm">
                {{ i18.locale.value == "ar" ? "اسم المالك" : "Owner Name" }}
              </p>
            </div>
            <i class="pi pi-phone text-white"></i>
          </div>
          <div class="flex flex-col gap-4 p-4">
            <!-- Other person's message (left) -->
            <div class="flex justify-start">
              <div class="bg-[#F5F6F7] rounded-b-lg rounded-tl-lg p-2 max-w-xs">
                <p class="text-black">
                  {{
                    i18.locale.value == "ar"
                      ? "محتوى مقروء لصفحة عند النظر إلى تخطيطها"
                      : "Readable content of a page when looking at it's layout"
                  }}
                </p>
                <p class="text-black text-xs text-right">2:14 pm</p>
              </div>
            </div>

            <!-- Your message (right) -->
            <div class="flex justify-end mb-50">
              <div
                class="bg-[#146AAB] text-white rounded-b-lg rounded-tr-lg p-2 max-w-xs"
              >
                <p>
                  {{
                    i18.locale.value == "ar"
                      ? "محتوى مقروء لصفحة عند النظر إلى تخطيطها"
                      : "Readable content of a page when looking at it's layout"
                  }}
                </p>
                <p class="text-xs text-right">2:14 pm</p>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-1 p-4">
            <i class="pi pi-image text-[#c0c0c1]"></i>
            <i class="pi pi-folder text-[#c0c0c1]"></i>
            <i class="pi pi-camera text-[#c0c0c1]"></i>
            <input
              type="text"
              :placeholder="
                i18.locale.value == 'ar'
                  ? 'اكتب رسالة ...'
                  : 'Type a message...'
              "
              class="bg-[##c0c0c1] px-2 py-1 rounded-lg border border-[#c0c0c1] w-full"
            />
            <i class="pi pi-send text-[#c0c0c1]"></i>
          </div>
        </div>
        <!-- permissions -->
        <div v-if="activeTab === 'permissions'" class="flex-1 h-fit">
          <div class="bg-white p-4 rounded-lg">
            <div class="flex justify-between items-center">
              <p class="text-xs w-64">
                {{
                  i18.locale.value == "ar"
                    ? "إذن إشعارات التسوق عبر الإنترنت للسلع المستعملة والجديدة"
                    : "Second Hand and New Shopping Web Notification Permission"
                }}
              </p>
              <ToggleSwitch v-model="permission" class="custom-blue-switch" />
            </div>
            <hr class="my-6 text-gray-200" />
            <div class="flex justify-between items-center">
              <div class="flex flex-col w-64">
                <p class="text-xs mb-2 font-bold">
                  {{
                    i18.locale.value == "ar"
                      ? "معلومات قراءة الرسائل"
                      : "Message Read Information"
                  }}
                </p>
                <p class="text-[8px]">
                  {{
                    i18.locale.value == "ar"
                      ? "يمكن للأشخاص الذين فعّلوا إشعارات قراءة الرسائل معرفة ما إذا تمت قراءة رسائلهم أثناء مراسلتهم. إذا كنت لا ترغب في إرسال هذه المعلومات إلى الشخص الذي تراسله، يمكنك إيقاف هذا الإعداد. إذا أوقفت هذا الإعداد، فلن تتمكن من رؤية إشعارات قراءة الرسائل التي ترسلها."
                      : "People who have message read notifications turned on can see whether their messages have been read while messaging each other. If you do not want this information to be sent to the person you are messaging, you can turn this off setting. If you turn this setting off, you will not be able to see the read notifications of the messages you send."
                  }}
                </p>
              </div>
              <ToggleSwitch v-model="permission2" class="custom-blue-switch" />
            </div>
          </div>
        </div>
        <!-- On Air -->
        <div v-if="activeTab === 'on air'" class="flex-1 h-fit">
          <div class="flex flex-col gap-2 bg-white p-4 rounded-lg">
            <!-- item1 -->
            <div class="flex justify-between items-center">
              <div class="flex gap-2 items-center">
                <div class="max-w-[80px] h-18">
                  <img
                    src="/images/room1.jpg"
                    alt="room1"
                    class="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h3 class="text-xs font-semibold mb-1">
                    {{
                      i18.locale.value == "ar"
                        ? "لوحة إعلانات جاجاه مادا"
                        : "Gajah Mada Billboard"
                    }}
                  </h3>
                  <div class="flex items-center gap-2">
                    <i class="pi pi-map-marker text-[9px] text-[#6B7280]"></i>
                    <p class="text-[9px] text-[#6B7280]">
                      {{
                        i18.locale.value == "ar"
                          ? "سوراكارتا، جاوة تينغاه"
                          : "Surakarta, Jawa Tengah"
                      }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="flex flex-col items-center gap-1">
                <p class="bg-[#26A69A] p-1 text-white rounded-sm text-[9px]">
                  {{ i18.locale.value == "ar" ? "منشور" : "Published" }}
                </p>
                <p class="text-sm text-[#146AAB]">
                  {{ i18.locale.value == "ar" ? "10.000$" : "$ 10.000" }}
                </p>
              </div>
            </div>
            <hr class="my-4 text-gray-200" />
            <!-- item2 -->
            <div class="flex justify-between items-center">
              <div class="flex gap-2 items-center">
                <div class="max-w-[80px] h-18">
                  <img
                    src="/images/room1.jpg"
                    alt="room1"
                    class="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h3 class="text-xs font-semibold mb-1">
                    {{
                      i18.locale.value == "ar"
                        ? "لوحة إعلانات جاجاه مادا"
                        : "Gajah Mada Billboard"
                    }}
                  </h3>
                  <div class="flex items-center gap-2">
                    <i class="pi pi-map-marker text-[9px] text-[#6B7280]"></i>
                    <p class="text-[9px] text-[#6B7280]">
                      {{
                        i18.locale.value == "ar"
                          ? "سوراكارتا، جاوة تينغاه"
                          : "Surakarta, Jawa Tengah"
                      }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="flex flex-col items-center gap-1">
                <p class="bg-[#26A69A] p-1 text-white rounded-sm text-[9px]">
                  {{ i18.locale.value == "ar" ? "منشور" : "Published" }}
                </p>
                <p class="text-sm text-[#146AAB]">
                  {{ i18.locale.value == "ar" ? "10.000$" : "$ 10.000" }}
                </p>
              </div>
            </div>
            <hr class="my-4 text-gray-200" />
            <!-- item3 -->
            <div class="flex justify-between items-center">
              <div class="flex gap-2 items-center">
                <div class="max-w-[80px] h-18">
                  <img
                    src="/images/room1.jpg"
                    alt="room1"
                    class="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h3 class="text-xs font-semibold mb-1">
                    {{
                      i18.locale.value == "ar"
                        ? "لوحة إعلانات جاجاه مادا"
                        : "Gajah Mada Billboard"
                    }}
                  </h3>
                  <div class="flex items-center gap-2">
                    <i class="pi pi-map-marker text-[9px] text-[#6B7280]"></i>
                    <p class="text-[9px] text-[#6B7280]">
                      {{
                        i18.locale.value == "ar"
                          ? "سوراكارتا، جاوة تينغاه"
                          : "Surakarta, Jawa Tengah"
                      }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="flex flex-col items-center gap-1">
                <p class="bg-[#26A69A] p-1 text-white rounded-sm text-[9px]">
                  {{ i18.locale.value == "ar" ? "منشور" : "Published" }}
                </p>
                <p class="text-sm text-[#146AAB]">
                  {{ i18.locale.value == "ar" ? "10.000$" : "$ 10.000" }}
                </p>
              </div>
            </div>
            <hr class="my-4 text-gray-200" />
            <!-- item4 -->
            <div class="flex justify-between items-center">
              <div class="flex gap-2 items-center">
                <div class="max-w-[80px] h-18">
                  <img
                    src="/images/room1.jpg"
                    alt="room1"
                    class="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h3 class="text-xs font-semibold mb-1">
                    {{
                      i18.locale.value == "ar"
                        ? "لوحة إعلانات جاجاه مادا"
                        : "Gajah Mada Billboard"
                    }}
                  </h3>
                  <div class="flex items-center gap-2">
                    <i class="pi pi-map-marker text-[9px] text-[#6B7280]"></i>
                    <p class="text-[9px] text-[#6B7280]">
                      {{
                        i18.locale.value == "ar"
                          ? "سوراكارتا، جاوة تينغاه"
                          : "Surakarta, Jawa Tengah"
                      }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="flex flex-col items-center gap-1">
                <p class="bg-[#26A69A] p-1 text-white rounded-sm text-[9px]">
                  {{ i18.locale.value == "ar" ? "منشور" : "Published" }}
                </p>
                <p class="text-sm text-[#146AAB]">
                  {{ i18.locale.value == "ar" ? "10.000$" : "$ 10.000" }}
                </p>
              </div>
            </div>
            <hr class="my-4 text-gray-200" />
            <!-- item5 -->
            <div class="flex justify-between items-center">
              <div class="flex gap-2 items-center">
                <div class="max-w-[80px] h-18">
                  <img
                    src="/images/room1.jpg"
                    alt="room1"
                    class="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h3 class="text-xs font-semibold mb-1">
                    {{
                      i18.locale.value == "ar"
                        ? "لوحة إعلانات جاجاه مادا"
                        : "Gajah Mada Billboard"
                    }}
                  </h3>
                  <div class="flex items-center gap-2">
                    <i class="pi pi-map-marker text-[9px] text-[#6B7280]"></i>
                    <p class="text-[9px] text-[#6B7280]">
                      {{
                        i18.locale.value == "ar"
                          ? "سوراكارتا، جاوة تينغاه"
                          : "Surakarta, Jawa Tengah"
                      }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="flex flex-col items-center gap-1">
                <p class="bg-[#26A69A] p-1 text-white rounded-sm text-[9px]">
                  {{ i18.locale.value == "ar" ? "منشور" : "Published" }}
                </p>
                <p class="text-sm text-[#146AAB]">
                  {{ i18.locale.value == "ar" ? "10.000$" : "$ 10.000" }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- Not Published -->
        <div v-if="activeTab === 'not published'" class="flex-1 h-fit">
          <div class="flex flex-col gap-2 bg-white p-4 rounded-lg">
            <!-- item1 -->
            <div class="flex justify-between items-center">
              <div class="flex gap-2 items-center">
                <div class="max-w-[80px] h-18">
                  <img
                    src="/images/room1.jpg"
                    alt="room1"
                    class="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h3 class="text-xs font-semibold mb-1">
                    {{
                      i18.locale.value == "ar"
                        ? "لوحة إعلانات جاجاه مادا"
                        : "Gajah Mada Billboard"
                    }}
                  </h3>
                  <div class="flex items-center gap-2">
                    <i class="pi pi-map-marker text-[9px] text-[#6B7280]"></i>
                    <p class="text-[9px] text-[#6B7280]">
                      {{
                        i18.locale.value == "ar"
                          ? "سوراكارتا، جاوة تينغاه"
                          : "Surakarta, Jawa Tengah"
                      }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="flex flex-col items-center gap-1">
                <p class="bg-[#9CA3AF] p-1 text-white rounded-sm text-[9px]">
                  {{ i18.locale.value == "ar" ? "غير منشور" : "Not Published" }}
                </p>
                <p class="text-sm text-[#146AAB]">
                  {{ i18.locale.value == "ar" ? "10.000$" : "$ 10.000" }}
                </p>
              </div>
            </div>
            <hr class="my-4 text-gray-200" />
            <!-- item2 -->
            <div class="flex justify-between items-center">
              <div class="flex gap-2 items-center">
                <div class="max-w-[80px] h-18">
                  <img
                    src="/images/room1.jpg"
                    alt="room1"
                    class="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h3 class="text-xs font-semibold mb-1">
                    {{
                      i18.locale.value == "ar"
                        ? "لوحة إعلانات جاجاه مادا"
                        : "Gajah Mada Billboard"
                    }}
                  </h3>
                  <div class="flex items-center gap-2">
                    <i class="pi pi-map-marker text-[9px] text-[#6B7280]"></i>
                    <p class="text-[9px] text-[#6B7280]">
                      {{
                        i18.locale.value == "ar"
                          ? "سوراكارتا، جاوة تينغاه"
                          : "Surakarta, Jawa Tengah"
                      }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="flex flex-col items-center gap-1">
                <p class="bg-[#9CA3AF] p-1 text-white rounded-sm text-[9px]">
                  {{ i18.locale.value == "ar" ? "غير منشور" : "Not Published" }}
                </p>
                <p class="text-sm text-[#146AAB]">
                  {{ i18.locale.value == "ar" ? "10.000$" : "$ 10.000" }}
                </p>
              </div>
            </div>
            <hr class="my-4 text-gray-200" />
            <!-- item3 -->
            <div class="flex justify-between items-center">
              <div class="flex gap-2 items-center">
                <div class="max-w-[80px] h-18">
                  <img
                    src="/images/room1.jpg"
                    alt="room1"
                    class="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h3 class="text-xs font-semibold mb-1">
                    {{
                      i18.locale.value == "ar"
                        ? "لوحة إعلانات جاجاه مادا"
                        : "Gajah Mada Billboard"
                    }}
                  </h3>
                  <div class="flex items-center gap-2">
                    <i class="pi pi-map-marker text-[9px] text-[#6B7280]"></i>
                    <p class="text-[9px] text-[#6B7280]">
                      {{
                        i18.locale.value == "ar"
                          ? "سوراكارتا، جاوة تينغاه"
                          : "Surakarta, Jawa Tengah"
                      }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="flex flex-col items-center gap-1">
                <p class="bg-[#9CA3AF] p-1 text-white rounded-sm text-[9px]">
                  {{ i18.locale.value == "ar" ? "غير منشور" : "Not Published" }}
                </p>
                <p class="text-sm text-[#146AAB]">
                  {{ i18.locale.value == "ar" ? "10.000$" : "$ 10.000" }}
                </p>
              </div>
            </div>
            <hr class="my-4 text-gray-200" />
            <!-- item4 -->
            <div class="flex justify-between items-center">
              <div class="flex gap-2 items-center">
                <div class="max-w-[80px] h-18">
                  <img
                    src="/images/room1.jpg"
                    alt="room1"
                    class="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h3 class="text-xs font-semibold mb-1">
                    {{
                      i18.locale.value == "ar"
                        ? "لوحة إعلانات جاجاه مادا"
                        : "Gajah Mada Billboard"
                    }}
                  </h3>
                  <div class="flex items-center gap-2">
                    <i class="pi pi-map-marker text-[9px] text-[#6B7280]"></i>
                    <p class="text-[9px] text-[#6B7280]">
                      {{
                        i18.locale.value == "ar"
                          ? "سوراكارتا، جاوة تينغاه"
                          : "Surakarta, Jawa Tengah"
                      }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="flex flex-col items-center gap-1">
                <p class="bg-[#9CA3AF] p-1 text-white rounded-sm text-[9px]">
                  {{ i18.locale.value == "ar" ? "غير منشور" : "Not Published" }}
                </p>
                <p class="text-sm text-[#146AAB]">
                  {{ i18.locale.value == "ar" ? "10.000$" : "$ 10.000" }}
                </p>
              </div>
            </div>
            <hr class="my-4 text-gray-200" />
            <!-- item5 -->
            <div class="flex justify-between items-center">
              <div class="flex gap-2 items-center">
                <div class="max-w-[80px] h-18">
                  <img
                    src="/images/room1.jpg"
                    alt="room1"
                    class="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h3 class="text-xs font-semibold mb-1">
                    {{
                      i18.locale.value == "ar"
                        ? "لوحة إعلانات جاجاه مادا"
                        : "Gajah Mada Billboard"
                    }}
                  </h3>
                  <div class="flex items-center gap-2">
                    <i class="pi pi-map-marker text-[9px] text-[#6B7280]"></i>
                    <p class="text-[9px] text-[#6B7280]">
                      {{
                        i18.locale.value == "ar"
                          ? "سوراكارتا، جاوة تينغاه"
                          : "Surakarta, Jawa Tengah"
                      }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="flex flex-col items-center gap-1">
                <p class="bg-[#9CA3AF] p-1 text-white rounded-sm text-[9px]">
                  {{ i18.locale.value == "ar" ? "غير منشور" : "Not Published" }}
                </p>
                <p class="text-sm text-[#146AAB]">
                  {{ i18.locale.value == "ar" ? "10.000$" : "$ 10.000" }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- Rejected -->
        <div v-if="activeTab === 'Rejected'" class="flex-1 h-fit">
          <div class="flex flex-col gap-2 bg-white p-4 rounded-lg">
            <!-- item1 -->
            <div class="flex justify-between items-center">
              <div class="flex gap-2 items-center">
                <div class="max-w-[80px] h-18">
                  <img
                    src="/images/room1.jpg"
                    alt="room1"
                    class="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h3 class="text-xs font-semibold mb-1">
                    {{
                      i18.locale.value == "ar"
                        ? "لوحة إعلانات جاجاه مادا"
                        : "Gajah Mada Billboard"
                    }}
                  </h3>
                  <div class="flex items-center gap-2">
                    <i class="pi pi-map-marker text-[9px] text-[#6B7280]"></i>
                    <p class="text-[9px] text-[#6B7280]">
                      {{
                        i18.locale.value == "ar"
                          ? "سوراكارتا، جاوة تينغاه"
                          : "Surakarta, Jawa Tengah"
                      }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="flex flex-col items-center gap-1">
                <p class="bg-[#D81515] p-1 text-white rounded-sm text-[9px]">
                  {{ i18.locale.value == "ar" ? "مرفوض" : "Rejected" }}
                </p>
                <p class="text-sm text-[#146AAB]">
                  {{ i18.locale.value == "ar" ? "10.000$" : "$ 10.000" }}
                </p>
              </div>
            </div>
            <hr class="my-4 text-gray-200" />
            <!-- item2 -->
            <div class="flex justify-between items-center">
              <div class="flex gap-2 items-center">
                <div class="max-w-[80px] h-18">
                  <img
                    src="/images/room1.jpg"
                    alt="room1"
                    class="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h3 class="text-xs font-semibold mb-1">
                    {{
                      i18.locale.value == "ar"
                        ? "لوحة إعلانات جاجاه مادا"
                        : "Gajah Mada Billboard"
                    }}
                  </h3>
                  <div class="flex items-center gap-2">
                    <i class="pi pi-map-marker text-[9px] text-[#6B7280]"></i>
                    <p class="text-[9px] text-[#6B7280]">
                      {{
                        i18.locale.value == "ar"
                          ? "سوراكارتا، جاوة تينغاه"
                          : "Surakarta, Jawa Tengah"
                      }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="flex flex-col items-center gap-1">
                <p class="bg-[#D81515] p-1 text-white rounded-sm text-[9px]">
                  {{ i18.locale.value == "ar" ? "مرفوض" : "Rejected" }}
                </p>
                <p class="text-sm text-[#146AAB]">
                  {{ i18.locale.value == "ar" ? "10.000$" : "$ 10.000" }}
                </p>
              </div>
            </div>
            <hr class="my-4 text-gray-200" />
            <!-- item3 -->
            <div class="flex justify-between items-center">
              <div class="flex gap-2 items-center">
                <div class="max-w-[80px] h-18">
                  <img
                    src="/images/room1.jpg"
                    alt="room1"
                    class="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h3 class="text-xs font-semibold mb-1">
                    {{
                      i18.locale.value == "ar"
                        ? "لوحة إعلانات جاجاه مادا"
                        : "Gajah Mada Billboard"
                    }}
                  </h3>
                  <div class="flex items-center gap-2">
                    <i class="pi pi-map-marker text-[9px] text-[#6B7280]"></i>
                    <p class="text-[9px] text-[#6B7280]">
                      {{
                        i18.locale.value == "ar"
                          ? "سوراكارتا، جاوة تينغاه"
                          : "Surakarta, Jawa Tengah"
                      }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="flex flex-col items-center gap-1">
                <p class="bg-[#D81515] p-1 text-white rounded-sm text-[9px]">
                  {{ i18.locale.value == "ar" ? "مرفوض" : "Rejected" }}
                </p>
                <p class="text-sm text-[#146AAB]">
                  {{ i18.locale.value == "ar" ? "10.000$" : "$ 10.000" }}
                </p>
              </div>
            </div>
            <hr class="my-4 text-gray-200" />
            <!-- item4 -->
            <div class="flex justify-between items-center">
              <div class="flex gap-2 items-center">
                <div class="max-w-[80px] h-18">
                  <img
                    src="/images/room1.jpg"
                    alt="room1"
                    class="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h3 class="text-xs font-semibold mb-1">
                    {{
                      i18.locale.value == "ar"
                        ? "لوحة إعلانات جاجاه مادا"
                        : "Gajah Mada Billboard"
                    }}
                  </h3>
                  <div class="flex items-center gap-2">
                    <i class="pi pi-map-marker text-[9px] text-[#6B7280]"></i>
                    <p class="text-[9px] text-[#6B7280]">
                      {{
                        i18.locale.value == "ar"
                          ? "سوراكارتا، جاوة تينغاه"
                          : "Surakarta, Jawa Tengah"
                      }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="flex flex-col items-center gap-1">
                <p class="bg-[#D81515] p-1 text-white rounded-sm text-[9px]">
                  {{ i18.locale.value == "ar" ? "مرفوض" : "Rejected" }}
                </p>
                <p class="text-sm text-[#146AAB]">
                  {{ i18.locale.value == "ar" ? "10.000$" : "$ 10.000" }}
                </p>
              </div>
            </div>
            <hr class="my-4 text-gray-200" />
            <!-- item5 -->
            <div class="flex justify-between items-center">
              <div class="flex gap-2 items-center">
                <div class="max-w-[80px] h-18">
                  <img
                    src="/images/room1.jpg"
                    alt="room1"
                    class="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h3 class="text-xs font-semibold mb-1">
                    {{
                      i18.locale.value == "ar"
                        ? "لوحة إعلانات جاجاه مادا"
                        : "Gajah Mada Billboard"
                    }}
                  </h3>
                  <div class="flex items-center gap-2">
                    <i class="pi pi-map-marker text-[9px] text-[#6B7280]"></i>
                    <p class="text-[9px] text-[#6B7280]">
                      {{
                        i18.locale.value == "ar"
                          ? "سوراكارتا، جاوة تينغاه"
                          : "Surakarta, Jawa Tengah"
                      }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="flex flex-col items-center gap-1">
                <p class="bg-[#D81515] p-1 text-white rounded-sm text-[9px]">
                  {{ i18.locale.value == "ar" ? "مرفوض" : "Rejected" }}
                </p>
                <p class="text-sm text-[#146AAB]">
                  {{ i18.locale.value == "ar" ? "10.000$" : "$ 10.000" }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- Featured -->
        <div v-if="activeTab === 'Featured'" class="flex-1 h-fit">
          <div class="bg-white p-4 rounded-lg">
            <div class="flex flex-col gap-2 bg-[#FEFFEB] p-4 rounded-lg">
              <!-- item1 -->
              <div class="flex justify-between items-center">
                <div class="flex gap-2 items-center">
                  <div class="max-w-[80px] h-18">
                    <img
                      src="/images/room1.jpg"
                      alt="room1"
                      class="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <p
                      class="bg-[#FFE800] p-1 text-black rounded-sm text-[9px] w-fit mb-2"
                    >
                      {{ i18.locale.value == "ar" ? "مميز" : "Featured" }}
                    </p>

                    <h3 class="text-xs font-semibold mb-1">
                      {{
                        i18.locale.value == "ar"
                          ? "لوحة إعلانات جاجاه مادا"
                          : "Gajah Mada Billboard"
                      }}
                    </h3>
                    <div class="flex items-center gap-2">
                      <i class="pi pi-map-marker text-[9px] text-[#6B7280]"></i>
                      <p class="text-[9px] text-[#6B7280]">
                        {{
                          i18.locale.value == "ar"
                            ? "سوراكارتا، جاوة تينغاه"
                            : "Surakarta, Jawa Tengah"
                        }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="flex items-end gap-1">
                  <p class="text-sm text-[#146AAB]">
                    {{ i18.locale.value == "ar" ? "10.000$" : "$ 10.000" }}
                  </p>
                </div>
              </div>
              <hr class="my-4 text-gray-200" />
              <!-- item2 -->
              <div class="flex justify-between items-center">
                <div class="flex gap-2 items-center">
                  <div class="max-w-[80px] h-18">
                    <img
                      src="/images/room1.jpg"
                      alt="room1"
                      class="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <p
                      class="bg-[#FFE800] p-1 text-black rounded-sm text-[9px] w-fit mb-2"
                    >
                      {{ i18.locale.value == "ar" ? "مميز" : "Featured" }}
                    </p>

                    <h3 class="text-xs font-semibold mb-1">
                      {{
                        i18.locale.value == "ar"
                          ? "لوحة إعلانات جاجاه مادا"
                          : "Gajah Mada Billboard"
                      }}
                    </h3>
                    <div class="flex items-center gap-2">
                      <i class="pi pi-map-marker text-[9px] text-[#6B7280]"></i>
                      <p class="text-[9px] text-[#6B7280]">
                        {{
                          i18.locale.value == "ar"
                            ? "سوراكارتا، جاوة تينغاه"
                            : "Surakarta, Jawa Tengah"
                        }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="flex items-end gap-1">
                  <p class="text-sm text-[#146AAB]">
                    {{ i18.locale.value == "ar" ? "10.000$" : "$ 10.000" }}
                  </p>
                </div>
              </div>
              <hr class="my-4 text-gray-200" />
              <!-- item3 -->
              <div class="flex justify-between items-center">
                <div class="flex gap-2 items-center">
                  <div class="max-w-[80px] h-18">
                    <img
                      src="/images/room1.jpg"
                      alt="room1"
                      class="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <p
                      class="bg-[#FFE800] p-1 text-black rounded-sm text-[9px] w-fit mb-2"
                    >
                      {{ i18.locale.value == "ar" ? "مميز" : "Featured" }}
                    </p>

                    <h3 class="text-xs font-semibold mb-1">
                      {{
                        i18.locale.value == "ar"
                          ? "لوحة إعلانات جاجاه مادا"
                          : "Gajah Mada Billboard"
                      }}
                    </h3>
                    <div class="flex items-center gap-2">
                      <i class="pi pi-map-marker text-[9px] text-[#6B7280]"></i>
                      <p class="text-[9px] text-[#6B7280]">
                        {{
                          i18.locale.value == "ar"
                            ? "سوراكارتا، جاوة تينغاه"
                            : "Surakarta, Jawa Tengah"
                        }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="flex items-end gap-1">
                  <p class="text-sm text-[#146AAB]">
                    {{ i18.locale.value == "ar" ? "10.000$" : "$ 10.000" }}
                  </p>
                </div>
              </div>
              <hr class="my-4 text-gray-200" />
              <!-- item4 -->
              <div class="flex justify-between items-center">
                <div class="flex gap-2 items-center">
                  <div class="max-w-[80px] h-18">
                    <img
                      src="/images/room1.jpg"
                      alt="room1"
                      class="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <p
                      class="bg-[#FFE800] p-1 text-black rounded-sm text-[9px] w-fit mb-2"
                    >
                      {{ i18.locale.value == "ar" ? "مميز" : "Featured" }}
                    </p>

                    <h3 class="text-xs font-semibold mb-1">
                      {{
                        i18.locale.value == "ar"
                          ? "لوحة إعلانات جاجاه مادا"
                          : "Gajah Mada Billboard"
                      }}
                    </h3>
                    <div class="flex items-center gap-2">
                      <i class="pi pi-map-marker text-[9px] text-[#6B7280]"></i>
                      <p class="text-[9px] text-[#6B7280]">
                        {{
                          i18.locale.value == "ar"
                            ? "سوراكارتا، جاوة تينغاه"
                            : "Surakarta, Jawa Tengah"
                        }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="flex items-end gap-1">
                  <p class="text-sm text-[#146AAB]">
                    {{ i18.locale.value == "ar" ? "10.000$" : "$ 10.000" }}
                  </p>
                </div>
              </div>
              <hr class="my-4 text-gray-200" />
              <!-- item5 -->
              <div class="flex justify-between items-center">
                <div class="flex gap-2 items-center">
                  <div class="max-w-[80px] h-18">
                    <img
                      src="/images/room1.jpg"
                      alt="room1"
                      class="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <p
                      class="bg-[#FFE800] p-1 text-black rounded-sm text-[9px] w-fit mb-2"
                    >
                      {{ i18.locale.value == "ar" ? "مميز" : "Featured" }}
                    </p>

                    <h3 class="text-xs font-semibold mb-1">
                      {{
                        i18.locale.value == "ar"
                          ? "لوحة إعلانات جاجاه مادا"
                          : "Gajah Mada Billboard"
                      }}
                    </h3>
                    <div class="flex items-center gap-2">
                      <i class="pi pi-map-marker text-[9px] text-[#6B7280]"></i>
                      <p class="text-[9px] text-[#6B7280]">
                        {{
                          i18.locale.value == "ar"
                            ? "سوراكارتا، جاوة تينغاه"
                            : "Surakarta, Jawa Tengah"
                        }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="flex items-end gap-1">
                  <p class="text-sm text-[#146AAB]">
                    {{ i18.locale.value == "ar" ? "10.000$" : "$ 10.000" }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Favorites -->
        <div v-if="activeTab === 'favorites'" class="flex-1 h-fit">
          <div class="flex flex-col gap-2 bg-white p-4 rounded-lg">
            <!-- item1 -->
            <div class="flex justify-between items-center">
              <div class="flex gap-2 items-center">
                <div class="max-w-[80px] h-18">
                  <img
                    src="/images/room1.jpg"
                    alt="room1"
                    class="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h3 class="text-xs font-semibold mb-1">
                    {{
                      i18.locale.value == "ar"
                        ? "لوحة إعلانات جاجاه مادا"
                        : "Gajah Mada Billboard"
                    }}
                  </h3>
                  <div class="flex items-center gap-2">
                    <i class="pi pi-map-marker text-[9px] text-[#6B7280]"></i>
                    <p class="text-[9px] text-[#6B7280]">
                      {{
                        i18.locale.value == "ar"
                          ? "سوراكارتا، جاوة تينغاه"
                          : "Surakarta, Jawa Tengah"
                      }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="flex items-end gap-1">
                <p class="text-sm text-[#146AAB]">
                  {{ i18.locale.value == "ar" ? "10.000$" : "$ 10.000" }}
                </p>
              </div>
            </div>
            <hr class="my-4 text-gray-200" />
            <!-- item2 -->
            <div class="flex justify-between items-center">
              <div class="flex gap-2 items-center">
                <div class="max-w-[80px] h-18">
                  <img
                    src="/images/room1.jpg"
                    alt="room1"
                    class="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h3 class="text-xs font-semibold mb-1">
                    {{
                      i18.locale.value == "ar"
                        ? "لوحة إعلانات جاجاه مادا"
                        : "Gajah Mada Billboard"
                    }}
                  </h3>
                  <div class="flex items-center gap-2">
                    <i class="pi pi-map-marker text-[9px] text-[#6B7280]"></i>
                    <p class="text-[9px] text-[#6B7280]">
                      {{
                        i18.locale.value == "ar"
                          ? "سوراكارتا، جاوة تينغاه"
                          : "Surakarta, Jawa Tengah"
                      }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="flex items-end gap-1">
                <p class="text-sm text-[#146AAB]">
                  {{ i18.locale.value == "ar" ? "10.000$" : "$ 10.000" }}
                </p>
              </div>
            </div>
            <hr class="my-4 text-gray-200" />
            <!-- item3 -->
            <div class="flex justify-between items-center">
              <div class="flex gap-2 items-center">
                <div class="max-w-[80px] h-18">
                  <img
                    src="/images/room1.jpg"
                    alt="room1"
                    class="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h3 class="text-xs font-semibold mb-1">
                    {{
                      i18.locale.value == "ar"
                        ? "لوحة إعلانات جاجاه مادا"
                        : "Gajah Mada Billboard"
                    }}
                  </h3>
                  <div class="flex items-center gap-2">
                    <i class="pi pi-map-marker text-[9px] text-[#6B7280]"></i>
                    <p class="text-[9px] text-[#6B7280]">
                      {{
                        i18.locale.value == "ar"
                          ? "سوراكارتا، جاوة تينغاه"
                          : "Surakarta, Jawa Tengah"
                      }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="flex items-end gap-1">
                <p class="text-sm text-[#146AAB]">
                  {{ i18.locale.value == "ar" ? "10.000$" : "$ 10.000" }}
                </p>
              </div>
            </div>
            <hr class="my-4 text-gray-200" />
            <!-- item4 -->
            <div class="flex justify-between items-center">
              <div class="flex gap-2 items-center">
                <div class="max-w-[80px] h-18">
                  <img
                    src="/images/room1.jpg"
                    alt="room1"
                    class="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h3 class="text-xs font-semibold mb-1">
                    {{
                      i18.locale.value == "ar"
                        ? "لوحة إعلانات جاجاه مادا"
                        : "Gajah Mada Billboard"
                    }}
                  </h3>
                  <div class="flex items-center gap-2">
                    <i class="pi pi-map-marker text-[9px] text-[#6B7280]"></i>
                    <p class="text-[9px] text-[#6B7280]">
                      {{
                        i18.locale.value == "ar"
                          ? "سوراكارتا، جاوة تينغاه"
                          : "Surakarta, Jawa Tengah"
                      }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="flex items-end gap-1">
                <p class="text-sm text-[#146AAB]">
                  {{ i18.locale.value == "ar" ? "10.000$" : "$ 10.000" }}
                </p>
              </div>
            </div>
            <hr class="my-4 text-gray-200" />
            <!-- item5 -->
            <div class="flex justify-between items-center">
              <div class="flex gap-2 items-center">
                <div class="max-w-[80px] h-18">
                  <img
                    src="/images/room1.jpg"
                    alt="room1"
                    class="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h3 class="text-xs font-semibold mb-1">
                    {{
                      i18.locale.value == "ar"
                        ? "لوحة إعلانات جاجاه مادا"
                        : "Gajah Mada Billboard"
                    }}
                  </h3>
                  <div class="flex items-center gap-2">
                    <i class="pi pi-map-marker text-[9px] text-[#6B7280]"></i>
                    <p class="text-[9px] text-[#6B7280]">
                      {{
                        i18.locale.value == "ar"
                          ? "سوراكارتا، جاوة تينغاه"
                          : "Surakarta, Jawa Tengah"
                      }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="flex items-end gap-1">
                <p class="text-sm text-[#146AAB]">
                  {{ i18.locale.value == "ar" ? "10.000$" : "$ 10.000" }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- Pollicy -->
        <div v-if="activeTab === 'privacy and policy'" class="flex-1 h-fit">
          <div class="bg-white p-90 rounded-lg"></div>
        </div>
        <!-- other pages -->
        <!-- <div v-if="activeTab === 'other pages'" class="flex-1 h-fit">
          <div class="bg-white p-4 rounded-lg">Other Pages Content</div>
        </div> -->
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
.custom-blue-switch .p-toggleswitch-slider {
  background-color: #e0e0e0; /* track color when OFF */
}

.custom-blue-switch.p-highlight .p-toggleswitch-slider {
  background-color: #146aab !important; /* track color when ON */
}

.custom-blue-switch .p-toggleswitch-handle {
  background-color: white; /* the handle */
}
</style>
