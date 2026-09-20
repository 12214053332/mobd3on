/* Popups (drawers + confirm dialogs) — open / close only.
   Every popup is plain HTML that already sits in the page; nothing here builds, fills,
   validates or conditionally shows/hides/disables anything inside it.

   Markup contract
     open     any element with   data-popup-open="#popupId"
     close    any element inside a popup with   data-popup-close   (also: scrim click, Esc)
     drawer   <div class="scrim"></div><aside class="drawer" id="…">   (scrim = previous sibling)
     dialog   <div class="dlg-scrim" id="…"><div class="dlg">…</div></div>
     wizard   a drawer with .wz-steps — the steps just switch the visible panel (design preview):
                [data-wz="prev"]   back  (data-wz-first="إلغاء": at step 1 it becomes a cancel button)
                [data-wz="next"]   next  (data-wz-save="حفظ": on the last step it becomes a save button that closes)
                [data-wz-last]     footer buttons that appear on the last step only
                [data-wz-count]    "الخطوة X من N" label
     expand   [data-popup-full] toggles .full on its drawer */
(function ($) {
  'use strict';

  var POPUPS = '.drawer, .dlg-scrim';

  function scrimOf($p) { return $p.is('.drawer') ? $p.prev('.scrim') : $(); }

  /* ---------- wizard step preview ---------- */
  function goStep($d, i) {
    var $steps = $d.find('.wz-steps .wz-step');
    var $panels = $d.find('.dr-body [data-step]');
    var n = $steps.length;
    i = Math.max(0, Math.min(n - 1, i));
    $d.data('wzStep', i);

    $steps.each(function (k) {
      $(this).toggleClass('cur', k === i).toggleClass('done', k < i);
      $(this).find('.wz-num').text(k < i ? '✓' : k + 1);
    });
    $panels.each(function (k) { $(this).prop('hidden', k !== i); });

    var $prev = $d.find('[data-wz="prev"]');
    if ($prev.attr('data-wz-first')) {
      $prev.text(i === 0 ? $prev.attr('data-wz-first') : 'السابق');
    } else {
      $prev.css('visibility', i === 0 ? 'hidden' : 'visible');
    }

    var $next = $d.find('[data-wz="next"]');
    var last = i === n - 1;
    if ($next.attr('data-wz-save')) {
      if (!$next.data('label')) $next.data('label', $next.text());
      $next.text(last ? $next.attr('data-wz-save') : $next.data('label'));
    } else {
      $next.prop('hidden', last);
    }
    $d.find('[data-wz-last]').prop('hidden', !last);
    $d.find('[data-wz-count]').text('الخطوة ' + (i + 1) + ' من ' + n);
    $d.find('.dr-body').scrollTop(0);
  }

  /* ---------- open / close ---------- */
  function open(sel) {
    var $p = $(sel);
    if (!$p.length) return;
    if ($p.is('.drawer')) {
      if (!$p.data('wz0')) $p.data('wz0', { full: $p.hasClass('full') });
      if ($p.find('.wz-steps').length) goStep($p, 0);
    }
    $p.addClass('open');
    scrimOf($p).addClass('open');
  }

  function close($p) {
    $p.removeClass('open');
    scrimOf($p).removeClass('open');
    var init = $p.data('wz0');
    if (init) $p.toggleClass('full', init.full);
  }

  $(function () {
    $(document).on('click', '[data-popup-open]', function () { open($(this).attr('data-popup-open')); });
    $(document).on('click', '[data-popup-close]', function () { close($(this).closest(POPUPS)); });
    $(document).on('click', '.scrim', function () { close($(this).next('.drawer')); });
    $(document).on('click', '.dlg-scrim', function (e) { if (e.target === this) close($(this)); });
    $(document).on('click', '[data-popup-full]', function () { $(this).closest('.drawer').toggleClass('full'); });
    $(document).on('keydown', function (e) { if (e.key === 'Escape') close($(POPUPS).filter('.open')); });

    $(document).on('click', '.drawer .wz-step', function () {
      var $d = $(this).closest('.drawer');
      goStep($d, $d.find('.wz-steps .wz-step').index(this));
    });
    $(document).on('click', '[data-wz="prev"]', function () {
      var $d = $(this).closest('.drawer'), i = $d.data('wzStep') || 0;
      if (i === 0) close($d); else goStep($d, i - 1);
    });
    $(document).on('click', '[data-wz="next"]', function () {
      var $d = $(this).closest('.drawer'), i = $d.data('wzStep') || 0;
      if (i >= $d.find('.wz-steps .wz-step').length - 1) close($d); else goStep($d, i + 1);
    });
  });
})(jQuery);
