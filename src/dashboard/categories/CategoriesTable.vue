<script setup>
import { encode } from "js-base64";
import { useRouter } from "vue-router";
import { MEDIA_URL } from "../../services/axios";
import { useCategoriesStore } from "../../store/category";
import { useLocaleText } from "../../utils/useLocaleText";

defineProps(["categories"]);
const emit = defineEmits(["delete", "fetchCategories"]);

const categoryStore = useCategoriesStore();
const localeText = useLocaleText();
const router = useRouter();

const handleEdit = (category) =>
  router.push({
    name: "edit-category",
    params: { categoryId: encode(category?.id) },
  });

const handleAttributes = (category) => {
  router.push({
    name: "category-attributes",
    params: { categoryId: encode(category.id) },
  });
};

const handleDelete = (category) => emit("delete", category);
</script>

<template>
  <DataTable
    :value="categories"
    paginator
    :rowsPerPageOptions="[5, 10, 20, 50]"
    tableStyle="min-width: 50rem"
    :rows="categoryStore.limit"
    :totalRecords="categoryStore.total"
    :first="(categoryStore.page - 1) * categoryStore.limit"
    @page="
      (e) => {
        if (e.rows !== categoryStore.limit) {
          categoryStore.page = 1;
          categoryStore.limit = e.rows;
        } else {
          categoryStore.page = e.page + 1;
        }
        emit('fetchCategories');
      }
    "
    :loading="categoryStore?.loading"
  >
    <Column field="name" :header="$t('table.name')"></Column>
    <Column field="name_en" :header="$t('table.name_en')"></Column>
    <Column field="parent" :header="$t('dashboard.categories.main_category')">
      <template #body="slotProps">
        <p class="text-sm">
          {{
            slotProps?.data?.categories
              ? localeText(
                  slotProps?.data?.categories?.name,
                  slotProps?.data?.categories?.name_en
                )
              : "__"
          }}
        </p>
      </template>
    </Column>
    <Column field="image" :header="$t('table.image')">
      <template #body="slotProps">
        <div class="w-[100px] aspect-square me-auto">
          <img
            :src="`${MEDIA_URL}/${slotProps?.data?.image}`"
            :alt="slotProps?.data?.name"
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </template>
    </Column>
    <!-- Action buttons -->
    <Column :header="$t('table.actions')">
      <template #body="slotProps">
        <div class="flex gap-2">
          <Button
            icon="pi pi-sliders-h"
            severity="secondary"
            :label="$t('dashboard.actions.manage-attributes')"
            @click="() => handleAttributes(slotProps.data)"
            rounded
            size="small"
          />

          <Button
            icon="pi pi-pencil"
            severity="info"
            :label="$t('dashboard.actions.edit')"
            @click="() => handleEdit(slotProps.data)"
            rounded
            size="small"
          />
          <Button
            icon="pi pi-trash"
            severity="danger"
            :label="$t('dashboard.actions.delete')"
            @click="() => handleDelete(slotProps.data)"
            rounded
            size="small"
          />
        </div>
      </template>
    </Column>
  </DataTable>
</template>
