<script setup>
import { useRouter } from "vue-router";
import { useWalletStore } from "../../store/wallet";
import { useLocaleText } from "../../utils/useLocaleText";
import { formatDate } from "../../utils/formatDate";
import { encode } from "js-base64";
import { formatAmount } from "../../utils/formatAmount";

defineProps(["transactions"]);
const emit = defineEmits(["fetchTransactions"]);

const walletStore = useWalletStore();
const localeText = useLocaleText();
const router = useRouter();

const handleViewDetails = (transaction) => {
  router.push({
    name: "transaction-details",
    params: { transactionId: encode(transaction?.id) },
  });
};
</script>

<template>
  <DataTable
    :value="transactions"
    paginator
    :lazy="true"
    :rowsPerPageOptions="[5, 10, 20, 50]"
    tableStyle="min-width: 50rem"
    :rows="walletStore.limit"
    :totalRecords="walletStore.total"
    :first="(walletStore.page - 1) * walletStore.limit"
    @page="
      (e) => {
        if (e.rows !== walletStore.limit) {
          walletStore.page = 1;
          walletStore.limit = e.rows;
        } else {
          walletStore.page = e.page + 1;
        }
        emit('fetchTransactions');
      }
    "
    :loading="walletStore?.loading"
  >
    <Column field="amount" :header="$t('dashboard.transactions.table.amount')">
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
    <Column
      field="transactions_types.name"
      :header="$t('dashboard.transactions.table.type')"
    >
      <template #body="slotProps">
        <p class="text-sm">
          {{
            slotProps?.data?.transactions_types
              ? localeText(
                  slotProps?.data?.transactions_types?.name,
                  slotProps?.data?.transactions_types?.name_en
                )
              : "__"
          }}
        </p>
      </template>
    </Column>
    <Column
      field="descr"
      :header="$t('dashboard.transactions.table.description')"
    >
      <template #body="slotProps">
        <p class="text-sm">
          {{ slotProps?.data?.descr || "__" }}
        </p>
      </template>
    </Column>
    <Column
      field="user_wallet.users.name"
      :header="$t('dashboard.transactions.table.user')"
    >
      <template #body="slotProps">
        <p class="text-sm">
          {{
            slotProps?.data?.user_wallet?.users
              ? slotProps?.data?.user_wallet?.users?.name
              : "__"
          }}
        </p>
      </template>
    </Column>
    <Column
      field="user_wallet.transactions_status.name"
      :header="$t('dashboard.transactions.table.status')"
    >
      <template #body="slotProps">
        <p class="text-sm">
          {{
            slotProps?.data?.transactions_status?.name
              ? slotProps?.data?.transactions_status?.name
              : "__"
          }}
        </p>
      </template>
    </Column>
    <Column field="created" :header="$t('dashboard.transactions.table.date')">
      <template #body="slotProps">
        <p class="text-sm">
          {{ formatDate(slotProps?.data?.created) }}
        </p>
      </template>
    </Column>
  </DataTable>
</template>
