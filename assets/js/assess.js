/* "الاختبارات وبنك الأسئلة" + "الشهادات" pages: table search + chip filters (one or several
   independent groups on the same toolbar, e.g. النوع/الصعوبة أو النتيجة/الحالة). Everything else on
   these pages is static HTML — popups.js opens/closes the drawers and dialogs, tabs.js switches tabs. */
(function ($) {
  'use strict';

  /* a chip's filter key: the bare `data-filter` attribute means "status"; `data-filter-xxx` means "xxx" */
  function filterKey(el) {
    var key = null;
    $.each(el.attributes, function () {
      if (this.name === 'data-filter') key = 'status';
      else if (this.name.indexOf('data-filter-') === 0) key = this.name.slice('data-filter-'.length);
    });
    return key;
  }
  function filterValue(el, key) {
    return key === 'status' && el.hasAttribute('data-filter') ? el.getAttribute('data-filter') : el.getAttribute('data-filter-' + key);
  }

  function activeFilters() {
    var filters = {};
    $('.toolbar .chip.on, .ml-folder.sel').each(function () {
      var key = filterKey(this);
      if (key) filters[key] = filterValue(this, key);
    });
    return filters;
  }

  /* rows are normally `.table-card tbody tr`; the media library's grid view uses `.ml-tile` cards instead */
  function applyFilters() {
    var q = $.trim($('[data-table-search]').val() || '').toLowerCase();
    var filters = activeFilters();
    var shown = 0;
    $('.table-card tbody tr, .ml-grid .ml-tile').each(function () {
      var $r = $(this);
      var ok = true;
      $.each(filters, function (key, val) {
        if (val !== 'all' && $r.attr('data-' + key) !== val) ok = false;
      });
      if (ok && q) ok = $r.text().toLowerCase().indexOf(q) > -1;
      $r.toggle(ok);
      if (ok) shown++;
    });
    $('[data-shown-count]').text(shown);
  }

  $(function () {
    $('[data-table-search]').on('input', applyFilters);
    $(document).on('click', '.toolbar .chip[data-filter], .toolbar .chip[data-filter-type], .toolbar .chip[data-filter-diff], .toolbar .chip[data-filter-result], .toolbar .chip[data-filter-status], .ml-folder[data-filter-folder]', function () {
      var key = filterKey(this);
      if (!key) return;
      var attr = this.hasAttribute('data-filter') ? 'data-filter' : 'data-filter-' + key;
      var $group = $(this).hasClass('ml-folder') ? $('.ml-folder[' + attr + ']') : $('.toolbar .chip[' + attr + ']');
      $group.removeClass('on sel');
      $(this).addClass($(this).hasClass('ml-folder') ? 'sel' : 'on');
      applyFilters();
    });
  });
})(jQuery);
