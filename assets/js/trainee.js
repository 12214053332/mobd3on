/* بوابة المتدرب: تفاعلات واجهة فقط فوق HTML ثابت موجود في الصفحة (لا بناء للصفحات هنا).
   - [data-mp-filter] / [data-mp-search]  : فلترة بطاقات «برامجي ودوراتي» (data-status على كل بطاقة)
   - [data-collapse-next]                 : طيّ/فتح المحتوى التالي لعنوان البطاقة (data-collapse-siblings: كل ما يلي العنوان داخل نفس المجموعة)
   - [data-quiz-opt]                      : اختيار إجابة واحدة داخل سؤال (درس تعليمي أو اختبار)
   - [data-exam-start|go|nav]             : التنقل بين شاشة تعليمات الاختبار وأسئلته ([data-exam-panel])
   - [data-help-go]                       : التنقل داخل مركز المساعدة بين الشاشات ([data-help-panel]) */
(function ($) {
  'use strict';

  /* ---- my programs: status chips + search over the cards of both views ---- */
  function applyPrograms() {
    var f = $('[data-mp-filter].on').attr('data-mp-filter') || 'all';
    var q = $.trim($('[data-mp-search]').val() || '').toLowerCase();
    $('[data-mp-item]').each(function () {
      var $c = $(this);
      var ok = (f === 'all' || (' ' + $c.attr('data-status') + ' ').indexOf(' ' + f + ' ') > -1) &&
               (!q || $c.text().toLowerCase().indexOf(q) > -1);
      $c.toggle(ok);
    });
  }

  $(document).on('click', '[data-mp-filter]', function () {
    $('[data-mp-filter]').removeClass('on');
    $(this).addClass('on');
    applyPrograms();
  });
  $(document).on('input', '[data-mp-search]', applyPrograms);

  /* ---- collapsible cards / course groups ---- */
  $(document).on('click', '[data-collapse-next]', function (e) {
    if ($(e.target).closest('[data-collapse-next]')[0] !== this) return;
    var $t = $(this).next();
    if (!$t.length) $t = $(this).parent().next();
    $t.prop('hidden', !$t.prop('hidden'));
  });
  $(document).on('click', '[data-collapse-siblings]', function () {
    var $s = $(this).nextAll();
    $s.prop('hidden', !$s.first().prop('hidden'));
  });

  /* ---- single-choice answers ---- */
  $(document).on('click', '[data-quiz-opt]', function () {
    $(this).siblings('[data-quiz-opt]').removeClass('sel');
    $(this).addClass('sel');
  });

  /* ---- exam runner: intro → questions (panels already in the page) ---- */
  function showExam(name) {
    $('[data-exam-panel]').prop('hidden', true).filter('[data-exam-panel="' + name + '"]').prop('hidden', false);
    window.scrollTo(0, 0);
  }
  function curExamIdx() {
    var n = $('[data-exam-panel]:not([hidden])').attr('data-exam-panel') || 'q0';
    return parseInt(n.slice(1), 10) || 0;
  }
  $(document).on('click', '[data-exam-start]', function () { showExam('q0'); });
  $(document).on('click', '[data-exam-go]', function () { showExam('q' + $(this).attr('data-exam-go')); });
  $(document).on('click', '[data-exam-nav]', function () {
    showExam('q' + (curExamIdx() + ($(this).attr('data-exam-nav') === 'next' ? 1 : -1)));
  });

  /* ---- help center: category / article / tickets screens ---- */
  $(document).on('click', '[data-help-go]', function () {
    var id = $(this).attr('data-help-go');
    var $p = $('[data-help-panel="' + id + '"]');
    if (!$p.length) return;
    $('[data-help-panel]').prop('hidden', true);
    $p.prop('hidden', false);
  });
})(jQuery);
