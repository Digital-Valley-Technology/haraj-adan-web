<template>
  <header id="header-top" class="bg-gray-100 fixed w-full z-50 py-3">
    <!-- desktop navbar -->
    <div class="items-center justify-between custom-container hidden lg:flex">
      <div v-for="(item, i) in topNavbarItems" :key="i">
        <router-link v-if="item?.link" :to="item?.link">
          <div
            class="w-max flex items-center justify-between py-2 px-3 border-e-2 border-gray-300"
          >
            <img class="text-xs" :src="item?.icon" :alt="item?.label" />
            <span class="text-gray-600 mx-2 text-xs">{{
              $t(item?.label)
            }}</span>
          </div>
        </router-link>
        <div
          v-else-if="item?.code"
          :to="item?.link"
          class="cursor-pointer flex items-center justify-between"
          @click="toggleLang(currentLang === 'en' ? 'ar' : 'en')"
        >
          <i :class="`ms-2 pi ${item?.icon}`"></i>
          <span class="text-gray-600 mx-2 text-xs">{{
            currentLang === "en" ? $t("topheader.ar") : $t("topheader.en")
          }}</span>
        </div>
        <div
          v-else
          class="w-max flex items-center justify-between py-2 px-3 border-e-2 border-gray-300"
        >
          <img class="text-xs" :src="item?.icon" :alt="item?.label" />
          <span class="text-gray-600 mx-2 text-xs">{{ $t(item?.label) }}</span>
        </div>
      </div>
    </div>
    <!-- mobile navbar -->
    <div class="flex lg:hidden items-center justify-between custom-container">
      <div
        @click="toggleProfile"
        class="rounded-full custom-shadow p-2 cursor-pointer"
      >
        <img src="/icons/navBars.svg" alt="menu-toggle" />
      </div>
      <router-link class="absolute left-[50%] translate-x-[-50%]" to="/">
        <img src="/logo.png" class="w-[100px] object-contain" alt="logo" />
      </router-link>
      <app-cart-icon :cart-count="cartCount"></app-cart-icon>
    </div>

    <!-- mobile collapsed navbar -->
    <Menu
      class="!z-50 w-[80%] md:w-[400px] py-4 px-2"
      ref="menu"
      :model="items"
      id="overlay_menu"
      :popup="true"
    >
      <template #item="{ item, props }">
        <nav class="mx-auto">
          <RouterLink
            :to="item.link"
            v-ripple
            class="flex items-center"
            v-bind="props.action"
            :active-class="`${item?.link && 'active-link'}`"
            v-if="item?.link"
          >
            <img class="text-xs" :src="item?.icon" :alt="item?.label" />
            <span>{{ $t(item.label) }}</span>
          </RouterLink>
          <div
            class="flex items-center cursor-pointer px-[12px] py-[8px]"
            @click="toggleLang(currentLang === 'en' ? 'ar' : 'en')"
            v-else-if="item?.code"
          >
            <i :class="`me-2 pi ${item?.icon}`"></i>
            <span>{{
              $t(currentLang === "en" ? "topheader.ar" : "topheader.en")
            }}</span>
          </div>
        </nav>
      </template>
    </Menu>
  </header>
</template>

<script setup>
  import AppCartIcon from "../components/AppCartIcon.vue";
  import { ref, computed } from "vue";
  import { RouterLink } from "vue-router";
  import { topNavbarItems } from "../utils/constants";
  import { useI18n } from "vue-i18n";
  import { useGeneralStore } from "../store/general";
  import { useProductsStore } from "../store/product";

  const menu = ref();

  const toggleProfile = (event) => {
    menu.value.toggle(event);
  };

  let navItems;
  let itemToMove = topNavbarItems.find((obj) => obj.label === "topheader.home");

  if (itemToMove) {
    navItems = topNavbarItems.filter((obj) => obj !== itemToMove); // Remove it from old array
    navItems.unshift(itemToMove); // Add it to the front
  }

  const items = ref(navItems);

  const t = useI18n();
  const generalStore = useGeneralStore();
  const currentLang = computed(() => generalStore?.getLang);

  const toggleLang = (lang) => {
    generalStore?.toggleLang(t, lang);
    location.reload();
  };

  const productsStore = useProductsStore();
  const cartCount = computed(() => productsStore.getCartProducts?.length);
</script>

<style></style>
