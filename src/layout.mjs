// Page shell for patchplayguide.com – head, header, footer, guide/tool article layout and JSON-LD.
export const SITE = {
  name: 'Patch Play Guide',
  origin: 'https://patchplayguide.com',
  domain: 'patchplayguide.com',
  client: 'ca-pub-7811071715414905',
  ga: 'G-T00HRG2YVF',
  reviewedIso: '2026-11-02',
  reviewedText: 'November 2, 2026',
  v: '20261118a'
};
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
/** '2026-11-18' -> 'November 18, 2026' */
export const dateText = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${MONTHS[m - 1]} ${d}, ${y}`; };
// 2026-11-04: the byline named an "editorial team" that does not exist. The correction is logged on every
// guide and tool page and sets dateModified; the "Reviewed" stamp keeps the date of the last content review.
/** Change log of a guide/tool: its own dated entries only. */
export const logOf = (x) => (x.changelog && x.changelog.length ? x.changelog : [[publishedIso(x), 'First published.']]);
/** First publication: 2026-11-02 for the original pages, the page's own date for later ones. */
export const publishedIso = (x) => x.published || SITE.reviewedIso;
/** Date of the last content review (newest own change-log entry). */
export const reviewedIso = (x) => (x.changelog && x.changelog.length ? x.changelog[x.changelog.length - 1][0] : publishedIso(x));
/** Last change of a guide/tool: the newest change-log date (first publication when there is none). */
/** Last change of a guide/tool page (dateModified, sitemap lastmod). */
export const modifiedIso = (x) => logOf(x).at(-1)[0];

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const strip = (s) => String(s).replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&[a-z#0-9]+;/g, ' ');
export const words = (html) => strip(String(html)
  .replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' '))
  .split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;

const NAV = [
  ['/tools/', 'Tools'],
  ['/reference/setting-names/', 'Setting names'],
  ['/guides/', 'Guides'],
  ['/about/', 'About']
];

const MARK = `<svg class="mark" viewBox="0 0 40 40" aria-hidden="true" focusable="false"><rect x="1" y="1" width="38" height="38" rx="7" fill="#0E1A24" stroke="#FFC531" stroke-width="2"/><path d="M9 13h8M13 9v8" stroke="#47D98A" stroke-width="2.6" stroke-linecap="square"/><path d="M9 21.5c1.4-1.6 2.6-1.6 4 0s2.6 1.6 4 0" stroke="#FFC531" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M9 29h8" stroke="#FF6B7F" stroke-width="2.6" stroke-linecap="square"/><path d="M22 10h9M22 15h7M22 21h9M22 27h6M22 31h8" stroke="#9FB0C0" stroke-width="1.6"/></svg>`;

const CONSENT_DEFAULTS = `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});gtag('set','ads_data_redaction',true);gtag('set','url_passthrough',false);window['ga-disable-${SITE.ga}']=true;</script>`;
// First script in <head>: local preview/test (localhost, 127.0.0.1, ::1, file:) or ?stats_test=1 (kept for the
// tab in sessionStorage) sets window.PPG_NO_GOOGLE – then no Google script (AdSense, its CMP, GA) is inserted.
const GUARD = `<script>window.PPG_NO_GOOGLE=(function(l){var h=l.hostname,q=/[?&]stats_test=1(&|$)/.test(l.search),t=q;try{if(q)sessionStorage.setItem('ppg-stats-test','1');t=q||sessionStorage.getItem('ppg-stats-test')==='1';}catch(e){}return t||l.protocol==='file:'||h==='localhost'||h==='127.0.0.1'||h==='::1'||h==='[::1]';})(location);</script>`;
// AdSense loader in the same place as the former static tag: async, crossorigin="anonymous", unless guarded.
const ADS_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${SITE.client}`;
const ADSENSE = `<script data-ads-loader>if(!window.PPG_NO_GOOGLE){(function(){var s=document.createElement('script');s.async=true;s.src='${ADS_SRC}';s.crossOrigin='anonymous';document.head.appendChild(s);})();}</script>`;

export function adSlot(name) {
  return `<div class="ad" data-slot="${name}" hidden><span class="ad-label">Advertisement</span></div>`;
}

function crumbsHtml(crumbs) {
  if (!crumbs || crumbs.length < 2) return '';
  return `<nav class="crumbs" aria-label="Breadcrumb"><ol>${crumbs.map(([n, u], i) => i === crumbs.length - 1 ? `<li aria-current="page">${esc(n)}</li>` : `<li><a href="${u}">${esc(n)}</a></li>`).join('')}</ol></nav>`;
}

function breadcrumbLd(crumbs) {
  return { '@type': 'BreadcrumbList', itemListElement: crumbs.map(([n, u], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: SITE.origin + u })) };
}

/**
 * opts: path, title, description, body, crumbs, ads ('yes'|'no'), loader (bool: AdSense script in head),
 * noindex (bool), canonical (override), ld (array of extra JSON-LD nodes), scripts (extra js files), refresh (url)
 */
export function page(opts) {
  const url = SITE.origin + opts.path;
  const canonical = opts.canonical === null ? '' : `<link rel="canonical" href="${esc(opts.canonical || url)}">`;
  const ld = [];
  if (opts.crumbs) ld.push(breadcrumbLd(opts.crumbs));
  if (opts.ld) ld.push(...opts.ld);
  const ldTag = ld.length ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': ld }).replace(/</g, '\\u003c')}</script>` : '';
  const scripts = ['consent.js', 'stats-window.js', 'site.js', ...(opts.scripts || [])].map((s) => `<script src="/assets/js/${s}?v=${SITE.v}" defer></script>`).join('\n');
  const nav = NAV.map(([u, n]) => `<li><a href="${u}"${opts.path === u ? ' aria-current="page"' : (opts.path.startsWith(u) ? ' aria-current="true"' : '')}>${n}</a></li>`).join('');
  return `<!doctype html>
<html lang="en" data-ads="${opts.ads === 'yes' ? 'yes' : 'no'}" data-stats="${opts.loader ? 'auto' : 'settings'}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${GUARD}
<title>${esc(opts.title)}</title>
<meta name="description" content="${esc(opts.description)}">
${canonical}
<meta name="robots" content="${opts.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}">
${opts.refresh ? `<meta http-equiv="refresh" content="0; url=${esc(opts.refresh)}">` : ''}
<meta name="google-adsense-account" content="${SITE.client}">
<meta property="og:type" content="${opts.ogType || 'website'}">
<meta property="og:title" content="${esc(opts.title)}">
<meta property="og:description" content="${esc(opts.description)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="https://patchplayguide.com/assets/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:locale" content="en_US">
<meta name="theme-color" content="#EEEDE9">
<meta name="color-scheme" content="light dark">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/assets/fonts/ibm-plex-sans-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/chakra-petch-latin-700-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/ppg.css?v=${SITE.v}">
${CONSENT_DEFAULTS}
${opts.loader ? ADSENSE : ''}
${ldTag}
${scripts}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="mast">
<div class="wrap mast-in"><a class="brand" href="/">${MARK}<span><b>Patch Play Guide</b><small>Settings, decoded and tested</small></span></a>
<nav class="main-nav" aria-label="Main"><ul>${nav}</ul></nav></div>
</header>
<main id="main"><div class="wrap">
${crumbsHtml(opts.crumbs)}
${opts.body}
</div></main>
<footer class="foot"><div class="wrap">
<div class="foot-grid">
<div><p class="foot-brand">${MARK}<b>Patch Play Guide</b></p><p>Calculators, a setting-name map and guides for game graphics settings, console modes and repeatable tests. Published by AdStern, Vienna.</p></div>
<div><h2>Tools</h2><ul><li><a href="/tools/upscaler-resolution-calculator/">Upscaler Resolution Calculator</a></li><li><a href="/tools/frame-time-calculator/">Frame Time Calculator</a></li><li><a href="/tools/settings-test-log/">Settings Test Log</a></li><li><a href="/tools/bottleneck-finder/">Bottleneck Finder</a></li><li><a href="/tools/settings-translator/">Settings Translator</a></li><li><a href="/tools/patch-decoder/">Patch Decoder</a></li><li><a href="/reference/setting-names/">Setting-name map</a></li><li><a href="/guides/">All guides</a></li></ul></div>
<div><h2>Site</h2><ul><li><a href="/about/">About &amp; method</a></li><li><a href="/contact/">Contact &amp; corrections</a></li><li><a href="/imprint/">Imprint</a></li><li><a href="/privacy/">Privacy policy</a></li><li><button type="button" class="linklike" data-privacy-settings>Privacy settings</button></li></ul></div>
</div>
<p class="tm">Game titles, platform names and technology names (such as PlayStation, PS5, Xbox, Nintendo Switch 2, Steam Deck, DLSS, FSR and XeSS) are trademarks of their respective owners and are used here only to describe compatibility and settings. Patch Play Guide is independent and not affiliated with, endorsed or sponsored by any game publisher, platform holder or hardware manufacturer. We show no game logos, key art or screenshots.</p>
<p class="tm">© 2026 AdStern · <a href="/imprint/">Imprint</a> · <a href="/privacy/">Privacy</a></p>
</div></footer>
</body>
</html>
`;
}

export function faqHtml(faq) {
  return `<section id="faq" class="faq"><h2>Frequently asked questions</h2>${faq.map(([q, a]) => `<div class="qa"><h3>${q}</h3><p>${a}</p></div>`).join('')}</section>`;
}
export function faqLd(faq) {
  return { '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: strip(q), acceptedAnswer: { '@type': 'Answer', text: strip(a) } })) };
}
export function sourcesHtml(sources, noteText) {
  // a label may start with its own anchor span (numbered sources of the name map); the link then wraps only the text
  const item = ([label, url, note]) => { const m = /^(<span id="[^"]+">[^<]*<\/span> )([\s\S]*)$/.exec(label); const [pre, text] = m ? [m[1], m[2]] : ['', label]; return `<li>${pre}${url ? `<a href="${url}" rel="noopener">${text}</a>` : text}${note ? ` – ${note}` : ''}</li>`; };
  return `<section id="sources" class="sources"><h2>Sources</h2><ul>${sources.map(item).join('')}</ul><p class="small">${noteText || 'Sources without a link are named so you can find the current version yourself; vendor pages move often. We summarize in our own words and never copy patch notes.'}</p></section>`;
}
function changelogHtml(log) {
  return `<section id="changelog" class="changelog"><h2>Change log</h2><ul>${log.map(([d, t]) => `<li><time datetime="${d}">${d}</time> ${t}</li>`).join('')}</ul></section>`;
}
function relatedHtml(related, lookup) {
  if (!related || !related.length) return '';
  return `<nav class="related" aria-labelledby="rel-h"><h2 id="rel-h">Read next</h2><ul>${related.map((r) => { const m = lookup(r); return `<li><a href="${m.path}"><span class="k">${esc(m.kicker)}</span>${esc(m.h1)}</a></li>`; }).join('')}</ul></nav>`;
}
const meta = (n, iso = SITE.reviewedIso) => `<p class="byline">Published by <a href="/about/">AdStern, Vienna</a></p><p class="meta"><span class="stamp">Reviewed ${dateText(iso)}</span><span>${Math.max(4, Math.round(n / 230))} min read</span><a href="/about/#checks">How we check pages</a></p>`;

export function articleLd(g, path) {
  return {
    '@type': 'Article', headline: g.h1, description: g.description, inLanguage: 'en-US',
    datePublished: publishedIso(g), dateModified: modifiedIso(g),
    mainEntityOfPage: SITE.origin + path,
    author: { '@type': 'Organization', name: 'AdStern – Agentur für digitales Marketing', url: SITE.origin + '/about/' },
    publisher: { '@type': 'Organization', name: 'AdStern – Agentur für digitales Marketing', url: SITE.origin + '/imprint/' }
  };
}

export function renderGuide(g, lookup) {
  const path = `/guides/${g.slug}/`;
  const secs = g.sections;
  // the mid ad never follows a section that ends with a “try it” button (ads keep their distance from controls)
  let mid = Math.floor(secs.length / 2);
  while (mid < secs.length - 1 && secs[mid - 1].slice(-400).includes('class="try"')) mid++;
  while (mid > 1 && secs[mid - 1].slice(-400).includes('class="try"')) mid--;
  const body = secs.map((s, i) => (i === mid ? adSlot('mid') + '\n' : '') + `<section>${s}</section>`).join('\n');
  const toc = secs.map((s) => { const m = s.match(/<h2 id="([^"]+)">([\s\S]*?)<\/h2>/); return m ? `<li><a href="#${m[1]}">${m[2]}</a></li>` : ''; }).join('');
  const n = words(g.lede + secs.join(' ') + g.faq.flat().join(' '));
  const crumbs = [['Home', '/'], ['Guides', '/guides/'], [g.short || g.h1, path]];
  const html = `<div class="layout"><article class="doc">
<p class="kicker">${esc(g.kicker)}</p>
<h1>${g.h1}</h1>
${meta(n, reviewedIso(g))}
<p class="lede">${g.lede}</p>
${adSlot('lede')}
${body}
${faqHtml(g.faq)}
${sourcesHtml(g.sources)}
${changelogHtml(logOf(g))}
<aside id="setup-note" class="setup-note" hidden></aside>
${relatedHtml(g.related, lookup)}
</article>
<aside class="side" aria-label="On this page"><nav class="toc"><h2>On this page</h2><ol>${toc}<li><a href="#faq">FAQ</a></li><li><a href="#sources">Sources</a></li></ol></nav>${adSlot('side')}</aside></div>`;
  return page({
    path, title: g.title, description: g.description, body: html, crumbs, ads: 'yes', loader: true, ogType: 'article',
    ld: [articleLd(g, path), faqLd(g.faq)]
  });
}

export function renderTool(t, lookup) {
  const path = `/${t.dir || 'tools'}/${t.slug}/`;
  const [first, ...rest] = t.sections;
  const crumbs = t.dir ? [['Home', '/'], [t.short, path]] : [['Home', '/'], ['Tools', '/tools/'], [t.short, path]];
  const n = words(t.lede + t.sections.join(' ') + t.faq.flat().join(' '));
  const html = `<article class="doc doc-tool">
<p class="kicker">${esc(t.kicker)}</p>
<h1>${t.h1}</h1>
${meta(n, reviewedIso(t))}
<p class="lede">${t.lede}</p>
${t.toolHtml}
<div class="explain">
<section>${first}</section>
${adSlot('tool')}
${rest.map((s) => `<section>${s}</section>`).join('\n')}
${faqHtml(t.faq)}
${sourcesHtml(t.sources, t.sourcesNote)}
${changelogHtml(logOf(t))}
</div>
${relatedHtml(t.related, lookup)}
</article>`;
  return page({
    path, title: t.title, description: t.description, body: html, crumbs, ads: 'yes', loader: true,
    scripts: t.scripts,
    ld: [t.dir ? articleLd(t, path) : {
      '@type': 'WebApplication', name: t.short, description: t.description, url: SITE.origin + path,
      applicationCategory: 'UtilitiesApplication', operatingSystem: 'Any (runs in the web browser)', isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, inLanguage: 'en-US',
      datePublished: publishedIso(t), dateModified: modifiedIso(t),
      publisher: { '@type': 'Organization', name: 'AdStern – Agentur für digitales Marketing', url: SITE.origin + '/imprint/' }
    }, faqLd(t.faq)]
  });
}
