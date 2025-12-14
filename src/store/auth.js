// // userStore.js
// import { defineStore } from "pinia";
// import requestService from "../services/api/requestService";
// import { showSuccess, showWarning } from "../utils/notifications";

// export const useAuthStore = defineStore("auth", {
//   state: () => ({
//     user: null,
//     isAuthenticated: false,
//   }),
//   getters: {
//     getUser: (state) => state.user,
//     getAuthState: (state) => state.user,
//   },
//   actions: {
//     grantAccess(user) {
//       this.user = user;
//       this.isAuthenticated = true;
//     },
//     revokeAccess() {
//       this.user = null;
//       this.isAuthenticated = false;
//     },
//     // In your auth store
//     async getMe() {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         this.revokeAccess();
//         return null;
//       }

//       try {
//         const response = await requestService.getAll(`auth/me`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         this.grantAccess(response?.data);
//         return response?.data;
//       } catch (error) {
//         this.revokeAccess();
//         showWarning(error?.response?.message || "Authentication failed");
//         return null;
//       }
//     },
//     async logout() {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         this.revokeAccess();
//         return null;
//       }

//       try {
//         const response = await requestService.getAll("auth/logout", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         localStorage.removeItem("token");
//         this.revokeAccess();
//         showSuccess(response?.message);
//       } catch (error) {
//         this.revokeAccess();
//         showWarning(error?.response?.message || "Unable to logout");
//         return null;
//       }
//     },
//   },
// });

// userStore.js
import { defineStore } from "pinia";
import requestService from "../services/api/requestService";
import { showSuccess, showWarning } from "../utils/notifications";

// Import the Notification Store (lazy import to prevent circular dependency if possible)
let useNotificationStore;
import("../store/notifications.js").then((module) => {
  useNotificationStore = module.useNotificationStore;
});

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
    // --- NEW HELPER FUNCTION ---
    getSocketAndLogout(userId) {
      if (!useNotificationStore) return;

      const notificationStore = useNotificationStore();
      // Assume you track the socket instance in the notification store or via injection
      // Since we removed socket instance from NotificationStore, we need to inject it here or rely on the App.vue watcher.
      // For socket events like 'offline', we rely on the SocketPlugin itself, which needs access to the user ID.

      // We can access the global socket instance via a helper if the plugin makes it available,
      // but the simplest way is to emit the 'offline' event if the socket plugin has access to the user ID.
      // If your SocketPlugin exposes the socket globally (which it does via `export const socket`), we can use it:

      // NOTE: If this import fails, remove it and trust the watcher.
      try {
        const { socket } = require("../services/SocketPlugin"); // Attempt to get global socket
        if (socket && userId) {
          socket.emit("offline", userId);
          console.log(`Socket emitted 'offline' for user: ${userId}`);
        }
      } catch (e) {
        console.warn("Could not access global socket for offline emit.");
      }

      // After managing the socket state, revoke access
      this.revokeAccess();
    },
    // --- END NEW HELPER ---

    grantAccess(user) {
      this.user = user;
      this.isAuthenticated = true;

      // IMPORTANT: After granting access, we MUST re-initialize the socket listeners
      // immediately if the store is ready.
      if (useNotificationStore) {
        const notificationStore = useNotificationStore();
        // Since we can't inject in a Pinia store, we rely on the App.vue WATCHER.
        // Simply updating this.user is enough to trigger the watcher in App.vue.
        // However, if the App.vue watcher is too slow, we can try to call the fetch logic directly:
        // notificationStore.refreshCounts();
      }
    },
    revokeAccess() {
      this.user = null;
      this.isAuthenticated = false;
      // When revoking, the App.vue watcher will detect user=null and should handle cleanup if needed.
    },
    // In your auth store
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

        // Trigger App.vue watcher
        this.grantAccess(response?.data);
        return response?.data;
      } catch (error) {
        this.revokeAccess();
        showWarning(error?.response?.message || "Authentication failed");
        return null;
      }
    },
    async logout() {
      const userId = this.user?.id;
      const token = localStorage.getItem("token");

      if (!token) {
        this.getSocketAndLogout(userId); // Use helper for cleanup
        return null;
      }

      try {
        const response = await requestService.getAll("auth/logout", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        localStorage.removeItem("token");

        // Trigger App.vue watcher and socket 'offline' emit
        this.getSocketAndLogout(userId);

        showSuccess(response?.message);
      } catch (error) {
        // Even if logout fails on the server, we log out locally for security
        this.getSocketAndLogout(userId);
        showWarning(error?.response?.message || "Unable to logout");
        return null;
      }
    },
  },
});
