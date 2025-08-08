<script setup>
import DashboardLayout from "../../Layout/DashboardLayout.vue";
import WalletTransactionsTable from "./WalletTransactionsTable.vue";
import NoData from "../../components/NoData.vue";
import WalletTransactionsTableHeader from "./WalletTransactionsTableHeader.vue";
import { onMounted, computed, ref, watch } from "vue";
import { useWalletStore } from "../../store/wallet";
import { useDebounceFn } from "@vueuse/core";
import { useI18n } from "vue-i18n";

const walletStore = useWalletStore();
const { t } = useI18n();
const searchText = ref("");
const selectedFilter = ref({ name: "id" }); // Default filter

const fetchData = () => {
  walletStore.fetchTransactions(
    {
      page: walletStore.page,
      limit: walletStore.limit,
      search: searchText.value,
      filterBy: selectedFilter.value?.name,
    },
    t
  );
};

onMounted(fetchData);

watch(
  [searchText, selectedFilter],
  useDebounceFn(() => {
    walletStore.page = 1; // Reset to page 1 on filter/search change
    fetchData();
  }, 500)
);

const transactions = computed(() => walletStore.getTransactions);
const total = computed(() => walletStore.getTotal);
</script>

<template>
  <dashboard-layout>
    <main class="py-[var(--padding-dashboard-section)] custom-container">
      <div
        class="card min-h-[500px] w-full mx-auto px-4 md:px-8 py-8 md:py-12 shadow-lg border border-gray-200 rounded-lg"
      >
        <wallet-transactions-table-header
          :total="total"
          v-model:modelValue="searchText"
          v-model:selectedFilter="selectedFilter"
        />
        <wallet-transactions-table
          v-if="transactions?.length > 0"
          :transactions="transactions"
          @fetch-transactions="fetchData()"
        />
        <no-data
          v-else
          class="mt-12"
          :content="$t('dashboard.transactions.no-data')"
        />
      </div>
    </main>
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
