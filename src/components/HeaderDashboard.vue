<template>
  <div
    :class="`dashboard-header bg-white shadow-lg z-50 fixed ${
      desktopSidebarVisible && 'p-start'
    }`"
  >
    <Menubar class="w-full custom-container !border-none h-[80px] !py-0 !px-0">
      <template #start>
        <div class="flex items-center gap-2">
          <h3>
            {{ $t("header.greeting") }} <span> {{ loggedInUser?.name }} </span>
          </h3>
        </div>
      </template>

      <template #end>
        <div class="flex items-center">
          <div
            class="p-1 border border-[var(--dark-bg)] rounded-full flex justify-between items-center w-[70px]"
            @click="toggleProfile"
          >
            <i
              class="pi pi-chevron-down text-[var(--dark-bg)]"
              style="font-size: 0.7rem"
            ></i>
            <Button
              type="button"
              severity="contrast"
              rounded
              icon="pi pi-user"
              size="small"
              aria-haspopup="true"
              aria-controls="overlay_menu"
              class="!h-[24px] !w-[24px] !text-white !bg-[var(--dark-bg)] !border-[var(--dark-bg)]"
            />
          </div>
          <!-- mobile menu toggle -->
          <div class="lg:hidden ms-4">
            <i
              class="pi pi-bars !border-none"
              @click="toggleSidebarVisibility"
            ></i>
          </div>
          <!-- desktop menu toggle -->
          <div
            class="hidden lg:block ms-4 cursor-pointer"
            @click="toggleDesktopSidebarVisibility"
          >
            <i class="pi pi-bars !border-none"></i>
          </div>
        </div>
        <Menu ref="menu" id="overlay_menu" :model="profileItems" :popup="true">
          <template #item="{ item }">
            <router-link v-if="item.link" :to="item.link">
              <span class="block w-full py-2 px-3 cursor-pointer text-sm">
                <span :class="item.icon" class="me-3" />
                <span>{{ $t(item.label) }}</span>
              </span>
            </router-link>
            <span
              v-else-if="loggedInUser"
              @click="logout"
              class="border-t block w-full py-2 px-3 cursor-pointer text-sm"
              v-ripple
            >
              <span :class="item.icon" class="text-red-500 me-3" />
              <span class="text-red-500">{{ $t(item.label) }}</span>
            </span>
          </template>
        </Menu>
      </template>
    </Menubar>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useGeneralStore } from "../store/general";
import { dashboardProfileItems } from "../utils/constants";
import { useAuthStore } from "../store/auth";

const generalStore = useGeneralStore();
const authStore = useAuthStore();
const router = useRouter();

const menu = ref();
const profileItems = ref(dashboardProfileItems);

const toggleProfile = (event) => {
  menu.value.toggle(event);
};

const desktopSidebarVisible = computed(
  () => generalStore?.getDesktopSidebarVisible
);

const toggleSidebarVisibility = () => {
  generalStore?.toggleSidebarVisible();
};

const toggleDesktopSidebarVisibility = () => {
  generalStore?.toggleDesktopSidebarVisibility();
};

const loggedInUser = computed(() => authStore?.getUser);

const logout = async () => {
  await authStore.logout();
  router.replace("/login");
};
</script>

<style scoped>
.dashboard-header {
  top: 0;
  right: 0;
  width: 100%;
  transition: width 0.35s ease-in-out;
}

@media screen and (min-width: 1024px) {
  .p-start {
    width: calc(100% - var(--sidebar-width)) !important;
  }
}

body.ar .dashboard-header {
  right: unset;
  left: 0;
}
</style>
