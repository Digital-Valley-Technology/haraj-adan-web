<script setup>
import { onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useWalletStore } from "../../store/wallet";
import { useLocaleText } from "../../utils/useLocaleText";
import { formatDate } from "../../utils/formatDate";
import DashboardLayout from "../../Layout/DashboardLayout.vue";
import NoData from "../../components/NoData.vue";
import { decode } from "js-base64";
import { useI18n } from "vue-i18n";

const route = useRoute();
const router = useRouter();
const walletStore = useWalletStore();
const localeText = useLocaleText();
const { t } = useI18n();
const encodedId = route.params.transactionId;
const transactionId = decode(encodedId);

const transaction = computed(() => walletStore.getTransactionDetails);

const fetchTransactionDetails = async () => {
  await walletStore.fetchTransactionDetails(transactionId, t);
};

const handleBack = () => {
  router.push({ name: "wallet-transactions" });
};

onMounted(fetchTransactionDetails);
</script>

<template>
  <dashboard-layout>
    <main class="py-[var(--padding-dashboard-section)] custom-container">
      <div
        class="card min-h-[500px] w-full mx-auto px-4 md:px-8 py-8 md:py-12 shadow-lg border border-gray-200 rounded-lg"
      >
        <Button
          icon="pi pi-arrow-left"
          :label="$t('dashboard.actions.back')"
          class="mb-6"
          severity="secondary"
          outlined
          @click="handleBack"
        />
        <h1 class="text-2xl font-bold mb-6">
          {{ $t("dashboard.transactions.title") }} #{{ transactionId }}
        </h1>
        <no-data
          v-if="!transaction"
          :content="$t('transactions.not_found')"
          class="mt-12"
        />
        <card v-else class="max-w-2xl mx-auto">
          <template #content>
            <div class="grid grid-cols-1 gap-4">
              <div class="flex justify-between">
                <span class="font-semibold">{{
                  $t("dashboard.transactions.table.transaction_id")
                }}</span>
                <span>{{ transaction.id }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-semibold">{{
                  $t("dashboard.transactions.table.amount")
                }}</span>
                <span
                  >{{ transaction.amount }}
                  {{ $t("dashboard.transactions.table.currency") }}</span
                >
              </div>
              <div class="flex justify-between">
                <span class="font-semibold">{{
                  $t("dashboard.transactions.table.type")
                }}</span>
                <span>
                  {{
                    transaction.transactions_types
                      ? localeText(
                          transaction.transactions_types.name,
                          transaction.transactions_types.name_en
                        )
                      : "__"
                  }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="font-semibold">{{
                  $t("dashboard.transactions.table.description")
                }}</span>
                <span>{{ transaction.descr || "__" }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-semibold">{{
                  $t("dashboard.transactions.table.user")
                }}</span>
                <span>
                  {{ transaction.user_wallet?.users?.name || "__" }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="font-semibold">{{
                  $t("dashboard.transactions.table.date")
                }}</span>
                <span>{{ formatDate(transaction.created) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-semibold">{{
                  $t("dashboard.transactions.table.updated_at")
                }}</span>
                <span>{{ formatDate(transaction.updated) }}</span>
              </div>
            </div>
          </template>
        </card>
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
