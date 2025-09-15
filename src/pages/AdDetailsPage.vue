<template>
  <app-layout>
    <div class="page-wrapper mx-auto min-h-[500px] custom-container px-4">
      <ad-thumbnail v-if="ad" :ad="ad" />
    </div>
  </app-layout>
</template>

<script setup>
import AppLayout from "../Layout/AppLayout.vue";
import AdThumbnail from "../components/AdThumbnail.vue";
import { homeAds, specialAds } from "../data";
import { useRoute } from "vue-router";

const props = defineProps({
  ad: {
    type: Object,
    default: null,
  },
});

const route = useRoute();
const adId = Number(route.params.id);
const allAds = [...homeAds, ...specialAds];
const ad = allAds.find((item) => item.id === adId);
</script>
