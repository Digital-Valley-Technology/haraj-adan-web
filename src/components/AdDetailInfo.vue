<template>
  <div class="ad-detail flex flex-col justify-center p-2">
    <div class="flex justify-between items-center">
      <p>{{ i18?.locale.value == "ar" ? detail.label : detail.label_en }}</p>
      <p>{{ i18?.locale.value == "ar" ? detail.value : detail.value_en }}</p>
    </div>

    <hr class="my-2 border-gray-300" />
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
defineProps(["detail"]);

const i18 = useI18n();
</script>

<style scoped>
.ad-detail:last-child hr {
  display: none;
}
</style>
