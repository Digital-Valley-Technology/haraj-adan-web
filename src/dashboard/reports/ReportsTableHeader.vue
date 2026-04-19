<script setup>
import { useI18n } from "vue-i18n";

defineProps({
  total: Number,
  modelValue: String,
  selectedFilter: Object,
  statusFilter: String,
});

const emit = defineEmits([
  "update:modelValue",
  "update:selectedFilter",
  "update:statusFilter",
]);

const { t } = useI18n();

const filterOptions = [
  { name: "reason", label: "dashboard.reports.filter.reason" },
  { name: "ad_id", label: "dashboard.reports.filter.ad_id" },
  { name: "user_id", label: "dashboard.reports.filter.user_id" },
];

const statusOptions = [
  { value: "", label: "dashboard.reports.status.all" },
  { value: "pending", label: "dashboard.reports.status.pending" },
  { value: "reviewed", label: "dashboard.reports.status.reviewed" },
  { value: "resolved", label: "dashboard.reports.status.resolved" },
  { value: "dismissed", label: "dashboard.reports.status.dismissed" },
];
</script>

<template>
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
    <div>
      <h2 class="text-xl font-semibold text-gray-800">
        {{ $t("dashboard.reports.title") }}
      </h2>
      <p class="text-sm text-gray-500">
        {{ $t("dashboard.reports.total", { count: total }) }}
      </p>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <!-- Status Filter -->
      <select
        :value="statusFilter"
        @change="emit('update:statusFilter', $event.target.value)"
        class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#146AAB]"
      >
        <option
          v-for="status in statusOptions"
          :key="status.value"
          :value="status.value"
        >
          {{ $t(status.label) }}
        </option>
      </select>

      <!-- Search Filter -->
      <select
        :value="selectedFilter?.name"
        @change="
          emit(
            'update:selectedFilter',
            filterOptions.find((f) => f.name === $event.target.value)
          )
        "
        class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#146AAB]"
      >
        <option v-for="filter in filterOptions" :key="filter.name" :value="filter.name">
          {{ $t(filter.label) }}
        </option>
      </select>

      <!-- Search Input -->
      <div class="relative">
        <input
          type="text"
          :value="modelValue"
          @input="emit('update:modelValue', $event.target.value)"
          :placeholder="$t('generic.search')"
          class="border border-gray-300 rounded-md px-3 py-2 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-[#146AAB] w-48"
        />
        <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
      </div>
    </div>
  </div>
</template>
