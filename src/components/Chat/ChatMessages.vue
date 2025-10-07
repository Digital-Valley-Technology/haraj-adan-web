<script setup>
import { useChatStore } from "../../store/chat";

const chatStore = useChatStore();
</script>

<template>
  <div class="flex-1 p-6 overflow-y-auto chat-bg">
    <div
      v-for="msg in chatStore.activeChat?.messages"
      :key="msg.id"
      class="flex mb-2"
      :class="msg.sender === 'me' ? 'justify-end' : 'justify-start'"
    >
      <div
        class="px-3 py-2 rounded-lg max-w-xs relative shadow-sm"
        :class="
          msg.sender === 'me'
            ? 'bg-[#DCF8C6] rounded-br-none'
            : 'bg-white rounded-bl-none'
        "
      >
        <!-- Text -->
        <p v-if="msg.type === 'text'" class="text-sm">{{ msg.text }}</p>

        <!-- Image -->
        <div
          v-else-if="msg.type === 'image'"
          class="w-40 h-40 overflow-hidden rounded-md"
        >
          <img :src="msg.url" alt="image" class="w-full h-full object-cover" />
        </div>

        <!-- Audio -->
        <div v-else-if="msg.type === 'audio'" class="flex items-center gap-2">
          <audio controls :src="msg.url"></audio>
        </div>

        <!-- Document -->
        <div v-else-if="msg.type === 'document'" class="flex flex-col gap-2">
          <div
            v-if="msg.url"
            class="border rounded-md overflow-hidden w-40 h-40 flex items-center justify-center bg-gray-50"
          >
            <iframe
              v-if="msg.fileType === 'pdf'"
              :src="msg.url"
              class="w-full h-full"
              frameborder="0"
            ></iframe>
            <img
              v-else-if="msg.fileType.startsWith('image')"
              :src="msg.url"
              class="w-full h-full object-cover"
            />
            <i v-else class="pi pi-file text-4xl text-gray-400"></i>
          </div>

          <div class="flex justify-between items-center w-40">
            <div class="text-sm font-medium truncate">{{ msg.fileName }}</div>
            <div class="text-xs text-gray-500">{{ msg.size }}</div>
          </div>

          <a
            v-if="msg.url"
            :href="msg.url"
            target="_blank"
            class="text-xs text-blue-600 hover:underline"
          >
            Open / Download
          </a>
        </div>

        <!-- Time -->
        <span class="text-[10px] text-gray-500 block text-right mt-1">
          {{ msg.time }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-bg {
  background-image: url("../../assets/whatsapp-bg.png");
  background-size: cover;
  background-position: center;
}
</style>
