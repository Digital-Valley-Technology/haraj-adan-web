<template>
  <div
    class="flex bg-gray-100 border border-gray-300 rounded-xl shadow-md group overflow-hidden mb-4"
  >
    <!-- product image -->
    <div class="w-[200px] md:w-2/7 overflow-hidden bg-gray-300">
      <img
        :src="cartItem?.product?.image"
        :alt="cartItem?.product?.name"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ease-in-out"
      />
    </div>
    <!-- product details -->

    <!-- details -->
    <div class="flex flex-col flex-grow justify-center p-4">
      <!-- product name -->
      <h3 class="lg:text-xl font-bold mb-2 lg:mb-4">
        {{
          currentLang == "en"
            ? cartItem?.product?.name_en
            : cartItem?.product?.name
        }}
      </h3>

      <!-- original price -->
      <div class="flex items-center mb-2 lg:mb-4">
        <span class="text-sm lg:text-lg text-gray-500 me-2">{{
          $t("products.price")
        }}</span>
        <span class="lg:text-xl font-light line-through">{{
          cartItem?.product?.price
        }}</span>
        <span class="text-xs ms-2">{{ $t("products.sar") }}</span>
      </div>
      <!-- sale price -->
      <div class="flex items-center mb-2 lg:mb-4">
        <span class="text-sm lg:text-lg text-gray-500 me-2">{{
          $t("products.sale-price")
        }}</span>
        <span class="text-lg lg:text-xl font-semibold">{{
          cartItem?.product?.sale_price
        }}</span>
        <span class="text-xs ms-2">{{ $t("products.sar") }}</span>
      </div>
      <!-- qty & favoured -->
      <div class="flex flex-wrap justify-between items-center">
        <div class="flex items-center me-4">
          <Button
            @click="addQty(cartItem?.product)"
            class="!bg-slate-200 !border-slate-200 mb-2"
            icon="pi pi-plus text-[var(--primary-clr)]"
            aria-label="plus"
            size="small"
          />
          <InputText
            class="w-20 mx-2 mb-2"
            type="number"
            v-model="itemQty"
            size="small"
            @change="updateCart(cartItem?.product)"
          />
          <Button
            @click="subQty(cartItem?.product)"
            class="!bg-slate-200 !border-slate-200 mb-2"
            icon="pi pi-minus text-[var(--primary-clr)]"
            aria-label="minus"
            size="small"
          />
        </div>
        <div class="flex items-center">
          <!-- favoured icon -->
          <Button
            @click="toggleFavoured(cartItem?.product)"
            class="!bg-slate-200 !border-slate-200 mb-2 me-2"
            :icon="`pi text-[var(--primary-clr)] ${
              isFavoured ? 'pi-heart-fill' : 'pi-heart'
            }`"
            aria-label="Favorite"
          />
          <!-- remove from cart icon -->
          <Button
            @click="removeFromCart(cartItem?.product)"
            class="!bg-slate-200 !border-slate-200 mb-2"
            icon="pi pi-trash text-red-500"
            aria-label="Favorite"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { ref, computed } from "vue";
  import { useGeneralStore } from "../store/general";
  import { useProductsStore } from "../store/product";
  import { useCustomToast } from "../composables/toast";
  import { useI18n } from "vue-i18n";

  const { t } = useI18n();

  const props = defineProps(["cartItem"]);

  const generalStore = useGeneralStore();
  const currentLang = computed(() => generalStore?.getLang);

  const itemQty = ref(props.cartItem?.qty);
  const addQty = (product) => {
    itemQty.value++;
    productStore?.updateCartItemQty({ product, qty: itemQty?.value });
    showSuccess(t("products.update-cart"));
  };
  const subQty = (product) => {
    if (itemQty?.value > 1) {
      itemQty.value--;
      productStore?.updateCartItemQty({ product, qty: itemQty?.value });
      showSuccess(t("products.update-cart"));
    }
  };
  const updateCart = (product) => {
    productStore?.updateCartItemQty({ product, qty: itemQty?.value });
    showSuccess(t("products.update-cart"));
  };

  const { showSuccess } = useCustomToast();
  const productStore = useProductsStore();
  const favouredProducts = computed(() => productStore.getFavouredProducts);
  const isFavoured = computed(() =>
    favouredProducts?.value?.some(
      (favouredProduct) => favouredProduct?.id === props?.cartItem?.product?.id
    )
  );
  const toggleFavoured = (product) => {
    productStore.toggleFavouredProduct(product);
    showSuccess(t("products.update-favoured"));
  };
  const removeFromCart = (product) => {
    productStore.removeFromCart(product);
    showSuccess(t("products.update-cart"));
  };
</script>
