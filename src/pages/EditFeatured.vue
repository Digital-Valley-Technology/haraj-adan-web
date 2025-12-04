<template>
  <app-layout>
    <main class="flex-1 bg-white p-6 rounded-lg shadow-md">
      <!-- FEATURED AD SECTION -->
      <div
        class="mt-6 p-6 bg-white rounded-2xl shadow-md border border-gray-200"
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <span class="font-semibold text-gray-800 text-base">
            {{ $t("postAdd.makeFeatured") }}
          </span>
        </div>

        <!-- Wallet Balance -->
        <div
          class="mb-4 p-4 bg-blue-50 rounded-lg flex justify-between items-center"
        >
          <span class="text-sm text-blue-700 font-medium">{{
            $t("wallet.balance")
          }}</span>
          <span class="text-lg font-bold text-blue-900">{{
            wallet?.balance ?? 0
          }}</span>
        </div>

        <!-- Insufficient Balance Warning -->
        <p
          v-if="wallet.balance < totalFeaturedPrice"
          class="text-red-500 text-sm mb-3"
        >
          {{ $t("postAdd.insufficientBalance") }}
          <router-link to="/user-profile" class="underline">{{
            $t("postAdd.depositNow")
          }}</router-link>
        </p>

        <!-- Discount Selector & Featured Price Summary -->
        <transition name="fade">
          <div class="mt-3">
            <!-- Discount Selector -->
            <label class="block mb-2 text-sm font-medium text-gray-700">
              {{ $t("postAdd.selectDiscount") }}
            </label>
            <div class="relative mb-4">
              <select
                v-model="selectedDiscount"
                class="w-full p-3 border border-gray-300 rounded-lg bg-white text-sm appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option :value="null" class="text-gray-500">
                  {{ $t("postAdd.noDiscount") }}
                </option>
                <option
                  v-for="d in discounts"
                  :key="d.id"
                  :value="d.id"
                  :disabled="
                    featuredAdPrice *
                      (featuredAdDays + d.period) *
                      (1 - d.percentage / 100) >
                    wallet.balance
                  "
                >
                  {{ d.percentage }}% - {{ d.period }} {{ $t("postAdd.days") }}
                </option>
              </select>
              <div
                class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>

            <!-- Featured Price Summary -->
            <div
              class="p-4 rounded-lg flex flex-col gap-2"
              :class="
                wallet.balance < totalFeaturedPrice
                  ? 'bg-red-50'
                  : 'bg-green-50'
              "
            >
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-green-700"
                  >{{ $t("postAdd.featuredDays") }}:</span
                >
                <span class="text-lg font-bold text-green-900">{{
                  computedFeaturedDays
                }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-green-700"
                  >{{ $t("postAdd.totalFeaturedPrice") }}:</span
                >
                <span class="text-lg font-bold text-green-900">{{
                  totalFeaturedPrice
                }}</span>
              </div>
            </div>

            <!-- ⬅️ Put the button here -->
            <button
              @click="editFeaturedAd"
              class="mt-4 w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {{ t("postAdd.makeFeatured") }}
            </button>
          </div>
        </transition>
      </div>
    </main>
  </app-layout>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import AppLayout from "../Layout/AppLayout.vue";
import { useAuthStore } from "../store/auth";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import requestService from "../services/api/requestService";
import { showError, showSuccess, showWarning } from "../utils/notifications";

const { t } = useI18n();

const route = useRoute();
const router = useRouter();

const adId = ref(route.params.adId);

const authStore = useAuthStore();

const currentUser = computed(() => authStore?.user);

// Example reactive state
const wallet = ref(currentUser.value?.user_wallet[0] || { balance: 0 });
const featuredAdPrice = ref(0); // from API: price per day
const featuredAdDays = ref(0); // from API: default number of days
const discounts = ref([]);
const selectedDiscount = ref(null);

// computed property for total days including discount
const computedFeaturedDays = computed(() => {
  let days = featuredAdDays.value;

  // add discount period if selected
  if (selectedDiscount.value) {
    const discount = discounts.value.find(
      (d) => d.id === selectedDiscount.value
    );
    if (discount) {
      days += discount.period; // assuming discount.period is in days
    }
  }

  return days;
});

// total price based on computedFeaturedDays
const totalFeaturedPrice = computed(() => {
  let days = computedFeaturedDays.value;
  let price = featuredAdPrice.value * days;

  // apply discount percentage if any
  if (selectedDiscount.value) {
    const discount = discounts.value.find(
      (d) => d.id === selectedDiscount.value
    );
    if (discount) {
      price = price - (price * discount.percentage) / 100;
    }
  }

  return price;
});

const fetchDiscounts = async () => {
  try {
    const res = await requestService.getAll(`/ads/discounts`);
    discounts.value = res.data;
  } catch (error) {
    console.log(error);
  }
};

const fetchFeaturedSettings = async () => {
  try {
    const res = await requestService.getAll("/ads/featured-settings");
    featuredAdPrice.value = res.data.featured_ad_price;
    featuredAdDays.value = res.data.featured_ad_days_count;
  } catch (err) {
    console.error("Error fetching featured settings:", err);
  }
};

const editFeaturedAd = async () => {
  if (wallet.value.balance < totalFeaturedPrice.value) {
    showWarning(t("postAdd.insufficientBalance"));
    return;
  }

  try {
    const payload = {
      discount_id: selectedDiscount.value || null,
    };

    const res = await requestService.patch(
      `/ads/${adId.value}/feature`,
      payload
    );

    showSuccess(res?.message || t("postAdd.featuredSuccess"));
    router.push({ name: "ad-details", params: { adId: adId.value } });
  } catch (err) {
    console.error("Error making ad featured:", err);
    showError(err || t("postAdd.featuredError"));
  }
};

onMounted(() => {
  authStore.getMe();
  fetchFeaturedSettings();
  fetchDiscounts();
});
</script>
