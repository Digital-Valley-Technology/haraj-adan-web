<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();

defineEmits(["document", "image", "audio"]);
</script>

<template>
  <div
    class="absolute bottom-full left-0 mb-2 bg-white shadow-lg rounded-lg p-2 w-30 space-y-2 z-50"
  >
    <button
      class="w-full text-start px-3 py-2 rounded-md hover:bg-gray-100 text-sm"
      @click="$emit('document')"
    >
      {{ t("dashboard.support.document") }}
    </button>
    <button
      class="w-full text-start px-3 py-2 rounded-md hover:bg-gray-100 text-sm"
      @click="$emit('image')"
    >
      {{ t("dashboard.support.image") }}
    </button>
    <button
      class="w-full text-start px-3 py-2 rounded-md hover:bg-gray-100 text-sm"
      @click="$emit('audio')"
    >
      {{ t("dashboard.support.audio") }}
    </button>
  </div>
</template>
