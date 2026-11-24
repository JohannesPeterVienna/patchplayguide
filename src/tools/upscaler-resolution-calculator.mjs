import { createRequire } from 'node:module';
import { tbl, fig, SRC } from '../h.mjs';
const require = createRequire(import.meta.url);
const R = require('../assets/js/resolution-core.js');

const toolHtml = `<section class="tool" id="rescalc" aria-labelledby="rc-h">
<div class="tool-head"><h2 id="rc-h">Upscaler Resolution Calculator</h2><p class="tool-sub">Vendor-documented factors · pure arithmetic</p></div>
<div class="filters">
<label for="rc-out">Output resolution (what your display shows)<select id="rc-out"></select></label>
<label for="rc-floor">Mark modes that render fewer lines than<select id="rc-floor"><option value="0">Do not mark</option><option value="540">540 lines</option><option value="720">720 lines</option><option value="900">900 lines</option><option value="1080">1080 lines</option></select></label>
</div>
<div id="rc-custom-wrap" hidden><label for="rc-custom">Custom output, width × height<input type="text" id="rc-custom" inputmode="text" autocomplete="off" placeholder="2560x1080"></label></div>
<fieldset><legend>Upscaler</legend><div class="seg">
<label><input type="radio" name="rc-fam" value="all" checked><span>All three</span></label>
<label><input type="radio" name="rc-fam" value="dlss"><span>DLSS</span></label>
<label><input type="radio" name="rc-fam" value="fsr"><span>FSR</span></label>
<label><input type="radio" name="rc-fam" value="xess"><span>XeSS</span></label>
<label><input type="radio" name="rc-fam" value="xessold"><span>XeSS before 1.3</span></label>
<label><input type="radio" name="rc-fam" value="scale"><span>Render-scale slider</span></label>
</div></fieldset>
<div id="rc-scale-wrap" hidden><label for="rc-scale">Render scale per axis: <span id="rc-scale-v">67%</span><input type="range" id="rc-scale" min="25" max="100" step="1" value="67"></label></div>
<p id="rc-summary" class="sum" tabindex="-1" aria-live="polite"></p>
<div id="rc-table" class="results tool-table"></div>
<div class="row tool-actions"><button type="button" id="rc-link">Copy link to this result</button><button type="button" id="rc-copy" class="ghost">Copy as text</button><button type="button" id="rc-print" class="ghost">Print</button><span id="rc-msg" class="tool-sub" aria-live="polite"></span></div>
<div class="examples"><span class="tool-sub">Examples:</span>
<button type="button" class="chip" data-ex="out=2560x1440&amp;up=dlss">1440p with DLSS</button>
<button type="button" class="chip" data-ex="out=3840x2160&amp;up=all">4K, all vendors side by side</button>
<button type="button" class="chip" data-ex="out=1920x1080&amp;up=xess&amp;floor=720">1080p with XeSS, mark below 720 lines</button>
<button type="button" class="chip" data-ex="out=1280x800&amp;up=fsr">Steam Deck screen with FSR</button>
<button type="button" class="chip" data-ex="out=3440x1440&amp;up=scale&amp;scale=80">Ultrawide at 80% render scale</button>
</div>
</section>`;

const f = (n) => (n === 1.724 ? '1.724' : n.toFixed(1));
const names = ['Quality', 'Balanced', 'Performance', 'Ultra Performance'];
const cell = (fam, name) => { const m = R.FAMILIES[fam].modes.find((x) => x[0] === name); const r = R.internal(3840, 2160, m[1]); return `${f(m[1])}× → ${r.w}×${r.h} (${R.pct(r.share).toFixed(1)}%)`; };
const sameName = tbl('The same preset name at 4K output (3840×2160): factor per axis, internal resolution and share of the output pixels', ['Preset name', 'DLSS', 'FSR', 'XeSS 1.3 and newer', 'XeSS before 1.3'],
  names.map((n) => [n, cell('dlss', n), cell('fsr', n), cell('xess', n), R.FAMILIES.xessold.modes.some((x) => x[0] === n) ? cell('xessold', n) : 'not offered']),
  'Calculated from the factors each vendor documents for developers. Individual games can ship other ratios.');

const box = (x, y, w, h, cls, label) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" class="${cls}"/><text class="g-tm" x="${x + 8}" y="${y + h - 8}">${label}</text>`;
const nested = fig('rc-fig', 'Nested rectangles drawn to scale: a 4K output frame and the smaller frames that DLSS Quality, Balanced, Performance and Ultra Performance render',
`<rect class="g-bg" width="640" height="330"/>
<rect x="20" y="20" width="480" height="270" fill="none" stroke="#FFC531" stroke-width="2"/><text class="g-tm" x="28" y="282">Output 3840×2160 · 100%</text>
<rect x="20" y="20" width="320" height="180" fill="#16273A" stroke="#7CC4FF" stroke-width="1.5"/><text class="g-tm" x="28" y="192">Quality 2560×1440 · 44.4%</text>
<rect x="20" y="20" width="278" height="157" fill="#1B3148" stroke="#7CC4FF" stroke-width="1.5"/><text class="g-tm" x="28" y="169">Balanced 2227×1253 · 33.6%</text>
<rect x="20" y="20" width="240" height="135" fill="#213B55" stroke="#47D98A" stroke-width="1.5"/><text class="g-tm" x="28" y="147">Performance 1920×1080 · 25%</text>
<rect x="20" y="20" width="160" height="90" fill="#284662" stroke="#FF6B7F" stroke-width="1.5"/><text class="g-tm" x="28" y="102">Ultra Perf. 1280×720</text>
<text class="g-tm" x="514" y="40">DLSS at 4K,</text><text class="g-tm" x="514" y="58">drawn to scale</text>
<text class="g-tm" x="20" y="316">Every rectangle is what the game renders; the upscaler rebuilds the rest.</text>`,
'DLSS presets at 4K output, drawn to scale. The areas show why the frame rate changes so much: Performance mode shades a quarter of the pixels of the output frame, Ultra Performance one ninth.', '0 0 640 330');

export default {
  slug: 'upscaler-resolution-calculator',
  published: '2026-11-18',
  changelog: [['2026-11-18', 'First published.'], ['2026-11-24', 'Render-scale note corrected: 67% per axis is approximately, not exactly, the 1.5× Quality factor (at 4K 2573×1447 against 2560×1440). The explanation of preset names, which repeated the upscaler guide, shortened to a link.']],
  short: 'Upscaler Resolution Calculator',
  title: 'Upscaler Resolution Calculator: DLSS, FSR, XeSS pixels',
  description: 'Enter your display resolution and see what DLSS, FSR and XeSS really render in each mode: internal resolution, megapixels and pixel share, from vendor docs.',
  kicker: 'Tool · calculator',
  h1: 'Upscaler Resolution Calculator: what each mode really renders',
  lede: '“Quality”, “Balanced” and “Performance” sound the same in every game, but they are not the same number of pixels. Pick your output resolution and this calculator shows the internal render resolution of every documented DLSS, FSR and XeSS preset, how many megapixels that is and what share of your display’s pixels the game actually shades.',
  scripts: ['toolkit.js', 'resolution-core.js', 'resolution.js'],
  toolHtml,
  sections: [
    `<h2 id="how">How the calculator works</h2>
<p>An upscaler preset is a division. Each vendor documents a <b>scale factor per axis</b> for every preset, and the game divides the output width and height by it. DLSS Quality has the factor 1.5, so a 2560×1440 output is rendered at 2560 ÷ 1.5 by 1440 ÷ 1.5, which is 1707×960. Because both axes shrink, the pixel count falls with the square of the factor: 1.5 × 1.5 = 2.25, so Quality shades 1 ÷ 2.25 = 44.4% of the output pixels.</p>
<p>The calculator does exactly this for every preset and rounds to whole pixels. The megapixel column is width × height ÷ 1,000,000; the bar shows the share of the output pixels. The factors come from three developer documents: NVIDIA’s DLSS Programming Guide, AMD’s FSR SDK documentation and Intel’s XeSS-SR Developer Guide. They are listed under <a href="#sources">Sources</a>, and none of the numbers on this page is a measurement of ours.</p>`,
    `<h2 id="names">Same name, different pixels</h2>
<p>The calculator uses each vendor’s own factor for each name, so the same preset name can give different results: DLSS and FSR Quality use 1.5×, XeSS Quality (since XeSS 1.3) 1.7×. The table shows the effect at a 1440p output; why it matters when you compare upscalers or after a patch that changes the XeSS version is explained in <a href="/guides/dlss-vs-fsr-vs-xess/#modes">DLSS vs FSR vs XeSS</a>.</p>
${sameName}
<p>The <a href="/reference/setting-names/?q=balanced">setting-name map</a> lists every preset with its source.</p>`,
    `<h2 id="read">How to read the result</h2>
${nested}
<p><b>Internal resolution</b> tells you how much real detail the upscaler has to work with. The same preset gives very different inputs on different displays: Performance mode renders 1920×1080 for a 4K display but only 960×540 for a 1080p display. The option “Mark modes that render fewer lines than…” highlights every preset that falls under a line count you choose, so you can see at a glance which presets get thin on your screen. Which floor looks acceptable is your call – compare two presets in one scene and trust your eyes.</p>
<p><b>Share of output pixels</b> is the number that relates to GPU load. Most per-pixel work scales with it, so going from Quality (44.4%) to Performance (25%) removes almost half of the shaded pixels. It is not a frame-rate prediction: the upscaler itself costs time, parts of a frame do not depend on resolution, and if the CPU is the limit the frame rate barely moves. To find out which case applies to you, use the <a href="/tools/bottleneck-finder/">Bottleneck Finder</a>, and verify a change with the <a href="/tools/settings-test-log/">Settings Test Log</a>.</p>
<p><b>Render-scale slider</b> covers games that offer a percentage instead of presets, and engine upscalers such as TSR. The percentage is per axis as well: 67% per axis is approximately the 1.5× Quality factor (exactly 1.5× would be 66.7%). At a 4K output, 67% gives 2573×1447, the 1.5× factor 2560×1440.</p>`,
    `<h2 id="limits">What the calculator does not know</h2>
<p>The factors are the documented presets, not a promise about a particular game. Developers may choose their own ratios, offer a free slider, or combine an upscaler with dynamic resolution, where the internal resolution changes from frame to frame. Rounding can differ by a pixel between implementations. If a game shows its internal resolution in the menu, that number wins. Console games rarely expose presets at all; there the developer picks the internal resolution per mode, see <a href="/guides/ps5-performance-vs-fidelity-mode/">PS5 performance and fidelity modes</a>.</p>`
  ],
  faq: [
    ['What resolution does DLSS Quality render at 1440p?', 'NVIDIA documents a factor of 1.5 per axis for Quality, so a 2560×1440 output is rendered at 1707×960, which is 44.4% of the output pixels.'],
    ['Is XeSS Quality the same as DLSS Quality?', 'No. Since XeSS 1.3, Intel documents 1.7× for Quality, while DLSS and FSR Quality use 1.5×. At 4K that is 2259×1271 for XeSS against 2560×1440 for DLSS and FSR.'],
    ['Why does Performance mode look worse at 1080p than at 4K?', 'The factor is the same, 2.0× per axis, but the input is not: 4K output is rendered at 1920×1080, a 1080p output at only 960×540. The upscaler has a quarter of the real pixels to work with.'],
    ['Does a lower internal resolution always raise the frame rate?', 'Only when the graphics card is the limit. The pixel share describes how much less the GPU has to shade; if the CPU limits the frame rate, fewer pixels change little.']
  ],
  sources: [SRC.dlss, SRC.fsr, SRC.fsr4, SRC.xess],
  related: ['dlss-vs-fsr-vs-xess', 'setting-names', 'frame-time-calculator']
};
