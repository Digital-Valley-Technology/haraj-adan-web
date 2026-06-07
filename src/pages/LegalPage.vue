<script setup>
import AppLayout from "../Layout/AppLayout.vue";
import ContentBlocks from "../components/ContentBlocks.vue";
import { useI18n } from "vue-i18n";
import { computed, ref } from "vue";
import {
  privacyContent,
  termsContent,
  legalMeta,
} from "../data/legalContent";

const props = defineProps({
  // 'privacy' | 'terms' — which tab to open first (set per route)
  initialTab: { type: String, default: "privacy" },
});

const { locale } = useI18n();
const isArabic = computed(() => locale.value === "ar");
const pick = (o) => (isArabic.value ? o.ar : o.en);

const activeTab = ref(props.initialTab === "terms" ? "terms" : "privacy");
const doc = computed(() =>
  activeTab.value === "terms" ? termsContent : privacyContent
);

const tabs = [
  { key: "privacy", label: privacyContent.title },
  { key: "terms", label: termsContent.title },
];
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
          class="bg-blue-600 rounded-2xl p-8 text-white border-b-4 border-yellow-400"
        >
          <div class="flex items-center gap-4">
            <div class="bg-white/20 rounded-xl p-4 shrink-0">
              <i class="pi pi-shield text-3xl"></i>
            </div>
            <div>
              <h1 class="text-2xl sm:text-3xl font-bold">
                {{ isArabic ? "الشروط وسياسة الخصوصية" : "Terms & Privacy" }}
              </h1>
              <p class="text-white/90 mt-1 text-sm">
                {{ pick(legalMeta.applies) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div
          class="mt-6 inline-flex rounded-xl bg-white p-1 shadow-sm w-full sm:w-auto"
        >
          <button
            v-for="tab in tabs"
            :key="tab.key"
            type="button"
            class="flex-1 sm:flex-none px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
            :class="
              activeTab === tab.key
                ? 'bg-blue-600 text-white shadow'
                : 'text-gray-600 hover:text-blue-600'
            "
            @click="activeTab = tab.key"
          >
            {{ pick(tab.label) }}
          </button>
        </div>

        <!-- Meta -->
        <div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <span class="font-medium text-gray-700">{{ pick(doc.title) }}</span>
          <span class="text-gray-400">·</span>
          <span class="text-gray-500">{{ pick(legalMeta.updated) }}</span>
        </div>

        <!-- Binding-version notice (shown in English mode) -->
        <p
          v-if="!isArabic"
          class="mt-3 rounded-lg bg-gray-100 px-4 py-2 text-xs text-gray-500"
        >
          {{ legalMeta.bindingNotice.en }}
        </p>

        <!-- Sections -->
        <div class="mt-6 space-y-5">
          <section
            v-for="section in doc.sections"
            :key="section.n"
            class="bg-white rounded-2xl shadow-sm p-6 sm:p-8"
          >
            <h2 class="flex items-baseline gap-2 text-lg font-semibold text-blue-600 mb-4">
              <span
                class="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-sm shrink-0"
              >
                {{ section.n }}
              </span>
              <span>{{ pick(section.title) }}</span>
            </h2>
            <ContentBlocks :blocks="section.blocks" />
          </section>
        </div>
      </div>
    </div>
  </app-layout>
</template>
