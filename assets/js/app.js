/* Global site behavior: sidebar/topbar interactions, toasts.
   This file never builds page markup — the sidebar and topbar are real HTML
   already inlined in every page (kept in sync with /components/*.html); this
   file only wires up interaction on markup that already exists in the DOM
   (collapse, dropdowns, active-state, etc). Pages are opened directly via
   file:// so no XHR-based component loading (jQuery .load/$.ajax) is used —
   Chrome blocks those requests for local files. */
(function ($) {
  'use strict';

  var App = window.App = window.App || {};

  /* ---- Sidebar: mark the active item + open its parent group ---- */
  function markActiveNav() {
    var key = document.body.getAttribute('data-navkey');
    if (!key) return;
    var $item = $('#nav [data-key="' + key + '"]');
    if (!$item.length) return;
    $item.addClass('active').attr('aria-current', 'page');
    var $group = $item.closest('.nav-group');
    if ($group.length) {
      $group.addClass('open').removeClass('collapsed');
      $group.find('> .nav-parent').attr('aria-expanded', 'true');
    }
  }

  /* ---- Sidebar: collapsible nested groups (accordion) ---- */
  function bindNavGroups() {
    $(document).on('click', '.nav-parent', function () {
      var $group = $(this).closest('.nav-group');
      var open = $group.hasClass('open');
      $group.toggleClass('open', !open).toggleClass('collapsed', open);
      $(this).attr('aria-expanded', String(!open));
    });
  }

  /* ---- Sidebar: manual collapse-to-icon-rail toggle (desktop) ---- */
  function bindCollapseBtn() {
    $(document).on('click', '#collapseBtn', function () {
      $('.shell').toggleClass('force-rail');
    });
  }

  /* ---- Sidebar: off-canvas open/close on tablet + mobile ---- */
  function setMenu(open) {
    $('#sidebar').toggleClass('open', open);
    $('#sidebarScrim').toggleClass('open', open);
    $('body').toggleClass('menu-open', open);
    $('#menuToggle').attr('aria-expanded', String(open));
  }
  function bindMobileSidebar() {
    $(document).on('click', '#menuToggle', function () { setMenu(!$('#sidebar').hasClass('open')); });
    $(document).on('click', '#sidebarScrim', function () { setMenu(false); });
    $(document).on('click', '#sidebar a[href]', function () { setMenu(false); });
    $(document).on('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    $(window).on('resize', function () { if (window.innerWidth > 1024) setMenu(false); });
  }

  /* ---- Topbar: "preview as" role dropdown ---- */
  function bindRoleSwitch() {
    $(document).on('click', '#roleBtn', function (e) {
      e.stopPropagation();
      var open = $('#roleMenu').toggleClass('open').hasClass('open');
      $(this).attr('aria-expanded', String(open));
    });
    $(document).on('click', function () {
      $('#roleMenu').removeClass('open');
      $('#roleBtn').attr('aria-expanded', 'false');
    });
    $(document).on('click', '#roleMenu', function (e) { e.stopPropagation(); });
  }

  /* ---- Generic dropdown menus (.menu-wrap > .menu), used by future filter/column-visibility UIs ---- */
  function bindGenericMenus() {
    $(document).on('click', '.menu-wrap > button', function (e) {
      e.stopPropagation();
      var $menu = $(this).siblings('.menu');
      var open = $menu.toggleClass('open').hasClass('open');
      $('.menu.open').not($menu).removeClass('open');
      $(this).attr('aria-expanded', String(open));
    });
    $(document).on('click', function () { $('.menu.open').removeClass('open'); });
    $(document).on('click', '.menu', function (e) { e.stopPropagation(); });
  }

  /* ---- Toast notifications (used by forms across the site) ---- */
  App.toast = function (title, sub) {
    var $wrap = $('#toastWrap');
    if (!$wrap.length) {
      $wrap = $('<div class="fixed bottom-6 start-6 z-[90] flex flex-col gap-2.5" id="toastWrap"></div>').appendTo('body');
    }
    var $t = $(
      '<div class="toast min-w-[280px] py-3.5 px-[18px] gap-3 border-y border-l border-s-4 border-y-guide border-l-guide border-s-success-700 rounded-md flex items-center bg-surface shadow-md [animation:slideIn_.24s_ease]" role="status">' +
        '<span class="w-8 h-8 rounded-full bg-success-bg text-success-700 grid place-items-center shrink-0">' +
          '<svg class="w-4 h-4 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l2 2 4-4"/><rect x="4" y="3" width="16" height="18" rx="2"/></svg>' +
        '</span>' +
        '<div><div class="t-txt text-[14px] font-bold"></div>' + (sub ? '<div class="t-sub text-[12px] text-ink-2 font-normal"></div>' : '') + '</div>' +
      '</div>'
    );
    $t.find('.t-txt').text(title || '');
    if (sub) $t.find('.t-sub').text(sub);
    $wrap.append($t);
    setTimeout(function () {
      $t.fadeOut(200, function () { $t.remove(); });
    }, 3200);
  };

  /* ---- Toggle switches (.toggle) ---- */
  function bindToggles() {
    $(document).on('click', '.toggle', function () {
      var on = !$(this).hasClass('on');
      $(this).toggleClass('on', on).attr('aria-checked', String(on));
    });
    $(document).on('keydown', '.toggle', function (e) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); $(this).trigger('click'); }
    });
  }

  /* ---- Any element with data-toast="..." shows a toast on click ---- */
  function bindToastButtons() {
    $(document).on('click', '[data-toast]', function (e) {
      e.preventDefault();
      App.toast($(this).data('toast'), $(this).data('toast-sub'));
    });
  }

  /* ---- Table rows with data-href navigate to that page (links / buttons / checkboxes inside keep their own action) ---- */
  function bindRowLinks() {
    $(document).on('click', 'tr[data-href]', function (e) {
      if ($(e.target).closest('a, button, .cbx-cell').length) return;
      window.location.href = $(this).data('href');
    });
  }

  $(function () {
    markActiveNav();
    bindRowLinks();
    bindToggles();
    bindToastButtons();
    bindNavGroups();
    bindCollapseBtn();
    bindMobileSidebar();
    bindRoleSwitch();
    bindGenericMenus();
  });
})(jQuery);
