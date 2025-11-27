<template>
  <app-layout>
    <div
      class="custom-container page-wrapper mx-auto min-h-[500px] mb-4 flex flex-col md:flex-row gap-4"
      :class="{ 'text-right': isArabic, 'text-left': !isArabic }"
      :dir="isArabic ? 'rtl' : 'ltr'"
    >
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
              >{{ item.id }}</span
            >
          </div>
        </div>
      </aside>

      <main
        class="flex-1 bg-white p-6 rounded-lg shadow-md"
        :class="{ 'text-right': isArabic, 'text-left': !isArabic }"
      >
        <!-- Step 1: details -->
        <div v-if="step === 1">
          <h3 class="text-lg font-semibold mb-4">
            {{ $t("postAdd.detailsTitle") }}
          </h3>
          <div class="flex flex-col gap-4">
            <div>
              <label class="block mb-1 text-sm font-medium">{{
                $t("postAdd.titleLabel")
              }}</label>
              <input
                v-model="form.title"
                type="text"
                class="w-full border border-gray-300 rounded-md p-2 text-sm"
              />
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium">{{
                $t("postAdd.titleLabelEn")
              }}</label>
              <input
                v-model="form.title_en"
                type="text"
                class="w-full border border-gray-300 rounded-md p-2 text-sm"
              />
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium">{{
                $t("postAdd.priceLabel")
              }}</label>
              <input
                v-model="form.price"
                type="number"
                class="w-full border border-gray-300 rounded-md p-2 text-sm"
              />
            </div>

            <div class="mb-3">
              <label class="block mb-1 text-sm font-medium">{{
                $t("postAdd.currencyLabel")
              }}</label>
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
              <label class="block mb-1 text-sm font-medium">{{
                $t("postAdd.location")
              }}</label>
              <EditPickLocation
                v-model="location"
                :map-id="`ad-map-location`"
              />
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium">{{
                $t("postAdd.descr")
              }}</label>
              <textarea
                v-model="form.descr"
                class="w-full border border-gray-300 rounded-md p-2 text-sm"
              ></textarea>
            </div>

            <!-- Dynamic attributes: show attributes for category; each attribute has an "Edit" checkbox -->
            <div v-if="categoryAttributes.length">
              <div
                v-for="attr in categoryAttributes"
                :key="attr.id"
                class="mb-3 border p-3 rounded"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <label class="block mb-1 text-sm font-medium">
                      {{ isArabic ? attr.name : attr.name_en }}
                      <span v-if="attr.is_required" class="text-red-500"
                        >*</span
                      >
                    </label>
                  </div>

                  <!-- Edit toggle: only include this attr in payload if checked -->
                  <label class="flex items-center gap-2">
                    <input type="checkbox" v-model="editedAttrsMap[attr.id]" />
                    <span class="text-sm">{{
                      $t("postAdd.edit") || "Edit"
                    }}</span>
                  </label>
                </div>

                <div class="mt-2" v-if="editedAttrsMap[attr.id]">
                  <!-- Select -->
                  <select
                    v-if="attr.category_attributes_types?.code === 'select'"
                    v-model="formAttributes[`attr_${attr.id}`]"
                    class="w-full border border-gray-300 rounded-md p-2 text-sm"
                  >
                    <option :value="null">
                      {{ $t("postAdd.selectPlaceholder") || "Select" }}
                    </option>
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
                    v-model="formAttributes[`attr_${attr.id}`]"
                    type="text"
                    class="w-full border border-gray-300 rounded-md p-2 text-sm"
                  />

                  <!-- Textarea -->
                  <textarea
                    v-else-if="
                      attr.category_attributes_types?.code === 'textarea'
                    "
                    v-model="formAttributes[`attr_${attr.id}`]"
                    class="w-full border border-gray-300 rounded-md p-2 text-sm"
                  ></textarea>

                  <!-- Number -->
                  <input
                    v-else-if="
                      attr.category_attributes_types?.code === 'number'
                    "
                    v-model.number="formAttributes[`attr_${attr.id}`]"
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
                        formAttributes[`attr_${attr.id}`] === val.id
                          ? 'bg-[#146AAB] text-white border-[#146AAB]'
                          : 'bg-white text-gray-600 border-gray-300',
                      ]"
                    >
                      <input
                        type="radio"
                        :value="val.id"
                        v-model="formAttributes[`attr_${attr.id}`]"
                        class="hidden"
                      />
                      {{ isArabic ? val.name : val.name_en }}
                    </label>
                  </div>

                  <!-- Checkbox (multiple) -->
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
                        v-model="formAttributes[`attr_${attr.id}`]"
                      />
                      {{ isArabic ? val.name : val.name_en }}
                    </label>
                  </div>
                </div>

                <!-- Show current value preview when not editing -->
                <div class="mt-2" v-else>
                  <div class="text-sm text-gray-700">
                    <strong class="inline-block"
                      >{{ $t("postAdd.current") || "Current:" }}
                    </strong>
                    <span v-if="existingAttrMap[attr.id]">
                      <!-- For checkbox/radio/select show names -->
                      <template
                        v-if="
                          attr.category_attributes_types?.code === 'checkbox'
                        "
                      >
                        {{
                          existingAttrMap[attr.id].values
                            .map((v) => (isArabic ? v.name : v.name_en))
                            .join(", ")
                        }}
                      </template>
                      <template
                        v-else-if="
                          ['select', 'radio'].includes(
                            attr.category_attributes_types?.code
                          )
                        "
                      >
                        <span class="ms-2">
                          {{
                            existingAttrMap[attr.id].values.length
                              ? isArabic
                                ? existingAttrMap[attr.id].values[0].name
                                : existingAttrMap[attr.id].values[0].name_en
                              : "-"
                          }}</span
                        >
                      </template>
                      <template v-else>
                        {{
                          existingAttrMap[attr.id].text ??
                          existingAttrMap[attr.id].text_en ??
                          "-"
                        }}
                      </template>
                    </span>
                    <span v-else>-</span>
                  </div>
                </div>
              </div>
            </div>
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

        <!-- Step 2: images & submit -->
        <div v-if="step === 2">
          <h3 class="text-lg font-semibold mb-4">
            {{ $t("postAdd.uploadTitle") }}
          </h3>

          <div class="mb-3">
            <label class="block mb-1 text-sm font-medium">{{
              $t("postAdd.existingImages") || "Existing Images"
            }}</label>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div
                v-for="img in existingImages"
                :key="img.id"
                class="relative border rounded-md overflow-hidden"
              >
                <img
                  :src="imageUrl(img.image)"
                  class="w-full h-24 object-cover"
                />
                <button
                  @click="toggleRemoveImage(img.id)"
                  class="absolute top-1 right-1 bg-white rounded-full p-1 text-red-600 border"
                >
                  <i
                    class="pi"
                    :class="
                      removedImageIds.includes(img.id) ? 'pi-check' : 'pi-trash'
                    "
                  ></i>
                </button>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <label class="block mb-1 text-sm font-medium">{{
              $t("postAdd.addNewImages")
            }}</label>
            <div
              class="border-2 border-dashed border-[#146AAB] rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer"
              @click="triggerFileUpload"
            >
              <i class="pi pi-upload text-[#146AAB] text-3xl mb-2"></i>
              <p class="text-sm text-gray-600">
                {{ $t("postAdd.chooseFile") }}
              </p>
              <input
                type="file"
                ref="fileInput"
                class="hidden"
                multiple
                accept="image/*"
                @change="handleNewFiles"
              />
            </div>

            <div
              v-if="newFilesPreviews.length"
              class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3"
            >
              <div
                v-for="(f, idx) in newFilesPreviews"
                :key="idx"
                class="border rounded-md overflow-hidden relative"
              >
                <img :src="f" class="w-full h-24 object-cover" />
                <button
                  @click="removeNewFile(idx)"
                  class="absolute top-1 right-1 bg-white rounded-full p-1 text-red-600 border"
                >
                  <i class="pi pi-times"></i>
                </button>
              </div>
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
              @click="submitUpdate"
              class="bg-[#FFE800] text-black font-medium py-2 px-6 rounded-md"
            >
              {{ $t("postAdd.update") || "Update" }}
            </button>
          </div>
        </div>

        <!-- Step 3: success -->
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
            >{{ $t("postAdd.home") }}</router-link
          >
        </div>
      </main>
    </div>
  </app-layout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import requestService from "../services/api/requestService";
import AppLayout from "../Layout/AppLayout.vue";
import EditPickLocation from "../components/EditPickLocation.vue";
import { showError, showWarning, showSuccess } from "../utils/notifications";
import { useAuthStore } from "../store/auth";
import { MEDIA_URL } from "../services/axios";

const authStore = useAuthStore();
const { locale, t } = useI18n();
const isArabic = computed(() => locale.value === "ar");
const currentUser = computed(() => authStore?.user);
const route = useRoute();
const adId = Number(route.params.adId);
const categoryId = route.params.categoryId
  ? Number(route.params.categoryId)
  : null; // optional

const step = ref(1);
const steps = [
  { id: 1, labelKey: "steps.details" },
  { id: 2, labelKey: "steps.images" },
];

const form = reactive({
  title: "",
  title_en: "",
  price: "",
  descr: "",
  currency_id: null,
});

const location = ref({
  lat: null,
  lng: null,
  address: "",
});

const currencies = ref([]);
const categoryAttributes = ref([]); // attributes metadata for the category
const existingAttributes = ref([]); // ad's existing attributes (from backend)
const existingAttrMap = reactive({}); // map attrId -> { text, values: [...] }
const editedAttrsMap = reactive({}); // toggles which attributes user wants to edit
const formAttributes = reactive({}); // values for attributes to send

// images
const existingImages = ref([]); // {id, image}
const removedImageIds = ref([]); // ids user marked for deletion
const fileInput = ref(null);
const newFiles = ref([]); // File objects to upload
const newFilesPreviews = ref([]);

// helper to build image url (adjust base path)
const imageUrl = (filename) => `${MEDIA_URL}/${filename}`; // adapt as your static path

onMounted(async () => {
  await Promise.all([fetchCurrencies(), loadAd(), fetchCategoryAttributes()]);
});

const fetchCurrencies = async () => {
  try {
    const res = await requestService.getAll("/currencies");
    currencies.value = res.data || [];
  } catch (err) {
    console.error(err);
  }
};

const fetchCategoryAttributes = async () => {
  // if we have a categoryId from query use it, else try infer from ad attributes (first attribute's category)
  try {
    const catId =
      categoryId ||
      (existingAttributes.value.length
        ? existingAttributes.value[0].category_attributes?.category_id
        : null);
    if (!catId) return;
    const res = await requestService.getAll(`/categories/${catId}/attributes`);
    categoryAttributes.value = res.data?.category_attributes || [];
    // initialize edited toggles and formAttributes defaults
    categoryAttributes.value.forEach((attr) => {
      editedAttrsMap[attr.id] = false;
      // set initial form value to current ad value if exists
      const existing = existingAttrMap[attr.id];
      if (existing) {
        if (attr.category_attributes_types?.code === "checkbox") {
          formAttributes[`attr_${attr.id}`] = existing.values.map((v) => v.id);
        } else if (
          ["select", "radio"].includes(attr.category_attributes_types?.code)
        ) {
          formAttributes[`attr_${attr.id}`] = existing.values.length
            ? existing.values[0].id
            : null;
        } else {
          formAttributes[`attr_${attr.id}`] =
            existing.text ?? existing.text_en ?? null;
        }
      } else {
        // defaults
        formAttributes[`attr_${attr.id}`] =
          attr.category_attributes_types?.code === "checkbox" ? [] : null;
      }
    });
  } catch (err) {
    console.error("Failed to load category attributes", err);
  }
};

const loadAd = async () => {
  try {
    // include images + attributes
    const res = await requestService.getAll(
      `/ads/${adId}?includes=images,attributes`
    );
    const ad = res.data;
    if (!ad) return;

    form.title = ad.title;
    form.title_en = ad.title_en;
    form.price = ad.price;
    form.descr = ad.descr;
    form.currency_id = ad.currency_id;

    location.value.lat = ad.lat;
    location.value.lng = ad.lng;
    location.value.address = ad.address;

    existingImages.value = ad.ads_images || [];

    // build existingAttributes map
    existingAttributes.value = ad.ad_attributes || [];
    existingAttributes.value.forEach((a) => {
      const attrId = a.category_attribute_id;
      const values = (a.ad_attribute_options || []).map(
        (opt) => opt.category_attributes_values
      );
      existingAttrMap[attrId] = { text: a.text, text_en: a.text_en, values };
    });
  } catch (err) {
    console.error("Failed to load ad", err);
  }
};

const validateStepOne = () => {
  if (!form.title || !form.title_en || !form.price || !form.currency_id) {
    showWarning(t("validation.all_fields_required"));
    return;
  }
  step.value = 2;
};

const triggerFileUpload = () => fileInput.value?.click();

const handleNewFiles = (e) => {
  const files = Array.from(e.target.files || []);
  for (const f of files) {
    newFiles.value.push(f);
    newFilesPreviews.value.push(URL.createObjectURL(f));
  }
};

const removeNewFile = (index) => {
  newFiles.value.splice(index, 1);
  newFilesPreviews.value.splice(index, 1);
};

const toggleRemoveImage = (id) => {
  const idx = removedImageIds.value.indexOf(id);
  if (idx === -1) removedImageIds.value.push(id);
  else removedImageIds.value.splice(idx, 1);
};

const submitUpdate = async () => {
  // Basic checks
  if (!location.value.lat || !location.value.lng || !location.value.address) {
    showError(t("validation.location_required"));
    return;
  }

  try {
    console.log(location.value);

    const formData = new FormData();
    formData.append("user_id", String(currentUser.value?.id));
    formData.append("title", form.title);
    formData.append("title_en", form.title_en);
    formData.append("currency_id", String(form.currency_id));
    formData.append("price", String(form.price));
    formData.append("descr", form.descr ?? "");
    formData.append("lat", location.value.lat ?? "");
    formData.append("lng", location.value.lng ?? "");
    formData.append("address", location.value.address ?? "");

    // ad_categories (if you want user to edit categories add UI — omitted here)
    if (categoryId)
      formData.append("ad_categories", JSON.stringify([categoryId]));

    // remove_image_ids
    if (removedImageIds.value.length) {
      formData.append(
        "remove_image_ids",
        JSON.stringify(removedImageIds.value)
      );
    }

    // new files added as 'ads_images' (same name as create)
    for (const f of newFiles.value) {
      formData.append("ads_images", f);
    }

    // attributes: collect only those that user toggled 'Edit'
    const attributesToSend = [];
    for (const attr of categoryAttributes.value) {
      if (!editedAttrsMap[attr.id]) continue; // user chose not to edit this attr

      const key = `attr_${attr.id}`;
      const type = attr.category_attributes_types?.code;

      if (["text", "textarea", "number"].includes(type)) {
        const val = formAttributes[key];
        if (val || val === 0) {
          attributesToSend.push({
            category_attribute_id: attr.id,
            text: String(val),
          });
        }
      } else if (type === "location") {
        // If you allowed per-attribute location editing, you'd capture lat/lng/address here (omitted)
      } else if (["select", "radio"].includes(type)) {
        const val = formAttributes[key];
        if (val)
          attributesToSend.push({
            category_attribute_id: attr.id,
            category_attribute_value_id: Number(val),
          });
      } else if (type === "checkbox") {
        const vals = formAttributes[key] || [];
        if (Array.isArray(vals) && vals.length) {
          attributesToSend.push({
            category_attribute_id: attr.id,
            category_attribute_value_ids: vals.map(Number),
          });
        }
      }
    }

    if (attributesToSend.length) {
      formData.append("attributes", JSON.stringify(attributesToSend));
    }

    // featured (if needed) e.g.
    // formData.append('featured', JSON.stringify({ end_date: '2026-01-01', status: true }));

    // send PATCH request
    const res = await requestService.patch(`/ads/${adId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    showSuccess(res?.message || t("postAdd.successMessage"));
    step.value = 3;
  } catch (err) {
    console.error("Update failed", err);
    showError(err?.message || t("postAdd.errorMessage"));
  }
};
</script>
