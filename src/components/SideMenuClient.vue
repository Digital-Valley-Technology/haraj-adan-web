<template>
  <aside class="w-full md:w-80 bg-white rounded-lg px-6 py-4 h-fit">
    <!-- Show skeleton while loading -->
    <template v-if="loading">
      <div
        v-for="n in 6"
        :key="n"
        class="animate-pulse h-12 bg-gray-200 rounded-md mb-3"
      ></div>
    </template>

    <!-- Actual content -->
    <template v-else>
      <category-side-card
        v-for="category in categories"
        :key="category?.id"
        :category="category"
      ></category-side-card>
    </template>
  </aside>
</template>

<script setup>
import { onMounted } from "vue";
import CategorySideCard from "./CategorySideCard.vue";
import { useHomeStore } from "../store/home";
import { computed } from "vue";

const homeStore = useHomeStore();
const categories = computed(() => homeStore?.getSideMenuCategories);
const loading = computed(() => homeStore?.getSideMenuCategoriesLoading);

onMounted(() => {
  homeStore?.fetchSideMenuCategories();
});
</script>
