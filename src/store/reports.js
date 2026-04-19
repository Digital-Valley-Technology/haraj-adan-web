import { defineStore } from "pinia";
import requestService from "../services/api/requestService";

export const useReportsStore = defineStore("reports", {
  state: () => ({
    reports: [],
    page: 1,
    limit: 10,
    total: 0,
    loading: false,
    statusFilter: null,
  }),
  getters: {
    getReports: (state) => state.reports,
    getTotal: (state) => state.total,
  },
  actions: {
    async fetchReports({ page, limit, search = "", filterBy = null, status = null }) {
      try {
        this.loading = true;
        const query = new URLSearchParams();

        if (search && filterBy) {
          query.append("search", search);
          query.append("filterBy", filterBy);
        }

        if (status) {
          query.append("status", status);
        }

        query.append("page", page);
        query.append("limit", limit);

        const response = await requestService.getAll(
          `/ads/reports/paginate?${query.toString()}`
        );

        this.reports = response?.data || [];
        this.total = response?.meta?.total || 0;
        this.page = response?.meta?.page || page;
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      } finally {
        this.loading = false;
      }
    },

    async updateReportStatus(reportId, status) {
      try {
        const response = await requestService.patch(`/ads/reports/${reportId}/status`, {
          status,
        });
        return response;
      } catch (err) {
        console.error("Failed to update report status:", err);
        throw err;
      }
    },

    async deleteReport(reportId) {
      try {
        const response = await requestService.delete("/ads/reports", reportId);
        return response;
      } catch (err) {
        console.error("Failed to delete report:", err);
        throw err;
      }
    },
  },
});
