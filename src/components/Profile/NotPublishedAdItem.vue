<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { MEDIA_URL } from "../../services/axios";
import { useRouter } from "vue-router";

const { t, locale } = useI18n();
const router = useRouter();

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

/**
 * Current Locale
 */
const currentLocale = computed(() => locale.value);

/**
 * Computed title based on locale
 */
const adTitle = computed(() =>
  currentLocale.value === "ar" ? props.item?.title : props.item?.title_en
);

/**
 * Format price based on locale and currency.
 */
const formattedPrice = computed(() => {
  const price = props.item?.price;

  if (price == null || isNaN(parseFloat(price))) return "";

  const amount = parseFloat(price).toLocaleString(currentLocale.value, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const currency =
    currentLocale.value === "ar"
      ? props.item?.currencies?.name
      : props.item?.currencies?.name_en;

  return `${currency} ${amount}`;
});

/**
 * Returns first ad image or fallback placeholder.
 */
const adImageUrl = computed(() => {
  const path = props.item?.ads_images?.[0]?.image;
  return path
    ? `${MEDIA_URL}/${path}`
    : "https://placehold.co/80x72/146AAB/FFFFFF?text=Ad";
});

const goToAdDetails = (adId) => {
  router.push({ name: "ad-details", params: { adId } });
};

/**
 * Check if the ad is featured.
 */
const isFeatured = computed(() =>
  props.item?.ad_featured_history?.some((f) => f.status === true)
);
</script>

<template>
  <div
    class="flex flex-col gap-2 bg-white p-4 rounded-lg cursor-pointer"
    @click="goToAdDetails(item.id)"
  >
    <div class="flex justify-between items-center">
      <div class="flex gap-2 items-center">
        <!-- Image -->
        <div class="max-w-[80px] h-18">
          <img
            :src="adImageUrl"
            :alt="adTitle"
            class="w-full h-full object-cover rounded-lg"
          />
        </div>

        <!-- Content -->
        <div class="flex flex-col ms-2 flex-1">
          <span
            v-if="isFeatured"
            class="bg-yellow-400 text-xs font-semibold text-gray-800 px-2 py-0.5 rounded w-fit mb-1"
          >
            {{ t("ads.featured") }}
          </span>

          <p class="text-sm font-medium text-gray-900 leading-snug">
            {{ adTitle }}
          </p>

          <div class="flex items-center gap-2 mt-1">
            <i class="pi pi-map-marker text-[9px] text-[#6B7280]"></i>
            <p class="text-[9px] text-[#6B7280]">{{ props.item?.address }}</p>
          </div>
        </div>
      </div>

      <!-- Price -->
      <div class="flex items-end">
        <p class="text-sm text-[#146AAB]">{{ formattedPrice }}</p>
      </div>
    </div>
  </div>
</template>
