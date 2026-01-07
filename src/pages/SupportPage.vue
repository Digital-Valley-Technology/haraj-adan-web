<script setup>
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { useI18n } from "vue-i18n";
import AppLayout from "../Layout/AppLayout.vue";
import { useCustomerChatStore } from "../store/customerChat";
import { MEDIA_URL } from "../services/axios";

const { locale } = useI18n();
const chatStore = useCustomerChatStore();

const newMessage = ref("");
const selectedFile = ref(null);
const previewUrl = ref(null);
const previewType = ref(null);
const messagesRef = ref(null);

const messages = computed(() => chatStore.getMessages);
const getMediaUrl = (path) => `${MEDIA_URL}/${path}`;

onMounted(async () => {
  await chatStore.fetchUserChat();
  chatStore.listenForMessages();
  await nextTick(scrollToBottom);
});

watch(
  () => messages.value.length,
  async (newLen, oldLen) => {
    if (newLen > oldLen) await nextTick(scrollToBottom);
  }
);

const scrollToBottom = () => {
  const el = messagesRef.value;
  if (el) el.scrollTop = el.scrollHeight;
};

/**
 * Infinite scroll — load older messages when near top
 */
const handleScroll = async () => {
  const el = messagesRef.value;
  if (!el || chatStore.loadingMessages || !chatStore.hasMoreMessages) return;
  if (el.scrollTop <= 100) {
    const oldHeight = el.scrollHeight;
    await chatStore.fetchUserChat({ append: true });
    await nextTick(() => {
      el.scrollTop = el.scrollHeight - oldHeight;
    });
  }
};

const handleFileSelect = (file, type) => {
  if (!file) return;
  selectedFile.value = file;
  previewType.value = type;
  previewUrl.value = URL.createObjectURL(file);
};

const handleSend = async () => {
  // If sending a file
  if (selectedFile.value) {
    await chatStore.sendMediaMessage(selectedFile.value, previewType.value);
    selectedFile.value = null;
    previewUrl.value = null;
    previewType.value = null;
    return;
  }

  // If sending text
  if (newMessage.value.trim()) {
    const content = newMessage.value.trim();
    newMessage.value = "";
    await chatStore.sendCustomerMessage(content);
  }
};

const cancelFileSelection = () => {
  selectedFile.value = null;
  previewUrl.value = null;
  previewType.value = null;
};

const getFileIcon = (filename) => {
  const ext = filename?.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "pdf":
      return "pi pi-file-pdf text-red-500";
    case "doc":
    case "docx":
      return "pi pi-file-word text-blue-500";
    case "xls":
    case "xlsx":
      return "pi pi-file-excel text-green-500";
    case "ppt":
    case "pptx":
      return "pi pi-file-powerpoint text-orange-500";
    case "zip":
    case "rar":
      return "pi pi-file-zip text-yellow-500";
    default:
      return "pi pi-file text-gray-400";
  }
};

const markVisibleMessagesAsRead = () => {
  // 1. نحن العميل، لذا نريد قراءة رسائل "المشرف" (is_admin: true) التي لم تقرأ بعد (is_read: false)
  const unreadAdminMessages = chatStore.getMessages
    .filter((m) => m.is_admin && !m.is_read)
    .map((m) => m.id);

  if (unreadAdminMessages.length > 0) {
    chatStore.markMessagesAsRead(unreadAdminMessages);
  }
};

watch(
  () => messages.value,
  async (newMessages) => {
    if (newMessages.length > 0) {
      // ننتظر قليلاً حتى يتم عرض الرسائل (NextTick)
      await nextTick();
      markVisibleMessagesAsRead();

      // السكرول للأسفل (موجود سابقاً في watch length ولكن نضعه هنا للتأكيد)
      // scrollToBottom();
    }
  },
  { deep: true, immediate: true }
);
</script>

<template>
  <app-layout>
    <main class="min-h-[80vh] mx-auto p-4">
      <div class="bg-white rounded-lg h-fit flex-1">
        <!-- Header -->
        <div
          class="flex justify-between items-center py-2 px-4 mb-4 rounded-t-lg p-1 bg-[#146AAB]"
        >
          <p class="text-white text-sm">
            {{ locale == "ar" ? "الدعم الفني" : "Customer Support" }}
          </p>
          <i class="pi pi-phone text-white"></i>
        </div>

        <!-- Messages -->
        <div
          ref="messagesRef"
          @scroll="handleScroll"
          class="flex flex-col gap-4 p-4 h-[60vh] overflow-y-auto"
        >
          <div
            v-if="chatStore.loadingMessages && chatStore.messagePage === 1"
            class="text-center text-gray-400"
          >
            {{ locale == "ar" ? "جار التحميل..." : "Loading..." }}
          </div>

          <template v-for="msg in messages" :key="msg.id">
            <!-- Admin Message -->
            <div v-if="msg.is_admin" class="flex justify-start">
              <div class="bg-gray-100 rounded-b-lg rounded-tl-lg p-2 max-w-xs">
                <template v-if="msg.type === 'text' || !msg.type">
                  <p>{{ msg.message }}</p>
                </template>

                <template v-else-if="msg.type === 'image'">
                  <img
                    :src="getMediaUrl(msg.message)"
                    class="w-40 h-40 rounded-md object-cover"
                  />
                </template>

                <template v-else-if="msg.type === 'audio'">
                  <audio controls :src="getMediaUrl(msg.message)"></audio>
                </template>

                <template v-else-if="msg.type === 'file'">
                  <div
                    class="flex items-center gap-2 bg-white p-2 rounded-md border"
                  >
                    <i :class="getFileIcon(msg.message)" class="text-2xl"></i>
                    <a
                      :href="getMediaUrl(msg.message)"
                      target="_blank"
                      class="text-blue-600 underline text-sm truncate max-w-[150px]"
                    >
                      {{ msg.message.split("/").pop() }}
                    </a>
                  </div>
                  <iframe
                    v-if="msg.message.endsWith('.pdf')"
                    :src="getMediaUrl(msg.message)"
                    class="w-32 h-32 border rounded-md mt-1"
                  ></iframe>
                </template>
              </div>
            </div>

            <!-- Customer Message -->
            <div v-else class="flex justify-end">
              <div
                class="bg-[#146AAB] text-white rounded-b-lg rounded-tr-lg p-2 max-w-xs"
              >
                <template v-if="msg.type === 'text' || !msg.type">
                  <p>{{ msg.message }}</p>
                </template>

                <template v-else-if="msg.type === 'image'">
                  <img
                    :src="getMediaUrl(msg.message)"
                    class="w-40 h-40 rounded-md object-cover"
                  />
                </template>

                <template v-else-if="msg.type === 'audio'">
                  <audio controls :src="getMediaUrl(msg.message)"></audio>
                </template>

                <template v-else-if="msg.type === 'file'">
                  <div
                    class="flex items-center gap-2 bg-[#146AAB]/80 p-2 rounded-md border border-white/20"
                  >
                    <i :class="getFileIcon(msg.message)" class="text-2xl"></i>
                    <a
                      :href="getMediaUrl(msg.message)"
                      target="_blank"
                      class="text-white underline text-sm truncate max-w-[150px]"
                    >
                      {{ msg.message.split("/").pop() }}
                    </a>
                  </div>
                  <iframe
                    v-if="msg.message.endsWith('.pdf')"
                    :src="getMediaUrl(msg.message)"
                    class="w-32 h-32 border rounded-md mt-1 bg-white"
                  ></iframe>
                </template>
              </div>
            </div>
          </template>

          <div
            v-if="chatStore.loadingMessages && chatStore.messagePage > 1"
            class="text-center text-gray-400"
          >
            {{
              locale == "ar"
                ? "تحميل الرسائل السابقة..."
                : "Loading older messages..."
            }}
          </div>
        </div>

        <!-- File Preview -->
        <div
          v-if="selectedFile"
          class="p-3 border-t border-gray-300 bg-gray-50 flex items-center gap-3"
        >
          <img
            v-if="previewType === 'image'"
            :src="previewUrl"
            class="w-24 h-24 object-cover rounded-md"
          />
          <audio
            v-else-if="previewType === 'audio'"
            controls
            :src="previewUrl"
            class="w-48"
          ></audio>
          <div
            v-else-if="previewType === 'file'"
            class="flex items-center gap-3 bg-white p-2 rounded-md border"
          >
            <i :class="getFileIcon(selectedFile.name)" class="text-4xl"></i>
            <div>
              <span class="text-sm font-medium block truncate max-w-[200px]">
                {{ selectedFile.name }}
              </span>
              <iframe
                v-if="selectedFile.type === 'application/pdf'"
                :src="previewUrl"
                class="w-24 h-24 border rounded-md mt-1"
              ></iframe>
            </div>
          </div>
          <button
            @click="cancelFileSelection"
            class="ml-auto text-red-500 font-bold"
          >
            ✕
          </button>
        </div>

        <!-- Input -->
        <div class="flex items-center gap-1 p-4 border-t border-gray-200">
          <i
            class="pi pi-image text-[#c0c0c1] cursor-pointer"
            @click="$refs.imageInput.click()"
          ></i>
          <i
            class="pi pi-folder text-[#c0c0c1] cursor-pointer"
            @click="$refs.documentInput.click()"
          ></i>
          <i
            class="pi pi-headphones text-[#c0c0c1] cursor-pointer"
            @click="$refs.audioInput.click()"
          ></i>

          <input
            ref="documentInput"
            type="file"
            class="hidden"
            @change="(e) => handleFileSelect(e.target.files[0], 'file')"
          />
          <input
            ref="imageInput"
            type="file"
            class="hidden"
            accept="image/*"
            @change="(e) => handleFileSelect(e.target.files[0], 'image')"
          />
          <input
            ref="audioInput"
            type="file"
            class="hidden"
            accept="audio/*"
            @change="(e) => handleFileSelect(e.target.files[0], 'audio')"
          />

          <input
            v-model="newMessage"
            type="text"
            :disabled="!!selectedFile"
            :placeholder="
              selectedFile
                ? locale == 'ar'
                  ? 'أرسل الملف المحدد أولاً...'
                  : 'Send the selected file first...'
                : locale == 'ar'
                ? 'اكتب رسالة ...'
                : 'Type a message...'
            "
            class="bg-[##c0c0c1] px-2 py-1 rounded-lg border border-[#c0c0c1] w-full disabled:opacity-70 disabled:cursor-not-allowed"
            @keyup.enter="handleSend"
          />

          <i
            class="pi pi-send text-[#146AAB] cursor-pointer"
            @click="handleSend"
          ></i>
        </div>
      </div>
    </main>
  </app-layout>
</template>
