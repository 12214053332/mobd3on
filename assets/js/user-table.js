/* Shared behavior for the user-management list pages (trainees / trainers / academic staff).
   The page's table and toolbar are real HTML; this file only reacts to them.
   The add-user drawer is static HTML that popups.js opens and closes.
   Per-page settings come from <body data-unit="متدرب" data-view-base="users/trainee-">. */
(function ($) {
  'use strict';

  var selected = new Set();
  var TOGGLABLE_COLS = ['photo', 'email', 'phone', 'status', 'created', 'last'];
  var unit = document.body.getAttribute('data-unit') || 'مستخدم';
  var activeStatus = 'all';

  /* ---- search + status filter ---- */
  function applyFilters() {
    var q = $('#userSearch').val().trim().toLowerCase();
    var shown = 0;
    $('#userTbody > tr').each(function () {
      var $row = $(this);
      var matchesStatus = activeStatus === 'all' || $row.attr('data-status') === activeStatus;
      var text = $row.find('.cell-name').text().toLowerCase() + ' ' +
        $row.find('[data-col="email"]').text().toLowerCase() + ' ' +
        $row.find('[data-col="phone"]').text().toLowerCase();
      var visible = matchesStatus && (!q || text.indexOf(q) > -1);
      $row.toggle(visible);
      if (visible) shown++;
    });
    $('#tfootShown').text(shown ? ('1–' + shown) : '0');
    $('#userEmpty').prop('hidden', shown > 0);
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
      $('#userTableCard').toggleClass('hide-col-' + col, willTurnOff);
    });
  }

  /* ---- row + bulk selection ---- */
  function renderBulkBar() {
    var n = selected.size;
    if (!n) { $('#bulkBar').empty(); return; }
    var $bar = $(
      '<div class="bulk-bar mb-4 py-2.5 px-4 gap-3 rounded-lg flex items-center bg-primary-800 text-white d768:flex-wrap"><span class="cnt text-[14px] font-bold"></span><div class="bulk-actions ms-auto gap-2 flex d768:ms-0 d768:flex-wrap">' +
        '<button type="button" class="bulk-btn py-0 px-3.5 gap-1.5 rounded-md h-[34px] text-[13px] font-bold bg-[rgba(255,255,255,.12)] text-white inline-flex items-center hover:bg-[rgba(255,255,255,.2)]" data-bulk="تفعيل">تفعيل</button>' +
        '<button type="button" class="bulk-btn py-0 px-3.5 gap-1.5 rounded-md h-[34px] text-[13px] font-bold bg-[rgba(255,255,255,.12)] text-white inline-flex items-center hover:bg-[rgba(255,255,255,.2)]" data-bulk="تعطيل">تعطيل</button>' +
        '<button type="button" class="bulk-btn py-0 px-3.5 gap-1.5 rounded-md h-[34px] text-[13px] font-bold bg-[rgba(255,255,255,.12)] text-white inline-flex items-center hover:bg-[rgba(255,255,255,.2)]" data-bulk="تصدير">تصدير</button>' +
        '<button type="button" class="bulk-btn py-0 px-3.5 gap-1.5 rounded-md h-[34px] text-[13px] font-bold bg-[rgba(255,255,255,.12)] text-white inline-flex items-center hover:bg-error-700" data-bulk="حذف">حذف</button>' +
        '<button type="button" class="bulk-btn py-0 px-3.5 gap-1.5 rounded-md h-[34px] text-[13px] font-bold bg-[rgba(255,255,255,.12)] text-white inline-flex items-center hover:bg-[rgba(255,255,255,.2)]" id="bulkClear">إلغاء التحديد</button>' +
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
      App.toast('تم تطبيق «' + $(this).data('bulk') + '» على ' + selected.size + ' ' + unit);
      clearSelection();
    });
  }

  /* ---- row actions + row click (view page) ---- */
  function bindRowActions() {
    $(document).on('click', '.act-btn[data-action]', function () {
      var action = $(this).data('action');
      var $row = $(this).closest('tr');
      var name = $row.find('.cell-name').text();
      if (action === 'toggle') {
        var toActive = $row.attr('data-status') !== 'active';
        $row.attr('data-status', toActive ? 'active' : 'suspended');
        $row.find('[data-col="status"] .pill').attr('class', 'pill ' + (toActive ? 'ok' : 'archived')).text(toActive ? 'نشط' : 'معطّل');
        App.toast(toActive ? 'تم تفعيل المستخدم' : 'تم تعطيل المستخدم', name);
      } else if (action === 'view') {
        App.toast('صفحة العرض تُنشأ بعد حفظ المستخدم في النظام', name);
      } else if (action === 'edit') {
        App.toast('تعديل المستخدم', name);
      } else if (action === 'reset') {
        App.toast('تم إرسال رابط إعادة تعيين كلمة المرور', name);
      } else if (action === 'delete') {
        App.toast('تم حذف المستخدم', name);
      }
    });
  }

  $(function () {
    $('#userSearch').on('input', applyFilters);
    $('.toolbar .chip[data-filter]').on('click', function () {
      $('.toolbar .chip[data-filter]').removeClass('on');
      $(this).addClass('on');
      activeStatus = $(this).data('filter');
      applyFilters();
    });
    bindColumnVisibility();
    bindSelection();
    bindRowActions();
    $('#exportBtn, #exportBtn2').on('click', function () {
      App.toast('تم تجهيز ملف التصدير', 'سيبدأ التنزيل تلقائياً');
    });
  });
})(jQuery);
