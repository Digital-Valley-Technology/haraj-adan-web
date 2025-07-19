<script setup>
import { MEDIA_URL } from "../../services/axios";
import { useBannersStore } from "../../store/banners";
import draggable from "vuedraggable";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

defineProps(["banners"]);
const emit = defineEmits(["delete", "fetchBanners", "saveOrder", "update"]);

const { t } = useI18n();
const bannerStore = useBannersStore();

const reorderedBanners = ref([]);
const previewUrl = ref(null);
const selectedBanner = ref(null);
const selectedFile = ref(null);
const showModal = ref(false);

watch(
  () => bannerStore.banners,
  (val) => {
    reorderedBanners.value = Array.isArray(val)
      ? [...val]
          .filter((b) => b && b.id !== undefined)
          .sort((a, b) => a.image_order - b.image_order)
      : [];
  },
  { immediate: true }
);

const handleDelete = (banner) => emit("delete", banner);

const handlePreview = (banner) => {
  window.open(`${MEDIA_URL}/${banner.image}`, "_blank");
};

const onSaveOrder = () => {
  const payload = reorderedBanners.value.map((banner, index) => ({
    id: banner.id,
    image_order: index,
  }));
  emit("saveOrder", payload);
};

const onFileInput = (event, banner) => {
  const file = event.target.files[0];
  if (!file) return;

  selectedFile.value = file;
  selectedBanner.value = banner;
  previewUrl.value = URL.createObjectURL(file);
  showModal.value = true;
};

const confirmUpdate = () => {
  if (selectedBanner.value && selectedFile.value) {
    emit("update", {
      id: selectedBanner.value.id,
      image: selectedFile.value,
    });
  }
  resetModal();
};

const resetModal = () => {
  showModal.value = false;
  selectedBanner.value = null;
  selectedFile.value = null;
  previewUrl.value = null;
};
</script>

<template>
  <div class="space-y-4">
    <draggable
      v-model="reorderedBanners"
      item-key="id"
      class="grid gap-4"
      ghost-class="opacity-40"
      handle=".drag-handle"
    >
      <template #item="{ element, index }">
        <div
          v-if="element && element.id"
          class="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all group"
        >
          <!-- Drag Handle -->
          <div
            class="text-gray-400 hover:text-gray-600 drag-handle cursor-move"
          >
            <i class="pi pi-bars text-lg"></i>
          </div>

          <!-- Image Upload -->
          <div class="flex items-center gap-4 flex-grow">
            <div
              class="relative w-20 h-20 rounded-lg overflow-hidden border group"
            >
              <img
                :src="`${MEDIA_URL}/${element.image}`"
                :alt="element.name || 'Banner'"
                class="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
              />

              <label
                class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity"
              >
                <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="(e) => onFileInput(e, element)"
                />
                <i class="pi pi-upload text-white text-lg"></i>
              </label>
            </div>

            <div class="flex flex-col">
              <span class="text-sm text-gray-500">
                {{ t("dashboard.banners.order") }}
              </span>
              <span class="text-base font-semibold text-gray-800">
                {{ (bannerStore.page - 1) * bannerStore.limit + index }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-2">
            <Button
              icon="pi pi-eye"
              severity="secondary"
              outlined
              rounded
              size="small"
              @click="() => handlePreview(element)"
              v-tooltip.bottom="$t('dashboard.actions.preview')"
            />
            <Button
              icon="pi pi-trash"
              severity="danger"
              outlined
              rounded
              size="small"
              @click="() => handleDelete(element)"
              v-tooltip.bottom="$t('dashboard.actions.delete')"
            />
          </div>
        </div>
      </template>
    </draggable>

    <!-- Save Order Button -->
    <div class="flex justify-end">
      <Button
        icon="pi pi-check"
        :label="$t('dashboard.banners.save_order')"
        class="mt-4"
        @click="onSaveOrder"
      />
    </div>

    <!-- Pagination -->
    <Paginator
      v-if="bannerStore && bannerStore.limit"
      :rows="bannerStore.limit"
      :totalRecords="bannerStore.total"
      :first="(bannerStore.page - 1) * bannerStore.limit"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      @page="
        (e) => {
          if (e.rows !== bannerStore.limit) {
            bannerStore.page = 1;
            bannerStore.limit = e.rows;
          } else {
            bannerStore.page = e.page + 1;
          }
          emit('fetchBanners');
        }
      "
    />

    <!-- Preview Modal -->
    <Dialog
      v-model:visible="showModal"
      modal
      header="Preview Image"
      :closable="false"
    >
      <div class="flex flex-col items-center gap-4">
        <img
          v-if="previewUrl"
          :src="previewUrl"
          class="max-w-full max-h-80 rounded shadow"
        />
        <div class="flex justify-end gap-2 w-full">
          <Button
            :label="$t('generic.cancel')"
            severity="secondary"
            outlined
            @click="resetModal"
          />
          <Button
            :label="$t('generic.save')"
            icon="pi pi-check"
            @click="confirmUpdate"
          />
        </div>
      </div>
    </Dialog>
  </div>
</template>
