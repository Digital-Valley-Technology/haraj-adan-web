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
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div>
              <h1 class="text-3xl font-bold">
                {{ isArabic ? "سياسة الخصوصية" : "Privacy Policy" }}
              </h1>
              <p class="text-white/90 mt-1">
                {{ isArabic ? "خصوصيتك مهمة لنا" : "Your privacy matters to us" }}
              </p>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="bg-white rounded-2xl shadow-sm p-8 space-y-8">
          <!-- Introduction -->
          <section>
            <h2 class="text-xl font-semibold text-blue-600 mb-4">
              {{ isArabic ? "المقدمة" : "Introduction" }}
            </h2>
            <p class="text-gray-700 leading-relaxed">
              {{
                isArabic
                  ? "مرحباً بكم في حراج عدن. نحن نقدر ثقتكم بنا ونلتزم بحماية خصوصيتكم. توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية معلوماتكم الشخصية عند استخدام تطبيقنا وخدماتنا."
                  : "Welcome to Haraj Aden. We value your trust and are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you use our app and services."
              }}
            </p>
          </section>

          <!-- Information We Collect -->
          <section>
            <h2 class="text-xl font-semibold text-blue-600 mb-4">
              {{ isArabic ? "المعلومات التي نجمعها" : "Information We Collect" }}
            </h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              {{ isArabic ? "نقوم بجمع المعلومات التالية:" : "We collect the following information:" }}
            </p>
            <ul class="list-disc list-inside text-gray-700 space-y-2 mr-4">
              <li>{{ isArabic ? "معلومات الحساب: الاسم، البريد الإلكتروني، رقم الهاتف" : "Account Information: Name, email, phone number" }}</li>
              <li>{{ isArabic ? "معلومات الإعلانات: العنوان، الوصف، الصور، الموقع، السعر" : "Ad Information: Title, description, images, location, price" }}</li>
              <li>{{ isArabic ? "معلومات الجهاز: نوع الجهاز، نظام التشغيل، معرف الجهاز" : "Device Information: Device type, operating system, device ID" }}</li>
              <li>{{ isArabic ? "معلومات الاستخدام: كيفية تفاعلك مع التطبيق" : "Usage Information: How you interact with the app" }}</li>
              <li>{{ isArabic ? "بيانات الموقع: لعرض الإعلانات القريبة منك (بإذنك)" : "Location Data: To show nearby ads (with your permission)" }}</li>
            </ul>
          </section>

          <!-- How We Use Your Information -->
          <section>
            <h2 class="text-xl font-semibold text-blue-600 mb-4">
              {{ isArabic ? "كيف نستخدم معلوماتك" : "How We Use Your Information" }}
            </h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              {{ isArabic ? "نستخدم معلوماتك للأغراض التالية:" : "We use your information for the following purposes:" }}
            </p>
            <ul class="list-disc list-inside text-gray-700 space-y-2 mr-4">
              <li>{{ isArabic ? "تقديم وتحسين خدماتنا" : "Providing and improving our services" }}</li>
              <li>{{ isArabic ? "عرض الإعلانات ذات الصلة" : "Displaying relevant ads" }}</li>
              <li>{{ isArabic ? "التواصل معك بشأن حسابك وإعلاناتك" : "Communicating with you about your account and ads" }}</li>
              <li>{{ isArabic ? "ضمان أمان المنصة ومنع الاحتيال" : "Ensuring platform security and preventing fraud" }}</li>
              <li>{{ isArabic ? "تخصيص تجربتك في التطبيق" : "Personalizing your app experience" }}</li>
              <li>{{ isArabic ? "إرسال إشعارات مهمة عن الخدمة" : "Sending important service notifications" }}</li>
            </ul>
          </section>

          <!-- Information Sharing -->
          <section>
            <h2 class="text-xl font-semibold text-blue-600 mb-4">
              {{ isArabic ? "مشاركة المعلومات" : "Information Sharing" }}
            </h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              {{ isArabic ? "لا نبيع معلوماتك الشخصية لأطراف ثالثة. قد نشارك معلوماتك في الحالات التالية:" : "We do not sell your personal information to third parties. We may share your information in the following cases:" }}
            </p>
            <ul class="list-disc list-inside text-gray-700 space-y-2 mr-4">
              <li>{{ isArabic ? "مع المستخدمين الآخرين عند نشر إعلان (المعلومات العامة فقط)" : "With other users when posting an ad (public information only)" }}</li>
              <li>{{ isArabic ? "مع مقدمي الخدمات الذين يساعدوننا في تشغيل المنصة" : "With service providers who help us operate the platform" }}</li>
              <li>{{ isArabic ? "عند الضرورة للامتثال للقوانين أو الإجراءات القانونية" : "When necessary to comply with laws or legal procedures" }}</li>
              <li>{{ isArabic ? "لحماية حقوقنا أو سلامة المستخدمين" : "To protect our rights or user safety" }}</li>
            </ul>
          </section>

          <!-- Data Security -->
          <section>
            <h2 class="text-xl font-semibold text-blue-600 mb-4">
              {{ isArabic ? "أمان البيانات" : "Data Security" }}
            </h2>
            <p class="text-gray-700 leading-relaxed">
              {{
                isArabic
                  ? "نتخذ إجراءات أمنية مناسبة لحماية معلوماتك من الوصول غير المصرح به أو التعديل أو الإفشاء أو الإتلاف. نستخدم التشفير وجدران الحماية وأفضل ممارسات الأمان لحماية بياناتك."
                  : "We take appropriate security measures to protect your information from unauthorized access, modification, disclosure, or destruction. We use encryption, firewalls, and best security practices to protect your data."
              }}
            </p>
          </section>

          <!-- Your Rights -->
          <section>
            <h2 class="text-xl font-semibold text-blue-600 mb-4">
              {{ isArabic ? "حقوقك" : "Your Rights" }}
            </h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              {{ isArabic ? "لديك الحقوق التالية فيما يتعلق بمعلوماتك:" : "You have the following rights regarding your information:" }}
            </p>
            <ul class="list-disc list-inside text-gray-700 space-y-2 mr-4">
              <li>{{ isArabic ? "الوصول إلى معلوماتك الشخصية" : "Access your personal information" }}</li>
              <li>{{ isArabic ? "تصحيح المعلومات غير الدقيقة" : "Correct inaccurate information" }}</li>
              <li>{{ isArabic ? "حذف حسابك وبياناتك" : "Delete your account and data" }}</li>
              <li>{{ isArabic ? "الاعتراض على معالجة بياناتك" : "Object to data processing" }}</li>
              <li>{{ isArabic ? "سحب موافقتك في أي وقت" : "Withdraw your consent at any time" }}</li>
            </ul>
          </section>

          <!-- Contact Us -->
          <section>
            <h2 class="text-xl font-semibold text-blue-600 mb-4">
              {{ isArabic ? "اتصل بنا" : "Contact Us" }}
            </h2>
            <p class="text-gray-700 leading-relaxed">
              {{
                isArabic
                  ? "إذا كانت لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى التواصل معنا:"
                  : "If you have any questions about this Privacy Policy, please contact us:"
              }}
            </p>
            <div class="mt-4 p-4 bg-gray-50 rounded-lg">
              <p class="text-gray-700">
                <strong>{{ isArabic ? "البريد الإلكتروني:" : "Email:" }}</strong>
                support@harajaden.com
              </p>
              <p class="text-gray-700 mt-2">
                <strong>{{ isArabic ? "الهاتف:" : "Phone:" }}</strong>
                +967 XXX XXX XXX
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
