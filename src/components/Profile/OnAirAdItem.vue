<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { MEDIA_URL } from "../../services/axios";
import { useRouter } from "vue-router";
import DeleteDialog from "../DeleteDialog.vue";
import { ref } from "vue";
import { showError, showSuccess } from "../../utils/notifications";
import requestService from "../../services/api/requestService";

const { t, locale } = useI18n();
const router = useRouter();

const emit = defineEmits(["refreshAds"]);

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const selectedAdId = ref(null);
const isDialogOpen = ref(false);

const currentLocale = computed(() => locale.value);

const adTitle = computed(() =>
  currentLocale.value === "ar" ? props.item?.title : props.item?.title_en
);

const goToPostFeaturedAd = (adId) => {
  router.push({
    name: "post-featured-ad",
    params: {
      adId,
    },
  });
};

const processRefund = (adId) => {
  selectedAdId.value = adId;
  isDialogOpen.value = true;
};

const handleRefund = async () => {
  try {
    const res = await requestService.patch(`ads/${selectedAdId.value}/refund`);
    showSuccess(res?.message || "refund success");
    emit("refreshAds");
  } catch (error) {
    console.log(error);
    showError(error || "refund faild");
  } finally {
    isDialogOpen.value = false;
  }
};

const isFeatured = computed(() =>
  props.item?.ad_featured_history?.some((f) => f.status === true)
);

const canRequestRefund = computed(() => {
  const featuredItem = props?.item?.ad_featured_history?.find(
    (h) => h?.status === true
  );

  if (!featuredItem?.created) return false;

  const hoursPassed =
    (Date.now() - new Date(featuredItem.created).getTime()) / (1000 * 60 * 60);

  return hoursPassed < 24; // refund allowed within 24 hours
});

const formattedPrice = computed(() => {
  const price = props.item?.price;
  if (price == null || isNaN(parseFloat(price))) return "";
  const amount = parseFloat(price).toLocaleString(currentLocale.value, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const currency =
    currentLocale.value === "ar"
      ? props.item?.currencies?.name
      : props.item?.currencies?.name_en;
  return `${currency} ${amount}`;
});

const adImageUrl = computed(() => {
  const path = props.item?.ads_images?.[0]?.image;
  return path
    ? `${MEDIA_URL}/${path}`
    : "https://placehold.co/80x72/146AAB/FFFFFF?text=Ad";
});

const goToAdDetails = (adId) => {
  router.push({ name: "ad-details", params: { adId } });
};

const goToEditAd = (adId, categoryId) => {
  router.push({ name: "edit-ad", params: { adId, categoryId } });
};
</script>

<template>
  <div
    class="flex flex-col gap-2 bg-white p-4 rounded-lg cursor-pointer relative"
    @click="goToAdDetails(item.id)"
  >
    <div class="flex justify-between items-center">
      <div class="flex gap-2 items-center">
        <!-- Image -->
        <div class="max-w-[80px] h-18">
          <img
            :src="adImageUrl"
            :alt="adTitle"
            class="w-full h-full object-cover rounded-lg"
          />
        </div>

        <!-- Content -->
        <div class="flex flex-col ms-2 flex-1">
          <span
            v-if="isFeatured"
            class="bg-yellow-400 text-xs font-semibold text-gray-800 px-2 py-0.5 rounded w-fit mb-1"
          >
            {{ t("ads.featured") }}
          </span>

          <p class="text-sm font-medium text-gray-900 leading-snug">
            {{ adTitle }}
          </p>

          <div class="flex items-center gap-2 mt-1">
            <i class="pi pi-map-marker text-[9px] text-[#6B7280]"></i>
            <p class="text-[9px] text-[#6B7280]">{{ props.item?.address }}</p>
          </div>
        </div>
      </div>

      <!-- Price -->
      <div class="flex flex-col items-end">
        <p class="text-sm text-[#146AAB]">{{ formattedPrice }}</p>

        <!-- Inline Edit Button -->
        <button
          class="mt-1 text-xs text-blue-600 hover:underline cursor-pointer"
          @click.stop="
            goToEditAd(item.id, item?.ad_categories?.[0]?.category_id)
          "
        >
          {{ t("generic.edit") }}
        </button>
        <button
          v-if="isFeatured && canRequestRefund"
          class="mt-1 text-xs text-blue-600 hover:underline cursor-pointer"
          @click.stop="processRefund(item.id)"
        >
          {{ t("postAdd.refund_request") }}
        </button>
        <button
          v-if="!isFeatured"
          class="mt-1 text-xs text-blue-600 hover:underline cursor-pointer"
          @click.stop="
            goToPostFeaturedAd(item.id, item?.ad_categories?.[0]?.category_id)
          "
        >
          {{ t("postAdd.featured") }}
        </button>
      </div>
    </div>
  </div>
  <DeleteDialog
    v-model="isDialogOpen"
    :content="$t('postAdd.refund_confirmation')"
    @confirm="handleRefund"
  />
</template>
