// Browser checks with Playwright over every sitemap page at 390 and 1366 px:
// JS errors, horizontal overflow, working tools, and ad containers (forced visible) ≥150 px from controls.
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
      visibleAds: [...document.querySelectorAll('.ad')].filter((a) => a.offsetHeight > 0 && !a.querySelector('ins.adsbygoogle[data-ad-status="filled"]')).length
    }));
    if (info.overflow > 1) errs.push('horizontal overflow ' + info.overflow + 'px');
    if (info.visibleAds) errs.push('empty ad box visible (no ad delivered)');
    if (u.startsWith('/tools/') && !(info.results && info.results.length > 40)) errs.push('tool shows no result');
    // force ad boxes visible at a realistic size and measure distance to controls and footer
    const dist = await page.evaluate(() => {
      const ads = [...document.querySelectorAll('.ad')];
      ads.forEach((a) => {
        a.hidden = false; a.style.minHeight = a.dataset.slot === 'side' ? '600px' : '250px';
        let ins = a.querySelector('ins.adsbygoogle');
        if (!ins) { ins = document.createElement('ins'); ins.className = 'adsbygoogle'; a.appendChild(ins); }
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

// ---- ad boxes without a delivered ad: collapsed; "unfilled" stays collapsed, "filled" shows label and rule ----
for (const width of [390, 1366]) {
  const ctx = await newCtx(width);
  for (const u of ['/guides/how-to-test-a-settings-change/', '/tools/settings-translator/']) {
    const page = await ctx.newPage();
    const errs = []; watch(page, errs);
    await page.goto(base + u, { waitUntil: 'load' });
    const r = await page.evaluate(async () => {
      const tick = () => new Promise((ok) => setTimeout(ok, 0));   // MutationObserver reports asynchronously
      const shown = () => [...document.querySelectorAll('.ad')].filter((a) => a.offsetHeight > 0 || parseFloat(getComputedStyle(a).marginTop) > 0).length;
      const ins = [...document.querySelectorAll('.ad:not([hidden]) ins.adsbygoogle')];
      const none = shown();
      ins.forEach((i) => i.setAttribute('data-ad-status', 'unfilled')); await tick();
      const unfilled = shown();
      ins.forEach((i) => i.setAttribute('data-ad-status', 'filled')); await tick();
      const boxes = ins.map((i) => i.parentElement);
      return { ins: ins.length, none, unfilled, filled: shown(),
        label: boxes.every((b) => b.querySelector('.ad-label').offsetHeight > 0),
        rule: boxes.every((b) => getComputedStyle(b).borderTopWidth === '1px'),
        cls: boxes.every((b) => b.classList.contains('ad-shown')) };
    });
    if (!r.ins) errs.push('no ad box filled in');
    if (r.none || r.unfilled) errs.push(`empty ad box visible (${r.none} without status, ${r.unfilled} unfilled)`);
    if (r.filled !== r.ins || !r.label || !r.rule || !r.cls) errs.push(`filled ad box not shown (${r.filled}/${r.ins}, label ${r.label}, rule ${r.rule}, class ${r.cls})`);
    if (errs.length) bad(`ad boxes ${width}px ${u}\n   ${errs.join('\n   ')}`);
    await page.close();
  }
  await ctx.close();
}
console.log('Ad boxes: nothing visible without a delivered ad; filled boxes show label and rule.');

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

  if (errs.length) bad('interactive errors:\n   ' + errs.join('\n   '));
  await ctx.close();
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
