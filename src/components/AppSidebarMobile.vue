<template>
  <Drawer
    class="!w-[var(--sidebar-width)] !border-none"
    v-model:visible="visible"
    header="Drawer"
    :position="t.locale.value == 'en' ? 'left' : 'right'"
  >
    <aside>
      <div>
        <img
          src="/logo.png"
          alt="logo"
          class="w-[120px] object-contain mx-auto"
        />
      </div>
      <Menu
        class="!bg-transparent !border-none"
        ref="menu"
        id="overlay_menu"
        :model="profileItems"
      >
        <template #item="{ item }">
          <router-link
            class="text-white hover:text-slate-900 focus:text-slate-900"
            v-if="item.link"
            :to="item.link"
            :active-class="`active`"
            @click="closeSidebar"
          >
            <span class="block w-full py-2 px-3 mb-4 cursor-pointer">
              <span :class="item.icon" class="me-3" />
              <span>{{ $t(item.label) }}</span>
            </span>
          </router-link>
        </template>
      </Menu>
    </aside>
  </Drawer>
</template>

<script setup>
  import { ref, watch } from "vue";
  import { RouterLink } from "vue-router";
  import { useRouter } from "vue-router";
  import { useI18n } from "vue-i18n";
  import { useGeneralStore } from "../store/general";
  import { sidebarItems } from "../utils/constants";

  const t = useI18n();
  const generalStore = useGeneralStore();

  const visible = ref(generalStore?.getSidebarVisible);

  watch(
    () => visible.value,
    (newVisibilityStatus) => {
      generalStore?.setSidebarVisible(newVisibilityStatus);
    }
  );
  watch(
    () => generalStore?.getSidebarVisible,
    (newVisibilityStatus) => {
      visible.value = newVisibilityStatus;
    }
  );

  const closeSidebar = () => {
    generalStore?.setSidebarVisible(false);
  };

  const router = useRouter();
  const goToRoute = (route) => {
    router.push(route);
  };

  const menu = ref();
  const profileItems = ref(sidebarItems);

  const toggleProfile = (event) => {
    menu.value.toggle(event);
  };
</script>

<style scoped>
  aside {
    width: var(--sidebar-width);
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    right: unset;
    background: var(--dark-bg);
    padding: 1rem;
    overflow-y: auto;
    z-index: 1200;
  }
  body.ar aside {
    right: unset;
    right: 0;
  }
  a.active {
    color: #0f172b;
  }
  a.active span {
    background: white;
    border-radius: 4px;
  }
</style>
