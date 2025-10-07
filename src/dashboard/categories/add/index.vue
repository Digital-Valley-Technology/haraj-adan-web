<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import requestService from "../../../services/api/requestService";
import { useGeneralStore } from "../../../store/general";
import { showError, showSuccess } from "../../../utils/notifications";
import DashboardLayout from "../../../Layout/DashboardLayout.vue";
import { useLocaleText } from "../../../utils/useLocaleText";
import { DashboardBreadCrumbBase } from "../../../utils/constants";
import { decode, encode } from "js-base64";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const generalStore = useGeneralStore();
const localeText = useLocaleText();

const isSubmitting = ref(false);
const previewUrl = ref(null);

// data
const categories = ref([]); // dropdown options (either all categories, or [parent] when locked)
const rawBreadcrumb = ref([]); // array received from API (name/name_en/id/parent_id)
const parentName = ref("");

/* --- validation --- */
const schema = yup.object({
  name: yup.string().required(t("dashboard.categories.form.name_required")),
  name_en: yup
    .string()
    .required(t("dashboard.categories.form.name_en_required")),
  parent_id: yup.number().nullable(),
  image: yup
    .mixed()
    .required(t("dashboard.categories.form.image_required"))
    .test(
      "fileType",
      t("dashboard.categories.form.image_invalid"),
      (value) => value instanceof File
    ),
});

const { handleSubmit, errors } = useForm({ validationSchema: schema });
const { value: name } = useField("name");
const { value: name_en } = useField("name_en");
const { value: parent_id } = useField("parent_id");
const { value: image } = useField("image");

const breadcrumbItems = computed(() => {
  // map raw API crumbs -> items (localized label + route to that crumb)
  const items = rawBreadcrumb.value.map((c) => ({
    label: localeText(c.name, c.name_en), // choose correct language
    route: c.id
      ? { name: "subcategories", params: { parentId: encode(String(c.id)) } }
      : null,
  }));

  // push final "Add" label (localized) — if inside parent include parent name
  if (route.params?.parentId && parentName.value) {
    items.push({
      label: `${t("dashboard.categories.form.add_category")} (${
        parentName.value
      })`,
    });
  } else {
    items.push({ label: t("dashboard.categories.form.add_category") });
  }

  // Always start with base "Categories" (translated)
  return [
    { label: t("sidebar.categories"), route: "/dashboard/categories" },
    ...items,
  ];
});

/* --- fetch categories for dropdown (root add) --- */
const fetchCategories = async () => {
  try {
    generalStore.setLoading(true);
    const res = await requestService.getAll("/categories");
    categories.value = [
      {
        id: null,
        name: t("dashboard.categories.form.no_parent"),
        name_en: t("dashboard.categories.form.no_parent"),
      },
      ...(res?.data || []),
    ];
  } catch (error) {
    console.error("fetchCategories error:", error);
  } finally {
    generalStore.setLoading(false);
  }
};

/* --- fetch breadcrumb for a given parentId (and lock parent select) --- */
const fetchBreadcrumb = async () => {
  const parentParam = route.params?.parentId;
  if (!parentParam) {
    rawBreadcrumb.value = [];
    parentName.value = "";
    return;
  }

  try {
    const decodedId = decode(parentParam);
    const res = await requestService.getAll(
      `/categories/${decodedId}/breadcrumb`
    );
    const apiCrumbs = Array.isArray(res.data) ? res.data : [];

    // store the raw chain (ancestors). Example: [{id:1,name,..},{id:2,name..}, ...]
    rawBreadcrumb.value = apiCrumbs;

    // derive the immediate parent (last item in chain) to lock select + label
    const last = apiCrumbs[apiCrumbs.length - 1];
    if (last) {
      parentName.value = localeText(last.name, last.name_en) || "";
      // single-option dropdown so user sees selected parent
      categories.value = [
        {
          id: last.id,
          name: last.name,
          name_en: last.name_en,
        },
      ];
      parent_id.value = last.id ?? null;
    } else {
      // fallback
      parentName.value = "";
      categories.value = [];
      parent_id.value = null;
    }
  } catch (err) {
    console.error("fetchBreadcrumb error:", err);
    rawBreadcrumb.value = [];
    parentName.value = "";
    categories.value = [];
    parent_id.value = null;
  }
};

/* --- lifecycle --- */
onMounted(async () => {
  if (route.params?.parentId) {
    await fetchBreadcrumb();
  } else {
    await fetchCategories();
  }
});

// react to route parent changes
watch(
  () => route.params?.parentId,
  async (newVal, oldVal) => {
    if (newVal) {
      await fetchBreadcrumb();
    } else {
      // switched to root
      parentName.value = "";
      rawBreadcrumb.value = [];
      parent_id.value = null;
      await fetchCategories();
    }
  }
);

onUnmounted(() => {
  if (previewUrl.value?.startsWith("blob:")) {
    URL.revokeObjectURL(previewUrl.value);
  }
});

/* --- image handling --- */
const onImageSelect = (e) => {
  const file = e.target.files?.[0];
  if (file) {
    image.value = file;
    if (previewUrl.value?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl.value);
    }
    previewUrl.value = URL.createObjectURL(file);
  }
};

/* --- submit --- */
const onSubmit = handleSubmit(async (values) => {
  isSubmitting.value = true;
  try {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("name_en", values.name_en);
    formData.append("parent_id", values.parent_id ?? "");
    if (values.image instanceof File) {
      formData.append("image", values.image);
    }

    const response = await requestService.create("/categories", formData);
    showSuccess(
      response?.status?.message ||
        t("dashboard.categories.form.category_created")
    );

    // redirect back to the appropriate categories list
    if (route.params?.parentId) {
      router.push({
        name: "subcategories",
        params: { parentId: route.params.parentId },
      });
    } else {
      router.push("/dashboard/categories");
    }
  } catch (error) {
    console.error("create category error:", error);
    showError(error || t("dashboard.categories.form.category_create_failed"));
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
          <!-- item.route may be a string (e.g. '/dashboard/categories') or a route object -->
          <router-link
            v-if="item.route"
            v-slot="{ href, navigate }"
            :to="item.route"
            custom
          >
            <a :href="href" v-bind="props.action" @click="navigate">
              <span :class="[item.icon, 'text-color']" />
              <span class="text-primary font-semibold">{{ item.label }}</span>
            </a>
          </router-link>

          <a
            v-else
            :href="item.url"
            :target="item.target"
            v-bind="props.action"
          >
            <span class="text-surface-700 dark:text-surface-0">{{
              item.label
            }}</span>
          </a>
        </template>
      </Breadcrumb>

      <div
        class="card w-full mx-auto px-4 md:px-8 py-8 md:py-12 shadow-lg border border-gray-200 rounded-xl"
      >
        <form @submit.prevent="onSubmit" class="space-y-10">
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

          <div class="w-full">
            <Select
              id="parent_id"
              v-model="parent_id"
              :options="categories"
              optionLabel="name"
              optionValue="id"
              :placeholder="t('dashboard.categories.form.select_parent')"
              class="!bg-slate-50 !rounded-lg !pb-2 w-full"
              showClear
              :disabled="!!route.params?.parentId"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value">
                  {{
                    localeText(
                      categories.find((cat) => cat.id === slotProps.value)
                        ?.name,
                      categories.find((cat) => cat.id === slotProps.value)
                        ?.name_en
                    ) || t("dashboard.categories.form.select_parent")
                  }}
                </div>
                <div v-else>
                  {{ t("dashboard.categories.form.select_parent") }}
                </div>
              </template>

              <template #option="slotProps">
                <div>
                  {{
                    localeText(
                      slotProps.option?.name,
                      slotProps.option?.name_en
                    )
                  }}
                </div>
              </template>

              <template #dropdownicon>
                <i class="pi pi-chevron-down" />
              </template>
            </Select>

            <small v-if="errors.parent_id" class="text-red-500">{{
              errors.parent_id
            }}</small>
          </div>

          <div>
            <label
              for="image-upload"
              class="block text-sm font-semibold mb-2"
              >{{ t("dashboard.categories.form.image") }}</label
            >

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
                >{{ image?.name }}</span
              >
            </div>

            <input
              id="image-upload"
              type="file"
              accept="image/*"
              class="hidden"
              @change="onImageSelect"
            />

            <small v-if="errors.image" class="text-red-500 block mt-1">{{
              errors.image
            }}</small>

            <div v-if="previewUrl" class="mt-4">
              <img
                :src="previewUrl"
                alt="Preview"
                class="w-32 h-32 object-cover rounded-lg shadow border border-gray-300"
              />
            </div>
          </div>

          <button
            :disabled="isSubmitting"
            class="custom-base-button w-full !rounded-xl flex items-center justify-center"
            type="submit"
          >
            <i
              :class="isSubmitting ? 'pi pi-spinner pi-spin' : 'pi pi-plus'"
            ></i>
            {{
              isSubmitting
                ? t("dashboard.categories.form.adding_category")
                : t("dashboard.categories.form.add_category")
            }}
          </button>
        </form>
      </div>
    </main>
  </dashboard-layout>
</template>
