<script setup>
  import AppSidebar from "../components/AppSidebar.vue";
  import AppSidebarMobile from "../components/AppSidebarMobile.vue";
  import HeaderDashboard from "../components/HeaderDashboard.vue";
  import { computed } from "vue";
  import { useGeneralStore } from "../store/general";

  const generalStore = useGeneralStore();

  const desktopSidebarVisible = computed(
    () => generalStore?.getDesktopSidebarVisible
  );
</script>

<template>
  <div>
    <main
      :class="`pt-[var(--padding-dashboard-layout-top)] ${
        desktopSidebarVisible && 'padding-start'
      }`"
    >
      <header-dashboard></header-dashboard>
      <slot></slot>
    </main>
    <!-- Sidebar -->
    <app-sidebar class="hidden lg:block"></app-sidebar>
    <app-sidebar-mobile class="lg:hidden"></app-sidebar-mobile>
  </div>
</template>

<style scoped>
  main {
    transition: padding 0.35s ease-in-out;
  }
  @media screen and (min-width: 1024px) {
    .padding-start {
      padding-inline-start: var(--sidebar-width) !important;
    }
  }
</style>
