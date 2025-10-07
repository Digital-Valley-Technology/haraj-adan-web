<script setup>
import { useChatStore } from "../../store/chat";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const chatStore = useChatStore();

defineProps({
  isMobile: Boolean,
  showSidebar: Boolean,
});
defineEmits(["chat-click"]);
</script>

<template>
  <aside
    class="bg-white border-r border-gray-300 flex flex-col h-full z-40 md:w-72 md:static fixed top-0 left-0 w-full transition-transform duration-200"
    :class="{
      '-translate-x-full': isMobile && !showSidebar,
      'translate-x-0': isMobile && showSidebar,
    }"
  >
    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b bg-gray-50">
      <div class="font-semibold text-sm">
        {{ t("dashboard.support.title") }}
      </div>
      <button class="p-2 rounded-full hover:bg-gray-100">
        <i class="pi pi-ellipsis-v"></i>
      </button>
    </div>

    <!-- Search -->
    <div class="p-3 border-b bg-gray-50">
      <input
        type="text"
        :placeholder="t('dashboard.support.search-or-start-new')"
        class="w-full text-sm px-3 py-2 rounded-full border border-gray-300 focus:outline-none"
      />
    </div>

    <!-- Chat list -->
    <div class="flex-1 overflow-y-auto">
      <div
        v-for="chat in chatStore.chats"
        :key="chat.id"
        @click="$emit('chat-click', chat.id)"
        class="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100"
        :class="chatStore.activeChatId === chat.id ? 'bg-gray-100' : ''"
      >
        <div
          class="w-12 h-12 rounded-full bg-gradient-to-br from-green-300 to-green-500 flex items-center justify-center text-white font-semibold"
        >
          {{ (chat.name || "U").charAt(0) }}
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-center">
            <div class="font-medium truncate">{{ chat.name }}</div>
            <div class="text-xs text-gray-400">
              {{ chat.messages?.[chat.messages.length - 1]?.time || "" }}
            </div>
          </div>
          <div class="text-sm text-gray-500 truncate">
            {{ chat.lastMessage }}
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>
