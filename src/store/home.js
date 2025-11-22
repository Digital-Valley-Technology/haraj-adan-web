import { defineStore } from "pinia";
import requestService from "../services/api/requestService";
import { get } from "@vueuse/core";

export const useHomeStore = defineStore("home", {
  state: () => ({
    ads: [],
    sidMenuCategories: [],
    nearbyAds: [],
    adsLoading: false,
    sideMenuCategoriesLoading: false,
  }),

  getters: {
    getAds: (state) => state.ads,
    getSideMenuCategories: (state) => state.sidMenuCategories,
    getAdsLoading: (state) => state.adsLoading,
    getSideMenuCategoriesLoading: (state) => state.sideMenuCategoriesLoading,
    getNearbyAds: (state) => state.nearbyAds,
  },

  actions: {
    async fetchAds() {
      if (this.ads?.length > 0) return;
      try {
        this.adsLoading = true;

        const response = await requestService.getAll(`/ads/home`);

        this.ads = response?.data;
      } catch (err) {
        console.error("Failed to fetch ads:", err);
      } finally {
        this.adsLoading = false;
      }
    },

    async fetchNearbyAds(params) {
      try {
        const res = await requestService.getAll("ads/nearby", { params });
        this.nearbyAds = res.data;
      } catch (e) {
        console.log(e);
      }
    },

    async fetchSideMenuCategories() {
      if (this.sidMenuCategories?.length > 0) return;
      try {
        this.sideMenuCategoriesLoading = true;
        const response = await requestService.getAll(
          "/categories/home-page-menu"
        );
        this.sidMenuCategories = response.data;
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        this.sideMenuCategoriesLoading = false;
      }
    },
  },
});
