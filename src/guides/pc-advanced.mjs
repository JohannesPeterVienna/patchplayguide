import { tbl, fig } from '../h.mjs';

export const rayTracing = {
  slug: 'ray-tracing-settings-explained',
  group: 'pc',
  kicker: 'Guide · ray tracing',
  short: 'Ray tracing settings explained',
  title: 'Ray tracing settings explained: what to keep, what to drop',
  description: 'What ray-traced reflections, shadows, global illumination and path tracing do, why they cost so much GPU time and VRAM, and which RT options to keep first.',
  h1: 'Ray tracing settings explained: what to keep, what to drop',
  lede: 'Ray tracing is not one setting but a family of them: reflections, shadows, ambient occlusion, global illumination and, at the top, full path tracing. Some change the look of a scene completely; others are hard to spot. Since ray tracing is among the most expensive things a game can do, knowing which effect is worth its cost makes a large difference.',
  sections: [
    `<h2 id="how">How ray tracing differs from traditional rendering</h2>
<p>Traditional rendering (rasterization) projects triangles onto the screen and uses clever approximations for light: shadow maps for shadows, screen-space techniques for reflections and ambient occlusion, and pre-calculated or probe-based lighting for indirect light. These approximations are fast, but they break in typical places – reflections disappear when the reflected object leaves the screen, and indirect light does not react to changes in the scene.</p>
<p>Ray tracing follows rays of light through a 3D description of the scene. To do that quickly, the GPU needs an acceleration structure (often a bounding volume hierarchy) that has to be built and updated as things move – work that costs GPU time, VRAM and also some CPU time. Each ray then has to be tested against that structure, and the noisy result has to be cleaned up by a denoiser. Graphics cards with dedicated ray-tracing hardware do this much faster than those without.</p>`,
    `<h2 id="effects">The ray-traced effects, one by one</h2>
${tbl('Ray-traced effects: what they change and what they cost (qualitative)', ['Effect', 'What it improves', 'Typical cost', 'Visibility'], [
  ['Reflections', 'Accurate reflections of off-screen objects in water, glass, polished floors', 'High', 'High in cities and wet scenes; low elsewhere'],
  ['Shadows', 'Soft, physically correct shadows, contact shadows', 'Moderate', 'Often subtle compared with good shadow maps'],
  ['Ambient occlusion', 'Better contact darkening in corners and under objects', 'Moderate', 'Subtle to noticeable'],
  ['Global illumination', 'Light bouncing between surfaces; scenes look grounded and consistent', 'High', 'Can change the whole look'],
  ['Path tracing', 'All lighting by ray tracing, with many bounces', 'Very high', 'The most realistic; needs upscaling and often frame generation']
], 'Costs are general tendencies across current games, not measurements. Individual implementations vary widely.')}
<p>A good rule: <b>global illumination and reflections</b> are the effects most likely to change how a game looks; <b>ray-traced shadows</b> are often the hardest to tell apart from good traditional shadows. If you want ray tracing but need performance, drop RT shadows first and keep GI or reflections – depending on the game.</p>`,
    `<h2 id="cost">Why it costs so much – and what helps</h2>
${fig('rt-fig', 'Ray tracing pipeline: build acceleration structure, trace rays, denoise, then upscale',
`<rect class="g-bg" width="640" height="200"/>
<rect class="g-panel" x="20" y="60" width="130" height="80" rx="8"/><text class="g-tb" x="34" y="92">1 Build</text><text class="g-tm" x="34" y="116">BVH · CPU+GPU</text><text class="g-tm" x="34" y="132">VRAM</text>
<path class="g-acc-s" d="M152 100h26"/>
<rect class="g-panel" x="180" y="60" width="130" height="80" rx="8"/><text class="g-tb" x="194" y="92">2 Trace</text><text class="g-tm" x="194" y="116">rays per pixel</text><text class="g-tm" x="194" y="132">GPU (RT cores)</text>
<path class="g-acc-s" d="M312 100h26"/>
<rect class="g-panel" x="340" y="60" width="130" height="80" rx="8"/><text class="g-tb" x="354" y="92">3 Denoise</text><text class="g-tm" x="354" y="116">clean up noise</text><text class="g-tm" x="354" y="132">GPU</text>
<path class="g-acc-s" d="M472 100h26"/>
<rect class="g-panel" x="500" y="60" width="120" height="80" rx="8"/><text class="g-tb" x="514" y="92">4 Upscale</text><text class="g-tm" x="514" y="116">DLSS/FSR/XeSS</text><text class="g-tm" x="514" y="132">GPU</text>
<text class="g-tm" x="20" y="40">EACH STEP COSTS TIME – FEWER PIXELS MEAN FEWER RAYS</text>
<text class="g-tm" x="20" y="176">“RT quality” settings usually change rays per pixel, bounces and denoiser quality.</text>`,
'The four stages of a typical ray-traced frame. Upscaling helps twice: fewer pixels need fewer rays, and some upscalers also take over denoising.', '0 0 640 200')}
<p>The number of rays scales with the number of pixels, which is why ray tracing and upscaling go together: at the Quality mode of an upscaler, the game traces rays for less than half the pixels. Some upscalers replace the game’s denoiser with a trained model (NVIDIA calls this Ray Reconstruction), which can improve the stability of ray-traced effects.</p>
<p>Ray tracing quality presets usually change rays per pixel, the number of light bounces, the distance up to which ray-traced effects are used and the denoiser quality. One step down from the maximum is often hard to see and saves a lot.</p>`,
    `<h2 id="vram">Ray tracing and video memory</h2>
<p>Acceleration structures and extra buffers need memory, often a significant amount on top of textures. On cards with limited VRAM, enabling ray tracing can push a game over the limit, which shows up as stutter or blurry textures rather than as a lower average frame rate. If that happens, lower textures one step or drop ray tracing – see <a href="/guides/vram-full-what-to-lower/">VRAM full: what to lower first</a>.</p>`,
    `<h2 id="decide">How to decide</h2>
<ul class="do">
<li>Get a stable base frame rate first with an upscaler; ray tracing on top of native resolution is rarely affordable.</li>
<li>Turn effects on one at a time and compare the same scene with and without. Keep the one that changes the look most.</li>
<li>For fast multiplayer games, prefer frame rate over ray tracing.</li>
<li>For slow, atmospheric single-player games, ray-traced GI or reflections can be worth a lower frame rate.</li>
<li>On consoles, ray tracing is usually part of the fidelity mode – see <a href="/guides/ps5-performance-vs-fidelity-mode/">PS5 modes</a>.</li>
</ul>
<p>The <a href="/tools/settings-translator/">Settings Translator</a> rates ray-traced lighting and reflections as high GPU and moderate VRAM load. Patches regularly change ray tracing – new modes, a new denoiser, better performance – so re-test after updates that mention it.</p>`,
    `<h2 id="hybrid">Hybrid and software ray tracing</h2>
<p>Some engines use ray tracing in software or in a hybrid form – for example tracing against simplified scene representations – so that GPUs without fast ray-tracing hardware can still get some of the benefit. In such games, “hardware ray tracing” is often an extra option that improves quality further at higher cost. Read the game’s own description of each option; names are not standardized.</p>`,
    `<h2 id="patches">Ray tracing and game updates</h2>
<p>Ray tracing is one of the areas developers change most after launch: new modes are added, denoisers are replaced, performance improves, or ray tracing arrives on consoles in a later patch. When the <a href="/tools/patch-decoder/">Patch Decoder</a> files a line under graphics with a ray-tracing term, compare the same scene before and after – both how it looks and how it runs. An improved denoiser can make a lower RT quality setting look as good as the higher one did before the patch.</p>`
  ],
  faq: [
    ['Which ray tracing setting should I turn off first?', 'Usually ray-traced shadows, because they are often the hardest to distinguish from good traditional shadows. Keep global illumination or reflections if the game uses them well.'],
    ['Does ray tracing need a lot of VRAM?', 'It adds memory for acceleration structures and buffers. On cards with limited VRAM, it can push a game over the limit and cause stutter.'],
    ['Is path tracing the same as ray tracing?', 'Path tracing is the most complete form of ray tracing: all lighting is computed with rays and multiple bounces. It is far more demanding than individual ray-traced effects.'],
    ['Why does ray tracing look noisy or smeared?', 'Games trace only a few rays per pixel and rely on denoisers and temporal accumulation, which can smear or flicker in motion. Higher RT quality or a better denoiser reduces it.']
  ],
  sources: [
    ['NVIDIA DLSS technology overview', 'https://www.nvidia.com/en-us/geforce/technologies/dlss/', 'including Ray Reconstruction'],
    ['Microsoft DirectX Raytracing (DXR) documentation', null, 'Microsoft Learn, Direct3D 12 raytracing'],
    ['Vulkan', 'https://www.vulkan.org/', 'Vulkan ray tracing extensions'],
    ['AMD GPUOpen', 'https://gpuopen.com/', 'ray tracing and denoising techniques']
  ],
  related: ['dlss-vs-fsr-vs-xess', 'vram-full-what-to-lower', 'graphics-settings-explained']
};

export const frameCap = {
  slug: 'frame-cap-vsync-latency-pc',
  group: 'pc',
  kicker: 'Guide · smoothness &amp; latency',
  short: 'Frame caps, V-Sync and latency',
  title: 'Frame caps, V-Sync and latency on PC explained',
  description: 'How V-Sync, frame caps, G-Sync/FreeSync and latency modes like Reflex and Anti-Lag work together on PC, and a simple setup for smooth, responsive play.',
  h1: 'Frame caps, V-Sync and latency on PC explained',
  lede: 'Tearing, judder and laggy controls come from how frames are handed to the display. V-Sync, frame caps, variable refresh rate and latency-reduction modes each solve one part of the problem – and some combinations cancel each other out. This guide explains each tool and a setup that works for most PC players with a VRR monitor.',
  sections: [
    `<h2 id="problem">The problem: a game and a display on different clocks</h2>
<p>A display refreshes at a fixed rate – 60, 144, 165 Hz or more – unless it supports variable refresh rate. A game produces frames whenever they are ready. If a new frame is sent to the display in the middle of a refresh, the top part of the screen shows the old frame and the bottom the new one: a <b>tear</b>. If the game waits for the next refresh instead, there is no tearing, but frames can wait, and when the game cannot keep up, some frames are shown twice – <b>judder</b> – while the waiting adds <b>latency</b>.</p>`,
    `<h2 id="tools">The tools</h2>
${tbl('Tools for smoothness and latency', ['Tool', 'What it does', 'Benefit', 'Downside'], [
  ['V-Sync', 'Waits for the display refresh before showing a frame', 'No tearing', 'Added latency; judder when below refresh rate'],
  ['VRR (G-Sync, FreeSync, HDMI VRR)', 'The display refreshes when a frame is ready', 'No tearing, smooth at fluctuating FPS', 'Only within the display’s range'],
  ['Frame cap (limiter)', 'Limits FPS to a set value', 'Even frame pacing, stays within VRR range, less heat', 'Leaves performance unused'],
  ['Latency reduction (NVIDIA Reflex, AMD Anti-Lag 2, Intel XeLL)', 'Keeps the CPU from running ahead of the GPU', 'Lower input latency when GPU-bound', 'Needs game support for in-game versions'],
  ['Triple buffering / fast sync modes', 'Variants of buffering between game and display', 'Less judder or tearing', 'Behavior differs by implementation']
])}
<p>Latency reduction matters most when the GPU is fully loaded: then the CPU tends to prepare frames ahead, they queue up, and every queued frame adds delay between your input and the screen. Reflex and Anti-Lag 2 are integrated into games; driver-level options exist as well but are generally less precise.</p>`,
    `<h2 id="setup">A setup that works for most people</h2>
<p>If you have a VRR monitor (G-Sync or FreeSync compatible), a widely recommended setup is:</p>
<ol>
<li>Enable VRR (G-Sync / FreeSync) in the GPU driver and, if necessary, in the monitor’s menu.</li>
<li>Cap the frame rate a few frames below the refresh rate – for example around 141 fps on a 144 Hz display – so the game stays inside the VRR range instead of hitting V-Sync behavior at the top. Some latency-reduction modes apply such a cap automatically.</li>
<li>Enable the game’s latency-reduction option (Reflex, Anti-Lag 2) if available.</li>
<li>Many guides also recommend enabling V-Sync in the driver together with VRR, to avoid tearing at the top of the range; follow your GPU vendor’s current recommendation.</li>
</ol>
${fig('fc-fig', 'Frame rate band: below VRR range, inside VRR range up to a cap a few frames below the maximum refresh rate',
`<rect class="g-bg" width="640" height="200"/>
<text class="g-tm" x="20" y="30">EXAMPLE: 144 Hz MONITOR WITH A VRR RANGE OF 48–144 Hz</text>
<rect class="g-panel" x="40" y="70" width="560" height="44" rx="6"/>
<rect class="g-minus" x="40" y="70" width="110" height="44"/><rect class="g-plus" x="150" y="70" width="400" height="44"/><rect class="g-acc" x="550" y="70" width="50" height="44"/>
<text class="g-tk" x="50" y="97">below range</text><text class="g-tk" x="300" y="97">VRR: smooth</text>
<text class="g-tm" x="40" y="138">0</text><text class="g-tm" x="140" y="138">48</text><text class="g-tm" x="526" y="138">≈141 cap</text><text class="g-tm" x="586" y="160">144</text>
<text class="g-tm" x="40" y="186">Keep the frame rate inside the green band: cap just below the top, lower settings if it falls below.</text>`,
'The goal of the setup: frame rates inside the display’s VRR range. The cap keeps you from crossing the top; settings or an upscaler keep you above the bottom. Range values are an example.', '0 0 640 200')}`,
    `<h2 id="novrr">Without a VRR display</h2>
<p>Without VRR you have to choose. <b>V-Sync on</b> gives a tear-free image; it works best when the game can hold the full refresh rate at all times, otherwise judder appears. A cap at exactly the refresh rate, or at half of it (30 fps on 60 Hz), keeps frame pacing even. <b>V-Sync off</b> gives the lowest latency with visible tearing; competitive players often accept this, usually with a high uncapped or capped frame rate well above the refresh rate.</p>`,
    `<h2 id="cap">Why a frame cap helps even without latency concerns</h2>
<p>A cap that your PC can hold nearly all the time turns a frame rate that swings between 70 and 110 into a steady 90 – with even frame times, which often feels smoother than the higher but uneven rate. It also lowers power use, heat and fan noise, which matters on laptops and handheld PCs. In-game limiters are generally preferred over external ones because they can pace frames inside the game’s own loop, but driver and overlay limiters (for example in the NVIDIA App, AMD Software or RivaTuner Statistics Server) are good alternatives when a game has no limiter.</p>`,
    `<h2 id="fg">With frame generation</h2>
<p>Frame generation changes the picture: displayed frames are partly generated, and latency follows the rendered frames. Games that support it usually force the matching latency-reduction mode. Keep the output frame rate inside the VRR range and follow the vendor’s guidance for V-Sync and caps with frame generation – see <a href="/guides/frame-generation-explained/">frame generation explained</a>.</p>`,
    `<h2 id="check">Checking the result</h2>
<p>Watch a frame-time graph rather than the FPS number. A flat line means even pacing; spikes mean stutter that no V-Sync setting will fix – see <a href="/guides/fps-frame-time-1-percent-lows/">FPS, frame time and 1% lows</a>. Then judge the feel: quick camera turns in the same scene with each setup. If the controls feel delayed although the frame rate is high, the <a href="/tools/bottleneck-finder/">Bottleneck Finder</a> has a branch for latency.</p>`
  ],
  faq: [
    ['Should I turn V-Sync on or off?', 'With a VRR monitor, many players use VRR plus a frame cap a few frames below the refresh rate, often with V-Sync enabled in the driver. Without VRR, V-Sync on prevents tearing but adds latency; off gives the lowest latency with tearing.'],
    ['What frame cap should I use with G-Sync or FreeSync?', 'A few frames below the maximum refresh rate, for example about 141 fps on a 144 Hz display, so the game stays within the VRR range.'],
    ['What does NVIDIA Reflex do?', 'It reduces the queue of frames waiting for the GPU, so your input reaches the screen sooner. It helps most when the GPU is fully loaded.'],
    ['Does a frame cap reduce input lag?', 'It can, when it keeps the GPU from running at full load and stops frames from queuing. A cap far below what your PC can do adds a little delay per frame, though.']
  ],
  sources: [
    ['Blur Busters', 'https://blurbusters.com/', 'in-depth articles on G-Sync, V-Sync and frame caps'],
    ['NVIDIA Reflex', null, 'described on NVIDIA’s GeForce technology pages'],
    ['AMD Anti-Lag 2 and FreeSync', null, 'described in AMD Software documentation'],
    ['VESA', 'https://vesa.org/', 'Adaptive-Sync display standards']
  ],
  related: ['vrr-120hz-console-setup', 'frame-generation-explained', 'fps-frame-time-1-percent-lows']
};

export const fpsFrameTime = {
  slug: 'fps-frame-time-1-percent-lows',
  group: 'pc',
  kicker: 'Guide · measuring',
  short: 'FPS, frame time and 1% lows',
  title: 'FPS, frame time and 1% lows explained',
  description: 'What average FPS, frame time, 1% and 0.1% lows mean, how they are calculated, why tools disagree, and how to read a frame-time graph to spot stutter.',
  h1: 'FPS, frame time and 1% lows explained',
  lede: 'Average FPS is the number everybody quotes, and the one that tells you least about how smooth a game feels. Two runs with the same average can feel completely different if one of them has regular hitches. Frame time and 1% lows show what the average hides. This guide explains the numbers, how tools calculate them and how to read a frame-time graph.',
  sections: [
    `<h2 id="frametime">Frame time: the number behind FPS</h2>
<p>Frame time is how long one frame takes, in milliseconds. It is the inverse of the frame rate: <b>frame time = 1000 ÷ FPS</b>. At 60 fps each frame takes 16.7 ms on average, at 120 fps 8.3 ms, at 30 fps 33.3 ms. Frame time is the better unit for comparisons because it is linear in effort: saving 5 ms means the same amount of work saved whether you start at 30 or at 60 fps, while the FPS change looks very different.</p>
${tbl('Frame rate and frame time', ['FPS', 'Frame time', 'Change from previous row'], [
  ['30', '33.3 ms', '–'],
  ['40', '25.0 ms', '−8.3 ms'],
  ['60', '16.7 ms', '−8.3 ms'],
  ['90', '11.1 ms', '−5.6 ms'],
  ['120', '8.3 ms', '−2.8 ms'],
  ['144', '6.9 ms', '−1.4 ms'],
  ['240', '4.2 ms', '−2.8 ms']
], 'Calculated as 1000 ÷ FPS, rounded to 0.1 ms. Going from 30 to 40 fps saves as much time per frame as going from 40 to 60.')}`,
    `<h2 id="average">Why the average hides stutter</h2>
<p>Average FPS is the number of frames divided by the duration of the run. Imagine one second with 59 frames of 16 ms and one frame of 56 ms: the average is 60 fps, but that one long frame is a visible hitch. Repeat it every second and the game stutters constantly while the counter still says 60. This is why reviewers and careful testers report low percentiles alongside the average.</p>
${fig('ft-fig', 'Two frame-time graphs with the same average: one flat line, one with regular spikes',
`<rect class="g-bg" width="640" height="230"/>
<text class="g-tm" x="20" y="28">RUN A – EVEN PACING</text><text class="g-tm" x="20" y="128">RUN B – SAME AVERAGE, REGULAR SPIKES</text>
<path class="g-grid" d="M20 90h600M20 200h600"/>
<path class="g-plus-s" d="M20 70 L620 70"/>
<path class="g-minus-s" d="M20 180 L100 180 L104 140 L108 182 L220 182 L224 136 L228 182 L340 182 L344 142 L348 182 L460 182 L464 138 L468 182 L580 182 L584 140 L588 182 L620 182"/>
<text class="g-tm" x="470" y="62">≈16.7 ms each</text><text class="g-tm" x="470" y="130">spikes ≈ 50 ms</text>`,
'Both runs could report the same average FPS. Run B’s spikes are what you feel as stutter; they show up in the 1% lows and clearly in the graph. Illustration, not a measurement.', '0 0 640 230')}`,
    `<h2 id="lows">What 1% and 0.1% lows are</h2>
<p>The <b>1% low</b> describes the slowest one percent of frames in a run. There are two common ways to calculate it, and tools differ:</p>
<ul class="do">
<li><b>Percentile method:</b> take the 99th percentile frame time – the frame time that 99% of frames are faster than – and convert it to FPS.</li>
<li><b>Average-of-the-worst method:</b> take the slowest 1% of frames, average their frame times, and convert to FPS.</li>
</ul>
<p>The second method is more sensitive to individual extreme spikes and usually gives a lower number. Some tools also weight frames by time rather than counting them. The <b>0.1% low</b> works the same way for the slowest 0.1% of frames and highlights rare, large hitches – but in a short run it is based on very few frames and fluctuates a lot. The practical consequence: compare 1% lows only from the same tool with the same method, and use runs long enough to contain a few thousand frames.</p>`,
    `<h2 id="graph">Reading a frame-time graph</h2>
<ul class="do">
<li><b>A flat line</b> means even pacing – the ideal, regardless of its height.</li>
<li><b>Single tall spikes</b> are hitches: shader compilation, asset streaming, a background task. If they appear only on the first run, think <a href="/guides/shader-compilation-stutter-after-update/">shaders</a>.</li>
<li><b>A regular sawtooth or alternating pattern</b> suggests frame pacing issues, often with V-Sync or a mismatched cap.</li>
<li><b>A higher, noisy band in certain areas</b> means those scenes are heavier – often a CPU limit in crowded places.</li>
</ul>
<p>Tools such as PresentMon, CapFrameX and the overlays from GPU vendors show the graph live or record it for later analysis. On Steam Deck, the performance overlay at a higher level shows a frame-time graph as well.</p>`,
    `<h2 id="feel">What matters for how a game feels</h2>
<p>Smoothness depends on even frame times and on how they line up with the display. A steady 40 fps on a 40 Hz Steam Deck screen can feel better than an uneven 50 fps on a 60 Hz screen. A VRR display tolerates fluctuations within its range, but no display hides a 100 ms hitch. Responsiveness depends on the frame rate the game actually renders plus any queuing – see <a href="/guides/frame-cap-vsync-latency-pc/">frame caps, V-Sync and latency</a>. When you compare settings, look at both average FPS and 1% lows, as described in <a href="/guides/how-to-test-a-settings-change/">how to test a settings change</a>.</p>`,
    `<h2 id="mistakes">Common misreadings</h2>
<p>Comparing an average from one tool with a 1% low from another; judging from a run of a few seconds; comparing runs where one was capped; and forgetting that the first run after an update includes shader compilation. Each of these can make a setting look better or worse than it is. Write down the tool, method and conditions next to every number.</p>`,
    `<h2 id="targets">Frame-time targets for common displays</h2>
<p>A useful way to think about smoothness is the frame-time budget of your display. On a 60 Hz display each refresh lasts 16.7 ms; to show a new frame every refresh, every frame has to fit in that budget. On 120 Hz the budget is 8.3 ms, on 144 Hz 6.9 ms. Frames that exceed the budget cause a missed refresh without VRR, or a longer refresh with VRR. That is why 1% lows matter more as refresh rates rise: the budget shrinks, and occasional long frames become more visible against a very short normal frame time.</p>`
  ],
  faq: [
    ['What are good 1% lows?', 'There is no universal number. What matters is how close they are to the average: lows far below the average mean noticeable stutter. Compare them between settings in the same scene and tool.'],
    ['Why do different tools show different 1% lows?', 'They calculate them differently – as a percentile or as the average of the slowest frames – and may weight frames differently. Only compare numbers from the same tool.'],
    ['How do I convert FPS to frame time?', 'Divide 1000 by the frame rate: 60 fps is 16.7 ms per frame, 120 fps is 8.3 ms.'],
    ['Is a higher average FPS always better?', 'Not if it comes with worse frame pacing. An even, slightly lower frame rate often feels smoother than a higher, uneven one.']
  ],
  sources: [
    ['PresentMon', 'https://github.com/GameTechDev/PresentMon', 'frame-time capture and metrics'],
    ['CapFrameX', null, 'frame-time analysis tool; documents its percentile calculations'],
    ['Blur Busters', 'https://blurbusters.com/', 'display motion and frame pacing']
  ],
  related: ['how-to-test-a-settings-change', 'frame-cap-vsync-latency-pc', 'cpu-or-gpu-bottleneck']
};
