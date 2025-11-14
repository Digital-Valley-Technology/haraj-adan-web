<template>
  <div class="ad-detail flex flex-col justify-center p-2">
    <div class="flex justify-between items-center">
      <p>{{ currentLocale == "ar" ? detail?.label : detail?.label_en }}</p>
      <p>{{ currentLocale == "ar" ? detail?.value : detail?.value_en }}</p>
    </div>

    <hr class="my-2 border-gray-300" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
defineProps(["detail"]);

const { locale } = useI18n();

const currentLocale = computed(() => locale.value || "ar");
</script>

<style scoped>
.ad-detail:last-child hr {
  display: none;
}
</style>
