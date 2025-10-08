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
        @click.stop="toggleFavorite"
      >
        <i
          v-if="isFavorite"
          class="pi pi-heart-fill text-[#ff0033] opacity-100"
        ></i>
        <i v-else class="pi pi-heart text-white"></i>
      </button>

      <!-- Featured -->
      <span
        class="absolute left-2 bottom-2 py-2 px-1 text-[10px] font-normal rounded-lg bg-[#FFE800]"
        >Featured</span
      >
    </div>
  </div>
  <p class="font-normal text-xs">
    {{ i18?.locale.value == "ar" ? item.name : item.name_en }}
  </p>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const i18 = useI18n();
defineProps({
  item: {
    type: Object,
    default: null,
  },
});

const isFavorite = ref(false);

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value;
};

const router = useRouter();

const goToAdDetails = (id) => {
  router.push({ name: "ad-details", params: { id } });
};
</script>
