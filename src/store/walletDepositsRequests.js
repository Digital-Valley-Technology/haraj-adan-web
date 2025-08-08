import { defineStore } from "pinia";
import requestService from "../services/api/requestService";

export const useWalletDepositsRequestsStore = defineStore(
  "walletDepositsRequests",
  {
    state: () => ({
      walletDepositsRequests: [],
      currentRequest: null,
      page: 1,
      limit: 10,
      total: 0,
      search: "",
      loading: false,
      statusChangeLoading: false,
    }),

    getters: {
      getWalletDepositsRequests: (state) => state.walletDepositsRequests,
      getCurrentRequest: (state) => state.currentRequest,
      getPage: (state) => state.page,
      getLimit: (state) => state.limit,
      getTotal: (state) => state.total,
      getStatusChangeLoading: (state) => state.statusChangeLoading,
      getLoading: (state) => state.loading,
    },

    actions: {
      async fetchWalletDepositsRequests({
        page,
        limit,
        search = "",
        filterBy = null,
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

          const response = await requestService.getAll(
            `/wallet-deposits-requests/paginate?${query.toString()}`
          );

          this.walletDepositsRequests = response?.data;
          this.total = response.meta.total || 0;
          this.page = response.meta.page || 1;
        } catch (err) {
          console.error("Failed to fetch wallet deposit requests:", err);
        } finally {
          this.loading = false;
        }
      },

      async changeStatus(id, status, customAmount = null) {
        if (!id) return;
        if (status !== "approved" && status !== "rejected") return;
        const payload = { status };
        if (status === "approved" && customAmount) {
          payload.customAmount = customAmount;
        }
        try {
          this.statusChangeLoading = true;
          const response = await requestService.patch(
            `/wallet-deposits-requests/${id}/change-status`,
            payload
          );

          return response;
        } catch (err) {
          console.error("Failed to change status:", err);
          throw err;
        } finally {
          this.statusChangeLoading = false;
        }
      },

      async fetchWalletDepositRequest(id, includes = []) {
        try {
          this.loading = true;
          const query = new URLSearchParams();
          if (includes.length) {
            query.append("includes", includes.join(","));
          }

          const response = await requestService.getAll(
            `/wallet-deposits-requests/${id}?${query.toString()}`
          );

          this.currentRequest = response.data;
          return response;
        } catch (err) {
          console.error("Failed to fetch wallet deposit request:", err);
          throw err;
        } finally {
          this.loading = false;
        }
      },

      async createWalletDepositRequest(data) {
        try {
          this.loading = true;
          const response = await requestService.post(
            "/wallet-deposits-requests",
            data,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          return response;
        } catch (err) {
          console.error("Failed to create wallet deposit request:", err);
          throw err;
        } finally {
          this.loading = false;
        }
      },

      async updateWalletDepositRequest(id, data) {
        try {
          this.loading = true;
          const response = await requestService.patch(
            `/wallet-deposits-requests/${id}`,
            data,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          return response;
        } catch (err) {
          console.error("Failed to update wallet deposit request:", err);
          throw err;
        } finally {
          this.loading = false;
        }
      },

      async deleteWalletDepositRequest(id) {
        try {
          this.loading = true;
          const response = await requestService.delete(
            "/wallet-deposits-requests",
            id
          );
          return response;
        } catch (err) {
          console.error("Failed to delete wallet deposit request:", err);
          throw err;
        } finally {
          this.loading = false;
        }
      },
    },
  }
);
