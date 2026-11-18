/* Upscaler Resolution Calculator – browser UI. Arithmetic and factors live in resolution-core.js. */
(function () {
  'use strict';
  var R = window.PPGResolution, K = window.PPGKit, tool = document.getElementById('rescalc');
  if (!R || !K || !tool) return;
  var $ = function (id) { return document.getElementById(id); };
  var out = $('rc-out'), custom = $('rc-custom'), scale = $('rc-scale'), floor = $('rc-floor');
  out.innerHTML = R.OUTPUTS.map(function (o) { return '<option value="' + o[0] + '">' + o[1] + '</option>'; }).join('') + '<option value="custom">Custom…</option>';

  function family() { return (tool.querySelector('input[name="rc-fam"]:checked') || {}).value || 'all'; }
  function state() {
    var res = out.value === 'custom' ? R.parseRes(custom.value) : R.parseRes(out.value);
    return { res: res, fam: family(), scale: Number(scale.value), floor: Number(floor.value) || 0 };
  }
  function params(s) {
    var p = { out: out.value === 'custom' ? String(custom.value).replace(/\s+/g, '').replace(/[×*]/g, 'x') : out.value, up: s.fam };
    if (s.fam === 'scale') p.scale = s.scale;
    if (s.floor) p.floor = s.floor;
    return p;
  }
  function list(s) {
    if (s.fam === 'all') return R.allRows(s.res.w, s.res.h);
    if (s.fam === 'scale') return [R.scaled(s.res.w, s.res.h, s.scale)];
    return R.rows(s.res.w, s.res.h, s.fam);
  }
  var last = null;
  function render() {
    var s = state();
    $('rc-custom-wrap').hidden = out.value !== 'custom';
    $('rc-scale-wrap').hidden = s.fam !== 'scale';
    $('rc-scale-v').textContent = s.scale + '%';
    if (!s.res) {
      $('rc-summary').textContent = 'Enter the output resolution as width × height, for example 2560x1080.';
      $('rc-table').innerHTML = ''; last = null; return;
    }
    var rows = list(s), total = s.res.w * s.res.h;
    last = { s: s, rows: rows };
    $('rc-summary').textContent = 'Output ' + s.res.w + '×' + s.res.h + ' = ' + R.mp(total) + ' megapixels per frame · ' + rows.length + (rows.length === 1 ? ' row' : ' rows') + (s.fam === 'all' ? ' · all three vendors, most rendered pixels first' : '');
    $('rc-table').innerHTML = '<table class="rt"><caption class="sr">Internal render resolution per mode</caption><thead><tr><th scope="col">Mode</th><th scope="col">Factor</th><th scope="col">Renders</th><th scope="col">Megapixels</th><th scope="col">Share of output pixels</th></tr></thead><tbody>' +
      rows.map(function (r) {
        var low = s.floor && r.h < s.floor;
        return '<tr' + (low ? ' class="low"' : '') + '><th scope="row"><span class="rt-v">' + K.esc(r.vendor) + '</span> ' + K.esc(r.mode) + '</th><td>' + r.factor.toFixed(3).replace(/0+$/, '').replace(/\.$/, '.0') + '×</td><td><b>' + r.w + '×' + r.h + '</b>' + (low ? ' <span class="badge badge-alt">below ' + s.floor + ' lines</span>' : '') + '</td><td>' + R.mp(r.pixels).toFixed(2) + '</td><td><span class="bar" aria-hidden="true"><i style="width:' + Math.max(2, R.pct(r.share)) + '%"></i></span>' + R.pct(r.share).toFixed(1) + '%</td></tr>';
      }).join('') + '</tbody></table>';
    K.sync(params(s));
  }
  function apply(p) {
    if (p.out) {
      if (R.OUTPUTS.some(function (o) { return o[0] === p.out; })) out.value = p.out;
      else if (R.parseRes(p.out)) { out.value = 'custom'; custom.value = p.out; }
    }
    var r = p.up && tool.querySelector('input[name="rc-fam"][value="' + String(p.up).replace(/[^a-z]/g, '') + '"]');
    if (r) r.checked = true;
    var sc = Number(p.scale); if (sc >= 25 && sc <= 100) scale.value = sc;
    if (p.floor && floor.querySelector('option[value="' + Number(p.floor) + '"]')) floor.value = String(Number(p.floor));
  }
  tool.addEventListener('change', render);
  custom.addEventListener('input', render);
  scale.addEventListener('input', render);
  tool.addEventListener('click', function (e) {
    var ex = e.target.closest('button[data-ex]');
    if (ex) { floor.value = '0'; apply(parse(ex.getAttribute('data-ex'))); render(); $('rc-summary').focus(); return; }
    if (e.target.id === 'rc-link') K.copy(K.url(params(state())), $('rc-msg'), 'Link copied – it reopens this exact calculation.');
    if (e.target.id === 'rc-copy' && last) K.copy(R.text(last.s.res.w, last.s.res.h, last.rows), $('rc-msg'), 'Table copied as text.');
    if (e.target.id === 'rc-print') window.print();
  });
  function parse(q) { var o = {}; q.split('&').forEach(function (kv) { var i = kv.indexOf('='); o[kv.slice(0, i)] = kv.slice(i + 1); }); return o; }
  out.value = '2560x1440';
  apply(K.read());
  render();
})();
