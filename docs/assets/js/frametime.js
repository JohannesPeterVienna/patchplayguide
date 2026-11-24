/* Frame Time Calculator – browser UI. Arithmetic lives in frametime-core.js. */
(function () {
  'use strict';
  var F = window.PPGFrameTime, K = window.PPGKit, tool = document.getElementById('ftcalc');
  if (!F || !K || !tool) return;
  var $ = function (id) { return document.getElementById(id); };
  var IDS = { fps: 'ft-fps', hz: 'ft-hz', min: 'ft-min', max: 'ft-max', fg: 'ft-fg', vs: 'ft-vs' };
  function f2(x) { return F.round(x, 2).toFixed(2).replace(/\.?0+$/, ''); }
  function f1(x) { return F.round(x, 1).toFixed(1).replace(/\.0$/, ''); }
  function state() {
    return { fps: F.num($(IDS.fps).value, 1, 1000), hz: F.num($(IDS.hz).value, 24, 1000), min: F.num($(IDS.min).value, 1, 1000), max: F.num($(IDS.max).value, 1, 1000),
      fg: F.num($(IDS.fg).value, 1, 8) || 1, vs: F.num($(IDS.vs).value, 1, 1000) };
  }
  function card(title, body, cls) { return '<article class="opt' + (cls ? ' ' + cls : '') + '"><div class="opt-h"><h3>' + title + '</h3></div>' + body + '</article>'; }
  function render() {
    var s = state(), box = $('ft-out');
    if (!s.fps) { $('ft-summary').textContent = 'Enter a frame rate between 1 and 1000 fps.'; box.innerHTML = ''; return; }
    var t = F.ms(s.fps), html = '';
    $('ft-summary').textContent = f2(s.fps) + ' fps = ' + f2(t) + ' ms per frame';
    html += card('Frame time', '<p class="big">' + f2(t) + ' ms</p><p>At ' + f2(s.fps) + ' frames per second a new frame arrives every ' + f2(t) + ' milliseconds (1000 ÷ ' + f2(s.fps) + ').</p>');
    if (s.hz) {
      var fit = F.fit(s.fps, s.hz), rf = F.ms(s.hz), b;
      if (fit.kind === 'even') b = '<p><b>Even pacing.</b> ' + f2(s.hz) + ' ÷ ' + f2(s.fps) + ' = ' + fit.refreshes + ': every frame is held for exactly ' + fit.refreshes + ' refresh' + (fit.refreshes > 1 ? 'es' : '') + ' (' + f2(fit.holdMs) + ' ms).</p>';
      else if (fit.kind === 'uneven') b = '<p><b>Uneven pacing.</b> ' + f2(s.hz) + ' ÷ ' + f2(s.fps) + ' = ' + f2(fit.ratio) + ' refreshes per frame, which is not a whole number. With V-Sync, frames are held for ' + fit.lo + ' or ' + fit.hi + ' refreshes (' + f2(fit.loMs) + ' ms or ' + f2(fit.hiMs) + ' ms); about ' + Math.round(fit.shareHi * 100) + '% of them get the longer hold. That alternation is the judder you see without VRR.</p>';
      else b = '<p><b>Above the refresh rate.</b> The display shows a new image every ' + f2(rf) + ' ms, the game finishes one every ' + f2(t) + ' ms. Without V-Sync the extra frames tear; with V-Sync the game is held to ' + f2(s.hz) + ' fps.</p>';
      b += '<p class="tool-sub">Frame rates that divide ' + f2(s.hz) + ' Hz evenly: ' + F.evenRates(s.hz).map(function (r) { return f2(r.fps) + ' fps (' + f2(r.ms) + ' ms)'; }).join(' · ') + '</p>';
      html += card('On a fixed ' + f2(s.hz) + ' Hz display', b, fit.kind === 'even' ? 'hot' : '');
    }
    if (s.min && s.max && s.max >= s.min) {
      var v = F.vrr(s.fps, s.min, s.max), vb;
      if (v.kind === 'inside') vb = '<p><b>Inside the window.</b> The display can refresh at ' + f2(s.fps) + ' Hz and show each frame as it arrives, every ' + f2(t) + ' ms.</p>';
      else if (v.kind === 'multiple') vb = '<p><b>Below the window, but a whole multiple fits.</b> ' + f2(s.fps) + ' × ' + v.times + ' = ' + f2(v.hz) + ' Hz lies inside ' + f2(s.min) + '–' + f2(s.max) + ' Hz. A display or driver with low framerate compensation can show each frame ' + v.times + ' times and stay in sync; without that feature VRR stops working below ' + f2(s.min) + ' Hz.</p>';
      else if (v.kind === 'below') vb = '<p><b>Below the window, and no whole multiple fits.</b> No multiple of ' + f2(s.fps) + ' lands between ' + f2(s.min) + ' and ' + f2(s.max) + ' Hz, so VRR cannot follow this frame rate.</p>';
      else vb = '<p><b>Above the window.</b> ' + f2(s.fps) + ' fps is more than the ' + f2(s.max) + ' Hz maximum. Above its window a VRR display behaves like a fixed-rate one: tearing without V-Sync. A frame cap at or below ' + f2(s.max) + ' fps keeps the game inside.</p>';
      vb += '<p class="tool-sub">Window ' + f2(s.min) + '–' + f2(s.max) + ' Hz = ' + f2(F.ms(s.max)) + ' to ' + f2(F.ms(s.min)) + ' ms between refreshes.</p>';
      html += card('In a ' + f2(s.min) + '–' + f2(s.max) + ' Hz VRR window', vb, v.kind === 'inside' ? 'hot' : '');
    }
    if (s.fg > 1) {
      var gb = F.describeGeneration(s.fps, s.fg, s.hz).map(function (t) { return '<p>' + K.esc(t) + '</p>'; }).join('');
      html += card('With ' + s.fg + '× frame generation', gb);
    }
    if (s.vs && s.vs !== s.fps) {
      var c = F.compare(s.fps, s.vs);
      html += card('Compared with ' + f2(s.vs) + ' fps', '<p>' + f2(s.fps) + ' → ' + f2(s.vs) + ' fps changes the frame time from ' + f2(c.msA) + ' ms to ' + f2(c.msB) + ' ms: <b>' + (c.savedMs >= 0 ? f2(c.savedMs) + ' ms less' : f2(-c.savedMs) + ' ms more') + ' per frame</b> (' + (c.fpsPct >= 0 ? '+' : '') + f1(c.fpsPct) + '% frames, ' + (c.timePct >= 0 ? '+' : '') + f1(c.timePct) + '% frame time).</p>');
    }
    box.innerHTML = html;
    var p = {}; Object.keys(IDS).forEach(function (k) { var v = $(IDS[k]).value; if (v !== '' && !(k === 'fg' && v === '1')) p[k] = v; });
    K.sync(p);
  }
  function apply(p) {
    Object.keys(IDS).forEach(function (k) {
      if (!Object.prototype.hasOwnProperty.call(p, k)) return;
      var el = $(IDS[k]), n = Number(p[k]);
      if (!isFinite(n)) return;
      if (el.tagName === 'SELECT') { if (el.querySelector('option[value="' + n + '"]')) el.value = String(n); } else el.value = String(n);
    });
  }
  function parse(q) { var o = { fps: '', hz: '', min: '', max: '', fg: '1', vs: '' }; q.split('&').forEach(function (kv) { var i = kv.indexOf('='); o[kv.slice(0, i)] = kv.slice(i + 1); }); return o; }
  tool.addEventListener('input', render);
  tool.addEventListener('change', render);
  tool.addEventListener('click', function (e) {
    var ex = e.target.closest('button[data-ex]');
    if (ex) {
      var p = parse(ex.getAttribute('data-ex'));
      Object.keys(IDS).forEach(function (k) { var el = $(IDS[k]); if (el.tagName === 'SELECT') el.value = '1'; else el.value = ''; });
      apply(p); render(); $('ft-summary').focus(); return;
    }
    if (e.target.id === 'ft-link') { var q = {}; Object.keys(IDS).forEach(function (k) { q[k] = $(IDS[k]).value === '1' && k === 'fg' ? '' : $(IDS[k]).value; }); K.copy(K.url(q), $('ft-msg'), 'Link copied – it reopens this exact calculation.'); }
    if (e.target.id === 'ft-copy') K.copy($('ft-summary').textContent + '\n' + $('ft-out').innerText + '\nhttps://patchplayguide.com/tools/frame-time-calculator/', $('ft-msg'), 'Result copied as text.');
    if (e.target.id === 'ft-print') window.print();
  });
  var q = K.read();
  if (!Object.prototype.hasOwnProperty.call(q, 'fps')) { $(IDS.fps).value = '40'; $(IDS.hz).value = '120'; }
  apply(q);
  render();
})();
