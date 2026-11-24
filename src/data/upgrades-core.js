/*
 * Console upgrade reference – data and filter (no DOM). Unit-tested in tests/logic.test.js.
 * One row = one game on one platform, summarizing what an OFFICIAL source (PlayStation Blog, Nintendo) says the
 * PS5 Pro, QSSR or Nintendo Switch 2 upgrade changes. Every source below was read in full on 2026-11-24. Nothing here
 * is our own test; statements made before a game or update shipped are marked 'announced' with the date of the source.
 */
(function (root) {
  'use strict';
  var READ = '2026-11-24';
  var PB = 'https://blog.playstation.com/';
  // id: [title, url, date of the source]
  var SOURCES = {
    'pb-2409': ['PlayStation Blog – PS5 Pro: Developers share how they’re using new tech to enhance their games', PB + '2024/09/24/ps5-pro-developers-share-how-theyre-using-new-tech-to-enhance-their-games/', '2024-09-24'],
    'pb-2411-nms': ['PlayStation Blog – No Man’s Sky PS5 Pro update, new cross-save support detailed', PB + '2024/11/07/no-mans-sky-ps5-pro-update-new-cross-save-support-detailed/', '2024-11-07'],
    'pb-2411-f1': ['PlayStation Blog – F1 24: A deeper dive into its PS5 Pro enhancements', PB + '2024/11/11/f1-24-a-deeper-dive-into-its-ps5-pro-enhancements-plus-first-details-on-the-upcoming-season-4/', '2024-11-11'],
    'pb-2411-dt': ['PlayStation Blog – Warhammer 40,000: Darktide brings grimdark co-op to PlayStation with PS5 Pro enhancements on Dec 3', PB + '2024/11/27/warhammer-40000-darktide-brings-grimdark-co-op-to-playstation-with-ps5-pro-enhancements-on-dec-3/', '2024-11-27'],
    'pb-2602': ['PlayStation Blog – Upgraded PSSR upscaler is coming to PS5 Pro', PB + '2026/02/27/upgraded-pssr-upscaler-is-coming-to-ps5-pro/', '2026-02-27'],
    'pb-2603': ['PlayStation Blog – Upgraded PSSR rolling out to Silent Hill f, Monster Hunter Wilds, Final Fantasy VII Rebirth, Crimson Desert, and more', PB + '2026/03/16/upgraded-pssr-rolling-out-to-silent-hill-f-monster-hunter-wilds-final-fantasy-vii-rebirth-crimson-desert-and-more/', '2026-03-16'],
    'pb-2603-acs': ['PlayStation Blog – PS5 Pro new PSSR upscaler is now accessible in Assassin’s Creed Shadows', PB + '2026/03/31/ps5-pro-new-pssr-upscaler-is-now-accessible-on-assassins-creed-shadows/', '2026-03-31'],
    'pb-2604-sa': ['PlayStation Blog – Saros: PS5 and PS5 Pro features detailed', PB + '2026/04/16/saros-ps5-and-ps5-pro-features-detailed/', '2026-04-16'],
    'pb-2604-ar': ['PlayStation Blog – Arc Raiders: upgraded PS5 Pro PSSR upscaling available April 28', PB + '2026/04/27/arc-raiders-upgraded-ps5-pro-pssr-upscaling-available-april-28/', '2026-04-27'],
    'pb-2605-007': ['PlayStation Blog – 007 First Light on PS5 Pro: upgraded PSSR upscaling details', PB + '2026/05/19/007-first-light-on-ps5-pro-upgraded-pssr-upscaling-details/', '2026-05-19'],
    'pb-2605-wwm': ['PlayStation Blog – Where Winds Meet: Secrets of the Imperial Palace unfold May 28 with PS5 Pro enhancements', PB + '2026/05/25/where-winds-meet-secrets-of-the-imperial-palace-unfold-may-28-with-ps5-pro-enhancements/', '2026-05-25'],
    'pb-2606-f1': ['PlayStation Blog – EA Sports F1 25: Enhanced PSSR available alongside 2026 Season Pack', PB + '2026/06/01/ea-sports-f1-25-enhanced-pssr-available-alongside-2026-season-pack/', '2026-06-01'],
    'pb-2606-doom': ['PlayStation Blog – Upgraded PSSR comes to Doom: The Dark Ages on PS5 Pro', PB + '2026/06/24/upgraded-pssr-comes-to-doom-the-dark-ages-on-ps5-pro/', '2026-06-24'],
    'pb-2606-acbf': ['PlayStation Blog – Assassin’s Creed Black Flag Resynced: PS5 Pro enhancements detailed', PB + '2026/06/29/assassins-creed-black-flag-resynced-ps5-pro-enhancements-detailed/', '2026-06-29'],
    'pb-2607-ae': ['PlayStation Blog – Arknights: Endfield on PS5 Pro: Upgraded PSSR launches with Version 1.4', PB + '2026/07/15/arknights-endfield-on-ps5-pro-upgraded-pssr-launches-with-version-1-4/', '2026-07-15'],
    'pb-2610-qssr': ['PlayStation Blog – AI upscaling is coming to PS5', PB + '2026/10/01/ai-upscaling-is-coming-to-ps5/', '2026-10-01'],
    'pb-2611-acv': ['PlayStation Blog – Assassin’s Creed Valhalla: new update brings New Game Plus, upgraded PSSR support for PS5 Pro today', PB + '2026/11/05/assassins-creed-valhalla-new-update-brings-new-game-upgraded-pssr-support-for-ps5-pro-today/', '2026-11-05'],
    'pb-2611-qssr': ['PlayStation Blog – QSSR arrives in Marvel’s Spider-Man 2, Control Resonant, The Finals, Arc Raiders, No Man’s Sky, and Hell Let Loose: Vietnam', PB + '2026/11/13/qssr-arrives-in-marvels-spider-man-2-control-resonant-the-finals-arc-raiders-and-hell-let-loose-vietnam/', '2026-11-13'],
    'nin-s2e': ['Nintendo – About Nintendo Switch 2 Edition games', 'https://www.nintendo.com/us/gaming-systems/switch-2/featured-games/switch-2-edition/', ''],
    'nin-free': ['Nintendo – Free updates for select Nintendo Switch games', 'https://www.nintendo.com/us/gaming-systems/switch-2/transfer-guide/games-with-free-updates/', '']
  };
  var PLATFORMS = { ps5pro: 'PS5 Pro', ps5: 'PS5', switch2: 'Nintendo Switch 2' };
  var KINDS = {
    pro: 'PS5 Pro enhancement',
    pssr: 'Upgraded PSSR (2026)',
    qssr: 'QSSR on the standard PS5',
    edition: 'Nintendo Switch 2 Edition (paid upgrade)',
    free: 'Free Switch 2 update for a Switch game'
  };
  // g = game, p = platform, k = kind, t = what the source says (our summary of its wording),
  // st = 'live' (the source reports the change as released) | 'before' (the source describes it before release),
  // s = source ids. The 5th argument is the date the row was checked against (kept in the call for readability only);
  // dateOf() derives the date shown on the page from the sources themselves.
  function r(g, p, k, t, d, st, s) { return { g: g, p: p, k: k, t: t, st: st, s: s }; }
  var A = 'live', N = 'before';
  var ROWS = [
    // ---- PS5 Pro: statements of the developers and of Sony on the PlayStation Blog ----
    r('Gran Turismo 7', 'ps5pro', 'pro', 'Polyphony Digital: PSSR also works on the game’s native-4K image for more detail; ray tracing during races, which was not possible on PS5; experimental 8K/60 fps output.', '2024-09-24', N, ['pb-2409']),
    r('Horizon Forbidden West', 'ps5pro', 'pro', 'Guerrilla: visual quality that matches or surpasses the PS5 Quality mode, at 60 fps; improved shadows, depth of field, skin and hair shaders, clouds and god rays.', '2024-09-24', N, ['pb-2409']),
    r('The Last of Us Part I', 'ps5pro', 'pro', 'Naughty Dog: a new PS5 Pro mode renders 1440p and upscales to 4K with PSSR, with a 60 fps target. The Performance and Fidelity modes remain and run smoother than on PS5.', '2024-09-24', N, ['pb-2409']),
    r('The Last of Us Part II Remastered', 'ps5pro', 'pro', 'Naughty Dog: the same new PS5 Pro mode – 1440p upscaled to 4K with PSSR, 60 fps target – next to the existing Performance and Fidelity modes.', '2024-09-24', N, ['pb-2409']),
    r('Marvel’s Spider-Man Remastered', 'ps5pro', 'pro', 'Insomniac Games: a new default “Performance Pro” mode that combines the 4K resolution and ray tracing of Fidelity mode with the 60 fps of Performance mode.', '2024-09-24', N, ['pb-2409']),
    r('Marvel’s Spider-Man: Miles Morales', 'ps5pro', 'pro', 'Insomniac Games: new default “Performance Pro” mode – Fidelity mode’s 4K resolution and ray tracing at Performance mode’s 60 fps.', '2024-09-24', N, ['pb-2409']),
    r('Marvel’s Spider-Man 2', 'ps5pro', 'pro', 'Insomniac Games: new default “Performance Pro” mode – Fidelity mode’s 4K resolution and ray tracing at Performance mode’s 60 fps.', '2024-09-24', N, ['pb-2409']),
    r('Ratchet & Clank: Rift Apart', 'ps5pro', 'pro', 'Insomniac Games: new default “Performance Pro” mode – Fidelity mode’s 4K resolution and ray tracing at Performance mode’s 60 fps.', '2024-09-24', N, ['pb-2409']),
    r('Hogwarts Legacy', 'ps5pro', 'pro', 'Avalanche Software: PSSR in all visual modes and higher quality in the Performance and Fidelity modes; the Fidelity ray-tracing mode adds ray-traced reflections and shadows.', '2024-09-24', N, ['pb-2409']),
    r('Resident Evil Village', 'ps5pro', 'pro', 'Capcom: 120 fps gameplay added for PS5 Pro, plus a higher-resolution image.', '2024-09-24', N, ['pb-2409']),
    r('Resident Evil 4', 'ps5pro', 'pro', 'Capcom: higher frame rate on PS5 Pro, plus a higher-resolution image.', '2024-09-24', N, ['pb-2409']),
    r('Star Wars Jedi: Survivor', 'ps5pro', 'pro', 'Respawn: Quality mode at 2160p; Performance mode at 60 fps with a higher resolution and ray-traced reflections and ambient occlusion; PSSR in both modes.', '2024-09-24', N, ['pb-2409']),
    r('Stellar Blade', 'ps5pro', 'pro', 'Shift Up: 4K at 50 fps or more in the PSSR mode; a high-frame-rate option at 80 fps that needs a 120 Hz display.', '2024-09-24', N, ['pb-2409']),
    r('The Crew Motorfest', 'ps5pro', 'pro', 'Ubisoft Ivory Tower: PSSR for a sharper, cleaner image and more objects on screen – decals, vegetation, crowds – at 60 fps.', '2024-09-24', N, ['pb-2409']),
    r('Metal Gear Solid Delta: Snake Eater', 'ps5pro', 'pro', 'Konami: PSSR for the jungle vegetation and better frame rates throughout the game.', '2024-09-24', N, ['pb-2409']),
    r('The First Descendant', 'ps5pro', 'pro', 'Nexon Games: expanded ray tracing for lighting and shadows, and PSSR for a higher resolution than on PS5.', '2024-09-24', N, ['pb-2409']),
    r('No Man’s Sky', 'ps5pro', 'pro', 'Hello Games: PSSR for 4K at 60 fps; 8K at 30 fps; ultra-quality reflections and higher-quality ambient occlusion in all modes, also on PS VR2.', '2024-11-07', A, ['pb-2411-nms']),
    r('F1 24', 'ps5pro', 'pro', 'Codemasters: Quality mode with ray tracing on track and PSSR to 4K; Performance mode at 120 Hz with double the resolution; Resolution mode with 8K at 60 Hz on a compatible display.', '2024-11-11', A, ['pb-2411-f1']),
    r('Warhammer 40,000: Darktide', 'ps5pro', 'pro', 'Fatshark: on PS5, Performance mode at 1440p/60 fps and Quality mode at 4K/30 fps; on PS5 Pro, PSSR for a steady 60 fps at 4K.', '2024-11-27', N, ['pb-2411-dt']),
    r('Resident Evil Requiem', 'ps5pro', 'pssr', 'Sony: the first game to use the upgraded PSSR, from its launch on February 27, 2026.', '2026-02-27', A, ['pb-2602']),
    r('Silent Hill f', 'ps5pro', 'pssr', 'Konami: upgraded PSSR; smoother play and finer detail in grass and shadows.', '2026-03-16', A, ['pb-2603']),
    r('Silent Hill 2', 'ps5pro', 'pssr', 'Sony: Konami is upgrading the game to the new PSSR.', '2026-03-16', N, ['pb-2603']),
    r('Dragon Age: The Veilguard', 'ps5pro', 'pssr', 'BioWare (2024): higher resolution in the 30 fps Fidelity and 60 fps Performance modes, ray-traced ambient occlusion also in Performance mode. BioWare (2026): now supports the upgraded PSSR with stable frame rates in both modes.', '2026-03-16', A, ['pb-2409', 'pb-2603']),
    r('Alan Wake 2', 'ps5pro', 'pssr', 'Remedy (2024): ray tracing added on PS5 Pro; the 60 fps Performance mode outputs 4K. Remedy (2026): upgraded PSSR for more stable image quality.', '2026-03-16', N, ['pb-2409', 'pb-2603']),
    r('Control', 'ps5pro', 'pssr', 'Remedy: upgraded PSSR with noticeably better image stability and motion clarity.', '2026-03-16', N, ['pb-2603']),
    r('Senua’s Saga: Hellblade II', 'ps5pro', 'pssr', 'Ninja Theory: upgraded PSSR; the studio points to the quality of particle effects.', '2026-03-16', A, ['pb-2603']),
    r('Final Fantasy VII Rebirth', 'ps5pro', 'pssr', 'Square Enix (2024): an Enhanced mode at 60 fps with PSSR and a resolution on par with Graphics mode. Square Enix (2026): upgraded PSSR restores fine detail such as hair and reduces flicker and afterimages.', '2026-03-16', N, ['pb-2409', 'pb-2603']),
    r('Nioh 3', 'ps5pro', 'pssr', 'Koei Tecmo: upgraded PSSR for sharper edges of trees, plants and flowers.', '2026-03-16', N, ['pb-2603']),
    r('Rise of the Ronin', 'ps5pro', 'pssr', 'Koei Tecmo (2024): higher frame rate and more graphical detail on PS5 Pro. Sony (2026): the game adopts the upgraded PSSR.', '2026-03-16', N, ['pb-2409', 'pb-2603']),
    r('Monster Hunter Wilds', 'ps5pro', 'pssr', 'Sony: Capcom has adopted the upgraded PSSR for clearer, more stable images.', '2026-03-16', A, ['pb-2603']),
    r('Dragon’s Dogma 2', 'ps5pro', 'pssr', 'Capcom (2024): PSSR and ray tracing on PS5 Pro, with improved frame rates. Sony (2026): the game adopts the upgraded PSSR.', '2026-03-16', A, ['pb-2409', 'pb-2603']),
    r('Crimson Desert', 'ps5pro', 'pssr', 'Sony: adopts the upgraded PSSR at its launch on March 19, 2026.', '2026-03-16', N, ['pb-2603']),
    r('Cyberpunk 2077', 'ps5pro', 'pssr', 'Sony: a patch for the upgraded PSSR “in the coming weeks”.', '2026-03-16', N, ['pb-2603']),
    r('Assassin’s Creed Shadows', 'ps5pro', 'pssr', 'Ubisoft: upgraded PSSR with Title Update 1.1.9 on April 7, 2026, in all three PS5 Pro modes – Performance, Balanced and Quality, which render at different internal resolutions with dynamic resolution scaling.', '2026-03-31', N, ['pb-2603-acs']),
    r('Saros', 'ps5pro', 'pssr', 'Housemarque: upgraded PSSR; a higher base render resolution before upscaling at 60 fps, with dynamic resolution; key story cinematics switch to 30 fps.', '2026-04-16', N, ['pb-2604-sa']),
    r('Arc Raiders', 'ps5pro', 'pssr', 'Embark Studios: upgraded PSSR with update 1.26 on April 28, 2026; on the standard PS5 the game kept TSR upscaling at that time.', '2026-04-27', N, ['pb-2604-ar']),
    r('007 First Light', 'ps5pro', 'pssr', 'IO Interactive: upgraded PSSR is the default upscaler on PS5 Pro from launch; other platforms use FSR 3.1.5.', '2026-05-19', N, ['pb-2605-007']),
    r('Where Winds Meet', 'ps5pro', 'pssr', 'Everstone Games: with the Imperial Palace expansion on May 28, 2026, ray-traced reflections on PS5 Pro, about 60 fps in the palace areas, and upgraded PSSR.', '2026-05-25', N, ['pb-2605-wwm']),
    r('F1 25', 'ps5pro', 'pssr', 'Codemasters: upgraded (“enhanced”) PSSR with the 2026 Season Pack on June 3, 2026; Quality mode with ray-traced reflections and global illumination at a locked 60 fps; Performance mode at 120 Hz; an 8K Resolution mode.', '2026-06-01', N, ['pb-2606-f1']),
    r('Doom: The Dark Ages', 'ps5pro', 'pssr', 'id Software: upgraded PSSR with free Update 4 on July 7, 2026; PSSR support is exclusive to PS5 Pro.', '2026-06-24', N, ['pb-2606-doom']),
    r('Assassin’s Creed Black Flag Resynced', 'ps5pro', 'pssr', 'Ubisoft: ray-traced global illumination in all modes on PS5 and PS5 Pro; ray-traced specular reflections in Balanced and Fidelity on PS5 but in all modes on PS5 Pro; strand-based hair for Edward in all Pro modes; latest PSSR.', '2026-06-29', N, ['pb-2606-acbf']),
    r('Arknights: Endfield', 'ps5pro', 'pssr', 'Hypergryph: upgraded PSSR with Version 1.4 on July 16, 2026, for sharper detail and steadier images at 4K.', '2026-07-15', N, ['pb-2607-ae']),
    r('Assassin’s Creed Valhalla', 'ps5pro', 'pssr', 'Ubisoft: upgraded PSSR in the free update of November 5, 2026; Quality mode at 60 fps on PS5 Pro.', '2026-11-05', A, ['pb-2611-acv']),
    // ---- standard PS5: QSSR ----
    r('Marvel’s Wolverine', 'ps5', 'qssr', 'Sony: one of the first two games with QSSR, patched on October 1, 2026 to offer it as an additional graphics option.', '2026-10-01', A, ['pb-2610-qssr']),
    r('Ghost of Yōtei', 'ps5', 'qssr', 'Sony: one of the first two games with QSSR, patched on October 1, 2026 to offer it as an additional graphics option.', '2026-10-01', A, ['pb-2610-qssr']),
    r('Marvel’s Spider-Man 2', 'ps5', 'qssr', 'Insomniac Games: QSSR in an update that is live, in both Fidelity and Performance modes.', '2026-11-13', A, ['pb-2611-qssr']),
    r('Control Resonant', 'ps5', 'qssr', 'Remedy: QSSR in an update coming in December 2026.', '2026-11-13', N, ['pb-2611-qssr']),
    r('Arc Raiders', 'ps5', 'qssr', 'Embark Studios: QSSR announced for an upcoming update, without a date.', '2026-11-13', N, ['pb-2611-qssr']),
    r('The Finals', 'ps5', 'qssr', 'Embark Studios: QSSR announced for an upcoming update, without a date.', '2026-11-13', N, ['pb-2611-qssr']),
    r('No Man’s Sky', 'ps5', 'qssr', 'Hello Games: QSSR “in the next few weeks”.', '2026-11-13', N, ['pb-2611-qssr']),
    r('Hell Let Loose: Vietnam', 'ps5', 'qssr', 'Expression Games: QSSR through an upcoming update.', '2026-11-13', N, ['pb-2611-qssr']),
    // ---- Nintendo Switch 2 Edition (paid upgrade packs) ----
    r('The Legend of Zelda: Breath of the Wild', 'switch2', 'edition', 'Nintendo: improved frame rates and resolution, faster load times, HDR support, and the ZELDA NOTES service in the Nintendo Switch App.', '', A, ['nin-s2e']),
    r('The Legend of Zelda: Tears of the Kingdom', 'switch2', 'edition', 'Nintendo: improved frame rates and resolution, faster load times, HDR support, and the ZELDA NOTES service in the Nintendo Switch App.', '', A, ['nin-s2e']),
    r('Super Mario Party Jamboree', 'switch2', 'edition', 'Nintendo: WQHD (1440p) in TV mode and Full HD (1080p) in tabletop and handheld mode; improved frame rate; Jamboree TV with mouse, microphone and camera modes.', '', A, ['nin-s2e']),
    r('Kirby and the Forgotten Land', 'switch2', 'edition', 'Nintendo: visually enhanced with an improved frame rate, plus the new story Star-Crossed World.', '', A, ['nin-s2e']),
    r('Pokémon Legends: Z-A', 'switch2', 'edition', 'Nintendo: improved performance with a higher frame rate and resolution.', '', A, ['nin-s2e']),
    r('Metroid Prime 4: Beyond', 'switch2', 'edition', 'Nintendo: two display modes – Quality at 60 fps in 4K (TV) or 1080p (handheld); Performance at 120 fps in 1080p (TV) or 720p (handheld); HDR in both; mouse controls with Joy-Con 2.', '', A, ['nin-s2e']),
    // ---- free updates for Nintendo Switch games, played on Switch 2 ----
    r('ARMS', 'switch2', 'free', 'Nintendo: update available June 5, 2025; image quality optimized for the Switch 2 screen and high-resolution TVs; smoother frame rate, also with three or more players; HDR support.', '2025-06-05', A, ['nin-free']),
    r('Animal Crossing: New Horizons', 'switch2', 'free', 'Nintendo: update available January 15, 2026; image quality optimized for the Switch 2 screen.', '2026-01-15', A, ['nin-free']),
    r('Captain Toad: Treasure Tracker', 'switch2', 'free', 'Nintendo: update available June 5, 2025; image quality optimized for the Switch 2 screen and high-resolution TVs; HDR support.', '2025-06-05', A, ['nin-free']),
    r('Donkey Kong Country Returns HD', 'switch2', 'free', 'Nintendo: update available January 20, 2026; image quality optimized for the Switch 2 screen and high-resolution TVs.', '2026-01-20', A, ['nin-free']),
    r('Game Builder Garage', 'switch2', 'free', 'Nintendo: update available June 5, 2025; image quality optimized for the Switch 2 screen and high-resolution TVs; Joy-Con 2 mouse controls.', '2025-06-05', A, ['nin-free']),
    r('Mario Kart 8 Deluxe', 'switch2', 'free', 'Nintendo: update available September 1, 2026; image quality optimized for the Switch 2 screen; faster loading; up to 8 players in local multiplayer on one system.', '2026-09-01', A, ['nin-free']),
    r('New Super Mario Bros. U Deluxe', 'switch2', 'free', 'Nintendo: update available June 5, 2025; image quality optimized for the Switch 2 screen and high-resolution TVs.', '2025-06-05', A, ['nin-free']),
    r('Pikmin 3 Deluxe', 'switch2', 'free', 'Nintendo: update available August 31, 2026; image quality optimized for the Switch 2 screen and high-resolution TVs.', '2026-08-31', A, ['nin-free']),
    r('Pokémon Scarlet', 'switch2', 'free', 'Nintendo: update available June 5, 2025; image quality optimized for the Switch 2 screen and high-resolution TVs; frame rate improved for smoother movement.', '2025-06-05', A, ['nin-free']),
    r('Pokémon Violet', 'switch2', 'free', 'Nintendo: update available June 5, 2025; image quality optimized for the Switch 2 screen and high-resolution TVs; frame rate improved for smoother movement.', '2025-06-05', A, ['nin-free']),
    r('Splatoon 3', 'switch2', 'free', 'Nintendo: update available June 12, 2025; image quality optimized for the Switch 2 screen and high-resolution TVs; smoother frame rate in the plaza and the Grand Festival Grounds.', '2025-06-12', A, ['nin-free']),
    r('Super Mario 3D World + Bowser’s Fury', 'switch2', 'free', 'Nintendo: update available June 5, 2025; image quality optimized for the Switch 2 screen and high-resolution TVs; smoother frame rate, including Bowser’s Fury; HDR in Bowser’s Fury only.', '2025-06-05', A, ['nin-free']),
    r('Super Mario Galaxy + Super Mario Galaxy 2', 'switch2', 'free', 'Nintendo: update available October 2, 2025; image quality optimized for the Switch 2 screen and high-resolution TVs; Joy-Con 2 mouse controls.', '2025-10-02', A, ['nin-free']),
    r('Super Mario Odyssey', 'switch2', 'free', 'Nintendo: update available June 5, 2025; image quality optimized for the Switch 2 screen and high-resolution TVs; HDR support.', '2025-06-05', A, ['nin-free']),
    r('The Legend of Zelda: Echoes of Wisdom', 'switch2', 'free', 'Nintendo: update available June 5, 2025; image quality optimized for the Switch 2 screen and high-resolution TVs; HDR support.', '2025-06-05', A, ['nin-free']),
    r('The Legend of Zelda: Link’s Awakening', 'switch2', 'free', 'Nintendo: update available June 5, 2025; image quality optimized for the Switch 2 screen and high-resolution TVs; HDR support.', '2025-06-05', A, ['nin-free'])
  ];
  ROWS.forEach(function (x, i) { x.id = 'u' + (i + 1); });
  ROWS.sort(function (a, b) { return a.g.localeCompare(b.g, 'en') || a.p.localeCompare(b.p); });

  // newest dated source of a row ('' when all its sources are undated Nintendo pages)
  function dateOf(x) { return x.s.map(function (id) { return SOURCES[id][2]; }).sort().pop() || ''; }
  function norm(s) { return String(s || '').toLowerCase().replace(/[’']/g, '\''); }
  function filter(q, platform, kind) {
    var words = norm(q).split(/\s+/).filter(Boolean);
    return ROWS.filter(function (x) {
      if (platform && platform !== 'all' && x.p !== platform) return false;
      if (kind && kind !== 'all' && x.k !== kind) return false;
      var hay = norm(x.g + ' ' + x.t + ' ' + PLATFORMS[x.p] + ' ' + KINDS[x.k]);
      return words.every(function (w) { return hay.indexOf(w) !== -1; });
    });
  }
  var api = { READ: READ, SOURCES: SOURCES, PLATFORMS: PLATFORMS, KINDS: KINDS, ROWS: ROWS, dateOf: dateOf, filter: filter };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.PPGUpgrades = api;
})(this);
