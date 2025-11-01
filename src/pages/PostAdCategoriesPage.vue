<template>
  <app-layout>
    <div class="custom-container page-wrapper mx-auto min-h-[500px] mb-4">
      <div class="bg-white p-4 rounded-lg shadow-lg category-card">
        <div v-for="cat in categories" :key="cat.id" class="mb-2">
          <!-- Parent Category -->
          <div
            @click="toggleCategory(cat.id)"
            class="flex justify-between items-center w-full cursor-pointer hover:bg-[#F5F6F7] p-2 rounded-md"
          >
            <div class="flex items-center gap-4">
              <span
                class="bg-[#F5F6F7] flex items-center justify-center w-6 h-6 p-4 rounded-full"
              >
                <i class="pi pi-folder text-black"></i>
              </span>
              <h4 class="uppercase text-sm">
                {{ currentLocale === "ar" ? cat.name : cat.name_en }}
              </h4>
            </div>

            <!-- Arrow direction based on locale -->
            <i
              :class="[
                'pi',
                expandedCategories.includes(cat.id)
                  ? 'pi-angle-down'
                  : currentLocale === 'ar'
                  ? 'pi-angle-left'
                  : 'pi-angle-right',
              ]"
            ></i>
          </div>

          <!-- Show children when expanded -->
          <transition name="fade">
            <div v-if="expandedCategories.includes(cat.id)" class="ml-10 mt-2">
              <div
                v-for="child in cat.children"
                :key="child.id"
                @click.stop="goToPostAdd(child.id)"
                class="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-[#EDEFF2]"
              >
                <p class="text-xs">
                  {{ currentLocale === "ar" ? child.name : child.name_en }}
                </p>

                <!-- Child arrow based on locale -->
                <i
                  :class="[
                    'pi',
                    currentLocale === 'ar'
                      ? 'pi-chevron-left'
                      : 'pi-chevron-right',
                    'text-gray-400',
                  ]"
                ></i>
              </div>
            </div>
          </transition>

          <hr class="my-4 text-gray-200" />
        </div>
      </div>
    </div>
  </app-layout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import requestService from "../services/api/requestService";
import AppLayout from "../Layout/AppLayout.vue";

const { locale } = useI18n();
const router = useRouter();

const categories = ref([]);
const expandedCategories = ref([]);

// Compute current locale
const currentLocale = computed(() => locale.value);

// Fetch parent categories with their children
const fetchCategories = async () => {
  try {
    const response = await requestService.getAll("/categories/parents", {
      params: { includes: ["children"] },
    });
    categories.value = response.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};
onMounted(fetchCategories);

// Expand/collapse parent
const toggleCategory = (id) => {
  if (expandedCategories.value.includes(id)) {
    expandedCategories.value = expandedCategories.value.filter(
      (cid) => cid !== id
    );
  } else {
    expandedCategories.value.push(id);
  }
};

// Navigate to Post Add page with selected child category ID
const goToPostAdd = (categoryId) => {
  router.push({ name: "post-ad", params: { categoryId } });
};
</script>

<style scoped>
.category-card :last-child hr {
  display: none;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
