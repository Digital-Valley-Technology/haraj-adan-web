<template>
  <div class="category-side">
    <!-- Category Item (collapsible all screens) -->
    <div class="category-card">
      <button
        @click="toggleCategory(category.id)"
        class="flex justify-between items-center w-full cursor-pointer hover:bg-[#F5F6F7] p-2 rounded-md"
      >
        <!-- Left: Icon + Name -->
        <div class="flex items-center gap-4">
          <span
            class="bg-[#F5F6F7] flex items-center justify-center w-8 h-8 rounded-full"
          >
            <img
              :src="`${MEDIA_URL}${category?.image}`"
              class="w-6 h-6 object-contain"
              loading="lazy"
              alt="category image"
            />
          </span>

          <h4 class="uppercase text-sm font-medium">
            {{ i18.locale.value === "ar" ? category?.name : category?.name_en }}
            <span class="text-gray-400">({{ category?.adsCount || 0 }})</span>
          </h4>
        </div>

        <!-- Right: Arrow Icons -->
        <i
          :class="[
            'pi text-lg transition-transform duration-200',
            activeTab === category.id
              ? 'pi-angle-down'
              : i18.locale.value === 'ar'
              ? 'pi-angle-left'
              : 'pi-angle-right',
          ]"
        ></i>
      </button>

      <!-- Collapsible Content -->
      <transition name="slide-fade">
        <ul
          v-if="activeTab === category.id"
          class="mt-2 ml-12 flex flex-col gap-2"
        >
          <li
            v-for="item in category?.children"
            :key="item?.id"
            @click="goToCategoryListingPage"
          >
            <router-link
              :to="{
                name: 'category-listing',
                params: { id: item?.id },
              }"
              class="text-[#146AAB] text-xs font-normal hover:underline"
              active-class="underline font-bold text-lg"
            >
              {{ i18.locale.value === "ar" ? item?.name : item?.name_en }}
              <span class="text-gray-400">({{ item?.adsCount || 0 }})</span>
            </router-link>
          </li>
        </ul>
      </transition>
    </div>

    <hr class="my-4 border-gray-300" />
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { ref } from "vue";
import { MEDIA_URL } from "../services/axios";

defineProps(["category"]);

const activeTab = ref(null);
const i18 = useI18n();

function toggleCategory(id) {
  activeTab.value = activeTab.value === id ? null : id;
}
</script>

<style scoped>
/* Accordion Animation */
.slide-fade-enter-active {
  transition: all 0.25s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-5px);
}

.slide-fade-enter-to,
.slide-fade-leave-from {
  opacity: 1;
  max-height: 500px;
  transform: translateY(0);
}

.category-side:last-child hr {
  display: none;
}
</style>
