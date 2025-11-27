<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { MEDIA_URL } from "../services/axios";

const { t, locale } = useI18n();
const router = useRouter();

const props = defineProps({
  item: {
    type: Object,
    default: null,
  },
});

// --- LocalStorage Logic ---
const FAVORITES_KEY = "AD_FAVORITES_LIST";

/** Retrieves the favorite ad objects array from localStorage. */
const getStoredFavorites = () => {
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    // Parse the stored JSON string, which now contains an array of objects
    return favorites ? JSON.parse(favorites) : [];
  } catch (e) {
    console.error("Error parsing favorites from localStorage:", e);
    return [];
  }
};

/** Saves the array of favorite ad objects to localStorage. */
const setStoredFavorites = (favoritesArray) => {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritesArray));
  } catch (e) {
    console.error("Error saving favorites to localStorage:", e);
  }
};

// 1. Get the current ad's ID
const adId = props.item?.id;
// 2. Load all favorites (array of objects)
const initialFavorites = getStoredFavorites();
// 3. Initialize isFavorite state by checking if any object in the array matches the current adId
const isFavorite = ref(initialFavorites.some((item) => item.id === adId));

// --- Handlers ---

const goToAdDetails = (adId) => {
  router.push({ name: "ad-details", params: { adId } });
};

const mainImage = (img) => {
  return `${MEDIA_URL}/${img}`;
};

// Check if ad is featured
const isFeatured = (item) => {
  return item?.ad_featured_history?.some((f) => f.status === true);
};

// Core Logic: Toggle Favorite (managing objects in localStorage)
const toggleFavorite = () => {
  if (!adId) return; // Must have an ID

  const currentFavorites = getStoredFavorites();
  // Find the index of the existing ad object based on ID
  const existingIndex = currentFavorites.findIndex((item) => item.id === adId);

  if (isFavorite.value) {
    // Current state is Favorite -> Remove the object
    if (existingIndex > -1) {
      currentFavorites.splice(existingIndex, 1);
    }
    isFavorite.value = false;
  } else {
    // Current state is Not Favorite -> Add the full item object
    if (existingIndex === -1) {
      // PUSH THE COMPLETE AD OBJECT INTO THE ARRAY
      currentFavorites.push(props.item);
    }
    isFavorite.value = true;
  }

  // Save the updated array of objects back to localStorage
  setStoredFavorites(currentFavorites);
};
</script>

<template>
  <div
    class="w-full aspect-square rounded-md shadow-md overflow-hidden cursor-pointer mb-3"
    @click="goToAdDetails(item.id)"
  >
    <!-- Image and Favorite Button -->
    <div class="relative overflow-hidden w-full h-full">
      <img
        :src="mainImage(item?.ads_images?.[0]?.image)"
        :alt="item?.alt"
        class="w-full h-full object-cover"
      />

      <!-- Favorite Button -->
      <button
        @click.stop="toggleFavorite"
        class="absolute top-2 right-2 p-2 rounded-full bg-[#bebebe] shadow cursor-pointer grid place-items-center border border-gray-200 transition duration-150"
        :class="{ 'opacity-55': !isFavorite, 'opacity-100': isFavorite }"
      >
        <!-- Filled Heart (Favorite) -->
        <i
          v-if="isFavorite"
          class="pi pi-heart-fill text-[#ff0033] opacity-100"
        ></i>
        <!-- Empty Heart (Not Favorite) -->
        <i v-else class="pi pi-heart text-white"></i>
      </button>

      <!-- Featured -->
      <span
        v-if="isFeatured(item)"
        class="absolute left-2 bottom-2 py-2 px-3 text-[10px] font-normal rounded-lg bg-[#FFE800] z-10"
        >{{ t("ads.featured") }}</span
      >
    </div>
  </div>
  <p class="font-normal text-xs">
    {{ locale == "ar" ? item.title : item.title_en }}
  </p>
</template>
