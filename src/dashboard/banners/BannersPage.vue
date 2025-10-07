<script setup>
import DashboardLayout from "../../Layout/DashboardLayout.vue";
import DeleteDialog from "../../components/DeleteDialog.vue";
import NoData from "../../components/NoData.vue";

import { onMounted, computed, ref, watch } from "vue";
import { useDebounceFn } from "@vueuse/core";
import { showError, showSuccess } from "../../utils/notifications";
import requestService from "../../services/api/requestService";
import BannersTable from "./BannersTable.vue";
import { useBannersStore } from "../../store/banners";
import BannersTableHeader from "./BannersTableHeader.vue";
import { useI18n } from "vue-i18n";

const bannerStore = useBannersStore();
const { t } = useI18n();

const isSubmitting = ref(false); // shared for delete + update
const isReordering = ref(false);
const isFetching = ref(false); // for pagination & search

const selectedBannerId = ref(null); // or passed as a prop if used inside a row

// Delete dialog state
const isDeleteDialogOpen = ref(false);

// Local search/filter state
const searchText = ref("");
const selectedFilter = ref({ name: "name" }); //  default filter set

// Fetch banners from store
const fetchData = async () => {
  isFetching.value = true;
  try {
    await bannerStore.fetchBanners({
      page: bannerStore.page,
      limit: bannerStore.limit,
    });
  } catch (error) {
    showError(error || "Failed to fetch banners.");
  } finally {
    isFetching.value = false;
  }
};

const handleDelete = async () => {
  if (!selectedBannerId.value) return;

  isSubmitting.value = true;

  try {
    const response = await requestService.delete(
      "/banners",
      selectedBannerId.value
    );

    showSuccess(
      response?.message || t("dashboard.banners.form.deleted_successfully")
    );

    fetchData(); // Fetch updated banners after delete
  } catch (error) {
    showError(error || t("dashboard.banners.form.delete_failed"));
  } finally {
    isDeleteDialogOpen.value = false; // Close dialog
    isSubmitting.value = false;
  }
};

const handleImageUpdate = async ({ id, image }) => {
  if (!id || !image) return;

  const formData = new FormData();
  formData.append("image", image);

  isSubmitting.value = true;
  try {
    const res = await requestService.update("/banners", id, formData);
    showSuccess(res?.message || t("dashboard.banners.image_updated"));
    await fetchData();
  } catch (error) {
    showError(error || t("dashboard.banners.update_failed"));
  } finally {
    isSubmitting.value = false;
  }
};

const handleSaveOrder = async (orderedPayload) => {
  isReordering.value = true;
  try {
    const res = await requestService.create("/banners/reorder", orderedPayload);
    showSuccess(res?.message || t("dashboard.banners.success"));
    await fetchData(); // refresh after saving order
  } catch (error) {
    showError(error || t("dashboard.banners.error"));
  } finally {
    isReordering.value = false;
  }
};

const processDelete = (cat) => {
  selectedBannerId.value = cat?.id;
  isDeleteDialogOpen.value = true;
};

onMounted(fetchData);

// Debounced fetch on search/filter change
watch(
  [searchText, selectedFilter],
  useDebounceFn(() => {
    bannerStore.page = 1; // reset to page 1 on filter/search change
    fetchData();
  }, 500)
);

// Computed values
const banners = computed(() => bannerStore.getBanners);
const total = computed(() => bannerStore.getTotal); // use total from store
</script>

<template>
  <dashboard-layout>
    <main class="py-[var(--padding-dashboard-section)] custom-container">
      <div
        class="card min-h-[500px] w-full mx-auto px-4 md:px-8 py-8 md:py-12 shadow-lg border border-gray-200 rounded-lg"
      >
        <banners-table-header :total="total" />

        <BannersTable
          v-if="banners?.length > 0"
          :banners="banners"
          :loading-reorder="isReordering"
          :loading-update="isSubmitting"
          :loading-fetch="isFetching"
          @delete="(banner) => processDelete(banner)"
          @update="handleImageUpdate"
          @fetch-banners="fetchData()"
          @saveOrder="handleSaveOrder"
        />

        <no-data
          v-else
          class="mt-12"
          :content="$t('dashboard.banners.no-data')"
          :button-text="$t('dashboard.banners.create-banner')"
          button-link="/dashboard/new-banner"
        />
      </div>
    </main>
    <DeleteDialog
      v-model="isDeleteDialogOpen"
      :content="$t('generic.delete_confirmation')"
      @confirm="handleDelete"
    />
  </dashboard-layout>
</template>
