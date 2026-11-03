// Unit tests for the tool logic and the consent decision. Run: node --test tests/logic.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const C = require('../src/assets/js/consent.js');
const D = require('../src/assets/js/decoder-core.js');
const T = require('../src/assets/js/translator-core.js');
const F = require('../src/assets/js/finder-core.js');

let SLUGS = null;
async function slugs() {
  if (!SLUGS) {
    const m = await import(pathToFileURL(path.join(__dirname, '..', 'src', 'guides', 'index.mjs')).href);
    SLUGS = new Set(m.GUIDES.map((g) => g.slug));
  }
  return SLUGS;
}

/* ---------------- consent ---------------- */
const GRANT_ALL = { adStoragePurposeConsentStatus: 1, adUserDataPurposeConsentStatus: 1, adPersonalizationPurposeConsentStatus: 1, analyticsStoragePurposeConsentStatus: 1 };
const tcOk = (extra = {}) => ({ gdprApplies: true, eventStatus: 'useractioncomplete', purpose: { consents: { 1: true } }, vendor: { consents: { 755: true } }, ...extra });

test('consent: nothing known → everything denied', () => {
  assert.deepEqual(C.decide(null, null, null), C.allDenied());
  assert.deepEqual(C.decide(undefined, GRANT_ALL, 2), C.allDenied());
  assert.equal(C.region(null), 'none');
});
test('consent: GDPR with purpose 1 + Google vendor + granted values → granted', () => {
  assert.equal(C.region(tcOk()), 'gdpr-ok');
  const d = C.decide(tcOk(), GRANT_ALL, null);
  assert.equal(d.analytics_storage, 'granted');
  assert.equal(d.ad_storage, 'granted');
});
test('consent: GDPR requires loaded TCF data, purpose 1 and vendor 755', () => {
  assert.deepEqual(C.decide(tcOk({ eventStatus: 'cmpuishown' }), GRANT_ALL, null), C.allDenied());
  assert.deepEqual(C.decide(tcOk({ purpose: { consents: { 1: false } } }), GRANT_ALL, null), C.allDenied());
  assert.deepEqual(C.decide(tcOk({ vendor: { consents: { 755: false } } }), GRANT_ALL, null), C.allDenied());
  assert.deepEqual(C.decide(tcOk({ gdprApplies: undefined, eventStatus: 'loading' }), GRANT_ALL, null), C.allDenied());
});
test('consent: GDPR treats NOT_APPLICABLE (3) and DENIED (2) as denied, per purpose', () => {
  const d = C.decide(tcOk(), { ...GRANT_ALL, analyticsStoragePurposeConsentStatus: 3, adPersonalizationPurposeConsentStatus: 2 }, null);
  assert.equal(d.analytics_storage, 'denied');
  assert.equal(d.ad_personalization, 'denied');
  assert.equal(d.ad_storage, 'granted');
});
test('consent: outside GDPR needs U.S. status DOES_NOT_APPLY (1) or NOT_OPTED_OUT (2)', () => {
  const tc = { gdprApplies: false };
  assert.equal(C.region(tc), 'non-gdpr');
  assert.equal(C.decide(tc, { ...GRANT_ALL, analyticsStoragePurposeConsentStatus: 3 }, 1).analytics_storage, 'granted');
  assert.equal(C.decide(tc, GRANT_ALL, 2).analytics_storage, 'granted');
  assert.deepEqual(C.decide(tc, GRANT_ALL, 3), C.allDenied());
  assert.deepEqual(C.decide(tc, GRANT_ALL, null), C.allDenied());
  assert.deepEqual(C.decide(tc, null, 1), C.allDenied());
  assert.equal(C.decide(tc, { ...GRANT_ALL, analyticsStoragePurposeConsentStatus: 2 }, 1).analytics_storage, 'denied');
  assert.equal(C.decide(tc, { ...GRANT_ALL, analyticsStoragePurposeConsentStatus: 0 }, 1).analytics_storage, 'denied');
});

/* ---------------- patch decoder ---------------- */
test('decoder: example is fictional and every item is well-formed', () => {
  assert.equal(D.EXAMPLE.fictional, true);
  assert.match(D.EXAMPLE.note, /fictional/i);
  for (const it of D.EXAMPLE.items) {
    assert.ok(D.CATEGORIES[it.cat], it.text);
    assert.ok(['plus', 'tilde', 'minus'].includes(it.type), it.text);
    it.platforms.forEach((p) => assert.ok(D.PLATFORMS[p], p));
    assert.ok(D.actionFor(it).length > 10);
  }
});
test('decoder: change type', () => {
  assert.equal(D.detectType('+ Added a frame cap option'), 'plus');
  assert.equal(D.detectType('~ Shadows tweaked'), 'tilde');
  assert.equal(D.detectType('− Removed motion blur toggle'), 'minus');
  assert.equal(D.detectType('- Fixed a crash when removing a controller'), 'plus');
  assert.equal(D.detectType('Known issue: added effects may flicker'), 'minus');
  assert.equal(D.detectType('Removed the low texture preset on Xbox Series S'), 'minus');
  assert.equal(D.detectType('Improved CPU performance in large battles'), 'plus');
  assert.equal(D.detectType('Adjusted the default field of view'), 'tilde');
  assert.equal(D.detectType('Harpoon damage 40 → 35'), 'tilde');
  assert.equal(D.detectType('Reduced stutter when entering the city'), 'plus');
  // documented limitation on the tool page
  assert.equal(D.detectType('Removed an issue that caused stutter'), 'minus');
});
test('decoder: review cases – "no longer crashes" is a fix, "can now be disabled" is a change', () => {
  assert.equal(D.detectType('The game no longer crashes when alt-tabbing'), 'plus');
  assert.equal(D.detectType('Menus no longer flicker with HDR enabled'), 'plus');
  assert.equal(D.detectType('Characters no longer appear in T-pose'), 'plus');
  assert.equal(D.detectType('Motion blur can now be disabled'), 'tilde');
  assert.equal(D.detectType('Film grain can now be turned off'), 'tilde');
  assert.equal(D.detectType('The legacy renderer is no longer available'), 'minus');
});
test('decoder: generic Hz rule, handheld bug fixes, RTX', () => {
  assert.equal(D.classify('Added a 144 Hz option for supported displays').cat, 'modes');
  assert.equal(D.classify('New 90hz mode on Steam Deck OLED').cat, 'modes');
  const fix = D.classify('Fixed audio desync in handheld mode on Switch 2');
  assert.equal(fix.type, 'plus'); assert.equal(fix.cat, 'other'); assert.deepEqual(fix.platforms, ['switch2']);
  assert.equal(D.classify('Handheld mode on Switch 2 now targets 1080p').cat, 'modes');
  assert.deepEqual(D.classify('Improved performance on RTX cards').platforms, ['pc']);
});
test('decoder: category order (stability before upscaling, shaders before performance)', () => {
  assert.equal(D.classify('Fixed a crash when enabling DLSS').cat, 'stability');
  assert.equal(D.classify('Reduced shader stutter in the hub').cat, 'shaders');
  assert.equal(D.classify('Updated FSR to a newer version').cat, 'upscaling');
  assert.equal(D.classify('PS5 performance mode now targets 60 fps').cat, 'modes');
  assert.equal(D.classify('Added NVIDIA Reflex').cat, 'input');
  assert.equal(D.classify('Volumetric fog quality High is cheaper').cat, 'graphics');
  assert.equal(D.classify('Improved CPU performance in large battles').cat, 'performance');
  assert.equal(D.classify('Harpoon reload time adjusted').cat, 'other');
});
test('decoder: platforms', () => {
  assert.deepEqual(D.classify('Fixed stutter on Steam Deck after shader cache rebuild').platforms, ['handheld']);
  assert.deepEqual(D.classify('Higher resolution in handheld mode on Switch 2').platforms, ['switch2']);
  assert.deepEqual(D.classify('Improved loading on PS5 and Xbox Series X|S').platforms, ['ps5', 'xbox']);
  assert.deepEqual(D.classify('DirectX 12: fixed crash on Windows').platforms, ['pc']);
  assert.deepEqual(D.classify('Rebalanced the economy').platforms, []);
  const pipe = D.classify('- Fixed stutter on Steam Deck after shader cache rebuild');
  assert.equal(pipe.type, 'plus'); assert.equal(pipe.cat, 'shaders'); assert.equal(pipe.text.startsWith('Fixed'), true);
});
test('decoder: classifyAll skips blanks and headings, strips bullets', () => {
  const r = D.classifyAll('Patch Notes 1.2\n\n* Added HDR calibration\n## Graphics\n2) Removed SSAO low option\n   \n');
  assert.equal(r.length, 2);
  assert.equal(r[0].text, 'Added HDR calibration');
  assert.equal(r[1].type, 'minus');
});
test('decoder: filter keeps platform-less lines for every platform', () => {
  const items = D.EXAMPLE.items;
  const ps5 = D.filter(items, 'all', 'ps5');
  assert.ok(ps5.some((i) => i.platforms.length === 0));
  assert.ok(ps5.every((i) => !i.platforms.length || i.platforms.includes('ps5')));
  assert.ok(D.filter(items, 'modes', 'all').every((i) => i.cat === 'modes'));
  assert.equal(D.filter(items, 'all', 'all').length, items.length);
});
test('decoder: checklist and text export', () => {
  const list = D.checklist(D.EXAMPLE.items);
  assert.ok(list.length > 4);
  assert.equal(new Set(list).size, list.length);
  const txt = D.exportText('Test', D.EXAMPLE.items.slice(0, 3), list, [true]);
  assert.match(txt, /^Patch Play Guide/);
  assert.match(txt, /\n\+ \[/);
  assert.match(txt, /\[x\] /);
  assert.match(txt, /\[ \] /);
  const c = D.counts(D.EXAMPLE.items);
  assert.equal(c.plus + c.tilde + c.minus, D.EXAMPLE.items.length);
});

/* ---------------- settings translator ---------------- */
test('translator: data is complete and conservative', async () => {
  const s = await slugs();
  const ids = new Set();
  assert.equal(T.OPTIONS.length, 20);
  for (const o of T.OPTIONS) {
    assert.ok(!ids.has(o.id)); ids.add(o.id);
    for (const k of ['gpu', 'cpu', 'vram']) assert.ok(Number.isInteger(o[k]) && o[k] >= 0 && o[k] <= 3, o.id + k);
    assert.ok(o.loss >= 1 && o.loss <= 3);
    assert.ok(s.has(o.guide), o.guide);
    assert.ok(o.what.length > 30 && o.tip.length > 20);
  }
});
test('translator: lower-first lists follow common guidance', () => {
  const gpu = T.lowerFirst('gpu').map((o) => o.id);
  const cpu = T.lowerFirst('cpu').map((o) => o.id);
  const vram = T.lowerFirst('vram').map((o) => o.id);
  assert.ok(gpu.includes('upscaler') && gpu.includes('volumetrics'));
  assert.ok(!gpu.includes('textures') && !gpu.includes('aniso'));
  assert.deepEqual(cpu.slice(0, 2).sort(), ['crowds', 'draw']);
  assert.equal(vram[0], 'textures');
  assert.ok(![...gpu, ...cpu, ...vram].includes('framegen'));
  assert.equal(T.lowerFirst('unsure').length, 0);
  assert.equal(T.rank('cpu').length, 20);
  assert.ok(T.lowerFirst('gpu').every((o) => o.gpu >= 2 && o.loss <= 2));
});
test('translator: search matches names and aliases', () => {
  assert.ok(T.search('dlss').some((o) => o.id === 'upscaler'));
  assert.ok(T.search('SSAO').some((o) => o.id === 'ao'));
  assert.equal(T.search('').length, 20);
  assert.equal(T.search('zzzz').length, 0);
});

/* ---------------- bottleneck finder ---------------- */
test('finder: every answer leads to an existing node, sizes match the tool page', () => {
  assert.equal(Object.keys(F.QUESTIONS).length, 10);
  assert.equal(Object.keys(F.RESULTS).length, 17);
  for (const t of F.allTargets()) assert.ok(F.node(t), 'missing node ' + t);
});
test('finder: every node is reachable and there are no loops', () => {
  const seen = new Set();
  function visit(id, stack) {
    assert.ok(!stack.includes(id), 'loop at ' + id);
    seen.add(id);
    const q = F.QUESTIONS[id];
    if (q) q.a.forEach((a) => visit(a[1], stack.concat(id)));
  }
  visit(F.START, []);
  for (const k of [...Object.keys(F.QUESTIONS), ...Object.keys(F.RESULTS)]) assert.ok(seen.has(k), 'unreachable ' + k);
});
test('finder: results link to existing guides and walk() follows answers', async () => {
  const s = await slugs();
  for (const [k, r] of Object.entries(F.RESULTS)) {
    assert.ok(r.guides.length >= 1, k);
    r.guides.forEach((g) => assert.ok(s.has(g), k + ' → ' + g));
    assert.ok(r.steps.length >= 3, k);
  }
  assert.equal(F.walk([0, 0, 0]).id, 'r-gpu');
  assert.equal(F.walk([0, 0, 1, 0, 1]).id, 'r-cpu');
  assert.equal(F.walk([1, 0]).id, 'r-shader');
  assert.equal(F.walk([6]).id, 'r-handheld');
  assert.equal(F.walk([]).kind, 'question');
  assert.equal(F.walk([99]), null);
});

/* ---------------- decoder: honest 300-line limit (P2/PP03) ---------------- */
test('decoder: limit checked before processing, skipped lines counted and exported', () => {
  const lines = Array.from({ length: 301 }, (_, i) => `Fixed crash number ${i + 1} on PC`);
  const r = D.classifyInput(lines.join('\n'));
  assert.equal(r.items.length, 300);
  assert.equal(r.skipped, 1);
  assert.equal(r.lines, 301);
  assert.match(D.limitNotice(r.skipped), /^1 line beyond the limit was not sorted/);
  const r2 = D.classifyInput(Array.from({ length: 345 }, (_, i) => `Removed option ${i}`).join('\n\n'));
  assert.equal(r2.skipped, 45);
  assert.match(D.limitNotice(45), /^45 lines beyond the limit were not sorted/);
  const txt = D.exportText('T', r2.items, [], [], { skipped: r2.skipped });
  assert.match(txt, /NOTE: 45 lines beyond the limit were not sorted/);
  assert.equal(D.limitNotice(0), '');
  assert.doesNotMatch(D.exportText('T', r.items.slice(0, 2), [], [], { skipped: 0 }), /beyond the limit/);
  assert.equal(D.classifyInput('a\n\n\nFixed crash').skipped, 0);
  assert.deepEqual(D.classifyAll('Fixed crash on PC'), D.classifyInput('Fixed crash on PC').items);
});

/* ---------------- decoder UI source: stale export, copy result (P1/PP02, PP08) ---------------- */
test('decoder UI: export re-sorts changed text and copy checks execCommand', () => {
  const src = require('node:fs').readFileSync(path.join(__dirname, '..', 'src', 'assets', 'js', 'decoder.js'), 'utf8');
  assert.match(src, /function text\(\) \{\n\s+if \(isStale\(\)\) \{[^}]*sortNow\(\); \}/);
  assert.match(src, /ok = document\.execCommand\('copy'\) === true/);
  assert.match(src, /press Ctrl\+C/);
});

/* ---------------- privacy settings button (C3) + GPP ---------------- */
function stubFc({ status, withEnum = true, optOut = false, throwOn } = {}) {
  const calls = [];
  const fc = { showRevocationMessage() { calls.push('revocation'); if (throwOn === 'revocation') throw new Error('x'); } };
  if (status !== undefined) {
    fc.usstatesoptout = {
      getInitialUsStatesOptOutStatus() { if (throwOn === 'status') throw new Error('x'); return status; },
      openConfirmationDialog(cb) { calls.push('us'); cb(optOut); }
    };
    if (withEnum) fc.usstatesoptout.InitialUsStatesOptOutStatusEnum = { UNKNOWN: 0, DOES_NOT_APPLY: 1, NOT_OPTED_OUT: 2, OPTED_OUT: 3 };
  }
  return { fc, calls };
}
test('privacy settings: U.S. regulation -> opt-out dialog with callback; otherwise revocation message', () => {
  for (const st of [0, 2, 3]) {
    const { fc, calls } = stubFc({ status: st, optOut: true });
    let got = null;
    assert.equal(C.openPrivacyChoices(fc, (o) => { got = o; }), 'us');
    assert.deepEqual(calls, ['us']); assert.equal(got, true);
  }
  for (const opt of [{ status: 1 }, { status: 1, withEnum: false }, {}, { status: 2, throwOn: 'status' }]) {
    const { fc, calls } = stubFc(opt);
    assert.equal(C.openPrivacyChoices(fc, () => {}), 'revocation', JSON.stringify(opt));
    assert.deepEqual(calls, ['revocation']);
  }
  const { fc } = stubFc({ status: 1 });
  fc.usstatesoptout.InitialUsStatesOptOutStatusEnum = { DOES_NOT_APPLY: 9 };
  assert.equal(C.openPrivacyChoices(fc, () => {}), 'us');
  assert.equal(C.openPrivacyChoices(undefined), 'none');
  assert.equal(C.openPrivacyChoices(stubFc({ throwOn: 'revocation' }).fc), 'none');
  // opted out -> stays denied
  assert.deepEqual(C.decide({ gdprApplies: false }, { adStoragePurposeConsentStatus: 1, adUserDataPurposeConsentStatus: 1, adPersonalizationPurposeConsentStatus: 1, analyticsStoragePurposeConsentStatus: 1 }, C.US_OPTED_OUT), C.allDenied());
});
test('GPP: current U.S. opt-out state; no signal -> denied', () => {
  assert.equal(C.usFromGpp({ signalStatus: 'ready', parsedSections: { usnat: [{ SaleOptOut: 2, SharingOptOut: 2, TargetedAdvertisingOptOut: 2 }, { Gpc: false }] } }), 2);
  assert.equal(C.usFromGpp({ parsedSections: { usnat: [{ SaleOptOut: 2, SharingOptOut: 2, TargetedAdvertisingOptOut: 1 }] } }), 3);
  assert.equal(C.usFromGpp({ parsedSections: { usca: { SaleOptOut: 1 } } }), 3);
  assert.equal(C.usFromGpp({ parsedSections: { usnat: [{ SaleOptOut: 2 }, { Gpc: true }] } }), 3);
  assert.equal(C.usFromGpp({ parsedSections: { tcfeuv2: {} } }), null);
  assert.equal(C.usFromGpp({ signalStatus: 'not ready', parsedSections: { usnat: { SaleOptOut: 2 } } }), null);
  assert.equal(C.usFromGpp(null), null);
  assert.equal(C.usEffective(1, null), 1);
  assert.equal(C.usEffective(2, null), null);
  assert.equal(C.usEffective(2, 2), 2);
  assert.equal(C.usEffective(0, 3), 3);
});

/* ---------------- local/test guard (G, PP01) ---------------- */
test('noGoogle: localhost, 127.0.0.1, ::1, file: and ?stats_test=1', () => {
  for (const [h, p] of [['localhost', 'http:'], ['127.0.0.1', 'http:'], ['::1', 'http:'], ['[::1]', 'http:'], ['', 'file:']]) assert.equal(C.noGoogle(h, p, ''), true);
  assert.equal(C.noGoogle('patchplayguide.com', 'https:', '?stats_test=1'), true);
  assert.equal(C.noGoogle('patchplayguide.com', 'https:', '?stats_test=12'), false);
  assert.equal(C.noGoogle('patchplayguide.com', 'https:', ''), false);
});
test('head guard + inline AdSense loader insert the tag only in production', () => {
  const fs = require('node:fs'); const vm = require('node:vm');
  const html = fs.readFileSync(path.join(__dirname, '..', 'docs', 'index.html'), 'utf8');
  const guard = html.match(/<script>(window\.PPG_NO_GOOGLE=[\s\S]*?)<\/script>/)[1];
  const loader = html.match(/<script data-ads-loader>([\s\S]*?)<\/script>/)[1];
  const run = (hostname, protocol, search = '', store = {}) => {
    const added = [];
    const ctx = { document: { createElement: () => ({}), head: { appendChild: (s) => added.push(s) } }, location: { hostname, protocol, search },
      sessionStorage: { setItem: (k, v) => { store[k] = v; }, getItem: (k) => (k in store ? store[k] : null) } };
    vm.createContext(ctx);
    vm.runInContext('var window=this;' + guard + ';' + loader, ctx);
    return added;
  };
  const prod = run('patchplayguide.com', 'https:');
  assert.equal(prod.length, 1);
  assert.equal(prod[0].src, 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7811071715414905');
  assert.equal(prod[0].async, true); assert.equal(prod[0].crossOrigin, 'anonymous');
  for (const [h, p] of [['localhost', 'http:'], ['127.0.0.1', 'http:'], ['[::1]', 'http:'], ['', 'file:']]) assert.equal(run(h, p).length, 0);
  const store = {};
  assert.equal(run('patchplayguide.com', 'https:', '?stats_test=1', store).length, 0);
  assert.equal(run('patchplayguide.com', 'https:', '', store).length, 0);
});

/* ---------------- saved setup validation (PP06) ---------------- */
function loadSite(storage) {
  const fs = require('node:fs'); const vm = require('node:vm');
  const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'assets', 'js', 'site.js'), 'utf8');
  const window = { PPG_NO_GOOGLE: true, matchMedia: () => ({ matches: false }) };
  const document = { documentElement: { getAttribute: () => 'no' }, querySelectorAll: () => [], getElementById: () => null, querySelector: () => null, createElement: () => ({}), head: { appendChild() {} } };
  const ctx = { window, document, location: { pathname: '/', hostname: 'localhost', protocol: 'http:', search: '' }, localStorage: { getItem: (k) => storage[k] ?? null, setItem: (k, v) => { storage[k] = v; }, removeItem: (k) => { delete storage[k]; } } };
  vm.createContext(ctx);
  vm.runInContext(src, ctx);
  return window.PPGSetup;
}
test('saved setup: only own platform/GPU/VRAM values survive; bad data never throws', () => {
  const bad = ['{"platform":"constructor"}', '{"platform":"__proto__"}', '42', '"pc"', '[1]', 'null', '{bad json', '{"platform":"toString"}'];
  for (const v of bad) assert.equal(loadSite({ 'ppg-setup': v }).read(), null, v);
  const S = loadSite({ 'ppg-setup': '{"platform":"pc","gpu":"constructor","vram":"<img src=x onerror=alert(1)>"}' });
  assert.deepEqual(JSON.parse(JSON.stringify(S.read())), { platform: 'pc', gpu: '', vram: '' });
  assert.equal(S.text(S.read()), 'Desktop or laptop PC');
  const ok = loadSite({ 'ppg-setup': '{"platform":"pc","gpu":"high","vram":"12"}' });
  assert.equal(ok.text(ok.read()), 'Desktop or laptop PC · high-end GPU · 10–12 GB VRAM');
  const num = loadSite({ 'ppg-setup': '{"platform":"pc","gpu":"mid","vram":8}' });
  assert.equal(num.read().vram, '8');
  assert.equal(loadSite({ 'ppg-setup': '{"platform":"ps5pro"}' }).read().platform, 'ps5pro');
});
