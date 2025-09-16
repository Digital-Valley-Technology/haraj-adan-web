<template>
  <app-layout>
    <div class="page-wrapper mx-auto min-h-[500px] custom-container px-4 mb-4">
      <!-- side menu -->
      <div class="flex gap-4">
        <div><side-menu-client></side-menu-client></div>
        <!-- main content -->
        <div class="flex-1">
          <div
            class="h-[150px] md:h-[200px] lg:h-[300px] shadow-lg rounded-xl overflow-hidden mb-8 bg-gray-300"
          >
            <img
              src="/images/building.jpg"
              alt="Cart image"
              class="w-full h-full object-cover object-center brightness-75"
            />
          </div>
          <!-- houses -->
          <div v-if="showHouses">
            <div class="mb-4">
              <span class="font-semibold text-base">{{
                i18.locale.value == "ar" ? "إعلانات خاصة" : "Special Ads"
              }}</span>
            </div>
            <div
              class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4"
            >
              <div v-for="add in pagedSpecialAds" :key="add?.id">
                <ad-card-special :item="add" />
              </div>
            </div>
            <Paginator
              :first="specialFirst"
              :rows="rows"
              :totalRecords="specialAds.length"
              @page="onSpecialPageChange"
              class="mb-4"
            >
            </Paginator>
            <!-- All Ads Title -->
            <div class="mb-4">
              <span class="font-semibold text-base">{{
                i18.locale.value == "ar" ? "جميع الإعلانات" : "All Ads"
              }}</span>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
              <div v-for="add in pagedHomeAds" :key="add?.id">
                <ad-card :item="add" />
              </div>
            </div>
            <Paginator
              :first="homeFirst"
              :rows="rows"
              :totalRecords="homeAds.length"
              @page="onHomePageChange"
              class="mb-4"
            >
            </Paginator>
          </div>

          <!-- Appartments -->
          <div v-if="showApartments">
            <div class="mb-4">
              <span class="font-semibold text-base">{{
                i18.locale.value == "ar" ? "إعلانات خاصة" : "Special Ads"
              }}</span>
            </div>
            <div
              class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4"
            >
              <div v-for="add in pagedSpecialAds" :key="add?.id">
                <ad-card-special :item="add" />
              </div>
            </div>
            <Paginator
              :first="specialFirst"
              :rows="rows"
              :totalRecords="specialAds.length"
              @page="onSpecialPageChange"
              class="mb-4"
            >
            </Paginator>
            <!-- All Ads Title -->
            <div class="mb-4">
              <span class="font-semibold text-base">{{
                i18.locale.value == "ar" ? "جميع الإعلانات" : "All Ads"
              }}</span>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
              <div v-for="add in pagedHomeAds" :key="add?.id">
                <ad-card :item="add" />
              </div>
            </div>
            <Paginator
              :first="homeFirst"
              :rows="rows"
              :totalRecords="homeAds.length"
              @page="onHomePageChange"
              class="mb-4"
            >
            </Paginator>
          </div>
        </div>
      </div>
    </div>
  </app-layout>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { ref, computed } from "vue";
import AppLayout from "../Layout/AppLayout.vue";
import SideMenuClient from "../components/SideMenuClient.vue";
import AdCard from "../components/AdCard.vue";
import AdCardSpecial from "../components/AdCardSpecial.vue";
import { homeAds, specialAds } from "../data";

const i18 = useI18n();

const route = useRoute();

const rows = 8;
const specialFirst = ref(0);
const homeFirst = ref(0);

const pagedSpecialAds = computed(() => {
  return specialAds.slice(specialFirst.value, specialFirst.value + rows);
});

const pagedHomeAds = computed(() => {
  return homeAds.slice(homeFirst.value, homeFirst.value + rows);
});

const onSpecialPageChange = (event) => {
  specialFirst.value = event.first;
};

const onHomePageChange = (event) => {
  homeFirst.value = event.first;
};

const showHouses = computed(() => route.params.id == ("بيوت" || "Houses"));
const showApartments = computed(
  () => route.params.id == ("شقق" || "Apartments")
);
</script>

<style></style>
