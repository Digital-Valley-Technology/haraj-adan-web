<template>
  <div
    class="flex flex-col items-center justify-center py-10 text-center text-gray-500"
  >
    <img
      src="https://placehold.co/120x120/EEEEEE/999999?text=No+Ads"
      alt="Empty"
      class="mb-4 opacity-70"
    />

    <h3 class="text-lg font-semibold text-gray-700 mb-1">
      {{ t(title) }}
    </h3>

    <p class="text-sm text-gray-500">
      {{ t(message) }}
    </p>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps({
  title: { type: String, default: "empty.default_title" },
  message: { type: String, default: "empty.default_message" },
});
</script>
