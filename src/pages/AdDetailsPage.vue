<template>
  <app-layout>
    <div class="page-wrapper mx-auto min-h-[500px] custom-container px-4">
      <ad-thumbnail v-if="ad" :ad="ad" />
    </div>
  </app-layout>
</template>

<script setup>
import { onMounted, ref } from "vue";
import AppLayout from "../Layout/AppLayout.vue";
import AdThumbnail from "../components/AdThumbnail.vue";
import { useRoute } from "vue-router";
import requestService from "../services/api/requestService";

const route = useRoute();
const adId = route.params.adId;
const ad = ref(null);
const loading = ref(false);

const fetchAdDetails = async () => {
  if (!adId) return;
  loading.value = true;
  try {
    const response = await requestService.getAll(`/ads/${adId}`, {
      params: {
        includes: "attributes,images,user,likes,comments,featured,favourites",
      },
    });
    ad.value = response.data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchAdDetails();
});
</script>
