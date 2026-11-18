import { createRequire } from 'node:module';
import { tbl, fig, SRC } from '../h.mjs';
const require = createRequire(import.meta.url);
const F = require('../assets/js/frametime-core.js');

const opt = (list, sel) => list.map((v) => `<option value="${v}"${v === sel ? ' selected' : ''}>${v} Hz</option>`).join('');
const toolHtml = `<section class="tool" id="ftcalc" aria-labelledby="ft-h">
<div class="tool-head"><h2 id="ft-h">Frame Time Calculator</h2><p class="tool-sub">Arithmetic only · no measurements</p></div>
<div class="filters filters-3">
<label for="ft-fps">Frame rate (fps)<input type="number" id="ft-fps" min="1" max="1000" step="any" inputmode="decimal"></label>
<label for="ft-hz">Display refresh rate (Hz)<input type="number" id="ft-hz" min="24" max="1000" step="any" inputmode="decimal" list="ft-hz-list"><datalist id="ft-hz-list"><option value="60"><option value="90"><option value="120"><option value="144"><option value="165"><option value="240"></datalist></label>
<label for="ft-fg">Frame generation<select id="ft-fg"><option value="1">Off</option><option value="2">2× (one generated frame)</option><option value="3">3×</option><option value="4">4×</option></select></label>
<label for="ft-min">VRR window from (Hz, optional)<input type="number" id="ft-min" min="1" max="1000" step="any" inputmode="decimal"></label>
<label for="ft-max">VRR window to (Hz, optional)<input type="number" id="ft-max" min="1" max="1000" step="any" inputmode="decimal"></label>
<label for="ft-vs">Compare with (fps, optional)<input type="number" id="ft-vs" min="1" max="1000" step="any" inputmode="decimal"></label>
</div>
<p id="ft-summary" class="sum" tabindex="-1" aria-live="polite"></p>
<div id="ft-out" class="matrix results"></div>
<div class="row tool-actions"><button type="button" id="ft-link">Copy link to this result</button><button type="button" id="ft-copy" class="ghost">Copy as text</button><button type="button" id="ft-print" class="ghost">Print</button><span id="ft-msg" class="tool-sub" aria-live="polite"></span></div>
<div class="examples"><span class="tool-sub">Examples:</span>
<button type="button" class="chip" data-ex="fps=40&amp;hz=120">40 fps on a 120 Hz TV</button>
<button type="button" class="chip" data-ex="fps=40&amp;hz=60">40 fps on a 60 Hz TV</button>
<button type="button" class="chip" data-ex="fps=45&amp;hz=120&amp;min=48&amp;max=120">45 fps in a 48–120 Hz VRR window</button>
<button type="button" class="chip" data-ex="fps=70&amp;hz=120&amp;fg=2">70 fps with 2× frame generation at 120 Hz</button>
<button type="button" class="chip" data-ex="fps=30&amp;vs=60">30 → 60 fps</button>
<button type="button" class="chip" data-ex="fps=120&amp;vs=240">120 → 240 fps</button>
</div>
</section>`;

const r2 = (x) => F.round(x, 2).toFixed(2).replace(/\.?0+$/, '');
const rates = tbl('Frame rate and frame time (1000 ÷ fps)', ['Frame rate', 'Frame time', 'Gain over the row above'],
  [24, 30, 40, 45, 60, 90, 120, 144, 240].map((v, i, a) => [`${v} fps`, `${r2(F.ms(v))} ms`, i ? `${r2(F.ms(a[i - 1]) - F.ms(v))} ms less per frame` : '–']),
  'The third column shows why the same “+30 fps” means less and less: the step from 30 to 60 fps removes 16.67 ms per frame, the step from 120 to 144 fps only 1.39 ms.');
const even = tbl('Frame rates a fixed-refresh display can show evenly (refresh rate ÷ 1, 2, 3 …)', ['Display', 'Even frame rates', 'Frame is held for'],
  [60, 90, 120, 144].map((hz) => [`${hz} Hz`, F.evenRates(hz, 5).map((r) => r2(r.fps)).join(' · ') + ' fps', F.evenRates(hz, 5).map((r) => r2(r.ms)).join(' · ') + ' ms']),
  'This is why 40 fps modes need a 120 Hz output: 40 divides 120 (three refreshes per frame) but not 60.');

const tick = (x, y) => `<path class="g-grid" d="M${x} ${y - 16}v32"/>`;
const pacing = fig('ft-fig', 'Two timelines of 40 frames per second: on a 120 hertz display every frame covers exactly three refreshes, on a 60 hertz display frames alternate between one and two refreshes',
`<rect class="g-bg" width="640" height="250"/>
<text class="g-tm" x="20" y="28">40 FPS ON A 120 HZ DISPLAY · every frame = 3 refreshes = 25 ms</text>
${Array.from({ length: 13 }, (_, i) => tick(20 + i * 50, 70)).join('')}
${[0, 1, 2, 3].map((i) => `<rect class="${i % 2 ? 'g-acc' : 'g-plus'}" x="${22 + i * 150}" y="58" width="146" height="24" rx="3"/>`).join('')}
<text class="g-tm" x="20" y="112">each tick = one refresh (8.33 ms)</text>
<text class="g-tm" x="20" y="150">40 FPS ON A 60 HZ DISPLAY · frames alternate: 1 refresh, 2 refreshes</text>
${Array.from({ length: 7 }, (_, i) => tick(20 + i * 100, 192)).join('')}
${[[0, 1], [1, 2], [3, 1], [4, 2]].map(([s, n], i) => `<rect class="${i % 2 ? 'g-acc' : 'g-plus'}" x="${22 + s * 100}" y="180" width="${n * 100 - 4}" height="24" rx="3"/>`).join('')}
<text class="g-tm" x="20" y="234">each tick = one refresh (16.67 ms) · holds of 16.67 ms and 33.33 ms alternate</text>`,
'The same 40 fps on two displays. At 120 Hz every frame stays on screen for three refreshes. At 60 Hz, 60 ÷ 40 = 1.5 is not a whole number, so with V-Sync frames are held for one and two refreshes in turn – motion looks uneven although the frame rate is steady. Calculated, not measured.', '0 0 640 250');

export default {
  slug: 'frame-time-calculator',
  published: '2026-11-18',
  short: 'Frame Time Calculator',
  title: 'Frame Time Calculator: fps to ms, 40 fps, VRR, frame gen',
  description: 'Convert fps to frame time, check whether a frame rate divides your display’s refresh rate, fits a VRR window, and what frame generation shows versus renders.',
  kicker: 'Tool · calculator',
  h1: 'Frame Time Calculator: fps, refresh rate and VRR in milliseconds',
  lede: 'Frame rates hide the unit that explains how a game feels: milliseconds per frame. Enter a frame rate and, if you like, your display’s refresh rate, its VRR window and a frame-generation multiplier. The calculator shows the frame time, whether the frame rate lands evenly on the display, whether VRR can follow it and what frame generation changes – and what it does not.',
  scripts: ['toolkit.js', 'frametime-core.js', 'frametime.js'],
  toolHtml,
  sections: [
    `<h2 id="how">The four calculations</h2>
<p><b>Frame time</b> is 1000 ms divided by the frame rate: 60 fps is 16.67 ms per frame, 40 fps is 25 ms. Because of the division, equal steps in fps are unequal steps in time. That is the reason the jump from 30 to 60 fps is so obvious and the jump from 120 to 144 fps is subtle.</p>
${rates}
<p><b>Fit to a fixed refresh rate.</b> Without variable refresh rate, a display shows a new image only at its refresh ticks. If the refresh rate divided by the frame rate is a whole number, every frame is held for the same number of refreshes and motion is even. If not, frames are held for alternating numbers of refreshes. The calculator shows the two hold times and how often the longer one occurs.</p>`,
    `<h2 id="even">Why 40 fps needs 120 Hz</h2>
${pacing}
${even}
<p>A 40 fps mode sits exactly halfway between 30 and 60 fps in frame time: 33.33 ms, 25 ms, 16.67 ms. It therefore delivers half of the frame-time improvement of 60 fps for a third more frames than 30 fps – but only when each frame can be shown for three refreshes of a 120 Hz output. Console guides that mention “balanced” or “40 fps” modes rely on this arithmetic; see <a href="/guides/ps5-performance-vs-fidelity-mode/">PS5 performance vs fidelity modes</a> and <a href="/guides/vrr-120hz-console-setup/">VRR and 120 Hz setup</a>.</p>`,
    `<h2 id="vrr">The VRR window</h2>
<p>A variable-refresh display can wait for the next frame, but only within a range. AMD’s frame-generation documentation gives the arithmetic with an example: for a 64–120 Hz window, the time between two refreshes has to stay between 8.33 ms and 15.625 ms; outside the window, tearing is likely. Enter your display’s window (from its manual or on-screen menu) and the calculator tells you which of four cases applies: inside the window; below it but with a whole multiple that fits – 40 fps shown twice is 80 Hz, which a display or driver with low framerate compensation can use; below it with no multiple that fits; or above it, where the display behaves like a fixed-rate one and a frame cap brings the game back inside.</p>
<p>AMD lists low framerate compensation as mandatory for FreeSync Premium displays. Whether your own display and console or driver do it is a property of that hardware – the calculator only checks whether a whole multiple exists.</p>`,
    `<h2 id="fg">Frame generation: shown versus rendered</h2>
<p>With frame generation, two rates matter. The <b>shown</b> rate is the rendered rate times the multiplier; the <b>rendered</b> rate is how often the game reads your input and updates the world. At 70 rendered fps with 2× generation the screen shows 140 images per second, one every 7.14 ms, while the game still advances every 14.29 ms. The calculator prints both and compares the shown rate with your refresh rate. AMD’s pacing notes recommend keeping the rendered frame rate slightly below half the desired output rate for 2× generation; Intel names 40 fps as the minimum and 60 fps as the recommended input rate for XeSS Frame Generation. The background is in <a href="/guides/frame-generation-explained/">frame generation explained</a>.</p>
<p>The calculator cannot tell you how much latency a particular game adds, how well a display handles its window, or how stable your frame rate is. For those you need your own runs – the <a href="/tools/settings-test-log/">Settings Test Log</a> keeps them comparable.</p>`
  ],
  faq: [
    ['How many milliseconds is 60 fps?', '1000 ÷ 60 = 16.67 ms per frame. 30 fps is 33.33 ms, 120 fps is 8.33 ms and 144 fps is 6.94 ms.'],
    ['Why does 40 fps look smooth on a 120 Hz TV but not on a 60 Hz TV?', '120 ÷ 40 = 3, so every frame is shown for exactly three refreshes. 60 ÷ 40 = 1.5, so frames alternate between one and two refreshes, which looks uneven without VRR.'],
    ['What happens when the frame rate falls below the VRR range?', 'VRR can only follow frame rates inside the display’s window. Below it, a display or driver with low framerate compensation shows each frame two or more times if a whole multiple fits into the window; otherwise the display falls back to fixed-rate behavior.'],
    ['Does frame generation lower the frame time I feel?', 'It shortens the time between images on screen, but the game still reads input once per rendered frame. At 60 rendered fps with 2× generation the screen updates every 8.33 ms and the game every 16.67 ms.']
  ],
  sources: [SRC.fsrsc, SRC.xessfg, SRC.freesync, SRC.dlssg],
  related: ['fps-frame-time-1-percent-lows', 'frame-cap-vsync-latency-pc', 'settings-test-log']
};
