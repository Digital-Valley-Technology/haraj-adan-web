<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

defineProps({
  blocks: { type: Array, required: true },
});

const { locale } = useI18n();
const isAr = computed(() => locale.value === "ar");
const pick = (o) => (isAr.value ? o.ar : o.en);
</script>

<template>
  <div>
    <template v-for="(block, i) in blocks" :key="i">
      <!-- paragraph -->
      <p
        v-if="block.type === 'p'"
        class="text-gray-700 leading-relaxed mb-4 last:mb-0"
      >
        {{ pick(block) }}
      </p>

      <!-- sub-heading -->
      <h3
        v-else-if="block.type === 'sub'"
        class="font-semibold text-gray-900 mt-5 mb-2"
      >
        {{ pick(block) }}
      </h3>

      <!-- bullet list -->
      <ul v-else-if="block.type === 'list'" class="space-y-2 mb-4">
        <li
          v-for="(item, j) in block.items"
          :key="j"
          class="flex items-start gap-3 text-gray-700 leading-relaxed"
        >
          <span
            class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500"
          ></span>
          <span>{{ pick(item) }}</span>
        </li>
      </ul>

      <!-- callout note -->
      <div
        v-else-if="block.type === 'note'"
        class="flex items-start gap-3 rounded-xl border p-4 my-4"
        :class="
          block.variant === 'warn'
            ? 'bg-amber-50 border-amber-200 text-amber-900'
            : 'bg-blue-50 border-blue-200 text-blue-900'
        "
      >
        <i
          class="pi mt-0.5 text-lg"
          :class="
            block.variant === 'warn'
              ? 'pi-exclamation-triangle'
              : 'pi-info-circle'
          "
        ></i>
        <p class="text-sm leading-relaxed">{{ pick(block) }}</p>
      </div>

      <!-- title + description cards -->
      <div
        v-else-if="block.type === 'cards'"
        class="grid sm:grid-cols-2 gap-4 my-2"
      >
        <div
          v-for="(card, j) in block.items"
          :key="j"
          class="rounded-xl border border-gray-200 p-4 hover:border-blue-300 transition-colors"
        >
          <h4 class="font-semibold text-blue-600 mb-1">
            {{ pick(card.title) }}
          </h4>
          <p class="text-sm text-gray-600 leading-relaxed">
            {{ pick(card.desc) }}
          </p>
        </div>
      </div>
    </template>
  </div>
</template>
