import { defineStore } from "pinia";
import requestService from "../services/api/requestService";

export const useBannersStore = defineStore("banners", {
  state: () => ({
    banners: [],
    page: 1,
    limit: 10,
    total: 0,
    search: "",
    loading: false,
  }),

  getters: {
    getBanners: (state) => state.banners,
    getPage: (state) => state.page,
    getLimit: (state) => state.limit,
    getTotal: (state) => state.total,
  },

  actions: {
    async fetchBanners({ page, limit }) {
      try {
        this.loading = true;
        const query = new URLSearchParams();

        query.append("page", page);
        query.append("limit", limit);

        const response = await requestService.getAll(
          `/banners/paginate?${query.toString()}`
        );

        this.banners = response?.data;
        this.total = response.total;
        this.page = response.page;
      } catch (err) {
        console.error("Failed to fetch banners:", err);
      } finally {
        this.loading = false;
      }
    },
  },
});
