<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
import { useAdminMonitorStore } from "../../store/adminMonitorStore";
import DashboardLayout from "../../Layout/DashboardLayout.vue";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "../../store/auth";
import { MEDIA_URL } from "../../services/axios";

const { t } = useI18n();
const chatStore = useAdminMonitorStore();
const authStore = useAuthStore();

const screenWidth = ref(window.innerWidth);
const isMobile = computed(() => screenWidth.value < 768);
const currentUser = computed(() => authStore.getUser);
const showSidebar = ref(true);

const chatListRef = ref(null);
const messagesRef = ref(null);

// --- Computed & Helper Properties ---

/**
 * CORRECTED: Gets the first name's initial in the chat for the avatar.
 * Reads directly from the first member object's name property.
 */
const getChatAvatarInitial = (chat) => {
  return chat.members?.[0]?.name?.charAt(0) || "C";
};

// --- Core Actions ---

watch(
  () => chatStore.activeChat?.messages,
  async (messages) => {
    if (!messages) return;
    await nextTick();
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight;
    }
  },
  { deep: true }
);

const onMessageScroll = async () => {
  const el = messagesRef.value;
  if (!el || chatStore.loadingMessages || !chatStore.hasMoreMessages) return;

  if (el.scrollTop <= 50) {
    const prevHeight = el.scrollHeight;
    await chatStore.fetchMessages(chatStore.activeChatId, { prepend: true });
    await nextTick();
    el.scrollTop = el.scrollHeight - prevHeight;
  }
};

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

const onChatListScroll = async () => {
  const el = chatListRef.value;
  if (!el || chatStore.loadingChats || !chatStore.hasMoreChats) return;
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
    await chatStore.fetchChats({ append: true });
  }
};

const handleSearch = async () => {
  await chatStore.resetAndFetchChats();
};

const handleResize = () => (screenWidth.value = window.innerWidth);
const getMediaUrl = (path) => `${MEDIA_URL}/${path}`;

onMounted(async () => {
  window.addEventListener("resize", handleResize);
  chatStore.setActiveChat(null);
  await chatStore.fetchChats();
  chatStore.listenForMessages();
  console.log(chatStore?.chats);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<template>
  <DashboardLayout>
    <main class="flex h-[calc(100vh-64px)] bg-gray-100">
      <aside
        class="bg-white border-r border-gray-300 flex flex-col h-full z-40 md:w-80 md:static fixed top-0 left-0 w-full transform transition-transform duration-200"
        :class="{
          '-translate-x-full': isMobile && !showSidebar,
          'translate-x-0': isMobile && showSidebar,
        }"
      >
        <div
          class="flex items-center justify-between p-4 border-b border-gray-300 bg-gray-50"
        >
          <div class="flex items-center gap-3">
            <div class="font-semibold text-sm">
              {{ t("dashboard.monitor.title", "Chat Monitor") }}
            </div>
          </div>
        </div>

        <div class="p-3 border-b bg-gray-50">
          <input
            v-model="chatStore.search"
            @input="handleSearch"
            type="text"
            :placeholder="t('dashboard.monitor.search', 'Search users...')"
            class="w-full text-sm px-3 py-2 rounded-full border border-gray-300 focus:outline-none"
          />
        </div>

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
              class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center text-white font-semibold"
            >
              {{ getChatAvatarInitial(chat) }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-center">
                <div class="font-medium truncate text-base">
                  {{ chatStore.getChatMembersNames(chat) }}
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
                <i
                  v-if="chat.lastMessage?.sender_id === currentUser?.id"
                  class="pi pi-check text-xs text-blue-400"
                ></i>
                <span class="text-gray-400">
                  {{ chat.lastMessage?.users?.name?.split(" ")[0] || "User" }}:
                </span>
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

      <section class="flex-1 flex flex-col relative">
        <div
          v-if="!chatStore.activeChatId"
          class="flex-1 flex flex-col items-center justify-center bg-gray-200 gap-4 px-4"
        >
          <h2 class="text-gray-500 text-lg font-medium">
            {{
              t("dashboard.monitor.select", "Select a conversation to monitor.")
            }}
          </h2>
        </div>

        <template v-else>
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
                class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center text-white font-semibold"
              >
                {{ chatStore.activeChat.names?.charAt(0) || "C" }}
              </div>
              <div>
                <div class="font-medium">
                  {{ chatStore.activeChat.names }}
                </div>
                <div class="text-xs text-gray-500">Monitoring Live Chat</div>
              </div>
            </div>

            <div class="flex gap-4 text-gray-600">
              <i class="pi pi-ellipsis-v cursor-pointer"></i>
            </div>
          </div>

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
                msg.sender_id === chatStore.activeChat.rightSideUserId
                  ? 'justify-end'
                  : 'justify-start'
              "
            >
              <div
                class="flex flex-col"
                :class="
                  msg.sender_id === chatStore.activeChat.rightSideUserId
                    ? 'items-end'
                    : 'items-start'
                "
              >
                <span class="text-[10px] font-semibold text-gray-600 mb-1">
                  {{ msg.users?.name || "Unknown" }}
                </span>
                <div
                  class="px-3 py-2 rounded-lg max-w-xs relative shadow-sm"
                  :class="
                    msg.sender_id === chatStore.activeChat.rightSideUserId
                      ? // Right Side User (Participant B) color
                        'bg-blue-100 rounded-br-none'
                      : // Left Side User (Participant A) color
                        'bg-white rounded-bl-none'
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
                    <a
                      v-if="msg.message"
                      :href="getMediaUrl(msg.message)"
                      target="_blank"
                      class="text-xs text-blue-600 hover:underline"
                      >View File</a
                    >
                  </div>

                  <span class="text-[10px] text-gray-500 block text-right mt-1"
                    >{{
                      msg.created
                        ? new Date(msg.created).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""
                    }}
                    <span
                      v-if="msg.is_read"
                      class="text-[10px] ml-1 text-blue-500"
                    >
                      ✓✓
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div
              v-if="chatStore.loadingMessages"
              class="text-center text-gray-500 text-sm"
            >
              {{ t("generic.loading") }}...
            </div>
          </div>

          <div
            class="p-3 border-t border-gray-300 bg-gray-50 flex items-center justify-center text-sm font-medium text-gray-600"
          >
            <i class="pi pi-eye mr-2"></i>
            {{
              t(
                "dashboard.monitor.status",
                "Monitoring: Admin View (Read Only)"
              )
            }}
          </div>
        </template>
      </section>
    </main>
  </DashboardLayout>
</template>

<style scoped>
.chat-bg {
  background-image: url("../../assets/whatsapp-bg.png");
  background-size: cover;
  background-position: center;
}
</style>
