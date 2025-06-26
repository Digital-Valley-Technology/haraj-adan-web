<script setup>
  import AppLayout from "../Layout/AppLayout.vue";
  import { RouterLink } from "vue-router";
</script>

<template>
  <app-layout>
    <main class="relative py-32 px-6">
      <div
        class="card px-6 py-8 mx-auto max-w-[600px] shadow-lg border border-gray-200 rounded-lg"
      >
        <!-- username -->
        <IconField class="mb-4">
          <InputIcon size="large" class="pi pi-user" />
          <InputText
            class="w-full !border-gray-300"
            size="large"
            :placeholder="$t('register.username')"
          />
        </IconField>
        <IconField class="mb-4">
          <InputIcon size="large" class="pi pi-lock" />
          <InputText
            class="w-full !border-gray-300"
            size="large"
            :placeholder="$t('register.password')"
          />
        </IconField>
        <Button
          class="!block w-full !rounded-md mb-4 !bg-[var(--primary-clr)] !border-[var(--primary-clr)]"
          type="submit"
          size="large"
          :label="$t('register.login')"
        />
        <p class="text-center text-sm">
          <span class="inline-block me-2">{{ $t("register.no-account") }}</span>
          <RouterLink to="/register" class="text-[#596e60]">{{
            $t("register.register-account")
          }}</RouterLink>
        </p>
      </div>
    </main>
  </app-layout>
</template>

<style scoped>
  .pattern {
    position: absolute;
    max-width: 200px;
  }

  .pattern-start {
    top: 0;
    left: 0;
    transform: rotateZ(180deg);
  }

  .pattern-end {
    bottom: 0;
    right: 0;
  }
</style>
