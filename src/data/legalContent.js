// Bilingual content for the About and Legal (Privacy Policy + Terms) pages.
// The Arabic text is the official, legally binding version; English is a
// courtesy translation. Rendered by AboutPage.vue and LegalPage.vue.

const p = (ar, en) => ({ type: "p", ar, en });
const sub = (ar, en) => ({ type: "sub", ar, en });
const note = (variant, ar, en) => ({ type: "note", variant, ar, en }); // 'info' | 'warn'
const list = (rows) => ({
  type: "list",
  items: rows.map(([ar, en]) => ({ ar, en })),
});
const cards = (rows) => ({
  type: "cards",
  items: rows.map(([tar, ten, dar, den]) => ({
    title: { ar: tar, en: ten },
    desc: { ar: dar, en: den },
  })),
});

// ============================================================================
// ABOUT
// ============================================================================
export const aboutContent = {
  hero: {
    title: { ar: "حراج عدن", en: "Harajaden" },
    subtitle: { ar: "منصة الإعلانات المبوبة", en: "Classified Ads Platform" },
  },
  sections: [
    {
      title: { ar: "من نحن", en: "Who We Are" },
      blocks: [
        p(
          "Harajaden منصة إعلانات مبوبة رقمية أُنشئت لتكون الوجهة الأولى التي يلجأ إليها اليمنيون — في الداخل والمهجر — لنشر إعلاناتهم وقضاء حاجاتهم التجارية بكل يسر وأمان. نُقدِّم خدمة مجانية وسهلة الاستخدام تُتيح لأي شخص نشر إعلانه أو العثور على ما يبحث عنه في غضون دقائق، دون تعقيد أو وسطاء.",
          "Harajaden is a digital classified-ads platform built to be the first destination Yemenis — at home and abroad — turn to for posting ads and handling their commercial needs with ease and safety. We offer a free, easy-to-use service that lets anyone post an ad or find what they're looking for within minutes, with no complexity and no middlemen.",
        ),
        p(
          "انطلقنا من قناعة راسخة بأن السوق اليمني يحتاج إلى منصة رقمية متخصصة تفهم طبيعته وتُلبِّي احتياجاته؛ منصة تجمع بين سهولة الاستخدام وتنوع المحتوى والهوية العربية الأصيلة.",
          "We started from a firm belief that the Yemeni market needs a dedicated digital platform that understands its nature and meets its needs — one that combines ease of use, diverse content, and an authentic Arab identity.",
        ),
      ],
    },
    {
      title: { ar: "قصة التأسيس", en: "Our Story" },
      blocks: [
        p(
          "في بيئة رقمية تفتقر إلى منصة إعلانات مبوبة واسعة المحتوى ومُصمَّمة خصيصاً للسياق اليمني، وُلدت فكرة Harajaden. لاحظ مؤسسو المنصة أن كثيراً من اليمنيين يلجؤون إلى مجموعات التواصل الاجتماعي لنشر إعلاناتهم، مما يُفضي إلى ضياع الفرص وصعوبة التحقق من جدية العروض.",
          "In a digital landscape that lacked a content-rich classifieds platform designed specifically for the Yemeni context, the idea of Harajaden was born. Its founders noticed that many Yemenis resort to social-media groups to post their ads, which leads to missed opportunities and difficulty verifying how genuine offers are.",
        ),
        p(
          "من هذه الحاجة الفعلية، قرر الفريق المؤسس بناء منصة احترافية تُوفِّر بيئة منظَّمة وفعّالة للتبادل التجاري، مستوحيًا أفضل الممارسات العالمية في مجال الإعلانات المبوبة ومُكيِّفًا إياها مع خصوصية السوق المحلي.",
          "From that real need, the founding team decided to build a professional platform that provides an organized, effective environment for trade — inspired by global best practices in classifieds and adapted to the specifics of the local market.",
        ),
        p(
          "انطلقت Harajaden لتُغطِّي محافظات يمنية رئيسية، مُتيحةً في الوقت ذاته إمكانية الوصول من أي مكان في العالم لخدمة الجاليات اليمنية في الخارج.",
          "Harajaden launched to cover major Yemeni governorates, while remaining accessible from anywhere in the world to serve Yemeni communities abroad.",
        ),
      ],
    },
    {
      title: { ar: "رسالتنا", en: "Our Mission" },
      blocks: [
        p(
          "تقديم منصة إعلانات مبوبة عربية سهلة الاستخدام وثرية المحتوى، تُمكِّن الأفراد والمنشآت الصغيرة والكبيرة من التواصل التجاري بكل شفافية ووضوح — مع الالتزام باحترام خصوصية المستخدمين كأولوية قصوى في كل قرار نتخذه.",
          "To provide an easy-to-use, content-rich Arabic classifieds platform that enables individuals and businesses, large and small, to trade with full transparency and clarity — while treating users' privacy as a top priority in every decision we make.",
        ),
      ],
    },
    {
      title: { ar: "رؤيتنا", en: "Our Vision" },
      blocks: [
        p(
          "أن نكون المنصة الرقمية الأولى للإعلانات المبوبة في عدن، ثم في اليمن، ونقطة الارتكاز التجارية المتكاملة لكل يمني في اليمن يبحث عن فرصة أو يسعى لتحقيق صفقة.",
          "To be the leading digital classifieds platform in Aden, then across Yemen — the integrated commercial hub for every Yemeni looking for an opportunity or seeking to close a deal.",
        ),
      ],
    },
    {
      title: { ar: "ماذا نُقدِّم؟", en: "What We Offer" },
      blocks: [
        p(
          "تُتيح Harajaden نشر الإعلانات وتصفُّحها في طيف واسع من الفئات، أبرزها:",
          "Harajaden lets you post and browse ads across a wide range of categories, including:",
        ),
        list([
          [
            "العقارات: بيع وإيجار الشقق والمنازل والأراضي والمحلات التجارية",
            "Real estate: selling and renting apartments, houses, land, and shops",
          ],
          [
            "السيارات والمركبات: سيارات، دراجات، قطع غيار",
            "Cars & vehicles: cars, motorcycles, spare parts",
          ],
          [
            "الإلكترونيات: هواتف ذكية، حواسيب، أجهزة منزلية",
            "Electronics: smartphones, computers, home appliances",
          ],
          [
            "الأثاث والديكور: أثاث مستعمل وجديد، مستلزمات المنزل",
            "Furniture & décor: used and new furniture, home supplies",
          ],
          [
            "الوظائف والخدمات: فرص عمل، خدمات مهنية وحرفية",
            "Jobs & services: job opportunities, professional and skilled services",
          ],
          [
            "الملابس والأزياء والإكسسوارات",
            "Clothing, fashion, and accessories",
          ],
          [
            "الحيوانات الأليفة والمستلزمات الزراعية",
            "Pets and agricultural supplies",
          ],
          [
            "وفئات متنوعة أخرى تُضاف باستمرار",
            "And many more categories, added continuously",
          ],
        ]),
      ],
    },
    {
      title: { ar: "قيمنا", en: "Our Values" },
      blocks: [
        cards([
          [
            "الأمان وجودة المحتوى",
            "Safety & Content Quality",
            "نضع سلامة بيئة العرض في صميم كل قرار. نحرص على أن تكون المنصة فضاءً مفتوحاً ومنظَّماً يجد فيه كل مستخدم ما يبحث عنه بيسر، ونُشجِّع الجميع على الإبلاغ عن أي إعلان مخالف للحفاظ على جودة المحتوى المعروض.",
            "We put the safety of the marketplace at the heart of every decision. We keep the platform open and organized so every user finds what they need easily, and we encourage everyone to report any violating ad to preserve content quality.",
          ],
          [
            "المجانية للجميع",
            "Free for Everyone",
            "نشر الإعلانات مجاني للأفراد. نؤمن بأن الوصول إلى فرص البيع والشراء حق لا يجب أن يكون مشروطاً بالدفع.",
            "Posting ads is free for individuals. We believe access to buying and selling opportunities is a right that should not be conditional on payment.",
          ],
          [
            "السهولة والسرعة",
            "Simplicity & Speed",
            "صمَّمنا المنصة بحيث تكون بسيطة بما يكفي لأي مستخدم، سواء كان تقنياً أو لا. يمكنك نشر إعلانك في أقل من دقيقتين من هاتفك أو حاسوبك.",
            "We designed the platform to be simple enough for any user, technical or not. You can post your ad in under two minutes from your phone or computer.",
          ],
          [
            "الهوية اليمنية",
            "Yemeni Identity",
            "Harajaden منصة يمنية في جوهرها — باللغة العربية، وبفهم عميق لطبيعة السوق المحلي وعادات التبادل التجاري في اليمن.",
            "Harajaden is Yemeni at its core — in Arabic, with a deep understanding of the local market and Yemen's trading customs.",
          ],
          [
            "الشفافية",
            "Transparency",
            "نلتزم بالشفافية التامة في سياساتنا وشروطنا وأحكامنا. لا رسوم خفية، ولا شروط مُبهمة — ما تراه هو ما تحصل عليه.",
            "We commit to full transparency in our policies and terms. No hidden fees, no vague conditions — what you see is what you get.",
          ],
        ]),
      ],
    },
    {
      title: { ar: "لماذا Harajaden؟", en: "Why Harajaden?" },
      blocks: [
        p(
          "في زمن تتكاثر فيه المنصات الرقمية، قد يتساءل المرء: لماذا Harajaden بالتحديد؟ الجواب بسيط:",
          "In an age of countless digital platforms, you might ask: why Harajaden specifically? The answer is simple:",
        ),
        list([
          [
            "لأننا الوحيدون المُصمَّمون أصلاً للسوق اليمني بكل خصائصه",
            "Because we are the only one designed from the ground up for the Yemeni market and all its characteristics",
          ],
          [
            "لأننا نُقدِّم تجربة عربية كاملة دون أنصاف الحلول",
            "Because we offer a complete Arabic experience with no half-measures",
          ],
          [
            "لأن نشر الإعلان لدينا مجاني ومفتوح دون قيود مُبالَغ فيها",
            "Because posting an ad with us is free and open, without excessive restrictions",
          ],
          [
            "لأن فريقنا يفهم احتياجاتك ويتحدث لغتك",
            "Because our team understands your needs and speaks your language",
          ],
          [
            "لأننا نبني على المدى البعيد — مع مستخدمينا وليس على حسابهم",
            "Because we build for the long term — with our users, not at their expense",
          ],
        ]),
      ],
    },
    {
      title: { ar: "فريقنا", en: "Our Team" },
      blocks: [
        p(
          "يقوم على Harajaden عمل جاد في التطوير والتصميم والتسويق الرقمي، يجمعهم هدف مشترك: بناء منصة تُفيد المجتمع وتُسهم في تنشيط الاقتصاد المحلي، مع الإيمان بالتحسين المستمر والاستماع لملاحظات المستخدمين.",
          "Harajaden is powered by dedicated work in development, design, and digital marketing, united by a shared goal: building a platform that benefits the community and helps energize the local economy — with a belief in continuous improvement and in listening to user feedback.",
        ),
      ],
    },
    {
      title: { ar: "نموذج العمل", en: "Business Model" },
      blocks: [
        p(
          "تعتمد Harajaden نموذجاً تجارياً يُوازن بين مجانية الخدمة الأساسية وتوفير مصادر دخل مستدامة:",
          "Harajaden adopts a business model that balances a free core service with sustainable revenue sources:",
        ),
        list([
          [
            "الخدمة الأساسية مجانية: نشر الإعلانات العادية مجاني للجميع",
            "Free core service: posting regular ads is free for everyone",
          ],
          [
            "الإعلانات المميزة: خيارات مدفوعة لرفع ظهور الإعلان في نتائج البحث",
            "Featured ads: paid options to boost an ad's visibility in search results",
          ],
          [
            "البانرات الإعلانية: مساحات إعلانية مخصصة للشركات والمنشآت",
            "Banner ads: dedicated advertising spaces for companies and businesses",
          ],
        ]),
      ],
    },
    {
      title: { ar: "تواصل معنا", en: "Contact Us" },
      blocks: [
        p(
          "نسعد بتواصلك معنا في أي وقت، سواء كان لديك استفسار أو اقتراح أو شكوى:",
          "We're happy to hear from you anytime — whether you have a question, a suggestion, or a complaint:",
        ),
        list([
          ["الموقع الإلكتروني: www.harajaden.com", "Website: www.harajaden.com"],
          [
            "البريد الإلكتروني: info@harajaden.com",
            "Email: info@harajaden.com",
          ],
          [
            "التطبيق: متاح على Android و iOS",
            "App: available on Android and iOS",
          ],
        ]),
        note(
          "info",
          "شكراً لثقتك بـ Harajaden — نعمل كل يوم لنكون عند حسن ظنّك.",
          "Thank you for trusting Harajaden — we work every day to live up to your expectations.",
        ),
      ],
    },
  ],
};

// ============================================================================
// LEGAL — shared meta
// ============================================================================
export const legalMeta = {
  updated: { ar: "آخر تحديث: 19 أبريل 2026", en: "Last updated: 19 April 2026" },
  applies: {
    ar: "تسري على: www.harajaden.com  |  تطبيق Harajaden",
    en: "Applies to: www.harajaden.com  |  Harajaden App",
  },
  bindingNotice: {
    ar: "النسخة العربية من هذه الوثيقة هي المرجع القانوني المُلزِم. الترجمة الإنجليزية مُقدَّمة للتسهيل فقط.",
    en: "The Arabic version of this document is the legally binding reference. The English translation is provided for convenience only.",
  },
};

// ============================================================================
// PRIVACY POLICY
// ============================================================================
export const privacyContent = {
  title: { ar: "سياسة الخصوصية", en: "Privacy Policy" },
  sections: [
    {
      n: "1",
      title: { ar: "مقدمة وتعريف الأطراف", en: "Introduction & Definitions" },
      blocks: [
        p(
          'نحن شركة Harajaden ("المنصة"، "نحن"، "لنا") المالكة والمشغِّلة للموقع الإلكتروني www.harajaden.com وتطبيق الهاتف Harajaden App (ويُشار إليهما مجتمعين بـ "المنصة").',
          'We are Harajaden ("the Platform", "we", "us"), the owner and operator of the website www.harajaden.com and the Harajaden mobile app (together, "the Platform").',
        ),
        p(
          "نُولي خصوصية مستخدمينا أولوية قصوى، ونلتزم بحماية بياناتهم وفق أعلى المعايير المعمول بها. توضح هذه السياسة بشفافية تامة أنواع البيانات التي نجمعها، وكيفية استخدامها، والجهات التي قد نشاركها معها، وحقوقك الكاملة في الوصول إلى بياناتك أو تصحيحها أو حذفها.",
          "We treat our users' privacy as a top priority and are committed to protecting their data to the highest applicable standards. This policy transparently explains the types of data we collect, how we use them, who we may share them with, and your full rights to access, correct, or delete your data.",
        ),
        sub("تعريفات", "Definitions"),
        list([
          [
            'المستخدم ("أنت"): أي شخص يستعرض المنصة أو يسجّل حساباً أو ينشر إعلاناً أو يتفاعل مع إعلانات الآخرين.',
            'User ("you"): anyone who browses the Platform, registers an account, posts an ad, or interacts with other users\' ads.',
          ],
          [
            "المنصة: تشمل الموقع الإلكتروني وتطبيق الهاتف وأي خدمات رقمية أو ميزات مرتبطة تقدمها Harajaden.",
            "The Platform: includes the website, the mobile app, and any related digital services or features provided by Harajaden.",
          ],
          [
            "البيانات الشخصية: أي معلومات يمكن من خلالها التعرف عليك بشكل مباشر أو غير مباشر، مثل الاسم ورقم الهاتف وعنوان IP.",
            "Personal data: any information by which you can be identified, directly or indirectly, such as your name, phone number, and IP address.",
          ],
        ]),
        note(
          "warn",
          "باستمرارك في استخدام المنصة، فإنك تُقِرّ بأنك قرأتَ هذه السياسة وفهمتَها ووافقتَ عليها. إذا كنتَ لا توافق عليها، يُرجى التوقف عن الاستخدام فوراً.",
          "By continuing to use the Platform, you acknowledge that you have read, understood, and agreed to this policy. If you do not agree, please stop using the Platform immediately.",
        ),
      ],
    },
    {
      n: "2",
      title: { ar: "البيانات التي نجمعها", en: "Data We Collect" },
      blocks: [
        sub("2.1 بيانات يُقدمها المستخدم مباشرةً", "2.1 Data you provide directly"),
        p(
          "عند إنشاء الحساب أو نشر الإعلانات أو التواصل مع الدعم، نجمع:",
          "When you create an account, post ads, or contact support, we collect:",
        ),
        list([
          ["الاسم وعنوان البريد الإلكتروني ورقم الهاتف المحمول", "Name, email address, and mobile phone number"],
          ["صورة الملف الشخصي (اختيارية)", "Profile picture (optional)"],
          [
            "بيانات الإعلانات: العنوان، الوصف، السعر، الصور، الفئة، الموقع الجغرافي (اختياري)",
            "Ad data: title, description, price, images, category, and location (optional)",
          ],
          [
            "مراسلات الدعم الفني والرسائل المُرسَلة عبر ميزة الدردشة الداخلية",
            "Support correspondence and messages sent via the in-app chat feature",
          ],
        ]),
        sub("2.2 بيانات تسجيل الدخول عبر Google", "2.2 Google sign-in data"),
        p(
          "إذا اخترتَ التسجيل أو تسجيل الدخول باستخدام حساب Google، فإننا نحصل على إذن للوصول إلى الاسم الكامل والبريد الإلكتروني وصورة الملف الشخصي العامة ومعرّف Google الفريد لأغراض المصادقة فقط.",
          "If you choose to register or sign in with Google, we receive permission to access your full name, email address, public profile picture, and unique Google ID, for authentication purposes only.",
        ),
        note(
          "info",
          "لا نحصل على كلمة مرور Google ولا على أي بيانات حساسة أخرى. يمكنك إلغاء صلاحية الوصول في أي وقت من إعدادات حساب Google الخاص بك.",
          "We do not receive your Google password or any other sensitive data. You can revoke access at any time from your Google account settings.",
        ),
        sub("2.3 البيانات التي تُجمَع تلقائياً", "2.3 Automatically collected data"),
        list([
          ["عنوان IP الخاص بجهازك", "Your device's IP address"],
          [
            "نوع الجهاز ونظام التشغيل وإصداره، ونوع المتصفح وإصداره",
            "Device type, operating system and version, browser type and version",
          ],
          [
            "تفاصيل الجلسة: وقت وتاريخ الزيارة، والصفحات المُستعرَضة، ومدتها",
            "Session details: visit date and time, pages viewed, and duration",
          ],
          [
            "الإعلانات التي شاهدتَها أو تفاعلتَ معها، وعمليات البحث التي أجريتَها",
            "Ads you viewed or interacted with, and searches you performed",
          ],
          [
            "بيانات تسجيل الدخول: تاريخ الإنشاء وآخر دخول ناجح",
            "Login data: account creation date and last successful sign-in",
          ],
        ]),
        sub("2.4 بيانات الموقع الجغرافي", "2.4 Location data"),
        p(
          "إذا منحتَ المنصةَ إذنَ الوصول إلى موقعك، نستخدم إحداثيات GPS لعرض الإعلانات القريبة منك، ونقاط Wi-Fi وأبراج الاتصال لتحديد الموقع التقريبي، وعنوان IP لتحديد المدينة أو المنطقة العامة.",
          "If you grant location permission, we use GPS coordinates to show ads near you, Wi-Fi points and cell towers for approximate location, and your IP address to determine your general city or region.",
        ),
        note(
          "info",
          "الموقع الجغرافي الدقيق اختياري بالكامل. يمكنك إدخال موقعك يدوياً في إعلاناتك دون الحاجة لتفعيل خدمة الموقع.",
          "Precise location is entirely optional. You can enter your location manually in your ads without enabling location services.",
        ),
      ],
    },
    {
      n: "3",
      title: { ar: "كيف نستخدم بياناتك", en: "How We Use Your Data" },
      blocks: [
        sub("3.1 لتشغيل الخدمة الأساسية", "3.1 To run the core service"),
        list([
          ["إنشاء حسابك وإدارته والتحقق من هويتك", "Creating and managing your account and verifying your identity"],
          ["تمكينك من نشر الإعلانات والتواصل مع المشترين والبائعين", "Enabling you to post ads and communicate with buyers and sellers"],
          ["معالجة طلباتك وتقديم الدعم الفني", "Processing your requests and providing technical support"],
          [
            "إرسال رسائل التحقق وكلمات المرور المؤقتة عبر البريد أو الرسائل القصيرة",
            "Sending verification messages and one-time passwords by email or SMS",
          ],
        ]),
        sub("3.2 لتحسين المنصة وتخصيصها", "3.2 To improve and personalize the Platform"),
        list([
          ["تحليل أنماط الاستخدام لتحسين الواجهة والأداء", "Analyzing usage patterns to improve the interface and performance"],
          ["تخصيص نتائج البحث والإعلانات المقترحة بناءً على اهتماماتك", "Personalizing search results and suggested ads based on your interests"],
          ["إجراء دراسات داخلية ومسوح رضا المستخدمين", "Conducting internal studies and user-satisfaction surveys"],
        ]),
        sub("3.3 للأمان ومكافحة الاحتيال", "3.3 For security and fraud prevention"),
        list([
          ["رصد الأنشطة المشبوهة والإعلانات المخالفة", "Detecting suspicious activity and violating ads"],
          ["التحقق من صحة الحسابات والحد من الحسابات المزيفة", "Verifying accounts and limiting fake accounts"],
          ["تطبيق سياسات المنصة وقواعد الاستخدام المقبول", "Enforcing platform policies and acceptable-use rules"],
        ]),
        sub("3.4 للتواصل والتسويق", "3.4 For communication and marketing"),
        list([
          ["إرسال إشعارات تتعلق بإعلاناتك (ردود، مشاهدات، تحديثات)", "Sending notifications about your ads (replies, views, updates)"],
          ["إشعارات عن التحديثات والميزات الجديدة", "Notifications about updates and new features"],
        ]),
      ],
    },
    {
      n: "4",
      title: { ar: "مشاركة البيانات مع الأطراف الثالثة", en: "Sharing Data with Third Parties" },
      blocks: [
        note(
          "warn",
          "لا نبيع بياناتك الشخصية لأي طرف ثالث بأي شكل من الأشكال، ولا نتاجر بها.",
          "We do not sell your personal data to any third party in any form, and we do not trade in it.",
        ),
        p(
          "قد نشارك بياناتك في الحالات المحددة التالية حصراً:",
          "We may share your data only in the following specific cases:",
        ),
        sub("4.1 مزودو الخدمات التقنية", "4.1 Technical service providers"),
        list([
          ["خدمات الاستضافة السحابية: لتشغيل الموقع وتخزين البيانات", "Cloud hosting: to run the site and store data"],
          ["أنظمة إرسال البريد والرسائل: لإرسال الأكواد والإشعارات", "Email/SMS systems: to send codes and notifications"],
          ["أدوات التحليلات: لمعرفة كيفية استخدام المنصة", "Analytics tools: to understand how the Platform is used"],
          ["خدمات الأمن: لحماية الموقع والمستخدمين", "Security services: to protect the site and its users"],
        ]),
        sub("4.2 تسجيل الدخول عبر Google", "4.2 Google sign-in"),
        p(
          "عند استخدامك ميزة تسجيل الدخول بـ Google، يخضع تبادل البيانات لسياسة خصوصية Google (policies.google.com/privacy) وشروط خدمة Google Sign-In.",
          "When you use Google sign-in, the data exchange is governed by Google's privacy policy (policies.google.com/privacy) and the Google Sign-In terms of service.",
        ),
        sub("4.3 الإلزام القانوني", "4.3 Legal obligation"),
        p(
          "قد نُفصح عن بياناتك استجابةً لأمر قضائي أو طلب رسمي من جهات حكومية مختصة، مع الحرص على الإفصاح الأدنى الضروري فقط.",
          "We may disclose your data in response to a court order or an official request from competent authorities, while limiting disclosure to the minimum necessary.",
        ),
        sub("4.4 في حالة الاندماج أو الاستحواذ", "4.4 Merger or acquisition"),
        p(
          "إذا خضعت Harajaden لعملية اندماج أو استحواذ أو بيع أصول، سيتم إخطارك مسبقاً عبر البريد الإلكتروني، وسيلتزم المالك الجديد بشروط مشابهة لهذه السياسة.",
          "If Harajaden undergoes a merger, acquisition, or asset sale, you will be notified beforehand by email, and the new owner will be bound by terms similar to this policy.",
        ),
        sub("4.5 البيانات المعروضة للعموم", "4.5 Publicly visible data"),
        p(
          "بعض بيانات إعلاناتك مرئية للعموم بطبيعتها، مثل اسم المعلن ووصف الإعلان والسعر والصور والمنطقة العامة ورقم هاتفك إن اخترتَ إظهاره. كن حذراً فيما تنشره علناً.",
          "Some of your ad data is public by nature — such as the advertiser's name, ad description, price, images, general area, and your phone number if you choose to show it. Be careful about what you publish publicly.",
        ),
      ],
    },
    {
      n: "5",
      title: { ar: "ملفات الارتباط (Cookies) وتقنيات التتبع", en: "Cookies & Tracking Technologies" },
      blocks: [
        p(
          "نستخدم ملفات الارتباط وتقنيات مشابهة لضمان عمل المنصة بكفاءة وتحسين تجربتك:",
          "We use cookies and similar technologies to keep the Platform working efficiently and to improve your experience:",
        ),
        sub("5.1 الكوكيز الضرورية", "5.1 Essential cookies"),
        p(
          "لا يمكن تعطيلها إذ هي أساسية لعمل المنصة: الحفاظ على جلسة الدخول، تذكّر العناصر المحفوظة، وحماية النماذج من هجمات CSRF.",
          "These cannot be disabled as they are essential: keeping you signed in, remembering saved items, and protecting forms from CSRF attacks.",
        ),
        sub("5.2 كوكيز الأداء والتحليلات", "5.2 Performance & analytics cookies"),
        p(
          "تُساعدنا على فهم تفاعل المستخدمين مع المنصة: عدد الزوار وأكثر الصفحات زيارةً، ومعدل الارتداد ومدة الجلسة، وتتبع الأخطاء التقنية.",
          "These help us understand how users interact with the Platform: visitor counts and most-visited pages, bounce rate and session duration, and technical error tracking.",
        ),
        sub("5.3 كوكيز التفضيلات", "5.3 Preference cookies"),
        p(
          "تُخزّن اختياراتك لتخصيص التجربة: اللغة المفضلة، وإعدادات عرض الإعلانات، والفئات المفضلة.",
          "These store your choices to personalize the experience: preferred language, ad-display settings, and favorite categories.",
        ),
        sub("5.4 كيف تتحكم في الكوكيز", "5.4 Controlling cookies"),
        p(
          "يمكنك إدارة الكوكيز من إعدادات المتصفح (Chrome / Safari / Firefox / Edge) أو من نافذة الموافقة على الكوكيز التي تظهر عند أول زيارة.",
          "You can manage cookies from your browser settings (Chrome / Safari / Firefox / Edge) or from the cookie-consent window shown on your first visit.",
        ),
        note(
          "info",
          "تعطيل الكوكيز الضرورية قد يُعطّل بعض الوظائف الأساسية كتسجيل الدخول. أما كوكيز التحليلات والتفضيلات فيمكن تعطيلها دون التأثير على الوظائف الأساسية.",
          "Disabling essential cookies may break core functions such as sign-in. Analytics and preference cookies can be disabled without affecting core functionality.",
        ),
      ],
    },
    {
      n: "6",
      title: { ar: "أمان البيانات وحمايتها", en: "Data Security" },
      blocks: [
        p(
          "نُطبِّق معايير أمنية مشابهة لما تعتمده كبرى المنصات العالمية:",
          "We apply security standards comparable to those used by major global platforms:",
        ),
        list([
          ["تشفير جميع الاتصالات عبر بروتوكول TLS/HTTPS", "Encrypting all communications via TLS/HTTPS"],
          ["مصادقة ثنائية العوامل (2FA) اختيارياً", "Optional two-factor authentication (2FA)"],
          ["تقييد الوصول الداخلي وفق مبدأ الحد الأدنى من الصلاحيات", "Restricting internal access on a least-privilege basis"],
          ["تشفير البيانات في قواعد البيانات (Encryption at Rest)", "Encrypting data at rest in our databases"],
          ["إجراء تقييمات أمنية دورية وفحص الثغرات", "Performing periodic security assessments and vulnerability scans"],
          ["نسخ احتياطية مشفرة بجداول زمنية منتظمة", "Encrypted backups on a regular schedule"],
        ]),
      ],
    },
    {
      n: "7",
      title: { ar: "مدة الاحتفاظ بالبيانات", en: "Data Retention" },
      blocks: [
        p(
          "نحتفظ بالبيانات فقط للمدة الضرورية لتحقيق الأغراض المذكورة: بيانات الحساب النشط طوال فترة نشاط الحساب، وبيانات الاستخدام والتحليلات بصيغة مجهولة الهوية لفترة أطول.",
          "We retain data only for as long as necessary to fulfill the stated purposes: active-account data for the life of the account, and usage/analytics data in anonymized form for a longer period.",
        ),
      ],
    },
    {
      n: "8",
      title: { ar: "حقوقك كمستخدم", en: "Your Rights" },
      blocks: [
        list([
          ["حق التصحيح: تصحيح أي بيانات غير دقيقة أو غير مكتملة", "Right to correction: correct any inaccurate or incomplete data"],
          ['حق الحذف ("الحق في النسيان"): طلب حذف بياناتك من أنظمتنا', 'Right to erasure ("the right to be forgotten"): request deletion of your data from our systems'],
          ["حق سحب الموافقة: سحب موافقتك في أي وقت دون أثر رجعي", "Right to withdraw consent: withdraw your consent at any time, without retroactive effect"],
        ]),
      ],
    },
    {
      n: "9",
      title: { ar: "خصوصية القاصرين", en: "Children's Privacy" },
      blocks: [
        p(
          "لا تستهدف منصة Harajaden الأشخاص دون سن 18 عاماً. بالتسجيل، تُقرّ بأنك بلغت 18 عاماً. لا نجمع بيانات من القاصرين عن قصد، وإذا اكتشفنا ذلك سنحذفها فوراً. إذا كنتَ ولي أمر وتعتقد أن طفلك قدّم بيانات، تواصل معنا على info@harajaden.com.",
          "Harajaden does not target anyone under 18. By registering, you confirm you are 18 or older. We do not knowingly collect data from minors, and if we discover such data we will delete it immediately. If you are a guardian and believe your child provided data, contact us at info@harajaden.com.",
        ),
      ],
    },
    {
      n: "10",
      title: { ar: "الروابط الخارجية", en: "External Links" },
      blocks: [
        p(
          "قد تحتوي المنصة على روابط لمواقع خارجية. لسنا مسؤولين عن ممارسات الخصوصية لهذه المواقع، ونوصيك بمراجعة سياسة الخصوصية لأي موقع تزوره عبر روابطنا.",
          "The Platform may contain links to external sites. We are not responsible for the privacy practices of those sites, and we recommend reviewing the privacy policy of any site you visit through our links.",
        ),
      ],
    },
    {
      n: "11",
      title: { ar: "تحديثات سياسة الخصوصية", en: "Policy Updates" },
      blocks: [
        p(
          'قد نُحدِّث هذه السياسة دورياً. عند إجراء تغييرات جوهرية سنعرض إشعاراً بارزاً ونُحدِّث تاريخ "آخر تحديث" أعلى الصفحة. استمرارك في الاستخدام بعد النشر يعني موافقتك على السياسة المُحدَّثة.',
          'We may update this policy periodically. For material changes we will show a prominent notice and update the "Last updated" date at the top. Continued use after publication means you accept the updated policy.',
        ),
      ],
    },
    {
      n: "12",
      title: { ar: "كيفية التواصل معنا", en: "How to Contact Us" },
      blocks: [
        p(
          "للاستفسارات المتعلقة بالخصوصية أو ممارسة حقوقك: البريد الإلكتروني info@harajaden.com، والموقع www.harajaden.com. سنردّ خلال 5 أيام عمل كحد أقصى.",
          "For privacy questions or to exercise your rights: email info@harajaden.com or visit www.harajaden.com. We will respond within a maximum of 5 business days.",
        ),
      ],
    },
  ],
};

// ============================================================================
// TERMS & CONDITIONS
// ============================================================================
export const termsContent = {
  title: { ar: "الشروط والأحكام", en: "Terms & Conditions" },
  sections: [
    {
      n: "1",
      title: { ar: "مقدمة وقبول الشروط", en: "Introduction & Acceptance" },
      blocks: [
        p(
          "مرحباً بك في Harajaden، منصة الإعلانات المبوبة التي تُتيح للأفراد والمنشآت نشر إعلانات البيع والشراء والإيجار والخدمات. تحكم هذه الشروط علاقتك بالمنصة وتُحدّد حقوقك والتزاماتك.",
          "Welcome to Harajaden, the classifieds platform that lets individuals and businesses post ads for selling, buying, renting, and services. These terms govern your relationship with the Platform and define your rights and obligations.",
        ),
        p(
          "باستخدامك للمنصة بأي صورة — تصفُّحاً أو تسجيلاً أو نشراً للإعلانات أو تواصلاً مع مستخدمين آخرين — فإنك تُقرّ بقراءة هذه الشروط وفهمها والموافقة الكاملة عليها.",
          "By using the Platform in any way — browsing, registering, posting ads, or communicating with other users — you acknowledge that you have read, understood, and fully agreed to these terms.",
        ),
        note(
          "info",
          "إذا كنتَ تستخدم المنصة باسم شركة أو كيان قانوني، فإنك تُقرّ بأن لديك الصلاحية القانونية لإلزام ذلك الكيان بهذه الشروط.",
          "If you use the Platform on behalf of a company or legal entity, you confirm that you have the legal authority to bind that entity to these terms.",
        ),
      ],
    },
    {
      n: "2",
      title: { ar: "الأهلية القانونية للاستخدام", en: "Eligibility" },
      blocks: [
        list([
          ["أن يكون عمرك 18 عاماً أو أكثر", "You must be 18 years of age or older"],
          ["ألا تكون قد مُنعتَ مسبقاً من استخدام المنصة من قِبَلنا", "You must not have been previously banned from the Platform by us"],
          ["أن تُقدِّم بيانات تسجيل صحيحة ودقيقة وكاملة", "You must provide true, accurate, and complete registration data"],
        ]),
        p(
          "بالتسجيل، تُقرّ بأنك تستوفي هذه الشروط جميعها. يحق لنا التحقق من أهليتك في أي وقت.",
          "By registering, you confirm that you meet all of these conditions. We reserve the right to verify your eligibility at any time.",
        ),
      ],
    },
    {
      n: "3",
      title: { ar: "إنشاء الحساب وإدارته", en: "Account Creation & Management" },
      blocks: [
        sub("3.1 إنشاء الحساب", "3.1 Creating an account"),
        list([
          ["يتطلب النشر والتواصل إنشاء حساب مجاني", "Posting and messaging require a free account"],
          ["يمكن التسجيل بالبريد الإلكتروني أو عبر حساب Google", "You can register by email or via a Google account"],
          ["يُسمح بحساب واحد فقط لكل شخص أو كيان", "Only one account is allowed per person or entity"],
          ["تتعهد بتقديم معلومات صادقة ودقيقة وتحديثها عند الحاجة", "You agree to provide truthful, accurate information and update it as needed"],
        ]),
        sub("3.2 أمان الحساب", "3.2 Account security"),
        list([
          ["أنت مسؤول مسؤولية كاملة عن سرية بيانات دخولك", "You are fully responsible for keeping your login credentials confidential"],
          ["أنت مسؤول عن جميع الأنشطة التي تجري تحت حسابك", "You are responsible for all activity that occurs under your account"],
          ["يجب إخطارنا فوراً إذا اشتبهتَ في اختراق حسابك على info@harajaden.com", "You must notify us immediately at info@harajaden.com if you suspect your account is compromised"],
        ]),
        sub("3.3 تعليق الحساب وإلغاؤه", "3.3 Suspension & termination"),
        p(
          "يحق لنا تعليق حسابك أو إلغاؤه عند انتهاك هذه الشروط، أو نشر محتوى مخالف أو احتيالي، أو تقديم معلومات مزيفة، أو إساءة استخدام الدردشة أو مضايقة المستخدمين، أو بناءً على طلب السلطات المختصة.",
          "We may suspend or terminate your account if you violate these terms, post violating or fraudulent content, provide false information, misuse chat or harass users, or upon request from competent authorities.",
        ),
        note(
          "info",
          "عند الإلغاء بسبب المخالفة قد يُحظر إعادة التسجيل. في حالات الانتهاك البسيط، قد نوجّه تحذيراً أولاً قبل التعليق.",
          "Termination for violations may bar re-registration. For minor violations, we may issue a warning first before suspending.",
        ),
      ],
    },
    {
      n: "4",
      title: { ar: "قواعد نشر الإعلانات", en: "Ad Posting Rules" },
      blocks: [
        sub("4.1 معايير الإعلانات المقبولة", "4.1 Acceptable-ad standards"),
        list([
          ["أن تكون السلعة أو الخدمة مشروعة وقانونية", "The advertised item or service must be lawful and legal"],
          ["أن تكون المعلومات صحيحة ودقيقة وغير مُضلِّلة", "The information must be true, accurate, and not misleading"],
          ["أن تكون الصور أصلية وتعكس المنتج الفعلي", "Images must be original and reflect the actual product"],
          ["أن ينتمي الإعلان للفئة الصحيحة", "The ad must belong to the correct category"],
          ["حذف الإعلان فور بيع المنتج أو توقف الخدمة", "Remove the ad once the item is sold or the service stops"],
          ["عدم تكرار نشر الإعلان ذاته بشكل مفرط", "Do not excessively repost the same ad"],
        ]),
        sub("4.2 ما لا يُسمح به في الإعلانات", "4.2 Prohibited ads"),
        p("يُحظر تماماً نشر أي إعلان يتضمن أياً مما يلي:", "It is strictly prohibited to post any ad involving:"),
        list([
          ["الأسلحة والذخائر والمتفجرات والمواد الخطرة", "Weapons, ammunition, explosives, and hazardous materials"],
          ["المخدرات والمؤثرات العقلية والمواد المحظورة", "Drugs, psychotropic substances, and banned materials"],
          ["البضائع المسروقة أو المقلدة أو المخالفة للملكية الفكرية", "Stolen or counterfeit goods, or items infringing intellectual property"],
          ["المحتوى الإباحي أو المُخِل بالآداب العامة أو القيم الإسلامية", "Pornographic content or content offending public decency or Islamic values"],
          ["الخدمات المالية غير المرخصة أو مخططات الاستثمار الاحتيالية والهرمية", "Unlicensed financial services or fraudulent/pyramid investment schemes"],
          ["الحيوانات المهددة بالانقراض أو المحمية قانوناً", "Endangered or legally protected animals"],
          ["أعضاء الجسم البشري أو المنتجات الطبية الخاضعة للوصفة", "Human body parts or prescription-only medical products"],
          ["أي منتج أو خدمة مقيدة أو محظورة في اليمن أو بلد المُعلِن", "Any product or service restricted or banned in Yemen or the advertiser's country"],
          ["إعلانات الاحتيال والنصب", "Fraud and scam ads"],
        ]),
        note(
          "warn",
          "تحتفظ المنصة بحق حذف أي إعلان مخالف فوراً ودون سابق إنذار. وفي حالات الانتهاك المتكرر، سيُلغى الحساب نهائياً.",
          "The Platform reserves the right to remove any violating ad immediately and without prior notice. Repeated violations will result in permanent account termination.",
        ),
        sub("4.3 المحتوى الذي تنشره وترخيصه", "4.3 Your content & its license"),
        p(
          "تحتفظ بملكية المحتوى الذي تنشره (صور، نصوص)، لكنك تمنح Harajaden ترخيصاً غير حصري وعالمياً ومجانياً لعرض الإعلان وتخزينه، واستخدام المحتوى في الترويج للمنصة، وإنشاء نسخ مُصغَّرة لأغراض تقنية. ينتهي هذا الترخيص تلقائياً عند حذف الإعلان أو الحساب.",
          "You retain ownership of the content you post (images, text), but you grant Harajaden a non-exclusive, worldwide, royalty-free license to display and store the ad, use the content to promote the Platform, and create resized copies for technical purposes. This license ends automatically when the ad or account is deleted.",
        ),
      ],
    },
    {
      n: "5",
      title: { ar: "دور المنصة وحدود المسؤولية", en: "Platform Role & Liability" },
      blocks: [
        sub("5.1 Harajaden وسيط فقط", "5.1 Harajaden is an intermediary only"),
        p(
          "Harajaden منصة تقنية تربط البائعين بالمشترين فقط، ولا تُشارك في العمليات التجارية مباشرةً. لذلك لا تتحمل مسؤولية جودة المنتجات أو الخدمات، ولا تضمن دقة معلومات الإعلانات، ولا تتدخل في مفاوضات الأسعار. أي نزاع بين مستخدمَين هو شأن بينهما.",
          "Harajaden is a technical platform that only connects sellers with buyers and does not participate directly in transactions. Accordingly, it is not responsible for the quality of products or services, does not guarantee the accuracy of ad information, and does not intervene in price negotiations. Any dispute between two users is a matter between them.",
        ),
        sub("5.2 توصيات السلامة للمستخدمين", "5.2 Safety recommendations"),
        list([
          ["التحقق من هوية الطرف الآخر قبل إتمام الصفقة", "Verify the other party's identity before completing a deal"],
          ["فحص المنتج شخصياً قبل الدفع كلما أمكن", "Inspect the product in person before paying whenever possible"],
          ["تفضيل الاجتماع في أماكن عامة آمنة", "Prefer meeting in safe public places"],
          ["تجنب الدفع المسبق لأطراف غير موثوقة", "Avoid prepaying untrusted parties"],
          ['الإبلاغ عن أي إعلان مشبوه عبر زر "الإبلاغ"', 'Report any suspicious ad using the "Report" button'],
        ]),
        sub("5.3 توفر الخدمة", "5.3 Service availability"),
        p(
          "نسعى لتوفير المنصة على مدار الساعة، لكننا لا نضمن الاستمرارية المطلقة. قد تحدث انقطاعات للصيانة أو لظروف خارجة عن إرادتنا، ولن نكون مسؤولين عن أي خسائر ناجمة عن عدم التوفر.",
          "We strive to keep the Platform available around the clock, but we do not guarantee uninterrupted availability. Outages may occur for maintenance or due to circumstances beyond our control, and we will not be liable for losses arising from unavailability.",
        ),
      ],
    },
    {
      n: "6",
      title: { ar: "الملكية الفكرية", en: "Intellectual Property" },
      blocks: [
        p(
          "جميع حقوق الملكية الفكرية المتعلقة بـ Harajaden محفوظة، وتشمل الاسم التجاري والشعار والعلامات، وتصميم المنصة وواجهتها، والكود البرمجي، وترتيب المحتوى. يُمنح لك ترخيص شخصي محدود غير قابل للتحويل لاستخدام المنصة وفق هذه الشروط.",
          "All intellectual-property rights related to Harajaden are reserved, including the brand name, logo and trademarks, the platform's design and interface, the source code, and the arrangement of content. You are granted a limited, non-transferable personal license to use the Platform under these terms.",
        ),
        p("يُحظر:", "It is prohibited to:"),
        list([
          ["نسخ أو استنساخ أي جزء من المنصة دون إذن كتابي مسبق", "Copy or reproduce any part of the Platform without prior written permission"],
          ["استخدام اسم Harajaden أو شعاره في أي مواد إعلانية أو تجارية", "Use the Harajaden name or logo in any advertising or commercial materials"],
          ["عكس هندسة الكود البرمجي أو محاولة استخراجه", "Reverse-engineer or attempt to extract the source code"],
        ]),
      ],
    },
    {
      n: "7",
      title: { ar: "الخدمات المدفوعة والإعلانات المميزة", en: "Paid Services & Featured Ads" },
      blocks: [
        p(
          "تقدم Harajaden خدمات أساسية مجانية، إضافة إلى خدمات مدفوعة اختيارية مثل رفع الإعلان لأعلى نتائج البحث، والإعلانات البانرية، وباقات العضوية المميزة.",
          "Harajaden offers free core services plus optional paid services such as boosting an ad to the top of search results, banner ads, and premium membership packages.",
        ),
        sub("شروط الخدمات المدفوعة", "Paid-service terms"),
        list([
          ["يمكن إلغاء الإعلان المميز واسترداد المبلغ إلى المحفظة خلال 3 ساعات من التفعيل", "A featured ad can be canceled and refunded to your wallet within 3 hours of activation"],
          ["بعد مرور 3 ساعات، لا يمكن استرداد المبلغ", "After 3 hours, the amount is non-refundable"],
          ["الرسوم غير قابلة للاسترداد إلا في حال أعطال تقنية مثبتة من طرفنا", "Fees are non-refundable except in the case of technical faults proven to be on our side"],
          ["الخدمات المدفوعة تُحسّن الظهور ولا تضمن الوصول إلى مشترين بعينهم", "Paid services improve visibility but do not guarantee reaching specific buyers"],
          ["الأسعار قابلة للتغيير مع إشعار مسبق", "Prices are subject to change with prior notice"],
        ]),
      ],
    },
    {
      n: "8",
      title: { ar: "سلوك المستخدم والاستخدام المقبول", en: "User Conduct & Acceptable Use" },
      blocks: [
        p("تتعهد باستخدام المنصة بصورة مشروعة وأخلاقية، وتلتزم بعدم:", "You agree to use the Platform lawfully and ethically, and not to:"),
        list([
          ["مضايقة المستخدمين الآخرين أو التحرش بهم أو التشهير بهم", "Harass, abuse, or defame other users"],
          ["استخدام المنصة لأغراض احتيالية أو تضليلية", "Use the Platform for fraudulent or deceptive purposes"],
          ["محاولة الوصول غير المصرح به للحسابات أو الأنظمة", "Attempt unauthorized access to accounts or systems"],
          ["نشر فيروسات أو أكواد ضارة أو القيام بهجمات DDoS", "Spread viruses or malicious code, or carry out DDoS attacks"],
          ["استخدام روبوتات لجمع البيانات أو نشر الإعلانات (Scraping/Spamming)", "Use bots to scrape data or post ads (scraping/spamming)"],
          ["إنشاء حسابات وهمية أو التعدي على خصوصية المستخدمين", "Create fake accounts or violate users' privacy"],
        ]),
      ],
    },
    {
      n: "9",
      title: { ar: "إخلاء المسؤولية والضمانات", en: "Disclaimers & Warranties" },
      blocks: [
        p(
          'تُقدَّم خدمات Harajaden "كما هي" و"كما هي متاحة" دون أي ضمانات صريحة أو ضمنية. لا نضمن خلو المنصة من الأخطاء، ولا دقة المحتوى المنشور من المستخدمين، ولا تحقيق نتائج محددة.',
          'Harajaden\'s services are provided "as is" and "as available" without any express or implied warranties. We do not guarantee the Platform is error-free, that user-posted content is accurate, or that you will achieve specific results.',
        ),
        p(
          "لن تكون Harajaden مسؤولة عن أي أضرار مباشرة أو غير مباشرة ناجمة عن استخدام المنصة أو عدم القدرة على استخدامها، أو الاعتماد على معلومات الإعلانات، أو الصفقات مع مستخدمين آخرين.",
          "Harajaden will not be liable for any direct or indirect damages arising from using or being unable to use the Platform, relying on ad information, or transactions with other users.",
        ),
      ],
    },
    {
      n: "10",
      title: { ar: "التعويض", en: "Indemnification" },
      blocks: [
        p(
          "أنت توافق على حماية وتعويض Harajaden ومديريها وموظفيها عن أي خسائر أو مطالبات أو تكاليف (بما في ذلك أتعاب المحامين) الناتجة عن مخالفتك لهذه الشروط، أو انتهاكك لحقوق الآخرين، أو نشرك محتوى مخالف أو غير قانوني.",
          "You agree to defend and indemnify Harajaden, its directors and employees, against any losses, claims, or costs (including attorneys' fees) arising from your breach of these terms, your violation of others' rights, or your posting of violating or illegal content.",
        ),
      ],
    },
    {
      n: "11",
      title: { ar: "التعديلات على الشروط", en: "Changes to These Terms" },
      blocks: [
        p(
          'نحتفظ بالحق في تعديل هذه الشروط في أي وقت، وسنُخطرك بالتغييرات الجوهرية عبر إشعار بارز على المنصة وتحديث تاريخ "آخر تحديث". استمرارك في الاستخدام بعد النشر يُعدّ موافقةً صريحة على الشروط المُحدَّثة.',
          'We reserve the right to modify these terms at any time and will notify you of material changes through a prominent notice on the Platform and by updating the "Last updated" date. Continued use after publication constitutes explicit acceptance of the updated terms.',
        ),
      ],
    },
    {
      n: "12",
      title: { ar: "قابلية الفصل", en: "Severability" },
      blocks: [
        p(
          "إذا تبيَّن أن أي بند من هذه الشروط غير قابل للتطبيق قانونياً، فإن هذا البند وحده يُعدّ لاغياً دون التأثير على صلاحية باقي البنود.",
          "If any provision of these terms is found legally unenforceable, that provision alone is deemed void without affecting the validity of the remaining provisions.",
        ),
      ],
    },
    {
      n: "13",
      title: { ar: "القانون المنطبق وتسوية النزاعات", en: "Governing Law & Dispute Resolution" },
      blocks: [
        p(
          "تخضع هذه الشروط وتُفسَّر وفقاً للأنظمة والقوانين المعمول بها. في حال نشوء نزاع، يتعهد الطرفان بالسعي أولاً إلى التسوية الودية خلال 30 يوماً، وإذا تعذّرت يُلجأ إلى الجهات القضائية المختصة.",
          "These terms are governed by and interpreted under the applicable laws. In the event of a dispute, both parties commit to seeking an amicable settlement first within 30 days; if that fails, the matter is referred to the competent courts.",
        ),
      ],
    },
    {
      n: "14",
      title: { ar: "كمال الاتفاقية", en: "Entire Agreement" },
      blocks: [
        p(
          "تُشكِّل هذه الشروط مع سياسة الخصوصية الاتفاقية الكاملة بينك وبين Harajaden فيما يتعلق باستخدام المنصة، وتحلّ محل أي اتفاقيات سابقة.",
          "These terms, together with the Privacy Policy, constitute the entire agreement between you and Harajaden regarding use of the Platform, and supersede any prior agreements.",
        ),
      ],
    },
    {
      n: "15",
      title: { ar: "تواصل معنا", en: "Contact Us" },
      blocks: [
        p(
          "لأي استفسار بشأن هذه الشروط: البريد الإلكتروني info@harajaden.com، الموقع www.harajaden.com، تطبيق Harajaden.",
          "For any questions about these terms: email info@harajaden.com, website www.harajaden.com, Harajaden App.",
        ),
        note(
          "info",
          "فريق Harajaden يعمل على مدار الساعة لضمان تجربة آمنة وموثوقة لجميع المستخدمين.",
          "The Harajaden team works around the clock to ensure a safe and reliable experience for all users.",
        ),
      ],
    },
  ],
};
