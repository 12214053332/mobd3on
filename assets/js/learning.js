/* "التعلم" group pages (waitlist, placement exams, course categories, virtual classrooms):
   list search + status filter, category tree collapse, and small pick/accordion toggles.
   Everything else on those pages is static HTML (popups.js opens/closes the dialogs and drawers, tabs.js switches tabs). */
(function ($) {
  'use strict';

  /* ---- search box + status chips over the first table on the page ---- */
  function applyFilters() {
    var q = $.trim($('[data-table-search]').val() || '').toLowerCase();
    var status = $('.toolbar .chip.on[data-filter]').attr('data-filter') || 'all';
    var shown = 0;
    var $rows = $('.table-card tbody tr');
    $rows.each(function () {
      var $r = $(this);
      var ok = (status === 'all' || $r.attr('data-status') === status) &&
               (!q || $r.text().toLowerCase().indexOf(q) > -1);
      $r.toggle(ok);
      if (ok) shown++;
    });
    $('[data-shown-count]').text(shown);
  }

  $(function () {
    $('[data-table-search]').on('input', applyFilters);
    $('.toolbar').on('click', '.chip[data-filter]', function () {
      $('.toolbar .chip[data-filter]').removeClass('on');
      $(this).addClass('on');
      applyFilters();
    });

    /* category tree: the arrow collapses / expands the rows of its children */
    $(document).on('click', '[data-tree-toggle]', function (e) {
      e.stopPropagation();
      var $row = $(this).closest('tr.tree-row');
      var collapse = !$row.hasClass('collapsed-parent');
      $row.toggleClass('collapsed-parent', collapse);
      $row.nextUntil('tr.tree-row:not(.child)', 'tr.child').prop('hidden', collapse);
    });

    /* accordion cards: click the header to open / close */
    $(document).on('click', '[data-toggle-parent]', function () {
      $(this).parent().toggleClass('open');
    });

    /* tick-list rows (document request dialog) */
    $(document).on('click', '[data-pick]', function () {
      var on = !$(this).hasClass('on');
      $(this).toggleClass('on', on).find('.cbx-cell').toggleClass('on', on);
    });
  });
})(jQuery);
