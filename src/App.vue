<script setup>
import { onMounted, ref, computed, watch, inject } from "vue";
import { RouterView } from "vue-router";
import { useI18n } from "vue-i18n";
import { useGeneralStore } from "./store/general";
import { useProductsStore } from "./store/product";
import { setToastInstance } from "./utils/notifications";
import { useLocationStore } from "./store/location";
import { useNotificationStore } from "./store/notifications";
import { useAuthStore } from "./store/auth";

const toast = ref(null);
const authStore = useAuthStore();
const notificationStore = useNotificationStore();
const t = useI18n();

const generalStore = useGeneralStore();
const productStore = useProductsStore();
const locationStore = useLocationStore();

const socket = inject("socket");

const currentUserId = computed(() => authStore.user?.id);

watch(
  currentUserId,
  (newId) => {
    if (newId) {
      notificationStore.initializeSocketListeners(socket, newId);
    }
  },
  { immediate: true }
);

onMounted(() => {
  setToastInstance(toast.value);

  generalStore?.toggleLang(t, localStorage.haraj_lang || "ar");
  productStore.copyFavouredFromLocalStorage();
  productStore.copyCartFromLocalStorage();

  locationStore.detectLocation();
});
</script>

<template>
  <div>
    <RouterView />
    <Toast ref="toast" position="bottom-left" />
  </div>
</template>
