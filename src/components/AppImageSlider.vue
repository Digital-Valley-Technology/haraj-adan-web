<template>
  <div class="custom-container overflow-hidden shadow-lg rounded-lg">
    <swiper
      :modules="modules"
      :slides-per-view="1"
      :space-between="0"
      :pagination="{ clickable: true }"
      :loop="true"
      :autoplay="autoplay"
      :a11y="true"
      :speed="800"
      class="w-full min-h-[150px] lg:min-h-[300px] aspect-3/1 bg-gray-200"
    >
      <swiper-slide v-for="(image, index) in images" :key="index">
        <img
          :src="image?.src"
          :alt="image?.alt"
          :class="`w-full h-full object-cover ${image?.position}`"
        />
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
  import { ref } from "vue";
  import { Swiper, SwiperSlide } from "swiper/vue";
  import { heroSlides } from "../utils/constants";
  import { Pagination, A11y, Autoplay } from "swiper/modules";
  import "swiper/swiper-bundle.css";

  const images = ref(heroSlides);
  const modules = [Pagination, A11y, Autoplay];
  const autoplay = {
    delay: 8000,
    disableOnInteraction: false,
  };
</script>

<style></style>
