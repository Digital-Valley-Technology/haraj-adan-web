<script setup>
import DashboardLayout from "../../Layout/DashboardLayout.vue";
import DeleteDialog from "../../components/DeleteDialog.vue";
import NoData from "../../components/NoData.vue";
import AdsTableHeader from "./AdsTableHeader.vue";
import AdsTable from "./AdsTable.vue";
import CustomConfirmDialog from "../../components/CustomConfirmDialog.vue";

import { onMounted, computed, ref, watch } from "vue";
import { useAdsStore } from "../../store/ads";
import { useDebounceFn } from "@vueuse/core";
import { showError, showSuccess } from "../../utils/notifications";
import requestService from "../../services/api/requestService";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const adsStore = useAdsStore();

const isSubmitting = ref(false);
const selectedAdId = ref(null); // Store the ID of the ad to delete

// Dialog states
const isDeleteDialogOpen = ref(false);
const isConfirmDialogOpen = ref(false);

// Confirmation state
const confirmationMessageText = ref("");
const selectedAd = ref({});

const banLoading = ref(false);

// Search / Filter
const searchText = ref("");
const selectedFilter = ref({ name: "title" }); // Default filter

// Fetch ads from store
const fetchData = () => {
  adsStore.fetchAds({
    page: adsStore.page,
    limit: adsStore.limit,
    search: searchText.value,
    filterBy: selectedFilter.value?.name,
  });
};

const handleDelete = async () => {
  if (!selectedAdId.value) return;

  isSubmitting.value = true;
  try {
    const response = await requestService.delete("/ads", selectedAdId.value);

    showSuccess(
      response?.message || t("dashboard.ads.form.deleted_successfully")
    );

    fetchData();
  } catch (error) {
    console.error(error);
    showError(error || t("dashboard.ads.form.delete_failed"));
  } finally {
    isDeleteDialogOpen.value = false;
    isSubmitting.value = false;
  }
};

const processDelete = (ad) => {
  selectedAdId.value = ad?.id;
  isDeleteDialogOpen.value = true;
};

// Fetch data on mount
onMounted(fetchData);

// Debounced fetch on search/filter change
watch(
  [searchText, selectedFilter],
  useDebounceFn(() => {
    adsStore.page = 1;
    fetchData();
  }, 500)
);

// Computed
const ads = computed(() => adsStore.getAds);
const total = computed(() => adsStore.getTotal);
</script>

<template>
  <dashboard-layout>
    <main class="py-[var(--padding-dashboard-section)] custom-container">
      <div
        class="card min-h-[500px] w-full mx-auto px-4 md:px-8 py-8 md:py-12 shadow-lg border border-gray-200 rounded-lg"
      >
        <ads-table-header
          :total="total"
          v-model:modelValue="searchText"
          v-model:selectedFilter="selectedFilter"
        />
        <ads-table
          v-if="ads?.length > 0"
          :ads="ads"
          @delete="processDelete"
          @fetch-ads="fetchData"
        />
        <no-data v-else class="mt-12" :content="$t('dashboard.ads.no_data')" />
      </div>
    </main>

    <!-- Delete Dialog -->
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
