// Tests for the interim "Stats check" window (src/assets/js/stats-window.js) and its wiring in site.js.
// consent.js + stats-window.js + site.js run together in a vm with a small DOM stub, a fake clock and an
// optional stubbed Google CMP (__tcfapi). Run: node --test tests/stats-window.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const S = require('../src/assets/js/stats-window.js');

const JS = path.join(__dirname, '..', 'src', 'assets', 'js');
const SRC = ['consent.js', 'stats-window.js', 'site.js'].map((f) => fs.readFileSync(path.join(JS, f), 'utf8'));
const KEY = 'ppg-stats', OFF = 'ga-disable-G-T00HRG2YVF';
const DAY = 864e5, NOW = Date.UTC(2026, 10, 5, 12);

/* ---------- minimal DOM ---------- */
class El {
  constructor(tag, doc) { this.tagName = String(tag).toUpperCase(); this.doc = doc; this.children = []; this.parentNode = null; this.attrs = {}; this.handlers = {}; this.hidden = false; this._text = ''; this.className = '';
    const cls = new Set(); this.classList = { add: (c) => cls.add(c), remove: (c) => cls.delete(c), contains: (c) => cls.has(c), toggle: (c, on) => (on ? cls.add(c) : cls.delete(c)) };
    this.style = { setProperty: (k, v) => { this.style[k] = v; } }; this.offsetHeight = 200; }
  get firstChild() { return this.children[0] || null; }
  get textContent() { return this._text + this.children.map((c) => c.textContent).join(''); }
  set textContent(t) { this.children = []; this._text = String(t); }
  appendChild(c) { if (c.parentNode) c.parentNode.removeChild(c); c.parentNode = this; this.children.push(c); return c; }
  insertBefore(c, ref) { if (c.parentNode) c.parentNode.removeChild(c); c.parentNode = this; const i = ref ? this.children.indexOf(ref) : -1; if (i < 0) this.children.push(c); else this.children.splice(i, 0, c); return c; }
  removeChild(c) { this.children = this.children.filter((x) => x !== c); c.parentNode = null; return c; }
  get nextSibling() { const p = this.parentNode; if (!p) return null; return p.children[p.children.indexOf(this) + 1] || null; }
  setAttribute(k, v) { this.attrs[k] = String(v); if (k === 'id') this.id = String(v); }
  getAttribute(k) { return k in this.attrs ? this.attrs[k] : null; }
  hasAttribute(k) { return k in this.attrs; }
  addEventListener(ev, fn) { (this.handlers[ev] = this.handlers[ev] || []).push(fn); }
  fire(ev, extra = {}) { const e = { target: this, key: extra.key, preventDefault() {} }; let n = this; while (n) { (n.handlers[ev] || []).forEach((f) => f(e)); n = n.parentNode; } }
  focus() { this.doc.activeElement = this; }
  contains(x) { while (x) { if (x === this) return true; x = x.parentNode; } return false; }
  closest(sel) { let n = this; while (n && n.getAttribute) { if (match(n, sel)) return n; n = n.parentNode; } return null; }
  all(pred, out = []) { this.children.forEach((c) => { if (pred(c)) out.push(c); c.all(pred, out); }); return out; }
}
function match(n, sel) {
  const m = sel.match(/^\[([\w-]+)\]$/); if (m) return n.hasAttribute(m[1]);
  if (sel.startsWith('.')) return (' ' + n.className + ' ').includes(' ' + sel.slice(1) + ' ');
  return false;
}
const find = (doc, sel) => doc.body.all((n) => match(n, sel));

function site({ tcf = 'none', tc = null, stored, scope = 'auto', gpc = false, cookies = [], storageThrows = false, now = NOW } = {}) {
  let clock = now; const timers = [];
  const updates = [], configs = [], scripts = [], cookieWrites = [];
  const store = new Map(stored === undefined ? [] : [[KEY, typeof stored === 'string' ? stored : JSON.stringify(stored)]]);
  let jar = cookies.slice();
  const doc = { activeElement: null };
  const html = new El('html', doc); html.setAttribute('data-ads', 'no'); html.setAttribute('data-stats', scope);
  const body = new El('body', doc); const mast = new El('header', doc); mast.className = 'mast'; body.appendChild(mast);
  const footBtn = new El('button', doc); footBtn.setAttribute('data-privacy-settings', ''); body.appendChild(footBtn);
  Object.assign(doc, {
    documentElement: html, body,
    head: { appendChild: (s) => scripts.push(s) },
    createElement: (t) => new El(t, doc), createTextNode: (t) => { const n = new El('#text', doc); n._text = String(t); return n; },
    getElementById: () => null,
    querySelector: (sel) => (sel === '.mast' ? mast : find(doc, sel)[0] || null),
    querySelectorAll: (sel) => find(doc, sel)
  });
  Object.defineProperty(doc, 'cookie', {
    get() { return jar.join('; '); },
    set(v) { cookieWrites.push(v); const name = v.split('=')[0]; if (/expires=Thu, 01 Jan 1970/.test(v)) jar = jar.filter((c) => c.split('=')[0] !== name); }
  });
  const FakeDate = class extends Date { constructor(...a) { super(...(a.length ? a : [clock])); } static now() { return clock; } };
  const storage = { getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)), removeItem: (k) => store.delete(k) };
  const win = {
    document: doc, navigator: gpc ? { globalPrivacyControl: true } : {}, Date: FakeDate,
    location: { hostname: 'www.patchplayguide.com', protocol: 'https:', search: '', pathname: '/guides/x/' },
    matchMedia: () => ({ matches: false }),
    setTimeout: (fn, ms) => { timers.push({ at: clock + (ms || 0), fn }); return timers.length; },
    gtag: (...a) => { if (a[0] === 'consent' && a[1] === 'update') updates.push(a[2]); if (a[0] === 'config') configs.push(a); }
  };
  Object.defineProperty(win, 'localStorage', { get() { if (storageThrows) throw new Error('SecurityError'); return storage; } });
  let listener = null;
  if (tcf !== 'none') {
    win.googlefc = { callbackQueue: [] };
    win.__tcfapi = (cmd, v, cb) => { if (cmd === 'addEventListener') { listener = cb; if (tc) cb(tc, true); } };
  }
  win.window = win; win.self = win;
  const ctx = vm.createContext(win);
  for (const src of SRC) vm.runInContext(src, ctx);
  const advance = (ms) => { const until = clock + ms; for (;;) { timers.sort((a, b) => a.at - b.at); const t = timers[0]; if (!t || t.at > until) break; timers.shift(); clock = t.at; t.fn(); } clock = until; };
  const box = () => find(doc, '.statcheck')[0] || null;
  const open = () => !!box() && !box().hidden;
  const btn = (v) => box().all((n) => n.getAttribute(v === 'close' ? 'data-stat-close' : 'data-stat') !== null && (v === 'close' || n.getAttribute('data-stat') === v))[0];
  return {
    win, doc, store, updates, configs, scripts, cookieWrites, footBtn, box, open, advance,
    jar: () => jar.slice(),
    gaScripts: () => scripts.filter((s) => /googletagmanager\.com\/gtag\/js/.test(s.src || '')),
    click: (v) => btn(v).fire('click'),
    escape: () => box().fire('keydown', { key: 'Escape' }),
    emit: (t) => listener(t, true),
    tick: (ms) => { clock += ms; }
  };
}
const HIDDEN = { gdprApplies: true, eventStatus: 'cmpuishown', displayStatus: 'hidden', tcString: '' };
const plain = (x) => JSON.parse(JSON.stringify(x));   // objects from the vm realm
const lastUpdate = (s) => s.updates[s.updates.length - 1];

/* ---------- pure helpers ---------- */
test('cmpState: decisions, visible message, gdprApplies false; hidden/disabled and empty tcloaded are "nothing"', () => {
  assert.equal(S.cmpState(null), null);
  assert.equal(S.cmpState({ gdprApplies: false }), 'non-gdpr');
  assert.equal(S.cmpState({ gdprApplies: true, eventStatus: 'useractioncomplete' }), 'decided');
  assert.equal(S.cmpState({ gdprApplies: true, eventStatus: 'tcloaded', tcString: 'CQabc' }), 'decided');
  assert.equal(S.cmpState({ gdprApplies: true, eventStatus: 'tcloaded', tcString: '' }), null);
  assert.equal(S.cmpState({ gdprApplies: true, eventStatus: 'cmpuishown', displayStatus: 'visible' }), 'shown');
  assert.equal(S.cmpState({ gdprApplies: true, eventStatus: 'cmpuishown', displayStatus: 'hidden' }), null);
  assert.equal(S.cmpState({ gdprApplies: true, eventStatus: 'cmpuishown', displayStatus: 'disabled' }), null);
});
test('cookie deletion covers the host and every parent domain, but not the TLD', () => {
  const w = S.gaCookieDeletes('_ga=GA1.1.1; _ga_T00HRG2YVF=GS1; _gid=1; other=2', 'www.patchplayguide.com');
  assert.equal(w.length, 6);
  for (const n of ['_ga', '_ga_T00HRG2YVF']) for (const d of ['', '; domain=.www.patchplayguide.com', '; domain=.patchplayguide.com']) assert.ok(w.includes(`${n}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; path=/${d}`), n + d);
  assert.ok(!w.some((c) => /_gid|other|domain=\.com(;|$)/.test(c)));
});

/* ---------- when the window appears ---------- */
test('CMP reports displayStatus "hidden": window after ~3 s, not before; nothing granted yet', () => {
  const s = site({ tcf: 'stub', tc: HIDDEN });
  s.advance(2900); assert.equal(s.open(), false);
  s.advance(200); assert.equal(s.open(), true);
  const b = s.box();
  assert.equal(b.getAttribute('role'), 'dialog'); assert.equal(b.getAttribute('aria-modal'), 'false');
  assert.equal(b.all((n) => n.id === 'statcheck-h')[0].getAttribute('tabindex'), '-1');
  assert.equal(s.win[OFF], true);
  assert.equal(s.gaScripts().length, 0);
  assert.ok(!s.updates.some((u) => u.analytics_storage === 'granted'));
  assert.match(b.textContent, /not consent to advertising/);
});
test('no __tcfapi at all: window after ~3 s', () => {
  const s = site();
  s.advance(3000); assert.equal(s.open(), true);
});
test('no window when the CMP decided, says gdprApplies false, or shows its message; stored choice is deleted on a decision', () => {
  for (const tc of [{ gdprApplies: true, eventStatus: 'useractioncomplete', purpose: { consents: { 1: true } }, vendor: { consents: { 755: true } } },
    { gdprApplies: true, eventStatus: 'tcloaded', tcString: 'CQabc', purpose: { consents: {} }, vendor: { consents: {} } },
    { gdprApplies: false, eventStatus: 'tcloaded', tcString: '' }]) {
    const s = site({ tcf: 'stub', tc, stored: { v: 1, choice: 'yes', at: NOW - DAY } });
    s.advance(5000);
    assert.equal(s.open(), false, JSON.stringify(tc));
    assert.equal(s.store.has(KEY), false, 'stored window choice deleted');
    assert.equal(s.gaScripts().length, 0);
  }
  const v = site({ tcf: 'stub', tc: { gdprApplies: true, eventStatus: 'cmpuishown', displayStatus: 'visible' } });
  v.advance(5000); assert.equal(v.open(), false);
});
test('Global Privacy Control: no window, no GA – even with a stored "yes"', () => {
  const s = site({ tcf: 'stub', tc: HIDDEN, gpc: true, stored: { v: 1, choice: 'yes', at: NOW - DAY } });
  s.advance(5000);
  assert.equal(s.open(), false);
  assert.equal(s.win[OFF], true);
  assert.equal(s.gaScripts().length, 0);
  s.footBtn.fire('click');   // "Privacy settings" explains why, without Allow/Decline
  assert.equal(s.open(), true);
  assert.match(s.box().textContent, /Global Privacy Control/);
});

/* ---------- choices ---------- */
test('Allow sets only analytics_storage granted, loads gtag.js once with signals/ad personalisation off', () => {
  const s = site({ tcf: 'stub', tc: HIDDEN });
  s.advance(3000);
  const before = s.updates.length;
  s.click('yes');
  const after = s.updates.slice(before);
  assert.deepEqual(plain(after), [{ analytics_storage: 'granted' }]);
  assert.ok(!s.updates.some((u) => ['ad_storage', 'ad_user_data', 'ad_personalization'].some((k) => u[k] === 'granted')));
  assert.equal(s.win[OFF], false);
  assert.equal(s.gaScripts().length, 1);
  assert.deepEqual(plain(s.configs.map((c) => c[2])), [{ allow_google_signals: false, allow_ad_personalization_signals: false }]);
  assert.equal(s.open(), false);
  const rec = JSON.parse(s.store.get(KEY));
  assert.deepEqual([rec.v, rec.choice, rec.at], [1, 'yes', NOW + 3000]);
  // withdraw and allow again in the same page view: still one gtag.js
  s.footBtn.fire('click'); s.click('no'); s.footBtn.fire('click'); s.click('yes');
  assert.equal(s.gaScripts().length, 1);
});
test('Decline: GA off, analytics denied, _ga/_ga_* deleted; × and Escape store nothing', () => {
  const s = site({ tcf: 'stub', tc: HIDDEN, cookies: ['_ga=GA1.1.5', '_ga_T00HRG2YVF=GS1.1', 'keep=1'] });
  s.advance(3000);
  s.click('no');
  assert.equal(s.win[OFF], true);
  assert.equal(lastUpdate(s).analytics_storage, 'denied');
  assert.deepEqual(s.jar(), ['keep=1']);
  assert.equal(JSON.parse(s.store.get(KEY)).choice, 'no');
  const x = site({ tcf: 'stub', tc: HIDDEN });
  x.advance(3000); x.click('close');
  assert.equal(x.open(), false); assert.equal(x.store.has(KEY), false); assert.equal(x.win[OFF], true);
  const e = site(); e.advance(3000); e.escape();
  assert.equal(e.open(), false); assert.equal(e.store.has(KEY), false); assert.equal(e.gaScripts().length, 0);
});
test('stored "no" deletes _ga at load (also on pages without ads); stored "yes" measures without asking', () => {
  const s = site({ stored: { v: 1, choice: 'no', at: NOW - DAY }, cookies: ['_ga=GA1.1.5'] });
  assert.deepEqual(s.jar(), []);
  s.advance(3000); assert.equal(s.open(), false);
  const p = site({ scope: 'settings', stored: { v: 1, choice: 'no', at: NOW - DAY }, cookies: ['_ga=GA1.1.5'] });
  assert.deepEqual(p.jar(), []);
  const y = site({ tcf: 'stub', tc: HIDDEN, stored: { v: 1, choice: 'yes', at: NOW - 10 * DAY } });
  y.advance(3000);
  assert.equal(y.open(), false); assert.equal(y.win[OFF], false); assert.equal(y.gaScripts().length, 1);
});
test('12 months, versions and future timestamps: asked again', () => {
  const ask = (rec) => { const s = site({ stored: rec }); s.advance(3000); return s.open(); };
  assert.equal(ask({ v: 1, choice: 'yes', at: Date.UTC(2025, 10, 5, 13) }), false);   // just under 12 months
  assert.equal(ask({ v: 1, choice: 'yes', at: Date.UTC(2025, 10, 5, 11, 59) }), true);     // 12 months + 1 min
  assert.equal(ask({ v: 2, choice: 'yes', at: NOW - DAY }), true);
  assert.equal(ask({ v: 1, choice: 'maybe', at: NOW - DAY }), true);
  assert.equal(ask({ v: 1, choice: 'yes', at: NOW + DAY }), true);    // future timestamp discarded
  assert.equal(ask('{broken'), true);
  const s = site({ stored: { v: 1, choice: 'yes', at: NOW + DAY } });
  s.advance(3000); assert.equal(s.store.has(KEY), false); assert.equal(s.gaScripts().length, 0);
});
test('blocked localStorage throws nowhere; the choice holds for the page view', () => {
  let s;
  assert.doesNotThrow(() => { s = site({ tcf: 'stub', tc: HIDDEN, storageThrows: true }); s.advance(3000); s.click('yes'); });
  assert.equal(s.win[OFF], false);
  assert.equal(s.gaScripts().length, 1);
});

/* ---------- Google's CMP has priority ---------- */
test('late CMP decision: window closes, stored choice deleted, Google "no" deletes _ga', () => {
  const s = site({ tcf: 'stub', tc: HIDDEN, cookies: ['_ga=GA1.1.5'] });
  s.advance(3000); s.click('yes');
  assert.equal(s.win[OFF], false);
  s.footBtn.fire('click'); assert.equal(s.open(), true);
  s.emit({ gdprApplies: true, eventStatus: 'useractioncomplete', tcString: 'CQx', purpose: { consents: { 1: false } }, vendor: { consents: {} } });
  assert.equal(s.open(), false);
  assert.equal(s.store.has(KEY), false);
  assert.equal(s.win[OFF], true);
  assert.equal(lastUpdate(s).analytics_storage, 'denied');
  assert.deepEqual(s.jar(), []);
  s.advance(10000); assert.equal(s.open(), false);
  s.footBtn.fire('click'); assert.equal(s.open(), false, 'Privacy settings now goes to Google');
});
test('late gdprApplies false: window retires, existing non-EU logic decides (no U.S. status -> no GA)', () => {
  const s = site({ tcf: 'stub', tc: HIDDEN });
  s.advance(3000); s.click('yes');
  s.emit({ gdprApplies: false, eventStatus: 'tcloaded', tcString: '' });
  assert.equal(s.store.has(KEY), false);
  assert.equal(s.win[OFF], true);
});
test('Google "no" deletes _ga even if the window was never active', () => {
  const s = site({ tcf: 'stub', tc: { gdprApplies: true, eventStatus: 'tcloaded', tcString: 'CQx', purpose: { consents: { 1: true } }, vendor: { consents: { 755: false } } }, cookies: ['_ga=GA1.1.5', '_ga_T00HRG2YVF=x'] });
  assert.deepEqual(s.jar(), []);
});
test('U.S. opt-out via GPP keeps GA off while the window is in charge', () => {
  const s = site({ tcf: 'stub', tc: HIDDEN });
  let gpp = null;
  s.win.__gpp = (cmd, cb) => { if (cmd === 'addEventListener') gpp = cb; };
  s.win.googlefc.callbackQueue.forEach((c) => c && c.CONSENT_API_READY && c.CONSENT_API_READY());
  s.advance(3000); s.click('yes');
  assert.equal(s.win[OFF], false);
  gpp({ pingData: { signalStatus: 'ready', parsedSections: { usnat: { SaleOptOut: 1 } } } }, true);
  assert.equal(s.win[OFF], true);
  assert.equal(lastUpdate(s).analytics_storage, 'denied');
});

/* ---------- pages without ads, Privacy settings, accessibility ---------- */
test('pages without ads: no window by itself, no GA; Privacy settings opens it to view/change, focus on the heading', () => {
  const s = site({ scope: 'settings', stored: { v: 1, choice: 'yes', at: NOW - DAY } });
  s.advance(10000);
  assert.equal(s.open(), false); assert.equal(s.gaScripts().length, 0); assert.equal(s.win[OFF], true);
  s.footBtn.focus(); s.footBtn.fire('click');
  assert.equal(s.open(), true);
  assert.equal(s.doc.activeElement.id, 'statcheck-h');
  assert.match(s.box().textContent, /Current choice: allowed/);
  assert.match(s.box().textContent, /loads no statistics and no ads/);
  s.click('no');
  assert.equal(JSON.parse(s.store.get(KEY)).choice, 'no');
  assert.equal(s.gaScripts().length, 0);
  assert.equal(s.doc.activeElement, s.footBtn, 'focus returns to the button');
});
test('a live region announces the window and the choice; the × is U+00D7', () => {
  const s = site();
  s.advance(3000);
  const live = s.doc.body.all((n) => n.id === 'statcheck-live')[0];
  assert.equal(live.getAttribute('aria-live'), 'polite');
  s.advance(100); assert.match(live.textContent, /question about visit statistics/);
  s.click('no'); s.advance(100); assert.match(live.textContent, /declined/);
  const x = s.box().all((n) => n.className === 'statcheck-x')[0];
  assert.equal(x.textContent, '×');
});
test('Allow and Decline are the same kind of button', () => {
  const s = site(); s.advance(3000);
  const a = s.box().all((n) => n.getAttribute('data-stat') === 'yes')[0], d = s.box().all((n) => n.getAttribute('data-stat') === 'no')[0];
  assert.equal(a.className, d.className);
  assert.equal(a.parentNode, d.parentNode);
  const css = fs.readFileSync(path.join(__dirname, '..', 'src', 'assets', 'css', 'ppg.css'), 'utf8');
  assert.match(css, /\.statcheck \.statcheck-btn\{min-height:44px/);
  assert.match(css, /@media print\{\.statcheck\{display:none!important\}/);
  assert.match(css, /\.statcheck\{position:fixed/);
});

/* ---------- review 5 Nov 2026 (DeepSeek, confirmed): U.S. opt-out, erasing on every switch to "off", repeated Google "no" ---------- */
function withGpp(s) {
  let gpp = null;
  s.win.__gpp = (cmd, cb) => { if (cmd === 'addEventListener') gpp = cb; };
  s.win.googlefc.callbackQueue.forEach((c) => c && c.CONSENT_API_READY && c.CONSENT_API_READY());
  return (out) => gpp({ pingData: { signalStatus: 'ready', parsedSections: { usnat: { SaleOptOut: out ? 1 : 2 } } } }, true);
}
test('U.S. opt-out known: no window by itself, no "yes" stored, Privacy settings only explains', () => {
  const s = site({ tcf: 'stub', tc: HIDDEN });
  const gpp = withGpp(s); gpp(true);
  s.advance(5000);
  assert.equal(s.open(), false);
  s.footBtn.fire('click');
  assert.equal(s.open(), true);
  assert.match(s.box().textContent, /opted out under a U\.S\. state privacy law/);
  assert.equal(s.box().all((n) => n.getAttribute('data-stat') === 'yes')[0].parentNode.hidden, true);
  // even a forced "yes" is not stored and nothing is announced as allowed
  s.win.PPGStats && s.click('yes');
  assert.equal(s.store.has(KEY), false);
  assert.equal(s.win[OFF], true);
  assert.equal(s.gaScripts().length, 0);
  s.advance(100);
  assert.doesNotMatch(s.doc.body.all((n) => n.id === 'statcheck-live')[0].textContent, /allowed/);
});
test('stored "yes" + U.S. opt-out: GA off and _ga deleted', () => {
  const s = site({ tcf: 'stub', tc: HIDDEN, stored: { v: 1, choice: 'yes', at: NOW - DAY }, cookies: ['_ga=GA1.1.5', '_ga_T00HRG2YVF=x'] });
  const gpp = withGpp(s);
  s.advance(3000);
  assert.equal(s.win[OFF], false);
  s.jar(); gpp(true);
  assert.equal(s.win[OFF], true);
  assert.deepEqual(s.jar(), []);
});
test('GPC: _ga deleted at start', () => {
  const s = site({ tcf: 'stub', tc: HIDDEN, gpc: true, cookies: ['_ga=GA1.1.5'] });
  assert.deepEqual(s.jar(), []);
  s.advance(3000); assert.deepEqual(s.jar(), []);
});
test('every switch to "off" via the window deletes _ga again (allow, decline, allow, decline)', () => {
  const s = site({ tcf: 'stub', tc: HIDDEN });
  s.advance(3000);
  const setGa = () => { s.doc.cookie = '_ga=GA1.1.9'; };
  s.click('yes'); setGa();
  s.footBtn.fire('click'); s.click('no'); assert.deepEqual(s.jar(), []);
  s.footBtn.fire('click'); s.click('yes'); setGa();
  s.footBtn.fire('click'); s.click('no'); assert.deepEqual(s.jar(), []);
});
test('second Google "no" after a later Google grant deletes _ga again', () => {
  const values = { analyticsStoragePurposeConsentStatus: 1, adStoragePurposeConsentStatus: 2, adUserDataPurposeConsentStatus: 2, adPersonalizationPurposeConsentStatus: 2 };
  const no = { gdprApplies: true, eventStatus: 'useractioncomplete', tcString: 'CQ1', purpose: { consents: {} }, vendor: { consents: {} } };
  const yes = { gdprApplies: true, eventStatus: 'useractioncomplete', tcString: 'CQ2', purpose: { consents: { 1: true } }, vendor: { consents: { 755: true } } };
  const s = site({ tcf: 'stub', tc: no, cookies: ['_ga=GA1.1.5'] });
  s.win.googlefc.getGoogleConsentModeValues = () => values;
  assert.deepEqual(s.jar(), []);
  s.emit(yes);
  assert.equal(s.win[OFF], false);
  s.doc.cookie = '_ga=GA1.1.6';
  s.emit(no);
  assert.equal(s.win[OFF], true);
  assert.deepEqual(s.jar(), []);
});

/* ---------- pages without ads: Google's choices on request; U.S. opt-out while the window is open ---------- */
test('page without ads: button loads only the Funding Choices script, opens Google choices; decision wins, GA stays off', () => {
  const s = site({ scope: 'settings', stored: { v: 1, choice: 'yes', at: NOW - DAY } });
  s.win.PPG_NO_GOOGLE = false;
  s.advance(5000);
  assert.equal(s.scripts.length, 0, 'nothing from Google before the click');
  s.footBtn.fire('click');
  const g = s.box().all((n) => n.getAttribute('data-stat-google') !== null)[0];
  assert.ok(g && !g.parentNode.hidden);
  assert.match(g.textContent, /Google’s ad & U\.S\. privacy choices/);
  g.fire('click');
  assert.equal(s.open(), false);
  assert.deepEqual(s.scripts.map((x) => x.src), ['https://fundingchoicesmessages.google.com/i/pub-7811071715414905?ers=1']);
  assert.ok(!s.scripts.some((x) => /adsbygoogle/.test(x.src)));
  // the CMP arrives: revocation message, then a decision with analytics granted
  let revoked = 0, tcCb = null;
  s.win.__tcfapi = (cmd, v, cb) => { if (cmd === 'addEventListener') tcCb = cb; };
  s.win.googlefc.showRevocationMessage = () => { revoked++; };
  s.win.googlefc.getGoogleConsentModeValues = () => ({ analyticsStoragePurposeConsentStatus: 1, adStoragePurposeConsentStatus: 1, adUserDataPurposeConsentStatus: 1, adPersonalizationPurposeConsentStatus: 1 });
  s.win.googlefc.callbackQueue.forEach((c) => { if (typeof c === 'function') c(); else if (c && c.CONSENT_API_READY) c.CONSENT_API_READY(); });
  assert.equal(revoked, 1);
  tcCb({ gdprApplies: true, eventStatus: 'useractioncomplete', tcString: 'CQ', purpose: { consents: { 1: true } }, vendor: { consents: { 755: true } } }, true);
  assert.equal(s.store.has(KEY), false, 'window choice deleted: Google wins');
  assert.equal(s.win[OFF], true);
  assert.equal(s.gaScripts().length, 0);
  assert.ok(!s.scripts.some((x) => /adsbygoogle/.test(x.src)));
});
test('guide pages: the Google-choices button is not shown in the window', () => {
  const s = site(); s.advance(3000);
  const g = s.box().all((n) => n.getAttribute('data-stat-google') !== null)[0];
  assert.equal(g.parentNode.hidden, true);
});
test('U.S. opt-out arriving while the window is open switches it to the notice (no Allow/Decline)', () => {
  const s = site({ tcf: 'stub', tc: HIDDEN });
  const gpp = withGpp(s);
  s.advance(3000);
  assert.equal(s.open(), true);
  const yes = s.box().all((n) => n.getAttribute('data-stat') === 'yes')[0];
  yes.focus();
  gpp(true);
  assert.equal(s.open(), true);
  assert.equal(yes.parentNode.hidden, true);
  assert.match(s.box().textContent, /opted out under a U\.S\. state privacy law/);
  assert.equal(s.doc.activeElement.id, 'statcheck-h', 'focus moved off the hidden button');
});
