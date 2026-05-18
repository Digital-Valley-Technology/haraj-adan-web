<template>
  <aside :class="`${!desktopSidebarVisible && 'move-away'}`">
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
          v-if="item.link && hasPermission(loggedInUser, item?.permissions)"
          :to="item.link"
          :active-class="`active`"
        >
          <span class="block w-full py-2 px-3 mb-4 cursor-pointer relative">
            <span :class="item.icon" class="me-3" />
            <span>{{ $t(item.label) }}</span>
            <!-- Support notification badge -->
            <span
              v-if="item.link === '/dashboard/support' && unreadSupportCount > 0"
              class="absolute top-1 end-2 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1"
            >
              {{ unreadSupportCount > 99 ? '99+' : unreadSupportCount }}
            </span>
          </span>
        </router-link>
      </template>
    </Menu>
  </aside>
</template>

<script setup>
  import { ref, computed, onMounted } from "vue";
  import { RouterLink } from "vue-router";
  import { useRouter } from "vue-router";
  import { sidebarItems } from "../utils/constants";
  import { useGeneralStore } from "../store/general";
  import { useAuthStore } from "../store/auth";
  import { useChatStore } from "../store/chat";
  import { hasPermission } from "../utils/permissions";

  const generalStore = useGeneralStore();
  const authStore = useAuthStore();
  const chatStore = useChatStore();

  // Fetch unread admin support count on mount
  onMounted(() => {
    chatStore.fetchUnreadCount();
    chatStore.listenForMessages(true); // true = isAdmin
  });

  const unreadSupportCount = computed(() => chatStore.unreadAdminCount);

  const desktopSidebarVisible = computed(
    () => generalStore?.getDesktopSidebarVisible
  );

const loggedInUser = computed(() => authStore?.getUser);

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
    transition: all 0.35s ease-in-out;
  }
  body.ar aside {
    right: unset;
    right: 0;
  }

  aside.move-away {
    transform: translateX(-100%);
  }

  body.ar aside.move-away {
    transform: translateX(100%);
  }

  a.active {
    color: #0f172b;
  }
  a.active span {
    background: white;
    border-radius: 4px;
  }
</style>
