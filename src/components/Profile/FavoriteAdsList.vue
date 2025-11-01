<script setup>
import { useI18n } from "vue-i18n";
// Assuming MEDIA_URL is required to construct the full image path
// NOTE: MEDIA_URL import is kept for completeness, but typically needs to be defined
// import { MEDIA_URL } from "../../services/axios";
const MEDIA_URL = "http://api.example.com"; // Placeholder definition

// Get the translation function and current locale
const { t, locale } = useI18n();

// Define props for the component
// The component is designed to accept an 'items' array.
const props = defineProps({
  /**
   * Array of favorite ad objects to display.
   */
  items: {
    type: Array,
    required: true,
    default: () => [],
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
  return (
    `${MEDIA_URL}/${item.ads_images[0]?.image}` ||
    "https://placehold.co/80x72/146AAB/FFFFFF?text=Ad"
  );
};
</script>

<template>
  <!-- Main Container with dynamic content -->

  <div class="flex flex-col gap-2 bg-white p-4 rounded-lg shadow-md">
    <!-- Loop over the items array provided via props -->

    <template v-for="(item, index) in props.items" :key="item.id || index">
      <!-- Item Container -->

      <div
        class="flex justify-between items-center transition-opacity duration-300 hover:opacity-90 cursor-pointer"
      >
        <!-- Left Side: Image and Details -->

        <div class="flex gap-2 items-center">
          <!-- Image Container: max-w-[80px] h-18 -->

          <div class="max-w-[80px] h-18">
            <img
              :src="getAdImageUrl(item)"
              :alt="locale === 'ar' ? item.title : item.title_en"
              class="w-full h-full object-cover rounded-lg"
              onerror="this.onerror=null;this.src='https://placehold.co/80x72/9CA3AF/ffffff?text=Ad';"
            />
          </div>

          <!-- Details Text Block -->

          <div>
            <!-- Title: text-xs font-semibold mb-1 -->

            <h3 class="text-xs font-semibold mb-1 text-gray-900">
              <!-- Dynamic Title -->

              {{ locale === "ar" ? item.title : item.title_en }}
            </h3>

            <!-- Location: text-[9px] with map-marker icon -->

            <div class="flex items-center gap-2">
              <i class="pi pi-map-marker text-[9px] text-[#6B7280]"></i>

              <!-- Dynamic Location -->

              <p class="text-[9px] text-[#6B7280]">
                {{ item?.ad_attributes?.[0]?.address || "N/A" }}
              </p>
            </div>
          </div>
        </div>

        <!-- Price (Right Side) -->

        <div class="flex items-end gap-1">
          <!-- Dynamic Price -->

          <p class="text-sm text-[#146AAB] font-semibold">
            {{ formatPrice(item.price, "$") }}
          </p>
        </div>
      </div>

      <!-- Divider: only display if it is NOT the last item -->

      <hr v-if="index < props.items.length - 1" class="my-4 border-gray-200" />
    </template>
  </div>
</template>

<style scoped>
/* Define h-18 (72px) as it's not a standard Tailwind utility */
.h-18 {
  height: 4.5rem; /* 72px */
}
</style>
