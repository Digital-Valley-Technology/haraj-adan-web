<script setup>
  import AppLayout from "../Layout/AppLayout.vue";
  import AppProductGrid from "../components/AppProductGrid.vue";
  import { ref, computed } from "vue";
  import { useRoute } from "vue-router";
  import { useGeneralStore } from "../store/general";
  import { useProductsStore } from "../store/product";
  import { decode } from "js-base64";

  const generalStore = useGeneralStore();
  const currentLang = computed(() => generalStore?.getLang);

  const productStore = useProductsStore();

  const routes = useRoute();
  const categoryId = decode(routes?.params?.categoryId);
  const categoryName =
    currentLang.value === "en"
      ? JSON.parse(decode(routes?.query?.categoryName))?.name_en
      : JSON.parse(decode(routes?.query?.categoryName))?.name;
  const categoryImage = routes?.query?.categoryImage
    ? decode(routes?.query?.categoryImage)
    : `/images/slides/1.png`;
  const products = computed(
    () => productStore?.getProductsByCategory[categoryId] || []
  );
</script>

<template>
  <app-layout>
    <div class="page-wapper">
      <div
        class="img-title-container relative custom-container h-[150px] md:h-[200px] lg:h-[300px] shadow-lg rounded-xl overflow-hidden bg-gray-200 mb-16"
      >
        <img
          :class="`w-full h-full object-cover  ${
            decode?.(routes?.query?.categoryImage)
              ? 'object-center'
              : 'object-top'
          }`"
          :src="categoryImage"
          alt="Category Image"
        />
        <h3
          class="text-3xl md:text-5xl text-white font-bold custom-container absolute bottom-[50%] left-[50%] z-10"
        >
          {{ categoryName }}
        </h3>
      </div>
      <app-product-grid class="mb-8" :products="products"></app-product-grid>
    </div>
  </app-layout>
</template>

<style scoped>
  .img-title-container::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
    background-color: rgba(18, 31, 40, 0.75);
  }

  .img-title-container h3 {
    transform: translate(-50%, 50%);
  }
</style>
