import { defineStore } from "pinia";
import requestService from "../services/api/requestService";

export const useCategoriesStore = defineStore("categories", {
  state: () => ({
    categories: [],
    page: 1,
    limit: 10,
    total: 0,
    search: "",
    loading: false,
  }),

  getters: {
    getCategories: (state) => state.categories,
    getPage: (state) => state.page,
    getLimit: (state) => state.limit,
    getTotal: (state) => state.total,
  },

  actions: {
    async fetchCategories({
      page,
      limit,
      search = "",
      filterBy = null,
      parentId = undefined,
    }) {
      try {
        this.loading = true;
        const query = new URLSearchParams();

        if (search && filterBy) {
          query.append("search", search);
          query.append("filterBy", filterBy);
        }

        query.append("page", page);
        query.append("limit", limit);

        if (parentId !== undefined) {
          query.append(
            "parentId",
            parentId === null ? "null" : String(parentId)
          );
        }

        const response = await requestService.getAll(
          `/categories/paginate?${query.toString()}`
        );

        this.categories = response?.data;
        this.total = response.meta.total;
        this.page = response.meta.page;
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        this.loading = false;
      }
    },
  },
});
