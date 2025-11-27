<template>
  <app-layout>
    <div class="page-wrapper mx-auto min-h-[500px] custom-container px-4 mb-4">
      <!-- side menu -->
      <div class="flex gap-4">
        <div><side-menu-client></side-menu-client></div>

        <!-- main content -->
        <div class="flex-1">
          <!-- Category Header -->
          <div
            class="relative rounded-xl overflow-hidden mb-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 shadow-md"
          >
            <div
              class="absolute inset-0 bg-black/30 flex items-center justify-center"
            >
              <h1
                class="text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-md text-center px-4"
              >
                {{ category?.name }}
              </h1>
            </div>
            <img
              v-if="category?.image"
              :src="MEDIA_URL + category?.image"
              alt="Category image"
              class="w-full h-[180px] md:h-[250px] lg:h-[300px] object-cover"
            />
            <div
              v-else
              class="w-full h-[180px] md:h-[250px] lg:h-[300px] bg-gray-300"
            ></div>
          </div>

          <!-- Special Ads -->
          <div>
            <div v-if="specialAds.length">
              <div class="flex justify-between items-center mb-4">
                <span class="font-semibold text-base">
                  {{ currentLocale == "ar" ? "إعلانات خاصة" : "Special Ads" }}
                </span>

                <div class="flex items-center space-x-4">
                  <a
                    @click="handleNavigation('special')"
                    role="button"
                    class="text-[#146AAB] text-xs font-medium cursor-pointer"
                  >
                    {{ currentLocale === "ar" ? "رؤية الكل >" : "See All" }}
                  </a>
                </div>
              </div>

              <!-- <div class="mb-4 flex items-center justify-between">
                <span class="font-semibold text-lg">
                  {{ currentLocale == "ar" ? "إعلانات خاصة" : "Special Ads" }}
                </span>
              </div> -->

              <template v-if="specialAds.length">
                <div
                  class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4"
                >
                  <div v-for="item in specialAds" :key="item?.id">
                    <ad-card-special :item="item" />
                  </div>
                </div>

                <Paginator
                  v-if="specialAds.length > 0"
                  :first="(specialPage - 1) * rows"
                  :rows="rows"
                  :totalRecords="totalSpecialAds"
                  @page="onSpecialPageChange"
                  class="mb-8"
                />
              </template>

              <p
                v-else
                class="text-gray-500 text-center py-6 italic border border-dashed rounded-lg"
              >
                {{
                  currentLocale == "ar"
                    ? "لا توجد إعلانات خاصة"
                    : "No special ads available."
                }}
              </p>
            </div>

            <div class="flex justify-between items-center mb-4">
              <span class="font-semibold text-base">
                {{ currentLocale == "ar" ? "جميع الإعلانات" : "All Ads" }}
              </span>

              <div class="flex items-center space-x-4">
                <a
                  @click="handleNavigation('all')"
                  role="button"
                  class="text-[#146AAB] text-xs font-medium cursor-pointer"
                >
                  {{ currentLocale === "ar" ? "رؤية الكل >" : "See All" }}
                </a>
              </div>
            </div>

            <template v-if="allAds.length">
              <div
                class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4"
              >
                <div v-for="item in allAds" :key="item?.id">
                  <ad-card-special :item="item" />
                </div>
              </div>

              <Paginator
                v-if="allAds?.length > 0"
                :first="(allAdsPage - 1) * rows"
                :rows="rows"
                :totalRecords="totalAllAds"
                @page="onAllAdsPageChange"
                class="mb-4"
              />
            </template>

            <p
              v-else
              class="text-gray-500 text-center py-6 italic border border-dashed rounded-lg"
            >
              {{
                currentLocale == "ar" ? "لا توجد إعلانات" : "No ads available."
              }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </app-layout>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { ref, computed, onMounted, watch } from "vue";
import AppLayout from "../Layout/AppLayout.vue";
import SideMenuClient from "../components/SideMenuClient.vue";
import AdCardSpecial from "../components/AdCardSpecial.vue";
import requestService from "../services/api/requestService";
import { MEDIA_URL } from "../services/axios";

const { locale } = useI18n();
const router = useRouter();
const route = useRoute();

const rows = 8; // ads per page

// Category info
const category = ref({});
const currentLocale = computed(() => locale.value);
// Pagination states
const specialPage = ref(1);
const allAdsPage = ref(1);

// Ads data
const specialAds = ref([]);
const allAds = ref([]);

// Total counts
const totalSpecialAds = ref(0);
const totalAllAds = ref(0);

const categoryId = computed(() => route.params.id);

// 🔹 Fetch category basic info
const fetchCategory = async () => {
  try {
    const res = await requestService.getAll(`categories/${categoryId.value}`);
    category.value = res.data;
  } catch (error) {
    console.log(error);
  }
};

const handleNavigation = (type) => {
  router.push({ name: "category-ads", params: { id: categoryId.value, type } });
};

// 🔹 Fetch special (featured) ads
const fetchSpecialAds = async () => {
  try {
    const res = await requestService.getAll(
      `categories/${categoryId.value}/special-ads?page=${specialPage.value}&limit=${rows}`
    );
    specialAds.value = res.data?.special_ads || [];
    totalSpecialAds.value = res.meta?.total || 0;
  } catch (error) {
    console.log(error);
  }
};

// 🔹 Fetch all ads (special + normal)
const fetchAllAds = async () => {
  try {
    const res = await requestService.getAll(
      `categories/${categoryId.value}/ads?page=${allAdsPage.value}&limit=${rows}`
    );
    allAds.value = res.data?.ads || [];
    totalAllAds.value = res.meta?.total || 0;
  } catch (error) {
    console.log(error);
  }
};

// 🔹 Handle pagination change (special ads)
const onSpecialPageChange = async (event) => {
  specialPage.value = event.page + 1; // paginator uses zero-based pages
  await fetchSpecialAds();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// 🔹 Handle pagination change (all ads)
const onAllAdsPageChange = async (event) => {
  allAdsPage.value = event.page + 1;
  await fetchAllAds();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// 🔹 Fetch all data (category + ads)
const fetchData = async () => {
  await fetchCategory();
  await Promise.all([fetchSpecialAds(), fetchAllAds()]);
};

// 🔹 Refetch when category changes
watch(
  () => route.params.id,
  () => {
    specialPage.value = 1;
    allAdsPage.value = 1;
    fetchData();
  }
);

onMounted(() => {
  fetchData();
});
</script>
