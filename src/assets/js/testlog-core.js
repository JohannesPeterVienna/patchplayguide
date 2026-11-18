/*
 * Settings Test Log – pure logic (no DOM). Unit-tested in tests/logic.test.js.
 * The tool never supplies numbers of its own: it only summarizes the runs a player types in.
 * Verdict rule: a difference counts as "clear" only when every run of one setup beats every run of the other
 * (the two ranges do not overlap). With n runs per setup, pure chance produces such a clean split in
 * 2 of C(2n, n) orderings: 3+3 runs → 2/20, 4+4 → 2/70, 5+5 → 2/252.
 */
(function (root) {
  'use strict';
  var MAX_RUNS = 7;
  // accepts "71 73 72", "71, 73, 72", "71;73;72", "71,73,72" and a decimal comma with one digit ("74,5")
  function parse(text) {
    var out = [];
    String(text == null ? '' : text).split(/[\s;|]+/).forEach(function (tok) {
      if (!tok) return;
      (/^\d+,\d$/.test(tok) ? [tok.replace(',', '.')] : tok.split(',')).forEach(function (s) {
        if (!/^\d+(\.\d+)?$/.test(s)) return;
        var n = Number(s);
        if (n > 0 && n < 100000) out.push(n);
      });
    });
    return out.slice(0, MAX_RUNS);
  }
  function median(a) {
    if (!a.length) return null;
    var s = a.slice().sort(function (x, y) { return x - y; }), m = Math.floor(s.length / 2);
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
  }
  function stats(a) {
    if (!a.length) return null;
    var min = Math.min.apply(null, a), max = Math.max.apply(null, a), med = median(a);
    return { n: a.length, min: min, max: max, median: med, mean: a.reduce(function (x, y) { return x + y; }, 0) / a.length, range: max - min, rangePct: med ? (max - min) / med * 100 : 0 };
  }
  function choose(n, k) { var r = 1; for (var i = 1; i <= k; i++) r = r * (n - k + i) / i; return Math.round(r); }
  // chance of a complete split by luck alone when nothing differs (two-sided), as "1 in N"
  function luck(nA, nB) { return choose(nA + nB, nA) / 2; }
  function compare(a, b) {
    var A = stats(a), B = stats(b);
    if (!A || !B) return { verdict: 'empty', A: A, B: B };
    var diff = B.median - A.median, pct = diff / A.median * 100;
    var out = { A: A, B: B, diff: diff, pct: pct, msA: 1000 / A.median, msB: 1000 / B.median, msDiff: 1000 / B.median - 1000 / A.median, noise: Math.max(A.range, B.range) };
    if (A.n < 3 || B.n < 3) out.verdict = 'few';
    else if (B.min > A.max) { out.verdict = 'b-clear'; out.luck = luck(A.n, B.n); }
    else if (A.min > B.max) { out.verdict = 'a-clear'; out.luck = luck(A.n, B.n); }
    else out.verdict = 'overlap';
    return out;
  }
  function r1(x) { return Math.round(x * 10) / 10; }
  function csv(state) {
    var q = function (s) { return '"' + String(s).replace(/"/g, '""') + '"'; };
    var lines = [['setup', 'metric', 'run', 'value'].join(',')];
    [['A', state.nameA, state.a, state.la], ['B', state.nameB, state.b, state.lb]].forEach(function (s) {
      (s[2] || []).forEach(function (v, i) { lines.push([q(s[1] || 'Setup ' + s[0]), q('average fps'), i + 1, v].join(',')); });
      (s[3] || []).forEach(function (v, i) { lines.push([q(s[1] || 'Setup ' + s[0]), q('1% low fps'), i + 1, v].join(',')); });
    });
    return lines.join('\n') + '\n';
  }
  var WORDS = {
    empty: 'Enter at least three runs for each setup.',
    few: 'Not enough runs yet: with fewer than three runs per setup, one odd run decides the result.',
    overlap: 'No clear difference: the runs of the two setups overlap, so the gap is within your run-to-run spread.',
    'b-clear': 'Clear difference: every run of setup B is faster than every run of setup A.',
    'a-clear': 'Clear difference: every run of setup A is faster than every run of setup B.'
  };
  function summary(state) {
    var c = compare(state.a || [], state.b || []), L = [];
    L.push('Settings test log' + (state.scene ? ' – ' + state.scene : ''));
    [['A', state.nameA, state.a, c.A], ['B', state.nameB, state.b, c.B]].forEach(function (s) {
      L.push('Setup ' + s[0] + (s[1] ? ' (' + s[1] + ')' : '') + ': ' + ((s[2] || []).join(', ') || 'no runs') + (s[3] ? ' → median ' + r1(s[3].median) + ' fps, spread ' + r1(s[3].range) + ' fps' : ''));
    });
    if (c.A && c.B) L.push('Median difference B − A: ' + (c.diff >= 0 ? '+' : '') + r1(c.diff) + ' fps (' + (c.pct >= 0 ? '+' : '') + r1(c.pct) + '%), ' + (c.msDiff <= 0 ? '' : '+') + (Math.round(c.msDiff * 100) / 100) + ' ms per frame');
    L.push(WORDS[c.verdict]);
    var l = compare(state.la || [], state.lb || []);
    if (l.A && l.B) L.push('1% lows – median A ' + r1(l.A.median) + ' fps, B ' + r1(l.B.median) + ' fps: ' + WORDS[l.verdict]);
    L.push('https://patchplayguide.com/tools/settings-test-log/');
    return L.join('\n');
  }

  var api = { MAX_RUNS: MAX_RUNS, WORDS: WORDS, parse: parse, median: median, stats: stats, choose: choose, luck: luck, compare: compare, csv: csv, summary: summary, r1: r1 };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.PPGTestLog = api;
})(this);
