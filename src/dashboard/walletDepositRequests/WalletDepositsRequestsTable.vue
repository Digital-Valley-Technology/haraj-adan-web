<script setup>
import { encode } from "js-base64";
import { useRouter } from "vue-router";
import { MEDIA_URL } from "../../services/axios";
import { useWalletDepositsRequestsStore } from "../../store/walletDepositsRequests";
import { useLocaleText } from "../../utils/useLocaleText";
import { formatAmount } from "../../utils/formatAmount";

defineProps(["walletDepositsRequests"]);
const emit = defineEmits(["fetchWalletDepositsRequests", "change-status"]);

const walletDepositsRequestsStore = useWalletDepositsRequestsStore();
const localeText = useLocaleText();
const router = useRouter();

const changeStatus = (walletDepositRequest, status) =>
  emit("change-status", {
    walletDepositRequest,
    status,
  });

const handleNavigate = (walletDepositRequest, action) => {
  if (action === "details") {
    router.push({
      name: "wallet-deposit-request-details",
      params: { requestId: encode(walletDepositRequest.id) },
    });
  }
};
</script>

<template>
  <DataTable
    :value="walletDepositsRequests"
    paginator
    :lazy="true"
    :rowsPerPageOptions="[5, 10, 20, 50]"
    tableStyle="min-width: 50rem"
    :rows="walletDepositsRequestsStore.limit"
    :totalRecords="walletDepositsRequestsStore.total"
    :first="
      (walletDepositsRequestsStore.page - 1) * walletDepositsRequestsStore.limit
    "
    @page="
      (e) => {
        if (e.rows !== walletDepositsRequestsStore.limit) {
          walletDepositsRequestsStore.page = 1;
          walletDepositsRequestsStore.limit = e.rows;
        } else {
          walletDepositsRequestsStore.page = e.page + 1;
        }
        emit('fetchWalletDepositsRequests');
      }
    "
    :loading="walletDepositsRequestsStore?.loading"
  >
    <!-- User Name -->
    <Column
      field="users.name"
      :header="$t('dashboard.wallet-deposits-requests.table.name')"
    >
      <template #body="slotProps">
        <p class="text-sm truncate w-full">
          {{ slotProps?.data?.users ? slotProps?.data?.users?.name : "__" }}
        </p>
      </template>
    </Column>

    <!-- Amount -->
    <Column
      field="amount"
      :header="$t('dashboard.wallet-deposits-requests.table.amount')"
    >
      <template #body="slotProps">
        <p class="text-sm">
          {{
            formatAmount(slotProps?.data?.amount, {
              currency: slotProps?.data?.currency || "USD",
              locale: "en-US",
            })
          }}
        </p>
      </template>
    </Column>

    <!-- Status -->
    <Column
      field="status_id"
      :header="$t('dashboard.wallet-deposits-requests.table.status_id')"
    >
      <template #body="slotProps">
        <p
          class="text-sm break-words font-semibold"
          :class="{
            'text-green-600':
              slotProps?.data?.deposits_requests_status?.code === 'approved',
            'text-red-600':
              slotProps?.data?.deposits_requests_status?.code === 'rejected',
            'text-yellow-500':
              slotProps?.data?.deposits_requests_status?.code === 'pending',
            'text-gray-500': !slotProps?.data?.deposits_requests_status?.code,
          }"
        >
          {{
            slotProps?.data?.deposits_requests_status
              ? localeText(
                  slotProps?.data?.deposits_requests_status?.name,
                  slotProps?.data?.deposits_requests_status?.name_en
                )
              : "__"
          }}
        </p>
      </template>
    </Column>

    <!-- Image -->
    <Column field="image" :header="$t('table.image')">
      <template #body="slotProps">
        <div
          v-if="slotProps?.data?.proof_image"
          v-viewer
          class="relative w-[80px] aspect-square rounded-md border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-transform duration-200 hover:scale-105"
        >
          <div
            class="relative rounded-lg border border-gray-300 bg-white overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition"
            @click="() => viewerInstance?.show()"
          >
            <div
              class="absolute top-1 left-1 bg-blue-50 text-blue-600 text-[10px] font-semibold px-1.5 py-0.5 rounded shadow-sm z-10"
            >
              {{ $t("dashboard.wallet-deposits-requests.proof_label") }}
            </div>

            <img
              :src="`${MEDIA_URL}/${slotProps?.data?.proof_image}`"
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <!-- Hidden DOM image for ViewerJS to use -->
          <div ref="viewerRef" class="hidden">
            <img
              :src="`${MEDIA_URL}/${slotProps?.data?.proof_image}`"
              :alt="slotProps?.data?.name"
            />
          </div>
        </div>

        <div
          v-else
          class="w-[100px] aspect-square flex items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg"
        >
          <i class="pi pi-image text-gray-400 text-xl"></i>
        </div>
      </template>
    </Column>

    <!-- Created -->
    <Column
      field="created"
      :header="$t('dashboard.wallet-deposits-requests.table.created')"
    >
      <template #body="slotProps">
        <p class="text-sm">
          {{ new Date(slotProps?.data?.created).toLocaleString() }}
        </p>
      </template>
    </Column>

    <!-- Updated -->
    <Column
      field="updated"
      :header="$t('dashboard.wallet-deposits-requests.table.updated')"
    >
      <template #body="slotProps">
        <p class="text-sm">
          {{ new Date(slotProps?.data?.updated).toLocaleString() }}
        </p>
      </template>
    </Column>

    <!-- Actions -->
    <Column :header="$t('table.actions')" bodyStyle="min-width: 240px;">
      <template #body="slotProps">
        <div class="flex gap-2">
          <Button
            icon="pi pi-info-circle"
            severity="info"
            :label="$t('dashboard.wallet-deposits-requests.actions.info')"
            @click="() => handleNavigate(slotProps.data, 'details')"
            rounded
            size="small"
          />

          <button
            :disabled="
              slotProps.data.deposits_requests_status?.code !== 'pending'
            "
            class="custom-base-button !rounded-full !font-normal"
            @click="() => changeStatus(slotProps.data, 'approved')"
          >
            <i class="pi pi-check"></i>
            {{ $t("dashboard.wallet-deposits-requests.actions.approve") }}
          </button>
          <Button
            :disabled="
              slotProps.data.deposits_requests_status?.code !== 'pending'
            "
            icon="pi pi-times"
            severity="danger"
            :label="$t('dashboard.wallet-deposits-requests.actions.reject')"
            @click="() => changeStatus(slotProps.data, 'rejected')"
            rounded
            size="small"
          />
        </div>
      </template>
    </Column>
  </DataTable>
</template>
