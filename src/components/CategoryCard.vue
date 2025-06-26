<template>
  <router-link
    :to="{
      name: `category-products`,
      params: {
        categoryId: encode(category?.id),
      },
      query: {
        categoryName: encode(
          JSON.stringify({
            name: category?.name,
            name_en: category?.name_en,
          })
        ),
        categoryImage: encode(category?.image),
      },
    }"
    class="no-underline"
  >
    <div class="flex flex-col items-center py-8 cursor-pointer group">
      <div
        class="w-[80px] h-[80px] md:w-[120px] md:h-[120px] lg:w-[140px] lg:h-[140px] rounded-full overflow-hidden shadow-xl mb-2"
      >
        <img
          :src="category?.image"
          :alt="currentLang === 'en' ? category?.name_en : category?.name"
          class="w-full h-full object-cover group-hover:scale-115 transition-transform duration-300 ease-in-out"
        />
      </div>
      <span class="text-xs md:text-sm text-center">{{
        currentLang === "en" ? category?.name_en : category?.name
      }}</span>
    </div>
  </router-link>
</template>

<script setup>
  import { useI18n } from "vue-i18n";
  import { computed } from "vue";
  import { useGeneralStore } from "../store/general";
  import { encode } from "js-base64";

  const props = defineProps(["category"]);
  const generalStore = useGeneralStore();
  const currentLang = computed(() => generalStore?.getLang);
</script>
