// userStore.js
import { defineStore } from "pinia";
import requestService from "../services/api/requestService";
import { showSuccess, showWarning } from "../utils/notifications";

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
    },
    revokeAccess() {
      this.user = null;
      this.isAuthenticated = false;
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
        this.grantAccess(response?.data);
        return response?.data;
      } catch (error) {
        this.revokeAccess();
        showWarning(error?.status?.message || "Authentication failed");
        return null;
      }
    },
    async logout() {
      const token = localStorage.getItem("token");

      if (!token) {
        this.revokeAccess();
        return null;
      }

      try {
        const response = await requestService.getAll("auth/logout", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        localStorage.removeItem("token");
        this.revokeAccess();
        showSuccess(response?.status?.message);
      } catch (error) {
        this.revokeAccess();
        showWarning(error?.status?.message || "Unable to logout");
        return null;
      }
    },
  },
});
