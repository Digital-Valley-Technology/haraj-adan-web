<script setup>
import { onMounted, ref } from "vue";
import { RouterView } from "vue-router";
import { useI18n } from "vue-i18n";
import { useGeneralStore } from "./store/general";
import { useProductsStore } from "./store/product";
import { setToastInstance } from "./utils/notifications";

const toast = ref(null);
const t = useI18n();

const generalStore = useGeneralStore();
const productStore = useProductsStore();

onMounted(() => {
  setToastInstance(toast.value); // Set the instance of the Toast component

  generalStore?.toggleLang(t, localStorage.haraj_lang || "ar");
  productStore.copyFavouredFromLocalStorage();
  productStore.copyCartFromLocalStorage();
});
</script>

<template>
  <div>
    <RouterView />
    <Toast ref="toast" position="bottom-left" />
  </div>
</template>
