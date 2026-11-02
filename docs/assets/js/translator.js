/* Settings Translator – browser UI. Logic and data live in translator-core.js. */
(function () {
  'use strict';
  var T = window.PPGTranslator;
  var tool = document.getElementById('translator');
  if (!T || !tool) return;
  var $ = function (id) { return document.getElementById(id); };
  var KEY = 'ppg-translator-bottleneck';
  var LABEL = { gpu: 'GPU', cpu: 'CPU', vram: 'VRAM' };

  function meter(res, n) {
    var cells = '';
    for (var i = 1; i <= 3; i++) cells += '<i class="' + (i <= n ? 'on' : '') + '"></i>';
    return '<span class="meter m-' + res + '" data-level="' + n + '"><span class="m-k">' + LABEL[res] + '</span><span class="m-cells" aria-hidden="true">' + cells + '</span><span class="m-v">' + T.level(n) + '</span></span>';
  }

  function setupHint() {
    var s = window.PPGSetup && window.PPGSetup.read();
    var box = $('tr-setup');
    if (!s) { box.innerHTML = 'Tip: save your platform under <a href="/#my-setup">My setup</a> to get matching notes here.'; return; }
    var console_ = ['ps5', 'ps5pro', 'xbox', 'switch2'].indexOf(s.platform) !== -1;
    var msg = 'Your setup: <b>' + window.PPGSetup.text(s) + '</b>. ';
    if (console_) msg += 'Consoles mostly offer modes instead of these options – the matrix explains what a mode trades, and the console guides show how to pick one.';
    else if (s.platform === 'handheld') msg += 'On handhelds, render resolution, upscaler mode and a frame cap matter most because CPU and GPU share one power budget.';
    else if (s.vram && Number(s.vram) <= 8) msg += 'With ' + s.vram + ' GB of VRAM, watch the VRAM column: texture quality, ray tracing and frame generation are the usual memory hogs in recent games.';
    else msg += 'Pick your bottleneck to see which options to lower first.';
    box.innerHTML = msg;
  }

  function render() {
    var b = (tool.querySelector('input[name="tr-b"]:checked') || {}).value || 'unsure';
    try { localStorage.setItem(KEY, b); } catch (e) { /* blocked */ }
    var first = T.lowerFirst(b, 5);
    var firstIds = first.map(function (o) { return o.id; });
    var q = $('tr-q').value;
    var list = T.search(q, T.rank(b));
    $('tr-first').innerHTML = first.length
      ? '<h3>Lower these first when the ' + LABEL[b] + ' is the limit</h3><ol>' + first.map(function (o) { return '<li><a href="#opt-' + o.id + '">' + o.name + '</a></li>'; }).join('') + '</ol>' + (b === 'vram' ? '<p class="tool-sub" style="margin-top:8px">Note: frame generation also needs video memory. It is not a quality option you lower first, but switching it off frees VRAM too – see the <a href="/guides/vram-full-what-to-lower/">VRAM guide</a>.</p>' : '')
      : '<h3>Not sure what limits you?</h3><p>Run the <a href="/tools/bottleneck-finder/">Bottleneck Finder</a> first. Below, options are sorted by their combined typical load.</p>';
    $('tr-summary').textContent = list.length + ' of ' + T.OPTIONS.length + ' options' + (q ? ' match “' + q + '”' : '') + ' · sorted for: ' + (LABEL[b] ? LABEL[b] + ' bottleneck' : 'combined load');
    $('tr-grid').innerHTML = list.map(function (o) {
      var rank = firstIds.indexOf(o.id);
      return '<article class="opt' + (rank !== -1 ? ' hot' : '') + (o.special ? ' special' : '') + '" id="opt-' + o.id + '">' +
        '<div class="opt-h"><h3>' + o.name + '</h3>' + (rank !== -1 ? '<span class="badge">Lower first · ' + (rank + 1) + '</span>' : '') + (o.special ? '<span class="badge badge-alt">Special case</span>' : '') + '</div>' +
        '<p class="aka">' + o.aka + '</p>' +
        '<div class="meters">' + meter('gpu', o.gpu) + meter('cpu', o.cpu) + meter('vram', o.vram) + '<span class="meter m-loss"><span class="m-k">Visible loss</span><span class="m-v">' + T.LOSS[o.loss] + '</span></span></div>' +
        '<p>' + o.what + '</p><p class="tip"><b>Typical approach:</b> ' + o.tip + ' <a href="/guides/' + o.guide + '/">Guide</a></p></article>';
    }).join('') || '<p>No option matches. Try “shadow”, “texture” or “ray”.</p>';
  }

  tool.addEventListener('change', function (e) { if (e.target.name === 'tr-b') render(); });
  $('tr-q').addEventListener('input', render);
  var savedB = null;
  try { savedB = localStorage.getItem(KEY); } catch (e) { /* none */ }
  var r = savedB && tool.querySelector('input[name="tr-b"][value="' + savedB + '"]');
  if (r) r.checked = true;
  setupHint();
  render();
})();
