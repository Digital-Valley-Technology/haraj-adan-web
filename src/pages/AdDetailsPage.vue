<template>
  <app-layout>
    <div class="page-wrapper mx-auto min-h-[500px] custom-container px-4">
      <ad-thumbnail
        v-if="ad"
        :ad="ad"
        :comments="comments"
        :total="commentsTotal"
        @paginate-comments="handlePaginate"
        :first="(commentsPage - 1) * commentsLimit"
        :rows="commentsLimit"
        @toggle-like="toggleLike"
      />
    </div>
  </app-layout>
</template>

<script setup>
import { onMounted, ref } from "vue";
import AppLayout from "../Layout/AppLayout.vue";
import AdThumbnail from "../components/AdThumbnail.vue";
import { useRoute } from "vue-router";
import requestService from "../services/api/requestService";
import { useAuthStore } from "../store/auth";
import { computed } from "vue";
import { showSuccess } from "../utils/notifications";

const route = useRoute();
const adId = route.params.adId;
const ad = ref(null);
const comments = ref([]);
const commentsPage = ref(1);
const commentsLimit = ref(10);
const commentsTotal = ref(0);
const loading = ref(false);

const authStore = useAuthStore();

const currentUser = computed(() => authStore.user);

function handlePaginate({ page, limit }) {
  fetchComments(page, limit);
}

const toggleLike = async ({ adId, isLiked }) => {
  if (!currentUser.value) return;

  try {
    // If already liked → remove like
    if (isLiked) {
      const existingLike = ad.value.ad_likes.find(
        (like) => like?.user_id === currentUser.value.id
      );

      if (!existingLike) return;

      // Optimistic UI update
      ad.value.ad_likes = [];

      const res = await requestService.delete(`/ads/likes`, existingLike?.id);

      showSuccess(res?.message || "Like removed successfully");
      return;
    }

    // Otherwise → like the ad
    // Optimistic UI update
    ad.value.ad_likes = [{ adId, user_id: currentUser.value.id }];

    const res = await requestService.create(`/ads/likes/${adId}`, {
      userId: currentUser.value.id,
    });

    // Replace optimistic like with real DB entry
    ad.value.ad_likes = [res.data];

    showSuccess(res?.message || "Like added successfully");
  } catch (err) {
    console.error("Error toggling like:", err);

    // Rollback UI if something failed
    if (isLiked) {
      // User tried to unlike → restore old like
      ad.value.ad_likes = [
        {
          adId,
          user_id: currentUser.value.id,
        },
      ];
    } else {
      // User tried to like → remove optimistic like
      ad.value.ad_likes = [];
    }
  }
};

const fetchAdDetails = async () => {
  if (!adId) return;
  loading.value = true;
  try {
    const response = await requestService.getAll(`/ads/${adId}`, {
      params: {
        includes: "attributes,images,user,likes,featured,favourites",
        userId: currentUser?.value?.id || null,
      },
    });
    ad.value = response.data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const fetchComments = async (page = 1, limit = 10) => {
  try {
    const res = await requestService.getAll(
      `ads/comments/paginate/?adId=${adId}&page=${page}&limit=${limit}`
    );

    comments.value = res?.data;
    commentsTotal.value = res?.meta?.total || 0;

    commentsPage.value = page;
    commentsLimit.value = limit;
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  fetchAdDetails();
  fetchComments();
});
</script>
