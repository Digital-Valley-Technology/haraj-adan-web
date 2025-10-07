<script setup>
import DashboardLayout from "../../Layout/DashboardLayout.vue";
import { useRouter, useRoute } from "vue-router";
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { decode } from "js-base64";
import { MEDIA_URL } from "../../services/axios";
import { DashboardBreadCrumbBase } from "../../utils/constants";
import requestService from "../../services/api/requestService";
import { showError } from "../../utils/notifications";
import "viewerjs/dist/viewer.css";
import { directive as viewer } from "v-viewer";

const { t, locale } = useI18n();
const router = useRouter();
const route = useRoute();

const currentLocale = computed(() => locale.value || "ar");

const ad = ref(null);
const loading = ref(false);

const breadcrumbItems = [
  { label: "sidebar.ads", route: "/dashboard/ads" },
  { label: "dashboard.ads.details.title" },
];

const fetchAdDetails = async () => {
  loading.value = true;
  try {
    const adId = decode(route.params.adId);
    const response = await requestService.getAll(`/ads/${adId}`, {
      params: {
        includes: "attributes,images,user,likes,comments,featured,favourites",
      },
    });
    ad.value = response.data;
  } catch (error) {
    console.error(error);
    showError(t("dashboard.ads.error.fetch_ad"));
    router.push({ name: "ads" });
  } finally {
    loading.value = false;
  }
};

onMounted(fetchAdDetails);

// === COMPUTED ===
const getTitle = computed(() =>
  currentLocale.value === "ar"
    ? ad.value?.title || "_"
    : ad.value?.title_en || "_"
);

const formattedCreated = computed(() =>
  ad.value?.created
    ? new Date(ad.value.created).toLocaleString()
    : t("ads.not_provided")
);

const formattedUpdated = computed(() =>
  ad.value?.updated
    ? new Date(ad.value.updated).toLocaleString()
    : t("ads.not_provided")
);

const hasImages = computed(() => ad.value?.ads_images?.length > 0);

const userInitials = computed(() => {
  const name = ad.value?.users?.name || ad.value?.users?.email || "";
  return name ? name.trim()[0].toUpperCase() : "?";
});

// === IMAGE ERROR HANDLER ===
const handleImageError = (e) => {
  e.target.src = "/images/placeholder-image.jpg";
};
</script>

<template>
  <dashboard-layout>
    <main class="px-4 md:px-8 py-[var(--padding-dashboard-section)]">
      <div
        class="card w-full mx-auto px-4 md:px-8 py-8 md:py-12 shadow-lg border border-gray-200 rounded-xl"
      >
        <!-- Breadcrumb -->
        <Breadcrumb
          class="!p-0 mb-4"
          :home="DashboardBreadCrumbBase"
          :model="breadcrumbItems"
        >
          <template #item="{ item, props }">
            <router-link
              v-if="item.route"
              v-slot="{ href, navigate }"
              :to="item.route"
              custom
            >
              <a :href="href" v-bind="props.action" @click="navigate">
                <span class="text-primary font-semibold">{{
                  item?.label && $t(`${item.label}`)
                }}</span>
              </a>
            </router-link>
            <a
              v-else
              :href="item.url"
              :target="item.target"
              v-bind="props.action"
            >
              <span class="text-surface-700 dark:text-surface-0">{{
                item?.label && $t(`${item.label}`)
              }}</span>
            </a>
          </template>
        </Breadcrumb>

        <!-- Loading -->
        <div
          v-if="loading"
          class="flex flex-col items-center justify-center py-16 text-gray-600"
        >
          <i class="pi pi-spin pi-spinner text-4xl text-primary mb-3"></i>
          <p class="text-lg">{{ t("generic.loading") }}</p>
        </div>

        <!-- No Data -->
        <div
          v-else-if="!ad"
          class="flex flex-col items-center justify-center py-16 text-gray-600"
        >
          <i class="pi pi-info-circle text-4xl text-gray-400 mb-2"></i>
          <p>{{ t("ads.not_provided") }}</p>
        </div>

        <!-- Content -->
        <div v-else>
          <!-- Hero Header -->
          <div
            class="bg-gradient-to-r from-gray-50 to-white p-6 md:p-8 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h1 class="text-2xl font-bold text-gray-800 mb-2">
                {{ getTitle }}
              </h1>
              <div class="flex flex-wrap gap-3 text-gray-600 text-sm">
                <div>
                  <span class="font-medium text-gray-700">{{
                    t("dashboard.ads.table.price")
                  }}</span>
                  :
                  <span class="text-gray-900 font-semibold">
                    {{ ad.price || t("ads.not_provided") }}
                  </span>
                </div>

                <div>
                  <span class="font-medium text-gray-700">{{
                    t("dashboard.ads.table.created")
                  }}</span>
                  :
                  <span>{{ formattedCreated }}</span>
                </div>

                <div>
                  <span class="font-medium text-gray-700">{{
                    t("dashboard.ads.table.updated")
                  }}</span>
                  :
                  <span>{{ formattedUpdated }}</span>
                </div>
              </div>

              <!-- Likes / Comments / Featured -->
              <div class="flex flex-wrap gap-4 text-gray-600 text-sm mt-3">
                <div class="flex items-center gap-1">
                  <i class="pi pi-heart text-red-500"></i>
                  <span>{{ ad.ad_likes?.length || 0 }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <i class="pi pi-comments text-blue-500"></i>
                  <span>{{ ad.ad_comments?.length || 0 }}</span>
                </div>
                <div
                  v-if="ad.ad_featured_history?.length"
                  class="flex items-center gap-1 text-yellow-600"
                >
                  <i class="pi pi-star-fill"></i>
                  <span>{{ t("dashboard.ads.featured") }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Ad Owner -->
          <div
            v-if="ad.users"
            class="flex items-center gap-4 bg-gray-50 border border-gray-200 p-4 rounded-lg mb-6"
          >
            <template v-if="ad.users.image">
              <img
                :src="`${MEDIA_URL}/${ad.users.image}`"
                @error="(e) => (e.target.style.display = 'none')"
                class="w-14 h-14 rounded-full object-cover"
              />
            </template>
            <template v-else>
              <div
                class="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold uppercase shadow-sm"
              >
                {{ userInitials }}
              </div>
            </template>

            <div>
              <h3 class="font-semibold text-gray-800">
                {{ ad.users.name || t("ads.user.unknown") }}
              </h3>
              <p class="text-sm text-gray-500">
                {{ ad.users.email || ad.users.phone || "-" }}
              </p>
              <div class="text-xs text-gray-500 mt-1">
                {{ t("dashboard.ads.wallet_balance") }}:
                <span class="font-semibold text-gray-800">
                  {{ ad.users.user_wallet?.[0]?.balance || "0.00" }}
                </span>
              </div>
            </div>
          </div>

          <!-- Body -->
          <div class="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Left: Image Gallery -->
            <div class="lg:col-span-1">
              <div
                class="rounded-xl border border-gray-200 bg-gray-50 p-4"
                v-viewer
              >
                <h3 class="font-semibold text-gray-800 mb-3">
                  {{ t("dashboard.ads.table.image") }}
                </h3>

                <div
                  v-if="hasImages"
                  class="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <img
                    v-for="(img, idx) in ad.ads_images"
                    :key="idx"
                    :src="`${MEDIA_URL}/${img.image}`"
                    class="w-full aspect-square object-cover rounded-lg cursor-zoom-in shadow-sm hover:scale-[1.02] transition-transform"
                    alt="Ad Image"
                    loading="lazy"
                    @error="handleImageError"
                  />
                </div>

                <div
                  v-else
                  class="w-full aspect-video flex items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg"
                >
                  <div class="text-center text-gray-400 text-sm">
                    <i class="pi pi-image text-4xl mb-2"></i>
                    <p>{{ t("ads.not_provided") }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right: Details -->
            <div class="lg:col-span-2 space-y-6">
              <!-- Ad Info -->
              <div
                class="p-6 border border-gray-200 rounded-xl bg-white shadow-sm"
              >
                <h2 class="text-lg font-semibold text-gray-800 mb-4">
                  {{ t("dashboard.ads.details.title") }}
                </h2>

                <div
                  class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700"
                >
                  <div>
                    <label class="block text-sm font-medium text-gray-500">
                      {{ t("dashboard.ads.table.price") }}
                    </label>
                    <p class="text-lg font-semibold">
                      {{ ad.price || t("ads.not_provided") }}
                    </p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-500">
                      {{ t("dashboard.ads.table.created") }}
                    </label>
                    <p class="text-lg font-semibold">{{ formattedCreated }}</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-500">
                      {{ t("dashboard.ads.table.updated") }}
                    </label>
                    <p class="text-lg font-semibold">{{ formattedUpdated }}</p>
                  </div>
                </div>
              </div>

              <!-- Attributes -->
              <div
                v-if="ad?.ad_attributes?.length"
                class="p-6 border border-gray-200 rounded-xl bg-gray-50 shadow-sm"
              >
                <h3 class="text-lg font-semibold text-gray-800 mb-4">
                  {{ t("dashboard.ads.details.attributes") }}
                </h3>

                <div
                  class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"
                >
                  <div
                    v-for="(attr, i) in ad.ad_attributes"
                    :key="i"
                    class="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition"
                  >
                    <p class="text-sm font-medium text-gray-500 mb-1">
                      {{
                        currentLocale === "ar"
                          ? attr.category_attributes?.name
                          : attr.category_attributes?.name_en
                      }}
                    </p>
                    <p class="text-gray-900 font-semibold">
                      {{
                        attr.ad_attribute_options?.[0]
                          ?.category_attributes_values
                          ? currentLocale === "ar"
                            ? attr.ad_attribute_options[0]
                                .category_attributes_values.name
                            : attr.ad_attribute_options[0]
                                .category_attributes_values.name_en
                          : currentLocale === "ar"
                          ? attr.text
                          : attr.text_en
                      }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </dashboard-layout>
</template>
