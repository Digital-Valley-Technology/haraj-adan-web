<template>
  <footer
    class="bg-white text-gray-700 border-t border-gray-200 pt-10 pb-6 px-6 md:px-12"
  >
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">
      <!-- Brand + Social -->
      <div class="space-y-4">
        <!-- Logo + name -->
        <div class="flex items-center space-x-2">
          <div
            class="flex flex-col justify-center items-center space-y-1 text-yellow-400"
          >
            <RouterLink class="block p-2 rounded-sm" to="/">
              <img
                src="/logo.png"
                alt="raheed logo"
                class="w-[80px] object-contain"
              />
            </RouterLink>
          </div>
          <span class="font-semibold text-lg text-black">{{
            $t("footer.brand")
          }}</span>
        </div>

        <!-- Social Icons -->
        <div class="flex space-x-4 text-blue-700 text-xl">
          <i class="pi pi-twitter"></i>
          <i class="pi pi-facebook"></i>
          <i class="pi pi-instagram"></i>
          <i class="pi pi-linkedin"></i>
          <i class="pi pi-youtube"></i>
        </div>
      </div>

      <!-- Product Links -->
      <div>
        <h4 class="text-black font-semibold mb-3">
          {{ $t("footer.product.title") }}
        </h4>
        <ul class="space-y-2 text-sm text-gray-500">
          <li>
            <a href="#">{{ $t("footer.product.features") }}</a>
          </li>
          <li>
            <a href="#">{{ $t("footer.product.pricing") }}</a>
          </li>
          <li>
            <a href="#">{{ $t("footer.product.caseStudies") }}</a>
          </li>
        </ul>
      </div>

      <!-- Company Links -->
      <div>
        <h4 class="text-black font-semibold mb-3">
          {{ $t("footer.company.title") }}
        </h4>
        <ul class="space-y-2 text-sm text-gray-500">
          <li>
            <a href="#">{{ $t("footer.company.about") }}</a>
          </li>
          <li>
            <a href="#">{{ $t("footer.company.contact") }}</a>
          </li>
          <li>
            <a href="#">{{ $t("footer.company.careers") }}</a>
          </li>
        </ul>
      </div>

      <!-- Support Links -->
      <div>
        <h4 class="text-black font-semibold mb-3">
          {{ $t("footer.support.title") }}
        </h4>
        <ul class="space-y-2 text-sm text-gray-500">
          <li>
            <a href="#">{{ $t("footer.support.gettingStarted") }}</a>
          </li>
          <li>
            <a href="#">{{ $t("footer.support.helpCenter") }}</a>
          </li>
          <li>
            <a href="#">{{ $t("footer.support.serverStatus") }}</a>
          </li>
        </ul>
      </div>

      <!-- Contacts -->
      <div>
        <h4 class="text-black font-semibold mb-3">
          {{ $t("footer.contacts.title") }}
        </h4>
        <ul class="space-y-3 text-sm text-gray-500">
          <li class="flex items-center space-x-2">
            <i class="pi pi-envelope text-blue-600"></i>
            <span>{{ COMPANY_EAMIL }}</span>
          </li>
          <li class="flex items-center space-x-2">
            <i class="pi pi-phone text-blue-600"></i>
            <span>{{ $t("footer.contacts.phone") }}</span>
          </li>
          <li class="flex items-center space-x-2">
            <i class="pi pi-map-marker text-blue-600"></i>
            <span>{{ $t("footer.contacts.address") }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div
      class="border-t border-gray-200 mt-10 pt-4 text-sm flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-4"
    >
      <p class="text-gray-500">&copy; 2025 {{ $t("footer.copy") }}</p>
      <div class="mt-2 md:mt-0 space-x-2 text-blue-600">
        <a href="#" class="hover:underline">{{ $t("footer.terms") }}</a>
        <span class="text-gray-300">|</span>
        <a href="#" class="hover:underline">{{ $t("footer.privacy") }}</a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { COMPANY_EAMIL } from "../utils/constants";
</script>
