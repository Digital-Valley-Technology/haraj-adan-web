<script setup>
import AppLayout from "../Layout/AppLayout.vue";
import { useI18n } from "vue-i18n";
import { computed } from "vue";

const { locale } = useI18n();
const isArabic = computed(() => locale.value === "ar");
</script>

<template>
  <app-layout>
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div
          class="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl p-8 mb-8 text-white text-center"
        >
          <div
            class="inline-flex items-center justify-center bg-white/20 rounded-full p-4 mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h1 class="text-3xl font-bold mb-2">
            {{ isArabic ? "حراج عدن" : "Haraj Aden" }}
          </h1>
          <p class="text-white/90 text-lg">
            {{
              isArabic
                ? "منصتك الموثوقة للبيع والشراء"
                : "Your trusted platform for buying and selling"
            }}
          </p>
        </div>

        <!-- Content -->
        <div class="space-y-8">
          <!-- Who We Are -->
          <div class="bg-white rounded-2xl shadow-sm p-8">
            <h2 class="text-xl font-semibold text-blue-600 mb-4">
              {{ isArabic ? "من نحن" : "Who We Are" }}
            </h2>
            <p class="text-gray-700 leading-relaxed">
              {{
                isArabic
                  ? "حراج عدن هو المنصة الرائدة للإعلانات المبوبة في اليمن. نحن نوفر مساحة آمنة وسهلة الاستخدام للمستخدمين لبيع وشراء المنتجات والخدمات المختلفة. تأسست منصتنا بهدف تسهيل التجارة الإلكترونية وربط البائعين بالمشترين في جميع أنحاء اليمن."
                  : "Haraj Aden is the leading classified ads platform in Yemen. We provide a safe and easy-to-use space for users to buy and sell various products and services. Our platform was founded with the goal of facilitating e-commerce and connecting sellers with buyers across Yemen."
              }}
            </p>
          </div>

          <!-- Vision & Mission -->
          <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-white rounded-2xl shadow-sm p-8">
              <div
                class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h2 class="text-xl font-semibold text-blue-600 mb-4">
                {{ isArabic ? "رؤيتنا" : "Our Vision" }}
              </h2>
              <p class="text-gray-700 leading-relaxed">
                {{
                  isArabic
                    ? "نسعى لأن نكون المنصة الأولى والأكثر موثوقية للتجارة الإلكترونية في اليمن والمنطقة، من خلال توفير تجربة مستخدم استثنائية وخدمات مبتكرة تلبي احتياجات مجتمعنا."
                    : "We strive to be the leading and most trusted e-commerce platform in Yemen and the region, by providing an exceptional user experience and innovative services that meet the needs of our community."
                }}
              </p>
            </div>

            <div class="bg-white rounded-2xl shadow-sm p-8">
              <div
                class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h2 class="text-xl font-semibold text-blue-600 mb-4">
                {{ isArabic ? "رسالتنا" : "Our Mission" }}
              </h2>
              <p class="text-gray-700 leading-relaxed">
                {{
                  isArabic
                    ? "تمكين الأفراد والشركات من التواصل والتجارة بسهولة وأمان، مع توفير منصة موثوقة تدعم النمو الاقتصادي المحلي وتعزز التجارة الرقمية في اليمن."
                    : "Empowering individuals and businesses to connect and trade easily and safely, while providing a trusted platform that supports local economic growth and promotes digital commerce in Yemen."
                }}
              </p>
            </div>
          </div>

          <!-- Our Values -->
          <div class="bg-white rounded-2xl shadow-sm p-8">
            <h2 class="text-xl font-semibold text-blue-600 mb-6">
              {{ isArabic ? "قيمنا" : "Our Values" }}
            </h2>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="flex items-start gap-4">
                <div
                  class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">
                    {{ isArabic ? "الثقة والأمان" : "Trust & Safety" }}
                  </h3>
                  <p class="text-gray-600 text-sm">
                    {{
                      isArabic
                        ? "نضع أمان مستخدمينا في المقام الأول"
                        : "We put our users' safety first"
                    }}
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <div
                  class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">
                    {{ isArabic ? "النزاهة" : "Integrity" }}
                  </h3>
                  <p class="text-gray-600 text-sm">
                    {{
                      isArabic
                        ? "نلتزم بأعلى معايير الشفافية والصدق"
                        : "We adhere to the highest standards of transparency and honesty"
                    }}
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <div
                  class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-yellow-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">
                    {{ isArabic ? "الابتكار" : "Innovation" }}
                  </h3>
                  <p class="text-gray-600 text-sm">
                    {{
                      isArabic
                        ? "نسعى دائماً لتحسين خدماتنا وتقديم حلول مبتكرة"
                        : "We constantly strive to improve our services and provide innovative solutions"
                    }}
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <div
                  class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">
                    {{ isArabic ? "المجتمع" : "Community" }}
                  </h3>
                  <p class="text-gray-600 text-sm">
                    {{
                      isArabic
                        ? "نؤمن بقوة المجتمع ونعمل على دعمه"
                        : "We believe in the power of community and work to support it"
                    }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Our Services -->
          <div class="bg-white rounded-2xl shadow-sm p-8">
            <h2 class="text-xl font-semibold text-blue-600 mb-6">
              {{ isArabic ? "خدماتنا" : "Our Services" }}
            </h2>
            <div class="grid md:grid-cols-2 gap-4">
              <div class="border border-gray-200 rounded-xl p-4 flex items-center gap-4">
                <div
                  class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">
                    {{ isArabic ? "البيع والشراء" : "Buy & Sell" }}
                  </h3>
                  <p class="text-gray-600 text-sm">
                    {{
                      isArabic
                        ? "منصة سهلة لنشر وتصفح الإعلانات"
                        : "Easy platform to post and browse ads"
                    }}
                  </p>
                </div>
              </div>

              <div class="border border-gray-200 rounded-xl p-4 flex items-center gap-4">
                <div
                  class="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center flex-shrink-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-yellow-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">
                    {{ isArabic ? "الإعلانات المميزة" : "Featured Ads" }}
                  </h3>
                  <p class="text-gray-600 text-sm">
                    {{
                      isArabic
                        ? "ميّز إعلانك لوصول أكبر"
                        : "Feature your ad for greater reach"
                    }}
                  </p>
                </div>
              </div>

              <div class="border border-gray-200 rounded-xl p-4 flex items-center gap-4">
                <div
                  class="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">
                    {{ isArabic ? "المراسلة الفورية" : "Instant Messaging" }}
                  </h3>
                  <p class="text-gray-600 text-sm">
                    {{
                      isArabic
                        ? "تواصل مباشر بين البائع والمشتري"
                        : "Direct communication between buyer and seller"
                    }}
                  </p>
                </div>
              </div>

              <div class="border border-gray-200 rounded-xl p-4 flex items-center gap-4">
                <div
                  class="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">
                    {{ isArabic ? "البحث الجغرافي" : "Location Search" }}
                  </h3>
                  <p class="text-gray-600 text-sm">
                    {{
                      isArabic
                        ? "اعثر على إعلانات قريبة منك"
                        : "Find ads near you"
                    }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Statistics -->
          <div class="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl p-8 text-white">
            <h2 class="text-xl font-semibold text-center mb-8">
              {{ isArabic ? "إحصائياتنا" : "Our Statistics" }}
            </h2>
            <div class="grid grid-cols-3 gap-4 text-center">
              <div>
                <div class="text-4xl font-bold mb-2">10K+</div>
                <div class="text-white/80">{{ isArabic ? "مستخدم" : "Users" }}</div>
              </div>
              <div>
                <div class="text-4xl font-bold mb-2">50K+</div>
                <div class="text-white/80">{{ isArabic ? "إعلان" : "Ads" }}</div>
              </div>
              <div>
                <div class="text-4xl font-bold mb-2">20+</div>
                <div class="text-white/80">
                  {{ isArabic ? "فئة" : "Categories" }}
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Us -->
          <div class="bg-white rounded-2xl shadow-sm p-8">
            <h2 class="text-xl font-semibold text-blue-600 mb-4">
              {{ isArabic ? "تواصل معنا" : "Contact Us" }}
            </h2>
            <p class="text-gray-700 mb-6">
              {{
                isArabic
                  ? "نحن هنا لمساعدتك! لا تتردد في التواصل معنا لأي استفسارات أو اقتراحات."
                  : "We're here to help! Don't hesitate to contact us for any inquiries or suggestions."
              }}
            </p>
            <div class="bg-gray-50 rounded-xl p-6 space-y-4">
              <div class="flex items-center gap-4">
                <div
                  class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <div class="text-gray-500 text-sm">
                    {{ isArabic ? "البريد الإلكتروني" : "Email" }}
                  </div>
                  <div class="font-medium">info@harajaden.com</div>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div
                  class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <div class="text-gray-500 text-sm">
                    {{ isArabic ? "الهاتف" : "Phone" }}
                  </div>
                  <div class="font-medium">+967 783118008</div>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div
                  class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <div class="text-gray-500 text-sm">
                    {{ isArabic ? "العنوان" : "Address" }}
                  </div>
                  <div class="font-medium">
                    {{ isArabic ? "عدن، اليمن" : "Aden, Yemen" }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </app-layout>
</template>

<style scoped></style>
