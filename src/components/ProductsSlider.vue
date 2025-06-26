<template>
  <div class="custom-container overflow-hidden">
    <swiper
      class="!py-4"
      :modules="modules"
      :slides-per-view="1"
      :space-between="16"
      :pagination="{ clickable: true }"
      :loop="true"
      :navigation="true"
      :a11y="true"
      :breakpoints="{
        '340': {
          slidesPerView: 2,
        },
        '550': {
          slidesPerView: 3,
        },
        '768': {
          slidesPerView: 4,
        },
        '1024': {
          slidesPerView: 4,
        },
      }"
    >
      <swiper-slide v-for="product in products" :key="product?.id">
        <product-card :product="product"></product-card>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
  import ProductCard from "./ProductCard.vue";
  import { ref } from "vue";
  import { Swiper, SwiperSlide } from "swiper/vue";
  import { heroSlides } from "../utils/constants";
  import { Pagination, A11y, Autoplay, Navigation } from "swiper/modules";

  import "swiper/css";
  import "swiper/css/navigation";
  import "swiper/css/a11y";
  import "swiper/css/autoplay";
  import "swiper/css/pagination";
  defineProps(["products"]);

  const modules = [Autoplay, Navigation, A11y];
  const autoplay = {
    delay: 10000,
    disableOnInteraction: false,
  };
</script>

<style scoped></style>
