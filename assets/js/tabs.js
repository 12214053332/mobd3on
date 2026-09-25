/* Workspace pages: tab switching between panels ([data-panel]) that already exist in the HTML.
   Also drives the website homepage builder's section list ([data-tab] on .wb-sec rows) — each page
   has at most one such group, so a single global handler is enough. Nested actions (toggle a section's
   visibility, an inline toast button) keep their own click and don't trigger the tab switch. */
(function ($) {
  'use strict';
  $(document).on('click', '[data-tab]', function (e) {
    if ($(e.target).closest('a, button, input, [data-toast], .wb-vis').length) return;
    var $tab = $(this);
    var t = $tab.data('tab');
    $('[data-tab]').removeClass('active sel').attr('aria-selected', 'false');
    $tab.addClass($tab.is('.wb-sec') ? 'sel' : 'active').attr('aria-selected', 'true');
    $('[data-panel]').prop('hidden', true).filter('[data-panel="' + t + '"]').prop('hidden', false);
  });
})(jQuery);
