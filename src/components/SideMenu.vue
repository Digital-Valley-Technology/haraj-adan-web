<template>
  <div
    class="w-72 bg-white shadow-md rounded-xl p-4 flex flex-col justify-between min-h-screen"
  >
    <div>
      <!-- Ad Banner -->
      <div class="bg-blue-500 text-white rounded-xl p-4 mb-4">
        <h3 class="text-sm font-semibold">MAKE YOUR AD STAND OUT</h3>
        <p class="text-xs mt-1">
          HERE IS AN EXPLANATORY TEXT ON HOW TO MAKE THE...
        </p>
        <button
          class="mt-3 bg-yellow-400 text-black px-4 py-1 rounded-md text-sm font-semibold"
        >
          Deposit
        </button>
      </div>

      <!-- Menu Sections -->
      <div v-for="(section, i) in menuSections" :key="i" class="mb-3">
        <p class="text-xs font-bold text-gray-500 uppercase mb-1">
          {{ section.title }}
        </p>
        <div
          v-for="(item, idx) in section.items"
          :key="idx"
          class="py-2 px-3 hover:bg-gray-100 rounded-md cursor-pointer text-sm"
        >
          {{ item }}
        </div>
      </div>
    </div>

    <!-- Log out -->
    <div
      class="flex items-center gap-2 text-red-500 font-semibold cursor-pointer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 002 2h3a2 2 0 002-2v-1m-2-4V7a2 2 0 00-2-2h-3a2 2 0 00-2 2v1"
        />
      </svg>
      Log Out
    </div>
  </div>
</template>

<script setup>
const menuSections = [
  {
    title: "MY ACCOUNT INFORMATION",
    items: ["Wallet", "Deposit"],
  },
  {
    title: "MESSAGES AND INFORMATIONS",
    items: ["Messages", "Permissions"],
  },
  {
    title: "ADVERTISEMENT MANAGEMENT",
    items: ["On Air", "Not Published", "Rejected", "Featured"],
  },
  {
    title: "FAVORITES",
    items: ["Favorite Ads"],
  },
  {
    title: "GENERAL",
    items: ["Privacy and Policy", "Other Pages"],
  },
];
</script>
