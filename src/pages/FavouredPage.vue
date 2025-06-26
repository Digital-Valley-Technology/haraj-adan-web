<script setup>
  import AppLayout from "../Layout/AppLayout.vue";
  import AppProductGrid from "../components/AppProductGrid.vue";
  import AppHero from "../components/AppHero.vue";
  import { ref, computed } from "vue";
  import { useProductsStore } from "../store/product";

  const categoryImage = ref("/images/favoured.jpg");
  const productsStore = useProductsStore();
  const favouredProducts = computed(() => productsStore.getFavouredProducts);
</script>

<template>
  <app-layout>
    <div class="page-wapper">
      <app-hero :image="categoryImage" title="products.favoured"></app-hero>
      <app-product-grid
        v-if="favouredProducts.length > 0"
        class="mb-8"
        :products="favouredProducts"
      ></app-product-grid>
      <div v-else class="grid place-items-center">
        <img class="w-36 h-36" src="/images/no-data.png" alt="No Data" />
      </div>
    </div>
  </app-layout>
</template>
