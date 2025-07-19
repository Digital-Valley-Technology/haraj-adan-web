<template>
  <div class="space-y-8">
    <!-- Name Fields -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FloatLabel>
        <InputText
          id="name"
          v-model="modelValue.name"
          class="!bg-slate-50 !rounded-lg !pb-4 w-full"
        />
        <label for="name">{{
          t("dashboard.categories.attributes.name_ar")
        }}</label>
        <small v-if="errors?.name" class="text-red-500">{{
          errors.name
        }}</small>
      </FloatLabel>

      <FloatLabel>
        <InputText
          id="name_en"
          v-model="modelValue.name_en"
          class="!bg-slate-50 !rounded-lg !pb-4 w-full"
        />
        <label for="name_en">{{
          t("dashboard.categories.attributes.name_en")
        }}</label>
        <small v-if="errors?.name_en" class="text-red-500">{{
          errors.name_en
        }}</small>
      </FloatLabel>
    </div>

    <!-- Type Select -->
    <div>
      <label class="block mb-2 font-medium text-sm text-gray-700">
        {{ t("dashboard.categories.attributes.type") }}
      </label>
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
        <template #value="{ value }">
          <div v-if="value">
            {{
              localeText(
                types.find((cat) => cat.id === value)?.name,
                types.find((cat) => cat.id === value)?.name_en
              )
            }}
          </div>
          <div v-else>{{ t("dashboard.categories.attributes.type") }}</div>
        </template>
        <template #option="{ option }">
          <div>
            {{ localeText(option?.name, option?.name_en) }}
          </div>
        </template>
        <template #dropdownicon>
          <i class="pi pi-chevron-down" />
        </template>
      </Select>
      <small v-if="errors?.type_id" class="text-red-500">
        {{ errors.type_id }}
      </small>
    </div>

    <!-- Attribute Values -->
    <div
      v-if="showValuesInput"
      class="space-y-4 border-t border-gray-200 pt-6 mt-6"
    >
      <h3 class="text-base font-semibold text-gray-800 mb-2">
        {{ t("dashboard.categories.attributes.values") }}
      </h3>

      <small
        v-if="errors['values.0.name'] || errors['values.0.name_en']"
        class="text-red-500 block mb-2"
      >
        {{ t("dashboard.categories.attributes.type_value_required") }}
      </small>

      <draggable
        v-model="attributeValues"
        item-key="_uuid"
        handle=".handle"
        :animation="200"
        tag="div"
        class="space-y-4"
      >
        <template #item="{ element, index }">
          <div
            class="flex flex-col md:flex-row gap-4 items-center bg-slate-100 p-4 rounded-lg shadow"
            :key="element._uuid"
          >
            <span class="cursor-move handle text-gray-400"
              ><i class="pi pi-bars"
            /></span>

            <div class="w-full">
              <InputText
                v-model="element.name"
                :placeholder="t('dashboard.categories.attributes.value_ar')"
                class="!bg-white !rounded-lg w-full"
              />
              <small
                v-if="errors[`values.${index}.name`]"
                class="text-red-500 text-xs"
              >
                {{ errors[`values.${index}.name`] }}
              </small>
            </div>

            <div class="w-full">
              <InputText
                v-model="element.name_en"
                :placeholder="t('dashboard.categories.attributes.value_en')"
                class="!bg-white !rounded-lg w-full"
              />
              <small
                v-if="errors[`values.${index}.name_en`]"
                class="text-red-500 text-xs"
              >
                {{ errors[`values.${index}.name_en`] }}
              </small>
            </div>
            <button
              type="button"
              class="text-red-500"
              @click="removeValue(index)"
              :disabled="attributeValues.length === 1"
              :class="{
                'opacity-50 cursor-not-allowed': attributeValues.length === 1,
              }"
            >
              <i class="pi pi-trash"></i>
            </button>
          </div>
        </template>
      </draggable>

      <button
        type="button"
        class="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
        @click="addValue"
      >
        <i class="pi pi-plus" />
        <span>{{ t("generic.add") }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import draggable from "vuedraggable";
import { useLocaleText } from "../../../utils/useLocaleText";

const props = defineProps({
  modelValue: Object,
  types: Array,
  errors: Object,
});
const emit = defineEmits(["update:modelValue"]);

const { t } = useI18n();
const localeText = useLocaleText();

const selectedType = computed(() =>
  props.types.find((t) => t.id === props.modelValue?.type_id)
);
const showValuesInput = computed(() =>
  ["checkbox", "radio"].includes(selectedType.value?.code)
);

const attributeValues = computed({
  get() {
    return props.modelValue.values ?? [];
  },
  set(val) {
    emit("update:modelValue", {
      ...props.modelValue,
      values: val,
    });
  },
});

watch(
  () => props.modelValue.type_id,
  (newTypeId, oldTypeId) => {
    const newType = props.types.find((t) => t.id === newTypeId)?.code;

    if (["checkbox", "radio"].includes(newType)) {
      if (!props.modelValue.values || props.modelValue.values.length === 0) {
        emit("update:modelValue", {
          ...props.modelValue,
          values: [
            {
              name: "",
              name_en: "",
              _uuid: Date.now() + Math.random(),
            },
          ],
        });
      }
    } else {
      emit("update:modelValue", {
        ...props.modelValue,
        values: [],
      });
    }
  }
);

const addValue = () => {
  attributeValues.value = [
    ...attributeValues.value,
    {
      name: "",
      name_en: "",
      _uuid: Date.now() + Math.random(),
    },
  ];
};

const removeValue = (index) => {
  attributeValues.value.splice(index, 1);
};
</script>

<style scoped>
.drag-item {
  background-color: #f8fafc;
  padding: 1rem;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
@media (min-width: 768px) {
  .drag-item {
    flex-direction: row;
    align-items: center;
  }
}
.input-group {
  transition: box-shadow 0.2s ease;
}
.input-group:focus-within {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  border-radius: 0.5rem;
}
</style>
