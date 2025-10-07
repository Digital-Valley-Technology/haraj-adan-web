<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import requestService from "../../../services/api/requestService";
import { encode } from "js-base64";
import { DashboardBreadCrumbBase } from "../../../utils/constants";

const props = defineProps({
  categoryId: String,
  total: Number,
});

const emit = defineEmits(["onAdd"]);

const { locale } = useI18n();

const rawBreadcrumb = ref([]);

const base = [
  {
    id: null,
    name_en: "Categories",
    name: "الأصناف",
    route: "/dashboard/categories",
  },
];

const breadcrumbItems = computed(() =>
  rawBreadcrumb.value.map((c) => ({
    ...c,
    label: locale.value === "en" ? c.name_en : c.name,
  }))
);

const fetchBreadcrumb = async () => {
  try {
    if (!props?.categoryId) {
      rawBreadcrumb.value = base;
      return;
    }

    const res = await requestService.getAll(
      `/categories/${props?.categoryId}/breadcrumb`
    );

    const apiCrumbs = Array.isArray(res.data) ? res.data : [];
    const lastCategory = apiCrumbs[apiCrumbs.length - 1];

    rawBreadcrumb.value = [
      ...base,
      // keep only the parent categories (exclude the last one)
      ...apiCrumbs.slice(0, -1).map((c) => ({
        ...c,
        route: {
          name: "subcategories",
          params: { parentId: encode(String(c.id)) },
        },
      })),
      // replace last crumb with "Attributes (Category)"
      {
        id: null,
        name_en: `Attributes (${lastCategory?.name_en || ""})`,
        name: `الخصائص (${lastCategory?.name || ""})`,
        route: null,
      },
    ];
  } catch (error) {
    console.error("Failed to fetch breadcrumb:", error);
    rawBreadcrumb.value = base;
  }
};

onMounted(fetchBreadcrumb);
watch(() => props?.categoryId, fetchBreadcrumb);
</script>

<template>
  <div class="flex justify-between items-center mb-4">
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
            <span :class="[item.icon, 'text-color']" />
            <span class="text-primary font-semibold">
              {{ item?.label }}
            </span>
          </a>
        </router-link>
        <a v-else :href="item.url" :target="item.target" v-bind="props.action">
          <span class="text-surface-700 dark:text-surface-0">
            {{ item?.label }}
          </span>
        </a>
      </template>
    </Breadcrumb>

    <div class="flex gap-2">
      <Button
        :label="$t('dashboard.total', { total })"
        severity="contrast"
        size="small"
        variant="outlined"
      />
      <button class="custom-base-button" @click="emit('onAdd')">
        <i class="pi pi-plus"></i>
        {{ $t("dashboard.categories.attributes.add") }}
      </button>
    </div>
  </div>
</template>
