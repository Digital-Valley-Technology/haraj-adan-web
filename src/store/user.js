import { defineStore } from "pinia";
import requestService from "../services/api/requestService";

export const useUsersStore = defineStore("user", {
  state: () => ({
    users: [],
    page: 1,
    limit: 10,
    total: 0,
    loading: false,
  }),
  getters: {
    getUsers: (state) => state.users,
    getTotal: (state) => state.total,
  },
  actions: {
    async fetchUsers({ page, limit, search = "", filterBy = null }) {
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
          `/users/paginate?${query.toString()}`
        );

        this.users = response?.data;
        this.total = response.meta.total;
        this.page = response.meta.page;
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        this.loading = false;
      }
    },
  },
});
