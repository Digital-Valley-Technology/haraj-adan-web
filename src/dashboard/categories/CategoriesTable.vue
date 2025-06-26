<script setup>
  import { RouterLink } from "vue-router";
  defineProps(["categories"]);
</script>

<template>
  <DataTable
    :value="categories"
    paginator
    :rows="10"
    :rowsPerPageOptions="[5, 10, 20, 50]"
    tableStyle="min-width: 50rem"
  >
    <Column field="name" :header="$t('table.name')"></Column>
    <Column field="name_en" :header="$t('table.name_en')"></Column>
    <Column field="parent" :header="$t('dashboard.categories.main_category')">
      <template #body="slotProps">
        <p class="text-sm">
          {{ slotProps?.data?.parent?.name || "__" }}
        </p>
      </template>
    </Column>
    <Column field="image" :header="$t('table.image')">
      <template #body="slotProps">
        <div class="w-[100px] aspect-square me-auto">
          <img
            :src="slotProps?.data?.image"
            :alt="slotProps?.data?.name"
            class="w-full h-full object-cover"
          />
        </div>
      </template>
    </Column>
  </DataTable>
</template>
