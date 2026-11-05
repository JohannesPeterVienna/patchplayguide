// Home, guide index, About, Contact, Imprint, Privacy and 404 for patchplayguide.com.
import { esc, SITE } from './layout.mjs';

const RIS = 'https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10007517';
const UPDATED = { 'Privacy policy': 'November 5, 2026', 'About Patch Play Guide': 'November 4, 2026', 'Contact &amp; corrections': 'November 4, 2026' }; // legal pages changed after first publication
const legal = (kicker, h1, inner) => `<article class="doc legal"><p class="kicker">${kicker}</p><h1>${h1}</h1>${inner}<p class="small">Last updated: ${UPDATED[h1] || SITE.reviewedText}</p></article>`;

export const GROUPS = [
  { key: 'pc', name: 'PC settings and performance', intro: 'What each option costs, how upscalers and frame generation work, and how to find and fix your bottleneck.' },
  { key: 'testing', name: 'Patches and testing', intro: 'How to read patch notes, re-test after an update and compare settings with numbers you can trust.' },
  { key: 'console', name: 'Consoles, handhelds and displays', intro: 'Performance and fidelity modes, PS5 Pro, Xbox Series S and X, Switch 2, Steam Deck and 120 Hz/VRR setup.' }
];

const TOOL_ICONS = {
  decoder: '<svg viewBox="0 0 44 44" aria-hidden="true"><rect x="2" y="2" width="40" height="40" rx="8" fill="none" stroke="#FFC531" stroke-width="2"/><path d="M10 14h8M14 10v8" stroke="#47D98A" stroke-width="2.6"/><path d="M10 23c1.5-1.8 3-1.8 4.5 0s3 1.8 4.5 0" stroke="#FFC531" stroke-width="2.4" fill="none"/><path d="M10 32h8" stroke="#FF6B7F" stroke-width="2.6"/><path d="M23 14h12M23 23h10M23 32h12" stroke="#A5B5C4" stroke-width="2"/></svg>',
  translator: '<svg viewBox="0 0 44 44" aria-hidden="true"><rect x="2" y="2" width="40" height="40" rx="8" fill="none" stroke="#FFC531" stroke-width="2"/><path d="M9 13h26M9 22h26M9 31h26" stroke="#3A5267" stroke-width="4"/><path d="M9 13h20" stroke="#7CC4FF" stroke-width="4"/><path d="M9 22h10" stroke="#47D98A" stroke-width="4"/><path d="M9 31h16" stroke="#FF6B7F" stroke-width="4"/></svg>',
  finder: '<svg viewBox="0 0 44 44" aria-hidden="true"><rect x="2" y="2" width="40" height="40" rx="8" fill="none" stroke="#FFC531" stroke-width="2"/><circle cx="22" cy="11" r="4" fill="#FFC531"/><path d="M22 15v6M22 21l-9 7M22 21l9 7" stroke="#A5B5C4" stroke-width="2" fill="none"/><circle cx="13" cy="31" r="4" fill="#47D98A"/><circle cx="31" cy="31" r="4" fill="#FF6B7F"/></svg>'
};

export function home({ GUIDES }) {
  const card = (g) => `<a class="card" data-slug="${g.slug}" href="/guides/${g.slug}/"><span class="k">${g.kicker.replace(/^Guide · /, '')}</span><h3>${g.h1}</h3><p>${esc(g.description)}</p></a>`;
  const groups = GROUPS.map((gr) => `<h2 id="${gr.key}">${gr.name}</h2><p>${gr.intro}</p><div class="cards">${GUIDES.filter((g) => g.group === gr.key).map(card).join('')}</div>`).join('\n');
  const body = `<section class="hero">
<div>
<p class="kicker">Patch notes → your settings → a re-test</p>
<h1>What did the patch change on your screen?</h1>
<p class="lede">Patch Play Guide translates game updates and graphics menus into what matters on your own screen: frame rate, image quality, console modes and handheld battery. Every guide ends in something you can test yourself – on PC, PS5, Xbox, Switch 2 and Steam Deck.</p>
<p class="row"><a class="btn btn-primary" href="/tools/patch-decoder/">Decode patch notes</a><a class="btn btn-ghost" href="/tools/bottleneck-finder/">Find my bottleneck</a></p>
</div>
<figure class="diffcard" aria-labelledby="dc-cap">
<div class="dc-h"><span>Saltmarsh Protocol · 1.8.0</span><b>Fictional example</b></div>
<ol>
<li><span class="s-p" aria-label="Improvement">+</span><span>Crowd simulation uses less CPU time<span class="act">CPU-bound in cities? Try crowd density one step higher.</span></span></li>
<li><span class="s-t" aria-label="Change">~</span><span>“High” shadows now use the old “Ultra” distance<span class="act">Same name, higher cost – re-test shadows.</span></span></li>
<li><span class="s-t" aria-label="Change">~</span><span>Shaders are rebuilt on first launch<span class="act">Expect stutter in the first session; judge later.</span></span></li>
<li><span class="s-m" aria-label="Removal">−</span><span>Low texture option removed on PC<span class="act">8 GB card? Check VRAM after the update.</span></span></li>
<li><span class="s-p" aria-label="Improvement">+</span><span>New 40 fps mode for 120 Hz displays<span class="act">Enable 120 Hz output on console and TV first.</span></span></li>
</ol>
<figcaption id="dc-cap" class="dc-h" style="border:0;margin:6px 0 0;padding:0">Invented game, invented patch – the format we use for every change</figcaption>
</figure>
</section>
<h2 id="tools">Three tools that run in your browser</h2>
<div class="tools3">
<a class="tcard" href="/tools/patch-decoder/">${TOOL_ICONS.decoder}<h3>Patch Decoder</h3><p>Paste patch notes and sort every line into + improvement, ~ change or − removal, by category and platform, with a checklist to tick off.</p><span class="go">Open decoder →</span></a>
<a class="tcard" href="/tools/settings-translator/">${TOOL_ICONS.translator}<h3>Settings Translator</h3><p>Twenty common graphics options with their typical GPU, CPU and VRAM load. Pick your bottleneck to see what to lower first.</p><span class="go">Open translator →</span></a>
<a class="tcard" href="/tools/bottleneck-finder/">${TOOL_ICONS.finder}<h3>Bottleneck Finder</h3><p>Low FPS, stutter or input lag? A few questions lead to the likely cause – GPU, CPU, VRAM, shaders or a limiter – and the fix.</p><span class="go">Start the finder →</span></a>
</div>
<section class="vorteile" aria-labelledby="vt-h"><h2 id="vt-h">What you get</h2><ul><li><b>Patch notes in plain words</b><span>What a change means on your screen – not just what the developers wrote.</span></li><li><b>Find the real bottleneck</b><span>GPU, CPU, VRAM, shaders or settings – a few questions point to the cause.</span></li><li><b>Tips for your setup</b><span>PC, PS5, Xbox, Switch 2 or Steam Deck – tell us once, guides point to what matters.</span></li><li><b>Sources, not guesswork</b><span>Every claim is checked against official patch notes; no copied benchmark figures.</span></li><li><b>Your setup stays local</b><span>Saved only in your browser; nothing is uploaded.</span></li><li><b>Free, no sign-up</b><span>No account, no paywall, no affiliate links.</span></li></ul></section>
<section class="band setup-panel" id="my-setup" aria-labelledby="ms-h">
<h2 id="ms-h">My setup</h2>
<p>Tell us what you play on and the guides will point you to what matters for it. Your choice is stored only in this browser – there is no account, and nothing is sent to us.</p>
<form id="setup-form">
<div class="setup-grid">
<label>Platform<select name="platform"><option value="pc">Desktop or laptop PC</option><option value="handheld">Steam Deck or handheld PC</option><option value="ps5">PS5</option><option value="ps5pro">PS5 Pro</option><option value="xbox">Xbox Series X or S</option><option value="switch2">Nintendo Switch 2</option></select></label>
<label data-pc-only>GPU class<select name="gpu"><option value="entry">Entry-level</option><option value="mid" selected>Midrange</option><option value="high">High-end</option></select></label>
<label data-vram>Video memory<select name="vram"><option value="">Not sure</option><option value="6">6 GB or less</option><option value="8">8 GB</option><option value="12">10–12 GB</option><option value="16">16 GB or more</option></select></label>
</div>
<div class="row" style="margin-top:14px"><button type="submit" class="btn btn-primary">Save my setup</button><button type="button" id="setup-clear" class="btn btn-ghost">Clear</button></div>
</form>
<div id="setup-out" aria-live="polite"></div>
</section>
${groups}
<section class="band" aria-labelledby="how-h">
<h2 id="how-h">How Patch Play Guide works</h2>
<div class="cols2">
<div><h3>Changes, not headlines</h3><p>A patch note is only useful if you know what to do with it. We mark every relevant change with a plus, tilde or minus and attach an action: re-test this option, check that mode, expect a shader rebuild. The <a href="/guides/how-to-read-patch-notes/">patch-notes guide</a> explains the system.</p>
<h3>Typical, not invented</h3><p>Where we describe what a setting costs, we say “typical” and use qualitative levels. We do not publish frame-rate percentages we have not measured ourselves, and every guide lists its sources.</p></div>
<div><h3>Every platform separately</h3><p>PC players change options; console players choose modes; handheld players balance frame rate against battery. Each guide says which platform it covers, and the tools filter by platform.</p>
<h3>Test it yourself</h3><p>Your system is the only one that matters. The <a href="/guides/how-to-test-a-settings-change/">testing guide</a> and the <a href="/guides/after-update-retest-routine/">10-minute re-test routine</a> show how to check any change with numbers you can trust. More on our <a href="/about/">method and limits</a>.</p></div>
</div>
</section>`;
  return {
    path: '/',
    title: 'Patch Play Guide – game updates, settings and re-tests',
    description: 'Patch notes translated into settings: what a game update changes on PC, PS5, Xbox, Switch 2 and Steam Deck, plus tools to decode patches and find bottlenecks.',
    body
  };
}

export function guidesIndex({ GUIDES }) {
  const groups = GROUPS.map((gr) => `<section><h2 id="${gr.key}">${gr.name}</h2><p>${gr.intro}</p><div class="cards">${GUIDES.filter((g) => g.group === gr.key).map((g) => `<a class="card" href="/guides/${g.slug}/"><span class="k">${g.kicker.replace(/^Guide · /, '')}</span><h3>${g.h1}</h3><p>${esc(g.description)}</p></a>`).join('')}</div></section>`).join('\n');
  return {
    path: '/guides/',
    title: 'All guides – settings, patches, consoles and handhelds',
    description: 'All Patch Play Guide guides in one place: PC graphics settings, upscaling, stutter and bottlenecks, patch notes and re-tests, console modes, Steam Deck and VRR.',
    crumbs: [['Home', '/'], ['Guides', '/guides/']],
    body: `<p class="kicker">Library</p><h1>All guides</h1>
<p class="lede" style="max-width:72ch">Eighteen guides in three groups. Each explains one topic in depth, shows a table and a diagram, answers common questions and lists its sources. Every page was reviewed on ${SITE.reviewedText}; the change log at the end of each page records later corrections.</p>
<p style="max-width:72ch">Not sure where to start? If something feels wrong, the <a href="/tools/bottleneck-finder/">Bottleneck Finder</a> points you to the right guide in about a minute. If a new update just arrived, start with <a href="/guides/how-to-read-patch-notes/">how to read patch notes</a> and the <a href="/guides/after-update-retest-routine/">re-test routine</a>. If you want to understand your graphics menu once and for all, begin with <a href="/guides/graphics-settings-explained/">graphics settings explained</a>.</p>
${groups}`
  };
}

export const STATIC_PAGES = [
  {
    path: '/about/',
    title: 'About Patch Play Guide – method, sources and limits',
    description: 'Who publishes Patch Play Guide, how guides and tools are written and checked, which sources we rely on, how we handle patch notes and what the site cannot do.',
    crumbs: [['Home', '/'], ['About', '/about/']],
    body: legal('About &amp; method', 'About Patch Play Guide', `<p class="lede">Patch Play Guide explains what game updates and graphics settings change on your own screen – on PC, PS5, Xbox, Switch 2 and handheld PCs – and how to check it yourself. It is built for players who want to understand their settings rather than copy a list.</p>
<h2 id="who">Who publishes the site</h2>
<p>The site is published by AdStern, an advertising agency based in Vienna, Austria; the full details are in the <a href="/imprint/">imprint</a>. Patch Play Guide is financed by advertising on the guide, tool and overview pages; the imprint, privacy policy and contact page carry no advertising. No game publisher, platform holder or hardware manufacturer pays for coverage, and the guides contain no affiliate links. We are not affiliated with any company whose products we mention.</p>
<h2 id="method">How the guides are written</h2>
<p>Every guide is written for this site, with the help of AI tools, around one question a player actually has – “why does my game stutter after an update?” rather than a product announcement. Each guide explains the mechanism behind the problem, gives a concrete order of actions, and states which platforms it applies to. Technical statements are based on vendor documentation, platform documentation and long-established, widely documented graphics behavior; each page lists its sources at the end.</p>
<p>We deliberately describe the cost of settings in qualitative terms – minimal, low, moderate, high – and call them “typical”. Performance depends on the game, the scene, the hardware and the driver, and percentages from one test system are often copied far beyond the conditions they were measured under. We do not publish benchmark figures we have not measured ourselves. If we publish our own measurements in the future, each will state the exact hardware, software versions, scene and method.</p>
<h2 id="patches">How we handle patch notes</h2>
<p>Patch notes belong to their publishers. We never copy them. The <a href="/tools/patch-decoder/">Patch Decoder</a> works with a clearly <b>fictional</b> example game and with lines you paste yourself from the official source; the sorting happens in your browser. We currently do not publish summaries of specific real-world patches, because each summary would have to be verified line by line against the official notes and kept up to date with hotfixes. Our guides instead teach you to read any patch note and to <a href="/guides/after-update-retest-routine/">re-test after an update</a>.</p>
<h2 id="tools">How the tools work</h2>
<ul>
<li><b>Patch Decoder</b> sorts lines with a published set of word rules, in a fixed order, into a change type (+, ~, −), a category and platforms. The rules and their limits are described on the tool page.</li>
<li><b>Settings Translator</b> rates twenty common options with qualitative GPU, CPU and VRAM levels and a “visible loss” rating, and ranks them with a simple published formula for your bottleneck.</li>
<li><b>Bottleneck Finder</b> is a decision tree of ten questions and seventeen results; each result links to the guide that explains it.</li>
</ul>
<p>The logic of all three tools is covered by automated tests: for example, that every answer in the finder leads somewhere, that every result is reachable, and that the decoder sorts reference lines correctly.</p>
<h2 id="checks">How pages are checked</h2>
<p>Guides are researched from vendor and platform documentation as known at the time of writing and checked in a separate review pass against those sources before publishing. That review consists of independent AI review passes and automated tests; there is no team of human editors behind the site. Calculations such as frame times and upscaler resolutions are recalculated during that review, and the automated tests check the tools, the internal links and the page structure. AdStern, the publisher, decides what is published and is responsible for it. Platform menu paths and vendor features can change between system and driver updates, so a path on our pages may no longer match your console or PC – please report any difference via the <a href="/contact/">contact page</a>. Statements we could not verify with certainty are phrased cautiously or left out. Each page shows the date of its last review and has a change log; when we correct something, the date and the log change.</p>
<h2 id="limits">What the site cannot do</h2>
<p>We cannot see your system. A guide can tell you what usually helps; only a test on your hardware tells you what helps you. Platform menus and vendor features change with system and driver updates – if a menu path on our pages no longer matches, the platform’s support site has the current one, and we appreciate a <a href="/contact/">note</a>. We do not give advice on hardware purchases, modding, cheating or circumventing platform rules.</p>
<h2 id="images">No logos, key art or screenshots</h2>
<p>All diagrams on this site are our own drawings. We show no game logos, characters, key art or screenshots, and mention game, platform and technology names only as text to describe compatibility and settings.</p>
<h2 id="data">Your data</h2>
<p>Everything you enter in the tools, including “My setup”, stays in your browser’s local storage. There is no account. Advertising and analytics are described in the <a href="/privacy/">privacy policy</a>.</p>
<h2 id="history">History</h2>
<p>Patch Play Guide started as a single page with local tools for organizing patch notes and comparing frame rates. In November 2026 it was rebuilt from scratch with the in-depth guides and the three tools you see now.</p>`)
  },
  {
    path: '/contact/',
    title: 'Contact and corrections – Patch Play Guide',
    description: 'How to reach the publisher of Patch Play Guide, how to report an error or an outdated menu path, and which requests the site cannot help with.',
    crumbs: [['Home', '/'], ['Contact', '/contact/']],
    body: legal('Contact', 'Contact &amp; corrections', `<p class="lede">Patch Play Guide is published by AdStern in Vienna, Austria. You can reach us by email at <a href="mailto:office@adstern.com">office@adstern.com</a>; the postal address is in the <a href="/imprint/">imprint</a>.</p>
<h2 id="corrections">Reporting an error</h2>
<p>If something on a page is wrong or out of date – a menu path that moved after a system update, a feature that changed, a link that no longer works – please tell us the page and the sentence, and if possible the source that shows the current state. Confirmed errors are corrected, the review date changes and the page’s change log records the correction.</p>
<h2 id="process">What happens with a correction</h2>
<p>Each report is checked against the official source it concerns – the platform’s support pages, the vendor’s documentation or the publisher’s patch notes – not against other fan sites. Three things help most: the platform and its system or driver version, the exact wording you see on your screen, and a link to the official page that shows the change. If the report holds, the sentence is rewritten or removed, any calculation that depends on it is redone, and the page’s change log gets a dated entry that says what changed. If the official sources do not settle the question, the page says that the behavior differs between versions instead of guessing. We do not publish your name or email address with a correction.</p>
<h2 id="topics">Suggesting a topic</h2>
<p>Requests for new guides are welcome, especially questions about a setting or a console mode that existing guides don’t answer. Please describe the problem the way you would ask a friend – “why does my game look blurry in performance mode?” – and name the platform. A topic becomes a guide when it can be explained from official documentation and checked on your own system with the <a href="/guides/how-to-test-a-settings-change/">testing method</a>. We don’t write reviews, rankings, rumors or coverage of unreleased hardware, and we cannot promise a date for a requested guide.</p>
<h2 id="tools">Tool problems</h2>
<p>If the Patch Decoder sorts a line clearly wrongly, send us the line (without anything personal). The rules are simple by design, so not every case can be fixed, but recurring patterns help us improve them.</p>
<h2 id="scope">What we cannot help with</h2>
<p>We cannot troubleshoot individual PCs or consoles, recommend hardware purchases, or help with account, purchase or warranty issues – those belong with the platform or manufacturer’s support. We do not accept sponsored posts, paid links or review samples.</p>
<p>How we handle personal data is described in the <a href="/privacy/">privacy policy</a>.</p>`)
  },
  {
    path: '/imprint/',
    title: 'Imprint – Patch Play Guide (AdStern, Vienna)',
    description: 'Legal notice for patchplayguide.com under the Austrian E-Commerce Act and Media Act: media owner, business details, trade authority and chamber membership.',
    crumbs: [['Home', '/'], ['Imprint', '/imprint/']],
    body: legal('Legal notice', 'Imprint', `<p>Disclosures pursuant to § 5 of the Austrian E-Commerce Act (E-Commerce-Gesetz, ECG) and § 25 of the Austrian Media Act (Mediengesetz, MedienG).</p>
<h2 id="owner">Media owner and publisher</h2>
<p>AdStern<br>Seilerstätte 8<br>1010 Vienna<br>Austria</p>
<p>Email: <a href="mailto:office@adstern.com">office@adstern.com</a></p>
<h2 id="business">Business information</h2>
<ul>
<li>Business purpose: advertising agency (Werbeagentur)</li>
<li>VAT ID: ATU54682507</li>
<li>Competent trade authority: Magistratisches Bezirksamt für den 1./8. Bezirk, Vienna</li>
<li>Member of: Vienna Chamber of Commerce (WKO Wien), Fachgruppe Werbung und Marktkommunikation</li>
<li>Applicable trade law: Gewerbeordnung 1994, available in the <a href="${RIS}" rel="noopener">Austrian Legal Information System (RIS)</a></li>
</ul>
<h2 id="line">Editorial line (§ 25 MedienG)</h2>
<p>Patch Play Guide publishes guides and free browser tools about game updates, graphics settings, console modes and display setup. The content is general information for players. It is independent of game publishers, platform holders and hardware manufacturers.</p>
<h2 id="links">External links</h2>
<p>Links to other websites were checked when the linking page was published or last reviewed. We have no influence on the content of external sites and accept no responsibility for it.</p>
<h2 id="trademarks">Trademarks</h2>
<p>Names of games, platforms and technologies are trademarks of their respective owners. They are used only to describe compatibility and settings.</p>`)
  },
  {
    path: '/privacy/',
    title: 'Privacy policy – Patch Play Guide',
    description: 'How patchplayguide.com processes data: GitHub Pages hosting, Google AdSense with consent, Google Analytics after consent, local tool inputs and your rights.',
    crumbs: [['Home', '/'], ['Privacy', '/privacy/']],
    body: legal('Privacy', 'Privacy policy', `<p>This policy explains which personal data is processed when you visit patchplayguide.com, why, on which legal basis, and which rights you have.</p>
<h2 id="controller">Controller</h2>
<p>AdStern, Seilerstätte 8, 1010 Vienna, Austria, email <a href="mailto:office@adstern.com">office@adstern.com</a>. Further details are in the <a href="/imprint/">imprint</a>.</p>
<h2 id="hosting">Hosting on GitHub Pages</h2>
<p>This website consists of static files served by GitHub Pages, a service of GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA. To deliver a page, your browser sends technical data to GitHub’s servers – your IP address, the requested address, date and time, browser and operating system, and the referring page. GitHub uses this data to deliver the site and to keep the service secure and may store it in server logs for a limited time. Legal basis: our legitimate interest in providing a secure, working website (Art. 6(1)(f) GDPR). Transfers to the USA are based on the EU–U.S. Data Privacy Framework or on standard contractual clauses. More information: <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" rel="noopener">GitHub General Privacy Statement</a>.</p>
<h2 id="local">Tool inputs and “My setup” (local storage)</h2>
<p>The Patch Decoder, Settings Translator, Bottleneck Finder and “My setup” work entirely in your browser. Patch-note text you paste, ticked checklist items, your chosen bottleneck and your saved platform, GPU class and video memory are stored only in your browser’s local storage on your device, so they are still available on your next visit. This data is never transmitted to us or to third parties. You can delete it with the “Clear” buttons in the tools or by deleting this site’s data in your browser settings. Legal basis: storing this data is necessary to provide the function you request (§ 165(3) Austrian Telecommunications Act 2021; Art. 6(1)(f) GDPR).</p>
<h2 id="ads">Advertising with Google AdSense</h2>
<p>Guide, tool and overview pages (the home page, the guide overview and About) can show advertising from Google AdSense; the imprint, this privacy policy and the contact page load no advertising. AdSense is a service of Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland, and, for users outside the EEA, the UK and Switzerland, Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA. AdSense uses cookies and similar technologies to deliver ads, limit how often an ad is shown, measure performance and prevent fraud.</p>
<p><b>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites.</b> Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to this site and/or other sites on the Internet.</p>
<p>You can opt out of personalized advertising in Google’s <a href="https://adssettings.google.com" rel="noopener">Ads Settings</a>. You can also opt out of third-party vendors’ use of cookies for personalized advertising at <a href="https://www.aboutads.info/choices/" rel="noopener">www.aboutads.info</a> or, in Europe, at <a href="https://www.youronlinechoices.eu/" rel="noopener">www.youronlinechoices.eu</a>. How Google uses data from websites that use its services is explained at <a href="https://policies.google.com/technologies/partner-sites" rel="noopener">policies.google.com/technologies/partner-sites</a>.</p>
<h2 id="consent">Consent (Google consent management platform)</h2>
<p>Visitors from the European Economic Area, the United Kingdom and Switzerland see a consent message from Google’s certified consent management platform, which implements the IAB Transparency &amp; Consent Framework, before any cookies or similar technologies that require consent are used. Before any Google script runs, Google Consent Mode is set to “denied” for advertising and analytics storage.</p>
<p>Personalized ads are shown only with your consent. Non-personalized ads, which are selected based on the page content and approximate location, also use cookies or similar identifiers for frequency capping, reporting and fraud prevention, and therefore also require consent to storing and accessing information on your device. If you do not consent, Google may show <b>limited ads</b>. Limited ads do not use cookies or local storage for personalised advertising; Google may still use them for fraud prevention and frequency limits as described in its documentation, and it processes technical data such as your IP address to deliver the ads. Legal basis: your consent (Art. 6(1)(a) GDPR, § 165(3) Austrian Telecommunications Act 2021).</p>
<p>You can change or withdraw your decision at any time with effect for the future using <button type="button" class="linklike" data-privacy-settings>Privacy settings</button>; the same button is in the footer of every page. On guide, tool and overview pages it opens Google’s consent message; if a U.S. state privacy law applies to your visit, it opens Google’s U.S. opt-out dialog instead, where you can opt out of the sale or sharing of personal information and of targeted advertising; after an opt-out, ad personalization and Google Analytics stay off. While Google’s consent message is not displayed, and on pages that load no advertising (such as this privacy policy, the imprint and the contact page), the button opens our <a href="#stats-window">interim statistics window</a> instead. On pages without advertising the window also offers the button “Open Google’s ad &amp; U.S. privacy choices”: only when you press it, Google’s consent message (fundingchoicesmessages.google.com) is loaded on that page – no ad code – so that you can withdraw your consent to advertising or opt out under a U.S. state privacy law there as well. Google Analytics is never loaded on these pages.</p>
<h2 id="stats-window">Interim statistics window</h2>
<p>At the moment Google’s consent message is set up on this site but is not displayed. So that visits are still counted only with your consent, we show a small window of our own (“Stats check”) for as long as this is the case. It appears about three seconds after a guide, tool or overview page has loaded if Google’s consent platform has by then neither reported a decision nor displayed its message, and has not reported that the GDPR does not apply to your visit. It asks only about statistics with Google Analytics 4 (Google Ireland Limited); it is not consent to advertising. It never switches on advertising storage, ad user data or ad personalization – these stay “denied” – and it does not change the advertising or the consent message. “Allow” and “Decline” are equal choices. Until you choose, and if you close the window with “×” or the Escape key, Google Analytics stays off; closing stores nothing, and we ask again on the next page.</p>
<p>If you choose “Allow”, Consent Mode is set to “granted” for analytics storage only and Google Analytics loads once, as described in the next section, with Google signals and ad personalization switched off. It sets the cookies <code>_ga</code> and <code>_ga_…</code> on your device, and data may be transferred to Google LLC in the USA (on the basis of the EU–U.S. Data Privacy Framework). If you choose “Decline” or later withdraw your consent, Google Analytics is switched off on the page at once, analytics storage is set back to “denied”, and any <code>_ga</code> and <code>_ga_…</code> cookies of this domain are deleted; they are also deleted when a page loads and a stored “Decline” is found.</p>
<p>What is stored: your choice is saved in your browser’s local storage under the key <code>ppg-stats</code>, with a version number, your choice (“yes” or “no”) and the time of the choice. The entry is needed to respect your decision and is not sent to us or to Google. After 12 months, or if we change the window, we ask again; an entry with a date in the future is discarded. If your browser blocks local storage, your choice applies only to the current page.</p>
<p>Legal basis: your consent (Art. 6(1)(a) GDPR; for storing and reading information on your device § 165(3) of the Austrian Telecommunications Act 2021, TKG 2021). You can view, change or withdraw your choice at any time via “Privacy settings” at the bottom of every page, including this one; pages without advertising load neither ads nor Google Analytics; the window there shows and changes the stored choice and, on request, opens Google’s consent message (see above). If Google’s consent message reports a decision there, a choice stored in our window is deleted as well.</p>
<p>Google’s consent platform has priority: as soon as it displays its message, only that message counts and our window closes. As soon as it reports a decision, or reports that the GDPR does not apply to your visit, only that counts, our window is no longer shown and a choice stored in it is deleted; visitors to whom the GDPR does not apply are then treated as described in the next section. If Google’s consent platform reports that you have not consented to analytics, the Google Analytics cookies are deleted, even if you never used our window. If your browser sends a Global Privacy Control signal, Google Analytics stays off and the window does not appear by itself; via “Privacy settings” it only explains this. Visitors in U.S. states: a U.S. opt-out reported by Google’s consent platform (including a GPP or Global Privacy Control signal) keeps Google Analytics off, whatever was chosen in the window; the window does not sell or share personal information and enables no advertising.</p>
<h2 id="analytics">Google Analytics 4</h2>
<p>We use Google Analytics 4 (property ${SITE.ga}; Google Ireland Limited / Google LLC) to understand which guides and tools are used, so that we can improve them. Google Analytics is switched off by default. In the EEA, the UK and Switzerland it is loaded only after you have consented in the consent message to storing and accessing information on your device (TCF purpose 1), to Google as a vendor, and to analytics storage – or, while Google’s consent message is not displayed, after you have chosen “Allow” in our <a href="#stats-window">interim statistics window</a>. Outside these regions it is loaded only if the consent platform reports analytics storage as granted or not requiring consent and has confirmed that you have not opted out under a U.S. state privacy law; if any of these signals is missing or unclear, Google Analytics stays off. When you withdraw consent via “Privacy settings”, Consent Mode is set back to “denied” and Google Analytics is switched off on the page immediately. Google signals and ad personalization are switched off. Google Analytics 4 does not log or store IP addresses. Event data is kept for the retention period set in our Google Analytics property. Legal basis: your consent (Art. 6(1)(a) GDPR). Transfers to Google LLC in the USA are based on the EU–U.S. Data Privacy Framework.</p>
<h2 id="fonts">Fonts and other resources</h2>
<p>The fonts Chakra Petch, IBM Plex Sans and JetBrains Mono are served from this website itself. Apart from the Google advertising, consent and analytics scripts described above, no scripts, stylesheets or fonts are loaded from other servers.</p>
<h2 id="email">Email</h2>
<p>If you email us, we use your email address and message only to answer you and delete them once they are no longer needed for that purpose, unless statutory retention obligations apply (Art. 6(1)(b) and (f) GDPR).</p>
<h2 id="rights">Your rights</h2>
<p>You have the right of access (Art. 15 GDPR), rectification (Art. 16), erasure (Art. 17), restriction of processing (Art. 18), data portability (Art. 20) and the right to object to processing based on legitimate interests (Art. 21). You can withdraw consent at any time with effect for the future. Because we do not store personal data about visitors ourselves, most requests concern Google; Google’s own controls are available at <a href="https://myaccount.google.com/data-and-privacy" rel="noopener">myaccount.google.com</a>.</p>
<p>You have the right to lodge a complaint with a supervisory authority. In Austria this is the Datenschutzbehörde (Austrian Data Protection Authority), Barichgasse 40–42, 1030 Vienna, <a href="mailto:dsb@dsb.gv.at">dsb@dsb.gv.at</a>, <a href="https://www.dsb.gv.at/" rel="noopener">www.dsb.gv.at</a>. You can also contact the authority in your country of residence.</p>
<h2 id="us">Notice for residents of U.S. states</h2>
<p>Some U.S. state privacy laws, such as the California Consumer Privacy Act as amended by the California Privacy Rights Act, may treat the use of advertising cookies for cross-context behavioral advertising as a “sale” or “sharing” of personal information. Where such laws apply, Google’s consent platform offers an option to opt out (“Do Not Sell or Share My Personal Information”), which you can reopen at any time via “Privacy settings”. We do not sell personal information in any other way and do not knowingly collect personal information from children under 16.</p>
<h2 id="changes">Changes to this policy</h2>
<p>We update this policy when the services used on this website change. The date below shows the current version.</p>`)
  }
];

export const NOT_FOUND = {
  path: '/404.html',
  title: 'Page not found – Patch Play Guide',
  description: 'The page you were looking for does not exist on patchplayguide.com. Use the links to reach the tools, the guides or the home page.',
  body: `<article class="doc"><p class="kicker">Error 404</p><h1>This page does not exist</h1>
<p class="lede">The address may be mistyped, or the page has moved during our rebuild in November 2026.</p>
<ul><li><a href="/">Home</a></li><li><a href="/guides/">All guides</a></li><li><a href="/tools/patch-decoder/">Patch Decoder</a></li><li><a href="/tools/settings-translator/">Settings Translator</a></li><li><a href="/tools/bottleneck-finder/">Bottleneck Finder</a></li></ul></article>`
};

// old single-page site → new pages (noindex + canonical + meta refresh, never to "/")
export const OLD_URLS = [
  ['/about.html', '/about/'],
  ['/imprint.html', '/imprint/'],
  ['/privacy.html', '/privacy/'],
  ['/advertise.html', '/contact/'],
  ['/contact.html', '/contact/']
];
