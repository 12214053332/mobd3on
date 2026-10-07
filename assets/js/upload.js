/* Upload areas inside the popups ([data-dropzone]): click or drag-and-drop a file, see a preview, replace or remove it.
   "image" zones take one image and show a thumbnail; "files" zones (training kit) add rows to #kitFiles.
   Nothing is sent anywhere — this is the UI only. */
(function ($) {
  'use strict';

  var BOX = 'p-6 border-[1.5px] border-dashed border-edge-strong rounded-lg text-center text-ink-3 cursor-pointer bg-surface';
  var HOVER = 'border-primary-500 bg-primary-50 text-primary-700';
  var BTN = 'py-0 px-3 rounded-md h-8 text-[13px] font-bold bg-surface border border-edge text-ink-2 hover:border-primary-500 hover:text-primary-700';

  function size(n) { return n < 1048576 ? Math.max(1, Math.round(n / 1024)) + ' KB' : (n / 1048576).toFixed(1) + ' MB'; }
  function toast(t) { if (window.App && App.toast) App.toast(t); }

  function initZone($z) {
    if ($z.children('input[type=file]').length) return;
    $z.data('orig', $z.contents().clone());
    var multi = $z.attr('data-dropzone') === 'files';
    $('<input type="file" class="hidden">').attr('accept', multi ? '' : 'image/*').prop('multiple', multi).appendTo($z);
  }

  function restore($z) {
    var $input = $z.children('input[type=file]');
    $z.contents().not($input).remove();
    $z.prepend($z.data('orig').clone());
    $input.val('');
  }

  function showImage($z, file) {
    var $input = $z.children('input[type=file]');
    var url = URL.createObjectURL(file);
    $z.contents().not($input).remove();
    var $view = $(
      '<div class="flex items-center gap-4 text-start">' +
        '<img alt="" class="w-24 h-24 rounded-md object-cover border border-guide bg-surface-hover">' +
        '<div class="flex-1 min-w-0">' +
          '<div class="up-name text-[14px] font-bold text-ink truncate"></div>' +
          '<div class="up-meta mt-1 text-[12px] text-ink-3 text-right" dir="ltr"></div>' +
          '<div class="mt-3 gap-2 flex flex-wrap">' +
            '<button type="button" class="up-replace ' + BTN + '">استبدال</button>' +
            '<button type="button" class="up-remove ' + BTN + ' text-error-700">إزالة</button>' +
          '</div>' +
        '</div>' +
      '</div>');
    $view.find('img').attr('src', url);
    $view.find('.up-name').text(file.name);
    $view.find('.up-meta').text(size(file.size));
    $z.prepend($view);
  }

  /* "files" zones add one row per file to their list: #kitFiles (training kit in the program wizards) or the list named by
     data-files-list (batch wizard / bulk upload). A row marked [data-file-tpl] is the hidden template; anything marked
     [data-after-upload] in the same popup is revealed once the list has files. */
  function listOf($z) { return $($z.attr('data-files-list') || '#kitFiles'); }
  function syncAfter($z) {
    var has = listOf($z).children(':not([data-file-tpl])').length > 0;
    $z.closest('.drawer').find('[data-after-upload]').prop('hidden', !has);
  }
  function addFiles($z, files) {
    var $list = listOf($z);
    var $tpl = $list.children('[data-file-tpl]').first();
    if (!$tpl.length) $tpl = $list.children().first();
    if (!$tpl.length) return;
    $.each(files, function (_, f) {
      var $row = $tpl.clone().removeAttr('data-file-tpl').prop('hidden', false);
      if ($row.find('[data-fname]').length) {
        $row.find('[data-fname]').text(f.name);
        $row.find('[data-fmeta]').text(size(f.size));
      } else {
        $row.find('div').filter(function () { return !$(this).children().length; }).eq(0).text(f.name);
        $row.find('div').filter(function () { return !$(this).children().length; }).eq(1).text(size(f.size));
      }
      $list.append($row);
    });
    syncAfter($z);
    toast('تمت إضافة ' + files.length + ' ملف');
  }

  function handle($z, fileList) {
    var files = $.makeArray(fileList);
    if (!files.length) return;
    if ($z.attr('data-dropzone') === 'files') { addFiles($z, files); return; }
    var f = files[0];
    if (f.type.indexOf('image/') !== 0) { toast('يُسمح برفع الصور فقط (PNG / JPG)'); return; }
    showImage($z, f);
  }

  $(function () {
    $('[data-dropzone]').each(function () { initZone($(this)); });

    $(document).on('click', '[data-dropzone]', function (e) {
      var $z = $(this);
      if ($(e.target).is('input[type=file]')) return;
      if ($(e.target).closest('.up-remove').length) { restore($z); return; }
      $z.children('input[type=file]').trigger('click');
    });

    $(document).on('change', '[data-dropzone] > input[type=file]', function () {
      var $z = $(this).parent();
      handle($z, this.files);
      if ($z.attr('data-dropzone') === 'files') $(this).val('');
    });

    $(document).on('dragover dragenter', '[data-dropzone]', function (e) {
      e.preventDefault();
      $(this).addClass(HOVER);
    });
    $(document).on('dragleave drop', '[data-dropzone]', function (e) {
      e.preventDefault();
      $(this).removeClass(HOVER);
    });
    $(document).on('drop', '[data-dropzone]', function (e) {
      var dt = e.originalEvent.dataTransfer;
      if (dt && dt.files.length) handle($(this), dt.files);
    });

    // the training-kit list: remove a row
    $(document).on('click', '#kitFiles button', function () { $(this).closest('#kitFiles > div').remove(); });
    // rows of the other file lists (batch wizard, bulk upload, kit file drawer)
    $(document).on('click', '[data-file-del]', function () {
      var $row = $(this).parent(), $list = $row.parent(), $drawer = $(this).closest('.drawer');
      $row.remove();
      var has = $list.children(':not([data-file-tpl])').length > 0;
      $drawer.find('[data-after-upload]').prop('hidden', !has);
    });
  });
})(jQuery);
