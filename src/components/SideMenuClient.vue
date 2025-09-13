<template>
  <aside class="w-80 bg-white rounded-lg px-6 py-4 h-fit">
    <category-side-card
      v-for="category in categories"
      :key="category?.id"
      :category="category"
    ></category-side-card>
  </aside>
</template>

<script setup>
import CategorySideCard from "./CategorySideCard.vue";
import { adsCategories } from "../data/index";
import { ref } from "vue";

const categories = ref(adsCategories);
</script>
