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
        @report="handleReportClick"
      />
    </div>

    <!-- Report Dialog -->
    <ReportAdDialog
      v-model="showReportDialog"
      :adId="adId"
      @reported="onReported"
    />
  </app-layout>
</template>

<script setup>
import { onMounted, ref } from "vue";
import AppLayout from "../Layout/AppLayout.vue";
import AdThumbnail from "../components/AdThumbnail.vue";
import ReportAdDialog from "../components/ReportAdDialog.vue";
import { useRoute, useRouter } from "vue-router";
import requestService from "../services/api/requestService";
import { useAuthStore } from "../store/auth";
import { computed } from "vue";
import { showSuccess, showInfo } from "../utils/notifications";
import { useI18n } from "vue-i18n";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const adId = route.params.adId;
const ad = ref(null);
const comments = ref([]);
const commentsPage = ref(1);
const commentsLimit = ref(10);
const commentsTotal = ref(0);
const loading = ref(false);
const showReportDialog = ref(false);

const authStore = useAuthStore();

const currentUser = computed(() => authStore.user);

// Handle report button click with auth check
const handleReportClick = () => {
  if (!currentUser.value) {
    showInfo(t('report.login_required'));
    router.push({
      name: 'login',
      query: { redirect: route.fullPath }
    });
    return;
  }
  showReportDialog.value = true;
};

const onReported = () => {
  // Optional: refresh ad data or show additional feedback
};

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
    ad.value = response?.data || response;
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
