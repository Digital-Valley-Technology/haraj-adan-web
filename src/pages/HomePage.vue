<script setup>
  import AppLayout from "../Layout/AppLayout.vue";
  import AppImageSlider from "../components/AppImageSlider.vue";
  import CategorySlider from "../components/CategorySlider.vue";
  import ProductsSlider from "../components/ProductsSlider.vue";
  import AppProductGrid from "../components/AppProductGrid.vue";
  import BannerDouble from "../components/BannerDouble.vue";
  import { computed } from "vue";
  import { useProductsStore } from "../store/product";

  const productStore = useProductsStore();

  const homePageProducts = computed(() => productStore?.getHomePageProducts);
  const bestSellingProducts = computed(
    () => productStore?.getBestSellingProducts
  );
  const specialOffers = computed(() => productStore?.specialOffers);
</script>

<template>
  <app-layout>
    <div class="page-wapper">
      <app-image-slider class="md:mb-8"></app-image-slider>
      <category-slider class="md:mb-8"></category-slider>
      <!-- best sellers -->
      <h3 class="text-xl font-bold custom-container">
        {{ $t("home.best-seller") }}
      </h3>
      <products-slider
        class="mb-8"
        :products="bestSellingProducts"
      ></products-slider>
      <!-- special offers banner -->
      <banner-double
        image-one="/images/special/1.jpg"
        image-two="/images/special/2.jpg"
        class="mb-8 hidden md:grid"
      ></banner-double>
      <banner-single
        image="/images/special/1.jpg"
        class="mb-8 md:hidden"
      ></banner-single>
      <!-- special offers -->
      <h3 class="text-xl font-bold custom-container">
        {{ $t("home.special") }}
      </h3>
      <products-slider class="mb-8" :products="specialOffers"></products-slider>
      <!-- another special offers banner -->
      <banner-single
        image="/images/special/2.jpg"
        class="mb-8 md:hidden"
      ></banner-single>
      <!-- products grid -->
      <h3 class="text-xl font-bold custom-container">
        {{ $t("home.products") }}
      </h3>
      <app-product-grid
        class="mb-8"
        :products="homePageProducts"
      ></app-product-grid>
    </div>
  </app-layout>
</template>

<style scoped></style>
