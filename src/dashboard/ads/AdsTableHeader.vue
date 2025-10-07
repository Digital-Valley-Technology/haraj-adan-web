<script setup>
import { ref, watch } from "vue";
import { DashboardBreadCrumbBase } from "../../utils/constants";

// Props & emits for v-model support
const props = defineProps(["total", "modelValue", "selectedFilter"]);
const emit = defineEmits(["update:modelValue", "update:selectedFilter"]);

const breadcrumbItems = ref([{ label: "sidebar.ads" }]);

const filters = ref([
  { id: 1, name: "title" },
  { id: 2, name: "title_en" },
  { id: 2, name: "price" },
]);

// Local search & filter proxies
const searchText = ref(props.modelValue || "");
const selectedFilter = ref(filters.value[0]);

// Sync with parent via v-model
watch(searchText, (value) => emit("update:modelValue", value));
watch(selectedFilter, (value) => emit("update:selectedFilter", value));
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
            <span class="text-primary font-semibold">{{
              item?.label && $t(`${item.label}`)
            }}</span>
          </a>
        </router-link>
        <a v-else :href="item.url" :target="item.target" v-bind="props.action">
          <span class="text-surface-700 dark:text-surface-0">{{
            item?.label && $t(`${item.label}`)
          }}</span>
        </a>
      </template>
    </Breadcrumb>

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
          id="ads-filter"
          v-model="selectedFilter"
          :options="filters"
          class="!bg-slate-50 !rounded-lg w-full"
          fluid
          size="small"
          :placeholder="$t('dashboard.search-filter')"
        >
          <template #value="slotProps">
            <div v-if="slotProps.value" class="flex items-center">
              <div>
                {{ $t(`dashboard.ads.table.${slotProps?.value.name}`) }}
              </div>
            </div>
            <div v-else>
              {{ slotProps.placeholder }}
              <span class="text-slate-50">-</span>
            </div>
          </template>

          <template #option="slotProps">
            <div>
              {{ $t(`dashboard.ads.table.${slotProps?.option.name}`) }}
            </div>
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
      </div>
    </div>
  </div>
</template>
