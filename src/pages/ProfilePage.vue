<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { MEDIA_URL } from "../services/axios";
import { useAuthStore } from "../store/auth";
import requestService from "../services/api/requestService";
import { socket } from "../services/SocketPlugin";
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
import FavoriteAdItem from "../components/Profile/FavoriteAdItem.vue";
import OnAirAdItem from "../components/Profile/OnAirAdItem.vue";
import UserInfo from "../components/Profile/UserInfo.vue";
import EmptyState from "../components/EmptyState.vue";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/ar";
import "dayjs/locale/en";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

const { t, locale } = useI18n();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
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

const featuredAds = ref([]);

const STORAGE_KEY = "AD_FAVORITES_LIST";

const favoritesAds = ref([]);

const adStats = ref({});

const walletBalance = ref(0);
const transactionsData = ref([]);

// chats variables
const chatList = ref([]);
const selectedChatUserId = ref(null);
const chatListPage = ref(1);
const chatListPageSize = 20; // same as your backend limit
const totalChats = ref(0);
const isLoadingChatList = ref(false);
const chatListContainer = ref(null);
let searchTimeout;

// chat messages variables
const chatMessages = ref([]);
const currentPage = ref(1);
const pageSize = 20; // match your backend default
const totalMessages = ref(0);
const isLoadingMessages = ref(false);
const messagesContainer = ref(null);
const searchText = ref("");
const chatUser = ref({});
const newMessage = ref(""); // the text input for the chat message

const mediaFile = ref(null); // selected file
const mediaPreviewUrl = ref(""); // preview URL

const isSendingMedia = ref(false);

// --- METHODS ---
const handleMediaSelect = (event) => {
  const target = event.target;
  if (target.files && target.files.length > 0) {
    mediaFile.value = target.files[0];

    // Generate preview URL
    if (
      mediaFile.value.type.startsWith("image/") ||
      mediaFile.value.type.startsWith("video/") ||
      mediaFile.value.type.startsWith("audio/")
    ) {
      mediaPreviewUrl.value = URL.createObjectURL(mediaFile.value);
    } else {
      mediaPreviewUrl.value = "";
    }
  }
};

const cancelMedia = () => {
  mediaFile.value = null;
  mediaPreviewUrl.value = "";
};

const sendMediaMessage = async () => {
  if (!mediaFile.value || !selectedChatUserId.value) return;

  const formData = new FormData();
  formData.append("file", mediaFile.value);
  formData.append("senderId", String(currentUser?.value?.id));
  formData.append("receiverId", String(selectedChatUserId.value));

  isSendingMedia.value = true;

  try {
    const res = await requestService.create("chats/media", formData);

    if (res?.data) {
      chatMessages.value.push(res.data); // add to messages
      await nextTick();
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;

      // Clear selected media
      cancelMedia();
    }
  } catch (err) {
    console.error("Failed to send media message:", err);
    showError(err || "Failed to send media message");
  } finally {
    isSendingMedia.value = false;
  }
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedChatUserId.value) return;

  // Prepare payload
  const payload = {
    receiver_id: selectedChatUserId.value,
    message: newMessage.value,
  };

  try {
    await socket.emit("sendUserMessage", {
      receiverId: selectedChatUserId.value,
      senderId: currentUser?.value?.id,
      message: newMessage.value,
      type: "text",
    });

    // 3. Clear input
    newMessage.value = "";

    await fetchChatMessages(1);

    // 4. Scroll to bottom
    await nextTick();
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  } catch (err) {
    console.error("Failed to send message:", err);
    showError("Failed to send message");
  }
};

const handleSearchInput = () => {
  if (searchTimeout) clearTimeout(searchTimeout);

  searchTimeout = setTimeout(() => {
    fetchChatsList(1, false); // Reset list and fetch first page
  }, 300);
};

const handleChatListScroll = () => {
  const container = chatListContainer.value;
  if (!container || isLoadingChatList.value) return;

  const scrollBottom =
    container.scrollTop + container.clientHeight >= container.scrollHeight - 10;

  if (scrollBottom) {
    // check if there are more chats to load
    if (chatList.value.length < totalChats.value) {
      fetchChatsList(chatListPage.value + 1, true); // append next page
    }
  }
};

const fetchChatsList = async (page = 1, append = false) => {
  if (isLoadingChatList.value) return;

  isLoadingChatList.value = true;
  try {
    const queryParams = new URLSearchParams({
      page,
      limit: chatListPageSize,
      userId: currentUser?.value?.id,
    });

    // Include search query if it exists
    if (searchText.value.trim()) {
      queryParams.append("search", searchText.value.trim());
    }

    const res = await requestService.getAll(
      `chats/paginate/customer?${queryParams.toString()}`
    );

    const chats = res?.data || [];
    if (append) {
      chatList.value = [...chatList.value, ...chats];
    } else {
      chatList.value = chats;
    }

    totalChats.value = res?.meta?.total || chats.length;
    chatListPage.value = page;
  } catch (error) {
    console.log(error);
  } finally {
    isLoadingChatList.value = false;
  }
};

const fetchChatMessages = async (page = 1, append = false) => {
  if (!selectedChatUserId.value) return;
  isLoadingMessages.value = true;
  try {
    const res = await requestService.getAll(
      `chats/messages?userId=${selectedChatUserId.value}&page=${page}&limit=${pageSize}`
    );

    chatUser.value = res?.chatUser;

    const messages = res?.data || [];
    if (append) {
      chatMessages.value = [...chatMessages.value, ...messages];
    } else {
      chatMessages.value = messages;
    }

    // Assuming backend sends total count, otherwise you can calculate
    totalMessages.value = res?.meta?.total || messages.length;
    currentPage.value = page;
  } catch (error) {
    console.log(error);
  } finally {
    isLoadingMessages.value = false;
  }
};

const handleScroll = () => {
  const container = messagesContainer.value;
  if (!container || isLoadingMessages.value) return;

  const scrollBottom =
    container.scrollTop + container.clientHeight >= container.scrollHeight - 10;

  if (scrollBottom) {
    // check if there are more messages
    if (chatMessages.value.length < totalMessages.value) {
      fetchChatMessages(currentPage.value + 1, true); // load next page
    }
  }
};

const getOtherChatUser = (chatItem) => {
  if (!chatItem?.members || !Array.isArray(chatItem.members)) return null;

  const other = chatItem.members.find(
    (member) => member?.user_id !== currentUser.value?.id
  );

  return other?.users?.name || null;
};

const formattedDate = (date) => {
  if (!date) return "";

  dayjs.locale(locale.value); // dynamically set locale
  const msgDate = dayjs(date);
  const today = dayjs();

  if (msgDate.isSame(today, "day")) {
    return msgDate.format("h:mm A"); // Today → show time
  } else if (msgDate.isSame(today.subtract(1, "day"), "day")) {
    return t("profile.chats.yesterday"); // Yesterday
  } else if (msgDate.isSame(today, "year")) {
    return msgDate.format("DD/MM"); // Same year
  } else {
    return msgDate.format("DD/MM/YYYY"); // Older
  }
};

const formatTime = (date) => {
  return dayjs(date).format("h:mm A"); // e.g., 2:14 PM
};

watch(chatMessages, async () => {
  await nextTick();
  const container = messagesContainer.value;
  if (container) {
    container.scrollTop = container.scrollHeight;
  }

  // mark messages as read whenever new messages are rendered
  markMessagesAsRead();
});

watch(
  () => route.query.userId,
  async (userId) => {
    if (userId) {
      selectedChatUserId.value = Number(userId);
      await fetchChatMessages();
      activeTab.value = "messages";
    } else {
      selectedChatUserId.value = null;
    }
  },
  { immediate: true }
);

const markMessagesAsRead = async () => {
  if (!selectedChatUserId.value) return;

  // Collect IDs of unread messages sent by the other user
  const unreadMessageIds = chatMessages.value
    .filter((msg) => !msg.is_read && msg.sender_id !== currentUser.value?.id)
    .map((msg) => msg.id);

  if (unreadMessageIds.length === 0) return;

  try {
    socket.emit("readUserMessages", {
      chatId: selectedChatUserId.value,
      messageIds: unreadMessageIds,
    });

    // Optimistically mark messages as read in UI
    chatMessages.value = chatMessages.value.map((msg) =>
      unreadMessageIds.includes(msg.id) ? { ...msg, is_read: true } : msg
    );
  } catch (err) {
    console.error("Failed to mark messages as read:", err);
  }
};

const handleSetSelectedUserId = async (chat) => {
  const chatUser = chat?.members?.find(
    (m) => m?.user_id !== currentUser.value?.id
  );
  const userId = chatUser?.user_id;

  selectedChatUserId.value = userId;
  activeTab.value = "messages";

  currentPage.value = 1;
  chatMessages.value = []; // reset messages

  fetchChatMessages(1).then(() => {
    // After messages are loaded, mark as read
    markMessagesAsRead();
  });

  router.push({
    name: "user-profile",
    query: { userId },
  });
};

const handleChatBackButton = () => {
  selectedChatUserId.value = null;
  activeTab.value = "messages";

  router.push({
    name: "user-profile",
    query: {}, // clear query
  });

  fetchChatsList();
};

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

const currentUser = computed(() => authStore?.getUser);
const currentLocale = computed(() => locale.value);

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

  if (tabName === "messages") {
    selectedChatUserId.value = null; // Reset so the chat list shows
    fetchChatsList(); // load chat list
  } else {
    selectedChatUserId.value = null; // reset for other tabs too
  }

  // fetch data for other tabs
  if (tabName === "wallet") fetchWalletSummary();
  if (tabName === "Featured") fetchFeaturedAds();
  if (tabName === "on air") fetchPublishedAds();
  if (tabName === "not published") fetchUnPublishedAds();
  if (tabName === "Rejected") fetchRejectedAds();
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
    const userId = route.query.userId;

    if (userId) {
      selectedChatUserId.value = Number(userId);
      activeTab.value = "messages";
    }
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
                  currentLocale == "ar"
                    ? "اجعل إعلانك مميزًا"
                    : "MAKE YOUR AD STAND OUT"
                }}
              </p>
            </div>
            <p class="text-xs font-normal uppercase">
              {{
                currentLocale == "ar"
                  ? "فيما يلي نص توضيحي حول كيفية صنع"
                  : "here is an explanatory text on how to make the"
              }}
            </p>
            <p class="text-xs font-normal uppercase">
              {{
                currentLocale == "ar"
                  ? "فيما يلي نص توضيحي حول كيفية صنع"
                  : "here is an explanatory text on how to make the"
              }}
            </p>
            <button
              class="mt-4 bg-[#FFE800] text-sm text-black px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
              @click="activeTab = 'deposit'"
            >
              {{ currentLocale == "ar" ? "إيداع" : "Deposit" }}
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
                  currentLocale == "ar"
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
                {{ currentLocale == "ar" ? "المحفظة" : "Wallet" }}
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
                {{ currentLocale == "ar" ? "إيداع" : "Deposit" }}
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
                currentLocale == "ar"
                  ? "الرسائل والمعلومات"
                  : "Messages and Information"
              }}
            </h3>

            <!-- messages -->
            <button
              @click="handleTabClick('messages')"
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
                {{ currentLocale == "ar" ? "الرسائل" : "Messages" }}
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
                {{ currentLocale == "ar" ? "أذونات" : "Permissions" }}
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
                currentLocale == "ar"
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
                {{ currentLocale == "ar" ? "نشط" : "On Air" }}
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
                {{ currentLocale == "ar" ? "غير منشور" : "Not Published" }}
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
                {{ currentLocale == "ar" ? "الإعلانات المرفوضة" : "Rejected" }}
              </span>
              <span> ({{ adStats?.totalRejected || 0 }}) </span>
            </button>

            <!-- Featured -->
            <button
              @click="handleTabClick('Featured')"
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
                {{ currentLocale == "ar" ? "إعلانات مميزة" : "Featured" }}
              </span>
              <span> ({{ adStats?.totalFeatured || 0 }}) </span>
            </button>

            <h3 class="uppercase text-xs">
              {{ currentLocale == "ar" ? "المفضلة" : "favorites" }}
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
                {{ currentLocale == "ar" ? "المفضلة" : "Favorites" }}
              </span>
              <span> ({{ favoritesAds?.length || 0 }}) </span>
            </button>

            <h3 class="uppercase text-xs">
              {{ currentLocale == "ar" ? "عام" : "general" }}
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
                  currentLocale == "ar"
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
                {{ currentLocale == "ar" ? "تسجيل الخروج" : "Log Out" }}
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
                  currentLocale == "ar"
                    ? "تم إرسال إيصال الدفع بنجاح."
                    : "Payment receipt sent successfully."
                }}
              </p>
              <p class="text-xs text-center">
                {{
                  currentLocale == "ar"
                    ? "سيتم مراجعة إيصال الدفع الخاص بك في غضون 24 ساعة وسيتم تحديث رصيدك بعد الموافقة."
                    : "Your payment receipt will be reviewed within 24 hours and your balance will be updated upon approval."
                }}
              </p>
              <button
                class="w-64 bg-[#FFE800] text-black px-4 py-2 rounded-lg hover:bg-[#f5e103] transition mb-4 cursor-pointer"
                @click="activeTab = 'deposit'"
              >
                {{ currentLocale == "ar" ? "الصفحة الرئيسية" : "Home" }}
              </button>
            </div>
          </div>
        </div>
        <!-- Messages -->
        <div
          v-if="activeTab === 'messages' && !selectedChatUserId"
          class="flex-1 h-fit"
        >
          <div class="bg-white p-4 rounded-lg">
            <div>
              <input
                type="text"
                v-model="searchText"
                @input="handleSearchInput"
                :placeholder="$t('profile.chats.search')"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              />

              <div
                ref="chatListContainer"
                class="bg-white p-4 rounded-lg h-[400px] overflow-y-auto"
                @scroll="handleChatListScroll"
              >
                <div v-if="chatList?.length === 0" class="text-center py-10">
                  <p class="text-gray-500">
                    {{ $t("profile.chats.no_chats") }}
                  </p>
                </div>

                <div v-else class="flex flex-col gap-2">
                  <button
                    v-for="chat in chatList"
                    :key="chat?.id"
                    @click="handleSetSelectedUserId(chat)"
                    class="flex w-full cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
                  >
                    <div class="flex justify-between items-center w-full">
                      <div class="flex gap-3 items-center">
                        <Avatar :image="person" shape="circle" size="large" />
                        <div class="flex flex-col items-start gap-0.5">
                          <h3 class="text-sm font-medium">
                            {{ getOtherChatUser(chat) }}
                          </h3>
                          <div class="flex items-center gap-1">
                            <i
                              class="pi pi-check text-[7px] text-[#ADB5BD]"
                            ></i>
                            <p
                              class="text-xs text-[#ADB5BD] truncate w-[150px] flex items-center gap-1"
                            >
                              <i
                                v-if="chat?.lastMessage?.type === 'image'"
                                class="pi pi-image"
                              ></i>
                              <i
                                v-else-if="chat?.lastMessage?.type === 'video'"
                                class="pi pi-video"
                              ></i>
                              <i
                                v-else-if="chat?.lastMessage?.type === 'audio'"
                                class="pi pi-music"
                              ></i>
                              <i
                                v-else-if="chat?.lastMessage?.type === 'file'"
                                class="pi pi-file"
                              ></i>
                              <span>
                                {{
                                  chat?.lastMessage?.type === "text"
                                    ? chat?.lastMessage?.message
                                    : chat?.lastMessage?.type === "image"
                                    ? $t("profile.chats.image")
                                    : chat?.lastMessage?.type === "video"
                                    ? $t("profile.chats.video")
                                    : chat?.lastMessage?.type === "audio"
                                    ? $t("profile.chats.audio")
                                    : $t("profile.chats.file")
                                }}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div class="flex flex-col items-end gap-1">
                        <p class="text-xs text-[#ADB5BD]">
                          {{ formattedDate(chat?.lastMessage?.created) }}
                        </p>
                        <p
                          v-if="chat?.unreadCount > 0"
                          class="text-xs bg-[#146AAB] p-1 w-5 h-5 text-white rounded-full text-center"
                        >
                          {{ chat?.unreadCount }}
                        </p>
                      </div>
                    </div>
                  </button>

                  <div
                    v-if="isLoadingChatList"
                    class="text-center text-sm py-2"
                  >
                    {{ $t("generic.loading") }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Message 1 Details -->
        <div
          v-if="activeTab === 'messages' && selectedChatUserId"
          class="bg-white rounded-lg h-fit flex-1"
        >
          <div
            class="flex justify-between items-center py-2 px-4 mb-4 rounded-t-lg p-1 bg-[#146AAB]"
          >
            <div class="flex items-center gap-2">
              <button
                @click="handleChatBackButton"
                class="bg-[#0d548bfe] rounded-lg px-2 py-1 cursor-pointer"
              >
                <i class="pi pi-angle-right text-white"></i>
              </button>
              <p class="text-white text-sm">
                {{ chatUser?.name }}
              </p>
            </div>
            <i class="pi pi-phone text-white"></i>
          </div>

          <div
            ref="messagesContainer"
            class="flex-1 h-[400px] overflow-y-auto p-4 flex flex-col gap-2"
            @scroll="handleScroll"
          >
            <div
              v-for="msg in chatMessages"
              :key="msg.id"
              :class="
                msg.sender_id === currentUser?.id
                  ? 'justify-end'
                  : 'justify-start'
              "
              class="flex"
            >
              <div
                :class="[
                  'p-2 max-w-xs break-words',
                  msg.sender_id === currentUser?.id
                    ? 'bg-[#146AAB] text-white rounded-b-lg rounded-tr-lg'
                    : 'bg-[#F5F6F7] text-black rounded-b-lg rounded-tl-lg',
                ]"
              >
                <template v-if="msg.type === 'text'">
                  <p>{{ msg.message }}</p>
                </template>
                <template v-else-if="msg.type === 'image'">
                  <img
                    :src="`${MEDIA_URL}/${msg.message}`"
                    class="rounded max-h-48"
                  />
                </template>
                <template v-else-if="msg.type === 'video'">
                  <video
                    :src="`${MEDIA_URL}/${msg.message}`"
                    class="rounded max-h-48"
                    controls
                  ></video>
                </template>
                <template v-else-if="msg.type === 'audio'">
                  <audio :src="`${MEDIA_URL}/${msg.message}`" controls></audio>
                </template>
                <p class="text-xs text-right mt-1">
                  {{ formatTime(msg?.created) }}
                </p>
              </div>
            </div>

            <div v-if="isLoadingMessages" class="text-center text-sm py-2">
              {{ $t("generic.loading") }}
            </div>
          </div>

          <div class="flex flex-col gap-2 p-4">
            <div v-if="mediaPreviewUrl" class="relative mb-2">
              <div
                class="flex items-center justify-between bg-gray-100 p-2 rounded-lg"
              >
                <template v-if="mediaFile?.type.startsWith('image/')">
                  <img :src="mediaPreviewUrl" class="max-h-32 rounded" />
                </template>
                <template v-else-if="mediaFile?.type.startsWith('video/')">
                  <video
                    :src="mediaPreviewUrl"
                    class="max-h-32 rounded"
                    controls
                  ></video>
                </template>
                <template v-else-if="mediaFile?.type.startsWith('audio/')">
                  <audio :src="mediaPreviewUrl" controls></audio>
                </template>
                <button
                  @click="cancelMedia"
                  class="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  &times;
                </button>
              </div>
            </div>

            <div
              class="flex items-center gap-2 p-3 bg-white rounded-full shadow"
            >
              <!-- Text input -->
              <input
                v-model="newMessage"
                :disabled="mediaFile"
                type="text"
                :placeholder="$t('profile.chats.type_message')"
                class="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />

              <!-- Send button -->
              <button
                @click="
                  mediaFile
                    ? sendMediaMessage()
                    : newMessage.trim()
                    ? sendMessage()
                    : null
                "
                class="flex items-center justify-center w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition"
              >
                <i class="pi pi-send"></i>
              </button>

              <!-- Media attach button -->
              <button
                @click="$refs.mediaInput.click()"
                class="flex items-center justify-center w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full transition"
              >
                <i class="pi pi-image"></i>
              </button>

              <input
                type="file"
                ref="mediaInput"
                @change="handleMediaSelect"
                accept="image/*,video/*,audio/*"
                class="hidden"
              />
            </div>
          </div>
        </div>
        <!-- permissions -->
        <div v-if="activeTab === 'permissions'" class="flex-1 h-fit">
          <div class="bg-white p-4 rounded-lg">
            <div class="flex justify-between items-center">
              <p class="text-xs w-64">
                {{
                  currentLocale == "ar"
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
                    currentLocale == "ar"
                      ? "معلومات قراءة الرسائل"
                      : "Message Read Information"
                  }}
                </p>
                <p class="text-[8px]">
                  {{
                    currentLocale == "ar"
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
              @refreshAds="handleTabClick('on air')"
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
              @refreshAds="handleTabClick('not published')"
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
              @refreshAds="handleTabClick('Rejected')"
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
          <div v-if="featuredAds.length > 0">
            <OnAirAdItem
              v-for="item in featuredAds"
              :key="item.id"
              :item="item"
              @refreshAds="handleTabClick('Rejected')"
            />
          </div>

          <EmptyState
            v-else
            title="empty.featured_title"
            message="empty.featured_message"
          />
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

div[ref="messagesContainer"] {
  scroll-behavior: smooth;
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
