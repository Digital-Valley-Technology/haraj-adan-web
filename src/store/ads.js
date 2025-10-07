import { defineStore } from "pinia";
import requestService from "../services/api/requestService";

export const useAdsStore = defineStore("ads", {
  state: () => ({
    ads: [],
    page: 1,
    limit: 10,
    total: 0,
    loading: false,
  }),
  getters: {
    getAds: (state) => state.ads,
    getTotal: (state) => state.total,
  },
  actions: {
    async fetchAds({ page, limit, search = "", filterBy = null }) {
      try {
        this.loading = true;
        const query = new URLSearchParams();

        if (search && filterBy) {
          query.append("search", search);
          query.append("filterBy", filterBy);
        }

        query.append("page", page);
        query.append("limit", limit);

        const response = await requestService.getAll(
          `/ads/paginate?${query.toString()}`
        );

        this.ads = response?.data || [];
        this.total = response?.meta?.total || 0;
        this.page = response?.meta?.page || 1;
      } catch (err) {
        console.error("Failed to fetch ads:", err);
      } finally {
        this.loading = false;
      }
    },
  },
});
