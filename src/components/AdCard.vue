<template>
  <div
    class="w-full max-w-96 bg-white rounded-md shadow-md overflow-hidden cursor-pointer p-3"
    @click="goToAdDetails(item.id)"
  >
    <div class="flex gap-2">
      <div class="w-20">
        <img
          :src="item?.src"
          :alt="item?.alt"
          class="w-full h-20 object-cover rounded-md"
        />
      </div>
      <!-- Card Info -->
      <div class="flex flex-col justify-center">
        <h3 class="mb-1 text-sm font-normal">
          {{ i18?.locale.value == "ar" ? item.name : item.name_en }}
        </h3>
        <div class="flex items-center gap-1 mb-1">
          <i class="pi pi-map-marker text-gray-500"></i>
          <p class="text-xs text-gray-500 font-medium">
            {{ i18?.locale.value == "ar" ? item.location : item.location_en }}
          </p>
        </div>
        <span class="text-[#146AAB] font-semibold text-xs"
          >$ {{ item.price }}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

defineProps(["item"]);
const i18 = useI18n();
const router = useRouter();

const goToAdDetails = (id) => {
  router.push({ name: "ad-details", params: { id } });
};
</script>
