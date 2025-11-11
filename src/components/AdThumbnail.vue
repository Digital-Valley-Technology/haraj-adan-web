<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
    <!-- Left: Image Gallery -->
    <div class="flex flex-col items-center overflow-hidden">
      <div
        v-if="images.length"
        class="swiper-initialized swiper-horizontal w-full aspect-[6/4] mb-4 rounded-lg swiper-backface-hidden"
      >
        <!-- Main Swiper -->
        <swiper
          :slides-per-view="1"
          :modules="[FreeMode, Thumbs]"
          :thumbs="{ swiper: thumbsSwiper }"
          class="main-swiper w-full mb-4 rounded-lg"
        >
          <SwiperSlide v-for="(img, index) in images" :key="index">
            <img
              :src="img"
              class="w-full lg:h-[567px] object-cover rounded-lg"
              alt="Ad Image"
            />
          </SwiperSlide>
        </swiper>

        <!-- Thumbnail Swiper -->
        <swiper
          @swiper="onThumbSwiper"
          :modules="[FreeMode, Thumbs, Navigation]"
          :space-between="10"
          :slides-per-view="2"
          navigation
          :breakpoints="{ 554: { slidesPerView: 4 } }"
          free-mode
          watch-slides-progress
          class="thumbs-swiper mt-4"
        >
          <SwiperSlide v-for="(img, index) in images" :key="index">
            <img
              :src="img"
              class="w-full h-24 rounded-md object-cover cursor-pointer"
              alt="Ad Thumbnail"
            />
          </SwiperSlide>
        </swiper>
      </div>

      <div
        v-else
        class="w-full aspect-[6/4] bg-gray-100 flex items-center justify-center text-gray-400 text-sm"
      >
        {{ locale === "ar" ? "لا توجد صور" : "No images available" }}
      </div>
    </div>

    <!-- Right: Details -->
    <div class="w-full bg-white rounded-2xl shadow-sm">
      <div class="flex flex-col justify-center p-5">
        <!-- Title + Price -->
        <div class="flex justify-between items-center mb-6">
          <span class="text-2xl font-semibold text-gray-900">
            {{ locale === "ar" ? adData.title : adData.title_en }}
          </span>
          <span class="text-xl font-semibold text-[#146AAB]">
            {{
              `${formatPrice(adData.price)} ${
                locale === "ar"
                  ? adData?.currencies?.name
                  : adData?.currencies?.name_en
              }`
            }}
          </span>
        </div>

        <!-- Attributes -->
        <div v-if="visibleAttributes.length" class="divide-y">
          <div
            v-for="(attr, index) in visibleAttributes"
            :key="index"
            class="flex justify-between items-center py-3"
          >
            <span class="text-gray-600 text-sm">
              {{
                locale === "ar"
                  ? attr.category_attributes.name
                  : attr.category_attributes.name_en
              }}
            </span>
            <span class="text-gray-800 text-sm font-medium">
              <template
                v-if="
                  attr.category_attributes?.category_attributes_types?.code ===
                  'location'
                "
              >
                {{ attr.address || (locale === "ar" ? "لا يوجد" : "N/A") }}
              </template>
              <template
                v-else-if="
                  attr.ad_attribute_options && attr.ad_attribute_options.length
                "
              >
                {{
                  locale === "ar"
                    ? attr.ad_attribute_options[0]?.category_attributes_values
                        ?.name
                    : attr.ad_attribute_options[0]?.category_attributes_values
                        ?.name_en
                }}
              </template>
              <template v-else>
                {{ attr.text || (locale === "ar" ? "—" : "—") }}
              </template>
            </span>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex justify-between items-center gap-3 mt-8">
          <button
            class="bg-[#146AAB] cursor-pointer hover:bg-[#125d94] transition text-white py-2 w-full rounded-md text-sm font-medium"
          >
            {{ locale === "ar" ? "اتصال" : "Call" }}
          </button>
          <button
            class="bg-[#FFE800] cursor-pointer hover:bg-[#e6d400] transition py-2 w-full rounded-md text-sm font-medium"
          >
            {{ locale === "ar" ? "إرسال رسالة" : "Send Message" }}
          </button>
          <button
            @click="toggleFavorite"
            class="bg-gray-200 py-2 px-4 rounded-md hover:bg-gray-300 transition flex items-center gap-1"
          >
            <i
              class="pi"
              :class="
                isFavorite
                  ? 'pi-star-fill text-[#146AAB]'
                  : 'pi-star text-gray-400'
              "
            ></i>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Tabs -->
  <div class="bg-white p-4 rounded-lg flex items-start gap-4 mb-2">
    <button
      @click="activeTab = 'description'"
      :class="[
        'py-2 px-7 rounded-md text-sm font-medium transition',
        activeTab === 'description'
          ? 'bg-[#146AAB] text-white'
          : 'bg-gray-200 text-black',
      ]"
      class="cursor-pointer"
    >
      {{ locale === "ar" ? "الوصف" : "Description" }}
    </button>

    <button
      @click="activeTab = 'location'"
      :class="[
        'py-2 px-7 rounded-md text-sm font-medium transition',
        activeTab === 'location'
          ? 'bg-[#146AAB] text-white'
          : 'bg-gray-200 text-black',
      ]"
      class="cursor-pointer"
    >
      {{ locale === "ar" ? "الموقع" : "Location" }}
    </button>
  </div>

  <!-- Description / Location Content -->
  <div class="bg-white p-6 rounded-lg my-4">
    <div v-if="activeTab === 'description'">
      <h3 class="text-lg font-semibold text-gray-900 mb-3">
        {{ locale === "ar" ? "الوصف" : "Description" }}
      </h3>
      <p class="text-sm text-gray-700 leading-relaxed">
        {{ ad?.descr || t("adDetails.no-descr") }}
      </p>
    </div>

    <div v-else-if="activeTab === 'location'">
      <iframe
        v-if="mapUrl"
        class="w-full h-96 rounded-md"
        :src="mapUrl"
        allowfullscreen
        loading="lazy"
      ></iframe>
      <p v-else class="text-sm text-gray-500">
        {{ t("adDetails.no-location") }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { FreeMode, Thumbs, Navigation } from "swiper/modules";
import { ref, computed, toRef } from "vue";
import { useI18n } from "vue-i18n";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { MEDIA_URL } from "../services/axios";

const props = defineProps({
  ad: {
    type: Object,
    required: true,
  },
});

const ad = toRef(props, "ad");
const adData = ad;

// --- LocalStorage Favorites Logic ---
const FAVORITES_KEY = "AD_FAVORITES_LIST";

const getStoredFavorites = () => {
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (e) {
    console.error("Error parsing favorites from localStorage:", e);
    return [];
  }
};

const setStoredFavorites = (favoritesArray) => {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritesArray));
  } catch (e) {
    console.error("Error saving favorites to localStorage:", e);
  }
};

const adId = adData.value?.id;
const initialFavorites = getStoredFavorites();
const isFavorite = ref(initialFavorites.some((item) => item.id === adId));

const toggleFavorite = () => {
  if (!adId) return;

  const currentFavorites = getStoredFavorites();
  const existingIndex = currentFavorites.findIndex((item) => item.id === adId);

  if (existingIndex > -1) {
    currentFavorites.splice(existingIndex, 1);
    isFavorite.value = false;
  } else {
    currentFavorites.push(adData.value);
    isFavorite.value = true;
  }

  setStoredFavorites(currentFavorites);
};

// --- Swiper + Tabs + Computed ---
const { locale } = useI18n();
const thumbsSwiper = ref(null);
const activeTab = ref("description");

function onThumbSwiper(swiper) {
  thumbsSwiper.value = swiper;
}

const images = computed(() => {
  const imgs = adData.value?.ads_images ?? [];
  const base = MEDIA_URL?.replace(/\/$/, "") ?? "";
  return imgs.map((i) =>
    i.image?.startsWith("http") ? i.image : `${base}/${i.image}`
  );
});

const visibleAttributes = computed(() =>
  (adData.value?.ad_attributes ?? []).filter((a) => a.category_attributes)
);

const mapUrl = computed(() => {
  if (!adData.value?.lng || !adData.value.lat || !adData.value?.address)
    return "";
  return `https://www.google.com/maps?q=${adData.value.lat},${
    adData.value.lng
  }&hl=${locale.value === "ar" ? "ar" : "en"}&z=15&output=embed`;
});

function formatPrice(p) {
  if (!p) return "";
  const n = Number(p);
  return isNaN(n) ? p : `${n.toLocaleString()}`;
}
</script>

<style scoped>
.swiper-slide-thumb-active {
  border: 2px solid #146aab;
  border-radius: 0.5rem;
  opacity: 1;
}
</style>
