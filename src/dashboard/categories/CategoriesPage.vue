<script setup>
  import DashboardLayout from "../../Layout/DashboardLayout.vue";
  import CategoriesTable from "./CategoriesTable.vue";
  import NoData from "../../components/NoData.vue";
  import CategoriesTableHeader from "./CategoriesTableHeader.vue";
  import { onMounted, computed } from "vue";
  import { useCategoriesStore } from "../../store/category";

  const categoryStore = useCategoriesStore();
  onMounted(async () => {
    categoryStore.fetchCategories({
      page: 1,
      limit: 10,
    });
  });

  const categories = computed(() => categoryStore?.getCategories);
  const total = computed(() => categoryStore?.getCategories?.length);
</script>

<template>
  <dashboard-layout>
    <main class="py-[var(--padding-dashboard-section)] custom-container">
      <div
        v-if="categories?.length > 0"
        class="card min-h-[500px] w-full mx-auto px-4 md:px-8 py-8 md:py-12 shadow-lg border border-gray-200 rounded-lg"
      >
        <categories-table-header :total="total"></categories-table-header>
        <categories-table :categories="categories"></categories-table>
      </div>
      <no-data
        v-else
        class="mt-12"
        :content="$t('dashboard.categories.no-data')"
        :button-text="$t('dashboard.categories.create-category')"
        button-link="/dashboard/new-category"
      ></no-data>
    </main>
  </dashboard-layout>
</template>

<style scoped>
  main {
    min-height: calc(100vh - var(--padding-dashboard-layout-top));
    display: flex;
    flex-direction: column;
    align-items: center;
    /* justify-content: center; */
    flex-direction: column;
  }
</style>
