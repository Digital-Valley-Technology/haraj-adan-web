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

const categoryStore = useCategoriesStore();

const isSubmitting = ref(false);
const selectedCategoryId = ref(null); // or passed as a prop if used inside a row

// Delete dialog state
const isDeleteDialogOpen = ref(false);

// Local search/filter state
const searchText = ref("");
const selectedFilter = ref({ name: "name" }); //  default filter set

// Fetch categories from store
const fetchData = () => {
  categoryStore.fetchCategories({
    page: categoryStore.page,
    limit: categoryStore.limit,
    search: searchText.value,
    filterBy: selectedFilter.value?.name,
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

    fetchData(); // Fetch updated categories after delete
  } catch (error) {
    showError(error?.message || t("dashboard.categories.form.delete_failed"));
  } finally {
    isDeleteDialogOpen.value = false; // Close dialog
    isSubmitting.value = false;
  }
};

const processDelete = (cat) => {
  selectedCategoryId.value = cat?.id;
  isDeleteDialogOpen.value = true;
};

onMounted(fetchData);

// Debounced fetch on search/filter change
watch(
  [searchText, selectedFilter],
  useDebounceFn(() => {
    categoryStore.page = 1; // reset to page 1 on filter/search change
    fetchData();
  }, 500)
);

// Computed values
const categories = computed(() => categoryStore.getCategories);
const total = computed(() => categoryStore.getTotal); // use total from store
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
        />
        <categories-table
          v-if="categories?.length > 0"
          :categories="categories"
          @delete="(cat) => processDelete(cat)"
        />
        <no-data
          v-else
          class="mt-12"
          :content="$t('dashboard.categories.no-data')"
          :button-text="$t('dashboard.categories.create-category')"
          button-link="/dashboard/new-category"
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
