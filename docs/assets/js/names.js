/* Setting-name map – browser filter over the list that the build already wrote into the page (data: names-core.js at build time). */
(function () {
  'use strict';
  var K = window.PPGKit, tool = document.getElementById('names');
  if (!K || !tool) return;
  var $ = function (id) { return document.getElementById(id); };
  var q = $('nm-q'), cat = $('nm-cat'), ven = $('nm-ven'), items = tool.querySelectorAll('#nm-list > li'), total = items.length;
  var text = [];
  for (var i = 0; i < total; i++) text.push(items[i].textContent.toLowerCase());
  function has(sel, v) { return typeof v === 'string' && /^[a-z0-9]+$/.test(v) && !!sel.querySelector('option[value="' + v + '"]'); }
  function params() { var p = {}; if (q.value.trim()) p.q = q.value.trim(); if (cat.value !== 'all') p.cat = cat.value; if (ven.value !== 'all') p.on = ven.value; return p; }
  function render() {
    var words = q.value.toLowerCase().split(/\s+/).filter(Boolean), n = 0;
    for (var i = 0; i < total; i++) {
      var li = items[i];
      var ok = (cat.value === 'all' || li.getAttribute('data-c') === cat.value) && (ven.value === 'all' || li.getAttribute('data-v') === ven.value) &&
        words.every(function (w) { return text[i].indexOf(w) !== -1; });
      li.hidden = !ok;
      if (ok) n++;
    }
    $('nm-summary').textContent = n + ' of ' + total + ' names shown' + (q.value.trim() ? ' for “' + q.value.trim() + '”' : '');
    $('nm-none').hidden = n !== 0;
  }
  function csv() {
    var cell = function (s) { return '"' + String(s).replace(/\s+/g, ' ').trim().replace(/"/g, '""') + '"'; };
    var lines = ['name_on_screen,vendor_or_platform,generic_term_and_topic,what_it_means,sources'];
    for (var i = 0; i < total; i++) {
      var li = items[i];
      if (li.hidden) continue;
      var p = li.querySelectorAll('p'), src = [];
      li.querySelectorAll('.nm-s a').forEach(function (a) { var t = document.getElementById(a.getAttribute('href').slice(1)); var l = t && t.parentNode.querySelector('a[href^="http"]'); if (l) src.push(l.href); });
      lines.push([cell(li.querySelector('.nm-h b').textContent), cell(li.querySelector('.tag').textContent), cell(p[1].textContent), cell(p[2].textContent), cell(src.join(' '))].join(','));
    }
    return lines.join('\n') + '\n';
  }
  q.addEventListener('input', render);
  cat.addEventListener('change', render);
  ven.addEventListener('change', render);
  tool.addEventListener('click', function (e) {
    var ex = e.target.closest('button[data-q]');
    if (ex) { q.value = ex.getAttribute('data-q'); cat.value = 'all'; ven.value = 'all'; render(); $('nm-summary').focus(); return; }
    if (e.target.id === 'nm-reset') { q.value = ''; cat.value = 'all'; ven.value = 'all'; render(); q.focus(); }
    if (e.target.id === 'nm-link') K.copy(K.url(params()), $('nm-msg'), 'Link copied – it reopens this filter.');
    if (e.target.id === 'nm-csv') K.download('setting-names.csv', csv(), 'text/csv');
    if (e.target.id === 'nm-print') window.print();
  });
  var p = K.read();
  if (typeof p.q === 'string') q.value = p.q.slice(0, 60);
  if (has(cat, p.cat)) cat.value = p.cat;
  if (has(ven, p.on)) ven.value = p.on;
  render();
})();
