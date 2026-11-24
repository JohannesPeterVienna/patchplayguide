// Home, guide index, About, Contact, Imprint, Privacy and 404 for patchplayguide.com.
import { esc, SITE } from './layout.mjs';

const RIS = 'https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10007517';
// date of the last change of each page's content (from the git history of its text; 2026-11-24: imprint and contact
// showed older dates than their real last change)
const UPDATED = { 'Privacy policy': 'November 24, 2026', 'About Patch Play Guide': 'November 24, 2026', 'Contact &amp; corrections': 'November 18, 2026', 'Imprint': 'November 23, 2026' };
const legal = (kicker, h1, inner) => `<article class="doc legal"><p class="kicker">${kicker}</p><h1>${h1}</h1>${inner}<p class="small">Last updated: ${UPDATED[h1] || SITE.reviewedText}</p></article>`;

export const GROUPS = [
  { key: 'pc', name: 'PC settings and performance', intro: 'What each option costs, how upscalers and frame generation work, and how to find and fix your bottleneck.' },
  { key: 'testing', name: 'Patches and testing', intro: 'How to read patch notes, and how to test a change – or an update – so that the result means something.' },
  { key: 'console', name: 'Consoles, handhelds and displays', intro: 'Performance and fidelity modes, Xbox Series S and X, Switch 2, Steam Deck and 120 Hz/VRR setup. What PS5 Pro and Switch 2 versions change per game is in the <a href="/reference/console-upgrades/">console upgrade reference</a>.' }
];

const TOOL_ICONS = {
  decoder: '<svg viewBox="0 0 44 44" aria-hidden="true"><rect x="2" y="2" width="40" height="40" rx="8" fill="none" stroke="#FFC531" stroke-width="2"/><path d="M10 14h8M14 10v8" stroke="#47D98A" stroke-width="2.6"/><path d="M10 23c1.5-1.8 3-1.8 4.5 0s3 1.8 4.5 0" stroke="#FFC531" stroke-width="2.4" fill="none"/><path d="M10 32h8" stroke="#FF6B7F" stroke-width="2.6"/><path d="M23 14h12M23 23h10M23 32h12" stroke="#A5B5C4" stroke-width="2"/></svg>',
  translator: '<svg viewBox="0 0 44 44" aria-hidden="true"><rect x="2" y="2" width="40" height="40" rx="8" fill="none" stroke="#FFC531" stroke-width="2"/><path d="M9 13h26M9 22h26M9 31h26" stroke="#3A5267" stroke-width="4"/><path d="M9 13h20" stroke="#7CC4FF" stroke-width="4"/><path d="M9 22h10" stroke="#47D98A" stroke-width="4"/><path d="M9 31h16" stroke="#FF6B7F" stroke-width="4"/></svg>',
  finder: '<svg viewBox="0 0 44 44" aria-hidden="true"><rect x="2" y="2" width="40" height="40" rx="8" fill="none" stroke="#FFC531" stroke-width="2"/><circle cx="22" cy="11" r="4" fill="#FFC531"/><path d="M22 15v6M22 21l-9 7M22 21l9 7" stroke="#A5B5C4" stroke-width="2" fill="none"/><circle cx="13" cy="31" r="4" fill="#47D98A"/><circle cx="31" cy="31" r="4" fill="#FF6B7F"/></svg>'
};

const ICON = (inner) => `<svg viewBox="0 0 44 44" aria-hidden="true"><rect x="2" y="2" width="40" height="40" rx="8" fill="none" stroke="#FFC531" stroke-width="2"/>${inner}</svg>`;
Object.assign(TOOL_ICONS, {
  resolution: ICON('<rect x="9" y="10" width="26" height="18" fill="none" stroke="#A5B5C4" stroke-width="2"/><rect x="9" y="10" width="15" height="10" fill="#47D98A"/><path d="M9 34h26" stroke="#3A5267" stroke-width="3"/><path d="M9 34h11" stroke="#7CC4FF" stroke-width="3"/>'),
  frametime: ICON('<path d="M8 30h28" stroke="#A5B5C4" stroke-width="2"/><path d="M10 26v8M18 26v8M26 26v8M34 26v8" stroke="#A5B5C4" stroke-width="1.6"/><rect x="10" y="12" width="16" height="8" fill="#47D98A"/><rect x="26" y="12" width="8" height="8" fill="#FFC531"/>'),
  testlog: ICON('<path d="M9 14h26M9 30h26" stroke="#3A5267" stroke-width="2"/><circle cx="13" cy="14" r="3" fill="#FFC531"/><circle cx="19" cy="14" r="3" fill="#FFC531"/><circle cx="16" cy="14" r="3" fill="#FFC531"/><circle cx="27" cy="30" r="3" fill="#47D98A"/><circle cx="33" cy="30" r="3" fill="#47D98A"/><circle cx="30" cy="30" r="3" fill="#47D98A"/>'),
  names: ICON('<path d="M9 13h10M9 22h10M9 31h10" stroke="#A5B5C4" stroke-width="2.4"/><path d="M19 13c8 0 8 9 16 9M19 31c8 0 8-9 16-9M19 22h16" stroke="#FFC531" stroke-width="2" fill="none"/>'),
  upgrades: ICON('<rect x="9" y="11" width="26" height="16" rx="3" fill="none" stroke="#A5B5C4" stroke-width="2"/><path d="M14 33h16" stroke="#A5B5C4" stroke-width="2"/><path d="M15 22l5-5 4 4 6-6" stroke="#47D98A" stroke-width="2.4" fill="none"/>')
});
// tools and reference in the order shown on the home page and on the tools hub
export const TOOL_CARDS = [
  ['/tools/upscaler-resolution-calculator/', 'resolution', 'Upscaler Resolution Calculator', 'What DLSS, FSR and XeSS really render on your display in each mode – internal resolution, megapixels and pixel share, from the vendors’ documented factors.', 'Calculate'],
  ['/tools/frame-time-calculator/', 'frametime', 'Frame Time Calculator', 'Frames per second in milliseconds: does a frame rate divide your refresh rate, fit your VRR window, and what does frame generation show versus render?', 'Calculate'],
  ['/tools/settings-test-log/', 'testlog', 'Settings Test Log', 'Type in your own test runs before and after a change. The log shows medians and spread, and whether the runs separate or the result is undecided – with a printable worksheet.', 'Open the log'],
  ['/tools/bottleneck-finder/', 'finder', 'Bottleneck Finder', 'Low FPS, stutter, tearing or input lag? A few questions lead to the likely cause – GPU, CPU, VRAM, shaders, a limiter or the display chain – and the next steps.', 'Start the finder'],
  ['/tools/settings-translator/', 'translator', 'Settings Translator', 'Twenty-five common graphics options with our editorial estimate of their GPU, CPU and VRAM load. Pick your bottleneck to see what to test first.', 'Open translator'],
  ['/tools/patch-decoder/', 'decoder', 'Patch Decoder', 'Paste patch notes and sort every line into + improvement, ~ change or − removal, by category and platform, with a checklist to tick off.', 'Open decoder'],
  ['/reference/setting-names/', 'names', 'Setting-name map', 'The same setting under different names: every DLSS, FSR and XeSS preset, frame generation, latency features, VRR and console terms, each with its official source.', 'Search the map'],
  ['/reference/console-upgrades/', 'upgrades', 'Console upgrades by game', 'What PS5 Pro, QSSR and Nintendo Switch 2 upgrades change in each game, as the developers and platform holders state it – with date and source per entry.', 'Search the list']
];
const tcard = ([href, icon, name, text, go]) => `<a class="tcard" href="${href}">${TOOL_ICONS[icon]}<h3>${name}</h3><p>${text}</p><span class="go">${go} →</span></a>`;

export function home({ GUIDES }) {
  const card = (g) => `<a class="card" data-slug="${g.slug}" href="/guides/${g.slug}/"><span class="k">${g.kicker.replace(/^Guide · /, '')}</span><h3>${g.h1}</h3><p>${esc(g.description)}</p></a>`;
  const groups = GROUPS.map((gr) => `<h3 id="${gr.key}" class="grp">${gr.name}</h3><p>${gr.intro}</p><div class="cards">${GUIDES.filter((g) => g.group === gr.key).map(card).join('')}</div>`).join('\n');
  const body = `<section class="hero hero-tool">
<div>
<p class="kicker">Calculators · name map · test protocol</p>
<h1>What does “Quality” mode really render on your screen?</h1>
<p class="lede">Graphics menus are full of names and short on numbers. Patch Play Guide puts the numbers back: what each upscaler mode renders, what a frame rate means in milliseconds, which name does which job – calculated from the vendors’ own documentation – and a test protocol for the one thing nobody can look up: your own system.</p>
</div>
<form class="quick" id="quick" action="/tools/upscaler-resolution-calculator/" method="get" aria-labelledby="qk-h">
<h2 id="qk-h">Try it now</h2>
<label for="qk-out">My display<select id="qk-out" name="out"><option value="1920x1080">1080p (1920×1080)</option><option value="2560x1440" selected>1440p (2560×1440)</option><option value="3440x1440">Ultrawide 3440×1440</option><option value="3840x2160">4K (3840×2160)</option><option value="1280x800">Steam Deck (1280×800)</option></select></label>
<label for="qk-up">Upscaler<select id="qk-up" name="up"><option value="all">Compare DLSS, FSR and XeSS</option><option value="dlss">DLSS</option><option value="fsr">FSR</option><option value="xess">XeSS</option></select></label>
<button type="submit" class="btn btn-primary">Show internal resolutions</button>
<p class="quick-alt">or: <a href="/tools/frame-time-calculator/?fps=40&amp;hz=120">why 40 fps needs 120 Hz</a> · <a href="/tools/bottleneck-finder/">find my bottleneck</a> · <a href="/reference/setting-names/?q=balanced">what “Balanced” means</a></p>
</form>
</section>
<section class="facts" aria-labelledby="fx-h"><h2 id="fx-h">Three things the menu does not tell you</h2><ul>
<li><b>“Balanced” is three different settings.</b><span>DLSS renders 58% of the output resolution per axis, FSR 58.8%, XeSS 50% – documented by the vendors, compared in the <a href="/reference/setting-names/?q=balanced">name map</a>.</span></li>
<li><b>4K with “Quality” is native 1440p.</b><span>DLSS and FSR Quality divide each axis by 1.5: a 4K output is rendered at 2560×1440. <a href="/tools/upscaler-resolution-calculator/?out=3840x2160&amp;up=all">See every mode</a>.</span></li>
<li><b>Three runs can fool you 1 time in 10.</b><span>With three runs per setting, a clean win appears by pure chance in one of ten tests. The <a href="/tools/settings-test-log/">test log</a> counts it for you.</span></li>
</ul></section>
<h2 id="tools">Tools and reference</h2>
<p>Everything runs in your browser, works with the keyboard, and can be linked, copied or printed. No account, nothing uploaded.</p>
<div class="tools3">
${TOOL_CARDS.map(tcard).join('\n')}
</div>
<section class="band setup-panel" id="my-setup" aria-labelledby="ms-h">
<h2 id="ms-h">My setup</h2>
<p>Tell us what you play on and the guides will point you to what matters for it. Your choice is stored only in this browser – there is no account, and nothing is sent to us.</p>
<form id="setup-form">
<div class="setup-grid">
<label>Platform<select name="platform"><option value="pc">Desktop or laptop PC</option><option value="handheld">Steam Deck or handheld PC</option><option value="ps5">PS5</option><option value="ps5pro">PS5 Pro</option><option value="xbox">Xbox Series X or S</option><option value="switch2">Nintendo Switch 2</option></select></label>
<label data-pc-only>GPU class<select name="gpu"><option value="entry">Entry-level</option><option value="mid" selected>Midrange</option><option value="high">High-end</option></select></label>
<label data-vram>Video memory<select name="vram"><option value="">Not sure</option><option value="6">6 GB or less</option><option value="8">8 GB</option><option value="12">10–12 GB</option><option value="16">16 GB or more</option></select></label>
</div>
<div class="row" style="margin-top:14px"><button type="submit" class="btn btn-primary">Save my setup</button><button type="button" id="setup-clear" class="btn btn-ghost">Clear</button></div>
</form>
<div id="setup-out" aria-live="polite"></div>
</section>
<h2 id="guides">Guides with worked examples</h2>
<p>${GUIDES.length} guides. Each one explains a topic, works through an example with real arithmetic or vendor-documented numbers, and links the tool that lets you repeat it with your own values.</p>
${groups}
<section class="band" aria-labelledby="how-h">
<h2 id="how-h">How Patch Play Guide works</h2>
<div class="cols2">
<div><h3>Documented, not guessed</h3><p>Numbers on this site come from two places: arithmetic you can check, and documents published by NVIDIA, AMD, Intel, Microsoft, Sony, Nintendo and Valve, linked with the date we read them. What we could not tie to an official source is left out.</p>
<h3>No benchmarks of our own</h3><p>We have no test lab and publish no frame rates we measured. Where a page shows example numbers, it says that they are invented. Where it shows vendor figures, it names the vendor.</p></div>
<div><h3>Made with AI tools, checked against sources</h3><p>Pages and tools are written with the help of AI tools, checked against the linked sources and covered by automated tests. AdStern, the publisher, is responsible for them. Details and the correction process are on the <a href="/about/">About page</a>.</p>
<h3>Your system decides</h3><p>A calculator can tell you what a mode renders; only a test tells you what it does on your hardware. The <a href="/guides/how-to-test-a-settings-change/">testing guide</a> and the <a href="/tools/settings-test-log/">test log</a> are there for that.</p></div>
</div>
</section>`;
  return {
    path: '/',
    title: 'Patch Play Guide – upscaler, frame-time and settings tools',
    description: 'Free calculators and a sourced name map for game graphics settings: what DLSS, FSR and XeSS modes render, frame times, VRR windows, plus a test log and guides.',
    body
  };
}

export function toolsIndex() {
  return {
    path: '/tools/',
    title: 'Tools – calculators, finder and test log for game settings',
    description: 'All Patch Play Guide tools: resolution and frame-time calculators, test log, Bottleneck Finder, Settings Translator, Patch Decoder and two references.',
    crumbs: [['Home', '/'], ['Tools', '/tools/']],
    body: `<p class="kicker">Tools</p><h1>Tools for graphics settings and testing</h1>
<p class="lede" style="max-width:72ch">Six tools and two references. The calculators work only with documented factors and arithmetic; the finder gives rule-of-thumb guidance and the translator an editorial estimate; the test log works only with numbers you measure yourself. All of them run in your browser, can be used with the keyboard, and let you copy, link or print the result.</p>
<div class="tools3">
${TOOL_CARDS.map(tcard).join('\n')}
</div>
<section class="band"><h2>Which tool for which question?</h2>
<div class="tbl" role="region" aria-label="Which tool answers which question" tabindex="0"><table><caption>Which tool answers which question</caption><thead><tr><th scope="col">Your question</th><th scope="col">Tool</th><th scope="col">What it is based on</th></tr></thead><tbody>
<tr><th scope="row">What resolution does my game render in Balanced mode?</th><td><a href="/tools/upscaler-resolution-calculator/">Upscaler Resolution Calculator</a></td><td>Scale factors documented by NVIDIA, AMD and Intel</td></tr>
<tr><th scope="row">Why does 40 fps judder on my TV? Does my frame rate fit my VRR range?</th><td><a href="/tools/frame-time-calculator/">Frame Time Calculator</a></td><td>Arithmetic: 1000 ÷ fps, refresh rate ÷ frame rate</td></tr>
<tr><th scope="row">Did my settings change really gain anything?</th><td><a href="/tools/settings-test-log/">Settings Test Log</a></td><td>Your own runs; a strict rule that separates them or calls the result undecided</td></tr>
<tr><th scope="row">Why is my game slow, stuttering or tearing?</th><td><a href="/tools/bottleneck-finder/">Bottleneck Finder</a></td><td>A published decision tree of symptoms and quick tests</td></tr>
<tr><th scope="row">Which options should I lower first?</th><td><a href="/tools/settings-translator/">Settings Translator</a></td><td>An editorial estimate of qualitative load levels – not measured, no source</td></tr>
<tr><th scope="row">What in these patch notes matters for me?</th><td><a href="/tools/patch-decoder/">Patch Decoder</a></td><td>Published word rules, applied in your browser</td></tr>
<tr><th scope="row">What does this name in the menu mean?</th><td><a href="/reference/setting-names/">Setting-name map</a></td><td>Vendor and platform documentation, linked per entry</td></tr>
<tr><th scope="row">What does the PS5 Pro or Switch 2 version of my game change?</th><td><a href="/reference/console-upgrades/">Console upgrades by game</a></td><td>PlayStation Blog and Nintendo statements, linked and dated per entry</td></tr>
</tbody></table></div></section>`
  };
}

export function guidesIndex({ GUIDES }) {
  const groups = GROUPS.map((gr) => `<section><h2 id="${gr.key}">${gr.name}</h2><p>${gr.intro}</p><div class="cards">${GUIDES.filter((g) => g.group === gr.key).map((g) => `<a class="card" href="/guides/${g.slug}/"><span class="k">${g.kicker.replace(/^Guide · /, '')}</span><h3>${g.h1}</h3><p>${esc(g.description)}</p></a>`).join('')}</div></section>`).join('\n');
  return {
    path: '/guides/',
    title: 'All guides – settings, patches, consoles and handhelds',
    description: 'All Patch Play Guide guides in one place: PC graphics settings, upscaling, stutter and bottlenecks, patch notes and re-tests, console modes, Steam Deck and VRR.',
    crumbs: [['Home', '/'], ['Guides', '/guides/']],
    body: `<p class="kicker">Library</p><h1>All guides</h1>
<p class="lede" style="max-width:72ch">${GUIDES.length} guides in three groups. Each explains one topic, works through an example with arithmetic or vendor-documented numbers, links the tool that repeats it with your values, and lists its sources. Every guide was revised on November 18, 2026, the console and handheld guides again on November 24, 2026; the change log at the end of each page records what changed.</p>
<p style="max-width:72ch">Not sure where to start? If something feels wrong, the <a href="/tools/bottleneck-finder/">Bottleneck Finder</a> points you to the right guide in about a minute. If a new update just arrived, start with <a href="/guides/how-to-read-patch-notes/">how to read patch notes</a> and the <a href="/guides/how-to-test-a-settings-change/#after-update">re-test routine</a>. If a name in a menu puzzles you, the <a href="/reference/setting-names/">setting-name map</a> has it. If you want to understand your graphics menu once and for all, begin with <a href="/guides/graphics-settings-explained/">graphics settings explained</a>.</p>
${groups}`
  };
}

export const STATIC_PAGES = [
  {
    path: '/about/',
    title: 'About Patch Play Guide – method, sources and limits',
    description: 'Who publishes Patch Play Guide, how pages and tools are made with AI tools and checked against official sources, which numbers we show, how to report errors.',
    crumbs: [['Home', '/'], ['About', '/about/']],
    body: legal('About &amp; method', 'About Patch Play Guide', `<p class="lede">Patch Play Guide is a set of free calculators, a sourced map of setting names and guides about game graphics settings, console modes and display setup – for PC, PS5, Xbox, Switch 2 and handheld PCs. It is built for players who want to understand what a setting does and check it on their own system rather than copy a list.</p>
<h2 id="who">Who publishes the site</h2>
<p>The site is published by AdStern, an advertising agency based in Vienna, Austria; the full details are in the <a href="/imprint/">imprint</a>. AdStern decides what is published and is responsible for it. Patch Play Guide is financed by advertising on the guide, tool and reference pages. The home page, the two overview pages (all guides, all tools), this page, the imprint, the privacy policy and the contact page have no ad placements. No game publisher, platform holder or hardware manufacturer pays for coverage, and the pages contain no affiliate links. We are not affiliated with any company whose products we mention.</p>
<h2 id="method">How pages and tools are made</h2>
<p>There is no editorial team and no test lab behind this site, and we do not pretend otherwise. Pages and tools are written for this site with the help of AI tools. Each factual statement is then checked against a source, and what cannot be tied to a source is removed or clearly marked as our own judgment – the load levels in the <a href="/tools/settings-translator/">Settings Translator</a> are labeled as an editorial estimate, and advice in the guides is worded as our suggestion. The steps are:</p>
<ol>
<li><b>One question per page.</b> A page starts from something a player actually asks – “what does Balanced mode render on my monitor?” – not from a product announcement.</li>
<li><b>Sources first.</b> Facts are taken from documents published by the companies that make the products: developer guides from NVIDIA, AMD and Intel, support and specification pages from Microsoft, Sony, Nintendo and Valve. Each page lists its sources with the date they were read.</li>
<li><b>Arithmetic in the open.</b> Where a page calculates something – an internal resolution, a frame time, a memory size – it shows the formula, and the same code that draws the tables runs in the tools and is covered by automated tests.</li>
<li><b>Review passes.</b> Before publication, independent AI review passes compare the text with the sources and recalculate the numbers; automated tests check the tools, every internal link and the page structure.</li>
</ol>
<h2 id="numbers">Three kinds of numbers – and none of them is our benchmark</h2>
<ul>
<li><b>Calculated numbers</b> follow from arithmetic, such as 1000 ÷ 60 = 16.67 ms. You can check them with a pocket calculator.</li>
<li><b>Vendor figures</b> are published by a manufacturer – for example the scale factor of an upscaler preset or the memory a feature allocates. They are labeled with the vendor’s name and linked.</li>
<li><b>Invented examples</b> show how a method works. They are always labeled as invented or constructed.</li>
</ul>
<p>We do not publish frame rates, percentages or comparisons measured by us, because we have no test hardware. Where the Settings Translator describes what an option costs, it uses qualitative levels – minimal, low, moderate, high – and labels them as an editorial estimate: our judgment, not a measurement and not taken from a source. If we ever publish measurements, each will state the exact hardware, software versions, scene and method.</p>
<h2 id="sources">How sources are handled</h2>
<p>Every source is read in full before a page relies on it. Developer documentation that vendors publish in their public repositories was read on November 18, 2026. Some official support, product and news pages could at first not be opened from our build environment and were known to us only from search-engine extracts; those pages said so. On November 24, 2026 all of them were opened and read in full, the statements that rested on them were matched to the official wording, and outdated or wrong ones were corrected – for example AMD’s FreeSync tier requirements and the Switch 2 VRR entries. Where two official pages disagree, we name both and say which one we follow – as for the Xbox Series S CPU clock. Menu paths and requirements change with system and driver updates, so every source carries the date it was read.</p>
<h2 id="patches">How we handle patch notes</h2>
<p>Patch notes belong to their publishers. We never copy them. The <a href="/tools/patch-decoder/">Patch Decoder</a> works with a clearly <b>fictional</b> example game and with lines you paste yourself from the official source; the sorting happens in your browser. We do not summarize individual patch notes line by line. One page comes close, and it works differently: the <a href="/reference/console-upgrades/">console upgrade reference</a> summarizes, game by game, what developers and platform holders have officially stated about PS5 Pro, QSSR and Nintendo Switch 2 upgrades – in our own words, with the date and a link for every entry, and marked when a statement was made before the release. These are the makers’ claims, not our tests. The guides teach how to read any patch note and how to <a href="/guides/how-to-test-a-settings-change/#after-update">re-test after an update</a>.</p>
<h2 id="tools">How the tools work</h2>
<ul>
<li><b>Upscaler Resolution Calculator</b> divides your output resolution by the per-axis factors that NVIDIA, AMD and Intel document for each preset.</li>
<li><b>Frame Time Calculator</b> is pure arithmetic: frame time, refreshes per frame, position in a VRR window, shown versus rendered frames.</li>
<li><b>Settings Test Log</b> summarizes runs you type in and calls two setups separated only when their runs do not overlap; overlapping runs are reported as inconclusive, not as equal. The page explains how often a separation happens by chance.</li>
<li><b>Bottleneck Finder</b> is a decision tree; the complete tree is printed on its page, and each result links to the guide that explains it.</li>
<li><b>Settings Translator</b> rates twenty-five common options with qualitative GPU, CPU and VRAM levels – an editorial estimate – and ranks them with a simple published formula for your bottleneck.</li>
<li><b>Patch Decoder</b> sorts lines with a published set of word rules, in a fixed order, into a change type (+, ~, −), a category and platforms.</li>
<li><b>Setting-name map</b> lists names with one sentence each and a numbered source.</li>
<li><b>Console upgrades by game</b> lists official statements about PS5 Pro, QSSR and Switch 2 upgrades, one entry per game and console, each with date and source.</li>
</ul>
<p>The logic of all tools is covered by automated tests: for example, that every answer in the finder leads somewhere, that the calculators reproduce the vendors’ own example resolutions, and that the decoder sorts reference lines correctly.</p>
<h2 id="checks">How pages are checked – and corrected</h2>
<p>Each page shows the date of its last review and ends with a change log. When something is corrected, the date and the log change, and the log says what changed. If you find an error – a menu path that moved, a factor that changed with a new version, a link that no longer works – please write to us via the <a href="/contact/">contact page</a>, ideally with the official source. Reports are checked against that source, not against other websites; the <a href="/contact/#process">contact page</a> describes the process.</p>
<h2 id="corrections">Corrections to this site</h2>
<p>Corrections that concern the site as a whole are listed here once instead of on every page.</p>
<ul>
<li><time datetime="2026-11-04">2026-11-04</time> Author line corrected on all guide and tool pages: they now name the publisher, AdStern. There is no separate editorial team.</li>
<li><time datetime="2026-11-24">2026-11-24</time> This page said that advertising runs on the overview pages; the home page and the two overview pages have no ad placements. Corrected.</li>
</ul>
<h2 id="limits">What the site cannot do</h2>
<p>We cannot see your system. A calculator can tell you what a mode renders and a guide what usually helps; only a test on your hardware tells you what helps you. We do not give advice on hardware purchases, modding, cheating or circumventing platform rules.</p>
<h2 id="images">No logos, key art or screenshots</h2>
<p>All diagrams on this site are our own drawings. We show no game logos, characters, key art or screenshots, and mention game, platform and technology names only as text to describe compatibility and settings.</p>
<h2 id="data">Your data</h2>
<p>Everything you enter in the tools, including “My setup”, stays in your browser. There is no account. Advertising and analytics are described in the <a href="/privacy/">privacy policy</a>.</p>
<h2 id="history">History</h2>
<p>Patch Play Guide started as a single page with local tools for organizing patch notes and comparing frame rates. In November 2026 it was rebuilt with guides and three tools. On November 18, 2026 the calculators, the test log and the setting-name map were added, every guide received a worked example with sources, and two overlapping guides on testing were merged into one. On November 24, 2026 all official pages that had only been known from search extracts were read in full, the console guides were rewritten around what the makers state, and the guide on PS5 Pro enhanced games became the console upgrade reference.</p>`)
  },
  {
    path: '/contact/',
    title: 'Contact and corrections – Patch Play Guide',
    description: 'How to reach the publisher of Patch Play Guide, how to report an error or an outdated menu path, and which requests the site cannot help with.',
    crumbs: [['Home', '/'], ['Contact', '/contact/']],
    body: legal('Contact', 'Contact &amp; corrections', `<p class="lede">Patch Play Guide is published by AdStern in Vienna, Austria. You can reach us by email at <a href="mailto:office@adstern.com">office@adstern.com</a>; the postal address is in the <a href="/imprint/">imprint</a>.</p>
<h2 id="corrections">Reporting an error</h2>
<p>If something on a page is wrong or out of date – a menu path that moved after a system update, a feature that changed, a link that no longer works – please tell us the page and the sentence, and if possible the source that shows the current state. Confirmed errors are corrected, the review date changes and the page’s change log records the correction.</p>
<h2 id="process">What happens with a correction</h2>
<p>Each report is checked against the official source it concerns – the platform’s support pages, the vendor’s documentation or the publisher’s patch notes – not against other fan sites. Three things help most: the platform and its system or driver version, the exact wording you see on your screen, and a link to the official page that shows the change. If the report holds, the sentence is rewritten or removed, any calculation that depends on it is redone, and the page’s change log gets a dated entry that says what changed. If the official sources do not settle the question, the page says that the behavior differs between versions instead of guessing. We do not publish your name or email address with a correction.</p>
<h2 id="topics">Suggesting a topic</h2>
<p>Requests for new guides are welcome, especially questions about a setting or a console mode that existing guides don’t answer. Please describe the problem the way you would ask a friend – “why does my game look blurry in performance mode?” – and name the platform. A topic becomes a guide when it can be explained from official documentation and checked on your own system with the <a href="/guides/how-to-test-a-settings-change/">testing method</a>. We don’t write reviews, rankings, rumors or coverage of unreleased hardware, and we cannot promise a date for a requested guide.</p>
<h2 id="tools">Tool problems</h2>
<p>If the Patch Decoder sorts a line clearly wrongly, send us the line (without anything personal). The rules are simple by design, so not every case can be fixed, but recurring patterns help us improve them. If a calculator or the setting-name map disagrees with a vendor’s current documentation, send us the link to that document – the factors and names are taken from such documents and are corrected when they change.</p>
<h2 id="scope">What we cannot help with</h2>
<p>We cannot troubleshoot individual PCs or consoles, recommend hardware purchases, or help with account, purchase or warranty issues – those belong with the platform or manufacturer’s support. We do not accept sponsored posts, paid links or review samples.</p>
<p>How we handle personal data is described in the <a href="/privacy/">privacy policy</a>.</p>`)
  },
  {
    path: '/imprint/',
    title: 'Imprint – Patch Play Guide (AdStern, Vienna)',
    description: 'Legal notice for patchplayguide.com under the Austrian E-Commerce Act and Media Act: media owner, business details, trade authority and chamber membership.',
    crumbs: [['Home', '/'], ['Imprint', '/imprint/']],
    body: legal('Legal notice', 'Imprint', `<p>Disclosures pursuant to § 5 of the Austrian E-Commerce Act (E-Commerce-Gesetz, ECG) and § 25 of the Austrian Media Act (Mediengesetz, MedienG).</p>
<h2 id="owner">Media owner and service provider</h2>
<p><strong>AdStern – Agentur für digitales Marketing</strong><br>Johannes Peter<br>Seilerstätte 8<br>1010 Wien<br>Austria</p>
<p><a href="mailto:office@adstern.com">office@adstern.com</a></p>
<h2 id="business">Business details</h2><dl><dt><strong>Business activity</strong></dt><dd>Advertising agency</dd>
<dt><strong>VAT identification number</strong></dt><dd>ATU54682507</dd>
<dt><strong>Austrian trade register number (GISA)</strong></dt><dd>31741743</dd>
<dt><strong>Registered trade location</strong></dt><dd>Seilerstätte 8, 1010 Wien</dd>
<dt><strong>Membership</strong></dt><dd>Member of the Fachgruppe Werbung und Marktkommunikation (Advertising and Market Communication trade group)</dd>
<dt><strong>Supervisory and trade authority</strong></dt><dd><a href="https://www.wien.gv.at/kontakt/mba0108">Magistratisches Bezirksamt für den 1. und 8. Bezirk, Wien</a></dd>
<dt><strong>Applicable trade regulation</strong></dt><dd><a href="https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&amp;Gesetzesnummer=10007517">Austrian Trade Regulation Act (Gewerbeordnung 1994, RIS)</a></dd></dl>
<h2 id="line">Editorial policy (§ 25 Austrian Media Act, Mediengesetz)</h2><p>Patch Play Guide explains graphics options, frame rates and display technology in video games and offers tools for comparing settings.</p>
<h2>Contact form</h2>
<form action="https://www.viennabyalocal.com/kontakt.php" method="post" accept-charset="UTF-8" aria-label="Contact form" style="display:grid;gap:.85rem;max-width:34rem">
 <input type="hidden" name="site" value="patchplayguide.com"><input type="hidden" name="language" value="en">
 <div hidden aria-hidden="true"><label>Website URL <input name="company_url" tabindex="-1" autocomplete="off"></label></div>
 <label style="display:grid;gap:.25rem">Name (optional)<input name="sender_name" autocomplete="name" type="text" maxlength="120" style="font:inherit;width:100%;box-sizing:border-box;padding:.55em"></label>
 <label style="display:grid;gap:.25rem">Your email address (required)<input name="email" autocomplete="email" type="email" required maxlength="254" style="font:inherit;width:100%;box-sizing:border-box;padding:.55em"></label>
 <label style="display:grid;gap:.25rem">Your message (required)<textarea name="message" rows="5" required maxlength="6000" style="font:inherit;width:100%;box-sizing:border-box;padding:.55em"></textarea></label>
 <p>AdStern uses your details to respond to your enquiry. <a href="/privacy/">Privacy policy</a></p>
 <button type="submit" style="justify-self:start;padding:.65em 1.2em;font:inherit">Send message</button>
</form>
<h2 id="links">External links</h2>
<p>Links to other websites were checked when the linking page was published or last reviewed. We have no influence on the content of external sites and accept no responsibility for it.</p>
<h2 id="trademarks">Trademarks</h2>
<p>Names of games, platforms and technologies are trademarks of their respective owners. They are used only to describe compatibility and settings.</p>`)
  },
  {
    path: '/privacy/',
    title: 'Privacy policy – Patch Play Guide',
    description: 'How patchplayguide.com processes data: GitHub Pages hosting, Google AdSense with consent, Google Analytics after consent, local tool inputs and your rights.',
    crumbs: [['Home', '/'], ['Privacy', '/privacy/']],
    body: legal('Privacy', 'Privacy policy', `<p>This policy explains which personal data is processed when you visit patchplayguide.com, why, on which legal basis, and which rights you have.</p>
<h2 id="controller">Controller</h2>
<p>AdStern – Agentur für digitales Marketing, Seilerstätte 8, 1010 Wien, Österreich, email <a href="mailto:office@adstern.com">office@adstern.com</a>. Further details are in the <a href="/imprint/">imprint</a>.</p>
<h3>Contact form</h3><p>The contact form in the <a href="/imprint/">imprint</a> does not send your message to GitHub Pages, which hosts this site. When you submit it, your browser sends your email address, your message, your optional name, the name of this website (patchplayguide.com) and the page language directly to a form script at <b>https://www.viennabyalocal.com/kontakt.php</b>. viennabyalocal.com is another website of AdStern, hosted by AdStern with World4You; the script passes your details on to office@adstern.com. Like every web request, the submission also transmits your IP address to that server. AdStern uses these details to answer your enquiry. To limit automated submissions, the server counts requests per pseudonymous IP identifier over a 15-minute window.</p>
<h2 id="hosting">Hosting on GitHub Pages</h2>
<p>This website consists of static files served by GitHub Pages, a service of GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA. To deliver a page, your browser sends technical data to GitHub’s servers – your IP address, the requested address, date and time, browser and operating system, and the referring page. GitHub uses this data to deliver the site and to keep the service secure and may store it in server logs for a limited time. Legal basis: our legitimate interest in providing a secure, working website (Art. 6(1)(f) GDPR). Transfers to the USA are based on the EU–U.S. Data Privacy Framework or on standard contractual clauses. More information: <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" rel="noopener">GitHub General Privacy Statement</a>.</p>
<h2 id="local">Tool inputs and “My setup” (local storage)</h2>
<p>The tools – Upscaler Resolution Calculator, Frame Time Calculator, Settings Test Log, Bottleneck Finder, Settings Translator, Patch Decoder and the setting-name map – and “My setup” work entirely in your browser. Patch-note text you paste, ticked checklist items, the runs and labels you type into the test log, your chosen bottleneck and your saved platform, GPU class and video memory are stored only in your browser’s local storage on your device, so they are still available on your next visit. This data is never transmitted to us or to third parties. You can delete it with the “Clear” buttons in the tools or by deleting this site’s data in your browser settings. Legal basis: storing this data is necessary to provide the function you request (§ 165(3) Austrian Telecommunications Act 2021; Art. 6(1)(f) GDPR).</p>
<p><b>Links to a result.</b> The calculators and the Bottleneck Finder write their current input (numbers such as a resolution, a frame rate or the code of your answers) into the page address, so that the address can be copied and reopens the same result. The buttons “Copy link …” in the test log, in the Settings Translator and in the name map create such an address with the values, the chosen bottleneck or the search word you typed; it reaches a server only when someone opens it. Like every page address, an address with these values is transmitted to the hosting provider when it is opened. It is also visible to Google as the address of the page as soon as advertising is loaded on that page – the tool pages load Google’s ad script on every visit, without consent as limited ads (see below) – and to Google Analytics once you have consented to it. Do not put personal information into the free-text fields if you intend to share a link.</p>
<h2 id="ads">Advertising with Google AdSense</h2>
<p>Guide, tool and overview pages (the home page, the guide overview and About) can show advertising from Google AdSense; the imprint, this privacy policy and the contact page load no advertising. AdSense is a service of Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland, and, for users outside the EEA, the UK and Switzerland, Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA. AdSense uses cookies and similar technologies to deliver ads, limit how often an ad is shown, measure performance and prevent fraud.</p>
<p><b>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites.</b> Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to this site and/or other sites on the Internet.</p>
<p>You can opt out of personalized advertising in Google’s <a href="https://adssettings.google.com" rel="noopener">Ads Settings</a>. You can also opt out of third-party vendors’ use of cookies for personalized advertising at <a href="https://www.aboutads.info/choices/" rel="noopener">www.aboutads.info</a> or, in Europe, at <a href="https://www.youronlinechoices.eu/" rel="noopener">www.youronlinechoices.eu</a>. How Google uses data from websites that use its services is explained at <a href="https://policies.google.com/technologies/partner-sites" rel="noopener">policies.google.com/technologies/partner-sites</a>.</p>
<h2 id="consent">Consent (Google consent management platform)</h2>
<p>Visitors from the European Economic Area, the United Kingdom and Switzerland see a consent message from Google’s certified consent management platform, which implements the IAB Transparency &amp; Consent Framework, before any cookies or similar technologies that require consent are used. Before any Google script runs, Google Consent Mode is set to “denied” for advertising and analytics storage.</p>
<p>Personalized ads are shown only with your consent. Non-personalized ads, which are selected based on the page content and approximate location, also use cookies or similar identifiers for frequency capping, reporting and fraud prevention, and therefore also require consent to storing and accessing information on your device. If you do not consent, Google may show <b>limited ads</b>. Limited ads do not use cookies or local storage for personalised advertising; Google may still use them for fraud prevention and frequency limits as described in its documentation, and it processes technical data such as your IP address to deliver the ads. Legal basis: your consent (Art. 6(1)(a) GDPR, § 165(3) Austrian Telecommunications Act 2021).</p>
<p>You can change or withdraw your decision at any time with effect for the future using <button type="button" class="linklike" data-privacy-settings>Privacy settings</button>; the same button is in the footer of every page. On guide, tool and overview pages it opens Google’s consent message; if a U.S. state privacy law applies to your visit, it opens Google’s U.S. opt-out dialog instead, where you can opt out of the sale or sharing of personal information and of targeted advertising; after an opt-out, ad personalization and Google Analytics stay off. While Google’s consent message is not displayed, and on pages that load no advertising (such as this privacy policy, the imprint and the contact page), the button opens our <a href="#stats-window">interim statistics window</a> instead. When opened via “Privacy settings”, the window also offers the button “Open Google’s ad &amp; U.S. privacy choices”, so that you can always withdraw your consent to advertising or opt out under a U.S. state privacy law. It opens Google’s revocation or U.S. opt-out dialog and never gives consent itself. On pages without advertising, Google’s consent script (fundingchoicesmessages.google.com, no ad code) is loaded only when you press it; Google Analytics is never loaded on these pages.</p>
<h2 id="stats-window">Interim statistics window</h2>
<p>At the moment Google’s consent message is set up on this site but is not displayed. So that visits are still counted only with your consent, we show a small window of our own (“Stats check”) for as long as this is the case. It appears about three seconds after a guide, tool or overview page has loaded if Google’s consent platform has by then neither reported a decision nor displayed its message, and has not reported that the GDPR does not apply to your visit. It asks only about statistics with Google Analytics 4 (Google Ireland Limited); it is not consent to advertising. It never switches on advertising storage, ad user data or ad personalization – these stay “denied” – and it does not change the advertising or the consent message. “Allow” and “Decline” are equal choices. Until you choose, Google Analytics stays off. Closing the window with “×” or the Escape key stores nothing: if no choice is saved yet, Google Analytics stays off and we ask again on the next page; a choice you saved earlier stays as it is (change it with “Allow” or “Decline”).</p>
<p>If you choose “Allow”, Consent Mode is set to “granted” for analytics storage only and Google Analytics loads once, as described in the next section, with Google signals and ad personalization switched off. It sets the cookies <code>_ga</code> and <code>_ga_…</code> on your device, and data may be transferred to Google LLC in the USA (on the basis of the EU–U.S. Data Privacy Framework). If you choose “Decline” or later withdraw your consent, Google Analytics is switched off on the page at once, analytics storage is set back to “denied”, and any <code>_ga</code> and <code>_ga_…</code> cookies of this domain are deleted; they are also deleted when a page loads and a stored “Decline” is found.</p>
<p>What is stored: your choice is saved in your browser’s local storage under the key <code>ppg-stats</code>, with a version number, your choice (“yes” or “no”) and the time of the choice. The entry is needed to respect your decision and is not sent to us or to Google. After 12 months, or if we change the window, we ask again; an entry with a date in the future is discarded. If your browser blocks local storage, your choice applies only to the current page.</p>
<p>Legal basis: your consent (Art. 6(1)(a) GDPR; for storing and reading information on your device § 165(3) of the Austrian Telecommunications Act 2021, TKG 2021). You can view, change or withdraw your choice at any time via “Privacy settings” at the bottom of every page, including this one; pages without advertising load neither ads nor Google Analytics; the window there shows and changes the stored choice and, on request, opens Google’s consent message (see above). If Google’s consent message reports a decision there, a choice stored in our window is deleted as well.</p>
<p>Google’s consent platform has priority: as soon as it displays its message, only that message counts and our window closes. As soon as it reports a decision, or reports that the GDPR does not apply to your visit, only that counts, our window is no longer shown and a choice stored in it is deleted; visitors to whom the GDPR does not apply are then treated as described in the next section. If Google’s consent platform reports that you have not consented to analytics, the Google Analytics cookies are deleted, even if you never used our window. If your browser sends a Global Privacy Control signal, Google Analytics stays off and the window does not appear by itself; via “Privacy settings” it only explains this. Visitors in U.S. states: a U.S. opt-out reported by Google’s consent platform (including a GPP or Global Privacy Control signal) keeps Google Analytics off, whatever was chosen in the window; the window does not sell or share personal information and enables no advertising.</p>
<h2 id="analytics">Google Analytics 4</h2>
<p>We use Google Analytics 4 (property ${SITE.ga}; Google Ireland Limited / Google LLC) to understand which guides and tools are used, so that we can improve them. Google Analytics is switched off by default. In the EEA, the UK and Switzerland it is loaded only after you have consented in the consent message to storing and accessing information on your device (TCF purpose 1), to Google as a vendor, and to analytics storage – or, while Google’s consent message is not displayed, after you have chosen “Allow” in our <a href="#stats-window">interim statistics window</a>. Outside these regions it is loaded only if the consent platform reports analytics storage as granted or not requiring consent and has confirmed that you have not opted out under a U.S. state privacy law; if any of these signals is missing or unclear, Google Analytics stays off. When you withdraw consent via “Privacy settings”, Consent Mode is set back to “denied” and Google Analytics is switched off on the page immediately. Google signals and ad personalization are switched off. Google Analytics 4 does not log or store IP addresses. Event data is kept for the retention period set in our Google Analytics property. Legal basis: your consent (Art. 6(1)(a) GDPR). Transfers to Google LLC in the USA are based on the EU–U.S. Data Privacy Framework.</p>
<h2 id="fonts">Fonts and other resources</h2>
<p>The fonts Chakra Petch, IBM Plex Sans and JetBrains Mono are served from this website itself. Apart from the Google advertising, consent and analytics scripts described above, no scripts, stylesheets or fonts are loaded from other servers.</p>
<h2 id="email">Email</h2>
<p>If you email us, we use your email address and message only to answer you and delete them once they are no longer needed for that purpose, unless statutory retention obligations apply (Art. 6(1)(b) and (f) GDPR).</p>
<h2 id="rights">Your rights</h2>
<p>You have the right of access (Art. 15 GDPR), rectification (Art. 16), erasure (Art. 17), restriction of processing (Art. 18), data portability (Art. 20) and the right to object to processing based on legitimate interests (Art. 21). You can withdraw consent at any time with effect for the future. For requests about Google services, you can also contact Google; Google’s own controls are available at <a href="https://myaccount.google.com/data-and-privacy" rel="noopener">myaccount.google.com</a>.</p>
<p>You have the right to lodge a complaint with a supervisory authority. In Austria this is the Datenschutzbehörde (Austrian Data Protection Authority), Barichgasse 40–42, 1030 Vienna, <a href="mailto:dsb@dsb.gv.at">dsb@dsb.gv.at</a>, <a href="https://www.dsb.gv.at/" rel="noopener">www.dsb.gv.at</a>. You can also contact the authority in your country of residence.</p>
<h2 id="us">Notice for residents of U.S. states</h2>
<p>Some U.S. state privacy laws, such as the California Consumer Privacy Act as amended by the California Privacy Rights Act, may treat the use of advertising cookies for cross-context behavioral advertising as a “sale” or “sharing” of personal information. Where such laws apply, Google’s consent platform offers an option to opt out (“Do Not Sell or Share My Personal Information”), which you can reopen at any time via “Privacy settings”. We do not sell personal information in any other way and do not knowingly collect personal information from children under 16.</p>
<h2 id="changes">Changes to this policy</h2>
<p>We update this policy when the services used on this website change. The date below shows the current version.</p>`)
  }
];

export const NOT_FOUND = {
  path: '/404.html',
  title: 'Page not found – Patch Play Guide',
  description: 'The page you were looking for does not exist on patchplayguide.com. Use the links to reach the tools, the guides or the home page.',
  body: `<article class="doc"><p class="kicker">Error 404</p><h1>This page does not exist</h1>
<p class="lede">The address may be mistyped, or the page has moved during our rebuild in November 2026.</p>
<ul><li><a href="/">Home</a></li><li><a href="/tools/">All tools</a></li><li><a href="/reference/setting-names/">Setting-name map</a></li><li><a href="/guides/">All guides</a></li></ul></article>`
};

// old single-page site → new pages (noindex + canonical + meta refresh, never to "/")
export const OLD_URLS = [
  ['/about.html', '/about/'],
  ['/imprint.html', '/imprint/'],
  ['/privacy.html', '/privacy/'],
  ['/advertise.html', '/contact/'],
  ['/contact.html', '/contact/'],
  // old addresses still in Google's index (Nov 2026) → closest new page
  ['/verify-steam-files.html', '/guides/shader-compilation-stutter-after-update/'],
  ['/settings-test-sheet.html', '/tools/settings-test-log/'],
  // guide merged into the testing guide on 2026-11-18
  ['/guides/after-update-retest-routine/', '/guides/how-to-test-a-settings-change/'],
  // guide replaced on 2026-11-24 by the reference with per-game data from official sources
  ['/guides/ps5-pro-enhanced-games/', '/reference/console-upgrades/']
];
