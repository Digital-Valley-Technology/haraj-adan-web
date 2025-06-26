<script setup>
  import { RouterLink } from "vue-router";
  import AppLayout from "../Layout/AppLayout.vue";
</script>

<template>
  <app-layout>
    <main class="relative py-32 px-6">
      <div
        class="card px-6 py-8 mx-auto max-w-[600px] shadow-lg border border-gray-200 rounded-lg"
      >
        <!-- name -->
        <IconField class="mb-4">
          <InputIcon size="large" class="pi pi-user" />
          <InputText
            class="w-full !border-gray-300"
            size="large"
            :placeholder="$t('register.name')"
          />
        </IconField>
        <!-- email & phone -->
        <div
          class="flex justify-between items-center mb-4 flex-wrap md:flex-nowrap"
        >
          <!-- email -->
          <IconField class="mb-4 md:mb-0 md:me-2" style="flex-grow: 1">
            <InputIcon size="large" class="pi pi-envelope" />
            <InputText
              class="w-full !border-gray-300"
              size="large"
              :placeholder="$t('register.email')"
            />
          </IconField>
          <!-- phone -->
          <IconField class="md:ms-2" style="flex-grow: 1">
            <InputIcon size="large" class="pi pi-phone" />
            <InputText
              class="w-full !border-gray-300"
              size="large"
              :placeholder="$t('register.phone')"
            />
          </IconField>
        </div>
        <!-- password -->
        <div
          class="flex justify-between items-center flex-wrap md:flex-nowrap mb-4"
        >
          <IconField class="mb-4 md:mb-0 md:me-2" style="flex-grow: 1">
            <InputIcon size="large" class="pi pi-lock" />
            <InputText
              class="w-full !border-gray-300"
              size="large"
              :placeholder="$t('register.password')"
            />
          </IconField>
          <IconField class="md:ms-2" style="flex-grow: 1">
            <InputIcon size="large" class="pi pi-lock" />
            <InputText
              class="w-full !border-gray-300"
              size="large"
              :placeholder="$t('register.repeat-password')"
            />
          </IconField>
        </div>
        <Button
          class="!block w-full !rounded-md mb-4 !bg-[var(--primary-clr)] !border-[var(--primary-clr)]"
          type="submit"
          size="large"
          :label="$t('register.register')"
        />
        <p class="text-center text-sm">
          <span class="inline-block me-2">{{
            $t("register.has-account")
          }}</span>
          <RouterLink to="/login" class="text-[#596e60]">{{
            $t("register.login")
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
