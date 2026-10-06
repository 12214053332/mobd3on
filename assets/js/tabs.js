/* Workspace pages: tab switching between panels ([data-panel]) that already exist in the HTML.
   Also drives rows that act as tabs (the website homepage builder's section list, the LMS tool tabs).
   Each page has one tab group, so a single global handler is enough; every element sharing the clicked
   data-tab (e.g. a "resources" shortcut button next to the real tab) is marked active together.
   Nested actions inside a tab row (a visibility toggle, an inline toast button) keep their own click.
   A #hash that names a tab (programs/SE.html#certificate) opens that tab on load. */
(function ($) {
  'use strict';

  function activate($tab) {
    var t = $tab.attr('data-tab');
    $('[data-tab]').removeClass('active sel').attr('aria-selected', 'false');
    $('[data-tab="' + t + '"]').each(function () {
      $(this).addClass($(this).is('.wb-sec') ? 'sel' : 'active').attr('aria-selected', 'true');
    });
    $('[data-panel]').prop('hidden', true).filter('[data-panel="' + t + '"]').prop('hidden', false);
  }

  $(document).on('click', '[data-tab]', function (e) {
    var $hit = $(e.target).closest('a, button, input, [data-toast], .wb-vis');
    if ($hit.length && $hit[0] !== this && $.contains(this, $hit[0])) return;
    activate($(this));
  });

  $(function () {
    var h = (location.hash || '').slice(1);
    if (/^\w+$/.test(h)) {
      var $t = $('[data-tab="' + h + '"]').first();
      if ($t.length) activate($t);
    }
  });
})(jQuery);
