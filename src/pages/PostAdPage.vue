<template>
  <app-layout>
    <div
      class="custom-container page-wrapper mx-auto min-h-[500px] mb-4 flex flex-col md:flex-row gap-4"
      :class="{ 'text-right': isArabic, 'text-left': !isArabic }"
      :dir="isArabic ? 'rtl' : 'ltr'"
    >
      <!-- SIDEBAR -->
      <aside
        class="w-full md:w-64 bg-white p-4 rounded-lg shadow-md h-fit"
        :class="{ 'ml-auto': isArabic }"
      >
        <div class="flex flex-col gap-3">
          <div
            v-for="item in steps"
            :key="item.id"
            class="flex justify-between items-center border rounded-md p-2 text-sm"
            :class="{
              'bg-[#146AAB] text-white': step === item.id,
              'bg-gray-50 text-gray-600': step !== item.id,
              'flex-row-reverse': isArabic,
            }"
          >
            <span>{{ $t(item.labelKey) }}</span>
            <span
              class="bg-white text-[#146AAB] font-bold rounded-full w-5 h-5 flex items-center justify-center"
            >
              {{ item.id }}
            </span>
          </div>
        </div>
      </aside>

      <!-- MAIN CONTENT -->
      <main
        class="flex-1 bg-white p-6 rounded-lg shadow-md"
        :class="{ 'text-right': isArabic, 'text-left': !isArabic }"
      >
        <!-- Step 1 -->
        <div v-if="step === 1">
          <h3 class="text-lg font-semibold mb-4">
            {{ isEditMode ? $t("postAdd.editAd") : $t("postAdd.detailsTitle") }}
          </h3>

          <div class="flex flex-col gap-4">
            <!-- Title -->
            <div>
              <label class="block mb-1 text-sm font-medium">
                {{ $t("postAdd.titleLabel") }}
              </label>
              <input
                v-model="form.title"
                type="text"
                class="w-full border border-gray-300 rounded-md p-2 text-sm"
              />
            </div>

            <!-- Title English (Optional) -->
            <div>
              <label class="block mb-1 text-sm font-medium">
                {{ $t("postAdd.titleLabelEn") }}
                <span class="text-gray-500 text-xs">{{ $t("postAdd.optional") }}</span>
              </label>
              <input
                v-model="form.title_en"
                type="text"
                class="w-full border border-gray-300 rounded-md p-2 text-sm"
              />
            </div>

            <!-- Price -->
            <div>
              <label class="block mb-1 text-sm font-medium">
                {{ $t("postAdd.priceLabel") }}
              </label>
              <input
                v-model="form.price"
                type="number"
                class="w-full border border-gray-300 rounded-md p-2 text-sm"
              />
            </div>

            <div class="mb-3">
              <label class="block mb-1 text-sm font-medium">
                {{ $t("postAdd.currencyLabel") }}
              </label>

              <!-- Radio -->
              <div class="flex flex-wrap gap-2">
                <label
                  v-for="currency in currencies"
                  :key="currency.id"
                  class="cursor-pointer border rounded-md px-4 py-2 text-sm flex items-center justify-center"
                  :class="[
                    form.currency_id === currency.id
                      ? 'bg-[#146AAB] text-white border-[#146AAB]'
                      : 'bg-white text-gray-600 border-gray-300',
                  ]"
                >
                  <input
                    type="radio"
                    :value="currency.id"
                    v-model="form.currency_id"
                    class="hidden"
                  />
                  {{ isArabic ? currency.name : currency.name_en }}
                </label>
              </div>
            </div>

            <!-- Payment System -->
            <div class="mb-3">
              <label class="block mb-1 text-sm font-medium">
                {{ $t("postAdd.paymentSystem") }}
              </label>
              <div class="flex flex-wrap gap-2">
                <label
                  v-for="option in paymentOptions"
                  :key="option.value"
                  class="cursor-pointer border rounded-md px-4 py-2 text-sm flex items-center justify-center"
                  :class="[
                    paySystem === option.value
                      ? 'bg-[#146AAB] text-white border-[#146AAB]'
                      : 'bg-white text-gray-600 border-gray-300',
                  ]"
                >
                  <input
                    type="radio"
                    :value="option.value"
                    v-model="paySystem"
                    class="hidden"
                  />
                  {{ isArabic ? option.labelAr : option.labelEn }}
                </label>
              </div>

              <!-- Installment Years (shown when parts/installment selected) -->
              <div v-if="paySystem === 'parts'" class="mt-3">
                <label class="block mb-1 text-sm font-medium">
                  {{ $t("postAdd.installmentYears") }}
                </label>
                <input
                  v-model.number="installmentYears"
                  type="number"
                  min="1"
                  max="30"
                  class="w-full border border-gray-300 rounded-md p-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium">
                {{ $t("postAdd.location") }}
              </label>
              <!-- Location with auto GPS detection -->
              <PickLocation
                v-model="location"
                :map-id="`ad-map-location`"
                :auto-detect-g-p-s="!isEditMode"
              />
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium">
                {{ $t("postAdd.descr") }}
              </label>
              <!-- Textarea -->
              <textarea
                v-model="form.descr"
                class="w-full border border-gray-300 rounded-md p-2 text-sm"
              ></textarea>
            </div>

            <!-- Dynamic Attributes -->
            <div v-if="dynamicAttributes.length">
              <div
                v-for="attr in dynamicAttributes"
                :key="attr.id"
                class="mb-3"
              >
                <label class="block mb-1 text-sm font-medium">
                  {{ isArabic ? attr.name : attr.name_en }}
                  <span v-if="attr.is_required" class="text-red-500">*</span>
                </label>

                <!-- Select -->
                <select
                  v-if="attr.category_attributes_types?.code === 'select'"
                  v-model="form[`attr_${attr.id}`]"
                  class="w-full border border-gray-300 rounded-md p-2 text-sm"
                >
                  <option
                    v-for="val in attr.category_attributes_values"
                    :key="val.id"
                    :value="val.id"
                  >
                    {{ isArabic ? val.name : val.name_en }}
                  </option>
                </select>

                <!-- Text -->
                <input
                  v-else-if="attr.category_attributes_types?.code === 'text'"
                  v-model="form[`attr_${attr.id}`]"
                  type="text"
                  class="w-full border border-gray-300 rounded-md p-2 text-sm"
                />

                <!-- Textarea -->
                <textarea
                  v-else-if="
                    attr.category_attributes_types?.code === 'textarea'
                  "
                  v-model="form[`attr_${attr.id}`]"
                  class="w-full border border-gray-300 rounded-md p-2 text-sm"
                ></textarea>

                <!-- Number -->
                <input
                  v-else-if="attr.category_attributes_types?.code === 'number'"
                  v-model.number="form[`attr_${attr.id}`]"
                  type="number"
                  class="w-full border border-gray-300 rounded-md p-2 text-sm"
                />

                <!-- Radio -->
                <div
                  v-else-if="attr.category_attributes_types?.code === 'radio'"
                  class="flex flex-wrap gap-2"
                >
                  <label
                    v-for="val in attr.category_attributes_values"
                    :key="val.id"
                    class="cursor-pointer border rounded-md px-4 py-2 text-sm flex items-center justify-center"
                    :class="[
                      form[`attr_${attr.id}`] === val.id
                        ? 'bg-[#146AAB] text-white border-[#146AAB]'
                        : 'bg-white text-gray-600 border-gray-300',
                    ]"
                  >
                    <input
                      type="radio"
                      :value="val.id"
                      v-model="form[`attr_${attr.id}`]"
                      class="hidden"
                    />
                    {{ isArabic ? val.name : val.name_en }}
                  </label>
                </div>

                <!-- Checkbox -->
                <div
                  v-else-if="
                    attr.category_attributes_types?.code === 'checkbox'
                  "
                  class="flex flex-wrap gap-2"
                >
                  <label
                    v-for="val in attr.category_attributes_values"
                    :key="val.id"
                    class="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      :value="val.id"
                      v-model="form[`attr_${attr.id}`]"
                    />
                    {{ isArabic ? val.name : val.name_en }}
                  </label>
                </div>
              </div>
            </div>

            <!-- Real Estate Specs Section -->
            <div v-if="isRealEstateCategory" class="border-t pt-4 mt-4">
              <h4 class="text-md font-semibold mb-4">
                {{ $t("postAdd.realEstateSpecs") }}
              </h4>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Rooms -->
                <div>
                  <label class="block mb-1 text-sm font-medium">
                    {{ $t("postAdd.rooms") }}
                  </label>
                  <input
                    v-model.number="realEstateSpecs.rooms"
                    type="number"
                    min="0"
                    class="w-full border border-gray-300 rounded-md p-2 text-sm"
                  />
                </div>

                <!-- Bathrooms -->
                <div>
                  <label class="block mb-1 text-sm font-medium">
                    {{ $t("postAdd.bathrooms") }}
                  </label>
                  <input
                    v-model.number="realEstateSpecs.bathrooms"
                    type="number"
                    min="0"
                    class="w-full border border-gray-300 rounded-md p-2 text-sm"
                  />
                </div>

                <!-- Floors -->
                <div>
                  <label class="block mb-1 text-sm font-medium">
                    {{ $t("postAdd.floors") }}
                  </label>
                  <input
                    v-model.number="realEstateSpecs.floors"
                    type="number"
                    min="0"
                    class="w-full border border-gray-300 rounded-md p-2 text-sm"
                  />
                </div>

                <!-- Area -->
                <div>
                  <label class="block mb-1 text-sm font-medium">
                    {{ $t("postAdd.area") }}
                  </label>
                  <input
                    v-model.number="realEstateSpecs.area"
                    type="number"
                    min="0"
                    class="w-full border border-gray-300 rounded-md p-2 text-sm"
                  />
                </div>

                <!-- Furnishing -->
                <div>
                  <label class="block mb-1 text-sm font-medium">
                    {{ $t("postAdd.furnishing") }}
                  </label>
                  <select
                    v-model="realEstateSpecs.furnishing"
                    class="w-full border border-gray-300 rounded-md p-2 text-sm"
                  >
                    <option value="">{{ $t("postAdd.selectOption") }}</option>
                    <option value="furnished">{{ $t("postAdd.furnished") }}</option>
                    <option value="unfurnished">{{ $t("postAdd.unfurnished") }}</option>
                    <option value="semi-furnished">{{ $t("postAdd.semiFurnished") }}</option>
                  </select>
                </div>

                <!-- Finishing -->
                <div>
                  <label class="block mb-1 text-sm font-medium">
                    {{ $t("postAdd.finishing") }}
                  </label>
                  <select
                    v-model="realEstateSpecs.finishing"
                    class="w-full border border-gray-300 rounded-md p-2 text-sm"
                  >
                    <option value="">{{ $t("postAdd.selectOption") }}</option>
                    <option value="finished">{{ $t("postAdd.finished") }}</option>
                    <option value="semi-finished">{{ $t("postAdd.semiFinished") }}</option>
                    <option value="unfinished">{{ $t("postAdd.unfinished") }}</option>
                  </select>
                </div>
              </div>

              <!-- Building Age -->
              <div class="mt-4">
                <label class="block mb-1 text-sm font-medium">
                  {{ $t("postAdd.buildingAge") }}
                </label>
                <div class="flex flex-wrap gap-2">
                  <label
                    v-for="option in buildingAgeOptions"
                    :key="option.value"
                    class="cursor-pointer border rounded-md px-4 py-2 text-sm flex items-center justify-center"
                    :class="[
                      realEstateSpecs.buildingAge === option.value
                        ? 'bg-[#146AAB] text-white border-[#146AAB]'
                        : 'bg-white text-gray-600 border-gray-300',
                    ]"
                  >
                    <input
                      type="radio"
                      :value="option.value"
                      v-model="realEstateSpecs.buildingAge"
                      class="hidden"
                    />
                    {{ isArabic ? option.labelAr : option.labelEn }}
                  </label>
                </div>
              </div>

              <!-- Nearby Places -->
              <div class="mt-4">
                <label class="block mb-1 text-sm font-medium">
                  {{ $t("postAdd.nearbyPlaces") }}
                </label>
                <div class="flex flex-wrap gap-3">
                  <label
                    v-for="place in nearbyPlacesOptions"
                    :key="place.value"
                    class="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      :value="place.value"
                      v-model="realEstateSpecs.nearbyPlaces"
                      class="rounded"
                    />
                    {{ isArabic ? place.labelAr : place.labelEn }}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- FEATURED AD SECTION (only for create mode) -->
          <div
            v-if="!isEditMode"
            class="mt-6 p-6 bg-white rounded-2xl shadow-md border border-gray-200"
          >
            <!-- Header / Toggle -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="is_featured"
                    :disabled="wallet.balance <= 0"
                    class="sr-only peer"
                  />
                  <div
                    class="w-11 h-6 rounded-full transition-colors"
                    :class="{
                      'bg-gray-300 peer-checked:bg-blue-600':
                        wallet.balance > 0,
                      'bg-red-200': wallet.balance <= 0,
                    }"
                  ></div>
                  <div
                    class="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md peer-checked:translate-x-full transition-transform"
                  ></div>
                </label>
                <span class="font-semibold text-gray-800 text-base">
                  {{ $t("postAdd.makeFeatured") }}
                </span>
              </div>
              <span class="text-sm text-gray-500">{{
                t("postAdd.optional")
              }}</span>
            </div>

            <!-- Wallet Balance -->
            <div
              class="mb-4 p-4 bg-blue-50 rounded-lg flex justify-between items-center"
            >
              <span class="text-sm text-blue-700 font-medium">{{
                $t("wallet.balance")
              }}</span>
              <span class="text-lg font-bold text-blue-900">{{
                wallet?.balance ?? 0
              }}</span>
            </div>

            <!-- Insufficient Balance Warning -->
            <p
              v-if="is_featured && wallet.balance < totalFeaturedPrice"
              class="text-red-500 text-sm mb-3"
            >
              {{ $t("postAdd.insufficientBalance") }}
              <router-link to="/profile" class="underline">{{
                $t("postAdd.depositNow")
              }}</router-link>
            </p>

            <!-- Discount Selector & Featured Price Summary -->
            <transition name="fade">
              <div v-if="is_featured" class="mt-3">
                <!-- Discount Selector -->
                <label class="block mb-2 text-sm font-medium text-gray-700">
                  {{ $t("postAdd.selectDiscount") }}
                </label>
                <div class="relative mb-4">
                  <select
                    v-model="selectedDiscount"
                    class="w-full p-3 border border-gray-300 rounded-lg bg-white text-sm appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option :value="null" class="text-gray-500">
                      {{ $t("postAdd.noDiscount") }}
                    </option>
                    <option
                      v-for="d in discounts"
                      :key="d.id"
                      :value="d.id"
                      :disabled="
                        featuredAdPrice *
                          (featuredAdDays + d.period) *
                          (1 - d.percentage / 100) >
                        wallet.balance
                      "
                    >
                      {{ d.percentage }}% - {{ d.period }}
                      {{ $t("postAdd.days") }}
                    </option>
                  </select>
                  <div
                    class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>

                <!-- Featured Price Summary -->
                <div
                  class="p-4 rounded-lg flex flex-col gap-2"
                  :class="
                    wallet.balance < totalFeaturedPrice
                      ? 'bg-red-50'
                      : 'bg-green-50'
                  "
                >
                  <div class="flex justify-between items-center">
                    <span class="text-sm font-medium text-green-700"
                      >{{ $t("postAdd.featuredDays") }}:</span
                    >
                    <span class="text-lg font-bold text-green-900">{{
                      computedFeaturedDays
                    }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm font-medium text-green-700"
                      >{{ $t("postAdd.totalFeaturedPrice") }}:</span
                    >
                    <span class="text-lg font-bold text-green-900">{{
                      totalFeaturedPrice
                    }}</span>
                  </div>
                </div>
              </div>
            </transition>
          </div>

          <div
            class="flex mt-6"
            :class="{ 'justify-start': isArabic, 'justify-end': !isArabic }"
          >
            <button
              @click="validateStepOne"
              class="bg-[#FFE800] text-black font-medium py-2 px-6 rounded-md hover:bg-[#f2de04]"
            >
              {{ $t("postAdd.next") }}
            </button>
          </div>
        </div>

        <!-- Step 2 -->
        <div v-if="step === 2">
          <h3 class="text-lg font-semibold mb-4">
            {{ $t("postAdd.uploadTitle") }}
          </h3>

          <!-- Existing Images (Edit Mode) -->
          <div v-if="isEditMode && existingImages.length" class="mb-6">
            <label class="block mb-2 text-sm font-medium">
              {{ $t("postAdd.existingImages") }}
            </label>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div
                v-for="img in existingImages"
                :key="img.id"
                class="relative border rounded-md overflow-hidden"
                :class="{ 'opacity-50': removedImageIds.includes(img.id) }"
              >
                <img
                  :src="imageUrl(img.image)"
                  class="w-full h-24 object-cover"
                />
                <button
                  @click="toggleRemoveImage(img.id)"
                  type="button"
                  class="absolute top-1 right-1 bg-white rounded-full p-1 border shadow-sm"
                  :class="removedImageIds.includes(img.id) ? 'text-green-600' : 'text-red-600'"
                >
                  <i
                    class="pi"
                    :class="removedImageIds.includes(img.id) ? 'pi-undo' : 'pi-trash'"
                  ></i>
                </button>
                <div
                  v-if="removedImageIds.includes(img.id)"
                  class="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-xs text-center py-1"
                >
                  {{ $t("postAdd.markedForRemoval") }}
                </div>
              </div>
            </div>
          </div>

          <!-- Upload New Images -->
          <div
            class="border-2 border-dashed border-[#146AAB] rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer"
            @click="triggerFileUpload"
          >
            <i class="pi pi-upload text-[#146AAB] text-3xl mb-2"></i>
            <p class="text-sm text-gray-600">{{ $t("postAdd.chooseFile") }}</p>
            <input
              type="file"
              ref="fileInput"
              class="hidden"
              multiple
              accept="image/*"
              @change="handleFiles"
            />
          </div>

          <div
            v-if="uploadedFiles.length"
            class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            <div
              v-for="(file, index) in uploadedFiles"
              :key="index"
              class="relative border rounded-md overflow-hidden"
            >
              <img :src="file.preview" class="w-full h-24 object-cover" />
              <button
                @click="removeUploadedFile(index)"
                type="button"
                class="absolute top-1 right-1 bg-white rounded-full p-1 text-red-600 border shadow-sm"
              >
                <i class="pi pi-times"></i>
              </button>
            </div>
          </div>

          <div class="flex mt-6" :class="{ 'flex-row-reverse': isArabic }">
            <button
              @click="step = 1"
              class="bg-[#EDEFF2] text-gray-600 py-2 px-6 rounded-md mr-2"
            >
              {{ $t("postAdd.previous") }}
            </button>
            <button
              @click="submitAd"
              class="bg-[#FFE800] text-black font-medium py-2 px-6 rounded-md"
            >
              {{ isEditMode ? $t("postAdd.update") : $t("postAdd.submit") }}
            </button>
          </div>
        </div>

        <!-- Step 3 -->
        <div
          v-if="step === 3"
          class="flex flex-col items-center justify-center h-[50vh]"
        >
          <img src="/images/success.png" alt="success" class="w-24 mb-4" />
          <p class="text-lg font-semibold">{{ $t("postAdd.thankYou") }}</p>
          <p class="text-sm text-gray-600 mb-4">
            {{ $t("postAdd.underReview") }}
          </p>
          <router-link
            to="/"
            class="bg-[#FFE800] text-black font-medium py-2 px-6 rounded-md"
          >
            {{ $t("postAdd.home") }}
          </router-link>
        </div>
      </main>
    </div>
  </app-layout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import requestService from "../services/api/requestService";
import AppLayout from "../Layout/AppLayout.vue";
import PickLocation from "../components/PickLocation.vue";
import { showError, showWarning, showSuccess } from "../utils/notifications";
import { useAuthStore } from "../store/auth";
import { MEDIA_URL } from "../services/axios";

const authStore = useAuthStore();
const { locale, t } = useI18n();
const isArabic = computed(() => locale.value === "ar");
const currentUser = computed(() => authStore?.user);
const route = useRoute();
const categoryId = route.params.categoryId;

// Edit mode support
const adId = route.params.adId ? Number(route.params.adId) : null;
const isEditMode = computed(() => !!adId);

const step = ref(1);
const fileInput = ref(null);
const uploadedFiles = ref([]);
const dynamicAttributes = ref([]);
const currencies = ref([]);
const categoryData = ref(null);

// Existing images for edit mode
const existingImages = ref([]);
const removedImageIds = ref([]);

// Helper to build image URL
const imageUrl = (filename) => `${MEDIA_URL}/${filename}`;

const form = ref({
  title: "",
  title_en: "",
  price: "",
  descr: null,
});

// Payment System
const paySystem = ref('cash');
const installmentYears = ref(null);

const paymentOptions = [
  { value: 'cash', labelEn: 'Cash', labelAr: 'نقدي' },
  { value: 'parts', labelEn: 'Installment', labelAr: 'تقسيط' }
];

// Real Estate Specs
const realEstateSpecs = ref({
  rooms: null,
  bathrooms: null,
  floors: null,
  area: null,
  furnishing: '',
  finishing: '',
  buildingAge: '',
  nearbyPlaces: []
});

const buildingAgeOptions = [
  { value: 'under-5', labelEn: 'Under 5 years', labelAr: 'أقل من 5 سنوات' },
  { value: '5-15', labelEn: '5-15 years', labelAr: '5-15 سنة' },
  { value: 'over-15', labelEn: 'Over 15 years', labelAr: 'أكثر من 15 سنة' }
];

const nearbyPlacesOptions = [
  { value: 'airport', labelEn: 'Airport', labelAr: 'مطار' },
  { value: 'beach', labelEn: 'Beach', labelAr: 'شاطئ' },
  { value: 'downtown', labelEn: 'Downtown', labelAr: 'وسط المدينة' },
  { value: 'hospital', labelEn: 'Hospital', labelAr: 'مستشفى' },
  { value: 'school', labelEn: 'School', labelAr: 'مدرسة' },
  { value: 'mall', labelEn: 'Mall', labelAr: 'مول' },
  { value: 'mosque', labelEn: 'Mosque', labelAr: 'مسجد' },
  { value: 'park', labelEn: 'Park', labelAr: 'حديقة' }
];

// Detect if category is real estate
const isRealEstateCategory = computed(() => {
  const keywords = ['real estate', 'عقارات', 'houses', 'apartments', 'villas', 'lands', 'شقق', 'فلل', 'أراضي', 'بيوت', 'منازل'];
  const name = categoryData.value?.name?.toLowerCase() || '';
  const nameEn = categoryData.value?.name_en?.toLowerCase() || '';
  const parentName = categoryData.value?.parent?.name?.toLowerCase() || '';
  const parentNameEn = categoryData.value?.parent?.name_en?.toLowerCase() || '';
  return keywords.some(k =>
    name.includes(k) ||
    nameEn.includes(k) ||
    parentName.includes(k) ||
    parentNameEn.includes(k)
  );
});

const wallet = computed(() => {
  return authStore.user?.user_wallet?.[0] ?? { balance: 0 };
});

const discounts = ref([]);
const is_featured = ref(false);
const selectedDiscount = ref(null);

const featuredAdPrice = ref(0);
const featuredAdDays = ref(0);

const computedFeaturedDays = computed(() => {
  if (!is_featured.value) return 0;

  let days = featuredAdDays.value;

  if (selectedDiscount.value) {
    const discount = discounts.value.find(
      (d) => d.id === selectedDiscount.value
    );
    if (discount) {
      days += discount.period;
    }
  }

  return days;
});

const totalFeaturedPrice = computed(() => {
  if (!is_featured.value || featuredAdPrice.value === 0) return 0;

  let days = computedFeaturedDays.value;
  let price = featuredAdPrice.value * days;

  if (selectedDiscount.value) {
    const discount = discounts.value.find(
      (d) => d.id === selectedDiscount.value
    );
    if (discount) {
      price = price - (price * discount.percentage) / 100;
    }
  }

  return price;
});

const location = ref({
  lat: null,
  lng: null,
  address: "",
});

const steps = [
  { id: 1, labelKey: "steps.details" },
  { id: 2, labelKey: "steps.images" },
];

const fetchDiscounts = async () => {
  try {
    const res = await requestService.getAll(`/ads/discounts`);
    discounts.value = res.data;
  } catch (error) {
    console.log(error);
  }
};

const fetchFeaturedSettings = async () => {
  try {
    const res = await requestService.getAll("/ads/featured-settings");
    featuredAdPrice.value = res.data.featured_ad_price;
    featuredAdDays.value = res.data.featured_ad_days_count;
  } catch (err) {
    console.error("Error fetching featured settings:", err);
  }
};

const fetchCategoryAttributes = async () => {
  try {
    const res = await requestService.getAll(
      `/categories/${categoryId}/attributes`
    );
    categoryData.value = res.data;
    dynamicAttributes.value =
      res.data?.category_attributes?.sort(
        (a, b) => a.attribute_order - b.attribute_order
      ) || [];

    // Initialize form keys based on attribute types
    dynamicAttributes.value.forEach((attr) => {
      if (attr.category_attributes_types?.code === "checkbox") {
        form.value[`attr_${attr.id}`] = [];
      } else {
        form.value[`attr_${attr.id}`] = null;
      }
    });
  } catch (err) {
    console.error("Error loading attributes:", err);
  }
};

const fetchCurrencies = async () => {
  try {
    const res = await requestService.getAll(`/currencies`);
    currencies.value = res.data;
  } catch (err) {
    console.error("Error loading currencies:", err);
  }
};

// Load ad for edit mode
const loadAdForEdit = async () => {
  if (!adId) return;

  try {
    const res = await requestService.getAll(`/ads/${adId}?includes=images,attributes`);
    const ad = res.data;
    if (!ad) return;

    // Populate basic fields
    form.value.title = ad.title || '';
    form.value.title_en = ad.title_en || '';
    form.value.price = ad.price || '';
    form.value.descr = ad.descr || '';
    form.value.currency_id = ad.currency_id;

    // Populate location
    location.value.lat = ad.lat;
    location.value.lng = ad.lng;
    location.value.address = ad.address || '';

    // Populate existing images
    existingImages.value = ad.ads_images || [];

    // Populate payment system if available
    if (ad.pay_system) {
      paySystem.value = ad.pay_system;
    }
    if (ad.installment_years) {
      installmentYears.value = ad.installment_years;
    }

    // Populate dynamic attributes
    const adAttributes = ad.ad_attributes || [];
    adAttributes.forEach((attr) => {
      const attrId = attr.category_attribute_id;
      const attrDef = dynamicAttributes.value.find(a => a.id === attrId);
      if (!attrDef) return;

      const type = attrDef.category_attributes_types?.code;

      if (type === 'checkbox') {
        const values = (attr.ad_attribute_options || []).map(opt => opt.category_attribute_value_id);
        form.value[`attr_${attrId}`] = values;
      } else if (['select', 'radio'].includes(type)) {
        const firstOption = attr.ad_attribute_options?.[0];
        form.value[`attr_${attrId}`] = firstOption?.category_attribute_value_id || null;
      } else {
        form.value[`attr_${attrId}`] = attr.text || attr.text_en || null;
      }
    });

    // Populate real estate specs if available
    if (ad.real_estate_specs) {
      realEstateSpecs.value = {
        rooms: ad.real_estate_specs.rooms || null,
        bathrooms: ad.real_estate_specs.bathrooms || null,
        floors: ad.real_estate_specs.floors || null,
        area: ad.real_estate_specs.area || null,
        furnishing: ad.real_estate_specs.furnishing || '',
        finishing: ad.real_estate_specs.finishing || '',
        buildingAge: ad.real_estate_specs.building_age || '',
        nearbyPlaces: ad.real_estate_specs.nearby_places || []
      };
    }
  } catch (err) {
    console.error("Error loading ad for edit:", err);
    showError(t("postAdd.errorMessage"));
  }
};

onMounted(async () => {
  await fetchCategoryAttributes();
  fetchCurrencies();
  fetchDiscounts();
  fetchFeaturedSettings();

  // Load ad data if in edit mode
  if (isEditMode.value) {
    await loadAdForEdit();
  }
});

const validateStepOne = () => {
  // Basic validation - title_en is now optional
  if (
    !form.value.title ||
    !form.value.price ||
    !form.value?.currency_id
  ) {
    showWarning(t("validation.all_fields_required"));
    return;
  }

  // Validate installment years if installment is selected
  if (paySystem.value === 'parts' && (!installmentYears.value || installmentYears.value < 1)) {
    showWarning(t("validation.all_fields_required"));
    return;
  }

  // Dynamic fields
  for (const attr of dynamicAttributes.value) {
    if (attr.is_required && !form.value[`attr_${attr.id}`]) {
      showWarning(
        `${isArabic.value ? attr.name : attr.name_en} ${t(
          "validation.all_fields_required"
        )}`
      );
      return;
    }
  }

  // Featured ad balance check (only for create mode)
  if (!isEditMode.value && is_featured.value && wallet.balance < totalFeaturedPrice.value) {
    showWarning(t("postAdd.insufficientBalance"));
    return;
  }

  step.value = 2;
};

const triggerFileUpload = () => fileInput.value?.click();

const handleFiles = (e) => {
  const files = Array.from(e.target.files || []);
  const newFiles = files.map((f) => ({
    file: f,
    preview: URL.createObjectURL(f),
  }));
  uploadedFiles.value = [...uploadedFiles.value, ...newFiles];
};

const removeUploadedFile = (index) => {
  uploadedFiles.value.splice(index, 1);
};

const toggleRemoveImage = (id) => {
  const idx = removedImageIds.value.indexOf(id);
  if (idx === -1) {
    removedImageIds.value.push(id);
  } else {
    removedImageIds.value.splice(idx, 1);
  }
};

// Map real estate specs to category attributes
const mapRealEstateSpecsToAttributes = () => {
  const mappings = [];
  const specs = realEstateSpecs.value;

  // Find matching attributes by name
  const findAttrByName = (keywords) => {
    return dynamicAttributes.value.find(attr => {
      const name = (attr.name || '').toLowerCase();
      const nameEn = (attr.name_en || '').toLowerCase();
      return keywords.some(k => name.includes(k) || nameEn.includes(k));
    });
  };

  // Map rooms
  if (specs.rooms) {
    const attr = findAttrByName(['rooms', 'غرف']);
    if (attr) {
      mappings.push({ category_attribute_id: attr.id, text: String(specs.rooms) });
    }
  }

  // Map bathrooms
  if (specs.bathrooms) {
    const attr = findAttrByName(['bathroom', 'حمام']);
    if (attr) {
      mappings.push({ category_attribute_id: attr.id, text: String(specs.bathrooms) });
    }
  }

  // Map floors
  if (specs.floors) {
    const attr = findAttrByName(['floor', 'طابق', 'طوابق']);
    if (attr) {
      mappings.push({ category_attribute_id: attr.id, text: String(specs.floors) });
    }
  }

  // Map area
  if (specs.area) {
    const attr = findAttrByName(['area', 'مساحة']);
    if (attr) {
      mappings.push({ category_attribute_id: attr.id, text: String(specs.area) });
    }
  }

  // Map furnishing
  if (specs.furnishing) {
    const attr = findAttrByName(['furnish', 'تأثيث', 'مفروش']);
    if (attr) {
      mappings.push({ category_attribute_id: attr.id, text: specs.furnishing });
    }
  }

  // Map finishing
  if (specs.finishing) {
    const attr = findAttrByName(['finish', 'تشطيب']);
    if (attr) {
      mappings.push({ category_attribute_id: attr.id, text: specs.finishing });
    }
  }

  // Map building age
  if (specs.buildingAge) {
    const attr = findAttrByName(['age', 'عمر']);
    if (attr) {
      mappings.push({ category_attribute_id: attr.id, text: specs.buildingAge });
    }
  }

  // Map nearby places
  if (specs.nearbyPlaces && specs.nearbyPlaces.length) {
    const attr = findAttrByName(['nearby', 'قريب', 'أماكن']);
    if (attr) {
      mappings.push({ category_attribute_id: attr.id, text: specs.nearbyPlaces.join(',') });
    }
  }

  return mappings;
};

const submitAd = async () => {
  // For create mode, require at least one image
  // For edit mode, allow if there are existing images not all removed
  const hasNewImages = uploadedFiles.value.length > 0;
  const hasRemainingExistingImages = existingImages.value.length > removedImageIds.value.length;

  if (!isEditMode.value && !hasNewImages) {
    showError(t("validation.uploadImages"));
    return;
  }

  if (isEditMode.value && !hasNewImages && !hasRemainingExistingImages) {
    showError(t("validation.uploadImages"));
    return;
  }

  if (
    !location.value?.lat ||
    !location.value?.lng ||
    !location.value?.address
  ) {
    showError(t("validation.location_required"));
    return;
  }

  // Featured ad balance check before submitting (only for create mode)
  if (!isEditMode.value && is_featured.value && wallet.balance < totalFeaturedPrice.value) {
    showWarning(t("postAdd.insufficientBalance"));
    return;
  }

  try {
    const formData = new FormData();
    formData.append("user_id", currentUser?.value?.id);
    formData.append("title", form.value.title);
    formData.append("title_en", form.value.title_en || '');
    formData.append("currency_id", form.value.currency_id);
    formData.append("price", form.value.price);
    formData.append("descr", form.value.descr || '');
    formData.append("lat", location.value?.lat);
    formData.append("lng", location.value?.lng);
    formData.append("address", location.value?.address);

    // Add payment system
    formData.append("pay_system", paySystem.value);
    if (paySystem.value === 'parts' && installmentYears.value) {
      formData.append("installment_years", installmentYears.value);
    }

    // Add featured data (only for create mode)
    if (!isEditMode.value && is_featured.value) {
      formData.append(
        "featured",
        JSON.stringify({
          discount_id: selectedDiscount.value || null,
          status: true,
        })
      );
    }

    // Build attributes payload
    const attributesPayload = dynamicAttributes.value.flatMap((attr) => {
      const val = form.value[`attr_${attr.id}`];
      const type = attr.category_attributes_types?.code;

      if (["radio", "select", "checkbox"].includes(type)) {
        if (!val) return [];
        if (Array.isArray(val)) {
          return val.map((v) => ({
            category_attribute_id: attr.id,
            category_attribute_value_id: Number(v),
          }));
        }
        return [
          {
            category_attribute_id: attr.id,
            category_attribute_value_id: Number(val),
          },
        ];
      }

      if (["text", "textarea", "number"].includes(type)) {
        if (!val && val !== 0) return [];
        return [
          {
            category_attribute_id: attr.id,
            text: String(val),
          },
        ];
      }

      return [];
    });

    // Add real estate specs mapped to attributes
    if (isRealEstateCategory.value) {
      const realEstateAttrs = mapRealEstateSpecsToAttributes();
      // Merge without duplicates
      realEstateAttrs.forEach(newAttr => {
        const existingIdx = attributesPayload.findIndex(
          a => a.category_attribute_id === newAttr.category_attribute_id
        );
        if (existingIdx === -1) {
          attributesPayload.push(newAttr);
        }
      });

      // Also add real estate specs as a separate JSON field for backend storage
      formData.append("real_estate_specs", JSON.stringify({
        rooms: realEstateSpecs.value.rooms,
        bathrooms: realEstateSpecs.value.bathrooms,
        floors: realEstateSpecs.value.floors,
        area: realEstateSpecs.value.area,
        furnishing: realEstateSpecs.value.furnishing,
        finishing: realEstateSpecs.value.finishing,
        building_age: realEstateSpecs.value.buildingAge,
        nearby_places: realEstateSpecs.value.nearbyPlaces
      }));
    }

    formData.append("attributes", JSON.stringify(attributesPayload));
    formData.append("ad_categories", JSON.stringify([categoryId]));

    // Append new images
    uploadedFiles.value.forEach((fileObj) => {
      formData.append("ads_images", fileObj.file);
    });

    // Add removed image IDs for edit mode
    if (isEditMode.value && removedImageIds.value.length) {
      formData.append("remove_image_ids", JSON.stringify(removedImageIds.value));
    }

    let res;
    if (isEditMode.value) {
      // Use PATCH for edit
      res = await requestService.patch(`/ads/${adId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      // Use POST for create
      res = await requestService.create("/ads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    showSuccess(res?.message || t("postAdd.successMessage"));
    step.value = 3;
  } catch (err) {
    console.error("Ad submission failed:", err);
    showError(err || t("postAdd.errorMessage"));
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
