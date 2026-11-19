// Browser checks with Playwright over every sitemap page at 390 and 1366 px:
// JS errors, horizontal overflow, working tools, ad containers (forced visible) ≥150 px from controls,
// and the first screen at 1366×768 and 390×844 (position and size of the guide slots, no ad above a tool).
// Usage: node tests/browser.mjs [screenshot-dir]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = path.join(ROOT, 'docs');
const SHOTS = process.argv[2] || null;
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain' };
const srv = http.createServer((q, s) => {
  let p = decodeURIComponent(q.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(DOCS, p);
  if (!f.startsWith(DOCS) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { s.writeHead(404, { 'content-type': TYPES['.html'] }); s.end(fs.readFileSync(path.join(DOCS, '404.html'))); return; }
  s.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
  s.end(fs.readFileSync(f));
}).listen(0);
const base = `http://127.0.0.1:${srv.address().port}`;
const urls = [...fs.readFileSync(path.join(DOCS, 'sitemap.xml'), 'utf8').matchAll(/<loc>https:\/\/patchplayguide\.com([^<]*)<\/loc>/g)].map((m) => m[1]);

// stats.test maps to this local server but is not a local host name (for the ?stats_test=1 check)
const browser = await chromium.launch({ args: ['--host-resolver-rules=MAP stats.test 127.0.0.1'] });
let fails = 0, minAd = Infinity, minAdWhere = '';
const bad = (msg) => { fails++; console.log('✗ ' + msg); };

// every request to a Google domain is recorded – on localhost, 127.0.0.1 and with ?stats_test=1 there must be none
const GOOGLE = /^https?:\/\/([^/]*\.)?(google|googlesyndication|googletagmanager|googleadservices|doubleclick|gstatic|google-analytics)\.[a-z.]+\//;
const googleRequests = [];
const local404 = [];
async function newCtx(width, scheme = 'light') {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: scheme });
  ctx.on('request', (r) => { if (GOOGLE.test(r.url())) googleRequests.push(r.url()); });
  // every local resource must exist: a 404 from the local server is a broken link or asset
  ctx.on('response', (r) => { if (r.status() === 404 && /^https?:\/\/(127\.0\.0\.1|localhost|stats\.test)[:/]/.test(r.url())) local404.push(r.url()); });
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1|localhost|stats\.test)/, (r) => r.abort());
  return ctx;
}
function watch(page, errs) {
  page.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/net::ERR_FAILED|Failed to load resource/.test(m.text())) errs.push('console: ' + m.text()); });
}

for (const width of [390, 1366]) {
  const ctx = await newCtx(width);
  for (const u of urls) {
    const page = await ctx.newPage();
    const errs = [];
    watch(page, errs);
    await page.goto(base + u, { waitUntil: 'load' });
    await page.waitForTimeout(150);
    const info = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      results: (document.querySelector('.results') || {}).innerText || null,
      // slot IDs are set; on localhost nothing is filled, so no ad box (label, rule, margin) may take any room
      visibleAds: [...document.querySelectorAll('.ad:not([hidden])')].filter((a) => !a.querySelector('ins.adsbygoogle[data-ad-status]') && (((a.querySelector('.ad-label') || {}).offsetHeight > 0) || parseFloat(getComputedStyle(a).marginTop) > 0 || parseFloat(getComputedStyle(a).marginBottom) > 0 || parseFloat(getComputedStyle(a).borderTopWidth) > 0)).length
    }));
    if (info.overflow > 1) errs.push('horizontal overflow ' + info.overflow + 'px');
    if (info.visibleAds) errs.push('ad label, rule or margin visible without a delivered ad');
    if (/^\/(tools|reference)\/[^/]+\/$/.test(u) && !(info.results && info.results.length > 40)) errs.push('tool shows no result');
    // force ad boxes visible at a realistic size and measure distance to controls and footer
    const dist = await page.evaluate(() => {
      const ads = [...document.querySelectorAll('.ad')];
      ads.forEach((a) => {
        a.hidden = false;
        let ins = a.querySelector('ins.adsbygoogle');
        if (!ins) { ins = document.createElement('ins'); ins.className = 'adsbygoogle'; a.appendChild(ins); }
        // slots with an exact size (.ppg_top, .ppg_side) are measured at that size, responsive ones at 250 px
        if (!/ppg_/.test(ins.className)) a.style.minHeight = a.dataset.slot === 'side' ? '600px' : '250px';
        ins.setAttribute('data-ad-status', 'filled');   // measure as if Google had delivered an ad
      });
      const vis = ads.filter((a) => { const r = a.getBoundingClientRect(); return r.width > 0 && r.height > 0; });
      const controls = [...document.querySelectorAll('button, input, select, textarea, summary, [role="button"], .tool, a.btn, .foot')]
        .filter((c) => { const r = c.getBoundingClientRect(); return r.width > 0 && r.height > 0 && !c.closest('.ad'); });
      let min = Infinity, what = '';
      for (const a of vis) {
        const A = a.getBoundingClientRect();
        for (const c of controls) {
          const B = c.getBoundingClientRect();
          const dx = Math.max(0, B.left - A.right, A.left - B.right);
          const dy = Math.max(0, B.top - A.bottom, A.top - B.bottom);
          const d = Math.hypot(dx, dy);
          if (d < min) { min = d; what = a.dataset.slot + ' ↔ ' + (c.id || c.className || c.tagName); }
        }
      }
      return { count: vis.length, min, what };
    });
    if (dist.count) {
      if (dist.min < minAd) { minAd = dist.min; minAdWhere = `${width}px ${u} (${dist.what})`; }
      if (dist.min < 150) errs.push(`ad ${dist.what} only ${Math.round(dist.min)}px from a control`);
    }
    if (errs.length) bad(`${width}px ${u}\n   ${errs.join('\n   ')}`);
    await page.close();
  }
  await ctx.close();
}
console.log(`Checked ${urls.length} pages at 390 and 1366 px. Minimum ad-to-control distance: ${Math.round(minAd)}px at ${minAdWhere}`);

// ---- ad boxes: no status → ins visible, no label/rule/margin; "unfilled" → ins display:none; "filled"/"unfill-optimized" → label and rule ----
for (const width of [390, 1366]) {
  const ctx = await newCtx(width);
  for (const u of ['/guides/how-to-test-a-settings-change/', '/tools/settings-translator/']) {
    const page = await ctx.newPage();
    const errs = []; watch(page, errs);
    await page.goto(base + u, { waitUntil: 'load' });
    // AdSense help 10762946: the ins is never hidden or clipped before Google answers; only label, rule and margin wait.
    const r = await page.evaluate(async (fb) => {
      const tick = () => new Promise((ok) => setTimeout(ok, 0));   // MutationObserver reports asynchronously
      const ins = [...document.querySelectorAll('.ad:not([hidden]) ins.adsbygoogle')];
      const state = () => ins.map((i) => {
        const b = i.closest('.ad'), cb = getComputedStyle(b), ci = getComputedStyle(i), ri = i.getBoundingClientRect(), lab = b.querySelector('.ad-label');
        return { slot: b.dataset.slot, display: ci.display, vis: ci.visibility, w: ri.width, insH: ri.height, boxH: b.getBoundingClientRect().height,
          overflow: cb.overflowX + '/' + cb.overflowY, boxVis: cb.visibility, label: !!lab && lab.offsetHeight > 0,
          mt: parseFloat(cb.marginTop), mb: parseFloat(cb.marginBottom), bt: parseFloat(cb.borderTopWidth), cls: b.classList.contains(fb.box) };
      });
      const set = async (v) => { ins.forEach((i) => (v ? i.setAttribute('data-ad-status', v) : i.removeAttribute('data-ad-status'))); await tick(); };
      const out = { n: ins.length, none: state() };
      await set('unfilled'); out.unfilled = state();
      await set('filled'); out.filled = state();
      await set('unfill-optimized'); out.optimized = state();
      // browser without :has(): drop the :has() rules and force the fallback class on <html>
      for (const sh of document.styleSheets) { try { for (let k = sh.cssRules.length - 1; k >= 0; k--) if (sh.cssRules[k].cssText.includes(':has(')) sh.deleteRule(k); } catch (e) {} }
      document.documentElement.classList.add(fb.root);
      await set(null); out.fbNone = state();
      await set('unfilled'); out.fbUnfilled = state();
      await set('unfill-optimized'); out.fbOptimized = state();
      return out;
    }, { root: 'ad-nohas', box: 'ad-shown' });
    const kept = (l) => l.every((x) => x.display !== 'none' && x.vis === 'visible' && x.boxVis === 'visible' && x.w > 0 && x.overflow === 'visible/visible' && x.boxH >= x.insH - 0.5);
    const bare = (l) => l.every((x) => !x.label && !x.mt && !x.mb && !x.bt && !x.cls);
    const shown = (l) => l.every((x) => x.label && x.boxH > 0 && x.cls && (x.bt === 1));
    const gone = (l) => l.every((x) => x.display === 'none' && !x.label && x.boxH === 0);
    if (!r.n) errs.push('no ad box filled in');
    if (!kept(r.none) || !bare(r.none)) errs.push('without status the ins must stay visible and unclipped, label/rule/margin hidden: ' + JSON.stringify(r.none));
    if (!gone(r.unfilled)) errs.push('unfilled: ins must be display:none, no label: ' + JSON.stringify(r.unfilled));
    if (!shown(r.filled)) errs.push('filled: box with label, rule and margin expected: ' + JSON.stringify(r.filled));
    if (!shown(r.optimized)) errs.push('unfill-optimized: box with label, rule and margin expected: ' + JSON.stringify(r.optimized));
    if (!kept(r.fbNone) || !bare(r.fbNone) || !gone(r.fbUnfilled) || !shown(r.fbOptimized)) errs.push('fallback without :has() differs: ' + JSON.stringify([r.fbNone, r.fbUnfilled, r.fbOptimized]));
    if (errs.length) bad(`ad boxes ${width}px ${u}\n   ${errs.join('\n   ')}`);
    await page.close();
  }
  await ctx.close();
}
console.log('Ad boxes: ins never hidden; label and rule only with filled/unfill-optimized; unfilled → display:none.');

// ---- interactive checks ----
{
  const ctx = await newCtx(390);
  const page = await ctx.newPage();
  const errs = []; watch(page, errs);

  // Patch Decoder: example, filters, pasted notes, export
  await page.goto(base + '/tools/patch-decoder/');
  const exampleCount = await page.locator('#dec-list li').count();
  await page.selectOption('#dec-plat', 'switch2');
  const sw = await page.locator('#dec-list li').count();
  await page.selectOption('#dec-plat', 'all');
  await page.check('input[name="dec-mode"][value="paste"]');
  await page.fill('#dec-input', '+ Added a frame rate cap option\nFixed a crash when changing resolution on PC\nShader cache is rebuilt after this update\nRemoved the low texture preset on Xbox Series S\nKnown issue: stutter on Steam Deck in the hub\nHarpoon damage adjusted');
  await page.click('#dec-sort');
  const pasted = await page.locator('#dec-list li').count();
  const minus = await page.locator('#dec-list li.d-minus').count();
  await page.click('#dec-checks input >> nth=0');
  await page.click('#dec-copy');
  const exported = await page.inputValue('#dec-export');
  if (exampleCount !== 14 || sw < 1 || sw >= exampleCount) bad(`decoder example/filter: ${exampleCount} items, ${sw} for Switch 2`);
  else console.log(`✓ decoder example: ${exampleCount} items, ${sw} shown for Switch 2`);
  if (pasted !== 6 || minus !== 2 || !/\[x\]/.test(exported)) bad(`decoder paste: ${pasted} items, ${minus} minus, export ok=${/\[x\]/.test(exported)}`);
  else console.log(`✓ decoder paste: 6 lines sorted, 2 removals/issues, checklist exported (${exported.split('\n').length} lines)`);
  await page.reload();
  if ((await page.inputValue('#dec-input')).indexOf('frame rate cap') === -1) bad('decoder text not restored from localStorage');
  else console.log('✓ decoder restores pasted text after reload');

  // stale export: sort a PC line, then type an Xbox line without sorting -> export must show the new text
  await page.fill('#dec-input', 'Fixed crash PC');
  await page.click('#dec-sort');
  await page.fill('#dec-input', 'Removed textures Xbox');
  const staleShown = await page.isVisible('#dec-stale');
  await page.click('#dec-copy');
  const ex2 = await page.inputValue('#dec-export');
  const list2 = await page.textContent('#dec-list');
  if (!staleShown || !/Removed textures Xbox/.test(ex2) || /Fixed crash PC/.test(ex2) || !/Removed textures Xbox/.test(list2) || await page.isVisible('#dec-stale')) bad(`decoder stale export: hint=${staleShown}, export=${ex2.split('\n').slice(0, 4).join(' / ')}`);
  else console.log('✓ decoder: changed text shows a hint and is re-sorted before export');
  await page.fill('#dec-input', 'Fixed crash PC');
  await page.click('#dec-sort');
  await page.fill('#dec-input', 'Removed textures Xbox');
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#dec-download')]);
  const dlText = fs.readFileSync(await dl.path(), 'utf8');
  if (!/Removed textures Xbox/.test(dlText) || /Fixed crash PC/.test(dlText)) bad('decoder download exported the old result');
  else console.log('✓ decoder: download also uses the current text');

  // 301 lines: 300 sorted, visible notice for 1 skipped line, same in the export
  await page.fill('#dec-input', Array.from({ length: 301 }, (_, i) => `Fixed crash number ${i + 1} on PC`).join('\n'));
  await page.click('#dec-sort');
  const sum301 = await page.textContent('#dec-summary');
  const lim = (await page.isVisible('#dec-limit')) ? await page.textContent('#dec-limit') : '';
  await page.click('#dec-copy');
  const ex301 = await page.inputValue('#dec-export');
  if (!/^300 of 300/.test(sum301) || !/^1 line beyond the limit was not sorted/.test(lim) || !/NOTE: 1 line beyond the limit was not sorted/.test(ex301)) bad(`decoder limit: summary=${sum301} notice=${lim}`);
  else console.log(`✓ decoder limit: ${sum301.split(' · ')[0]}; notice “${lim.slice(0, 45)}…” on screen and in export`);
  await page.fill('#dec-input', ''); await page.click('#dec-clear');
  if (await page.isVisible('#dec-limit')) bad('decoder limit notice stays after clearing');

  // broken local data must not break the tools (PP06)
  await page.evaluate(() => { localStorage.setItem('ppg-setup', '{"platform":"constructor","vram":"<img src=x onerror=window.__x=1>"}'); localStorage.setItem('ppg-decoder-done', '42'); localStorage.setItem('ppg-translator-bottleneck', '"]x'); });
  for (const u of ['/tools/patch-decoder/', '/tools/settings-translator/', '/guides/graphics-settings-explained/', '/']) {
    await page.goto(base + u); await page.waitForTimeout(100);
    if (u === '/tools/patch-decoder/') await page.click('#dec-checks input >> nth=0');
  }
  await page.evaluate(() => { localStorage.setItem('ppg-setup', '{"platform":"pc","gpu":"high","vram":"<img src=x onerror=window.__x=1>"}'); });
  await page.goto(base + '/guides/graphics-settings-explained/'); await page.waitForTimeout(100);
  const injected = await page.evaluate(() => !!window.__x || !!document.querySelector('#setup-note img'));
  if (injected) bad('setup note rendered stored HTML');
  else console.log('✓ invalid stored setup/decoder/translator data is ignored without errors');
  await page.evaluate(() => localStorage.clear());

  // Settings Translator
  await page.goto(base + '/tools/settings-translator/');
  await page.check('input[name="tr-b"][value="cpu"]');
  const hotCpu = await page.locator('.opt.hot h3').allTextContents();
  await page.check('input[name="tr-b"][value="vram"]');
  const firstVram = await page.locator('#tr-first li').first().textContent();
  await page.fill('#tr-q', 'shadow');
  const shadow = await page.locator('.opt').count();
  if (!hotCpu.length || !/crowd|distance/i.test(hotCpu.join()) || !/Texture/.test(firstVram) || shadow < 1) bad(`translator: cpu=${hotCpu}, vram first=${firstVram}, shadow=${shadow}`);
  else console.log(`✓ translator: CPU lower-first = ${hotCpu.join(' | ')}; VRAM first = ${firstVram}; search “shadow” → ${shadow}`);

  // Bottleneck Finder (keyboard)
  await page.goto(base + '/tools/bottleneck-finder/');
  for (let i = 0; i < 3; i++) { await page.locator('#fd-stage button.answer').first().focus(); await page.keyboard.press('Enter'); }
  const res = await page.textContent('#fd-stage h3');
  await page.click('#fd-back');
  const backQ = await page.textContent('#fd-stage h3');
  if (!/GPU-bound/.test(res) || !/render resolution/i.test(backQ)) bad(`finder: ${res} / ${backQ}`);
  else console.log(`✓ finder via keyboard: “${res}”, Back returns to “${backQ.slice(0, 50)}…”`);
  await page.click('#fd-restart');
  await page.locator('#fd-stage button.answer').nth(1).click();
  await page.locator('#fd-stage button.answer').nth(0).click();
  console.log('✓ finder stutter path: ' + await page.textContent('#fd-stage h3'));

  // My setup → guide note and home highlight
  await page.goto(base + '/');
  await page.selectOption('#setup-form select[name="platform"]', 'ps5');
  await page.click('#setup-form button[type="submit"]');
  const recs = await page.locator('.card.rec').count();
  await page.goto(base + '/guides/graphics-settings-explained/');
  const note = await page.textContent('#setup-note');
  if (!/PS5/.test(note || '') || recs < 1) bad('setup note/highlight missing'); else console.log(`✓ My setup: ${recs} home cards highlighted; guide note: ${note.trim().slice(0, 80)}…`);

  // ---- tools added on 2026-11-18, clicked through at phone and desktop width ----
  for (const w of [390, 1366]) {
    await page.setViewportSize({ width: w, height: 900 });
    const over = async (what) => { const o = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth); if (o > 1) bad(`${w}px ${what}: horizontal overflow ${o}px`); };
    const ok = (cond, good, fail) => { if (cond) console.log(`✓ ${w}px ${good}`); else bad(`${w}px ${fail}`); };

    // Upscaler Resolution Calculator: link state, example chip, custom input, bad input, keyboard, copy link
    await page.goto(base + '/tools/upscaler-resolution-calculator/?out=3840x2160&up=dlss');
    const rc1 = await page.locator('#rc-table tbody tr').allInnerTexts();
    await page.click('#rescalc button.chip >> nth=2');
    const rc2 = await page.locator('#rc-table tbody tr').count(), rcLow = await page.locator('#rc-table tr.low').count();
    await page.selectOption('#rc-out', 'custom'); await page.fill('#rc-custom', '2560 x 1080');
    const rcSum = await page.textContent('#rc-summary');
    await page.fill('#rc-custom', '<b>abc');
    const rcBad = await page.textContent('#rc-summary'), rcEmpty = await page.locator('#rc-table tbody tr').count();
    await page.fill('#rc-custom', '3440x1440');
    await page.locator('input[name="rc-fam"][value="xess"]').focus(); await page.keyboard.press('ArrowRight');
    const rcKey = await page.locator('input[name="rc-fam"]:checked').getAttribute('value');
    await page.locator('input[name="rc-fam"][value="scale"]').check(); await page.locator('#rc-scale').fill('50');
    const rcScale = await page.textContent('#rc-table tbody tr');
    await page.click('#rc-link');
    await page.waitForFunction(() => document.getElementById('rc-msg').textContent.length > 0);
    await over('resolution calculator');
    ok(rc1.length === 5 && /2560×1440/.test(rc1[1]) && /1920×1080/.test(rc1[3]) && rc2 === 7 && rcLow === 4 && /2560×1080/.test(rcSum) && /width × height/.test(rcBad) && rcEmpty === 0 && rcKey === 'xessold' && /1720×720/.test(rcScale) && /up=scale/.test(page.url()) && /scale=50/.test(page.url()),
      'resolution calculator: 4K DLSS = 5 presets (Quality 2560×1440), XeSS example at 1080p marks 4 presets below 720 lines, custom and bad input handled, keyboard and slider work, link carries the state',
      `resolution calculator: ${rc1.length} rows, xess ${rc2}/${rcLow} low, sum=${rcSum}, bad=${rcBad}/${rcEmpty}, key=${rcKey}, scale=${rcScale}, url=${page.url()}`);

    // Frame Time Calculator: uneven/even pacing, VRR window, frame generation, comparison, empty input
    await page.goto(base + '/tools/frame-time-calculator/?fps=40&hz=60');
    const ft1 = await page.innerText('#ft-out');
    await page.fill('#ft-hz', '120');
    const ft2 = await page.innerText('#ft-out');
    await page.fill('#ft-min', '48'); await page.fill('#ft-max', '120');
    const ft3 = await page.innerText('#ft-out');
    await page.selectOption('#ft-fg', '4'); await page.fill('#ft-vs', '60');
    const ft4 = await page.innerText('#ft-out');
    await page.fill('#ft-fps', '');
    const ft5 = await page.textContent('#ft-summary');
    await page.click('#ftcalc button.chip >> nth=3');
    const ft6 = await page.innerText('#ft-out');
    await over('frame time calculator');
    ok(/Uneven pacing/.test(ft1) && /16\.67 ms or 33\.33 ms/.test(ft1) && /Even pacing/.test(ft2) && /exactly 3 refreshes/.test(ft2) && /whole multiple fits/.test(ft3) && /80 Hz/.test(ft3) && /160 fps on screen/.test(ft4) && /8\.33 ms less per frame/.test(ft4) && /Enter a frame rate/.test(ft5) && /140 fps on screen/.test(ft6) && /fg=2/.test(page.url()),
      'frame time calculator: 40 fps is uneven on 60 Hz and even on 120 Hz, fits a 48–120 Hz window doubled, 4× generation and comparison shown, empty input explained',
      `frame time calculator: ${[ft1, ft2, ft3, ft4, ft5, ft6].map((t) => t.replace(/\s+/g, ' ').slice(0, 70)).join(' | ')}`);

    // Settings Test Log: example, verdict flips on overlap, restore after reload, link, hostile input, CSV, clear
    await page.goto(base + '/tools/settings-test-log/');
    await page.click('#tl-example');
    const tl1 = await page.innerText('#tl-out'), demo = await page.isVisible('#tl-demo');
    await page.fill('#tl-a', '71 75 72');
    const tl2 = await page.innerText('#tl-out'), demo2 = await page.isVisible('#tl-demo');
    await page.fill('#tl-na', '<img src=x onerror="window.__x=1">');
    await page.reload();
    const tl3 = await page.inputValue('#tl-a'), tlName = await page.innerHTML('#tl-out');
    const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#tl-csv')]);
    const csv = fs.readFileSync(await dl.path(), 'utf8');
    await page.click('#tl-clear');
    const tl4 = await page.innerText('#tl-out');
    await page.goto(base + '/tools/settings-test-log/?a=60,61,62,63,64&b=70%2071%2072%2073%2074&nb=%3Cscript%3Ewindow.__x%3D1%3C%2Fscript%3E');
    const tl5 = await page.innerText('#tl-out');
    const xss = await page.evaluate(() => window.__x);
    await page.click('#tl-clear');
    await over('test log');
    ok(/every run of setup B is faster/.test(tl1) && /1 of 10 cases/.test(tl1) && demo && /No clear difference/.test(tl2) && !demo2 && tl3 === '71 75 72' && !/<img/.test(tlName) && /"average fps",1,71/.test(csv) && /Type the average FPS/.test(tl4) && /1 of 126 cases/.test(tl5) && xss === undefined,
      'test log: invented example is labeled and gives “clear” (1 in 10), overlap gives “no clear difference”, entries survive a reload, 5+5 runs from a link give 1 in 126, hostile input stays text, CSV exported',
      `test log: ${[tl1, tl2, tl4, tl5].map((t) => t.replace(/\s+/g, ' ').slice(0, 80)).join(' | ')} demo=${demo}/${demo2} restored=${tl3} xss=${xss}`);
    // blank worksheet: in print mode only the worksheet stays visible
    await page.goto(base + '/tools/settings-test-log/');
    await page.emulateMedia({ media: 'print' });
    await page.evaluate(() => document.documentElement.classList.add('print-sheet'));
    const sheet = await page.evaluate(() => ({ ws: getComputedStyle(document.querySelector('.worksheet')).visibility, tool: getComputedStyle(document.querySelector('#testlog')).visibility, cells: document.querySelectorAll('.worksheet td').length }));
    await page.emulateMedia({ media: 'screen' });
    ok(sheet.ws === 'visible' && sheet.tool === 'hidden' && sheet.cells === 32, 'test log: “Print blank worksheet” prints only the worksheet (32 empty cells)', `worksheet print: ${JSON.stringify(sheet)}`);

    // Setting-name map: link state, filters, chips, no match, reset, CSV of the shown rows
    await page.goto(base + '/reference/setting-names/?q=balanced');
    const total = await page.locator('#nm-list > li').count();
    const nm1 = await page.locator('#nm-list > li:visible').count();
    await page.selectOption('#nm-ven', 'intel');
    const nm2 = await page.locator('#nm-list > li:visible').allInnerTexts();
    await page.click('#nm-reset');
    const nm3 = await page.locator('#nm-list > li:visible').count();
    await page.fill('#nm-q', 'zzzz');
    const none = await page.isVisible('#nm-none');
    await page.click('#names button.chip >> nth=4');
    const nm4 = await page.locator('#nm-list > li:visible').count();
    const [dl2] = await Promise.all([page.waitForEvent('download'), page.click('#nm-csv')]);
    const csv2 = fs.readFileSync(await dl2.path(), 'utf8').trim().split('\n');
    await page.goto(base + '/reference/setting-names/?cat=vrr&on=ps5');
    const nm5 = await page.locator('#nm-list > li:visible').count();
    const srcOk = await page.evaluate(() => [...document.querySelectorAll('.nm-s a')].every((a) => document.getElementById(a.getAttribute('href').slice(1))));
    await over('name map');
    ok(total >= 60 && nm1 === 4 && nm2.length === 2 && /2× per axis|2\.0× per axis/.test(nm2.join()) && nm3 === total && none && nm4 >= 5 && csv2.length === nm4 + 1 && /github\.com|amd\.com/.test(csv2[1]) && nm5 === 2 && srcOk,
      `name map: ${total} names; “balanced” → 4, Intel only → 2, reset → all, no-match hint, “latency” chip → ${nm4} with CSV, link ?cat=vrr&on=ps5 → 2, every source number resolves`,
      `name map: total=${total} balanced=${nm1} intel=${nm2.length} reset=${nm3} none=${none} chip=${nm4} csv=${csv2.length} ps5vrr=${nm5} src=${srcOk}`);

    // Bottleneck Finder: result from a link, new branches, deep links into the calculators, text export
    await page.goto(base + '/tools/bottleneck-finder/?path=6-0-1');
    const fd1 = await page.textContent('#fd-stage h3'), fdCalc = await page.locator('#fd-stage .glinks a[href^="/tools/frame-time-calculator/"]').count();
    await page.click('#fd-restart');
    await page.locator('#fd-stage button.answer').nth(7).click(); await page.locator('#fd-stage button.answer').nth(1).click();
    const fd2 = await page.textContent('#fd-stage h3'), fdUrl = page.url();
    const fdText = await page.evaluate(() => window.PPGFinder.resultText([7, 1]));
    const routes = await page.locator('.tree li').count();
    await page.goto(base + '/tools/bottleneck-finder/?path=99-1');
    const fd3 = await page.textContent('#fd-stage h3');
    await over('finder');
    ok(/below the VRR window/i.test(fd1) && fdCalc === 1 && /40 fps mode needs 120 Hz/.test(fd2) && /path=7-1/.test(fdUrl) && /What to do now:/.test(fdText) && routes >= 30 && /What do you notice most/.test(fd3),
      `finder: link ?path=6-0-1 opens “${fd1}”, console branch reaches “${fd2}”, tree with ${routes} lines on the page, invalid link falls back to the start`,
      `finder: ${fd1} / ${fd2} / ${fdUrl} / routes=${routes} / ${fd3}`);

    // Settings Translator from a link, Patch Decoder sample lines
    await page.goto(base + '/tools/settings-translator/?b=vram&q=texture');
    const trB = await page.locator('input[name="tr-b"]:checked').getAttribute('value'), trN = await page.locator('#tr-grid .opt').count();
    await page.click('#translator button.chip >> nth=4');
    const trAll = await page.locator('#tr-grid .opt').count();
    await page.goto(base + '/tools/patch-decoder/');
    await page.locator('input[name="dec-mode"][value="paste"]').check();
    await page.click('#dec-sample');
    await page.selectOption('#dec-plat', 'all');
    const decN = await page.locator('#dec-list > li').count(), decTxt = await page.innerText('#dec-list');
    await page.click('#dec-clear');
    await over('translator/decoder');
    ok(trB === 'vram' && trN >= 2 && trN < 25 && trAll === 25 && decN === 7 && /40 fps mode/.test(decTxt), `translator: link ?b=vram&q=texture → VRAM, ${trN} options, “show all” → 25; decoder: 7 invented sample lines sorted`, `translator ${trB}/${trN}/${trAll}, decoder ${decN}`);

    // Home: the quick start leads straight to a result; guides link into tools with a preloaded example
    await page.goto(base + '/');
    await page.selectOption('#qk-out', '3840x2160'); await page.selectOption('#qk-up', 'fsr');
    await Promise.all([page.waitForNavigation(), page.click('#quick button[type="submit"]')]);
    const qk = await page.locator('#rc-table tbody tr').count(), qkFam = await page.locator('input[name="rc-fam"]:checked').getAttribute('value');
    await page.goto(base + '/guides/how-to-test-a-settings-change/');
    await Promise.all([page.waitForNavigation(), page.click('aside.try a.btn')]);
    const tryOut = await page.innerText('#tl-out'), tryName = await page.inputValue('#tl-na');
    await page.click('#tl-clear');
    ok(qk === 5 && qkFam === 'fsr' && /every run of setup B is faster/.test(tryOut) && tryName === 'Shadows: High', 'home quick start opens the calculator with the chosen display and upscaler; the testing guide opens its example in the test log', `home quick start ${qk}/${qkFam}; try link: ${tryOut.slice(0, 80)} / ${tryName}`);
  }
  // merged guide: the old address is a redirect page to the testing guide
  const red = fs.readFileSync(path.join(DOCS, 'guides/after-update-retest-routine/index.html'), 'utf8');
  if (!/http-equiv="refresh" content="0; url=\/guides\/how-to-test-a-settings-change\/"/.test(red)) bad('redirect for the merged guide missing'); else console.log('✓ /guides/after-update-retest-routine/ redirects to the testing guide');

  if (errs.length) bad('interactive errors:\n   ' + errs.join('\n   '));
  await ctx.close();
}

// ---- first screen (1366×768 and 390×844), every sitemap page, ads measured as delivered ----
// Guides: the flat slot after the lede lies in the first screen below heading and lede (728×90 / 320×100), the sidebar
// slot (300×600, from 1200 px) starts in it; ads take a small share of that screen. Tool pages: the tool starts in the
// first screen and no ad is in it. Every other page has no ad box. Also: ≥150 px to controls, no overflow, small shift.
{
  const GUIDE = /^\/guides\/[^/]+\/$/, TOOL = /^\/(tools|reference)\/[^/]+\/$/;
  const worst = { share: 0, shift: 0, dist: Infinity, full: 0, guides: 0 };
  for (const [width, height] of [[1366, 768], [390, 844]]) {
    const ctx = await browser.newContext({ viewport: { width, height } });
    await ctx.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, (r) => r.abort());
    for (const u of urls) {
      const page = await ctx.newPage();
      const errs = []; watch(page, errs);
      await page.addInitScript(() => {
        window.__shift = 0;
        try { new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__shift += e.value; }).observe({ type: 'layout-shift', buffered: true }); } catch (e) { window.__shift = -1; }
      });
      await page.goto(base + u, { waitUntil: 'load' });
      await page.waitForTimeout(250);
      const m = await page.evaluate(async (vh) => {
        const before = window.__shift;
        const boxes = [...document.querySelectorAll('.ad')];
        const sized = [];
        for (const a of boxes) {
          const ins = a.querySelector('ins.adsbygoogle'); if (!ins) continue;
          const r0 = ins.getBoundingClientRect();
          sized.push({ slot: a.dataset.slot, cls: ins.className, fmt: ins.getAttribute('data-ad-format'), fw: ins.getAttribute('data-full-width-responsive'), w0: Math.round(r0.width), h0: Math.round(r0.height), display: getComputedStyle(ins).display });
          if (!/ppg_/.test(ins.className)) ins.style.height = '250px';   // responsive units: a 250 px ad
        }
        await new Promise((ok) => setTimeout(ok, 150));
        const base0 = window.__shift;
        boxes.forEach((a) => { const ins = a.querySelector('ins.adsbygoogle'); if (ins) ins.setAttribute('data-ad-status', 'filled'); });
        await new Promise((ok) => setTimeout(ok, 400));
        const rect = (e) => { const r = e.getBoundingClientRect(); return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, w: r.width, h: r.height }; };
        const ads = boxes.filter((a) => a.querySelector('ins.adsbygoogle') && a.getBoundingClientRect().height > 0).map((a) => ({ slot: a.dataset.slot, box: rect(a), ins: rect(a.querySelector('ins.adsbygoogle')) }));
        const controls = [...document.querySelectorAll('button, input, select, textarea, summary, [role="button"], .tool, a.btn, .foot, .main-nav a, .crumbs a')]
          .filter((c) => { const r = c.getBoundingClientRect(); return r.width > 0 && r.height > 0 && !c.closest('.ad'); });
        let dist = Infinity, what = '';
        for (const a of ads) for (const c of controls) {
          const A = a.box, B = c.getBoundingClientRect();
          const d = Math.hypot(Math.max(0, B.left - A.right, A.left - B.right), Math.max(0, B.top - A.bottom, A.top - B.bottom));
          if (d < dist) { dist = d; what = a.slot + ' ↔ ' + (c.id || c.className || c.tagName); }
        }
        let area = 0;
        for (const a of ads) area += Math.max(0, Math.min(a.ins.right, window.innerWidth) - Math.max(a.ins.left, 0)) * Math.max(0, Math.min(a.ins.bottom, vh) - Math.max(a.ins.top, 0));
        const q = (sel) => { const e = document.querySelector(sel); return e ? rect(e) : null; };
        return { sized, ads, dist, what, share: area / (window.innerWidth * vh), shift: window.__shift < 0 ? -1 : window.__shift - base0, loadShift: before,
          h1: q('h1'), lede: q('.lede'), tool: q('section.tool'), overflow: document.documentElement.scrollWidth - window.innerWidth, boxes: boxes.length };
      }, height);
      const slot = (n) => m.ads.find((a) => a.slot === n);
      if (m.overflow > 1) errs.push('horizontal overflow with delivered ads ' + m.overflow + 'px');
      if (!m.h1 || m.h1.top < 0 || m.h1.bottom > height) errs.push('heading not in the first screen');
      if (m.ads.length && m.dist < 150) errs.push(`ad ${m.what} only ${Math.round(m.dist)}px from a control or navigation link`);
      if (m.shift < 0) errs.push('layout-shift measurement not available');
      if (m.shift > 0.05) errs.push('layout shift when the ads arrive: ' + m.shift.toFixed(3));
      if (m.share > 0.2) errs.push('ads take ' + Math.round(m.share * 100) + '% of the first screen');
      if (GUIDE.test(u)) {
        const top = slot('lede'), side = slot('side'), want = width >= 850 ? [728, 90] : [320, 100];
        const s = m.sized.find((x) => x.slot === 'lede');
        if (!top || !s) errs.push('guide without the slot after the lede');
        else {
          if (!/\bppg_top\b/.test(s.cls) || s.fmt !== null || s.fw !== null) errs.push('sized slot must not carry data-ad-format / data-full-width-responsive');
          if (s.w0 !== want[0] || s.h0 !== want[1] || s.display === 'none') errs.push(`slot after the lede is ${s.w0}×${s.h0} before Google answers, expected ${want.join('×')}`);
          if (Math.round(top.ins.w) !== want[0] || Math.round(top.ins.h) !== want[1]) errs.push(`slot after the lede is ${Math.round(top.ins.w)}×${Math.round(top.ins.h)}`);
          if (top.ins.top >= height) errs.push('slot after the lede starts below the first screen: ' + Math.round(top.ins.top));
          if (width >= 850 && top.ins.bottom > height) errs.push('leaderboard not completely in the first screen: bottom ' + Math.round(top.ins.bottom));
          if (!m.lede || top.box.top < m.lede.bottom || m.lede.top < m.h1.bottom) errs.push('order heading → lede → ad broken');
          if (m.lede && m.lede.top > height * 0.6) errs.push('lede starts too low: ' + Math.round(m.lede.top));
          worst.guides++; if (top.ins.bottom <= height) worst.full++;
        }
        if (width >= 1200) {
          if (!side) errs.push('sidebar slot missing');
          else if (Math.round(side.ins.w) !== 300 || Math.round(side.ins.h) !== 600 || side.ins.top >= height) errs.push(`sidebar slot ${Math.round(side.ins.w)}×${Math.round(side.ins.h)} at ${Math.round(side.ins.top)}`);
        } else if (side) errs.push('sidebar slot below 1200 px');
      } else if (TOOL.test(u)) {
        if (!m.tool || m.tool.top >= height) errs.push('tool does not start in the first screen');
        if (m.share > 0) errs.push('ad in the first screen of a tool page');
        if (m.ads.some((a) => m.tool && a.box.top < m.tool.bottom)) errs.push('ad above or beside the tool');
      } else if (m.boxes) errs.push('ad box on a page that carries no advertising');
      if (m.ads.length) { worst.share = Math.max(worst.share, m.share); worst.shift = Math.max(worst.shift, m.shift); worst.dist = Math.min(worst.dist, m.dist); }
      if (errs.length) bad(`first screen ${width}×${height} ${u}\n   ${errs.join('\n   ')}`);
      await page.close();
    }
    await ctx.close();
  }
  console.log(`First screen checked on ${urls.length} pages at 1366×768 and 390×844: slot after the lede completely visible on ${worst.full} of ${worst.guides} guide views, largest ad share ${Math.round(worst.share * 100)}%, largest layout shift on delivery ${worst.shift.toFixed(3)}, nearest control ${Math.round(worst.dist)}px`);
}

// ---- screenshots ----
if (SHOTS) {
  fs.mkdirSync(SHOTS, { recursive: true });
  for (const [scheme, width] of [['light', 390], ['light', 1366], ['dark', 1366], ['dark', 390]]) {
    const ctx = await newCtx(width, scheme);
    const page = await ctx.newPage();
    for (const [name, u] of [['home', '/'], ['decoder', '/tools/patch-decoder/'], ['translator', '/tools/settings-translator/'], ['finder', '/tools/bottleneck-finder/'], ['guide', '/guides/dlss-vs-fsr-vs-xess/']]) {
      if (scheme === 'dark' && !['home', 'translator', 'guide'].includes(name)) continue;
      await page.goto(base + u);
      await page.waitForTimeout(200);
      await page.screenshot({ path: path.join(SHOTS, `${name}-${width}-${scheme}.png`), fullPage: false });
      if (scheme === 'light') await page.screenshot({ path: path.join(SHOTS, `${name}-${width}-full.png`), fullPage: true });
    }
    await ctx.close();
  }
  console.log('Screenshots in ' + SHOTS);
}

// ---- localhost and ?stats_test=1: no Google script, no Google request ----
{
  const ctx = await newCtx(1366);
  const page = await ctx.newPage();
  const port = srv.address().port;
  for (const u of [`http://localhost:${port}/`, `http://localhost:${port}/guides/dlss-vs-fsr-vs-xess/`, `http://localhost:${port}/privacy/`, `http://stats.test:${port}/?stats_test=1`, `http://stats.test:${port}/tools/patch-decoder/`]) {
    await page.goto(u, { waitUntil: 'load' }); await page.waitForTimeout(250);
    if (/privacy/.test(u)) { await page.click('main [data-privacy-settings]'); await page.waitForTimeout(150); }
    const flag = await page.evaluate(() => window.PPG_NO_GOOGLE);
    const tags = await page.$$eval('script[src]', (ss) => ss.map((x) => x.src).filter((x) => /google/.test(x)));
    if (flag !== true || tags.length) bad(`${u}: guard ${flag}, Google script tags ${tags.join(', ')}`);
  }
  await ctx.close();
}
if (local404.length) bad('local 404 responses: ' + [...new Set(local404)].slice(0, 5).join(', '));
else console.log('✓ no local 404 response');
if (googleRequests.length) bad('requests to Google domains: ' + [...new Set(googleRequests)].slice(0, 5).join(', '));
else console.log('✓ no request to any Google domain on localhost / 127.0.0.1 / ?stats_test=1');

await browser.close();
srv.close();
if (fails) { console.log(`\n${fails} browser problem(s).`); process.exit(1); }
console.log('All browser checks passed.');
