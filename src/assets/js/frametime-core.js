/*
 * Frame Time Calculator – pure arithmetic (no DOM). Unit-tested in tests/logic.test.js.
 * Nothing here is a measurement: every result follows from frame time = 1000 ms ÷ frames per second.
 */
(function (root) {
  'use strict';
  function num(v, lo, hi) { var n = Number(v); return isFinite(n) && n >= lo && n <= hi ? n : null; }
  function ms(fps) { return 1000 / fps; }
  function round(x, d) { var p = Math.pow(10, d == null ? 2 : d); return Math.round(x * p) / p; }
  function near(x) { return Math.abs(x - Math.round(x)) < 1e-9; }

  // frame rates a fixed-refresh display can show with every frame held for the same number of refreshes
  function evenRates(hz, max) {
    var out = [];
    for (var n = 1; n <= (max || 6); n++) out.push({ refreshes: n, fps: round(hz / n, 2), ms: round(1000 * n / hz, 2) });
    return out;
  }
  // how a steady frame rate lands on a fixed refresh rate with V-Sync (no VRR)
  function fit(fps, hz) {
    var r = hz / fps;
    if (fps > hz + 1e-9) return { kind: 'above', ratio: r, refreshMs: ms(hz) };
    if (near(r)) return { kind: 'even', refreshes: Math.round(r), holdMs: ms(fps), ratio: r };
    var lo = Math.floor(r), hi = lo + 1;
    return { kind: 'uneven', ratio: r, lo: lo, hi: hi, loMs: lo * ms(hz), hiMs: hi * ms(hz), shareHi: r - lo };
  }
  // where a frame rate sits relative to a variable-refresh window [min, max] Hz
  function vrr(fps, min, max) {
    if (!(min > 0) || !(max >= min)) return null;
    if (fps > max + 1e-9) return { kind: 'above', fps: fps, max: max };
    if (fps >= min - 1e-9) return { kind: 'inside', hz: fps };
    var k = Math.ceil(min / fps - 1e-9);
    if (fps * k <= max + 1e-9) return { kind: 'multiple', times: k, hz: fps * k };
    return { kind: 'below', min: min };
  }
  // frame generation: displayed rate, and what stays tied to the rendered rate
  function generate(base, mult, hz) {
    var shown = base * mult;
    return { base: base, mult: mult, shown: shown, renderedMs: ms(base), shownMs: ms(shown),
      generatedShare: (mult - 1) / mult, overRefresh: hz ? shown > hz + 1e-9 : false, baseForRefresh: hz ? hz / mult : null };
  }
  // the frame-generation result in words (plain text; the UI wraps each sentence in a paragraph).
  // The multiplied rate is the rate the generator outputs – what reaches the screen is capped by the refresh rate.
  function describeGeneration(base, mult, hz) {
    var g = generate(base, mult, hz), f = function (x) { return round(x, 2).toFixed(2).replace(/\.?0+$/, ''); };
    var out = [f(base) + ' rendered fps × ' + mult + ' = generated output rate of ' + f(g.shown) + ' fps, one image every ' + f(g.shownMs) + ' ms. ' + Math.round(g.generatedShare * 100) + '% of these images are generated. The game still reads your input and updates the world once per rendered frame – every ' + f(g.renderedMs) + ' ms.'];
    if (hz) out.push(g.overRefresh
      ? 'The display refreshes at most ' + f(hz) + ' times per second, so it can show at most ' + f(hz) + ' of these ' + f(g.shown) + ' images per second; the rest are never displayed in full, or the game is held back by V-Sync or a cap. To land exactly on the refresh rate at ' + mult + '×, the rendered rate would be ' + f(g.baseForRefresh) + ' fps.'
      : 'That fits a ' + f(hz) + ' Hz display (' + f(g.baseForRefresh) + ' rendered fps would fill it completely at ' + mult + '×).');
    return out;
  }
  function compare(a, b) { return { msA: ms(a), msB: ms(b), savedMs: ms(a) - ms(b), fpsPct: (b - a) / a * 100, timePct: (ms(b) - ms(a)) / ms(a) * 100 }; }
  // average FPS of a list of frame times (ms): frames ÷ total time – not the mean of the per-frame FPS values
  function averageFps(times) {
    var t = times.filter(function (x) { return x > 0; });
    if (!t.length) return null;
    var sum = t.reduce(function (a, b) { return a + b; }, 0);
    return 1000 * t.length / sum;
  }
  // "1% low" as the frame rate of the slowest 1% of frames (at least one frame), plus the 99th-percentile frame time
  function lows(times, share) {
    var t = times.filter(function (x) { return x > 0; }).sort(function (a, b) { return b - a; });
    if (!t.length) return null;
    var n = Math.max(1, Math.round(t.length * (share || 0.01)));
    var worst = t.slice(0, n), sum = worst.reduce(function (a, b) { return a + b; }, 0);
    return { frames: n, lowFps: 1000 * n / sum, percentileMs: t[n - 1], worstMs: t[0] };
  }

  var api = { num: num, ms: ms, round: round, evenRates: evenRates, fit: fit, vrr: vrr, generate: generate, describeGeneration: describeGeneration, compare: compare, averageFps: averageFps, lows: lows };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.PPGFrameTime = api;
})(this);
