<template>
  <div>
    <div class="flex items-start gap-3">
      <div
        class="flex items-center justify-center bg-gray-200 w-8 h-8 rounded-full"
      >
        <i class="icon pi pi-home"></i>
      </div>
      <!-- links -->
      <div class="flex flex-col gap-2 items-start">
        <p class="mt-1 text-sm font-medium">
          {{ i18?.locale?.value == "ar" ? category?.name : category?.name_en }}
        </p>
        <ul>
          <li v-for="item in category?.subCategories" :key="item?.id">
            <a href="#" class="text-[#146AAB] text-xs font-normal">{{
              i18?.locale?.value == "ar" ? item?.name : item?.name_en
            }}</a>
          </li>
        </ul>
      </div>
    </div>

    <hr class="my-4 border-gray-300" />
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
defineProps(["category"]);

const i18 = useI18n();
</script>
