<template>
  <DashboardLayout>
    <main class="px-4 md:px-8 py-[var(--padding-dashboard-section)]">
      <Breadcrumb
        class="!p-0 mb-4"
        :home="DashboardBreadCrumbBase"
        :model="breadcrumbItems"
      >
        <template #item="{ item, props }">
          <router-link
            v-if="item.route"
            v-slot="{ href, navigate }"
            :to="item.route"
            custom
          >
            <a :href="href" v-bind="props.action" @click="navigate">
              <span :class="[item.icon, 'text-color']" />
              <span class="text-primary font-semibold">{{
                item?.label && $t(`${item.label}`)
              }}</span>
            </a>
          </router-link>
          <a
            v-else
            :href="item.url"
            :target="item.target"
            v-bind="props.action"
          >
            <span class="text-surface-700 dark:text-surface-0">{{
              item?.label && $t(`${item.label}`)
            }}</span>
          </a>
        </template>
      </Breadcrumb>

      <div
        class="card w-full mx-auto px-4 md:px-8 py-8 md:py-12 shadow-lg border border-gray-200 rounded-xl"
      >
        <div>
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-semibold">
              {{ t("dashboard.actions.manage-attributes") }}
            </h2>
            <Button
              :label="$t('dashboard.categories.attributes.add')"
              icon="pi pi-plus"
              class="p-button-success"
              @click="onAdd"
            />
          </div>

          <div
            v-if="!loading && attributes.length === 0"
            class="text-center py-8"
          >
            <p class="text-gray-500 text-lg">
              {{ t("dashboard.categories.attributes.no_data") }}
            </p>
          </div>

          <AttributeTable
            v-else
            :attributes="attributes"
            :loading="loading"
            :rowsPerPage="rowsPerPage"
            :totalRecords="totalRecords"
            :currentPage="currentPage"
            @page-change="
              ({ page, rows }) => {
                currentPage = page;
                rowsPerPage = rows;
                fetchAttributes();
              }
            "
            @edit="onEdit"
            @delete="processDelete"
          />

          <!-- Dialog -->
          <Dialog
            v-model:visible="dialogVisible"
            modal
            :header="dialogTitle"
            :style="{ maxWidth: '600px', width: '100%' }"
          >
            <AttributeForm
              v-model="editingAttr"
              :types="attributesTypes"
              :errors="errors"
            />

            <div class="flex justify-end gap-2 mt-4">
              <Button
                :label="t('generic.cancel')"
                icon="pi pi-times"
                severity="secondary"
                @click="dialogVisible = false"
              />
              <Button
                :label="t('generic.save')"
                icon="pi pi-check"
                @click="saveAttribute"
              />
            </div>
          </Dialog>
          <DeleteDialog
            v-model="isDeleteDialogOpen"
            :content="$t('generic.delete_confirmation')"
            @confirm="onDelete"
          />
        </div>
      </div>
    </main>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { decode } from "js-base64";
import requestService from "../../../services/api/requestService";
import { useI18n } from "vue-i18n";
import { showSuccess, showError } from "../../../utils/notifications";
import DashboardLayout from "../../../Layout/DashboardLayout.vue";
import { DashboardBreadCrumbBase } from "../../../utils/constants";
import AttributeForm from "./AttributeForm.vue";
import AttributeTable from "./AttributeTable.vue";

const { t } = useI18n();
const route = useRoute();
const encodedId = route.params.categoryId;
const categoryId = decode(encodedId);

const breadcrumbItems = [
  { label: "sidebar.categories", route: "/dashboard/categories" },
  { label: "dashboard.actions.manage-attributes" },
];

const attributes = ref([]);
const attributesTypes = ref([]);
const loadingAttributes = ref(false);
const loadingTypes = ref(false);
const editingAttr = ref(null);
const dialogVisible = ref(false);
const errors = ref({});
const selectedCategoryId = ref(null);
const isDeleteDialogOpen = ref(false);
const isSubmitting = ref(false);

const totalRecords = ref(0);
const rowsPerPage = ref(10);
const currentPage = ref(1);
const includeParams = ["attrType", "attrValues"];

const loading = computed(() => loadingAttributes.value || loadingTypes.value);
const dialogTitle = computed(() =>
  editingAttr.value?.id
    ? t("dashboard.categories.attributes.edit")
    : t("dashboard.categories.attributes.add")
);

// --- API Callers ---
const fetchAttributes = async () => {
  loadingAttributes.value = true;
  try {
    const res = await requestService.getAll(
      `/categories-attributes/${categoryId}?page=${currentPage.value}&limit=${
        rowsPerPage.value
      }&includes=${includeParams.join(",")}`
    );
    attributes.value = res.data || [];
    totalRecords.value = res.meta?.total || 0;
  } catch (err) {
    console.error(err);
    showError(t("dashboard.fetch_error"));
  } finally {
    loadingAttributes.value = false;
  }
};

const fetchAttributesTypes = async () => {
  loadingTypes.value = true;
  try {
    const res = await requestService.getAll(`/categories-attributes/types`);
    attributesTypes.value = res.data || [];
  } catch (err) {
    console.error(err);
    showError(t("dashboard.fetch_error"));
  } finally {
    loadingTypes.value = false;
  }
};

// --- Form Handlers ---
const onAdd = () => {
  editingAttr.value = { name: "", name_en: "", type_id: null };
  errors.value = {};
  dialogVisible.value = true;
};

const onEdit = (attr) => {
  editingAttr.value = { ...attr };
  errors.value = {};
  dialogVisible.value = true;
};

const closeDialog = () => {
  editingAttr.value = null;
  errors.value = {};
  dialogVisible.value = false;
};

const validateForm = () => {
  const val = editingAttr.value || {};
  const errs = {
    name: !val.name ? t("validation.required") : "",
    name_en: !val.name_en ? t("validation.required") : "",
    type_id: !val.type_id ? t("validation.required") : "",
  };
  errors.value = errs;
  return !Object.values(errs).some(Boolean);
};

const buildPayload = (attr) => {
  const { name, name_en, type_id } = attr;
  return { name, name_en, type_id };
};

const saveAttribute = async () => {
  if (!validateForm()) return;

  try {
    if (editingAttr.value?.id) {
      const res = await requestService.update(
        "/categories-attributes",
        editingAttr.value.id,
        buildPayload(editingAttr.value)
      );
      showSuccess(
        res?.message || t("dashboard.categories.attributes.updated_success")
      );
    } else {
      const res = await requestService.create(
        `/categories-attributes/${categoryId}`,
        buildPayload(editingAttr.value)
      );
      showSuccess(
        res?.message || t("dashboard.categories.attributes.added_success")
      );
    }

    closeDialog();
    fetchAttributes();
  } catch (err) {
    showError(t("generic.save_failed"));
  }
};

// --- Delete Handler ---
const processDelete = (attrId) => {
  isDeleteDialogOpen.value = true;
  selectedCategoryId.value = attrId;
};

const onDelete = async () => {
  if (!selectedCategoryId.value) return;

  isSubmitting.value = true;

  try {
    const res = await requestService.delete(
      `/categories-attributes`,
      selectedCategoryId.value
    );

    showSuccess(
      res?.message || t("dashboard.categories.form.deleted_successfully")
    );

    fetchAttributes(); // Fetch updated categories after delete
  } catch (error) {
    showError(error?.message || t("dashboard.categories.form.delete_failed"));
  } finally {
    isDeleteDialogOpen.value = false; // Close dialog
    isSubmitting.value = false;
  }
};

// --- Load on mount ---
onMounted(() => {
  fetchAttributes();
  fetchAttributesTypes();
});
</script>
