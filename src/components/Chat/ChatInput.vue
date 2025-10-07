<script setup>
import { ref } from "vue";
import { useChatStore } from "../../store/chat";
import { useI18n } from "vue-i18n";
import ChatAttachmentMenu from "./ChatAttachmentMenu.vue";
import { nanoid } from "nanoid";

const { t } = useI18n();
const chatStore = useChatStore();

const newMessage = ref("");
const showAttachmentMenu = ref(false);

const documentInput = ref(null);
const imageInput = ref(null);
const audioInput = ref(null);

const toggleAttachmentMenu = () => {
  showAttachmentMenu.value = !showAttachmentMenu.value;
};

const handleSend = () => {
  if (newMessage.value.trim()) {
    chatStore.sendMessage(chatStore.activeChatId, newMessage.value);
    newMessage.value = "";
  }
};

const handleDocument = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  chatStore.chats
    .find((c) => c.id === chatStore.activeChatId)
    ?.messages.push({
      id: nanoid(),
      type: "document",
      sender: "me",
      fileName: file.name,
      url: URL.createObjectURL(file),
      size: Math.round(file.size / 1024) + " KB",
      fileType: file.type,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  showAttachmentMenu.value = false;
};

const handleImage = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  chatStore.chats
    .find((c) => c.id === chatStore.activeChatId)
    ?.messages.push({
      id: nanoid(),
      type: "image",
      sender: "me",
      url: URL.createObjectURL(file),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  showAttachmentMenu.value = false;
};

const handleAudio = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  chatStore.chats
    .find((c) => c.id === chatStore.activeChatId)
    ?.messages.push({
      id: nanoid(),
      type: "audio",
      sender: "me",
      url: URL.createObjectURL(file),
      duration: "0:00",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  showAttachmentMenu.value = false;
};
</script>

<template>
  <div
    class="p-3 border-t border-gray-300 bg-gray-50 flex items-center gap-3 relative"
  >
    <i class="pi pi-smile text-gray-500 text-xl cursor-pointer"></i>

    <div class="relative">
      <i
        class="pi pi-paperclip text-gray-500 text-xl cursor-pointer"
        @click="toggleAttachmentMenu"
      ></i>

      <ChatAttachmentMenu
        v-if="showAttachmentMenu"
        @document="documentInput.click()"
        @image="imageInput.click()"
        @audio="audioInput.click()"
      />

      <!-- Hidden Inputs -->
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
      <i class="pi pi-microphone"></i>
    </div>
  </div>
</template>
