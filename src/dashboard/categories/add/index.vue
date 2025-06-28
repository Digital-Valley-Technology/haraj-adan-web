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

    showSuccess(response?.message || t("dashboard.categories.form.category_added"));
    router.push("/dashboard/categories");
  } catch (err) {
    console.error(err);
    showError(err?.message || t("dashboard.categories.form.category_add_failed"));
  } finally {
    isSubmitting.value = false;
  }
});
</script>

<template>
  <dashboard-layout>
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
        <form @submit.prevent="onSubmit" class="space-y-10">
          <!-- Name & English Name -->
          <div class="flex flex-col md:flex-row gap-6">
            <FloatLabel class="flex-grow">
              <InputText
                id="name"
                v-model="name"
                class="!bg-slate-50 !rounded-lg !pb-4 w-full"
              />
              <label for="name">{{
                t("dashboard.categories.form.name")
              }}</label>
              <small v-if="errors.name" class="text-red-500">{{
                errors.name
              }}</small>
            </FloatLabel>

            <FloatLabel class="flex-grow">
              <InputText
                id="name_en"
                v-model="name_en"
                class="!bg-slate-50 !rounded-lg !pb-4 w-full"
              />
              <label for="name_en">{{
                t("dashboard.categories.form.name_en")
              }}</label>
              <small v-if="errors.name_en" class="text-red-500">{{
                errors.name_en
              }}</small>
            </FloatLabel>
          </div>

          <!-- Parent Category -->
          <div class="w-full">
            <Select
              id="parent_id"
              v-model="parent_id"
              :options="categories"
              optionLabel="name"
              optionValue="id"
              :placeholder="t('dashboard.categories.form.select_parent')"
              class="!bg-slate-50 !rounded-lg !pb-2 w-full"
              fluid
              size="small"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value">
                  {{
                    categories.find((cat) => cat.id === slotProps.value)
                      ?.name || t("dashboard.categories.form.select_parent")
                  }}
                </div>
                <div v-else>
                  {{ t("dashboard.categories.form.select_parent") }}
                </div>
              </template>

              <template #option="slotProps">
                <div>
                  {{ slotProps.option.name }}
                </div>
              </template>

              <template #dropdownicon>
                <i class="pi pi-chevron-down" />
              </template>
            </Select>

            <small v-if="errors.parent_id" class="text-red-500">
              {{ errors.parent_id }}
            </small>
          </div>

          <!-- Image Upload -->
          <div>
            <label for="image-upload" class="block text-sm font-semibold mb-2">
              {{ t("dashboard.categories.form.image") }}
            </label>

            <div class="flex items-center gap-4">
              <label
                for="image-upload"
                class="inline-block bg-slate-100 hover:bg-slate-200 text-gray-700 font-medium px-4 py-2 rounded-lg cursor-pointer border border-gray-300"
              >
                <i class="pi pi-upload mr-2"></i>
                {{ t("dashboard.categories.form.choose_image") }}
              </label>
              <span
                v-if="image?.name"
                class="text-sm text-gray-500 truncate max-w-[200px]"
              >
                {{ image?.name }}
              </span>
            </div>

            <input
              id="image-upload"
              type="file"
              accept="image/*"
              class="hidden"
              @change="onImageSelect"
            />

            <small v-if="errors.image" class="text-red-500 block mt-1">
              {{ errors.image }}
            </small>

            <!-- Preview -->
            <div v-if="previewUrl" class="mt-4">
              <img
                :src="previewUrl"
                alt="Preview"
                class="w-32 h-32 object-cover rounded-lg shadow border border-gray-300"
              />
            </div>
          </div>

          <!-- Submit -->

          <Button
            type="submit"
            class="!block w-full !rounded-xl flex items-center justify-center gap-2"
            size="large"
            :disabled="isSubmitting"
          >
            <i v-if="!isSubmitting" class="pi pi-check-circle me-2"></i>
            <i v-else class="pi pi-spinner pi-spin me-2"></i>
            <span>
              {{
                isSubmitting
                  ? t("dashboard.categories.form.adding_category")
                  : t("dashboard.categories.form.add_category")
              }}
            </span>
          </Button>
        </form>
      </div>
    </main>
  </dashboard-layout>
</template>
