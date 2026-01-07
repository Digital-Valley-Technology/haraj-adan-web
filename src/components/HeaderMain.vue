<template>
  <header
    id="header-main"
    class="flex items-center fixed bg-[#166DA0] w-full z-50 shadow-lg h-[80px]"
    :dir="dir"
  >
    <div class="custom-container w-full flex justify-between items-center px-4">
      <RouterLink to="/" class="flex items-center me-4">
        <div class="h-20 flex justify-center items-center">
          <img src="/logo.png" alt="raheed logo" class="h-16" />
        </div>
      </RouterLink>

      <button
        @click="isMenuOpen = !isMenuOpen"
        class="md:hidden text-white p-2 rounded hover:bg-[#0F4E7C] transition"
      >
        <i class="pi pi-bars text-xl"></i>
      </button>

      <div
        class="absolute md:static top-[80px] left-0 w-full bg-[#166DA0] md:bg-transparent md:flex md:flex-1 md:items-center transition-all duration-300 ease-in-out"
        :class="{
          hidden: !isMenuOpen && isMobile,
          block: isMenuOpen && isMobile,
        }"
      >
        <div
          class="flex flex-col md:flex-row md:items-center md:justify-between w-full p-4 md:p-0 space-y-4 md:space-y-0"
        >
          <div
            class="relative w-full sm:w-[80%] md:w-[300px] lg:w-[500px]"
            ref="searchContainer"
          >
            <template v-if="isSearchPage">
              <input
                type="text"
                :value="$route.query.q || ''"
                @input="handleSearchPageInput($event.target.value)"
                :placeholder="$t('ads.search_placeholder')"
                class="w-full py-2 rounded-md bg-[#0F4E7C] text-white placeholder-white focus:outline-none ps-2 pr-8"
                @keydown.enter.prevent="handleSearch"
              />
            </template>

            <template v-else>
              <input
                type="text"
                v-model="searchQuery"
                :placeholder="$t('ads.search_placeholder')"
                class="w-full py-2 rounded-md bg-[#0F4E7C] text-white placeholder-white focus:outline-none ps-2 pr-8"
                @input="onInput"
                @keydown.enter.prevent="handleSearch"
                @focus="onFocus"
              />

              <transition name="fade">
                <div
                  v-if="shouldShowDropdown"
                  class="absolute mt-2 w-full bg-white rounded-xl shadow-2xl z-[9999] border border-gray-200 max-h-80 overflow-y-auto"
                >
                  <template
                    v-for="(item, index) in mergedSuggestions"
                    :key="index"
                  >
                    <div
                      v-if="item.type === 'header'"
                      class="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 sticky top-0"
                    >
                      {{ item.label }}
                    </div>

                    <div
                      v-else-if="item.type === 'recent'"
                      class="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition"
                      @click="selectSuggestion(item)"
                    >
                      <i class="pi pi-history text-gray-500"></i>
                      <p class="text-gray-700 truncate text-sm">
                        {{ item.title }}
                      </p>
                    </div>

                    <div
                      v-else
                      class="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition"
                      @click="selectSuggestion(item)"
                    >
                      <img
                        v-if="item.image"
                        :src="item.image"
                        class="w-12 h-12 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                        alt="ad image"
                      />
                      <div
                        v-else
                        class="w-12 h-12 rounded-lg bg-gray-200"
                      ></div>

                      <div class="flex-1 min-w-0">
                        <p
                          class="font-medium text-gray-900 truncate leading-tight text-sm"
                        >
                          {{ item.title }}
                        </p>
                        <p
                          v-if="item.location"
                          class="text-xs text-gray-500 truncate"
                        >
                          {{ item.location }}
                        </p>
                      </div>

                      <div
                        v-if="item.price"
                        class="text-blue-600 font-semibold text-sm whitespace-nowrap"
                      >
                        {{ item.price }}
                      </div>
                    </div>
                  </template>
                </div>
              </transition>
            </template>
            <i
              class="pi pi-search absolute text-white text-sm cursor-pointer ltr:right-3 rtl:left-3 top-1/2 transform -translate-y-1/2"
              @click="handleSearch"
            ></i>
          </div>

          <div
            class="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6 text-white"
          >
            <div class="flex items-center cursor-pointer max-w-[160px]">
              <AppProfileIcon class="w-full h-full" />
            </div>

            <RouterLink
              v-if="isAuthenticated && isCustomer"
              :to="{ name: 'user-profile', query: { activeTab: 'messages' } }"
              class="relative ms-2 w-6 h-6 hover:text-yellow-300 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-full h-full cursor-pointer"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                />
              </svg>

              <span
                v-if="userChatCount > 0"
                class="absolute top-0 ltr:-right-1 rtl:-left-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center p-1 leading-none"
              >
                {{ userChatCount }}
              </span>
            </RouterLink>

            <RouterLink
              v-if="isAuthenticated && isCustomer"
              :to="{ name: 'customer-support' }"
              class="relative ms-2 w-6 h-6 hover:text-yellow-300 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 90 90"
                fill="currentColor"
                class="w-full h-full cursor-pointer"
              >
                <path
                  d="M 41.046 86.144 c -3.486 0 -6.322 -2.837 -6.322 -6.322 S 37.56 73.5 41.046 73.5 c 3.487 0 6.323 2.837 6.323 6.322 S 44.532 86.144 41.046 86.144 z"
                />

                <path
                  d="M 80.581 33.518 C 77.501 16.67 62.724 3.856 45 3.856 c -17.724 0 -32.501 12.814 -35.581 29.662 C 4.103 34.283 0 38.855 0 44.379 v 11.321 c 0 5.038 3.413 9.285 8.045 10.575 c 7.408 8.931 16.898 13.801 28.252 14.542 v -2.971 c -9.529 -0.678 -17.627 -4.505 -24.15 -11.424 h 1.018 c 2.926 0 5.307 -2.381 5.307 -5.307 V 38.699 c 0 -2.926 -2.381 -5.306 -5.307 -5.306 h -0.877 C 15.548 18.252 28.961 6.823 45 6.823 c 16.039 0 29.452 11.43 32.539 26.57 h -0.878 c -2.925 0 -5.306 2.38 -5.306 5.306 v 22.681 c 0 2.926 2.381 5.307 5.306 5.307 h 2.352 C 85.071 66.688 90 61.759 90 55.701 V 44.379 C 90 38.855 85.897 34.283 80.581 33.518 z"
                />
              </svg>

              <span
                v-if="supportChatCount > 0"
                class="absolute top-0 ltr:-right-1 rtl:-left-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center p-1 leading-none"
              >
                {{ supportChatCount }}
              </span>
            </RouterLink>

            <RouterLink
              to="/post-ad-categories"
              class="bg-yellow-300 text-black font-semibold px-4 py-2 rounded hover:bg-yellow-400 transition"
            >
              <i class="pi pi-plus text-sm me-2"></i>
              <span>{{ $t("ads.post_ad") }}</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import AppProfileIcon from "./AppProfileIcon.vue";
import requestService from "../services/api/requestService";
import { MEDIA_URL } from "../services/axios";
import { useFiltersStore } from "../store/filters";
import { useNotificationStore } from "../store/notifications";
import { useAuthStore } from "../store/auth"; // Need to check if user is logged in

const authStore = useAuthStore();
const notificationStore = useNotificationStore();

// Computed property to check if the user is authenticated (to show the icons)
const isAuthenticated = computed(() => !!authStore.user);
const isCustomer = computed(
  () =>
    !authStore?.user?.user_roles?.some((ur) =>
      ["MANAGER", "ADMIN"].includes(ur.roles?.code)
    )
);
// Get the counts directly from the store
const userChatCount = computed(() => notificationStore.userChatCount);
const supportChatCount = computed(() => notificationStore.supportChatCount);

const { locale } = useI18n();
const router = useRouter();
const dir = computed(() =>
  ["ar", "he"].includes(locale.value) ? "rtl" : "ltr"
);

const isMenuOpen = ref(false);
const isMobile = ref(false);
function updateSize() {
  isMobile.value = window.innerWidth < 768;
  isMenuOpen.value = !isMobile.value;
}

const filterStore = useFiltersStore();

// ==== Search Logic ====
const searchQuery = ref(""); // ONLY used for non-search pages
const recentSearches = ref([]);
const apiSuggestions = ref([]);
const mergedSuggestions = ref([]);
const showSuggestions = ref(false);
const searchContainer = ref(null);
let debounceTimer;

const isSearchPage = computed(
  () => router.currentRoute.value.name === "search"
);

const shouldShowDropdown = computed(() => {
  // Never show suggestions on the search page
  if (isSearchPage.value) return false;
  // Only show on other pages if focused AND there are items
  return showSuggestions.value && mergedSuggestions.value.length;
});

// Watch the route query on mount/update to pre-populate the non-search input if navigating back
watch(
  () => router.currentRoute.value.query.q,
  (newQ) => {
    if (!isSearchPage.value) {
      // When navigating FROM search page to another page, keep the query in the input
      searchQuery.value = newQ || "";
    }
  },
  { immediate: true }
);

function loadRecentSearches() {
  const stored = localStorage.getItem("recent_searches");
  recentSearches.value = stored ? JSON.parse(stored) : [];
}
function saveRecentSearches() {
  localStorage.setItem("recent_searches", JSON.stringify(recentSearches.value));
}

const handleNavigation = (routeName) => {
  router.push({ name: routeName });
};

function mergeSuggestions() {
  const items = [];
  if (recentSearches.value.length) {
    items.push({ type: "header", label: "Recent Searches" });
    items.push(
      ...recentSearches.value.map((title) => ({
        title,
        type: "recent",
      }))
    );
  }
  if (apiSuggestions.value.length) {
    items.push({ type: "header", label: "Results" });
    items.push(...apiSuggestions.value);
  }
  mergedSuggestions.value = items;
}

async function fetchSuggestions(query) {
  if (isSearchPage.value || !query) {
    apiSuggestions.value = [];
    mergeSuggestions();
    return;
  }
  try {
    const res = await requestService.getAll(`/ads`, {
      params: {
        includes: "attributes,images",
        search: encodeURIComponent(query),
        per_page: 5, // Limit the suggestions
      },
    });

    const data = res.data || [];

    apiSuggestions.value = data.map((ad) => {
      const title = locale.value === "ar" ? ad.title : ad.title_en;
      const price = ad.price ? `${ad.price} $` : "";
      const image = ad.ads_images?.length
        ? `${MEDIA_URL}/${ad.ads_images[0].image}`
        : "/no-image.png";
      const location =
        ad.ad_attributes?.find((attr) => attr.address)?.address ||
        ad.ad_attributes?.find((attr) => attr.text)?.text ||
        "";
      return { title, price, image, location, id: ad.id, type: "api" };
    });

    mergeSuggestions();
  } catch (err) {
    console.error("Suggestion fetch error:", err);
  }
}

// Handler for the NON-SEARCH page input (triggers suggestions)
function onInput() {
  const query = searchQuery.value.trim();
  clearTimeout(debounceTimer);

  // Debounce to fetch suggestions
  debounceTimer = setTimeout(() => {
    fetchSuggestions(query);
  }, 300);

  showSuggestions.value = true;
}

// Handler for the SEARCH page input (updates route directly)
function handleSearchPageInput(value) {
  const query = value.trim() || undefined; // Use undefined to remove 'q' param if empty

  // Update the query parameter in the current route
  router
    .replace({
      query: { ...router.currentRoute.value.query, q: query },
    })
    .catch(() => {}); // Catch navigation redundancy errors
}

function onFocus() {
  // Only show suggestions logic if NOT on the search page
  if (isSearchPage.value) return;

  if (recentSearches.value.length || apiSuggestions.value.length) {
    mergeSuggestions();
    showSuggestions.value = true;
  }
}

// Universal function for search button click or Enter press
function handleSearch() {
  const currentQuery = isSearchPage.value
    ? router.currentRoute.value.query.q
    : searchQuery.value.trim();
  showSuggestions.value = false; // Hide suggestions

  if (isSearchPage.value) {
    // On the search page, the input already updated the route. We just ensure the dropdown is closed.
    filterStore.handleSearchChange(currentQuery);
    return;
  }

  // If on a NON-search page:
  if (currentQuery) {
    // 1. Save to recents (from the non-search input)
    if (!recentSearches.value.includes(currentQuery)) {
      recentSearches.value.unshift(currentQuery);
      if (recentSearches.value.length > 5) recentSearches.value.pop();
      saveRecentSearches();
    }
    // 2. Navigate to the search page
    router.push({ name: "search", query: { q: currentQuery } });
  } else {
    // If empty, just go to the clean search page
    router.push({ name: "search" });
  }
}

function selectSuggestion(item) {
  showSuggestions.value = false; // Hide suggestions

  if (item.type === "recent") {
    // 1. Recent Search: Set input and navigate to search page with the query
    searchQuery.value = item.title;
    router.push({ name: "search", query: { q: item.title } });
  } else if (item.type === "api" && item.id) {
    // 2. API Result: Navigate to Ad Details page
    router.push({ name: "ad-details", params: { adId: item.id } });
  }
}

function handleClickOutside(e) {
  if (!searchContainer.value?.contains(e.target)) {
    showSuggestions.value = false;
  }
}

onMounted(() => {
  updateSize();
  loadRecentSearches();
  window.addEventListener("resize", updateSize);
  document.addEventListener("click", handleClickOutside);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", updateSize);
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
