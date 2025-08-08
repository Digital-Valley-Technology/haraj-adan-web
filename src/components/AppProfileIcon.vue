<template>
  <div>
    <div
      class="p-1 border border-[var(--primary-clr)] rounded-full flex items-center cursor-pointer"
      @click="toggleProfile"
    >
      <i
        class="pi pi-chevron-down text-[var(--primary-clr)]"
        style="font-size: 0.7rem"
      ></i>
      <Button
        type="button"
        rounded
        icon="pi pi-user"
        size="small"
        aria-haspopup="true"
        aria-controls="overlay_menu"
        class="!h-[24px] !w-[24px] !bg-[var(--primary-clr)] !border-[var(--primary-clr)] ml-1"
      />
      <span
        class="ml-2 text-sm font-medium truncate max-w-[100px] whitespace-nowrap"
      >
        {{ currentUserName }}
      </span>
    </div>

    <Menu ref="menu" id="overlay_menu" :model="profileItems" :popup="true">
      <template #item="{ item }">
        <!-- Show links based on permission -->
        <router-link
          v-if="item.link && hasPermission(loggedInUser, item?.permissions)"
          :to="item.link"
        >
          <span class="block w-full py-2 px-3 cursor-pointer text-sm">
            <span :class="item.icon" class="me-3" />
            <span>{{ $t(item.label) }}</span>
          </span>
        </router-link>

        <!-- Login option (only if not logged in) -->
        <router-link
          v-else-if="!loggedInUser && item?.label === 'header.login'"
          :to="item.link"
        >
          <span class="block w-full py-2 px-3 cursor-pointer text-sm">
            <span :class="item.icon" class="me-3" />
            <span>{{ $t(item.label) }}</span>
          </span>
        </router-link>

        <!-- Logout option (only if logged in) -->
        <span
          v-else-if="loggedInUser && item?.label === 'header.logout'"
          @click="logout"
          class="border-t block w-full py-2 px-3 cursor-pointer text-sm"
          v-ripple
        >
          <span :class="item.icon" class="text-red-500 me-3" />
          <span class="text-red-500">{{ $t(item?.label) }}</span>
        </span>
      </template>
    </Menu>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { websiteProfileItems } from "../utils/constants";
import { useAuthStore } from "../store/auth";
import { useRouter } from "vue-router";
import { hasPermission } from "../utils/permissions";
import { useI18n } from "vue-i18n";

const authStore = useAuthStore();
const { t } = useI18n();
const router = useRouter();
const menu = ref();
const profileItems = ref(websiteProfileItems);

const toggleProfile = (event) => {
  menu.value.toggle(event);
};

const loggedInUser = computed(() => authStore?.getUser);
const currentUserName = computed(
  () => authStore.getUser?.name || t("generic.guest")
);

const logout = async () => {
  await authStore.logout();
  router.replace("/login");
};

const goToLogin = () => {
  router.push("/login");
};
</script>
