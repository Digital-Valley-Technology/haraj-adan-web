<script setup>
import { useI18n } from "vue-i18n";
import { computed } from "vue";

// Get the translation function and current locale for dynamic text/formatting
const { t, locale } = useI18n();

// Define props for external data
const props = defineProps({
  // The user's current balance (string or number from API, converted to number here)
  balance: {
    type: [Number, String],
    required: false,
    default: 0,
  },
  // Array of recent transactions from the API
  lastTransactions: {
    type: Array,
    required: false,
    // Ensure default is an empty array to prevent issues if no data is passed
    default: () => [],
  },
});

// Define emitted events
const emit = defineEmits(["depositClick"]);

/**
 * Helper to convert the raw API status CODE (e.g., 'PENDING', 'COMPLETED') into a
 * consistent status key ('completed', 'pending', 'failed', 'cancelled') for styling and localization.
 * @param {string} code - The transaction status code string from the API (e.g., 'PENDING').
 * @returns {string} The normalized status key used for Tailwind class mapping.
 */
const mapStatusIdToKey = (code) => {
  // Ensure code is treated as a string and converted to uppercase for robust matching
  const status = String(code).toUpperCase();
  switch (status) {
    case "PENDING":
      return "pending";
    case "COMPLETED":
      return "completed";
    case "FAILED":
      return "failed";
    case "CANCELLED":
      return "cancelled";
    default:
      return "unknown";
  }
};

/**
 * Formats an ISO 8601 date string into a readable date and time.
 * @param {string | null | undefined} isoDateString - The date string from the API (e.g., "2025-10-26T19:05:09.000Z").
 * @returns {{date: string, time: string}} Formatted date and time strings.
 */
const formatTransactionDate = (isoDateString) => {
  if (!isoDateString) {
    return { date: "", time: "" };
  }
  try {
    const dateObj = new Date(isoDateString);
    if (isNaN(dateObj)) {
      throw new Error("Invalid date string");
    }

    // Date formatting (DD/MM/YYYY)
    const date = dateObj.toLocaleDateString(locale.value, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    // Time formatting (HH:MM am/pm)
    const time = dateObj.toLocaleTimeString(locale.value, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return { date, time };
  } catch (e) {
    console.error("Error processing date:", isoDateString, e);
    return { date: "Invalid Date", time: "" };
  }
};

/**
 * Maps a transaction status key ('completed', 'pending', 'cancelled', 'failed') to Tailwind classes.
 * This is where the status colors are applied.
 * @param {string} status - The status key.
 * @returns {string} Tailwind CSS classes.
 */
const getTransactionStatusClasses = (status) => {
  switch (status) {
    case "completed":
      return "bg-[#5CCC3733] text-[#5CCC37]"; // Greenish success style
    case "pending":
      return "bg-[#FBC97433] text-[#FBC974]"; // Yellowish warning style
    case "cancelled":
    case "failed": // Use the same style for failed/cancelled
      return "bg-[#EF667633] text-[#EF6676]"; // Reddish error/cancel style
    default:
      return "bg-gray-100 text-gray-700";
  }
};

/**
 * Processes the raw lastTransactions array into a format consumable by the template,
 * handling localization and formatting.
 */
const processedTransactions = computed(() => {
  if (
    !Array.isArray(props.lastTransactions) ||
    props.lastTransactions.length === 0
  ) {
    return [];
  }

  const isArabic = locale.value === "ar";

  return props.lastTransactions
    .filter((tx) => tx && typeof tx.amount === "string") // Basic null/undefined/type check
    .map((tx) => {
      const { date, time } = formatTransactionDate(tx?.created);
      // Use the transaction_status_id field, assuming it now contains the string code (e.g., 'PENDING')
      const statusKey = mapStatusIdToKey(tx?.transaction_status_id);

      // Determine the localized description based on the current locale
      const transactionType = tx?.transactions_types;
      const description = transactionType
        ? isArabic
          ? transactionType.name
          : transactionType.name_en
        : t("profile.wallet.default_description"); // Fallback if type data is missing

      return {
        id: tx.id,
        description: description || t("profile.wallet.default_description"),
        amount: parseFloat(tx.amount).toFixed(2), // Ensure amount is numeric and formatted
        date,
        time,
        status: statusKey, // 'completed', 'pending', etc. - used for styling class
        // Crucial: Pass the raw status object for localized status text in the template
        transactions_status: tx?.transactions_status,
      };
    });
});
</script>

<template>
  <div class="flex flex-col bg-white px-4 rounded-lg py-10">
    <!-- Balance Card -->

    <div
      class="bg-linear-to-r from-[#146AAB] to-[#0E5082] rounded-lg p-4 mb-4"
      style="background-image: linear-gradient(to right, #146aab, #0e5082)"
    >
      <div class="flex justify-between items-start">
        <div class="flex flex-col">
          <div class="flex items-center gap-2">
            <i class="pi pi-bitcoin text-yellow-400"></i>

            <p class="text-[#EEEEEEEE]">
              {{ t("profile.wallet.balance_label") }}
            </p>
          </div>

          <div>
            <!-- Display current balance with two decimal places -->

            <!-- Use props.balance and format it -->

            <span class="text-lg text-[#EEEEEEEE]"
              >{{ parseFloat(balance).toFixed(2) }}
            </span>

            <span class="text-xs text-[#EEEEEEEE]">{{
              t("profile.wallet.currency")
            }}</span>
          </div>

          <div>
            <span class="text-[#EEEEEEEE] text-xs">{{
              t("profile.wallet.available_balance")
            }}</span>
          </div>
        </div>

        <div>
          <!-- Placeholder for an image (using https://placehold.co/ to prevent broken links) -->

          <img
            src="https://placehold.co/40x30/CCCCCC/000?text=VISA"
            alt="Payment Card"
            width="40"
            height="30"
            class="rounded"
          />
        </div>
      </div>
    </div>

    <!-- Deposit Button -->

    <div class="mb-4">
      <button
        class="flex justify-between items-center w-full px-2 py-2 text-black hover:text-[#146AAB] cursor-pointer group border border-solid border-[#EEEEEE] rounded-lg transition duration-150 ease-in-out"
        @click="emit('depositClick')"
      >
        <span class="text-xs font-normal group-hover:text-[#146AAB] uppercase">
          {{ t("profile.wallet.deposit_button") }}
        </span>

        <span>
          <i
            class="pi pi-chevron-right text-[#146AAB]"
            style="font-size: 0.9rem"
          ></i>
        </span>
      </button>
    </div>

    <!-- Transaction History -->

    <div class="border border-gray-200 rounded-lg shadow-sm p-2">
      <h3 class="text-xs mb-4 text-gray-700">
        {{ t("profile.wallet.history_title") }}
      </h3>

      <!-- Loop through PROCESSED transactions -->

      <div v-if="processedTransactions.length > 0">
        <div
          v-for="transaction in processedTransactions"
          :key="transaction.id"
          class="flex flex-col items-center gap-1 mb-4 border-b border-gray-100 pb-2 last:border-b-0 last:pb-0"
        >
          <!-- Description and Status Row -->

          <div class="flex justify-between items-center w-full">
            <p class="text-xs text-gray-800">
              <!-- Use the processed, localized description -->
              {{ transaction.description }}
            </p>

            <p
              class="uppercase py-0.5 px-1 text-[8px] rounded-lg font-medium"
              :class="getTransactionStatusClasses(transaction.status)"
            >
              <!-- Use specific keys for transaction status -->

              {{
                locale == "ar"
                  ? transaction?.transactions_status?.name
                  : transaction?.transactions_status?.name_en
              }}
            </p>
          </div>

          <!-- Date/Time and Amount Row -->

          <div class="flex justify-between items-center w-full">
            <p class="text-[8px] text-[#525252]">
              {{ transaction.date }} | {{ transaction.time }}
            </p>

            <p class="uppercase px-1 text-xs font-semibold text-gray-700">
              {{ transaction.amount }}
              {{ t("profile.wallet.currency") }}
            </p>
          </div>
        </div>
      </div>

      <div v-else class="text-center text-xs text-gray-500 py-4">
        {{ t("profile.wallet.no_transactions") }}
      </div>
    </div>
  </div>
</template>
