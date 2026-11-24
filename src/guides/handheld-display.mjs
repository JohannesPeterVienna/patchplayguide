// Switch 2, Steam Deck and VRR/120 Hz guides.
// Rewritten on 2026-11-24: official pages read in full that day replace earlier search-engine extracts; generic
// "usually/typically" statements replaced by what Nintendo, Valve, Sony and Microsoft state, or marked as our suggestion.
import { createRequire } from 'node:module';
import { tbl, fig, tryBox, SRC, read24 } from '../h.mjs';
const require = createRequire(import.meta.url);
const FT = require('../assets/js/frametime-core.js');
const R = require('../assets/js/resolution-core.js');
const N = require('../data/names-core.js');
const U = require('../data/upgrades-core.js');
const r2 = (x) => FT.round(x, 2).toFixed(2).replace(/\.?0+$/, '');
const mpx = (w, h) => (w * h / 1e6).toFixed(2);
const nin = (id) => { const [label, url] = U.SOURCES[id]; return read24(label, url); };

// --- Switch 2 ---
const thr = (label, w, h, fps) => [label, `${w}×${h}`, `${fps} fps`, `${mpx(w, h)} MP`, `${Math.round(w * h * fps / 1e6)} million`];
export const switch2 = {
  slug: 'switch-2-docked-vs-handheld',
  changelog: [['2026-11-02', 'First published.'], ['2026-11-03', 'TV VRR in docked mode since the system update of September 10, 2026 added; launch table marked as historical.'],
    ['2026-11-18', 'Worked example added: maximum pixel throughput per output mode and a table of TV settings, based on Nintendo’s tech specs and System Settings overview.'],
    ['2026-11-24', 'Nintendo’s pages read in full: the specification table now shows the current tech specs (VRR up to 120 Hz also for TV output); update 23.0.0 dated as Nintendo’s update history and features page give it; Handheld Mode Boost (update 22.0.0) added; general statements about what games “usually” change replaced by Nintendo’s own mode descriptions; links to the console upgrade reference.']],
  group: 'console',
  kicker: 'Guide · Switch 2',
  short: 'Switch 2 docked vs handheld',
  title: 'Switch 2 docked vs handheld: what games change',
  description: 'How Nintendo Switch 2 games change between TV and handheld play: output limits, Nintendo’s own mode examples, VRR on the TV, Handheld Mode Boost and battery.',
  h1: 'Switch 2 docked vs handheld: what games change',
  lede: 'The Nintendo Switch 2 is a handheld with its own 1080p screen and a TV console in the dock. The two have different limits – and Nintendo’s own games show how developers use them, for example 4K on the TV against 1080p on the built-in screen. This guide sets out the limits from Nintendo’s tech specs, what Nintendo states for specific games, what changed with the system updates of 2026, and how to judge it yourself.',
  sections: [
    `<h2 id="why">Two screens, two sets of limits</h2>
<p>In handheld and tabletop mode the game draws for the built-in 7.9-inch screen with 1920×1080 pixels; in TV mode it draws for whatever the TV accepts, up to 4K. Nintendo’s tech specs set the limits for each:</p>
${tbl('Nintendo Switch 2 display and output limits (Nintendo tech specs, read November 24, 2026)', ['', 'Handheld / tabletop', 'TV mode (docked)'], [
  ['Screen or output', 'Built-in 7.9-inch LCD, 1920×1080', 'HDMI from the dock'],
  ['Maximum resolution', '1920×1080, following the screen', '3840×2160 (4K) at 60 fps'],
  ['120 fps', 'Yes (screen “VRR up to 120 Hz”)', 'When 1920×1080 or 2560×1440 is selected'],
  ['HDR', 'HDR10', 'HDR10 (needs an HDR display)'],
  ['Variable refresh rate', 'VRR up to 120 Hz', 'VRR up to 120 Hz, since system update 23.0.0 (see below)'],
  ['Battery life', 'About 2 to 6.5 hours; Nintendo: depends on the game', '–']
], 'Nintendo’s wording, shortened. 4K, HDR and VRR in TV mode are available in supported games and need a compatible display.')}
<p>How much a game changes between the two is decided by its developer. For original Switch games, Nintendo states the direction itself: its <b>Handheld Mode Boost</b> setting lets them run undocked “with performance equivalent to TV mode”, which increases power consumption – so the TV mode of those games has more performance to work with.</p>
<p><b>VRR on the TV since September 2026.</b> System update 23.0.0 added VRR in TV mode and VRR settings under Display in System Settings: “When both the software and TV support it, video will be output at a refresh rate that matches the game’s processing.” The dock needs a firmware update first (System Settings → System → Dock Update). Nintendo’s update history (Americas) dates 23.0.0 to September 9, 2026; its features page says September 10, 2026. On the built-in screen, VRR was available from launch.</p>`,
    `<h2 id="throughput">Worked example: pixels per second in each mode</h2>
<p>Multiply resolution by frame rate and you see what each output combination demands at most.</p>
${tbl('Maximum pixel throughput of the Switch 2 output modes (limits from Nintendo’s tech specs; arithmetic ours)', ['Mode', 'Resolution', 'Maximum frame rate', 'Pixels per frame', 'Pixels per second'], [
  thr('TV, 4K', 3840, 2160, 60), thr('TV, 1440p', 2560, 1440, 120), thr('TV, 1080p', 1920, 1080, 120), thr('Handheld', 1920, 1080, 120), thr('Handheld at 60 fps', 1920, 1080, 60)
], 'These are output limits, not what a game renders internally.')}
<p>The table explains two things. A 4K TV shows four times the pixels of the built-in screen, so a game has to render more, upscale or drop detail to fill it. And 1440p at 120 fps is almost as demanding as 4K at 60 fps (442 against 498 million pixels per second), which is why a 120 fps mode comes with a lower resolution – exactly what Nintendo states for Metroid Prime 4 below.</p>
<p>The controls are in System Settings. Nintendo’s settings overview lists <b>TV resolution</b> with Automatic, 720p, 1080p, 1440p and 2160p (4K), and an on/off switch for <b>120Hz output</b>; the VRR settings came with update 23.0.0.</p>
${tbl('What to set for which TV', ['Your TV', 'TV resolution', '120Hz output', 'What you get'], [
  ['4K, 60 Hz', 'Automatic or 2160p', 'Off', '4K at up to 60 fps'],
  ['4K, 120 Hz', 'Automatic – or 1440p/1080p for a game with a 120 fps mode', 'On', '4K at 60 fps; 120 fps only at 1440p or 1080p'],
  ['1440p monitor, 120 Hz or more', '1440p', 'On', 'Up to 120 fps in games that offer it'],
  ['1080p TV or monitor', '1080p', 'On if the display supports 120 Hz', 'Same pixel count as the built-in screen']
], 'Derived from the limits in Nintendo’s tech specs. Whether a game offers a 120 fps mode is the developer’s decision.')}
${tryBox('Check how a frame rate lands on your TV’s refresh rate – for example 40 fps at 120 Hz.', '/tools/frame-time-calculator/?fps=40&hz=120', 'Open the Frame Time Calculator')}`,
    `<h2 id="examples">What Nintendo states for specific games</h2>
<p>Nintendo describes the docked and handheld output of several Switch 2 Editions in numbers. Two show the pattern clearly:</p>
${tbl('Docked and handheld output as Nintendo states it (Nintendo, About Nintendo Switch 2 Edition games)', ['Game', 'TV mode', 'Handheld / tabletop'], [
  ['Metroid Prime 4: Beyond – Quality Mode', '4K at 60 fps', '1080p at 60 fps'],
  ['Metroid Prime 4: Beyond – Performance Mode', '1080p at 120 fps (needs a 120 Hz display)', '720p at 120 fps'],
  ['Super Mario Party Jamboree', 'WQHD (1440p)', 'Full HD (1080p)']
], 'Both display modes of Metroid Prime 4 support HDR. Other Switch 2 Editions and free updates are listed with Nintendo’s wording in the console upgrade reference.')}
${fig('sw-fig', 'Switch 2 in two states: docked driving a TV up to 4K at 60 or 120 fps at 1080p to 1440p, handheld on its own 1080p screen with up to 120 Hz and VRR',
`<rect class="g-bg" width="640" height="220"/>
<rect class="g-panel" x="20" y="30" width="290" height="170" rx="8"/><rect class="g-panel" x="330" y="30" width="290" height="170" rx="8"/>
<text class="g-tb" x="36" y="58">TV mode</text><text class="g-tb" x="346" y="58">Handheld</text>
<rect x="60" y="78" width="150" height="80" rx="4" fill="none" stroke="#9FB0C0" stroke-width="2"/><text class="g-tm" x="84" y="122">TV · up to 4K</text>
<path class="g-acc-s" d="M220 120h40"/><text class="g-tm" x="226" y="110">dock</text>
<rect x="380" y="92" width="190" height="64" rx="12" fill="none" stroke="#9FB0C0" stroke-width="2"/><rect x="402" y="100" width="146" height="48" fill="#16273A"/><text class="g-tm" x="414" y="128">1080p · 120 Hz · VRR</text>
<text class="g-tm" x="36" y="186">4K at 60 · 120 fps at 1080p/1440p</text><text class="g-tm" x="346" y="186">at most 1080p · battery 2–6.5 h</text>`,
'Limits from Nintendo’s tech specs. In Metroid Prime 4, the 120 fps mode runs at 1080p on the TV and at 720p on the built-in screen.', '0 0 640 220')}
<p>The direction is the same in both games: the TV gets the higher resolution, the built-in screen a lower one, and a 120 fps mode costs resolution on both. What a game does with the extra performance in TV mode – effects, view distance – is not part of these descriptions.</p>`,
    `<h2 id="switch1">Switch 1 games on Switch 2</h2>
<p>Original Switch games can run on Switch 2 in three ways. A <b>Nintendo Switch 2 Edition</b> is the original game with a paid upgrade pack; Nintendo lists improvements such as higher frame rates and resolution, HDR, faster loading and sometimes new content. <b>Free updates</b> improve selected games on Switch 2 – most often the image quality on the Switch 2 screen and on high-resolution TVs, in some games the frame rate or HDR. All other compatible games run unchanged – unless you turn on <b>Handheld Mode Boost</b>.</p>
<p>Handheld Mode Boost arrived with system update 22.0.0 (March 16, 2026) under System Settings → System → Nintendo Switch Software Handling and is off by default; since 23.0.0 it can also be switched from the Quick Settings. Nintendo’s description: compatible Switch games run in handheld and tabletop mode as if in TV mode, which “can result in improved visuals” but may increase power consumption. Some games are unaffected, it has no effect on Switch 2 games, it may stop touch-screen controls from working, and attached Joy-Con 2 controllers are treated as a Pro Controller. The <a href="/reference/console-upgrades/?on=switch2">console upgrade reference</a> lists Nintendo’s statements per game.</p>`,
    `<h2 id="compare">How to compare yourself</h2>
<p>Play the same short section docked and handheld: a busy area with camera movement and some distant detail. Watch for three things: smoothness while turning the camera, sharpness of distant objects and text, and whether effects such as shadows or reflections look different. If a game offers its own mode choice, as Metroid Prime 4 does, compare both modes in both places – the right choice on the TV is not necessarily the right one on the built-in screen, which shows at most 1080p anyway.</p>
<p>Battery life is the other half of the handheld decision. Nintendo gives about 2 to 6.5 hours and says it depends on the games you play; Handheld Mode Boost moves a Switch game towards the short end, because it raises power consumption. Patches can change one mode and leave the other alone – read the notes for the words “TV mode” and “handheld mode”, and use the <a href="/guides/how-to-test-a-settings-change/#after-update">re-test routine</a> after an update.</p>`
  ],
  faq: [
    ['Do Switch 2 games run at a lower resolution in handheld mode?', 'The built-in screen shows at most 1920×1080, while TV mode goes up to 4K. Nintendo’s own examples follow that: Metroid Prime 4 runs at 4K or 1080p on the TV and at 1080p or 720p in handheld mode.'],
    ['Does the Switch 2 support 120 Hz?', 'Yes. Nintendo lists VRR up to 120 Hz on the built-in screen, and 120 fps TV output when 1920×1080 or 2560×1440 is selected. Whether a game uses it is up to the developer.'],
    ['Does the Switch 2 support VRR on the TV?', 'Yes, since system update 23.0.0 in September 2026. It needs a dock firmware update, a TV that supports VRR and a game that supports it; the settings are under Display in System Settings.'],
    ['What is Handheld Mode Boost?', 'A system setting since update 22.0.0 that makes compatible original Switch games run undocked as if in TV mode. Nintendo says it can improve visuals but raises power consumption; it has no effect on Switch 2 games.']
  ],
  sources: [SRC.ninspecs, SRC.ninfeat, SRC.ninhist, SRC.ninboost, SRC.nindock, SRC.ninset, nin('nin-s2e'), nin('nin-free')],
  related: ['console-upgrades', 'frame-time-calculator', 'vrr-120hz-console-setup']
};

// --- Steam Deck ---
const hours = (wh, w) => (wh / w).toFixed(1) + ' h';
const fsrQ = R.internal(1280, 800, 1.5), fsrP = R.internal(1280, 800, 2);
export const steamDeck = {
  slug: 'steam-deck-frame-cap-tdp-battery',
  changelog: [['2026-11-02', 'First published.'],
    ['2026-11-18', 'Worked example added: runtime from battery capacity and power draw for both models, and the internal resolutions of upscaler modes on the 1280×800 screen.'],
    ['2026-11-24', 'Valve’s tech specs of both models read in full (separate pages for LCD and OLED); the 40 Hz setting sourced to Valve’s SteamOS 3.2 notes; new section on the average frame-rate data Steam shows for Steam Deck since November 10, 2026; unsourced statements removed from the introduction, and our suggestions marked as such.']],
  group: 'console',
  kicker: 'Guide · Steam Deck',
  short: 'Steam Deck frame cap, TDP and battery',
  title: 'Steam Deck: frame cap, TDP and battery basics',
  description: 'How the Steam Deck performance menu works – frame limit, refresh rate, TDP limit, scaling – plus Steam’s new average frame-rate data and battery arithmetic.',
  h1: 'Steam Deck: frame cap, TDP and battery basics',
  lede: 'The Steam Deck gives you more control than a console: a Performance tab with frame limit, refresh rate, power limit and scaling options, saved per game if you want. Used together, they decide how evenly a game runs and how long the battery lasts. This guide explains the options, the 40 Hz setting Valve itself calls a sweet spot, the frame-rate data Steam has shown since November 2026, and the battery arithmetic.',
  sections: [
    `<h2 id="menu">Where the settings are</h2>
<p>Press the <b>…</b> (Quick Access) button and open the <b>Performance</b> tab (the battery icon). Turn on “Use per-game profile” to store the settings for the game you are playing instead of globally. The option names below are those of the Performance tab; Valve documents the refresh-rate and frame-limit settings in its SteamOS 3.2 notes, and the hardware limits in its tech specs. The descriptions of the other options are our explanation, and the layout can change with SteamOS updates.</p>
${tbl('Steam Deck performance options and what they do', ['Option', 'What it does', 'Our suggestion'], [
  ['Performance overlay', 'Shows FPS, frame time, CPU/GPU load, power and battery', 'On while tuning, off afterwards'],
  ['Refresh rate', 'Sets the screen’s refresh rate. Valve: LCD 60 Hz by default, adjustable down to 40 Hz since SteamOS 3.2; the OLED screen goes up to 90 Hz', 'Match it to your frame cap, e.g. 40 Hz for 40 fps'],
  ['Framerate limit', 'Caps FPS at an even share of the refresh rate (Valve: at 60 Hz 60, 30 and 15 fps; at 40 Hz 40, 20 and 10 fps)', 'Pick a cap the game can hold nearly all the time'],
  ['Allow tearing', 'Shows frames immediately instead of waiting for the refresh', 'Lower latency, visible tearing'],
  ['Half rate shading', 'Shades parts of the image at reduced rate', 'Saves GPU work in supported games, softer image'],
  ['TDP limit', 'Caps the power of the APU; Valve’s specs give 4–15 W APU power', 'Lower it when the game holds its cap with headroom'],
  ['Manual GPU clock', 'Fixes the GPU frequency', 'Rarely needed'],
  ['Scaling filter', 'How a lower game resolution is scaled to the screen (e.g. FSR, linear, integer)', 'FSR when rendering below 1280×800']
])}`,
    `<h2 id="cap">Frame cap first</h2>
<p>An uncapped game runs as fast as it can, so the frame rate swings with the scene and the APU stays at full power. A cap that the game holds almost everywhere gives even frame pacing and leaves power unused.</p>
<p><b>The 40 fps setting.</b> Set the refresh rate to 40 Hz and cap at 40 fps. Each frame then takes 25 ms, exactly halfway between 30 fps (33.3 ms) and 60 fps (16.7 ms), and it fits the refresh rate evenly. Valve’s own SteamOS 3.2 notes say the same: 40 Hz “tends to be a sweet spot for responsiveness, consistency, and smoothness”, and a rock-solid 40 fps at 40 Hz can feel smoother than a frame rate that swings between 42 and 48 on a 60 Hz screen. On the OLED model with its 90 Hz screen, 45 fps at 90 Hz is another even combination (arithmetic: 90 ÷ 45 = 2).</p>
${fig('sd-fig', 'Even cap and refresh combinations on Steam Deck: 30 at 60 Hz, 40 at 40 Hz, 45 at 90 Hz, 60 at 60 Hz',
`<rect class="g-bg" width="640" height="200"/>
<text class="g-tm" x="20" y="30">CAP · REFRESH · TIME PER FRAME (even combinations)</text>
<rect class="g-panel" x="20" y="48" width="140" height="120" rx="8"/><rect class="g-panel" x="173" y="48" width="140" height="120" rx="8"/><rect class="g-panel" x="327" y="48" width="140" height="120" rx="8"/><rect class="g-panel" x="480" y="48" width="140" height="120" rx="8"/>
<text class="g-tb" x="36" y="82">30 fps</text><text class="g-tm" x="36" y="108">@ 60 Hz</text><text class="g-tm" x="36" y="132">33.3 ms</text><text class="g-tm" x="36" y="154">lowest cap</text>
<text class="g-tb" x="189" y="82" style="fill:#FFC531">40 fps</text><text class="g-tm" x="189" y="108">@ 40 Hz</text><text class="g-tm" x="189" y="132">25.0 ms</text><text class="g-tm" x="189" y="154">Valve: sweet spot</text>
<text class="g-tb" x="343" y="82">45 fps</text><text class="g-tm" x="343" y="108">@ 90 Hz (OLED)</text><text class="g-tm" x="343" y="132">22.2 ms</text><text class="g-tm" x="343" y="154">OLED only</text>
<text class="g-tb" x="496" y="82">60 fps</text><text class="g-tm" x="496" y="108">@ 60 Hz</text><text class="g-tm" x="496" y="132">16.7 ms</text><text class="g-tm" x="496" y="154">lighter games</text>`,
'Combinations where each frame lasts a whole number of screen refreshes. They avoid uneven frame pacing without variable refresh rate.', '0 0 640 200')}`,
    `<h2 id="fpsdata">Check Steam’s frame-rate data before you tune</h2>
<p>Since November 10, 2026, Steam shows the <b>average frame rate</b> that players get in a game on Steam Deck, with a histogram of how often each frame rate occurs. Valve collects it from players who opted in to sharing anonymous frame-rate data, only from Decks set to the default frame limit – 60 fps on the LCD model, 90 fps on the OLED model – and without accounting for in-game settings. It is on each game’s store page under Steam Deck Compatibility → Learn more, for games with a Verified, Playable or Unsupported rating and enough data.</p>
<p>Two things make it useful for tuning. The average tells you before you start whether 60, 45 or 40 fps is realistic for a game. And the histogram shows the effect of V-Sync that this guide is about: Valve explains that gaps such as 90 and 45 fps with nothing in between appear when a game misses the refresh rate and V-Sync drops it to half – on a 90 Hz screen, a game averaging 75 fps alternates between 90 and 45. A cap that the game can hold avoids exactly that.</p>`,
    `<h2 id="res">Resolution and upscaling</h2>
<p>The Steam Deck screen is 1280×800, and Valve lists 16 GB of LPDDR5 on-board memory for both models. If a game has its own upscaler – FSR, XeSS or an engine upscaler – use it with the output at 1280×800. Alternatively, set the game to a lower resolution such as 960×600 and use the Steam Deck’s FSR scaling filter. Which effects to lower first is an editorial estimate in the <a href="/tools/settings-translator/">Settings Translator</a>; on the Deck our suggestion is to start with resolution and the frame cap, because CPU and GPU share one power budget (4–15 W).</p>`,
    `<h2 id="tdp">TDP and battery</h2>
<p>The TDP limit caps how much power the APU may use; Valve’s specs give a range of 4 to 15 W. With a frame cap in place, a game may not need the full budget: lower the limit until the frame rate starts to drop, then raise it a step. CPU and GPU share the budget, so a limit that is too low slows both and can cause stutter in CPU-heavy moments.</p>
<ul class="do">
<li>Set the frame cap first, then lower the TDP while watching the overlay.</li>
<li>Screen brightness also draws power – lower it indoors.</li>
<li>Use per-game profiles so a light game does not inherit the settings of a demanding one.</li>
<li>Check the Steam Deck Compatibility rating (Verified, Playable, Unsupported) and, since November 2026, the average frame rate on the store page.</li>
</ul>`,
    `<h2 id="battery">Worked example: battery arithmetic</h2>
<p>Battery life is a division: capacity in watt-hours divided by the power the whole device draws in watts. Valve’s tech specs give the capacities – 40 Whr for the LCD model and 50 Whr for the OLED model – and the performance overlay shows the current draw while you play.</p>
${tbl('Runtime = battery capacity ÷ total power draw (calculated)', ['Total draw shown in the overlay', 'LCD model, 40 Whr', 'OLED model, 50 Whr'],
  [25, 20, 15, 10, 7].map((w) => [`${w} W`, hours(40, w), hours(50, w)]),
  'Pure arithmetic from Valve’s capacity figures. A real session ends a little earlier, because a battery is not drained to zero and the draw changes from scene to scene.')}
<p>Valve states 2 to 8 hours of gameplay for the LCD model and 3 to 12 hours for the OLED model. Run through the same division, those ranges correspond to an average draw between 20 W and 5 W on the LCD model and between about 17 W and 4 W on the OLED model. The whole spread between a short and a long session is the power draw, and that is what a frame cap, a lower TDP limit and a dimmer screen change. Read the draw in the overlay before and after a change and you can calculate what it bought you: going from 20 W to 12 W on the LCD model turns 2.0 hours into 3.3.</p>
<p>The same arithmetic applies to resolution. The 1280×800 screen has ${mpx(1280, 800)} megapixels. FSR at Quality (1.5× per axis) renders ${fsrQ.w}×${fsrQ.h}, which is 44% of the pixels; Performance (2.0×) renders ${fsrP.w}×${fsrP.h}, a quarter. At such low pixel counts the upscaler has little to work with – our suggestion is a higher upscaler mode with a lower frame cap rather than a low mode at a high frame rate.</p>
${tryBox('See what every FSR and XeSS mode renders on the Deck’s 1280×800 screen.', '/tools/upscaler-resolution-calculator/?out=1280x800&up=fsr', 'Open the Upscaler Resolution Calculator')}`,
    `<h2 id="order">A simple order for any game</h2>
<ol>
<li>Look up the game’s average frame rate on its store page, if Steam shows one.</li>
<li>Start with the game’s medium or “Steam Deck” preset if it has one, and turn on the performance overlay.</li>
<li>Choose a cap the game can hold nearly always: 30, 40 (with 40 Hz), 45 (OLED, 90 Hz) or 60.</li>
<li>If it cannot hold the cap, lower the render resolution or use an upscaler before lowering textures.</li>
<li>Lower the TDP limit for battery if the frame rate stays stable, and save the per-game profile.</li>
</ol>
<p>After a game update, check that the profile is still active and expect some shader compilation – see <a href="/guides/shader-compilation-stutter-after-update/">shader stutter after an update</a>.</p>`
  ],
  faq: [
    ['What is the best frame cap on Steam Deck?', 'The highest one your game holds nearly all the time. Valve calls 40 Hz a sweet spot for responsiveness, consistency and smoothness; lighter games can run at 60, and the OLED model also allows 45 fps at 90 Hz.'],
    ['Where can I see how well a game runs on Steam Deck?', 'Since November 10, 2026, on the game’s store page under Steam Deck Compatibility → Learn more: Steam shows the average frame rate of players who share anonymous data, measured at the default frame limit.'],
    ['Does lowering TDP improve battery life?', 'Yes, if the game still holds its frame cap, because the battery lasts capacity ÷ power draw. Lower it gradually while watching the overlay; too low a limit causes drops and stutter.'],
    ['Should I use the FSR scaling filter?', 'It helps when a game renders below 1280×800 and has no built-in upscaler. If the game offers its own upscaler, our suggestion is to try that first, because it works with the game’s own data.']
  ],
  sources: [SRC.deck, SRC.decklcd, SRC.steamos32, SRC.deckfps, SRC.fsr],
  related: ['upscaler-resolution-calculator', 'frame-time-calculator', 'switch-2-docked-vs-handheld']
};

// --- VRR and 120 Hz ---
const win = (fps, lo, hi) => { const v = FT.vrr(fps, lo, hi); return v.kind === 'inside' ? `inside: display refreshes at ${r2(fps)} Hz` : v.kind === 'multiple' ? `each frame ${v.times}× → ${r2(v.hz)} Hz` : v.kind === 'below' ? 'no whole multiple fits' : 'above the window'; };
const vrrRows = N.ROWS.filter((r) => r.c === 'vrr');
export const vrrConsole = {
  slug: 'vrr-120hz-console-setup',
  changelog: [['2026-11-02', 'First published.'], ['2026-11-03', 'Switch 2: VRR on the TV since the September 10, 2026 system update.'],
    ['2026-11-18', 'Worked example added: frame rates against VRR windows including low framerate compensation; table of VRR setting names per platform with sources.'],
    ['2026-11-24', 'Console settings, the HDMI chain and troubleshooting now quoted from Sony’s and Microsoft’s support pages and Nintendo’s update history, read in full; AMD’s FreeSync tiers corrected from its current tier table; unsourced statements about typical TV VRR ranges and panel flicker removed. This guide is now the one place for console display settings; the PS5 and Xbox guides link here.']],
  group: 'console',
  kicker: 'Guide · display setup',
  short: 'VRR and 120 Hz on consoles',
  title: 'VRR and 120 Hz on consoles: a setup guide',
  description: 'How to set up 120 Hz and VRR on PS5, Xbox Series X|S and Switch 2: TV port, cable, console settings in the makers’ words, VRR windows and troubleshooting.',
  h1: 'VRR and 120 Hz on consoles: setup guide',
  lede: 'A 120 Hz signal and variable refresh rate (VRR) can make console games feel smoother – but only if the TV, the HDMI port, the cable, the console and the game all play along. One wrong link and the option is greyed out or silently off. This guide goes through the chain in order, with the settings in the words of Sony, Microsoft and Nintendo, and explains what VRR can and cannot fix.',
  sections: [
    `<h2 id="what">What 120 Hz and VRR do</h2>
<p><b>120 Hz output</b> lets the display refresh twice as often as a 60 Hz signal. Games can then run at up to 120 fps, or use 40 fps modes that fit evenly into 120 Hz (three refreshes per frame).</p>
<p><b>Variable refresh rate</b> lets the display wait for each new frame instead of refreshing on a fixed clock. Without it, a game running at, say, 52 fps on a 60 Hz display either tears (frames switch mid-refresh) or judders (some frames are shown twice). With VRR, the display refreshes at 52 Hz. Sony describes the effect as minimizing frame pacing issues and screen tearing; Microsoft as reducing stuttering and screen tears. VRR does not make the game faster; it makes uneven frame rates look even.</p>
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
${tbl('Checklist for 120 Hz and VRR (from Sony’s and Microsoft’s support pages)', ['Link', 'What the makers ask for', 'Where it goes wrong'], [
  ['TV or monitor', 'Support for the signal: 4K 120 Hz and VRR need HDMI 2.1 features; Xbox VRR works with HDMI-VRR or AMD FreeSync TVs', 'Microsoft: some displays reach 120 Hz only at certain resolutions such as 1080p'],
  ['HDMI port', 'Sony and Microsoft: the TV’s HDMI 2.1 port', 'On some TVs only specific ports support HDMI 2.1'],
  ['Cable', 'The cable that came with the console, or an Ultra High Speed HDMI cable rated for 4K 120 Hz', 'Older cables'],
  ['Between console and TV', 'Sony: check whether a receiver or other device in between affects the signal', 'Microsoft: VRR may cause display issues through an AV receiver'],
  ['TV settings and firmware', 'Sony: HDMI 2.1 support may require changing settings on the TV; latest TV firmware', 'Xbox Wire’s example: one TV series needs “HDMI Mode → 2.1” set in its menu'],
  ['Console settings', '120 Hz output and VRR enabled (see below)', 'A setting left on 60 Hz after a TV change'],
  ['The game', 'A 120 Hz, 40 fps or VRR-aware mode', 'Not every game supports 120 Hz or VRR']
])}
<p>The TV setting that unlocks HDMI 2.1 has a different name on every brand; the TV’s manual names it. Without it, the console may only see a 60 Hz display.</p>`,
    `<h2 id="consoles">Console settings</h2>
<p><b>PS5</b> – Settings → Screen and Video → Video Output. Sony’s support page: <i>120 Hz Output</i> – “Turn on to enable 120 Hz video output for your TV and games that support 120 Hz frame rate”; turn it off if those games show output problems on a monitor. <i>VRR</i> – “Allow the refresh rate to adjust in real time while using TVs and games that support VRR”, with results depending on the TV; the sub-option <i>Apply to Unsupported Games</i> stabilizes the frame rate of games without VRR support and should be turned off if a game behaves unexpectedly. Sony adds that with VRR on, a TV with ALLM switches to low-latency mode even if ALLM is set to off, and that VRR is disabled during 8K output on PS5 Pro. If the TV supports 1440p, <i>Test 1440p Output</i> checks 60 Hz, 120 Hz and VRR at that resolution.</p>
<p><b>Xbox Series X|S</b> – Profile &amp; system → Settings → General → TV &amp; display options. Set <i>Refresh rate</i> to 120 Hz; Xbox Support: 4K at 120 Hz needs a Series X, an Ultra High Speed HDMI cable that supports HDMI 2.1 and an HDMI 2.1 TV, while a Series S or a TV without HDMI 2.1 uses 120 Hz at a lower resolution. Under <i>Video modes</i>, tick <i>Allow variable refresh rate</i> (only offered with an HDMI-VRR or FreeSync TV) and <i>Allow auto low-latency mode</i>. <i>4K TV details</i> shows what the console detected.</p>
<p><b>Switch 2</b> – System Settings → Display: TV resolution, <i>120Hz output</i> and, since system update 23.0.0 (September 2026), the VRR settings. VRR in TV mode needs a dock firmware update (System Settings → System → Dock Update), a TV that supports VRR and a game that supports it; Nintendo: the video is then output “at a refresh rate that matches the game’s processing”. 120 fps on a TV is possible at 1080p and 1440p, not at 4K. Details in <a href="/guides/switch-2-docked-vs-handheld/">Switch 2 docked vs handheld</a>.</p>`,
    `<h2 id="range">VRR windows and what VRR cannot fix</h2>
<p>Every VRR display has a window – a lowest and a highest refresh rate it can follow; the highest is the panel’s maximum. Inside the window, VRR works as described. Below it, the display falls back to fixed refresh, unless the system uses <b>low framerate compensation</b>: each frame is shown two or more times so that the refresh rate lands inside the window again. AMD’s example: a 60–144 Hz display can sync a 40 fps game by doubling each frame to 80 Hz.</p>
<p>The lower limit differs from display to display; it is in the manual or in independent measurements. That has two consequences. A steady 30 fps mode gains little if the window starts above 30 Hz and no doubling happens. And a performance mode that dips from 60 into the high 40s stays smooth as long as those dips stay inside the window.</p>
<p>VRR also cannot fix stutter: a single frame that takes 100 ms is still visible, VRR or not. For the difference between low frame rates and stutter, see <a href="/guides/fps-frame-time-1-percent-lows/">FPS, frame time and 1% lows</a>.</p>`,
    `<h2 id="window">Worked example: a frame rate against a VRR window</h2>
<p>Whether VRR can follow a frame rate is arithmetic. Inside the window the display refreshes when a frame arrives. Below the window there is one way out: if a whole multiple of the frame rate lies inside the window, each frame can be shown two or three times. AMD’s current FreeSync tier table marks low framerate compensation for all three FreeSync tiers, and its FAQ calls it mandatory for FreeSync Premium and Premium Pro. The table runs the numbers for two example windows – look up the real window of your display in its manual.</p>
${tbl('Frame rates against two example VRR windows (calculated)', ['Frame rate', 'Frame time', 'Window 48–120 Hz', 'Window 40–60 Hz'],
  [24, 30, 40, 45, 55, 60, 90, 120].map((f) => [`${f} fps`, `${r2(FT.ms(f))} ms`, win(f, 48, 120), win(f, 40, 60)]),
  'The windows are examples, not the specification of any console or TV. “Each frame 2×” only happens if the display or the console performs low framerate compensation.')}
<p>The pattern is worth remembering. A window whose top is at least twice its bottom (48–120 Hz) has no gaps: every frame rate below the window has a multiple inside it. A narrow window (40–60 Hz) has gaps – 24 fps fits only doubled to 48 Hz, and anything between 30 and 40 fps has no multiple that fits, so a game that dips to 35 fps falls out of VRR there. This is the reason a 120 Hz panel matters for VRR even if a game never reaches 120 fps.</p>
<p>AMD’s developer documentation describes the same window in time instead of rate: for a 64–120 Hz window, the time between two refreshes has to stay between 8.33 ms and 15.625 ms, and outside it tearing is likely.</p>
${tryBox('Enter your display’s real window and any frame rate.', '/tools/frame-time-calculator/?fps=45&hz=120&min=48&max=120', 'Open the Frame Time Calculator with this example')}`,
    `<h2 id="names">VRR by name on each platform</h2>
<p>The feature is the same everywhere; the switch is called something different on each system.</p>
${tbl('Where VRR is switched on, and what it is called (from platform and vendor documentation)', ['Name on screen', 'Platform', 'What the source says'], vrrRows.map((r) => [r.n, N.VENDORS[r.v], r.d]))}
<p>On Windows, note the two similar names in the table: “Variable refresh rate” is the setting for games, “Dynamic refresh rate” only lets Windows change the desktop refresh rate. The complete list with sources is in the <a href="/reference/setting-names/?cat=vrr">setting-name map</a>.</p>`,
    `<h2 id="trouble">Troubleshooting, in the makers’ words</h2>
<ul class="do">
<li><b>No picture, or 1080p instead of 4K 120 Hz (PS5).</b> Sony’s checklist: does the TV support 4K 120 Hz, does it run the latest firmware, is the cable the one from the box or an Ultra High Speed cable, is the console connected directly or through a receiver, is it on the TV’s HDMI 2.1 port, and are Resolution (Automatic or 2160p) and Video Transfer Rate (Automatic) set as expected.</li>
<li><b>Flickering at 4K (PS5).</b> Sony suggests setting Video Transfer Rate to −1 or −2, which limits 4K 120 Hz output.</li>
<li><b>Display issues with a receiver (Xbox).</b> Xbox Support: turn VRR off or connect the console directly to the display.</li>
<li><b>Visual corruption in games (Xbox).</b> Xbox Wire’s advice from 2020: untick Allow variable refresh rate, or set the refresh rate to 60 Hz if you prefer VRR over 120 Hz.</li>
<li><b>VRR on, but no difference.</b> The game may run at a locked frame rate that matches the refresh rate, or below your display’s VRR window.</li>
</ul>`
  ],
  faq: [
    ['Do I need HDMI 2.1 for 120 Hz on PS5 and Xbox?', 'For 4K at 120 Hz, yes: Sony and Microsoft ask for an HDMI 2.1 port and a suitable cable. Xbox Support also describes 120 Hz at lower resolutions on a TV without HDMI 2.1.'],
    ['Does VRR increase input lag?', 'Sony’s announcement says VRR reduces input lag in many PS5 games, with results that vary by game, TV and visual mode. VRR avoids waiting for a fixed refresh, which is where V-Sync adds delay.'],
    ['Why does my 30 fps mode not benefit from VRR?', 'VRR follows the frame rate only inside your display’s window. If the window starts above 30 Hz and the frames are not doubled, a steady 30 fps gains little.'],
    ['Which HDMI cable do I need?', 'The one supplied with the console, or an Ultra High Speed HDMI cable rated for 4K 120 Hz, as Sony and Microsoft describe it.']
  ],
  sources: [SRC.psres, SRC.psvrr, SRC.xbtv, SRC.xb120, SRC.xbwire, SRC.ninhist, SRC.nindock, SRC.ninspecs, SRC.freesync, SRC.fsrsc, SRC.msrefresh, SRC.msgfx],
  related: ['frame-time-calculator', 'setting-names', 'ps5-performance-vs-fidelity-mode']
};
