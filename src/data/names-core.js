/*
 * Setting-name map – data and filter (no DOM). Unit-tested in tests/logic.test.js.
 * Every row names its sources; nothing here is measured by us. Rows were compiled on 2026-11-18 from the
 * vendor and platform documents in SOURCES. "via": 'doc' = read in full from the vendor's public repository,
 * 'page' = official page whose relevant passage was taken from a search-engine extract of that page.
 */
(function (root) {
  'use strict';
  var ACCESSED = '2026-11-18';
  var GH = 'https://github.com/';
  var SOURCES = {
    'dlss-pg': ['NVIDIA – DLSS Super Resolution Programming Guide 310.6.0 (March 2026)', GH + 'NVIDIA/DLSS/blob/main/doc/DLSS_Programming_Guide_Release.pdf', 'doc'],
    'nv-dlss': ['NVIDIA – DLSS SDK repository (README)', GH + 'NVIDIA/DLSS', 'doc'],
    'sl-fg': ['NVIDIA – Streamline programming guide for DLSS Frame Generation', GH + 'NVIDIA-RTX/Streamline/blob/main/docs/ProgrammingGuideDLSS_G.md', 'doc'],
    'sl-reflex': ['NVIDIA – Streamline programming guide for Reflex', GH + 'NVIDIA-RTX/Streamline/blob/main/docs/ProgrammingGuideReflex.md', 'doc'],
    'sl-rr': ['NVIDIA – Streamline programming guide for DLSS Ray Reconstruction', GH + 'NVIDIA-RTX/Streamline/blob/main/docs/ProgrammingGuideDLSS_RR.md', 'doc'],
    'nv-smooth': ['NVIDIA – NVIDIA app update: Smooth Motion for GeForce RTX 40 Series', 'https://www.nvidia.com/en-us/geforce/news/nvidia-app-global-dlss-overrides-rtx-40-series-smooth-motion/', 'page'],
    'fsr-sdk': ['AMD – FSR SDK 2.4.0 “Redstone” (README)', GH + 'GPUOpen-LibrariesAndSDKs/FidelityFX-SDK', 'doc'],
    'fsr-up': ['AMD – FidelityFX Super Resolution 3.1.6 upscaler documentation', GH + 'GPUOpen-LibrariesAndSDKs/FidelityFX-SDK/blob/main/Kits/FidelityFX/docs/techniques/super-resolution-upscaler.md', 'doc'],
    'fsr-ml': ['AMD – FSR Upscaling 4.1.2 documentation', GH + 'GPUOpen-LibrariesAndSDKs/FidelityFX-SDK/blob/main/Kits/FidelityFX/docs/techniques/super-resolution-ml.md', 'doc'],
    'fsr-fg': ['AMD – FidelityFX Super Resolution Frame Generation 3.1.6 documentation', GH + 'GPUOpen-LibrariesAndSDKs/FidelityFX-SDK/blob/main/Kits/FidelityFX/docs/techniques/frame-interpolation.md', 'doc'],
    'fsr-fgml': ['AMD – FSR Frame Generation 4.0.2 documentation', GH + 'GPUOpen-LibrariesAndSDKs/FidelityFX-SDK/blob/main/Kits/FidelityFX/docs/techniques/frame-interpolation-ml.md', 'doc'],
    'fsr-sc': ['AMD – FSR Frame Generation swapchain documentation (frame pacing, VRR)', GH + 'GPUOpen-LibrariesAndSDKs/FidelityFX-SDK/blob/main/Kits/FidelityFX/docs/techniques/frame-interpolation-swap-chain.md', 'doc'],
    'al2': ['AMD – Anti-Lag 2 SDK (README)', GH + 'GPUOpen-LibrariesAndSDKs/AntiLag2-SDK', 'doc'],
    'afmf': ['AMD – AMD Fluid Motion Frames', 'https://www.amd.com/en/products/software/adrenalin/afmf.html', 'page'],
    'freesync': ['AMD – AMD FreeSync Technology', 'https://www.amd.com/en/products/graphics/technologies/freesync.html', 'page'],
    'xess': ['Intel – XeSS 3 SDK (README)', GH + 'intel/xess', 'doc'],
    'xess-sr': ['Intel – XeSS Super Resolution Developer Guide', GH + 'intel/xess/blob/main/doc/xess_sr_developer_guide_english.md', 'doc'],
    'xess-fg': ['Intel – XeSS Frame Generation Developer Guide', GH + 'intel/xess/blob/main/doc/xess_fg_developer_guide_english.md', 'doc'],
    'xell': ['Intel – Xe Low Latency (XeLL) Developer Guide 1.3', GH + 'intel/xess/blob/main/doc/xell_developer_guide_english.md', 'doc'],
    'pm': ['Intel – PresentMon console application (CSV columns)', GH + 'GameTechDev/PresentMon/blob/main/README-ConsoleApplication.md', 'doc'],
    'ps-res': ['PlayStation Support – How to change PS5 console resolution', 'https://www.playstation.com/en-us/support/hardware/ps5-4k-resolution-guide/', 'page'],
    'ps-vrr': ['PlayStation Blog – Variable Refresh Rate support for PS5 (April 25, 2022)', 'https://blog.playstation.com/2022/04/25/variable-refresh-rate-support-for-ps5-is-rolling-out-this-week/', 'page'],
    'ps-presets': ['PlayStation Support – How to customize game presets on PS5 consoles', 'https://www.playstation.com/en-us/support/games/how-to-customize-game-presets-on-ps5-consoles/', 'page'],
    'ps-pssr': ['PlayStation Blog – Upgraded PSSR upscaler is coming to PS5 Pro (February 27, 2026)', 'https://blog.playstation.com/2026/02/27/upgraded-pssr-upscaler-is-coming-to-ps5-pro/', 'page'],
    'xb-wire': ['Xbox Wire – You’re Ready to Power Your Dreams – Is Your TV? (November 6, 2020)', 'https://news.xbox.com/en-us/2020/11/06/is-your-tv-ready-to-power-your-dreams/', 'page'],
    'xb-120': ['Xbox Support – Set up 4K gaming at 120 Hz on Xbox Series X', 'https://support.xbox.com/en-US/help/hardware-network/display-sound/4k-gaming-at-120hz', 'page'],
    'xb-tv': ['Xbox Support – How to change the TV display settings on your Xbox', 'https://support.xbox.com/en-US/help/hardware-network/display-sound/change-tv-display-resolution', 'page'],
    'ms-refresh': ['Microsoft Support – Change the refresh rate on your monitor in Windows', 'https://support.microsoft.com/en-us/windows/hardware/display-graphics/change-the-refresh-rate-on-your-monitor-in-windows', 'page'],
    'ms-gfx': ['Microsoft DirectX Developer Blog – Navigating the redesigned Graphics settings page', 'https://devblogs.microsoft.com/directx/navigating-the-redesigned-graphics-settings-page/', 'page'],
    'nin-specs': ['Nintendo – Nintendo Switch 2 tech specs', 'https://www.nintendo.com/us/gaming-systems/switch-2/tech-specs/', 'page'],
    'nin-feat': ['Nintendo – Nintendo Switch 2 system features and play modes', 'https://www.nintendo.com/us/gaming-systems/switch-2/features/', 'page'],
    'nin-set': ['Nintendo Support – Nintendo Switch 2 System Settings overview', 'https://www.nintendo.com/en-gb/Support/Nintendo-Switch-2/Nintendo-Switch-2-System-Settings-Overview-2892722.html', 'page'],
    'deck': ['Valve – Steam Deck tech specs', 'https://www.steamdeck.com/en/tech', 'page']
  };
  var CATS = {
    upscale: 'Upscaling (render fewer pixels, reconstruct the rest)',
    framegen: 'Frame generation (extra frames between rendered ones)',
    latency: 'Latency reduction',
    vrr: 'Variable refresh rate',
    output: 'Output and mode settings',
    denoise: 'Ray-tracing denoisers',
    measure: 'Measurement columns'
  };
  var VENDORS = { nvidia: 'NVIDIA', amd: 'AMD', intel: 'Intel', windows: 'Windows', ps5: 'PS5 / PS5 Pro', xbox: 'Xbox Series X|S', switch2: 'Nintendo Switch 2', deck: 'Steam Deck' };

  function pctAxis(f) { return Math.round(1000 / f) / 10; }
  function pctArea(f) { return Math.round(1000 / (f * f)) / 10; }
  function mode(v, tech, name, f, src) {
    return { c: 'upscale', v: v, n: tech + ' – ' + name, g: 'Upscaler preset, ' + f + '× per axis', f: f,
      d: f === 1 ? 'Renders at the full output resolution and uses the upscaler only for anti-aliasing.' : 'Renders ' + pctAxis(f) + '% of the output resolution per axis, which is ' + pctArea(f) + '% of the output pixels.', s: [src] };
  }
  var ROWS = [
    { c: 'upscale', v: 'nvidia', n: 'DLSS Super Resolution', g: 'Temporal upscaler (machine learning)', d: 'NVIDIA’s upscaler for GeForce RTX cards. Its programming guide publishes timing and memory tables for the RTX 20 to RTX 50 series.', s: ['dlss-pg'] },
    mode('nvidia', 'DLSS', 'DLAA', 1.0, 'dlss-pg'), mode('nvidia', 'DLSS', 'Quality', 1.5, 'dlss-pg'), mode('nvidia', 'DLSS', 'Balanced', 1.724, 'dlss-pg'),
    mode('nvidia', 'DLSS', 'Performance', 2.0, 'dlss-pg'), mode('nvidia', 'DLSS', 'Ultra Performance', 3.0, 'dlss-pg'),
    { c: 'upscale', v: 'nvidia', n: 'NVIDIA Image Scaling (NIS)', g: 'Spatial scaler with sharpening', d: 'A single spatial scaling and sharpening algorithm. Unlike DLSS it works on one frame at a time and does not accumulate detail over several frames.', s: ['nv-dlss'] },
    { c: 'upscale', v: 'amd', n: 'FSR 3.1 upscaler (FidelityFX Super Resolution)', g: 'Temporal upscaler (analytical)', d: 'AMD’s temporal upscaler without a machine-learning model, version 3.1.6 in the current SDK. AMD publishes its memory use per output resolution and mode.', s: ['fsr-up', 'fsr-sdk'] },
    { c: 'upscale', v: 'amd', n: 'FSR Upscaling 4 (“FSR 4”)', g: 'Temporal upscaler (machine learning)', d: 'AMD’s machine-learning upscaler, version 4.1.2 in the current SDK. The documentation lists reference timings for Radeon RX 9000 cards (FP8 model), RX 7000 and RX 6000 cards (INT8 model) and selected Ryzen processors with integrated graphics.', s: ['fsr-ml'] },
    mode('amd', 'FSR', 'Native AA', 1.0, 'fsr-up'), mode('amd', 'FSR', 'Quality', 1.5, 'fsr-up'), mode('amd', 'FSR', 'Balanced', 1.7, 'fsr-up'),
    mode('amd', 'FSR', 'Performance', 2.0, 'fsr-up'), mode('amd', 'FSR', 'Ultra Performance', 3.0, 'fsr-up'),
    { c: 'upscale', v: 'amd', n: 'FSR “Redstone”', g: 'Bundle name', d: 'Name of the FSR SDK 2.x generation. The SDK 2.4.0 package contains FSR Upscaling 4, FSR Frame Generation 4, FSR Ray Regeneration and a preview of FSR Radiance Caching next to the older FSR 2 and FSR 3.1 techniques.', s: ['fsr-sdk'] },
    { c: 'upscale', v: 'intel', n: 'XeSS Super Resolution (XeSS-SR)', g: 'Temporal upscaler (machine learning)', d: 'Intel’s upscaler. Runs on Intel Arc and, through a cross-vendor path, on any GPU that supports Shader Model 6.4; hardware acceleration for DP4a is recommended.', s: ['xess', 'xess-sr'] },
    { c: 'upscale', v: 'intel', n: 'XeSS 3', g: 'Bundle name', d: 'Intel’s consumer name for the combination of XeSS-SR (upscaling), XeSS-FG (frame generation) and XeLL (low latency).', s: ['xess'] },
    mode('intel', 'XeSS', 'Native Anti-Aliasing', 1.0, 'xess-sr'), mode('intel', 'XeSS', 'Ultra Quality Plus', 1.3, 'xess-sr'), mode('intel', 'XeSS', 'Ultra Quality', 1.5, 'xess-sr'),
    mode('intel', 'XeSS', 'Quality', 1.7, 'xess-sr'), mode('intel', 'XeSS', 'Balanced', 2.0, 'xess-sr'), mode('intel', 'XeSS', 'Performance', 2.3, 'xess-sr'), mode('intel', 'XeSS', 'Ultra Performance', 3.0, 'xess-sr'),
    { c: 'upscale', v: 'intel', n: 'XeSS presets before version 1.3', g: 'Older preset factors', d: 'Before XeSS 1.3 the same names rendered more pixels: Ultra Quality 1.3×, Quality 1.5×, Balanced 1.7×, Performance 2.0×. A game that moved to XeSS 1.3 or newer renders fewer pixels under the same preset name unless it keeps the legacy factors.', s: ['xess-sr'] },
    { c: 'upscale', v: 'ps5', n: 'PSSR (PlayStation Spectral Super Resolution)', g: 'Temporal upscaler (machine learning)', d: 'Sony’s upscaler for PS5 Pro games that support it. Sony announced an upgraded PSSR on February 27, 2026.', s: ['ps-pssr'] },
    { c: 'upscale', v: 'ps5', n: 'Enhance PSSR Image Quality', g: 'System-wide upscaler override', d: 'PS5 Pro system setting that applies the upgraded PSSR to PS5 Pro games that already support PSSR.', s: ['ps-pssr'] },

    { c: 'framegen', v: 'nvidia', n: 'DLSS Frame Generation', g: 'In-game frame generation, 2×', d: 'One generated frame per rendered frame. NVIDIA requires the game to integrate Reflex, Windows 10 version 2004 or newer and hardware-accelerated GPU scheduling.', s: ['sl-fg'] },
    { c: 'framegen', v: 'nvidia', n: 'DLSS Multi Frame Generation', g: 'In-game frame generation, 3× and more', d: 'Several generated frames per rendered frame; three generated frames give a 4× multiplier. The maximum depends on the hardware: NVIDIA’s cost table lists 4× for the RTX 5080 and RTX 5090 and none for the RTX 4090.', s: ['sl-fg'] },
    { c: 'framegen', v: 'nvidia', n: 'Dynamic Multi Frame Generation', g: 'Frame generation with a variable multiplier', d: 'Adjusts the number of generated frames automatically to reach the display’s refresh rate or a chosen target. Needs driver 595.41 or newer and Direct3D 12, and is designed to work with the Reflex frame-rate limiter.', s: ['sl-fg'] },
    { c: 'framegen', v: 'nvidia', n: 'Smooth Motion', g: 'Driver-level frame generation', d: 'Adds one interpolated frame between two rendered frames in games without DLSS Frame Generation. Switched on per game in the NVIDIA app under Graphics → Program settings, for DirectX 11, DirectX 12 and Vulkan games on RTX 50 and RTX 40 series cards.', s: ['nv-smooth'] },
    { c: 'framegen', v: 'amd', n: 'FSR Frame Generation (FSR 3.1)', g: 'In-game frame generation, 2×', d: 'Analytically generates one intermediate frame from two consecutive rendered frames. AMD’s pacing notes say the rendered frame rate should sit slightly below half the desired output frame rate.', s: ['fsr-fg', 'fsr-sc'] },
    { c: 'framegen', v: 'amd', n: 'FSR Frame Generation 4', g: 'In-game frame generation, 2× (machine learning)', d: 'Machine-learning version: generates one intermediate frame from two consecutive rendered frames.', s: ['fsr-fgml'] },
    { c: 'framegen', v: 'amd', n: 'AMD Fluid Motion Frames (AFMF 2.1)', g: 'Driver-level frame generation', d: 'Enabled in AMD Software for DirectX 11, DirectX 12, Vulkan and OpenGL games. V-Sync has to be off in the driver and in the game; Radeon RX 6000 cards support it in exclusive fullscreen only.', s: ['afmf'] },
    { c: 'framegen', v: 'intel', n: 'XeSS Frame Generation (XeSS-FG)', g: 'In-game frame generation', d: 'Intel names 40 fps as the minimum and 60 fps as the recommended input frame rate. Can generate several frames per rendered frame on Intel GPUs and at most one on other vendors’ GPUs; needs XeLL.', s: ['xess-fg'] },

    { c: 'latency', v: 'nvidia', n: 'Reflex Low Latency – Off / On / On + Boost', g: 'In-game latency reduction', d: 'Three modes. NVIDIA lists GeForce 900 series and newer with driver 456.38 or later. “On + Boost” is expected to cost some frame rate for the lowest latency.', s: ['sl-reflex'] },
    { c: 'latency', v: 'nvidia', n: 'Reflex frame-rate limiter', g: 'Frame cap inside the latency system', d: 'The limiter that belongs to Reflex. NVIDIA designs Dynamic Multi Frame Generation to work with it and warns that other limiters may give unexpected results there.', s: ['sl-reflex', 'sl-fg'] },
    { c: 'latency', v: 'amd', n: 'Radeon Anti-Lag', g: 'Driver-level latency reduction', d: 'Driver-only: delays the driver-side processing of the game’s graphics commands so CPU frames do not run too far ahead of GPU frames.', s: ['al2'] },
    { c: 'latency', v: 'amd', n: 'Anti-Lag 2', g: 'In-game latency reduction', d: 'Built into the game: the delay is placed just before the game samples mouse, keyboard and gamepad, which AMD describes as a significantly greater latency reduction than the driver-only version.', s: ['al2'] },
    { c: 'latency', v: 'intel', n: 'Xe Low Latency (XeLL)', g: 'In-game latency reduction', d: 'For Intel Arc A-Series and newer; on other vendors’ GPUs only together with XeSS-FG. Intel requires other latency-reduction solutions to be off while XeLL runs.', s: ['xell'] },

    { c: 'vrr', v: 'amd', n: 'FreeSync', g: 'Variable refresh rate (VRR)', d: 'AMD’s name for VRR on monitors, laptops and TVs. The AMD FSR documentation lists AMD FreeSync, NVIDIA G-SYNC and VESA AdaptiveSync as VRR technologies.', s: ['freesync', 'fsr-sc'] },
    { c: 'vrr', v: 'amd', n: 'FreeSync Premium', g: 'VRR tier', d: 'Adds two requirements to FreeSync: mandatory low framerate compensation and at least 120 Hz at a minimum of Full HD resolution.', s: ['freesync'] },
    { c: 'vrr', v: 'amd', n: 'FreeSync Premium Pro', g: 'VRR tier with HDR', d: 'Adds AMD’s FreeSync Premium Pro compliance tests on top of FreeSync Premium; AMD lists FreeSync HDR as a Premium Pro feature.', s: ['freesync'] },
    { c: 'vrr', v: 'nvidia', n: 'G-SYNC', g: 'Variable refresh rate (VRR)', d: 'NVIDIA’s name for VRR. This map does not list NVIDIA’s display tiers because we could not check their current definitions against an official NVIDIA page.', s: ['fsr-sc'] },
    { c: 'vrr', v: 'ps5', n: 'VRR', g: 'Variable refresh rate (HDMI 2.1)', d: 'Settings → Screen and Video → Video Output. Sony: enabled automatically for supported games when the console is connected to an HDMI 2.1 VRR-compatible TV or monitor.', s: ['ps-vrr', 'ps-res'] },
    { c: 'vrr', v: 'ps5', n: 'Apply to Unsupported Games', g: 'VRR for games without VRR support', d: 'Option on the same PS5 screen: applies VRR to PS5 games that do not support it. Sony says it may improve video quality for some games and can be turned off if you see unexpected behavior.', s: ['ps-vrr', 'ps-res'] },
    { c: 'vrr', v: 'xbox', n: 'Allow variable refresh rate', g: 'Variable refresh rate', d: 'Checkbox under Settings → General → TV & display options → Video modes (Xbox Wire’s 2020 article places Video modes under Advanced).', s: ['xb-wire'] },
    { c: 'vrr', v: 'windows', n: 'Variable refresh rate', g: 'VRR for games that lack native support', d: 'Settings → System → Display → Graphics, in the default or advanced graphics settings. Microsoft notes the switch only appears with suitable drivers and a VRR-capable monitor.', s: ['ms-gfx'] },
    { c: 'vrr', v: 'windows', n: 'Dynamic refresh rate (DRR)', g: 'Not VRR for games', d: 'Settings → System → Display → Advanced display. Lets Windows change the desktop refresh rate by itself; only offered on displays with VRR and at least 120 Hz. Easy to confuse with the VRR switch above.', s: ['ms-refresh'] },
    { c: 'vrr', v: 'switch2', n: 'VRR (built-in screen)', g: 'Variable refresh rate', d: 'The built-in 1080p screen supports VRR up to 120 Hz. Nintendo notes that frame rate, HDR and VRR support vary by game.', s: ['nin-specs'] },
    { c: 'vrr', v: 'switch2', n: 'VRR in TV mode', g: 'Variable refresh rate over HDMI', d: 'Added with system update 23.0.0 (September 10, 2026); needs the dock update and game support, plus a TV that supports VRR over HDMI.', s: ['nin-feat'] },

    { c: 'output', v: 'ps5', n: '120 Hz output setting', g: 'High refresh-rate output', d: 'The 120 Hz output setting under Settings → Screen and Video → Video Output; the exact label on the console may differ. Provides 120 Hz for the TV and for games that support a 120 Hz frame rate; Sony advises turning it off if the display shows output problems.', s: ['ps-res'] },
    { c: 'output', v: 'ps5', n: 'Game Presets – Performance Mode or Resolution Mode', g: 'Default graphics mode for games', d: 'Settings → Saved Data and Game/App Settings → Game Presets. Performance Mode favors smooth motion, Resolution Mode favors graphics quality; it sets the default that supporting games start with.', s: ['ps-presets'] },
    { c: 'output', v: 'xbox', n: 'Refresh rate – 120 Hz', g: 'High refresh-rate output', d: 'Profile & system → Settings → General → TV & display options. For 4K at 120 Hz, Xbox Support names an Ultra High Speed HDMI cable and a TV with HDMI 2.1.', s: ['xb-tv', 'xb-120'] },
    { c: 'output', v: 'switch2', n: 'TV resolution', g: 'Output resolution in TV mode', d: 'System Settings option with the choices Automatic, 720p, 1080p, 1440p and 2160p (4K). At 4K the frame rate is limited to 60 fps; 120 fps is possible at 1080p and 1440p.', s: ['nin-set', 'nin-specs'] },
    { c: 'output', v: 'switch2', n: '120Hz output', g: 'High refresh-rate output', d: 'On/off toggle in System Settings. 120 fps in TV mode needs a display that supports 120 Hz.', s: ['nin-set', 'nin-specs'] },
    { c: 'output', v: 'deck', n: 'Screen resolution and refresh rate', g: 'Handheld display limits', d: 'Both Steam Deck models have a 1280×800 screen. Valve lists up to 60 Hz and a 40 Whr battery for the LCD model, up to 90 Hz and a 50 Whr battery for the OLED model.', s: ['deck'] },
    { c: 'output', v: 'windows', n: 'Optimizations for windowed games', g: 'Presentation mode for windowed games', d: 'System-wide switch on the Graphics settings page. Microsoft says it improves latency in DirectX 10 and 11 games in windowed and borderless modes and enables features such as Auto HDR and VRR there.', s: ['ms-gfx'] },
    { c: 'output', v: 'windows', n: 'Hardware-accelerated GPU scheduling', g: 'Windows graphics scheduler setting', d: 'Settings → System → Display → Graphics → Change default graphics settings. NVIDIA lists it as a requirement for DLSS Frame Generation.', s: ['sl-fg'] },

    { c: 'denoise', v: 'nvidia', n: 'DLSS Ray Reconstruction (DLSS-RR)', g: 'Machine-learning denoiser for ray tracing', d: 'NVIDIA’s denoiser for ray-traced games, integrated through Streamline. It writes the denoised frame at output resolution and does not support dynamic resolution scaling.', s: ['sl-rr'] },
    { c: 'denoise', v: 'amd', n: 'FSR Ray Regeneration', g: 'Machine-learning denoiser for ray tracing', d: 'AMD’s machine-learning denoiser in the FSR SDK. The SDK lists it for DirectX 12; Vulkan is not supported yet.', s: ['fsr-sdk'] },

    { c: 'measure', v: 'intel', n: 'MsBetweenPresents', g: 'Frame time', d: 'PresentMon column: the time between one Present() call and the previous one, in milliseconds. This is the per-frame value behind FPS and 1% lows.', s: ['pm'] },
    { c: 'measure', v: 'intel', n: 'MsCPUBusy / MsCPUWait', g: 'CPU share of a frame', d: 'PresentMon columns: how long the CPU worked on the frame before presenting it, and how long it waited before starting the next one.', s: ['pm'] },
    { c: 'measure', v: 'intel', n: 'MsGPUBusy / MsGPUWait', g: 'GPU share of a frame', d: 'PresentMon columns: how long the GPU was actively working on the frame, and how long it was idle during it. A GPU that waits a lot is not the limit.', s: ['pm'] },
    { c: 'measure', v: 'intel', n: 'DisplayLatency', g: 'Frame start to screen', d: 'PresentMon column: how long it took from the start of the frame until it was displayed.', s: ['pm'] },
    { c: 'measure', v: 'intel', n: 'MsClickToPhotonLatency', g: 'Input latency', d: 'PresentMon column: time from the earliest mouse click that contributed to a frame until that frame was displayed.', s: ['pm'] },
    { c: 'measure', v: 'intel', n: 'FrameType', g: 'Rendered or generated frame', d: 'PresentMon column: whether a frame was rendered by the application or generated by a driver or SDK – the way to tell real from generated frames in a capture.', s: ['pm'] },
    { c: 'measure', v: 'intel', n: 'AllowsTearing', g: 'Tearing state', d: 'PresentMon column: 1 if partial frames might be displayed on the screen, 0 if only full frames are displayed.', s: ['pm'] }
  ];
  ROWS.forEach(function (r, i) { r.id = 'n' + (i + 1); });

  function norm(s) { return String(s || '').toLowerCase(); }
  function filter(q, cat, vendor) {
    var words = norm(q).split(/\s+/).filter(Boolean);
    return ROWS.filter(function (r) {
      if (cat && cat !== 'all' && r.c !== cat) return false;
      if (vendor && vendor !== 'all' && r.v !== vendor) return false;
      var hay = norm(r.n + ' ' + r.g + ' ' + r.d + ' ' + VENDORS[r.v] + ' ' + CATS[r.c]);
      return words.every(function (w) { return hay.indexOf(w) !== -1; });
    });
  }
  function csv(list) {
    var q = function (s) { return '"' + String(s).replace(/"/g, '""') + '"'; };
    return ['category,vendor_or_platform,name_on_screen,generic_term,what_it_means,sources'].concat(list.map(function (r) {
      return [q(CATS[r.c]), q(VENDORS[r.v]), q(r.n), q(r.g), q(r.d), q(r.s.map(function (id) { return SOURCES[id][1]; }).join(' '))].join(',');
    })).join('\n') + '\n';
  }

  var api = { ACCESSED: ACCESSED, SOURCES: SOURCES, CATS: CATS, VENDORS: VENDORS, ROWS: ROWS, filter: filter, csv: csv };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.PPGNames = api;
})(this);
