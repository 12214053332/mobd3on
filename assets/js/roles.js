/* admin/roles.html: table search + export toast.
   The table, the permission drawer and the delete dialog are static HTML (popups.js opens/closes them). */
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
    $('#roleSearch').on('input', applySearch);
    $('#exportBtn').on('click', function () { App.toast('تم تجهيز ملف التصدير', 'سيبدأ التنزيل تلقائياً'); });
  });
})(jQuery);
