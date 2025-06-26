<script setup>
  import { useCustomToast } from "../composables/toast";
  import { useI18n } from "vue-i18n";
  import { ref, computed } from "vue";
  import { useGeneralStore } from "../store/general";
  import { useProductsStore } from "../store/product";

  const props = defineProps(["product", "productCategory"]);

  const generalStore = useGeneralStore();
  const productStore = useProductsStore();
  const currentlang = computed(() => generalStore?.getLang);

  const { t } = useI18n();
  const { showSuccess } = useCustomToast();

  const favouredProducts = computed(() => productStore?.getFavouredProducts);
  const isFavoured = computed(() =>
    favouredProducts?.value?.some(
      (favouredProduct) => favouredProduct?.id === props?.product?.id
    )
  );
  const cartProducts = computed(() => productStore?.getCartProducts);
  const toggleFavoured = (product) => {
    productStore.toggleFavouredProduct(product);
    showSuccess(t("products.update-favoured"));
  };

  const qty = ref(
    cartProducts?.value?.find(
      (item) => item?.product?.id === props?.product?.id
    )?.qty || 1
  );

  const addToCart = (product) => {
    productStore.updateCartItemQty({ product, qty: qty?.value });
    showSuccess(t("products.update-cart"));
  };

  const addQty = () => {
    if (qty.value < 1599) {
      // Assuming 1599 is the max available quantity
      // You can replace 1599 with a dynamic value
      qty.value++;
    }
  };
  const subQty = () => {
    if (qty.value > 1) {
      qty.value--;
    }
  };
</script>

<template>
  <div class="w-full p-6">
    <!-- category info -->
    <div class="flex items-center mb-6">
      <Avatar
        :image="productCategory?.image"
        :alt="productCategory?.name"
        class="me-2 shadow-lg"
        size="large"
        shape="circle"
      />
      <span>{{
        currentlang == "en" ? productCategory?.name_en : productCategory?.name
      }}</span>
    </div>
    <!-- product name -->
    <h1 class="text-2xl font-bold mb-4">
      {{ currentlang == "en" ? product?.name_en : product?.name }}
    </h1>
    <!-- product description -->
    <p class="text-gray-700 mb-4">
      {{ product?.description || "لا يوجد وصف لهذا المنتج." }}
    </p>
    <!-- original price -->
    <div class="flex items-center mb-4">
      <span class="text-gray-500 me-2">{{ $t("products.price") }}</span>
      <span class="text-xl font-light line-through">{{ product?.price }}</span>
      <span class="text-xs ms-2">{{ $t("products.sar") }}</span>
    </div>
    <!-- sale price -->
    <div class="flex items-center mb-4">
      <span class="text-gray-500 me-2">{{ $t("products.sale-price") }}</span>
      <span class="text-3xl font-semibold">{{ product?.sale_price }}</span>
      <span class="text-xs ms-2">{{ $t("products.sar") }}</span>
    </div>
    <!-- discount percentage -->
    <div class="flex items-center mb-4">
      <span class="text-gray-500 me-2">{{ $t("products.saved") }}</span>
      <span class="text-gray-500">{{
        parseInt(product?.price - product?.sale_price) || 0
      }}</span>
      <span class="text-gray-500 text-xs ms-2">{{ $t("products.sar") }}</span>
      <div
        class="bg-slate-200 px-4 py-1 rounded-md text-xs text-[var(--primary-clr)] ms-6"
      >
        {{ `${$t("generic.discount")} ${product?.sale_percentage} %` }}
      </div>
    </div>
    <!-- product qty -->
    <div class="flex items-center mb-4">
      <span class="text-gray-500 me-2">العدد المتوفر:</span>
      <span class="text-xl font-normal">1599</span>
      <span class="text-xs ms-1">منتج</span>
    </div>
    <!-- add to cart -->
    <div class="my-buttons-container flex flex-col gap-2">
      <div class="flex items-center">
        <Button
          @click="addQty"
          class="!bg-slate-200 !border-slate-200 mb-2"
          icon="pi pi-plus text-[var(--primary-clr)]"
          aria-label="plus"
        />
        <InputText class="w-20 mx-2 mb-2" type="number" v-model="qty" />
        <Button
          @click="subQty"
          class="!bg-slate-200 !border-slate-200 mb-2"
          icon="pi pi-minus text-[var(--primary-clr)]"
          aria-label="minus"
        />
      </div>
      <div class="cart-button-container">
        <Button
          @click="addToCart(product)"
          class="flex-grow me-2 mb-2 !bg-[var(--primary-clr)] !border-[var(--primary-clr)]"
          :label="$t('generic.addtocart')"
        />
        <Button
          @click="toggleFavoured(product)"
          class="!bg-slate-200 !border-slate-200 mb-2"
          :icon="`pi text-[var(--primary-clr)] ${
            isFavoured ? 'text-red-500 pi-heart-fill' : 'pi-heart'
          }`"
          aria-label="Favorite"
        />
      </div>
    </div>
  </div>
</template>
