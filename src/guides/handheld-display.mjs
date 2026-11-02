import { tbl, fig } from '../h.mjs';

export const switch2 = {
  slug: 'switch-2-docked-vs-handheld',
  group: 'console',
  kicker: 'Guide · Switch 2',
  short: 'Switch 2 docked vs handheld',
  title: 'Switch 2 docked vs handheld: what games change',
  description: 'How Nintendo Switch 2 games change between docked and handheld play: resolution, frame rate, 120 Hz and VRR on the built-in screen, battery and how to compare.',
  h1: 'Switch 2 docked vs handheld: what games change',
  lede: 'The Nintendo Switch 2 is two devices in one: a handheld with its own 1080p screen and a TV console in the dock. When you pull it out of the dock, the console has less power available and a different screen to fill – and games adapt. This guide explains what usually changes, which display features each mode has, and how to judge it yourself.',
  sections: [
    `<h2 id="why">Why games change when you undock</h2>
<p>In the dock, the Switch 2 is powered from the wall and can be cooled for higher clock speeds. In handheld mode it runs on battery, so games typically get less GPU performance to keep heat and power use in check. At the same time, the target changes: the built-in screen is 1080p, while a TV may be 4K. Developers therefore usually set a lower render resolution in handheld mode – and since the screen is small and close to your eyes, that is often hard to notice.</p>
<p>Exactly what changes is decided game by game. Some games keep the same frame rate and lower the resolution; some offer different modes docked and handheld; a few run at a higher frame rate in handheld mode on the 120 Hz screen.</p>
${tbl('Switch 2 display features by mode (Nintendo’s published specifications; check Nintendo for current details)', ['', 'Handheld / tabletop', 'Docked (TV)'], [
  ['Screen', 'Built-in 7.9-inch LCD, 1920×1080', 'Your TV'],
  ['Maximum output', '1080p, up to 120 Hz', 'Up to 4K at 60 Hz; 120 Hz at lower resolutions in supported games'],
  ['HDR', 'Supported', 'Supported with a compatible TV'],
  ['Variable refresh rate', 'Supported on the built-in screen', 'Not listed for TV output at launch'],
  ['Power', 'Battery (less performance budget)', 'Mains power (more performance budget)']
], 'Specifications as published by Nintendo at launch in 2025; features can change with system updates.')}`,
    `<h2 id="typical">What typically changes</h2>
<ul class="do">
<li><b>Render resolution</b> – usually lower in handheld mode. Upscaling (including NVIDIA DLSS, which the Switch 2’s NVIDIA processor supports in games that use it) reconstructs a sharper image.</li>
<li><b>Frame rate</b> – often the same target in both modes, sometimes lower in handheld; some games offer a performance option only docked.</li>
<li><b>Effects</b> – shadows, view distance and ray-traced effects may be reduced in handheld mode.</li>
<li><b>Smoothness</b> – VRR on the built-in screen can make frame-rate fluctuations less visible in handheld mode, which TV play without VRR does not have.</li>
</ul>
${fig('sw-fig', 'Switch 2 in two states: docked with mains power driving a TV, handheld on battery with its own 1080p 120 Hz screen',
`<rect class="g-bg" width="640" height="220"/>
<rect class="g-panel" x="20" y="30" width="290" height="170" rx="8"/><rect class="g-panel" x="330" y="30" width="290" height="170" rx="8"/>
<text class="g-tb" x="36" y="58">Docked</text><text class="g-tb" x="346" y="58">Handheld</text>
<rect x="60" y="78" width="150" height="80" rx="4" fill="none" stroke="#9FB0C0" stroke-width="2"/><text class="g-tm" x="84" y="122">TV · up to 4K</text>
<path class="g-acc-s" d="M220 120h40"/><text class="g-tm" x="226" y="110">power</text>
<rect x="380" y="92" width="190" height="64" rx="12" fill="none" stroke="#9FB0C0" stroke-width="2"/><rect x="402" y="100" width="146" height="48" fill="#16273A"/><text class="g-tm" x="414" y="128">1080p · 120 Hz · VRR</text>
<text class="g-tm" x="36" y="186">more GPU budget · higher resolution</text><text class="g-tm" x="346" y="186">battery · lower resolution, close screen</text>`,
'Docked play has more power and a larger screen to fill; handheld play has less power, but a small, sharp screen with 120 Hz and VRR.', '0 0 640 220')}`,
    `<h2 id="compare">How to compare yourself</h2>
<p>There is no frame counter on the Switch 2, so comparisons are by eye – which is what matters anyway. Play the same short section docked and handheld: a busy area with camera movement and some distant detail. Watch for three things: smoothness while turning the camera, sharpness of distant objects and text, and whether effects such as shadows or reflections look different. If a game offers its own mode choices in its options, compare them in the same section.</p>
<p>Many players find that a lower resolution is barely visible on the handheld screen, while frame-rate drops are just as noticeable as on a TV. If a game offers a performance option, it is often the better choice in handheld mode.</p>`,
    `<h2 id="battery">Battery and comfort in handheld mode</h2>
<p>Battery life depends heavily on the game: demanding 3D games drain the battery much faster than simpler ones. Screen brightness and wireless features also matter. If you play long sessions on the go, lowering the brightness helps more than any in-game option. Nintendo publishes a battery-life range in its specifications; treat it as a range rather than a promise for every game.</p>`,
    `<h2 id="switch1">Switch 1 games on Switch 2</h2>
<p>The Switch 2 runs most original Switch games. Some of them received free updates or paid “Nintendo Switch 2 Edition” versions with improvements such as higher resolution or frame rate; others run as they did on Switch, sometimes benefiting from steadier performance. Nintendo maintains information on compatibility and on which games have updates. As with any update, check the game’s own notes to see what changes in which mode.</p>`,
    `<h2 id="patches">After an update</h2>
<p>Patches for Switch 2 games sometimes adjust handheld and docked modes separately – for example a higher handheld resolution, as in the fictional example in our <a href="/tools/patch-decoder/">Patch Decoder</a>. Set the platform filter to Switch 2 to see only those lines, then compare in your usual section. The general approach is the same as on other consoles: see <a href="/guides/after-update-retest-routine/">the re-test routine</a> and <a href="/guides/vrr-120hz-console-setup/">VRR and 120 Hz on consoles</a> for the TV side.</p>`,
    `<h2 id="choose">Choosing per game</h2>
<p>Many players settle into a pattern: fast action games docked on the TV, slower games or short sessions in handheld mode, where the lower resolution is less visible. If a game offers options such as a performance setting, try them in both modes separately – the right choice docked is not always the right one handheld. And if a game feels different after an update, check whether the patch notes mention only one of the two modes; it is common for an update to improve one and leave the other unchanged.</p>`
  ],
  faq: [
    ['Do Switch 2 games run at lower resolution in handheld mode?', 'Usually yes, because handheld mode has less power and a 1080p screen. On the small screen the difference is often hard to see.'],
    ['Does the Switch 2 support 120 Hz?', 'Nintendo lists up to 120 Hz on the built-in screen and 120 Hz TV output at lower resolutions in supported games. Whether a game uses it is up to the developer.'],
    ['Does the Switch 2 support VRR?', 'Nintendo’s specifications list VRR for the built-in screen in handheld mode. TV output was not listed with VRR at launch; check Nintendo’s current information.'],
    ['Is docked always better?', 'Docked usually means higher resolution and sometimes more effects. Smoothness can be equal or even better in handheld mode in games that use the 120 Hz screen and VRR.']
  ],
  sources: [
    ['Nintendo', 'https://www.nintendo.com/', 'Nintendo Switch 2 specifications and support pages'],
    ['Patch notes of individual Switch 2 games', null, 'Nintendo publishes update histories for its own games on its support site']
  ],
  related: ['vrr-120hz-console-setup', 'steam-deck-frame-cap-tdp-battery', 'after-update-retest-routine']
};

export const steamDeck = {
  slug: 'steam-deck-frame-cap-tdp-battery',
  group: 'console',
  kicker: 'Guide · Steam Deck',
  short: 'Steam Deck frame cap, TDP and battery',
  title: 'Steam Deck: frame cap, TDP and battery basics',
  description: 'How the Steam Deck performance menu works: frame limit, refresh rate, TDP limit, half-rate shading, scaling filter and per-game profiles for smoother play.',
  h1: 'Steam Deck: frame cap, TDP and battery basics',
  lede: 'The Steam Deck gives you more control than any console: a performance menu with frame limit, refresh rate, power limit and scaling options, saved per game if you want. Used together, they turn a game that swings between 35 and 55 frames per second and empties the battery in 90 minutes into one that runs evenly and lasts much longer. This guide explains each option and a simple order to set them.',
  sections: [
    `<h2 id="menu">Where the settings are</h2>
<p>Press the <b>…</b> (Quick Access) button and open the <b>Performance</b> tab (the battery icon). There you find the performance overlay level, the frame-rate limit, the refresh rate, an option to allow tearing, half-rate shading, a TDP limit, manual GPU clock control and the scaling filter. Turn on “Use per-game profile” to store these settings for the game you are playing instead of globally. Option names and layout can change with SteamOS updates.</p>
${tbl('Steam Deck performance options and what they do', ['Option', 'What it does', 'Typical use'], [
  ['Performance overlay', 'Shows FPS, frame time, CPU/GPU load, power and battery', 'Level 2 or higher while tuning, off afterwards'],
  ['Refresh rate', 'Sets the screen’s refresh rate (LCD: 40–60 Hz; OLED: up to 90 Hz)', 'Match it to your frame cap, e.g. 40 Hz for 40 fps'],
  ['Framerate limit', 'Caps FPS at an even share of the refresh rate', 'Pick a cap the game can hold nearly all the time'],
  ['Allow tearing', 'Shows frames immediately instead of waiting for the refresh', 'Lower latency, visible tearing; usually off'],
  ['Half rate shading', 'Shades some screen areas at reduced rate', 'Saves GPU work in supported games, softer image'],
  ['TDP limit', 'Caps the processor’s power (default maximum 15 W)', 'Lower it to save battery when the game has headroom'],
  ['Manual GPU clock', 'Fixes the GPU frequency', 'Rarely needed; for advanced tuning'],
  ['Scaling filter', 'How a lower game resolution is scaled to the screen (e.g. FSR, linear, integer)', 'FSR when rendering below 1280×800']
])}`,
    `<h2 id="cap">Frame cap first</h2>
<p>An uncapped game on the Steam Deck runs as fast as it can, so the frame rate swings with the scene and the APU uses its full power all the time. A cap that the game can hold almost everywhere gives you even frame pacing and leaves power unused – which saves battery and heat.</p>
<p><b>The 40 fps trick.</b> Set the refresh rate to 40 Hz and cap at 40 fps. Each frame then takes 25 ms, exactly halfway between 30 fps (33.3 ms) and 60 fps (16.7 ms), and it fits the refresh rate evenly. Many games that cannot hold 60 run comfortably at 40, and it feels clearly smoother than 30. On the OLED model with its higher refresh range, 45 fps at 90 Hz is another even combination.</p>
${fig('sd-fig', 'Even cap and refresh combinations on Steam Deck: 30 at 60 Hz, 40 at 40 Hz, 45 at 90 Hz, 60 at 60 Hz',
`<rect class="g-bg" width="640" height="200"/>
<text class="g-tm" x="20" y="30">CAP · REFRESH · TIME PER FRAME (even combinations)</text>
<rect class="g-panel" x="20" y="48" width="140" height="120" rx="8"/><rect class="g-panel" x="173" y="48" width="140" height="120" rx="8"/><rect class="g-panel" x="327" y="48" width="140" height="120" rx="8"/><rect class="g-panel" x="480" y="48" width="140" height="120" rx="8"/>
<text class="g-tb" x="36" y="82">30 fps</text><text class="g-tm" x="36" y="108">@ 60 Hz</text><text class="g-tm" x="36" y="132">33.3 ms</text><text class="g-tm" x="36" y="154">most battery</text>
<text class="g-tb" x="189" y="82" style="fill:#FFC531">40 fps</text><text class="g-tm" x="189" y="108">@ 40 Hz</text><text class="g-tm" x="189" y="132">25.0 ms</text><text class="g-tm" x="189" y="154">sweet spot</text>
<text class="g-tb" x="343" y="82">45 fps</text><text class="g-tm" x="343" y="108">@ 90 Hz (OLED)</text><text class="g-tm" x="343" y="132">22.2 ms</text><text class="g-tm" x="343" y="154">OLED only</text>
<text class="g-tb" x="496" y="82">60 fps</text><text class="g-tm" x="496" y="108">@ 60 Hz</text><text class="g-tm" x="496" y="132">16.7 ms</text><text class="g-tm" x="496" y="154">lighter games</text>`,
'Combinations where each frame lasts a whole number of screen refreshes. They avoid uneven frame pacing without needing variable refresh rate.', '0 0 640 200')}`,
    `<h2 id="res">Resolution and upscaling</h2>
<p>The Steam Deck screen is 1280×800. Many games run well at that resolution with medium settings; demanding ones need a lower internal resolution. If the game has its own upscaler – FSR, XeSS or an engine upscaler – use it with the output at 1280×800; at such a low output resolution, the Quality mode is usually the best compromise (see <a href="/guides/dlss-vs-fsr-vs-xess/">DLSS vs FSR vs XeSS</a>). Alternatively, set the game to a lower resolution such as 960×600 and use the Steam Deck’s FSR scaling filter, which sharpens the upscaled image at the system level.</p>
<p>Textures can often stay at medium or high – the Steam Deck has 16 GB of shared memory – but the GPU is modest, so lighting, shadows and volumetrics are the effects to lower first.</p>`,
    `<h2 id="tdp">TDP and battery</h2>
<p>The TDP limit caps how much power the processor may use. With a frame cap in place, many games do not need the full budget; lowering the TDP limit until the frame rate starts to drop, then raising it a step, saves battery. Be careful: CPU and GPU share the budget, so a TDP that is too low makes both slower and can cause stutter in CPU-heavy moments.</p>
<ul class="do">
<li>Set the frame cap first, then lower the TDP while watching the overlay.</li>
<li>Screen brightness has a large effect on battery life – lower it indoors.</li>
<li>Use per-game profiles so a light game does not inherit the settings of a demanding one.</li>
<li>Check the Steam Deck Compatibility rating (Verified, Playable, Unsupported, Unknown) on the store page for known issues.</li>
</ul>`,
    `<h2 id="order">A simple order for any game</h2>
<ol>
<li>Start with the game’s medium or “Steam Deck” preset if it has one.</li>
<li>Turn on the performance overlay and play a demanding section.</li>
<li>Choose a cap the game can hold nearly always: 30, 40 (with 40 Hz), 45 (OLED, 90 Hz) or 60.</li>
<li>If it cannot hold the cap, lower render resolution or use an upscaler before lowering textures.</li>
<li>Lower the TDP limit for battery if the frame rate stays stable.</li>
<li>Save the per-game profile.</li>
</ol>
<p>After a game update, check the profile is still active and expect some shader compilation – Steam’s Shader Pre-Caching helps here, see <a href="/guides/shader-compilation-stutter-after-update/">shader stutter after an update</a>.</p>`
  ],
  faq: [
    ['What is the best frame cap on Steam Deck?', 'The highest one your game holds nearly all the time. 40 fps at 40 Hz is a popular middle ground for demanding games; lighter games can run at 60.'],
    ['Does lowering TDP improve battery life?', 'Yes, if the game still holds its frame cap. Lower it gradually while watching the overlay; too low a limit causes drops and stutter.'],
    ['Should I use the FSR scaling filter?', 'It is useful when a game renders below 1280×800 and has no good built-in upscaler. If the game offers its own upscaler, that one is usually better.'],
    ['What does half rate shading do?', 'It reduces shading work in parts of the image in supported games. It saves GPU time at the cost of some sharpness.']
  ],
  sources: [
    ['Steam Deck', 'https://www.steamdeck.com/', 'official specifications for LCD and OLED models'],
    ['Steam Support', 'https://help.steampowered.com/', 'Steam Deck Quick Access menu and performance settings'],
    ['Steam Deck Compatibility program', null, 'ratings shown on each game’s Steam store page']
  ],
  related: ['dlss-vs-fsr-vs-xess', 'frame-cap-vsync-latency-pc', 'switch-2-docked-vs-handheld']
};

export const vrrConsole = {
  slug: 'vrr-120hz-console-setup',
  group: 'console',
  kicker: 'Guide · display setup',
  short: 'VRR and 120 Hz on consoles',
  title: 'VRR and 120 Hz on consoles: a setup guide',
  description: 'How to set up 120 Hz and VRR for PS5, Xbox Series X|S and Switch 2: TV port, cable, console settings and game mode, plus why VRR ranges and 40 fps modes matter.',
  h1: 'VRR and 120 Hz on consoles: setup guide',
  lede: 'A 120 Hz signal and variable refresh rate (VRR) can make console games feel noticeably smoother – but only if the TV, the HDMI port, the cable, the console and the game all play along. One wrong link in the chain and the option is greyed out or silently off. This guide goes through the chain in order and explains what VRR can and cannot fix.',
  sections: [
    `<h2 id="what">What 120 Hz and VRR do</h2>
<p><b>120 Hz output</b> lets the display refresh twice as often as a 60 Hz signal. Games can then run at up to 120 fps, or use 40 fps modes that fit evenly into 120 Hz (three refreshes per frame).</p>
<p><b>Variable refresh rate</b> lets the display wait for each new frame instead of refreshing on a fixed clock. Without it, a game running at, say, 52 fps on a 60 Hz display either tears (frames switch mid-refresh) or judders (some frames are shown twice). With VRR, the display simply refreshes at 52 Hz. VRR does not make the game faster; it makes uneven frame rates look smooth.</p>
${fig('vrr-fig', 'Fixed refresh repeats frames unevenly when the game runs between refresh steps; VRR refreshes exactly when each frame is ready',
`<rect class="g-bg" width="640" height="220"/>
<text class="g-tm" x="20" y="30">FIXED 60 Hz – GAME AT ≈ 50 FPS</text>
<path class="g-grid" d="M20 70h600"/>
<path class="g-line" d="M40 50v40M140 50v40M240 50v40M340 50v40M440 50v40M540 50v40"/>
<rect class="g-plus" x="44" y="58" width="90" height="24"/><rect class="g-plus" x="144" y="58" width="90" height="24"/><rect class="g-minus" x="244" y="58" width="190" height="24"/><rect class="g-plus" x="444" y="58" width="90" height="24"/>
<text class="g-tm" x="260" y="108">frame shown twice → judder</text>
<text class="g-tm" x="20" y="140">WITH VRR – DISPLAY FOLLOWS THE GAME</text>
<path class="g-grid" d="M20 180h600"/>
<rect class="g-plus" x="44" y="168" width="110" height="24"/><rect class="g-plus" x="160" y="168" width="110" height="24"/><rect class="g-plus" x="276" y="168" width="110" height="24"/><rect class="g-plus" x="392" y="168" width="110" height="24"/><rect class="g-plus" x="508" y="168" width="110" height="24"/>`,
'Simplified illustration: with a fixed refresh, a frame that misses its slot is shown for two refreshes. With VRR, every frame is shown for the same length of time.', '0 0 640 220')}`,
    `<h2 id="chain">The chain: TV, port, cable, console, game</h2>
${tbl('Checklist for 120 Hz and VRR', ['Link', 'What it needs', 'Common pitfall'], [
  ['TV or monitor', 'A 120 Hz panel with HDMI 2.1 features (4K 120 Hz, VRR)', 'Many TVs support 120 Hz only on some HDMI ports'],
  ['HDMI port', 'The port labeled for 4K 120 Hz, HDMI 2.1 or “game”', 'Using the eARC or standard port by habit'],
  ['Cable', 'The cable supplied with the console or a certified Ultra High Speed HDMI cable', 'Old or long cables that fall back to lower bandwidth'],
  ['Between console and TV', 'Direct connection, or a receiver/soundbar with 4K 120 Hz passthrough', 'An older receiver limits the signal'],
  ['TV settings', 'Enhanced HDMI / input signal plus mode on that port; game mode', 'The enhanced signal option is off by default on many TVs'],
  ['Console settings', '120 Hz output and VRR enabled', 'Settings left on 60 Hz after a TV change'],
  ['The game', 'A 120 Hz, 40 fps or VRR-aware mode', 'Not every game supports 120 Hz or uses VRR well']
])}
<p>The TV setting that unlocks full HDMI bandwidth has different names by brand – look for “enhanced”, “input signal plus”, “HDMI ultra HD deep colour” or similar in the TV’s manual. Without it, the console may only see a 60 Hz display.</p>`,
    `<h2 id="consoles">Console settings</h2>
<p><b>PS5:</b> Settings → Screen and Video → Video Output. Set “Enable 120 Hz Output” to Automatic and turn VRR on; the menu also offers applying VRR to games without official support, which helps some and causes flicker or other issues in others. The PS5 shows VRR options only when the connected display reports support.</p>
<p><b>Xbox Series X|S:</b> Settings → General → TV &amp; display options. Choose 120 Hz as the refresh rate and, under Video modes, allow variable refresh rate and Auto Low-Latency Mode. The 4K TV details screen shows what the console detected.</p>
<p><b>Switch 2:</b> According to Nintendo’s specifications, docked TV output reaches 120 Hz at lower resolutions in supported games; VRR is listed for the built-in screen in handheld mode. See <a href="/guides/switch-2-docked-vs-handheld/">Switch 2 docked vs handheld</a>.</p>
<p>Menu names change with system updates; if an option has moved, the platform’s support site has the current path.</p>`,
    `<h2 id="range">VRR ranges and what VRR cannot fix</h2>
<p>Every VRR display has a range – for TVs the lower limit is commonly somewhere around 40 to 48 Hz, the upper limit the panel’s maximum refresh rate. Within the range, VRR works as described. Below it, the display falls back to fixed refresh behavior, unless the system uses low framerate compensation (showing each frame twice to stay in range), which depends on the display and console.</p>
<p>That has two consequences. A 30 fps mode sits below most TV ranges, so VRR does little for it. And a performance mode that drops from 60 into the high 40s benefits a lot. Some games offer an “unlocked” frame rate with VRR – for example running between 60 and 120 fps – which is only smooth with VRR enabled.</p>
<p>VRR also cannot fix stutter: a single frame that takes 100 ms will still be visible, VRR or not. For the difference between low frame rates and stutter, see <a href="/guides/fps-frame-time-1-percent-lows/">FPS, frame time and 1% lows</a>.</p>`,
    `<h2 id="trouble">Troubleshooting</h2>
<ul class="do">
<li>120 Hz option missing or greyed out: check the TV port and its enhanced signal setting first, then the cable.</li>
<li>Black screen or flickering after enabling 120 Hz: try the cable that came with the console and a direct connection without receiver.</li>
<li>VRR enabled but no difference: the game may run at a locked frame rate, or below the TV’s VRR range.</li>
<li>Brightness flicker in dark scenes with VRR: a known behavior on some panels at low frame rates; it can be a reason to turn VRR off for that game.</li>
<li>After a TV firmware update, re-check the enhanced signal settings – updates can reset them.</li>
</ul>`
  ],
  faq: [
    ['Do I need HDMI 2.1 for 120 Hz on PS5 and Xbox?', 'For 4K at 120 Hz, yes – an HDMI 2.1-capable port and a suitable cable. Some displays support 120 Hz at lower resolutions over older HDMI versions.'],
    ['Does VRR increase input lag?', 'No. VRR usually reduces the delay compared with V-Sync, because the display does not make frames wait for a fixed refresh.'],
    ['Why does my 30 fps mode not benefit from VRR?', '30 fps is below the VRR range of most TVs. VRR helps most with frame rates that fluctuate inside the range, for example between 48 and 60.'],
    ['Which HDMI cable do I need?', 'The one supplied with the console, or a certified Ultra High Speed HDMI cable. Older cables may limit bandwidth.']
  ],
  sources: [
    ['HDMI Licensing Administrator', 'https://www.hdmi.org/', 'HDMI 2.1 features, VRR and Ultra High Speed cable certification'],
    ['PlayStation Support', 'https://www.playstation.com/en-us/support/', 'PS5 video output settings'],
    ['Xbox Support', 'https://support.xbox.com/', 'TV &amp; display options on Xbox Series X|S'],
    ['Nintendo', 'https://www.nintendo.com/', 'Switch 2 specifications'],
    ['RTINGS', 'https://www.rtings.com/', 'independent TV measurements including VRR ranges and input lag']
  ],
  related: ['ps5-performance-vs-fidelity-mode', 'xbox-series-s-vs-x-modes', 'frame-cap-vsync-latency-pc']
};
