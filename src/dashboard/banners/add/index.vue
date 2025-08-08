<script setup>
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import DashboardLayout from "../../../Layout/DashboardLayout.vue";
import { DashboardBreadCrumbBase } from "../../../utils/constants";
import requestService from "../../../services/api/requestService";
import { showError, showSuccess } from "../../../utils/notifications";

import draggable from "vuedraggable";

const { t } = useI18n();
const router = useRouter();

const breadcrumbItems = [
  { label: "sidebar.banners", route: "/dashboard/banners" },
  { label: "dashboard.banners.add" },
];

const isSubmitting = ref(false);
const imagesData = ref([]); // Array of { file, url }
const MAX_IMAGES = 5;

const schema = yup.object({
  images: yup
    .mixed()
    .required(t("dashboard.banners.validation.required"))
    .test("is-images", t("dashboard.banners.validation.type"), (files) => {
      return (
        files && Array.from(files).every((f) => f.type.startsWith("image/"))
      );
    })
    .test(
      "max-images",
      t("dashboard.banners.validation.max", { count: MAX_IMAGES }),
      (files) => files && files.length <= MAX_IMAGES
    ),
});

const { handleSubmit, setFieldValue, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    images: [],
  },
});

const { value: images, errorMessage } = useField("images");

// Sync field value with files
watch(imagesData, (val) => {
  setFieldValue(
    "images",
    val.map((img) => img.file)
  );
});

const onImageDrop = (e) => {
  e.preventDefault();
  const files = Array.from(e.dataTransfer.files).filter((f) =>
    f.type.startsWith("image/")
  );
  addFiles(files);
};

const onFileSelect = (e) => {
  const files = Array.from(e.target.files).filter((f) =>
    f.type.startsWith("image/")
  );
  addFiles(files);
};

function addFiles(files) {
  if (imagesData.value.length + files.length > MAX_IMAGES) {
    showError(t("dashboard.banners.validation.max", { count: MAX_IMAGES }));
    return;
  }

  files.forEach((file) => {
    const id = `${file.name}-${Date.now()}-${Math.random()}`;
    imagesData.value.push({
      id, // needed for proper drag tracking
      file,
      url: URL.createObjectURL(file),
    });
  });
}

const removeImage = (index) => {
  imagesData.value.splice(index, 1);
};

const onSubmit = handleSubmit(async () => {
  isSubmitting.value = true;

  try {
    const formData = new FormData();

    // Update image order based on current index
    imagesData.value.forEach((image, index) => {
      formData.append("images[]", image.file);
      formData.append("image_orders[]", index + 1); // Assuming 1-based index
    });

    const res = await requestService.create("/banners", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    showSuccess(res?.status?.message || t("dashboard.banners.success"));
    resetForm();
    imagesData.value = [];
    router.push("/dashboard/banners");
  } catch (error) {
    console.error(error);
    showError(err || t("dashboard.banners.error"));
  } finally {
    isSubmitting.value = false;
  }
});
</script>

<template>
  <DashboardLayout>
    <main class="px-4 md:px-8 py-[var(--padding-dashboard-section)]">
      <Breadcrumb
        class="!p-0 mb-6"
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
              <span class="text-primary font-semibold">
                {{ typeof item.label === "string" ? $t(item.label) : "" }}
              </span>
            </a>
          </router-link>
          <a
            v-else
            :href="item.url"
            :target="item.target"
            v-bind="props.action"
          >
            <span class="text-surface-700 dark:text-surface-0">
              {{ typeof item.label === "string" ? $t(item.label) : "" }}
            </span>
          </a>
        </template>
      </Breadcrumb>

      <div
        class="card w-full mx-auto px-4 md:px-8 py-8 md:py-12 shadow-lg border border-gray-200 rounded-xl"
      >
        <h2 class="text-2xl font-bold mb-6">
          {{ $t("dashboard.banners.add_banner") }}
        </h2>

        <form @submit.prevent="onSubmit" class="space-y-6">
          <div>
            <label class="block font-medium mb-2">
              {{ $t("dashboard.banners.image_upload") }}
            </label>

            <div
              class="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
              @dragover.prevent
              @drop="onImageDrop"
              @click="$refs.fileInput.click()"
            >
              <p class="text-gray-600 text-sm">
                {{ $t("dashboard.banners.drop_or_click") }}
              </p>
              <input
                ref="fileInput"
                type="file"
                multiple
                accept="image/*"
                class="hidden"
                @change="onFileSelect"
              />
            </div>

            <p class="text-red-600 text-sm mt-1" v-if="errorMessage">
              {{ errorMessage }}
            </p>
          </div>

          <draggable
            v-model="imagesData"
            item-key="id"
            tag="div"
            class="flex flex-wrap justify-start gap-4"
          >
            <template #item="{ element, index }">
              <div
                class="relative group border rounded-lg overflow-hidden shadow-sm transition hover:shadow-md bg-white"
                style="width: 120px; height: 120px"
              >
                <img
                  :src="element.url"
                  class="w-full h-full object-cover rounded-md"
                  style="image-rendering: auto"
                  loading="lazy"
                  alt="Preview"
                />
                <button
                  type="button"
                  @click="removeImage(index)"
                  class="absolute top-1 right-1 bg-black/60 hover:bg-red-600 text-white text-xs rounded-full p-1 opacity-80 group-hover:opacity-100"
                  title="Remove image"
                >
                  <i class="pi pi-trash"></i>
                </button>
              </div>
            </template>
          </draggable>

          <div class="pt-6 flex justify-end">
            <button
              :disabled="imagesData.length === 0"
              class="custom-base-button"
              @click="onSubmit"
              type="submit"
            >
              <i
                :class="isSubmitting ? 'pi pi-spinner pi-spin' : 'pi pi-plus'"
              ></i>
              {{ $t("generic.save") }}
            </button>
          </div>
        </form>
      </div>
    </main>
  </DashboardLayout>
</template>
