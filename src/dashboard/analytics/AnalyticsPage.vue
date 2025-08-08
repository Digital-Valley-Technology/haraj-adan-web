<script setup>
import DashboardLayout from "../../Layout/DashboardLayout.vue";
import { useI18n } from "vue-i18n";
import { useAdminStatisticsStore } from "../../store/adminStatistics";
import { onMounted } from "vue";

const { t } = useI18n();
const adminStatsStore = useAdminStatisticsStore();

onMounted(() => {
  adminStatsStore.fetchStatistics();
});
</script>

<template>
  <dashboard-layout>
    <main class="py-[var(--padding-dashboard-section)] custom-container">
      <div
        class="card min-h-[500px] w-full mx-auto px-4 md:px-8 py-8 md:py-12 shadow-lg border border-gray-200 rounded-lg"
      >
        <!-- Page Title -->
        <h2 class="text-2xl font-semibold mb-6">
          {{ t("sidebar.analytics") }}
        </h2>

        <template v-if="adminStatsStore.loading">
          <p class="text-center">Loading statistics...</p>
        </template>

        <template v-else-if="adminStatsStore.error">
          <p class="text-center text-red-600">
            {{ t("dashboard.analytics.errorLoading") }}
          </p>
        </template>

        <template v-else-if="adminStatsStore.statistics">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div class="p-4 rounded-lg bg-gray-100 shadow-sm">
              <h3 class="text-lg font-medium">
                {{ t("dashboard.analytics.totalUsers") }}
              </h3>
              <p class="text-2xl font-bold">
                {{ adminStatsStore.statistics.totalUsers }}
              </p>
            </div>
            <div class="p-4 rounded-lg bg-gray-100 shadow-sm">
              <h3 class="text-lg font-medium">
                {{ t("dashboard.analytics.totalAds") }}
              </h3>
              <p class="text-2xl font-bold">
                {{ adminStatsStore.statistics.totalAds }}
              </p>
            </div>
            <div class="p-4 rounded-lg bg-gray-100 shadow-sm">
              <h3 class="text-lg font-medium">
                {{ t("dashboard.analytics.totalCategories") }}
              </h3>
              <p class="text-2xl font-bold">
                {{ adminStatsStore.statistics.totalCategories }}
              </p>
            </div>
          </div>

          <!-- Add more stats or charts here -->

          <div class="p-4 rounded-lg bg-gray-100 shadow-sm mb-6">
            <h3 class="text-lg font-medium">
              {{ t("dashboard.analytics.featuredAds") }}
            </h3>
            <p class="text-2xl font-bold">
              {{ adminStatsStore.statistics.featuredAdCount }}
            </p>
          </div>

          <!-- Chart placeholder -->
          <div
            class="h-[300px] flex items-center justify-center bg-white border border-dashed border-gray-300 rounded-lg"
          >
            <span class="text-gray-400 italic">
              {{ t("dashboard.analytics.chartPlaceholder") }}
            </span>
          </div>
        </template>
      </div>
    </main>
  </dashboard-layout>
</template>
