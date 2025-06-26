<script setup>
  defineProps(["image", "title"]);
</script>

<template>
  <div
    class="img-title-container relative custom-container h-[150px] md:h-[200px] lg:h-[300px] shadow-lg rounded-xl overflow-hidden bg-gray-200 mb-8 md:mb-16"
  >
    <img
      :class="`w-full h-full object-cover object-center`"
      :src="image"
      alt="Cart Image"
    />
    <h3
      class="text-3xl md:text-5xl text-white font-bold custom-container absolute bottom-[50%] left-[50%] z-10"
    >
      {{ $t(`${title}`) }}
    </h3>
  </div>
</template>

<style scoped>
  .img-title-container::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
    background-color: rgba(18, 31, 40, 0.75);
  }

  .img-title-container h3 {
    transform: translate(-50%, 50%);
  }
</style>
