<template>
  <div class="p-4 bg-white rounded-lg mb-2">
    <h6 class="text-sm font-medium mb-2">
      {{ currentLocale == 'ar' ? 'تصفية' : 'Filter' }}
    </h6>

    <!-- Category -->
    <h6 class="text-xs font-medium mb-2">
      {{ currentLocale == 'ar' ? 'الفئة' : 'Category' }}
    </h6>
    <select
      class="border rounded-md p-2 w-full border-[#cdced1] mb-4"
      v-model="filtersStore.selectedCategory"
      @change="filtersStore.setSelectedCategory(filtersStore.selectedCategory)"
    >
      <option
        v-for="cat in categoriesFilter"
        :key="cat.id"
        :value="cat"
      >
        {{ currentLocale === 'ar' ? cat?.name : cat?.name_en }}
      </option>
    </select>

    <!-- Price -->
    <h6 class="text-xs font-medium mb-2">
      {{ currentLocale == 'ar' ? 'السعر' : 'Price' }}
    </h6>
    <div class="flex items-center justify-between w-full mb-4">
      <input
        type="number"
        v-model="filtersStore.minPrice"
        :placeholder="currentLocale == 'ar' ? 'على الأقل' : 'At least'"
        class="py-2 px-2 border border-[#cdced1] text-xs rounded-md text-center w-30"
      />
      <span>-</span>
      <input
        type="number"
        v-model="filtersStore.maxPrice"
        :placeholder="currentLocale == 'ar' ? 'على الأكثر' : 'At most'"
        class="py-2 px-2 border border-[#cdced1] text-xs rounded-md text-center w-30"
      />
    </div>

    <!-- Dynamic Filters (radio logic) -->
    <div
      v-for="item in selectedCategory?.category_attributes"
      :key="item.id"
    >
      <div
        v-if="
          item?.category_attributes_types?.code !== 'location' &&
          item?.category_attributes_types?.code !== 'textarea' &&
          item?.category_attributes_types?.code !== 'checkbox' &&
          item?.category_attributes_types?.code !== 'number'
        "
      >
        <h6 class="text-xs font-medium mb-2">
          {{ currentLocale == 'ar' ? item?.name : item?.name_en }}
        </h6>
        <div class="flex flex-wrap gap-2 mb-4">
          <button
            v-for="val in item?.category_attributes_values"
            :key="val.id"
            @click="filtersStore.toggleAttributeValue(item.id, val.id)"
            :class="[
              'text-xs capitalize py-2 px-4 rounded-md cursor-pointer transition-colors',
              filtersStore.isAttributeActive(item.id, val.id)
                ? 'bg-[#146AAB] text-white'
                : 'bg-[#EDEFF2] text-black hover:bg-[#0f76c5] hover:text-white',
            ]"
          >
            {{ currentLocale === 'ar' ? val.name : val.name_en }}
          </button>
        </div>
      </div>
    </div>

    <!-- Apply / Clear -->
    <div class="flex gap-2 items-center mt-2">
      <button
        @click="filtersStore.clearFilters"
        class="flex-1 text-sm bg-[#EDEFF2] py-2 px-4 rounded-md hover:bg-[#c0c3c6]"
      >
        {{ currentLocale == 'ar' ? 'مسح التصفية' : 'Clear Filter' }}
      </button>
      <button
        @click="$emit('apply')"
        class="flex-1 text-sm bg-[#FFE800] py-2 px-4 rounded-md hover:bg-[#f5e427]"
      >
        {{ currentLocale == 'ar' ? 'تطبيق الفلتر' : 'Apply Filter' }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  currentLocale: Object,
  categoriesFilter: Array,
  selectedCategory: Object,
  filtersStore: Object,
});
</script>
