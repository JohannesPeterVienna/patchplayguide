/* Settings Test Log – browser UI. Statistics live in testlog-core.js. All numbers are typed in by the visitor. */
(function () {
  'use strict';
  var T = window.PPGTestLog, K = window.PPGKit, tool = document.getElementById('testlog');
  if (!T || !K || !tool) return;
  var $ = function (id) { return document.getElementById(id); };
  var KEY = 'ppg-testlog';
  var F = { scene: 'tl-scene', na: 'tl-na', nb: 'tl-nb', a: 'tl-a', b: 'tl-b', la: 'tl-la', lb: 'tl-lb' };
  function raw() { var o = {}; Object.keys(F).forEach(function (k) { o[k] = $(F[k]).value.trim(); }); return o; }
  function state() { var r = raw(); return { scene: r.scene, nameA: r.na, nameB: r.nb, a: T.parse(r.a), b: T.parse(r.b), la: T.parse(r.la), lb: T.parse(r.lb) }; }
  function n1(x) { return T.r1(x).toFixed(1).replace(/\.0$/, ''); }
  function plot(a, b) {
    var all = a.concat(b); if (!all.length) return '';
    var lo = Math.min.apply(null, all), hi = Math.max.apply(null, all), pad = (hi - lo) * 0.15 || 1; lo -= pad; hi += pad;
    var x = function (v) { return Math.round((40 + (v - lo) / (hi - lo) * 540) * 10) / 10; };
    var dots = function (arr, y, cls) { return arr.map(function (v) { return '<circle class="' + cls + '" cx="' + x(v) + '" cy="' + y + '" r="6"/>'; }).join(''); };
    var band = function (arr, y, cls) { return arr.length > 1 ? '<rect class="' + cls + '" opacity=".25" x="' + x(Math.min.apply(null, arr)) + '" y="' + (y - 9) + '" width="' + Math.max(1, x(Math.max.apply(null, arr)) - x(Math.min.apply(null, arr))) + '" height="18" rx="4"/>' : ''; };
    return '<svg class="tl-plot" viewBox="0 0 620 110" role="img" aria-label="Runs of setup A and setup B on one frame-rate axis"><text class="g-tm" x="6" y="34">A</text><text class="g-tm" x="6" y="74">B</text>' + band(a, 30, 'g-acc') + band(b, 70, 'g-plus') + dots(a, 30, 'g-acc') + dots(b, 70, 'g-plus') +
      '<path class="g-grid" d="M40 92h540"/><text class="g-tm" x="40" y="106">' + n1(lo) + ' fps</text><text class="g-tm" x="580" y="106" text-anchor="end">' + n1(hi) + ' fps</text></svg>';
  }
  function block(title, c, unit) {
    if (!c.A && !c.B) return '';
    var row = function (label, s) { return s ? '<tr><th scope="row">' + K.esc(label) + '</th><td>' + s.n + '</td><td><b>' + n1(s.median) + '</b></td><td>' + n1(s.min) + '–' + n1(s.max) + '</td><td>' + n1(s.range) + ' (' + n1(s.rangePct) + '%)</td></tr>' : '<tr><th scope="row">' + K.esc(label) + '</th><td>0</td><td>–</td><td>–</td><td>–</td></tr>'; };
    var st = state();
    var h = '<h3>' + title + '</h3><table class="rt"><thead><tr><th scope="col">Setup</th><th scope="col">Runs</th><th scope="col">Median ' + unit + '</th><th scope="col">Lowest–highest</th><th scope="col">Spread</th></tr></thead><tbody>' + row('A' + (st.nameA ? ' · ' + st.nameA : ''), c.A) + row('B' + (st.nameB ? ' · ' + st.nameB : ''), c.B) + '</tbody></table>';
    if (c.A && c.B) {
      h += '<p class="verdict v-' + c.verdict + '"><b>' + T.WORDS[c.verdict] + '</b></p><p>Median B − A: ' + (c.diff >= 0 ? '+' : '') + n1(c.diff) + ' fps (' + (c.pct >= 0 ? '+' : '') + n1(c.pct) + '%), which is ' + Math.abs(Math.round(c.msDiff * 100) / 100) + ' ms ' + (c.msDiff <= 0 ? 'less' : 'more') + ' per frame (' + (Math.round(c.msA * 100) / 100) + ' → ' + (Math.round(c.msB * 100) / 100) + ' ms). Largest run-to-run spread: ' + n1(c.noise) + ' fps.' +
        (c.luck ? ' If the setting made no difference at all, a clean split like this would still appear by chance in 1 of ' + c.luck + ' cases with ' + c.A.n + ' + ' + c.B.n + ' runs.' : '') + (c.verdict === 'overlap' ? ' Undecided, not shown to be equal: the medians differ by ' + n1(Math.abs(c.diff)) + ' fps, but the ranges overlap. If the decision matters, add runs or use a longer, more repeatable route and compare again.' : '') + '</p>';
    } else h += '<p class="verdict"><b>' + T.WORDS.empty + '</b></p>';
    return h;
  }
  var LABEL = { a: 'Setup A, average FPS', la: 'Setup A, 1% low', b: 'Setup B, average FPS', lb: 'Setup B, 1% low' };
  function errors() {
    var r = raw(), list = [];
    ['a', 'la', 'b', 'lb'].forEach(function (k) {
      var x = T.read(r[k]), el = $(F[k]);
      if (x.error) { list.push(LABEL[k] + ': ' + x.error); el.setAttribute('aria-invalid', 'true'); } else el.removeAttribute('aria-invalid');
      if (!x.error && x.dropped) list.push(LABEL[k] + ': only the first ' + T.MAX_RUNS + ' runs are used.');
    });
    var box = $('tl-err');
    box.hidden = !list.length;
    box.innerHTML = list.map(function (t) { return '<span>' + K.esc(t) + '</span>'; }).join('<br>');
  }
  function render(save) {
    errors();
    var s = state();
    var main = T.compare(s.a, s.b), low = T.compare(s.la, s.lb);
    $('tl-summary').textContent = 'Setup A: ' + s.a.length + ' run' + (s.a.length === 1 ? '' : 's') + ' · Setup B: ' + s.b.length + ' run' + (s.b.length === 1 ? '' : 's') + (main.A && main.B ? ' · ' + T.WORDS[main.verdict] : '');
    $('tl-out').innerHTML = (main.A || main.B ? plot(s.a, s.b) : '') + block('Average frame rate', main, 'fps') + (low.A || low.B ? block('1% lows', low, 'fps') : '') || '<p>Type the average FPS of each run, separated by spaces – for example <code>71 73 72</code>.</p>';
    if (save !== false) { try { localStorage.setItem(KEY, JSON.stringify(raw())); } catch (e) { /* blocked */ } }
  }
  function link() { var r = raw(), p = {}; Object.keys(F).forEach(function (k) { if (r[k]) p[k] = k.length <= 2 && k !== 'na' && k !== 'nb' ? T.parse(r[k]).join(' ') : r[k].slice(0, 60); }); return p; }
  function apply(o) {
    if (!o || typeof o !== 'object') return false;
    var any = false;
    Object.keys(F).forEach(function (k) { if (Object.prototype.hasOwnProperty.call(o, k) && typeof o[k] === 'string') { $(F[k]).value = o[k].slice(0, 200); any = true; } });
    return any;
  }
  tool.addEventListener('input', function () { $('tl-demo').hidden = true; render(); });
  tool.addEventListener('click', function (e) {
    var id = e.target.id;
    if (id === 'tl-example') {
      apply({ scene: 'Invented example – not a measurement', na: 'Shadows: High', nb: 'Shadows: Medium', a: '71 73 72', b: '75 74 77', la: '52 55 51', lb: '53 56 52' });
      $('tl-demo').hidden = false; render(); $('tl-summary').focus();
    }
    if (id === 'tl-clear') { Object.keys(F).forEach(function (k) { $(F[k]).value = ''; }); $('tl-demo').hidden = true; try { localStorage.removeItem(KEY); } catch (err) { /* blocked */ } render(false); $('tl-msg').textContent = 'Cleared.'; }
    if (id === 'tl-link') K.copy(K.url(link()), $('tl-msg'), 'Link copied – it contains the numbers you typed, nothing else.');
    if (id === 'tl-copy') K.copy(T.summary(state()), $('tl-msg'), 'Summary copied as text.');
    if (id === 'tl-csv') K.download('settings-test-log.csv', T.csv(state()), 'text/csv');
    if (id === 'tl-print') { document.documentElement.classList.remove('print-sheet'); window.print(); }
    if (id === 'tl-sheet') { document.documentElement.classList.add('print-sheet'); window.print(); }
  });
  window.addEventListener('afterprint', function () { document.documentElement.classList.remove('print-sheet'); });
  var q = K.read(), fromLink = apply(q);
  if (!fromLink) { try { apply(JSON.parse(localStorage.getItem(KEY) || 'null')); } catch (e) { /* none */ } }
  render(false);
})();
