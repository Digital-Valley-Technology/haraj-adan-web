<script setup>
  import { Swiper, SwiperSlide } from "swiper/vue";
  import { FreeMode, Navigation, Thumbs } from "swiper/modules";
  import { ref } from "vue";

  import "swiper/css";
  import "swiper/css/navigation";
  import "swiper/css/free-mode";
  import "swiper/css/thumbs";

  defineProps(["productImages", "productName"]);

  const thumbsSwiper = ref(null);

  const modules = [FreeMode, Thumbs, Navigation];

  const setThumbsSwiper = (swiper) => {
    thumbsSwiper.value = swiper;
  };

  const thumb_breakpoints = {
    430: {
      slidesPerView: 4,
    },
    560: {
      slidesPerView: 5,
    },
    768: {
      slidesPerView: 4,
    },
    1024: {
      slidesPerView: 5,
    },
  };
</script>

<template>
  <div class="flex flex-col items-center overflow-hidden">
    <!-- images -->
    <swiper
      :thumbs="{ swiper: thumbsSwiper }"
      :modules="modules"
      :slides-per-view="1"
      :space-between="16"
      class="w-full aspect-[6/4] mb-4 rounded-lg shadow-lg bg-gray-200"
    >
      <swiper-slide v-for="(image, i) in productImages" :key="i">
        <div
          class="w-full h-full border border-gray-300 rounded-lg overflow-hidden"
        >
          <img
            :src="image"
            :alt="productName"
            class="w-full h-full object-cover"
          />
        </div>
      </swiper-slide>
    </swiper>
    <!-- thumbnails -->
    <swiper
      :modules="modules"
      :slides-per-view="3"
      :space-between="16"
      :navigation="true"
      watch-slides-progress
      @swiper="setThumbsSwiper"
      :breakpoints="thumb_breakpoints"
      class="w-full mb-4"
    >
      <swiper-slide v-for="(image, i) in productImages" :key="i">
        <div
          class="w-[80px] h-[80px] border border-gray-300 shadow-lg rounded-lg overflow-hidden cursor-pointer"
        >
          <img
            :src="image"
            :alt="productName"
            class="w-full h-full object-cover"
          />
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>
