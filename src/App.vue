<script setup>
  import { onMounted } from "vue";
  import { RouterView } from "vue-router";
  import { useI18n } from "vue-i18n";
  import { useGeneralStore } from "./store/general";
  import { useProductsStore } from "./store/product";

  const t = useI18n();
  const generalStore = useGeneralStore();
  const productStore = useProductsStore();

  onMounted(() => {
    generalStore?.toggleLang(t, localStorage.raheed_lang || "ar");
    productStore.copyFavouredFromLocalStorage();
    productStore.copyCartFromLocalStorage();
  });
</script>

<template>
  <div>
    <RouterView />
    <Toast position="bottom-left" />
  </div>
</template>
