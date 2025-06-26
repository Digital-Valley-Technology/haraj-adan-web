import { defineStore } from "pinia";
import { categories } from "../data";

export const useCategoriesStore = defineStore("categories", {
  state: () => ({
    categories: categories,
    page: 0,
    limit: 10,
    total: 10,
  }),
  getters: {
    getCategories: (state) => state.categories,
    getPage: (state) => state.page,
    getLimit: (state) => state.limit,
    getTotal: (state) => state.categories?.length,
  },
  actions: {
    async fetchCategories({ page, limit }) {
      // fetch the date and store the result in categories (this.categories = result)
    },
  },
});
