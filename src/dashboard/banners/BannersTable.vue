<script setup>
import { MEDIA_URL } from "../../services/axios";
import { useBannersStore } from "../../store/banners";
import draggable from "vuedraggable";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  banners: Array,
  loadingReorder: Boolean,
  loadingUpdate: Boolean,
  loadingFetch: Boolean,
});

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
    image_order: index + 1,
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
      :disabled="props.loadingReorder"
    >
      <template #item="{ element, index }">
        <div
          v-if="element && element.id"
          class="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all group"
        >
          <div
            class="text-gray-400 hover:text-gray-600 drag-handle cursor-move"
          >
            <i class="pi pi-bars text-lg"></i>
          </div>

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
                {{ element?.image_order }}
              </span>
            </div>
          </div>

          <div class="flex gap-2">
            <Button
              icon="pi pi-eye"
              severity="info"
              rounded
              size="small"
              :label="$t('dashboard.actions.details')"
              @click="() => handlePreview(element)"
              v-tooltip.bottom="$t('dashboard.actions.details')"
            />
            <Button
              icon="pi pi-trash"
              severity="danger"
              rounded
              :label="$t('dashboard.actions.delete')"
              size="small"
              @click="() => handleDelete(element)"
              v-tooltip.bottom="$t('dashboard.actions.delete')"
              :disabled="props.loadingUpdate"
            />
          </div>
        </div>
      </template>
    </draggable>

    <div class="flex justify-end">
      <button
        :disabled="props.loadingReorder"
        class="custom-base-button mt-4"
        @click="onSaveOrder"
        type="submit"
      >
        <i
          :class="props.loadingReorder ? 'pi pi-spinner pi-spin' : 'pi pi-save'"
        ></i>
        {{ $t("dashboard.banners.save_order") }}
      </button>
    </div>

    <div v-if="props.loadingFetch" class="flex justify-center py-6">
      <i class="pi pi-spinner pi-spin text-2xl text-primary"></i>
    </div>

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

    <Dialog
      v-model:visible="showModal"
      modal
      :header="$t('generic.edit')"
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
            @click="resetModal"
          />

          <button class="custom-base-button" @click="confirmUpdate">
            <i
              :class="
                props.loadingUpdate ? 'pi pi-spinner pi-spin' : 'pi pi-save'
              "
            ></i>
            <span>{{ $t("generic.save") }}</span>
          </button>
        </div>
      </div>
    </Dialog>
  </div>
</template>
