<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { DashboardBreadCrumbBase } from "../../utils/constants";

const props = defineProps({
  total: {
    type: Number,
    default: 0,
  },
});

const router = useRouter();

const goToAddPage = () => {
  router.push("/dashboard/banners/add-banner");
};

const breadcrumbItems = ref([{ label: "sidebar.banners" }]);
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
              {{ item?.label && $t(item.label) }}
            </span>
          </a>
        </router-link>
        <a v-else :href="item.url" :target="item.target" v-bind="props.action">
          <span class="text-surface-700 dark:text-surface-0">
            {{ item?.label && $t(item.label) }}
          </span>
        </a>
      </template>
    </Breadcrumb>

    <div
      class="flex flex-col md:flex-row justify-end items-center mb-4 pb-4 border-b border-gray-300 gap-4"
    >
      <!-- Left side: total -->
      <Button
        :label="$t('dashboard.total', { total: props.total })"
        severity="contrast"
        size="small"
        variant="outlined"
      />

      <!-- Right side: add button -->
      <button class="custom-base-button" @click="goToAddPage">
        <i class="pi pi-plus"></i>
        {{ $t("dashboard.banners.add") }}
      </button>
    </div>
  </div>
</template>
