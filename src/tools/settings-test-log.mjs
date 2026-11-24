import { createRequire } from 'node:module';
import { tbl, fig } from '../h.mjs';
import { src } from '../h.mjs';
const require = createRequire(import.meta.url);
const T = require('../assets/js/testlog-core.js');

const toolHtml = `<section class="tool" id="testlog" aria-labelledby="tl-h">
<div class="tool-head"><h2 id="tl-h">Settings Test Log</h2><p class="tool-sub">Your runs, your numbers · stays in this browser</p></div>
<label for="tl-scene">Game, scene and route (for your notes)<input type="text" id="tl-scene" maxlength="80" autocomplete="off" placeholder="e.g. harbor district, sprint from gate to market, 60 s"></label>
<div class="filters">
<fieldset><legend>Setup A – before</legend>
<label for="tl-na">What is set<input type="text" id="tl-na" maxlength="40" autocomplete="off" placeholder="e.g. Shadows: High"></label>
<label for="tl-a">Average FPS of each run<input type="text" id="tl-a" inputmode="decimal" autocomplete="off" placeholder="71 73 72"></label>
<label for="tl-la">1% low of each run (optional)<input type="text" id="tl-la" inputmode="decimal" autocomplete="off" placeholder="52 55 51"></label>
</fieldset>
<fieldset><legend>Setup B – after one change</legend>
<label for="tl-nb">What is set<input type="text" id="tl-nb" maxlength="40" autocomplete="off" placeholder="e.g. Shadows: Medium"></label>
<label for="tl-b">Average FPS of each run<input type="text" id="tl-b" inputmode="decimal" autocomplete="off" placeholder="75 74 77"></label>
<label for="tl-lb">1% low of each run (optional)<input type="text" id="tl-lb" inputmode="decimal" autocomplete="off" placeholder="53 56 52"></label>
</fieldset>
</div>
<p class="tool-sub">Separate runs with spaces, line breaks, semicolons or a comma followed by a space; a comma directly between digits is a decimal mark (71,5 = 71.5). Three to seven runs per setup.</p>
<p id="tl-err" class="tool-err" role="alert" hidden></p>
<p id="tl-demo" class="fict" hidden><b>INVENTED EXAMPLE</b> – these numbers are made up to show how the log works. They are not measurements of any game or hardware.</p>
<p id="tl-summary" class="sum" tabindex="-1" aria-live="polite"></p>
<div id="tl-out" class="results tool-table"></div>
<div class="row tool-actions"><button type="button" id="tl-example">Load an invented example</button><button type="button" id="tl-copy" class="ghost">Copy summary</button><button type="button" id="tl-csv" class="ghost">Download CSV</button><button type="button" id="tl-link" class="ghost">Copy link with my numbers</button><button type="button" id="tl-print" class="ghost">Print result</button><button type="button" id="tl-sheet" class="ghost">Print blank worksheet</button><button type="button" id="tl-clear" class="ghost">Clear</button><span id="tl-msg" class="tool-sub" aria-live="polite"></span></div>
</section>`;

const luck = tbl('How often a clean split appears by pure chance', ['Runs per setup', 'Possible orderings of all runs', 'Chance that one setup wins every run by luck'],
  [3, 4, 5, 6, 7].map((n) => [`${n} + ${n}`, String(T.choose(2 * n, n)), `2 in ${T.choose(2 * n, n)} = 1 in ${T.luck(n, n)}`]),
  'Counting argument, not a measurement: if a setting changes nothing, every ordering of the runs is equally likely, and only two of them put all runs of one setup above all runs of the other.');

const dots = (xs, y, cls) => xs.map((x) => `<circle class="${cls}" cx="${x}" cy="${y}" r="6"/>`).join('');
const overlap = fig('tl-fig', 'Two dot plots: on the left the runs of setup A and B overlap, on the right every run of B lies above every run of A',
`<rect class="g-bg" width="640" height="220"/>
<rect class="g-panel" x="16" y="40" width="296" height="150" rx="8"/><rect class="g-panel" x="328" y="40" width="296" height="150" rx="8"/>
<text class="g-tb" x="30" y="66">Overlap: undecided</text><text class="g-tb" x="342" y="66">Clean split: separated</text>
<text class="g-tm" x="30" y="104">A</text><text class="g-tm" x="30" y="144">B</text><text class="g-tm" x="342" y="104">A</text><text class="g-tm" x="342" y="144">B</text>
${dots([90, 150, 200], 100, 'g-acc')}${dots([130, 180, 250], 140, 'g-plus')}
${dots([400, 430, 460], 100, 'g-acc')}${dots([520, 550, 590], 140, 'g-plus')}
<path class="g-grid" d="M50 170h250M362 170h250"/><text class="g-tm" x="50" y="184">lower fps</text><text class="g-tm" x="300" y="184" text-anchor="end">higher fps</text><text class="g-tm" x="362" y="184">lower fps</text><text class="g-tm" x="612" y="184" text-anchor="end">higher fps</text>
<text class="g-tm" x="16" y="26">ILLUSTRATION OF THE RULE – invented positions, not measured data</text>`,
'The rule the log applies. Left: the fastest run of A is faster than the slowest run of B, so the rule cannot separate the medians from run-to-run noise – undecided, not equal. Right: every B run beats every A run – the kind of result that rarely happens by chance.', '0 0 640 220');

const blank = (n) => Array.from({ length: n }, () => '<td></td>').join('');
const worksheet = `<div class="worksheet" id="worksheet"><h3>Settings test worksheet</h3>
<p class="ws-line">Game and version: ______________________  Date: ____________  Driver / system version: ______________</p>
<p class="ws-line">Scene and route (where, how long, what you do): ________________________________________________</p>
<div class="tbl"><table><caption>One change at a time: setup B differs from setup A in exactly one setting</caption><thead><tr><th scope="col">Setup</th><th scope="col">What is set</th><th scope="col">Run 1</th><th scope="col">Run 2</th><th scope="col">Run 3</th><th scope="col">Run 4</th><th scope="col">Run 5</th><th scope="col">Median</th><th scope="col">Lowest–highest</th></tr></thead><tbody>
<tr><th scope="row">A · average fps</th>${blank(8)}</tr><tr><th scope="row">A · 1% low</th>${blank(8)}</tr>
<tr><th scope="row">B · average fps</th>${blank(8)}</tr><tr><th scope="row">B · 1% low</th>${blank(8)}</tr></tbody></table></div>
<p class="ws-line">Do the lowest–highest ranges of A and B overlap?  ☐ yes → inconclusive  ☐ no → ranges separated</p>
<p class="ws-line">What I saw (stutter, blur, artifacts): _______________________________________________________</p>
<p class="ws-line">Decision: ☐ keep A  ☐ keep B  ☐ test again with a longer route</p>
<p class="small">patchplayguide.com/tools/settings-test-log/ – median: sort the runs and take the middle one.</p></div>`;

export default {
  slug: 'settings-test-log',
  published: '2026-11-18',
  changelog: [['2026-11-18', 'First published.'], ['2026-11-24', 'Verdicts corrected: overlapping runs are reported as inconclusive – never as “the same” or “not noticeable” – and separated runs as separated, without a claim about the cause. Input format made unambiguous: runs are separated by spaces, line breaks, semicolons or a comma followed by a space, a comma directly between digits is a decimal mark, and ambiguous input such as “71,73,72” is rejected with a message. The six-step protocol, which repeated the testing guide, shortened to a link.']],
  short: 'Settings Test Log',
  title: 'Settings Test Log: is your FPS difference real or noise?',
  description: 'Type in the frame rates of your own test runs before and after a settings change. The log shows medians, run-to-run spread and whether the ranges separate.',
  kicker: 'Tool · test protocol',
  h1: 'Settings Test Log: is the difference real, or just noise?',
  lede: 'You changed one setting and the counter shows three more frames per second. Is that the setting, or would the next run have shown the same without it? Type in the results of a few runs before and after the change. The log calculates the median and the run-to-run spread of each setup and tells you whether the two ranges separate – or whether the result is undecided. There is also a blank worksheet to print and fill in by hand.',
  scripts: ['toolkit.js', 'testlog-core.js', 'testlog.js'],
  toolHtml,
  sections: [
    `<h2 id="how">What the log calculates</h2>
<p>For each setup the log takes your runs and shows three things. The <b>median</b> is the middle run when they are sorted; unlike the mean, one odd run – a background download, a loading hitch – does not drag it. The <b>lowest–highest range</b> shows how far your runs scatter when nothing changes; this is your noise. The <b>spread</b> is that range in fps and as a percentage of the median.</p>
<p>Then it compares the two setups: the difference of the medians in fps and percent, and the same difference in milliseconds per frame, because that is the unit you feel (see the <a href="/tools/frame-time-calculator/">Frame Time Calculator</a>). Finally it gives a verdict with one deliberately strict rule: the two setups count as <b>separated</b> only if every run of one setup is faster than every run of the other. If the ranges overlap, the log calls the result inconclusive and declares no winner – and no tie either.</p>`,
    `<h2 id="rule">Why the rule is “no overlap”</h2>
${overlap}
<p>The rule needs no assumptions about your hardware and no statistics software, and its error rate can be counted. Suppose a setting changes nothing at all. Then your six runs are six draws from the same pot, and every ordering of them is equally likely. With three runs per setup there are 20 ways to split six runs into two groups of three, and only two of them place all runs of one group above all runs of the other. A clean split therefore appears by luck in 1 of 10 tests. More runs make the rule much stricter:</p>
${luck}
<p>This is why the testing guide recommends at least three runs and suggests five when a decision matters: with five runs per setup, a clean split that is pure luck happens once in 126 tests. The price of the strict rule is that real differences can hide in the overlap: invented runs of 60, 60 and 70 fps against 69, 80 and 80 fps overlap, although the median rises by 20 fps (33%). An overlap therefore means <b>undecided, not demonstrated</b> – it does not show that the setups perform the same or that the difference is unnoticeable. Look at the medians and the spread, and if the decision matters, repeat a controlled comparison with more runs or a more repeatable route.</p>`,
    `<h2 id="protocol">Where the test routine is explained</h2>
<p>The log only summarizes runs; how to produce comparable runs – one change at a time, a fixed route of 30 to 60 seconds, a warm-up pass, at least three runs per setup – is the subject of <a href="/guides/how-to-test-a-settings-change/#routine">how to test a settings change</a>. After a game or driver update, the warm-up matters most, because the first pass often measures <a href="/guides/shader-compilation-stutter-after-update/">shader compilation</a> rather than the setting. For what the numbers themselves mean, read <a href="/guides/fps-frame-time-1-percent-lows/">FPS, frame time and 1% lows</a>.</p>`,
    `<h2 id="sheet">Printable worksheet</h2>
<p>If you would rather write with a pen next to the console or the handheld, print this sheet. “Print blank worksheet” in the tool prints only the sheet below, without the rest of the page.</p>
${worksheet}`,
    `<h2 id="limits">Limits</h2>
<p>The log knows nothing but the numbers you type. It cannot check whether the runs were comparable, whether a cap or V-Sync flattened them (identical values in every run are a hint), or whether an update changed the scene between A and B. It is built for one question – did this one change make a difference here – not for comparing hardware or publishing benchmarks. Your entries are stored only in this browser. “Copy link with my numbers” puts the values into the link’s address so that you can send it to someone or keep it; nothing is stored on a server.</p>`
  ],
  faq: [
    ['How many test runs do I need to compare two settings?', 'At least three per setup. With three runs each, a clean split still appears by chance in 1 of 10 tests where nothing differs; with five runs each, in 1 of 126.'],
    ['Why does the log use the median and not the average of my runs?', 'The median is the middle run and ignores a single outlier, such as a run disturbed by a background task. With three runs, one bad run shifts the mean but not the median.'],
    ['My runs overlap – does that mean the setting does nothing?', 'No. Overlapping ranges mean the strict rule cannot separate the two setups – the result is undecided, not proven equal. The medians can still differ a lot. Add runs or use a longer, more repeatable route if the decision matters.'],
    ['Does the tool measure my frame rate?', 'No. It runs in the browser and cannot see your game. You measure with an overlay or capture tool and type the results in.']
  ],
  sources: [
    src('Intel – PresentMon', 'https://github.com/GameTechDev/PresentMon', 'an open-source capture tool from Intel that several overlays use'),
    ['Counting argument for the verdict rule', null, 'the number of ways to split 2n runs into two groups of n is the binomial coefficient C(2n, n); the table on this page lists the values']
  ],
  related: ['how-to-test-a-settings-change', 'fps-frame-time-1-percent-lows', 'frame-time-calculator']
};
