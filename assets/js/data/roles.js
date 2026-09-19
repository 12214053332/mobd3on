/* Mock data for admin/roles.html — extracted from the prototype (ROLES_DEF / PERM_MODULES). */
window.MOCK = window.MOCK || {};

MOCK.PERM_MODULES = ['dash', 'courses', 'paths', 'placement', 'coursecats', 'vclasses', 'exams', 'certs', 'users', 'crm', 'payments'];
MOCK.ROLE_MOD_ACTS = { dash: ['view'], payments: ['view', 'edit'] };
MOCK.modActs = function (mod) { return MOCK.ROLE_MOD_ACTS[mod] || ['view', 'create', 'edit', 'delete']; };

MOCK.permAll = function (v) {
  var o = {};
  MOCK.PERM_MODULES.forEach(function (m) {
    o[m] = {};
    ['view', 'create', 'edit', 'delete', 'export', 'approve', 'publish', 'manage'].forEach(function (a) { o[m][a] = v; });
  });
  return o;
};
MOCK.permFor = function (mods) {
  var o = MOCK.permAll(false);
  Object.keys(mods).forEach(function (m) { mods[m].forEach(function (a) { o[m][a] = true; }); });
  return o;
};
MOCK.permCount = function (perms) {
  return MOCK.PERM_MODULES.reduce(function (n, m) {
    return n + MOCK.modActs(m).filter(function (a) { return perms[m] && perms[m][a]; }).length;
  }, 0);
};

MOCK.ROLES_DEF = [
  { id: 'superadmin', name: 'السوبر أدمن', desc: 'وصول كامل لكل الوحدات', users: 2, system: true, status: 'active', updated: 'اليوم', perms: MOCK.permAll(true) },
  { id: 'trainee', name: 'المتدربون', desc: 'الالتحاق بالبرامج والدورات ومتابعة التقدم الدراسي', users: 12847, core: true, status: 'active', updated: 'اليوم',
    perms: MOCK.permFor({ dash: ['view'], courses: ['view'], exams: ['view'], certs: ['view'] }) },
  { id: 'trainer', name: 'المدربون', desc: 'تقديم الدورات والجلسات المباشرة', users: 89, core: true, status: 'active', updated: 'منذ أسبوع',
    perms: MOCK.permFor({ dash: ['view'], courses: ['view', 'edit'], vclasses: ['view', 'create', 'edit'], exams: ['view', 'create', 'edit'], certs: ['view'] }) },
  { id: 'academic', name: 'الكادر الأكاديمي', desc: 'الإشراف ومراجعة الجودة والاعتماد', users: 34, core: true, status: 'active', updated: 'منذ 3 أيام',
    perms: MOCK.permFor({ dash: ['view'], courses: ['view', 'edit'], exams: ['view', 'edit'], coursecats: ['view'], certs: ['view'] }) },
  { id: 'sales_mgr', name: 'مدير المبيعات', desc: 'إدارة المبيعات والعملاء والتقارير', users: 8, status: 'active', updated: 'اليوم',
    perms: MOCK.permFor({ dash: ['view'], crm: ['view', 'create', 'edit', 'delete', 'export', 'approve', 'manage'], payments: ['view', 'edit'] }) },
  { id: 'sales_rep', name: 'مندوب المبيعات', desc: 'متابعة العملاء المحتملين', users: 8, status: 'active', updated: 'أمس',
    perms: MOCK.permFor({ dash: ['view'], crm: ['view', 'create', 'edit'] }) }
];
