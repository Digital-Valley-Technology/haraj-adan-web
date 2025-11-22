<template>
  <div
    class="w-full max-w-96 bg-white rounded-md shadow-md overflow-hidden cursor-pointer p-3"
    @click="goToAdDetails(props.item?.id)"
  >
    <div class="flex gap-2">
      <div class="w-20">
        <img
          :src="adImageUrl"
          :alt="props.item?.title"
          class="w-full h-20 object-cover rounded-md"
        />
      </div>
      <!-- Card Info -->
      <div class="flex flex-col justify-center">
        <h3 class="mb-1 text-sm font-normal">
          {{ currentLocale == "ar" ? props.item?.title : props.item?.title }}
        </h3>
        <div class="flex items-center gap-1 mb-1">
          <i class="pi pi-map-marker text-gray-500"></i>
          <p class="text-xs text-gray-500 font-medium">
            {{ props?.item?.address }}
          </p>
        </div>
        <span class="text-[#146AAB] font-semibold text-xs">
          {{ formattedPrice }}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { MEDIA_URL } from "../services/axios";

const { locale } = useI18n();

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const router = useRouter();

const currentLocale = computed(() => locale.value);

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
