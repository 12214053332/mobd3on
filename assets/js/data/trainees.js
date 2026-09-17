/* Mock data for admin/trainees.html — extracted as-is from the original prototype (UM_DATA.um_trainees). */
window.MOCK = window.MOCK || {};

MOCK.TRAINEES = [
  { id:1,  name:'نورة الشهري',   email:'noura.s@email.com',  phone:'+966 50 111 2233', status:'active',    created:'5 صفر 1448',      last:'قبل ساعة',        av:'ن‍ش' },
  { id:2,  name:'محمد العمري',   email:'m.omari@email.com',  phone:'+966 55 222 3344', status:'active',    created:'12 محرم 1448',    last:'أمس',             av:'م‍ع' },
  { id:3,  name:'ريم القحطاني',  email:'reem.q@email.com',   phone:'+966 53 333 4455', status:'suspended', created:'3 محرم 1448',     last:'قبل أسبوع',       av:'ر‍ق' },
  { id:4,  name:'فهد الدوسري',   email:'fahd.d@email.com',   phone:'+966 56 444 5566', status:'active',    created:'28 ذو الحجة',     last:'قبل 3 أيام',      av:'ف‍د' },
  { id:5,  name:'سارة المطيري',  email:'sara.m@email.com',   phone:'+966 50 555 6677', status:'pending',   created:'25 ذو الحجة',     last:'لم يسجّل بعد',    av:'س‍م' },
  { id:6,  name:'سارة أحمد',     email:'sara.ahmed@email.com',phone:'+966 50 612 3401',status:'active',    created:'16 Sep 2026',     last:'اليوم',           av:'س‍أ' },
  { id:7,  name:'خالد منصور',    email:'k.mansour@email.com',phone:'+966 55 713 2290', status:'active',    created:'16 Sep 2026',     last:'اليوم',           av:'خ‍م' },
  { id:8,  name:'ريم العتيبي',   email:'r.otaibi@email.com', phone:'+966 53 810 4452', status:'active',    created:'15 Sep 2026',     last:'أمس',             av:'ر‍ع' },
  { id:9,  name:'عبدالله حسن',   email:'a.hassan@email.com', phone:'+966 56 904 1187', status:'active',    created:'15 Sep 2026',     last:'أمس',             av:'ع‍ح' },
  { id:10, name:'نوف الشهري',    email:'nouf.s@email.com',   phone:'+966 50 318 7765', status:'active',    created:'14 Sep 2026',     last:'قبل يومين',       av:'ن‍ش' }
];

MOCK.STATUS_LABEL = {
  active:    ['نشط',            'ok'],
  suspended: ['معطّل',          'archived'],
  pending:   ['بانتظار التفعيل', 'warn']
};
