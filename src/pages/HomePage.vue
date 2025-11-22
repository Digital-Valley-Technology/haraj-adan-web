<script setup>
import AppLayout from "../Layout/AppLayout.vue";
import AdCard from "../components/AdCard.vue";
import AdCardSpecial from "../components/AdCardSpecial.vue";
import SideMenuClient from "../components/SideMenuClient.vue";
import { homeAds } from "../data";
import { useI18n } from "vue-i18n";
import { useHomeStore } from "../store/home";
import { computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useLocationStore } from "../store/location";

const { locale } = useI18n();
const homeStore = useHomeStore();
const router = useRouter();

const locationStore = useLocationStore();
const nearByAds = computed(() => homeStore.nearbyAds);
// Watch latitude/longitude and call API as soon as valid
watch(
  () => locationStore.locationLoaded,
  (loaded) => {
    if (loaded) {
      homeStore.fetchNearbyAds({
        lat: locationStore.latitude, // unwrap the ref
        lng: locationStore.longitude,
      });
    }
  },
  { immediate: true }
);

const fetchHomePageAds = () => {
  homeStore.fetchAds();
};

const ads = computed(() => homeStore.ads);
const currentLocale = computed(() => locale.value);
const loading = computed(() => homeStore.adsLoading);

const handleNavigation = (routeName) => {
  router.push({ name: routeName });
};

onMounted(() => {
  fetchHomePageAds();

  if (!locationStore.locationLoaded) {
    locationStore.detectLocation();
  } else if (locationStore.latitude && locationStore.longitude) {
    // Location already cached: call API immediately
    homeStore.fetchNearbyAds({
      lat: locationStore.latitude,
      lng: locationStore.longitude,
    });
  }
});
</script>

<template>
  <app-layout>
    <div class="page-wrapper mx-auto min-h-[500px]">
      <div
        class="flex flex-col md:flex-row min-h-screen gap-4 custom-container px-4 mb-4"
      >
        <!-- Sidebar -->
        <side-menu-client />
        <!-- Main content -->
        <div class="flex-1">
          <div class="flex justify-between items-center mb-4">
            <span class="font-semibold text-base">
              {{
                currentLocale == "ar"
                  ? "إعلانات الصفحة الرئيسية"
                  : "Home Page Ads"
              }}
            </span>

            <div class="flex items-center space-x-4">
              <i
                class="pi pi-filter cursor-pointer"
                role="button"
                @click="handleNavigation('search')"
              ></i>

              <a
                @click="handleNavigation('search')"
                role="button"
                class="text-[#146AAB] text-xs font-medium cursor-pointer"
              >
                {{ currentLocale === "ar" ? "رؤية الكل >" : "See All" }}
              </a>
            </div>
          </div>
          <!-- Ads Section -->
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <!-- Skeletons when loading -->
            <template v-if="loading">
              <div v-for="n in 8" :key="n" class="animate-pulse space-y-2">
                <div class="bg-gray-300 h-48 rounded-md"></div>
                <div class="bg-gray-300 h-3 w-3/4 rounded"></div>
              </div>
            </template>

            <!-- Actual Ads when loaded -->
            <template v-else>
              <div v-for="ad in ads" :key="ad?.id">
                <ad-card-special :item="ad" />
              </div>
            </template>
          </div>

          <div class="flex justify-between items-center mb-4 mt-12">
            <span class="font-semibold text-base">
              {{
                currentLocale == "ar"
                  ? "قائمة التسوق من المالك القريب منك"
                  : "Shopping listing from the owner near you"
              }}
            </span>
            <a
              @click="handleNavigation('search')"
              role="button"
              class="text-[#146AAB] text-xs font-medium cursor-pointer"
              >{{ currentLocale === "ar" ? "رؤية الكل >" : "See All" }}</a
            >
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div v-for="add in nearByAds" :key="add?.id">
              <ad-card :item="add" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </app-layout>
</template>

<style scoped></style>
