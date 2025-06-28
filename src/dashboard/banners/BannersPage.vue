<script setup>
import DashboardLayout from "../../Layout/DashboardLayout.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
    <dashboard-layout>
        <main class="py-[var(--padding-dashboard-section)] custom-container">
            <div
                class="card min-h-[500px] w-full mx-auto px-4 md:px-8 py-8 md:py-12 shadow-lg border border-gray-200 rounded-lg">
                <!-- Page Title -->
                <h2 class="text-2xl font-semibold mb-6">
                    {{ t("dashboard.banners.title") }}
                </h2>
            </div>
        </main>
    </dashboard-layout>
</template>
