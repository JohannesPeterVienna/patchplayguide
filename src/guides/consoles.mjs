import { tbl, fig } from '../h.mjs';

export const ps5Modes = {
  slug: 'ps5-performance-vs-fidelity-mode',
  group: 'console',
  kicker: 'Guide · PS5',
  short: 'PS5 performance vs fidelity modes',
  title: 'PS5 performance vs fidelity modes explained',
  description: 'What PS5 performance, fidelity and balanced modes trade in resolution, frame rate and effects, how 120 Hz and VRR change the choice, and how to set a default.',
  h1: 'PS5 performance vs fidelity modes explained',
  lede: 'Many PS5 games ask you to choose between a performance mode and a fidelity, quality or resolution mode – sometimes with a balanced mode in between. The names differ from game to game, but the trade-off is the same: a higher frame rate or a sharper, richer image. This guide explains what each mode usually changes, which TV features they depend on, and how to choose.',
  sections: [
    `<h2 id="trade">The basic trade-off</h2>
<p>A console has a fixed amount of GPU and CPU power. A game can spend it on more pixels and effects per frame, or on more frames per second – not both. A <b>fidelity</b> mode (also called quality or resolution mode) usually targets 30 frames per second with a higher resolution and more effects, sometimes including ray tracing. A <b>performance</b> mode usually targets 60 frames per second with a lower resolution and fewer or simpler effects. Some games target 30 and 60, others 60 and 120.</p>
<p>At 30 frames per second each frame may take up to 33.3 milliseconds; at 60 only 16.7. Halving the time per frame means the game has to cut a lot of GPU work, which is why performance modes often use dynamic resolution – the internal resolution drops in heavy scenes – and an upscaler to reach the display resolution.</p>
${tbl('Typical differences between PS5 modes (varies by game)', ['', 'Fidelity / quality', 'Balanced (if offered)', 'Performance'], [
  ['Frame-rate target', 'Usually 30 fps', 'Often 40 fps (needs 120 Hz output)', 'Usually 60 fps'],
  ['Render resolution', 'Highest', 'Between the two', 'Lower, often dynamic'],
  ['Ray tracing', 'More often included', 'Sometimes', 'Often reduced or off'],
  ['Effects and view distance', 'Highest', 'High', 'Reduced'],
  ['Input response', 'Slowest', 'Faster', 'Fastest'],
  ['Best for', 'Slow, cinematic games on a large TV', '120 Hz TVs, a middle ground', 'Action, shooters, most players']
], 'These are general patterns, not rules; each game defines its own modes.')}`,
    `<h2 id="balanced">Why 40 fps balanced modes need 120 Hz</h2>
<p>A 60 Hz TV refreshes every 16.7 ms. A 30 fps game shows each frame for exactly two refreshes, a 60 fps game for one – both are even. A 40 fps game would need 1.5 refreshes per frame, which a 60 Hz signal cannot do evenly, so motion would judder. A 120 Hz signal refreshes every 8.3 ms, and 40 fps fits exactly three refreshes per frame (25 ms). That is why 40 fps modes appear only when the PS5 outputs 120 Hz.</p>
${fig('ps-fig', 'Frame time ladder: 30 fps is 33.3 ms, 40 fps is 25 ms, 60 fps is 16.7 ms; 40 fps sits halfway in frame time',
`<rect class="g-bg" width="640" height="210"/>
<text class="g-tm" x="20" y="30">TIME PER FRAME</text>
<rect x="40" y="50" width="400" height="30" fill="#7CC4FF"/><text class="g-t" x="456" y="71">30 fps · 33.3 ms</text>
<rect class="g-acc" x="40" y="96" width="300" height="30"/><text class="g-t" x="356" y="117">40 fps · 25.0 ms</text>
<rect class="g-plus" x="40" y="142" width="200" height="30"/><text class="g-t" x="256" y="163">60 fps · 16.7 ms</text>
<text class="g-tm" x="40" y="198">40 fps sits exactly halfway between 30 and 60 in frame time</text>`,
'In frame time – what you actually feel – 40 fps is exactly halfway between 30 and 60, although the number looks closer to 30.', '0 0 640 210')}
<p>For the same reason, 40 fps feels like a bigger step up from 30 than the numbers suggest: it saves 8.3 ms per frame, exactly half of the 16.7 ms that 60 fps saves.</p>`,
    `<h2 id="settings">The PS5 settings that matter</h2>
<ul class="do">
<li><b>Game Presets.</b> In the PS5 settings under Saved Data and Game/App Settings, the Game Presets section lets you set a default preference – Performance Mode or Resolution Mode – that supported games use when they start. Games can still offer their own menu.</li>
<li><b>120 Hz output.</b> Under Screen and Video → Video Output, “Enable 120 Hz Output” needs to be on (Automatic) for 120 Hz and 40 fps modes. It requires a TV or monitor and HDMI port that support 120 Hz.</li>
<li><b>VRR.</b> In the same menu, VRR can be enabled for compatible HDMI 2.1 displays. It smooths frame-rate dips in performance modes. There is also an option to apply VRR to games without official support, which can help some and cause issues in others.</li>
<li><b>TV game mode.</b> On the TV itself, a game mode or low-latency setting removes processing that adds input delay.</li>
</ul>
<p>Our <a href="/guides/vrr-120hz-console-setup/">VRR and 120 Hz setup guide</a> walks through TV, cable and console settings step by step.</p>`,
    `<h2 id="choose">How to choose</h2>
<p><b>Choose performance</b> if you play action games, shooters or anything where camera movement and reaction time matter, if you sit at a normal distance from a 4K TV where resolution differences are small, or if you are sensitive to 30 fps motion. This is the most common choice and a sensible default.</p>
<p><b>Choose fidelity</b> for slow, cinematic games on a large screen, especially when ray-traced lighting is part of the look, and if 30 fps does not bother you.</p>
<p><b>Choose balanced (40 fps)</b> if your TV supports 120 Hz and the performance mode looks too soft, or if the fidelity mode feels sluggish.</p>
<p>Try each mode for a few minutes in the same area, turning the camera and moving quickly. How it feels in motion is a better guide than a screenshot.</p>`,
    `<h2 id="patches">When updates change modes</h2>
<p>Updates often adjust modes: a new 40 fps option, a changed resolution range, ray tracing added to performance mode, or support for the PS5 Pro. After such an update, check that your chosen mode is still selected – both the game menu and the system Game Presets – and compare again if a mode’s target changed. The <a href="/tools/patch-decoder/">Patch Decoder</a> puts such lines in “Console &amp; handheld modes” so you can filter for PS5. If you own a PS5 Pro, read <a href="/guides/ps5-pro-enhanced-games/">what PS5 Pro enhanced games change</a>.</p>`
  ],
  faq: [
    ['Is performance mode or fidelity mode better on PS5?', 'Neither is better in general. Performance mode gives a higher frame rate and faster response; fidelity mode gives a sharper image and more effects at a lower frame rate. Most players prefer performance in action games.'],
    ['Why does my PS5 game not show a 40 fps mode?', 'Most 40 fps modes need 120 Hz output. Check that “Enable 120 Hz Output” is on and that your TV and HDMI port support 120 Hz. Not every game offers 40 fps.'],
    ['What does the Game Presets setting do?', 'It sets a default preference for performance or resolution that supported games use. Games can still offer their own options in their menus.'],
    ['Does VRR help in fidelity mode?', 'It helps most when the frame rate fluctuates within the display’s VRR range. Many 30 fps modes sit below the range of typical TVs, where VRR has less effect.']
  ],
  sources: [
    ['PlayStation Support', 'https://www.playstation.com/en-us/support/', 'PS5 video output, 120 Hz, VRR and Game Presets settings'],
    ['HDMI Licensing Administrator', 'https://www.hdmi.org/', 'HDMI 2.1 features such as VRR and 4K 120 Hz'],
    ['Patch notes and settings menus of individual games', null, 'each game defines its own modes']
  ],
  related: ['vrr-120hz-console-setup', 'ps5-pro-enhanced-games', 'xbox-series-s-vs-x-modes']
};

export const ps5Pro = {
  slug: 'ps5-pro-enhanced-games',
  group: 'console',
  kicker: 'Guide · PS5 Pro',
  short: 'PS5 Pro enhanced games',
  title: 'PS5 Pro enhanced games: what actually changes',
  description: 'What the “PS5 Pro Enhanced” label means, how the stronger GPU, ray tracing and PSSR upscaling are used, and how to compare modes on PS5 Pro after an update.',
  h1: 'PS5 Pro enhanced games: what actually changes',
  lede: 'The PS5 Pro runs the same games as the PS5, but with a stronger GPU, faster ray tracing and Sony’s machine-learning upscaler, PSSR. How much of that you see depends on whether a game has been updated for it – and on what the developer chose to spend the extra power on. This guide explains the possibilities and how to check them yourself.',
  sections: [
    `<h2 id="hardware">What the PS5 Pro adds</h2>
<p>Sony released the PS5 Pro in November 2024. Compared with the standard PS5, its three headline improvements are a larger, faster GPU (Sony stated up to 45% faster rendering at announcement), considerably faster ray tracing (stated as two to three times in some cases), and <b>PlayStation Spectral Super Resolution (PSSR)</b>, an upscaler based on machine learning. The CPU is essentially the same as in the PS5, which matters: games that are limited by the CPU gain less.</p>
${tbl('PS5 and PS5 Pro in comparison (as published by Sony; rounded)', ['', 'PS5', 'PS5 Pro'], [
  ['GPU', 'Baseline', 'Larger and faster GPU (“up to 45% faster rendering” per Sony)'],
  ['Ray tracing', 'Supported', 'Faster ray tracing (“2–3×” in some cases per Sony)'],
  ['Upscaling', 'Game-specific (e.g. engine upscalers, FSR)', 'Adds PSSR for games that support it'],
  ['CPU', 'Baseline', 'Essentially the same CPU design'],
  ['Game library', 'PS5 and PS4 games', 'Same library; Pro-specific improvements need game support']
], 'Figures are Sony’s own launch statements, not our measurements. Real gains depend on each game.')}`,
    `<h2 id="label">What “PS5 Pro Enhanced” means</h2>
<p>Games updated to use the extra power carry a “PS5 Pro Enhanced” label. The label says that the developer made changes for the Pro; it does not say which. In practice developers have used the extra performance in different ways:</p>
<ul class="do">
<li><b>Sharper performance mode.</b> The 60 fps mode keeps its frame rate but renders at a higher resolution or upscales with PSSR – often the most visible change.</li>
<li><b>More stable frame rate.</b> The same mode drops less often below its target.</li>
<li><b>Ray tracing in performance mode.</b> Effects that were only in the fidelity mode on PS5 become available at 60 fps.</li>
<li><b>A dedicated Pro mode.</b> Some games add their own mode that combines elements of both.</li>
</ul>
<p>Because the choices differ, read the game’s own description or patch notes. The same game can offer quite different results on PS5 and PS5 Pro, and some modes may disappear or be renamed on the Pro.</p>`,
    `<h2 id="unpatched">Games without a Pro update</h2>
<p>Games without a Pro update still run on the PS5 Pro. The console offers system-level options intended to help some of them – Sony has described a “Game Boost” that can improve performance in some PS5 and PS4 games, and an image-quality enhancement setting for some PS5 games that were not updated for the Pro. Whether and how much these help depends on the game. Because the details of these system features may change with firmware updates, check the current descriptions in the PS5 Pro settings and on PlayStation Support.</p>`,
    `<h2 id="compare">How to compare modes on a PS5 Pro</h2>
${fig('pro-fig', 'Comparison sheet: same scene, three modes, notes on sharpness, smoothness and ray tracing',
`<rect class="g-bg" width="640" height="220"/>
<text class="g-tm" x="20" y="30">YOUR OWN MODE COMPARISON – SAME SCENE, 2–3 MINUTES EACH</text>
<rect class="g-panel" x="20" y="46" width="600" height="156" rx="8"/>
<path class="g-grid" d="M20 86h600M20 126h600M20 166h600M200 46v156M340 46v156M480 46v156"/>
<text class="g-tm" x="34" y="72">mode</text><text class="g-tm" x="214" y="72">sharpness</text><text class="g-tm" x="354" y="72">smoothness</text><text class="g-tm" x="494" y="72">ray tracing</text>
<text class="g-t" x="34" y="112">Performance</text><text class="g-t" x="34" y="152">Fidelity</text><text class="g-t" x="34" y="192">Pro mode</text>
<text class="g-plus" x="380" y="112" style="font:700 18px var(--mono)">+</text><text class="g-plus" x="240" y="152" style="font:700 18px var(--mono)">+</text><text class="g-acc" x="240" y="112" style="font:700 18px var(--mono)">~</text><text class="g-minus" x="380" y="152" style="font:700 18px var(--mono)">−</text>
<text class="g-tm" x="214" y="192">fill in</text><text class="g-tm" x="354" y="192">fill in</text><text class="g-tm" x="494" y="192">fill in</text>`,
'A simple comparison sheet for your own eyes. The signs in the first two rows are an example of how you might fill it in, not data for any particular game.', '0 0 640 220')}
<ol>
<li>Pick one scene with fine detail (foliage, fences, distant buildings) and some motion.</li>
<li>Play two to three minutes in each mode, turning the camera and moving quickly.</li>
<li>Note sharpness, smoothness, and whether ray-traced reflections or lighting are present.</li>
<li>Decide by how it feels in motion, not by a still image.</li>
</ol>
<p>PSSR and other upscalers can show artifacts on fine detail or particles; patches have changed upscaler behavior in some games. After an update, compare again – the <a href="/guides/after-update-retest-routine/">re-test routine</a> works on consoles too.</p>`,
    `<h2 id="worth">When the Pro makes a difference</h2>
<p>The Pro helps most in games that are GPU-limited on the standard PS5 and that have been updated to use it – typically graphically demanding games whose performance modes look soft or drop frames. It helps less in games that are CPU-limited, because the CPU is essentially unchanged, and in games that already run at a stable, sharp 60 fps on the PS5. The <a href="/guides/ps5-performance-vs-fidelity-mode/">PS5 modes guide</a> explains the base trade-off, and the <a href="/guides/vrr-120hz-console-setup/">VRR and 120 Hz guide</a> covers display settings that matter just as much.</p>`,
    `<h2 id="display">The display still matters</h2>
<p>A sharper image is only visible on a display that shows it well. On a 4K TV at a typical viewing distance, the difference between a soft and a sharp performance mode is visible; on a 1080p TV the extra resolution mostly improves anti-aliasing. VRR and 120 Hz support on the TV matter as much as the console for how smooth a performance mode feels.</p>`,
    `<h2 id="notes">Reading patch notes as a PS5 Pro owner</h2>
<p>Pro-related lines are easy to overlook because they are often short: “Added PS5 Pro support”, “Improved image quality on PS5 Pro”, or “PSSR updated”. Set the <a href="/tools/patch-decoder/">Patch Decoder</a> platform filter to PS5 to catch them – the decoder recognizes “PS5 Pro” and “PSSR”. After such a line, compare your mode again: developers sometimes change which mode is recommended on the Pro, or the default mode after the update.</p>`
  ],
  faq: [
    ['Do all PS5 games look better on PS5 Pro?', 'No. Games updated as “PS5 Pro Enhanced” use the extra power as their developers chose. Other games run as on PS5, with possible help from system-level features that apply only to some titles.'],
    ['What is PSSR?', 'PlayStation Spectral Super Resolution, a machine-learning upscaler on the PS5 Pro. Games that support it render at a lower resolution and reconstruct a sharper image.'],
    ['Does the PS5 Pro have a faster CPU?', 'Its CPU is essentially the same as in the PS5. Games limited by the CPU therefore gain less than GPU-limited games.'],
    ['Should I use performance mode on PS5 Pro?', 'In many enhanced games the Pro’s main benefit is a sharper or more stable performance mode, so it is a good starting point. Compare modes in the same scene to decide.']
  ],
  sources: [
    ['PlayStation', 'https://www.playstation.com/', 'PS5 Pro product information and the PlayStation Blog'],
    ['PlayStation Support', 'https://www.playstation.com/en-us/support/', 'PS5 Pro settings'],
    ['Patch notes of PS5 Pro Enhanced games', null, 'developers describe what their Pro update changes']
  ],
  related: ['ps5-performance-vs-fidelity-mode', 'vrr-120hz-console-setup', 'dlss-vs-fsr-vs-xess']
};

export const xbox = {
  slug: 'xbox-series-s-vs-x-modes',
  group: 'console',
  kicker: 'Guide · Xbox',
  short: 'Xbox Series S vs X modes',
  title: 'Xbox Series S vs X: why game modes differ',
  description: 'Why the same game offers fewer or different modes on Xbox Series S than on Series X: GPU power, memory and resolution targets, plus the settings to check.',
  h1: 'Xbox Series S vs X: why game modes differ',
  lede: 'The Xbox Series S and Series X play the same games, but often not with the same options. A game may offer a 60 fps mode and ray tracing on Series X and only one mode on Series S. The reason is not arbitrary: the two consoles share nearly the same CPU but differ greatly in GPU power and memory.',
  sections: [
    `<h2 id="hardware">What differs between the consoles</h2>
${tbl('Xbox Series X and Series S (Microsoft’s published specifications, rounded)', ['', 'Series X', 'Series S'], [
  ['CPU', '8 cores, Zen 2, up to 3.8 GHz', '8 cores, Zen 2, up to 3.6 GHz'],
  ['GPU compute', 'About 12 teraflops', 'About 4 teraflops'],
  ['Memory', '16 GB GDDR6', '10 GB GDDR6'],
  ['Resolution target (Microsoft)', '4K', '1440p'],
  ['Disc drive', 'Yes (digital model also available)', 'No']
], 'The teraflop figure is only a rough indicator of GPU power; architecture is the same, so it is a fair comparison between these two consoles.')}
<p>The key points: the CPUs are close, so game logic, physics and simulation run at similar speed. The GPU of the Series S has roughly a third of the compute of the Series X, and the Series S has less memory – and a smaller share of it is available to games. Developers have to fit the same game into both.</p>`,
    `<h2 id="why">Why modes are cut or changed</h2>
<p><b>Lower resolution first.</b> The Series S was designed for a 1440p target instead of 4K, so most games run at a lower render resolution there, often with dynamic resolution and upscaling. On a 1080p or 1440p TV that is perfectly fine; on a large 4K TV the image is noticeably softer.</p>
<p><b>Memory is the hard limit.</b> Less memory means smaller texture budgets, fewer high-detail assets and less room for ray-tracing data. Unlike resolution, memory cannot be scaled smoothly, which is why some features – ray tracing, very high texture settings, sometimes even a 60 fps mode with all its buffers – are dropped on Series S.</p>
<p><b>CPU-heavy games stay similar.</b> Because the CPUs are close, a game that is CPU-limited at 30 fps on Series X will usually also be 30 fps on Series S. A 60 fps mode on Series X that relies on GPU headroom is the one most likely to disappear on Series S.</p>
${fig('xb-fig', 'Bars comparing Series S and Series X: CPU nearly equal, GPU about one third, memory about five eighths',
`<rect class="g-bg" width="640" height="210"/>
<text class="g-tm" x="20" y="30">SERIES S RELATIVE TO SERIES X (Series X = full bar)</text>
<text class="g-t" x="20" y="74">CPU</text><rect class="g-panel" x="110" y="58" width="480" height="24"/><rect class="g-plus" x="110" y="58" width="455" height="24"/><text class="g-tk" x="120" y="75">nearly the same</text>
<text class="g-t" x="20" y="124">GPU</text><rect class="g-panel" x="110" y="108" width="480" height="24"/><rect x="110" y="108" width="160" height="24" fill="#7CC4FF"/><text class="g-tm" x="280" y="125">≈ one third</text>
<text class="g-t" x="20" y="174">Memory</text><rect class="g-panel" x="110" y="158" width="480" height="24"/><rect class="g-minus" x="110" y="158" width="300" height="24"/><text class="g-tm" x="420" y="175">10 of 16 GB total</text>`,
'Derived from Microsoft’s published specifications: clock speeds for the CPU, teraflops for the GPU and total memory. Memory available to games differs further, because the system reserves part of it.', '0 0 640 210')}`,
    `<h2 id="settings">Xbox settings worth checking</h2>
<ul class="do">
<li><b>Refresh rate.</b> Settings → General → TV &amp; display options: set 120 Hz if your TV supports it. Some games offer 120 fps or 40 fps modes only with 120 Hz output.</li>
<li><b>Variable refresh rate.</b> Under Video modes in the same menu, allow VRR for a compatible display. It smooths frame-rate dips.</li>
<li><b>Auto Low Latency Mode (ALLM).</b> Lets the TV switch to its game mode automatically.</li>
<li><b>Game-specific modes.</b> Many games show performance and quality options only on Series X, or name them differently on Series S.</li>
</ul>
<p>Setting names can change with system updates; the <a href="/guides/vrr-120hz-console-setup/">VRR and 120 Hz guide</a> explains the TV side as well.</p>`,
    `<h2 id="choose">Choosing a mode on each console</h2>
<p>On <b>Series X</b> the choice works like on PS5: performance for action and responsiveness, quality for cinematic games – see <a href="/guides/ps5-performance-vs-fidelity-mode/">performance vs fidelity modes</a>, which applies equally here. On <b>Series S</b>, if a game offers both modes, the performance mode often drops resolution considerably; on a 1080p TV that is usually a good trade, on a large 4K TV judge the softness yourself.</p>
<p>If a game offers only one mode on Series S, it is often the developer’s decision to keep memory and frame-rate stable. Patches sometimes add modes to Series S later, after optimization; the <a href="/tools/patch-decoder/">Patch Decoder</a> helps you spot such lines with the platform filter set to Xbox.</p>`,
    `<h2 id="patches">Patches and the Series S</h2>
<p>Series S versions are often optimized after launch: memory savings allow better textures, new modes or a more stable frame rate. Equally, a large content update can make a game heavier. When an update mentions “Series S” or “Xbox Series X|S”, re-check your mode and compare in a familiar scene, following the <a href="/guides/after-update-retest-routine/">re-test routine</a>.</p>`,
    `<h2 id="tv">Which TV suits which console</h2>
<p>The Series S makes most sense with a 1080p or 1440p display, or a 4K TV viewed from a distance. The Series X is aimed at 4K TVs, and its 60 and 120 fps modes benefit most from an HDMI 2.1 TV with VRR. On either console, the TV’s game mode affects input delay more than most in-game options.</p>`,
    `<h2 id="smart">One purchase, the right version</h2>
<p>Microsoft’s Smart Delivery system, used by many games, installs the version that fits your console automatically, so the same purchase gets Series S or Series X optimizations as appropriate. The practical consequence: when you move from a Series S to a Series X, or the other way round, a game’s available modes can change after the new version is installed. Check the mode settings in each game after switching consoles, just as after an update.</p>`
  ],
  faq: [
    ['Why does my game have no performance mode on Xbox Series S?', 'Usually because the Series S has much less GPU power and memory. Developers sometimes drop a mode to keep resolution and memory use acceptable.'],
    ['Is the Xbox Series S CPU slower than the Series X?', 'Only slightly – both use eight Zen 2 cores, with slightly lower clock speeds on Series S. The big differences are GPU power and memory.'],
    ['Does Series S support 120 Hz?', 'Yes, Microsoft lists up to 120 fps for both consoles, in games that offer it and with a compatible display.'],
    ['Why is the Series S image softer on my 4K TV?', 'Series S games usually render at a lower resolution, targeting 1440p or below, and upscale to 4K. The difference is most visible on large 4K screens.']
  ],
  sources: [
    ['Xbox', 'https://www.xbox.com/', 'Series X and Series S specifications'],
    ['Xbox Support', 'https://support.xbox.com/', 'TV &amp; display options, 120 Hz and VRR settings'],
    ['Xbox Wire', null, 'Microsoft’s official Xbox news site']
  ],
  related: ['vrr-120hz-console-setup', 'ps5-performance-vs-fidelity-mode', 'after-update-retest-routine']
};
