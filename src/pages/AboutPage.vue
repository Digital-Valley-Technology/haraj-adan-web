<script setup>
import AppLayout from "../Layout/AppLayout.vue";
import ContentBlocks from "../components/ContentBlocks.vue";
import { useI18n } from "vue-i18n";
import { computed } from "vue";
import { aboutContent } from "../data/legalContent";

const { locale } = useI18n();
const isArabic = computed(() => locale.value === "ar");
const pick = (o) => (isArabic.value ? o.ar : o.en);
</script>

<template>
  <app-layout>
    <div
      class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
      :dir="isArabic ? 'rtl' : 'ltr'"
    >
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div
          class="bg-blue-600 rounded-2xl p-8 mb-8 text-white text-center border-b-4 border-yellow-400"
        >
          <div
            class="inline-flex items-center justify-center bg-white rounded-2xl p-2 mb-4"
          >
            <img
              src="/logo.png"
              alt="Harajaden Logo"
              class="h-20 w-20 object-contain"
            />
          </div>
          <h1 class="text-3xl font-bold mb-2">
            {{ pick(aboutContent.hero.title) }}
          </h1>
          <p class="text-white/90 text-lg">
            {{ pick(aboutContent.hero.subtitle) }}
          </p>
        </div>

        <!-- Sections -->
        <div class="space-y-6">
          <section
            v-for="(section, i) in aboutContent.sections"
            :key="i"
            class="bg-white rounded-2xl shadow-sm p-6 sm:p-8"
          >
            <h2 class="text-xl font-semibold text-blue-600 mb-4">
              {{ pick(section.title) }}
            </h2>
            <ContentBlocks :blocks="section.blocks" />
          </section>
        </div>
      </div>
    </div>
  </app-layout>
</template>
