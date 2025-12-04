<script setup>
import DashboardLayout from "../../Layout/DashboardLayout.vue";
import DeleteDialog from "../../components/DeleteDialog.vue";
import NoData from "../../components/NoData.vue";
import AdsTableHeader from "./AdsTableHeader.vue";
import AdsTable from "./AdsTable.vue";

import { onMounted, computed, ref, watch } from "vue";
import { useAdsStore } from "../../store/ads";
import { useDebounceFn } from "@vueuse/core";
import { showError, showSuccess } from "../../utils/notifications";
import requestService from "../../services/api/requestService";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const adsStore = useAdsStore();
const adsStatuses = ref([]);
const isSubmitting = ref(false);
const selectedAdId = ref(null);
const selectedAd = ref({});
const showRefundDialog = ref(false);

// Dialog states
const isDeleteDialogOpen = ref(false);

// Search / Filter
const searchText = ref("");
const selectedFilter = ref({ name: "title" });

// Fetch ads from store
const fetchData = () => {
  adsStore.fetchAds({
    page: adsStore.page,
    limit: adsStore.limit,
    search: searchText.value,
    filterBy: selectedFilter.value?.name,
  });
};

const fetchAdStatuses = async () => {
  try {
    const response = await requestService.getAll("/ads/statuses");
    adsStatuses.value = response?.data || [];
  } catch (error) {
    console.error("Failed to fetch ad statuses:", error);
  }
};

const processRefund = (ad) => {
  selectedAd.value = ad;
  showRefundDialog.value = true;
};

const handleRefund = async () => {
  try {
    // your refund API logic goes here
    const currentRefund = selectedAd?.value?.ad_refunds_requests?.find(
      (refund) => !refund?.status
    );

    const res = await requestService.patch(
      `ads/${currentRefund?.id}/confirm-refund`
    );
    showSuccess(res?.message || "refund confirmed");
    fetchData();
  } catch (error) {
    console.log(error);
    showError(error || "unable to confirm this refund");
  } finally {
    showRefundDialog.value = false;
  }
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

const updateStatus = async (adId, statusId) => {
  try {
    const response = await requestService.patch(`/ads/${adId}/status`, {
      status_id: statusId,
    });

    showSuccess(
      response?.message || t("dashboard.ads.form.status_updated_successfully")
    );

    fetchData();
  } catch (error) {
    console.error(error);
    showError(error || t("dashboard.ads.form.update_failed"));
  }
};

const processDelete = (ad) => {
  selectedAdId.value = ad?.id;
  isDeleteDialogOpen.value = true;
};

// Fetch data on mount
onMounted(() => {
  fetchData();
  fetchAdStatuses();
});

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

// NEW COMPUTEDS ------------------------------------

const hasRefundRequest = computed(() => {
  return (
    selectedAd.value?.ad_refunds_requests &&
    selectedAd.value.ad_refunds_requests.length > 0
  );
});

const isAlreadyRefunded = computed(() => {
  return selectedAd.value?.ad_refunds_requests?.some(
    (req) => req.status === true
  );
});
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
          :adsStatuses="adsStatuses"
          @delete="processDelete"
          @fetch-ads="fetchData"
          @update-status="updateStatus"
          @handle-refund="(ad) => processRefund(ad)"
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

    <!-- Refund Dialog -->
    <Dialog
      v-model:visible="showRefundDialog"
      :style="{ width: '500px' }"
      :modal="true"
      :closable="false"
    >
      <div class="space-y-6">
        <!-- Header -->
        <div>
          <h2
            class="text-xl font-semibold text-gray-900 flex items-center gap-2"
          >
            <i class="pi pi-receipt text-primary"></i>
            {{ $t("dashboard.ads.refund") }}
          </h2>
          <p class="text-gray-600 text-sm">{{ selectedAd?.title }}</p>
        </div>

        <!-- Invoice -->
        <div class="border rounded-lg shadow-sm p-4 bg-gray-50">
          <div class="flex justify-between items-center pb-3 border-b">
            <h3 class="font-bold text-gray-800 text-md">
              {{ $t("dashboard.ads.invoice_summary") }}
            </h3>
            <span class="text-xs text-gray-500"> #{{ selectedAd?.id }} </span>
          </div>

          <div class="mt-4 space-y-3">
            <!-- Refund Amount -->
            <div class="flex justify-between text-gray-700">
              <span>{{ $t("dashboard.ads.refund_amount") }}</span>
              <span class="font-semibold text-green-600">
                {{
                  selectedAd?.ad_featured_history?.[0]?.wallet_transactions
                    ?.amount || "0"
                }}
                $
              </span>
            </div>

            <!-- Refund Request Status -->
            <div class="flex justify-between text-gray-700">
              <span>{{ $t("dashboard.ads.refund_requested_at") }}</span>
              <span
                class="font-semibold"
                :class="
                  isAlreadyRefunded
                    ? 'text-green-600'
                    : hasRefundRequest
                    ? ''
                    : 'text-red-500'
                "
              >
                <template v-if="!hasRefundRequest">
                  {{ $t("dashboard.ads.no_refund_request") }}
                </template>

                <template v-else-if="isAlreadyRefunded">
                  {{ $t("dashboard.ads.refund_already_processed") }}
                </template>

                <template v-else>
                  {{
                    new Date(
                      selectedAd?.ad_refunds_requests?.[0]?.created
                    ).toLocaleString()
                  }}
                </template>
              </span>
            </div>
          </div>
        </div>

        <!-- Dynamic Confirm Text -->
        <p class="text-center text-gray-700">
          <template v-if="!hasRefundRequest">
            {{ $t("dashboard.ads.no_refund_request_message") }}
          </template>

          <template v-else-if="isAlreadyRefunded">
            {{ $t("dashboard.ads.refund_already_processed_message") }}
          </template>

          <template v-else>
            {{ $t("dashboard.ads.refund_confirmation_message") }}
          </template>
        </p>
      </div>

      <!-- Footer -->
      <template #footer>
        <Button
          :label="t('generic.cancel')"
          icon="pi pi-times"
          text
          @click="showRefundDialog = false"
        />

        <!-- Show YES only if there is a refund request and it’s not yet refunded -->
        <Button
          v-if="hasRefundRequest && !isAlreadyRefunded"
          :label="t('generic.yes')"
          icon="pi pi-check"
          class="p-button-danger"
          text
          @click="handleRefund"
        />
      </template>
    </Dialog>
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
