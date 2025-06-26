<script setup>
  defineProps(["title", "content", "buttonText", "buttonLink"]);
</script>

<template>
  <div class="flex flex-col items-center justify-start">
    <img src="/nodata.svg" alt="no data" class="max-w-[400px] h-auto mb-12" />
    <p v-if="title" class="text-center mb-6">{{ title }}</p>
    <p v-if="content" class="leading-8 max-w-[600px] text-center mb-12 px-4">
      {{ content }}
    </p>
    <RouterLink v-if="buttonLink" :to="buttonLink">
      <Button
        :label="buttonText"
        size="large"
        class="!px-16 !rounded-2xl !bg-[var(--primary-clr)] !border-[var(--primary-clr)]"
      />
    </RouterLink>
  </div>
</template>
