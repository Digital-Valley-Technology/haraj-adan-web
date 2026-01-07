import { defineStore } from "pinia";
import requestService from "../services/api/requestService";
import { showSuccess, showWarning } from "../utils/notifications";
import { socket } from "../services/SocketPlugin";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    isAuthenticated: false,
  }),
  getters: {
    getUser: (state) => state.user,
    getAuthState: (state) => state.user,
  },
  actions: {
    grantAccess(user) {
      this.user = user;
      this.isAuthenticated = true;
      console.log("✅ [AUTH] Access granted for user:", user?.id);
    },

    revokeAccess() {
      this.user = null;
      this.isAuthenticated = false;
      console.log("🔒 [AUTH] Access revoked");
    },

    // Get current user from backend
    async getMe() {
      const token = localStorage.getItem("token");
      if (!token) {
        this.revokeAccess();
        return null;
      }

      try {
        const response = await requestService.getAll(`auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.grantAccess(response?.data);
        return response?.data;
      } catch (error) {
        this.revokeAccess();
        showWarning(error?.response?.message || "Authentication failed");
        return null;
      }
    },

    /**
     * ⭐ IMPROVED LOGOUT WITH COMPLETE RESET
     */
    async logout() {
      console.log("👋 [AUTH] Starting logout process...");

      const userId = this.user?.id;
      const token = localStorage.getItem("token");

      try {
        // ============================================================
        // STEP 1: Emit offline status BEFORE clearing user data
        // ============================================================
        if (socket && socket.connected && userId) {
          socket.emit("offline", userId);
          console.log("📡 [AUTH] Emitted offline status for user:", userId);
        }

        // ============================================================
        // STEP 2: Reset all stores (dynamic imports to avoid circular deps)
        // ============================================================
        console.log("🔄 [AUTH] Resetting all stores...");

        // Reset Notification Store
        try {
          const { useNotificationStore } = await import("./notifications.js");
          const notificationStore = useNotificationStore();
          if (notificationStore.reset) {
            notificationStore.reset();
            console.log("✅ [AUTH] Notification store reset");
          }
        } catch (error) {
          console.warn("⚠️ [AUTH] Could not reset notification store:", error);
        }

        // Reset Admin Chat Store
        try {
          const { useChatStore } = await import("./chat.js");
          const chatStore = useChatStore();
          if (chatStore.reset) {
            chatStore.reset();
          } else if (chatStore.$reset) {
            chatStore.$reset();
          }
          console.log("✅ [AUTH] Chat store reset");
        } catch (error) {
          console.warn("⚠️ [AUTH] Could not reset chat store:", error);
        }

        // Reset Customer Chat Store
        try {
          const { useCustomerChatStore } = await import("./customerChat.js");
          const customerChatStore = useCustomerChatStore();
          if (customerChatStore.reset) {
            customerChatStore.reset();
          } else if (customerChatStore.$reset) {
            customerChatStore.$reset();
          }
          console.log("✅ [AUTH] Customer chat store reset");
        } catch (error) {
          console.warn("⚠️ [AUTH] Could not reset customer chat store:", error);
        }

        // ============================================================
        // STEP 3: Call backend logout endpoint (if token exists)
        // ============================================================
        if (token) {
          try {
            const response = await requestService.getAll("auth/logout", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            showSuccess(response?.message || "Logged out successfully");
          } catch (error) {
            console.warn("⚠️ [AUTH] Backend logout failed:", error);
            // Continue with local logout even if backend fails
          }
        }

        // ============================================================
        // STEP 4: Clear localStorage
        // ============================================================
        console.log("🗑️ [AUTH] Clearing localStorage...");
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        // Optional: Clear other app-specific data
        // localStorage.removeItem("favorites");
        // localStorage.removeItem("cart");

        // ============================================================
        // STEP 5: Revoke access (sets user to null)
        // ============================================================
        this.revokeAccess();

        console.log("✅ [AUTH] Logout complete!");
      } catch (error) {
        console.error("❌ [AUTH] Error during logout:", error);

        // Even if there's an error, still clear local data for security
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        this.revokeAccess();

        showWarning(error?.response?.message || "Error during logout");
      }
    },
  },
});
