import { createRequire } from 'node:module';
import { tbl, fig } from '../h.mjs';
import { esc } from '../layout.mjs';
const require = createRequire(import.meta.url);
const N = require('../data/names-core.js');

const srcIds = Object.keys(N.SOURCES);
const srcNo = (id) => srcIds.indexOf(id) + 1;
const opts = (map) => Object.keys(map).map((k) => `<option value="${k}">${esc(map[k])}</option>`).join('');
const item = (r) => `<li id="${r.id}" class="nm" data-c="${r.c}" data-v="${r.v}"><p class="nm-h"><b>${esc(r.n)}</b><span class="tag">${esc(N.VENDORS[r.v])}</span></p><p class="nm-g">${esc(r.g)} · ${esc(N.CATS[r.c].replace(/ \(.*/, ''))}</p><p>${esc(r.d)}</p><p class="nm-s">Source: ${r.s.map((id) => `<a href="#src-${id}">[${srcNo(id)}]</a>`).join(' ')}</p></li>`;

const toolHtml = `<section class="tool" id="names" aria-labelledby="nm-h">
<div class="tool-head"><h2 id="nm-h">Setting-name map</h2><p class="tool-sub">${N.ROWS.length} names · ${srcIds.length} official sources · compiled November 18, 2026, checked November 24, 2026</p></div>
<label for="nm-q">Search a name you see in a menu (for example “Balanced”, “Anti-Lag”, “120 Hz”)<input type="search" id="nm-q" autocomplete="off"></label>
<div class="filters">
<label for="nm-cat">Topic<select id="nm-cat"><option value="all">All topics</option>${opts(N.CATS)}</select></label>
<label for="nm-ven">Vendor or platform<select id="nm-ven"><option value="all">All vendors and platforms</option>${opts(N.VENDORS)}</select></label>
</div>
<div class="examples"><span class="tool-sub">Try:</span>
<button type="button" class="chip" data-q="balanced">Balanced</button><button type="button" class="chip" data-q="performance">Performance</button><button type="button" class="chip" data-q="frame generation">frame generation</button><button type="button" class="chip" data-q="driver-level">driver-level</button><button type="button" class="chip" data-q="latency">latency</button><button type="button" class="chip" data-q="120 Hz">120 Hz</button><button type="button" class="chip" data-q="variable refresh">variable refresh</button>
</div>
<p id="nm-summary" class="sum" tabindex="-1" aria-live="polite">${N.ROWS.length} of ${N.ROWS.length} names shown</p>
<p id="nm-none" hidden>No name matches. Try a shorter word, or reset the filters.</p>
<ul id="nm-list" class="results names">${N.ROWS.map(item).join('')}</ul>
<div class="row tool-actions"><button type="button" id="nm-link">Copy link to this filter</button><button type="button" id="nm-csv" class="ghost">Download shown rows as CSV</button><button type="button" id="nm-print" class="ghost">Print</button><button type="button" id="nm-reset" class="ghost">Reset</button><span id="nm-msg" class="tool-sub" aria-live="polite"></span></div>
</section>`;

const modes = N.ROWS.filter((r) => r.f);
const pct = (f) => (Math.round(1000 / f) / 10).toFixed(1) + '%';
const by = (tech, name) => { const r = modes.find((m) => m.n === `${tech} – ${name}`); return r ? `${r.f}× · ${pct(r.f)} per axis` : '–'; };
const presets = tbl('Upscaler preset names and what they render per axis', ['Name in the menu', 'DLSS', 'FSR', 'XeSS (1.3 and newer)'], [
  ['Native AA / DLAA', by('DLSS', 'DLAA'), by('FSR', 'Native AA'), by('XeSS', 'Native Anti-Aliasing')],
  ['Ultra Quality Plus', '–', '–', by('XeSS', 'Ultra Quality Plus')],
  ['Ultra Quality', '–', '–', by('XeSS', 'Ultra Quality')],
  ['Quality', by('DLSS', 'Quality'), by('FSR', 'Quality'), by('XeSS', 'Quality')],
  ['Balanced', by('DLSS', 'Balanced'), by('FSR', 'Balanced'), by('XeSS', 'Balanced')],
  ['Performance', by('DLSS', 'Performance'), by('FSR', 'Performance'), by('XeSS', 'Performance')],
  ['Ultra Performance', by('DLSS', 'Ultra Performance'), by('FSR', 'Ultra Performance'), by('XeSS', 'Ultra Performance')]
], 'Factors as documented by NVIDIA, AMD and Intel for developers. The percentage is the internal resolution per axis; the share of pixels is its square.');

const families = tbl('One job, several names', ['What it does', 'NVIDIA', 'AMD', 'Intel', 'Consoles and Windows'], [
  ['Upscaling', 'DLSS Super Resolution', 'FSR upscaling (3.1, 4)', 'XeSS-SR', 'PSSR on PS5 Pro, QSSR on PS5'],
  ['Frame generation in the game', 'DLSS Frame Generation, Multi Frame Generation', 'FSR Frame Generation', 'XeSS-FG', '–'],
  ['Frame generation in the driver', 'Smooth Motion', 'AMD Fluid Motion Frames', '–', '–'],
  ['Latency reduction in the game', 'Reflex', 'Anti-Lag 2', 'XeLL', '–'],
  ['Latency reduction in the driver', '–', 'Radeon Anti-Lag', '–', '–'],
  ['Ray-tracing denoiser', 'DLSS Ray Reconstruction', 'FSR Ray Regeneration', '–', '–'],
  ['Variable refresh rate', 'G-SYNC', 'FreeSync', '–', 'VRR (PS5, Switch 2), Allow variable refresh rate (Xbox), Variable refresh rate (Windows)']
], 'A dash means: no name from this vendor in the sources used for this map – not necessarily that nothing exists.');

const bar = (y, label, w, cls, val) => `<text class="g-t" x="20" y="${y + 16}">${label}</text><rect class="g-panel" x="150" y="${y}" width="400" height="22" rx="3"/><rect class="${cls}" x="150" y="${y}" width="${w}" height="22" rx="3"/><text class="g-tm" x="560" y="${y + 16}">${val}</text>`;
const chart = fig('nm-fig', 'Bar chart: share of output pixels rendered by the preset called Balanced – 33.6 percent with DLSS, 34.6 percent with FSR and 25 percent with XeSS',
`<rect class="g-bg" width="640" height="250"/>
<text class="g-tm" x="20" y="28">ONE NAME, THREE PIXEL COUNTS · share of output pixels rendered</text>
<text class="g-tb" x="20" y="58">“Balanced”</text>
${bar(68, 'DLSS 1.724×', 134, 'g-plus', '33.6%')}${bar(96, 'FSR 1.7×', 138, 'g-acc', '34.6%')}${bar(124, 'XeSS 2.0×', 100, 'g-minus', '25.0%')}
<text class="g-tb" x="20" y="172">“Quality”</text>
${bar(182, 'DLSS / FSR 1.5×', 178, 'g-plus', '44.4%')}${bar(210, 'XeSS 1.7×', 138, 'g-minus', '34.6%')}`,
'Calculated from the documented scale factors (share of pixels = 1 ÷ factor²). XeSS Quality renders the same share as FSR Balanced; XeSS Balanced renders what DLSS and FSR call Performance.', '0 0 640 250');

const sourcesList = srcIds.map((id) => { const [label, url, via] = N.SOURCES[id]; return [`<span id="src-${id}">[${srcNo(id)}]</span> ${label}`, url, via === 'doc' ? 'developer document, read in full on November 18, 2026' : 'official page, read in full on November 24, 2026']; });

export default {
  slug: 'setting-names',
  dir: 'reference',
  published: '2026-11-18',
  changelog: [['2026-11-18', 'First published.'], ['2026-11-24', 'All official pages that had been used through search-engine extracts were read in full and the entries matched to their wording. Corrected: FreeSync tier requirements (AMD’s current tier table), Switch 2 VRR in TV mode (update 23.0.0, dock firmware), PS5 and Xbox 120 Hz entries. Added: QSSR, Handheld Mode Boost, Multi Frame Generation up to 6×.']],
  short: 'Setting-name map',
  title: 'Setting-name map: DLSS, FSR, XeSS, VRR and console terms',
  description: 'Searchable map of graphics and display setting names: what each DLSS, FSR and XeSS preset renders, frame generation, latency, VRR and console terms, sourced.',
  kicker: 'Reference · names',
  h1: 'Setting-name map: the same setting under different names',
  lede: 'A graphics menu is full of brand names. NVIDIA, AMD, Intel, Sony, Microsoft, Nintendo and Valve each name the same ideas differently – and sometimes use the same word for different things. This map lists the names you meet in game menus, driver panels and console settings, says in one sentence what each one is, and links the official document it was taken from. Search for the word on your screen.',
  scripts: ['toolkit.js', 'names.js'],
  toolHtml,
  sections: [
    `<h2 id="how">How the map was compiled</h2>
<p>Every entry comes from a document published by the company that makes the product: developer guides in the vendors’ public repositories, platform support pages and official announcements. Nothing in the map is our own measurement or opinion about quality. Where a vendor publishes a number – a scale factor, a minimum frame rate, a requirement – the entry repeats that number and names the source in square brackets; the numbered list is under <a href="#sources">Sources</a>, with the date the sources were read.</p>
<p>Two kinds of sources were used, and the list says which is which. Developer documents from NVIDIA, AMD and Intel were read in full on November 18, 2026. Support, product and news pages of Sony, Microsoft, Nintendo, Valve, AMD and NVIDIA were at first only available to us as search-engine extracts; on November 24, 2026 every one of them was opened and read in full, the entries were matched to the official wording, and outdated ones were corrected – AMD’s FreeSync tier requirements, for example, and the Switch 2 VRR entries. Names we could not tie to an official source are left out instead of guessed – that is why, for example, NVIDIA’s G-SYNC display tiers are missing.</p>`,
    `<h2 id="jobs">One job, several names</h2>
<p>Most of the names fall into seven jobs. If you know the job, the brand name stops being a puzzle:</p>
${families}
<p>The split between “in the game” and “in the driver” matters in practice. A feature built into the game receives motion vectors, depth and the position of the interface from the game; a driver-level feature sees only finished images. AMD describes the difference for its two latency features: the driver version aligns CPU and GPU work from outside, while Anti-Lag 2 places its wait directly before the game reads your input.</p>`,
    `<h2 id="presets">One name, several meanings</h2>
${chart}
${presets}
<p>The table is the reference; what it means for choosing and comparing upscalers is explained in <a href="/guides/dlss-vs-fsr-vs-xess/#modes">DLSS vs FSR vs XeSS</a>, and the <a href="/tools/upscaler-resolution-calculator/">Upscaler Resolution Calculator</a> turns the factors into the internal resolution for your display.</p>
<p>A second trap is the word “VRR” on Windows. <b>Variable refresh rate</b> on the Graphics settings page is the game feature; <b>Dynamic refresh rate</b> on the Advanced display page lets Windows change the desktop refresh rate on its own. The names differ by one word and do different things.</p>`,
    `<h2 id="use">How to use it after a patch</h2>
<p>Patch notes mention these names constantly: “updated to FSR 4”, “added XeSS-FG”, “Reflex support”. Search the name here to see which job it does, then decide what to re-test. An upscaler update can change image quality at the same preset; a new frame-generation option needs a look at the rendered frame rate first (the <a href="/tools/frame-time-calculator/">Frame Time Calculator</a> shows shown versus rendered frames); a new latency option is worth switching on and comparing. The <a href="/tools/patch-decoder/">Patch Decoder</a> sorts such lines, and <a href="/guides/how-to-read-patch-notes/">how to read patch notes</a> explains the wording.</p>
<p>Menus and requirements change with driver and system updates. Each entry reflects the linked document on the date given. If a name has changed on your system, please <a href="/contact/">tell us</a> with the source – corrections are logged in the change log below.</p>`
  ],
  faq: [
    ['Is DLSS Balanced the same as XeSS Balanced?', 'No. NVIDIA documents 1.724× per axis for DLSS Balanced (58% of the output resolution), Intel documents 2.0× for XeSS Balanced since version 1.3 (50%), which equals DLSS Performance.'],
    ['What is the difference between Anti-Lag and Anti-Lag 2?', 'Radeon Anti-Lag works purely in the driver. Anti-Lag 2 is integrated by the game’s developer and places its delay just before the game samples your input, which AMD describes as a significantly greater latency reduction.'],
    ['What is the difference between DLSS Frame Generation and Smooth Motion?', 'DLSS Frame Generation is built into a game by its developer. Smooth Motion is a driver feature that adds one interpolated frame between two rendered frames in games without DLSS Frame Generation and is switched on per game in the NVIDIA app.'],
    ['Are FreeSync, G-SYNC and VRR the same thing?', 'They are names for variable refresh rate: the display waits for the next frame instead of refreshing at fixed intervals. AMD’s documentation lists AMD FreeSync, NVIDIA G-SYNC and VESA AdaptiveSync as VRR technologies; consoles call the HDMI version simply VRR.']
  ],
  sources: sourcesList,
  sourcesNote: `Developer documents were read in full on November 18, 2026; official support, product and news pages were read in full on November 24, 2026. Until that day several of these pages were known to us only from search-engine extracts; the entries that depended on them were checked against the full pages and corrected where needed.`,
  related: ['upscaler-resolution-calculator', 'dlss-vs-fsr-vs-xess', 'frame-generation-explained']
};
