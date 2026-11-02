/*
 * Settings Translator – pure logic (no DOM). Unit-tested in tests/logic.test.js.
 * Load levels are deliberately qualitative and conservative: 0 = minimal, 1 = low, 2 = moderate, 3 = high.
 * They describe the TYPICAL extra load of the higher setting compared with a lower one in modern
 * PC games. They are not benchmark numbers; individual games and engines differ.
 * "loss" = how noticeable a one- or two-step reduction typically is (1 = subtle, 3 = obvious).
 */
(function (root) {
  'use strict';
  var LEVELS = ['minimal', 'low', 'moderate', 'high'];
  var LOSS = ['', 'subtle', 'noticeable', 'obvious'];

  var OPTIONS = [
    { id: 'render-res', name: 'Render resolution / render scale', aka: 'Resolution scale, internal resolution', gpu: 3, cpu: 0, vram: 2, loss: 3, guide: 'dlss-vs-fsr-vs-xess',
      what: 'How many pixels the game actually renders. Every shaded pixel costs GPU time, so this is the strongest single GPU lever.',
      tip: 'Lower it through an upscaler mode (Quality → Balanced) rather than lowering the output resolution of the display.' },
    { id: 'upscaler', name: 'Upscaler mode (DLSS / FSR / XeSS / TSR)', aka: 'Quality, Balanced, Performance', gpu: 3, cpu: 0, vram: 1, loss: 2, guide: 'dlss-vs-fsr-vs-xess',
      what: 'Renders fewer pixels and reconstructs a sharper image. Native or “Quality” costs the most GPU time; “Performance” the least.',
      tip: 'Step from Quality to Balanced first; Performance mode is usually fine at 4K output but softer at 1080p.' },
    { id: 'framegen', name: 'Frame generation', aka: 'DLSS Frame Generation, FSR Frame Generation', gpu: 1, cpu: 0, vram: 2, loss: 2, special: true, guide: 'frame-generation-explained',
      what: 'Inserts generated frames between rendered ones. Motion looks smoother, but input still follows the rendered frame rate and latency rises slightly.',
      tip: 'Not a “lower first” option: use it when the base frame rate is already reasonable, not to rescue a very low one.' },
    { id: 'textures', name: 'Texture quality', aka: 'Texture resolution, texture pool', gpu: 1, cpu: 0, vram: 3, loss: 2, guide: 'vram-full-what-to-lower',
      what: 'Resolution of surface images. Costs little GPU time while it fits in video memory, but fills VRAM quickly.',
      tip: 'The first option to lower when VRAM is full; usually leave it high when VRAM is not the limit.' },
    { id: 'aniso', name: 'Texture filtering (anisotropic)', aka: 'AF 4x / 8x / 16x', gpu: 0, cpu: 0, vram: 0, loss: 2, guide: 'graphics-settings-explained',
      what: 'Keeps textures sharp on surfaces seen at an angle, such as roads and floors.',
      tip: 'Typically very cheap on current GPUs – lower it last.' },
    { id: 'shadows', name: 'Shadow quality', aka: 'Shadow resolution, shadow distance, cascades', gpu: 2, cpu: 1, vram: 1, loss: 1, guide: 'graphics-settings-explained',
      what: 'Resolution, distance and softness of shadows. The top step often adds detail few players notice in motion.',
      tip: 'One step down from the maximum is a classic low-loss gain.' },
    { id: 'ao', name: 'Ambient occlusion', aka: 'SSAO, HBAO+, GTAO', gpu: 2, cpu: 0, vram: 1, loss: 1, guide: 'graphics-settings-explained',
      what: 'Darkens creases and contact areas so objects look grounded.',
      tip: 'Choose the cheaper method or a lower quality rather than switching it off completely.' },
    { id: 'rt-gi', name: 'Ray-traced lighting / global illumination', aka: 'RTGI, path tracing, Lumen hardware', gpu: 3, cpu: 1, vram: 2, loss: 2, guide: 'ray-tracing-settings-explained',
      what: 'Calculates bounced light with rays. Can change the look of a whole scene, and is among the most expensive options.',
      tip: 'Lower ray-tracing quality one step or turn individual ray-traced effects off before touching textures.' },
    { id: 'rt-refl', name: 'Ray-traced reflections', aka: 'RT reflections', gpu: 3, cpu: 1, vram: 2, loss: 2, guide: 'ray-tracing-settings-explained',
      what: 'Accurate reflections on water, glass and polished floors.',
      tip: 'Worth keeping in rainy city scenes, easy to drop in games with few reflective surfaces.' },
    { id: 'ssr', name: 'Screen-space reflections', aka: 'SSR', gpu: 2, cpu: 0, vram: 0, loss: 1, guide: 'graphics-settings-explained',
      what: 'Cheaper reflections built from what is already on screen; they vanish when the reflected object leaves the screen.',
      tip: 'Lower quality step by step; at low settings some games show grain.' },
    { id: 'volumetrics', name: 'Volumetric fog, clouds and light', aka: 'Volumetrics, god rays', gpu: 3, cpu: 0, vram: 1, loss: 1, guide: 'graphics-settings-explained',
      what: 'Light scattering in fog, dust and clouds. The highest preset is often far more expensive than the step below it.',
      tip: 'Drop one step from the maximum first – the visual difference is often small.' },
    { id: 'aa', name: 'Anti-aliasing', aka: 'TAA, SMAA, FXAA, MSAA', gpu: 2, cpu: 0, vram: 1, loss: 2, guide: 'graphics-settings-explained',
      what: 'Smooths jagged edges. Post-process methods (TAA, SMAA, FXAA) are cheap; MSAA can be expensive in modern engines.',
      tip: 'When an upscaler is active it usually replaces the anti-aliasing setting.' },
    { id: 'post', name: 'Post-processing', aka: 'Motion blur, depth of field, film grain, bloom', gpu: 1, cpu: 0, vram: 0, loss: 1, guide: 'graphics-settings-explained',
      what: 'Camera effects applied after the image is rendered. Mostly a matter of taste.',
      tip: 'Turn off what you dislike; the performance gain is usually small.' },
    { id: 'draw', name: 'View distance / level of detail', aka: 'Draw distance, LOD, object detail', gpu: 1, cpu: 3, vram: 1, loss: 2, guide: 'cpu-or-gpu-bottleneck',
      what: 'How far away objects are drawn in full detail. More objects means more work for the CPU to prepare each frame.',
      tip: 'One of the first options to lower when you are CPU-bound in open worlds.' },
    { id: 'crowds', name: 'Crowd, traffic and NPC density', aka: 'Population density', gpu: 1, cpu: 3, vram: 1, loss: 1, guide: 'cpu-or-gpu-bottleneck',
      what: 'How many characters and vehicles are simulated. Each one needs animation, AI and physics on the CPU.',
      tip: 'The classic fix for low FPS in cities and busy hubs.' },
    { id: 'foliage', name: 'Foliage and grass density', aka: 'Vegetation detail', gpu: 2, cpu: 2, vram: 1, loss: 1, guide: 'graphics-settings-explained',
      what: 'Amount and distance of grass, bushes and trees. Costs both draw-call work and GPU time.',
      tip: 'A useful middle lever when you are not sure which side is limiting.' },
    { id: 'particles', name: 'Particle and effects quality', aka: 'VFX quality, explosions, smoke', gpu: 2, cpu: 1, vram: 0, loss: 1, guide: 'graphics-settings-explained',
      what: 'Detail of smoke, sparks and explosions. Can cause frame-time spikes in big fights.',
      tip: 'Lower it if FPS collapses only during heavy effects.' },
    { id: 'geometry', name: 'Geometry detail / tessellation', aka: 'Mesh quality, terrain detail', gpu: 2, cpu: 1, vram: 1, loss: 1, guide: 'graphics-settings-explained',
      what: 'Polygon detail of models and terrain.',
      tip: 'Usually a moderate gain at medium; the loss shows on close-up rocks and characters.' },
    { id: 'physics', name: 'Physics and destruction detail', aka: 'Debris, cloth, simulation', gpu: 1, cpu: 2, vram: 0, loss: 1, guide: 'cpu-or-gpu-bottleneck',
      what: 'How many objects are simulated physically. Mostly CPU work.',
      tip: 'Lower it when frame rate dips during explosions or collapses.' },
    { id: 'fov', name: 'Field of view', aka: 'FOV', gpu: 1, cpu: 1, vram: 0, loss: 2, guide: 'graphics-settings-explained',
      what: 'How wide the camera sees. A wider view shows more objects at once.',
      tip: 'Choose it for comfort and gameplay first; lowering it is rarely the right performance fix.' }
  ];

  var RES = ['gpu', 'cpu', 'vram'];

  // score: how good a candidate the option is to lower first for the chosen bottleneck
  function score(opt, bottleneck) {
    if (opt.special) return -1;
    if (RES.indexOf(bottleneck) === -1) return opt.gpu + opt.cpu + opt.vram - opt.loss;
    return opt[bottleneck] * 3 - opt.loss;
  }

  function rank(bottleneck, options) {
    var list = (options || OPTIONS).slice();
    var withIndex = list.map(function (o, i) { return { o: o, i: i, s: score(o, bottleneck) }; });
    withIndex.sort(function (a, b) { return b.s - a.s || a.i - b.i; });
    return withIndex.map(function (x) { return x.o; });
  }

  // options highlighted as "lower first": high load on the bottleneck resource and not an obvious loss
  function lowerFirst(bottleneck, limit) {
    if (RES.indexOf(bottleneck) === -1) return [];
    return rank(bottleneck).filter(function (o) { return !o.special && o[bottleneck] >= 2 && o.loss <= 2; }).slice(0, limit || 5);
  }

  function search(q, options) {
    var s = String(q || '').trim().toLowerCase();
    var list = options || OPTIONS;
    if (!s) return list.slice();
    return list.filter(function (o) { return (o.name + ' ' + o.aka + ' ' + o.what).toLowerCase().indexOf(s) !== -1; });
  }

  function level(n) { return LEVELS[n] || LEVELS[0]; }

  var api = { OPTIONS: OPTIONS, LEVELS: LEVELS, LOSS: LOSS, score: score, rank: rank, lowerFirst: lowerFirst, search: search, level: level };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.PPGTranslator = api;
})(this);
