/* User workspace page: tab switching between panels that already exist in the HTML. */
(function ($) {
  'use strict';
  $(function () {
    $('.sec-tab[data-tab]').on('click', function () {
      var t = $(this).data('tab');
      $('.sec-tab[data-tab]').removeClass('active').attr('aria-selected', 'false');
      $(this).addClass('active').attr('aria-selected', 'true');
      $('.uws-panel').prop('hidden', true).filter('[data-panel="' + t + '"]').prop('hidden', false);
    });
  });
})(jQuery);
