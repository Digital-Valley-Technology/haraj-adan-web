<template>
  <header
    id="header-main"
    class="flex items-center fixed bg-white w-full z-50 shadow-lg h-[80px]"
  >
    <div class="custom-container w-full flex justify-between items-center">
      <!-- start -->
      <div class="flex items-center">
        <!-- logo -->
        <RouterLink class="me-4" to="/">
          <div class="h-20 overflow-hidden flex justify-center items-center">
            <img src="/logo.png" alt="raheed logo" class="h-16" />
          </div>
        </RouterLink>
      </div>

      <!-- end -->
      <div>
        <div class="flex items-center">
          <!-- profile icon -->
          <app-profile-icon></app-profile-icon>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
  import AppProfileIcon from "../components/AppProfileIcon.vue";
  import AppCartIcon from "../components/AppCartIcon.vue";
  import { computed, ref } from "vue";
  import { RouterLink } from "vue-router";
  import { useProductsStore } from "../store/product";

  const productsStore = useProductsStore();
  const cartCount = computed(() => productsStore?.getCartProducts?.length);
  // const cartCount = computed(() => productsStore?.getCartProducts?.reduce((acc, item) => acc + item.quantity, 0) || 0);
</script>

<style>
  #header-main .p-menubar-button {
    order: 3;
  }

  @media screen and (min-width: 1024px) {
    #header-main .p-menubar-button {
      order: unset;
    }
  }

  @media screen and (min-width: 1024px) {
    .show-lg {
      display: flex !important;
    }

    .hide-lg {
      display: none !important;
    }
  }

  .hide-all {
    display: none !important;
  }

  a.active-link {
    background: var(--active-link);
    border-radius: 4px;
  }
</style>
