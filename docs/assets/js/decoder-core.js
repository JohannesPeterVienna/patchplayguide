/*
 * Patch Decoder – pure logic (no DOM). Unit-tested in tests/logic.test.js.
 * - EXAMPLE: a patch of a FICTIONAL game ("Saltmarsh Protocol"), used to demonstrate the format.
 * - classify(line): sorts a pasted patch-note line into change type (+ ~ −), category and platforms.
 * - filter / checklist / exportText: the filtered view and the after-update checklist as plain text.
 */
(function (root) {
  'use strict';

  var CATEGORIES = {
    stability: 'Stability & crashes',
    shaders: 'Shaders & loading',
    upscaling: 'Upscaling & frame generation',
    modes: 'Console & handheld modes',
    input: 'Input & latency',
    graphics: 'Graphics options',
    performance: 'Performance',
    other: 'Gameplay, audio & other'
  };
  var PLATFORMS = { pc: 'PC', ps5: 'PS5', xbox: 'Xbox', switch2: 'Switch 2', handheld: 'Handheld PC' };
  var TYPES = { plus: '+', tilde: '~', minus: '−' };

  // What to do, by category and change type – written for this site, deliberately general.
  var ACTIONS = {
    stability: { plus: 'If you had changed settings to work around this crash, you can test reverting them now.', tilde: 'No settings change needed; note the change in case behavior differs.', minus: 'If you are affected, avoid the trigger described until a fix ships and keep your previous settings.' },
    shaders: { plus: 'Expect smoother first runs; still let any shader preparation finish before judging performance.', tilde: 'Expect the shader cache to rebuild: let compilation finish and play a few minutes before you judge stutter.', minus: 'Expect more first-run stutter; let the game compile shaders in the menu before playing.' },
    upscaling: { plus: 'Compare the new upscaling or frame generation option against your current one at the same scene.', tilde: 'Re-check image sharpness and latency; the same preset name may now look or feel different.', minus: 'If you used the removed option, pick the closest remaining upscaler mode and re-test.' },
    modes: { plus: 'Check whether the new mode needs a 120 Hz or VRR display and compare it with your current mode.', tilde: 'Re-test your preferred mode; resolution or frame-rate targets may have moved.', minus: 'Pick a remaining mode deliberately instead of letting the game default decide.' },
    input: { plus: 'Try the new latency option with a frame cap; judge feel in the same scene before and after.', tilde: 'Re-check sensitivity, dead zones and latency settings – they may have been reset or rescaled.', minus: 'If input feels different, re-check controller and mouse settings first.' },
    graphics: { plus: 'Try the new option on its own and compare frame time and image quality in one fixed scene.', tilde: 'The same preset name may cost more or less now: re-test this option before keeping it.', minus: 'Check whether your saved preset fell back to a different value and re-select it.' },
    performance: { plus: 'Re-run your usual test route; if you lowered settings for this area, try one step higher.', tilde: 'Re-run your test route and compare average FPS and 1% lows with your notes.', minus: 'Re-test and, if performance dropped, lower the most expensive option for your bottleneck.' },
    other: { plus: 'No graphics action needed.', tilde: 'No graphics action needed; gameplay change only.', minus: 'No graphics action needed.' }
  };

  var EXAMPLE = {
    game: 'Saltmarsh Protocol',
    fictional: true,
    version: '1.8.0',
    date: '2026-10-28',
    note: 'Fictional example game and patch, invented for this page to show how the decoder works. It describes no real product.',
    items: [
      { text: 'Crowd simulation in the harbor district uses noticeably less CPU time.', type: 'plus', cat: 'performance', platforms: ['pc', 'ps5', 'xbox'] },
      { text: 'Shadow quality “High” now uses the longer shadow distance of the former “Ultra” setting.', type: 'tilde', cat: 'graphics', platforms: ['pc'] },
      { text: 'Added a sharpening slider for the upscaler.', type: 'plus', cat: 'upscaling', platforms: ['pc', 'handheld'] },
      { text: 'The “Low” texture option was removed on PC; the minimum is now “Medium”.', type: 'minus', cat: 'graphics', platforms: ['pc'] },
      { text: 'PS5 performance mode: the lower limit of the dynamic resolution was reduced to hold 60 fps more often.', type: 'tilde', cat: 'modes', platforms: ['ps5'] },
      { text: 'New 40 fps balanced mode for displays running at 120 Hz.', type: 'plus', cat: 'modes', platforms: ['ps5', 'xbox'] },
      { text: 'Xbox Series S: the separate performance mode was removed; one 30 fps mode remains.', type: 'minus', cat: 'modes', platforms: ['xbox'] },
      { text: 'Shaders are rebuilt on the first launch after this update.', type: 'tilde', cat: 'shaders', platforms: ['pc', 'handheld'] },
      { text: 'Fixed a crash when switching between windowed and fullscreen.', type: 'plus', cat: 'stability', platforms: ['pc'] },
      { text: 'Added a latency reduction option to the display menu.', type: 'plus', cat: 'input', platforms: ['pc'] },
      { text: 'Known issue: frame generation can make the map screen flicker.', type: 'minus', cat: 'upscaling', platforms: ['pc'] },
      { text: 'Handheld mode on Switch 2 targets a higher resolution; docked mode is unchanged.', type: 'tilde', cat: 'modes', platforms: ['switch2'] },
      { text: 'Default frame cap on handheld PCs changed from 30 to 40 fps.', type: 'tilde', cat: 'modes', platforms: ['handheld'] },
      { text: 'Harpoon reload time adjusted from 2.4 to 2.1 seconds.', type: 'tilde', cat: 'other', platforms: [] }
    ]
  };

  var TYPE_RULES = [
    ['plus', /\bno longer (?:crash(?:es)?|stutters?|flickers?|freez(?:e|es)|hitch(?:es)?|appears?|occurs?|see|causes?)\b/i],
    ['tilde', /\bcan now be (?:disabled|turned off|switched off|toggled)\b/i],
    ['minus', /\b(known issues?|removed?|removes|removing|no longer|disabled?|disables|deprecated|regression|temporarily unavailable|reverted|nerf(?:ed|s)?|reduced (?:the )?max(?:imum)?)\b/i],
    ['plus', /\b(add(?:ed|s)?|new|improved?|improves|improvements?|optimi[sz](?:ed|es|ation)|fix(?:ed|es)?|resolved|faster|smoother|support for|now supports?|enabled|reduced (?:stutter|hitch(?:ing)?|load(?:ing)? times?|memory|cpu|gpu|vram|latency))\b/i],
    ['tilde', /\b(change[ds]?|adjust(?:ed|s)?|tweak(?:ed|s)?|update[ds]?|rebalanc(?:ed|es)|rework(?:ed|s)?|now|moved|renamed|default)\b/i]
  ];

  var CAT_RULES = [
    ['stability', /\b(crash(?:es|ed|ing)?|freez(?:e|es|ing)|hang(?:s|ing)?|stability|softlock|error code|disconnect(?:s|ed|ion)?)\b/i],
    ['shaders', /\b(shaders?|pso|pipeline cache|compil(?:e|es|ed|ing|ation)|pre-?compil\w*|shader cache|loading screens?|load times?)\b/i],
    ['upscaling', /\b(dlss|fsr|xess|pssr|upscal\w*|super resolution|sharpen\w*|frame gen\w*|multi frame|ray reconstruction)\b/i],
    ['modes', /\b(performance mode|quality mode|fidelity mode|resolution mode|balanced mode|graphics mode|\d{2} ?fps mode|\d{2,3} ?hz|vrr|variable refresh|pro enhanced|ps5 pro|docked|handheld mode|tdp|battery)\b/i],
    ['input', /\b(latency|input lag|input|reflex|anti-lag|controller|gamepad|mouse|sensitivity|dead ?zones?|aim assist|key ?bind\w*)\b/i],
    ['graphics', /\b(shadows?|textures?|reflections?|ray[- ]?trac\w*|path[- ]?trac\w*|lighting|global illumination|fog|volumetric\w*|ambient occlusion|anti-?aliasing|taa|msaa|lod|draw distance|view distance|foliage|grass|preset|graphics|resolution|hdr|field of view|fov|motion blur|depth of field|particles?|tessellation)\b/i],
    ['performance', /\b(fps|frame ?rates?|performance|cpu|gpu|vram|memory|ram|stutter\w*|hitch\w*|frame ?times?|frame pacing|optimi[sz]\w*)\b/i]
  ];

  var PLATFORM_RULES = [
    ['switch2', /\b(switch 2|nintendo switch 2|switch2)\b/i],
    ['handheld', /\b(steam deck|rog ally|legion go|handheld pcs?|handhelds?)\b/i],
    ['ps5', /\b(ps5(?: pro)?|playstation(?: 5)?)\b/i],
    ['xbox', /\b(xbox|series [xs]|series x\|s)\b/i],
    ['pc', /\b(pc|windows|steam|epic games store|directx ?1[12]|dx1[12]|vulkan|nvidia|geforce|rtx|radeon|amd|intel arc|mouse and keyboard)\b/i]
  ];

  function cleanLine(raw) {
    return String(raw).replace(/\s+/g, ' ').trim()
      .replace(/^(?:[-*•·–—+~]|\d+[.)]|\[[^\]]{0,12}\])\s*/, '').trim();
  }

  function detectType(raw) {
    var s = String(raw).trim();
    if (/^\+\s/.test(s)) return 'plus';
    if (/^~\s/.test(s)) return 'tilde';
    if (/^[−]\s/.test(s)) return 'minus';
    var c = cleanLine(s);
    if (/^known issues?\b/i.test(c)) return 'minus';
    if (/^(fix(?:ed|es)?|resolved|addressed|corrected)\b/i.test(c)) return 'plus';
    for (var i = 0; i < TYPE_RULES.length; i++) if (TYPE_RULES[i][1].test(s)) return TYPE_RULES[i][0];
    return 'tilde';
  }

  var FIX_START = /^(fix(?:ed|es)?|resolved|addressed|corrected)\b/i;
  function detectCategory(s) {
    // a bug fix that merely happens "in handheld mode" / "when docked" is not a mode change
    if (FIX_START.test(s)) s = s.replace(/\b(handheld mode|docked mode|when docked|docked)\b/ig, '');
    for (var i = 0; i < CAT_RULES.length; i++) if (CAT_RULES[i][1].test(s)) return CAT_RULES[i][0];
    return 'other';
  }

  function detectPlatforms(s) {
    var found = [];
    var text = s;
    // "handheld mode" next to Switch 2 is the Switch's mode, not a handheld PC
    if (/switch 2/i.test(text)) text = text.replace(/handheld mode/ig, '');
    // "Steam Deck" is a handheld PC, not the PC client
    var pcText = text.replace(/steam deck/ig, '');
    PLATFORM_RULES.forEach(function (r) {
      var t = r[0] === 'pc' ? pcText : text;
      if (r[1].test(t)) found.push(r[0]);
    });
    return found;
  }

  function classify(raw) {
    var text = cleanLine(raw);
    if (!text) return null;
    return { text: text, type: detectType(raw), cat: detectCategory(text), platforms: detectPlatforms(text) };
  }

  function classifyAll(input) {
    return String(input || '').split(/\r?\n/).map(classify).filter(function (x) {
      return x && x.text.length >= 3 && !/^#+\s|^(patch notes?|version|update)\s*[\d.]*:?$/i.test(x.text);
    }).slice(0, 300);
  }

  function actionFor(item) {
    var a = ACTIONS[item.cat] || ACTIONS.other;
    return a[item.type] || a.tilde;
  }

  // platform filter: an item with no platform applies to all platforms
  function filter(items, cat, platform) {
    return items.filter(function (it) {
      if (cat && cat !== 'all' && it.cat !== cat) return false;
      if (platform && platform !== 'all' && it.platforms.length && it.platforms.indexOf(platform) === -1) return false;
      return true;
    });
  }

  function counts(items) {
    var c = { plus: 0, tilde: 0, minus: 0 };
    items.forEach(function (it) { c[it.type]++; });
    return c;
  }

  var BASE_CHECKS = [
    'Confirm your graphics and display settings were not reset by the update.',
    'Let shader compilation finish (menu progress bar or the first few minutes) before judging stutter.',
    'Run your usual test scene or route once to warm up, then once to measure.',
    'Compare average FPS and 1% lows (or how it feels, on console) with your notes from before the update.'
  ];

  function checklist(items) {
    var list = BASE_CHECKS.slice();
    items.forEach(function (it) {
      if (it.cat === 'other') return;
      var a = actionFor(it);
      if (list.indexOf(a) === -1) list.push(a);
    });
    return list;
  }

  function exportText(title, items, checks, done) {
    var lines = ['Patch Play Guide – after-update notes', title, ''];
    ['plus', 'tilde', 'minus'].forEach(function (t) {
      items.filter(function (it) { return it.type === t; }).forEach(function (it) {
        lines.push(TYPES[t] + ' [' + CATEGORIES[it.cat] + '] ' + it.text + (it.platforms.length ? ' (' + it.platforms.map(function (p) { return PLATFORMS[p]; }).join(', ') + ')' : ' (all platforms)'));
      });
    });
    lines.push('', 'Checklist:');
    checks.forEach(function (c, i) { lines.push((done && done[i] ? '[x] ' : '[ ] ') + c); });
    return lines.join('\n');
  }

  var api = {
    CATEGORIES: CATEGORIES, PLATFORMS: PLATFORMS, TYPES: TYPES, EXAMPLE: EXAMPLE, ACTIONS: ACTIONS,
    cleanLine: cleanLine, detectType: detectType, detectCategory: detectCategory, detectPlatforms: detectPlatforms,
    classify: classify, classifyAll: classifyAll, actionFor: actionFor, filter: filter, counts: counts,
    checklist: checklist, exportText: exportText
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.PPGDecoder = api;
})(this);
