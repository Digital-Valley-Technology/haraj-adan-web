<script setup>
import { onMounted, ref } from "vue";
import AppLayout from "../Layout/AppLayout.vue";
import { useRoute } from "vue-router";
import requestService from "../services/api/requestService";
import AdCardSpecial from "../components/AdCardSpecial.vue";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();
const route = useRoute();
const id = route.params.id;
const type = route.params.type;

const ads = ref([]);
const category = ref({});
const page = ref(1);
const limit = ref(12);
const total = ref(0);
const isLoading = ref(false);

const currentLocale = computed(() => locale.value);

const fetchPaginatedAds = async (pageNumber) => {
  try {
    page.value = pageNumber;
    isLoading.value = true;

    const url =
      type === "special"
        ? `categories/${id}/special-ads/?page=${page.value}&limit=${limit.value}`
        : `categories/${id}/ads/?page=${page.value}&limit=${limit.value}`;

    const res = await requestService.getAll(url);

    ads.value = res?.data?.ads;
    total.value = res?.meta?.total || 0;
    category.value = {
      name: res?.data?.name,
      name_en: res?.data?.name_en,
      image: res?.data?.image,
    };
  } finally {
    isLoading.value = false;
  }
};

const onPageChange = (event) => {
  fetchPaginatedAds(event.page + 1);
};

onMounted(() => {
  fetchPaginatedAds(1);
});
</script>

<template>
  <app-layout>
    <div class="page-wrapper mx-auto min-h-[500px]">
      <div
        class="flex flex-col md:flex-row min-h-screen gap-4 custom-container px-4 mb-4"
      >
        <!-- Main Content -->
        <div class="flex-1">
          <!-- Header -->
          <div class="flex justify-between items-center mb-4">
            <span class="font-semibold text-base">
              {{
                type === "special"
                  ? currentLocale == "ar"
                    ? `إعلانات مميزة في ${category?.name || ""}`
                    : `Special Ads in ${category?.name_en || ""}`
                  : currentLocale == "ar"
                  ? `جميع الإعلانات في ${category?.name || ""}`
                  : `All Ads in ${category?.name_en || ""}`
              }}
            </span>
          </div>

          <!-- Ads Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <!-- Skeleton -->
            <template v-if="loading">
              <div v-for="n in 8" :key="n" class="animate-pulse space-y-2">
                <div class="bg-gray-300 h-48 rounded-md"></div>
                <div class="bg-gray-300 h-3 w-3/4 rounded"></div>
              </div>
            </template>

            <!-- Loaded Ads -->
            <template v-else>
              <div v-for="ad in ads" :key="ad?.id">
                <ad-card-special :item="ad" />
              </div>
            </template>
          </div>

          <!-- Pagination -->
          <div class="flex justify-center mt-10" v-if="total > limit">
            <Paginator
              :rows="limit"
              :totalRecords="total"
              :first="page"
              @page="onPageChange"
            />
          </div>
        </div>
      </div>
    </div>
  </app-layout>
</template>

<style scoped></style>
