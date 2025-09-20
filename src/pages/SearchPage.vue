<template>
  <app-layout>
    <main class="page-wrapper custom-container min-h-screen my-4">
      <div class="flex gap-4 mx-8">
        <div class="w-80">
          <!-- categories -->
          <div class="flex gap-2 items-start bg-white p-4 rounded-lg">
            <i class="icon pi pi-home"></i>
            <div class="flex flex-col items-center gap-2">
              <p class="text-sm font-medium">
                {{ i18?.locale?.value == "ar" ? "المركبات" : "Vehicles" }}
              </p>
              <ul>
                <li>
                  <a href="#" class="text-xs text-[#146AAB] hover:underline">{{
                    i18?.locale?.value == "ar" ? "سيارات" : "Car"
                  }}</a>
                  <span class="text-[10px] ms-2 text-[#A1A1A1]">(401,915)</span>
                </li>
                <li>
                  <a href="#" class="text-xs text-[#146AAB] hover:underline">{{
                    i18?.locale?.value == "ar" ? "دراجات" : "Bikes"
                  }}</a>
                  <span class="text-[10px] ms-2 text-[#A1A1A1]">(150,200)</span>
                </li>
                <li>
                  <a href="#" class="text-xs text-[#146AAB] hover:underline">{{
                    i18?.locale?.value == "ar" ? "شاحنات" : "Trucks"
                  }}</a>
                  <span class="text-[10px] ms-2 text-[#A1A1A1]">(50,000)</span>
                </li>
                <li>
                  <a href="#" class="text-xs text-[#146AAB] hover:underline">{{
                    i18?.locale?.value == "ar" ? "حافلات" : "Buses"
                  }}</a>
                  <span class="text-[10px] ms-2 text-[#A1A1A1]">(20,000)</span>
                </li>
                <li>
                  <a href="#" class="text-xs text-[#146AAB] hover:underline">{{
                    i18?.locale?.value == "ar"
                      ? "مركبات أخرى"
                      : "Other Vehicles"
                  }}</a>
                  <span class="text-[10px] ms-2 text-[#A1A1A1]">(10,000)</span>
                </li>
              </ul>
            </div>
          </div>
          <!-- map view -->
          <div class="p-4">
            <div
              class="bg-white p-2 rounded-lg flex items-center justify-center cursor-pointer w-full"
            >
              <button
                @click="toggleView"
                :class="[
                  'flex gap-4 items-center justify-center hover:bg-[#146AAB] hover:text-white transition-colors py-2 px-4 rounded-lg cursor-pointer w-full',
                  showMap
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
                      showMap ? 'pi-list' : 'pi-map-marker',
                      showMap ? 'text-black' : 'text-black',
                    ]"
                  ></i>
                </span>

                <span class="text-sm font-medium">
                  {{
                    showMap
                      ? i18?.locale?.value == "ar"
                        ? "عرض القائمة"
                        : "List View"
                      : i18?.locale?.value == "ar"
                      ? "عرض الخريطة"
                      : "Map View"
                  }}
                </span>
              </button>
            </div>
          </div>
          <!-- Filter -->
          <div class="p-4 bg-white rounded-lg mb-2">
            <h3 class="text-sm font-medium mb-4">
              {{ i18?.locale?.value == "ar" ? "تصفية" : "Filter" }}
            </h3>
            <h6 class="text-xs font-medium mb-2">
              {{ i18?.locale?.value == "ar" ? "الفئة" : "Category" }}
            </h6>
            <select
              name="category"
              id="category"
              class="border rounded-md p-2 w-full border-[#cdced1] mb-4"
            >
              <option value="real-estate">
                {{ i18.locale.value === "ar" ? "عقارات" : "Real Estate" }}
              </option>
              <option value="cars">
                {{ i18.locale.value === "ar" ? "سيارات" : "Vehicles" }}
              </option>
              <option value="electronics">
                {{ i18.locale.value === "ar" ? "إلكترونيات" : "Electronics" }}
              </option>
              <option value="services">
                {{ i18.locale.value === "ar" ? "خدمات" : "Services" }}
              </option>
              <option value="other">
                {{ i18.locale.value === "ar" ? " أخرى" : "Other" }}
              </option>
            </select>
            <h6 class="text-xs font-medium mb-4">
              {{
                i18?.locale?.value == "ar" ? "بحث بالقرب مني" : "Search Near Me"
              }}
            </h6>
            <div class="flex justify-between items-center text-[9px] mb-4">
              <span>{{
                i18?.locale?.value == "ar" ? "0.1 كم" : "0.1 km"
              }}</span>
              <span>-</span>
              <span>{{
                i18?.locale?.value == "ar" ? "جميع المسافات" : "All Distances"
              }}</span>
            </div>
            <div class="card flex justify-center mb-4">
              <Slider v-model="value" range class="w-56" />
            </div>

            <h6 class="text-xs font-medium mb-2">
              {{ i18?.locale?.value == "ar" ? "السعر" : "Price" }}
            </h6>
            <div>
              <div class="flex items-center justify-between w-full mb-4">
                <input
                  type="text"
                  :placeholder="
                    i18?.locale?.value == 'ar' ? 'على الأقل' : 'At least'
                  "
                  class="py-2 px-2 border border-[#cdced1] text-xs rounded-md text-center w-30"
                />
                <span>-</span>
                <input
                  type="text"
                  :placeholder="
                    i18?.locale?.value == 'ar' ? 'على الأكثر' : 'At most'
                  "
                  class="py-2 px-2 border border-[#cdced1] text-xs rounded-md text-center w-30"
                />
              </div>
            </div>
            <select
              name="category"
              id="category"
              class="border rounded-md p-2 w-full border-[#cdced1] mb-4"
            >
              <option value="USD">
                {{ i18.locale.value === "ar" ? "دولار أمريكي" : "USD" }}
              </option>
              <option value="SAR">
                {{ i18.locale.value === "ar" ? "ريال سعودي" : "SAR" }}
              </option>
            </select>
            <h6 class="text-xs font-medium mb-4">
              {{ i18?.locale?.value == "ar" ? "عدد الملاك" : "No. of owners" }}
            </h6>
            <!-- Owner buttons -->
            <div class="flex flex-wrap gap-2 mb-4">
              <button
                v-for="btn in ownersButtons"
                :key="btn.id"
                @click="activeButton = btn.id"
                :class="[
                  'text-xs capitalize py-2 px-4 rounded-md cursor-pointer transition-colors',
                  activeButton === btn.id
                    ? 'bg-[#146AAB] text-white'
                    : 'bg-[#EDEFF2] text-black hover:bg-[#0f76c5] hover:text-white',
                ]"
              >
                {{ i18.locale.value === "ar" ? btn.labelAr : btn.labelEn }}
              </button>
            </div>
            <h6 class="text-xs font-medium mb-4">
              {{
                i18?.locale?.value == "ar"
                  ? "بواسطة الكيلومترات المقطوعة"
                  : "by km driven"
              }}
            </h6>
            <!-- Driven buttons -->
            <div class="flex flex-wrap gap-2 mb-4">
              <button
                v-for="btn in drivenButtons"
                :key="btn.id"
                @click="activeButton2 = btn.id"
                :class="[
                  'text-xs capitalize py-2 px-4 rounded-md cursor-pointer transition-colors',
                  activeButton2 === btn.id
                    ? 'bg-[#146AAB] text-white'
                    : 'bg-[#EDEFF2] text-black hover:bg-[#0f76c5] hover:text-white',
                ]"
              >
                {{ i18.locale.value === "ar" ? btn.labelAr : btn.labelEn }}
              </button>
            </div>
            <h6 class="text-xs font-medium mb-4">
              {{ i18?.locale?.value == "ar" ? "بالوقود" : "by fuel" }}
            </h6>
            <!-- Fuel buttons -->
            <div class="flex flex-wrap gap-2 mb-4">
              <button
                v-for="btn in fuelButtons"
                :key="btn.id"
                @click="activeButton3 = btn.id"
                :class="[
                  'text-xs capitalize py-2 px-4 rounded-md cursor-pointer transition-colors',
                  activeButton3 === btn.id
                    ? 'bg-[#146AAB] text-white'
                    : 'bg-[#EDEFF2] text-black hover:bg-[#0f76c5] hover:text-white',
                ]"
              >
                {{ i18.locale.value === "ar" ? btn.labelAr : btn.labelEn }}
              </button>
            </div>
            <h6 class="text-xs font-medium mb-4">
              {{ i18?.locale?.value == "ar" ? "الحالة" : "condition" }}
            </h6>
            <!-- condition buttons -->
            <div class="flex flex-wrap gap-2 mb-4">
              <button
                v-for="btn in conditionButton"
                :key="btn.id"
                @click="activeButton4 = btn.id"
                :class="[
                  'text-xs capitalize py-2 px-4 rounded-md cursor-pointer transition-colors',
                  activeButton4 === btn.id
                    ? 'bg-[#146AAB] text-white'
                    : 'bg-[#EDEFF2] text-black hover:bg-[#0f76c5] hover:text-white',
                ]"
              >
                {{ i18.locale.value === "ar" ? btn.labelAr : btn.labelEn }}
              </button>
            </div>
            <h6 class="text-xs font-medium mb-4">
              {{ i18?.locale?.value == "ar" ? "التاريخ" : "date" }}
            </h6>
            <!-- date buttons -->
            <div class="flex flex-wrap gap-2 mb-4">
              <button
                v-for="btn in dateButton"
                :key="btn.id"
                @click="activeButton5 = btn.id"
                :class="[
                  'text-xs capitalize py-2 px-4 rounded-md cursor-pointer transition-colors',
                  activeButton5 === btn.id
                    ? 'bg-[#146AAB] text-white'
                    : 'bg-[#EDEFF2] text-black hover:bg-[#0f76c5] hover:text-white',
                ]"
              >
                {{ i18.locale.value === "ar" ? btn.labelAr : btn.labelEn }}
              </button>
            </div>
            <h6 class="text-xs font-medium mb-4">
              {{ i18?.locale?.value == "ar" ? "الموقع" : "Location" }}
            </h6>
            <!-- Locations -->
            <div v-for="location in locations" class="flex flex-col gap-2 mb-4">
              <div class="flex justify-between">
                <p class="text-xs">
                  {{
                    i18?.locale?.value == "ar"
                      ? location.labelAr
                      : location.labelEn
                  }}
                </p>
                <button
                  @click="location.checked = !location.checked"
                  class="cursor-pointer"
                >
                  <i
                    :class="[
                      'pi',
                      location.checked ? 'pi-check-square' : 'pi-stop',
                    ]"
                  ></i>
                </button>
              </div>
            </div>
            <h6 class="text-xs font-medium mb-4">
              {{ i18?.locale?.value == "ar" ? "آخرى" : "Others" }}
            </h6>
            <!-- others -->
            <div v-for="other in others" class="flex flex-col gap-2 mb-4">
              <div class="flex justify-between">
                <p class="text-xs">
                  {{
                    i18?.locale?.value == "ar" ? other.labelAr : other.labelEn
                  }}
                </p>
                <button
                  @click="other.checked = !other.checked"
                  class="cursor-pointer"
                >
                  <i
                    :class="[
                      'pi',
                      other.checked ? 'pi-check-square' : 'pi-stop',
                    ]"
                  ></i>
                </button>
              </div>
            </div>
          </div>
          <!-- Filter Buttons -->
          <div class="bg-white rounded-lg mb-4 p-4">
            <div class="flex gap-2 items-center">
              <button
                class="flex-1 text-sm bg-[#EDEFF2] py-2 px-4 rounded-md text-center cursor-pointer hover:bg-[#c0c3c6]"
              >
                {{ i18.locale.value == "ar" ? "مسح التصفية" : "Clear Filter" }}
              </button>
              <button
                class="flex-1 text-sm bg-[#FFE800] py-2 px-4 rounded-md text-center cursor-pointer hover:bg-[#f5e427]"
              >
                {{ i18.locale.value == "ar" ? "تطبيق الفلتر" : "Apply Filter" }}
              </button>
            </div>
          </div>
        </div>
        <!-- Main Content -->
        <div class="flex-1">
          <!-- Results and Sort by -->
          <div
            class="bg-white p-4 rounded-lg shadow flex justify-between items-center mb-4"
          >
            <span class="text-sm font-semibold">{{
              i18.locale.value == "ar"
                ? "426 نتيجة متاحة"
                : "426 result available"
            }}</span>
            <div class="flex gap-2 items-center">
              <div class="text-xs text-gray-500 flex items-center">
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
              </div>
              <select
                name="category"
                id="category"
                class="border rounded-md p-1 w-full border-[#cdced1]"
              >
                <option value="sort by">
                  {{ i18.locale.value === "ar" ? "ترتيب حسب" : "Sort By" }}
                </option>
              </select>
            </div>
          </div>
          <!-- Map Section -->
          <div v-if="showMap" class="p-4 mb-4">
            <iframe
              class="w-full h-[150vh] rounded-lg"
              src="https://www.google.com/maps/embed?pb=..."
              allowfullscreen=""
              loading="lazy"
            ></iframe>
          </div>
          <!-- Ads -->
          <div v-else>
            <!-- titles -->
            <div
              class="flex divide-x bg-[#146AAB] text-white rounded-lg divide-white border border-white mb-4"
            >
              <div class="px-15 py-2"></div>
              <div class="px-4 py-2 flex-1 text-center text-xs">
                {{ i18.locale.value === "ar" ? "عنوان الإعلان" : "Ad Title" }}
              </div>
              <div class="flex-1 px-4 py-2 text-center text-xs">
                {{ i18.locale.value === "ar" ? "السعر" : "Price" }}
              </div>
              <div class="flex-1 px-4 py-2 text-center text-xs">
                {{
                  i18.locale.value === "ar"
                    ? "تاريخ الإعلان"
                    : "Announcement Date"
                }}
              </div>
              <div class="px-4 py-2 text-center text-xs">
                {{
                  i18.locale.value === "ar"
                    ? "المحافظة / المنطقة"
                    : "Province / District"
                }}
              </div>
            </div>
            <!-- Listing cars -->
            <div v-if="activeButtonList === 'list'">
              <div
                v-for="car in cars"
                :key="car.id"
                :class="[
                  'flex justify-between items-center bg-[#FFFEF0] rounded-lg cursor-pointer hover:bg-[#FFFACD] mb-4',
                  car.featured ? 'bg-[#FFFACD] ' : ' bg-white ',
                ]"
              >
                <!-- Left side: image + title -->
                <div class="px-4 py-2 flex items-center gap-2">
                  <img
                    :src="car.image"
                    class="w-20 h-16 object-cover rounded"
                  />
                  <div class="px-4 py-2 flex gap-2 flex-col">
                    <span
                      v-if="car.featured"
                      class="bg-yellow-300 text-[9px] px-2 py-1 rounded w-fit"
                    >
                      Featured
                    </span>
                    <p class="w-40 text-xs">
                      {{
                        i18.locale.value == "ar" ? car.title_ar : car.title_en
                      }}
                    </p>
                  </div>
                </div>

                <!-- Price -->
                <div class="px-4 py-2 text-blue-600 font-bold text-xs">
                  {{
                    i18.locale.value == "ar"
                      ? car.price + " $"
                      : "$ " + car.price
                  }}
                </div>

                <!-- Date -->
                <div class="px-4 py-2 text-xs">
                  {{ i18.locale.value == "ar" ? car.date_ar : car.date }}
                </div>

                <!-- City -->
                <div class="px-4 py-2">
                  {{ i18.locale.value == "ar" ? car.city_ar : car.city }}
                </div>
              </div>
            </div>
            <!-- Tables Cars -->
            <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div
                v-for="car in cars"
                :key="car.id"
                :class="[
                  ' bg-[#FFFEF0] rounded-lg cursor-pointer hover:bg-[#FFFACD] mb-4',
                  car.featured ? 'bg-[#FFFACD] ' : ' bg-white ',
                ]"
              >
                <div
                  class="flex gap-4 items-start p-4 rounded-lg cursor-pointer mb-4"
                >
                  <div>
                    <img
                      :src="car.image"
                      class="w-20 h-16 object-cover rounded"
                    />
                  </div>
                  <div class="flex flex-col gap-1 items-start">
                    <span
                      v-if="car.featured"
                      class="bg-yellow-300 text-[9px] px-2 py-1 rounded w-fit"
                      >{{
                        i18.locale.value == "ar" ? "مميز" : "Featured"
                      }}</span
                    >
                    <p class="text-[9px] text-[#A1A1A1]">{{ car.number }}</p>
                    <p class="text-sm w-48 uppercase">
                      {{
                        i18.locale.value == "ar" ? car.title_ar : car.title_en
                      }}
                    </p>
                    <p class="text-xs text-[#146AAB]">
                      {{
                        i18.locale.value == "ar"
                          ? "$" + car.price
                          : "$ " + car.price
                      }}
                    </p>
                    <p class="text-xs text-[#A1A1A1]">
                      {{
                        i18.locale.value == "ar"
                          ? "المدينة / المنطقة:"
                          : "City / District:"
                      }}
                      <span class="text-[#146AAB] text-xs capitalize">{{
                        i18.locale.value == "ar" ? car.city_ar : car.city
                      }}</span>
                    </p>
                    <p class="text-xs text-[#A1A1A1]">
                      {{
                        i18.locale.value == "ar"
                          ? "عدد الغرف:"
                          : "Number of Rooms:"
                      }}
                      <span class="text-[#146AAB] text-xs capitalize">{{
                        i18.locale.value == "ar" ? car.rooms : car.rooms
                      }}</span>
                    </p>
                    <p class="text-xs text-[#A1A1A1]">
                      {{
                        i18.locale.value == "ar"
                          ? "تاريخ الإعلان:"
                          : "Announcement Date:"
                      }}
                      <span class="text-[#146AAB] text-xs capitalize">{{
                        i18.locale.value == "ar" ? car.date_ar : car.date
                      }}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Pagination -->
      <div class="bg-white p-2 rounded-lg">
        <Paginator
          :rows="10"
          :totalRecords="120"
          :rowsPerPageOptions="[5, 10, 15]"
        >
        </Paginator>
      </div>
    </main>
  </app-layout>
</template>

<script setup>
import AppLayout from "../Layout/AppLayout.vue";
import { useI18n } from "vue-i18n";
import { ref } from "vue";
import { cars } from "../data";

import Slider from "primevue/slider";

const i18 = useI18n();
const activeButton = ref("first");
const activeButton2 = ref(1);
const activeButton3 = ref(1);
const activeButton4 = ref(1);
const activeButton5 = ref(1);
const activeButtonList = ref("list");
const showMap = ref(false);
const value = ref([0, 80]);

const toggleView = () => {
  showMap.value = !showMap.value;
};

const ownersButtons = [
  { id: "first", labelEn: "First", labelAr: "الأول" },
  { id: "second", labelEn: "Second", labelAr: "الثاني" },
  { id: "third", labelEn: "Third", labelAr: "الثالث" },
  { id: "fourth", labelEn: "Fourth", labelAr: "الرابع" },
  { id: "moreThanFour", labelEn: "More than Four", labelAr: "أكثر من أربعة" },
];

const drivenButtons = [
  { id: 1, labelEn: "Below 25000 km", labelAr: "أقل من 25000 كم" },
  { id: 2, labelEn: "25000 km - 50000 km", labelAr: "25000 كم - 50000 كم" },
  { id: 3, labelEn: "50000 km - 75000 km", labelAr: "50000 كم - 75000 كم" },
  { id: 4, labelEn: "more than 75000 km", labelAr: "أكثر من 75000 كم" },
];

const fuelButtons = [
  { id: 1, labelEn: "Petrol", labelAr: "بنزين" },
  { id: 2, labelEn: "Diesel", labelAr: "ديزل" },
  { id: 3, labelEn: "Electric", labelAr: "كهربائي" },
];

const conditionButton = [
  { id: 1, labelEn: "New", labelAr: "جديد" },
  { id: 2, labelEn: "Used", labelAr: "مستعمل" },
];

const dateButton = [
  { id: 1, labelEn: "All", labelAr: "الكل" },
  { id: 2, labelEn: "Last 24 Hours", labelAr: "آخر 24 ساعة" },
  { id: 3, labelEn: "Last 3 Days", labelAr: "آخر 3 أيام" },
  { id: 4, labelEn: "Last 7 Days", labelAr: "آخر 7 أيام" },
  { id: 5, labelEn: "Last 30 Days", labelAr: "آخر 30 يوم" },
];

const locations = ref([
  { id: 1, labelEn: "All Cities", labelAr: "جميع المدن", checked: false },
  { id: 2, labelEn: "Bali", labelAr: "بالي", checked: false },
  { id: 3, labelEn: "Banten", labelAr: "بانتن", checked: false },
  { id: 4, labelEn: "Bengkulu", labelAr: "بنكولو", checked: false },
]);

const others = ref([
  {
    id: 1,
    labelEn: "Ads with Video",
    labelAr: "إعلانات مع فيديو",
    checked: false,
  },
  {
    id: 2,
    labelEn: "Ads with 360 degrees Photo",
    labelAr: "إعلانات مع صورة بزاوية 360",
    checked: false,
  },
  {
    id: 3,
    labelEn: "Ads with Map",
    labelAr: "إعلانات مع خريطة",
    checked: false,
  },
]);
</script>
