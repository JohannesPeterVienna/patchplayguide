/* Patch Decoder – browser UI. Logic lives in decoder-core.js. Inputs stay in this browser. */
(function () {
  'use strict';
  var D = window.PPGDecoder;
  var tool = document.getElementById('decoder');
  if (!D || !tool) return;
  var $ = function (id) { return document.getElementById(id); };
  var KEY_TEXT = 'ppg-decoder-text', KEY_DONE = 'ppg-decoder-done', KEY_MODE = 'ppg-decoder-mode';
  var state = { mode: 'example', items: [], done: {} };

  function store(k, v) { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { /* blocked */ } }
  function load(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function escH(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  var catSel = $('dec-cat'), platSel = $('dec-plat');
  catSel.innerHTML = '<option value="all">All categories</option>' + Object.keys(D.CATEGORIES).map(function (k) { return '<option value="' + k + '">' + D.CATEGORIES[k] + '</option>'; }).join('');
  platSel.innerHTML = '<option value="all">All platforms</option>' + Object.keys(D.PLATFORMS).map(function (k) { return '<option value="' + k + '">' + D.PLATFORMS[k] + '</option>'; }).join('');
  try { var s = JSON.parse(localStorage.getItem('ppg-setup') || 'null'); var map = { pc: 'pc', handheld: 'handheld', ps5: 'ps5', ps5pro: 'ps5', xbox: 'xbox', switch2: 'switch2' }; if (s && map[s.platform]) platSel.value = map[s.platform]; } catch (e) { /* none */ }

  function title() {
    return state.mode === 'example' ? D.EXAMPLE.game + ' ' + D.EXAMPLE.version + ' (fictional example)' : 'My pasted patch notes';
  }

  function render() {
    var visible = D.filter(state.items, catSel.value, platSel.value);
    var c = D.counts(visible);
    $('dec-summary').textContent = visible.length
      ? visible.length + ' of ' + state.items.length + ' changes shown · ' + c.plus + ' improvements (+) · ' + c.tilde + ' changes (~) · ' + c.minus + ' removals or known issues (−)'
      : (state.items.length ? 'No change matches these filters.' : 'Paste patch-note lines above and press “Sort my lines”.');
    $('dec-list').innerHTML = visible.map(function (it) {
      var sign = D.TYPES[it.type];
      var plats = it.platforms.length ? it.platforms.map(function (p) { return '<span class="tag">' + D.PLATFORMS[p] + '</span>'; }).join('') : '<span class="tag tag-all">All platforms</span>';
      return '<li class="d-' + it.type + '"><span class="sign" aria-hidden="true">' + sign + '</span><div><p class="d-text"><span class="sr">' + ({ plus: 'Improvement: ', tilde: 'Change: ', minus: 'Removal or issue: ' })[it.type] + '</span>' + escH(it.text) + '</p>' +
        '<p class="d-meta"><span class="cat">' + D.CATEGORIES[it.cat] + '</span>' + plats + '</p>' +
        '<p class="d-do"><b>What to do:</b> ' + D.actionFor(it) + '</p></div></li>';
    }).join('');
    var checks = D.checklist(visible);
    $('dec-checks').innerHTML = checks.map(function (c, i) {
      var id = 'chk-' + i;
      return '<li><input type="checkbox" id="' + id + '" data-i="' + i + '"' + (state.done[c] ? ' checked' : '') + '><label for="' + id + '">' + c + '</label></li>';
    }).join('');
    state.checks = checks;
    state.visible = visible;
  }

  function setMode(m) {
    state.mode = m;
    store(KEY_MODE, m);
    $('dec-paste').hidden = m !== 'paste';
    $('dec-example-note').hidden = m !== 'example';
    if (m === 'example') state.items = D.EXAMPLE.items.slice();
    else state.items = D.classifyAll($('dec-input').value);
    render();
  }

  tool.querySelectorAll('input[name="dec-mode"]').forEach(function (r) {
    r.addEventListener('change', function () { if (r.checked) setMode(r.value); });
  });
  catSel.addEventListener('change', render);
  platSel.addEventListener('change', render);
  $('dec-sort').addEventListener('click', function () {
    store(KEY_TEXT, $('dec-input').value);
    state.items = D.classifyAll($('dec-input').value);
    render();
    $('dec-summary').focus();
  });
  $('dec-clear').addEventListener('click', function () {
    $('dec-input').value = '';
    store(KEY_TEXT, null);
    state.items = [];
    render();
  });
  $('dec-checks').addEventListener('change', function (e) {
    var i = e.target.getAttribute('data-i');
    if (i === null) return;
    state.done[state.checks[i]] = e.target.checked;
    store(KEY_DONE, JSON.stringify(state.done));
  });
  function text() {
    var done = state.checks.map(function (c) { return !!state.done[c]; });
    return D.exportText(title(), state.visible, state.checks, done);
  }
  $('dec-copy').addEventListener('click', function () {
    var t = text(), out = $('dec-export'), msg = $('dec-copied');
    out.value = t; out.hidden = false;
    function fallback() { out.select(); try { document.execCommand('copy'); msg.textContent = 'Copied.'; } catch (e) { msg.textContent = 'Select the text below and copy it.'; } }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function () { msg.textContent = 'Copied to the clipboard.'; }, fallback);
    else fallback();
  });
  $('dec-download').addEventListener('click', function () {
    var blob = new Blob([text()], { type: 'text/plain' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'after-update-checklist.txt';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  });

  try { state.done = JSON.parse(load(KEY_DONE) || '{}') || {}; } catch (e) { state.done = {}; }
  var saved = load(KEY_TEXT);
  if (saved) $('dec-input').value = saved;
  var mode = load(KEY_MODE) === 'paste' && saved ? 'paste' : 'example';
  tool.querySelector('input[name="dec-mode"][value="' + mode + '"]').checked = true;
  setMode(mode);
})();
