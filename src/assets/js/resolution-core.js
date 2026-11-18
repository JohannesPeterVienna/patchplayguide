/*
 * Upscaler Resolution Calculator – pure logic (no DOM). Unit-tested in tests/logic.test.js.
 * The per-axis scale factors are the ones the vendors publish for developers:
 *   DLSS  – NVIDIA DLSS Super Resolution Programming Guide 310.6.0 (March 2026), table "DLSS Mode / Scaling Ratio"
 *   FSR   – AMD FSR SDK docs, "Scaling modes" (FSR 3.1.6 upscaler and FSR Upscaling 4.1.2 list the same table)
 *   XeSS  – Intel XeSS-SR Developer Guide, "Resolution scaling in XeSS 1.3+" and the legacy column
 * A game may ship other ratios or a free slider; the factors below are the documented presets.
 */
(function (root) {
  'use strict';
  var FAMILIES = {
    dlss: { name: 'NVIDIA DLSS Super Resolution', short: 'DLSS', source: 'NVIDIA DLSS Programming Guide 310.6.0',
      modes: [['DLAA', 1.0], ['Quality', 1.5], ['Balanced', 1.724], ['Performance', 2.0], ['Ultra Performance', 3.0]] },
    fsr: { name: 'AMD FSR upscaling (FSR 3.1 and FSR 4)', short: 'FSR', source: 'AMD FSR SDK documentation',
      modes: [['Native AA', 1.0], ['Quality', 1.5], ['Balanced', 1.7], ['Performance', 2.0], ['Ultra Performance', 3.0]] },
    xess: { name: 'Intel XeSS-SR 1.3 and newer', short: 'XeSS', source: 'Intel XeSS-SR Developer Guide',
      modes: [['Native AA', 1.0], ['Ultra Quality Plus', 1.3], ['Ultra Quality', 1.5], ['Quality', 1.7], ['Balanced', 2.0], ['Performance', 2.3], ['Ultra Performance', 3.0]] },
    xessold: { name: 'Intel XeSS-SR before 1.3 (legacy factors)', short: 'XeSS (pre-1.3)', source: 'Intel XeSS-SR Developer Guide, legacy column',
      modes: [['Ultra Quality', 1.3], ['Quality', 1.5], ['Balanced', 1.7], ['Performance', 2.0]] }
  };
  var OUTPUTS = [
    ['1280x800', 'Steam Deck screen (1280×800)'], ['1920x1080', '1080p (1920×1080)'], ['1920x1200', '1920×1200'],
    ['2560x1440', '1440p (2560×1440)'], ['2560x1600', '2560×1600'], ['3440x1440', 'Ultrawide 3440×1440'],
    ['3840x2160', '4K (3840×2160)'], ['5120x1440', 'Super ultrawide 5120×1440'], ['7680x4320', '8K (7680×4320)']
  ];
  var MIN = 160, MAX = 16384;

  function parseRes(s) {
    var m = /^\s*(\d{3,5})\s*[x×*]\s*(\d{3,5})\s*$/i.exec(String(s == null ? '' : s));
    if (!m) return null;
    var w = Number(m[1]), h = Number(m[2]);
    if (w < MIN || h < MIN || w > MAX || h > MAX) return null;
    return { w: w, h: h };
  }
  // internal resolution for a per-axis factor (output ÷ factor), rounded to whole pixels
  function internal(w, h, factor) {
    var f = Number(factor);
    if (!(f >= 1) || !isFinite(f)) return null;
    var iw = Math.max(1, Math.round(w / f)), ih = Math.max(1, Math.round(h / f));
    return { w: iw, h: ih, pixels: iw * ih, share: (iw * ih) / (w * h), factor: f, axis: 1 / f };
  }
  function rows(w, h, family) {
    var fam = FAMILIES[family];
    if (!fam) return [];
    return fam.modes.map(function (m) {
      var r = internal(w, h, m[1]);
      r.family = family; r.vendor = fam.short; r.mode = m[0];
      return r;
    });
  }
  // every documented preset of every current family, most rendered pixels first
  function allRows(w, h) {
    var out = [];
    ['dlss', 'fsr', 'xess'].forEach(function (k) { out = out.concat(rows(w, h, k)); });
    return out.sort(function (a, b) { return b.pixels - a.pixels || a.vendor.localeCompare(b.vendor); });
  }
  // render-scale slider: percent per axis (e.g. 67) -> same shape as a preset row
  function scaled(w, h, percent) {
    var p = Number(percent);
    if (!(p >= 10 && p <= 100)) return null;
    var r = internal(w, h, 100 / p);
    r.family = 'custom'; r.vendor = 'Render scale'; r.mode = (Math.round(p * 10) / 10) + '%';
    return r;
  }
  function mp(pixels) { return Math.round(pixels / 10000) / 100; } // megapixels, two decimals
  function pct(x) { return Math.round(x * 1000) / 10; } // one decimal
  function text(w, h, list) {
    return ['Internal render resolution for ' + w + '×' + h + ' output (' + mp(w * h) + ' MP)'].concat(list.map(function (r) {
      return r.vendor + ' ' + r.mode + ' (' + r.factor + 'x per axis): ' + r.w + '×' + r.h + ' = ' + mp(r.pixels) + ' MP, ' + pct(r.share) + '% of the output pixels';
    })).concat(['Factors: vendor developer documentation (NVIDIA DLSS Programming Guide, AMD FSR SDK docs, Intel XeSS-SR Developer Guide). Games can use other ratios.', 'https://patchplayguide.com/tools/upscaler-resolution-calculator/']).join('\n');
  }

  var api = { FAMILIES: FAMILIES, OUTPUTS: OUTPUTS, parseRes: parseRes, internal: internal, rows: rows, allRows: allRows, scaled: scaled, mp: mp, pct: pct, text: text };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.PPGResolution = api;
})(this);
