<script setup>
import { useReportsStore } from "../../store/reports";
import { useI18n } from "vue-i18n";
import dayjs from "dayjs";

defineProps(["reports"]);
const emit = defineEmits(["delete", "fetchReports", "updateStatus", "viewAd"]);

const { t, locale } = useI18n();
const reportsStore = useReportsStore();

const formatDate = (date) => {
  if (!date) return "-";
  return dayjs(date).format("MMM D, YYYY HH:mm");
};

const getStatusSeverity = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "reviewed":
      return "bg-blue-100 text-blue-700";
    case "resolved":
      return "bg-green-100 text-green-700";
    case "dismissed":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getReasonLabel = (reason) => {
  const reasonMap = {
    spam: "report.reasons.spam",
    inappropriate: "report.reasons.inappropriate",
    fraud: "report.reasons.fraud",
    wrong_category: "report.reasons.wrong_category",
    duplicate: "report.reasons.duplicate",
    other: "report.reasons.other",
  };
  return reasonMap[reason] || reason;
};

const statusOptions = [
  { value: "pending", label: "dashboard.reports.status.pending" },
  { value: "reviewed", label: "dashboard.reports.status.reviewed" },
  { value: "resolved", label: "dashboard.reports.status.resolved" },
  { value: "dismissed", label: "dashboard.reports.status.dismissed" },
];

const handleDelete = (report) => emit("delete", report);
const handleStatusChange = (reportId, status) => emit("updateStatus", reportId, status);
const handleViewAd = (adId) => emit("viewAd", adId);
</script>

<template>
  <DataTable
    :value="reports"
    paginator
    :lazy="true"
    :rowsPerPageOptions="[5, 10, 20, 50]"
    tableStyle="min-width: 60rem"
    :rows="reportsStore.limit"
    :totalRecords="reportsStore.total"
    :first="(reportsStore.page - 1) * reportsStore.limit"
    :pageLinkSize="7"
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
    :currentPageReportTemplate="`{first} - {last} / {totalRecords}`"
    @page="
      (e) => {
        if (e.rows !== reportsStore.limit) {
          reportsStore.page = 1;
          reportsStore.limit = e.rows;
        } else {
          reportsStore.page = e.page + 1;
        }
        emit('fetchReports');
      }
    "
    :loading="reportsStore.loading"
  >
    <Column field="id" :header="$t('dashboard.reports.table.id')" style="width: 80px">
      <template #body="{ data }">
        <span class="text-gray-500 text-sm">#{{ data.id }}</span>
      </template>
    </Column>

    <Column field="ad_id" :header="$t('dashboard.reports.table.ad')">
      <template #body="{ data }">
        <div class="flex flex-col">
          <span class="font-medium text-sm">
            {{ locale === "ar" ? data.ads?.title : data.ads?.title_en || data.ads?.title }}
          </span>
          <a
            @click="handleViewAd(data.ad_id)"
            class="text-[#146AAB] text-xs cursor-pointer hover:underline"
          >
            {{ $t('dashboard.reports.view_ad') }} #{{ data.ad_id }}
          </a>
        </div>
      </template>
    </Column>

    <Column field="user_id" :header="$t('dashboard.reports.table.reporter')">
      <template #body="{ data }">
        <div class="flex flex-col">
          <span class="text-sm">{{ data.users?.name || "-" }}</span>
          <span class="text-xs text-gray-500">{{ data.users?.email || "-" }}</span>
        </div>
      </template>
    </Column>

    <Column field="reason" :header="$t('dashboard.reports.table.reason')">
      <template #body="{ data }">
        <span class="text-sm">{{ $t(getReasonLabel(data.reason)) }}</span>
      </template>
    </Column>

    <Column field="description" :header="$t('dashboard.reports.table.description')">
      <template #body="{ data }">
        <span class="text-sm text-gray-600 line-clamp-2">
          {{ data.description || "-" }}
        </span>
      </template>
    </Column>

    <Column field="status" :header="$t('dashboard.reports.table.status')">
      <template #body="{ data }">
        <span
          class="px-2 py-1 rounded text-xs font-medium"
          :class="getStatusSeverity(data.status)"
        >
          {{ $t(`dashboard.reports.status.${data.status}`) }}
        </span>
      </template>
    </Column>

    <Column field="created" :header="$t('dashboard.reports.table.date')">
      <template #body="{ data }">
        <span class="text-sm text-gray-600">{{ formatDate(data.created) }}</span>
      </template>
    </Column>

    <Column :header="$t('dashboard.reports.table.actions')" style="width: 200px">
      <template #body="{ data }">
        <div class="flex gap-2">
          <select
            :value="data.status"
            @change="handleStatusChange(data.id, $event.target.value)"
            class="border border-gray-300 rounded px-2 py-1 text-xs"
          >
            <option
              v-for="status in statusOptions"
              :key="status.value"
              :value="status.value"
            >
              {{ $t(status.label) }}
            </option>
          </select>
          <Button
            icon="pi pi-trash"
            severity="danger"
            size="small"
            rounded
            @click="handleDelete(data)"
          />
        </div>
      </template>
    </Column>
  </DataTable>
</template>
