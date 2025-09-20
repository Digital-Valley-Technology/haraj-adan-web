<template>
  <app-layout>
    <!-- <Breadcrumb :home="home" :model="breadcrumbItems" /> -->
    <div class="custom-container page-wrapper mx-auto min-h-[500px] mb-4">
      <!-- Categories List -->
      <div
        v-if="!activeCategory"
        class="bg-white p-4 rounded-lg shadow-lg category-card"
      >
        <div v-for="ad in postAdCategories" :key="ad.id">
          <button
            @click="activeTab = ad.id"
            class="flex justify-between items-center w-full cursor-pointer hover:bg-[#F5F6F7] p-2 rounded-md"
          >
            <div class="flex items-center gap-4">
              <span
                class="bg-[#F5F6F7] flex items-center justify-center w-6 h-6 p-4 rounded-full"
                ><i class="pi pi-car text-black"></i
              ></span>
              <h4 class="uppercase text-sm">
                {{ i18.locale.value === "ar" ? ad?.name : ad?.name_en }}
              </h4>
            </div>
            <i class="pi pi-angle-left"></i>
          </button>
          <hr class="my-4 text-gray-200" />
        </div>
      </div>

      <div v-else>
        <!-- Animals Details -->
        <div v-if="activeTab == 1">
          <div v-if="!detailsAnimals" class="flex flex-col md:flex-row gap-4">
            <!-- Animals Categories -->
            <div class="w-full md:w-64 bg-white p-4 rounded-lg h-fit">
              <div
                v-for="category in categories"
                class="flex gap-4 items-center mb-2"
              >
                <span
                  class="bg-[#146AAB] text-center p-1 text-white text-xs w-6 h-6 rounded-full"
                  >{{ category.id }}</span
                >
                <p class="text-xs font-bold">
                  {{
                    i18.locale.value == "ar"
                      ? category.label_ar
                      : category.label_en
                  }}
                </p>
              </div>
            </div>
            <!-- upload content -->
            <div class="flex-1 bg-white p-6 rounded-lg shadow-md">
              <label class="block mb-2 font-medium">{{
                i18.locale.value === "ar" ? "تحميل الصور" : "Upload Photos"
              }}</label>

              <!-- Upload Box -->
              <div
                class="border-2 border-dashed border-[#146AAB] rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer mb-50"
              >
                <i class="pi pi-upload text-[#146AAB] text-3xl mb-2"></i>
                <p class="text-sm text-gray-600">
                  {{
                    i18.locale.value === "ar"
                      ? "اختر الملف الذي تريد تحميله"
                      : "Choose File To Upload"
                  }}
                </p>
                <input
                  type="file"
                  ref="fileInput"
                  class="hidden"
                  multiple
                  accept="image/*"
                  @change="handleFiles"
                />
              </div>

              <!-- Navigation Buttons -->
              <div class="flex gap-4 mt-6">
                <button
                  class="flex-1 bg-[#EDEFF2] text-gray-500 py-2 px-6 rounded-md cursor-pointer hover:bg-[#e2e3e4]"
                >
                  {{ i18.locale.value === "ar" ? "السابق" : "Previous" }}
                </button>
                <button
                  @click="detailsAnimals = true"
                  class="flex-1 bg-[#FFE800] text-black font-medium py-2 px-6 rounded-md cursor-pointer hover:bg-[#f2de04]"
                >
                  {{ i18.locale.value === "ar" ? "التالي" : "Next" }}
                </button>
              </div>
            </div>
          </div>

          <!-- Successfully Post Ad -->
          <div
            v-else
            class="flex flex-col gap-1 items-center justify-center bg-white p-4 rounded-lg h-[50vh]"
          >
            <div class="w-30 h-30">
              <img src="/images/success.png" alt="" />
            </div>
            <p>{{ i18.locale.value === "ar" ? "شكرًا لك" : "Thank you" }}</p>
            <p class="text-xs">
              {{
                i18.locale.value === "ar"
                  ? "إعلانك قيد المراجعة"
                  : "Your ad under review"
              }}
            </p>
            <a
              href="#"
              class="bg-[#FFE800] text-black font-medium py-2 px-6 rounded-md cursor-pointer hover:bg-[#f2de04]"
            >
              {{ i18.locale.value === "ar" ? "الصفحة الرئيسية" : "Home " }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </app-layout>
</template>

<script setup>
import AppLayout from "../Layout/AppLayout.vue";
import { useI18n } from "vue-i18n";
import { postAdCategories } from "../data";
import { ref, computed } from "vue";

import Breadcrumb from "primevue/breadcrumb";

const i18 = useI18n();
const activeTab = ref(null);
const detailsAnimals = ref(false);
const home = ref({
  icon: "pi pi-home",
});

const breadcrumbItems = computed(() => {
  const list = [
    {
      label: "Post Ad",
      command: () => {
        (activeTab.value = null), (detailsAnimals.value = false);
      },
    },
  ];

  if (activeTab.value) {
    const cat = postAdCategories.find((c) => c.id === activeTab.value);
    if (cat) {
      list.push({
        label: i18.locale.value === "ar" ? cat.name : cat.name_en,
        command: () => {
          detailsAnimals.value = false;
        },
      });
    }
  }

  return list;
});

const activeCategory = computed(() =>
  postAdCategories.find((c) => c.id === activeTab.value)
);

const categories = [
  { id: 1, label_ar: "تفاصيل", label_en: "Details" },
  { id: 2, label_ar: "سمات", label_en: "Features" },
  { id: 3, label_ar: "صور", label_en: "Photos" },
];

function showDetails() {
  detailsAnimals.value = true;
}

function hideDetails() {
  detailsAnimals.value = false;
}
</script>

<style scoped>
.category-card :last-child hr {
  display: none;
}
</style>
