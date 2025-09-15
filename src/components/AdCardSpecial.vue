<template>
  <div
    class="w-full aspect-square rounded-md shadow-md overflow-hidden cursor-pointer mb-3"
    @click="goToAdDetails(item.id)"
  >
    <!-- Image and Favorite Button -->
    <div class="relative overflow-hidden w-full h-full">
      <img
        :src="item?.src"
        :alt="item?.alt"
        class="w-full h-full object-cover"
      />

      <!-- Favorite Button -->
      <button
        class="absolute top-2 right-2 opacity-55 p-2 rounded-full bg-[#bebebe] shadow cursor-pointer grid place-items-center border border-gray-200"
      >
        <i class="pi pi-heart text-white"></i>
      </button>
    </div>
  </div>
  <p class="font-normal text-xs">
    {{ i18?.locale.value == "ar" ? item.name : item.name_en }}
  </p>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const i18 = useI18n();
defineProps({
  item: {
    type: Object,
    default: null,
  },
});

const router = useRouter();

const goToAdDetails = (id) => {
  router.push({ name: "ad-details", params: { id } });
};
</script>
