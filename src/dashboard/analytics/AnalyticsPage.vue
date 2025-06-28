<script setup>
import DashboardLayout from "../../Layout/DashboardLayout.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <dashboard-layout>
    <main class="py-[var(--padding-dashboard-section)] custom-container">
      <div
        class="card min-h-[500px] w-full mx-auto px-4 md:px-8 py-8 md:py-12 shadow-lg border border-gray-200 rounded-lg"
      >
        <!-- Page Title -->
        <h2 class="text-2xl font-semibold mb-6">
          {{ t("dashboard.analytics.title") }}
        </h2>

        <!-- Placeholder Stats Section -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div class="p-4 rounded-lg bg-gray-100 shadow-sm">
            <h3 class="text-lg font-medium">{{ t("dashboard.analytics.totalUsers") }}</h3>
            <p class="text-2xl font-bold">1,254</p>
          </div>
          <div class="p-4 rounded-lg bg-gray-100 shadow-sm">
            <h3 class="text-lg font-medium">{{ t("dashboard.analytics.totalSessions") }}</h3>
            <p class="text-2xl font-bold">3,782</p>
          </div>
          <div class="p-4 rounded-lg bg-gray-100 shadow-sm">
            <h3 class="text-lg font-medium">{{ t("dashboard.analytics.conversionRate") }}</h3>
            <p class="text-2xl font-bold">4.3%</p>
          </div>
        </div>

        <!-- Placeholder for charts or visual data -->
        <div class="h-[300px] flex items-center justify-center bg-white border border-dashed border-gray-300 rounded-lg">
          <span class="text-gray-400 italic">{{ t("dashboard.analytics.chartPlaceholder") }}</span>
        </div>
      </div>
    </main>
  </dashboard-layout>
</template>
