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

## Tailwind CSS

كل تنسيق الصفحات مكتوب بـ **utility classes** من Tailwind CSS داخل الـ HTML نفسه — لا توجد ملفات CSS مخصّصة للمكونات.

- **الاستخدام:** الصفحات تربط ملفاً واحداً فقط: `assets/css/tailwind.css` (ناتج مُترجَم ومحفوظ في المستودع، لذلك تعمل الصفحات بالنقر المزدوج بدون أي أدوات).
- **تعديل التصميم / إضافة صفحات:** أضف classes في الـ HTML ثم أعد بناء الملف:

  ```bash
  npm install        # مرة واحدة
  npm run build      # يُنتج assets/css/tailwind.css
  npm run watch      # بناء تلقائي أثناء العمل
  ```

- **الـ Design tokens:** معرّفة كمتغيرات `:root` في `assets/css/tailwind.src.css` ومربوطة في `tailwind.config.js`، فتستعمل أسماءً مثل
  `bg-primary-700` `text-ink-2` `border-guide` `bg-canvas` `rounded-md` `shadow-card` `font-sans`.
- **التجاوب (Breakpoints المخصّصة):** `d1200:` `d1100:` `d1024:` `d820:` `d768:` `d560:` `d480:` (حتى هذا العرض) و`u1025:` (من هذا العرض). مثال: `d768:flex-col`.
- **الحالات:** `hover:` `focus-visible:` `disabled:` `first:` `last:` `empty:` و`before:` `after:`. الحالات التي يبدّلها الـ JS تُكتب كـ variants على الـ class نفسه، مثل `[&.open]:visible` و`[.drawer.open_&]:...`
  (الـ classes مثل `open` `on` `active` `cur` `collapsed` `sel` تبقى على العناصر كـ "hooks" يقرأها الـ JS والـ variants).
- **Classes بلا تنسيق (hooks):** بعض الأسماء القديمة مثل `sidebar` `drawer` `nav-item` `toggle` `wz-step` ما زالت في الـ HTML فقط لأن الـ jQuery أو الـ variants تعتمد عليها؛ لا يوجد CSS خلفها.
- **الـ JS الذي يبني عناصر (toast، الرسم البياني، شريط التحديد الجماعي، بطاقات المقررات، ملفات الحقيبة):** سلاسل الـ classes مكتوبة داخل الملف نفسه (`assets/js/*.js`) ويقرؤها Tailwind من هناك أيضاً.
- **ملاحظة:** الـ reset الأساسي (`*{margin:0…}`, `[hidden]`, الخط) في `tailwind.src.css` بدل Preflight لتطابق المظهر الأصلي بالضبط.

## هيكل المشروع

```text
al-mubdioun/  (= جذر هذا المستودع)
├── package.json / tailwind.config.js   (أدوات Tailwind — للتطوير فقط)
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
│   │   ├── tailwind.src.css    (مدخل Tailwind: متغيرات الـ Design tokens + Reset + keyframes)
│   │   └── tailwind.css        (الناتج المُترجَم — يُحفظ في المستودع ليعمل file:// بدون build)
│   ├── js/
│   │   ├── app.js              (تفاعلات عامة: القائمة الجانبية، التوب بار، Toast، صفوف الجداول القابلة للنقر)
│   │   ├── popups.js           (فتح/إغلاق كل النوافذ المنبثقة عبر data-popup-open / data-popup-close)
│   │   ├── dashboard.js        (تفاعل الرسم البياني في لوحة السوبر أدمن فقط)
│   │   ├── user-table.js       (بحث/فلاتر/أعمدة/تحديد لقوائم المستخدمين)
│   │   ├── tabs.js             (تبديل التبويبات في صفحات العرض)
│   │   ├── edu-programs.js     (بحث وفلترة قوائم الدبلومات/الزمالات/الشهادات + الحقيبة التدريبية في صفحات العرض)
│   │   ├── roles.js            (بحث جدول الأدوار)
│   │   └── data/
│   │       ├── dashboard.js    (Mock data الخاصة بلوحة السوبر أدمن: ADASH_*)
│   │       └── programs.js     (Mock data الدورات والبرامج)
│   └── images/                 (شعار المنصة وصور أخرى تُضاف لاحقًا)
└── README.md
```

## النوافذ المنبثقة (Popups)

كل نافذة منبثقة (Drawer أو Dialog) هي HTML ثابت موجود داخل الصفحة نفسها، و`assets/js/popups.js` يفتحها ويغلقها فقط:

- الفتح: أي عنصر عليه `data-popup-open="#popupId"`.
- الإغلاق: أي عنصر بداخل النافذة عليه `data-popup-close`، أو الضغط على الخلفية، أو زر Esc.
- لا توجد أي شروط إظهار/إخفاء/تعطيل للحقول، ولا تحقق، ولا حفظ، ولا ملء للبيانات — المحتوى نموذج تصميم ثابت.
- المعالجات متعددة الخطوات (إضافة مستخدم، الدورات، الدبلومات، الزمالات، الشهادات): الخطوات والأزرار «التالي/السابق» تبدّل اللوحة الظاهرة فقط لعرض التصميم، وأزرار الحفظ/النشر في الخطوة الأخيرة تغلق النافذة.
- أزرار «تعديل» تفتح نفس نافذة الإضافة (نموذج ثابت، بلا بيانات محمّلة).

> ملاحظة: الملف الأصلي `Al-Mubdioun_final_v_02 (2) (1).html` تُرك في الجذر دون
> تعديل ليبقى مرجعًا لاستخراج بقية الشاشات في المراحل القادمة.

## الصفحات المُنجزة الآن

- **[admin/dashboard.html](admin/dashboard.html)** — لوحة تحكم السوبر أدمن الكاملة:
  ترحيب + إجراءات سريعة، 4 مؤشرات KPI، رسم بياني تفاعلي (تبديل المؤشر: تسجيلات/
  إيرادات/إتمام، وتبديل الفترة: 7 أيام/30 يوم/12 شهر) مع Tooltip عند التمرير، توزيع
  التسجيلات حسب نوع البرنامج، جدول أحدث التسجيلات، وتنبيهات النظام.
- **[admin/reports.html](admin/reports.html)** — تقارير الإيرادات: 4 مؤشرات KPI،
  قمع المبيعات (Funnel)، وأداء المندوبين.
- **[admin/trainees.html](admin/trainees.html)** — إدارة المتدربين: جدول كامل
  (10 صفوف) مع بحث حي، فلاتر حالة، إظهار/إخفاء أعمدة، تحديد صفوف + شريط إجراءات
  جماعية، إجراءات كل صف (عرض/تعديل/تفعيل-تعطيل حقيقي/إعادة تعيين كلمة مرور/حذف)،
  ونافذة «إضافة متدرب» بثلاث خطوات (معلومات أساسية، معلومات إضافية، مراجعة) — تصميم ثابت يُفتح ويُغلق فقط.

- **[admin/trainers.html](admin/trainers.html)** و **[admin/academic-staff.html](admin/academic-staff.html)** — نفس مكوّن قائمة
  المستخدمين (بحث، فلاتر، أعمدة، تحديد جماعي) ونافذة الإضافة بحقول خاصة بكل دور
  (المدرب: التخصص/الخبرة/نبذة/معتمد — الكادر: القسم/الرتبة/مجال الإشراف).
- **[admin/roles.html](admin/roles.html)** — الأدوار والصلاحيات: جدول الأدوار (السوبر أدمن/الأدوار الأساسية/المخصّصة)،
  بحث، درج إنشاء/تعديل دور بمصفوفة صلاحيات (عرض/إنشاء/تعديل/حذف لكل وحدة + «تحديد الكل»)، وحوار تأكيد الحذف —
  الدرج والحوار تصميم ثابت يُفتح ويُغلق فقط.
- **admin/users/*.html** — صفحات «عرض المستخدم» (15 صفحة: `trainee-1…10`، `trainer-1…3`، `academic-1…2`) بنفس تخطيط
  الـ Prototype: بطاقات إحصاء، 6 تبويبات (نظرة عامة، النشاط، المستندات، الملاحظات، الخط الزمني، الإعدادات) ومحتوى
  «نظرة عامة» مختلف لكل دور. تُفتح من زر «عرض»/اسم المستخدم/الضغط على الصف في القوائم ومن جدول أحدث التسجيلات في اللوحة.

### البرامج التدريبية (مجموعة «البرامج التدريبية» في السايدبار)

- **[admin/course-library.html](admin/course-library.html)** — الدورات التدريبية: جدول 5 دورات، نافذة إنشاء/تعديل بـ 8 خطوات
  (بيانات أساسية مع رفع صورة، تخصصات كوسوم، محتوى الدورة، أسئلة شائعة، تفاصيل، تقسيط، ظهور وصلاحيات، مراجعة ونشر/مسودة)،
  وحوار تأكيد الأرشفة.
- **[admin/diplomas.html](admin/diplomas.html)**، **[fellowships.html](admin/fellowships.html)**، **[professional-certificates.html](admin/professional-certificates.html)** —
  6 دبلومات و6 زمالات و6 شهادات: بحث + فلاتر حالة، نافذة من 6 خطوات (المقررات مجمّعة حسب التخصص وتُختار من مكتبة الدورات،
  للشهادة: دورة تأهيلية واحدة، ثم الحقيبة التدريبية والرسوم والظهور والمراجعة)، وحوار تأكيد النسخ.
- **admin/programs/*.html** — صفحات العرض (5 دورات + 18 برنامجاً): تبويبات النظرة العامة والمقررات/الدورات والدفعات والحقيبة التدريبية
  (بحث وفلترة ورفع/حذف ملفات) والرسوم والإعدادات، وزر «تعديل» يفتح نافذة التعديل الثابتة.
- **غير مشمول بعد:** إنشاء/إدارة **الدفعات التدريبية** (وحدة مستقلة في الـ Prototype بمعالجها وصفحاتها)؛ تبويب الدفعات يعرض القائمة
  فقط وزر «إنشاء دفعة» يُظهر تنبيهاً، وستُبنى مع وحدة الدفعات.

**الإضافة (Create)** تعمل كنافذة منبثقة (Drawer) كما في الـ Prototype — من كل قائمة، ومن زر «إضافة مستخدم» في لوحة السوبر أدمن
(وبعد الحفظ من اللوحة يُحوَّل إلى قائمة المتدربين).

**التجاوب:** كل الصفحات مفحوصة على 390px بلا تمرير أفقي للصفحة (الجداول تتمرّر داخل بطاقتها)، والقائمة الجانبية تتحوّل لقائمة منزلقة على الجوال.

جميع البيانات مأخوذة كما هي من الـ Prototype الأصلي (لا حذف لأي بيانات تجريبية).

### التحقق الذي تم إجراؤه

- ✅ لا وجود لأي `renderPage()` أو `go()` أو SPA Router في أي ملف من المشروع الجديد.
- ✅ كل روابط التنقل في السايدبار والصفحة عبارة عن `<a href="...">` حقيقية.
- ✅ تم فحص توازن الوسوم HTML بالكامل (parser check) ولا يوجد وسم غير مغلق.
- ✅ التحويل إلى Tailwind لم يغيّر أي مظهر: تمت مقارنة الـ computed styles وأبعاد كل عنصر (≈29 ألف عنصر في 48 صفحة) قبل/بعد على 8 عروض شاشة (1400 → 400px)، وفي حالات التفاعل (open/on/active/hover/focus...) — صفر فروقات.
- ✅ تم فحص صحة بنية كل ملفات JavaScript (`node --check`).
- ✅ الصفحة تعمل عند فتحها مباشرة عبر `file://` بدون أي خادم (تم التحقق من أن DOM
  الكامل يُبنى من HTML الثابت نفسه بدون الاعتماد على أي طلب شبكة).

## الصفحات المتبقية (المرحلة القادمة)

القائمة مستخرجة من `ROLES.*.nav` و`BESPOKE` map في الملف الأصلي — لا شيء محذوف.

### admin/* (السوبر أدمن)
✅ منجزة: `dashboard.html`، `reports.html`، `trainees.html`، `trainers.html`، `academic-staff.html`، `roles.html` (+ `users/*` صفحات العرض)
✅ منجزة أيضاً: `course-library.html`، `diplomas.html`، `fellowships.html`، `professional-certificates.html` (+ `programs/*`)
⏳ متبقية — التعلم: `waitlist.html`، `placement-exam.html`،
`course-categories.html`، `virtual-classrooms.html` — الاختبارات: `question-bank.html`،
`exams.html`، `grading.html` — `certificates.html` — الإيرادات: `payments.html`، `coupons.html`
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
والعنوان، ثم يُضاف محتوى الصفحة كـ HTML ثابت (بـ Tailwind utility classes، ثم `npm run build`) + بياناته في `assets/js/data/`.
