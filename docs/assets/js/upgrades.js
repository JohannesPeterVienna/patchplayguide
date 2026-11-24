/* Console upgrade reference – filters the list the build already wrote into the page (data: upgrades-core.js at build time).
   Without JavaScript the full list stays readable. */
(function () {
  'use strict';
  var K = window.PPGKit, tool = document.getElementById('upgrades');
  if (!K || !tool) return;
  var $ = function (id) { return document.getElementById(id); };
  var q = $('up-q'), plat = $('up-p'), kind = $('up-k'), items = tool.querySelectorAll('#up-list > li'), total = items.length, hay = [];
    function norm(t) { t = String(t); if (t.normalize) t = t.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); return t.toLowerCase().replace(/[’']/g, '\''); }
  for (var i = 0; i < total; i++) hay.push(norm(items[i].textContent));
  function valid(sel, v) { return typeof v === 'string' && /^[a-z0-9]+$/.test(v) && !!sel.querySelector('option[value="' + v + '"]'); }
  function state() { var p = {}; if (q.value.trim()) p.q = q.value.trim(); if (plat.value !== 'all') p.on = plat.value; if (kind.value !== 'all') p.kind = kind.value; return p; }
  function render() {
    var words = norm(q.value).split(/\s+/).filter(Boolean), shown = 0;
    for (var i = 0; i < total; i++) {
      var li = items[i], ok = (plat.value === 'all' || li.getAttribute('data-p') === plat.value) && (kind.value === 'all' || li.getAttribute('data-k') === kind.value);
      for (var w = 0; ok && w < words.length; w++) if (hay[i].indexOf(words[w]) === -1) ok = false;
      li.hidden = !ok;
      if (ok) shown++;
    }
    $('up-summary').textContent = shown + ' of ' + total + ' entries shown' + (q.value.trim() ? ' for “' + q.value.trim() + '”' : '');
    $('up-none').hidden = shown !== 0;
    K.sync(state());
  }
  q.addEventListener('input', render);
  plat.addEventListener('change', render);
  kind.addEventListener('change', render);
  tool.addEventListener('click', function (e) {
    var chip = e.target.closest('button[data-q]');
    if (chip) { q.value = chip.getAttribute('data-q'); plat.value = 'all'; kind.value = 'all'; render(); $('up-summary').focus(); return; }
    if (e.target.id === 'up-reset') { q.value = ''; plat.value = 'all'; kind.value = 'all'; render(); q.focus(); }
    if (e.target.id === 'up-link') K.copy(K.url(state()), $('up-msg'), 'Link copied – it reopens this filter.');
    if (e.target.id === 'up-print') window.print();
  });
  // controls are hidden in the markup and only shown when this script runs (without JS the full list stays)
  var ctl = tool.querySelectorAll('[data-needs-js]');
  for (var c = 0; c < ctl.length; c++) ctl[c].hidden = false;
  var p = K.read();
  if (typeof p.q === 'string') q.value = p.q.slice(0, 60);
  if (valid(plat, p.on)) plat.value = p.on;
  if (valid(kind, p.kind)) kind.value = p.kind;
  render();
})();
