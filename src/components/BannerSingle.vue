<template>
  <div class="custom-container grid grid-cols-1 md:grid-cols-2 gap-4">
    <img
      :src="image"
      alt="Special Offer 1"
      class="w-full aspect-[16/5] object-cover rounded-lg shadow-lg bg-gray-200"
    />
  </div>
</template>

<script setup>
  defineProps(["image"]);
</script>
