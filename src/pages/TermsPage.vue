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
          class="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl p-8 mb-8 text-white"
        >
          <div class="flex items-center gap-4">
            <div class="bg-white/20 rounded-xl p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h1 class="text-3xl font-bold">
                {{ isArabic ? "شروط الاستخدام" : "Terms of Service" }}
              </h1>
              <p class="text-white/90 mt-1">
                {{
                  isArabic
                    ? "يرجى قراءة الشروط بعناية"
                    : "Please read the terms carefully"
                }}
              </p>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="bg-white rounded-2xl shadow-sm p-8 space-y-8">
          <!-- Acceptance of Terms -->
          <section>
            <h2 class="text-xl font-semibold text-blue-600 mb-4">
              {{ isArabic ? "قبول الشروط" : "Acceptance of Terms" }}
            </h2>
            <p class="text-gray-700 leading-relaxed">
              {{
                isArabic
                  ? "باستخدام تطبيق حراج عدن، فإنك توافق على الالتزام بشروط الاستخدام هذه. إذا كنت لا توافق على هذه الشروط، يرجى عدم استخدام التطبيق أو خدماتنا."
                  : "By using the Haraj Aden app, you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use the app or our services."
              }}
            </p>
          </section>

          <!-- Eligibility -->
          <section>
            <h2 class="text-xl font-semibold text-blue-600 mb-4">
              {{ isArabic ? "الأهلية" : "Eligibility" }}
            </h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              {{ isArabic ? "لاستخدام خدماتنا، يجب أن تكون:" : "To use our services, you must be:" }}
            </p>
            <ul class="list-disc list-inside text-gray-700 space-y-2 mr-4">
              <li>{{ isArabic ? "تبلغ من العمر 18 عاماً على الأقل" : "At least 18 years old" }}</li>
              <li>{{ isArabic ? "قادراً على إبرام عقود ملزمة قانونياً" : "Able to enter into legally binding contracts" }}</li>
              <li>{{ isArabic ? "غير محظور من استخدام خدماتنا" : "Not prohibited from using our services" }}</li>
            </ul>
          </section>

          <!-- Your Account -->
          <section>
            <h2 class="text-xl font-semibold text-blue-600 mb-4">
              {{ isArabic ? "حسابك" : "Your Account" }}
            </h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              {{ isArabic ? "عند إنشاء حساب، فإنك:" : "When creating an account, you:" }}
            </p>
            <ul class="list-disc list-inside text-gray-700 space-y-2 mr-4">
              <li>{{ isArabic ? "توافق على تقديم معلومات دقيقة وكاملة" : "Agree to provide accurate and complete information" }}</li>
              <li>{{ isArabic ? "مسؤول عن الحفاظ على سرية كلمة المرور" : "Are responsible for maintaining password confidentiality" }}</li>
              <li>{{ isArabic ? "مسؤول عن جميع الأنشطة التي تتم من خلال حسابك" : "Are responsible for all activities through your account" }}</li>
              <li>{{ isArabic ? "توافق على إخطارنا فوراً بأي استخدام غير مصرح به" : "Agree to notify us immediately of any unauthorized use" }}</li>
            </ul>
          </section>

          <!-- Ad Guidelines -->
          <section>
            <h2 class="text-xl font-semibold text-blue-600 mb-4">
              {{ isArabic ? "قواعد الإعلانات" : "Ad Guidelines" }}
            </h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              {{ isArabic ? "عند نشر الإعلانات، يجب أن:" : "When posting ads, you must ensure that:" }}
            </p>
            <ul class="list-disc list-inside text-gray-700 space-y-2 mr-4">
              <li>{{ isArabic ? "تكون المنتجات أو الخدمات المعروضة قانونية" : "Products or services offered are legal" }}</li>
              <li>{{ isArabic ? "تكون المعلومات المقدمة صحيحة ودقيقة" : "Information provided is true and accurate" }}</li>
              <li>{{ isArabic ? "تكون الصور حقيقية وتمثل المنتج الفعلي" : "Photos are real and represent the actual product" }}</li>
              <li>{{ isArabic ? "لا تحتوي على محتوى مسيء أو غير لائق" : "Content is not offensive or inappropriate" }}</li>
              <li>{{ isArabic ? "لا تنتهك حقوق الملكية الفكرية للآخرين" : "It does not infringe on others' intellectual property rights" }}</li>
              <li>{{ isArabic ? "لا تكون مكررة أو مضللة" : "Ads are not duplicated or misleading" }}</li>
            </ul>
          </section>

          <!-- Prohibited Content -->
          <section>
            <h2 class="text-xl font-semibold text-blue-600 mb-4">
              {{ isArabic ? "المحتوى المحظور" : "Prohibited Content" }}
            </h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              {{ isArabic ? "يُحظر نشر الإعلانات التي تتضمن:" : "It is prohibited to post ads that include:" }}
            </p>
            <ul class="list-disc list-inside text-gray-700 space-y-2 mr-4">
              <li>{{ isArabic ? "منتجات غير قانونية أو مسروقة" : "Illegal or stolen products" }}</li>
              <li>{{ isArabic ? "أسلحة أو ذخائر" : "Weapons or ammunition" }}</li>
              <li>{{ isArabic ? "مواد مخدرة أو مواد خاضعة للرقابة" : "Drugs or controlled substances" }}</li>
              <li>{{ isArabic ? "منتجات مقلدة أو مزيفة" : "Counterfeit or fake products" }}</li>
              <li>{{ isArabic ? "محتوى للبالغين أو إباحي" : "Adult or pornographic content" }}</li>
              <li>{{ isArabic ? "خدمات احتيالية أو مضللة" : "Fraudulent or misleading services" }}</li>
              <li>{{ isArabic ? "أي شيء ينتهك القوانين المحلية" : "Anything that violates local laws" }}</li>
            </ul>
          </section>

          <!-- Transactions -->
          <section>
            <h2 class="text-xl font-semibold text-blue-600 mb-4">
              {{ isArabic ? "المعاملات" : "Transactions" }}
            </h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              {{ isArabic ? "حراج عدن هو منصة للإعلانات المبوبة فقط:" : "Haraj Aden is a classified ads platform only:" }}
            </p>
            <ul class="list-disc list-inside text-gray-700 space-y-2 mr-4">
              <li>{{ isArabic ? "لا نتحمل مسؤولية المعاملات بين المستخدمين" : "We are not responsible for transactions between users" }}</li>
              <li>{{ isArabic ? "ننصح بالتحقق من المنتجات قبل الشراء" : "We advise verifying products before purchase" }}</li>
              <li>{{ isArabic ? "ننصح بإجراء المعاملات في أماكن عامة وآمنة" : "We advise conducting transactions in safe public places" }}</li>
              <li>{{ isArabic ? "لا نضمن جودة أو صحة المنتجات المعروضة" : "We do not guarantee the quality or authenticity of listed products" }}</li>
            </ul>
          </section>

          <!-- Account Termination -->
          <section>
            <h2 class="text-xl font-semibold text-blue-600 mb-4">
              {{ isArabic ? "إنهاء الحساب" : "Account Termination" }}
            </h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              {{ isArabic ? "نحتفظ بالحق في:" : "We reserve the right to:" }}
            </p>
            <ul class="list-disc list-inside text-gray-700 space-y-2 mr-4">
              <li>{{ isArabic ? "تعليق أو إنهاء حسابك في أي وقت" : "Suspend or terminate your account at any time" }}</li>
              <li>{{ isArabic ? "إزالة أي إعلانات تنتهك شروطنا" : "Remove any ads that violate our terms" }}</li>
              <li>{{ isArabic ? "اتخاذ إجراءات قانونية ضد المخالفين" : "Take legal action against violators" }}</li>
              <li>{{ isArabic ? "منع المستخدمين المسيئين من استخدام المنصة" : "Ban abusive users from using the platform" }}</li>
            </ul>
          </section>

          <!-- Disclaimer -->
          <section>
            <h2 class="text-xl font-semibold text-blue-600 mb-4">
              {{ isArabic ? "إخلاء المسؤولية" : "Disclaimer" }}
            </h2>
            <p class="text-gray-700 leading-relaxed">
              {{
                isArabic
                  ? 'يتم تقديم الخدمة "كما هي" دون أي ضمانات صريحة أو ضمنية. لا نتحمل المسؤولية عن أي أضرار مباشرة أو غير مباشرة ناتجة عن استخدام الخدمة.'
                  : 'The service is provided "as is" without any express or implied warranties. We are not liable for any direct or indirect damages resulting from the use of the service.'
              }}
            </p>
          </section>

          <!-- Governing Law -->
          <section>
            <h2 class="text-xl font-semibold text-blue-600 mb-4">
              {{ isArabic ? "القانون الساري" : "Governing Law" }}
            </h2>
            <p class="text-gray-700 leading-relaxed">
              {{
                isArabic
                  ? "تخضع هذه الشروط لقوانين الجمهورية اليمنية. أي نزاعات تنشأ عن استخدام الخدمة ستخضع للاختصاص القضائي للمحاكم اليمنية."
                  : "These terms are governed by the laws of the Republic of Yemen. Any disputes arising from the use of the service shall be subject to the jurisdiction of Yemeni courts."
              }}
            </p>
          </section>

          <!-- Contact Us -->
          <section>
            <h2 class="text-xl font-semibold text-blue-600 mb-4">
              {{ isArabic ? "اتصل بنا" : "Contact Us" }}
            </h2>
            <p class="text-gray-700 leading-relaxed">
              {{
                isArabic
                  ? "إذا كانت لديك أي أسئلة حول شروط الاستخدام، يرجى التواصل معنا:"
                  : "If you have any questions about the Terms of Use, please contact us:"
              }}
            </p>
            <div class="mt-4 p-4 bg-gray-50 rounded-lg">
              <p class="text-gray-700">
                <strong>{{ isArabic ? "البريد الإلكتروني:" : "Email:" }}</strong>
                info@harajaden.com
              </p>
              <p class="text-gray-700 mt-2">
                <strong>{{ isArabic ? "الهاتف:" : "Phone:" }}</strong>
                <span dir="ltr">+967 783118008</span>
              </p>
            </div>
          </section>

          <!-- Last Updated -->
          <div class="pt-6 border-t border-gray-200">
            <p class="text-gray-500 text-sm">
              {{ isArabic ? "آخر تحديث: مايو 2024" : "Last updated: May 2024" }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </app-layout>
</template>

<style scoped></style>
