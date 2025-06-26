<script setup>
  import AppLayout from "../Layout/AppLayout.vue";
  import AppHero from "../components/AppHero.vue";
  import { ref } from "vue";

  const categoryImage = ref("/images/checkout.jpg");
</script>

<template>
  <app-layout>
    <div class="page-wapper">
      <app-hero :image="categoryImage" title="generic.checkout"></app-hero>
      <div class="min-h-[50vh] grid place-items-center">
        <h3>{{ $t("generic.checkout") }}</h3>
      </div>
    </div>
  </app-layout>
</template>
