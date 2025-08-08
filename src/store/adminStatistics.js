import { defineStore } from "pinia";
import requestService from "../services/api/requestService";
import { showError } from "../utils/notifications";

export const useAdminStatisticsStore = defineStore("adminStatistics", {
  state: () => ({
    statistics: null,
    loading: false,
    error: null,
  }),

  getters: {
    getStatistics: (state) => state.statistics,
  },

  actions: {
    async fetchStatistics() {
      this.loading = true;
      this.error = null;
      try {
        const response = await requestService.getAll(
          "/admin/statistics/dashboard"
        );
        this.statistics = response?.data || null;
      } catch (err) {
        this.error = err;
        showError(err || "no per");
        console.error("Failed to fetch statistics:", err);
      } finally {
        this.loading = false;
      }
    },
  },
});
