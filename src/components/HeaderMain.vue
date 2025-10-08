<template>
  <header
    id="header-main"
    class="flex items-center fixed bg-[#166DA0] w-full z-50 shadow-lg h-[80px]"
    :dir="dir"
  >
    <div class="custom-container w-full flex justify-between items-center px-4">
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center me-4">
        <div class="h-20 flex justify-center items-center">
          <img src="/logo.png" alt="raheed logo" class="h-16" />
        </div>
      </RouterLink>

      <!-- Mobile Menu Button -->
      <button
        @click="isMenuOpen = !isMenuOpen"
        class="md:hidden text-white p-2 rounded hover:bg-[#0F4E7C] transition"
      >
        <i class="pi pi-bars text-xl"></i>
      </button>

      <!-- Menu Container -->
      <div
        class="absolute md:static top-[80px] left-0 w-full bg-[#166DA0] md:bg-transparent md:flex md:flex-1 md:items-center transition-all duration-300 ease-in-out"
        :class="{
          hidden: !isMenuOpen && isMobile,
          block: isMenuOpen && isMobile,
        }"
      >
        <div
          class="flex flex-col md:flex-row md:items-center md:justify-between w-full p-4 md:p-0 space-y-4 md:space-y-0"
        >
          <!-- Search Bar -->
          <div class="relative w-full sm:w-[80%] md:w-[300px] lg:w-[500px]">
            <input
              type="text"
              :placeholder="$t('ads.search_placeholder')"
              class="w-full py-2 rounded-md bg-[#0F4E7C] text-white placeholder-white focus:outline-none pl-10 pr-10"
            />
            <i
              class="pi pi-search absolute text-white text-sm ltr:left-3 rtl:right-3 top-1/2 transform -translate-y-1/2"
            ></i>
            <i
              class="pi pi-microphone absolute text-white text-sm cursor-pointer ltr:right-3 rtl:left-3 top-1/2 transform -translate-y-1/2"
            ></i>
          </div>

          <!-- Actions -->
          <div
            class="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6 text-white"
          >
            <!-- User -->
            <div class="flex items-center cursor-pointer max-w-[160px]">
              <AppProfileIcon class="w-full h-full" />
            </div>

            <!-- Chat Icon -->

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="ms-2 w-6 h-6 cursor-pointer hover:text-yellow-300 transition"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
              />
            </svg>

            <!-- Call Icon -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 90 90"
              fill="currentColor"
              class="ms-2 w-6 h-6 cursor-pointer hover:text-yellow-300 transition"
            >
              <path
                d="M 41.046 86.144 c -3.486 0 -6.322 -2.837 -6.322 -6.322 S 37.56 73.5 41.046 73.5 c 3.487 0 6.323 2.837 6.323 6.322 S 44.532 86.144 41.046 86.144 z M 41.046 76.467 c -1.85 0 -3.355 1.505 -3.355 3.355 s 1.505 3.355 3.355 3.355 c 1.851 0 3.356 -1.505 3.356 -3.355 S 42.896 76.467 41.046 76.467 z"
              />
              <path
                d="M 80.581 33.518 C 77.501 16.67 62.724 3.856 45 3.856 c -17.724 0 -32.501 12.814 -35.581 29.662 C 4.103 34.283 0 38.855 0 44.379 v 11.321 c 0 5.038 3.413 9.285 8.045 10.575 c 0.048 0.092 0.105 0.182 0.174 0.265 c 7.408 8.931 16.898 13.801 28.252 14.542 v -2.971 c -9.529 -0.678 -17.627 -4.505 -24.15 -11.424 h 1.018 c 2.926 0 5.307 -2.381 5.307 -5.307 V 38.699 c 0 -2.926 -2.381 -5.306 -5.307 -5.306 h -0.877 C 15.548 18.252 28.961 6.823 45 6.823 c 16.039 0 29.452 11.43 32.539 26.57 h -0.878 c -2.925 0 -5.306 2.38 -5.306 5.306 v 22.681 c 0 2.926 2.381 5.307 5.306 5.307 h 2.352 C 85.071 66.688 90 61.759 90 55.701 V 44.379 C 90 38.855 85.897 34.283 80.581 33.518 z"
              />
            </svg>

            <RouterLink
              to="/post-ad"
              class="bg-yellow-300 text-black font-semibold px-4 py-2 rounded hover:bg-yellow-400 transition"
            >
              <i class="pi pi-plus text-sm me-2"></i>
              <span>{{ $t("ads.post_ad") }}</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
  import { useI18n } from "vue-i18n";
  import { computed, ref, onMounted, onBeforeUnmount } from "vue";
  import { useAuthStore } from "../store/auth";
  import AppProfileIcon from "./AppProfileIcon.vue";

  const authStore = useAuthStore();

  const { locale } = useI18n();
  const dir = computed(() =>
    ["ar", "he"].includes(locale.value) ? "rtl" : "ltr"
  );

  const isMenuOpen = ref(false);
  const isMobile = ref(false);

  function updateSize() {
    isMobile.value = window.innerWidth < 768;
    isMenuOpen.value = !isMobile.value;
  }

  onMounted(() => {
    updateSize();
    window.addEventListener("resize", updateSize);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("resize", updateSize);
  });
</script>
