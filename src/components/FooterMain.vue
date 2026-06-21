<template>
  <footer
    class="bg-white text-gray-700 border-t border-gray-200 pt-10 pb-6 px-6 md:px-12"
  >
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
      <!-- Brand (logo only) -->
      <div class="space-y-4">
        <div class="flex items-center space-x-2">
          <RouterLink class="block p-2 rounded-sm" to="/">
            <img
              src="/logo.png"
              alt="haraj aden logo"
              class="w-[80px] object-contain"
            />
          </RouterLink>
          <span class="font-semibold text-lg text-black">
            {{ $t("footer.brand") }}
          </span>
        </div>
      </div>

      <!-- 1) Ads -->
      <div>
        <h4 class="text-black font-semibold mb-3">
          {{ $t("footer.ads.title") }}
        </h4>
        <ul class="space-y-2 text-sm text-gray-500">
          <li>
            <RouterLink to="/search" class="hover:text-blue-600">
              {{ $t("footer.ads.all") }}
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/post-ad-categories" class="hover:text-blue-600">
              {{ $t("footer.ads.post") }}
            </RouterLink>
          </li>
          <li>
            <RouterLink :to="carsLink" class="hover:text-blue-600">
              {{ $t("footer.ads.cars") }}
            </RouterLink>
          </li>
        </ul>
      </div>

      <!-- 2) Platform -->
      <div>
        <h4 class="text-black font-semibold mb-3">
          {{ $t("footer.platform.title") }}
        </h4>
        <ul class="space-y-2 text-sm text-gray-500">
          <li>
            <RouterLink to="/about" class="hover:text-blue-600">
              {{ $t("footer.platform.about") }}
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/policy" class="hover:text-blue-600">
              {{ $t("footer.platform.privacy") }}
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/terms" class="hover:text-blue-600">
              {{ $t("footer.platform.terms") }}
            </RouterLink>
          </li>
        </ul>
      </div>

      <!-- 3) Support -->
      <div>
        <h4 class="text-black font-semibold mb-3">
          {{ $t("footer.support.title") }}
        </h4>
        <ul class="space-y-3 text-sm text-gray-500">
          <li>
            <RouterLink
              to="/customer-support"
              class="flex items-center gap-2 hover:text-blue-600"
            >
              <i class="pi pi-comments text-blue-600"></i>
              <span>{{ $t("footer.support.contact") }}</span>
            </RouterLink>
          </li>
          <li>
            <a
              :href="`tel:${$t('footer.contacts.phone')}`"
              class="flex items-center gap-2 hover:text-blue-600"
            >
              <i class="pi pi-phone text-blue-600"></i>
              <span dir="ltr">{{ $t("footer.contacts.phone") }}</span>
            </a>
          </li>
          <li>
            <a
              :href="`mailto:${COMPANY_EAMIL}`"
              class="flex items-center gap-2 hover:text-blue-600"
            >
              <i class="pi pi-envelope text-blue-600"></i>
              <span dir="ltr">{{ COMPANY_EAMIL }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Copyright bottom bar -->
    <div
      class="border-t border-gray-200 mt-10 pt-4 text-sm max-w-7xl mx-auto px-4"
    >
      <p class="text-gray-500 text-center md:text-start">
        &copy; {{ currentYear }} {{ $t("footer.brand") }} —
        {{ $t("footer.copy") }}
      </p>
    </div>
  </footer>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useHomeStore } from "../store/home";
import { COMPANY_EAMIL } from "../utils/constants";

const homeStore = useHomeStore();
const currentYear = new Date().getFullYear();

// Categories are cached in the store; this is a no-op if already loaded.
onMounted(() => homeStore.fetchSideMenuCategories());

// Auto-detect the "Cars" category from the loaded menu (top-level or child),
// matching the Arabic or English name. Falls back to the search page.
const carsCategory = computed(() => {
  const categories = homeStore.sidMenuCategories || [];
  const isCars = (c) => {
    const ar = (c?.name ?? "").toString();
    const en = (c?.name_en ?? "").toString().toLowerCase();
    return ar.includes("سيارات") || ar.includes("سيارة") || en.includes("car");
  };
  for (const category of categories) {
    if (isCars(category)) return category;
    for (const child of category?.children ?? []) {
      if (isCars(child)) return child;
    }
  }
  return null;
});

const carsLink = computed(() =>
  carsCategory.value
    ? { name: "category-listing", params: { id: carsCategory.value.id } }
    : { name: "search" }
);
</script>
