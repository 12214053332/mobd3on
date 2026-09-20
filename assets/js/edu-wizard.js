/* Professional programs (diplomas / fellowships / certificates): list filters, the 6-step create/edit
   wizard, duplicate dialog, and the program view page (curriculum + training-kit tabs, live refresh
   after an edit). All screens are real HTML; this file only reacts to them. */
(function ($) {
  'use strict';
  if (!window.MOCK || !$('#ewDrawer').length) return;

  var TYPE = document.body.getAttribute('data-edu-type');
  var PATHS = MOCK.EDU_PATHS, COURSES = MOCK.COURSES;
  var isCert = TYPE === 'cert';
  var STEPS = 6;
  var LABEL = { diploma: 'دبلوم مهني', fellowship: 'زمالة مهنية', cert: 'شهادة احترافية' };
  var PREFIX = { diploma: 'DIP', fellowship: 'FEL', cert: 'CERT' };
  var INSTALL = { tabby: 'Tabby', tamara: 'Tamara' };
  var ROLES = { admin: 'السوبر أدمن', academic: 'الكادر الأكاديمي', trainer: 'المدرب' };
  var STATUS = { draft: ['مسودة', 'neutral'], active: ['نشطة', 'ok'], archived: ['مؤرشفة', 'archived'] };
  var KIND_LABEL = { pdf: 'PDF', doc: 'مستند', video: 'فيديو' };
  var TAB_STEP = { overview: 1, curriculum: 2, groups: 1, kit: 3, fees: 4, settings: 5 };

  var step = 1, editId = null, image = null;
  var groups = [], modules = [], linked = null, kit = null;

  function pathById(id) { for (var i = 0; i < PATHS.length; i++) if (PATHS[i].id === id) return PATHS[i]; return null; }
  function courseById(id) { for (var i = 0; i < COURSES.length; i++) if (COURSES[i].id === id) return COURSES[i]; return null; }
  function $f(id) { return $('#' + id); }
  function svg(paths, s) { return '<svg width="' + (s || 15) + '" height="' + (s || 15) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + paths + '</svg>'; }
  var BOOK = '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5v13z"/><path d="M20 17v5H6.5a2.5 2.5 0 0 1 0-5"/>';
  var CARET = '<svg class="mod-caret" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg>';
  function allSpecs() { var seen = []; COURSES.forEach(function (c) { (c.specializations || []).forEach(function (s) { if (seen.indexOf(s) < 0) seen.push(s); }); }); return seen; }
  function activeCourses() { return COURSES.filter(function (c) { return c.status !== 'archived'; }); }
  function pool() { return MOCK.POOL; }
  function names(k) { return (k && k.responsibleNames) ? k.responsibleNames.filter(Boolean) : []; }
  function uniqueSpecs(mods) { var o = []; (mods || []).forEach(function (m) { if (m.specialization && o.indexOf(m.specialization) < 0) o.push(m.specialization); }); return o; }
  function statusPill(s) { var st = STATUS[s] || ['—', 'neutral']; return $('<span class="pill"></span>').addClass(st[1]).text(st[0]); }
  function setToggle($t, on) { $t.toggleClass('on', !!on).attr('aria-checked', String(!!on)); }
  function instSelected() { return $('.ew-inst.on').map(function () { return $(this).data('id'); }).get(); }
  function rolesSelected() { return $('.ew-role.on').map(function () { return $(this).data('id'); }).get(); }

  /* ================= steps ================= */
  function goto(n) {
    step = Math.max(1, Math.min(STEPS, n));
    $('.ew-step').each(function () { $(this).prop('hidden', +$(this).data('step') !== step); });
    $('#ewSteps .wz-step').each(function () {
      var i = +$(this).data('step');
      $(this).toggleClass('cur', i === step).toggleClass('done', i < step);
      $(this).find('.wz-num').text(i < step ? '✓' : i);
    });
    $('#ewBack').text(step > 1 ? 'السابق' : 'إلغاء');
    $('#ewNext').prop('hidden', step === STEPS);
    $('#ewDraft, #ewPublish').prop('hidden', step !== STEPS);
    if (step === STEPS) fillReview();
    $('#ewBody').scrollTop(0);
  }
  function next() {
    if (step === 1 && !$f('ew_name').val().trim()) { $f('ew_name').addClass('err'); $('#err_ewName').addClass('show'); return; }
    if (step === 2 && isCert && !linked) { App.toast('اختر الدورة التأهيلية أولاً'); return; }
    if (step === 2 && !isCert) {
      if (groups.some(function (g) { return !g.spec; })) { App.toast('اختر التخصص لكل بطاقة أولاً'); return; }
      if (groups.some(function (g) { return !modsOf(g.spec).length; })) { App.toast('أضف مقرراً واحداً على الأقل لكل تخصص'); return; }
    }
    goto(step + 1);
  }

  /* ================= image ================= */
  function renderImage() {
    $('#ewImgDrop').prop('hidden', !!image); $('#ewImgFile').prop('hidden', !image);
    $('#ewImgName').text(image || ''); $('#ewImgUploading').prop('hidden', true);
  }
  function uploadImage() {
    $('#ewImgDrop, #ewImgFile').prop('hidden', true); $('#ewImgUploading').prop('hidden', false);
    setTimeout(function () { image = ($f('ew_name').val().trim() || 'path') + '-cover.jpg'; renderImage(); App.toast('تم رفع الصورة بنجاح'); }, 800);
  }

  /* ================= curriculum (diploma / fellowship) ================= */
  function modsOf(spec) { return modules.filter(function (m) { return m.specialization === spec; }); }
  function syncGroups() {
    uniqueSpecs(modules).forEach(function (sp) { if (!groups.some(function (g) { return g.spec === sp; })) groups.push({ spec: sp, open: false }); });
  }
  function renderCards() {
    var $box = $('#ewCards').empty();
    $('#ewModTotal').text(modules.length);
    $('#ewCardsEmpty').prop('hidden', groups.length > 0);
    groups.forEach(function (g, gi) {
      var $c = $($('#tplSpecCard').html());
      $c.attr('data-gi', gi).toggleClass('open', !!g.open);
      $c.find('.sc-body').prop('hidden', !g.open);
      var $sel = $c.find('.sc-spec'); allSpecs().forEach(function (s) { $sel.append($('<option></option>').val(s).text(s)); }); $sel.val(g.spec);
      var mods = g.spec ? modsOf(g.spec) : [];
      $c.find('.sc-title').text(g.spec || 'تخصص جديد');
      $c.find('.sc-sub').text(g.spec ? mods.length + ' مقرراً' : 'لم يُحدد التخصص بعد');
      $c.find('.sc-detail').prop('hidden', !g.spec); $c.find('.sc-pick').prop('hidden', !!g.spec);
      if (g.spec) {
        var $list = $c.find('.sc-mods');
        if (!mods.length) $list.append('<p class="prog-empty-note" style="margin:4px 0 10px">لم يُضف أي مقرر لهذا التخصص بعد.</p>');
        mods.forEach(function (m) {
          var c = courseById(m.courseLibId);
          var $r = $('<div class="row spec-mod-row"><span class="row-avatar g"></span><div class="row-main"><div class="row-title" style="font-size:13px"></div><div class="row-sub"></div></div><button type="button" class="dr-icon-btn danger" title="إزالة المقرر" data-rm-course>✕</button></div>');
          $r.attr('data-course', m.courseLibId).find('.row-avatar').text(c ? c.courseId.slice(-2) : '—');
          $r.find('.row-title').text(c ? c.name : '—'); $r.find('.row-sub').text(c ? c.courseId + ' · ' + c.hours + ' ساعة · ' + c.type : 'دورة غير متاحة');
          $list.append($r);
        });
        var forSpec = activeCourses().filter(function (c) { return (c.specializations || []).indexOf(g.spec) > -1; });
        var remaining = forSpec.filter(function (c) { return !mods.some(function (m) { return m.courseLibId === c.id; }); });
        var $add = $c.find('.sc-add').prop('disabled', !remaining.length);
        $add.append($('<option value=""></option>').text(remaining.length ? '— اختر دورة تدريبية —' : (forSpec.length ? 'تمت إضافة جميع دورات هذا التخصص' : 'لا توجد دورات تدريبية مرتبطة بهذا التخصص بعد')));
        remaining.forEach(function (c) { $add.append($('<option></option>').val(c.id).text(c.name)); });
      }
      $box.append($c);
    });
  }
  function bindCards() {
    var $box = $('#ewCards');
    $box.on('click', '.spec-h', function () { var gi = +$(this).closest('.spec-card').data('gi'); groups[gi].open = !groups[gi].open; renderCards(); });
    $box.on('change', '.sc-spec', function () {
      var gi = +$(this).closest('.spec-card').data('gi'), v = $(this).val(), g = groups[gi];
      if (v && groups.some(function (x, xi) { return xi !== gi && x.spec === v; })) { App.toast('هذا التخصص مُضاف بالفعل'); renderCards(); return; }
      if (g.spec) modules = modules.filter(function (m) { return m.specialization !== g.spec; });
      g.spec = v; g.open = true; renderCards();
    });
    $box.on('change', '.sc-add', function () {
      var gi = +$(this).closest('.spec-card').data('gi'), g = groups[gi], c = courseById(+$(this).val());
      if (!c || !g.spec) return;
      if ((c.specializations || []).indexOf(g.spec) < 0) { App.toast('هذه الدورة غير مرتبطة بهذا التخصص'); renderCards(); return; }
      if (modsOf(g.spec).some(function (m) { return m.courseLibId === c.id; })) { App.toast('هذا المقرر مُضاف بالفعل'); renderCards(); return; }
      modules.push({ name: c.name, specialization: g.spec, courseLibId: c.id }); renderCards();
    });
    $box.on('click', '[data-rm-course]', function () {
      var gi = +$(this).closest('.spec-card').data('gi'), cid = +$(this).closest('.row').attr('data-course');
      modules = modules.filter(function (m) { return !(m.specialization === groups[gi].spec && m.courseLibId === cid); }); renderCards();
    });
    $box.on('click', '.sc-remove', function () {
      var gi = +$(this).closest('.spec-card').data('gi'), g = groups[gi];
      if (g.spec) modules = modules.filter(function (m) { return m.specialization !== g.spec; });
      groups.splice(gi, 1); renderCards();
    });
    $('#ewAddGroup').on('click', function () { groups.push({ spec: '', open: true }); renderCards(); });
  }

  /* ================= certificate: linked course ================= */
  function renderLinked() {
    var c = linked ? courseById(linked) : null;
    $('#ewLinkedInfo').prop('hidden', !c); $('#ewLinkedHint').prop('hidden', !!c);
    if (!c) return;
    $('#ewLcIco').text(c.courseId.slice(-2)); $('#ewLcName').text(c.name);
    $('#ewLcMeta').text(c.courseId + ' · ' + c.type + ' · ' + ((c.specializations || []).join('، ') || 'بلا تخصص'));
    $('#ewLcDays').text(c.days); $('#ewLcHours').text(c.hours);
    $('#ewSplitDesc').text('تفعيل هذا الخيار يتيح تقسيم وقت الدورة التأهيلية (' + c.days + ' يوم · ' + c.hours + ' ساعة) عند إنشاء دفعة جديدة لهذه الشهادة. قيم الشهادة نفسها تبقى كما هي من إعداد الدورة.');
  }

  /* ================= training kit ================= */
  function kindOf(name) {
    var e = String(name || '').split('.').pop().toLowerCase();
    if (e === 'pdf') return 'pdf';
    if (['mp4', 'mov', 'avi', 'mkv', 'webm'].indexOf(e) > -1) return 'video';
    return 'doc';
  }
  function renderKitWizard() {
    $('.kit-mode').each(function () { $(this).toggleClass('sel', $(this).data('mode') === kit.mode); });
    $('#kitDirect').prop('hidden', kit.mode !== 'direct'); $('#kitAssign').prop('hidden', kit.mode !== 'assign');
    var $f2 = $('#kitFiles').empty();
    (kit.files || []).forEach(function (f, i) {
      var $r = $('<div class="file-row"><span class="file-ico">' + svg('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>', 15) + '</span><div class="fname"><div class="fn"></div><div class="fmeta"></div></div><button type="button" class="dr-icon-btn danger" data-kit-rmfile>✕</button></div>');
      $r.attr('data-i', i).find('.fn').text(f.name);
      $r.find('.fmeta').text(KIND_LABEL[f.kind || kindOf(f.name)] + (f.uploadedBy && f.uploadedBy !== '—' ? ' · رفعه ' + f.uploadedBy : ''));
      $f2.append($r);
    });
    var $resp = $('#kitResp').empty();
    var ns = names(kit);
    if (!ns.length) $resp.append('<p class="prog-empty-note">لم يُعيَّن مسؤول بعد.</p>');
    ns.forEach(function (n, i) {
      var p = pool().filter(function (x) { return x.name === n; })[0] || {};
      var $r = $('<div class="row"><span class="row-avatar g"></span><div class="row-main"><div class="row-title" style="font-size:13px"></div><div class="row-sub"></div></div><button type="button" class="dr-icon-btn danger" title="إزالة" data-kit-rmresp>✕</button></div>');
      $r.attr('data-i', i).find('.row-avatar').text(p.avatar || n.slice(-2)); $r.find('.row-title').text(n); $r.find('.row-sub').text(p.specialty || '');
      $resp.append($r);
    });
    var remaining = pool().filter(function (p) { return ns.indexOf(p.name) < 0; });
    var $sel = $('#kitAddResp').empty().prop('disabled', !remaining.length);
    $sel.append($('<option value=""></option>').text(remaining.length ? '— اختر مسؤولاً —' : 'تمت إضافة جميع المتاحين'));
    remaining.forEach(function (p) { $sel.append($('<option></option>').val(p.name).text(p.name)); });
    $('#kitNote').prop('hidden', !ns.length).find('span').text('المهمة "رفع الحقيبة التدريبية" ستظهر تلقائياً في مركز إجراءات ' + ns.join('، ') + '.');
  }
  function bindKitWizard() {
    $('.kit-mode').on('click', function () { kit.mode = $(this).data('mode'); renderKitWizard(); });
    $('#kitDrop').on('click', function () {
      kit.files = kit.files || [];
      var by = names(kit)[0] || (pool()[0] || {}).name || '—';
      var nm = 'حقيبة-تدريبية-' + (kit.files.length + 1) + '.pdf';
      kit.files.push({ name: nm, kind: 'pdf', uploadedBy: by, date: 'اليوم' }); kit.status = 'ready'; renderKitWizard(); App.toast('تم رفع الملف بنجاح');
    });
    $('#kitFiles').on('click', '[data-kit-rmfile]', function () { kit.files.splice(+$(this).closest('.file-row').attr('data-i'), 1); renderKitWizard(); });
    $('#kitResp').on('click', '[data-kit-rmresp]', function () { kit.responsibleNames.splice(+$(this).closest('.row').attr('data-i'), 1); renderKitWizard(); });
    $('#kitAddResp').on('change', function () {
      var n = $(this).val(); if (!n) return;
      if (names(kit).indexOf(n) > -1) { App.toast('هذا المسؤول مُضاف بالفعل'); return; }
      kit.responsibleNames.push(n); renderKitWizard();
    });
  }

  /* ================= review ================= */
  function fillReview() {
    var v = function (id) { return $f(id).val().trim(); };
    $('#rvName').text(v('ew_name'));
    if (isCert) {
      $('#rvDesc').text(v('ew_generalDesc')); $('#rvObj').text(v('ew_objectivesText')); $('#rvAud').text(v('ew_audience'));
      $('#rvFeat').text(v('ew_features')); $('#rvTopics').text(v('ew_topics')); $('#rvOut').text(v('ew_outcomes'));
      var c = linked ? courseById(linked) : null;
      $('#rvCourse').text(c ? c.name : ''); $('#rvCourseId').text(c ? c.courseId : ''); $('#rvDays').text(c ? c.days : 0); $('#rvHours2').text(c ? c.hours : 0);
      $('#rvSplit').text($('#ewSplit').hasClass('on') ? 'متاح' : 'غير متاح');
    } else {
      $('#rvSpecialty').text(uniqueSpecs(modules).join('، ')); $('#rvDuration').text(v('ew_duration')); $('#rvHours').text($f('ew_hours').val() || 0);
      $('#rvSpecCount').text(uniqueSpecs(modules).length); $('#rvModCount').text(modules.length);
      var $l = $('#rvMods').empty();
      modules.forEach(function (m) {
        var c2 = courseById(m.courseLibId);
        $l.append($('<div class="info-row"><span class="k"></span><span class="v"></span></div>').find('.k').text(c2 ? c2.name : 'مقرر غير مكتمل').end().find('.v').text(m.specialization + (c2 ? ' · ' + c2.courseId : '')).end());
      });
    }
    $('#rvKit').text(kit.mode === 'direct' ? 'رفع مباشر (' + (kit.files || []).length + ' ملف)' : (names(kit).join('، ') || '—'));
    $('#rvPrice').text(v('ew_price') + ' ر.س');
    $('#rvInst').text(instSelected().map(function (k) { return INSTALL[k]; }).join('، ') || 'لا يوجد');
    $('#rvWeb').text($('#ew_web').hasClass('on') ? 'مفعّل' : 'موقوف');
    $('#rvRoles').text(rolesSelected().map(function (k) { return ROLES[k]; }).join('، '));
    $('#rvMissing').prop('hidden', !!v('ew_name'));
  }

  /* ================= open / close / save ================= */
  function open(id, atStep) {
    editId = id || null;
    var p = id ? pathById(id) : null;
    $('#ewTitle').text((id ? 'تعديل ' : 'إنشاء ') + LABEL[TYPE]);
    $f('ew_name').val(p ? p.name : '').removeClass('err'); $('#err_ewName').removeClass('show');
    ['generalDesc', 'objectivesText', 'article', 'audience', 'features', 'topics', 'outcomes', 'duration'].forEach(function (k) { if ($f('ew_' + k).length) $f('ew_' + k).val(p ? (p[k] || '') : ''); });
    $f('ew_exammode').val(p ? p.examMode : 'عن بُعد'); $f('ew_studymode').val(p ? p.studyMode : 'التعلم المدمج');
    ['hours', 'terms', 'subjects'].forEach(function (k) { if ($f('ew_' + k).length) $f('ew_' + k).val(p ? (p[k] || 0) : 0); });
    image = p ? p.image : null; renderImage();
    modules = p ? JSON.parse(JSON.stringify(p.modules || [])) : []; groups = [];
    if (isCert) {
      linked = p ? (p.linkedCourseLibId || (modules[0] && modules[0].courseLibId) || null) : null;
      $('#ew_linked').val(linked || ''); setToggle($('#ewSplit'), p && p.certSplit); renderLinked();
    } else { syncGroups(); renderCards(); }
    kit = p && p.trainingKit ? JSON.parse(JSON.stringify(p.trainingKit)) : { mode: 'assign', responsibleNames: [], status: 'not_started', files: [] };
    kit.mode = kit.mode || 'assign'; kit.responsibleNames = names(kit).slice(); kit.files = kit.files || []; renderKitWizard();
    $f('ew_price').val(p && p.fees ? p.fees.price : '');
    $('.ew-inst').each(function () { setToggle($(this), p && p.fees && (p.fees.installments || []).indexOf($(this).data('id')) > -1); });
    setToggle($('#ew_web'), p ? p.settings.webVisible : true);
    $('.ew-role').each(function () { setToggle($(this), p ? (p.settings.editRoles || []).indexOf($(this).data('id')) > -1 : $(this).data('id') === 'admin'); });
    goto(atStep || 1);
    $('#ewScrim, #ewDrawer').addClass('open'); $('#ewDrawer').addClass('full');
  }
  function close() { $('#ewScrim, #ewDrawer').removeClass('open'); }

  function collect(state) {
    var d = {
      type: TYPE, name: $f('ew_name').val().trim(), image: image,
      generalDesc: $f('ew_generalDesc').val(), objectivesText: $f('ew_objectivesText').val(),
      duration: $f('ew_duration').val() || '', examMode: $f('ew_exammode').val(), studyMode: $f('ew_studymode').val(),
      hours: +$f('ew_hours').val() || 0, terms: +$f('ew_terms').val() || 0, subjects: +$f('ew_subjects').val() || 0,
      trainingKit: kit, fees: { price: $f('ew_price').val(), installments: instSelected() },
      settings: { webVisible: $('#ew_web').hasClass('on'), editRoles: rolesSelected() }, status: state, updated: 'الآن'
    };
    if (isCert) {
      ['audience', 'features', 'topics', 'outcomes'].forEach(function (k) { d[k] = $f('ew_' + k).val(); });
      var c = linked ? courseById(linked) : null;
      d.linkedCourseLibId = linked; d.certSplit = $('#ewSplit').hasClass('on');
      d.modules = c ? [{ name: c.name, specialization: '', courseLibId: c.id }] : [];
      if (c) { d.hours = c.hours; d.days = c.days; d.specialty = (c.specializations || []).join('، '); }
    } else {
      d.article = $f('ew_article').val(); d.modules = modules.filter(function (m) { return m.courseLibId && courseById(m.courseLibId); });
      d.specialty = uniqueSpecs(d.modules).join('، ');
    }
    return d;
  }
  function save(state) {
    if (!$f('ew_name').val().trim()) { App.toast('أدخل الاسم أولاً'); goto(1); return; }
    var d = collect(state), p;
    if (editId) { p = pathById(editId); $.extend(p, d); }
    else { d.id = Date.now(); d.pathId = PREFIX[TYPE] + '-' + (100 + PATHS.length + 1); d.groupsCount = 0; d.learnersCount = 0; PATHS.unshift(d); p = d; }
    close();
    App.toast(state === 'draft' ? 'تم الحفظ كمسودة' : 'تم النشر بنجاح', p.name);
    if ($('#eduTbody').length) { editId ? fillRow($('#eduTbody tr[data-id="' + p.id + '"]'), p) : $('#eduTbody').prepend(buildRow(p)); applyFilters(); }
    if ($('body').data('edu-id')) renderView(p);
  }

  /* ================= list page ================= */
  var filter = 'all';
  function buildRow(p) {
    var $tr = $(
      '<tr data-id="' + p.id + '" data-status="' + p.status + '">' +
        '<td><span class="cell-name js-name"></span></td><td class="mono js-pid"></td><td class="js-spec"></td><td class="mono js-mods"></td><td class="mono js-groups"></td><td class="mono js-learners"></td>' +
        '<td class="js-status"></td><td class="mono js-updated"></td>' +
        '<td style="text-align:end"><div class="row-act">' +
          '<button type="button" class="act-btn" title="عرض" aria-label="عرض" data-noview>' + svg('<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/>', 17) + '</button>' +
          '<button type="button" class="act-btn" title="تعديل" aria-label="تعديل" data-ew-edit>' + svg('<path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>', 17) + '</button>' +
          '<button type="button" class="act-btn" title="نسخ" aria-label="نسخ" data-ew-dup>' + svg('<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>', 17) + '</button>' +
        '</div></td></tr>');
    fillRow($tr, p); return $tr;
  }
  function fillRow($tr, p) {
    $tr.attr('data-status', p.status);
    $tr.find('.js-name').text(p.name); $tr.find('.js-pid').text(p.pathId); $tr.find('.js-spec').text(p.specialty || '—');
    $tr.find('.js-mods').text((p.modules || []).length); $tr.find('.js-groups').text(p.groupsCount || 0); $tr.find('.js-learners').text(p.learnersCount || 0);
    $tr.find('.js-status').empty().append(statusPill(p.status)); $tr.find('.js-updated').text(p.updated);
  }
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
  var dupId = null;
  function openDup(id) { dupId = id; $('#dupScrim').addClass('open'); }
  function closeDup() { $('#dupScrim').removeClass('open'); dupId = null; }
  function confirmDup() {
    var src = pathById(dupId); if (!src) { closeDup(); return; }
    var d = JSON.parse(JSON.stringify(src));
    d.id = Date.now(); d.pathId = PREFIX[TYPE] + '-' + (100 + PATHS.length + 1); d.groupsCount = 0; d.learnersCount = 0; d.status = 'draft'; d.updated = 'الآن';
    PATHS.unshift(d); $('#eduTbody').prepend(buildRow(d)); applyFilters(); closeDup(); App.toast('تم إنشاء نسخة كمسودة', d.name);
  }

  /* ================= view page ================= */
  function infoRow(k, v, mono) { var $r = $('<div class="info-row"><span class="k"></span><span class="v"></span></div>'); $r.find('.k').text(k); $r.find('.v').text(v); if (mono) $r.find('.v').addClass('mono'); return $r; }
  function buildModCard(m) {
    var c = courseById(m.courseLibId), $c = $('<div class="set-card mod-card"></div>');
    var $h = $('<div class="set-card-h"><span class="mc-ico">' + svg(BOOK) + '</span><div class="mc-txt"><div class="mc-name"></div><div class="mc-sub"></div></div>' + CARET + '</div>');
    $h.find('.mc-name').text(m.name || (c ? c.name : '—'));
    $h.find('.mc-sub').text((!isCert && m.specialization ? m.specialization : (c ? c.type : '—')) + (c ? ' · ' + c.hours + ' ساعة' : ''));
    var $b = $('<div class="set-card-b" hidden></div>');
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
      var $r = $('<div class="row kit-row"><span class="row-avatar"></span><div class="row-main"><div class="row-title" style="font-size:13px"></div><div class="row-sub"></div></div><button type="button" class="mini-btn line" data-toast="جارٍ تنزيل الملف">تنزيل</button><button type="button" class="dr-icon-btn danger" title="حذف" data-kit-del>✕</button></div>');
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
    if (!(p.modules || []).length) $cur.append('<div class="empty"><p>لا ' + (isCert ? 'دورات' : 'مقررات') + ' بعد.</p></div>');
    (p.modules || []).forEach(function (m) { $cur.append(buildModCard(m)); });
    renderKitTab(p);
  }

  /* ================= bindings ================= */
  $(function () {
    $('#ewSteps').on('click', '.wz-step', function () { goto(+$(this).data('step')); });
    $('#ewBack').on('click', function () { if (step > 1) goto(step - 1); else close(); });
    $('#ewNext').on('click', next);
    $('#ewDraft').on('click', function () { save('draft'); });
    $('#ewPublish').on('click', function () { save('active'); });
    $('#ewScrim, #ewClose').on('click', close);
    $('#ewFull').on('click', function () { $('#ewDrawer').toggleClass('full'); });
    $f('ew_name').on('input', function () { $(this).removeClass('err'); $('#err_ewName').removeClass('show'); });
    $('#ewImgDrop, #ewImgReplace').on('click', uploadImage);
    $('#ewImgRemove').on('click', function () { image = null; renderImage(); });
    if (isCert) $('#ew_linked').on('change', function () { linked = +$(this).val() || null; renderLinked(); });
    else bindCards();
    bindKitWizard();
    $(document).on('click', '.ew-role', function () { if (!$('.ew-role.on').length) { setToggle($(this), true); App.toast('يجب اختيار صلاحية واحدة على الأقل'); } });

    /* list page */
    $('#ewCreateBtn').on('click', function () { open(null); });
    $(document).on('click', '[data-ew-edit]', function () { open($(this).closest('tr').data('id')); });
    $(document).on('click', '[data-ew-dup]', function () { openDup($(this).closest('tr').data('id')); });
    $(document).on('click', '[data-noview]', function () { App.toast('صفحة العرض تُنشأ بعد حفظ البرنامج في النظام'); });
    $('#dupNo').on('click', closeDup); $('#dupYes').on('click', confirmDup);
    $('#dupScrim').on('click', function (e) { if (e.target.id === 'dupScrim') closeDup(); });
    $('#eduSearch').on('input', applyFilters);
    $('.toolbar .chip[data-filter]').on('click', function () {
      $('.toolbar .chip[data-filter]').removeClass('on'); $(this).addClass('on'); filter = $(this).data('filter'); applyFilters();
    });
    $('#exportBtn').on('click', function () { App.toast('تم تجهيز ملف التصدير', 'سيبدأ التنزيل تلقائياً'); });
    $(document).on('click', '#eduTbody tr[data-href]', function (e) { if ($(e.target).closest('a, button').length) return; window.location.href = $(this).data('href'); });

    /* view page */
    var vid = $('body').data('edu-id');
    if (vid) {
      $('#ewEditBtn').on('click', function () { open(vid, TAB_STEP[$('.sec-tab.active').data('tab')] || 1); });
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
    $(document).on('keydown', function (e) { if (e.key === 'Escape') { close(); closeDup(); } });
    if ($('#eduTbody').length) applyFilters();
  });
})(jQuery);
