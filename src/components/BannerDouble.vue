<template>
  <div class="custom-container grid grid-cols-1 md:grid-cols-2 gap-4">
    <img
      :src="imageOne"
      alt="Banner Image 1"
      class="w-full aspect-[16/5] object-cover rounded-lg shadow-lg bg-gray-200"
    />
    <img
      :src="imageTwo"
      alt="Banner Image 2"
      class="w-full aspect-[16/5] object-cover rounded-lg shadow-lg bg-gray-200"
    />
  </div>
</template>

<script setup>
  defineProps(["imageOne", "imageTwo"]);
</script>
