<script setup>
  import { ref } from "vue";
  defineProps(["total"]);

  const selectedFilter = ref();
  const filters = ref([
    {
      id: 1,
      name: "name",
    },
    {
      id: 2,
      name: "name_en",
    },
  ]);
</script>

<template>
  <div
    class="flex flex-col items-stretch md:flex-row md:justify-between md:items-center mb-4 pb-4 border-b border-gray-300"
  >
    <div
      class="flex flex-col items-stretch md:flex-row md:items-center mb-4 md:mb-0"
    >
      <InputText
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
          <div v-if="slotProps.value" class="flex items-center">
            <div>
              {{ $t(`table.${slotProps?.value.name}`) }}
            </div>
          </div>
          <div v-else>
            {{ slotProps.placeholder }}
            <span class="text-slate-50">-</span>
          </div>
        </template>
        <template #option="slotProps">
          <div>{{ $t(`table.${slotProps?.option.name}`) }}</div>
        </template>
        <template #dropdownicon>
          <i class="pi pi-filter" />
        </template>
      </Select>
    </div>
    <Button
      :label="$t('dashboard.total', { total })"
      severity="contrast"
      size="small"
      variant="outlined"
    />
  </div>
</template>
