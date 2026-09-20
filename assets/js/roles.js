/* admin/roles.html: table search + export toast, and the permission drawer's module cards
   (header click = open/close, «تحديد الكل» = tick/untick that module's checkboxes).
   The table, the drawer and the delete dialog are static HTML (popups.js opens/closes them). */
(function ($) {
  'use strict';

  function applySearch() {
    var q = $.trim($('#roleSearch').val()), shown = 0, total = $('#roleTbody > tr').length;
    $('#roleTbody > tr').each(function () {
      var ok = !q || $(this).text().indexOf(q) > -1;
      $(this).toggle(ok);
      if (ok) shown++;
    });
    $('#roleShown').text(shown);
    $('#roleTotal').text(total);
    $('#roleEmpty').prop('hidden', shown > 0);
  }

  $(function () {
    $('#roleDrawer').on('click', '.perm-mod > :first-child', function () {
      $(this).closest('.perm-mod').toggleClass('collapsed');
    });
    $('#roleDrawer').on('click', '[data-all]', function (e) {
      e.stopPropagation();
      var $boxes = $(this).closest('.perm-mod').find('input[type=checkbox]');
      $boxes.prop('checked', $boxes.filter(':not(:checked)').length > 0);
    });
    $('#roleSearch').on('input', applySearch);
    $('#exportBtn').on('click', function () { App.toast('تم تجهيز ملف التصدير', 'سيبدأ التنزيل تلقائياً'); });
  });
})(jQuery);
