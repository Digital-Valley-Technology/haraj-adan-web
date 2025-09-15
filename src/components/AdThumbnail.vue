<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
    <!-- left image -->
    <div class="flex flex-col items-center overflow-hidden">
      <div
        v-if="ad"
        class="swiper-initialized swiper-horizontal w-full aspect-[6/4] mb-4 rounded-lg swiper-backface-hidden"
      >
        <!-- Main Swiper -->
        <swiper
          :slides-per-view="1"
          :modules="[FreeMode, Thumbs]"
          :thumbs="{ swiper: thumbsSwiper }"
          :initial-slide="0"
          class="main-swiper w-full mb-4 rounded-lg"
        >
          <SwiperSlide v-for="(img, index) in ad.images" :key="index">
            <img
              :src="img"
              class="w-full lg:h-[567px] object-cover rounded-lg"
            />
          </SwiperSlide>
        </swiper>

        <!-- Thumbnail Swiper -->
        <swiper
          @swiper="onThumbSwiper"
          :modules="[FreeMode, Thumbs, Navigation]"
          :space-between="10"
          :slides-per-view="2"
          navigation
          :breakpoints="{
            554: {
              slidesPerView: 4,
            },
          }"
          free-mode
          watch-slides-progress
          class="thumbs-swiper mt-4"
        >
          <SwiperSlide v-for="(img, index) in ad.images" :key="index">
            <img
              :src="img"
              class="w-full h-24 rounded-md object-cover cursor-pointer"
            />
          </SwiperSlide>
        </swiper>
      </div>
    </div>
    <!-- Right: Details -->
    <div class="w-full bg-white rounded-2xl">
      <div class="flex flex-col justify-center p-4">
        <div class="flex justify-between items-center mb-4">
          <span class="text-2xl font-semibold">lstana Apartments</span>
          <span class="text-lg font-semibold">$ 5.000</span>
        </div>
        <div>
          <ad-detail-info
            v-for="detail in details"
            :key="detail.id"
            :detail="detail"
          ></ad-detail-info>
        </div>
        <div class="flex justify-between items-center gap-2 my-6">
          <button
            type="button"
            class="bg-[#146AAB] text-white py-2 w-full rounded-md cursor-pointer"
          >
            {{ i18?.locale.value == "ar" ? "اتصال" : "Call" }}
          </button>
          <button
            type="button"
            class="bg-[#FFE800] py-2 w-full rounded-md cursor-pointer"
          >
            {{ i18?.locale.value == "ar" ? "إرسال رسالة" : "Send Message" }}
          </button>

          <button
            type="button"
            class="bg-gray-200 py-2 px-4 rounded-md cursor-pointer"
          >
            <i class="pi pi-star text-[#146AAB]"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- Description -->
  <div class="bg-white p-4 rounded-lg gap-4">
    <div class="flex items-start gap-4">
      <button
        @click="activeTab = 'description'"
        :class="[
          'py-2 px-7 rounded-md cursor-pointer',
          activeTab === 'description' ? 'bg-[#146AAB]' : 'bg-gray-300',
        ]"
      >
        <p
          :class="[
            'text-base font-medium',
            activeTab === 'description' ? 'text-white' : 'text-black',
          ]"
        >
          {{ i18?.locale.value == "ar" ? "الوصف" : "Description" }}
        </p>
      </button>
      <button
        @click="activeTab = 'location'"
        :class="[
          'py-2 px-7 rounded-md cursor-pointer',
          activeTab === 'location' ? 'bg-[#146AAB]' : 'bg-gray-300',
        ]"
      >
        <p
          :class="[
            'text-base font-medium',
            activeTab === 'description' ? 'text-black' : 'text-white',
          ]"
        >
          {{ i18?.locale.value == "ar" ? "الموقع" : "Location" }}
        </p>
      </button>
    </div>
  </div>
  <!-- Description & Location -->
  <div class="bg-white p-4 rounded-lg my-4">
    <div v-if="activeTab === 'description'">
      <h3 class="text-xl text-[#030712] font-semibold mb-2">
        {{ i18?.locale.value == "ar" ? "الوصف" : "Description" }}
      </h3>
      <p class="text-xs text-[#4B5563] font-normal mb-2">
        {{
          i18?.locale.value == "ar"
            ? "أهلاً بكم في شقق سكاي لاين هافن، حيث تلتقي الفخامة بالراحة. توفر هذه الشقة الرائعة المكونة من غرفتي نوم وحمامين مساحة معيشة رائعة التصميم تبلغ 1200 قدم مربع. مع نوافذ ممتدة من الأرضية حتى السقف، استمتعوا بإطلالات خلابة على المدينة من كل غرفة."
            : "Welcome to Skyline Haven Apartments, where luxury meets convenience. Thisstunning 2-bedroom, 2-bathroom apartment offers 1,200 sq. ft. of beautifully designed living space. With floor-to-ceiling windows, enjoy      breathtaking city views from every room.m dolor sit amet, consectetur adipiscing elit."
        }}
      </p>
      <p class="text-xs text-[#4B5563] font-normal mb-2">
        {{
          i18?.locale.value == "ar"
            ? "أهلاً بكم في شقق سكاي لاين هافن، حيث تلتقي الفخامة بالراحة. توفر هذه الشقة الرائعة المكونة من غرفتي نوم وحمامين مساحة معيشة رائعة التصميم تبلغ 1200 قدم مربع. مع نوافذ ممتدة من الأرضية حتى السقف، استمتعوا بإطلالات خلابة على المدينة من كل غرفة."
            : "Welcome to Skyline Haven Apartments, where luxury meets convenience. Thisstunning 2-bedroom, 2-bathroom apartment offers 1,200 sq. ft. of beautifully designed living space. With floor-to-ceiling windows, enjoy      breathtaking city views from every room.m dolor sit amet, consectetur adipiscing elit."
        }}
      </p>
      <p class="text-xs text-[#4B5563] font-normal mb-2">
        {{
          i18?.locale.value == "ar"
            ? "أهلاً بكم في شقق سكاي لاين هافن، حيث تلتقي الفخامة بالراحة. توفر هذه الشقة الرائعة المكونة من غرفتي نوم وحمامين مساحة معيشة رائعة التصميم تبلغ 1200 قدم مربع. مع نوافذ ممتدة من الأرضية حتى السقف، استمتعوا بإطلالات خلابة على المدينة من كل غرفة."
            : "Welcome to Skyline Haven Apartments, where luxury meets convenience. Thisstunning 2-bedroom, 2-bathroom apartment offers 1,200 sq. ft. of beautifully designed living space. With floor-to-ceiling windows, enjoy      breathtaking city views from every room.m dolor sit amet, consectetur adipiscing elit."
        }}
      </p>
      <p class="text-xs text-[#4B5563] font-normal mb-2">
        {{
          i18?.locale.value == "ar"
            ? "أهلاً بكم في شقق سكاي لاين هافن، حيث تلتقي الفخامة بالراحة. توفر هذه الشقة الرائعة المكونة من غرفتي نوم وحمامين مساحة معيشة رائعة التصميم تبلغ 1200 قدم مربع. مع نوافذ ممتدة من الأرضية حتى السقف، استمتعوا بإطلالات خلابة على المدينة من كل غرفة."
            : "Welcome to Skyline Haven Apartments, where luxury meets convenience. Thisstunning 2-bedroom, 2-bathroom apartment offers 1,200 sq. ft. of beautifully designed living space. With floor-to-ceiling windows, enjoy      breathtaking city views from every room.m dolor sit amet, consectetur adipiscing elit."
        }}
      </p>
    </div>

    <!-- Location -->
    <div v-else-if="activeTab === 'location'">
      <iframe
        class="w-full h-96 rounded-md"
        src="https://www.google.com/maps/embed?pb=..."
        allowfullscreen=""
        loading="lazy"
      ></iframe>
    </div>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { FreeMode, Thumbs, Navigation } from "swiper/modules";
import { ref } from "vue";
import AdDetailInfo from "./AdDetailInfo.vue";
import { adDetails } from "../data/index";
import { useI18n } from "vue-i18n";
import { homeAds, specialAds } from "../data";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

defineProps(["ad"]);
const details = ref(adDetails);

const thumbsSwiper = ref(null);
function onThumbSwiper(swiper) {
  thumbsSwiper.value = swiper;
}

const i18 = useI18n();
const activeTab = ref("description");
</script>

<style scoped>
.swiper-slide-thumb-active {
  border: 2px solid #146aab;
  border-radius: 0.5rem;
  opacity: 1;
}
</style>
