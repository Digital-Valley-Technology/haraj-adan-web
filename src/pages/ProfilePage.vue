<script setup>
  import { ref } from "vue";
  import { useI18n } from "vue-i18n";
  import { useGeneralStore } from "../store/general";
  import AppLayout from "../Layout/AppLayout.vue";

  const t = useI18n();

  const generalStore = useGeneralStore();

  const languages = ref([
    { name: "اللغة العربية", code: "ar" },
    { name: "English", code: "en" },
  ]);

  const selectedLang = ref(
    languages?.value?.filter((x) => x.code == generalStore?.lang)?.[0]
  );

  const toggleLang = () => {
    generalStore?.toggleLang(t, selectedLang?.value?.code);
  };
</script>

<template>
  <app-layout>
    <main
      class="page-wapper px-4 md:px-8 mx-4 pb-[var(--padding-dashboard-section)]"
    >
      <div class="card w-full max-w-[700px] mx-auto px-4 md:px-8 py-6">
        <div class="w-fit mx-auto">
          <Avatar
            image="/images/user/1.jpg"
            size="xlarge"
            class="!w-[150px] !h-[150px] mb-2 shadow-lg"
            shape="circle"
          />
          <p class="text-center text-gray-400 text-sm">example@gmail.com</p>
        </div>
      </div>
      <div
        class="card w-full max-w-[700px] mx-auto px-4 md:px-8 py-8 md:py-12 shadow-lg border border-gray-200 rounded-lg"
      >
        <!-- name & email -->
        <div
          class="flex justify-between items-stretch flex-col md:flex-row md:items-center"
        >
          <FloatLabel class="flex-grow md:me-4 !mb-8">
            <InputText
              id="name"
              name="name"
              type="text"
              fluid
              size="large"
              class="!bg-slate-50 !rounded-lg !pb-4 w-full"
            />
            <label for="name">{{ $t("register.name") }}</label>
          </FloatLabel>

          <FloatLabel class="flex-grow md:ms-4 !mb-8">
            <InputText
              id="email"
              name="phone"
              type="text"
              fluid
              size="large"
              class="!bg-slate-50 !rounded-lg !pb-4 w-full"
            />
            <label for="email">{{ $t("register.email") }}</label>
          </FloatLabel>
        </div>

        <!-- phone & language -->
        <div
          class="flex justify-between items-stretch flex-col md:flex-row md:items-center"
        >
          <FloatLabel class="flex-grow w-full md:me-4 !mb-8">
            <InputText
              id="phone"
              name="phone"
              type="text"
              fluid
              size="large"
              class="!bg-slate-50 !rounded-lg !pb-4 w-full"
            />
            <label for="phone">{{ $t("register.phone") }}</label>
          </FloatLabel>

          <FloatLabel class="flex-grow w-full md:ms-4 !mb-8">
            <Select
              id="platform-language"
              v-model="selectedLang"
              :options="languages"
              class="!bg-slate-50 !rounded-lg !pb-2 w-full"
              fluid
              size="large"
              @change="toggleLang"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value" class="flex items-center">
                  <div>{{ slotProps.value.name }}</div>
                </div>
                <div v-else>
                  {{ slotProps.placeholder }}
                  <span class="text-slate-50">-</span>
                </div>
              </template>
              <template #option="slotProps">
                <div>{{ slotProps.option.name }}</div>
              </template>
              <template #dropdownicon>
                <i class="pi pi-language" />
              </template>
            </Select>

            <label for="platform-language">{{
              $t("register.platform-language")
            }}</label>
          </FloatLabel>
        </div>

        <!-- change password -->
        <Button
          class="!block w-full !rounded-xl mb-8"
          type="submit"
          severity="contrast"
          variant="outlined"
          size="large"
          :label="$t('register.change-password')"
        />

        <Button
          class="!block w-full !rounded-xl secondary-btn"
          type="submit"
          size="large"
          :label="$t('register.save')"
        />
      </div>
    </main>
  </app-layout>
</template>

<style scoped>
  main {
    min-height: calc(100vh - var(--padding-dashboard-layout-top));
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
</style>
