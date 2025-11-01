<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
const { locale } = useI18n();
// Define the expected props
const props = defineProps({
  // The single ad item object, structured based on your mock data
  item: {
    type: Object,
    required: true,
    validator: (value) => {
      return (
        value.title_en &&
        value.title &&
        value.price !== undefined &&
        value.status &&
        value.status_ar &&
        value.ads_images?.[0]?.image &&
        value.ad_attributes?.[0]?.address &&
        value.ad_attributes?.[0]?.address_ar
      );
    },
  },
});
</script>

<template>
  <div class="flex flex-col gap-2 bg-white p-4 rounded-lg">
    <div class="flex justify-between items-center">
      <div class="flex gap-2 items-center">
        <div class="max-w-[80px] h-18">
          <img
            src="/images/room1.jpg"
            alt="room1"
            class="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div>
          <h3 class="text-xs font-semibold mb-1">
            {{
              locale == "ar"
                ? "لوحة إعلانات جاجاه مادا"
                : "Gajah Mada Billboard"
            }}
          </h3>
          <div class="flex items-center gap-2">
            <i class="pi pi-map-marker text-[9px] text-[#6B7280]"></i>
            <p class="text-[9px] text-[#6B7280]">
              {{
                locale == "ar"
                  ? "سوراكارتا، جاوة تينغاه"
                  : "Surakarta, Jawa Tengah"
              }}
            </p>
          </div>
        </div>
      </div>
      <div class="flex items-end gap-1">
        <p class="text-sm text-[#146AAB]">
          {{ locale == "ar" ? "10.000$" : "$ 10.000" }}
        </p>
      </div>
    </div>
  </div>
</template>
