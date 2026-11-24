// Console guides: PS5 modes and Xbox Series S vs X.
// Rewritten on 2026-11-24: generic "usually/typically" passages replaced by what Sony, Microsoft and the developers
// state in official sources (read in full that day); the PS5 Pro guide became /reference/console-upgrades/.
import { createRequire } from 'node:module';
import { tbl, fig, tryBox, SRC, read24 } from '../h.mjs';
const require = createRequire(import.meta.url);
const FT = require('../assets/js/frametime-core.js');
const U = require('../data/upgrades-core.js');
const r2 = (x) => FT.round(x, 2).toFixed(2).replace(/\.?0+$/, '');
const mpx = (w, h) => (w * h / 1e6).toFixed(2);
const holds = (fps, hz) => { const f = FT.fit(fps, hz); return f.kind === 'even' ? `even: ${f.refreshes} refresh${f.refreshes > 1 ? 'es' : ''} per frame` : f.kind === 'uneven' ? `uneven: ${f.lo} or ${f.hi} refreshes (${r2(f.loMs)} / ${r2(f.hiMs)} ms)` : 'not possible: above the refresh rate'; };
// a PlayStation Blog post from the upgrade reference as a source entry of this guide
const blog = (id) => { const [label, url] = U.SOURCES[id]; return read24(label, url); };
const XSX = read24('Xbox – Xbox Series X, tech specs', 'https://www.xbox.com/en-US/consoles/xbox-series-x', 'processor, memory, video capabilities');
const XSS = read24('Xbox – Xbox Series S, tech specs', 'https://www.xbox.com/en-US/consoles/xbox-series-s', 'processor, memory, video capabilities');

export const ps5Modes = {
  slug: 'ps5-performance-vs-fidelity-mode',
  changelog: [['2026-11-02', 'First published.'],
    ['2026-11-18', 'Worked example added: frame-rate targets on 60 Hz and 120 Hz outputs, a decision table by display, and the PS5 setting names as given by PlayStation Support.'],
    ['2026-11-24', 'General statements about what modes “usually” do replaced by mode descriptions that developers published for specific games; the separate settings section removed – the PS5 display settings are now quoted in the VRR guide, Game Presets stays here; QSSR (October 2026) and the new console upgrade reference added.']],
  group: 'console',
  kicker: 'Guide · PS5',
  short: 'PS5 performance vs fidelity modes',
  title: 'PS5 performance vs fidelity modes explained',
  description: 'What PS5 performance, fidelity and balanced modes trade, as developers describe their own modes; why 40 fps needs 120 Hz; and how to set a default mode.',
  h1: 'PS5 performance vs fidelity modes explained',
  lede: 'Many PS5 games let you choose between a performance mode and a fidelity, quality or resolution mode, and some add a balanced mode. Sony’s own definition is one sentence: performance mode makes motion smoother, resolution mode gives higher graphic quality. What that means in a particular game is the developer’s decision. This guide shows what developers have published about their modes, why some modes need a 120 Hz TV, and how to set a default.',
  sections: [
    `<h2 id="trade">The trade-off, in the developers’ own words</h2>
<p>Sony defines the two options in the PS5’s Game Presets: “Make motion in your game smoother with performance mode, or have higher graphic quality in resolution mode. This applies only to games that offer these modes.” The PS5 itself does not set a resolution or frame rate for a mode; the game does. The clearest way to see the trade is in the descriptions developers have published for their own games:</p>
${tbl('What developers state about their PS5 modes (official sources, read November 24, 2026)', ['Game', 'Quality / fidelity side', 'Performance side', 'Source'], [
  ['Warhammer 40,000: Darktide', 'Quality mode: 4K, 30 fps', 'Performance mode: 1440p, 60 fps', 'Fatshark, PlayStation Blog, Nov 27, 2024'],
  ['Marvel’s Spider-Man games, Ratchet &amp; Clank: Rift Apart', 'Fidelity mode: 4K resolution and ray tracing', 'Performance mode: 60 fps', 'Insomniac Games, PlayStation Blog, Sep 24, 2024'],
  ['Dragon Age: The Veilguard', 'Fidelity mode: 30 fps, with ray-traced ambient occlusion', 'Performance mode: 60 fps, without it on the standard PS5', 'BioWare, PlayStation Blog, Sep 24, 2024'],
  ['Assassin’s Creed Black Flag Resynced', 'Balanced and Fidelity: ray-traced global illumination and ray-traced specular reflections', 'Performance: ray-traced global illumination only', 'Ubisoft, PlayStation Blog, Jun 29, 2026'],
  ['Saros', 'Key story cinematics switch to 30 fps', 'Gameplay at 60 fps with dynamic resolution', 'Housemarque, PlayStation Blog, Apr 16, 2026']
], 'Statements about the standard PS5. What the same games change on PS5 Pro is listed in the <a href="/reference/console-upgrades/">console upgrade reference</a>.')}
<p>The pattern across these examples: the quality side spends the frame time on resolution and ray tracing, the performance side on frame rate. Two of them show that the line is not always “ray tracing on or off” – Black Flag Resynced keeps ray-traced global illumination in every mode and drops only the reflections, and Saros keeps one mode but varies the resolution from scene to scene (dynamic resolution) to hold 60 fps.</p>
<p>The arithmetic behind the trade is simple. At 30 frames per second each frame may take up to 33.3 milliseconds; at 60 only 16.7. To halve the time per frame, a game has to drop work – pixels, effects or both – which is what the performance side of every row above does.</p>`,
    `<h2 id="balanced">Why 40 fps balanced modes need 120 Hz</h2>
<p>A 60 Hz TV refreshes every 16.7 ms. A 30 fps game shows each frame for exactly two refreshes, a 60 fps game for one – both are even. A 40 fps game would need 1.5 refreshes per frame, which a 60 Hz signal cannot do evenly, so motion would judder. A 120 Hz signal refreshes every 8.3 ms, and 40 fps fits exactly three refreshes per frame (25 ms). That is why 40 fps modes are tied to 120 Hz output.</p>
${fig('ps-fig', 'Frame time ladder: 30 fps is 33.3 ms, 40 fps is 25 ms, 60 fps is 16.7 ms; 40 fps sits halfway in frame time',
`<rect class="g-bg" width="640" height="210"/>
<text class="g-tm" x="20" y="30">TIME PER FRAME</text>
<rect x="40" y="50" width="400" height="30" fill="#7CC4FF"/><text class="g-t" x="456" y="71">30 fps · 33.3 ms</text>
<rect class="g-acc" x="40" y="96" width="300" height="30"/><text class="g-t" x="356" y="117">40 fps · 25.0 ms</text>
<rect class="g-plus" x="40" y="142" width="200" height="30"/><text class="g-t" x="256" y="163">60 fps · 16.7 ms</text>
<text class="g-tm" x="40" y="198">40 fps sits exactly halfway between 30 and 60 in frame time</text>`,
'In frame time – what you actually feel – 40 fps is exactly halfway between 30 and 60, although the number looks closer to 30.', '0 0 640 210')}
<p>For the same reason, 40 fps feels like a bigger step up from 30 than the numbers suggest: it saves 8.3 ms per frame, exactly half of the 16.7 ms that 60 fps saves.</p>`,
    `<h2 id="outputs">Worked example: which frame rates fit which output</h2>
<p>The same arithmetic decides for every target, not only for 40 fps. Divide the output’s refresh rate by the frame rate: a whole number means every frame is held equally long; anything else means alternating holds unless VRR is active.</p>
${tbl('Frame-rate targets on a 60 Hz and a 120 Hz output without VRR (calculated)', ['Target', 'Frame time', 'On a 60 Hz output', 'On a 120 Hz output'],
  [30, 40, 60, 120].map((f) => [`${f} fps`, `${r2(FT.ms(f))} ms`, holds(f, 60), holds(f, 120)]))}
<p>From this follows a short decision table for the mode menu:</p>
${tbl('What your display allows', ['Your TV or monitor', 'Modes that pace evenly', 'What to do'], [
  ['60 Hz, no VRR', '30 fps and 60 fps modes', 'Choose between the quality side (30) and the performance side (60); a 40 fps mode would judder'],
  ['120 Hz, no VRR', '30, 40, 60 and 120 fps modes', 'Turn on 120 Hz output; a 40 fps “balanced” mode becomes a real option'],
  ['120 Hz with VRR', 'The above, plus unlocked frame rates inside the VRR window', 'Turn on 120 Hz output and VRR; performance modes that dip stay smooth']
])}
<p>On the PS5, <b>120 Hz Output</b> and <b>VRR</b> are under Settings → Screen and Video → Video Output; what each switch does, in Sony’s words, and what the TV and cable need is in <a href="/guides/vrr-120hz-console-setup/#consoles">VRR and 120 Hz on consoles</a>. The default mode lives elsewhere: Settings → Saved Data and Game/App Settings → <b>Game Presets</b> → “Performance Mode or Resolution Mode”, which Sony says applies only to games that offer these modes.</p>
${tryBox('Check any frame rate against your TV’s refresh rate and VRR window.', '/tools/frame-time-calculator/?fps=40&hz=120', 'Open the Frame Time Calculator with 40 fps at 120 Hz')}`,
    `<h2 id="choose">How to choose</h2>
<p>This part is our suggestion, not a measurement. <b>Performance</b> suits action games and anything where camera movement and reaction time matter, and players who are sensitive to 30 fps motion; on a 4K TV at a normal distance the resolution difference is smaller than the frame-rate difference. <b>Fidelity</b> suits slow, cinematic games on a large screen, especially when ray-traced lighting is part of the look – check the game’s own description, because, as the table shows, the quality side is not always the only one with ray tracing. <b>Balanced (40 fps)</b> is the middle way if your TV supports 120 Hz.</p>
<p>Try each mode for a few minutes in the same area, turning the camera and moving quickly. How it feels in motion is a better guide than a screenshot.</p>`,
    `<h2 id="patches">When updates change modes</h2>
<p>Updates can add or change modes: a new 40 fps option, a changed resolution range, ray tracing added to a mode, a PS5 Pro patch – and since October 2026 also <b>QSSR</b>, Sony’s AI upscaler for the standard PS5, which games add as an extra graphics option through their own updates. Marvel’s Wolverine and Ghost of Yōtei were the first; Sony named six more on November 13, 2026. The <a href="/reference/console-upgrades/?kind=qssr">console upgrade reference</a> lists them with the developers’ statements. After such an update, check that your chosen mode is still selected – in the game and in the system Game Presets – and compare again. The <a href="/tools/patch-decoder/">Patch Decoder</a> puts mode lines in “Console &amp; handheld modes” so you can filter for PS5.</p>`
  ],
  faq: [
    ['Is performance mode or fidelity mode better on PS5?', 'Neither in general. Sony describes performance mode as smoother motion and resolution mode as higher graphic quality; each game decides the details, often 60 fps against 30 fps with a higher resolution or more ray tracing.'],
    ['Why does my PS5 game not show a 40 fps mode?', 'A 40 fps mode paces evenly only on a 120 Hz signal. Check that “120 Hz Output” is on and that your TV and HDMI port support 120 Hz. Not every game offers 40 fps.'],
    ['What does the Game Presets setting do?', 'It sets “Performance Mode or Resolution Mode” as a default. Sony: it applies only to games that offer these modes; games can still offer their own options.'],
    ['Does VRR help in a 30 fps mode?', 'VRR follows the frame rate only inside your display’s VRR window. If the window starts above 30 Hz – look it up in the TV’s manual – a steady 30 fps mode gains little.']
  ],
  sources: [SRC.pspresets, SRC.psres, SRC.psvrr, blog('pb-2411-dt'), blog('pb-2409'), blog('pb-2606-acbf'), blog('pb-2604-sa'), SRC.qssr, SRC.qssr2,
    ['Patch notes and settings menus of individual games', null, 'each game defines its own modes']],
  related: ['console-upgrades', 'frame-time-calculator', 'vrr-120hz-console-setup']
};

const spec = tbl('Xbox Series X and Series S as listed on Microsoft’s product pages (read November 24, 2026)', ['', 'Series X', 'Series S'], [
  ['CPU', '8 cores at 3.8 GHz (3.6 GHz with SMT), custom Zen 2', '8 cores at 3.8 GHz (3.6 GHz with SMT), custom Zen 2'],
  ['GPU', '12 TFLOPS, 52 compute units at 1.825 GHz, custom RDNA 2', '4 TFLOPS, 20 compute units at 1.565 GHz, custom RDNA 2'],
  ['Memory', '16 GB GDDR6, 320-bit bus', '10 GB GDDR6, 128-bit bus'],
  ['Memory bandwidth', '10 GB at 560 GB/s, 6 GB at 336 GB/s', '8 GB at 224 GB/s, 2 GB at 56 GB/s'],
  ['Gaming resolution', 'True 4K', '1440p'],
  ['Performance target', 'Up to 120 fps', 'Up to 120 fps'],
  ['HDMI features', 'ALLM, HDMI VRR, AMD FreeSync', 'ALLM, HDMI VRR, AMD FreeSync']
], 'Microsoft’s wording, shortened. The CPU line is identical on both pages; the differences are GPU, memory and the resolution target.');

export const xbox = {
  slug: 'xbox-series-s-vs-x-modes',
  changelog: [['2026-11-02', 'First published.'],
    ['2026-11-18', 'Worked example added: pixel, GPU and memory ratios between Series X and Series S; menu path and 120 Hz requirements as given by Xbox Support.'],
    ['2026-11-24', 'Specifications re-read on Microsoft’s product pages and corrected: both consoles are listed with the same CPU (8 cores at 3.8 GHz); memory bandwidth added. 120 Hz requirements quoted from Xbox Support as read in full; the other display settings moved to the VRR guide. Unsourced statements about what Series S versions “usually” drop removed, as was the section on Smart Delivery.']],
  group: 'console',
  kicker: 'Guide · Xbox',
  short: 'Xbox Series S vs X modes',
  title: 'Xbox Series S vs X: why game modes differ',
  description: 'Why a game can offer fewer or different modes on Xbox Series S than on Series X: Microsoft’s GPU, memory and resolution figures, and the 120 Hz rules.',
  h1: 'Xbox Series S vs X: why game modes differ',
  lede: 'The Xbox Series S and Series X play the same games, but not always with the same options: a game may offer a 60 fps mode and ray tracing on Series X and fewer choices on Series S. Microsoft’s own specifications explain why. They list the same CPU for both consoles, but a GPU with a third of the compute, less and slower memory, and a lower resolution target for the Series S.',
  sections: [
    `<h2 id="hardware">What differs between the consoles</h2>
${spec}
<p>Because the processors are listed identically, work that runs on the CPU – game logic, physics, simulation – has the same budget on both consoles. Everything that depends on the GPU and on memory has less on the Series S: a third of the compute, 10 instead of 16 GB, and a fast memory pool that is both smaller (8 against 10 GB) and less than half as fast (224 against 560 GB/s). Developers have to fit the same game into both.</p>`,
    `<h2 id="ratio">Worked example: the gap in numbers</h2>
<p>Microsoft’s figures allow a simple comparison of what each console is asked to do at its resolution target – 4K for the Series X, 1440p for the Series S.</p>
${tbl('Targets and resources side by side (Microsoft’s figures; ratios calculated)', ['', 'Series X', 'Series S', 'Ratio X : S'], [
  ['Pixels at the resolution target', `3840×2160 = ${mpx(3840, 2160)} MP`, `2560×1440 = ${mpx(2560, 1440)} MP`, '2.25 : 1'],
  ['GPU compute', '12 TFLOPS', '4 TFLOPS', '3 : 1'],
  ['Memory', '16 GB', '10 GB', '1.6 : 1'],
  ['Bandwidth of the fast memory pool', '560 GB/s', '224 GB/s', '2.5 : 1']
])}
<p>Two things follow from the arithmetic. The GPU gap (3 to 1) is larger than the pixel gap between the two targets (2.25 to 1): a Series X mode that uses its GPU fully at 4K cannot run with the same settings at 1440p on the Series S – it has to give up about a quarter more, through a lower internal resolution or cheaper effects. And memory shrinks least in the ratio, but textures and world data do not get smaller when the resolution does. Which of these a developer chooses is different in every game; the game’s store page and patch notes say what its Series S version offers.</p>
${tryBox('See what an upscaler renders for a 1440p or a 4K output.', '/tools/upscaler-resolution-calculator/?out=2560x1440&up=fsr', 'Open the Upscaler Resolution Calculator')}`,
    `<h2 id="why">What the figures mean for modes</h2>
${fig('xb-fig', 'Bars comparing Series S with Series X: same CPU, GPU about one third, memory ten of sixteen gigabytes',
`<rect class="g-bg" width="640" height="210"/>
<text class="g-tm" x="20" y="30">SERIES S RELATIVE TO SERIES X (Series X = full bar)</text>
<text class="g-t" x="20" y="74">CPU</text><rect class="g-panel" x="110" y="58" width="480" height="24"/><rect class="g-plus" x="110" y="58" width="480" height="24"/><text class="g-tk" x="120" y="75">same listed CPU</text>
<text class="g-t" x="20" y="124">GPU</text><rect class="g-panel" x="110" y="108" width="480" height="24"/><rect x="110" y="108" width="160" height="24" fill="#7CC4FF"/><text class="g-tm" x="280" y="125">4 of 12 TFLOPS</text>
<text class="g-t" x="20" y="174">Memory</text><rect class="g-panel" x="110" y="158" width="480" height="24"/><rect class="g-minus" x="110" y="158" width="300" height="24"/><text class="g-tm" x="420" y="175">10 of 16 GB</text>`,
'From Microsoft’s product pages: CPU line, TFLOPS and total memory. Bandwidth, not shown, differs even more (224 against 560 GB/s in the fast pool).', '0 0 640 210')}
<p>A <b>frame-rate mode</b> that relies on spare GPU time on the Series X is the one with the least room on the Series S, because the CPU budget is the same but the GPU budget is a third. A <b>resolution difference</b> is built into the specifications: Microsoft lists 1440p as the gaming resolution of the Series S, so on a large 4K TV its image is upscaled further. <b>Memory-heavy features</b> – high-resolution textures, ray-tracing data – compete for 10 instead of 16 GB. None of this says what a specific game does; it explains why the options can differ at all.</p>
<p>On either console, the choice between modes works as described in <a href="/guides/ps5-performance-vs-fidelity-mode/">PS5 performance vs fidelity modes</a>: quality settings against frame rate, with 40 and 120 fps modes depending on 120 Hz output.</p>`,
    `<h2 id="settings">120 Hz on Series X and Series S</h2>
<p>Both consoles list a performance target of up to 120 fps, but not at every resolution. Xbox Support: 4K at 120 Hz needs an Xbox Series X, an Ultra High Speed HDMI cable that supports HDMI 2.1 and a TV that supports HDMI 2.1. On a Series S, or with a TV without HDMI 2.1, 120 Hz is still available at a lower resolution – set Refresh rate to 120 Hz under Profile &amp; system → Settings → General → TV &amp; display options, and the console adjusts the resolution if it was set to 4K. That matters for game modes: a 120 fps or 40 fps mode needs the 120 Hz output first.</p>
<p>The other display settings – Allow variable refresh rate, Allow auto low-latency mode, 4K TV details – and the TV side are described in <a href="/guides/vrr-120hz-console-setup/#consoles">VRR and 120 Hz on consoles</a>.</p>`,
    `<h2 id="patches">Patches and the Series S</h2>
<p>Updates can change what a Series S version offers in either direction – a new mode after optimization, or a heavier game after a content update. When patch notes mention “Series S” or “Xbox Series X|S”, check your mode and compare in a familiar scene, following the <a href="/guides/how-to-test-a-settings-change/#after-update">re-test routine</a>. The <a href="/tools/patch-decoder/">Patch Decoder</a> filters such lines by platform.</p>`
  ],
  faq: [
    ['Why does my game have fewer modes on Xbox Series S?', 'Microsoft lists a GPU with 4 instead of 12 TFLOPS, 10 instead of 16 GB of memory and a 1440p resolution target for the Series S. A developer may drop or change a mode to fit those limits; the game’s store page or patch notes say what it offers.'],
    ['Is the Xbox Series S CPU slower than the Series X?', 'Microsoft’s product pages list the same CPU line for both: 8 cores at 3.8 GHz (3.6 GHz with SMT), custom Zen 2. The differences are GPU, memory and the resolution target.'],
    ['Does Series S support 120 Hz?', 'Yes. Microsoft lists a performance target of up to 120 fps for both consoles, in games that offer it and with a compatible display. 4K at 120 Hz is a Series X feature.'],
    ['Why is the Series S image softer on my 4K TV?', 'Microsoft lists 1440p as the Series S gaming resolution, so a 4K TV has to show an image with fewer pixels than it has. The difference is easiest to see on large screens.']
  ],
  sources: [XSX, XSS, SRC.xbtv, SRC.xb120],
  related: ['vrr-120hz-console-setup', 'ps5-performance-vs-fidelity-mode', 'how-to-test-a-settings-change']
};
