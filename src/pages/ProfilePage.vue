<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "../store/auth";
import requestService from "../services/api/requestService";
import { showError, showSuccess } from "../utils/notifications";
import person from "../assets/person.png";
import { Avatar } from "primevue";
import AppLayout from "../Layout/AppLayout.vue";
import ToggleSwitch from "primevue/toggleswitch";
import PaymentForm from "../components/Profile/PaymentForm.vue";
import PaymentSuccess from "../components/Profile/PaymentSuccess.vue";
import PaymentFaild from "../components/Profile/PaymentFaild.vue";
import { computed } from "vue";
import WalletSummary from "../components/Profile/WalletSummary.vue";
import UserFeaturedAds from "../components/Profile/UserFeaturedAds.vue";
import FavoriteAdItem from "../components/Profile/FavoriteAdItem.vue";
import RejectedAdItem from "../components/Profile/RejectedAdItem.vue";
import OnAirAdItem from "../components/Profile/OnAirAdItem.vue";
import UserInfo from "../components/Profile/UserInfo.vue";
import EmptyState from "../components/EmptyState.vue";

const { t, locale } = useI18n();
const authStore = useAuthStore();
const i18 = useI18n();

const name = ref("");
const email = ref("");
const phone = ref("");
const originalPhone = ref("");
const originalName = ref("");
const activeTab = ref("My Account Information");
const permission = ref(false);
const permission2 = ref(false);

const isLoading = ref(false);

const publishedAds = ref([]);
const unPublishedAds = ref([]);
const rejectedAds = ref([]);

const publishedAdsTotal = ref(0);
const unPublishedAdsTotal = ref(0);
const rejectedAdsTotal = ref(0);

const currentView = ref("form");
const isPaymentLoading = ref(false); // To show a loading state during the API call

// const rejectedAds = [
//   {
//     id: 1,
//     title_en: "Gajah Mada Billboard (Rejected)",
//     title: "لوحة إعلانات جاجاه مادا (مرفوض)",
//     price: 10000,
//     status: "Rejected",
//     status_ar: "مرفوض",
//     ads_images: [
//       { image: "https://placehold.co/80x72/D81515/FFFFFF?text=Ad1" },
//     ],
//     ad_attributes: [
//       {
//         address: "Surakarta, Central Java, Indonesia",
//         address_ar: "سوراكارتا، جاوة تينغاه، إندونيسيا",
//       },
//     ],
//   },
//   {
//     id: 2,
//     title_en: "Premium City Center Ad Space (Pending)",
//     title: "مساحة إعلانات ممتازة وسط المدينة (قيد الانتظار)",
//     price: 15500,
//     status: "Pending",
//     status_ar: "قيد الانتظار",
//     ads_images: [
//       { image: "https://placehold.co/80x72/F59E0B/FFFFFF?text=Ad2" },
//     ],
//     ad_attributes: [
//       {
//         address: "Bandung, West Java, Indonesia",
//         address_ar: "باندونج، جاوة الغربية، إندونيسيا",
//       },
//     ],
//   },
//   {
//     id: 3,
//     title_en: "Highway Entrance Display (Rejected)",
//     title: "شاشة عرض مدخل الطريق السريع (مرفوض)",
//     price: 20250,
//     status: "Rejected",
//     status_ar: "مرفوض",
//     ads_images: [
//       { image: "https://placehold.co/80x72/D81515/FFFFFF?text=Ad3" },
//     ],
//     ad_attributes: [
//       {
//         address: "Jakarta, DKI Jakarta, Indonesia",
//         address_ar: "جاكرتا، جاكرتا العاصمة، إندونيسيا",
//       },
//     ],
//   },
//   {
//     id: 4,
//     title_en: "Coastal View Billboard (Completed)",
//     title: "لوحة إعلانات بإطلالة ساحلية (مكتمل)",
//     price: 8900,
//     status: "Completed",
//     status_ar: "مكتمل",
//     ads_images: [
//       { image: "https://placehold.co/80x72/10B981/FFFFFF?text=Ad4" },
//     ],
//     ad_attributes: [
//       {
//         address: "Denpasar, Bali, Indonesia",
//         address_ar: "دنpasar، بالي، إندونيسيا",
//       },
//     ],
//   },
//   {
//     id: 5,
//     title_en: "Retail Storefront LED (Rejected)",
//     title: "شاشة LED واجهة متجر بيع بالتجزئة (مرفوض)",
//     price: 12100,
//     status: "Rejected",
//     status_ar: "مرفوض",
//     ads_images: [
//       { image: "https://placehold.co/80x72/D81515/FFFFFF?text=Ad5" },
//     ],
//     ad_attributes: [
//       {
//         address: "Surabaya, East Java, Indonesia",
//         address_ar: "سورابايا، جاوة الشرقية، إندونيسيا",
//       },
//     ],
//   },
// ];
const onAirItems = rejectedAds;
const notPublishedAds = rejectedAds;

const featuredAds = ref([]);

const STORAGE_KEY = "AD_FAVORITES_LIST";

const favoritesAds = ref([]);

const adStats = ref({});

// --- METHODS ---

/**
 * Loads all favorite ads from localStorage.
 */
const loadFavoritesFromLocalStorage = () => {
  isLoading.value = true;
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      favoritesAds.value = JSON.parse(storedData);
    } else {
      favoritesAds.value = [];
    }
  } catch (error) {
    console.error("Error reading or parsing localStorage:", error);
    favoritesAds.value = [];
  }
};

const walletBalance = ref(150.75);
const transactionsData = ref([
  {
    type: "received",
    description_key: "profile.wallet.deposit_received",
    date: "2025-12-12",
    time: "02:40 pm",
    amount: 234,
    status: "completed",
  },
  {
    type: "purchased",
    description_key: "profile.wallet.product_purchased",
    date: "2025-12-10",
    time: "11:00 am",
    amount: 50,
    status: "pending",
  },
  {
    type: "purchased",
    description_key: "profile.wallet.product_purchased",
    date: "2025-12-05",
    time: "09:15 am",
    amount: 80,
    status: "cancelled",
  },
]);

const currentUser = computed(() => authStore?.getUser);

const handleSaveUser = async (validatedData) => {
  // Pass the validated data directly to your Pinia update action
  try {
    const res = await requestService.patch("/auth/profile", validatedData);
    showSuccess(res?.message);
  } catch (error) {
    console.log(error);
    showError(error);
  }
};

const handleTabClick = (tabName) => {
  activeTab.value = tabName;
  if (tabName === "wallet") {
    fetchWalletSummary();
  }
  if (tabName === "featured") {
    fetchFeaturedAds();
  }
  if (tabName === "on air") {
    fetchPublishedAds();
  }
  if (tabName === "not published") {
    fetchUnPublishedAds();
  }
  if (tabName === "Rejected") {
    fetchRejectedAds();
  }
};

const formatPhone = (value) => {
  // Remove non-digits and limit to 10 digits
  const cleaned = value.replace(/\D/g, "").slice(0, 10);
  const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
  if (match) {
    return [match[1], match[2], match[3]].filter(Boolean).join("-");
  }
  return cleaned;
};

const fetchWalletSummary = async () => {
  try {
    const res = await requestService.getAll(
      "wallet-transactions/wallet-summary/" + currentUser.value?.id
    );
    walletBalance.value = res?.data?.balance || 0;
    transactionsData.value = res?.data?.lastTransactions || [];
  } catch (error) {
    console.log(error);
  }
};

const fetchFeaturedAds = async () => {
  try {
    const res = await requestService.getAll(
      "ads/user-featured-ads/" + currentUser.value?.id
    );
    featuredAds.value = res?.data || [];
  } catch (error) {
    console.log(error);
  }
};

const fetchPublishedAds = async () => {
  try {
    const res = await requestService.getAll(
      `ads/user-ads-by-status/${currentUser.value?.id}/published`
    );
    publishedAds.value = res?.data || [];
    publishedAdsTotal.value = res?.data?.length || 0;
  } catch (error) {
    console.log(error);
  }
};

const fetchUnPublishedAds = async () => {
  try {
    const res = await requestService.getAll(
      `ads/user-ads-by-status/${currentUser.value?.id}/unpublished`
    );
    unPublishedAds.value = res?.data || [];
    unPublishedAdsTotal.value = res?.data?.length || 0;
  } catch (error) {
    console.log(error);
  }
};

const fetchRejectedAds = async () => {
  try {
    const res = await requestService.getAll(
      `ads/user-ads-by-status/${currentUser.value?.id}/rejected`
    );
    rejectedAds.value = res?.data || [];
    rejectedAdsTotal.value = res?.data?.length || 0;
  } catch (error) {
    console.log(error);
  }
};

const fetchStats = async (status = "published") => {
  try {
    const res = await requestService.getAll(
      `ads/user-ads-stats/${currentUser.value?.id}`
    );
    adStats.value = res?.data || {};
  } catch (error) {
    console.log(error);
  }
};

const handleDepositClick = () => {
  activeTab.value = "deposit";
};

// 2. Handle the submission event from the PaymentForm
const handleSubmitPayment = async (payload) => {
  // Ensure loading is set at the start
  isPaymentLoading.value = true;
  console.log("Starting API call with payload:", payload);

  const formData = new FormData();
  formData.append("amount", payload?.amount);
  // Key name for the file should match backend expectation
  formData.append("proof_image", payload?.receiptFile);
  // Ensure authStore and user data are defined
  formData.append("user_id", authStore?.user?.id);

  // Optional: Keep a short delay for better UX transition

  try {
    // 1. Execute the actual API call
    const res = await requestService.create(
      "wallet-deposits-requests",
      formData
    );

    // 2. Success path: Show success toast and switch view
    showSuccess(res?.message || t("profile.payment.success_title"));

    currentView.value = "success";
    console.log("API Success! Showing success message.");
  } catch (error) {
    // 3. Failure path: Show error toast and switch view
    console.error("Payment API failed:", error);
    // Assuming 'showError' is available and handles toast display
    showError(error || t("profile.payment.fail_title"));

    currentView.value = "failed";
    console.log("API Failure! Showing failure message.");
  } finally {
    // 4. Ensure loading is always false, regardless of outcome
    isPaymentLoading.value = false;
  }
};

// 4. Handles 'Home' clicks from Success or Failed components
const handleGoToHome = () => {
  console.log("Navigating to Home/Dashboard.");
  // In a real app, you would use a router here: router.push('/') or emit a global event.
  currentView.value = "form"; // For this example, we just show the form again
};

// 5. Handles 'Retry' click from the Failed component
const handleRetryPayment = () => {
  console.log("Retrying payment. Returning to form.");
  currentView.value = "form";
};

// 6. Utility to render the correct component
const componentMap = {
  form: PaymentForm,
  success: PaymentSuccess,
  failed: PaymentFaild,
  summary: WalletSummary,
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

    fetchWalletSummary();
    loadFavoritesFromLocalStorage();
    fetchStats();
  } catch (err) {
    console.log(err);

    showError(t("dashboard.profile.load-error"));
  }
});
</script>

<template>
  <app-layout>
    <main class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row gap-4">
        <!-- Profile Category -->
        <div class="w-full md:w-96 bg-white rounded-lg p-4">
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
              @click="handleTabClick('wallet')"
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
              @click="handleTabClick('on air')"
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
              <span> ({{ adStats?.totalPublished || 0 }}) </span>
            </button>

            <!-- Not Published -->
            <button
              @click="handleTabClick('not published')"
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
              <span> ({{ adStats?.totalUnPublished || 0 }}) </span>
            </button>

            <!-- Rejected -->
            <button
              @click="handleTabClick('Rejected')"
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
              <span> ({{ adStats?.totalRejected || 0 }}) </span>
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
              <span> ({{ adStats?.totalFeatured || 0 }}) </span>
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
              <span> ({{ favoritesAds?.length || 0 }}) </span>
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
                {{ currentUser?.name }}
              </h2>
              <p class="text-[#9CA3AF] text-xs">
                {{ currentUser?.email || currentUser?.phone }}
              </p>
            </div>
          </div>
          <!-- User Information -->
          <UserInfo :initial-user="currentUser" @saveUser="handleSaveUser" />
        </div>
        <!-- Wallet Details -->
        <div v-if="activeTab === 'wallet'" class="flex-1 h-fit">
          <WalletSummary
            :balance="walletBalance"
            :last-transactions="transactionsData"
            @depositClick="handleDepositClick"
          />
        </div>
        <!-- Deposit Details -->
        <div class="flex-1 h-fit" v-if="activeTab == 'deposit'">
          <component
            :is="componentMap[currentView]"
            @submitPayment="handleSubmitPayment"
            @goToHome="handleGoToHome"
            @retryPayment="handleRetryPayment"
          />
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
          <div v-if="publishedAds.length > 0">
            <OnAirAdItem
              v-for="item in publishedAds"
              :key="item.id"
              :item="item"
            />
          </div>

          <EmptyState
            v-else
            title="empty.published_title"
            message="empty.published_message"
          />
        </div>
        <!-- Not Published -->
        <div v-if="activeTab === 'not published'" class="flex-1 h-fit">
          <div v-if="unPublishedAds.length > 0">
            <OnAirAdItem
              v-for="item in unPublishedAds"
              :key="item.id"
              :item="item"
            />
          </div>

          <EmptyState
            v-else
            title="empty.unpublished_title"
            message="empty.unpublished_message"
          />
        </div>
        <!-- Rejected -->
        <div v-if="activeTab === 'Rejected'" class="flex-1 h-fit">
          <div v-if="rejectedAds.length > 0">
            <OnAirAdItem
              v-for="item in rejectedAds"
              :key="item.id"
              :item="item"
            />
          </div>

          <EmptyState
            v-else
            title="empty.rejected_title"
            message="empty.rejected_message"
          />
        </div>
        <!-- Featured -->
        <div v-if="activeTab === 'Featured'" class="flex-1 h-fit">
          <UserFeaturedAds :items="featuredAds" />
        </div>
        <!-- Favorites -->
        <div v-if="activeTab === 'favorites'" class="flex-1 h-fit">
          <!-- Scrollable container must have a fixed height and overflow set. 
             This element is the 'root' for the Intersection Observer when root: null is used. -->
          <div
            class="h-[calc(100vh-150px)] overflow-y-auto rounded-lg shadow-xl bg-white"
          >
            <div
              v-if="favoritesAds?.length === 0"
              class="text-center flex-col py-10"
            >
              <p class="text-gray-500">
                {{ $t("profile.favoured_ads.no_favoured_ads") }}
              </p>
            </div>

            <!-- List Container: Apply the main list styling here -->
            <div v-else class="flex flex-col gap-2 p-4">
              <!-- Loop over the CURRENTLY DISPLAYED items -->
              <template v-for="(item, index) in favoritesAds" :key="item.id">
                <!-- The single item component -->
                <FavoriteAdItem :item="item" />

                <!-- Divider: only display if it is NOT the last item -->
                <hr
                  v-if="index < favoritesAds.length - 1"
                  class="my-2 border-gray-200"
                />
              </template>
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
