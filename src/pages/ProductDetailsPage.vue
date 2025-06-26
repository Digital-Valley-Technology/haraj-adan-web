<script setup>
  import AppLayout from "../Layout/AppLayout.vue";
  import ProductsSlider from "../components/ProductsSlider.vue";
  import { computed, watch } from "vue";
  import { useProductsStore } from "../store/product";
  import { useCategoriesStore } from "../store/category";
  import { useRoute } from "vue-router";
  import { decode } from "js-base64";

  const route = useRoute();
  const productStore = useProductsStore();
  const categoryStore = useCategoriesStore();
  const productId = computed(() => decode(route?.params?.productId || ""));
  const product = computed(() =>
    productStore?.getAllProducts?.find(
      (item) => item.id === parseInt(productId.value)
    )
  );
  const productCategory = computed(() =>
    categoryStore?.getCategories.find(
      (item) => item.id === product.value?.category_id
    )
  );
  const categoryProducts = computed(
    () =>
      productStore?.getProductsByCategory?.[
        product?.value?.category_id
      ]?.filter((p) => p?.id !== parseInt(productId?.value)) || []
  );
  // temp product images
  const categoryImages =
    categoryProducts?.value.map((item) => item?.image) || [];

  const product_images = [
    product?.value?.image || "/images/placeholder-image.jpg",
    ...categoryImages,
  ];

  watch(
    () => productId.value,
    (newId) => {
      window.location.reload();
    }
  );
</script>

<template>
  <app-layout>
    <div class="page-wapper">
      <div class="custom-container grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <!-- product image -->
        <app-product-image-thumbnail
          :product-name="product?.name"
          :product-images="product_images"
        ></app-product-image-thumbnail>
        <!-- product details -->
        <app-product-details
          :product="product"
          :product-category="productCategory"
        ></app-product-details>
      </div>
      <!-- similar products -->
      <h3 class="text-xl font-bold custom-container">
        {{ $t("products.similar-products") }}
      </h3>
      <products-slider
        class="mb-8"
        :products="categoryProducts"
      ></products-slider>
    </div>
  </app-layout>
</template>

<style scoped>
  @media (min-width: 480px) {
    .my-buttons-container {
      flex-direction: row;
    }
  }
  @media (min-width: 768px) {
    .my-buttons-container {
      flex-direction: column;
    }
  }
  @media (min-width: 920px) {
    .my-buttons-container {
      flex-direction: row;
    }
  }
</style>
