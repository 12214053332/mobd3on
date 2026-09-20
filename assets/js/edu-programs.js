/* Professional programs (diplomas / fellowships / certificates): list search + status filter and the
   program view page (curriculum + training-kit tabs, batch search). All screens are real HTML; this
   file only reacts to them. Create / edit / duplicate popups are static markup driven by popups.js. */
(function ($) {
  'use strict';
  if (!window.MOCK || !document.body.getAttribute('data-edu-type')) return;

  var TYPE = document.body.getAttribute('data-edu-type');
  var PATHS = MOCK.EDU_PATHS, COURSES = MOCK.COURSES;
  var isCert = TYPE === 'cert';
  var INSTALL = { tabby: 'Tabby', tamara: 'Tamara' };
  var ROLES = { admin: 'السوبر أدمن', academic: 'الكادر الأكاديمي', trainer: 'المدرب' };
  var STATUS = { draft: ['مسودة', 'neutral'], active: ['نشطة', 'ok'], archived: ['مؤرشفة', 'archived'] };
  var KIND_LABEL = { pdf: 'PDF', doc: 'مستند', video: 'فيديو' };


  function pathById(id) { for (var i = 0; i < PATHS.length; i++) if (PATHS[i].id === id) return PATHS[i]; return null; }
  function courseById(id) { for (var i = 0; i < COURSES.length; i++) if (COURSES[i].id === id) return COURSES[i]; return null; }
  function svg(paths, s) { return '<svg width="' + (s || 15) + '" height="' + (s || 15) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + paths + '</svg>'; }
  var BOOK = '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5v13z"/><path d="M20 17v5H6.5a2.5 2.5 0 0 1 0-5"/>';
  /* Tailwind utility strings for the markup this file builds (kept in one place) */
  var PILL = 'pill py-[3px] px-3 rounded-full text-[12px] font-bold whitespace-nowrap inline-block ';
  var PILL_VARIANT = { ok: 'bg-success-bg text-success-700', neutral: 'border border-edge bg-surface-hover text-ink-2', archived: 'border border-edge bg-surface-hover text-ink-3' };
  var CARET = '<svg class="mod-caret ms-1 text-ink-3 [transition:transform_.15s] [.mod-card.open_&]:[transform:rotate(180deg)]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg>';
  function pool() { return MOCK.POOL; }
  function names(k) { return (k && k.responsibleNames) ? k.responsibleNames.filter(Boolean) : []; }
  function statusPill(s) { var st = STATUS[s] || ['—', 'neutral']; return $('<span></span>').addClass(PILL + PILL_VARIANT[st[1]]).text(st[0]); }

  /* ================= list page ================= */
  var filter = 'all';
  function applyFilters() {
    var q = $('#eduSearch').val().trim(), shown = 0, total = $('#eduTbody > tr').length;
    $('#eduTbody > tr').each(function () {
      var p = pathById($(this).data('id'));
      var ok = (filter === 'all' || $(this).attr('data-status') === filter) &&
        (!q || (p && (p.name.indexOf(q) > -1 || p.pathId.indexOf(q) > -1 || (p.specialty || '').indexOf(q) > -1)));
      $(this).toggle(ok); if (ok) shown++;
    });
    $('#tfootShown').text(shown); $('#tfootTotal').text(total);
    $('#eduEmpty').prop('hidden', shown > 0); $('#eduTableCard').prop('hidden', shown === 0);
  }

  /* ================= view page ================= */
  function kindOf(name) {
    var e = String(name || '').split('.').pop().toLowerCase();
    if (e === 'pdf') return 'pdf';
    if (['mp4', 'mov', 'avi', 'mkv', 'webm'].indexOf(e) > -1) return 'video';
    return 'doc';
  }
  function infoRow(k, v, mono) { var $r = $('<div class="info-row py-[9px] px-0 gap-3 border-b border-b-guide flex text-[14px] d768:gap-0.5 d768:flex-col last:border-b-0"><span class="k text-ink-3 w-[170px] shrink-0 d768:w-auto d768:text-[12px]"></span><span class="v font-medium min-w-0 [overflow-wrap:anywhere] [&.mono]:text-ink-2 [.info-row_&:empty]:before:content-[\'—\'] [.info-row_&:empty]:before:text-ink-3"></span></div>'); $r.find('.k').text(k); $r.find('.v').text(v); if (mono) $r.find('.v').addClass('mono'); return $r; }
  function buildModCard(m, i) {
    var c = courseById(m.courseLibId), $c = $('<div class="mod-card mb-3 overflow-hidden border border-guide rounded-lg bg-surface' + (i ? ' mt-4' : '') + '"></div>');
    var $h = $('<div class="set-card-h py-3.5 px-5 gap-2.5 border-b border-b-guide text-[15px] font-bold flex items-center cursor-pointer"><span class="rounded-sm w-[30px] h-[30px] bg-surface-hover grid place-items-center shrink-0">' + svg(BOOK) + '</span><div class="flex-1 min-w-0"><div class="mc-name font-bold"></div><div class="mc-sub mt-0.5 text-[12px] text-ink-3 font-normal"></div></div>' + CARET + '</div>');
    $h.find('.mc-name').text(m.name || (c ? c.name : '—'));
    $h.find('.mc-sub').text((!isCert && m.specialization ? m.specialization : (c ? c.type : '—')) + (c ? ' · ' + c.hours + ' ساعة' : ''));
    var $b = $('<div class="set-card-b py-4 px-5" hidden></div>');
    if (!isCert) $b.append(infoRow('التخصص', m.specialization));
    $b.append(infoRow('الدورة التدريبية', c ? c.name : '—'));
    if (c) { $b.append(infoRow('معرف الدورة', c.courseId, true), infoRow('عدد الأيام', c.days), infoRow('عدد الساعات', c.hours), infoRow('طريقة التقديم', c.type)); if ((c.specializations || []).length) $b.append(infoRow('تخصصات الدورة', c.specializations.join('، '))); }
    return $c.append($h, $b);
  }
  var kitQ = '', kitKind = 'all';
  function renderKitTab(p) {
    var files = (p.trainingKit && p.trainingKit.files) || [];
    var cnt = function (k) { return files.filter(function (f) { return (f.kind || kindOf(f.name)) === k; }).length; };
    $('.kit-kind').each(function () {
      var k = $(this).data('kind'), n = k === 'all' ? files.length : cnt(k);
      $(this).find('.n').text(n); $(this).toggleClass('solid', kitKind === k).toggleClass('line', kitKind !== k);
    });
    var $l = $('#kitTabList').empty(), shown = 0;
    files.forEach(function (f, i) {
      var kd = f.kind || kindOf(f.name);
      if (kitKind !== 'all' && kd !== kitKind) return;
      if (kitQ && f.name.indexOf(kitQ) < 0 && String(f.uploadedBy).indexOf(kitQ) < 0) return;
      shown++;
      var $r = $('<div class="row py-[13px] px-6 gap-4 border-b border-b-guide flex items-center last:border-b-0 hover:bg-surface-hover"><span class="row-avatar rounded-full w-[38px] h-[38px] shrink-0 grid place-items-center text-[11px] font-bold bg-primary-50 text-primary-700 [&.g]:bg-gold-50 [&.g]:text-gold-600"></span><div class="flex-1 min-w-0"><div class="row-title text-[13px] font-bold leading-[1.5]"></div><div class="row-sub text-[13px] text-ink-2 leading-[1.5]"></div></div><button type="button" class="line py-0 px-4 rounded-md inline-flex items-center justify-center h-9 text-[13px] font-bold whitespace-nowrap box-border [&.solid]:bg-primary-700 [&.solid]:text-white [&.solid:hover]:bg-primary-600 [&.line]:border [&.line]:border-edge [&.line]:bg-surface [&.line]:text-ink-2 [&.line:hover]:border-primary-500 [&.line:hover]:text-primary-700 disabled:opacity-40 disabled:cursor-not-allowed" data-toast="جارٍ تنزيل الملف">تنزيل</button><button type="button" class="rounded-md w-[38px] h-[38px] grid place-items-center text-error-700 hover:bg-surface-hover disabled:opacity-30 disabled:cursor-not-allowed" title="حذف" data-kit-del>✕</button></div>');
      $r.attr('data-i', i).find('.row-avatar').toggleClass('g', kd === 'video').text(kd === 'pdf' ? 'PDF' : kd === 'video' ? '▶' : 'DOC');
      $r.find('.row-title').text(f.name); $r.find('.row-sub').text(KIND_LABEL[kd] + ' · رفعه ' + (f.uploadedBy || '—') + ' · ' + (f.date || '—'));
      $l.append($r);
    });
    $('#kitTabEmpty').prop('hidden', shown > 0).text(files.length ? 'لا ملفات مطابقة للبحث أو التصنيف.' : 'لا ملفات في الحقيبة التدريبية بعد — استخدم «إضافة ملف» لرفع أول ملف.');
  }
  function renderView(p) {
    var map = {
      name: p.name, generalDesc: p.generalDesc, objectivesText: p.objectivesText, specialty: p.specialty, duration: p.duration,
      studyMode: p.studyMode, hours: p.hours, examMode: p.examMode, updated: p.updated, modCount: (p.modules || []).length,
      price: (p.fees && p.fees.price ? p.fees.price : '') + ' ر.س',
      installments: ((p.fees && p.fees.installments) || []).map(function (k) { return INSTALL[k]; }).join('، ') || 'لا يوجد',
      webVisible: p.settings.webVisible ? 'مفعّل' : 'موقوف', editRoles: (p.settings.editRoles || []).map(function (k) { return ROLES[k]; }).join('، ')
    };
    Object.keys(map).forEach(function (k) { $('[data-bind="' + k + '"]').text(map[k]); });
    $('[data-bind-status]').empty().append(statusPill(p.status));
    document.title = p.name + ' — مركز المبدعون';
    var $cur = $('#ewCurr').empty();
    if (!(p.modules || []).length) $cur.append('<div class="py-16 px-8 gap-3.5 border border-guide rounded-lg bg-surface shadow-card text-center flex flex-col items-center"><p class="text-[14px] text-ink-2 max-w-[420px] leading-[1.7]">لا ' + (isCert ? 'دورات' : 'مقررات') + ' بعد.</p></div>');
    (p.modules || []).forEach(function (m, i) { $cur.append(buildModCard(m, i)); });
    renderKitTab(p);
  }

  /* ================= bindings ================= */
  $(function () {
    /* list page */
    $('#eduSearch').on('input', applyFilters);
    $('.toolbar .chip[data-filter]').on('click', function () {
      $('.toolbar .chip[data-filter]').removeClass('on'); $(this).addClass('on'); filter = $(this).data('filter'); applyFilters();
    });
    $('#exportBtn').on('click', function () { App.toast('تم تجهيز ملف التصدير', 'سيبدأ التنزيل تلقائياً'); });

    /* view page */
    var vid = $('body').data('edu-id');
    if (vid) {
      $(document).on('click', '.mod-card .set-card-h', function () { var $c = $(this).closest('.mod-card'); $c.toggleClass('open'); $c.find('.set-card-b').prop('hidden', !$c.hasClass('open')); });
      $('#kitQ').on('input', function () { kitQ = $(this).val().trim(); renderKitTab(pathById(vid)); });
      $('.kit-kind').on('click', function () { kitKind = $(this).data('kind'); renderKitTab(pathById(vid)); });
      $('#kitTabAdd').on('click', function () {
        var p = pathById(vid); p.trainingKit = p.trainingKit || { files: [] }; p.trainingKit.files = p.trainingKit.files || [];
        var by = names(p.trainingKit)[0] || (pool()[0] || {}).name || '—';
        p.trainingKit.files.push({ name: 'حقيبة-تدريبية-' + (p.trainingKit.files.length + 1) + '.pdf', kind: 'pdf', uploadedBy: by, date: 'اليوم' });
        p.trainingKit.status = 'ready'; p.updated = 'الآن'; renderView(p); App.toast('تم رفع الملف بنجاح');
      });
      $('#kitTabList').on('click', '[data-kit-del]', function () {
        var p = pathById(vid); p.trainingKit.files.splice(+$(this).closest('.row').attr('data-i'), 1); p.updated = 'الآن'; renderView(p); App.toast('تم حذف الملف');
      });
      $('#batchQ').on('input', function () {
        var q = $(this).val().trim(), n = 0;
        $('#batchTbody tr').each(function () { var ok = !q || $(this).text().indexOf(q) > -1; $(this).toggle(ok); if (ok) n++; });
        $('#batchNoMatch').prop('hidden', n > 0);
      });
    }
    if ($('#eduTbody').length) applyFilters();
  });
})(jQuery);
