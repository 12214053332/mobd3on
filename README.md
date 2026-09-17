# مركز المبدعون — Static Multi-Page Frontend

تحويل الـ Prototype الأصلي (`Al-Mubdioun_final_v_02 (2) (1).html`، ملف SPA واحد يعتمد
على `renderPage()`) إلى مشروع **صفحات HTML مستقلة حقيقية**: كل شاشة ملف `.html` قائم
بذاته، يعمل عند فتحه مباشرة بالنقر المزدوج (بدون خادم، بدون SPA Router، بدون
Server-Side Rendering).

هذا العمل يُنفَّذ **على مراحل** بسبب حجم الـ Prototype (أكثر من 60 شاشة عبر 4 أدوار).
تم في هذه المرحلة الأولى بناء الأساس الكامل (Design System + Layout + Interactions)
وأول صفحة فعلية: **لوحة تحكم السوبر أدمن**.

## القرارات التقنية المهمة

- **لا تحميل مكونات عبر jQuery `.load()`**: رغم أن التعليمات تسمح بذلك، فإن Chrome
  يمنع طلبات XHR/`fetch` بين ملفات `file://` (خطأ CORS)، وهذا يكسر الصفحة عند فتحها
  مباشرة بدون خادم. لذلك تم تضمين HTML الخاص بالـ Sidebar والـ Topbar **مباشرة داخل
  كل صفحة** (نفس الأسلوب المسموح به صراحة في المتطلبات: "يمكن تكرار HTML الخاص
  بالـ Sidebar وTopbar في الصفحات إذا كان ذلك ضروريًا"). ملفات `/components/*.html`
  محفوظة كمرجع/قالب تُنسخ منه كل صفحة جديدة، وليست مُحمَّلة وقت التشغيل.
- **لا Sprite SVG خارجي عبر `<use href="file.svg#id">`**: لنفس السبب (Chrome يمنع
  تحميل مراجع SVG الخارجية على `file://`). كل أيقونة مُضمَّنة كـ `<svg>` كامل داخل
  الصفحة نفسها (تمامًا كما كانت تُنتَج في الأصل عبر دالة `ico()`، لكن كـ HTML ثابت
  الآن وليس عبر JavaScript).
- **jQuery للتفاعل فقط**: كل ما هو موجود في `assets/js/app.js` و`assets/js/dashboard.js`
  يتفاعل مع HTML موجود مسبقًا في الصفحة (طي/فتح القائمة، active state، تبديل
  المؤشر/الفترة في الرسم البياني...) ولا يبني هيكل الصفحة.

## هيكل المشروع

```text
al-mubdioun/  (= جذر هذا المستودع)
├── admin/
│   └── dashboard.html          ✅ منجزة (لوحة تحكم السوبر أدمن)
│       (باقي صفحات admin/* مذكورة في "الصفحات المتبقية" أدناه)
├── trainee/                    ⏳ لم يبدأ بعد
├── crm/                        ⏳ لم يبدأ بعد
├── website/                    ⏳ لم يبدأ بعد
├── components/
│   ├── sidebar-admin.html      قالب مرجعي لسايدبار دور السوبر أدمن
│   └── topbar-actions.html     قالب مرجعي لعنقود أزرار التوب بار (يُستثنى الـ breadcrumb لأنه نص خاص بكل صفحة)
├── assets/
│   ├── css/
│   │   ├── variables.css       (الألوان، المسافات، الـ radius، الظلال — Design tokens)
│   │   ├── base.css            (Reset + عناصر أساسية + proto-banner + مقاس الأيقونات)
│   │   ├── layout.css          (Shell/Sidebar/Topbar/Nav)
│   │   ├── components.css      (كل مكونات الواجهة المشتركة: أزرار، KPI، جداول-بطاقة،
│   │   │                        Drawer، Toast، Wizard، Roles Matrix، Website Builder،
│   │   │                        Media Library، LMS Player، الشهادات... إلخ)
│   │   ├── forms.css           (حقول الإدخال، Toggle، Radio Cards، Combo، Dropzone)
│   │   ├── tables.css          (الجداول + Tree Table)
│   │   ├── dashboard.css       (تحسينات لوحة السوبر أدمن تحديدًا — .adash-*)
│   │   └── responsive.css      (Tablet/Mobile + Off-canvas sidebar على الجوال)
│   ├── js/
│   │   ├── app.js              (تفاعلات عامة: القائمة الجانبية، التوب بار، Toast)
│   │   ├── dashboard.js        (تفاعل الرسم البياني في لوحة السوبر أدمن فقط)
│   │   └── data/
│   │       └── dashboard.js    (Mock data الخاصة بلوحة السوبر أدمن: ADASH_*)
│   └── images/                 (شعار المنصة وصور أخرى تُضاف لاحقًا)
└── README.md
```

> ملاحظة: الملف الأصلي `Al-Mubdioun_final_v_02 (2) (1).html` تُرك في الجذر دون
> تعديل ليبقى مرجعًا لاستخراج بقية الشاشات في المراحل القادمة.

## الصفحة المُنجزة الآن

- **[admin/dashboard.html](admin/dashboard.html)** — لوحة تحكم السوبر أدمن الكاملة:
  ترحيب + إجراءات سريعة، 4 مؤشرات KPI، رسم بياني تفاعلي (تبديل المؤشر: تسجيلات/
  إيرادات/إتمام، وتبديل الفترة: 7 أيام/30 يوم/12 شهر) مع Tooltip عند التمرير، توزيع
  التسجيلات حسب نوع البرنامج، جدول أحدث التسجيلات، وتنبيهات النظام. جميع البيانات
  مأخوذة كما هي من الـ Prototype الأصلي (لا حذف لأي بيانات تجريبية).

### التحقق الذي تم إجراؤه

- ✅ لا وجود لأي `renderPage()` أو `go()` أو SPA Router في أي ملف من المشروع الجديد.
- ✅ كل روابط التنقل في السايدبار والصفحة عبارة عن `<a href="...">` حقيقية.
- ✅ تم فحص توازن الوسوم HTML بالكامل (parser check) ولا يوجد وسم غير مغلق.
- ✅ تم فحص تركيب CSS (توازن الأقواس) في كل ملفات `assets/css/*.css`.
- ✅ تم فحص صحة بنية كل ملفات JavaScript (`node --check`).
- ✅ الصفحة تعمل عند فتحها مباشرة عبر `file://` بدون أي خادم (تم التحقق من أن DOM
  الكامل يُبنى من HTML الثابت نفسه بدون الاعتماد على أي طلب شبكة).

## الصفحات المتبقية (المرحلة القادمة)

القائمة مستخرجة من `ROLES.*.nav` و`BESPOKE` map في الملف الأصلي — لا شيء محذوف.

### admin/* (السوبر أدمن)
البرامج التدريبية: `course-library.html`، `diplomas.html`، `fellowships.html`،
`professional-certificates.html` — التعلم: `waitlist.html`، `placement-exam.html`،
`course-categories.html`، `virtual-classrooms.html` — الاختبارات: `question-bank.html`،
`exams.html`، `grading.html` — `certificates.html` — المستخدمون: `trainees.html`،
`trainers.html`، `academic-staff.html`، `roles.html` — الإيرادات: `reports.html`،
`payments.html`، `coupons.html`
(+ شاشات تفاصيل/Workspace تُبنى مع كل قسم: مثل صفحة تفاصيل دورة، صفحة تفاصيل مستخدم،
معالج إضافة دورة/مسار/اختبار... إلخ)

### website/* (إدارة الموقع الإلكتروني — قسم فرعي من admin)
`dashboard.html`، `home.html`، `programs.html`، `pages.html`، `blog.html`،
`media.html`، `forms.html`، `navigation.html`، `policies.html`، `settings.html`

### academic/* (الكادر الأكاديمي)
`dashboard.html`، `my-tasks.html`، `review-programs.html`، `review-content.html`،
`review-assessments.html`، `approve-certificates.html`، `trainer-performance.html`،
`learner-progress.html`، `reports.html`، `academic-calendar.html`،
`accreditation-tasks.html`، `complaints.html`، `waitlist.html`

### trainer/* (المدرب)
`dashboard.html`، `my-courses.html`، `paths.html`، `my-sessions.html`،
`attendance.html`، `my-students.html`، `waitlist.html`، `assignments.html`،
`gradebook.html`، `profile.html`، `settings.html`، `support.html`

### trainee/* (المتدرب)
`dashboard.html`، `my-programs.html`، `calendar.html`، `assessments.html`،
`grades.html`، `certificates.html`، `profile.html`، `settings.html`، `support.html`

### crm/* (يُبنى عند الوصول إليه من واجهة العملاء المحتملين المرتبطة بالموقع)
`leads.html`، `pipeline.html`، `deals.html`، `customers.html`، `organizations.html`،
`tasks.html`، `calls.html`، `meetings.html`، `activities.html`، `reports.html`

---
عند بناء كل صفحة جديدة: يُنسخ هيكل السايدبار/التوب بار من `admin/dashboard.html`
(أو من `/components/*.html` كمرجع)، يُحدَّث `data-navkey` على `<body>` والـ breadcrumb
والعنوان، ثم يُضاف محتوى الصفحة كـ HTML ثابت + بياناته في `assets/js/data/`.
