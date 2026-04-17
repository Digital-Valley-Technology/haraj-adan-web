<template>
  <app-layout>
    <main class="page-wrapper custom-container min-h-screen my-4">
      <div class="flex flex-col lg:flex-row gap-4 mx-8">
        <div class="w-full lg:w-80">
          <!-- map view -->
          <div class="p-4">
            <div
              class="bg-white p-2 rounded-lg flex items-center justify-center cursor-pointer w-full"
            >
              <button
                @click="toggleView"
                :class="[
                  'flex gap-4 items-center justify-center hover:bg-[#146AAB] hover:text-white transition-colors py-2 px-4 rounded-lg cursor-pointer w-full',
                  activeButtonList === 'map'
                    ? 'bg-[#F5F6F7] text-black'
                    : 'bg-[#EDEFF2] text-black',
                ]"
              >
                <span
                  class="bg-[#EDEFF2] w-7 h-7 rounded-full flex items-center justify-center"
                >
                  <i
                    :class="[
                      'pi',
                      activeButtonList === 'map' ? 'pi-list' : 'pi-map-marker',
                      activeButtonList === 'map' ? 'text-black' : 'text-black',
                    ]"
                  ></i>
                </span>
                <span class="text-sm font-medium">
                  {{
                    activeButtonList === "map"
                      ? currentLocale == "ar"
                        ? "عرض القائمة"
                        : "List View"
                      : currentLocale == "ar"
                      ? "عرض الخريطة"
                      : "Map View"
                  }}
                </span>
              </button>
            </div>
          </div>

          <!-- Filter (large Screen) -->
          <div class="hidden lg:block">
            <div class="p-4 bg-white rounded-lg mb-2">
              <h6 class="text-sm font-medium mb-2">
                {{ currentLocale == "ar" ? "تصفية" : "Filter" }}
              </h6>

              <!-- Parent Category -->
              <h6 class="text-xs font-medium mb-2">
                {{ currentLocale == "ar" ? "الفئة الرئيسية" : "Main Category" }}
              </h6>
              <select
                class="border rounded-md p-2 w-full border-[#cdced1] mb-4"
                :value="filtersStore.selectedParentCategory?.id || ''"
                @change="handleParentCategoryChange($event)"
              >
                <option value="">
                  {{ currentLocale === "ar" ? "جميع الفئات" : "All Categories" }}
                </option>
                <option
                  v-for="cat in parentCategories"
                  :key="cat.id"
                  :value="cat.id"
                >
                  {{ currentLocale === "ar" ? cat?.name : cat?.name_en }}
                </option>
              </select>

              <!-- Subcategory (shown when parent is selected) -->
              <template v-if="subCategories.length > 0">
                <h6 class="text-xs font-medium mb-2">
                  {{ currentLocale == "ar" ? "الفئة الفرعية" : "Subcategory" }}
                </h6>
                <select
                  class="border rounded-md p-2 w-full border-[#cdced1] mb-4"
                  :value="filtersStore.selectedSubCategory?.id || ''"
                  @change="handleSubCategoryChange($event)"
                >
                  <option value="">
                    {{ currentLocale === "ar" ? "جميع الفئات الفرعية" : "All Subcategories" }}
                  </option>
                  <option
                    v-for="cat in subCategories"
                    :key="cat.id"
                    :value="cat.id"
                  >
                    {{ currentLocale === "ar" ? cat?.name : cat?.name_en }}
                  </option>
                </select>
              </template>

              <!-- Price -->
              <h6 class="text-xs font-medium mb-2">
                {{ currentLocale == "ar" ? "السعر" : "Price" }}
              </h6>

              <div class="flex items-center justify-between w-full mb-4">
                <input
                  type="number"
                  v-model="filtersStore.minPrice"
                  :placeholder="
                    currentLocale == 'ar' ? 'على الأقل' : 'At least'
                  "
                  class="py-2 px-2 border border-[#cdced1] text-xs rounded-md text-center w-30"
                />
                <span>-</span>
                <input
                  type="number"
                  v-model="filtersStore.maxPrice"
                  :placeholder="
                    currentLocale == 'ar' ? 'على الأكثر' : 'At most'
                  "
                  class="py-2 px-2 border border-[#cdced1] text-xs rounded-md text-center w-30"
                />
              </div>

              <h6 class="text-xs font-medium mb-2">{{ $t("ads.currency") }}</h6>
              <div class="flex flex-wrap gap-2 mb-4">
                <button
                  v-for="val in currencies"
                  :key="val.id"
                  @click="filtersStore.toggleCurrencyValue(val.id)"
                  :class="[
                    'text-xs capitalize py-2 px-4 rounded-md cursor-pointer transition-colors',
                    filtersStore.isCurrencyActive(val.id)
                      ? 'bg-[#146AAB] text-white'
                      : 'bg-[#EDEFF2] text-black hover:bg-[#0f76c5] hover:text-white',
                  ]"
                >
                  {{ currentLocale === "ar" ? val.name : val.name_en }}
                </button>
              </div>

              <!-- Dynamic Filters (Multi-Select) -->
              <div
                v-for="item in selectedCategory?.category_attributes"
                :key="item.id"
              >
                <div
                  v-if="
                    item?.category_attributes_types?.code !== 'location' &&
                    item?.category_attributes_types?.code !== 'textarea' &&
                    item?.category_attributes_types?.code !== 'number'
                  "
                >
                  <h6 class="text-xs font-medium mb-2">
                    {{ currentLocale == "ar" ? item?.name : item?.name_en }}
                  </h6>
                  <div class="flex flex-wrap gap-2 mb-4">
                    <button
                      v-for="val in item?.category_attributes_values"
                      :key="val.id"
                      @click="
                        filtersStore.toggleAttributeValue(item.id, val.id)
                      "
                      :class="[
                        'text-xs capitalize py-2 px-4 rounded-md cursor-pointer transition-colors',
                        filtersStore.isAttributeActive(item.id, val.id)
                          ? 'bg-[#146AAB] text-white'
                          : 'bg-[#EDEFF2] text-black hover:bg-[#0f76c5] hover:text-white',
                      ]"
                    >
                      {{ currentLocale === "ar" ? val.name : val.name_en }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Filter Buttons -->
            <div class="bg-white rounded-lg mb-4 p-4">
              <div class="flex gap-2 items-center">
                <button
                  @click="filtersStore.clearFilters"
                  class="flex-1 text-sm bg-[#EDEFF2] py-2 px-4 rounded-md hover:bg-[#c0c3c6]"
                >
                  {{ currentLocale == "ar" ? "مسح التصفية" : "Clear Filter" }}
                </button>
                <button
                  @click="applyFilters"
                  class="flex-1 text-sm bg-[#FFE800] py-2 px-4 rounded-md hover:bg-[#f5e427]"
                >
                  {{ currentLocale == "ar" ? "تطبيق الفلتر" : "Apply Filter" }}
                </button>
              </div>
            </div>
          </div>

          <!-- Filter (small Screen) -->
          <div class="card flex justify-center lg:hidden">
            <Drawer
              v-model:visible="visible"
              :header="currentLocale == 'ar' ? 'تصفية' : 'Filter'"
            >
              <div class="p-4 bg-white rounded-lg mb-2">
                <h6 class="text-sm font-medium mb-2">
                  {{ currentLocale == "ar" ? "تصفية" : "Filter" }}
                </h6>

                <!-- Parent Category -->
                <h6 class="text-xs font-medium mb-2">
                  {{ currentLocale == "ar" ? "الفئة الرئيسية" : "Main Category" }}
                </h6>
                <select
                  class="border rounded-md p-2 w-full border-[#cdced1] mb-4"
                  :value="filtersStore.selectedParentCategory?.id || ''"
                  @change="handleParentCategoryChange($event)"
                >
                  <option value="">
                    {{ currentLocale === "ar" ? "جميع الفئات" : "All Categories" }}
                  </option>
                  <option
                    v-for="cat in parentCategories"
                    :key="cat.id"
                    :value="cat.id"
                  >
                    {{ currentLocale === "ar" ? cat?.name : cat?.name_en }}
                  </option>
                </select>

                <!-- Subcategory (shown when parent is selected) -->
                <template v-if="subCategories.length > 0">
                  <h6 class="text-xs font-medium mb-2">
                    {{ currentLocale == "ar" ? "الفئة الفرعية" : "Subcategory" }}
                  </h6>
                  <select
                    class="border rounded-md p-2 w-full border-[#cdced1] mb-4"
                    :value="filtersStore.selectedSubCategory?.id || ''"
                    @change="handleSubCategoryChange($event)"
                  >
                    <option value="">
                      {{ currentLocale === "ar" ? "جميع الفئات الفرعية" : "All Subcategories" }}
                    </option>
                    <option
                      v-for="cat in subCategories"
                      :key="cat.id"
                      :value="cat.id"
                    >
                      {{ currentLocale === "ar" ? cat?.name : cat?.name_en }}
                    </option>
                  </select>
                </template>

                <!-- Price -->
                <h6 class="text-xs font-medium mb-2">
                  {{ currentLocale == "ar" ? "السعر" : "Price" }}
                </h6>
                <div class="flex items-center justify-between w-full mb-4">
                  <input
                    type="number"
                    v-model="filtersStore.minPrice"
                    :placeholder="
                      currentLocale == 'ar' ? 'على الأقل' : 'At least'
                    "
                    class="py-2 px-2 border border-[#cdced1] text-xs rounded-md text-center w-30"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    v-model="filtersStore.maxPrice"
                    :placeholder="
                      currentLocale == 'ar' ? 'على الأكثر' : 'At most'
                    "
                    class="py-2 px-2 border border-[#cdced1] text-xs rounded-md text-center w-30"
                  />
                </div>

                <h6 class="text-xs font-medium mb-2">
                  {{ $t("ads.currency") }}
                </h6>
                <div class="flex flex-wrap gap-2 mb-4">
                  <button
                    v-for="val in currencies"
                    :key="val.id"
                    @click="filtersStore.toggleCurrencyValue(val.id)"
                    :class="[
                      'text-xs capitalize py-2 px-4 rounded-md cursor-pointer transition-colors',
                      filtersStore.isCurrencyActive(val.id)
                        ? 'bg-[#146AAB] text-white'
                        : 'bg-[#EDEFF2] text-black hover:bg-[#0f76c5] hover:text-white',
                    ]"
                  >
                    {{ currentLocale === "ar" ? val.name : val.name_en }}
                  </button>
                </div>

                <!-- Dynamic Filters (Multi-Select) -->
                <div
                  v-for="item in selectedCategory?.category_attributes"
                  :key="item.id"
                >
                  <div
                    v-if="
                      item?.category_attributes_types?.code !== 'location' &&
                      item?.category_attributes_types?.code !== 'textarea' &&
                      item?.category_attributes_types?.code !== 'number'
                    "
                  >
                    <h6 class="text-xs font-medium mb-2">
                      {{ currentLocale == "ar" ? item?.name : item?.name_en }}
                    </h6>
                    <div class="flex flex-wrap gap-2 mb-4">
                      <button
                        v-for="val in item?.category_attributes_values"
                        :key="val.id"
                        @click="
                          filtersStore.toggleAttributeValue(item.id, val.id)
                        "
                        :class="[
                          'text-xs capitalize py-2 px-4 rounded-md cursor-pointer transition-colors',
                          filtersStore.isAttributeActive(item.id, val.id)
                            ? 'bg-[#146AAB] text-white'
                            : 'bg-[#EDEFF2] text-black hover:bg-[#0f76c5] hover:text-white',
                        ]"
                      >
                        {{ currentLocale === "ar" ? val.name : val.name_en }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Filter Buttons -->
              <div class="bg-white rounded-lg mb-4 p-4">
                <div class="flex gap-2 items-center">
                  <button
                    @click="filtersStore.clearFilters"
                    class="flex-1 text-sm bg-[#EDEFF2] py-2 px-4 rounded-md hover:bg-[#c0c3c6]"
                  >
                    {{ currentLocale == "ar" ? "مسح التصفية" : "Clear Filter" }}
                  </button>
                  <button
                    @click="applyFilters"
                    class="flex-1 text-sm bg-[#FFE800] py-2 px-4 rounded-md hover:bg-[#f5e427]"
                  >
                    {{
                      currentLocale == "ar" ? "تطبيق الفلتر" : "Apply Filter"
                    }}
                  </button>
                </div>
              </div>
            </Drawer>

            <div class="bg-white p-2 w-full rounded-lg">
              <button
                @click="visible = true"
                class="bg-white w-full py-2 text-sm rounded-lg hover:bg-[#F5F6F7]"
                active-class="bg-[#F5F6F7]"
              >
                {{ currentLocale == "ar" ? "تصفية" : "Filter" }}
              </button>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="lg:flex-1">
          <!-- Results + Sort -->

          <div
            class="bg-white p-4 rounded-lg flex justify-between items-center mb-4"
          >
            <span class="text-xs md:text-sm font-semibold">
              {{ filtersStore.total }}
              {{ currentLocale == "ar" ? "نتيجة" : "results" }}
            </span>

            <div>
              <button
                @click="activeButtonList = 'list'"
                :class="[
                  'border border-gray-200  p-1 rounded-r-sm ',
                  activeButtonList === 'list'
                    ? 'bg-[#146AAB] text-white'
                    : 'bg-[#EDEFF2] text-black hover:bg-[#0f76c5] hover:text-white',
                ]"
              >
                <i class="pi pi-list"></i>
              </button>
              <button
                @click="activeButtonList = 'table'"
                :class="[
                  'border border-gray-200  p-1 rounded-l-sm ',
                  activeButtonList === 'table'
                    ? 'bg-[#146AAB] text-white'
                    : 'bg-[#EDEFF2] text-black hover:bg-[#0f76c5] hover:text-white',
                ]"
              >
                <i class="pi pi-table"></i>
              </button>

              <select
                v-model="filtersStore.sortBy"
                class="border rounded-md p-1 w-40 border-[#cdced1] ms-2"
              >
                <option disabled value="">
                  {{ currentLocale === "ar" ? "ترتيب حسب" : "Sort By" }}
                </option>
                <!-- <option value="newest">
                {{ currentLocale === "ar" ? "الأحدث" : "Newest" }}
              </option>
              <option value="oldest">
                {{ currentLocale === "ar" ? "الأقدم" : "Oldest" }}
              </option> -->
                <option value="price_asc">
                  {{
                    currentLocale === "ar"
                      ? "السعر: من الأقل"
                      : "Price: Low to High"
                  }}
                </option>
                <option value="price_desc">
                  {{
                    currentLocale === "ar"
                      ? "السعر: من الأعلى"
                      : "Price: High to Low"
                  }}
                </option>
              </select>
            </div>
          </div>

          <!-- Map -->
          <div v-if="activeButtonList === 'map'" class="p-4 mb-4">
            <div class="w-full h-[150vh] rounded-lg">
              <AdsMapPins :ads="filtersStore.ads" :zoom="8" />
            </div>
          </div>

          <!-- Ads (List or Grid) -->
          <div v-else>
            <div v-if="activeButtonList === 'list'">
              <div
                v-for="ad in filtersStore.ads"
                :key="ad?.id"
                :class="[
                  'flex items-center p-3 mb-1 min-h-[100px]',
                  ad?.featured ? 'bg-[#FFFEF0]' : 'bg-white',
                ]"
              >
                <!-- Image -->
                <div role="button" class="w-[120px] h-[80px] flex-shrink-0">
                  <img
                    @click="goToAdDetails(ad?.id)"
                    :src="mainImage(ad?.ads_images?.[0]?.image)"
                    class="w-full h-full object-cover rounded-md cursor-pointer"
                  />
                </div>

                <!-- Title + Featured -->
                <div class="flex flex-col ms-4 flex-1">
                  <span
                    v-if="isFeatured(ad)"
                    class="bg-yellow-400 text-xs font-semibold text-gray-800 px-2 py-0.5 rounded w-fit mb-1"
                  >
                    {{ t("ads.featured") }}
                  </span>

                  <p class="text-sm font-medium text-gray-900 leading-snug">
                    {{ currentLocale == "ar" ? ad?.title : ad?.title_en }}
                  </p>
                </div>

                <!-- Price -->
                <div
                  class="w-[100px] text-center text-blue-700 font-bold text-sm px-2"
                >
                  {{
                    currentLocale == "ar"
                      ? `${ad?.price} ${ad?.currencies?.name}`
                      : `${ad?.currencies?.name_en} ${ad?.price}`
                  }}
                </div>

                <!-- Date -->
                <div class="w-[140px] text-center text-sm text-gray-700 px-2">
                  {{ formatedDate(ad?.created) }}
                </div>

                <!-- Address -->
                <div class="w-[100px] text-right text-sm text-gray-700 px-2">
                  {{ getAdAddress(ad) }}
                </div>
              </div>
            </div>
            <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div
                v-for="ad in filtersStore.ads"
                :key="ad?.id"
                :class="[
                  ' bg-[#FFFEF0] rounded-lg cursor-pointer hover:bg-[#FFFACD] mb-4',
                  isFeatured(ad) ? 'bg-[#FFFACD] ' : ' bg-white ',
                ]"
              >
                <div
                  class="flex gap-4 items-start p-4 rounded-lg cursor-pointer mb-4"
                >
                  <div>
                    <img
                      :src="mainImage(ad?.ads_images?.[0]?.image)"
                      class="w-20 h-16 object-cover rounded cursor-pointer"
                      role="button"
                      @click="goToAdDetails(ad?.id)"
                    />
                  </div>
                  <div class="flex flex-col gap-1 items-start">
                    <span
                      v-if="isFeatured(ad)"
                      class="bg-yellow-300 text-[9px] px-2 py-1 rounded w-fit"
                      >{{ t("ads.featured") }}</span
                    >
                    <p class="text-[9px] text-[#A1A1A1]">{{ ad.id }}</p>
                    <p class="text-sm w-48 uppercase">
                      {{ currentLocale == "ar" ? ad.title : ad.title_en }}
                    </p>
                    <p class="text-xs text-[#146AAB]">
                      {{
                        currentLocale == "ar"
                          ? `${ad?.price} ${ad?.currencies?.name}`
                          : `${ad?.currencies?.name_en} ${ad?.price}`
                      }}
                    </p>
                    <p class="text-xs text-[#A1A1A1]">
                      {{
                        currentLocale == "ar"
                          ? "المدينة / المنطقة:"
                          : "City / District:"
                      }}
                      <span class="text-[#146AAB] text-xs capitalize">{{
                        getAdAddress(ad)
                      }}</span>
                    </p>
                    <p class="text-xs text-[#A1A1A1]">
                      {{
                        currentLocale == "ar"
                          ? "تاريخ الإعلان:"
                          : "Announcement Date:"
                      }}
                      <span class="text-[#146AAB] text-xs capitalize">{{
                        formatedDate(ad?.created)
                      }}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <div
              class="flex justify-center mt-6"
              v-if="filtersStore.meta?.total > 0"
            >
              <Paginator
                :rows="filtersStore.meta.limit"
                :totalRecords="filtersStore.meta.total"
                :first="(filtersStore.meta.page - 1) * filtersStore.meta.limit"
                @page="onPageChange"
                template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                :rowsPerPageOptions="[2, 5, 10, 20, 30, 50]"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  </app-layout>
</template>

<script setup>
import AppLayout from "../Layout/AppLayout.vue";
import { useI18n } from "vue-i18n";
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter, onBeforeRouteUpdate } from "vue-router";
import { useFiltersStore } from "../store/filters";
import { MEDIA_URL } from "../services/axios";
import dayjs from "dayjs";
import AdsMapPins from "../components/AdsMapPins.vue";

const { t, locale } = useI18n();
const router = useRouter();
const route = useRoute();

const filtersStore = useFiltersStore();

const activeButtonList = ref("list");

const currentLocale = computed(() => locale.value || "ar");
const routeQuery = computed(() => router.currentRoute.value?.query?.q || "");
const initialCategoryId = computed(() => {
  const id = route.query.categoryId;
  return id ? Number(id) : null;
});

const visible = ref(false);

const toggleView = () => {
  activeButtonList.value !== "map"
    ? (activeButtonList.value = "map")
    : (activeButtonList.value = "list");
};

const goToAdDetails = (adId) => {
  router.push({ name: "ad-details", params: { adId } });
};

const formatedDate = (date) => {
  return dayjs(date).format("MMM D, YYYY");
};

const onPageChange = (event) => {
  filtersStore.setPage(event.page + 1); // PrimeVue pages are 0-based
  filtersStore.setLimit(event.rows);
  filtersStore.fetchAds(routeQuery.value);
};

const applyFilters = () => {
  filtersStore.fetchAds(routeQuery.value);
};

const mainImage = (img) => {
  return `${MEDIA_URL}/${img}`;
};

const isFeatured = (ad) => {
  return ad?.ad_featured_history && ad.ad_featured_history.length > 0;
};

/**
 * Helper function to extract the city and country from a comma-separated address string
 * and return them as a formatted string (e.g., "Tanta, Egypt").
 *
 * @param {string} formattedAddress The full address string (e.g., 'شارع ...، طنطا 31516، مصر').
 * @returns {string} A string containing the city and country, separated by a comma. Returns 'N/A' on failure.
 */
const extractAndFormatCityAndCountry = (formattedAddress) => {
  if (
    !formattedAddress ||
    typeof formattedAddress !== "string" ||
    formattedAddress === "N/A"
  ) {
    return "N/A";
  }

  // 1. Split the address by the Arabic comma (،)
  const parts = formattedAddress.split("،").map((part) => part.trim());

  // 2. Filter out any empty strings
  const non_empty_parts = parts.filter((part) => part.length > 0);

  // 3. Handle cases where there aren't enough parts
  if (non_empty_parts.length < 2) {
    // If only one part (e.g., just "مصر"), return it.
    if (non_empty_parts.length === 1) {
      return non_empty_parts[0];
    }
    return "N/A";
  }

  // 4. The country is the last element
  const country = non_empty_parts[non_empty_parts.length - 1];

  // 5. The city (which might include the zip code) is the second-to-last element
  let cityAndZip = non_empty_parts[non_empty_parts.length - 2];

  // 6. Clean up the city/zip part by removing digits (the zip code)
  // Example: "طنطا 31516" becomes "طنطا"
  const city = cityAndZip.replace(/[0-9]/g, "").trim();

  // 7. Combine and return the formatted string
  // Using the Arabic comma for consistency
  return `${city}، ${country}`;
};

const getAdAddress = (ad) => {
  // Find the attribute that has the full address
  const fullAddress = ad?.address;

  if (!fullAddress) {
    return "N/A";
  }

  // Call the helper function to parse and format the address as a string
  return extractAndFormatCityAndCountry(fullAddress);
};

/**
 * Finds the latitude and longitude for an ad from its attributes.
 * It looks for an attribute that has both 'lat' and 'lng' properties.
 *
 * @param {Object} ad The ad object containing ad_attributes.
 * @returns {{lat: number, lng: number} | null} An object with lat/lng as numbers, or null if coordinates are not found.
 */
const getAdCoordinates = (ad) => {
  if (ad?.lat != null && ad?.lng != null) {
    // Return the coordinates, ensuring they are treated as numbers.
    return {
      lat: +ad?.lat,
      lng: +ad?.lng,
    };
  }

  return null;
};

const categoriesFilter = computed(() => filtersStore.getCategories);
const selectedCategory = computed(() => filtersStore.getSelectedCategory);
const currencies = computed(() => filtersStore.getCurrencies);

// Parent/Subcategory computed properties
const parentCategories = computed(() => filtersStore.getParentCategories);
const subCategories = computed(() => filtersStore.getSubCategories);

// Handler for parent category selection
const handleParentCategoryChange = (event) => {
  const selectedId = event.target.value;
  if (!selectedId || selectedId === "") {
    filtersStore.setSelectedParentCategory(null);
  } else {
    const parent = parentCategories.value.find((c) => c.id === Number(selectedId));
    if (parent) {
      filtersStore.setSelectedParentCategory(parent);
    }
  }
};

// Handler for subcategory selection
const handleSubCategoryChange = (event) => {
  const selectedId = event.target.value;
  if (!selectedId || selectedId === "") {
    filtersStore.setSelectedSubCategory(null);
  } else {
    const sub = subCategories.value.find((c) => c.id === Number(selectedId));
    if (sub) {
      filtersStore.setSelectedSubCategory(sub);
    }
  }
};

// Helper function to apply category selection based on categoryId
const applyCategorySelection = (categoryIdNum, parentCats) => {
  if (!categoryIdNum || !parentCats?.length) return false;

  // Check if it's a parent category
  const parentMatch = parentCats.find((p) => p.id === categoryIdNum);
  if (parentMatch) {
    filtersStore.selectedParentCategory = parentMatch;
    filtersStore.selectedSubCategory = null;
    filtersStore.selectedCategory = parentMatch;
    return true;
  }

  // Otherwise, find which parent contains this subcategory
  for (const parent of parentCats) {
    const children = parent.other_categories || parent.children || [];
    const childMatch = children.find((c) => c.id === categoryIdNum);
    if (childMatch) {
      filtersStore.selectedParentCategory = parent;
      filtersStore.selectedSubCategory = childMatch;
      const foundInFlat = filtersStore.categories.find((c) => c.id === categoryIdNum);
      filtersStore.selectedCategory = foundInFlat || childMatch;
      return true;
    }
  }
  return false;
};

// Watch for parent categories to load, then pre-select based on URL categoryId
watch(
  () => parentCategories.value,
  (newParentCategories) => {
    const id = initialCategoryId.value;
    if (!id || !newParentCategories?.length) return;

    const categoryIdNum = Number(id);

    // Get current effective category ID
    const currentCategoryId = filtersStore.selectedSubCategory?.id || filtersStore.selectedParentCategory?.id;

    // Skip if already showing the correct category
    if (currentCategoryId === categoryIdNum) return;

    // Temporarily disable auto-fetch to avoid double fetching
    filtersStore.autoFetchEnabled = false;

    applyCategorySelection(categoryIdNum, newParentCategories);

    filtersStore.autoFetchEnabled = true;

    // After setting the category, fetch the ads immediately with the new filter
    filtersStore.fetchAds(routeQuery.value);
  },
  { immediate: true }
);

// Handle route updates when navigating to the same component with different categoryId
onBeforeRouteUpdate((to, from) => {
  const newCategoryId = to.query.categoryId;
  const oldCategoryId = from.query.categoryId;

  // Skip if no change
  if (newCategoryId === oldCategoryId) return;

  // If parentCategories aren't loaded yet, the other watch will handle it
  if (!parentCategories.value?.length) return;

  // Temporarily disable auto-fetch
  filtersStore.autoFetchEnabled = false;

  if (!newCategoryId) {
    // Clear selection if no categoryId
    filtersStore.selectedParentCategory = null;
    filtersStore.selectedSubCategory = null;
    filtersStore.selectedCategory = {};
  } else {
    applyCategorySelection(Number(newCategoryId), parentCategories.value);
  }

  filtersStore.autoFetchEnabled = true;
  filtersStore.selectedAttributes = {};
  filtersStore.minPrice = null;
  filtersStore.maxPrice = null;
  filtersStore.selectedCurrencies = [];
  filtersStore.page = 1;
  filtersStore.fetchAds(to.query.q || "");
});

// Watch for price changes with debounce (skip initial)
let priceDebounce = null;
let priceInitialized = false;
watch(
  () => [filtersStore.minPrice, filtersStore.maxPrice],
  (newVal, oldVal) => {
    // Skip first run to avoid fetching on mount
    if (!priceInitialized) {
      priceInitialized = true;
      return;
    }
    clearTimeout(priceDebounce);
    priceDebounce = setTimeout(() => {
      filtersStore.page = 1;
      filtersStore.fetchAds(routeQuery.value);
    }, 500);
  }
);

// Watch for sort changes (skip initial)
let sortInitialized = false;
watch(
  () => filtersStore.sortBy,
  (newVal, oldVal) => {
    // Skip first run to avoid fetching on mount
    if (!sortInitialized) {
      sortInitialized = true;
      return;
    }
    filtersStore.page = 1;
    filtersStore.fetchAds(routeQuery.value);
  }
);

onMounted(() => {
  filtersStore.fetchParentCategories();
  filtersStore.fetchCategories();
  filtersStore.fetchCurrencies();
  filtersStore.fetchAds(routeQuery.value);
});
</script>
