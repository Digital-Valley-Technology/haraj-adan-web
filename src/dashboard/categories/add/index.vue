<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import requestService from "../../../services/api/requestService";
import { useGeneralStore } from "../../../store/general";
import { showError, showSuccess } from "../../../utils/notifications";
import DashboardLayout from "../../../Layout/DashboardLayout.vue";
import { DashboardBreadCrumbBase } from "../../../utils/constants";

const { t } = useI18n();
const router = useRouter();
const generalStore = useGeneralStore();
const isSubmitting = ref(false);

const breadcrumbItems = [
  { label: "sidebar.categories", route: "/dashboard/categories" },
  { label: "dashboard.categories.create-category" },
];
const categories = ref([]);
const previewUrl = ref(null);

const fetchCategories = async () => {
  try {
    generalStore.setLoading(true);
    const res = await requestService.getAll("/categories");
    categories.value = res?.data || [];
  } catch (error) {
    console.error(error);
  } finally {
    generalStore.setLoading(false);
  }
};

onMounted(fetchCategories);

// Clean up preview URL
onUnmounted(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
});

const schema = yup.object({
  name: yup.string().required(t("dashboard.categories.form.name_required")),
  name_en: yup
    .string()
    .required(t("dashboard.categories.form.name_en_required")),
  parent_id: yup.number().nullable(),
  image: yup
    .mixed()
    .required(t("dashboard.categories.form.image_required"))
    .test("fileType", t("dashboard.categories.form.image_type_error"), (file) =>
      file ? file.type?.startsWith("image/") : false
    ),
});

const { handleSubmit, errors } = useForm({ validationSchema: schema });
const { value: name } = useField("name");
const { value: name_en } = useField("name_en");
const { value: parent_id } = useField("parent_id");
const { value: image } = useField("image");

const onImageSelect = (e) => {
  const file = e.target.files?.[0];
  if (file) {
    image.value = file;
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = URL.createObjectURL(file);
  }
};

const onSubmit = handleSubmit(async (values) => {
  isSubmitting.value = true;
  try {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("name_en", values.name_en);
    if (values.parent_id) formData.append("parent_id", values.parent_id);
    formData.append("image", values.image);

    const response = await requestService.create("/categories", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    showSuccess(
      response?.message || t("dashboard.categories.form.category_added")
    );
    router.push("/dashboard/categories");
  } catch (err) {
    console.error(err);
    showError(
      err?.message || t("dashboard.categories.form.category_add_failed")
    );
  } finally {
    isSubmitting.value = false;
  }
});
</script>

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
        class="card w-full mx-auto px-4 md:px-8 py-8 md:py-12 shadow-lg border border-gray-200 rounded-xl bg-white"
      >
        <div
          class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
        >
          <h2 class="text-2xl font-bold text-slate-800">
            {{ t("dashboard.actions.manage-attributes") }}
          </h2>
          <Button
            :label="$t('dashboard.categories.attributes.add')"
            icon="pi pi-plus"
            class="p-button-success px-4 py-2 rounded-lg text-sm"
            @click="
              () => {
                editingAttr = { name: '', name_en: '', type_id: null };
                dialogVisible = true;
              }
            "
          />
        </div>

        <DataTable
          :value="attributes"
          :loading="loading"
          :paginator="true"
          :rows="rowsPerPage"
          :totalRecords="totalRecords"
          :first="(currentPage - 1) * rowsPerPage"
          @page="onPageChange"
          :rowsPerPageOptions="[5, 10, 20]"
          class="rounded-xl border border-gray-200 shadow-md"
          tableStyle="min-width: 60rem"
          stripedRows
          emptyMessage="No attributes found"
        >
          <Column
            field="name"
            :header="t('dashboard.categories.attributes.name_ar')"
          />
          <Column
            field="name_en"
            :header="t('dashboard.categories.attributes.name_en')"
          />
          <Column :header="t('dashboard.categories.attributes.type')">
            <template #body="slotProps">
              {{ slotProps.data?.type?.name_en || "-" }}
            </template>
          </Column>
          <Column :header="t('table.actions')" style="width: 150px">
            <template #body="slotProps">
              <div class="flex justify-center items-center gap-3">
                <Button
                  icon="pi pi-pencil"
                  v-tooltip.top="$t('generic.edit')"
                  class="p-button-sm p-button-text"
                  @click="onEdit(slotProps.data)"
                />
                <Button
                  icon="pi pi-trash"
                  v-tooltip.top="$t('generic.delete')"
                  class="p-button-sm p-button-text text-red-600"
                  @click="onDelete(slotProps.data.id)"
                />
              </div>
            </template>
          </Column>
        </DataTable>

        <Dialog
          v-model:visible="dialogVisible"
          modal
          :header="
            editingAttr?.id
              ? t('dashboard.categories.attributes.edit')
              : t('dashboard.categories.attributes.add')
          "
          :style="{ maxWidth: '500px', width: '100%' }"
          class="rounded-xl shadow-lg"
        >
          <div class="space-y-6">
            <FloatLabel class="w-full">
              <InputText
                id="name"
                v-model="editingAttr.name"
                class="!bg-slate-50 !rounded-lg !pb-4 w-full"
              />
              <label for="name">{{
                t("dashboard.categories.attributes.name_ar")
              }}</label>
            </FloatLabel>

            <FloatLabel class="w-full">
              <InputText
                id="name_en"
                v-model="editingAttr.name_en"
                class="!bg-slate-50 !rounded-lg !pb-4 w-full"
              />
              <label for="name_en">{{
                t("dashboard.categories.attributes.name_en")
              }}</label>
            </FloatLabel>

            <div
              class="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6"
            >
              <Button
                :label="t('generic.cancel')"
                icon="pi pi-times"
                severity="secondary"
                class="px-4 py-2 rounded-lg"
                @click="dialogVisible = false"
              />
              <Button
                :label="t('generic.save')"
                icon="pi pi-check"
                class="px-4 py-2 rounded-lg"
                @click="saveAttribute"
              />
            </div>
          </div>
        </Dialog>
      </div>
    </main>
  </DashboardLayout>
</template>
