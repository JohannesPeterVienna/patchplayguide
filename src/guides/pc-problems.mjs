import { tbl, fig } from '../h.mjs';

export const shaderStutter = {
  slug: 'shader-compilation-stutter-after-update',
  group: 'pc',
  kicker: 'Guide · stutter',
  short: 'Shader stutter after an update',
  title: 'Shader compilation stutter after an update: what to do',
  description: 'Why games stutter after a game or driver update, how shader caches work, what helps (precompilation, patience, storage) and what does not, on PC and Steam Deck.',
  h1: 'Shader compilation stutter after an update: what to do',
  lede: 'The game ran smoothly yesterday. After an update it hitches every time you turn a corner or an explosion goes off – and then, a few minutes later, it is fine again. That pattern almost always means shader compilation: the game is building the small GPU programs it needs for your specific graphics card and driver, and an update threw away the old ones.',
  sections: [
    `<h2 id="what">What shaders are, and why they are compiled on your PC</h2>
<p>Shaders are the small programs that run on the graphics card to calculate the color of surfaces, light, shadows and effects. A large game uses thousands of combinations of them. With modern graphics interfaces such as DirectX 12 and Vulkan, shaders are combined with GPU state into so-called pipeline state objects, and these have to be compiled into machine code for your exact graphics card and driver version.</p>
<p>Consoles have one fixed hardware configuration, so developers can ship the compiled shaders with the game. PCs come in countless combinations of graphics cards and drivers, so compilation usually happens on your machine – either up front in a “compiling shaders” step, or on the fly the first time a material or effect appears on screen. When it happens on the fly, the frame has to wait for the compiler, and you see a hitch.</p>`,
    `<h2 id="cache">Why updates bring the stutter back</h2>
<p>Compiled shaders are stored in a cache on your drive so that they can be reused next time. That cache is tied to the game’s shader code and to the graphics driver. When either changes, old entries no longer match:</p>
${tbl('What usually invalidates the shader cache', ['Event', 'Effect on the cache', 'What you notice'], [
  ['Game update that changes shaders or materials', 'Affected shaders must be compiled again', 'Stutter in areas and effects you had already seen'],
  ['Graphics driver update', 'Driver cache usually rebuilt', 'Stutter in every game for the first sessions'],
  ['Changing graphics settings or upscaler', 'New shader variants may be needed', 'Short stutter after the change'],
  ['Moving to a new GPU', 'Cache rebuilt completely', 'Stutter everywhere at first'],
  ['Clearing the cache manually', 'Everything compiled again', 'Stutter returns until rebuilt']
])}
<p>This is why a patch can seem to make a game “run worse” for an evening, and then the problem disappears. Judging performance in the first minutes after an update – or after a driver update – mostly measures the compiler, not the game.</p>`,
    `<h2 id="recognize">How to recognize shader stutter</h2>
${fig('sh-fig', 'Frame-time graph: spikes when new effects first appear in the first run, almost flat on the second run through the same area',
`<rect class="g-bg" width="640" height="240"/>
<text class="g-tm" x="20" y="28">FRAME TIME (ms) – ILLUSTRATION</text>
<text class="g-tm" x="20" y="58">first run</text><text class="g-tm" x="20" y="168">second run</text>
<path class="g-grid" d="M100 110h520M100 210h520"/>
<path class="g-minus-s" d="M100 100 L160 100 L165 50 L170 100 L260 100 L264 40 L268 100 L340 100 L344 62 L348 100 L450 100 L454 56 L458 100 L620 100"/>
<path class="g-plus-s" d="M100 200 L300 200 L304 186 L308 200 L620 200"/>
<text class="g-tm" x="168" y="46">new effect</text><text class="g-tm" x="270" y="36">new area</text>`,
'Typical pattern: sharp spikes the first time something appears, much smaller ones the second time. Stutter that repeats in the same places every run has a different cause.', '0 0 640 240')}
<ul class="do">
<li>It happens the <b>first time</b> you see an area, an enemy type or an effect – and much less the second time.</li>
<li>It started right after a game or driver update, or after changing settings.</li>
<li>The average frame rate is fine; individual frames take much longer (the frame-time graph shows spikes).</li>
<li>It gets better over a session, and better again in the next one.</li>
</ul>
<p>Stutter that returns in the same places on every run is more likely asset streaming, full video memory or a CPU spike – the <a href="/tools/bottleneck-finder/">Bottleneck Finder</a> separates these cases.</p>`,
    `<h2 id="fix">What helps</h2>
<ul class="do">
<li><b>Let precompilation finish.</b> If the game shows a “compiling shaders” step or progress bar in the menu, wait for it. Skipping it moves the work into gameplay.</li>
<li><b>Give it time.</b> Play calmly through the first areas after an update before judging performance. Re-test afterwards with the <a href="/guides/how-to-test-a-settings-change/#after-update">10-minute routine</a>.</li>
<li><b>Keep the game on an SSD.</b> Cache reads and asset loading are slower on hard drives, which makes hitches worse.</li>
<li><b>On Steam and Steam Deck,</b> leave Shader Pre-Caching enabled in the Steam settings; for supported games, Steam can download precompiled shader data for your configuration.</li>
<li><b>Avoid driver updates right before an important session</b> – install them when you have time for the cache to rebuild.</li>
<li><b>Check the driver’s shader cache size setting</b> if your driver offers one; a cache that is too small can evict entries and compile them again.</li>
</ul>`,
    `<h2 id="dont">What does not help</h2>
<p>Lowering graphics settings rarely removes shader stutter – the compiler still has to build the shaders that are needed, and different settings can even require new variants. Clearing the shader cache “to fix stutter” usually makes things worse for a while, because everything has to be compiled again; do it only when a specific guide for a specific problem (for example a corrupted cache after a crash) recommends it.</p>
<p>A faster processor does shorten each compile, because compilation is CPU work, but it does not remove the pattern. The real fix is on the developer side: precompiling all needed shaders during loading. Many updates mention exactly this. The <a href="/tools/patch-decoder/">Patch Decoder</a> puts such lines in the “Shaders &amp; loading” category, and a tilde (~) on “shaders are rebuilt” is your cue to expect a stuttery first session.</p>`,
    `<h2 id="consoles">Consoles and handhelds</h2>
<p>On PS5, Xbox and Switch 2, shaders are typically compiled for the fixed hardware and shipped with the game, so post-update shader stutter is much less common than on PC. On the Steam Deck the situation is in between: it is one hardware configuration, which is what makes downloadable precompiled shader data from Steam effective there. Windows handheld PCs behave like any other PC.</p>`
  ],
  faq: [
    ['Why does my game stutter after an update and then get better?', 'The update or a new driver invalidated the shader cache. The game compiles shaders again the first time each effect appears; once they are cached, the stutter fades.'],
    ['Should I delete the shader cache to fix stutter?', 'Usually not. Deleting it forces everything to be compiled again. Only clear it when a fix for a specific problem, such as a corrupted cache, tells you to.'],
    ['Do graphics settings affect shader stutter?', 'Only a little. Lower settings do not remove compilation, and changing settings can even require new shader variants.'],
    ['Does an SSD fix shader stutter?', 'It does not stop compilation, but it speeds up cache and asset loading, so hitches are shorter. Modern games generally expect an SSD.']
  ],
  sources: [
    ['Vulkan', 'https://www.vulkan.org/', 'graphics API background, including pipeline caches'],
    ['Microsoft DirectX 12 documentation on pipeline state objects', null, 'Microsoft Learn, Direct3D 12 programming guide'],
    ['Steam Support', 'https://help.steampowered.com/', 'Shader Pre-Caching setting in the Steam client'],
    ['GPU driver documentation', null, 'NVIDIA Control Panel “Shader Cache Size”; AMD Software: Adrenalin Edition shader cache options']
  ],
  related: ['how-to-test-a-settings-change', 'fps-frame-time-1-percent-lows', 'how-to-read-patch-notes']
};

export const bottleneck = {
  slug: 'cpu-or-gpu-bottleneck',
  group: 'pc',
  kicker: 'Guide · diagnosis',
  short: 'CPU or GPU bottleneck?',
  title: 'CPU or GPU bottleneck? A 5-minute check',
  description: 'Find out whether your processor or graphics card limits your frame rate with one resolution test and an overlay, and which settings help in each case.',
  h1: 'CPU or GPU bottleneck? A 5-minute check',
  lede: 'Every system has a bottleneck – the part that is busiest while the others wait. Knowing which one it is decides which settings help. The good news: you do not need benchmarks or special knowledge. One resolution test and a glance at GPU usage answer the question for the game you are playing right now.',
  sections: [
    `<h2 id="idea">What a bottleneck is</h2>
<p>For each frame, the CPU prepares the work – game logic, physics, animation, the list of objects to draw – and the GPU draws it. The two work in parallel on consecutive frames, so the frame rate is set by whichever takes longer per frame. If the CPU needs 12 milliseconds and the GPU 14, the GPU is the bottleneck and the game runs at about 71 frames per second (1000 ÷ 14). Speeding up the CPU’s part changes nothing.</p>
<p>The bottleneck is not a property of your PC alone. It depends on the game, the scene, the settings and the resolution. The same PC can be GPU-bound in a forest at 4K and CPU-bound in a crowded city at 1080p. That is why the check below is done in the game and place where you have the problem.</p>`,
    `<h2 id="check">The 5-minute check</h2>
<ol>
<li><b>Pick a spot.</b> Go to a demanding place where the frame rate is low, and stand still or repeat the same short movement.</li>
<li><b>Note the frame rate.</b> Use the game’s counter or an overlay. Wait a few seconds for it to settle.</li>
<li><b>Lower the render resolution sharply.</b> Set the upscaler to Performance, or the render scale to about 50%. Do not change anything else.</li>
<li><b>Compare.</b> If the frame rate rises clearly – roughly by a quarter or more – the GPU was the limit. If it barely moves, something else limits you.</li>
<li><b>Confirm with GPU usage.</b> In an overlay, a GPU near 95–100% load points to a GPU limit. Clearly lower usage while the frame rate is low points to the CPU or a frame limiter.</li>
<li><b>Restore your settings.</b> The test was a diagnosis, not a recommendation.</li>
</ol>
${fig('bn-fig', 'Two scales: GPU-bound when GPU time per frame is larger, CPU-bound when CPU time per frame is larger',
`<rect class="g-bg" width="640" height="220"/>
<text class="g-tm" x="20" y="30">TIME PER FRAME – THE LONGER BAR SETS THE FRAME RATE</text>
<text class="g-t" x="20" y="72">CPU</text><rect x="70" y="56" width="240" height="22" fill="#47D98A"/><text class="g-tm" x="320" y="72">12 ms</text>
<text class="g-t" x="20" y="104">GPU</text><rect x="70" y="88" width="280" height="22" fill="#7CC4FF"/><text class="g-tm" x="360" y="104">14 ms → ≈ 71 fps, GPU-bound</text>
<path class="g-grid" d="M20 128h600"/>
<text class="g-t" x="20" y="164">CPU</text><rect x="70" y="148" width="240" height="22" fill="#47D98A"/><text class="g-tm" x="320" y="164">12 ms → ≈ 83 fps, CPU-bound</text>
<text class="g-t" x="20" y="196">GPU</text><rect x="70" y="180" width="140" height="22" fill="#7CC4FF"/><text class="g-tm" x="220" y="196">7 ms (after lowering resolution)</text>`,
'Worked example: with the CPU at 12 ms and the GPU at 14 ms, the GPU sets the pace at about 71 fps. Lowering the resolution shrinks the GPU’s time to 7 ms – but the frame rate does not double: the CPU, at 12 ms, becomes the limit at about 83 fps.', '0 0 640 220')}`,
    `<h2 id="gpu">If you are GPU-bound</h2>
<p>This is the easier case, because graphics settings work directly. In order of value:</p>
<ul class="do">
<li>Use an upscaler and step its mode down (Quality → Balanced) – see <a href="/guides/dlss-vs-fsr-vs-xess/">DLSS vs FSR vs XeSS</a>.</li>
<li>Lower ray tracing quality or turn off individual ray-traced effects.</li>
<li>Drop volumetric fog, shadows and ambient occlusion one step from maximum.</li>
<li>Keep textures high if your VRAM allows – they cost little GPU time.</li>
</ul>
<p>Being GPU-bound is normal and not a problem in itself; most games at high settings are. It only matters when the frame rate is lower than you want.</p>`,
    `<h2 id="cpu">If you are CPU-bound</h2>
<p>Resolution and most effects will not help, so you can keep image quality high. What helps is less work per frame for the processor:</p>
<ul class="do">
<li>Lower view distance or level of detail, crowd and traffic density, and physics or destruction detail.</li>
<li>Close background programs that use the CPU heavily: browsers with video, recording, downloads.</li>
<li>Check that the game runs from an SSD; streaming from a slow drive adds CPU waiting time.</li>
<li>Consider a frame cap a little below your average to make frame times more even.</li>
<li>Check patch notes: CPU-related optimizations (for example in crowded areas) are common in updates.</li>
</ul>
${tbl('Signs of each bottleneck', ['Observation', 'GPU-bound', 'CPU-bound'], [
  ['Lower render resolution', 'Frame rate rises clearly', 'Frame rate barely changes'],
  ['GPU usage in an overlay', 'Near 95–100%', 'Clearly below full load'],
  ['Where FPS drops', 'Heavy effects, ray tracing, high resolution', 'Cities, crowds, big battles, many players'],
  ['What helps', 'Upscaler mode, ray tracing, volumetrics, shadows', 'View distance, crowds, physics, background apps']
])}`,
    `<h2 id="other">When neither seems to be the limit</h2>
<p>If the GPU is not fully used and lowering resolution does nothing, check for a <b>frame limiter</b> first: an in-game cap, V-Sync, a driver limit, or a laptop or handheld power mode. These hold the frame rate down while both CPU and GPU have time to spare – nothing is “too slow”. Laptops on battery and hot systems can also throttle clocks. And if video memory is full, stutter and blurry textures appear regardless of CPU or GPU load, see <a href="/guides/vram-full-what-to-lower/">VRAM full</a>.</p>
<p>The <a href="/tools/bottleneck-finder/">Bottleneck Finder</a> walks through these cases one question at a time, and the <a href="/tools/settings-translator/">Settings Translator</a> sorts twenty options for the bottleneck you found.</p>`,
    `<h2 id="moves">Why the bottleneck moves within one game</h2>
<p>A game is not one workload. An empty desert at sunset with volumetric fog stresses the GPU; a market full of characters stresses the CPU; a cutscene with close-up faces may stress neither. That is why the check should be done where your problem is, and why one setting rarely fixes everything. Many players end up with a combination: an upscaler mode chosen for GPU-heavy areas and a lower crowd density for the busiest hub.</p>
<p>Patches can move the bottleneck too. An update that optimizes crowd simulation can turn a CPU-bound city into a GPU-bound one, and suddenly resolution matters there. After a big update, repeat the five-minute check in your problem area before changing settings – it takes less time than reading a long forum thread.</p>`
  ],
  faq: [
    ['Is a CPU bottleneck bad?', 'Not necessarily. Every system has a bottleneck. It only matters if the frame rate it allows is lower than you want.'],
    ['Why does my GPU never reach 100%?', 'Usually because the CPU or a frame limiter (cap, V-Sync, power mode) holds the frame rate down. Some games also report lower usage even when GPU-bound.'],
    ['Does a higher resolution reduce CPU bottlenecks?', 'It shifts more load to the GPU, so the GPU may become the limit, but the frame rate does not go up. It can, however, give you better image quality for free when you are CPU-bound.'],
    ['Which tools show GPU usage?', 'The overlays in GPU driver software, the Steam overlay performance monitor, the Steam Deck performance overlay and tools such as PresentMon.']
  ],
  sources: [
    ['PresentMon', 'https://github.com/GameTechDev/PresentMon', 'frame-time and GPU busy measurements on Windows'],
    ['Steam Support', 'https://help.steampowered.com/', 'Steam overlay performance monitor'],
    ['GPU vendor overlays', null, 'NVIDIA App and AMD Software: Adrenalin Edition']
  ],
  related: ['graphics-settings-explained', 'fps-frame-time-1-percent-lows', 'how-to-test-a-settings-change']
};

export const vram = {
  slug: 'vram-full-what-to-lower',
  group: 'pc',
  kicker: 'Guide · video memory',
  short: 'VRAM full: what to lower',
  title: 'VRAM full: which settings to lower first',
  description: 'How to tell when video memory is full, why it causes stutter and blurry textures, and the order in which to lower textures, ray tracing and frame generation.',
  h1: 'VRAM full: which settings to lower first',
  lede: 'When a game needs more video memory than the graphics card has, it does not simply run slower. It starts to swap data over the much slower connection to system memory, and you see blurry textures that load late, sudden stutter and sometimes crashes. The fix is usually one or two settings – the right ones.',
  sections: [
    `<h2 id="what">What lives in video memory</h2>
<p>Video memory (VRAM) sits directly on the graphics card and is very fast. It holds everything the GPU needs for the current scene: textures, geometry, the intermediate images used for lighting and effects, ray-tracing structures and, with frame generation, extra frame buffers. Higher render resolutions enlarge the intermediate images; ray tracing adds acceleration structures that describe the whole scene.</p>
<p>Games manage VRAM with a budget. When the budget is exceeded, the engine and driver push data out to system RAM. Reading it back over the PCI Express connection is far slower than reading local VRAM, so frames that need it are delayed. Some engines respond by loading lower-resolution textures instead, which keeps the frame rate but makes the image blurry.</p>`,
    `<h2 id="signs">How to tell that VRAM is full</h2>
<ul class="do">
<li>Textures stay blurry for seconds, or switch between sharp and blurry.</li>
<li>Stutter appears when turning quickly or entering new areas – and keeps returning, unlike <a href="/guides/shader-compilation-stutter-after-update/">shader stutter</a>.</li>
<li>Performance gets worse the longer you play, then recovers after a restart.</li>
<li>An overlay shows memory use close to the card’s total.</li>
<li>The game’s own settings menu shows a VRAM budget bar near or over its limit.</li>
</ul>
<p>Note that overlays show <i>allocated</i> memory, and many games allocate generously when memory is free. A high number alone does not prove a problem; high usage <i>plus</i> the symptoms above does.</p>`,
    `<h2 id="order">What to lower, in order</h2>
${tbl('Settings ordered by typical VRAM relief', ['Order', 'Setting', 'Why it helps', 'Visible cost'], [
  ['1', 'Texture quality (one step)', 'Largest single block of memory in most games', 'Usually small at one step; obvious at the lowest setting'],
  ['2', 'Ray tracing quality or individual RT effects', 'Removes acceleration structures and extra buffers', 'Lighting and reflections less accurate'],
  ['3', 'Frame generation', 'Frees the extra frame buffers it needs', 'Less smooth motion'],
  ['4', 'Render resolution (via upscaler mode)', 'Smaller intermediate images', 'Slightly softer image'],
  ['5', 'Shadow resolution', 'Smaller shadow maps', 'Softer or blockier shadows'],
  ['–', 'Anisotropic filtering, post-processing', 'Little memory involved', 'Keep them']
], 'Order is general guidance for current PC games; the game’s own VRAM bar, if it has one, shows the real effect of each option.')}
<p>After each change, <b>restart the game</b> if it says a restart is required – some games only release memory then – and test in the same scene for a few minutes. Lower one step at a time; the lowest texture setting is rarely needed.</p>`,
    `<h2 id="budget">How much VRAM do games need?</h2>
${fig('vr-fig', 'Stacked bar illustrating how textures, render targets, ray tracing data and frame generation buffers add up against a VRAM limit',
`<rect class="g-bg" width="640" height="210"/>
<text class="g-tm" x="20" y="30">ILLUSTRATIVE VRAM BUDGET – proportions vary by game</text>
<rect x="40" y="70" width="230" height="44" fill="#7CC4FF"/><text class="g-tk" x="50" y="97">textures</text>
<rect x="270" y="70" width="110" height="44" fill="#47D98A"/><text class="g-tk" x="280" y="97">buffers</text>
<rect x="380" y="70" width="100" height="44" fill="#FFC531"/><text class="g-tk" x="390" y="97">ray tracing</text>
<rect x="480" y="70" width="80" height="44" fill="#FF6B7F"/><text class="g-tk" x="486" y="97">frame gen</text>
<path class="g-acc-s" d="M500 52v84"/><text class="g-t" x="430" y="160">card limit</text>
<text class="g-tm" x="40" y="190">Everything right of the limit spills into slower system memory → stutter or blurry textures.</text>`,
'The order of the table follows this picture: textures are usually the biggest block, while ray tracing and frame generation add memory on top. The proportions are illustrative.', '0 0 640 210')}
<p>Requirements rose quickly with recent games, especially at high texture settings with ray tracing. Cards with 8 GB of VRAM are more often the limit in new releases at high texture settings than cards with 12 GB or more – but the answer depends entirely on the game, the resolution and the settings. The reliable sources are the game’s official system requirements and its own VRAM indicator, not general rules.</p>
<p>If you save your graphics card’s memory size under <a href="/#my-setup">My setup</a>, the <a href="/tools/settings-translator/">Settings Translator</a> reminds you to watch the VRAM column.</p>`,
    `<h2 id="patches">VRAM and game updates</h2>
<p>Patches often touch memory: new high-resolution texture packs, optimized streaming, or – as in our fictional example in the <a href="/tools/patch-decoder/">Patch Decoder</a> – a removed low texture option. After such an update, check your texture setting first, because a removed option can silently move you to a higher one. Then re-test with the <a href="/guides/how-to-test-a-settings-change/#after-update">10-minute routine</a>.</p>`,
    `<h2 id="more">Other things that free memory</h2>
<p>Close programs that use the GPU in the background, such as browsers with hardware-accelerated video or several monitors running video. Lowering the display resolution of a second monitor also saves a little memory. On laptops with both integrated and dedicated graphics, make sure the game runs on the dedicated GPU.</p>`,
    `<h2 id="test">A quick VRAM check routine</h2>
<p>Because memory problems build up over time, a short benchmark often misses them. A better check takes about ten minutes:</p>
<ol>
<li>Start the game fresh and play for five minutes through varied areas, including fast travel or a quick turn through a detailed scene.</li>
<li>Watch the overlay’s memory value and the frame-time graph. Note whether spikes increase over time.</li>
<li>Lower texture quality one step, restart the game and repeat the same five minutes.</li>
<li>If the spikes and blurry textures are gone, you have found the cause. If not, the problem is more likely elsewhere – <a href="/guides/shader-compilation-stutter-after-update/">shader compilation</a> or a CPU limit.</li>
</ol>
<p>Resolution also matters: running at 4K or with a high upscaler mode enlarges every intermediate image, so the same texture setting that fits at 1440p may overflow at 4K. When you move to a higher-resolution display, re-check your texture setting first.</p>`
  ],
  faq: [
    ['What happens when VRAM is full?', 'Data is moved to system memory, which the GPU reaches much more slowly. You see stutter, late-loading or blurry textures, and sometimes crashes.'],
    ['Which setting uses the most VRAM?', 'In most games, texture quality. Ray tracing, frame generation and high render resolutions add significant amounts on top.'],
    ['Does lowering resolution save VRAM?', 'Some – the intermediate images get smaller – but usually less than lowering textures one step.'],
    ['Is high VRAM usage in an overlay always a problem?', 'No. Many games allocate more memory than they strictly need when it is free. It is a problem when high usage comes with stutter or blurry textures.']
  ],
  sources: [
    ['Official system requirements of each game', null, 'store pages and publisher websites'],
    ['PCGamingWiki', 'https://www.pcgamingwiki.com/', 'notes on memory-related issues per game'],
    ['NVIDIA DLSS technology overview', 'https://www.nvidia.com/en-us/geforce/technologies/dlss/', 'frame generation background']
  ],
  related: ['graphics-settings-explained', 'ray-tracing-settings-explained', 'frame-generation-explained']
};

// ---------------------------------------------------------------------------------------------------
// Revision of November 18, 2026: worked examples and vendor-documented numbers (sources in each guide).
// ---------------------------------------------------------------------------------------------------
import { tryBox, SRC, addAfter, swap, revise } from '../h.mjs';
const mb = (bytes) => (bytes / 1e6).toFixed(bytes < 1e8 ? 1 : 0);

// --- shader compilation stutter ---
addAfter(shaderStutter, 'recognize', `<h2 id="two-runs">The two-pass test: tell shader stutter from the other kinds</h2>
<p>Shader stutter has one property no other stutter shares: it happens once per effect and then stops, because the compiled result is cached. That makes it testable. Walk the same short route twice in a row after an update, without restarting the game in between, and compare where the hitches fall.</p>
${tbl('Reading the two passes', ['What you see', 'Most likely cause', 'What to do'], [
  ['Hitches in pass 1, clearly fewer or none in pass 2', 'Shader compilation: the first pass filled the cache', 'Nothing – keep playing; judge performance from pass 2 on'],
  ['Hitches at the same spots in both passes', 'Asset streaming or loading at fixed points in the level', 'Check the storage drive and background downloads; lower view distance one step'],
  ['Hitches grow during a session and textures turn blurry', 'Video memory is full', 'Lower texture quality one step and restart the game'],
  ['Hitches at random places in both passes', 'Background tasks or uneven frame pacing', 'Close overlays and recorders one at a time; try a frame cap'],
  ['Hitches return after every restart of the game', 'The cache is not kept, or it is rebuilt every time', 'Check free space on the drive and whether the driver’s shader cache is enabled']
])}
<p>If you record the passes with a capture tool, the 1% low is the number that shows the pattern: it is dragged down by the long frames of pass 1 and recovers in pass 2, while the average barely moves. PresentMon, an open-source capture tool from Intel that several overlays use, writes the time between two frames as <code>MsBetweenPresents</code> – a compilation hitch is a single very large value in that column. Note the 1% low of two or three first passes and of the repeat passes and compare them.</p>
${tryBox('Enter the first passes as setup A and the repeat passes as setup B; the log shows whether the 1% lows really separate.', '/tools/settings-test-log/', 'Open the Settings Test Log')}`);
revise(shaderStutter, '2026-11-18', 'Two-pass test with a decision table added; link to the Settings Test Log.', [SRC.pm]);
// 2026-11-24: NVIDIA Auto Shader Compilation (NVIDIA app, beta since March 31, 2026), from NVIDIA's announcement read in full
addAfter(shaderStutter, 'fix', `<h2 id="asc">New in 2026: NVIDIA Auto Shader Compilation</h2>
<p>Since March 31, 2026 the NVIDIA app offers a beta feature aimed at the driver-update half of the problem. NVIDIA describes <b>Auto Shader Compilation</b> as rebuilding DirectX 12 shaders while the system is idle, “reducing the frequency of game runtime compilation after driver updates”. It is off by default; you switch it on in the NVIDIA app under Graphics → Global Settings → Shader Cache, where “Compile Now” (behind the three dots) starts the rebuild immediately instead of waiting for idle time. NVIDIA names GeForce Game Ready Driver 595.97 WHQL or newer as a requirement.</p>
${tbl('What Auto Shader Compilation covers, according to NVIDIA', ['Situation', 'Covered?', 'NVIDIA’s wording or the consequence'], [
  ['Shaders of a game you have played, after a driver update', 'Yes', 'Rebuilt while the system is idle, or on demand with “Compile Now”'],
  ['A game downloaded for the first time', 'No', '“You must still generate shaders in-game”'],
  ['A game update that changes its shaders', 'Not described', 'NVIDIA describes the feature for driver updates only'],
  ['DirectX 11 or Vulkan games', 'Not described', 'NVIDIA names DirectX 12 shaders'],
  ['AMD or Intel graphics, consoles', 'No', 'A feature of the NVIDIA app']
])}
<p>So the feature shortens the stuttery first session after a <i>driver</i> update; after a <i>game</i> update, the advice above still applies. Because it is a beta, check NVIDIA’s release notes for changes before relying on it.</p>`);
revise(shaderStutter, '2026-11-24', 'Section added on NVIDIA Auto Shader Compilation (NVIDIA app beta since March 31, 2026): what it covers and what not, from NVIDIA’s announcement.', [SRC.nvasc]);

// --- CPU or GPU bottleneck ---
addAfter(bottleneck, 'check', `<h2 id="numbers">Worked example: reading the check in numbers</h2>
<p>The check works because of how many pixels disappear. Performance mode has a documented factor of 2.0 per axis with DLSS and FSR, so it renders a quarter of the output pixels. If the graphics card is the limit, removing three quarters of its pixel work must show up clearly. If it does not, something else sets the pace.</p>
${tbl('Interpreting the frame rate before and after the switch to Performance mode (rule of thumb)', ['Change in frame rate', 'Reading', 'Next step'], [
  ['Rises by a quarter or more', 'The GPU was the limit', 'Step the upscaler down one mode, then lower GPU-heavy effects'],
  ['Rises a little, clearly less than a quarter', 'Mixed: the GPU was the limit at first, then the CPU took over', 'One upscaler step is enough; after that, look at CPU options'],
  ['Stays within a few percent – the normal spread between two identical runs', 'Not the GPU: CPU or a limiter', 'Check caps and V-Sync, then view distance and crowd density']
], 'The thresholds are a rule of thumb, not a standard. To know your own run-to-run spread, measure the same setting twice.')}
<p>A simple model shows why gains stop. Suppose the CPU needs 12 ms to prepare a frame and the GPU 14 ms to draw it. The slower side sets the pace: 1000 ÷ 14 = 71 fps. Halve the GPU’s work to 7 ms and you might expect 143 fps – but the CPU still needs 12 ms, so the result is 1000 ÷ 12 = 83 fps. The first settings change gave 12 fps; any further GPU setting gives nothing, because the bottleneck has moved. Real games are less tidy than two numbers, yet the pattern holds: <b>a setting only pays until the other side becomes the limit.</b></p>
<p>Capture tools can show the two sides directly. PresentMon reports per frame how long the GPU was actively working (<code>MsGPUBusy</code>) and how long it sat idle (<code>MsGPUWait</code>), next to the frame time (<code>MsBetweenPresents</code>). A GPU that is busy for nearly the whole frame time is the limit; a GPU that waits for a large part of each frame is being held back by the CPU or a cap.</p>
${tryBox('The Bottleneck Finder asks for exactly this test and continues from your answer – including the cases where neither side is the limit.', '/tools/bottleneck-finder/?path=0-0', 'Start the finder at the resolution test')}`);
revise(bottleneck, '2026-11-18', 'Worked example added: interpretation table for the resolution test, a two-number model of a moving bottleneck, and the PresentMon columns that show GPU busy and wait time.', [SRC.pm, SRC.dlss, SRC.fsr]);

// --- VRAM full ---
const PX = { '1080p': 1920 * 1080, '1440p': 2560 * 1440, '4K': 3840 * 2160 };
const T4 = 4096 * 4096, mips = 4 / 3;
addAfter(vram, 'budget', `<h2 id="arithmetic">VRAM arithmetic you can check yourself</h2>
<p>Memory use is not a mystery; most of it is multiplication. Two kinds of data fill video memory – images the size of the screen, and textures – and both follow simple formulas.</p>
<p><b>Screen-sized buffers.</b> A game keeps many full-screen images per frame: color, depth, motion vectors, lighting, history for the upscaler. Each one needs width × height × bytes per pixel.</p>
${tbl('One full-screen buffer at different resolutions (1 MB = 1 million bytes)', ['Resolution', 'Pixels', '4 bytes per pixel (8 bits × 4 channels)', '8 bytes per pixel (16-bit float × 4 channels)'],
  Object.entries(PX).map(([n, p]) => [n, (p / 1e6).toFixed(2) + ' million', mb(p * 4) + ' MB', mb(p * 8) + ' MB']))}
<p>A single buffer is small, but they add up: ten buffers of the 16-bit kind at 4K would be ${mb(PX['4K'] * 8 * 10)} MB, and this part scales with the number of pixels. Rendering internally at 1440p instead of 4K shrinks every such buffer to 44% of its size, which is why a lower upscaler mode relieves memory a little as well as GPU time.</p>
<p><b>Textures.</b> Games usually store textures block-compressed. Microsoft’s Direct3D documentation gives the sizes: the BC1 format uses 8 bytes per block of 4×4 pixels, BC3 and BC7 use 16 bytes. That is half a byte or one byte per pixel instead of four. A full chain of smaller copies (mip levels) adds one third on top.</p>
${tbl('One 4096×4096 texture in memory', ['Format', 'Bytes per pixel', 'Top level only', 'With all mip levels (+⅓)'], [
  ['Uncompressed, 8 bits × 4 channels', '4', mb(T4 * 4) + ' MB', mb(T4 * 4 * mips) + ' MB'],
  ['BC3 or BC7', '1', mb(T4) + ' MB', mb(T4 * mips) + ' MB'],
  ['BC1', '0.5', mb(T4 * 0.5) + ' MB', mb(T4 * 0.5 * mips) + ' MB']
], 'A 2048×2048 texture needs a quarter of these values – the arithmetic behind “one texture step down frees a lot”.')}
<p>Halving the texture resolution quarters the memory. A texture setting that drops the largest mip level of every texture therefore frees up to three quarters of the texture memory in one step, while the picture only loses its sharpest level. No other option has that ratio, which is why textures come first in the list above.</p>
<p><b>What upscaling and frame generation allocate.</b> The vendors publish these figures for developers:</p>
${tbl('Video memory allocated by the feature itself, by output resolution (vendor figures)', ['Feature', '1080p', '1440p', '4K', 'Source and conditions'], [
  ['DLSS Super Resolution, preset K (default for Quality, Balanced, DLAA)', '86 MB', '144 MB', '307 MB', 'NVIDIA DLSS Programming Guide'],
  ['DLSS Super Resolution, preset M (default for Performance)', '116 MB', '204 MB', '456 MB', 'NVIDIA, RTX 40/50 series'],
  ['FSR 3.1.6 upscaler, Quality', '75 MB', '134 MB', '292 MB', 'AMD, Radeon RX 9070 XT, DirectX 12'],
  ['FSR 3.1.6 upscaler, Performance', '61 MB', '101 MB', '226 MB', 'AMD, same conditions'],
  ['FSR Upscaling 4.1.2', '81 MB', 'not listed', '318 MB', 'AMD, Radeon RX 9070 XT'],
  ['DLSS Frame Generation', '272 MB', '489 MB', '725 MB', 'NVIDIA Streamline guide (estimate)'],
  ['FSR Frame Generation 3.1.6', '124 MB', '214 MB', '457 MB', 'AMD, DirectX 12'],
  ['FSR Frame Generation 4.0.2', '111 MB', '313 MB', '410 MB', 'AMD, Radeon RX 9070 XT, DirectX 12']
], 'Rounded from the vendors’ developer documentation; the vendors call them approximations. They are not measurements of ours and exclude everything the game itself allocates.')}
<p>Added up for a 4K output: DLSS Quality with the default preset (307 MB) plus DLSS Frame Generation (725 MB) comes to roughly 1 GB by NVIDIA’s own estimates – about an eighth of an 8 GB card before the game has loaded a single texture. At 1440p the same pair needs about 630 MB. If memory is the problem, switching frame generation off frees more than most single quality options.</p>
${tryBox('The Settings Translator sorts all options by their estimated load on video memory (an editorial estimate) and shows what to test lowering first.', '/tools/settings-translator/?b=vram', 'Open the Settings Translator for a VRAM limit')}`);
revise(vram, '2026-11-18', 'VRAM arithmetic added: size of screen buffers and block-compressed textures, and the memory NVIDIA and AMD document for upscaling and frame generation.', [SRC.dlss, SRC.dlssg, SRC.fsr, SRC.fsr4, SRC.fsrfg, SRC.fsrfg4, SRC.bc]);
revise(vram, '2026-11-24', 'Microsoft’s block-compression page read in full: the bytes per block (BC1 8, BC3 and BC7 16) are confirmed. The Settings Translator link now says that its levels are an editorial estimate.');
