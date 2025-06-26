<script setup>
  import AppLayout from "../Layout/AppLayout.vue";
  import AppProductGrid from "../components/AppProductGrid.vue";
  import ProductCartCard from "../components/ProductCartCard.vue";
  import AppHero from "../components/AppHero.vue";
  import CartDetailsCard from "../components/CartDetailsCard.vue";
  import { ref, computed } from "vue";
  import { useProductsStore } from "../store/product";

  const categoryImage = ref("/images/cart.jpg");
  const productsStore = useProductsStore();
  const cartProducts = computed(() => productsStore.getCartProducts);
</script>

<template>
  <app-layout>
    <div class="page-wapper">
      <app-hero :image="categoryImage" title="products.cart"></app-hero>
      <div
        v-if="cartProducts?.length > 0"
        class="mt-4 custom-container grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-3 items-start"
      >
        <div class="md:col-span-2 order-last sm:order-last md:order-first">
          <product-cart-card
            v-for="(item, index) in cartProducts"
            :key="index"
            :cart-item="item"
          ></product-cart-card>
        </div>
        <cart-details-card></cart-details-card>
      </div>
      <div v-else class="grid place-items-center">
        <img class="w-36 h-36" src="/images/no-data.png" alt="No Data" />
      </div>
    </div>
  </app-layout>
</template>
