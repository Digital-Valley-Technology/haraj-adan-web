<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
    <div class="flex flex-col items-center overflow-hidden">
      <div
        v-if="images.length"
        class="swiper-initialized swiper-horizontal w-full aspect-[6/4] mb-4 rounded-lg swiper-backface-hidden"
      >
        <swiper
          :slides-per-view="1"
          :modules="[FreeMode, Thumbs]"
          :thumbs="{ swiper: thumbsSwiper }"
          class="main-swiper w-full mb-4 rounded-lg"
        >
          <SwiperSlide v-for="(img, index) in images" :key="index">
            <img
              :src="img"
              class="w-full lg:h-[567px] object-cover rounded-lg"
              alt="Ad Image"
            />
          </SwiperSlide>
        </swiper>

        <swiper
          @swiper="onThumbSwiper"
          :modules="[FreeMode, Thumbs, Navigation]"
          :space-between="10"
          :slides-per-view="2"
          navigation
          :breakpoints="{ 554: { slidesPerView: 4 } }"
          free-mode
          watch-slides-progress
          class="thumbs-swiper mt-4"
        >
          <SwiperSlide v-for="(img, index) in images" :key="index">
            <img
              :src="img"
              class="w-full h-24 rounded-md object-cover cursor-pointer"
              alt="Ad Thumbnail"
            />
          </SwiperSlide>
        </swiper>
      </div>

      <div
        v-else
        class="w-full aspect-[6/4] bg-gray-100 flex items-center justify-center text-gray-400 text-sm"
      >
        {{ t("adDetails.no-images") }}
      </div>
    </div>

    <div class="w-full bg-white rounded-2xl shadow-sm">
      <div class="flex flex-col justify-center p-5">
        <div class="flex justify-between items-center mb-6">
          <span class="text-2xl font-semibold text-gray-900">
            {{ locale === "ar" ? adData.title : adData.title_en }}
          </span>
          <span class="text-xl font-semibold text-[#146AAB]">
            {{
              `${formatPrice(adData.price)} ${
                locale === "ar"
                  ? adData?.currencies?.name
                  : adData?.currencies?.name_en
              }`
            }}
          </span>
        </div>

        <div v-if="visibleAttributes.length" class="divide-y">
          <div
            v-for="(attr, index) in visibleAttributes"
            :key="index"
            class="flex justify-between items-center py-3"
          >
            <span class="text-gray-600 text-sm">
              {{
                locale === "ar"
                  ? attr.category_attributes.name
                  : attr.category_attributes.name_en
              }}
            </span>
            <span class="text-gray-800 text-sm font-medium">
              <template
                v-if="
                  attr.ad_attribute_options && attr.ad_attribute_options.length
                "
              >
                {{
                  attr.ad_attribute_options
                    .map((option) =>
                      locale === "ar"
                        ? option.category_attributes_values?.name
                        : option.category_attributes_values?.name_en
                    )
                    .join(", ")
                }}
              </template>
              <template v-else>
                {{ attr.text || "_" }}
              </template>
            </span>
          </div>
        </div>

        <div class="flex justify-between items-center gap-3 mt-8">
          <button
            @click="toggle"
            class="bg-[#146AAB] cursor-pointer hover:bg-[#125d94] transition text-white py-2 w-full rounded-md text-sm font-medium"
          >
            {{ t("adDetails.call") }}
          </button>
          <button
            class="bg-[#FFE800] cursor-pointer hover:bg-[#e6d400] transition py-2 w-full rounded-md text-sm font-medium"
          >
            {{ t("adDetails.send-message") }}
          </button>
          <button
            @click="toggleFavorite"
            class="bg-gray-200 py-2 px-4 rounded-md hover:bg-gray-300 transition flex items-center gap-1"
          >
            <i
              class="cursor-pointer pi"
              :class="
                isFavorite
                  ? 'pi-heart-fill text-[#146AAB]'
                  : 'pi-heart text-gray-400'
              "
            ></i>
          </button>
          <button
            v-if="currentUser?.id"
            @click="toggleLiked"
            class="bg-gray-200 py-2 px-4 rounded-md hover:bg-gray-300 transition flex items-center gap-1"
          >
            <i
              class="cursor-pointer pi"
              :class="
                isLiked
                  ? 'pi-thumbs-up-fill text-[#146AAB]'
                  : 'pi-thumbs-up text-gray-400'
              "
            ></i>
          </button>
        </div>

        <div class="card flex justify-center">
          <Popover ref="op">
            <div>
              <InputGroup>
                <Button severity="secondary">{{
                  t("adDetails.mobile")
                }}</Button>
                <Button @click="callUser" label="Invite" icon="pi pi-users">
                  <span class="force-ltr">
                    {{
                      adData?.users?.phone
                        ? formatPhoneNumber(adData?.users?.phone)
                        : "_"
                    }}
                  </span>
                </Button>
              </InputGroup>
            </div>
          </Popover>
        </div>
      </div>
    </div>
  </div>

  <div class="bg-white p-4 rounded-lg flex items-start gap-4 mb-2">
    <button
      @click="activeTab = 'description'"
      :class="[
        'py-2 px-7 rounded-md text-sm font-medium transition',
        activeTab === 'description'
          ? 'bg-[#146AAB] text-white'
          : 'bg-gray-200 text-black',
      ]"
      class="cursor-pointer"
    >
      {{ t("adDetails.descr") }}
    </button>

    <button
      @click="activeTab = 'location'"
      :class="[
        'py-2 px-7 rounded-md text-sm font-medium transition',
        activeTab === 'location'
          ? 'bg-[#146AAB] text-white'
          : 'bg-gray-200 text-black',
      ]"
      class="cursor-pointer"
    >
      {{ t("adDetails.location") }}
    </button>
  </div>

  <div class="bg-white p-6 rounded-lg my-4">
    <div v-if="activeTab === 'description'">
      <h3 class="text-lg font-semibold text-gray-900 mb-3">
        {{ t("adDetails.descr") }}
      </h3>
      <p class="text-sm text-gray-700 leading-relaxed">
        {{ ad?.descr || t("adDetails.no-descr") }}
      </p>
    </div>

    <div v-else-if="activeTab === 'location'">
      <iframe
        v-if="mapUrl"
        class="w-full h-96 rounded-md"
        :src="mapUrl"
        allowfullscreen
        loading="lazy"
      ></iframe>
      <p v-else class="text-sm text-gray-500">
        {{ t("adDetails.no-location") }}
      </p>
    </div>
  </div>

  <div class="bg-white p-6 rounded-lg my-4">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">
      {{ t("adDetails.comments") }}
    </h3>

    <!-- Add Comment Form -->
    <div class="mb-6" v-if="currentUser?.id">
      <Textarea
        v-model="newComment"
        rows="3"
        autoResize
        class="w-full"
        :placeholder="t('adDetails.write-comment')"
      />
      <Button
        @click="submitComment"
        :label="t('adDetails.add-comment')"
        icon="pi pi-send"
        class="mt-3"
      />
    </div>

    <!-- Comments List + Pagination -->
    <div v-if="comments.length" class="space-y-4">
      <div
        v-for="(comment, index) in comments"
        :key="index"
        :class="[
          'flex items-start gap-3 p-3 rounded-lg',
          comment.users.id === currentUser?.id
            ? 'bg-blue-50 border border-blue-300'
            : 'bg-gray-50',
        ]"
      >
        <!-- Avatar -->
        <div
          class="w-10 h-10 rounded-full text-white flex items-center justify-center font-semibold text-sm"
          :class="
            comment.users.id === currentUser?.id
              ? 'bg-blue-500'
              : 'bg-[#146AAB]'
          "
        >
          {{ comment.users.name?.charAt(0) || "U" }}
        </div>

        <!-- Content -->
        <div class="flex-1">
          <p
            class="text-sm leading-relaxed"
            :class="
              comment.users.id === currentUser?.id
                ? 'text-blue-900'
                : 'text-gray-800'
            "
          >
            {{ comment.text }}
          </p>

          <div class="flex justify-between items-center mt-1 text-xs">
            <span
              :class="
                comment.users.id === currentUser?.id
                  ? 'text-blue-500'
                  : 'text-gray-500'
              "
            >
              —
              {{
                comment.users.id === currentUser?.id
                  ? t("adDetails.you")
                  : comment.users.name || "Anonymous"
              }}
              ·
              {{ formatedDate(comment?.created) }}
            </span>

            <!-- Delete button only for user's own comment -->
            <a
              role="button"
              v-if="comment?.users?.id === currentUser?.id"
              @click="processDelete(comment.id)"
              class="text-red-500 hover:text-red-700 text-xs me-2 cursor-pointer"
            >
              {{ t("generic.delete") }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <p v-else class="text-gray-500 text-sm">
      {{ t("adDetails.no-comments") }}
    </p>

    <!-- Pagination -->
    <Paginator
      v-if="total > rows"
      :rows="rows"
      :totalRecords="total"
      :first="first"
      @page="onPageChange"
    />
  </div>

  <DeleteDialog
    v-model="isDeleteDialogOpen"
    :content="$t('generic.delete_confirmation')"
    @confirm="handleDelete"
  />
</template>

<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { FreeMode, Thumbs, Navigation } from "swiper/modules";
import { ref, computed, toRef } from "vue";
import { useI18n } from "vue-i18n";
import dayjs from "dayjs";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { MEDIA_URL } from "../services/axios";
import { useAuthStore } from "../store/auth";
import { showError, showSuccess } from "../utils/notifications";
import requestService from "../services/api/requestService";
import DeleteDialog from "./DeleteDialog.vue";

const props = defineProps({
  ad: Object,
  comments: Array,
  first: Number,
  rows: Number,
  total: Number,
});

const emit = defineEmits(["paginate-comments", "toggle-like"]);
const authStore = useAuthStore();
const isDeleteDialogOpen = ref(false);
const selectedCommentId = ref(null);

const ad = toRef(props, "ad");
const adData = ad;
const adId = adData.value?.id;

const newComment = ref("");

// Pagination state
const first = toRef(props, "first"); // starting index
const rows = toRef(props, "rows"); // comments per page
const comments = toRef(props, "comments");

const currentUser = computed(() => authStore.user);

const isLiked = computed(() => {
  if (!adData.value || !currentUser.value) return false;
  return adData.value.ad_likes?.some(
    (like) => like.user_id === currentUser.value.id
  );
});

function onPageChange(event) {
  const newPage = event.page + 1; // PrimeVue pagination starts from 0
  const newLimit = event.rows;

  emit("paginate-comments", { page: newPage, limit: newLimit });
}

const submitComment = async () => {
  if (!newComment.value.trim()) return;

  try {
    const res = await requestService.create(
      `/ads/comments/${adData.value.id}`,
      {
        userId: currentUser?.value?.id,
        text: newComment.value.trim(),
      }
    );
    showSuccess(res?.message);
    emit("paginate-comments", { page: 1, limit: rows.value });
    newComment.value = "";
  } catch (error) {
    console.log(error);
    showError(error);
  }
};

const processDelete = (commentId) => {
  selectedCommentId.value = commentId;
  isDeleteDialogOpen.value = true;
};

const handleDelete = async () => {
  try {
    const res = await requestService.delete(
      `/ads/comments`,
      selectedCommentId.value
    );
    showSuccess(res?.message || "Comment deleted successfully");

    emit("paginate-comments", { page: 1, limit: rows.value });
  } catch (err) {
    console.log(err);

    showError(err || "Failed to delete comment");
  } finally {
    isDeleteDialogOpen.value = false;
  }
};

const op = ref();

const toggle = (event) => {
  op.value.toggle(event);
};

// --- LocalStorage Favorites Logic ---
const FAVORITES_KEY = "AD_FAVORITES_LIST";

const getStoredFavorites = () => {
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (e) {
    console.error("Error parsing favorites from localStorage:", e);
    return [];
  }
};

const setStoredFavorites = (favoritesArray) => {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritesArray));
  } catch (e) {
    console.error("Error saving favorites to localStorage:", e);
  }
};

const initialFavorites = getStoredFavorites();
const isFavorite = ref(initialFavorites.some((item) => item.id === adId));

const formatedDate = (date) => {
  return dayjs(date).format("MMM D, YYYY");
};

const toggleFavorite = () => {
  if (!adId) return;

  const currentFavorites = getStoredFavorites();
  const existingIndex = currentFavorites.findIndex((item) => item.id === adId);

  if (existingIndex > -1) {
    currentFavorites.splice(existingIndex, 1);
    isFavorite.value = false;
  } else {
    currentFavorites.push(adData.value);
    isFavorite.value = true;
  }

  setStoredFavorites(currentFavorites);
};

const toggleLiked = () => {
  emit("toggle-like", { adId, isLiked: isLiked.value });
};

function callUser() {
  const phone = adData.value?.users?.phone;
  if (phone) {
    // Remove spaces and dashes for dialer
    const cleanedPhone = phone.replace(/[\s-]/g, "");
    window.location.href = `tel:${cleanedPhone}`;
  } else {
    // fallback: open the popover
    toggle();
  }
}

// --- Swiper + Tabs + Computed ---
const { locale, t } = useI18n();
const thumbsSwiper = ref(null);
const activeTab = ref("description");

function onThumbSwiper(swiper) {
  thumbsSwiper.value = swiper;
}

function formatPhoneNumber(phone) {
  if (!phone) return "";

  // Remove all spaces and hyphens
  let cleaned = phone.toString().replace(/[\s-]/g, "");

  // Already in full international format → return as is
  if (cleaned.startsWith("+")) return cleaned;

  // Convert 00XX to +XX
  if (cleaned.startsWith("00")) {
    cleaned = "+" + cleaned.substring(2);
  }

  // If local number starting with 0 -> keep but format spacing
  if (cleaned.startsWith("0")) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3,})/, "$1 $2 $3"); // 079 123 4567
  }

  // If 9 digits (Jordan style or similar)
  if (/^\d{9,10}$/.test(cleaned)) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3,})/, "$1 $2 $3");
  }

  // Fallback
  return cleaned;
}

const images = computed(() => {
  const imgs = adData.value?.ads_images ?? [];
  const base = MEDIA_URL?.replace(/\/$/, "") ?? "";
  return imgs.map((i) =>
    i.image?.startsWith("http") ? i.image : `${base}/${i.image}`
  );
});

const visibleAttributes = computed(() =>
  (adData.value?.ad_attributes ?? []).filter((a) => a.category_attributes)
);

const mapUrl = computed(() => {
  if (!adData.value?.lng || !adData.value.lat || !adData.value?.address)
    return "";

  // FIX: Correctly construct the Google Maps embed URL
  return `https://maps.google.com/maps?q=${adData.value.lat},${
    adData.value.lng
  }&hl=${locale.value === "ar" ? "ar" : "en"}&z=15&output=embed`;
});

function formatPrice(p) {
  if (!p) return "";
  const n = Number(p);
  return isNaN(n) ? p : `${n.toLocaleString()}`;
}
</script>

<style scoped>
.swiper-slide-thumb-active {
  border: 2px solid #146aab;
  border-radius: 0.5rem;
  opacity: 1;
}
.force-ltr {
  direction: ltr !important;
  unicode-bidi: bidi-override !important;
  display: inline-block;
  text-align: left;
}
</style>
