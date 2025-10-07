<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
import { useChatStore } from "../../store/chat";
import DashboardLayout from "../../Layout/DashboardLayout.vue";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "../../store/auth";
import { MEDIA_URL } from "../../services/axios";

const { t } = useI18n();
const chatStore = useChatStore();
const authStore = useAuthStore();

const newMessage = ref("");
const showAttachmentMenu = ref(false);
const screenWidth = ref(window.innerWidth);

// Mobile detection
const isMobile = computed(() => screenWidth.value < 768);
const currentUser = computed(() => authStore.getUser);
const showSidebar = ref(true);

// file inputs refs
const documentInput = ref(null);
const imageInput = ref(null);
const audioInput = ref(null);

// scroll refs
const chatListRef = ref(null);
const messagesRef = ref(null);

const selectedFile = ref(null);
const previewUrl = ref(null);
const previewType = ref(null); // 'image', 'audio', 'document'

// Handle file selection with preview
const handleFileSelect = (file, type) => {
  if (!file) return;
  selectedFile.value = file;
  previewType.value = type;
  previewUrl.value = URL.createObjectURL(file);
  showAttachmentMenu.value = false;
};

// Handlers for each input
const handleDocument = (event) =>
  handleFileSelect(event.target.files[0], "document");
const handleImage = (event) => handleFileSelect(event.target.files[0], "image");
const handleAudio = (event) => handleFileSelect(event.target.files[0], "audio");

const getMediaUrl = (path) => {
  return `${MEDIA_URL}/${path}`;
};

const currentUserOnline = computed(() => {
  const userId = chatStore.activeChat?.users?.id;
  return userId ? chatStore.isUserOnline(userId) : false;
});

const isUserOnline = (userId) => {
  return chatStore.onlineUsers?.includes(userId);
};

// send message (calls backend/socket)
const handleSend = async () => {
  if (!chatStore.activeChatId) return;

  // If file selected → send media
  if (selectedFile.value) {
    await chatStore.sendMediaMessage(selectedFile.value, previewType.value);

    // Reset preview state
    selectedFile.value = null;
    previewUrl.value = null;
    previewType.value = null;
    return;
  }

  // Else if text → send text
  if (newMessage.value.trim()) {
    const content = newMessage.value.trim();
    newMessage.value = "";

    const userId = chatStore.activeChat?.users?.id;
    if (!userId) return;

    await chatStore.sendSupportMessage(userId, content);
  }
};

// Watch messages array for new messages
watch(
  () => chatStore.activeChat?.messages,
  async (messages) => {
    if (!messages) return;
    await nextTick();
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight;
    }
    if (chatStore.activeChatId) {
      chatStore.markMessagesAsReadSocket(chatStore.activeChatId);
    }
  },
  { deep: true }
);

// Scroll handler for loading older messages (infinite scroll)
const onMessageScroll = async () => {
  const el = messagesRef.value;
  if (!el || chatStore.loadingMessages || !chatStore.hasMoreMessages) return;

  // If near the top, fetch older messages
  if (el.scrollTop <= 50) {
    const prevHeight = el.scrollHeight;

    // Fetch previous page of messages
    await chatStore.fetchMessages(chatStore.activeChatId, { prepend: true });

    await nextTick();
    // Maintain scroll position after prepending messages
    el.scrollTop = el.scrollHeight - prevHeight;
  }

  // Mark visible messages as read
  if (chatStore.activeChatId) {
    chatStore.markMessagesAsReadSocket(chatStore.activeChatId);
  }
};

// toggle attach menu
const toggleAttachmentMenu = () => {
  showAttachmentMenu.value = !showAttachmentMenu.value;
};

// when clicking a chat: set active and fetch messages
const onChatClick = async (chatId) => {
  chatStore.setActiveChat(chatId);
  await chatStore.fetchMessages(chatId);
  await nextTick();
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight;
  }
  if (isMobile.value) showSidebar.value = false;
};

const goBack = () => {
  chatStore.setActiveChat(null);
  showSidebar.value = true;
};

// Chat list infinite scroll
const onChatListScroll = async () => {
  const el = chatListRef.value;
  if (!el || chatStore.loadingChats || !chatStore.hasMoreChats) return;
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
    await chatStore.fetchChats({ append: true });
  }
};

// Search handler
const handleSearch = async () => {
  await chatStore.resetAndFetchChats();
};

// resize handler + initial load
const handleResize = () => (screenWidth.value = window.innerWidth);

onMounted(async () => {
  window.addEventListener("resize", handleResize);
  chatStore.setActiveChat(null);
  await chatStore.fetchChats(); // initial load
  chatStore.listenForMessages();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<template>
  <DashboardLayout>
    <main class="flex h-[calc(100vh-64px)] bg-gray-100">
      <!-- Sidebar -->
      <aside
        class="bg-white border-r border-gray-300 flex flex-col h-full z-40 md:w-72 md:static fixed top-0 left-0 w-full transform transition-transform duration-200"
        :class="{
          '-translate-x-full': isMobile && !showSidebar,
          'translate-x-0': isMobile && showSidebar,
        }"
      >
        <!-- Sidebar Header -->
        <div
          class="flex items-center justify-between p-4 border-b border-gray-300 bg-gray-50"
        >
          <div class="flex items-center gap-3">
            <div class="font-semibold text-sm">
              {{ t("dashboard.support.title") }}
            </div>
          </div>
          <div class="flex gap-3 text-gray-600">
            <button class="p-2 rounded-full hover:bg-gray-100">
              <i class="pi pi-ellipsis-v"></i>
            </button>
          </div>
        </div>

        <!-- Search -->
        <div class="p-3 border-b bg-gray-50">
          <input
            v-model="chatStore.search"
            @input="handleSearch"
            type="text"
            :placeholder="t('dashboard.support.search-or-start-new')"
            class="w-full text-sm px-3 py-2 rounded-full border border-gray-300 focus:outline-none"
          />
        </div>

        <!-- Chat List -->
        <div
          class="flex-1 overflow-y-auto"
          ref="chatListRef"
          @scroll.passive="onChatListScroll"
        >
          <div
            v-for="chat in chatStore.chats"
            :key="chat.id"
            @click="onChatClick(chat.id)"
            class="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100"
            :class="chatStore.activeChatId === chat.id ? 'bg-gray-100' : ''"
          >
            <div
              class="w-12 h-12 rounded-full bg-gradient-to-br from-green-300 to-green-500 flex items-center justify-center text-white font-semibold"
            >
              {{ (chat.users?.name || "U").charAt(0) }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-center">
                <div class="font-medium truncate">
                  {{ chat.users?.name || "Unknown" }}
                </div>
                <div class="text-xs text-gray-400">
                  {{
                    chat.lastMessage?.created
                      ? new Date(chat.lastMessage.created).toLocaleTimeString(
                          [],
                          { hour: "2-digit", minute: "2-digit" }
                        )
                      : ""
                  }}
                </div>
              </div>
              <div
                class="text-sm text-gray-500 truncate flex items-center gap-1"
              >
                <template
                  v-if="
                    chat.lastMessage?.type && chat.lastMessage.type !== 'text'
                  "
                >
                  <i
                    v-if="chat.lastMessage.type === 'image'"
                    class="pi pi-image text-gray-400"
                  ></i>
                  <i
                    v-else-if="chat.lastMessage.type === 'audio'"
                    class="pi pi-volume-up text-gray-400"
                  ></i>
                  <i
                    v-else-if="chat.lastMessage.type === 'file'"
                    class="pi pi-file text-gray-400"
                  ></i>
                  <span class="truncate">
                    {{ chat.lastMessage.type }}
                  </span>
                </template>
                <template v-else>
                  {{ chat.lastMessage?.message || "" }}
                </template>
              </div>
            </div>
          </div>

          <div
            v-if="chatStore.loadingChats"
            class="p-3 text-center text-sm text-gray-500"
          >
            {{ t("generic.loading") }}...
          </div>
        </div>
      </aside>

      <!-- Chat Window -->
      <section class="flex-1 flex flex-col relative">
        <!-- No Chat Selected -->
        <div
          v-if="!chatStore.activeChatId"
          class="flex-1 flex flex-col items-center justify-center bg-gray-200 gap-4 px-4"
        >
          <img
            src="../../assets/chatting.png"
            alt="Select a chat"
            class="w-64 h-64 object-contain opacity-50"
          />
          <h2 class="text-gray-500 text-lg font-medium">
            {{ t("dashboard.support.select-chat-placeholder") }}
          </h2>
          <p class="text-gray-400 text-sm text-center max-w-xs">
            {{ t("dashboard.support.select-chat-instructions") }}
          </p>
        </div>

        <!-- Chat UI -->
        <template v-else>
          <!-- Chat Header -->
          <div
            class="flex items-center justify-between p-4 border-b border-gray-300 bg-gray-50"
          >
            <div class="flex items-center gap-3">
              <button
                v-if="isMobile"
                @click="goBack"
                class="p-2 rounded-full hover:bg-gray-200"
              >
                <i class="pi pi-arrow-left text-gray-700"></i>
              </button>
              <div
                class="w-10 h-10 rounded-full bg-gradient-to-br from-green-300 to-green-500 flex items-center justify-center text-white font-semibold"
              >
                {{ (chatStore.activeChat?.users?.name || "U").charAt(0) }}
              </div>
              <div>
                <div class="font-medium">
                  {{ chatStore.activeChat?.users?.name }}
                </div>
                <div class="text-xs flex items-center gap-2">
                  <span
                    class="w-2 h-2 rounded-full"
                    :class="currentUserOnline ? 'bg-green-500' : 'bg-gray-400'"
                  ></span>
                  <span>
                    {{
                      currentUserOnline
                        ? t("dashboard.support.online")
                        : t("dashboard.support.offline")
                    }}
                  </span>
                </div>
              </div>
            </div>

            <div class="flex gap-4 text-gray-600">
              <i class="pi pi-search cursor-pointer"></i>
              <i class="pi pi-ellipsis-v cursor-pointer"></i>
            </div>
          </div>

          <!-- Messages -->
          <div
            ref="messagesRef"
            @scroll.passive="onMessageScroll"
            class="flex-1 p-6 overflow-y-auto chat-bg"
          >
            <div
              v-for="msg in chatStore.activeChat.messages"
              :key="msg.id"
              class="flex mb-2"
              :class="
                msg.sender_id === currentUser?.id
                  ? 'justify-start'
                  : 'justify-end'
              "
            >
              <div
                class="px-3 py-2 rounded-lg max-w-xs relative shadow-sm"
                :class="
                  msg.sender_id === currentUser?.id
                    ? 'bg-[#DCF8C6] rounded-br-none'
                    : 'bg-white rounded-bl-none'
                "
              >
                <p v-if="msg.type === 'text' || !msg.type" class="text-sm">
                  {{ msg.message }}
                </p>
                <div
                  v-else-if="msg.type === 'image'"
                  class="w-40 h-40 overflow-hidden rounded-md"
                >
                  <img
                    :src="getMediaUrl(msg.message)"
                    alt="image"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div
                  v-else-if="msg.type === 'audio'"
                  class="flex items-center gap-2"
                >
                  <audio controls :src="getMediaUrl(msg.message)"></audio>
                </div>
                <div
                  v-else-if="msg.type === 'file'"
                  class="flex flex-col gap-2"
                >
                  <div
                    class="border rounded-md overflow-hidden w-40 h-40 flex items-center justify-center bg-gray-50"
                  >
                    <i class="pi pi-file text-4xl text-gray-400"></i>
                  </div>
                  <div class="flex justify-between items-center w-40">
                    <div class="text-sm font-medium truncate">
                      {{
                        msg.fileName ||
                        (msg.message?.split?.("/").pop?.() ?? "")
                      }}
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ msg.size || "" }}
                    </div>
                  </div>
                  <a
                    v-if="msg.message"
                    :href="getMediaUrl(msg.message)"
                    target="_blank"
                    class="text-xs text-blue-600 hover:underline"
                    >{{ t("dashboard.support.open-download") }}</a
                  >
                </div>
                <span class="text-[10px] text-gray-500 block text-right mt-1">{{
                  msg.created
                    ? new Date(msg.created).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""
                }}</span>
                <span
                  v-if="msg.sender_id === currentUser?.id"
                  class="text-[10px] ml-1"
                >
                  {{ msg.is_read ? "✓✓" : "✓" }}
                </span>
              </div>
            </div>
            <div
              v-if="chatStore.loadingMessages"
              class="text-center text-gray-500 text-sm"
            >
              {{ t("generic.loading") }}...
            </div>
          </div>

          <!-- Preview before send -->
          <div
            v-if="selectedFile"
            class="p-3 border-t border-gray-300 bg-gray-50 flex items-center gap-3"
          >
            <!-- Image preview -->
            <img
              v-if="previewType === 'image'"
              :src="previewUrl"
              class="w-24 h-24 object-cover rounded-md"
            />

            <!-- Audio preview -->
            <audio
              v-else-if="previewType === 'audio'"
              controls
              :src="previewUrl"
              class="w-48"
            ></audio>

            <!-- Document preview -->
            <div
              v-else-if="previewType === 'document'"
              class="flex items-center gap-2"
            >
              <i class="pi pi-file text-4xl text-gray-400"></i>
              <span class="text-sm truncate">{{ selectedFile.name }}</span>
            </div>

            <!-- Cancel button -->
            <button
              @click="
                selectedFile = null;
                previewUrl = null;
                previewType = null;
              "
              class="ml-auto text-red-500 font-bold"
            >
              ✕
            </button>
          </div>

          <!-- Input -->
          <div
            class="p-3 border-t border-gray-300 bg-gray-50 flex items-center gap-3 relative"
          >
            <i class="pi pi-smile text-gray-500 text-xl cursor-pointer"></i>
            <div class="relative">
              <i
                class="pi pi-paperclip text-gray-500 text-xl cursor-pointer"
                @click="toggleAttachmentMenu"
              ></i>
              <transition name="fade">
                <div
                  v-if="showAttachmentMenu"
                  class="absolute bottom-full left-0 mb-2 bg-white shadow-lg rounded-lg p-2 w-30 space-y-2 z-50"
                >
                  <button
                    class="w-full text-start px-3 py-2 rounded-md hover:bg-gray-100 text-sm"
                    @click="documentInput.click()"
                  >
                    {{ t("dashboard.support.document") }}
                  </button>
                  <button
                    class="w-full text-start px-3 py-2 rounded-md hover:bg-gray-100 text-sm"
                    @click="imageInput.click()"
                  >
                    {{ t("dashboard.support.image") }}
                  </button>
                  <button
                    class="w-full text-start px-3 py-2 rounded-md hover:bg-gray-100 text-sm"
                    @click="audioInput.click()"
                  >
                    {{ t("dashboard.support.audio") }}
                  </button>

                  <input
                    type="file"
                    ref="documentInput"
                    class="hidden"
                    @change="handleDocument"
                  />
                  <input
                    type="file"
                    ref="imageInput"
                    class="hidden"
                    accept="image/*"
                    @change="handleImage"
                  />
                  <input
                    type="file"
                    ref="audioInput"
                    class="hidden"
                    accept="audio/*"
                    @change="handleAudio"
                  />
                </div>
              </transition>
            </div>
            <input
              v-model="newMessage"
              type="text"
              class="flex-1 rounded-full px-4 py-2 text-sm border border-gray-300 focus:outline-none"
              :placeholder="t('dashboard.support.type-message')"
              @keyup.enter="handleSend"
            />
            <div
              class="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white cursor-pointer"
              @click="handleSend"
            >
              <i class="pi pi-send"></i>
            </div>
          </div>
        </template>
      </section>
    </main>
  </DashboardLayout>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.chat-bg {
  background-image: url("../../assets/whatsapp-bg.png");
  background-size: cover;
  background-position: center;
}
</style>
