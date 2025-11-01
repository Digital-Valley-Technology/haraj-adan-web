<template>
  <!-- Sidebar -->
  <div class="category-side">
    <!-- Small Screen -->
    <div class="md:hidden category-card">
      <div>
        <button
          @click="toggleCategory(category.id)"
          class="flex justify-between items-center w-full cursor-pointer hover:bg-[#F5F6F7] p-2 rounded-md"
        >
          <div class="flex items-center gap-4">
            <span
              class="bg-[#F5F6F7] flex items-center justify-center w-6 h-6 p-4 rounded-full"
              ><i class="pi pi-car text-black"></i
            ></span>
            <h4 class="uppercase text-sm">
              {{
                i18.locale.value === "ar" ? category?.name : category?.name_en
              }}
            </h4>
          </div>
          <i :class="['pi', activeTab ? 'pi-angle-down' : 'pi-angle-left']"></i>
        </button>
        <ul v-if="activeTab == category.id">
          <li
            v-for="item in category?.children"
            :key="item?.id"
            @click="goToCategoryListingPage"
          >
            <router-link
              :to="{
                name: 'category-listing',
                params: {
                  id: i18?.locale?.value === 'ar' ? item?.name : item?.name_en,
                },
              }"
              class="text-[#146AAB] text-xs font-normal hover:underline"
              active-class="underline font-bold text-lg"
              >{{
                i18?.locale?.value == "ar" ? item?.name : item?.name_en
              }}</router-link
            >
          </li>
        </ul>
        <!-- <hr class="my-4 text-gray-200" /> -->
      </div>
    </div>
    <!-- Medium And Large Screen -->
    <div class="hidden md:flex items-start gap-3">
      <div
        class="flex items-center justify-center bg-gray-200 w-8 h-8 rounded-full"
      >
        <!-- <i class="icon pi pi-home"></i> -->
        <img :src="`${MEDIA_URL}${category?.image}`" loading="lazy" alt="" />
      </div>
      <!-- links -->
      <div class="flex flex-col gap-2 items-start">
        <p class="mt-1 text-sm font-medium">
          {{ i18?.locale?.value == "ar" ? category?.name : category?.name_en }}
        </p>
        <ul>
          <li
            v-for="item in category?.children"
            :key="item?.id"
            @click="goToCategoryListingPage"
          >
            <router-link
              :to="{
                name: 'category-listing',
                params: {
                  id: i18?.locale?.value === 'ar' ? item?.name : item?.name_en,
                },
              }"
              class="text-[#146AAB] text-xs font-normal hover:underline"
              active-class="underline font-bold text-lg"
              >{{
                i18?.locale?.value == "ar" ? item?.name : item?.name_en
              }}</router-link
            >
          </li>
        </ul>
      </div>
    </div>

    <hr class="my-4 border-gray-300" />
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { ref } from "vue";
import { MEDIA_URL } from "../services/axios";
defineProps(["category"]);

const activeTab = ref(null);
const i18 = useI18n();

function toggleCategory(id) {
  activeTab.value = activeTab.value === id ? null : id;
}
</script>
<style scoped>
.category-side:last-child hr {
  display: none;
}
</style>
