import { tbl, fig } from '../h.mjs';

const toolHtml = `<section class="tool" id="finder" aria-labelledby="fd-tool-h">
<div class="tool-head"><h2 id="fd-tool-h">Bottleneck Finder</h2><p class="tool-sub">One question at a time · about 1 minute</p></div>
<ol id="fd-trail" class="trail" aria-label="Your answers so far" hidden></ol>
<div id="fd-stage" class="results" aria-live="polite"></div>
<div class="row fd-controls"><button type="button" id="fd-back" class="ghost">Back</button><button type="button" id="fd-restart" class="ghost">Start over</button></div>
</section>`;

const symptoms = tbl('Symptoms and their most common causes', ['Symptom', 'Most likely cause', 'Quick test'], [
  ['Low FPS everywhere, GPU at 95–100%', 'GPU-bound', 'Lower render resolution a lot: FPS rises clearly'],
  ['Low FPS, GPU clearly below full use', 'CPU-bound or a frame limiter', 'Lower resolution: FPS barely changes; check caps and V-Sync'],
  ['FPS drops only in cities and big fights', 'CPU work for crowds, physics and draw calls', 'Lower crowd density / view distance in that spot'],
  ['Stutter the first time an effect appears', 'Shader compilation', 'Repeat the same path: stutter is much smaller the second time'],
  ['Stutter when moving fast, blurry textures', 'VRAM full or asset streaming', 'Lower texture quality one step and restart the game'],
  ['Smooth FPS but delayed controls', 'Frame generation, V-Sync or a full render queue', 'Turn frame generation off, or cap FPS below refresh'],
  ['Handheld battery drains, FPS swings', 'Power budget shared by CPU and GPU', 'Set a frame cap the device can hold']
]);

const graph = fig('fd-fig', 'Two overlay readings: when lowering resolution, frame rate rises a lot if GPU-bound and barely moves if CPU-bound',
`<rect class="g-bg" width="640" height="260"/>
<text class="g-tm" x="20" y="28">FRAME RATE BEFORE → AFTER LOWERING RENDER RESOLUTION (illustration, not a measurement)</text>
<rect class="g-panel" x="20" y="44" width="290" height="196" rx="8"/><rect class="g-panel" x="330" y="44" width="290" height="196" rx="8"/>
<text class="g-tb" x="36" y="72">GPU-bound</text><text class="g-tb" x="346" y="72">CPU-bound</text>
<rect x="60" y="150" width="60" height="70" fill="#7CC4FF"/><rect class="g-plus" x="170" y="96" width="60" height="124"/>
<text class="g-tm" x="60" y="140">before</text><text class="g-tm" x="170" y="88">after: much higher</text>
<rect x="370" y="150" width="60" height="70" fill="#7CC4FF"/><rect class="g-minus" x="480" y="144" width="60" height="76"/>
<text class="g-tm" x="370" y="140">before</text><text class="g-tm" x="460" y="134">after: about the same</text>
<path class="g-grid" d="M40 220h250M350 220h250"/>`,
'The single most useful test: drop the render resolution sharply (or switch the upscaler to Performance) and watch the same spot. A big jump means the graphics card was the limit. Almost no change means something else – usually the CPU or a frame limiter – holds the frame rate down. The bars only illustrate the pattern.');

export default {
  slug: 'bottleneck-finder',
  short: 'Bottleneck Finder',
  title: 'Bottleneck Finder – why is my game slow or stuttering?',
  description: 'Answer a few questions about low FPS, stutter or input lag and get the likely cause – GPU, CPU, VRAM, shaders or a limiter – with steps and the right guide.',
  kicker: 'Tool · diagnosis',
  h1: 'Bottleneck Finder: from symptom to cause in a minute',
  lede: 'Low frame rates, stutter and laggy controls feel similar but have different causes – and the wrong fix wastes time or image quality. Answer one question at a time about what you see; the finder leads to the most likely cause, the next steps and the guide that explains it in depth.',
  scripts: ['guide-titles.js', 'finder-core.js', 'finder.js'],
  toolHtml,
  sections: [
    `<h2 id="how">How the finder decides</h2>
<p>The finder is a decision tree with ten questions and seventeen possible results. It starts with the symptom you notice most, then asks for one simple observation at a time – usually something you can check in under a minute, such as whether the frame rate rises when you lower the resolution. You can go back one step or start over at any time; the trail above the question shows your answers so far.</p>
<p>Every result names the likely cause, explains it in one sentence and lists what to do now, in order. When a result points to a GPU, CPU or VRAM limit, the finder also preselects that bottleneck in the <a href="/tools/settings-translator/">Settings Translator</a>, so the lower-first list is ready when you open it. Nothing is sent anywhere; only that one preselection is stored in your browser.</p>`,
    `<h2 id="symptoms">Symptoms and their usual causes</h2>
<p>The table summarizes the paths through the tree. It is useful on its own if you already know the symptom well.</p>
${symptoms}
<p>Two symptoms are often confused. <b>Low FPS</b> means the average frame rate is too low, and the game feels sluggish all the time. <b>Stutter</b> means individual frames take much longer than the rest – the average can look fine while motion jerks. Low FPS is about throughput, stutter about consistency; they have different causes, and the finder separates them in its very first question. If you want to see the difference in numbers, read <a href="/guides/fps-frame-time-1-percent-lows/">FPS, frame time and 1% lows explained</a>.</p>`,
    `<h2 id="test">The one test you should know</h2>
${graph}
<p>On PC and handheld PCs, the finder relies on this resolution test because it needs no special tools. Use a demanding but repeatable spot, look at the frame-rate counter, then lower the render resolution a lot – for example from native to the upscaler’s Performance mode, or the render scale to 50%. Stand still or repeat the same short movement, because different views have different costs.</p>
<p>If you have a performance overlay, GPU usage confirms the answer. A GPU near full load while the frame rate is low points to the graphics card. A GPU clearly below full load – the finder uses “under about 85%” as a rough line – points to the CPU, a frame cap or V-Sync. The threshold is a rule of thumb, not a precise value: some games never show 100% even when GPU-bound, and short spikes are normal.</p>`,
    `<h2 id="limits">What the finder cannot see</h2>
<p>The finder knows only your answers. It cannot read your hardware, so a few situations need extra care. Laptops and handhelds throttle when hot or on battery, which looks like a GPU limit with lower clocks. Background software – downloads, recording, browser tabs with video – can cause stutter that looks like a game problem. And some problems are simply bugs in a specific update; the <a href="/tools/patch-decoder/">Patch Decoder</a> helps you find “known issue” lines in the patch notes you paste.</p>
<p>On consoles, the finder points you to mode choices and display settings rather than single graphics options, because that is what PS5, Xbox and Switch 2 games expose. The console guides – <a href="/guides/ps5-performance-vs-fidelity-mode/">PS5 modes</a>, <a href="/guides/xbox-series-s-vs-x-modes/">Xbox Series S vs X</a> and <a href="/guides/vrr-120hz-console-setup/">VRR and 120 Hz</a> – explain what each mode trades.</p>`,
    `<h2 id="after">After you have a result</h2>
<p>Change one thing at a time and test the same scene again. If the result was “GPU-bound”, start with the upscaler mode; if it was “CPU-bound”, start with view distance or crowds. A change that does not help should be reverted before you try the next one, otherwise you lose image quality without knowing why. The <a href="/guides/how-to-test-a-settings-change/">testing guide</a> explains a routine that takes about ten minutes and gives you numbers you can compare later – for example after the next patch.</p>`
  ],
  faq: [
    ['Do I need a performance overlay?', 'Not for most paths. The resolution test works with any frame-rate counter. GPU usage from an overlay helps to separate a CPU limit from a frame cap, and the finder tells you when you need it.'],
    ['Why does lowering resolution not help my FPS?', 'Then the graphics card was not the limit. The CPU, a frame cap, V-Sync or a power limit holds the frame rate down; the finder asks which one in the next steps.'],
    ['Is stutter after an update a hardware problem?', 'Usually not. Game and driver updates often invalidate the shader cache, so the game compiles shaders again on first use. It typically fades as you play through the same areas.'],
    ['Does the finder work for consoles?', 'Yes, but it leads to mode and display choices, because consoles do not expose single graphics options in most games.'],
    ['What is stored when I use the finder?', 'Only the bottleneck it found, in your browser’s local storage, so the Settings Translator can preselect it. Your answers are not saved or sent.']
  ],
  sources: [
    ['PresentMon (frame-time capture tool)', 'https://github.com/GameTechDev/PresentMon', 'open-source tool for recording frame times on Windows'],
    ['Steam Deck performance overlay', null, 'Quick Access menu → Performance; described in Steam Deck help on help.steampowered.com'],
    ['GPU vendor overlays', null, 'the NVIDIA App and AMD Software: Adrenalin Edition include frame-rate and usage overlays; Intel’s graphics software offers similar monitoring']
  ],
  related: ['cpu-or-gpu-bottleneck', 'shader-compilation-stutter-after-update', 'vram-full-what-to-lower']
};
