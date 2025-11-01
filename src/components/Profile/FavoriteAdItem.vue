<script setup>
import { useI18n } from "vue-i18n";
import { MEDIA_URL } from "../../services/axios";
import { useRouter } from "vue-router";
import { computed } from "vue";

// Get the translation function and current locale
const { t, locale } = useI18n();
const router = useRouter();

const currentLocale = computed(() => locale.value || "ar");

// Define props for the component: it now accepts a single 'item' object.
// The error was caused by misplaced parentheses around the prop definition object.
const props = defineProps({
  /**
   * The single favorite ad object to display.
   */
  item: {
    type: Object,
    required: true, // Provide a basic structure for the default object for stability
    default: () => ({
      id: null, // Added ID for better default structure
      title: "",
      title_en: "",
      price: 0,
      ads_images: [],
      ad_attributes: [],
    }),
  },
});

/**
 * Helper function to format the price string based on locale.
 * @param {number | string} price - The numerical price.
 * @param {string} currency - The currency symbol.
 * @returns {string} The formatted price string.
 */
const formatPrice = (price, currency) => {
  const amount = typeof price === "string" ? parseFloat(price) : price;
  if (isNaN(amount) || amount === null) return "";

  const formattedAmount = amount.toLocaleString(locale.value, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  if (locale.value === "ar") {
    return `${formattedAmount} ${currency}`; // e.g., 10,000 $
  } else {
    return `${currency} ${formattedAmount}`; // e.g., $ 10,000
  }
};

/**
 * Constructs the full image URL.
 * @param {object} item - The ad object.
 * @returns {string} The image URL or a placeholder.
 */
const getAdImageUrl = (item) => {
  // Check if ads_images array exists and has at least one element with an 'image' property
  const imagePath = item.ads_images?.[0]?.image;

  return (
    (imagePath ? `${MEDIA_URL}/${imagePath}` : null) ||
    "https://placehold.co/80x72/146AAB/FFFFFF?text=Ad"
  );
};

const getAddress = (item) => {
  return item?.ad_attributes?.find((attr) => attr.address)?.address || "N/A";
};

const goToAdDetails = (adId) => {
  router.push({ name: "ad-details", params: { adId } });
};
</script>

<template>
  <!-- Item Container: This is the single ad item structure -->

  <div
    class="flex justify-between items-center transition-opacity duration-300 hover:opacity-90 cursor-pointer"
    @click="goToAdDetails(item.id)"
  >
    <!-- Left Side: Image and Details -->

    <div class="flex gap-2 items-center">
      <!-- Image Container: max-w-[80px] h-18 -->

      <div class="max-w-[80px] h-18">
        <img
          :src="getAdImageUrl(props.item)"
          :alt="currentLocale ? props.item.title : props.item.title_en"
          class="w-full h-full object-cover rounded-lg"
          onerror="this.onerror=null;this.src='https://placehold.co/80x72/9CA3AF/ffffff?text=Ad';"
        />
      </div>

      <!-- Details Text Block -->

      <div>
        <!-- Title: text-xs font-semibold mb-1 -->

        <div class="flex flex-col ms-2 flex-1">
          <span
            class="bg-yellow-400 text-xs font-semibold text-gray-800 px-2 py-0.5 rounded w-fit mb-1"
          >
            {{ t("ads.featured") }}
          </span>

          <p class="text-sm font-medium text-gray-900 leading-snug">
            {{
              currentLocale == "ar" ? props?.item?.title : props?.item?.title_en
            }}
          </p>
        </div>

        <!-- Location: text-[9px] with map-marker icon -->

        <div class="ms-2 flex items-center gap-2">
          <i class="pi pi-map-marker text-[9px] text-[#6B7280]"></i>

          <!-- Dynamic Location -->

          <p class="text-[9px] text-[#6B7280]">
            {{ getAddress(props.item) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Price (Right Side) -->

    <div class="flex items-end gap-1">
      <!-- Dynamic Price -->

      <p class="text-sm text-[#146AAB] font-semibold">
        {{ formatPrice(props.item.price, "$") }}
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Define h-18 (72px) as it's not a standard Tailwind utility */
.h-18 {
  height: 4.5rem; /* 72px */
}
</style>
