/* Mock data for admin/dashboard.html — extracted as-is from the original prototype. */
window.MOCK = window.MOCK || {};

MOCK.ADASH_METRICS = {
  reg:  { t: 'التسجيلات الجديدة', fmt: v => Math.round(v).toLocaleString('en-US'), sum: true },
  rev:  { t: 'الإيرادات',         fmt: v => (v >= 100 ? Math.round(v) : v.toFixed(1)) + 'K SAR', sum: true },
  comp: { t: 'معدل الإتمام',      fmt: v => v.toFixed(1) + '%', sum: false }
};

MOCK.ADASH_RANGES = [['7d', '7 أيام'], ['30d', '30 يوماً'], ['12m', '12 شهراً']];

MOCK.adashSeries = function (range, metric) {
  if (range === '12m') {
    const labels = ['Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep'];
    const d = {
      reg:  [820,910,870,1040,990,1120,1080,1190,1260,1210,1330,1395],
      rev:  [248,262,255,290,284,318,305,342,361,352,374,420],
      comp: [84.1,84.6,85.0,85.9,86.2,86.8,87.5,88.1,88.9,89.4,89.2,87.4]
    };
    return { labels, values: d[metric], every: 1, span: ['Oct 2025', 'Sep 2026'] };
  }
  if (range === '7d') {
    const labels = ['10 Sep','11 Sep','12 Sep','13 Sep','14 Sep','15 Sep','16 Sep'];
    const d = {
      reg:  [38,44,41,52,47,58,61],
      rev:  [11.2,13.8,12.4,16.1,14.7,17.9,19.3],
      comp: [87.9,87.8,87.6,87.7,87.5,87.4,87.4]
    };
    return { labels, values: d[metric], every: 1, span: ['10 Sep 2026', '16 Sep 2026'] };
  }
  const labels = [], values = [];
  const start = new Date(2026, 7, 18);
  for (let i = 0; i < 30; i++) {
    const dt = new Date(start); dt.setDate(start.getDate() + i);
    labels.push(dt.getDate() + ' ' + dt.toLocaleDateString('en-US', { month: 'short' }));
    const w = Math.sin(i * 0.9) * 0.5 + Math.sin(i * 0.23);
    values.push(
      metric === 'reg' ? Math.round(40 + i * 0.55 + w * 6) :
      metric === 'rev' ? +(11 + i * 0.22 + w * 1.6).toFixed(1) :
      +(88.6 - i * 0.04 + w * 0.25).toFixed(1)
    );
  }
  return { labels, values, every: 5, span: ['18 Aug 2026', '16 Sep 2026'] };
};

MOCK.ADASH_MIX = [
  ['الدورات التدريبية', 46, 'course-library.html'],
  ['الدبلومات المهنية', 28, 'diplomas.html'],
  ['الزمالات المهنية', 14, 'fellowships.html'],
  ['الشهادات الاحترافية', 12, 'professional-certificates.html']
];

MOCK.ADASH_REGS = [
  { id:6,  name:'سارة أحمد',     av:'س‍أ', email:'sara.ahmed@email.com',  prog:'دبلوم الأمن السيبراني',              date:'16 Sep 2026', time:'10:24 AM', st:'new' },
  { id:7,  name:'خالد منصور',    av:'خ‍م', email:'k.mansour@email.com',   prog:'تحليل البيانات',                     date:'16 Sep 2026', time:'09:05 AM', st:'new', g:1 },
  { id:8,  name:'ريم العتيبي',   av:'ر‍ع', email:'r.otaibi@email.com',    prog:'بكالوريوس علوم الحاسب',              date:'15 Sep 2026', time:'06:40 PM', st:'new' },
  { id:9,  name:'عبدالله حسن',   av:'ع‍ح', email:'a.hassan@email.com',    prog:'دبلوم الذكاء الاصطناعي التطبيقي',    date:'15 Sep 2026', time:'11:12 AM', st:'active', g:1 },
  { id:10, name:'نوف الشهري',    av:'ن‍ش', email:'nouf.s@email.com',      prog:'إدارة المشاريع الاحترافية',          date:'14 Sep 2026', time:'03:30 PM', st:'active' }
];

MOCK.ADASH_ST = { new: ['جديد', 'new'], active: ['مُفعّل', 'ok'] };

MOCK.ADASH_ALERTS = [
  { tone:'err',  icon:'ic-screen', t:'فشل مزامنة Zoom',                 s:'3 جلسات لم تتم مزامنتها', at:'قبل 10 دقائق' },
  { tone:'warn', icon:'ic-shield', t:'شهادة SSL تنتهي خلال 14 يوماً',   s:'جدولة التجديد',            at:'أمس' },
  { tone:'info', icon:'ic-check',  t:'اكتملت النسخة الاحتياطية',        s:'3:00 AM',                  at:'أمس' }
];
