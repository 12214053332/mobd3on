/* Reusable "Add User" wizard controller (drawer #uwDrawer / #uwScrim).
   Any page that includes this file must also include its own copy of the
   drawer markup (title + role-specific step-2 fields already baked in as
   real HTML, matching the role that page manages — trainee/trainer/academic).
   This file only drives step navigation, validation and the save flow; it
   never builds the drawer's markup. Call UserWizard.onSave(fn) to receive
   the newly "saved" user object (fn gets called after the toast fires). */
(function ($) {
  'use strict';

  var STEP_COUNT = 3;
  var step = 0;
  var savedCallback = null;

  function renderSteps() {
    $('#uwSteps .wz-step').each(function () {
      var i = +$(this).data('step');
      $(this).toggleClass('cur', i === step).toggleClass('done', i < step);
      $(this).find('.wz-num').text(i < step ? '✓' : (i + 1));
    });
    $('.uw-step').each(function () {
      $(this).prop('hidden', +$(this).data('step') !== step);
    });
    $('#uwStepTxt').text('الخطوة ' + (step + 1) + ' من ' + STEP_COUNT);
    $('#uwBack').css('visibility', step === 0 ? 'hidden' : 'visible');
    $('#uwNext').text(step === STEP_COUNT - 1 ? 'حفظ المستخدم' : 'التالي');
    if (step === STEP_COUNT - 1) fillReview();
  }

  function fillReview() {
    $('#rv_name').text($('#uw_name').val().trim() || '—');
    $('#rv_email').text($('#uw_email').val().trim() || '—');
    $('#rv_phone').text($('#uw_phone').val().trim() || '—');
    $('#rv_lang').text($('#uw_lang').val() === 'en' ? 'English' : 'العربية');
  }

  function validateStep1() {
    var ok = true;
    var $name = $('#uw_name'), $email = $('#uw_email'), $pass = $('#uw_pass');
    if (!$name.val().trim()) { $name.addClass('err'); $('#err_uwName').addClass('show'); ok = false; }
    else { $name.removeClass('err'); $('#err_uwName').removeClass('show'); }
    var emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test($email.val().trim());
    if (!emailOk) { $email.addClass('err'); $('#err_uwEmail').addClass('show'); ok = false; }
    else { $email.removeClass('err'); $('#err_uwEmail').removeClass('show'); }
    if (!$pass.val().trim()) { $pass.addClass('err'); $('#err_uwPass').addClass('show'); ok = false; }
    else { $pass.removeClass('err'); $('#err_uwPass').removeClass('show'); }
    return ok;
  }

  function initials(name) {
    var parts = (name || '؟').trim().split(/\s+/).slice(0, 2);
    return parts.map(function (w) { return w[0]; }).join('‍');
  }

  function open() {
    step = 0;
    $('#uw_name, #uw_email, #uw_phone, #uw_pass').val('').removeClass('err');
    $('#uw_lang').val('ar');
    $('.inp-error').removeClass('show');
    renderSteps();
    $('#uwScrim, #uwDrawer').addClass('open');
    setTimeout(function () { $('#uw_name').trigger('focus'); }, 260);
  }

  function close() {
    $('#uwScrim, #uwDrawer').removeClass('open');
    $('#uwDrawer').removeClass('full');
  }

  function submit() {
    var $btn = $('#uwNext');
    var orig = $btn.text();
    $btn.text('جاري الحفظ…').prop('disabled', true).css('opacity', .7);
    setTimeout(function () {
      $btn.text(orig).prop('disabled', false).css('opacity', 1);
      var name = $('#uw_name').val().trim();
      var user = {
        id: Date.now(),
        name: name,
        email: $('#uw_email').val().trim(),
        phone: $('#uw_phone').val().trim(),
        av: initials(name)
      };
      close();
      App.toast('تمت إضافة المستخدم بنجاح', name);
      if (typeof savedCallback === 'function') savedCallback(user);
    }, 700);
  }

  function bind() {
    $('#uwScrim, #uwClose, #uwCancel').on('click', close);
    $('#uwFull').on('click', function () { $('#uwDrawer').toggleClass('full'); });
    $('#uwBack').on('click', function () { if (step > 0) { step--; renderSteps(); } });
    $('#uwNext').on('click', function () {
      if (step === 0 && !validateStep1()) return;
      if (step < STEP_COUNT - 1) { step++; renderSteps(); }
      else { submit(); }
    });
  }

  window.UserWizard = {
    open: open,
    close: close,
    onSave: function (fn) { savedCallback = fn; }
  };

  $(bind);
})(jQuery);
