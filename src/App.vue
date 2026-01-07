<script setup>
import { onMounted, onBeforeUnmount, ref, computed, watch, inject } from "vue";
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

// ============================================================================
// ⭐ COMPLETE FIX: Proper initialization flow
// ============================================================================

/**
 * Initialize notifications when:
 * 1. User logs in (userId changes from null to number)
 * 2. Page refreshes with existing auth (userId available immediately)
 */
watch(
  currentUserId,
  (newId, oldId) => {
    console.log("👤 [APP] User ID changed:", { oldId, newId });

    if (newId && socket) {
      console.log("🔔 [APP] Initializing notification system for user:", newId);

      // Initialize listeners (safe to call multiple times)
      notificationStore.initializeSocketListeners(socket, newId);
    } else if (!newId && oldId) {
      // User logged out
      console.log("👋 [APP] User logged out, resetting notifications");
      notificationStore.reset();
    }
  },
  { immediate: true } // ⭐ CRITICAL: Run immediately on mount
);

/**
 * Handle socket connection events
 */
onMounted(() => {
  console.log("🚀 [APP] App mounted");

  setToastInstance(toast.value);
  generalStore?.toggleLang(t, localStorage.haraj_lang || "ar");
  productStore.copyFavouredFromLocalStorage();
  productStore.copyCartFromLocalStorage();
  locationStore.detectLocation();

  if (!socket) {
    console.error("❌ [APP] Socket not available!");
    return;
  }

  // Log initial socket state
  console.log("🔌 [APP] Socket state:", {
    connected: socket.connected,
    userId: currentUserId.value,
  });

  // ⭐ FIX 1: Handle socket connect/reconnect
  socket.on("connect", () => {
    console.log("✅ [APP] Socket connected");

    const userId = currentUserId.value;
    if (userId) {
      console.log("🔄 [APP] Re-initializing notifications after connect");

      // Small delay to ensure socket is fully ready
      setTimeout(() => {
        notificationStore.refreshCounts();
      }, 500);
    }
  });

  // ⭐ FIX 2: Handle socket disconnect
  socket.on("disconnect", (reason) => {
    console.log("❌ [APP] Socket disconnected:", reason);
  });

  // ⭐ FIX 3: Handle connection errors
  socket.on("connect_error", (error) => {
    console.error("❌ [APP] Socket connection error:", error.message);
  });

  // ⭐ FIX 4: If socket already connected and user logged in, initialize now
  if (socket.connected && currentUserId.value) {
    console.log("✅ [APP] Socket already connected, user already logged in");

    setTimeout(() => {
      console.log("🔄 [APP] Fetching initial counts");
      notificationStore.refreshCounts();
    }, 500);
  }
});

/**
 * Cleanup on unmount
 */
onBeforeUnmount(() => {
  console.log("👋 [APP] App unmounting");

  if (socket) {
    socket.off("connect");
    socket.off("disconnect");
    socket.off("connect_error");
  }
});
</script>

<template>
  <div>
    <RouterView />
    <Toast ref="toast" position="bottom-left" />
  </div>
</template>
