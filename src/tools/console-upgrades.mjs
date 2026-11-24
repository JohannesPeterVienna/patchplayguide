// Reference page (since 2026-11-24): what PS5 Pro, QSSR and Nintendo Switch 2 upgrades change, game by game, from
// official sources only. Replaces the guide "PS5 Pro enhanced games: what actually changes"; its explanations moved here.
import { createRequire } from 'node:module';
import { tbl, fig, read24, SRC } from '../h.mjs';
import { esc, dateText } from '../layout.mjs';
const require = createRequire(import.meta.url);
const U = require('../data/upgrades-core.js');

const srcIds = Object.keys(U.SOURCES);
const srcNo = (id) => srcIds.indexOf(id) + 1;
const opts = (map) => Object.keys(map).map((k) => `<option value="${k}">${esc(map[k])}</option>`).join('');
const when = (r) => { const d = U.dateOf(r); return d ? dateText(d) : 'undated Nintendo page'; };
const status = (r) => r.st === 'live' ? 'reported as released' : 'stated before release';
const item = (r) => `<li id="${r.id}" class="nm" data-p="${r.p}" data-k="${r.k}"><p class="nm-h"><b>${esc(r.g)}</b><span class="tag">${esc(U.PLATFORMS[r.p])}</span></p><p class="nm-g">${esc(U.KINDS[r.k])} · ${esc(when(r))} · ${status(r)}</p><p>${esc(r.t)}</p><p class="nm-s">Source: ${r.s.map((id) => `<a href="#usrc-${id}">[${srcNo(id)}]</a>`).join(' ')}</p></li>`;
const count = (f) => U.ROWS.filter(f).length;

const toolHtml = `<section class="tool" id="upgrades" aria-labelledby="up-h">
<div class="tool-head"><h2 id="up-h">Console upgrades by game</h2><p class="tool-sub">${U.ROWS.length} entries · ${srcIds.length} official sources · read November 24, 2026</p></div>
<label for="up-q" data-needs-js hidden>Search a game or a feature (for example “Spider-Man”, “120 fps”, “HDR”)<input type="search" id="up-q" autocomplete="off"></label>
<div class="filters" data-needs-js hidden>
<label for="up-p">Console<select id="up-p"><option value="all">All consoles</option>${opts(U.PLATFORMS)}</select></label>
<label for="up-k">Kind of upgrade<select id="up-k"><option value="all">All kinds</option>${opts(U.KINDS)}</select></label>
</div>
<div class="examples" data-needs-js hidden><span class="tool-sub">Try:</span><button type="button" class="chip" data-q="120 fps">120 fps</button><button type="button" class="chip" data-q="ray">ray tracing</button><button type="button" class="chip" data-q="4k">4K</button><button type="button" class="chip" data-q="hdr">HDR</button><button type="button" class="chip" data-q="">show all</button></div>
<p id="up-summary" class="sum" tabindex="-1" aria-live="polite">${U.ROWS.length} of ${U.ROWS.length} entries shown</p>
<p id="up-none" hidden>No entry matches. Try a shorter word, or reset the filters.</p>
<ul id="up-list" class="results names">${U.ROWS.map(item).join('')}</ul>
<div class="row tool-actions" data-needs-js hidden><button type="button" id="up-link">Copy link to this filter</button><button type="button" id="up-print" class="ghost">Print</button><button type="button" id="up-reset" class="ghost">Reset</button><span id="up-msg" class="tool-sub" aria-live="polite"></span></div>
</section>`;

// counts per kind, straight from the data, for the diagram and the text
const kinds = Object.keys(U.KINDS).map((k) => [k, count((r) => r.k === k)]);
const max = Math.max(...kinds.map((k) => k[1]));
const bar = ([k, n], i) => { const y = 46 + i * 34, w = Math.round(n / max * 300); return `<text class="g-t" x="20" y="${y + 16}">${esc(U.KINDS[k].replace(/ \(.*\)$/, ''))}</text><rect class="g-panel" x="300" y="${y}" width="300" height="22" rx="3"/><rect class="${i < 2 ? 'g-plus' : i === 2 ? 'g-acc' : 'g-minus'}" x="300" y="${y}" width="${w}" height="22" rx="3"/><text class="g-tm" x="${306 + w}" y="${y + 16}">${n}</text>`; };
const chart = fig('up-fig', `Bar chart: entries in this list by kind of upgrade – ${kinds.map(([k, n]) => `${U.KINDS[k]} ${n}`).join(', ')}`,
`<rect class="g-bg" width="640" height="230"/>
<text class="g-tm" x="20" y="28">ENTRIES IN THIS LIST BY KIND · counted from the data on this page</text>
${kinds.map(bar).join('')}`,
'A count of this list, not of all games: it contains only games whose upgrade we could read in an official source. Many more PS5 Pro Enhanced games exist: Sony’s launch post of November 4, 2024 listed a sample of more than 50 games with PS5 Pro enhancements, and on February 27, 2026 Sony said PSSR had been used in over 50 titles to date.', '0 0 640 230');

const sony = tbl('PS5 Pro compared with PS5, as Sony announced it (September 10, 2024)', ['', 'What Sony stated'], [
  ['GPU', '67% more compute units and 28% faster memory than the current PS5; “up to 45% faster rendering for gameplay”'],
  ['Ray tracing', 'Rays cast at double, and at times triple, the speed of the current PS5'],
  ['Upscaling', 'PlayStation Spectral Super Resolution (PSSR), an AI-driven upscaler'],
  ['Games without a Pro patch', 'PS5 Pro Game Boost “may stabilize or improve the performance” of supported PS4 and PS5 games; Enhanced Image Quality for PS4 games improves the resolution of select PS4 games'],
  ['Games with a Pro patch', 'Marked “PS5 Pro Enhanced”; Sony: enhanced features vary by game and need a compatible display']
], 'Sony’s own launch statements, quoted from the announcement – not our measurements.');

const up = (w, h) => [`${w}×${h}`, `${(w * h / 1e6).toFixed(2)} MP`, `${(3840 * 2160 / (w * h)).toFixed(2)}×`, `${Math.round(w * h / (3840 * 2160) * 100)}%`];
const pixels = tbl('Internal resolution and reconstruction to a 4K output (arithmetic)', ['Rendered internally', 'Pixels rendered', 'Output pixels per rendered pixel', 'Share of the 4K image that is rendered'],
  [up(3840, 2160), up(3200, 1800), up(2560, 1440), up(1920, 1080)],
  'Arithmetic, not a measurement. For comparison, the documented PC presets: DLSS and FSR Quality render 2560×1440 for a 4K output, Performance renders 1920×1080.');

const sourcesList = [
  ...srcIds.map((id) => { const [label, url, d] = U.SOURCES[id]; return [`<span id="usrc-${id}">[${srcNo(id)}]</span> ${label}${d ? ` (${dateText(d)})` : ''}`, url, 'read in full on November 24, 2026']; }),
  read24('PlayStation Blog – Welcome PlayStation 5 Pro, the most visually impressive way to play games on PlayStation (September 10, 2024)', 'https://blog.playstation.com/2024/09/10/welcome-playstation-5-pro-the-most-visually-impressive-way-to-play-games-on-playstation/', 'hardware figures, Game Boost, the PS5 Pro Enhanced label'),
  read24('PlayStation Blog – PS5 Pro: 50+ enhanced games available at launch November 7 (November 4, 2024)', 'https://blog.playstation.com/2024/11/04/ps5-pro-50-enhanced-games-available-at-launch-november-7/', 'launch date, sample list of more than 50 enhanced games'),
  SRC.psres, SRC.ninboost, SRC.ninhist
];

const live = count((r) => r.st === 'live'), before = U.ROWS.length - live;

export default {
  slug: 'console-upgrades',
  dir: 'reference',
  published: '2026-11-24',
  changelog: [['2026-11-24', 'First published. Replaces the guide “PS5 Pro enhanced games: what actually changes” (2026-11-02); its explanations of the PS5 Pro hardware, the system settings and the comparison method moved here, checked against Sony’s announcement and support page.']],
  short: 'Console upgrades by game',
  title: 'Console upgrades by game: PS5 Pro, QSSR, Switch 2',
  description: 'What PS5 Pro, QSSR and Nintendo Switch 2 upgrades change in each game, from the PlayStation Blog and Nintendo, with dates and a link per entry. Searchable.',
  kicker: 'Reference · console upgrades',
  h1: 'Console upgrades by game: what PS5 Pro, QSSR and Switch 2 versions officially change',
  lede: `“PS5 Pro Enhanced” and “Nintendo Switch 2 Edition” say that a game was upgraded, not how. This reference collects what the developers and platform holders have said in official sources – ${U.ROWS.length} entries for PS5 Pro, the new QSSR upscaler on the standard PS5, and Nintendo Switch 2 – with the date of each statement and a numbered link to it. Search a game, or filter by console and kind of upgrade. Nothing here is our own test.`,
  scripts: ['toolkit.js', 'upgrades.js'],
  toolHtml,
  sections: [
    `<h2 id="how">How this list was compiled</h2>
<p>Each entry summarizes one official statement: a post on the PlayStation Blog written by the game’s developer or by Sony, or a page on nintendo.com. We read every source in full on November 24, 2026 and wrote the entry in our own words, keeping the numbers the source gives – resolutions, frame rates, update numbers and dates. We do not copy patch notes, add impressions of our own or rank the games. If a game is missing, it is because we did not find an official statement that says what changed in its picture or performance – or because, as for Big Brain Academy and Clubhouse Games, Nintendo lists only GameShare support – not because it has no upgrade.</p>
<p>Every entry carries two dates in one: the date of the source, and whether that source <b>reports the change as released</b> (${live} entries) or <b>describes it before release</b> (${before} entries) – for example a developer post a few days before an update or before the console’s launch. Plans can change; for those entries, the game’s own patch notes are the final word. Nintendo’s two overview pages are not dated as a whole; their entries show the update date that Nintendo lists for each game.</p>
${chart}`,
    `<h2 id="pro">What the PS5 Pro adds – and what “PS5 Pro Enhanced” means</h2>
<p>Sony announced the PS5 Pro on September 10, 2024 and released it on November 7, 2024. The announcement names three hardware changes and two features for games that were never patched:</p>
${sony}
<p>A game marked <b>PS5 Pro Enhanced</b> has been patched by its developer, and the developer decides what the extra power is spent on. The entries above show four recurring choices: a <b>sharper 60 fps mode</b> that keeps the Performance frame rate at a higher resolution or with PSSR (Horizon Forbidden West, Darktide); a <b>combined mode</b> that brings Fidelity features to 60 fps (Insomniac’s “Performance Pro”, Final Fantasy VII Rebirth’s Enhanced mode, The Last of Us’ 1440p-to-4K mode); <b>more ray tracing</b> (Gran Turismo 7 during races, Star Wars Jedi: Survivor in Performance mode, Assassin’s Creed Black Flag Resynced in all modes); and <b>higher frame rates</b> (Resident Evil Village at 120 fps, Stellar Blade at 80 fps on a 120 Hz display). Several games do more than one.</p>
<p>Two system settings on the PS5 Pro are easy to mix up. Sony’s support page lists both under Settings → Screen and Video → Video Output, available only on the CFI-7000 model group: <b>Enhance Image Quality for PS4 Games</b> improves video quality for some PS4 games and needs a 4K or 1440p screen; <b>Enhance PSSR Image Quality</b>, on by default, improves image quality in certain PSSR-compatible games. Neither adds PSSR to a game that never supported it.</p>`,
    `<h2 id="upgraded">The upgraded PSSR of 2026</h2>
<p>On February 27, 2026 Sony announced a new version of PSSR with a different neural network and algorithm, developed with AMD in “Project Amethyst”; Resident Evil Requiem was the first game to use it. The PS5 system update that began rolling out on March 16, 2026 brought it to the console, and Sony said that most new PS5 Pro games would launch with it. Games can adopt it in two ways: through their own patch – the ${count((r) => r.k === 'pssr')} “Upgraded PSSR” entries above – or through the system setting Enhance PSSR Image Quality, which lets games that already support PSSR use the new version. Sony’s wording for the second way is careful: results vary by title, and the setting can be switched off if a game shows unexpected visual effects.</p>
<p>The developers’ descriptions of the upgrade are strikingly similar: less shimmer and flicker on fine detail such as grass, foliage and hair, less ghosting on particles and rain, and more stable ray-traced effects. Several of them – Ubisoft for Assassin’s Creed Shadows, IO Interactive for 007 First Light, Embark Studios for Arc Raiders – also said that integrating the new version took very little work, which helps explain the number of updates in 2026.</p>`,
    `<h2 id="qssr">QSSR: AI upscaling on the standard PS5</h2>
<p>On October 1, 2026 Sony introduced <b>Quick Spectral Super Resolution (QSSR)</b> for the standard PS5: a faster tier of its AI upscaling, built on PSSR with a streamlined neural network and an implementation tuned for the PS5. Sony calls PSSR on PS5 Pro the “gold standard” and says QSSR brings “notable improvements” to image detail and stability on PS5. Like PSSR, it arrives game by game: Marvel’s Wolverine and Ghost of Yōtei were patched on the day of the announcement to offer it as an additional graphics option, and on November 13, 2026 Sony listed the next six games. Because QSSR shares its interface with PSSR, Sony expects it to suit games that already support PSSR. The list will grow; filter it for “QSSR” to see the current state of our entries.</p>`,
    `<h2 id="switch2">Nintendo Switch 2: Editions, free updates and Handheld Mode Boost</h2>
<p>Nintendo upgrades original Switch games for the Switch 2 in two ways. A <b>Nintendo Switch 2 Edition</b> is the original game plus a paid upgrade pack; its contents vary by game and can include visual improvements, new features or new modes, which only play on Switch 2. <b>Free updates</b> improve selected Switch games when they run on a Switch 2 – most often the image quality on the Switch 2 screen and on high-resolution TVs, sometimes the frame rate, HDR or mouse controls. Metroid Prime 4: Beyond is the clearest example of a mode choice: Quality at 60 fps in 4K on a TV, or Performance at 120 fps in 1080p, which needs a 120 Hz display.</p>
<p>For other Switch games there is a system-wide setting since update 22.0.0 of March 16, 2026: <b>Handheld Mode Boost</b> (System Settings → System → Nintendo Switch Software Handling, off by default). Nintendo says it lets compatible Switch games run in handheld and tabletop mode as if in TV mode, which can improve the image but raises power consumption; some games are unaffected, touch controls may stop working, and it has no effect on Switch 2 games. How docked and handheld play differ in general is explained in <a href="/guides/switch-2-docked-vs-handheld/">Switch 2 docked vs handheld</a>.</p>`,
    `<h2 id="pixels">Reading resolution statements: how much the upscaler reconstructs</h2>
<p>Many entries name a render resolution and an output resolution – The Last of Us renders 1440p and outputs 4K, Metroid Prime 4 outputs 4K or 1080p. The arithmetic below shows what such a statement means: how many output pixels the upscaler has to produce from each rendered one.</p>
${pixels}
<p>A mode that renders 1440p for a 4K output asks the upscaler for 2.25 output pixels per rendered pixel – the ratio of “Quality” on PC; one that renders 1080p asks for four. The better the upscaler, the lower a developer can go before players notice, which is the point of PSSR, its 2026 upgrade and QSSR. The <a href="/tools/upscaler-resolution-calculator/?out=3840x2160&amp;up=scale&amp;scale=67">Upscaler Resolution Calculator</a> shows the same for any internal resolution.</p>`,
    `<h2 id="check">Checking an upgrade on your own console</h2>
<p>An official statement tells you what changed; whether it matters to you depends on your display and your eyes. Pick one scene with fine detail – foliage, fences, distant buildings – and play two or three minutes in each mode, turning the camera and moving quickly. Judge in motion, not from a still image: the developers describe most of the 2026 upscaler gains in motion. A sharper mode only shows on a display that can show it, and 120 fps or 40 fps modes need 120 Hz output – see <a href="/guides/vrr-120hz-console-setup/">VRR and 120 Hz on consoles</a>. After an update, check that your chosen mode is still selected, in the game and in the system’s game presets, and compare again with the short routine in <a href="/guides/how-to-test-a-settings-change/#after-update">how to test a settings change</a>. Mode trade-offs on the standard PS5 are explained in <a href="/guides/ps5-performance-vs-fidelity-mode/">PS5 performance vs fidelity modes</a>.</p>`
  ],
  faq: [
    ['Do all PS5 games look better on PS5 Pro?', 'No. Games patched as “PS5 Pro Enhanced” use the extra power as their developers chose; this list shows what they said. Other games run as on PS5; Sony says PS5 Pro Game Boost may stabilize or improve the performance of supported PS4 and PS5 games.'],
    ['What is the difference between PSSR and QSSR?', 'PSSR is Sony’s AI upscaler for PS5 Pro games; QSSR, introduced on October 1, 2026, is a faster tier built on it for the standard PS5. Both arrive game by game through updates.'],
    ['What does “Enhance PSSR Image Quality” do?', 'It is a PS5 Pro setting under Screen and Video → Video Output, on by default. It lets games that already support PSSR use the upgraded PSSR of 2026. It does not add PSSR to other games.'],
    ['What is the difference between a Nintendo Switch 2 Edition and a free update?', 'A Switch 2 Edition is the original game plus a paid upgrade pack, often with new content as well as visual improvements. Free updates improve selected Switch games on Switch 2 at no cost, mostly image quality and sometimes frame rate or HDR.']
  ],
  sources: sourcesList,
  sourcesNote: 'Numbers in square brackets in the list refer to these sources. Every source was read in full on November 24, 2026; entries are summaries in our own words. Statements made before a release are marked as such in each entry.',
  related: ['ps5-performance-vs-fidelity-mode', 'switch-2-docked-vs-handheld', 'setting-names']
};
