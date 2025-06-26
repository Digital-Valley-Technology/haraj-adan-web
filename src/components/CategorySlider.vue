<template>
  <div
    id="category-slider-container"
    class="custom-container category-slider-container overflow-hidden"
  >
    <swiper
      class="!px-4"
      :modules="modules"
      :slides-per-view="3"
      :space-between="16"
      :pagination="{ clickable: true }"
      :navigation="true"
      :loop="true"
      :autoplay="autoplay"
      :a11y="true"
      :breakpoints="breakpoints"
    >
      <swiper-slide v-for="(category, index) in categories" :key="index">
        <category-card :category="category" />
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
  import CategoryCard from "./CategoryCard.vue";
  import { ref } from "vue";
  import { Swiper, SwiperSlide } from "swiper/vue";
  import { heroSlides } from "../utils/constants";
  import { Pagination, A11y, Autoplay, Navigation } from "swiper/modules";
  import { categories } from "../data";

  import "swiper/css";
  import "swiper/css/navigation";
  import "swiper/css/pagination";
  import "swiper/css/a11y";

  const categoriesList = ref(categories);
  const modules = [Autoplay, Navigation, A11y];
  const autoplay = {
    delay: 8000,
    disableOnInteraction: false,
  };

  const breakpoints = {
    550: {
      slidesPerView: 5,
    },
    992: {
      slidesPerView: 6,
    },
  };
</script>

<style scoped>
  @media screen and (max-width: 768px) {
    .category-slider-container {
      max-width: 100% !important;
    }
  }
</style>
