<template>
  <div>
    <div
      class="p-1 border border-[var(--primary-clr)] rounded-full flex justify-between items-center w-[70px]"
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
        class="!h-[24px] !w-[24px] !bg-[var(--primary-clr)] !border-[var(--primary-clr)]"
      />
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
          v-else
          @click="logout"
          class="border-t block w-full py-2 px-3 cursor-pointer text-sm"
          v-ripple
        >
          <span :class="item.icon" class="text-red-500 me-3" />
          <span class="text-red-500">{{ $t(item.label) }}</span>
        </span>
      </template>
    </Menu>
  </div>
</template>

<script setup>
  import { ref } from "vue";
  import { websiteProfileItems } from "../utils/constants";

  const menu = ref();
  const profileItems = ref(websiteProfileItems);

  const toggleProfile = (event) => {
    menu.value.toggle(event);
  };
</script>
