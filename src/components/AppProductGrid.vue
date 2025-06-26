<script setup>
  import ProductCard from "./ProductCard.vue";
  defineProps(["products"]);
</script>

<template>
  <div class="product-grid mt-4 custom-container grid gap-4">
    <product-card
      v-for="product in products"
      :key="product.id"
      :product="product"
      class="w-full"
    ></product-card>
  </div>
</template>

<style scoped>
  .product-grid {
    grid-template-columns: 1fr;
  }
  @media screen and (min-width: 340px) {
    .product-grid {
      grid-template-columns: 1fr 1fr;
    }
  }
  @media screen and (min-width: 550px) {
    .product-grid {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }
  @media screen and (min-width: 768px) {
    .product-grid {
      grid-template-columns: 1fr 1fr 1fr 1fr;
    }
  }
</style>
