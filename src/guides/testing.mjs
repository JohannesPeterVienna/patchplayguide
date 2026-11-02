import { tbl, fig } from '../h.mjs';

export const testChange = {
  slug: 'how-to-test-a-settings-change',
  group: 'testing',
  kicker: 'Guide · method',
  short: 'How to test a settings change',
  title: 'How to test a settings change properly',
  description: 'A repeatable method for comparing graphics settings: fixed scene, warm-up run, several measured runs, average FPS and 1% lows, and when a difference is real.',
  h1: 'How to test a settings change properly',
  lede: 'Most “this setting gives +20 FPS” claims come from a single glance at a counter. Frame rates jump around by several percent from one second to the next, so a single reading can easily show a gain that is not there. A proper comparison takes about ten minutes, needs no paid tools, and gives you numbers you can trust and compare after the next patch.',
  sections: [
    `<h2 id="principles">Four principles</h2>
<ul class="do">
<li><b>Same scene.</b> Compare in exactly the same place, ideally with the same movement. Two different views of the same level can differ more than any setting.</li>
<li><b>One change at a time.</b> If you change shadows and textures together, you cannot tell which one mattered.</li>
<li><b>Warm up first.</b> The first run after starting the game – and especially after an update – includes shader compilation and loading. Do not measure it.</li>
<li><b>Several runs.</b> Measure each setting at least twice, better three times, and compare averages.</li>
</ul>
<p>These principles apply to PC and handhelds, where you can change single options. On consoles, the same method works for comparing modes, using your eyes and the game’s own information instead of a counter.</p>`,
    `<h2 id="scene">Choose a good test scene</h2>
<p>A good test scene is demanding, repeatable and typical of how you play. Built-in benchmarks are convenient and repeatable, but some do not represent the heaviest gameplay – a city full of characters may stress the CPU far more than the benchmark’s flyover. A short route of 30 to 60 seconds that you can walk the same way every time is often more useful.</p>
${tbl('Test scene options', ['Type', 'Repeatability', 'Represents gameplay?', 'Best for'], [
  ['Built-in benchmark', 'Very high', 'Sometimes', 'Quick GPU comparisons'],
  ['Fixed route (30–60 s)', 'High with practice', 'Yes, if chosen well', 'Most comparisons, CPU-heavy areas'],
  ['Standing still at one spot', 'Very high', 'Partly', 'Pure GPU settings such as shadows or fog'],
  ['Normal play session', 'Low', 'Yes', 'Final check of how it feels, not numbers']
])}
<p>Write the scene down: location, time of day in the game if it changes, weather, route. Then you can repeat the test after the next update, when the <a href="/guides/after-update-retest-routine/">re-test routine</a> asks for your old numbers.</p>`,
    `<h2 id="measure">What to measure</h2>
<p>Record at least <b>average FPS</b> and <b>1% lows</b> – the frame rate during the slowest one percent of frames, which captures stutter that the average hides. Tools such as PresentMon, CapFrameX or the overlays of GPU driver software can record a run and report both. If you only have a counter, write down the typical value and the lowest value you see during the route – less precise, but still useful.</p>
<p>Also note the <b>conditions</b>: game version, driver version, resolution, upscaler mode and the full preset. A number without its conditions cannot be compared later. Our guide to <a href="/guides/fps-frame-time-1-percent-lows/">FPS, frame time and 1% lows</a> explains how these figures are calculated and why different tools give slightly different 1% values.</p>`,
    `<h2 id="routine">The routine, step by step</h2>
<ol>
<li>Start the game, load your save and walk the route once without measuring (warm-up).</li>
<li>Measure the route with your current settings: run A1.</li>
<li>Change one setting. Apply it; restart the game if the menu asks for it.</li>
<li>Walk the route once without measuring, then measure: run B1.</li>
<li>Switch back and measure A2, then switch again and measure B2. Alternating reduces the effect of the system warming up.</li>
<li>Compare the averages of A and B, for both average FPS and 1% lows.</li>
</ol>
${fig('tc-fig', 'Alternating test runs A1, B1, A2, B2 after a warm-up run, then averaging A and B',
`<rect class="g-bg" width="640" height="200"/>
<rect class="g-panel" x="20" y="60" width="96" height="60" rx="6"/><text class="g-tm" x="32" y="96">warm-up</text>
<rect class="g-panel" x="136" y="60" width="96" height="60" rx="6"/><text class="g-tb" x="170" y="96">A1</text>
<rect class="g-acc" x="252" y="60" width="96" height="60" rx="6"/><text class="g-tk" x="288" y="96">B1</text>
<rect class="g-panel" x="368" y="60" width="96" height="60" rx="6"/><text class="g-tb" x="402" y="96">A2</text>
<rect class="g-acc" x="484" y="60" width="96" height="60" rx="6"/><text class="g-tk" x="520" y="96">B2</text>
<text class="g-tm" x="20" y="40">ALTERNATE SETTINGS · SAME ROUTE · NOTE AVERAGE FPS AND 1% LOWS</text>
<text class="g-t" x="136" y="160">compare (A1+A2)/2 with (B1+B2)/2</text>`,
'Alternating A and B instead of measuring A twice and then B twice spreads slow drifts – heat, background tasks – evenly over both settings.', '0 0 640 200')}`,
    `<h2 id="real">When is a difference real?</h2>
<p>Look at how much the runs of the same setting differ from each other. If A1 and A2 differ by 3%, a 2% difference between A and B is noise. A useful rule: treat a difference as real only when it is clearly larger than the spread between repeated runs of the same setting – and when it points the same way in every pair.</p>
<p>Also check whether it matters. A 3% gain from 140 to 144 FPS is invisible to most people; the same 3% from 58 to 60 FPS on a 60 Hz display can be the difference between smooth and uneven motion. Improvements in 1% lows are often more noticeable than in the average.</p>
<p>Finally, look at the image. Take a screenshot at the same spot with each setting and compare them side by side, then decide whether the visual difference is worth the performance difference. The <a href="/tools/settings-translator/">Settings Translator</a> suggests which options are worth testing first for your bottleneck.</p>`,
    `<h2 id="mistakes">Common mistakes</h2>
<ul class="do">
<li>Measuring right after an update or driver install – you are measuring shader compilation.</li>
<li>Comparing different scenes, or day and night in a game with a day cycle.</li>
<li>Testing with a frame cap or V-Sync active – both settings may hit the cap and look identical.</li>
<li>Laptop on battery or in a quiet mode for one run and plugged in for the other.</li>
<li>Trusting one run because the result is the one you hoped for.</li>
</ul>`
  ],
  faq: [
    ['How many test runs do I need?', 'At least two per setting, better three, after a warm-up run. Alternate the settings so slow changes affect both equally.'],
    ['Are built-in benchmarks reliable?', 'They are very repeatable, which is good for comparisons. They do not always represent the heaviest gameplay, especially CPU-heavy scenes with many characters.'],
    ['What are 1% lows?', 'The frame rate during the slowest one percent of frames in a run. They show stutter and hitches that the average hides.'],
    ['Should I disable the frame cap for testing?', 'Yes, for performance comparisons. With a cap, both settings may hit the limit and look identical even when one is much faster.']
  ],
  sources: [
    ['PresentMon', 'https://github.com/GameTechDev/PresentMon', 'open-source frame-time capture'],
    ['CapFrameX', null, 'free frame-time capture and analysis tool for Windows'],
    ['GPU vendor overlays', null, 'NVIDIA App and AMD Software: Adrenalin Edition performance metrics']
  ],
  related: ['fps-frame-time-1-percent-lows', 'after-update-retest-routine', 'cpu-or-gpu-bottleneck']
};

export const readPatchNotes = {
  slug: 'how-to-read-patch-notes',
  group: 'testing',
  kicker: 'Guide · patch notes',
  short: 'How to read patch notes',
  title: 'How to read patch notes: what each change means for you',
  description: 'How to read game patch notes for what matters to your settings: performance, presets, upscalers, console modes, shaders and known issues, sorted by platform.',
  h1: 'How to read patch notes: what each kind of change means for your settings',
  lede: 'Patch notes mix balance changes, bug fixes, new content and technical changes in one list, often hundreds of lines long. Only a handful usually matter for how the game runs and looks on your screen. This guide shows how to find them, how to read the typical wording, and which action each kind of line calls for.',
  sections: [
    `<h2 id="where">Where to find the real patch notes</h2>
<p>Use the official source: the developer’s or publisher’s website, the game’s news page on Steam, the platform holder’s news channels, or the update history in the game itself. Console and PC versions often get separate notes, and hotfixes are sometimes only announced on social media or in community forums run by the developer. Summaries on other sites – including ours – are no substitute for the original wording when you decide what to do.</p>
<p>Two things are easy to miss: the <b>platform labels</b> (a line may apply only to PS5 or only to PC) and the <b>known issues</b> section, often at the very end. Both decide whether a change concerns you.</p>`,
    `<h2 id="kinds">The kinds of lines that matter</h2>
${tbl('Patch-note lines and what they mean for settings', ['Kind of line', 'Example wording (generic)', 'What it means for you', 'Action'], [
  ['Performance optimization', '“Improved CPU performance in large battles”', 'The area may run better, especially if you were CPU-bound there', 'Re-test the area; you may raise a CPU-heavy option'],
  ['Preset or option change', '“High shadows now use…”', 'Same name, different cost or look', 'Re-test that option in a fixed scene'],
  ['New option', '“Added a sharpening slider”', 'A new way to tune; defaults may change', 'Try it on its own'],
  ['Removed option', '“Removed the low texture setting”', 'Your saved value may have moved', 'Check the menu value'],
  ['Upscaler / frame generation update', '“Updated the upscaler version”', 'Image and latency can change at the same mode', 'Compare sharpness and feel'],
  ['Console mode change', '“Performance mode now targets…”', 'Resolution or frame-rate target moved', 'Re-check your chosen mode'],
  ['Shader or loading change', '“Shaders are rebuilt on first launch”', 'One-time stutter expected', 'Let compilation finish before judging'],
  ['Known issue', '“Known issue: flicker with frame generation”', 'A bug you may hit', 'Avoid the trigger until a fix ships']
])}
<p>The <a href="/tools/patch-decoder/">Patch Decoder</a> sorts pasted lines into these kinds automatically and adds the action, so you can scan a long list quickly – but read the original line before acting.</p>`,
    `<h2 id="wording">Reading the wording</h2>
<p>Patch notes are written by many people under time pressure, and some words are vaguer than they look:</p>
<ul class="do">
<li><b>“Improved performance”</b> without a place or platform often refers to specific scenes or hardware. Test where you play.</li>
<li><b>“Optimized”</b> can mean faster, or the same speed with less memory, or fewer hitches – not necessarily a higher average frame rate.</li>
<li><b>“Adjusted”</b> or <b>“updated”</b> describes a change without saying in which direction. Treat it as something to re-test.</li>
<li><b>“Stability improvements”</b> usually means crash fixes, not performance.</li>
<li><b>“Various fixes”</b> tells you nothing; if you had a specific problem, test it again.</li>
<li><b>Numbers</b> such as “up to 20% faster” describe the best case the developer measured, not an average across systems.</li>
</ul>`,
    `<h2 id="signs">The plus, tilde and minus</h2>
${fig('pn-fig', 'Three columns of an example diff: plus for improvements, tilde for changes, minus for removals and known issues',
`<rect class="g-bg" width="640" height="220"/>
<rect class="g-panel" x="20" y="24" width="190" height="176" rx="8"/><rect class="g-panel" x="225" y="24" width="190" height="176" rx="8"/><rect class="g-panel" x="430" y="24" width="190" height="176" rx="8"/>
<text class="g-plus" x="36" y="62" style="font:700 30px var(--mono)">+</text><text class="g-tb" x="64" y="58">improvement</text>
<text class="g-acc" x="241" y="62" style="font:700 30px var(--mono)">~</text><text class="g-tb" x="269" y="58">change</text>
<text class="g-minus" x="446" y="62" style="font:700 30px var(--mono)">−</text><text class="g-tb" x="474" y="58">removal/issue</text>
<text class="g-tm" x="36" y="100">added, fixed,</text><text class="g-tm" x="36" y="118">improved, faster</text><text class="g-tm" x="36" y="160">→ re-test, maybe</text><text class="g-tm" x="36" y="178">  raise a setting</text>
<text class="g-tm" x="241" y="100">adjusted, changed,</text><text class="g-tm" x="241" y="118">now uses, updated</text><text class="g-tm" x="241" y="160">→ re-test the</text><text class="g-tm" x="241" y="178">  named option</text>
<text class="g-tm" x="446" y="100">removed, disabled,</text><text class="g-tm" x="446" y="118">known issue</text><text class="g-tm" x="446" y="160">→ check your saved</text><text class="g-tm" x="446" y="178">  values, avoid bugs</text>`,
'The three signs answer the first question for each line: good for me, neutral, or something I must react to. They are the visual language of the Patch Decoder and of this site.', '0 0 640 220')}
<p>We mark each relevant line with one of three signs. The sign describes what you need to do, not whether the developer made a good decision. A tilde line can be the most important one in an update, because it changes something you tuned without saying so loudly.</p>`,
    `<h2 id="platform">Sorting by platform</h2>
<p>Read only what applies to your platform, but read all of it. PC notes often mention specific graphics vendors or APIs (DirectX 12, Vulkan). Console notes mention modes: performance, quality or fidelity, 120 Hz, VRR, or – on PS5 Pro – enhanced modes. Switch 2 notes may treat docked and handheld play separately. Steam Deck and other handheld PCs are often listed under PC, sometimes with their own lines. A line without a platform usually applies to all.</p>`,
    `<h2 id="after">After reading: a short plan</h2>
<p>Write down the two or three lines that matter for you, decide what to test, and then test calmly – after shader compilation is done. The <a href="/guides/after-update-retest-routine/">10-minute re-test routine</a> turns this into a checklist, and the Patch Decoder can export your notes and checklist as text so you can keep them with your settings.</p>`,
    `<h2 id="hotfix">Hotfixes, staged rollouts and platform delays</h2>
<p>Big updates are rarely the end of the story. A hotfix often follows within days, and its notes are usually shorter and sometimes published only on social media or the developer’s forum. Updates can also arrive on different platforms on different days, because each platform has its own certification process. When something changes for you a few days after a big patch, check for a hotfix before assuming the main update caused it.</p>
<p>Some developers also change things on the server side without a client update – for example balancing values or event settings. Such changes rarely affect graphics, but they can affect performance in busy multiplayer modes when more players gather in one place. If performance changes without any download, that is a likely reason.</p>`
  ],
  faq: [
    ['Where do I find patch notes for my game?', 'On the developer’s or publisher’s website, the game’s news page in the platform store or launcher, and often in the game’s main menu. Use the official source rather than summaries.'],
    ['What does “stability improvements” mean?', 'Usually crash and freeze fixes. It rarely means higher frame rates.'],
    ['Why did my settings change after an update?', 'Updates can reset settings, rename presets, remove options or change defaults. Check your settings menu after every larger update.'],
    ['Should I trust “up to X% faster” claims?', 'Treat them as the best case under the developer’s test conditions. Re-test in your own scenes to see what changes for you.']
  ],
  sources: [
    ['SteamDB patch notes archive', 'https://steamdb.info/patchnotes/', 'historical patch notes and build changes for Steam games'],
    ['Steam news pages of individual games', null, 'official announcements in the Steam client'],
    ['Platform news channels', null, 'PlayStation Blog, Xbox Wire, Nintendo news and support pages']
  ],
  related: ['after-update-retest-routine', 'shader-compilation-stutter-after-update', 'how-to-test-a-settings-change']
};

export const retest = {
  slug: 'after-update-retest-routine',
  group: 'testing',
  kicker: 'Guide · after an update',
  short: 'After a big update: re-test routine',
  title: 'After a big update: a 10-minute re-test routine',
  description: 'A ten-minute checklist for the first session after a big game or driver update: check settings, let shaders compile, re-run your scene and compare.',
  h1: 'After a big update: a 10-minute re-test routine',
  lede: 'A large game update or a new graphics driver changes more than the patch notes say: settings can be reset, presets can move, and the shader cache is usually rebuilt. Judging the update in its first minutes leads to wrong conclusions. This routine takes about ten minutes and tells you whether something really changed for you – and what to do about it.',
  sections: [
    `<h2 id="before">Before the update: two minutes of notes</h2>
<p>The routine works best if you have a reference. Before you install a big update – or right now, for the next one – write down or photograph:</p>
<ul class="do">
<li>Your graphics or mode settings (a photo of each menu page is fastest).</li>
<li>Your test scene or route and its average FPS and 1% lows, or on console how the mode looked and felt.</li>
<li>The game version and, on PC, the graphics driver version.</li>
</ul>
<p>If you have no notes, the routine still works: you compare against your memory of how the game ran, and you create the notes for next time.</p>`,
    `<h2 id="routine">The routine</h2>
${tbl('10-minute re-test routine', ['Minute', 'Step', 'Why'], [
  ['0–1', 'Read the patch notes for your platform; paste them into the Patch Decoder', 'Know what to look for: presets, modes, shaders, known issues'],
  ['1–2', 'Check every settings page against your notes or photos', 'Updates can reset or move settings silently'],
  ['2–5', 'Let shader compilation finish; play calmly through your test area once', 'The first run measures compilation, not the game'],
  ['5–8', 'Measure your test route twice (or watch it closely on console)', 'Two runs show whether the result is stable'],
  ['8–10', 'Compare with your notes; decide on one change if needed', 'Change one thing at a time']
])}
<p>The <a href="/tools/patch-decoder/">Patch Decoder</a> builds a checklist with these base steps plus the actions from the patch lines that concern you, and exports it as text – handy to keep with your test notes.</p>`,
    `<h2 id="read">Reading the result</h2>
${fig('rt-fig', 'Decision flow after the re-test: same results means done; worse results lead to checking shaders, settings and patch notes; better results allow raising a setting',
`<rect class="g-bg" width="640" height="240"/>
<rect class="g-panel" x="230" y="16" width="180" height="40" rx="6"/><text class="g-t" x="250" y="41">compare with notes</text>
<path class="g-line" d="M320 56v20M100 76h440M100 76v20M320 76v20M540 76v20"/>
<rect class="g-panel" x="20" y="96" width="160" height="40" rx="6"/><text class="g-plus" x="34" y="121" style="font:600 14px var(--mono)">+ better</text>
<rect class="g-panel" x="240" y="96" width="160" height="40" rx="6"/><text class="g-acc" x="254" y="121" style="font:600 14px var(--mono)">~ same</text>
<rect class="g-panel" x="460" y="96" width="160" height="40" rx="6"/><text class="g-minus" x="474" y="121" style="font:600 14px var(--mono)">− worse</text>
<text class="g-tm" x="20" y="166">try one setting</text><text class="g-tm" x="20" y="184">a step higher</text>
<text class="g-tm" x="240" y="166">done – keep notes</text><text class="g-tm" x="240" y="184">for next time</text>
<text class="g-tm" x="460" y="166">1 shaders done?</text><text class="g-tm" x="460" y="184">2 settings reset?</text><text class="g-tm" x="460" y="202">3 known issue?</text><text class="g-tm" x="460" y="220">4 find bottleneck</text>`,
'Three possible outcomes. Only a confirmed drop, after shaders are compiled and settings are checked, calls for changing settings.', '0 0 640 240')}
<p><b>Same as before.</b> Done. Keep the notes; they are your reference for the next update.</p>
<p><b>Better.</b> If the update optimized something you had lowered – for example a CPU improvement in crowded areas – try that option one step higher and test again.</p>
<p><b>Worse.</b> Go through the causes in order: Was the shader cache still being built (does a second run look better)? Did a setting change? Is there a known issue for your platform? Only if all three are ruled out is it likely that the update made the game heavier. Then find your current bottleneck with the <a href="/tools/bottleneck-finder/">Bottleneck Finder</a> and lower one option for it, using the <a href="/tools/settings-translator/">Settings Translator</a>.</p>`,
    `<h2 id="consoles">On consoles</h2>
<p>Consoles have no frame counter in most games, but the routine still works. Check that the mode you chose (performance, quality or fidelity, 120 Hz, VRR) is still selected, both in the game and in the console’s system settings. Then play your usual area and pay attention to smoothness and sharpness. If a patch note says a mode’s target changed, compare both modes again – the best choice may have changed. The guides on <a href="/guides/ps5-performance-vs-fidelity-mode/">PS5 modes</a>, <a href="/guides/xbox-series-s-vs-x-modes/">Xbox Series S vs X</a> and <a href="/guides/switch-2-docked-vs-handheld/">Switch 2</a> explain the trade-offs.</p>`,
    `<h2 id="report">When to report a problem</h2>
<p>If you have confirmed a clear drop under the same conditions, report it to the developer through their official support or bug-report channel. Include your platform, hardware, game and driver version, the scene, your before-and-after numbers and the settings. Reports with numbers and steps to reproduce are far more useful than “performance is worse”.</p>
<p>And keep the result in perspective: after an update it is normal for the first session to feel slightly different. Patience for one session, plus a short structured test, avoids most unnecessary changes – and most of the frustration.</p>`,
    `<h2 id="drivers">Driver updates follow the same rules</h2>
<p>Graphics driver updates behave like game updates for this routine: the shader cache is rebuilt, defaults in the driver control panel can change, and performance in individual games can shift in either direction. Install drivers when you have time for a calm first session, read the driver’s release notes for your games, and use the same re-test.</p>`,
    `<h2 id="sheet">A personal reference sheet</h2>
<p>The routine gets faster each time if you keep one small note per game. It does not need to be elaborate – a text file or a phone note is enough:</p>
<ul class="do">
<li>Game, platform, game version and (PC) driver version.</li>
<li>Settings or mode, with a photo of each menu page.</li>
<li>Test route: where it starts, where it ends, what you do.</li>
<li>Results: average FPS and 1% lows (PC), or a one-line impression (console).</li>
<li>Date, and what changed since the last entry.</li>
</ul>
<p>The Patch Decoder’s text export fits right below it. After a few updates you have a history that shows whether a game is getting better or worse on your system – far more useful than any general claim.</p>`
  ],
  faq: [
    ['Why does a game run worse right after an update?', 'Most often because the shader cache is rebuilt, so the first session stutters. Settings may also have been reset. Re-test after a calm first play-through.'],
    ['How long should I wait before judging performance?', 'At least until any shader compilation step has finished and you have played once through your test area. Then measure.'],
    ['Do I need special software for the routine?', 'No. A frame counter is enough on PC; on console you compare by eye. Frame-time tools give more precise numbers if you want them.'],
    ['Should I reinstall the game if it runs worse?', 'Rarely. Check shaders, settings and known issues first. A reinstall is a last resort for corrupted files and makes the next session stutter again.']
  ],
  sources: [
    ['Official patch notes of your game', null, 'publisher website, store news page or in-game news'],
    ['Graphics driver release notes', null, 'published by NVIDIA, AMD and Intel with each driver'],
    ['PresentMon', 'https://github.com/GameTechDev/PresentMon', 'frame-time capture for before/after comparisons']
  ],
  related: ['how-to-read-patch-notes', 'how-to-test-a-settings-change', 'shader-compilation-stutter-after-update']
};
