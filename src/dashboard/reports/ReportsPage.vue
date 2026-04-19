<script setup>
import DashboardLayout from "../../Layout/DashboardLayout.vue";
import DeleteDialog from "../../components/DeleteDialog.vue";
import ReportsTable from "./ReportsTable.vue";
import NoData from "../../components/NoData.vue";
import ReportsTableHeader from "./ReportsTableHeader.vue";
import { onMounted, computed, ref, watch } from "vue";
import { useReportsStore } from "../../store/reports";
import { useDebounceFn } from "@vueuse/core";
import { showError, showSuccess } from "../../utils/notifications";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { t } = useI18n();
const router = useRouter();
const reportsStore = useReportsStore();

const isSubmitting = ref(false);
const selectedReportId = ref(null);

// Delete dialog state
const isDeleteDialogOpen = ref(false);

// Local search/filter state
const searchText = ref("");
const selectedFilter = ref({ name: "reason" });
const statusFilter = ref("");

// Fetch reports from store
const fetchData = () => {
  reportsStore.fetchReports({
    page: reportsStore.page,
    limit: reportsStore.limit,
    search: searchText.value,
    filterBy: selectedFilter.value?.name,
    status: statusFilter.value || null,
  });
};

const handleDelete = async () => {
  if (!selectedReportId.value) return;

  isSubmitting.value = true;

  try {
    const response = await reportsStore.deleteReport(selectedReportId.value);

    showSuccess(
      response?.message || t("dashboard.reports.deleted_successfully")
    );

    fetchData();
  } catch (error) {
    console.error(error);
    showError(error?.message || t("dashboard.reports.delete_failed"));
  } finally {
    isDeleteDialogOpen.value = false;
    isSubmitting.value = false;
  }
};

const handleUpdateStatus = async (reportId, status) => {
  try {
    const response = await reportsStore.updateReportStatus(reportId, status);

    showSuccess(
      response?.message || t("dashboard.reports.status_updated")
    );

    fetchData();
  } catch (error) {
    console.error(error);
    showError(error?.message || t("dashboard.reports.update_failed"));
  }
};

const processDelete = (report) => {
  selectedReportId.value = report?.id;
  isDeleteDialogOpen.value = true;
};

const viewAd = (adId) => {
  // Open ad details in a new tab
  const route = router.resolve({ name: "ad-details", params: { adId } });
  window.open(route.href, "_blank");
};

onMounted(fetchData);

// Debounced fetch on search/filter change
watch(
  [searchText, selectedFilter, statusFilter],
  useDebounceFn(() => {
    reportsStore.page = 1;
    fetchData();
  }, 500)
);

// Computed
const reports = computed(() => reportsStore.getReports);
const total = computed(() => reportsStore.getTotal);
</script>

<template>
  <dashboard-layout>
    <main class="py-[var(--padding-dashboard-section)] custom-container">
      <div
        class="card min-h-[500px] w-full mx-auto px-4 md:px-8 py-8 md:py-12 shadow-lg border border-gray-200 rounded-lg"
      >
        <reports-table-header
          :total="total"
          v-model:modelValue="searchText"
          v-model:selectedFilter="selectedFilter"
          v-model:statusFilter="statusFilter"
        />
        <reports-table
          v-if="reports?.length > 0"
          :reports="reports"
          @delete="processDelete"
          @fetch-reports="fetchData"
          @update-status="handleUpdateStatus"
          @view-ad="viewAd"
        />
        <no-data
          v-else
          class="mt-12"
          :content="$t('dashboard.reports.no_data')"
        />
      </div>
    </main>

    <DeleteDialog
      v-model="isDeleteDialogOpen"
      :content="$t('generic.delete_confirmation')"
      @confirm="handleDelete"
    />
  </dashboard-layout>
</template>

<style scoped>
main {
  min-height: calc(100vh - var(--padding-dashboard-layout-top));
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
