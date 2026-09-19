/* admin/roles.html: create/edit role drawer (permission chips), search, delete dialog.
   The table, drawer and dialog are real HTML; this file only reacts to them. */
(function ($) {
  'use strict';
  if (!window.MOCK) return;

  var roles = MOCK.ROLES_DEF;
  var editId = null;
  var draft = null;
  var isCore = false;

  function findRole(id) {
    for (var i = 0; i < roles.length; i++) if (roles[i].id === id) return roles[i];
    return null;
  }
  function clonePerms(p) { return JSON.parse(JSON.stringify(p)); }

  /* ---- drawer ---- */
  function syncModule($mod) {
    var mod = $mod.data('mod');
    var acts = MOCK.modActs(mod);
    var all = acts.every(function (a) { return draft.perms[mod] && draft.perms[mod][a]; });
    $mod.find('.chip[data-act]').each(function () {
      $(this).toggleClass('on', !!(draft.perms[mod] && draft.perms[mod][$(this).data('act')]));
    });
    $mod.find('[data-all]').toggleClass('solid', all).toggleClass('line', !all);
  }

  function openDrawer(id) {
    editId = id || null;
    var rl = id ? findRole(id) : null;
    isCore = !!(rl && rl.core);
    draft = { name: rl ? rl.name : '', desc: rl ? rl.desc : '', perms: rl ? clonePerms(rl.perms) : MOCK.permAll(false) };

    $('#roleDrTitle').text(id ? (isCore ? 'إدارة صلاحيات الدور' : 'تعديل الدور') : 'إنشاء دور جديد');
    $('#roleSave').text(id ? 'حفظ التعديلات' : 'حفظ الدور');

    $('#roleBasicCore').prop('hidden', !isCore);
    $('#roleBasicCustom').prop('hidden', isCore);
    $('#roleCoreName').val(draft.name);
    $('#roleCoreDesc').val(draft.desc || '');
    $('#role_name').val(draft.name).removeClass('err');
    $('#role_desc').val(draft.desc || '');
    $('#err_roleName').removeClass('show');

    $('.perm-mod').removeClass('collapsed').each(function () { syncModule($(this)); });
    $('#roleScrim, #roleDrawer').addClass('open');
    setTimeout(function () { if (!isCore) $('#role_name').trigger('focus'); }, 260);
  }
  function closeDrawer() { $('#roleScrim, #roleDrawer').removeClass('open'); }

  function bindDrawer() {
    $(document).on('click', '.perm-mod-h', function (e) {
      if ($(e.target).closest('[data-all]').length) return;
      $(this).closest('.perm-mod').toggleClass('collapsed');
    });
    $(document).on('click', '.perm-mod .chip[data-act]', function () {
      var $mod = $(this).closest('.perm-mod');
      var mod = $mod.data('mod'), act = $(this).data('act');
      draft.perms[mod][act] = !draft.perms[mod][act];
      syncModule($mod);
    });
    $(document).on('click', '.perm-mod [data-all]', function (e) {
      e.stopPropagation();
      var $mod = $(this).closest('.perm-mod');
      var mod = $mod.data('mod');
      var acts = MOCK.modActs(mod);
      var all = acts.every(function (a) { return draft.perms[mod][a]; });
      acts.forEach(function (a) { draft.perms[mod][a] = !all; });
      syncModule($mod);
    });
    $('#roleScrim, #roleClose, #roleCancel').on('click', closeDrawer);
    $('#role_name').on('input', function () { $(this).removeClass('err'); $('#err_roleName').removeClass('show'); });
    $('#createRoleBtn').on('click', function () { openDrawer(null); });
    $(document).on('click', '[data-role-edit]', function () { openDrawer($(this).closest('tr').data('id')); });
    $('#roleSave').on('click', saveRole);
  }

  /* ---- table rows ---- */
  function actionsCell(rl) {
    if (rl.system) return '<span class="pill neutral">دور نظام</span>';
    if (rl.core) return '<button type="button" class="mini-btn line" data-role-edit>إدارة الصلاحيات</button>';
    return '<div class="row-actions-inline">' +
      '<button type="button" class="mini-btn line" data-role-edit>تعديل</button>' +
      '<button type="button" class="mini-btn line danger-line" data-role-del>حذف</button></div>';
  }

  function buildRow(rl) {
    var $tr = $(
      '<tr data-id="' + rl.id + '">' +
        '<td><div class="role-name-cell"><span class="row-avatar"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10z"/></svg></span><b class="js-name"></b></div></td>' +
        '<td class="role-desc js-desc"></td>' +
        '<td class="mono js-users"></td>' +
        '<td class="mono js-perms"></td>' +
        '<td class="mono js-updated"></td>' +
        '<td><span class="pill ok">نشط</span></td>' +
        '<td class="js-actions" style="text-align:end"></td>' +
      '</tr>'
    );
    fillRow($tr, rl);
    return $tr;
  }
  function fillRow($tr, rl) {
    $tr.find('.js-name').text(rl.name);
    $tr.find('.js-desc').text(rl.desc || '—');
    $tr.find('.js-users').text(rl.users);
    $tr.find('.js-perms').text(MOCK.permCount(rl.perms));
    $tr.find('.js-updated').text(rl.updated || '—');
    $tr.find('.js-actions').html(actionsCell(rl));
  }
  function rowFor(id) { return $('#roleTbody > tr').filter(function () { return $(this).data('id') === id; }); }

  function refreshCount() {
    var visible = $('#roleTbody > tr:visible').length;
    $('#roleShown').text(visible);
    $('#roleTotal').text(roles.length);
    $('#roleEmpty').prop('hidden', visible > 0);
  }

  function saveRole() {
    if (!isCore) {
      var $name = $('#role_name');
      if (!$name.val().trim()) { $name.addClass('err'); $('#err_roleName').addClass('show'); $name.trigger('focus'); return; }
      draft.name = $name.val().trim();
      draft.desc = $('#role_desc').val().trim();
    }
    var $btn = $('#roleSave');
    var orig = $btn.text();
    $btn.text('جاري الحفظ…').prop('disabled', true).css('opacity', .7);
    setTimeout(function () {
      $btn.text(orig).prop('disabled', false).css('opacity', 1);
      if (editId) {
        var rl = findRole(editId);
        if (!rl.core) { rl.name = draft.name; rl.desc = draft.desc || 'دور مخصّص'; }
        rl.perms = draft.perms;
        rl.updated = 'اليوم';
        fillRow(rowFor(editId), rl);
        closeDrawer();
        App.toast(rl.core ? 'تم تحديث صلاحيات الدور بنجاح' : 'تم تحديث الدور بنجاح', rl.name);
      } else {
        var created = { id: 'role_' + Date.now(), name: draft.name, desc: draft.desc || 'دور مخصّص', users: 0, status: 'active', updated: 'اليوم', perms: draft.perms };
        roles.push(created);
        $('#roleTbody').prepend(buildRow(created));
        closeDrawer();
        App.toast('تم إنشاء الدور بنجاح', created.name);
      }
      applySearch();
    }, 700);
  }

  /* ---- search ---- */
  function applySearch() {
    var q = $('#roleSearch').val().trim();
    $('#roleTbody > tr').each(function () {
      var rl = findRole($(this).data('id'));
      var match = !q || rl.name.indexOf(q) > -1 || (rl.desc || '').indexOf(q) > -1;
      $(this).toggle(match);
    });
    refreshCount();
  }

  /* ---- delete dialog ---- */
  var delId = null;
  function openDelete(id) {
    var rl = findRole(id);
    if (!rl) return;
    if (rl.system || rl.core) { App.toast('لا يمكن حذف هذا الدور — هو دور أساسي في النظام'); return; }
    delId = id;
    var hasUsers = rl.users > 0;
    $('#roleDelWarn').prop('hidden', !hasUsers);
    $('#roleDelCount').text(rl.users);
    $('#roleDelYes').prop('disabled', hasUsers);
    $('#roleDelScrim').addClass('open');
  }
  function closeDelete() { $('#roleDelScrim').removeClass('open'); delId = null; }

  function bindDelete() {
    $(document).on('click', '[data-role-del]', function () { openDelete($(this).closest('tr').data('id')); });
    $('#roleDelNo').on('click', closeDelete);
    $('#roleDelScrim').on('click', function (e) { if (e.target.id === 'roleDelScrim') closeDelete(); });
    $('#roleDelYes').on('click', function () {
      var rl = findRole(delId);
      if (!rl || rl.users > 0) return;
      MOCK.ROLES_DEF = roles = roles.filter(function (r) { return r.id !== delId; });
      rowFor(delId).remove();
      closeDelete();
      App.toast('تم حذف الدور', rl.name);
      refreshCount();
    });
  }

  $(function () {
    bindDrawer();
    bindDelete();
    $('#roleSearch').on('input', applySearch);
    $('#exportBtn').on('click', function () { App.toast('تم تجهيز ملف التصدير', 'سيبدأ التنزيل تلقائياً'); });
  });
})(jQuery);
