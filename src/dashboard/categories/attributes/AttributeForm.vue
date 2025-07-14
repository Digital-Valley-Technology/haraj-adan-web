<template>
  <div class="space-y-10">
    <!-- Name AR -->
    <div class="flex flex-col md:flex-row gap-6">
      <FloatLabel class="flex-grow">
        <InputText
          id="name"
          v-model="modelValue.name"
          class="!bg-slate-50 !rounded-lg !pb-4 w-full"
        />
        <label for="name">
          {{ t("dashboard.categories.form.name") }}
        </label>
        <small v-if="errors.name" class="text-red-500">{{ errors.name }}</small>
      </FloatLabel>
    </div>

    <!-- Name EN -->
    <div class="flex flex-col md:flex-row gap-6">
      <FloatLabel class="flex-grow">
        <InputText
          id="name_en"
          v-model="modelValue.name_en"
          class="!bg-slate-50 !rounded-lg !pb-4 w-full"
        />
        <label for="name_en">
          {{ t("dashboard.categories.form.name") }}
        </label>
        <small v-if="errors.name_en" class="text-red-500">{{
          errors.name_en
        }}</small>
      </FloatLabel>
    </div>

    <!-- Attribute Type -->
    <div class="w-full">
      <Select
        id="type_id"
        v-model="modelValue.type_id"
        :options="types"
        optionLabel="name"
        optionValue="id"
        :placeholder="t('dashboard.categories.attributes.type')"
        class="!bg-slate-50 !rounded-lg !pb-2 w-full"
        showClear
      >
        <template #value="slotProps">
          <div v-if="slotProps.value">
            {{
              localeText(
                types.find((cat) => cat.id === slotProps.value)?.name,
                types.find((cat) => cat.id === slotProps.value)?.name_en
              )
            }}
          </div>
          <div v-else>
            {{ t("dashboard.categories.attributes.type") }}
          </div>
        </template>
        <template #option="slotProps">
          <div>
            {{ localeText(slotProps.option?.name, slotProps.option?.name_en) }}
          </div>
        </template>
        <template #dropdownicon>
          <i class="pi pi-chevron-down" />
        </template>
      </Select>
      <small v-if="errors.type_id" class="text-red-500">{{
        errors.type_id
      }}</small>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useLocaleText } from "../../../utils/useLocaleText";

defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  types: {
    type: Array,
    required: true,
  },
  errors: {
    type: Object,
    required: true,
  },
});

defineEmits(["update:modelValue"]);

const { t } = useI18n();
const localeText = useLocaleText();
</script>
