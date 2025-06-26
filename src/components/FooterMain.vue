<template>
  <footer class="bg-[var(--dark-bg)] text-white">
    <div class="custom-container py-6 flex justify-between flex-wrap">
      <!-- Contact and Social Media -->
      <div class="footer-section min-w-[200px]">
        <h3>{{ $t("footer.contact-through") }}</h3>
        <div
          v-for="(contact, i) in footerContactItems"
          :key="i"
          class="flex items-center mb-3"
        >
          <i :class="`pi ${contact.icon} me-2`"></i>
          <p class="text-xs" dir="ltr">{{ contact?.label }}</p>
        </div>
      </div>

      <!-- Important Links -->
      <div class="footer-section min-w-[200px]">
        <h3>{{ $t("footer.links") }}</h3>
        <ul class="text-xs">
          <li v-for="(link, i) in importantLinks" :key="i">
            <RouterLink class="underline" :to="link?.link">{{
              $t(link?.label)
            }}</RouterLink>
          </li>
        </ul>
      </div>

      <!-- Haraj Adan Description -->
      <div class="footer-section min-w-[340px] desc" style="flex-grow: 2">
        <h2 class="footer-logo">{{ $t("footer.service") }}</h2>
        <p class="text-xs" style="line-height: 1.4rem">
          {{ $t("footer.service-content") }}
        </p>
      </div>
    </div>
    <div
      class="custom-container pt-6 flex justify-between items-center flex-wrap border-t-1 border-gray-500"
    >
      <!-- Haraj Adan Logo -->
      <div class="min-w-[200px] flex items-start mb-4 me-4">
        <div class="flex items-center">
          <RouterLink class="block p-2 rounded-sm" to="/">
            <img
              src="/logo.png"
              alt="raheed logo"
              class="w-[80px] object-contain"
            />
          </RouterLink>
          <div class="ms-4">
            <h2>Haraj Adan</h2>
            <p class="text-xs">{{ $t("footer.short-desc") }}</p>
          </div>
        </div>
      </div>
      <div class="flex items-center mb-4">
        <a
          v-for="(item, i) in socials"
          :key="i"
          :href="item?.link"
          target="_blank"
        >
          <i
            :class="`pi ${item?.icon} !ms-0 !me-4`"
            style="font-size: 1.5rem"
          ></i>
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup>
  import {
    footerContactItems,
    footerImportantLinks,
    footerSocials,
  } from "../utils/constants";
  import { ref } from "vue";

  const contacts = ref(footerContactItems);
  const importantLinks = ref(footerImportantLinks);
  const socials = ref(footerSocials);
</script>

<style scoped>
  .footer-section {
    flex: 1;
    padding: 0 1rem 1rem;
    margin-block-start: 1rem;
  }

  .footer-section h2,
  .footer-section h3 {
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .right {
    text-align: right;
  }

  .left {
    text-align: left;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  ul li {
    margin: 0.5rem 0;
  }

  .social-icons i {
    margin: 0 0.5rem;
    font-size: 1.5rem;
    cursor: pointer;
  }

  .social-icons i:hover {
    color: #d1d1d1; /* Hover effect for icons */
  }

  @media screen and (max-width: 380px) {
    .desc {
      min-width: 200px !important;
    }
  }
</style>
