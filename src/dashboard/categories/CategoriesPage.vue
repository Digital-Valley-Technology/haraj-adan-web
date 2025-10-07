<script setup>
import DashboardLayout from "../../Layout/DashboardLayout.vue";
import DeleteDialog from "../../components/DeleteDialog.vue";
import CategoriesTable from "./CategoriesTable.vue";
import NoData from "../../components/NoData.vue";
import CategoriesTableHeader from "./CategoriesTableHeader.vue";
import { onMounted, computed, ref, watch } from "vue";
import { useCategoriesStore } from "../../store/category";
import { useDebounceFn } from "@vueuse/core";
import { showError, showSuccess } from "../../utils/notifications";
import requestService from "../../services/api/requestService";
import { useRoute } from "vue-router";
import { decode } from "js-base64";

const route = useRoute();
const categoryStore = useCategoriesStore();

const breadcrumb = ref([]);
const isSubmitting = ref(false);
const selectedCategoryId = ref(null);
const isDeleteDialogOpen = ref(false);

// Search/filter state
const searchText = ref("");
const selectedFilter = ref({ name: "name" });

// parentId is Base64 string in route → decode only for API calls
const parentId = computed(() => route.params.parentId || null);

const addPageLink = computed(() => {
  return parentId.value
    ? `/dashboard/categories/add/${parentId.value}`
    : "/dashboard/categories/add";
});

const fetchBreadcrumb = async () => {
  try {
    const baseBreadcrumb = [
      { id: null, name_en: "Categories", name: "الأصناف" },
    ];

    if (!parentId.value) {
      breadcrumb.value = baseBreadcrumb;
      return;
    }

    const decodedId = decode(parentId.value);
    const res = await requestService.getAll(
      `/categories/${decodedId}/breadcrumb`
    );

    const apiBreadcrumb = Array.isArray(res.data) ? res.data : [];
    breadcrumb.value = [baseBreadcrumb[0], ...apiBreadcrumb];
  } catch (error) {
    console.error("Failed to fetch breadcrumb:", error);
    breadcrumb.value = [{ id: null, name_en: "Categories", name: "الأصناف" }];
  }
};

const fetchData = () => {
  const decodedId = parentId.value ? Number(decode(parentId.value)) : null;

  categoryStore.fetchCategories({
    page: categoryStore.page,
    limit: categoryStore.limit,
    search: searchText.value,
    filterBy: selectedFilter.value?.name,
    parentId: decodedId,
  });
};

const handleDelete = async () => {
  if (!selectedCategoryId.value) return;
  isSubmitting.value = true;

  try {
    const response = await requestService.delete(
      "/categories",
      selectedCategoryId.value
    );
    showSuccess(
      response?.message || t("dashboard.categories.form.deleted_successfully")
    );
    fetchData();
  } catch (error) {
    showError(error || t("dashboard.categories.form.delete_failed"));
  } finally {
    isDeleteDialogOpen.value = false;
    isSubmitting.value = false;
  }
};

const processDelete = (cat) => {
  selectedCategoryId.value = cat?.id;
  isDeleteDialogOpen.value = true;
};

onMounted(() => {
  fetchData();
  fetchBreadcrumb();
});

// Refetch on search/filter
watch(
  [searchText, selectedFilter],
  useDebounceFn(() => {
    categoryStore.page = 1;
    fetchData();
  }, 500)
);

// Refetch on parentId change (drill down categories)
watch(parentId, () => {
  categoryStore.page = 1;
  fetchData();
  fetchBreadcrumb();
});

const categories = computed(() => categoryStore.getCategories);
const total = computed(() => categoryStore.getTotal);
</script>

<template>
  <dashboard-layout>
    <main class="py-[var(--padding-dashboard-section)] custom-container">
      <div
        class="card min-h-[500px] w-full mx-auto px-4 md:px-8 py-8 md:py-12 shadow-lg border border-gray-200 rounded-lg"
      >
        <categories-table-header
          :total="total"
          v-model:modelValue="searchText"
          v-model:selectedFilter="selectedFilter"
          :addPageLink="addPageLink"
        />

        <categories-table
          v-if="categories?.length > 0"
          :categories="categories"
          @delete="(cat) => processDelete(cat)"
          @fetch-categories="fetchData()"
        />

        <no-data
          v-else
          class="mt-12"
          :content="$t('dashboard.categories.no-data')"
          :button-text="$t('dashboard.categories.create-category')"
          :button-link="addPageLink"
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

<style scoped>
main {
  min-height: calc(100vh - var(--padding-dashboard-layout-top));
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
