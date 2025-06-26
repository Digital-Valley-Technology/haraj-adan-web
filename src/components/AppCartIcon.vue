<template>
  <router-link class="flex-center relative" to="/cart">
    <img src="/icons/navCart.svg" alt="cart" />
    <span
      :class="`bg-[var(--primary-clr)] px-2 text-white absolute top-[-.25rem] ${
        currentLang == 'en' ? 'right-0' : 'left-0'
      } rounded-full`"
    >
      {{ cartCount }}
    </span>
  </router-link>
</template>

<script setup>
  import { computed } from "vue";
  import { useGeneralStore } from "../store/general";
  defineProps(["cartCount"]);

  const generalStore = useGeneralStore();
  const currentLang = computed(() => generalStore?.getLang);
</script>
