<script setup>
import DashboardLayout from "../../Layout/DashboardLayout.vue";
import CustomConfirmDialog from "../../components/CustomConfirmDialog.vue";
import { useRouter, useRoute } from "vue-router";
import { ref, onMounted, computed } from "vue";
import { useWalletDepositsRequestsStore } from "../../store/walletDepositsRequests";
import { useI18n } from "vue-i18n";
import { showError, showSuccess } from "../../utils/notifications";
import { decode } from "js-base64";
import { MEDIA_URL } from "../../services/axios";
import { DashboardBreadCrumbBase } from "../../utils/constants";
import { formatAmount } from "../../utils/formatAmount";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const walletDepositsRequestsStore = useWalletDepositsRequestsStore();

const breadcrumbItems = [
  {
    label: "sidebar.wallet-deposits-requests",
    route: "/dashboard/wallet-deposits-requests",
  },
  { label: "dashboard.wallet-deposits-requests.details.title" },
];
const walletDepositRequest = ref(null);
const loading = ref(false);
const isConfirmDialogOpen = ref(false);
const selectedStatus = ref(null);
const confirmationDialogTitle = ref(
  t("dashboard.wallet-deposits-requests.confirmation.title")
);
const showAmountInputDialog = ref(false);
const customAmount = ref(walletDepositRequest.value?.amount || 0);
const confirmationMessageText = computed(() => {
  return selectedStatus.value === "approved"
    ? t("dashboard.wallet-deposits-requests.confirmation.approve")
    : t("dashboard.wallet-deposits-requests.confirmation.reject");
});

const fetchWalletDepositRequest = async () => {
  loading.value = true;
  try {
    const requestId = decode(route.params.requestId);
    const response =
      await walletDepositsRequestsStore.fetchWalletDepositRequest(
        parseInt(requestId),
        ["user", "status"]
      );
    walletDepositRequest.value = response.data;
  } catch (error) {
    showError(
      error || t("dashboard.wallet-deposits-requests.error.fetch_request")
    );
    router.push({ name: "wallet-deposits-requests" });
  } finally {
    loading.value = false;
  }
};

const processChangeStatus = (status) => {
  if (!walletDepositRequest.value?.id) return;
  if (status !== "approved" && status !== "rejected") return;

  selectedStatus.value = status;

  if (status === "approved") {
    customAmount.value = walletDepositRequest.value?.amount || 0;
    showAmountInputDialog.value = true;
  } else {
    isConfirmDialogOpen.value = true;
  }
};

const changeStatus = async () => {
  if (selectedStatus.value === "approved") {
    const amount = parseFloat(customAmount.value);

    if (isNaN(amount) || amount <= 0) {
      showError(t("dashboard.wallet-deposits-requests.error.invalid_amount"));
      return;
    }
  }
  try {
    const response = await walletDepositsRequestsStore.changeStatus(
      walletDepositRequest.value.id,
      selectedStatus.value,
      selectedStatus.value === "approved"
        ? parseFloat(customAmount.value)
        : undefined
    );

    showSuccess(
      response?.message ||
        t("dashboard.wallet-deposit-requests.form.status_changed_successfully")
    );
    await fetchWalletDepositRequest();
  } catch (error) {
    showError(
      error || t("dashboard.wallet-deposit-requests.error.select_request")
    );
  } finally {
    isConfirmDialogOpen.value = false;
    showAmountInputDialog.value = false;
  }
};

onMounted(fetchWalletDepositRequest);

const formattedAmount = computed(() =>
  walletDepositRequest.value?.amount
    ? formatAmount(walletDepositRequest.value.amount, {
        currency: walletDepositRequest.value?.currency || "USD",
        locale: "en-US",
      })
    : "__"
);

const formattedCreated = computed(() =>
  walletDepositRequest.value?.created
    ? new Date(walletDepositRequest.value.created).toLocaleString()
    : "__"
);

const formattedUpdated = computed(() =>
  walletDepositRequest.value?.updated
    ? new Date(walletDepositRequest.value.updated).toLocaleString()
    : "__"
);

const statusColor = computed(() => {
  switch (walletDepositRequest.value?.status?.code) {
    case "approved":
      return "text-green-600 bg-green-100";
    case "rejected":
      return "text-red-600 bg-red-100";
    case "pending":
      return "text-yellow-600 bg-yellow-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
});

const isPending = computed(
  () => walletDepositRequest.value?.status?.code === "pending"
);
</script>

<template>
  <dashboard-layout>
    <main class="px-4 md:px-8 py-[var(--padding-dashboard-section)]">
      <div
        class="card w-full mx-auto px-4 md:px-8 py-8 md:py-12 shadow-lg border border-gray-200 rounded-xl"
      >
        <Breadcrumb
          class="!p-0 mb-4"
          :home="DashboardBreadCrumbBase"
          :model="breadcrumbItems"
        >
          <template #item="{ item, props }">
            <router-link
              v-if="item.route"
              v-slot="{ href, navigate }"
              :to="item.route"
              custom
            >
              <a :href="href" v-bind="props.action" @click="navigate">
                <span :class="[item.icon, 'text-color']" />
                <span class="text-primary font-semibold">{{
                  item?.label && $t(`${item.label}`)
                }}</span>
              </a>
            </router-link>
            <a
              v-else
              :href="item.url"
              :target="item.target"
              v-bind="props.action"
            >
              <span class="text-surface-700 dark:text-surface-0">{{
                item?.label && $t(`${item.label}`)
              }}</span>
            </a>
          </template>
        </Breadcrumb>
        <!-- Loading State -->
        <div
          v-if="loading"
          class="text-center py-16 bg-white rounded-lg shadow"
        >
          <i class="pi pi-spin pi-spinner text-3xl text-gray-500 mb-4"></i>
          <p class="text-lg text-gray-600">{{ $t("generic.loading") }}</p>
        </div>

        <!-- Content -->
        <div
          v-else-if="walletDepositRequest"
          class="bg-white rounded-lg shadow-lg p-6 md:p-8"
        >
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Left: Details Card -->
            <div class="lg:col-span-2 space-y-6">
              <div class="border-b pb-4">
                <h2 class="text-xl font-semibold text-gray-800 mb-4">
                  {{ $t("dashboard.wallet-deposits-requests.details.title") }}
                </h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-600">
                      {{ $t("dashboard.wallet-deposits-requests.table.name") }}
                    </label>
                    <p class="text-lg font-medium text-gray-900">
                      {{ walletDepositRequest?.user?.name || "__" }}
                    </p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-600">
                      {{
                        $t("dashboard.wallet-deposits-requests.table.amount")
                      }}
                    </label>
                    <p class="text-lg font-medium text-gray-900">
                      {{ formattedAmount }}
                    </p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-600">
                      {{
                        $t("dashboard.wallet-deposits-requests.table.status_id")
                      }}
                    </label>
                    <p
                      class="text-lg font-semibold px-3 py-1 rounded-full inline-block"
                      :class="statusColor"
                    >
                      {{
                        walletDepositRequest?.status?.name ||
                        walletDepositRequest?.status?.name_en ||
                        "__"
                      }}
                    </p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-600">
                      {{
                        $t("dashboard.wallet-deposits-requests.table.created")
                      }}
                    </label>
                    <p class="text-lg font-medium text-gray-900">
                      {{ formattedCreated }}
                    </p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-600">
                      {{
                        $t("dashboard.wallet-deposits-requests.table.updated")
                      }}
                    </label>
                    <p class="text-lg font-medium text-gray-900">
                      {{ formattedUpdated }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Actions (if pending) -->
              <div v-if="isPending" class="flex gap-4">
                <button
                  class="custom-base-button !rounded-full flex-1 py-2 px-4 flex items-center justify-center gap-x-2"
                  @click="processChangeStatus('approved')"
                >
                  <i class="pi pi-check"></i>
                  <span>{{
                    $t("dashboard.wallet-deposits-requests.actions.approve")
                  }}</span>
                </button>

                <Button
                  rounded
                  class="flex-1 bg-green-600 hoverfont-medium py-2 px-4"
                  severity="danger"
                  @click="processChangeStatus('rejected')"
                  :label="
                    $t('dashboard.wallet-deposits-requests.actions.reject')
                  "
                  icon="pi pi-times"
                />
              </div>
            </div>

            <!-- Right: Proof Image Card with ViewerJS -->
            <div class="lg:col-span-1">
              <div
                class="bg-gradient-to-b from-gray-50 to-white rounded-xl p-4 border border-gray-200 shadow-md"
              >
                <label class="block text-sm font-semibold text-gray-800 mb-3">
                  {{
                    $t("dashboard.wallet-deposits-requests.details.proof_image")
                  }}
                </label>

                <div
                  v-if="walletDepositRequest?.proof_image"
                  v-viewer
                  class="relative w-full aspect-video overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm"
                >
                  <!-- Top-left label -->
                  <div
                    class="absolute top-2 left-2 bg-blue-50 text-blue-600 text-xs font-semibold px-2 py-1 rounded-md shadow-sm"
                  >
                    {{
                      $t("dashboard.wallet-deposits-requests.proof_label") ||
                      "Payment Receipt"
                    }}
                  </div>

                  <img
                    :src="`${MEDIA_URL}/${walletDepositRequest.proof_image}`"
                    :alt="
                      $t(
                        'dashboard.wallet-deposits-requests.details.proof_image'
                      )
                    "
                    class="w-full h-full object-contain cursor-zoom-in transition-transform duration-200 hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>

                <!-- Fallback (no image uploaded) -->
                <div
                  v-else
                  class="w-full aspect-video flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50"
                >
                  <div class="text-center text-gray-400 text-sm">
                    <i class="pi pi-image text-3xl mb-2"></i>
                    <p>
                      {{ $t("dashboard.wallet-deposits-requests.no-image") }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Data -->
        <div v-else class="text-center py-16 bg-white rounded-lg shadow">
          <p class="text-lg text-gray-600">
            {{ $t("dashboard.wallet-deposits-requests.no-data") }}
          </p>
        </div>
      </div>

      <!-- Confirmation Dialog -->
      <CustomConfirmDialog
        v-model="isConfirmDialogOpen"
        :title="confirmationDialogTitle"
        :content="confirmationMessageText"
        @confirm="changeStatus"
        :loading="walletDepositsRequestsStore.getStatusChangeLoading"
      />
      <!-- Amount Input Dialog -->
      <CustomConfirmDialog
        v-model="showAmountInputDialog"
        :title="$t('dashboard.wallet-deposits-requests.confirmation.title')"
        :content="confirmationMessageText"
        @confirm="changeStatus"
        :loading="walletDepositsRequestsStore.getStatusChangeLoading"
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
    </main>
  </dashboard-layout>
</template>

<style scoped>
.custom-container {
  max-width: 80rem; /* max-w-7xl */
  margin-left: auto; /* mx-auto */
  margin-right: auto; /* mx-auto */
  padding-left: 1rem; /* px-4 */
  padding-right: 1rem; /* px-4 */
}

@media (min-width: 640px) {
  .custom-container {
    padding-left: 1.5rem; /* sm:px-6 */
    padding-right: 1.5rem; /* sm:px-6 */
  }
}

@media (min-width: 1024px) {
  .custom-container {
    padding-left: 2rem; /* lg:px-8 */
    padding-right: 2rem; /* lg:px-8 */
  }
}
</style>
