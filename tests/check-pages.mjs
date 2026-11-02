// Static checks over the built site in docs/. Run after `npm run build`: node tests/check-pages.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = path.join(ROOT, 'docs');
const ORIGIN = 'https://patchplayguide.com';
const errors = [];
const fail = (where, msg) => errors.push(`${where}: ${msg}`);

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
}
const htmlFiles = walk(DOCS).filter((f) => f.endsWith('.html'));
const urlOf = (f) => '/' + path.relative(DOCS, f).replace(/\\/g, '/').replace(/index\.html$/, '');
const pages = htmlFiles.map((f) => ({ file: f, url: urlOf(f), html: fs.readFileSync(f, 'utf8') }));
const byUrl = new Map(pages.map((p) => [p.url, p]));

const text = (html) => html.replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ')
  .replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ');
const countWords = (html) => text(html).split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;
const get = (html, re) => { const m = html.match(re); return m ? m[1] : null; };
// extract an element by its opening-tag regex, balancing same-name tags
function element(html, openRe) {
  const m = openRe.exec(html);
  if (!m) return null;
  const tag = m[0].match(/^<(\w+)/)[1];
  const re = new RegExp(`<${tag}\\b|</${tag}>`, 'g');
  re.lastIndex = m.index + 1;
  let depth = 1, r;
  while ((r = re.exec(html))) { depth += r[0].startsWith('</') ? -1 : 1; if (!depth) return html.slice(m.index, r.index + r[0].length); }
  return null;
}

const sitemap = [...fs.readFileSync(path.join(DOCS, 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(ORIGIN, ''));
const titles = new Map(), descs = new Map();
const isGuide = (u) => /^\/guides\/[^/]+\/$/.test(u);
const isTool = (u) => /^\/tools\/[^/]+\/$/.test(u);
const LEGAL = ['/imprint/', '/privacy/', '/contact/'];
const report = [];

for (const p of pages) {
  const { url, html } = p;
  const noindex = /<meta name="robots" content="noindex/.test(html);
  const isRedirect = /http-equiv="refresh"/.test(html);
  if (!html.includes('<meta name="google-adsense-account" content="ca-pub-7811071715414905">')) fail(url, 'adsense account meta missing');
  if (/coming soon|lorem ipsum|TODO|placeholder text/i.test(text(html))) fail(url, 'placeholder wording');
  const consentAt = html.indexOf("gtag('consent','default'");
  if (consentAt === -1) fail(url, 'consent defaults missing');
  const loaderAt = html.indexOf('pagead2.googlesyndication.com/pagead/js/adsbygoogle.js');
  if (loaderAt !== -1 && loaderAt < consentAt) fail(url, 'AdSense loader before consent defaults');
  if (!html.includes("wait_for_update:500") || !html.includes("ads_data_redaction") || !html.includes("ga-disable-G-T00HRG2YVF")) fail(url, 'consent defaults incomplete');
  if (!/data-privacy-settings/.test(html)) fail(url, 'privacy settings button missing');
  if (!/trademarks of their respective owners/.test(html)) fail(url, 'trademark notice missing');

  if (isRedirect) {
    if (!noindex) fail(url, 'redirect page must be noindex');
    const to = get(html, /http-equiv="refresh" content="0; url=([^"]+)"/);
    if (!to || to === '/') fail(url, 'redirect must not go to /');
    if (!byUrl.has(to)) fail(url, 'redirect target missing ' + to);
    if (get(html, /<link rel="canonical" href="([^"]+)"/) !== ORIGIN + to) fail(url, 'redirect canonical must point to target');
    if (sitemap.includes(url)) fail(url, 'redirect page in sitemap');
    continue;
  }
  if (url === '/404.html') {
    if (!noindex) fail(url, '404 must be noindex');
    if (/rel="canonical"/.test(html)) fail(url, '404 must not have a canonical');
    if (/class="ad"/.test(html) || loaderAt !== -1) fail(url, 'no ads on 404');
    continue;
  }
  // indexable pages
  if (noindex) fail(url, 'unexpected noindex');
  if (!sitemap.includes(url)) fail(url, 'not in sitemap');
  const title = get(html, /<title>([^<]*)<\/title>/).replace(/&amp;/g, '&');
  const desc = get(html, /<meta name="description" content="([^"]*)">/).replace(/&amp;/g, '&').replace(/&quot;/g, '"');
  if (title.length < 30 || title.length > 65) fail(url, `title length ${title.length}: ${title}`);
  if (desc.length < 120 || desc.length > 160) fail(url, `description length ${desc.length}`);
  if (titles.has(title)) fail(url, 'duplicate title with ' + titles.get(title)); titles.set(title, url);
  if (descs.has(desc)) fail(url, 'duplicate description with ' + descs.get(desc)); descs.set(desc, url);
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) fail(url, 'needs exactly one h1');
  if (get(html, /<link rel="canonical" href="([^"]+)"/) !== ORIGIN + url) fail(url, 'canonical wrong');
  const hasAds = /class="ad"/.test(html);

  if (LEGAL.includes(url) && loaderAt !== -1) fail(url, 'AdSense loader must not be on legal/contact pages');
  if (!isGuide(url) && !isTool(url) && hasAds) fail(url, 'ad containers only on guides and tools');
  if (url === '/' && loaderAt === -1) fail(url, 'home needs the AdSense loader for the CMP');

  if (isGuide(url) || isTool(url)) {
    const article = element(html, /<article class="doc[^"]*">/);
    if (!article) { fail(url, 'article missing'); continue; }
    const tool = isTool(url) ? element(article, /<section class="tool"/) : '';
    const n = countWords(article.replace(tool || '', ' '));
    report.push([url, n]);
    if (isGuide(url) && n < 900) fail(url, `only ${n} words`);
    if (isTool(url)) {
      const explain = element(article, /<div class="explain">/);
      const lede = get(article, /<p class="lede">([\s\S]*?)<\/p>/) || '';
      const ne = countWords(lede + explain);
      if (ne < 800) fail(url, `tool explanation only ${ne} words`);
      if (!tool) fail(url, 'tool panel missing');
      if (/class="ad"/.test(tool)) fail(url, 'ad inside tool');
      // first ad slot only after the first explanatory section, with real text in between
      const afterTool = article.slice(article.indexOf(tool) + tool.length);
      const between = afterTool.slice(0, afterTool.indexOf('class="ad"'));
      if (countWords(between) < 80) fail(url, 'too little content between tool and first ad');
      if (/<aside class="side"/.test(html)) fail(url, 'no sidebar on tool pages');
    }
    if (!/<table/.test(article)) fail(url, 'needs a data table');
    if (!/<svg viewBox="[^"]+" role="img"/.test(article)) fail(url, 'needs an inline SVG diagram');
    if (!/id="faq"/.test(article)) fail(url, 'FAQ section missing');
    if (!/id="sources"/.test(article)) fail(url, 'sources section missing');
    if (!/Reviewed November 2, 2026/.test(article)) fail(url, 'reviewed date missing');
    if (!/id="changelog"/.test(article)) fail(url, 'change log missing');
    const ld = JSON.parse(get(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/));
    const types = ld['@graph'].map((n) => n['@type']);
    for (const t of ['BreadcrumbList', 'FAQPage', isGuide(url) ? 'Article' : 'WebApplication']) if (!types.includes(t)) fail(url, 'JSON-LD missing ' + t);
    const main = ld['@graph'].find((n) => n['@type'] === 'Article' || n['@type'] === 'WebApplication');
    if (main && main.dateModified !== '2026-11-02') fail(url, 'dateModified wrong');
    const faq = ld['@graph'].find((n) => n['@type'] === 'FAQPage');
    if (faq && faq.mainEntity.length < 3) fail(url, 'FAQ too short');
    if (loaderAt === -1) fail(url, 'content page needs the AdSense loader');
    if (!hasAds) fail(url, 'content page should have ad containers');
    if (/class="ad"[^>]*>(?!<span class="ad-label">Advertisement<\/span>)/.test(html)) fail(url, 'ad container without Advertisement label');
    if (!/class="ad" data-slot="[^"]+" hidden>/.test(html)) fail(url, 'ad containers must start hidden');
    // ads must not sit directly next to buttons/forms in the markup
    for (const m of html.matchAll(/<div class="ad"[\s\S]{0,400}/g)) if (/<(button|input|select|textarea|form)\b/.test(m[0].slice(0, 400).replace(/^[\s\S]*?<\/div>/, ''))) {
      const after = m[0].replace(/^[\s\S]*?<\/div>/, '');
      if (countWords(after.split(/<(?:button|input|select|textarea|form)\b/)[0]) < 40) fail(url, 'control right after an ad slot');
    }
  }

  // internal links
  for (const m of html.matchAll(/href="(\/[^"]*)"/g)) {
    const [p0, hash] = m[1].split('#');
    const target = p0 || url;
    if (/^\/assets\/|\.svg$|\.txt$|\.xml$/.test(target)) { if (!fs.existsSync(path.join(DOCS, target.split('?')[0]))) fail(url, 'missing asset ' + target); continue; }
    const t = byUrl.get(target);
    if (!t) { fail(url, 'broken link ' + m[1]); continue; }
    if (hash && !new RegExp(`id="${hash}"`).test(t.html)) fail(url, 'broken anchor ' + m[1]);
  }
  for (const m of html.matchAll(/href="#([^"]+)"/g)) if (!new RegExp(`id="${m[1]}"`).test(html)) fail(url, 'broken in-page anchor #' + m[1]);
  // duplicate ids
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const dup = ids.filter((x, i) => ids.indexOf(x) !== i);
  if (dup.length) fail(url, 'duplicate ids ' + [...new Set(dup)].join(', '));

  // page weight: html + css + js + fonts
  let size = Buffer.byteLength(html);
  for (const m of html.matchAll(/(?:href|src)="(\/assets\/[^"?]+)/g)) size += fs.statSync(path.join(DOCS, m[1])).size;
  const css = fs.readFileSync(path.join(DOCS, 'assets/css/ppg.css'), 'utf8');
  for (const m of css.matchAll(/url\((\/assets\/fonts\/[^)]+)\)/g)) size += fs.statSync(path.join(DOCS, m[1])).size;
  if (size > 300 * 1024) fail(url, `page weight ${Math.round(size / 1024)} KB`);
}

for (const u of sitemap) if (!byUrl.has(u)) fail('sitemap', 'listed page missing ' + u);
const must = { 'ads.txt': 'google.com, pub-7811071715414905, DIRECT, f08c47fec0942fa0', 'CNAME': 'patchplayguide.com', 'robots.txt': 'Sitemap: https://patchplayguide.com/sitemap.xml' };
for (const [f, s] of Object.entries(must)) if (!fs.readFileSync(path.join(DOCS, f), 'utf8').includes(s)) fail(f, 'content wrong');
for (const f of ['OFL-chakra-petch.txt', 'OFL-ibm-plex-sans.txt', 'OFL-jetbrains-mono.txt']) if (!fs.existsSync(path.join(DOCS, 'assets/fonts', f))) fail('fonts', 'license missing ' + f);
const guides = sitemap.filter(isGuide).length, tools = sitemap.filter(isTool).length;
if (guides + tools < 15) fail('site', 'fewer than 15 guide/tool pages');
const priv = byUrl.get('/privacy/').html;
for (const s of ["Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites.", 'adssettings.google.com', 'aboutads.info', 'youronlinechoices.eu', 'policies.google.com/technologies/partner-sites', 'dsb@dsb.gv.at', 'www.dsb.gv.at', 'GitHub Pages', 'G-T00HRG2YVF', 'limited ads']) if (!priv.includes(s)) fail('/privacy/', 'missing: ' + s);
const imp = byUrl.get('/imprint/').html;
for (const s of ['§ 5', '§ 25', 'Seilerstätte 8', '1010 Vienna', 'office@adstern.com', 'ATU54682507', 'Magistratisches Bezirksamt für den 1./8. Bezirk', 'Fachgruppe Werbung und Marktkommunikation', 'Gewerbeordnung 1994', 'ris.bka.gv.at']) if (!imp.includes(s)) fail('/imprint/', 'missing: ' + s);
if (/UGB/.test(imp)) fail('/imprint/', 'must not cite UGB');

for (const [u, n] of report) console.log(String(n).padStart(5), u);
console.log(`${pages.length} HTML files, ${sitemap.length} in sitemap (${guides} guides, ${tools} tools).`);
if (errors.length) { console.error(errors.join('\n')); console.error(`\n${errors.length} problem(s).`); process.exit(1); }
console.log('All page checks passed.');
