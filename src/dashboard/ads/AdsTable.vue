<script setup>
import Viewer from "viewerjs";
import "viewerjs/dist/viewer.css";
import { MEDIA_URL } from "../../services/axios";
import { useAdsStore } from "../../store/ads";
import { useI18n } from "vue-i18n";
import imagePlaceholder from "../../assets/no image placeholder.jpeg";
import { useRouter } from "vue-router";
import { encode } from "js-base64";
import { computed } from "vue";

defineProps(["ads", "adsStatuses"]);
const emit = defineEmits(["delete", "fetchAds"]);

const { t, locale } = useI18n();
const adsStore = useAdsStore();
const router = useRouter();

let currentViewerInstance = null; // To hold the dynamically created instance

const NOT_PROVIDED = t("dashboard.ads.not_provided");

const currentLocale = computed(() => locale.value);

// Navigation
const handleNavigation = (param, routeName, paramName) =>
  router.push({
    name: routeName,
    params: { [paramName]: encode(param) },
  });

// Delete ad
const handleDelete = (ad) => emit("delete", ad);

// Get ad image (first one or placeholder)
const getAdImage = (ad) => {
  if (ad?.ads_images?.length > 0)
    return `${MEDIA_URL}/${ad.ads_images[0].image}`;
  return imagePlaceholder;
};

// Format date
const formatDate = (date) => {
  if (!date) return NOT_PROVIDED;
  return new Date(date).toLocaleDateString(locale.value, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Cleanup old viewer instance before creating a new one
const destroyViewer = () => {
  if (currentViewerInstance) {
    currentViewerInstance.destroy();
    currentViewerInstance = null;

    // Remove the temporary container
    const tempViewer = document.getElementById("temp-viewer-container");
    if (tempViewer) {
      document.body.removeChild(tempViewer);
    }
  }
};

// ---  Open viewer dynamically for a specific ad ---
const openViewer = (ad) => {
  if (!ad?.ads_images?.length) return; // Exit if no images

  // 1. Destroy any existing instance
  destroyViewer();

  // 2. Create a temporary container in the body
  const tempContainer = document.createElement("div");
  tempContainer.id = "temp-viewer-container";
  tempContainer.classList.add("hidden");
  document.body.appendChild(tempContainer);

  // 3. Populate the container with ALL images of the clicked ad
  ad.ads_images.forEach((img, index) => {
    const imgElement = document.createElement("img");
    imgElement.src = `${MEDIA_URL}/${img.image}`;
    imgElement.alt = `${ad.title} - Image ${index + 1}`;
    tempContainer.appendChild(imgElement);
  });

  // 4. Initialize Viewer.js on the temporary container
  currentViewerInstance = new Viewer(tempContainer, {
    toolbar: true,
    navbar: ad.ads_images.length > 1, // Show navbar if more than one image
    title: false,
    movable: true,
    zoomable: true,
    rotatable: false,
    scalable: false,
    transition: true,
    hidden() {
      // Clean up when the viewer is closed
      destroyViewer();
    },
  });

  // 5. Show the viewer
  currentViewerInstance.show();
};
// --- END UPDATED VIEWER LOGIC ---
</script>

<template>
  <DataTable
    :value="ads"
    paginator
    :rowsPerPageOptions="[5, 10, 20, 50]"
    tableStyle="min-width: 70rem"
    :rows="adsStore.limit"
    :totalRecords="adsStore.total"
    :first="(adsStore.page - 1) * adsStore.limit"
    @page="
      (e) => {
        if (e.rows !== adsStore.limit) {
          adsStore.page = 1;
          adsStore.limit = e.rows;
        } else {
          adsStore.page = e.page + 1;
        }
        emit('fetchAds');
      }
    "
    :loading="adsStore.loading"
  >
    <Column :header="$t('dashboard.ads.table.image')" style="width: 120px">
      <template #body="{ data }">
        <div class="relative w-20 h-20">
          <img
            v-if="data?.ads_images?.length"
            :src="getAdImage(data)"
            alt="Ad image"
            class="w-20 h-20 object-cover rounded-md border cursor-pointer transition-all hover:opacity-80"
            @click="openViewer(data)"
            @error="(e) => (e.target.src = imagePlaceholder)"
          />
          <img
            v-else
            :src="imagePlaceholder"
            alt="Placeholder"
            class="w-20 h-20 object-cover rounded-md border border-gray-200"
          />

          <div
            v-if="data?.ads_images?.length"
            class="absolute top-0 right-0 p-1 bg-black bg-opacity-50 text-white rounded-bl-md"
            :title="
              data.ads_images.length > 1
                ? $t('dashboard.ads.actions.view_gallery')
                : $t('dashboard.ads.actions.view_image')
            "
          >
            <i class="pi pi-camera text-xs"></i>
            <span v-if="data.ads_images.length > 1" class="text-xs ml-1">{{
              data.ads_images.length
            }}</span>
          </div>
        </div>
      </template>
    </Column>

    <Column field="title" :header="$t('dashboard.ads.table.title')">
      <template #body="{ data }">
        <span>{{ data?.title || $t("dashboard.ads.not_provided") }}</span>
      </template>
    </Column>

    <Column field="price" :header="$t('dashboard.ads.table.price')">
      <template #body="{ data }">
        <span class="font-semibold text-gray-700">
          {{
            `${data?.price} ${
              currentLocale == "ar"
                ? data?.currencies?.name
                : data?.currencies?.name_en
            }` || $t("dashboard.ads.not_provided")
          }}
        </span>
      </template>
    </Column>

    <Column :header="$t('dashboard.ads.table.user')">
      <template #body="{ data }">
        <span>
          {{
            data?.users?.name ||
            data?.users?.email ||
            $t("dashboard.ads.not_provided")
          }}
        </span>
      </template>
    </Column>

    <Column :header="$t('dashboard.ads.table.status')">
      <template #body="{ data }">
        <Select
          v-model="data.status_id"
          :options="adsStatuses"
          @change="$emit('update-status', data?.id, data?.status_id)"
          :optionLabel="currentLocale == 'ar' ? 'name' : 'name_en'"
          class="w-full"
          optionValue="id"
        >
        </Select>
      </template>
    </Column>

    <Column field="created" :header="$t('dashboard.ads.table.created')">
      <template #body="{ data }">
        <span>{{ formatDate(data?.created) }}</span>
      </template>
    </Column>

    <Column :header="$t('dashboard.ads.table.actions')">
      <template #body="{ data }">
        <div class="flex gap-2">
          <Button
            class="w-[max-content]"
            severity="info"
            :label="$t('dashboard.ads.actions.details')"
            rounded
            @click="
              () => handleNavigation(data?.id, 'admin-ad-details', 'adId')
            "
            size="small"
          />
          <Button
            icon="pi pi-trash"
            severity="danger"
            :label="$t('dashboard.ads.actions.delete')"
            @click="() => handleDelete(data)"
            rounded
            size="small"
          />
        </div>
      </template>
    </Column>
  </DataTable>
</template>
