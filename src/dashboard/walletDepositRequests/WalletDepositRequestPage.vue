<script setup>
import DashboardLayout from "../../Layout/DashboardLayout.vue";
import WalletDepositsRequestsTable from "./WalletDepositsRequestsTable.vue";
import NoData from "../../components/NoData.vue";
import WalletDepositsRequestsTableHeader from "./WalletDepositsRequestsTableHeader.vue";
import { onMounted, computed, ref, watch } from "vue";
import { useWalletDepositsRequestsStore } from "../../store/walletDepositsRequests";
import { useDebounceFn } from "@vueuse/core";
import { showError, showSuccess } from "../../utils/notifications";
import requestService from "../../services/api/requestService";
import CustomConfirmDialog from "../../components/CustomConfirmDialog.vue";
import { useI18n } from "vue-i18n";

const walletDepositsRequestsStore = useWalletDepositsRequestsStore();
const { t } = useI18n();
const isSubmitting = ref(false);
const selectedWalletDepositRequestId = ref(null); // or passed as a prop if used inside a row
const selectedWalletDepositRequestStatus = ref(null); // to hold the status for confirmation dialog
// dialog state
const isConfirmDialogOpen = ref(false);

const customAmount = ref(0);

const confirmDialogMessage = ref("");
const confirmationDialogTitle = ref(
  t("dashboard.wallet-deposits-requests.confirmation.title")
);

const confirmationMessageText = computed(() => {
  return selectedWalletDepositRequestStatus.value === "approved"
    ? t("dashboard.wallet-deposits-requests.confirmation.approve")
    : t("dashboard.wallet-deposits-requests.confirmation.reject");
});

// Local search/filter state
const searchText = ref("");
const selectedFilter = ref({ name: "name" }); //  default filter set

// Fetch wallet deposit requests from store
const fetchData = () => {
  walletDepositsRequestsStore.fetchWalletDepositsRequests({
    page: walletDepositsRequestsStore.page,
    limit: walletDepositsRequestsStore.limit,
    search: searchText.value,
    filterBy: selectedFilter.value?.name,
  });
};

const processChangeStatus = (walletDepositRequest, status) => {
  if (!walletDepositRequest?.id) return;
  if (status !== "approved" && status !== "rejected") return;

  isConfirmDialogOpen.value = true;
  selectedWalletDepositRequestId.value = walletDepositRequest?.id;
  selectedWalletDepositRequestStatus.value = status;
  customAmount.value = walletDepositRequest?.amount;
};

const changeStatus = async () => {
  if (selectedWalletDepositRequestStatus.value === "approved") {
    const amount = parseFloat(customAmount.value);

    if (isNaN(amount) || amount <= 0) {
      showError(t("dashboard.wallet-deposits-requests.error.invalid_amount"));
      return;
    }
  }
  try {
    const response = await walletDepositsRequestsStore.changeStatus(
      selectedWalletDepositRequestId.value,
      selectedWalletDepositRequestStatus.value,
      selectedWalletDepositRequestStatus.value === "approved"
        ? parseFloat(customAmount.value)
        : undefined
    );
    showSuccess(
      response?.message ||
        t("dashboard.wallet-deposit-requests.form.status_changed_successfully")
    );
    fetchData();
  } catch (error) {
    showError(
      error ||
        error?.message ||
        t("dashboard.wallet-deposit-requests.error.select_request")
    );
  } finally {
    isConfirmDialogOpen.value = false;
  }
};

onMounted(fetchData);

// Debounced fetch on search/filter change
watch(
  [searchText, selectedFilter],
  useDebounceFn(() => {
    walletDepositsRequestsStore.page = 1; // reset to page 1 on filter/search change
    fetchData();
  }, 500)
);

// Computed values
const walletDepositsRequests = computed(
  () => walletDepositsRequestsStore.getWalletDepositsRequests
);
const total = computed(() => walletDepositsRequestsStore.getTotal); // use total from store
</script>

<template>
  <dashboard-layout>
    <main class="py-[var(--padding-dashboard-section)] custom-container">
      <div
        class="card min-h-[500px] w-full mx-auto px-4 md:px-8 py-8 md:py-12 shadow-lg border border-gray-200 rounded-lg"
      >
        <wallet-deposits-requests-table-header
          :total="total"
          v-model:modelValue="searchText"
          v-model:selectedFilter="selectedFilter"
        />
        <wallet-deposits-requests-table
          v-if="walletDepositsRequests?.length > 0"
          :wallet-deposits-requests="walletDepositsRequests"
          @fetch-wallet-deposits-requests="fetchData()"
          @change-status="
            (data) =>
              processChangeStatus(data?.walletDepositRequest, data?.status)
          "
        />
        <no-data
          v-else
          class="mt-12"
          :content="$t('dashboard.wallet-deposits-requests.no-data')"
        />
      </div>
    </main>

    <CustomConfirmDialog
      v-model="isConfirmDialogOpen"
      :title="confirmationDialogTitle"
      :content="confirmationMessageText"
      @confirm="changeStatus"
    >
      <template #default>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ $t("dashboard.wallet-deposits-requests.enter-amount") }}
          </label>
          <input
            v-model="customAmount"
            type="number"
            step="0.01"
            min="0"
            class="w-full border border-gray-300 rounded-md px-3 py-2"
            :placeholder="$t('dashboard.wallet-deposits-requests.amount')"
          />
        </div>
      </template>
    </CustomConfirmDialog>
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
