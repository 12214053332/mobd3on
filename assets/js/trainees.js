/* admin/trainees.html: table search/filter/columns/bulk-select + the Add Trainee wizard.
   All markup already exists as static HTML — this file only reacts to it. */
(function ($) {
  'use strict';

  var selected = new Set();
  var TOGGLABLE_COLS = ['photo', 'email', 'phone', 'status', 'created', 'last'];

  /* ---- search + status filter ---- */
  var activeStatus = 'all';
  function applyFilters() {
    var q = $('#traineeSearch').val().trim().toLowerCase();
    var shown = 0;
    $('#traineeTbody > tr').each(function () {
      var $row = $(this);
      var matchesStatus = activeStatus === 'all' || $row.data('status') === activeStatus;
      var text = $row.find('.cell-name').text().toLowerCase() + ' ' +
        $row.find('[data-col="email"]').text().toLowerCase() + ' ' +
        $row.find('[data-col="phone"]').text().toLowerCase();
      var matchesSearch = !q || text.indexOf(q) > -1;
      var visible = matchesStatus && matchesSearch;
      $row.toggle(visible);
      if (visible) shown++;
    });
    $('#tfootShown').text(shown ? ('1–' + shown) : '0');
  }

  function bindSearch() {
    $('#traineeSearch').on('input', applyFilters);
  }

  function bindStatusChips() {
    $('.toolbar .chip[data-filter]').on('click', function () {
      $('.toolbar .chip[data-filter]').removeClass('on');
      $(this).addClass('on');
      activeStatus = $(this).data('filter');
      applyFilters();
    });
  }

  /* ---- column visibility ---- */
  function bindColumnVisibility() {
    $(document).on('click', '#colVisMenu .menu-item', function () {
      var col = $(this).data('col');
      var willTurnOff = $(this).hasClass('on');
      if (willTurnOff) {
        var onCount = 0;
        TOGGLABLE_COLS.forEach(function (c) {
          if ($('#colVisMenu .menu-item[data-col="' + c + '"]').hasClass('on')) onCount++;
        });
        if (onCount <= 1) { App.toast('يجب إبقاء عمود واحد على الأقل'); return; }
      }
      $(this).toggleClass('on');
      $('#traineeTableCard').toggleClass('hide-col-' + col, willTurnOff);
    });
  }

  /* ---- row + bulk selection ---- */
  function renderBulkBar() {
    var n = selected.size;
    if (!n) { $('#bulkBar').empty(); return; }
    var $bar = $(
      '<div class="bulk-bar"><span class="cnt"></span><div class="bulk-actions">' +
        '<button type="button" class="bulk-btn" data-bulk="تفعيل">تفعيل</button>' +
        '<button type="button" class="bulk-btn" data-bulk="تعطيل">تعطيل</button>' +
        '<button type="button" class="bulk-btn" data-bulk="تصدير">تصدير</button>' +
        '<button type="button" class="bulk-btn danger" data-bulk="حذف">حذف</button>' +
        '<button type="button" class="bulk-btn" id="bulkClear">إلغاء التحديد</button>' +
      '</div></div>'
    );
    $bar.find('.cnt').text(n + ' محدد');
    $('#bulkBar').empty().append($bar);
  }

  function clearSelection() {
    selected.clear();
    $('.um-cbx, #umSelAll').removeClass('on');
    renderBulkBar();
  }

  function bindSelection() {
    $(document).on('click', '.um-cbx', function () {
      var id = $(this).data('id');
      if (selected.has(id)) { selected.delete(id); $(this).removeClass('on'); }
      else { selected.add(id); $(this).addClass('on'); }
      renderBulkBar();
    });
    $('#umSelAll').on('click', function () {
      var $boxes = $('.um-cbx:visible');
      var allOn = $boxes.length && $boxes.filter('.on').length === $boxes.length;
      if (allOn) {
        $boxes.removeClass('on').each(function () { selected.delete($(this).data('id')); });
        $(this).removeClass('on');
      } else {
        $boxes.addClass('on').each(function () { selected.add($(this).data('id')); });
        $(this).addClass('on');
      }
      renderBulkBar();
    });
    $(document).on('click', '#bulkClear', clearSelection);
    $(document).on('click', '.bulk-btn[data-bulk]', function () {
      App.toast('تم تطبيق «' + $(this).data('bulk') + '» على ' + selected.size + ' متدرب');
      clearSelection();
    });
  }

  /* ---- row actions ---- */
  function bindRowActions() {
    $(document).on('click', '.act-btn[data-action]', function () {
      var action = $(this).data('action');
      var $row = $(this).closest('tr');
      var name = $row.find('.cell-name').text();
      if (action === 'toggle') {
        var toActive = $row.data('status') !== 'active';
        var $pill = $row.find('[data-col="status"] .pill');
        $row.attr('data-status', toActive ? 'active' : 'suspended').data('status', toActive ? 'active' : 'suspended');
        $pill.attr('class', 'pill ' + (toActive ? 'ok' : 'archived')).text(toActive ? 'نشط' : 'معطّل');
        App.toast(toActive ? 'تم تفعيل المستخدم' : 'تم تعطيل المستخدم', name);
      } else if (action === 'view') {
        App.toast('صفحة الملف الشخصي قيد الإنشاء', name);
      } else if (action === 'edit') {
        App.toast('تعديل المستخدم', name);
      } else if (action === 'reset') {
        App.toast('تم إرسال رابط إعادة تعيين كلمة المرور', name);
      } else if (action === 'delete') {
        App.toast('تم حذف المستخدم', name);
      }
    });
  }

  /* ---- Add Trainee wizard: step/validation mechanics live in user-wizard.js;
     this page only supplies the trigger button and what happens after saving. ---- */
  function addRowToTable(u) {
    var $row = $(
      '<tr data-id="' + u.id + '" data-status="pending">' +
        '<td data-col="cbx"><span class="cbx-cell um-cbx" data-id="' + u.id + '"></span></td>' +
        '<td data-col="photo"><span class="cell-avatar">' + u.av + '</span></td>' +
        '<td data-col="name"><span class="cell-name">' + u.name + '</span></td>' +
        '<td data-col="email" dir="ltr" style="text-align:start">' + u.email + '</td>' +
        '<td data-col="phone" class="mono" dir="ltr" style="text-align:start">' + (u.phone || '—') + '</td>' +
        '<td data-col="status"><span class="pill warn">بانتظار التفعيل</span></td>' +
        '<td data-col="created" class="mono">الآن</td>' +
        '<td data-col="last" class="mono">لم يسجّل بعد</td>' +
        '<td data-col="actions" style="text-align:end"><div class="row-act">' +
          '<button type="button" class="act-btn" title="عرض" aria-label="عرض" data-action="view"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg></button>' +
          '<button type="button" class="act-btn" title="تعديل" aria-label="تعديل" data-action="edit"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg></button>' +
          '<button type="button" class="act-btn" title="تعطيل/تفعيل" aria-label="تعطيل أو تفعيل" data-action="toggle"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64A9 9 0 1 1 5.64 6.64M12 2v10"/></svg></button>' +
          '<button type="button" class="act-btn" title="إعادة تعيين كلمة المرور" aria-label="إعادة تعيين كلمة المرور" data-action="reset"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></button>' +
          '<button type="button" class="act-btn act-danger" title="حذف" aria-label="حذف" data-action="delete"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6"/></svg></button>' +
        '</div></td>' +
      '</tr>'
    );
    $('#traineeTbody').prepend($row);
    var total = $('#traineeTbody > tr').length;
    $('#tfootTotal').text(total);
    applyFilters();
  }

  function bindWizard() {
    $('#addTraineeBtn').on('click', UserWizard.open);
    UserWizard.onSave(addRowToTable);
  }

  function bindExport() {
    $('#exportBtn, #exportBtn2').on('click', function () {
      App.toast('تم تجهيز ملف التصدير', 'سيبدأ التنزيل تلقائياً');
    });
  }

  $(function () {
    bindSearch();
    bindStatusChips();
    bindColumnVisibility();
    bindSelection();
    bindRowActions();
    bindWizard();
    bindExport();
  });
})(jQuery);
