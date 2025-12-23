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
            {{ $t("postAdd.detailsTitle") }}
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

            <!-- Title English -->
            <div>
              <label class="block mb-1 text-sm font-medium">
                {{ $t("postAdd.titleLabelEn") }}
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

            <div>
              <label class="block mb-1 text-sm font-medium">
                {{ $t("postAdd.location") }}
              </label>
              <!-- Location -->
              <PickLocation v-model="location" :map-id="`ad-map-location`" />
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
                <!-- <div
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
                </div> -->

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
          </div>
          <!-- FEATURED AD SECTION -->
          <div
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
              class="border rounded-md overflow-hidden"
            >
              <img :src="file.preview" class="w-full h-24 object-cover" />
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
              {{ $t("postAdd.submit") }}
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

const authStore = useAuthStore();
const { locale, t } = useI18n();
const isArabic = computed(() => locale.value === "ar");
const currentUser = computed(() => authStore?.user);
const route = useRoute();
const categoryId = route.params.categoryId;

const step = ref(1);
const fileInput = ref(null);
const uploadedFiles = ref([]);
const dynamicAttributes = ref([]);
const currencies = ref([]);

const form = ref({
  title: "",
  title_en: "",
  price: "",
  descr: null,
});

// const wallet = ref(currentUser.value?.user_wallet[0] || { balance: 0 });
const wallet = computed(() => {
  return authStore.user?.user_wallet?.[0] ?? { balance: 0 };
});

const discounts = ref([]);
const is_featured = ref(false);
const selectedDiscount = ref(null);

const featuredAdPrice = ref(0); // from API: price per day
const featuredAdDays = ref(0); // from API: default number of days

// computed property for total days including discount
const computedFeaturedDays = computed(() => {
  if (!is_featured.value) return 0;

  let days = featuredAdDays.value;

  // add discount period if selected
  if (selectedDiscount.value) {
    const discount = discounts.value.find(
      (d) => d.id === selectedDiscount.value
    );
    if (discount) {
      days += discount.period; // assuming discount.period is in days
    }
  }

  return days;
});

// total price based on computedFeaturedDays
const totalFeaturedPrice = computed(() => {
  if (!is_featured.value || featuredAdPrice.value === 0) return 0;

  let days = computedFeaturedDays.value;
  let price = featuredAdPrice.value * days;

  // apply discount percentage if any
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
    console.error("Error loading attributes:", err);
  }
};

onMounted(() => {
  fetchCategoryAttributes();
  fetchCurrencies();
  fetchDiscounts();
  fetchFeaturedSettings();
});

const validateStepOne = () => {
  // Basic validation
  if (
    !form.value.title ||
    !form.value.title_en ||
    !form.value.price ||
    !form.value?.currency_id
  ) {
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

  // Featured ad balance check
  if (is_featured.value && wallet.balance < totalFeaturedPrice.value) {
    showWarning(t("postAdd.insufficientBalance"));
    return;
  }

  step.value = 2;
};

const triggerFileUpload = () => fileInput.value?.click();

const handleFiles = (e) => {
  const files = Array.from(e.target.files || []);
  uploadedFiles.value = files.map((f) => ({
    file: f,
    preview: URL.createObjectURL(f),
  }));
};

const submitAd = async () => {
  if (!uploadedFiles.value.length) {
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

  // Featured ad balance check before submitting
  if (is_featured.value && wallet.balance < totalFeaturedPrice.value) {
    showWarning(t("postAdd.insufficientBalance"));
    return;
  }

  try {
    const formData = new FormData();
    formData.append("user_id", currentUser?.value?.id);
    formData.append("title", form.value.title);
    formData.append("title_en", form.value.title_en);
    formData.append("currency_id", form.value.currency_id);
    formData.append("price", form.value.price);
    formData.append("descr", form.value.descr || null);
    formData.append("lat", location.value?.lat);
    formData.append("lng", location.value?.lng);
    formData.append("address", location.value?.address);

    if (is_featured.value) {
      formData.append(
        "featured",
        JSON.stringify({
          discount_id: selectedDiscount.value || null,
          status: true,
        })
      );
    }

    // Build attributes payload properly
    const attributesPayload = dynamicAttributes.value.flatMap((attr) => {
      const val = form.value[`attr_${attr.id}`];
      const type = attr.category_attributes_types?.code;

      // 🧩 Handle select, radio, checkbox
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

      // 📝 Handle text, textarea, number
      if (["text", "textarea", "number"].includes(type)) {
        if (!val) return [];
        return [
          {
            category_attribute_id: attr.id,
            text: String(val),
          },
        ];
      }

      return [];
    });

    formData.append("attributes", JSON.stringify(attributesPayload));
    formData.append("ad_categories", JSON.stringify([categoryId]));

    // Append images
    uploadedFiles.value.forEach((fileObj) => {
      formData.append("ads_images", fileObj.file);
    });

    const res = await requestService.create("/ads", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

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
