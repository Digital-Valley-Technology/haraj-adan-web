<script setup>
import DashboardLayout from "../../Layout/DashboardLayout.vue";
import DeleteDialog from "../../components/DeleteDialog.vue";
import UsersTable from "./UsersTable.vue";
import NoData from "../../components/NoData.vue";
import UsersTableHeader from "./UsersTableHeader.vue";
import { onMounted, computed, ref, watch } from "vue";
import { useUsersStore } from "../../store/user";
import { useDebounceFn } from "@vueuse/core";
import { showError, showSuccess } from "../../utils/notifications";
import requestService from "../../services/api/requestService";
import { useI18n } from "vue-i18n";
import CustomConfirmDialog from "../../components/CustomConfirmDialog.vue";

const { t } = useI18n();
const userStore = useUsersStore();

const isSubmitting = ref(false);
const selectedUserId = ref(null); // Store the ID of the user to delete

// Delete dialog state
const isDeleteDialogOpen = ref(false);

const banLoading = ref(false);
const isConfirmDialogOpen = ref(false);
const confirmationMessageText = ref("");
const selectedUser = ref({});
// Local search/filter state
const searchText = ref("");
const selectedFilter = ref({ name: "name" }); // Default filter set

// Fetch users from store
const fetchData = () => {
  userStore.fetchUsers({
    page: userStore.page,
    limit: userStore.limit,
    search: searchText.value,
    filterBy: selectedFilter.value?.name,
  });
};

const handleDelete = async () => {
  if (!selectedUserId.value) return;

  isSubmitting.value = true;

  try {
    const response = await requestService.delete(
      "/users",
      selectedUserId.value
    );

    showSuccess(
      response?.status?.message ||
        t("dashboard.users.form.deleted_successfully")
    );

    fetchData(); // Fetch updated users after delete
  } catch (error) {
    console.log(error);

    showError(error || t("dashboard.users.form.delete_failed"));
  } finally {
    isDeleteDialogOpen.value = false; // Close dialog
    isSubmitting.value = false;
  }
};

const handleToggleBan = async () => {
  if (!selectedUser.value?.id) return;

  banLoading.value = true;

  try {
    const response = await requestService.update(
      "/users",
      selectedUser.value?.id,
      { is_active: !selectedUser.value?.is_active }
    );

    showSuccess(
      response?.status?.message || t("dashboard.users.form.edited_successfully")
    );

    fetchData(); // Fetch updated users after delete
  } catch (error) {
    showError(error || t("dashboard.users.form.ban-change_failed"));
  } finally {
    isConfirmDialogOpen.value = false; // Close dialog
    banLoading.value = false;
  }
};

const processDelete = (user) => {
  selectedUserId.value = user?.id;
  isDeleteDialogOpen.value = true;
};

const processBan = (user) => {
  selectedUser.value = user;
  isConfirmDialogOpen.value = true;
  console.log(selectedUser.value);

  if (user?.is_active)
    confirmationMessageText.value = t("dashboard.users.ban_confirm");
  else confirmationMessageText.value = t("dashboard.users.activate_confirm");
};

onMounted(fetchData);

// Debounced fetch on search/filter change
watch(
  [searchText, selectedFilter],
  useDebounceFn(() => {
    userStore.page = 1; // Reset to page 1 on filter/search change
    fetchData();
  }, 500)
);

// Computed values
const users = computed(() => userStore.getUsers);
const total = computed(() => userStore.getTotal);
</script>

<template>
  <dashboard-layout>
    <main class="py-[var(--padding-dashboard-section)] custom-container">
      <div
        class="card min-h-[500px] w-full mx-auto px-4 md:px-8 py-8 md:py-12 shadow-lg border border-gray-200 rounded-lg"
      >
        <users-table-header
          :total="total"
          v-model:modelValue="searchText"
          v-model:selectedFilter="selectedFilter"
        />
        <users-table
          v-if="users?.length > 0"
          :users="users"
          @delete="(user) => processDelete(user)"
          @fetch-users="fetchData()"
          @toggle-ban="(user) => processBan(user)"
        />
        <no-data
          v-else
          class="mt-12"
          :content="$t('dashboard.users.no_data')"
        />
      </div>
    </main>
    <!-- Confirmation Dialog -->
    <CustomConfirmDialog
      v-model="isConfirmDialogOpen"
      :content="confirmationMessageText"
      @confirm="handleToggleBan"
      :loading="banLoading"
    />
    <DeleteDialog
      v-model="isDeleteDialogOpen"
      :content="$t('generic.delete_confirmation')"
      @confirm="handleDelete"
    />
  </dashboard-layout>
</template>

<style scoped>
main {
  min-height: calc(100vh - var(--padding-dashboard-layout-top));
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
