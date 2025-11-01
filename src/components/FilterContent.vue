<template>
  <div class="p-4 bg-white rounded-lg mb-2">
    <h6 class="text-xs font-medium mb-2">
      {{ currentLocale == "ar" ? "الفئة" : "Category" }}
    </h6>
    <select
      name="category"
      id="category"
      class="border rounded-md p-2 w-full border-[#cdced1] mb-4"
    >
      <option
        v-for="(cat, index) in categoriesFilter"
        :key="index"
        :value="cat.id"
      >
        {{ currentLocale === "ar" ? cat?.name_ar : cat?.name_en }}
      </option>
    </select>

    <h6 class="text-xs font-medium mb-4">
      {{ currentLocale == "ar" ? "بحث بالقرب مني" : "Search Near Me" }}
    </h6>
    <div class="flex justify-between items-center text-[9px] mb-4">
      <span>{{ currentLocale == "ar" ? "0.1 كم" : "0.1 km" }}</span>
      <span>-</span>
      <span>{{
        currentLocale == "ar" ? "جميع المسافات" : "All Distances"
      }}</span>
    </div>
    <div class="card flex justify-center mb-4">
      <Slider
        :modelValue="value"
        range
        class="w-full"
        @update:modelValue="$emit('update:value', $event)"
      />
    </div>

    <h6 class="text-xs font-medium mb-2">
      {{ currentLocale == "ar" ? "السعر" : "Price" }}
    </h6>
    <div>
      <div class="flex items-center justify-between w-full mb-4">
        <input
          type="text"
          :placeholder="currentLocale == 'ar' ? 'على الأقل' : 'At least'"
          class="py-2 px-2 border border-[#cdced1] text-xs rounded-md text-center w-30"
        />
        <span>-</span>
        <input
          type="text"
          :placeholder="currentLocale == 'ar' ? 'على الأكثر' : 'At most'"
          class="py-2 px-2 border border-[#cdced1] text-xs rounded-md text-center w-30"
        />
      </div>
    </div>
    <select
      name="currency"
      id="currency"
      class="border rounded-md p-2 w-full border-[#cdced1] mb-4"
    >
      <option value="USD">
        {{ currentLocale === "ar" ? "دولار أمريكي" : "USD" }}
      </option>
      <option value="SAR">
        {{ currentLocale === "ar" ? "ريال سعودي" : "SAR" }}
      </option>
    </select>

    <h6 class="text-xs font-medium mb-4">
      {{ currentLocale == "ar" ? "عدد الملاك" : "No. of owners" }}
    </h6>
    <div class="flex flex-wrap gap-2 mb-4">
      <button
        v-for="btn in ownersButtons"
        :key="btn.id"
        @click="$emit('update:activeButton', btn.id)"
        :class="[
          'text-xs capitalize py-2 px-4 rounded-md cursor-pointer transition-colors',
          activeButton === btn.id
            ? 'bg-[#146AAB] text-white'
            : 'bg-[#EDEFF2] text-black hover:bg-[#0f76c5] hover:text-white',
        ]"
      >
        {{ currentLocale === "ar" ? btn.labelAr : btn.labelEn }}
      </button>
    </div>

    <h6 class="text-xs font-medium mb-4">
      {{
        currentLocale == "ar" ? "بواسطة الكيلومترات المقطوعة" : "by km driven"
      }}
    </h6>
    <div class="flex flex-wrap gap-2 mb-4">
      <button
        v-for="btn in drivenButtons"
        :key="btn.id"
        @click="$emit('update:activeButton2', btn.id)"
        :class="[
          'text-xs capitalize py-2 px-4 rounded-md cursor-pointer transition-colors',
          activeButton2 === btn.id
            ? 'bg-[#146AAB] text-white'
            : 'bg-[#EDEFF2] text-black hover:bg-[#0f76c5] hover:text-white',
        ]"
      >
        {{ currentLocale === "ar" ? btn.labelAr : btn.labelEn }}
      </button>
    </div>

    <h6 class="text-xs font-medium mb-4">
      {{ currentLocale == "ar" ? "بالوقود" : "by fuel" }}
    </h6>
    <div class="flex flex-wrap gap-2 mb-4">
      <button
        v-for="btn in fuelButtons"
        :key="btn.id"
        @click="$emit('update:activeButton3', btn.id)"
        :class="[
          'text-xs capitalize py-2 px-4 rounded-md cursor-pointer transition-colors',
          activeButton3 === btn.id
            ? 'bg-[#146AAB] text-white'
            : 'bg-[#EDEFF2] text-black hover:bg-[#0f76c5] hover:text-white',
        ]"
      >
        {{ currentLocale === "ar" ? btn.labelAr : btn.labelEn }}
      </button>
    </div>

    <h6 class="text-xs font-medium mb-4">
      {{ currentLocale == "ar" ? "الحالة" : "condition" }}
    </h6>
    <div class="flex flex-wrap gap-2 mb-4">
      <button
        v-for="btn in conditionButton"
        :key="btn.id"
        @click="$emit('update:activeButton4', btn.id)"
        :class="[
          'text-xs capitalize py-2 px-4 rounded-md cursor-pointer transition-colors',
          activeButton4 === btn.id
            ? 'bg-[#146AAB] text-white'
            : 'bg-[#EDEFF2] text-black hover:bg-[#0f76c5] hover:text-white',
        ]"
      >
        {{ currentLocale === "ar" ? btn.labelAr : btn.labelEn }}
      </button>
    </div>

    <h6 class="text-xs font-medium mb-4">
      {{ currentLocale == "ar" ? "التاريخ" : "date" }}
    </h6>
    <div class="flex flex-wrap gap-2 mb-4">
      <button
        v-for="btn in dateButton"
        :key="btn.id"
        @click="$emit('update:activeButton5', btn.id)"
        :class="[
          'text-xs capitalize py-2 px-4 rounded-md cursor-pointer transition-colors',
          activeButton5 === btn.id
            ? 'bg-[#146AAB] text-white'
            : 'bg-[#EDEFF2] text-black hover:bg-[#0f76c5] hover:text-white',
        ]"
      >
        {{ currentLocale === "ar" ? btn.labelAr : btn.labelEn }}
      </button>
    </div>

    <h6 class="text-xs font-medium mb-4">
      {{ currentLocale == "ar" ? "الموقع" : "Location" }}
    </h6>
    <div v-for="location in locations" class="flex flex-col gap-2 mb-4">
      <div class="flex justify-between">
        <p class="text-xs">
          {{ currentLocale == "ar" ? location.labelAr : location.labelEn }}
        </p>
        <button
          @click="location.checked = !location.checked"
          class="cursor-pointer"
        >
          <i
            :class="['pi', location.checked ? 'pi-check-square' : 'pi-stop']"
          ></i>
        </button>
      </div>
    </div>

    <h6 class="text-xs font-medium mb-4">
      {{ currentLocale == "ar" ? "آخرى" : "Others" }}
    </h6>
    <div v-for="other in others" class="flex flex-col gap-2 mb-4">
      <div class="flex justify-between">
        <p class="text-xs">
          {{ currentLocale == "ar" ? other.labelAr : other.labelEn }}
        </p>
        <button @click="other.checked = !other.checked" class="cursor-pointer">
          <i :class="['pi', other.checked ? 'pi-check-square' : 'pi-stop']"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import Slider from "primevue/slider"; // Ensure this is imported if needed here
import { defineProps, defineEmits } from "vue";

// Define the reactive data passed from the parent
const props = defineProps({
  currentLocale: { type: String, required: true },
  categoriesFilter: { type: Array, default: () => [] },
  ownersButtons: { type: Array, default: () => [] },
  drivenButtons: { type: Array, default: () => [] },
  fuelButtons: { type: Array, default: () => [] },
  conditionButton: { type: Array, default: () => [] },
  dateButton: { type: Array, default: () => [] },
  locations: { type: Array, default: () => [] },
  others: { type: Array, default: () => [] },
  // Active states using V-model convention (modelValue for Slider, v-model:prop for others)
  value: [Number, Array],
  activeButton: String,
  activeButton2: [String, Number],
  activeButton3: [String, Number],
  activeButton4: [String, Number],
  activeButton5: [String, Number],
});

// Define custom events for two-way binding with the parent
const emit = defineEmits([
  "update:value",
  "update:activeButton",
  "update:activeButton2",
  "update:activeButton3",
  "update:activeButton4",
  "update:activeButton5",
]);
</script>
