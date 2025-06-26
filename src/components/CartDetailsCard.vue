<script setup>
  import { ref, computed } from "vue";
  import { useProductsStore } from "../store/product";

  const categoryImage = ref("/images/cart.jpg");
  const productsStore = useProductsStore();
  const cartProducts = computed(() => productsStore.getCartProducts);

  const subtotal = computed(() =>
    cartProducts?.value
      ?.reduce((a, i) => a + i?.qty * i?.product?.sale_price, 0)
      .toFixed(2)
  );
  const total = computed(() =>
    cartProducts?.value
      ?.reduce((a, i) => a + i?.qty * i?.product?.sale_price, 0)
      .toFixed(2)
  );
</script>

<template>
  <div
    class="p-4 self-start bg-gray-100 border border-gray-300 rounded-xl shadow-md"
  >
    <h4 class="mb-4">{{ $t("products.bill-summary") }}</h4>
    <!-- subtotal -->
    <div class="flex justify-between items-center mb-8">
      <div class="flex">
        <h6 class="text-gray-500">{{ $t("products.subtotal") }}</h6>
        <span class="ms-2">{{
          `(${cartProducts?.reduce((acc, i) => acc + parseInt(i?.qty), 0)})`
        }}</span>
      </div>
      <div class="flex items-center">
        <span>{{ subtotal }}</span>
        <span class="text-xs ms-1">{{ $t("products.sar") }}</span>
      </div>
    </div>
    <hr class="text-gray-300" />
    <!-- total -->
    <div class="flex justify-between items-center my-4">
      <h6 class="text-xl text-gray-900 font-bold">
        {{ $t("products.total") }}
      </h6>
      <div class="flex items-center">
        <span class="text-lg font-semibold">{{ total }}</span>
        <span class="text-xs ms-1">{{ $t("products.sar") }}</span>
      </div>
    </div>
    <!-- checkout button -->
    <Button asChild v-slot="slotProps">
      <RouterLink
        class="block w-full flex-grow !bg-[var(--primary-clr)] !border-[var(--primary-clr)]"
        to="/checkout"
        :class="slotProps.class"
        >{{ $t("generic.checkout") }}</RouterLink
      >
    </Button>
  </div>
</template>
