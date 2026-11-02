import { tbl, fig } from '../h.mjs';

export const graphicsSettings = {
  slug: 'graphics-settings-explained',
  group: 'pc',
  kicker: 'Guide · PC settings',
  short: 'Graphics settings explained',
  title: 'Graphics settings explained: what each option costs',
  description: 'What resolution, shadows, textures, ray tracing, fog and view distance do, which part of your PC each one loads, and which to lower first with least loss.',
  h1: 'Graphics settings explained: what each option costs',
  lede: 'A modern graphics menu has twenty or more options, and most of them barely change the frame rate. A few do almost all the work. This guide explains what each common option does, which part of your PC pays for it – graphics card, processor or video memory – and in which order to lower them when you need more performance.',
  sections: [
    `<h2 id="resources">Three resources pay for every frame</h2>
<p>Each frame is prepared by the <b>CPU</b>, which runs the game logic, moves characters, simulates physics and tells the graphics card what to draw. The <b>GPU</b> then draws the image: it shades every pixel, calculates light and shadow, and applies effects. Everything the GPU needs quickly – textures, geometry, intermediate images – sits in its <b>video memory (VRAM)</b>.</p>
<p>The frame rate is set by whichever stage is slowest. That is the key to settings: an option only helps if it relieves the stage that is currently the limit. Lowering shadows on a PC whose processor is the bottleneck costs image quality and gains nothing. If you do not know your limit yet, run the <a href="/tools/bottleneck-finder/">Bottleneck Finder</a> or the <a href="/guides/cpu-or-gpu-bottleneck/">5-minute check</a> first.</p>`,
    `<h2 id="resolution">Resolution and upscaling: the biggest lever</h2>
<p>The number of pixels the game renders is the strongest single factor for GPU load. 4K has four times the pixels of 1080p and 2.25 times those of 1440p. Because most per-pixel work scales with that count, lowering the render resolution is the most reliable way to gain GPU performance.</p>
<p>Lowering the <i>output</i> resolution of a flat-panel display makes the image soft, because the screen has to scale it. The better way is to keep the output at the display’s native resolution and lower the <i>internal</i> resolution with an upscaler – DLSS, FSR, XeSS or the engine’s own temporal upscaler – or with a render-scale slider. Modern upscalers reconstruct detail from previous frames and usually look much better than simple scaling. Our <a href="/guides/dlss-vs-fsr-vs-xess/">upscaler guide</a> explains the modes.</p>`,
    `<h2 id="lighting">Shadows, lighting and effects</h2>
<p><b>Shadow quality</b> controls the resolution, distance and softness of shadows. It loads the GPU and, in many engines, the CPU too, because more objects have to be drawn into the shadow maps. The top step is often expensive and hard to see in motion, so one step below the maximum is a classic low-loss gain.</p>
<p><b>Ambient occlusion</b> darkens corners and contact points so objects look grounded. Methods differ in cost; a cheaper method usually looks fine. <b>Volumetric effects</b> – fog, god rays, clouds – can be surprisingly expensive at the highest preset, and the difference to the step below is often small. <b>Screen-space reflections</b> reuse what is already on screen; <b>ray-traced reflections and lighting</b> are much more accurate and much more expensive, see <a href="/guides/ray-tracing-settings-explained/">ray tracing settings explained</a>.</p>
<p><b>Particle and effects quality</b> matters mostly in heavy moments – explosions, spells, smoke – and is a good candidate when the frame rate collapses only in big fights.</p>`,
    `<h2 id="textures">Textures and filtering</h2>
<p><b>Texture quality</b> sets the resolution of the images on surfaces. As long as they fit into video memory, higher textures cost little GPU time and improve the image clearly, so they are the last thing to lower on a card with enough VRAM. When memory runs full, the picture changes: textures load late or look blurry, and stutter appears because data has to be swapped over the slower connection to system memory. Then texture quality becomes the <i>first</i> option to lower – see <a href="/guides/vram-full-what-to-lower/">VRAM full: what to lower first</a>.</p>
<p><b>Anisotropic filtering</b> keeps textures sharp on surfaces seen at a shallow angle, such as roads and floors. On current graphics cards it typically costs very little, so 8x or 16x is usually a safe choice.</p>`,
    `<h2 id="world">World detail: what the CPU pays for</h2>
<p><b>View distance</b> (or draw distance, level of detail) decides how far away objects appear in full detail. <b>Crowd, traffic and NPC density</b> decides how many characters and vehicles are simulated. <b>Physics and destruction</b> decide how many objects move realistically. All three mostly load the CPU, because every object has to be updated and submitted for drawing each frame.</p>
<p>These options are the first to lower when you are CPU-bound, typically in large open worlds, cities and multiplayer matches with many players. On a GPU-bound system they help little. <b>Foliage density</b> sits in between: grass and trees cost both CPU submission work and GPU time.</p>`,
    `<h2 id="aa">Anti-aliasing and post-processing</h2>
<p><b>Anti-aliasing</b> smooths jagged edges. Post-process methods such as TAA, SMAA and FXAA are cheap; MSAA can be very expensive in modern engines and is rarely offered anymore. When an upscaler is active, it usually takes over anti-aliasing entirely.</p>
<p><b>Post-processing</b> – motion blur, depth of field, film grain, chromatic aberration, bloom – is mostly a matter of taste and usually cheap. Turn off what you dislike; do not expect big performance gains from it.</p>`,
    `<h2 id="table">The whole menu at a glance</h2>
${tbl('Typical cost of common graphics options (qualitative)', ['Option', 'Main load', 'Visible loss when lowered one step', 'Lower first when…'], [
  ['Render resolution / upscaler mode', 'GPU (high), VRAM', 'Noticeable to obvious', 'GPU-bound'],
  ['Ray-traced lighting and reflections', 'GPU (high), VRAM, some CPU', 'Noticeable', 'GPU-bound or VRAM full'],
  ['Volumetric fog and clouds', 'GPU', 'Often subtle', 'GPU-bound'],
  ['Shadow quality', 'GPU, some CPU', 'Subtle at the top step', 'GPU-bound'],
  ['Ambient occlusion', 'GPU', 'Subtle', 'GPU-bound'],
  ['Texture quality', 'VRAM', 'Noticeable', 'VRAM full'],
  ['View distance / LOD', 'CPU', 'Noticeable at long range', 'CPU-bound'],
  ['Crowd and traffic density', 'CPU', 'Subtle', 'CPU-bound'],
  ['Anisotropic filtering', 'Minimal', 'Noticeable on floors', 'Almost never'],
  ['Post-processing effects', 'Low', 'Taste', 'Only if you dislike them']
])}
<p>The <a href="/tools/settings-translator/">Settings Translator</a> has the full list of twenty options with separate GPU, CPU and VRAM ratings and sorts them for your bottleneck.</p>`,
    `<h2 id="presets">Presets: why “High” is often the sweet spot</h2>
${fig('gs-fig', 'Illustration of diminishing returns: each preset step up costs more performance while the visible improvement shrinks',
`<rect class="g-bg" width="640" height="260"/>
<path class="g-grid" d="M60 220h560M60 40v180"/>
<text class="g-tm" x="70" y="244">Low</text><text class="g-tm" x="210" y="244">Medium</text><text class="g-tm" x="360" y="244">High</text><text class="g-tm" x="510" y="244">Ultra</text>
<path class="g-plus-s" d="M80 190 C 200 110, 330 80, 530 66"/>
<path class="g-minus-s" d="M80 206 C 240 196, 380 170, 530 70"/>
<circle class="g-acc" cx="380" cy="84" r="6"/>
<text class="g-t" x="392" y="108">sweet spot: High</text>
<text class="g-tm" x="70" y="34">ILLUSTRATION – shape of a typical trade-off, not measured data</text>
<rect class="g-plus" x="420" y="140" width="14" height="4"/><text class="g-tm" x="440" y="146">visible quality</text>
<rect class="g-minus" x="420" y="160" width="14" height="4"/><text class="g-tm" x="440" y="166">performance cost</text>`,
'The usual shape of the trade-off: from Low to High the image improves quickly while the cost grows moderately; from High to Ultra the cost often rises steeply for a small visible gain. This is a qualitative illustration, not a measurement.')}
<p>Presets bundle all options into one choice. The jump from the highest preset to the one below often saves a lot of performance for a modest visual loss, because “Ultra” settings tend to push shadows, volumetrics and reflections far beyond what is visible during play. A good approach is to start from “High”, set textures as high as your VRAM allows, and then decide on ray tracing separately.</p>
<p>After a patch, check presets again: developers sometimes change what a preset contains, and the same name can cost more or less than before. The <a href="/tools/patch-decoder/">Patch Decoder</a> flags such lines with a tilde (~).</p>`
  ],
  faq: [
    ['Which graphics setting gives the most FPS?', 'On a GPU-limited system, render resolution – best lowered through an upscaler mode – usually gives by far the most. On a CPU-limited system, view distance and crowd density help more.'],
    ['Does lowering textures increase FPS?', 'Usually only when video memory is full. If the textures fit in VRAM, lowering them costs image quality for little or no gain.'],
    ['Is Ultra worth it?', 'Often not. The step from High to Ultra typically costs much more performance than the visible improvement suggests. Test both in one fixed scene and decide.'],
    ['Why do my settings perform differently after an update?', 'Updates can change what a preset contains, add effects or rebuild the shader cache. Re-test before changing anything, using the same scene as before.']
  ],
  sources: [
    ['NVIDIA DLSS technology overview', 'https://www.nvidia.com/en-us/geforce/technologies/dlss/'],
    ['AMD GPUOpen', 'https://gpuopen.com/', 'technical background on FidelityFX effects'],
    ['PCGamingWiki', 'https://www.pcgamingwiki.com/', 'per-game list of available graphics options'],
    ['Game-specific settings descriptions', null, 'many recent games show the relative cost of each option in their menu']
  ],
  related: ['cpu-or-gpu-bottleneck', 'vram-full-what-to-lower', 'dlss-vs-fsr-vs-xess']
};

export const frameGen = {
  slug: 'frame-generation-explained',
  group: 'pc',
  kicker: 'Guide · frame generation',
  short: 'Frame generation explained',
  title: 'Frame generation explained: smoother, but at what cost?',
  description: 'How DLSS and FSR frame generation insert extra frames, why input latency rises slightly, which base frame rate it needs, and when to turn it on or off.',
  h1: 'Frame generation explained: smoother, but at what cost?',
  lede: 'Frame generation can roughly double the frame-rate counter with one switch. It does not make the game react faster, though: the extra frames are generated between rendered ones, and the game still responds at the rendered rate – plus a little extra delay. Used at the right base frame rate it makes motion clearly smoother; used to rescue a struggling system it often feels worse than it looks.',
  sections: [
    `<h2 id="how">How frame generation works</h2>
<p>A game normally renders every frame you see. With frame generation, the GPU renders a frame, then creates one or more additional frames that sit between two rendered ones in time. The generated frames are estimated from the two neighboring frames and from motion information the game provides, such as motion vectors and depth.</p>
<p>To place a generated frame <i>between</i> two rendered frames, the newer rendered frame has to be held back until the generated one has been shown. That holding back is the reason frame generation adds latency. It is also why games that offer frame generation usually also offer a latency-reduction feature – NVIDIA Reflex, AMD Anti-Lag 2 or a similar option – and why NVIDIA requires Reflex to be active with DLSS Frame Generation.</p>
${fig('fg-fig', 'Timeline: rendered frames at a fixed interval, generated frames inserted between them, and input still sampled only at rendered frames',
`<rect class="g-bg" width="640" height="230"/>
<text class="g-tm" x="20" y="30">WITHOUT FRAME GENERATION</text>
<path class="g-grid" d="M20 70h600"/>
<rect class="g-plus" x="40" y="50" width="40" height="40" rx="4"/><rect class="g-plus" x="200" y="50" width="40" height="40" rx="4"/><rect class="g-plus" x="360" y="50" width="40" height="40" rx="4"/><rect class="g-plus" x="520" y="50" width="40" height="40" rx="4"/>
<text class="g-tm" x="20" y="130">WITH FRAME GENERATION (2×)</text>
<path class="g-grid" d="M20 170h600"/>
<rect class="g-plus" x="40" y="150" width="40" height="40" rx="4"/><rect class="g-acc" x="120" y="150" width="40" height="40" rx="4"/><rect class="g-plus" x="200" y="150" width="40" height="40" rx="4"/><rect class="g-acc" x="280" y="150" width="40" height="40" rx="4"/><rect class="g-plus" x="360" y="150" width="40" height="40" rx="4"/><rect class="g-acc" x="440" y="150" width="40" height="40" rx="4"/><rect class="g-plus" x="520" y="150" width="40" height="40" rx="4"/>
<text class="g-tm" x="20" y="216">green = rendered (reacts to input) · yellow = generated (smoothness only)</text>`,
'With 2× frame generation, every second frame on screen is generated. Motion looks twice as fluid, but the game still reads your input and updates the world only at the rendered frames.', '0 0 640 230')}`,
    `<h2 id="versions">Which versions exist</h2>
<p><b>DLSS Frame Generation</b> from NVIDIA runs on GeForce RTX 40 series and newer cards; the RTX 50 series adds <b>Multi Frame Generation</b>, which can insert more than one generated frame per rendered frame. <b>AMD FSR Frame Generation</b> (introduced with FSR 3) is designed to run on a wide range of graphics cards from different vendors. Some games also have their own implementations, and tools such as Lossless Scaling offer frame generation that works outside the game, with less information about the scene and usually more visible artifacts.</p>
<p>Exact requirements change with new versions and drivers, and each game decides which versions it supports. Check the game’s settings menu and the vendor pages listed below for your card.</p>`,
    `<h2 id="cost">The three costs: latency, artifacts, memory</h2>
<p><b>Latency.</b> Because the newest rendered frame waits, the time from your input to the screen grows slightly compared with the same base frame rate without generation. Latency reduction features recover part or all of that, depending on the game and system. The practical rule is simple: the game will <i>feel</i> roughly like its rendered frame rate, while it <i>looks</i> like the generated one.</p>
<p><b>Artifacts.</b> Generated frames are estimates. Fast-moving objects, transparent effects, user-interface elements and text can show smearing or flicker, especially when the base frame rate is low and the gap between rendered frames is large.</p>
<p><b>Memory and GPU time.</b> Generation needs extra video memory and some GPU time. On cards with little VRAM this can push memory use over the limit; on a fully loaded GPU it lowers the rendered frame rate a little before doubling it.</p>`,
    `<h2 id="base">The base frame rate decides everything</h2>
${tbl('How frame generation tends to feel at different base frame rates (2× generation, general guidance)', ['Rendered FPS before generation', 'Displayed FPS', 'Typical experience'], [
  ['Below about 30', 'Below about 60', 'Usually not recommended: visible artifacts and sluggish response'],
  ['About 40–50', 'About 80–100', 'Acceptable in slower games; fast action can feel delayed'],
  ['About 60 and above', 'About 120 and above', 'The intended use: very smooth motion, latency close to normal'],
  ['Already at the display’s refresh rate', 'Capped by refresh rate', 'Little benefit; extra frames may be discarded or need a cap']
], 'Thresholds are broad, commonly cited guidance – not measurements. Vendors themselves recommend a solid base frame rate.')}
<p>Frame generation multiplies what is already there. At 60 rendered frames per second it can turn a smooth game into a very smooth one on a high-refresh display. At 25 rendered frames per second it produces 50 frames that still react like 25 – and with more visible errors because each estimate has to bridge a longer gap.</p>`,
    `<h2 id="setup">How to set it up</h2>
<ul class="do">
<li>First get a good base frame rate with normal settings and an upscaler mode – frame generation is the last step, not the first.</li>
<li>Turn on the latency reduction option the game offers (it is often switched on automatically).</li>
<li>Use a display with variable refresh rate (G-Sync, FreeSync or HDMI VRR) if you can. The generated frame rate should stay within its range.</li>
<li>Avoid running above the display’s refresh rate: follow the game’s or driver’s recommendation on V-Sync and caps for frame generation.</li>
<li>Compare with and without in the same scene – how it <i>feels</i> while turning the camera quickly matters more than the counter.</li>
</ul>`,
    `<h2 id="when">When to turn it off</h2>
<p>Turn frame generation off in competitive multiplayer games where reaction time decides, when the base frame rate is low, when you see distracting artifacts in the interface, or when video memory is already full. Turn it on for single-player games on a high-refresh display when the base frame rate is already good and you want smoother motion. After a game update, re-check it: patches often update the frame generation version or fix (or introduce) artifacts.</p>`
  ],
  faq: [
    ['Does frame generation increase input lag?', 'Slightly, compared with the same rendered frame rate without it, because the newest frame is held back. Latency reduction features such as NVIDIA Reflex or AMD Anti-Lag 2 recover part of it.'],
    ['What base frame rate do I need for frame generation?', 'There is no fixed number, but it works best when the game already runs at around 60 rendered frames per second or more. Below about 30 it usually looks and feels poor.'],
    ['Does frame generation work with V-Sync?', 'It depends on the version and the game. Follow the game’s recommendation; with a variable refresh rate display, keep the output frame rate within the display’s range.'],
    ['Should I use frame generation in competitive games?', 'Usually not. Reaction time follows the rendered frame rate, and the small extra delay works against you.']
  ],
  sources: [
    ['NVIDIA DLSS technology overview', 'https://www.nvidia.com/en-us/geforce/technologies/dlss/', 'DLSS Frame Generation and Multi Frame Generation'],
    ['AMD GPUOpen', 'https://gpuopen.com/', 'FSR documentation including frame generation'],
    ['NVIDIA Reflex', null, 'latency reduction; described on NVIDIA’s GeForce technology pages'],
    ['AMD Anti-Lag 2', null, 'in-game latency reduction; described in AMD Software documentation']
  ],
  related: ['dlss-vs-fsr-vs-xess', 'frame-cap-vsync-latency-pc', 'fps-frame-time-1-percent-lows']
};

export const upscalers = {
  slug: 'dlss-vs-fsr-vs-xess',
  group: 'pc',
  kicker: 'Guide · upscaling',
  short: 'DLSS vs FSR vs XeSS',
  title: 'DLSS vs FSR vs XeSS: which upscaler mode to pick',
  description: 'How DLSS, FSR and XeSS work, what Quality, Balanced and Performance mean in internal resolution, which runs on your GPU and which mode suits your display.',
  h1: 'DLSS vs FSR vs XeSS: which upscaler mode to pick',
  lede: 'Upscalers render the game at a lower internal resolution and reconstruct a sharper image for your display. Used well, they are the cheapest way to gain GPU performance. The names – DLSS, FSR, XeSS, TSR, PSSR – and the modes from Quality to Ultra Performance hide a simple question: how many pixels does the game really render, and how good is the reconstruction?',
  sections: [
    `<h2 id="what">What an upscaler does</h2>
<p>A temporal upscaler renders each frame at a reduced resolution, with a tiny camera offset that changes from frame to frame. It then combines information from the current and previous frames, guided by motion vectors from the game, to rebuild detail at the output resolution. Because it accumulates samples over time, the result can look close to native resolution – and it replaces the game’s own anti-aliasing.</p>
<p>The quality depends on how the reconstruction decides which old information to keep. Machine-learning upscalers use a trained neural network for that decision; others use hand-written rules. Errors show up as ghosting behind moving objects, shimmering on fine detail such as fences and foliage, or softness in motion.</p>`,
    `<h2 id="modes">What the modes mean in pixels</h2>
${tbl('Common upscaler modes and their typical internal resolution', ['Mode', 'Typical scale per axis', 'Pixels rendered (share of output)', 'From 4K output (3840×2160)', 'From 1440p output'], [
  ['Quality', '≈ 67%', '≈ 44%', '≈ 2560×1440', '≈ 1707×960'],
  ['Balanced', '≈ 58%', '≈ 34%', '≈ 2227×1253', '≈ 1485×835'],
  ['Performance', '50%', '25%', '1920×1080', '1280×720'],
  ['Ultra Performance', '≈ 33%', '≈ 11%', '1280×720', '≈ 853×480']
], 'These ratios are the commonly documented defaults for DLSS and FSR. XeSS uses similar mode names, but its ratios have changed between versions, and games may use their own values or a free slider – check the internal resolution the game shows.')}
<p>Two lessons follow from the table. First, even “Quality” renders less than half the pixels of native resolution, which is why it often gains a lot of performance. Second, the <b>output resolution matters</b>: Performance mode at 4K renders a full 1080p image and usually looks good; Performance mode at 1080p output renders only 960×540 and looks noticeably softer. The lower your display resolution, the higher the mode you should pick.</p>`,
    `<h2 id="compare">DLSS, FSR, XeSS and the others</h2>
${tbl('Upscalers at a glance (as of November 2026; check vendor pages for current details)', ['Upscaler', 'From', 'Runs on', 'Approach'], [
  ['DLSS Super Resolution', 'NVIDIA', 'GeForce RTX graphics cards', 'Machine-learning model on tensor cores'],
  ['FSR 2 / FSR 3 upscaling', 'AMD', 'Graphics cards from all major vendors', 'Hand-tuned temporal algorithm'],
  ['FSR 4', 'AMD', 'Recent Radeon cards (RX 9000 series)', 'Machine-learning model'],
  ['XeSS', 'Intel', 'Intel Arc with dedicated hardware; other GPUs through a compatible path', 'Machine-learning model'],
  ['TSR / engine upscalers', 'Engine makers (e.g. Unreal Engine’s TSR)', 'All supported GPUs', 'Engine-integrated temporal upscaling'],
  ['PSSR', 'Sony', 'PS5 Pro', 'Machine-learning upscaling in supported games']
])}
<p>As a rule of thumb, the machine-learning upscalers tend to hold fine detail and stability better at aggressive modes, while FSR 2 and 3 upscaling run almost everywhere. Results vary by game, because each integration and its motion vectors differ. If your card supports several, try them in the same scene: walk past foliage and fences and look for shimmer and ghosting.</p>`,
    `<h2 id="pick">Which mode to pick</h2>
${fig('up-fig', 'Recommended starting mode by output resolution: 1080p Quality, 1440p Quality or Balanced, 4K Balanced or Performance',
`<rect class="g-bg" width="640" height="220"/>
<text class="g-tm" x="20" y="30">STARTING POINT BY OUTPUT RESOLUTION (then test)</text>
<rect class="g-panel" x="20" y="48" width="190" height="150" rx="8"/><rect class="g-panel" x="225" y="48" width="190" height="150" rx="8"/><rect class="g-panel" x="430" y="48" width="190" height="150" rx="8"/>
<text class="g-tb" x="36" y="78">1080p</text><text class="g-tb" x="241" y="78">1440p</text><text class="g-tb" x="446" y="78">4K</text>
<rect class="g-acc" x="36" y="96" width="120" height="26" rx="4"/><text class="g-tk" x="46" y="114">Quality</text>
<rect class="g-acc" x="241" y="96" width="150" height="26" rx="4"/><text class="g-tk" x="251" y="114">Quality/Balanced</text>
<rect class="g-acc" x="446" y="96" width="160" height="26" rx="4"/><text class="g-tk" x="456" y="114">Balanced/Perf.</text>
<text class="g-tm" x="36" y="150">renders ≈ 720p</text><text class="g-tm" x="241" y="150">renders ≈ 960p–835p</text><text class="g-tm" x="446" y="150">renders ≈ 1253p–1080p</text>
<text class="g-tm" x="36" y="176">avoid Performance</text><text class="g-tm" x="241" y="176">Performance if needed</text><text class="g-tm" x="446" y="176">Ultra Perf. last resort</text>`,
'A practical starting point. Keep the internal resolution from dropping too low: the reconstruction needs enough real pixels to work with.', '0 0 640 220')}
<ul class="do">
<li>Set the display’s native resolution as output; never lower the output resolution when an upscaler is available.</li>
<li>Start with Quality. If you need more frames, step to Balanced, then Performance – one step at a time, testing each.</li>
<li>If the image looks soft, a sharpening slider can help; too much sharpening creates halos and shimmering.</li>
<li>Prefer an upscaler mode over lowering many effects: it usually costs less visible quality for the same gain.</li>
<li>If you are CPU-bound, upscaling gains little – the GPU was not the limit. See <a href="/guides/cpu-or-gpu-bottleneck/">CPU or GPU bottleneck?</a></li>
</ul>`,
    `<h2 id="patches">Upscalers and game updates</h2>
<p>Game updates often change upscalers: a new DLSS, FSR or XeSS version, a new default mode, a sharpening change or a fix for ghosting. The same mode name can then look or perform differently. When the <a href="/tools/patch-decoder/">Patch Decoder</a> sorts an upscaling line as a change (~), compare your current mode in a fixed scene before and after. On consoles, the developer chooses the upscaler; you choose the mode – see <a href="/guides/ps5-performance-vs-fidelity-mode/">PS5 performance vs fidelity modes</a>.</p>`,
    `<h2 id="compare-own">How to compare upscalers yourself</h2>
<p>Comparisons in videos are compressed and rarely show your game at your resolution. A two-minute comparison of your own is more reliable. Pick a scene with fine, high-contrast detail – a chain-link fence, power lines, grass or hair – and some movement, ideally a character running past a detailed background. Then switch between the available upscalers at the same mode and look for four things:</p>
<ul class="do">
<li><b>Stability:</b> do thin lines shimmer or crawl while the camera moves slowly?</li>
<li><b>Ghosting:</b> do moving objects leave a faint trail, especially against the sky?</li>
<li><b>Sharpness in motion:</b> does the image blur when you turn and sharpen again when you stop?</li>
<li><b>Particles and transparency:</b> do sparks, rain or smoke break up or smear?</li>
</ul>
<p>Note the frame rate of each option as well – upscalers have a small cost of their own, and the machine-learning ones can cost slightly more on some cards. If two options look equal to you, take the faster one; if one is clearly more stable, a slightly lower frame rate is usually worth it. Re-check after updates that mention a new upscaler version.</p>`
  ],
  faq: [
    ['Is DLSS Quality better than native resolution?', 'Sometimes it looks comparable or more stable than native with a weak anti-aliasing method, sometimes slightly softer. It depends on the game and the output resolution; compare in a scene with fine detail.'],
    ['Can I use FSR on an NVIDIA card?', 'FSR 2 and FSR 3 upscaling are designed to run on graphics cards from all major vendors, so yes, if the game offers it. FSR 4 targets recent Radeon cards.'],
    ['Which upscaler mode for 1080p?', 'Quality is the usual choice. Lower modes render very few pixels at 1080p output and tend to look soft.'],
    ['Does upscaling help if I am CPU-bound?', 'Very little. Upscaling reduces GPU work; if the processor is the limit, the frame rate hardly changes.']
  ],
  sources: [
    ['NVIDIA DLSS technology overview', 'https://www.nvidia.com/en-us/geforce/technologies/dlss/'],
    ['AMD GPUOpen', 'https://gpuopen.com/', 'FidelityFX Super Resolution documentation'],
    ['Intel XeSS', null, 'documented on Intel’s gaming technology pages'],
    ['Unreal Engine documentation on Temporal Super Resolution', null, 'Epic Games developer documentation']
  ],
  related: ['frame-generation-explained', 'graphics-settings-explained', 'steam-deck-frame-cap-tdp-battery']
};
