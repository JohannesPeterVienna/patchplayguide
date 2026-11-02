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

const browser = await chromium.launch();
let fails = 0, minAd = Infinity, minAdWhere = '';
const bad = (msg) => { fails++; console.log('✗ ' + msg); };

async function newCtx(width, scheme = 'light') {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: scheme });
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
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
      visibleAds: [...document.querySelectorAll('.ad')].filter((a) => !a.hidden).length
    }));
    if (info.overflow > 1) errs.push('horizontal overflow ' + info.overflow + 'px');
    if (info.visibleAds) errs.push('ad box visible without slot id');
    if (u.startsWith('/tools/') && !(info.results && info.results.length > 40)) errs.push('tool shows no result');
    // force ad boxes visible at a realistic size and measure distance to controls and footer
    const dist = await page.evaluate(() => {
      const ads = [...document.querySelectorAll('.ad')];
      ads.forEach((a) => { a.hidden = false; a.style.minHeight = a.dataset.slot === 'side' ? '600px' : '250px'; });
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

await browser.close();
srv.close();
if (fails) { console.log(`\n${fails} browser problem(s).`); process.exit(1); }
console.log('All browser checks passed.');
