import { defineStore } from "pinia";
import requestService from "../services/api/requestService";
import { showError } from "../utils/notifications";

export const useWalletStore = defineStore("wallet", {
  state: () => ({
    transactions: [],
    transactionDetails: null,
    page: 1,
    limit: 10,
    total: 0,
    loading: false,
  }),

  getters: {
    getTransactions: (state) => state.transactions,
    getTotal: (state) => state.total,
    getTransactionDetails: (state) => state.transactionDetails,
    getPage: (state) => state.page,
  },

  actions: {
    async fetchTransactions({ page, limit, search, filterBy }, t) {
      this.loading = true;
      try {
        const response = await requestService.getAll(
          "/wallet-transactions/paginate",
          {
            params: { page, limit, search, filterBy },
          }
        );
        this.transactions = response.data || [];
        this.total = response?.meta?.total || 0;
        this.page = page;
        this.limit = limit;
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
        showError(
          error?.response?.data?.status?.message ||
            t("transaction.fetch_one.error")
        );
      } finally {
        this.loading = false;
      }
    },

    async fetchTransactionDetails(id, t) {
      this.loading = true;
      try {
        const response = await requestService.getAll(
          `/wallet-transactions/${id}`,
          {
            params: { includes: "transactionType,wallet" },
          }
        );
        this.transactionDetails = response.data;
      } catch (error) {
        console.error("Failed to fetch transaction details:", error);
        this.transactionDetails = null;
        showError(
          error?.response?.data?.status?.message ||
            t("transaction.fetch_one.error")
        );
      } finally {
        this.loading = false;
      }
    },
  },
});
