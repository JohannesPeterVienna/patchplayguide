/*
 * Settings Test Log – pure logic (no DOM). Unit-tested in tests/logic.test.js.
 * The tool never supplies numbers of its own: it only summarizes the runs a player types in.
 * Verdict rule: a difference counts as "separated" only when every run of one setup beats every run of the other
 * (the two ranges do not overlap). Overlap means "inconclusive" – it never means "equal" or "not noticeable". With n runs per setup, pure chance produces such a clean split in
 * 2 of C(2n, n) orderings: 3+3 runs → 2/20, 4+4 → 2/70, 5+5 → 2/252.
 */
(function (root) {
  'use strict';
  var MAX_RUNS = 7;
  // Input format (no guessing): runs are separated by spaces, line breaks, semicolons or a comma followed by a space;
  // a comma or point directly between digits is a decimal mark ("71,5" = "71.5"), one kind per field.
  // Ambiguous input – "71,73,72" (commas without spaces), "71.5 72,5" (mixed marks), "abc" – is rejected with a message.
  var FORMAT_HINT = 'Separate runs with a space, a line break, a semicolon or a comma followed by a space – for example “71 73 72”, “71, 73, 72” or “71,5; 72,5; 73,5”.';
  function read(text) {
    var toks = String(text == null ? '' : text).replace(/,(?=\s|$)/g, ' ').split(/[\s;]+/).filter(Boolean), out = [], marks = {};
    for (var i = 0; i < toks.length; i++) {
      var tok = toks[i], m = /^(\d+)(?:([.,])(\d+))?$/.exec(tok);
      if (!m) {
        var why = /^[\d.,]+$/.test(tok) && /,/.test(tok) ? 'We cannot tell how to read “' + tok + '”: a comma directly between digits is a decimal mark, so “71,5” means 71.5. To list several runs, put a space after each comma.' : '“' + tok.slice(0, 20) + '” is not a frame rate.';
        return { values: [], error: why + ' ' + FORMAT_HINT };
      }
      if (m[2]) marks[m[2]] = true;
      if (marks['.'] && marks[',']) return { values: [], error: 'This field mixes decimal points and decimal commas. Please use one of them for all runs. ' + FORMAT_HINT };
      var n = Number(m[1] + (m[2] ? '.' + m[3] : ''));
      if (!(n > 0 && n < 100000)) return { values: [], error: '“' + tok + '” is outside 0–100000. ' + FORMAT_HINT };
      out.push(n);
    }
    var extra = out.length > MAX_RUNS ? out.length - MAX_RUNS : 0;
    return { values: out.slice(0, MAX_RUNS), error: null, dropped: extra };
  }
  // values only (empty when the input is rejected); the UI shows read(text).error next to the field
  function parse(text) { return read(text).values; }
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
    // text cells that a spreadsheet would read as a formula (= + - @, also after leading blanks or tabs) get a leading apostrophe
    var q = function (s) { s = String(s); if (/^[\s]*[=+\-@]/.test(s)) s = "'" + s; return '"' + s.replace(/"/g, '""') + '"'; };
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
    overlap: 'Inconclusive: the observed ranges overlap, so this strict rule does not identify a separated result. That does not establish equal performance – compare the medians and the spread, and repeat a controlled comparison if the decision matters.',
    'b-clear': 'Separated: every run of setup B is faster than every run of setup A. The observed ranges do not overlap; this is no proof of what caused the difference.',
    'a-clear': 'Separated: every run of setup A is faster than every run of setup B. The observed ranges do not overlap; this is no proof of what caused the difference.'
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

  var api = { MAX_RUNS: MAX_RUNS, FORMAT_HINT: FORMAT_HINT, WORDS: WORDS, read: read, parse: parse, median: median, stats: stats, choose: choose, luck: luck, compare: compare, csv: csv, summary: summary, r1: r1 };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.PPGTestLog = api;
})(this);
