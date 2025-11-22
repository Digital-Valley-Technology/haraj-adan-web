<!-- <script setup>
import { onMounted, ref } from "vue";
import { RouterView } from "vue-router";
import { useI18n } from "vue-i18n";
import { useGeneralStore } from "./store/general";
import { useProductsStore } from "./store/product";
import { setToastInstance } from "./utils/notifications";
import { useLocationStore } from "./store/location";

const toast = ref(null);
const t = useI18n();

const generalStore = useGeneralStore();
const productStore = useProductsStore();
const locationStore = useLocationStore();

onMounted(() => {
  setToastInstance(toast.value); // Set the instance of the Toast component

  generalStore?.toggleLang(t, localStorage.haraj_lang || "ar");
  productStore.copyFavouredFromLocalStorage();
  productStore.copyCartFromLocalStorage();

  locationStore.detectLocation();
});
</script> -->

<script setup>
import { onMounted, ref } from "vue";
import { RouterView } from "vue-router";
import { useI18n } from "vue-i18n";
import { useGeneralStore } from "./store/general";
import { useProductsStore } from "./store/product";
import { setToastInstance } from "./utils/notifications";
import { useLocationStore } from "./store/location";

const toast = ref(null);
const t = useI18n();

const generalStore = useGeneralStore();
const productStore = useProductsStore();
const locationStore = useLocationStore();

onMounted(() => {
  setToastInstance(toast.value);

  generalStore?.toggleLang(t, localStorage.haraj_lang || "ar");
  productStore.copyFavouredFromLocalStorage();
  productStore.copyCartFromLocalStorage();

  locationStore.detectLocation(); // will now save to localStorage and work forever
});
</script>

<template>
  <div>
    <RouterView />
    <Toast ref="toast" position="bottom-left" />
  </div>
</template>
