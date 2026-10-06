/* الدفعات التدريبية: تفاعلات واجهة فقط فوق HTML ثابت موجود في الصفحة (لا بناء للصفحات هنا).
   قائمة الدفعات داخل صفحة البرنامج:
     [data-bl-q] [data-bl-from] [data-bl-to] [data-bl-col] [data-bl-reset]  على صفوف [data-bl-row]
   صفحة الدفعة:
     [data-ln-q|group|status|cb|all|clear|reset|move]  فلترة المتدربين وتحديدهم ونقلهم (صفوف tr[data-group][data-status])
     [data-kit-kind] [data-kit-search]                  فلترة ملفات الحقيبة (صفوف .row[data-kind])
   المعالج والنوافذ:
     .bw-card .set-card-h    فتح/طيّ بطاقة المجموعة أو بطاقة الوقت (المحتوى [hidden] داخلها)
     [data-choose]           اختيار بطاقة واحدة من مجموعة بطاقات الراديو
     [data-toggle-next]      إظهار/إخفاء العنصر التالي
     [data-cbx] [data-pick-all] [data-pick-q]  اختيار المتدربين في نافذة قائمة الانتظار
   #edit في رابط الصفحة يفتح نافذة تعديل الدفعة. */
(function ($) {
  'use strict';

  var MON = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
  function dateVal(t) {
    var m = /^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})$/.exec($.trim(t));
    return m && MON[m[2].toLowerCase()] !== undefined ? new Date(+m[3], MON[m[2].toLowerCase()], +m[1]).getTime() : null;
  }
  function toast(t, s) { if (window.App && App.toast) App.toast(t, s); }

  /* ================= قائمة الدفعات (تبويب الدفعات التدريبية) ================= */
  var COLS = ['اسم الدفعة', 'رقم الدفعة', 'تاريخ البداية', 'تاريخ النهاية', 'المتدربون', 'المجموعات', 'المدربون', 'المسؤول', 'الحالة', 'آخر تحديث'];

  function selectedCols() {
    return $('[data-bl-col].solid').map(function () { return $('[data-bl-col]').index(this); }).get();
  }
  function applyBatchList() {
    var q = $.trim($('[data-bl-q]').val() || ''), cols = selectedCols();
    var from = $('[data-bl-from]').val() ? Date.parse($('[data-bl-from]').val()) : null;
    var to = $('[data-bl-to]').val() ? Date.parse($('[data-bl-to]').val()) : null;
    var $rows = $('[data-bl-row]'), n = 0;
    $rows.each(function () {
      var $td = $(this).children('td'), ok = true;
      if (q) {
        var idx = cols.length ? cols : $td.map(function (i) { return i; }).get();
        ok = idx.some(function (i) { return $td.eq(i).text().indexOf(q) > -1; });
      }
      var d = dateVal($td.eq(2).text());
      if (ok && from != null && !(d != null && d >= from)) ok = false;
      if (ok && to != null && !(d != null && d <= to)) ok = false;
      $(this).toggle(ok);
      if (ok) n++;
    });
    $('[data-bl-table]').toggle(n > 0 || !$rows.length);
    $('[data-bl-none]').prop('hidden', n > 0);
    $('[data-bl-count]').text(n);
    var active = !!(q || from || to || cols.length);
    $('[data-bl-reset]').prop('hidden', !active);
    $('[data-bl-q]').attr('placeholder', cols.length ? 'ابحث في: ' + cols.map(function (i) { return COLS[i]; }).join('، ') : 'ابحث في كل الأعمدة…');
    $('[data-bl-cols-label]').text('فلترة حسب ' + (cols.length ? '(' + cols.length + ' محدَّد)' : '(كل الأعمدة)'));
  }
  $(document).on('input change', '[data-bl-q], [data-bl-from], [data-bl-to]', applyBatchList);
  $(document).on('click', '[data-bl-col]', function () {
    $(this).toggleClass('solid').toggleClass('line');
    applyBatchList();
  });
  $(document).on('click', '[data-bl-reset]', function () {
    $('[data-bl-q], [data-bl-from], [data-bl-to]').val('');
    $('[data-bl-col]').removeClass('solid').addClass('line');
    applyBatchList();
  });

  /* ================= صفحة الدفعة: المتدربون ================= */
  function lnRows() { return $('[data-ln-row]'); }
  function lnVisible() { return lnRows().filter(function () { return $(this).css('display') !== 'none'; }); }
  function lnSelected() { return lnRows().filter(function () { return $(this).find('[data-ln-cb]').hasClass('on'); }); }

  function applyLearners() {
    var q = $.trim($('[data-ln-q]').val() || ''), g = $('[data-ln-group]').val() || 'all', s = $('[data-ln-status]').val() || 'all';
    var n = 0;
    lnRows().each(function () {
      var $r = $(this);
      var ok = (!q || $r.text().indexOf(q) > -1) && (g === 'all' || $r.attr('data-group') === g) && (s === 'all' || $r.attr('data-status') === s);
      $r.toggle(ok);
      if (ok) n++;
    });
    $('[data-ln-table]').toggle(n > 0);
    $('[data-ln-none]').prop('hidden', n > 0);
    $('[data-ln-count]').text(n);
    $('[data-ln-reset]').prop('hidden', !(q || g !== 'all' || s !== 'all'));
    syncSelection();
  }
  function syncSelection() {
    var sel = lnSelected().length, vis = lnVisible();
    $('[data-ln-bar]').prop('hidden', !sel);
    $('[data-ln-sel]').text(sel);
    $('[data-ln-all]').toggleClass('on', !!vis.length && vis.filter(function () { return $(this).find('[data-ln-cb]').hasClass('on'); }).length === vis.length);
  }
  $(document).on('input change', '[data-ln-q], [data-ln-group], [data-ln-status]', applyLearners);
  $(document).on('click', '[data-ln-cb]', function () { $(this).toggleClass('on'); syncSelection(); });
  $(document).on('click', '[data-ln-all]', function () {
    var on = !$(this).hasClass('on');
    lnVisible().find('[data-ln-cb]').toggleClass('on', on);
    syncSelection();
  });
  $(document).on('click', '[data-ln-clear]', function () { lnRows().find('[data-ln-cb]').removeClass('on'); syncSelection(); });
  $(document).on('click', '[data-ln-reset]', function () {
    $('[data-ln-q]').val(''); $('[data-ln-group], [data-ln-status]').val('all');
    applyLearners();
  });
  $(document).on('change', '[data-ln-move]', function () {
    var n = lnSelected().length, name = $(this).find('option:selected').text().replace(/\s*\(.*\)$/, '');
    if (this.value === '') return;
    toast(n + ' متدرباً نُقلوا إلى ' + name);
    lnRows().find('[data-ln-cb]').removeClass('on');
    $(this).val('');
    syncSelection();
  });

  /* ================= صفحة الدفعة: ملفات الحقيبة ================= */
  function applyKit() {
    var kind = $('[data-kit-kind].solid').attr('data-kit-kind') || 'all', q = $.trim($('[data-kit-search]').val() || '');
    var n = 0;
    $('[data-kit-row]').each(function () {
      var ok = (kind === 'all' || $(this).attr('data-kind') === kind) && (!q || $(this).text().indexOf(q) > -1);
      $(this).toggle(ok);
      if (ok) n++;
    });
    $('[data-kit-none]').prop('hidden', n > 0);
  }
  $(document).on('click', '[data-kit-kind]', function () {
    $('[data-kit-kind]').removeClass('solid').addClass('line');
    $(this).removeClass('line').addClass('solid');
    applyKit();
  });
  $(document).on('input', '[data-kit-search]', applyKit);

  /* ================= بطاقات المجموعات / الوقت / الاختيارات ================= */
  $(document).on('click', '.bw-card > .set-card-h', function (e) {
    if ($(e.target).closest('button, a, input, select, label, [data-popup-open], [data-toast]').length) return;
    var $c = $(this).closest('.bw-card');
    $c.toggleClass('open');
    $c.children('.set-card-b').prop('hidden', !$c.hasClass('open'));
  });
  $(document).on('click', '[data-choose]', function () {
    $(this).siblings('[data-choose]').removeClass('sel');
    $(this).addClass('sel');
  });
  $(document).on('click', '[data-toggle-next]', function () {
    var $n = $(this).next();
    $n.prop('hidden', !$n.prop('hidden'));
  });

  /* ================= نافذة إضافة المتدربين من قائمة الانتظار ================= */
  $(document).on('click', '[data-cbx]', function () { $(this).toggleClass('on'); });
  $(document).on('click', '[data-pick-all]', function () {
    $(this).closest('.drawer').find('[data-cbx]').filter(function () { return $(this).closest('.row').css('display') !== 'none'; }).addClass('on');
  });
  $(document).on('input', '[data-pick-q]', function () {
    var q = $.trim($(this).val());
    $(this).closest('.drawer').find('.row').each(function () { $(this).toggle(!q || $(this).text().indexOf(q) > -1); });
  });

  $(function () {
    if (/^#edit$/.test(location.hash)) $('[data-popup-open="#bwDrawer"]').first().trigger('click');
    if ($('[data-bl-row]').length) applyBatchList();
    if ($('[data-ln-row]').length) applyLearners();
  });
})(jQuery);
