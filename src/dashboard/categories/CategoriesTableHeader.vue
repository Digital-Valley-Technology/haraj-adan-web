<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { DashboardBreadCrumbBase } from "../../utils/constants";
import { decode, encode } from "js-base64";
import requestService from "../../services/api/requestService";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();

const props = defineProps([
  "total",
  "modelValue",
  "selectedFilter",
  "addPageLink",
]);
const emit = defineEmits(["update:modelValue", "update:selectedFilter"]);

const router = useRouter();
const route = useRoute();

const goToAddPage = () => router.push(props?.addPageLink);
// Raw breadcrumb items from API + base
const rawBreadcrumb = ref([]);

// Computed → adapt labels to active locale
const breadcrumbItems = computed(() =>
  rawBreadcrumb.value.map((c) => ({
    ...c,
    label: locale.value === "en" ? c.name_en : c.name,
  }))
);

// Filters
const filters = ref([
  { id: 1, name: "name" },
  { id: 2, name: "name_en" },
]);

// Local search & filter proxies
const searchText = ref(props.modelValue || "");
const selectedFilter = ref(filters.value[0]);

// Sync with parent via v-model
watch(searchText, (value) => emit("update:modelValue", value));
watch(selectedFilter, (value) => emit("update:selectedFilter", value));

// Fetch breadcrumb dynamically
const fetchBreadcrumb = async () => {
  try {
    const base = [
      {
        id: null,
        name_en: "Categories",
        name: "الأصناف",
        route: "/dashboard/categories",
      },
    ];

    if (!route.params.parentId) {
      rawBreadcrumb.value = base;
      return;
    }

    const decodedId = decode(route.params.parentId);
    const res = await requestService.getAll(
      `/categories/${decodedId}/breadcrumb`
    );

    const apiCrumbs = Array.isArray(res.data) ? res.data : [];
    rawBreadcrumb.value = [
      ...base,
      ...apiCrumbs.map((c) => ({
        ...c,
        route: {
          name: "subcategories",
          params: { parentId: encode(String(c.id)) },
        },
      })),
    ];
  } catch (error) {
    console.error("Failed to fetch breadcrumb:", error);
    rawBreadcrumb.value = [
      {
        id: null,
        name_en: "Categories",
        name: "الأصناف",
        route: "/dashboard/categories",
      },
    ];
  }
};

onMounted(fetchBreadcrumb);
watch(() => route.params.parentId, fetchBreadcrumb);
</script>

<template>
  <div>
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

    <!-- Search + Filter + Add -->
    <div
      class="flex flex-col items-stretch md:flex-row md:justify-between md:items-center mb-4 pb-4 border-b border-gray-300"
    >
      <div
        class="flex flex-col items-stretch md:flex-row md:items-center mb-4 md:mb-0"
      >
        <InputText
          v-model="searchText"
          type="text"
          :placeholder="$t('dashboard.search')"
          size="small"
          class="!bg-slate-50 !rounded-lg mb-4 md:mb-0 md:me-4"
        />
        <Select
          id="platform-language"
          v-model="selectedFilter"
          :options="filters"
          class="!bg-slate-50 !rounded-lg w-full"
          fluid
          size="small"
          :placeholder="$t('dashboard.search-filter')"
        >
          <template #value="slotProps">
            <div v-if="slotProps.value">
              {{ $t(`table.${slotProps?.value.name}`) }}
            </div>
            <div v-else>{{ slotProps.placeholder }}</div>
          </template>
          <template #option="slotProps">
            <div>{{ $t(`table.${slotProps?.option.name}`) }}</div>
          </template>
          <template #dropdownicon>
            <i class="pi pi-filter" />
          </template>
        </Select>
      </div>

      <div class="flex gap-2">
        <Button
          :label="$t('dashboard.total', { total })"
          severity="contrast"
          size="small"
          variant="outlined"
        />

        <button class="custom-base-button" @click="goToAddPage">
          <i class="pi pi-plus"></i>
          {{ $t("dashboard.categories.form.add_category") }}
        </button>
      </div>
    </div>
  </div>
</template>
