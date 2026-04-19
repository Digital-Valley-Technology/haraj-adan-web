<template>
  <Dialog
    v-model:visible="visible"
    :header="$t('report.title')"
    :style="{ width: '450px' }"
    :modal="true"
    :closable="!isSubmitting"
  >
    <div class="space-y-4">
      <p class="text-gray-600 text-sm">
        {{ $t('report.description') }}
      </p>

      <!-- Report Reasons -->
      <div>
        <label class="block mb-2 text-sm font-medium">
          {{ $t('report.reason_label') }}
        </label>
        <div class="flex flex-col gap-2">
          <label
            v-for="reason in reportReasons"
            :key="reason.value"
            class="flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-gray-50"
            :class="{ 'border-[#146AAB] bg-blue-50': selectedReason === reason.value }"
          >
            <input
              type="radio"
              :value="reason.value"
              v-model="selectedReason"
              class="text-[#146AAB]"
            />
            <span class="text-sm">{{ $t(reason.labelKey) }}</span>
          </label>
        </div>
      </div>

      <!-- Additional Details -->
      <div>
        <label class="block mb-2 text-sm font-medium">
          {{ $t('report.details_label') }}
          <span class="text-gray-400 text-xs">({{ $t('report.optional') }})</span>
        </label>
        <textarea
          v-model="description"
          :placeholder="$t('report.details_placeholder')"
          class="w-full border border-gray-300 rounded-md p-2 text-sm resize-none"
          rows="3"
        ></textarea>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <Button
          :label="$t('generic.cancel')"
          icon="pi pi-times"
          text
          :disabled="isSubmitting"
          @click="closeDialog"
        />
        <Button
          :label="isSubmitting ? $t('report.submitting') : $t('report.submit')"
          icon="pi pi-check"
          :loading="isSubmitting"
          :disabled="!selectedReason || isSubmitting"
          @click="submitReport"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import requestService from '../services/api/requestService';
import { showSuccess, showError } from '../utils/notifications';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  adId: {
    type: [Number, String],
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'reported']);

const { t } = useI18n();

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const selectedReason = ref('');
const description = ref('');
const isSubmitting = ref(false);

const reportReasons = [
  { value: 'spam', labelKey: 'report.reasons.spam' },
  { value: 'inappropriate', labelKey: 'report.reasons.inappropriate' },
  { value: 'fraud', labelKey: 'report.reasons.fraud' },
  { value: 'wrong_category', labelKey: 'report.reasons.wrong_category' },
  { value: 'duplicate', labelKey: 'report.reasons.duplicate' },
  { value: 'other', labelKey: 'report.reasons.other' }
];

const closeDialog = () => {
  visible.value = false;
  resetForm();
};

const resetForm = () => {
  selectedReason.value = '';
  description.value = '';
};

const submitReport = async () => {
  if (!selectedReason.value) return;

  isSubmitting.value = true;

  try {
    const response = await requestService.create('/ads/reports', {
      ad_id: Number(props.adId),
      reason: selectedReason.value,
      description: description.value || null
    });

    showSuccess(response?.message || t('report.success'));
    emit('reported');
    closeDialog();
  } catch (error) {
    console.error('Failed to submit report:', error);
    showError(error?.message || t('report.error'));
  } finally {
    isSubmitting.value = false;
  }
};
</script>
