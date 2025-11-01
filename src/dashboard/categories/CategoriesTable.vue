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

const handleNavigation = (param, routeName, paramName) =>
  router.push({
    name: routeName,
    params: { [paramName]: encode(param) },
  });

const handleDelete = (category) => emit("delete", category);
</script>

<template>
  <DataTable
    :value="categories"
    paginator
    :rowsPerPageOptions="[2, 5, 10, 20, 50]"
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
        <div class="w-[64px] aspect-square me-auto">
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
            :label="$t('dashboard.categories.actions.attributes')"
            @click="
              () =>
                handleNavigation(
                  slotProps.data?.id,
                  'category-attributes',
                  'categoryId'
                )
            "
            rounded
            size="small"
          />

          <!-- <Button
            severity="info"
            :label="$t('dashboard.categories.actions.sub_categories')"
            :badge="String(slotProps.data?._count?.other_categories || 0)"
            badgeSeverity="danger"
            @click="
              () =>
                handleNavigation(
                  slotProps.data?.id,
                  'subcategories',
                  'parentId'
                )
            "
            rounded
            size="small"
          /> -->

          <div class="relative inline-block">
            <Button
              icon="pi pi-list"
              severity="info"
              :label="$t('dashboard.categories.actions.sub_categories')"
              @click="
                () =>
                  handleNavigation(
                    slotProps.data?.id,
                    'subcategories',
                    'parentId'
                  )
              "
              rounded
              size="small"
            />
            <span
              class="absolute -top-2 -left-2 bg-blue-400 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow"
            >
              {{ slotProps.data?._count?.other_categories || 0 }}
            </span>
          </div>

          <Button
            icon="pi pi-pencil"
            severity="info"
            :label="$t('dashboard.actions.edit')"
            @click="
              () =>
                handleNavigation(
                  slotProps.data?.id,
                  'edit-category',
                  'categoryId'
                )
            "
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
