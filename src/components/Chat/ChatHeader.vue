<script setup>
import { useChatStore } from "../../store/chat";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const chatStore = useChatStore();

defineProps({
  isMobile: Boolean,
});
defineEmits(["goBack"]);
</script>

<template>
  <div
    class="flex items-center justify-between p-4 border-b border-gray-300 bg-gray-50"
  >
    <div class="flex items-center gap-3">
      <button
        v-if="isMobile"
        @click="$emit('goBack')"
        class="p-2 rounded-full hover:bg-gray-200"
      >
        <i class="pi pi-arrow-left text-gray-700"></i>
      </button>
      <div
        class="w-10 h-10 rounded-full bg-gradient-to-br from-green-300 to-green-500 flex items-center justify-center text-white font-semibold"
      >
        {{ (chatStore.activeChat?.name || "U").charAt(0) }}
      </div>
      <div>
        <div class="font-medium">{{ chatStore.activeChat?.name }}</div>
        <div class="text-xs text-gray-500">
          {{ t("dashboard.support.online") }}
        </div>
      </div>
    </div>
    <div class="flex gap-4 text-gray-600">
      <i class="pi pi-search cursor-pointer"></i>
      <i class="pi pi-ellipsis-v cursor-pointer"></i>
    </div>
  </div>
</template>
