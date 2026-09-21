أرفقت لك ملف HTML باسم:

`Al-Mubdioun_final_v_02 (2) (1)(1).html`

أريد منك تحويل هذا الـ Prototype بالكامل إلى مشروع Frontend حقيقي مكوّن من **صفحات HTML مستقلة**، وليس SPA وليس نظام يعتمد على `renderPage()`.

## الهدف الرئيسي

تحويل الملف الحالي إلى مجموعة صفحات HTML منفصلة، بحيث تكون كل شاشة / صفحة فعلية عبارة عن ملف `.html` مستقل يمكن فتحه مباشرة في المتصفح.

مثال:

```text
/index.html
/login.html

/admin/
    dashboard.html
    trainees.html
    trainers.html
    academic.html
    roles.html
    programs.html
    courses.html
    exams.html
    certificates.html
    reports.html
    settings.html

/trainee/
    dashboard.html
    programs.html
    sessions.html
    exams.html
    certificates.html
    profile.html

/crm/
    leads.html
    pipeline.html
    deals.html
    customers.html
    organizations.html
    tasks.html
    calls.html
    meetings.html
    activities.html
    reports.html

/website/
    pages.html
    blog.html
    media.html
    forms.html
    navigation.html
    policies.html
    settings.html
```

هذه مجرد أمثلة. **استخرج الهيكل الحقيقي وعدد الصفحات من الملف المرفق نفسه** ولا تحذف أي شاشة موجودة فيه.

---

# 1. ممنوع استخدام SPA

لا أريد الحل بهذا الشكل:

```javascript
renderPage(...)
```

ولا أريد:

```javascript
document.getElementById('app').innerHTML = ...
```

ولا أريد Router داخلي يعتمد على:

```javascript
history.pushState()
```

ولا أريد أن تكون جميع الشاشات داخل HTML واحد ويتم إظهار وإخفاء العناصر.

كل صفحة يجب أن تكون HTML مستقلة.

مثال:

```html
<a href="trainees.html">المتدربون</a>
```

وليس:

```html
<button onclick="renderPage('admin','trainees')">
```

---

# 2. استخدم HTML حقيقي لكل صفحة

كل شاشة يجب أن تحتوي على HTML فعلي داخل الملف نفسه.

مثال:

```html
<!-- trainees.html -->

<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
    ...
</head>

<body>

    <aside class="sidebar">
        ...
    </aside>

    <main class="main">
        ...
        <section class="page">
            <h1>المتدربون</h1>

            <table>
                ...
            </table>
        </section>
    </main>

</body>
</html>
```

لا أريد توليد الـ HTML الخاص بالصفحة بواسطة JavaScript.

---

# 3. فصل CSS

انقل الـ CSS الموجود حاليًا داخل:

```html
<style>
...
</style>
```

إلى ملفات CSS مستقلة.

استخدم هيكلًا مثل:

```text
/assets/
    css/
        variables.css
        base.css
        layout.css
        components.css
        forms.css
        tables.css
        dashboard.css
        responsive.css
```

وإذا كان تقسيم CSS بهذا الشكل غير عملي، يمكن استخدام:

```text
/assets/css/app.css
```

لكن يجب أن يكون CSS خارجي وليس داخل صفحات HTML.

---

# 4. JavaScript باستخدام jQuery

استخدم **jQuery** للتفاعلات فقط.

أضف:

```html
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
```

ويكون JavaScript مسؤولًا عن:

* فتح وإغلاق القوائم
* Sidebar collapse
* Dropdowns
* Tabs
* Modals
* Drawers
* Toasts
* Checkboxes
* Toggles
* البحث داخل الجداول
* الفلاتر
* Pagination
* Wizard navigation
* Accordion
* Tree view
* Role selector
* أي تفاعل موجود في الـ Prototype

لكن:

**JavaScript لا يجب أن يكون مسؤولًا عن إنشاء الصفحة نفسها.**

أي أن هذا ممنوع:

```javascript
function traineesPage() {
    return `
       <div>...</div>
    `;
}
```

وهذا أيضًا ممنوع:

```javascript
$('#app').html(...)
```

لغرض بناء الشاشة.

---

# 5. Navigation

استبدل جميع عمليات:

```javascript
go(...)
renderPage(...)
```

بروابط HTML حقيقية.

مثال:

بدل:

```html
<button onclick="go('admin','trainees')">
    المتدربون
</button>
```

استخدم:

```html
<a href="trainees.html" class="nav-item">
    المتدربون
</a>
```

ويجب أن تعمل Navigation من خلال ملفات HTML فعلية.

---

# 6. Shared Layout

الـ Sidebar والـ Topbar موجودان في معظم الصفحات.

أريد الحفاظ على نفس التصميم الموجود في الملف الحالي.

يمكن تكرار HTML الخاص بالـ Sidebar وTopbar في الصفحات إذا كان ذلك ضروريًا.

لكن **لا تستخدم Server Side Rendering**.

ولا تستخدم:

```text
PHP
Laravel Blade
Odoo QWeb
React
Vue
Angular
Next.js
```

المطلوب:

**HTML + CSS + jQuery فقط.**

إذا احتجت إلى تقليل التكرار في Sidebar/Topbar، يمكن استخدام jQuery لتحميل component HTML خارجي مثل:

```text
/components/sidebar.html
/components/topbar.html
```

بواسطة:

```javascript
$('.sidebar-container').load('../components/sidebar.html');
```

لكن يجب أن تكون الصفحات نفسها HTML مستقلة.

---

# 7. لا تستخدم renderPage

احذف أو أعد هيكلة جميع الأكواد من نوع:

```javascript
renderPage()
```

وأي دوال تقوم ببناء الصفحات مثل:

```javascript
adminPage()
traineePage()
genericPage()
pageHead()
```

إذا كانت وظيفتها إنشاء HTML للشاشات.

يمكن الاحتفاظ بالدوال التي تحتوي على Business/UI behavior إذا كانت ضرورية، ولكن لا تستخدمها لبناء DOM الكامل للصفحات.

---

# 8. البيانات التجريبية

الملف الحالي يحتوي على بيانات Mock كثيرة.

لا تحذف البيانات.

استخدمها كبيانات تجريبية للواجهة.

ولكن افصلها في ملفات JavaScript مثل:

```text
/assets/js/data/
    users.js
    trainees.js
    trainers.js
    programs.js
    courses.js
    exams.js
    certificates.js
    crm.js
```

وإذا كان فصل البيانات سيعقد المشروع بشكل غير ضروري، يمكن استخدام:

```text
/assets/js/mock-data.js
```

المهم أن الـ HTML نفسه يحتوي على structure الصفحة، وليس أن يتم توليد الصفحة بالكامل من البيانات.

---

# 9. Forms

جميع النماذج يجب أن تكون HTML حقيقية:

```html
<form id="traineeForm">

    <div class="field">
        <label>اسم المتدرب</label>
        <input type="text" class="inp">
    </div>

    ...
    
    <button type="submit" class="btn btn-primary">
        حفظ
    </button>

</form>
```

ويتم استخدام jQuery فقط للتفاعل والتحقق:

```javascript
$('#traineeForm').on('submit', function(e) {
    e.preventDefault();

    // validation
    // ajax/mock action
    // toast
});
```

---

# 10. الحفاظ على التصميم

مهم جدًا:

**لا تعيد تصميم الواجهة.**

حافظ على:

* الألوان
* الخطوط
* RTL
* المسافات
* Border radius
* Buttons
* Cards
* Tables
* Sidebar
* Topbar
* Modals
* Drawers
* Tabs
* Badges
* Forms
* Responsive behavior

كما هي في الملف المرفق قدر الإمكان.

الملف الحالي يستخدم Design System واضحًا يحتوي على متغيرات للألوان والمسافات والـ radius والـ shadows، لذلك أريد الاحتفاظ بها وإعادة استخدامها بدل إنشاء Design System جديد.

---

# 11. Responsive

يجب أن تعمل الصفحات على:

* Desktop
* Tablet
* Mobile

مع الحفاظ على RTL.

---

# 12. Icons

حافظ على الأيقونات الموجودة حاليًا.

إذا كانت الأيقونات مبنية باستخدام SVG، احتفظ بها.

لا تستبدلها بأيقونات مختلفة بدون سبب.

---

# 13. Interactive Components

يجب تحويل جميع الـ UI interactions الموجودة حاليًا إلى jQuery.

خصوصًا:

### Sidebar

* Expand / Collapse
* Active menu
* Nested menus

### Dropdown

* Open / Close
* Click outside

### Modal

* Open
* Close
* Confirm / Cancel

### Drawer

* Open
* Close
* Full screen

### Tabs

* تغيير التبويب

### Filters

* Search
* Status filters
* Column visibility

### Tables

* Select row
* Select all
* Bulk actions
* Pagination
* Search

### Forms

* Validation
* Error messages
* Toggles
* Radio cards
* Custom selects
* File upload UI

### Wizard

* Next
* Previous
* Step state

### Tree

* Expand
* Collapse

### Toast

* Show
* Hide
* Auto dismiss

كل ذلك باستخدام jQuery.

---

# 14. لا تحذف أي Functionality

قبل البدء:

1. اقرأ الملف بالكامل.
2. استخرج جميع الـ pages/screens.
3. استخرج جميع الـ navigation items.
4. استخرج جميع الـ dialogs.
5. استخرج جميع drawers.
6. استخرج جميع forms.
7. استخرج جميع tables.
8. استخرج جميع tabs.
9. استخرج جميع interactive components.
10. استخرج جميع mock data.

بعد ذلك قم بتحويلها إلى صفحات مستقلة.

---

# 15. الصفحة الحالية لا يجب أن تعتمد على JavaScript لإنشائها

القاعدة الأساسية:

```text
HTML = Structure
CSS = Design
jQuery = Interaction
```

وليس:

```text
JavaScript = Application + HTML Generator + Router
```

---

# 16. المطلوب النهائي

أريد منك إنشاء مشروع كامل بهذا الشكل تقريبًا:

```text
al-mubdioun/
│
├── index.html
│
├── admin/
│   ├── dashboard.html
│   ├── trainees.html
│   ├── trainers.html
│   ├── academic.html
│   ├── roles.html
│   ├── programs.html
│   ├── courses.html
│   ├── exams.html
│   ├── certificates.html
│   ├── reports.html
│   └── settings.html
│
├── trainee/
│   ├── dashboard.html
│   ├── programs.html
│   ├── sessions.html
│   ├── exams.html
│   ├── certificates.html
│   └── profile.html
│
├── crm/
│   ├── leads.html
│   ├── pipeline.html
│   ├── deals.html
│   ├── customers.html
│   ├── organizations.html
│   ├── tasks.html
│   ├── calls.html
│   ├── meetings.html
│   ├── activities.html
│   └── reports.html
│
├── website/
│   ├── pages.html
│   ├── blog.html
│   ├── media.html
│   ├── forms.html
│   ├── navigation.html
│   ├── policies.html
│   └── settings.html
│
├── components/
│   ├── sidebar.html
│   ├── topbar.html
│   └── ...
│
├── assets/
│   ├── css/
│   │   ├── app.css
│   │   └── ...
│   │
│   ├── js/
│   │   ├── app.js
│   │   ├── ui.js
│   │   ├── data.js
│   │   └── ...
│   │
│   └── images/
│
└── README.md
```

**لكن لا تلتزم بهذا الهيكل حرفيًا إذا كان محتوى الملف يتطلب هيكلًا مختلفًا.**

استخرج الهيكل الحقيقي من الملف.

---

# 17. مهم جدًا — روابط الملفات

بما أن الصفحات ستعمل كـ static HTML، استخدم Relative URLs صحيحة.

مثال:

من:

```text
/admin/trainees.html
```

إلى:

```text
/assets/css/app.css
```

استخدم:

```html
<link rel="stylesheet" href="../assets/css/app.css">
```

ومن:

```text
/trainee/dashboard.html
```

استخدم:

```html
<a href="../admin/trainees.html">
```

تأكد من أن جميع الروابط تعمل عند فتح الملفات مباشرة.

---

# 18. النتيجة المطلوبة

لا أريد منك شرح كيفية عمل المشروع فقط.

أريد **إنشاء الملفات فعليًا**.

وفي النهاية أعطني:

1. جميع ملفات HTML.
2. جميع ملفات CSS.
3. جميع ملفات JS.
4. جميع الـ components.
5. جميع الـ mock data.
6. README يوضح هيكل المشروع.
7. قائمة بجميع الصفحات التي تم تحويلها من الـ Prototype.
8. التأكد من عدم وجود `renderPage()` أو SPA router.
9. التأكد أن كل صفحة يمكن فتحها مباشرة كـ HTML.
10. التأكد أن Navigation بين الصفحات يعمل باستخدام روابط HTML حقيقية.

## أهم شرط

**لا تختصر المشروع ولا تستبدل الشاشات بـ placeholders.**

أريد تحويل الـ Prototype الموجود في الملف إلى Static HTML Prototype كامل يحافظ على جميع الشاشات والمحتوى والتفاعلات الموجودة حاليًا.

ابدأ أولًا بتحليل الملف بالكامل واستخراج قائمة الصفحات والمكونات، ثم نفّذ التحويل على مراحل إذا كان حجم المشروع كبيرًا.


---

# 19. Tailwind CSS (يسري على كل ما سبق بخصوص ملفات CSS)

التنسيق في هذا المشروع يتم بـ **Tailwind CSS**، ويحل محل تقسيم CSS إلى ملفات مكونات في القسم 3:

* التنسيق كله **utility classes** داخل الـ HTML، ولا تُنشأ ملفات CSS مخصصة للمكونات.
* الصفحات تربط ملفًا واحدًا فقط: `assets/css/tailwind.css` (ناتج مُترجَم ومحفوظ في المستودع ليعمل `file://` بدون أدوات).
* الـ Design tokens (الألوان، المسافات، الـ radius، الظلال) معرّفة في `assets/css/tailwind.src.css` ومربوطة في `tailwind.config.js` (`bg-primary-700`, `text-ink-2`, `border-guide`, `rounded-md`, `shadow-card`).
* الصفحات تحمّل أيضًا Tailwind CDN (`https://cdn.tailwindcss.com`) مع `tailwind.config.js` المشترك، فأي class جديد يعمل مباشرة في المتصفح؛ ومع ذلك نفّذ `npm run build` (بدون `--minify`) بعد إضافة classes جديدة ليبقى `tailwind.css` محدّثًا. أي صفحة جديدة تضيف سطري `<script>` الخاصين بالـ CDN والـ config بعد رابط `tailwind.css`.
* breakpoints مخصصة: `d1200 d1100 d1024 d820 d768 d560 d480` (حتى هذا العرض) و`u1025` (من هذا العرض).
* الحالات التي يبدّلها jQuery تُكتب كـ variants مثل `[&.open]:visible`، وسلاسل الـ classes داخل ملفات JS التي تبني عناصر تُكتب utilities أيضًا.
* لا تغيير في التصميم: أي صفحة جديدة تحافظ على نفس الألوان والمسافات والسلوك الحالي.
