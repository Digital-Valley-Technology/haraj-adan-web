<script setup>
import { ref, watch, onMounted } from "vue";
import * as yup from "yup";
import { useI18n } from "vue-i18n";
import { showError, showSuccess } from "../utils/notifications";
import DashboardLayout from "../Layout/DashboardLayout.vue";
import requestService from "../services/api/requestService";
import { useGeneralStore } from "../store/general";

const { t } = useI18n();
const generalStore = useGeneralStore();

/* --- validation --- */
const adConfigSchema = yup.object({
  featured_ad_price: yup
    .number()
    .required(t("dashboard.settings.errors.price_required"))
    .min(1, t("dashboard.settings.errors.price_min")),
  featured_ad_days_count: yup
    .number()
    .required(t("dashboard.settings.errors.days_required"))
    .integer(t("dashboard.settings.errors.days_integer"))
    .min(1, t("dashboard.settings.errors.days_min")),
  show_discount_banner: yup.boolean(),
  near_locations_distance: yup
    .number()
    .required(t("dashboard.settings.errors.distance_required"))
    .min(0, t("dashboard.settings.errors.distance_min")),
});

const discountSchema = yup.object({
  percentage: yup
    .number()
    .required(t("dashboard.settings.errors.discount_required"))
    .min(1, t("dashboard.settings.errors.discount_min"))
    .max(100, t("dashboard.settings.errors.discount_max")),
  period: yup
    .number()
    .required(t("dashboard.settings.errors.period_required"))
    .min(1, t("dashboard.settings.errors.period_min")),
});

/* --- state --- */
const adConfig = ref({
  featured_ad_price: 0,
  featured_ad_days_count: 1,
  show_discount_banner: false,
});
const originalAdConfig = ref({ ...adConfig.value });

const adDiscounts = ref([]);
const originalAdDiscounts = ref("[]");

const adConfigErrors = ref({});
const adDiscountErrors = ref({});

const isAdConfigDirty = ref(false);
const isAdDiscountsDirty = ref(false);

/* --- API --- */
const fetchSettings = async () => {
  try {
    generalStore.setLoading(true);
    const res = await requestService.getAll("/settings");
    adConfig.value = { ...res.data.config };
    originalAdConfig.value = { ...res.data.config };

    adDiscounts.value = res.data.discounts;
    originalAdDiscounts.value = JSON.stringify(res.data.discounts);
  } catch (error) {
    console.error("fetchSettings error:", error);
    showError(
      error ||
        error?.response?.data?.message ||
        t("dashboard.settings.errors.fetch_failed")
    );
  } finally {
    generalStore.setLoading(false);
  }
};

const saveAdConfig = async () => {
  adConfigErrors.value = {};
  try {
    await adConfigSchema.validate(adConfig.value, { abortEarly: false });

    const payload = {
      featured_ad_price: Number(adConfig.value.featured_ad_price),
      featured_ad_days_count: Number(adConfig.value.featured_ad_days_count),
      show_discount_banner: Boolean(adConfig.value.show_discount_banner),
      near_locations_distance: Number(adConfig.value.near_locations_distance),
    };

    const res = await requestService.patch("/settings/config", payload);

    // Save only the allowed fields in local state
    adConfig.value = { ...payload };
    originalAdConfig.value = { ...payload };

    showSuccess(res?.message || t("dashboard.settings.success.config_saved"));
  } catch (err) {
    if (err.name === "ValidationError") {
      err.inner.forEach((e) => {
        adConfigErrors.value[e.path] = e.message;
      });
    } else {
      console.error("saveAdConfig error:", err);
      showError(
        err ||
          err?.response?.data?.message ||
          t("dashboard.settings.errors.save_config_failed")
      );
    }
  }
};

const saveAdDiscounts = async () => {
  adDiscountErrors.value = {};
  try {
    for (let d of adDiscounts.value) {
      await discountSchema.validate(d, { abortEarly: false });
    }
    const payload = {
      discounts: adDiscounts.value.map(({ id, created, updated, ...rest }) => ({
        ...rest,
        percentage: Number(rest.percentage),
        period: Number(rest.period),
      })),
    };

    const res = await requestService.patch("/settings/discounts", payload);

    adDiscounts.value = res.data;
    originalAdDiscounts.value = JSON.stringify(res.data);

    showSuccess(
      res?.message || t("dashboard.settings.success.discounts_saved")
    );
  } catch (err) {
    if (err.name === "ValidationError") {
      err.inner.forEach((e) => {
        adDiscountErrors.value[e.path] = e.message;
      });
    } else {
      console.error("saveAdDiscounts error:", err);
      showError(
        err?.response?.data?.message ||
          t("dashboard.settings.errors.save_discounts_failed")
      );
    }
  }
};

/* --- actions --- */
const addDiscount = () => {
  adDiscounts.value.push({
    id: Date.now(),
    percentage: 1,
    period: 1,
  });
};

const removeDiscount = (id) => {
  adDiscounts.value = adDiscounts.value.filter((d) => d.id !== id);
};

/* --- dirty flags --- */
watch(
  adConfig,
  (newVal) => {
    isAdConfigDirty.value =
      JSON.stringify(newVal) !== JSON.stringify(originalAdConfig.value);
  },
  { deep: true }
);

watch(
  adDiscounts,
  (newVal) => {
    isAdDiscountsDirty.value =
      JSON.stringify(newVal) !== originalAdDiscounts.value;
  },
  { deep: true }
);

/* --- lifecycle --- */
onMounted(() => {
  fetchSettings();
});
</script>

<template>
  <dashboard-layout>
    <main
      class="py-[var(--padding-dashboard-section)] px-4 md:px-8 custom-container space-y-12"
    >
      <!-- Ad Config Card -->
      <div
        class="card w-full mx-auto px-6 md:px-10 py-10 shadow-md border border-gray-200 rounded-lg"
      >
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-2xl font-semibold">
            {{ $t("dashboard.settings.adConfigTitle") }}
          </h2>

          <BaseButton
            v-if="isAdConfigDirty"
            icon="pi pi-save"
            :label="$t('generic.save')"
            :onClick="saveAdConfig"
          />
        </div>

        <div class="flex flex-col md:flex-row gap-8">
          <!-- Featured Ad Price -->
          <FloatLabel class="flex-grow">
            <InputText
              id="featured_ad_price"
              v-model="adConfig.featured_ad_price"
              type="number"
              :min="1"
              class="!bg-slate-50 !rounded-lg !pb-4 w-full"
            />
            <label for="featured_ad_price">{{
              $t("dashboard.settings.featuredAdPrice")
            }}</label>
            <small v-if="adConfigErrors.featured_ad_price" class="text-red-500">
              {{ adConfigErrors.featured_ad_price }}
            </small>
          </FloatLabel>

          <!-- Featured Ad Days Count -->
          <FloatLabel class="flex-grow">
            <InputText
              id="featured_ad_days_count"
              v-model="adConfig.featured_ad_days_count"
              type="number"
              :min="1"
              class="!bg-slate-50 !rounded-lg !pb-4 w-full"
            />
            <label for="featured_ad_days_count">{{
              $t("dashboard.settings.featuredAdDays")
            }}</label>
            <small
              v-if="adConfigErrors.featured_ad_days_count"
              class="text-red-500"
            >
              {{ adConfigErrors.featured_ad_days_count }}
            </small>
          </FloatLabel>
        </div>

        <!-- Near Locations Distance -->
        <div class="flex flex-col md:flex-row gap-8 mt-8">
          <FloatLabel class="flex-grow">
            <InputText
              id="near_locations_distance"
              v-model="adConfig.near_locations_distance"
              type="number"
              :min="0"
              class="!bg-slate-50 !rounded-lg !pb-4 w-full"
            />
            <label for="near_locations_distance">{{
              $t("dashboard.settings.nearLocationsDistance")
            }}</label>
            <small
              v-if="adConfigErrors.near_locations_distance"
              class="text-red-500"
            >
              {{ adConfigErrors.near_locations_distance }}
            </small>
          </FloatLabel>
        </div>

        <!-- Show Discount Banner Toggle -->
        <div class="flex items-center justify-between mt-8">
          <label for="show_discount_banner" class="font-medium text-gray-700">
            {{ $t("dashboard.settings.showDiscountBanner") }}
          </label>
          <ToggleSwitch
            id="show_discount_banner"
            class="custom-toggle"
            v-model="adConfig.show_discount_banner"
          />
        </div>
      </div>

      <!-- Ad Discounts Card -->
      <div
        class="card w-full mx-auto px-6 md:px-10 py-10 shadow-md border border-gray-200 rounded-lg"
      >
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-2xl font-semibold">
            {{ $t("dashboard.settings.adDiscountsTitle") }}
          </h2>
          <div class="flex gap-4">
            <BaseButton
              icon="pi pi-plus"
              :label="$t('generic.add')"
              :onClick="addDiscount"
            />
            <BaseButton
              v-if="isAdDiscountsDirty"
              icon="pi pi-save"
              :label="$t('generic.save')"
              :onClick="saveAdDiscounts"
            />
          </div>
        </div>

        <div v-if="adDiscounts.length > 0" class="space-y-6">
          <div
            v-for="(discount, index) in adDiscounts"
            :key="discount.id"
            class="flex flex-col md:flex-row gap-6 border border-gray-200 p-6 rounded-lg bg-gray-50 hover:shadow-sm transition"
          >
            <!-- Percentage -->
            <FloatLabel class="flex-1">
              <InputText
                :id="`discount_percentage_${index}`"
                v-model="discount.percentage"
                type="number"
                :min="1"
                class="!bg-slate-50 !rounded-lg !pb-4 w-full"
              />
              <label :for="`discount_percentage_${index}`">
                {{ $t("dashboard.settings.discountPercentage") }}
              </label>
              <small v-if="adDiscountErrors.percentage" class="text-red-500">{{
                adDiscountErrors.percentage
              }}</small>
            </FloatLabel>

            <!-- Period -->
            <FloatLabel class="flex-1">
              <InputText
                :id="`discount_period_${index}`"
                v-model="discount.period"
                type="number"
                :min="1"
                class="!bg-slate-50 !rounded-lg !pb-4 w-full"
              />
              <label :for="`discount_period_${index}`">
                {{ $t("dashboard.settings.discountPeriod") }}
              </label>
              <small v-if="adDiscountErrors.period" class="text-red-500">{{
                adDiscountErrors.period
              }}</small>
            </FloatLabel>

            <!-- Delete Button -->
            <div class="flex items-center md:justify-end">
              <BaseButton
                icon="pi pi-trash"
                buttonClasses="bg-red-500 hover:bg-red-400 text-white font-semibold py-2 px-4 rounded flex items-center space-x-2 transition"
                :onClick="() => removeDiscount(discount.id)"
              />
            </div>
          </div>
        </div>

        <p v-else class="text-gray-500 italic mt-4">
          {{ $t("dashboard.settings.noDiscounts") }}
        </p>
      </div>
    </main>
  </dashboard-layout>
</template>

<style scoped>
/* OFF state */
:deep(.custom-toggle .p-toggleswitch-slider) {
  background-color: #e5e7eb !important; /* gray-200 */
}

/* ON state */
:deep(
    .custom-toggle.p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-slider
  ) {
  background-color: #60a5fa !important; /* blue-400 */
}
</style>
