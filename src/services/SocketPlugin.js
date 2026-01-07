import { io } from "socket.io-client";
import { DEV_SOCKET_URL, MODE, PROD_SOCKET_URL } from "../utils/constants";
import { useAuthStore } from "../store/auth";

export const URL = MODE == "DEV" ? DEV_SOCKET_URL : PROD_SOCKET_URL;

console.log("🔌 [SOCKET] Creating socket connection to:", URL);

export const socket =
  MODE == "DEV"
    ? io(`${URL}`, {
        withCredentials: true,
        autoConnect: true, // ⭐ Ensure auto-connect is enabled
      })
    : io(`${URL}`, {
        withCredentials: true,
        path: "/haraj/socket.io/",
        autoConnect: true,
      });

// ============================================================================
// SOCKET EVENT HANDLERS
// ============================================================================

socket.on("connect_error", (err) => {
  console.error("❌ [SOCKET] Connection error:", err.message);
});

socket.on("connect", () => {
  console.log("✅ [SOCKET] Connected - ID:", socket.id);

  // ⭐ FIX: Join personal room on connect/reconnect
  const authStore = useAuthStore();
  const userId = authStore.user?.id;

  if (userId) {
    // Join personal room for receiving notifications
    socket.emit("joinRoom", `user_${userId}`);
    console.log(`✅ [SOCKET] Joined personal room: user_${userId}`);

    // Check if user is admin
    const userRoles = authStore.user?.user_roles || [];
    const isAdmin = userRoles.some(
      (role) => role.code === "MANAGER" || role.code === "ADMIN"
    );

    if (isAdmin) {
      socket.emit("joinRoom", "admins");
      console.log("✅ [SOCKET] Joined admins room");
    }

    // ⭐ NEW: Dispatch event for other components to react
    window.dispatchEvent(
      new CustomEvent("socket-reconnected", {
        detail: { userId, isAdmin },
      })
    );
  } else {
    console.log("⏳ [SOCKET] No user logged in yet");
  }
});

socket.on("disconnect", (reason) => {
  console.log("❌ [SOCKET] Disconnected:", reason);
});

// ⭐ NEW: Export helper to manually join rooms
export function joinSocketRoom(roomName) {
  if (socket.connected) {
    socket.emit("joinRoom", roomName);
    console.log(`✅ [SOCKET] Manually joined room: ${roomName}`);
  } else {
    console.warn(`⚠️ [SOCKET] Cannot join room ${roomName} - not connected`);
  }
}

// ============================================================================
// VUE PLUGIN
// ============================================================================

export default {
  install(app) {
    console.log("🔌 [SOCKET] Installing socket plugin");

    // Make socket available to all components
    app.provide("socket", socket);

    // Make helper available globally
    app.config.globalProperties.$joinSocketRoom = joinSocketRoom;

    const authStore = useAuthStore();

    // Handle page unload
    window.addEventListener("beforeunload", () => {
      if (authStore.user?.id) {
        socket.emit("offline", authStore.user.id);
      }
    });

    // Handle disconnect events (emit offline)
    socket.on("disconnect", () => {
      if (authStore.user?.id) {
        socket.emit("offline", authStore.user.id);
      }
    });

    socket.on("disconnecting", () => {
      if (authStore.user?.id) {
        socket.emit("offline", authStore.user.id);
      }
    });
  },
};
