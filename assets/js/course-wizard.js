/* Training-course library: create/edit wizard (8 steps), list actions (edit / archive / row click)
   and the course view page's live refresh after an edit.
   Every screen — the table, the wizard drawer, the dialog — is real HTML; this file only reacts to it. */
(function ($) {
  'use strict';
  if (!window.MOCK || !$('#cwDrawer').length) return;

  var COURSES = MOCK.COURSES;
  var STEPS = 8;
  var step = 1, editId = null, image = null, specs = [];
  var INSTALL = { tabby: 'Tabby', tamara: 'Tamara' };
  var ROLES = { admin: 'السوبر أدمن', academic: 'الكادر الأكاديمي', trainer: 'المدرب' };
  var STATUS = { draft: ['مسودة', 'neutral'], active: ['نشطة', 'ok'], archived: ['مؤرشفة', 'archived'] };

  function byId(id) { for (var i = 0; i < COURSES.length; i++) if (COURSES[i].id === id) return COURSES[i]; return null; }
  function $f(id) { return $('#' + id); }

  /* ---------- steps ---------- */
  function goto(n) {
    step = Math.max(1, Math.min(STEPS, n));
    $('.cw-step').each(function () { $(this).prop('hidden', +$(this).data('step') !== step); });
    $('#cwSteps .wz-step').each(function () {
      var i = +$(this).data('step');
      $(this).toggleClass('cur', i === step).toggleClass('done', i < step);
      $(this).find('.wz-num').text(i < step ? '✓' : i);
    });
    $('#cwBack').text(step > 1 ? 'السابق' : 'إلغاء');
    $('#cwNext').prop('hidden', step === STEPS);
    $('#cwDraft, #cwPublish').prop('hidden', step !== STEPS);
    if (step === STEPS) fillReview();
    $('#cwBody').scrollTop(0);
  }

  function next() {
    if (step === 1 && !$f('cl_name').val().trim()) {
      $f('cl_name').addClass('err'); $('#err_clName').addClass('show'); return;
    }
    goto(step + 1);
  }

  /* ---------- image ---------- */
  function renderImage() {
    $('#cwImgDrop').prop('hidden', !!image);
    $('#cwImgFile').prop('hidden', !image);
    $('#cwImgName').text(image || '');
    $('#cwImgUploading').prop('hidden', true);
  }
  function uploadImage() {
    $('#cwImgDrop').prop('hidden', true); $('#cwImgFile').prop('hidden', true); $('#cwImgUploading').prop('hidden', false);
    setTimeout(function () {
      image = ($f('cl_name').val().trim() || 'course') + '-cover.jpg';
      renderImage(); App.toast('تم رفع الصورة بنجاح');
    }, 800);
  }

  /* ---------- specializations ---------- */
  function renderSpecs() {
    var $box = $('#cwSpecList').empty();
    if (!specs.length) { $box.append('<span class="prog-empty-note">لم يتم إضافة أي تخصص بعد.</span>'); return; }
    specs.forEach(function (s, i) {
      var $c = $('<span class="pill info spec-chip"></span>').text(s);
      $c.append($('<span class="x" role="button" aria-label="إزالة"></span>').text('✕').attr('data-i', i));
      $box.append($c);
    });
  }
  function addSpec() {
    var v = $f('cl_spec_input').val().trim();
    if (!v) return;
    if (specs.indexOf(v) > -1) { App.toast('هذا التخصص مُضاف بالفعل'); $f('cl_spec_input').val(''); return; }
    specs.push(v); $f('cl_spec_input').val(''); renderSpecs(); $f('cl_spec_input').trigger('focus');
  }

  /* ---------- FAQs ---------- */
  function refreshFaqs() {
    var $items = $('#cwFaqList .faq-item');
    $items.each(function (i) {
      $(this).find('.faq-num').text(i + 1);
      $(this).find('[data-faq="up"]').prop('disabled', i === 0);
      $(this).find('[data-faq="down"]').prop('disabled', i === $items.length - 1);
    });
    $('#cwFaqCount').text($items.length);
    $('#cwFaqEmpty').prop('hidden', $items.length > 0);
  }
  function addFaq(q, a) {
    var $t = $($('#tplFaq').html());
    $t.find('.faq-q').val(q || ''); $t.find('.faq-a').val(a || '');
    $('#cwFaqList').append($t); refreshFaqs();
  }

  /* ---------- toggles ---------- */
  function setToggle($t, on) { $t.toggleClass('on', !!on).attr('aria-checked', String(!!on)); }
  function instSelected() { return $('.cw-inst.on').map(function () { return $(this).data('id'); }).get(); }
  function rolesSelected() { return $('.cw-role.on').map(function () { return $(this).data('id'); }).get(); }

  /* ---------- review ---------- */
  function fillReview() {
    var v = function (id) { return $f(id).val().trim(); };
    $('#rvName').text(v('cl_name')); $('#rvDesc').text(v('cl_gendesc'));
    $('#rvSpecs').text(specs.join('، '));
    $('#rvPrice').text(v('cl_price') + ' ر.س'); $('#rvType').text($f('cl_type').val());
    $('#rvDays').text($f('cl_days').val() || 0); $('#rvHours').text($f('cl_hours').val() || 0);
    $('#rvFaq').text($('#cwFaqList .faq-item').length);
    $('#rvInst').text(instSelected().map(function (k) { return INSTALL[k]; }).join('، ') || 'لا يوجد');
    $('#rvWeb').text($('#cl_web').hasClass('on') ? 'مفعّل' : 'موقوف');
    $('#rvRoles').text(rolesSelected().map(function (k) { return ROLES[k]; }).join('، '));
  }

  /* ---------- open / close ---------- */
  function open(id) {
    editId = id || null;
    var c = id ? byId(id) : null;
    $('#cwTitle').text(id ? 'تعديل الدورة التدريبية' : 'إنشاء دورة تدريبية');
    $f('cl_name').val(c ? c.name : '').removeClass('err'); $('#err_clName').removeClass('show');
    $f('cl_gendesc').val(c ? c.generalDesc : '');
    ['objectives', 'audience', 'features', 'topics', 'outcomes'].forEach(function (k) { $f('cl_' + k).val(c ? (c[k] || '') : ''); });
    $f('cl_price').val(c ? c.price : ''); $f('cl_type').val(c ? c.type : 'عن بعد');
    $f('cl_days').val(c ? c.days : 0); $f('cl_hours').val(c ? c.hours : 0);
    image = c ? c.image : null; renderImage();
    specs = c ? (c.specializations || []).slice() : []; renderSpecs(); $f('cl_spec_input').val('');
    $('#cwFaqList').empty(); (c ? (c.faqs || []) : []).forEach(function (f) { addFaq(f.q, f.a); }); refreshFaqs();
    $('.cw-inst').each(function () { setToggle($(this), c && (c.installments || []).indexOf($(this).data('id')) > -1); });
    setToggle($('#cl_web'), c ? c.webVisible : true);
    $('.cw-role').each(function () { setToggle($(this), c ? (c.editRoles || []).indexOf($(this).data('id')) > -1 : $(this).data('id') === 'admin'); });
    goto(1);
    $('#cwScrim, #cwDrawer').addClass('open');
    $('#cwDrawer').addClass('full');
  }
  function close() { $('#cwScrim, #cwDrawer').removeClass('open'); }

  /* ---------- save ---------- */
  function collect(state) {
    var faqs = $('#cwFaqList .faq-item').map(function () {
      return { q: $(this).find('.faq-q').val(), a: $(this).find('.faq-a').val() };
    }).get();
    return {
      name: $f('cl_name').val().trim(), image: image, generalDesc: $f('cl_gendesc').val(),
      specializations: specs.slice(),
      objectives: $f('cl_objectives').val(), audience: $f('cl_audience').val(), features: $f('cl_features').val(),
      topics: $f('cl_topics').val(), outcomes: $f('cl_outcomes').val(), faqs: faqs,
      price: $f('cl_price').val(), days: +$f('cl_days').val() || 0, hours: +$f('cl_hours').val() || 0, type: $f('cl_type').val(),
      installments: instSelected(), webVisible: $('#cl_web').hasClass('on'), editRoles: rolesSelected(),
      status: state, updated: 'الآن'
    };
  }

  function save(state) {
    if (!$f('cl_name').val().trim()) { App.toast('أدخل اسم الدورة أولاً'); goto(1); return; }
    var d = collect(state), c;
    if (editId) { c = byId(editId); $.extend(c, d); }
    else {
      d.id = Date.now();
      d.courseId = 'CL-' + String(100 + COURSES.length + 1).padStart(3, '0');
      COURSES.push(d); c = d;
    }
    close();
    App.toast(state === 'draft' ? 'تم حفظ الدورة كمسودة' : 'تم نشر الدورة بنجاح', c.name);
    if ($('#courseTbody').length) { editId ? fillRow($('#courseTbody tr[data-id="' + c.id + '"]'), c) : $('#courseTbody').append(buildRow(c)); refreshCount(); }
    if ($('body').data('course-id')) renderView(c);
  }

  /* ---------- list page ---------- */
  function statusPill(s) { var st = STATUS[s]; return $('<span class="pill"></span>').addClass(st[1]).text(st[0]); }
  function buildRow(c) {
    var $tr = $(
      '<tr data-id="' + c.id + '">' +
        '<td><a class="cell-name js-name"></a></td><td class="mono js-cid"></td><td class="js-type"></td><td class="mono js-days"></td><td class="mono js-hours"></td>' +
        '<td class="mono js-price"></td><td class="js-status"></td><td class="mono js-updated"></td>' +
        '<td style="text-align:end"><div class="row-act">' +
          '<button type="button" class="act-btn" title="عرض" aria-label="عرض" data-noview>' + icon('view') + '</button>' +
          '<button type="button" class="act-btn" title="تعديل" aria-label="تعديل" data-cw-edit>' + icon('edit') + '</button>' +
          '<button type="button" class="act-btn act-danger" title="أرشفة" aria-label="أرشفة" data-cw-archive>' + icon('archive') + '</button>' +
        '</div></td></tr>');
    fillRow($tr, c);
    return $tr;
  }
  function fillRow($tr, c) {
    $tr.find('.js-name').text(c.name);
    $tr.find('.js-cid').text(c.courseId); $tr.find('.js-type').text(c.type);
    $tr.find('.js-days').text(c.days); $tr.find('.js-hours').text(c.hours); $tr.find('.js-price').text(c.price + ' ر.س');
    $tr.find('.js-status').empty().append(statusPill(c.status)); $tr.find('.js-updated').text(c.updated);
  }
  function icon(n) {
    var P = {
      view: '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/>',
      edit: '<path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>',
      archive: '<rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8M10 12h4"/>'
    };
    return '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + P[n] + '</svg>';
  }
  function refreshCount() { var n = $('#courseTbody > tr').length; $('#tfootShown, #tfootTotal').text(n); }

  var archiveId = null;
  function openArchive(id) {
    archiveId = id;
    var used = +$('#courseTbody tr[data-id="' + id + '"]').attr('data-used') > 0;
    $('#archWarn').prop('hidden', !used);
    $('#archScrim').addClass('open');
  }
  function closeArchive() { $('#archScrim').removeClass('open'); archiveId = null; }

  /* ---------- view page refresh ---------- */
  function renderView(c) {
    var map = {
      name: c.name, generalDesc: c.generalDesc, price: c.price + ' ر.س', type: c.type, days: c.days, hours: c.hours,
      specializations: (c.specializations || []).join('، '), updated: c.updated, faqCount: (c.faqs || []).length,
      installments: (c.installments || []).map(function (k) { return INSTALL[k]; }).join('، ') || 'لا يوجد',
      webVisible: c.webVisible ? 'مفعّل' : 'موقوف', editRoles: (c.editRoles || []).map(function (k) { return ROLES[k]; }).join('، ')
    };
    Object.keys(map).forEach(function (k) { $('[data-bind="' + k + '"]').text(map[k]); });
    $('[data-bind-status]').empty().append(statusPill(c.status));
    document.title = c.name + ' — مركز المبدعون';
    $('#specEmpty').prop('hidden', (c.specializations || []).length > 0);
    $('#specRow').prop('hidden', !(c.specializations || []).length);
  }

  /* ---------- bindings ---------- */
  $(function () {
    $('#cwSteps').on('click', '.wz-step', function () { goto(+$(this).data('step')); });
    $('#cwBack').on('click', function () { if (step > 1) goto(step - 1); else close(); });
    $('#cwNext').on('click', next);
    $('#cwDraft').on('click', function () { save('draft'); });
    $('#cwPublish').on('click', function () { save('active'); });
    $('#cwScrim, #cwClose').on('click', close);
    $('#cwFull').on('click', function () { $('#cwDrawer').toggleClass('full'); });
    $f('cl_name').on('input', function () { $(this).removeClass('err'); $('#err_clName').removeClass('show'); });

    $('#cwImgDrop').on('click', uploadImage);
    $('#cwImgReplace').on('click', uploadImage);
    $('#cwImgRemove').on('click', function () { image = null; renderImage(); });

    $('#cwSpecAdd').on('click', addSpec);
    $f('cl_spec_input').on('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); addSpec(); } });
    $('#cwSpecList').on('click', '.x', function () { specs.splice(+$(this).attr('data-i'), 1); renderSpecs(); });

    $('#cwFaqAdd').on('click', function () { addFaq('', ''); });
    $('#cwFaqList').on('click', '[data-faq]', function () {
      var $it = $(this).closest('.faq-item'), act = $(this).data('faq');
      if (act === 'remove') $it.remove();
      else if (act === 'up') $it.prev('.faq-item').before($it);
      else if (act === 'down') $it.next('.faq-item').after($it);
      refreshFaqs();
    });

    $(document).on('click', '.cw-role', function () {
      if (!$('.cw-role.on').length) { setToggle($(this), true); App.toast('يجب اختيار صلاحية واحدة على الأقل'); }
    });

    /* list page */
    $('#cwCreateBtn').on('click', function () { open(null); });
    $(document).on('click', '[data-cw-edit]', function () { open($(this).closest('tr').data('id')); });
    $(document).on('click', '[data-cw-archive]', function () { openArchive($(this).closest('tr').data('id')); });
    $(document).on('click', '[data-noview]', function () { App.toast('صفحة العرض تُنشأ بعد حفظ الدورة في النظام'); });
    $('#archNo').on('click', closeArchive);
    $('#archScrim').on('click', function (e) { if (e.target.id === 'archScrim') closeArchive(); });
    $('#archYes').on('click', function () {
      var c = byId(archiveId); if (!c) return;
      c.status = 'archived'; c.updated = 'الآن';
      fillRow($('#courseTbody tr[data-id="' + c.id + '"]'), c);
      closeArchive(); App.toast('تم أرشفة الدورة');
    });
    $(document).on('click', '#courseTbody tr[data-href]', function (e) {
      if ($(e.target).closest('a, button').length) return;
      window.location.href = $(this).data('href');
    });

    /* view page */
    $('#cwEditBtn').on('click', function () { open($('body').data('course-id')); });
    $(document).on('keydown', function (e) { if (e.key === 'Escape') { close(); closeArchive(); } });
  });
})(jQuery);
