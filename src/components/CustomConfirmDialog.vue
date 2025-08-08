<script setup>
import { ref, watch, computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  modelValue: Boolean,
  header: String,
  content: {
    type: String,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "confirm"]);

const dialogVisible = ref(props.modelValue);

// Sync with v-model
watch(
  () => props.modelValue,
  (newVal) => {
    dialogVisible.value = newVal;
  }
);

watch(dialogVisible, (newVal) => {
  emit("update:modelValue", newVal);
});

// Use a computed property to fallback to translated "Confirm" if no header provided
const translatedHeader = computed(() => props.header || t("generic.confirm"));
</script>

<template>
  <Dialog
    v-model:visible="dialogVisible"
    :style="{ width: '450px' }"
    :header="translatedHeader"
    :modal="true"
    :closable="false"
  >
    <div v-if="$slots.default">
      <slot />
    </div>
    <div v-else class="flex items-center gap-4">
      <i class="pi pi-exclamation-triangle text-3xl text-yellow-500" />
      <span class="text-gray-700">{{
        content ? content : t("generic.confirmation_message")
      }}</span>
    </div>

    <template #footer>
      <Button
        :label="t('generic.no')"
        icon="pi pi-times"
        text
        @click="dialogVisible = false"
      />
      <Button
        :label="loading ? t('generic.processing') : t('generic.yes')"
        :icon="loading ? 'pi pi-spin pi-spinner' : 'pi pi-check'"
        text
        @click="$emit('confirm')"
        :disabled="loading"
      />
    </template>
  </Dialog>
</template>
