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
