<script setup>
import { useI18n } from "vue-i18n";
import { computed } from "vue";
import { MEDIA_URL } from "../../services/axios";

// Get the translation function and current locale
const { t, locale } = useI18n();

// Define props for the component
defineProps({
  /**
   * Array of product/item objects to display.
   * Required properties for each item:
   * - id: Unique identifier
   * - imgSrc: URL for the product image
   * - isFeatured: Boolean to show the 'Featured' tag
   * - title: Title in Arabic
   * - title_en: Title in English
   * - address: Location in Arabic
   * - location_en: Location in English
   * - price: Price amount (number or string)
   * - currency: Currency symbol (e.g., "$")
   */
  items: {
    type: Array,
    required: true,
    default: () => [
      // Example structure for reference
      {
        id: 1,
        imgSrc: "https://placehold.co/80x72/146AAB/FFFFFF?text=Ad+1",
        isFeatured: true,
        title: "لوحة إعلانات جاجاه مادا (مثال)",
        title_en: "Gajah Mada Billboard (Example)",
        address: "سوراكارتا، جاوة تينغاه",
        price: 10000,
        currency: "$",
      },
    ],
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

  // Use toLocaleString for grouping thousands, but keep currency placement simple
  const formattedAmount = amount.toLocaleString(locale.value, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  // Simple logic for currency display based on locale
  if (locale.value === "ar") {
    return `${formattedAmount} ${currency}`; // e.g., 10,000 $
  } else {
    return `${currency} ${formattedAmount}`; // e.g., $ 10,000
  }
};

const getAdImageUrl = (item) => {
  return (
    `${MEDIA_URL}/${item.ads_images[0]?.image}` ||
    "https://placehold.co/80x72/146AAB/FFFFFF?text=Ad"
  );
};

/**
 * Placeholder for the Featured tag text, as it was hardcoded in the original template.
 * In a real i18n setup, this would use t('product.featured').
 */
const translateFeatured = computed(() => {
  return locale.value === "ar" ? "مميز" : "Featured";
});
</script>

<template>
  <div class="bg-white p-4 rounded-lg">
    <div class="flex flex-col gap-2 bg-[#FEFFEB] p-4 rounded-lg">
      <!-- Fallback message if no items are provided -->
      <div v-if="items.length === 0" class="text-center text-gray-500 py-8">
        <p>
          {{ t("profile.featured.no_featured_ads") }}
        </p>
      </div>

      <!-- Loop through items passed via props -->
      <template v-for="(item, index) in items" :key="item.id || index">
        <!-- Item Container -->
        <div class="flex justify-between items-center">
          <div class="flex gap-3 items-start">
            <!-- Image -->
            <div
              class="max-w-[80px] min-w-[80px] h-18 overflow-hidden rounded-lg shadow-sm"
            >
              <img
                :src="getAdImageUrl(item)"
                :alt="locale === 'ar' ? item.title : item.title_en"
                class="w-full h-full object-cover"
                onerror="this.onerror=null;this.src='https://placehold.co/80x72/9CA3AF/ffffff?text=Ad';"
              />
            </div>

            <!-- Details -->
            <div class="flex flex-col pt-1">
              <!-- Featured Tag -->
              <p
                v-if="item.isFeatured"
                class="bg-[#FFE800] p-1 text-black rounded-sm text-[9px] font-semibold w-fit mb-2"
              >
                {{ translateFeatured }}
              </p>

              <p
                class="bg-[#FFE800] p-1 text-black rounded-sm text-[9px] w-fit mb-2"
              >
                {{ locale == "ar" ? "مميز" : "Featured" }}
              </p>
              <!-- Title -->
              <h3
                class="text-sm font-semibold mb-1 text-gray-800 leading-tight"
              >
                {{ locale === "ar" ? item.title : item.title_en }}
              </h3>

              <!-- Location -->
              <div class="flex items-center gap-2">
                <i class="pi pi-map-marker text-[9px] text-[#6B7280]"></i>
                <p class="text-[10px] text-[#6B7280]">
                  {{ item?.ad_attributes[0]?.address || "N/A" }}
                </p>
              </div>
            </div>
          </div>

          <!-- Price -->
          <div class="flex items-end gap-1 min-w-[60px]">
            <p class="text-sm font-bold text-[#146AAB]">
              {{ formatPrice(item.price, "$") }}
            </p>
          </div>
        </div>

        <!-- Divider, only if it's not the last item -->
        <hr v-if="index < items.length - 1" class="my-0 border-gray-100" />
      </template>
    </div>
  </div>
</template>

<style scoped>
.card {
  animation: fadeIn 0.5s ease-out;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.custom-blue-switch .p-toggleswitch-slider {
  background-color: #e0e0e0; /* track color when OFF */
}

.custom-blue-switch.p-highlight .p-toggleswitch-slider {
  background-color: #146aab !important; /* track color when ON */
}

.custom-blue-switch .p-toggleswitch-handle {
  background-color: white; /* the handle */
}
</style>
