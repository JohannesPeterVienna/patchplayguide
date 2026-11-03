import { tbl, fig } from '../h.mjs';

const toolHtml = `<section class="tool" id="decoder" aria-labelledby="dec-h">
<div class="tool-head"><h2 id="dec-h">Patch Decoder</h2><p class="tool-sub">Runs in your browser · nothing is uploaded</p></div>
<fieldset><legend>Source</legend><div class="seg">
<label><input type="radio" name="dec-mode" value="example" checked><span>Fictional example patch</span></label>
<label><input type="radio" name="dec-mode" value="paste"><span>My patch notes</span></label>
</div></fieldset>
<div id="dec-example-note" class="fict"><b>FICTIONAL EXAMPLE</b> – “Saltmarsh Protocol”, update 1.8.0, is a game and patch we invented for this page. It describes no real product; it only shows how the decoder sorts changes.</div>
<div id="dec-paste" hidden>
<label for="dec-input">Paste patch-note lines – one change per line</label>
<textarea id="dec-input" rows="8" spellcheck="false" placeholder="+ Added a frame rate cap option&#10;Fixed a crash when changing resolution on PC&#10;Shader cache is rebuilt after this update&#10;Removed the low texture preset on Xbox Series S&#10;Known issue: stutter on Steam Deck in the hub"></textarea>
<div class="row" style="margin-top:10px"><button type="button" id="dec-sort">Sort my lines</button><button type="button" id="dec-clear" class="ghost">Clear</button></div>
<p id="dec-stale" class="fict" role="status" hidden><b>NOT SORTED YET</b> – your text changed since the last sort. Press “Sort my lines” to update the list; Copy and Download sort the current text first.</p>
<p class="tool-sub" style="margin-top:8px">Your text is kept only in this browser’s local storage so it is still here next time. “Clear” deletes it.</p>
</div>
<div class="filters">
<label for="dec-cat">Category<select id="dec-cat"></select></label>
<label for="dec-plat">Platform<select id="dec-plat"></select></label>
</div>
<p id="dec-summary" class="sum" tabindex="-1" aria-live="polite"></p>
<p id="dec-limit" class="fict" role="status" hidden></p>
<ol id="dec-list" class="difflist results"></ol>
<div class="checklist">
<h3>After-update checklist</h3>
<ul id="dec-checks"></ul>
<div class="row"><button type="button" id="dec-copy">Copy as text</button><button type="button" id="dec-download" class="ghost">Download .txt</button><span id="dec-copied" class="tool-sub" aria-live="polite"></span></div>
<label for="dec-export" class="sr">Checklist as text</label><textarea id="dec-export" readonly hidden></textarea>
</div>
</section>`;

const pipeline = fig('dec-fig', 'How the decoder processes one patch-note line: clean the line, find the change type, the category and the platforms, then attach an action',
`<rect class="g-bg" width="640" height="250"/>
<rect class="g-panel" x="16" y="24" width="608" height="44" rx="6"/>
<text class="g-t" x="30" y="51">“- Fixed stutter on Steam Deck after shader cache rebuild”</text>
<path class="g-line" d="M80 68v34M240 68v34M400 68v34M560 68v34"/>
<rect class="g-panel" x="20" y="102" width="120" height="70" rx="6"/><text class="g-tm" x="32" y="124">1 · CLEAN</text><text class="g-t" x="32" y="150">bullet removed</text>
<rect class="g-panel" x="180" y="102" width="120" height="70" rx="6"/><text class="g-tm" x="192" y="124">2 · TYPE</text><text class="g-plus" x="192" y="154" style="font:700 22px var(--mono)">+</text><text class="g-t" x="212" y="152">“Fixed”</text>
<rect class="g-panel" x="340" y="102" width="120" height="70" rx="6"/><text class="g-tm" x="352" y="124">3 · CATEGORY</text><text class="g-t" x="352" y="152">Shaders</text>
<rect class="g-panel" x="500" y="102" width="120" height="70" rx="6"/><text class="g-tm" x="512" y="124">4 · PLATFORM</text><text class="g-t" x="512" y="152">Handheld PC</text>
<path class="g-acc-s" d="M40 196h560"/>
<text class="g-tm" x="20" y="226">5 · ACTION → “Expect smoother first runs; let shader preparation finish before judging.”</text>`,
'The decoder reads each line on its own. Rules are checked in a fixed order, so “Fixed … shader …” becomes an improvement (+) in the shader category, not a stability fix. Platform words such as “Steam Deck” are matched before the generic word “Steam”, which would otherwise mean PC.', '0 0 640 250');

const signs = tbl('The three change signs used on this site', ['Sign', 'Meaning', 'Typical wording in patch notes', 'First thing to check'], [
  ['<span class="p">+</span> improvement', 'Something was added, fixed or made faster', '“Added”, “Fixed”, “Improved”, “Optimized”, “Reduced stutter”', 'Re-test the area the note mentions; you may be able to raise a setting'],
  ['<span class="t">~</span> change', 'Behavior moved – not clearly better or worse', '“Adjusted”, “Changed”, “Updated”, “Now uses”, “Rebalanced”', 'Re-check the named option: the same preset name may cost more or less now'],
  ['<span class="m">−</span> removal or issue', 'Something was removed, disabled, or is a known problem', '“Removed”, “No longer”, “Disabled”, “Known issue”', 'Check whether your saved setting fell back to another value']
]);

const cats = tbl('Categories and what they usually mean for your settings', ['Category', 'Matched by words such as', 'Usual consequence'], [
  ['Stability &amp; crashes', 'crash, freeze, hang, disconnect', 'Workarounds you set may no longer be needed'],
  ['Shaders &amp; loading', 'shader, compile, cache, load times', 'One-time stutter until the cache is rebuilt'],
  ['Upscaling &amp; frame generation', 'DLSS, FSR, XeSS, PSSR, sharpening, frame generation', 'Image sharpness and latency can change at the same preset name'],
  ['Console &amp; handheld modes', 'performance mode, fidelity mode, 120 Hz, VRR, docked, TDP', 'Your chosen mode may target a different resolution or frame rate'],
  ['Input &amp; latency', 'latency, Reflex, Anti-Lag, controller, dead zone', 'Feel changes even when FPS does not'],
  ['Graphics options', 'shadows, textures, reflections, ray tracing, fog, preset', 'Re-test the named option in one fixed scene'],
  ['Performance', 'FPS, CPU, GPU, VRAM, stutter, frame pacing', 'Re-run your usual test route and compare'],
  ['Gameplay, audio &amp; other', 'everything else, e.g. balance or audio fixes', 'No settings action needed']
]);

export default {
  slug: 'patch-decoder',
  changelog: [['2026-11-02', 'First published.'], ['2026-11-03', 'Export always matches the current text; lines beyond the 300-line limit are named on screen and in the export; copy reports when it fails.']],
  short: 'Patch Decoder',
  title: 'Patch Decoder – sort patch notes into settings actions',
  description: 'Paste patch-note lines and sort them into improvements, changes and removals by category and platform, with a what-to-do note and an after-update checklist.',
  kicker: 'Tool · patch notes',
  h1: 'Patch Decoder: what does this update mean for my settings?',
  lede: 'Patch notes are written for everyone at once: balance changes, bug fixes and graphics changes sit in one long list. The Patch Decoder pulls out what touches performance, graphics options and console modes, marks every line as an improvement (<span class="p">+</span>), a change (<span class="t">~</span>) or a removal (<span class="m">−</span>), and turns it into a short checklist you can tick off after the update.',
  scripts: ['decoder-core.js', 'decoder.js'],
  toolHtml,
  sections: [
    `<h2 id="use">How to use the decoder</h2>
<p>The decoder starts with a <b>fictional example patch</b> so you can see the format immediately. Switch the filters to see how the list narrows: “Console &amp; handheld modes” plus “PS5” leaves only the lines a PS5 player needs to read. Each line carries three labels – the change sign, the category and the platforms it applies to – and a <b>What to do</b> note.</p>
<p>To decode a real update, choose <b>My patch notes</b> and paste the lines from the official patch notes of your game – the developer’s website, the platform’s news page or the store page. One change per line works best; bullets, numbers and dashes at the start of a line are removed automatically. Press <b>Sort my lines</b>. Nothing leaves your browser: the text is stored in your browser’s local storage only, and <b>Clear</b> deletes it.</p>
<p>Below the list, the <b>after-update checklist</b> combines four steps that apply to every update with the actions from the lines you are looking at. Tick items as you go, then copy the list or download it as a text file to keep next to your test notes.</p>`,
    `<h2 id="signs">What the three signs mean</h2>
<p>We use the plus, tilde and minus from software “diffs” because they answer the first question you have when reading patch notes: is this good for me, neutral, or something I have to react to? The sign is about the change, not about its quality. A removed graphics option is marked <span class="m">−</span> even if the developer removed it for a good reason, because it is something you have to check.</p>
${signs}
<p>The tilde is the most important sign for settings. Lines such as “Shadow quality High now uses the shadow distance of Ultra” do not sound alarming, but they mean the same preset name can now cost noticeably more GPU time. Players who tuned their settings carefully before the update often lose a few frames per second without knowing why. Re-testing that single option in one fixed scene is enough to find out.</p>`,
    `<h2 id="rules">How the sorting works – and where it fails</h2>
<p>The decoder does not use artificial intelligence. It applies a short, published list of word rules, in a fixed order, to every line. That makes it predictable: the same line always gets the same labels, and you can see why.</p>
${pipeline}
<p><b>Change type.</b> A line that starts with “+”, “~” or “−” (the minus sign, not a hyphen) keeps that sign. A line that starts with “Known issue” is a minus; one that starts with “Fixed”, “Resolved” or “Addressed” is a plus. Otherwise the first matching word decides: removal words such as “removed”, “no longer” and “disabled” win over improvement words such as “added”, “improved” and “optimized”, which win over change words such as “adjusted” and “now”. Two phrases are checked first: “no longer crashes / stutters / flickers …” is a fix (+), and “can now be disabled” is a change (~), not a removal. A line without any of these words is treated as a change (~), the cautious default.</p>
${cats}
<p><b>Category.</b> Categories are checked from the most specific to the most general. Crashes come first, so “Fixed a crash when enabling DLSS” is a stability fix rather than an upscaling change. Shader and loading terms come before performance terms, so “shader stutter” lands in Shaders, not in general Performance. A fix that only happens “in handheld mode” or “when docked” – say, an audio desync – is not treated as a mode change.</p>
<p><b>Platforms.</b> The decoder looks for platform names: PC words (Windows, Steam, DirectX, NVIDIA, AMD), PS5 and PlayStation, Xbox and Series X|S, Switch 2, and handheld PCs such as Steam Deck. “Handheld mode” next to “Switch 2” counts as the Switch’s mode. A line that names no platform applies to all platforms and stays visible under every platform filter.</p>
<p><b>Limits.</b> Word rules cannot understand context. “Removed an issue that caused stutter” is a fix, but the word “removed” makes it a minus. Lines written in other languages, or patch notes that describe several changes in one sentence, will be sorted less reliably. Treat the labels as a first pass that saves reading time, and read the original line before you act on it.</p>`,
    `<h2 id="fictional">Why the example game is fictional</h2>
<p>Patch notes change weekly, and a decoder that shows outdated or invented changes for a real game would mislead you. The example “Saltmarsh Protocol 1.8.0” is therefore clearly invented. Its lines are realistic in form – they are the kinds of changes big games ship all the time – but they make no claim about any real product.</p>
<p>Look at what the example teaches: a performance improvement for crowds (CPU work), a quietly heavier shadow preset, a removed texture option that matters for graphics cards with little video memory, a new 40 fps mode that only works with a 120 Hz display, a shader rebuild that will cause stutter on the first launch, and a gameplay tweak that needs no settings action at all. Most real updates contain a mix like this, and each line type is explained in depth in <a href="/guides/how-to-read-patch-notes/">How to read patch notes</a>.</p>`,
    `<h2 id="after">After decoding: test, don’t guess</h2>
<p>The decoder tells you <i>what</i> to look at. Whether a change actually affects your system can only be answered with a short, repeatable test: same scene, same settings, a warm-up run, then a measured run. The <a href="/guides/after-update-retest-routine/">10-minute re-test routine</a> walks through it, and <a href="/guides/how-to-test-a-settings-change/">how to test a settings change properly</a> explains why a single number from one run is not enough.</p>
<p>If the re-test shows lower performance, the <a href="/tools/bottleneck-finder/">Bottleneck Finder</a> helps you work out whether the CPU, the GPU or video memory is now the limit, and the <a href="/tools/settings-translator/">Settings Translator</a> shows which options usually relieve that resource with the least visible loss.</p>`
  ],
  faq: [
    ['Does the Patch Decoder fetch patch notes automatically?', 'No. It works only with the fictional example and the lines you paste yourself. We do not copy patch notes from publishers; paste them from the official source of your game.'],
    ['Is my pasted text sent anywhere?', 'No. Sorting happens in your browser. The text is kept in your browser’s local storage so it survives a reload, and the Clear button removes it.'],
    ['Why is a fix marked with a plus and a known issue with a minus?', 'The sign tells you whether you have to react. A fix can let you undo a workaround; a known issue or removal means you should check your settings or avoid a trigger until the next update.'],
    ['Can I trust the categories blindly?', 'No. They come from simple word rules and are a fast first pass. Always read the original line before changing settings, especially when one sentence describes several changes.'],
    ['Why does an unlabeled line show up under every platform?', 'Patch notes often omit platforms when a change applies everywhere. Hiding such lines would make you miss changes, so they stay visible under every platform filter, tagged “All platforms”.']
  ],
  sources: [
    ['SteamDB patch notes archive', 'https://steamdb.info/patchnotes/', 'build history and raw patch notes for games on Steam'],
    ['PCGamingWiki', 'https://www.pcgamingwiki.com/', 'community documentation of PC settings and fixes per game'],
    ['Official patch notes of each game', null, 'publisher websites, the PlayStation Blog, Xbox Wire, Nintendo’s update history pages and Steam news are the primary sources to paste from']
  ],
  related: ['how-to-read-patch-notes', 'after-update-retest-routine', 'shader-compilation-stutter-after-update']
};
