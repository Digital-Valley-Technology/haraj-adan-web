<script setup>
import { useRouter } from "vue-router";
import Button from "primevue/button";
import AppLayout from "../Layout/AppLayout.vue";

const router = useRouter();

const goHome = () => router.push("/");
</script>

<template>
  <app-layout>
    <main class="grid place-items-center min-h-[80vh] text-center">
      <div>
        <h2 class="text-3xl font-semibold text-red-600 mb-4">
          {{ $t("generic.403-title") || "Access Denied" }}
        </h2>
        <p class="mb-4 text-gray-600">
          {{
            $t("generic.403-message") ||
            "You do not have permission to access this page."
          }}
        </p>
        <Button @click="goHome"
          >{{ $t("generic.back-home") }}<i class="pi pi-home"></i
        ></Button>
      </div>
    </main>
  </app-layout>
</template>

<style scoped></style>
