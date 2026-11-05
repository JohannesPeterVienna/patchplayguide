/*
 * Patch Play Guide – page runtime: ad slots, consent-gated Google Analytics, the interim stats window, "Privacy settings",
 * and the saved "My setup" (platform + GPU class, localStorage only) shown on guide pages and home.
 * Ad slot IDs stay empty until AdSense units exist: an empty ID renders nothing and reserves no space.
 */
(function () {
  'use strict';
  var CLIENT = 'ca-pub-7811071715414905';
  var AD_SLOTS = {
    // Shared responsive AdSense units “Themen-Websites – …” (account pub-7811071715414905)
    lede: '7497607759',   // guides: after the lede (responsive; 728×90 / 300×250)
    mid: '1292301217',    // guides: mid-article (300×250 / responsive)
    side: '1292301217',   // guides: sidebar from 1200 px (300×600), not sticky, never on tool pages
    tool: '1292301217'    // tool pages: after the first explanatory section below the tool
  };
  var GA_ID = 'G-T00HRG2YVF';
  var root = document.documentElement;
  var adsAllowed = root.getAttribute('data-ads') === 'yes';

  // set by the first inline script in <head>: local preview/test or ?stats_test=1 -> no Google script at all
  var NO_GOOGLE = (function () {
    if (window.PPG_NO_GOOGLE) return true;
    try { return window.PPGConsent ? window.PPGConsent.noGoogle(location.hostname, location.protocol, location.search) : true; } catch (e) { return true; }
  })();

  function loadAdScript() {
    if (NO_GOOGLE || document.querySelector('script[src*="adsbygoogle.js"]')) return;
    var s = document.createElement('script');
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + CLIENT;
    document.head.appendChild(s);
  }

  function renderSlots() {
    if (!adsAllowed) return;
    var wide = window.matchMedia && window.matchMedia('(min-width: 1200px)').matches;
    var boxes = document.querySelectorAll('.ad[data-slot]');
    for (var i = 0; i < boxes.length; i++) {
      var box = boxes[i];
      var name = box.getAttribute('data-slot');
      var id = AD_SLOTS[name];
      if (!id) continue;
      if (name === 'side' && !wide) continue;
      var ins = document.createElement('ins');
      ins.className = 'adsbygoogle';
      ins.style.display = 'block';
      ins.setAttribute('data-ad-client', CLIENT);
      ins.setAttribute('data-ad-slot', id);
      if (name !== 'side') { ins.setAttribute('data-ad-format', 'auto'); ins.setAttribute('data-full-width-responsive', 'true'); }
      box.appendChild(ins);
      box.hidden = false;
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) { box.hidden = true; }
    }
  }

  /* ---------- consent → Consent Mode update + GA4 ---------- */
  var gtag = window.gtag || function () { (window.dataLayer = window.dataLayer || []).push(arguments); };
  function tag() { try { (typeof window.gtag === 'function' ? window.gtag : gtag).apply(null, arguments); } catch (e) { /* ignore */ } }
  var cmp = { tc: null, cmReady: false, us: null, gpp: null, gppOn: false, tcfOn: false, sent: '', saidNo: false, statsOn: false, statsErased: false };
  var lastTc = null; // latest TCF data, kept across the click-time withdrawal
  var gaOn = false;
  var nav = window.navigator || (typeof navigator !== 'undefined' ? navigator : null);
  var GPC = !!(nav && nav.globalPrivacyControl === true);   // Global Privacy Control: no analytics, no stats window
  var stats = null;  // interim "Stats check" window (stats-window.js); null if the file is missing
  var statsAuto = root.getAttribute('data-stats') === 'auto';   // false: page without ads (imprint, privacy, contact, 404)
  var FC_SRC = 'https://fundingchoicesmessages.google.com/i/pub-7811071715414905?ers=1';

  function startGA() {
    if (gaOn || NO_GOOGLE) return;
    gaOn = true;
    if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
      document.head.appendChild(s);
    }
    tag('js', new Date());
    tag('config', GA_ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
  }
  function eraseGa() {
    var C = window.PPGStats;
    if (!C) return;
    try { C.gaCookieDeletes(document.cookie, location.hostname).forEach(function (c) { document.cookie = c; }); } catch (e) { /* cookies blocked */ }
  }
  function cmValues() {
    try {
      var fc = window.googlefc;
      if (fc && typeof fc.getGoogleConsentModeValues === 'function') return fc.getGoogleConsentModeValues() || null;
    } catch (e) { /* CMP not ready */ }
    return null;
  }
  function usOptedOut() { return cmp.gpp === 3 || cmp.us === 3; }
  // a clear "no" to statistics from Google's CMP (not a value that is still on its way) -> GA cookies go
  function googleSaysNo() {
    var tc = cmp.tc, S = window.PPGStats;
    if (!tc || !S) return false;
    var st = S.cmpState(tc);
    var v = cmp.cmReady ? cmValues() : null;
    var cmNo = !!v && v.analyticsStoragePurposeConsentStatus === 2;
    if (st === 'non-gdpr') return cmNo || usOptedOut();
    if (st !== 'decided') return false;
    var p1 = tc.purpose && tc.purpose.consents && tc.purpose.consents[1] === true;
    var g = tc.vendor && tc.vendor.consents && tc.vendor.consents[755] === true;
    return !p1 || !g || cmNo;
  }
  function applyConsent() {
    var C = window.PPGConsent;
    if (!C) return;
    if (stats && stats.inCharge()) {
      // the window decides analytics only; ad_* are never sent from here and stay at their "denied" default
      var on = stats.granted() && !GPC && !usOptedOut();
      // every switch to "off" deletes the GA cookies: after "on" (decline/withdrawal) and for GPC / U.S. opt-out
      if (on) { cmp.statsErased = false; cmp.saidNo = false; }
      else if (!cmp.statsErased && (cmp.statsOn || GPC || usOptedOut())) { cmp.statsErased = true; eraseGa(); }
      cmp.statsOn = on;
      window['ga-disable-' + GA_ID] = !on;
      var k = 'stats:' + on;
      if (k !== cmp.sent) { cmp.sent = k; tag('consent', 'update', { analytics_storage: on ? 'granted' : 'denied' }); }
      if (on) startGA();
      stats.refresh();
      return;
    }
    var values = cmp.cmReady && C.region(cmp.tc) !== 'none' ? cmValues() : null;
    var d = C.decide(cmp.tc, values, C.usEffective(cmp.us, cmp.gpp));
    if (GPC || !statsAuto) d.analytics_storage = 'denied';   // pages without ads never load GA, even if Google's CMP grants it
    var analytics = d.analytics_storage === 'granted';
    window['ga-disable-' + GA_ID] = !analytics;
    var key = JSON.stringify(d);
    if (key !== cmp.sent) { cmp.sent = key; tag('consent', 'update', d); }
    if (analytics) { startGA(); cmp.saidNo = false; }   // a later Google "no" deletes the cookies again
    if (!cmp.saidNo && googleSaysNo()) { cmp.saidNo = true; eraseGa(); }
    if (stats) stats.refresh();
  }
  // later U.S. opt-out changes arrive through the GPP signal; without GPP a U.S. visitor stays denied
  function listenToGpp() {
    if (cmp.gppOn || typeof window.__gpp !== 'function') return;
    cmp.gppOn = true;
    try {
      window.__gpp('addEventListener', function (evt, ok) {
        if (!ok || !evt) return;
        var pd = evt.pingData || (evt.data && evt.data.pingData) || null;
        if (pd && window.PPGConsent) { cmp.gpp = window.PPGConsent.usFromGpp(pd); applyConsent(); }
      });
    } catch (e) { cmp.gppOn = false; cmp.gpp = null; }
  }
  function listenToTcf() {
    if (cmp.tcfOn || typeof window.__tcfapi !== 'function') return;
    cmp.tcfOn = true;
    try {
      window.__tcfapi('addEventListener', 2, function (tc, ok) {
        cmp.tc = ok ? tc : null;
        if (ok && tc) lastTc = tc;
        if (ok && tc && tc.eventStatus === 'useractioncomplete' && typeof window.googlefc.getGoogleConsentModeValues === 'function') cmp.cmReady = true;
        if (ok && tc && stats) stats.cmpUpdate(tc);   // Google's decision (also a late one) ends the stats window
        applyConsent();
      });
    } catch (e) { cmp.tcfOn = false; }
  }
  function listenToCmp() {
    window.googlefc = window.googlefc || {};
    window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
    window.googlefc.callbackQueue.push({
      CONSENT_API_READY: function () {
        listenToGpp();
        listenToTcf();
      },
      CONSENT_MODE_DATA_READY: function () { cmp.cmReady = true; applyConsent(); },
      INITIAL_US_STATES_OPT_OUT_DATA_READY: function () {
        try {
          var u = window.googlefc.usstatesoptout;
          cmp.us = u && typeof u.getInitialUsStatesOptOutStatus === 'function' ? u.getInitialUsStatesOptOutStatus() : null;
        } catch (e) { cmp.us = null; }
        listenToGpp();
        applyConsent();
      }
    });
    // __tcfapi can exist before CONSENT_API_READY fires: attach as soon as it appears (first ~3 s)
    var tries = 0;
    (function poll() {
      listenToTcf();
      if (!cmp.tcfOn && ++tries < 12 && typeof setTimeout === 'function') setTimeout(poll, 250);
    })();
    applyConsent();
  }
  function setupStats() {
    var S = window.PPGStats;
    if (!S || typeof setTimeout !== 'function') return;
    var ctrl = null;
    var view = S.createView(document, {
      choose: function (c) { ctrl.choose(c); },
      dismiss: function () { ctrl.dismiss(); },
      google: function () { ctrl.dismiss(); loadGoogleChoicesHere(); }
    });
    ctrl = S.createController({
      store: S.safeStorage(function () { return window.localStorage; }),
      now: function () { return Date.now(); },
      later: function (fn, ms) { setTimeout(fn, ms); },
      gpc: GPC,
      usOptOut: usOptedOut,
      scope: statsAuto ? 'auto' : 'settings',   // pages without the AdSense loader: view/change only
      tc: function () { return cmp.tc; },
      changed: applyConsent,
      eraseGa: eraseGa,
      view: view
    });
    stats = ctrl;
    ctrl.start();
  }
  function openGoogleChoices(noAdScript) {
    // treat as withdrawn until the CMP reports the new choice
    var prev = { tc: cmp.tc, cmReady: cmp.cmReady };
    cmp.tc = null; cmp.cmReady = false; applyConsent();
    window.googlefc = window.googlefc || {};
    window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
    window.googlefc.callbackQueue.push(function () {
      try {
        // U.S. state regulation applies -> U.S. opt-out dialog; otherwise the GDPR revocation message
        window.PPGConsent.openPrivacyChoices(window.googlefc, function (userDidOptOut) {
          try {
            if (userDidOptOut) cmp.gpp = window.PPGConsent.US_OPTED_OUT; // personalisation + analytics stay denied
            else { cmp.tc = prev.tc; cmp.cmReady = prev.cmReady; }
            listenToGpp();
          } catch (e) { cmp.gpp = null; }
          applyConsent();
        }, lastTc || prev.tc);   // latest TCF data: GDPR applies -> revocation message
      } catch (e) { /* CMP unavailable */ }
    });
    if (statsAuto && !noAdScript) loadAdScript();
  }
  function cmpLoaded() {
    return typeof window.__tcfapi === 'function' || !!document.querySelector('script[src*="adsbygoogle.js"], script[src^="https://fundingchoicesmessages.google.com/"]');
  }
  // button "Open Google's ad & U.S. privacy choices" in a window opened via Privacy settings (never sets ad consent):
  // CMP already there (ad pages) -> its revocation / U.S. dialog; otherwise Google's standard snippet, in its order:
  // queue + callback, hidden iframe "googlefcPresent", then only the Funding Choices script – never adsbygoogle.js
  function loadGoogleChoicesHere() {
    var loaded = cmpLoaded();
    openGoogleChoices(true);   // prepares googlefc.callbackQueue and queues the callback first
    if (loaded || NO_GOOGLE) return;
    if (!document.querySelector('iframe[name="googlefcPresent"]') && document.body) {
      var f = document.createElement('iframe');
      f.style.width = '0'; f.style.height = '0'; f.style.border = 'none'; f.style.zIndex = '-1000'; f.style.left = '-1000px'; f.style.top = '-1000px'; f.style.display = 'none';
      f.name = 'googlefcPresent';
      document.body.appendChild(f);
    }
    var s = document.createElement('script');
    s.async = true;
    s.src = FC_SRC;
    document.head.appendChild(s);
  }
  function privacyButtons() {
    var btns = document.querySelectorAll('[data-privacy-settings]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function () {
        // Google's CMP when it is in charge; otherwise (no decision, page without ads) the stats window
        if (stats && stats.open()) return;
        if (!statsAuto) return;   // pages without ads: Google's choices only via the button inside the window
        openGoogleChoices();
      });
    }
  }

  /* ---------- My setup (localStorage only) ---------- */
  var PLATFORMS = {
    pc: ['Desktop or laptop PC', [['cpu-or-gpu-bottleneck', 'CPU or GPU bottleneck? A 5-minute check'], ['graphics-settings-explained', 'Graphics settings explained'], ['frame-cap-vsync-latency-pc', 'Frame caps, V-Sync and latency on PC']]],
    handheld: ['Steam Deck or handheld PC', [['steam-deck-frame-cap-tdp-battery', 'Steam Deck: frame cap, TDP and battery'], ['dlss-vs-fsr-vs-xess', 'DLSS vs FSR vs XeSS'], ['shader-compilation-stutter-after-update', 'Shader stutter after an update']]],
    ps5: ['PS5', [['ps5-performance-vs-fidelity-mode', 'PS5 performance vs fidelity modes'], ['vrr-120hz-console-setup', 'VRR and 120 Hz on consoles']]],
    ps5pro: ['PS5 Pro', [['ps5-pro-enhanced-games', 'PS5 Pro enhanced games: what changes'], ['ps5-performance-vs-fidelity-mode', 'PS5 performance vs fidelity modes'], ['vrr-120hz-console-setup', 'VRR and 120 Hz on consoles']]],
    xbox: ['Xbox Series X or S', [['xbox-series-s-vs-x-modes', 'Xbox Series S vs X: why modes differ'], ['vrr-120hz-console-setup', 'VRR and 120 Hz on consoles']]],
    switch2: ['Nintendo Switch 2', [['switch-2-docked-vs-handheld', 'Switch 2 docked vs handheld'], ['vrr-120hz-console-setup', 'VRR and 120 Hz on consoles']]]
  };
  var GPU = { entry: 'entry-level GPU', mid: 'midrange GPU', high: 'high-end GPU' };
  var VRAM = { '6': '6 GB or less', '8': '8 GB', '12': '10–12 GB', '16': '16 GB or more' };
  function own(o, k) { return typeof k === 'string' && Object.prototype.hasOwnProperty.call(o, k); }
  /** Saved setup, validated against our own lists; anything unknown is dropped (bad platform -> no setup). */
  function cleanSetup(s) {
    if (!s || typeof s !== 'object' || Object.prototype.toString.call(s) !== '[object Object]' || !own(PLATFORMS, s.platform)) return null;
    var vram = typeof s.vram === 'number' ? String(s.vram) : s.vram;
    return { platform: s.platform, gpu: own(GPU, s.gpu) ? s.gpu : '', vram: own(VRAM, vram) ? vram : '' };
  }
  function readSetup() {
    try { return cleanSetup(JSON.parse(localStorage.getItem('ppg-setup') || 'null')); } catch (e) { return null; }
  }
  function saveSetup(s) {
    var c = cleanSetup(s);
    if (!c) return;
    try { localStorage.setItem('ppg-setup', JSON.stringify(c)); } catch (e) { /* storage blocked */ }
  }
  function setupText(s) {
    var p = PLATFORMS[s.platform];
    var gpu = (s.platform === 'pc' || s.platform === 'handheld') && own(GPU, s.gpu) ? ' · ' + GPU[s.gpu] : '';
    var vram = s.platform === 'pc' && own(VRAM, s.vram) ? ' · ' + VRAM[s.vram] + ' VRAM' : '';
    return p[0] + gpu + vram;
  }
  function linksFor(s, exclude) {
    return PLATFORMS[s.platform][1].filter(function (l) { return location.pathname.indexOf(l[0]) === -1 && l[0] !== exclude; });
  }
  // DOM helpers: text only via textContent
  function el(tag, text, cls) { var n = document.createElement(tag); if (text != null) n.textContent = text; if (cls) n.className = cls; return n; }
  function guideLink(l) { var a = el('a', l[1]); a.href = '/guides/' + l[0] + '/'; return a; }
  function clear(n) { while (n.firstChild) n.removeChild(n.firstChild); }
  function showSetupNote() {
    var box = document.getElementById('setup-note');
    if (!box) return;
    var s = readSetup();
    if (!s) return;
    var links = linksFor(s);
    clear(box);
    var h = el('p', 'Your saved setup: ', 'setup-h'); h.appendChild(el('b', setupText(s))); box.appendChild(h);
    if (links.length) {
      var p = el('p', 'Most relevant for it: ');
      links.forEach(function (l, i) { if (i) p.appendChild(document.createTextNode(' · ')); p.appendChild(guideLink(l)); });
      p.appendChild(document.createTextNode('.'));
      box.appendChild(p);
    }
    var sm = el('p', 'Stored only in this browser. ', 'small'); var ch = el('a', 'Change or clear it'); ch.href = '/#my-setup'; sm.appendChild(ch); sm.appendChild(document.createTextNode('.'));
    box.appendChild(sm);
    box.hidden = false;
  }
  function setupForm() {
    var form = document.getElementById('setup-form');
    if (!form) return;
    var out = document.getElementById('setup-out');
    var s = readSetup();
    if (s) {
      form.platform.value = s.platform;
      if (s.gpu) form.gpu.value = s.gpu;
      if (s.vram) form.vram.value = s.vram;
    }
    function toggle() {
      var pc = form.platform.value === 'pc' || form.platform.value === 'handheld';
      form.querySelector('[data-pc-only]').hidden = !pc;
      form.querySelector('[data-vram]').hidden = form.platform.value !== 'pc';
    }
    function show(saved) {
      var cur = readSetup();
      clear(out);
      if (!cur) { out.appendChild(el('p', 'No setup saved. Nothing is stored until you press “Save my setup”.')); return; }
      var p = el('p', saved ? 'Saved: ' : 'Saved setup: '); p.appendChild(el('b', setupText(cur))); p.appendChild(document.createTextNode('. Start here:'));
      out.appendChild(p);
      var ul = el('ul');
      linksFor(cur).forEach(function (l) { var li = el('li'); li.appendChild(guideLink(l)); ul.appendChild(li); });
      out.appendChild(ul);
    }
    form.platform.addEventListener('change', toggle);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      saveSetup({ platform: form.platform.value, gpu: form.gpu.value, vram: form.vram.value });
      show(true);
      markCards();
    });
    document.getElementById('setup-clear').addEventListener('click', function () {
      try { localStorage.removeItem('ppg-setup'); } catch (e) { /* ignore */ }
      show(false);
      markCards();
    });
    toggle();
    show(false);
  }
  function markCards() {
    var s = readSetup();
    var cards = document.querySelectorAll('.card[data-slug]');
    for (var i = 0; i < cards.length; i++) {
      var on = !!s && PLATFORMS[s.platform][1].some(function (l) { return l[0] === cards[i].getAttribute('data-slug'); });
      cards[i].classList.toggle('rec', on);
      var k = cards[i].querySelector('.k');
      if (k) k.setAttribute('data-rec', on ? 'For your setup' : '');
    }
  }
  window.PPGSetup = { read: readSetup, text: setupText, clean: cleanSetup };

  setupStats();
  privacyButtons();
  if (adsAllowed) { loadAdScript(); renderSlots(); }
  listenToCmp();
  showSetupNote();
  setupForm();
  markCards();
})();
