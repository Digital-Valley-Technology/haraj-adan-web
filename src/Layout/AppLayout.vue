<script setup>
import HeaderMain from "../components/HeaderMain.vue";
import FooterMain from "../components/FooterMain.vue";
</script>
<template>
  <div>
    <header-main></header-main>
    <div class="pt-[6rem]">
      <slot></slot>
    </div>
    <footer-main></footer-main>
  </div>
</template>
