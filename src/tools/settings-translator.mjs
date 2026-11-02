import { createRequire } from 'node:module';
import { tbl, fig } from '../h.mjs';
const require = createRequire(import.meta.url);
const T = require('../assets/js/translator-core.js');

const toolHtml = `<section class="tool" id="translator" aria-labelledby="tr-h">
<div class="tool-head"><h2 id="tr-h">Settings Translator</h2><p class="tool-sub">Typical, qualitative load · not benchmark numbers</p></div>
<p id="tr-setup" class="tool-setup"></p>
<fieldset class="bneck"><legend>My bottleneck is…</legend><div class="seg">
<label><input type="radio" name="tr-b" value="gpu"><span>GPU</span></label>
<label><input type="radio" name="tr-b" value="cpu"><span>CPU</span></label>
<label><input type="radio" name="tr-b" value="vram"><span>VRAM</span></label>
<label><input type="radio" name="tr-b" value="unsure" checked><span>Not sure</span></label>
</div></fieldset>
<label for="tr-q">Find an option (for example “shadow”, “DLSS”, “fog”)<input type="search" id="tr-q" autocomplete="off"></label>
<div id="tr-first" class="first" aria-live="polite"></div>
<p id="tr-summary" class="sum"></p>
<div id="tr-grid" class="matrix results"></div>
</section>`;

const lists = tbl('Lower-first lists generated from the matrix', ['Bottleneck', 'Lower first, in this order', 'Leave alone (little relief for this bottleneck)'],
  ['gpu', 'cpu', 'vram'].map((b) => [
    b.toUpperCase(),
    T.lowerFirst(b, 5).map((o) => o.name).join(' → '),
    T.OPTIONS.filter((o) => !o.special && o[b] === 0).map((o) => o.name).slice(0, 4).join(', ') || '–'
  ]),
  'This table is built from the same data as the tool above, so the two can never disagree.');

const levels = tbl('What the load levels mean', ['Level', 'Meaning', 'Example'], [
  ['minimal', 'Usually no measurable relief when lowered on current hardware', 'Anisotropic filtering on GPU time'],
  ['low', 'Small relief; worth it only when you need the last few frames', 'Post-processing effects'],
  ['moderate', 'Clear relief in many games, especially at the top preset', 'Shadow quality, ambient occlusion'],
  ['high', 'One of the biggest levers for this resource', 'Render resolution on the GPU, crowd density on the CPU, textures on VRAM']
]);

const pipe = fig('tr-fig', 'A frame passes through the CPU, then the GPU, with video memory beside the GPU; each settings group loads one of these parts',
`<rect class="g-bg" width="640" height="260"/>
<rect class="g-panel" x="20" y="40" width="170" height="110" rx="8"/><text class="g-tb" x="36" y="68">CPU</text>
<text class="g-tm" x="36" y="92">game logic, AI, physics</text><text class="g-tm" x="36" y="110">draw calls, streaming</text><text class="g-tm" x="36" y="128">→ view distance, crowds</text>
<path class="g-acc-s" d="M192 95h44"/><path class="g-acc" d="M236 88l12 7-12 7z"/>
<rect class="g-panel" x="250" y="40" width="190" height="110" rx="8"/><text class="g-tb" x="266" y="68">GPU</text>
<text class="g-tm" x="266" y="92">pixels, lighting, effects</text><text class="g-tm" x="266" y="110">→ resolution, shadows,</text><text class="g-tm" x="266" y="128">  ray tracing, fog</text>
<path class="g-acc-s" d="M442 95h44"/><path class="g-acc" d="M486 88l12 7-12 7z"/>
<rect class="g-panel" x="500" y="40" width="120" height="110" rx="8"/><text class="g-tb" x="516" y="68">Display</text><text class="g-tm" x="516" y="92">refresh rate</text><text class="g-tm" x="516" y="110">V-Sync / VRR</text>
<rect class="g-panel" x="250" y="176" width="190" height="64" rx="8"/><text class="g-tb" x="266" y="202">VRAM</text><text class="g-tm" x="266" y="224">→ textures, RT, frame gen</text>
<path class="g-line" d="M345 150v26"/>
<text class="g-tm" x="20" y="200">The slowest stage sets</text><text class="g-tm" x="20" y="218">the frame rate.</text>`,
'Each frame is prepared by the CPU and drawn by the GPU, which keeps textures and buffers in its own memory. Lowering an option only helps if it relieves the stage that is actually slowest – that is why the same change gives a big gain on one PC and nothing on another.');

export default {
  slug: 'settings-translator',
  short: 'Settings Translator',
  title: 'Settings Translator – which graphics option to lower first',
  description: 'An interactive matrix of 20 common graphics options with their typical GPU, CPU and VRAM load. Pick your bottleneck to see which settings to lower first.',
  kicker: 'Tool · graphics settings',
  h1: 'Settings Translator: what each option costs, and what to lower first',
  lede: 'Graphics menus use different names for the same ideas, and rarely say what an option costs. The Settings Translator lists twenty common options with the typical load they put on the graphics card (GPU), the processor (CPU) and video memory (VRAM). Choose what limits your system and the options that usually help most with the least visible loss move to the top.',
  scripts: ['translator-core.js', 'translator.js'],
  toolHtml,
  sections: [
    `<h2 id="read">How to read the matrix</h2>
<p>Every card shows one option and three meters: <b>GPU</b>, <b>CPU</b> and <b>VRAM</b>. Each meter has four steps – minimal, low, moderate, high – and describes the <i>typical extra load of the higher setting</i> compared with a lower one in current PC games. “Visible loss” estimates how noticeable a one- or two-step reduction usually is: subtle, noticeable or obvious.</p>
${levels}
<p>These are deliberately qualitative, conservative ratings. They summarize long-standing, widely documented behavior – for example that render resolution is the strongest GPU lever and that texture quality mostly fills video memory – rather than measurements from one game on one PC. Real costs differ between engines, and one game’s “High” shadows can be another game’s “Ultra”. Use the matrix to decide <i>what to test first</i>, then confirm the effect in your own game with a short before-and-after test.</p>`,
    `<h2 id="first">How the lower-first list is chosen</h2>
<p>When you pick a bottleneck, every option gets a simple score: three times its load on that resource, minus its visible loss. Options that put a moderate or high load on the bottleneck and do not have an obvious visual cost are marked <b>Lower first</b>, up to five of them. Frame generation is excluded on purpose – it is not something you lower to gain performance, and it has its own <a href="/guides/frame-generation-explained/">guide</a>.</p>
${lists}
<p>The lists match common advice for a reason. On a <b>GPU-limited</b> system, fewer pixels (an upscaler mode) and cheaper lighting and fog buy the most frames. On a <b>CPU-limited</b> system, resolution changes do almost nothing; what helps is fewer objects and characters to prepare each frame – view distance, crowds, physics. When <b>VRAM</b> runs full, texture quality is the first lever, followed by memory-hungry ray tracing.</p>
<p>“Not sure” sorts by combined load and shows no lower-first list. If you do not know what limits you, the <a href="/tools/bottleneck-finder/">Bottleneck Finder</a> or the <a href="/guides/cpu-or-gpu-bottleneck/">5-minute bottleneck check</a> will tell you; the finder also preselects the right bottleneck here when it reaches a result.</p>`,
    `<h2 id="pipeline">Why the same change helps one PC and not another</h2>
${pipe}
<p>A frame is only as fast as its slowest stage. If the GPU needs 20 milliseconds per frame and the CPU 12, you are GPU-bound at about 50 frames per second; making the CPU’s work lighter changes nothing until the GPU gets faster. Lower the render resolution until the GPU needs 10 milliseconds and the CPU becomes the limit at about 83 frames per second – from then on, only CPU-side options help. This is why “best settings” lists that ignore your hardware are often wrong for you.</p>`,
    `<h2 id="numbers">Why there are no FPS numbers here</h2>
<p>Many sites publish tables like “shadows: −12% FPS”. Such numbers are only true for the game, scene, hardware, driver and resolution they were measured on, and they are often copied far beyond that. We publish no per-game measurements on this page because a percentage without its test conditions misleads more than it helps. The qualitative levels tell you what to test; your own before-and-after test tells you the number for your system, and <a href="/guides/how-to-test-a-settings-change/">our testing guide</a> shows how to make that number reliable.</p>`,
    `<h2 id="consoles">Consoles, Steam Deck and handheld PCs</h2>
<p>On PS5, Xbox and Switch 2 you usually choose a <b>mode</b> instead of single options. A performance mode lowers the render resolution and some effects to hold a higher frame rate; a quality or fidelity mode does the opposite. The matrix still explains the trade-off behind each mode – see <a href="/guides/ps5-performance-vs-fidelity-mode/">PS5 performance vs fidelity modes</a>.</p>
<p>Handheld PCs such as the Steam Deck share one small power budget between CPU and GPU. Render resolution, an upscaler mode and a frame cap matter more there than any single effect, as explained in <a href="/guides/steam-deck-frame-cap-tdp-battery/">Steam Deck: frame cap, TDP and battery basics</a>. If you save your platform under <a href="/#my-setup">My setup</a>, the translator shows a matching note above the matrix. Your choice stays in your browser.</p>`
  ],
  faq: [
    ['Are the load levels measured?', 'No. They are qualitative ratings of typical behavior in current PC games, chosen conservatively. They tell you which options are worth testing first, not how many frames you will gain.'],
    ['Why is texture quality not on the GPU lower-first list?', 'As long as textures fit into video memory, higher texture quality costs little GPU time. It becomes the first lever only when VRAM is full.'],
    ['Why is frame generation marked as a special case?', 'Frame generation increases the displayed frame rate, but input still follows the rendered frames and latency rises slightly. It is not an option you lower to relieve a bottleneck.'],
    ['What if my game uses different names?', 'The “also called” line under each option lists common alternatives, and the search field matches them. If an option is missing, look for the closest description of what it does.'],
    ['Is my bottleneck choice stored?', 'Only in your browser’s local storage, so the page remembers it next time. Nothing is sent to us.']
  ],
  sources: [
    ['NVIDIA DLSS technology overview', 'https://www.nvidia.com/en-us/geforce/technologies/dlss/', 'what the upscaler and frame generation do'],
    ['AMD GPUOpen', 'https://gpuopen.com/', 'documentation of FidelityFX techniques such as FSR and ambient occlusion'],
    ['PCGamingWiki', 'https://www.pcgamingwiki.com/', 'which settings individual PC games expose'],
    ['Game developers’ own PC settings descriptions', null, 'many games describe the cost of each option in the menu; trust those over general tables']
  ],
  related: ['graphics-settings-explained', 'cpu-or-gpu-bottleneck', 'vram-full-what-to-lower']
};
