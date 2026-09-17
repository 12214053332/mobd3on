/* Admin dashboard: analytics chart widget (metric / range switch + hover tooltip).
   The initial markup in admin/dashboard.html already renders the default state
   (12 months / new registrations) as real HTML — this file only redraws the
   chart widget when the visitor changes the metric or range segmented control,
   the same way any chart-library component would update on interaction. */
(function ($) {
  'use strict';
  if (!window.MOCK) return;

  var state = { range: '12m', metric: 'reg' };

  function buildChartSvg(range, metric) {
    var M = MOCK.ADASH_METRICS[metric];
    var S = MOCK.adashSeries(range, metric);
    var W = 760, H = 280, pl = 16, pr = 56, pt = 16, pb = 34, n = S.values.length;
    var lo = Math.min.apply(null, S.values), hi = Math.max.apply(null, S.values), ticks = 4;
    var raw = (hi - lo) / ticks || 1;
    var mag = Math.pow(10, Math.floor(Math.log10(raw)));
    var step = [1, 2, 2.5, 5, 10].map(function (m) { return m * mag; }).find(function (v) { return v >= raw; });
    var mn = Math.floor(lo / step) * step, mx = Math.ceil(hi / step) * step;
    if (mx === hi) mx += step;
    if (mn === lo && mn - step >= 0) mn -= step;
    if (metric !== 'comp') mn = Math.max(0, mn);

    var x = function (i) { return W - pr - (i * (W - pr - pl) / (n - 1)); };
    var y = function (v) { return pt + (1 - (v - mn) / (mx - mn)) * (H - pt - pb); };
    var pts = S.values.map(function (v, i) { return [x(i), y(v)]; });
    var line = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
    var area = line + ' L' + pts[n - 1][0].toFixed(1) + ' ' + (H - pb) + ' L' + pts[0][0].toFixed(1) + ' ' + (H - pb) + ' Z';

    var gridCount = Math.round((mx - mn) / step) + 1;
    var grid = '';
    for (var k = 0; k < gridCount; k++) {
      var v = mn + step * k, yy = y(v);
      var label = metric === 'comp' ? (+v.toFixed(1)) + '%' : metric === 'rev' ? (+v.toFixed(1)) + 'K' : v.toLocaleString('en-US');
      grid += '<line x1="' + pl + '" x2="' + (W - pr) + '" y1="' + yy + '" y2="' + yy + '" class="adash-grid"/>' +
              '<text x="' + (W - pr + 10) + '" y="' + (yy + 4) + '" class="adash-ytick">' + label + '</text>';
    }

    var xl = S.labels.map(function (l, i) {
      var show = (i % S.every === 0 || i === n - 1) && !(S.every > 1 && i !== n - 1 && n - 1 - i < S.every / 2);
      return show ? '<text x="' + x(i) + '" y="' + (H - 10) + '" text-anchor="middle" class="adash-xtick">' + l + '</text>' : '';
    }).join('');

    var last = pts[n - 1];
    var hits = pts.map(function (p, i) {
      var w = (W - pr - pl) / (n - 1);
      return '<rect data-i="' + i + '" x="' + (p[0] - w / 2) + '" y="' + pt + '" width="' + w + '" height="' + (H - pt - pb) + '" fill="transparent"/>';
    }).join('');

    var total = M.sum ? S.values.reduce(function (a, b) { return a + b; }, 0) : S.values[n - 1];
    var first = S.values[0], lastV = S.values[n - 1], ch = (lastV - first) / first * 100;
    var peak = Math.max.apply(null, S.values), peakI = S.values.indexOf(peak);

    var statsHtml =
        '<div><div class="adash-stat-l">' + (M.sum ? 'الإجمالي للفترة' : 'القيمة الحالية') + '</div><div class="adash-stat-v">' + M.fmt(total) + '</div></div>' +
        '<div><div class="adash-stat-l">التغيّر خلال الفترة</div><div class="adash-stat-v sm ' + (ch >= 0 ? 'pos' : 'neg') + '">' + (ch >= 0 ? '↑' : '↓') + ' ' + Math.abs(ch).toFixed(1) + '%</div></div>' +
        '<div><div class="adash-stat-l">الأعلى</div><div class="adash-stat-v sm">' + M.fmt(peak) + ' <bdi class="adash-stat-m adash-num">' + S.labels[peakI] + '</bdi></div></div>';

    var svgHtml =
      '<div class="adash-plot" id="adashPlot">' +
        '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" role="img" aria-label="' + M.t + ' — ' + S.labels[0] + ' إلى ' + S.labels[n - 1] + '">' +
          '<defs><linearGradient id="adashFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--primary-700)" stop-opacity=".16"/><stop offset="1" stop-color="var(--primary-700)" stop-opacity="0"/></linearGradient></defs>' +
          grid + '<path d="' + area + '" fill="url(#adashFill)"/><path d="' + line + '" class="adash-line"/>' +
          '<line id="adashCursor" x1="0" x2="0" y1="' + pt + '" y2="' + (H - pb) + '" class="adash-cursor" style="display:none"/>' +
          '<circle cx="' + last[0] + '" cy="' + last[1] + '" r="9" class="adash-halo"/><circle cx="' + last[0] + '" cy="' + last[1] + '" r="4.5" class="adash-dot"/>' +
          '<circle id="adashHover" r="4.5" class="adash-hdot" style="display:none"/>' +
          xl + hits +
        '</svg>' +
        '<div class="adash-tip" id="adashTip" role="status"></div>' +
      '</div>';

    return { statsHtml: statsHtml, svgHtml: svgHtml, W: W, H: H, series: S, metric: M };
  }

  function render() {
    var built = buildChartSvg(state.range, state.metric);
    $('#adashStats').html(built.statsHtml);
    $('#adashPlotWrap').html(built.svgHtml);

    $('.adash-seg[data-seg="metric"] button').each(function () {
      $(this).toggleClass('on', $(this).data('val') === state.metric).attr('aria-selected', $(this).data('val') === state.metric);
    });
    $('.adash-seg[data-seg="range"] button').each(function () {
      $(this).toggleClass('on', $(this).data('val') === state.range).attr('aria-selected', $(this).data('val') === state.range);
    });

    var S = built.series;
    $('#adashSubtitle').html(built.metric.t + ': <bdi class="adash-num">' + S.span[0] + ' – ' + S.span[1] + '</bdi>');
  }

  $(function () {
    $(document).on('click', '.adash-seg[data-seg="metric"] button', function () {
      state.metric = $(this).data('val'); render();
    });
    $(document).on('click', '.adash-seg[data-seg="range"] button', function () {
      state.range = $(this).data('val'); render();
    });

    function pointXY(S, metric, i) {
      var W = 760, H = 280, pl = 16, pr = 56, pt = 16, pb = 34, n = S.values.length;
      var lo = Math.min.apply(null, S.values), hi = Math.max.apply(null, S.values), ticks = 4;
      var raw = (hi - lo) / ticks || 1, mag = Math.pow(10, Math.floor(Math.log10(raw)));
      var step = [1, 2, 2.5, 5, 10].map(function (m) { return m * mag; }).find(function (v) { return v >= raw; });
      var mn = Math.floor(lo / step) * step, mx = Math.ceil(hi / step) * step;
      if (mx === hi) mx += step;
      if (mn === lo && mn - step >= 0) mn -= step;
      if (metric !== 'comp') mn = Math.max(0, mn);
      var x = W - pr - (i * (W - pr - pl) / (n - 1));
      var y = pt + (1 - (S.values[i] - mn) / (mx - mn)) * (H - pt - pb);
      return { x: x, y: y, W: W, H: H };
    }

    $(document).on('mouseenter', '#adashPlot rect', function () {
      var i = +$(this).data('i');
      var S = MOCK.adashSeries(state.range, state.metric), M = MOCK.ADASH_METRICS[state.metric];
      var $svg = $('#adashPlot svg'), rect = $svg[0].getBoundingClientRect();
      var p = pointXY(S, state.metric, i);
      var $tip = $('#adashTip'), $cur = $('#adashCursor'), $hd = $('#adashHover');
      $cur.attr({ x1: p.x, x2: p.x }).show();
      $hd.attr({ cx: p.x, cy: p.y }).show();
      $tip.html('<b>' + M.fmt(S.values[i]) + '</b><span>' + S.labels[i] + '</span>');
      $tip.css({ left: (p.x / p.W * rect.width) + 'px', top: (p.y / p.H * rect.height) + 'px', opacity: 1 });
    });
    $(document).on('mouseleave', '#adashPlot', function () {
      $('#adashTip').css('opacity', 0);
      $('#adashCursor, #adashHover').hide();
    });
  });
})(jQuery);
