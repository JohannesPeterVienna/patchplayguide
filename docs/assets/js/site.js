/*
 * Patch Play Guide – page runtime: ad slots, consent-gated Google Analytics, "Privacy settings",
 * and the saved "My setup" (platform + GPU class, localStorage only) shown on guide pages and home.
 * Ad slot IDs stay empty until AdSense units exist: an empty ID renders nothing and reserves no space.
 */
(function () {
  'use strict';
  var CLIENT = 'ca-pub-7811071715414905';
  var AD_SLOTS = {
    lede: '',   // guides: after the lede (responsive; 728×90 / 300×250)
    mid: '',    // guides: mid-article (300×250 / responsive)
    side: '',   // guides: sidebar from 1200 px (300×600), not sticky, never on tool pages
    tool: ''    // tool pages: after the first explanatory section below the tool
  };
  var GA_ID = 'G-T00HRG2YVF';
  var root = document.documentElement;
  var adsAllowed = root.getAttribute('data-ads') === 'yes';

  function loadAdScript() {
    if (document.querySelector('script[src*="adsbygoogle.js"]')) return;
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
  var cmp = { tc: null, cmReady: false, us: null, sent: '' };
  var gaOn = false;

  function startGA() {
    if (gaOn) return;
    gaOn = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', GA_ID);
  }
  function cmValues() {
    try {
      var fc = window.googlefc;
      if (fc && typeof fc.getGoogleConsentModeValues === 'function') return fc.getGoogleConsentModeValues() || null;
    } catch (e) { /* CMP not ready */ }
    return null;
  }
  function applyConsent() {
    var C = window.PPGConsent;
    if (!C) return;
    var values = cmp.cmReady && C.region(cmp.tc) !== 'none' ? cmValues() : null;
    var d = C.decide(cmp.tc, values, cmp.us);
    var analytics = d.analytics_storage === 'granted';
    window['ga-disable-' + GA_ID] = !analytics;
    var key = JSON.stringify(d);
    if (key !== cmp.sent) { cmp.sent = key; gtag('consent', 'update', d); }
    if (analytics) startGA();
  }
  function listenToCmp() {
    window.googlefc = window.googlefc || {};
    window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
    window.googlefc.callbackQueue.push({
      CONSENT_API_READY: function () {
        if (typeof window.__tcfapi !== 'function') return;
        window.__tcfapi('addEventListener', 2, function (tc, ok) {
          cmp.tc = ok ? tc : null;
          if (ok && tc && tc.eventStatus === 'useractioncomplete' && typeof window.googlefc.getGoogleConsentModeValues === 'function') cmp.cmReady = true;
          applyConsent();
        });
      },
      CONSENT_MODE_DATA_READY: function () { cmp.cmReady = true; applyConsent(); },
      INITIAL_US_STATES_OPT_OUT_DATA_READY: function () {
        try {
          var u = window.googlefc.usstatesoptout;
          cmp.us = u && typeof u.getInitialUsStatesOptOutStatus === 'function' ? u.getInitialUsStatesOptOutStatus() : null;
        } catch (e) { cmp.us = null; }
        applyConsent();
      }
    });
    applyConsent();
  }
  function privacyButtons() {
    var btns = document.querySelectorAll('[data-privacy-settings]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function () {
        // treat as withdrawn until the CMP reports the new choice
        cmp.tc = null; cmp.cmReady = false; applyConsent();
        window.googlefc = window.googlefc || {};
        window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
        window.googlefc.callbackQueue.push(function () {
          try { window.googlefc.showRevocationMessage(); } catch (e) { /* CMP unavailable */ }
        });
        loadAdScript();
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
  function readSetup() {
    try { var s = JSON.parse(localStorage.getItem('ppg-setup') || 'null'); return s && PLATFORMS[s.platform] ? s : null; } catch (e) { return null; }
  }
  function saveSetup(s) {
    try { localStorage.setItem('ppg-setup', JSON.stringify(s)); } catch (e) { /* storage blocked */ }
  }
  function setupText(s) {
    var p = PLATFORMS[s.platform];
    var gpu = (s.platform === 'pc' || s.platform === 'handheld') && GPU[s.gpu] ? ' · ' + GPU[s.gpu] : '';
    var vram = s.platform === 'pc' && s.vram ? ' · ' + s.vram + ' GB VRAM' : '';
    return p[0] + gpu + vram;
  }
  function linksFor(s, exclude) {
    return PLATFORMS[s.platform][1].filter(function (l) { return location.pathname.indexOf(l[0]) === -1 && l[0] !== exclude; });
  }
  function showSetupNote() {
    var box = document.getElementById('setup-note');
    if (!box) return;
    var s = readSetup();
    if (!s) return;
    var links = linksFor(s);
    box.innerHTML = '<p class="setup-h">Your saved setup: <b>' + setupText(s) + '</b></p>' +
      (links.length ? '<p>Most relevant for it: ' + links.map(function (l) { return '<a href="/guides/' + l[0] + '/">' + l[1] + '</a>'; }).join(' · ') + '.</p>' : '') +
      '<p class="small">Stored only in this browser. <a href="/#my-setup">Change or clear it</a>.</p>';
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
      if (!cur) { out.innerHTML = '<p>No setup saved. Nothing is stored until you press “Save my setup”.</p>'; return; }
      out.innerHTML = '<p>' + (saved ? 'Saved: ' : 'Saved setup: ') + '<b>' + setupText(cur) + '</b>. Start here:</p><ul>' +
        linksFor(cur).map(function (l) { return '<li><a href="/guides/' + l[0] + '/">' + l[1] + '</a></li>'; }).join('') + '</ul>';
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
  window.PPGSetup = { read: readSetup, text: setupText };

  privacyButtons();
  if (adsAllowed) { loadAdScript(); renderSlots(); }
  listenToCmp();
  showSetupNote();
  setupForm();
  markCards();
})();
