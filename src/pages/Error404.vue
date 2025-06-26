<script setup>
  import { useRouter } from "vue-router";
  import Button from "primevue/button";
  import AppLayout from "../Layout/AppLayout.vue";

  const router = useRouter();

  const goHome = () => {
    router.push("/");
  };
</script>

<template>
  <app-layout>
    <main class="grid place-items-center min-h-[80vh]">
      <div>
        <h3 class="mb-2">{{ $t("generic.404-message") }}</h3>
        <Button @click="goHome"
          >{{ $t("generic.back-home") }}<i class="pi pi-home"></i
        ></Button>
      </div>
    </main>
  </app-layout>
</template>

<style scoped></style>
