/*
 * Bottleneck Finder – decision tree (pure data + navigation). Unit-tested in tests/logic.test.js:
 * every answer leads to an existing node, every result is reachable, there are no loops, and every
 * linked guide exists.
 */
(function (root) {
  'use strict';
  var START = 'start';

  var Q = {
    start: { q: 'What do you notice most?', a: [
      ['The frame rate is low most of the time', 'low-all'],
      ['Stutter or hitches – the average is fine, but it jerks', 'stutter'],
      ['FPS drops only in busy places: cities, crowds, big fights', 'busy'],
      ['Blurry or late-loading textures, or trouble after raising texture quality', 'r-vram'],
      ['Controls feel delayed although the frame rate looks fine', 'latency'],
      ['It started right after a game update', 'after-update'],
      ['Handheld: battery drains fast or the frame rate swings', 'r-handheld']
    ] },
    'low-all': { q: 'Are you on PC or a handheld PC, where you can change resolution or the upscaler?', a: [
      ['Yes – PC or handheld PC', 'res-test'],
      ['No – PS5, Xbox or Switch 2', 'r-console']
    ] },
    'res-test': { q: 'Lower the render resolution a lot (or set the upscaler to Performance) and look at the same spot. Does the frame rate rise clearly?', a: [
      ['Yes, clearly (roughly a quarter or more)', 'r-gpu'],
      ['It barely changes', 'gpu-usage'],
      ['I am not sure', 'gpu-usage']
    ] },
    'gpu-usage': { q: 'Open a performance overlay. While FPS is low, is GPU usage well below full load – for example under about 85%?', a: [
      ['Yes, the GPU is clearly not fully used', 'cap-check'],
      ['No, the GPU is near 95–100%', 'r-power'],
      ['I cannot see GPU usage', 'r-measure']
    ] },
    'cap-check': { q: 'Is a frame cap, V-Sync, a battery-saver mode or a laptop power plan active?', a: [
      ['Yes, or I am not sure', 'r-cap'],
      ['No, nothing limits the frame rate', 'r-cpu']
    ] },
    stutter: { q: 'When does the stutter happen?', a: [
      ['The first time I see new areas or effects – worse after a game or driver update', 'r-shader'],
      ['When moving fast or entering new areas, even on repeat visits', 'stream'],
      ['At random or at a steady rhythm, wherever I am', 'r-pacing']
    ] },
    stream: { q: 'Is video memory (VRAM) usage close to your graphics card’s total, or did it start after raising textures?', a: [
      ['Yes', 'r-vram'],
      ['No', 'r-streaming']
    ] },
    busy: { q: 'In one of those busy spots, does lowering the render resolution raise the frame rate clearly?', a: [
      ['No, hardly at all', 'r-cpu-dense'],
      ['Yes, clearly', 'r-gpu-effects'],
      ['I am on a console', 'r-console']
    ] },
    latency: { q: 'Is frame generation switched on?', a: [
      ['Yes', 'r-fg'],
      ['No', 'r-queue']
    ] },
    'after-update': { q: 'What changed after the update?', a: [
      ['Stutter in the first minutes or in new areas', 'r-shader'],
      ['The game looks different, or my settings seem reset', 'r-reset'],
      ['The frame rate is lower everywhere', 'r-regression']
    ] }
  };

  var R = {
    'r-gpu': { title: 'Likely GPU-bound', cause: 'The graphics card is the limit: fewer pixels or cheaper effects raise the frame rate directly.',
      steps: ['Switch the upscaler one step down (Quality → Balanced) before lowering anything else.', 'Lower the expensive GPU options: ray tracing, volumetrics, shadows one step from maximum.', 'Use the Settings Translator with “My bottleneck is: GPU”.', 'Re-test the same scene and compare.'],
      guides: ['cpu-or-gpu-bottleneck', 'dlss-vs-fsr-vs-xess', 'graphics-settings-explained'], tool: 'gpu' },
    'r-cpu': { title: 'Likely CPU-bound', cause: 'The processor cannot prepare frames fast enough; the GPU waits. Resolution changes barely help.',
      steps: ['Lower view distance, crowd density and physics detail.', 'Close heavy background apps and overlays you do not need.', 'Keep resolution and textures – they do not help here, so enjoy the image quality.', 'Consider a frame cap slightly below your average for even frame times.'],
      guides: ['cpu-or-gpu-bottleneck', 'frame-cap-vsync-latency-pc', 'fps-frame-time-1-percent-lows'], tool: 'cpu' },
    'r-cpu-dense': { title: 'CPU limit in dense scenes', cause: 'Cities, crowds and big fights mean more characters, physics and draw calls – all CPU work.',
      steps: ['Lower crowd/traffic density and view distance first.', 'Check whether a recent patch mentions CPU or crowd changes (Patch Decoder).', 'Test with a short, repeatable route through the busy area.'],
      guides: ['cpu-or-gpu-bottleneck', 'after-update-retest-routine'], tool: 'cpu' },
    'r-gpu-effects': { title: 'Heavy GPU effects in busy scenes', cause: 'Particles, volumetric fog, many lights or ray-traced effects pile up in those spots.',
      steps: ['Lower particle/effects quality and volumetrics one step.', 'Reduce ray-traced reflections or lighting quality.', 'Keep a small frame-rate headroom with a cap if the dips are short.'],
      guides: ['graphics-settings-explained', 'ray-tracing-settings-explained'], tool: 'gpu' },
    'r-vram': { title: 'Video memory (VRAM) is full', cause: 'When textures and buffers do not fit in VRAM, data is swapped over the slower system bus – textures turn blurry and stutter appears.',
      steps: ['Lower texture quality one step first.', 'Reduce ray tracing and frame generation, which also need memory.', 'Restart the game after the change – some games only free memory on restart.', 'Compare in the same scene after a few minutes of play.'],
      guides: ['vram-full-what-to-lower', 'graphics-settings-explained'], tool: 'vram' },
    'r-shader': { title: 'Shader compilation stutter', cause: 'The game compiles shaders for your GPU the first time an effect appears. Updates of the game or the graphics driver usually invalidate the old cache.',
      steps: ['Let any “compiling shaders” step in the menu finish.', 'Play the first minutes calmly; stutter that fades on the second visit points to shaders.', 'Do not judge performance right after an update.', 'Avoid clearing shader caches unless a guide for your problem says so.'],
      guides: ['shader-compilation-stutter-after-update', 'after-update-retest-routine'] },
    'r-streaming': { title: 'Asset streaming hitches', cause: 'The game loads data while you move. Storage, background downloads or CPU spikes can delay it.',
      steps: ['Install the game on an SSD if it is on a hard drive.', 'Pause downloads, updates and cloud sync while playing.', 'Lower view distance one step.', 'Check storage requirements in the game’s official system requirements.'],
      guides: ['cpu-or-gpu-bottleneck', 'fps-frame-time-1-percent-lows'] },
    'r-pacing': { title: 'Frame pacing or background interruptions', cause: 'Uneven frame delivery or periodic background work makes motion jerky even with a good average.',
      steps: ['Use a frame cap a little below what your system holds, or VRR if available.', 'Turn off overlays and recording you do not need, one at a time.', 'Look at the frame-time graph, not only the FPS number.'],
      guides: ['fps-frame-time-1-percent-lows', 'frame-cap-vsync-latency-pc'] },
    'r-power': { title: 'GPU at full load – power, heat or simply too demanding', cause: 'If the GPU is fully used and lowering resolution did not help much, the graphics card may be throttling, or the scene is extremely heavy.',
      steps: ['Check GPU temperature and clock speed in the overlay during the drop.', 'Make sure the laptop is plugged in and on a performance power profile.', 'Lower one GPU-heavy option (ray tracing, volumetrics) and re-test.'],
      guides: ['cpu-or-gpu-bottleneck', 'how-to-test-a-settings-change'], tool: 'gpu' },
    'r-cap': { title: 'A limiter caps the frame rate', cause: 'A frame cap, V-Sync, a battery profile or a power plan stops the system from going faster – nothing is “too slow”.',
      steps: ['Check the in-game frame cap and V-Sync.', 'Check the driver control panel and any overlay limiter.', 'On laptops and handhelds, check the power mode.'],
      guides: ['frame-cap-vsync-latency-pc', 'steam-deck-frame-cap-tdp-battery'] },
    'r-measure': { title: 'Measure first', cause: 'Without GPU usage and frame times, the cause is guesswork.',
      steps: ['Enable a performance overlay (GPU driver overlay, Steam overlay statistics or a tool such as PresentMon).', 'Record the same scene twice.', 'Then run this finder again with the numbers.'],
      guides: ['fps-frame-time-1-percent-lows', 'how-to-test-a-settings-change'] },
    'r-console': { title: 'Console: choose the right mode, not single settings', cause: 'Consoles expose modes instead of individual options. The mode decides resolution and frame-rate target.',
      steps: ['Try the performance mode if smoothness matters most, the quality/fidelity mode for sharpness.', 'Check whether 120 Hz or VRR is enabled on console and TV – some modes depend on it.', 'After an update, check whether the mode was reset.'],
      guides: ['ps5-performance-vs-fidelity-mode', 'xbox-series-s-vs-x-modes', 'vrr-120hz-console-setup'] },
    'r-fg': { title: 'Frame generation adds latency', cause: 'Generated frames make motion smoother but input still follows the rendered frames – and generation adds a little delay.',
      steps: ['Make sure the base frame rate without generation is reasonable.', 'Enable the latency reduction option the game offers (it is often required with frame generation).', 'For competitive games, try without frame generation.'],
      guides: ['frame-generation-explained', 'frame-cap-vsync-latency-pc'] },
    'r-queue': { title: 'Render queue or V-Sync latency', cause: 'When the GPU runs at 100% or V-Sync waits for the display, frames queue up and input lags behind.',
      steps: ['Use a frame cap slightly below the refresh rate together with VRR.', 'Enable the game’s latency reduction option if available.', 'Avoid V-Sync without VRR in fast games, or accept the trade-off with tearing.'],
      guides: ['frame-cap-vsync-latency-pc', 'vrr-120hz-console-setup'] },
    'r-reset': { title: 'Settings or defaults changed', cause: 'Updates sometimes reset options, rename presets or change what a preset contains.',
      steps: ['Compare your settings with your notes or a photo of the menu.', 'Read the patch notes for changed presets (Patch Decoder can sort them).', 'Re-test with the routine before changing more.'],
      guides: ['how-to-read-patch-notes', 'after-update-retest-routine'] },
    'r-regression': { title: 'Possible performance regression', cause: 'A patch can make a scene heavier, change a preset or introduce a bug. First rule out shader compilation and reset settings.',
      steps: ['Wait until shaders are compiled, then re-test the same route.', 'Check the patch notes and known issues for your platform.', 'If the drop is confirmed, lower the option the patch changed, and report it to the developer with your numbers.'],
      guides: ['after-update-retest-routine', 'how-to-read-patch-notes', 'how-to-test-a-settings-change'] },
    'r-handheld': { title: 'Handheld power budget', cause: 'Handhelds share a small power budget between CPU and GPU. Uncapped frame rates use the whole budget and drain the battery.',
      steps: ['Set a frame cap the device can hold (for example 30, 40 or 45 fps).', 'Lower the render resolution or use an upscaler mode before lowering textures.', 'Use per-game power profiles and check the screen brightness.'],
      guides: ['steam-deck-frame-cap-tdp-battery', 'dlss-vs-fsr-vs-xess'] }
  };

  function node(id) {
    if (Q[id]) return { id: id, kind: 'question', q: Q[id].q, answers: Q[id].a.map(function (x) { return { label: x[0], next: x[1] }; }) };
    if (R[id]) return { id: id, kind: 'result', title: R[id].title, cause: R[id].cause, steps: R[id].steps.slice(), guides: R[id].guides.slice(), tool: R[id].tool || null };
    return null;
  }

  // follow a list of answer indexes from the start; returns the node reached (or null if invalid)
  function walk(path) {
    var id = START;
    for (var i = 0; i < path.length; i++) {
      var q = Q[id];
      if (!q || !q.a[path[i]]) return null;
      id = q.a[path[i]][1];
    }
    return node(id);
  }

  function allTargets() {
    var t = [];
    Object.keys(Q).forEach(function (k) { Q[k].a.forEach(function (a) { t.push(a[1]); }); });
    return t;
  }

  var api = { START: START, QUESTIONS: Q, RESULTS: R, node: node, walk: walk, allTargets: allTargets };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.PPGFinder = api;
})(this);
