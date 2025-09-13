<script setup>
import AppLayout from "../Layout/AppLayout.vue";
import AdCard from "../components/AdCard.vue";
import AdCardSpecial from "../components/AdCardSpecial.vue";
import SideMenuClient from "../components/SideMenuClient.vue";
import { specialAds, homeAds } from "../data";
import { useI18n } from "vue-i18n";

const i18 = useI18n();
</script>

<template>
  <app-layout>
    <div class="page-wrapper mx-auto min-h-[500px]">
      <div class="flex min-h-screen gap-4 custom-container px-4 mb-4">
        <!-- Sidebar -->
        <side-menu-client />
        <!-- Main content -->
        <div class="flex-1">
          <div class="flex justify-between items-center mb-4">
            <span class="font-semibold text-base">
              {{
                i18?.locale.value == "ar"
                  ? "إعلانات الصفحة الرئيسية"
                  : "Home Page Ads"
              }}
            </span>
            <a href="#" class="text-[#146AAB] text-xs font-medium">
              {{ i18?.locale.value === "ar" ? "رؤية الكل >" : "See All" }}
            </a>
          </div>
          <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
          >
            <div v-for="add in specialAds" :key="add?.id">
              <ad-card-special :item="add" />
            </div>
          </div>

          <div class="flex justify-between items-center mb-4 mt-12">
            <span class="font-semibold text-base">
              {{
                i18?.locale.value == "ar"
                  ? "قائمة التسوق من المالك القريب منك"
                  : "Shopping listing from the owner near you"
              }}
            </span>
            <a href="#" class="text-[#146AAB] text-xs font-medium">{{
              i18?.locale.value === "ar" ? "رؤية الكل >" : "See All"
            }}</a>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div v-for="add in homeAds" :key="add?.id">
              <ad-card :item="add" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </app-layout>
</template>

<style scoped></style>
