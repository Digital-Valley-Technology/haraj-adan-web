<template>
  <div
    class="bg-gray-100 border border-gray-300 rounded-xl shadow-md group overflow-hidden"
  >
    <!-- product image & icons -->
    <div class="relative card-image aspect-[6/7]">
      <router-link
        :to="{
          name: `product-details`,
          params: {
            productId: encode(product?.id),
          },
        }"
      >
        <div class="overflow-hidden bg-gray-300 aspect-square">
          <img
            :src="product?.image"
            :alt="product?.name"
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ease-in-out"
          />
        </div>
      </router-link>
      <!-- favoured icon -->
      <div
        @click="toggleFavoured(product)"
        role="button"
        className="bg-white p-2 rounded-xl absolute top-2 left-2 z-20 cursor-pointer grid place-items-center border border-gray-300"
      >
        <i
          :class="`pi pi-${
            isFavoured
              ? 'heart-fill text-red-500'
              : 'heart text-[var(--secondary-clr-tint)]'
          } text-[16px]`"
        ></i>
      </div>
      <!-- cart icon -->
      <div
        @click="addToCart(product)"
        role="button"
        className="py-2 px-3 bg-white rounded-xl absolute bottom-0 left-2 z-20 cursor-pointer border border-gray-300"
      >
        <i class="pi pi-shopping-bag text-[16px]"></i>
      </div>
    </div>
    <!-- title & price -->
    <div class="p-2 pb-4">
      <router-link
        :to="{
          name: `product-details`,
          params: {
            productId: encode(product?.id),
          },
        }"
      >
        <h2 className="text-sm font-semibold text-gray-800 mb-1">
          {{ product?.name }}
        </h2>
      </router-link>
      <div class="flex justify-between items-end">
        <div class="flex items-center">
          <span className="font-bold text-gray-800">100</span>
          <span className="text-xs text-gray-800">ر.س</span>
        </div>
        <p class="flex items-center line-through text-xs text-gray-500">
          <span>140</span>
          <span>ر.س</span>
        </p>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { encode } from "js-base64";
  import { computed } from "vue";
  import { useProductsStore } from "../store/product";
  import { useCustomToast } from "../composables/toast";
  import { useI18n } from "vue-i18n";

  const { t } = useI18n();

  const props = defineProps(["product"]);

  const productStore = useProductsStore();
  const favouredProducts = computed(() => productStore.getFavouredProducts);
  const isFavoured = computed(() => {
    return favouredProducts?.value?.some(
      (favouredProduct) => favouredProduct?.id === props?.product?.id
    );
  });
  const { showSuccess } = useCustomToast();
  const toggleFavoured = (product) => {
    productStore.toggleFavouredProduct(product);
    showSuccess(t("products.update-favoured"));
  };
  const addToCart = (product) => {
    productStore.addToCart({ qty: 1, product });
    showSuccess(t("products.update-cart"));
  };
</script>
