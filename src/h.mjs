// Small authoring helpers for guide and tool content (tables and figures).
export function tbl(caption, head, rows, note) {
  return `<div class="tbl" role="region" aria-label="${caption.replace(/<[^>]+>/g, '').replace(/"/g, '&quot;')}" tabindex="0"><table><caption>${caption}</caption><thead><tr>${head.map((h) => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c, i) => i === 0 ? `<th scope="row">${c}</th>` : `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>${note ? `<p class="small">${note}</p>` : ''}`;
}
export function fig(id, title, inner, caption, vb = '0 0 640 260') {
  return `<figure class="fig"><div class="fig-scroll" tabindex="0" role="group" aria-label="Diagram, scrolls sideways on small screens"><svg viewBox="${vb}" role="img" aria-labelledby="${id}-t"><title id="${id}-t">${title}</title>${inner}</svg></div><figcaption>${caption}</figcaption></figure>`;
}
// level words used in tables: 0..3
export const LV = ['minimal', 'low', 'moderate', 'high'];
// "Try it with your values" box: links a guide to the matching tool, usually with the example preloaded.
export function tryBox(text, href, label) {
  return `<aside class="try"><p><b>Try it with your values.</b> ${text}</p><p><a class="btn btn-primary" href="${href.replace(/&(?!amp;)/g, '&amp;')}">${label}</a></p></aside>`;
}
// source entry with the date it was read (all sources added in the November 18, 2026 revision)
export const src = (label, url, note) => [label, url, (note ? note + '; ' : '') + 'accessed November 18, 2026'];
// official page that could not be opened from the build environment: the passage comes from a search-engine extract (same wording as the name map)
export const srcX = (label, url, note) => [label, url, (note ? note + '; ' : '') + 'checked on November 18, 2026 via search excerpts of the official page; wording may differ'];
// official documents used across several pages
const GH = 'https://github.com/';
export const SRC = {
  dlss: src('NVIDIA – DLSS Super Resolution Programming Guide 310.6.0', GH + 'NVIDIA/DLSS/blob/main/doc/DLSS_Programming_Guide_Release.pdf', 'scaling ratios per mode, memory table'),
  dlssg: src('NVIDIA – Streamline programming guide for DLSS Frame Generation', GH + 'NVIDIA-RTX/Streamline/blob/main/docs/ProgrammingGuideDLSS_G.md', 'requirements, cost and memory tables, multi frame generation'),
  reflex: src('NVIDIA – Streamline programming guide for Reflex', GH + 'NVIDIA-RTX/Streamline/blob/main/docs/ProgrammingGuideReflex.md', 'modes Off, On, On + Boost'),
  fsr: src('AMD – FidelityFX Super Resolution 3.1.6 upscaler documentation', GH + 'GPUOpen-LibrariesAndSDKs/FidelityFX-SDK/blob/main/Kits/FidelityFX/docs/techniques/super-resolution-upscaler.md', 'scaling modes, memory table'),
  fsr4: src('AMD – FSR Upscaling 4.1.2 documentation', GH + 'GPUOpen-LibrariesAndSDKs/FidelityFX-SDK/blob/main/Kits/FidelityFX/docs/techniques/super-resolution-ml.md', 'scaling modes, supported hardware, memory table'),
  fsrfg: src('AMD – FSR Frame Generation documentation (3.1.6 and 4.0.2)', GH + 'GPUOpen-LibrariesAndSDKs/FidelityFX-SDK/blob/main/Kits/FidelityFX/docs/techniques/frame-interpolation.md', 'memory use per output resolution'),
  fsrsc: src('AMD – FSR Frame Generation swapchain documentation', GH + 'GPUOpen-LibrariesAndSDKs/FidelityFX-SDK/blob/main/Kits/FidelityFX/docs/techniques/frame-interpolation-swap-chain.md', 'frame pacing, V-Sync and VRR behavior'),
  al2: src('AMD – Anti-Lag 2 SDK', GH + 'GPUOpen-LibrariesAndSDKs/AntiLag2-SDK', 'difference between driver-based Anti-Lag and Anti-Lag 2'),
  xess: src('Intel – XeSS Super Resolution Developer Guide', GH + 'intel/xess/blob/main/doc/xess_sr_developer_guide_english.md', 'preset scale factors for XeSS 1.3+ and earlier versions'),
  xessfg: src('Intel – XeSS Frame Generation Developer Guide', GH + 'intel/xess/blob/main/doc/xess_fg_developer_guide_english.md', 'input frame-rate targets, requirements'),
  xell: src('Intel – Xe Low Latency (XeLL) Developer Guide', GH + 'intel/xess/blob/main/doc/xell_developer_guide_english.md'),
  pm: src('Intel – PresentMon console application, CSV columns', GH + 'GameTechDev/PresentMon/blob/main/README-ConsoleApplication.md', 'definitions of MsBetweenPresents, MsGPUBusy and other columns'),
  psres: srcX('PlayStation Support – How to change PS5 console resolution', 'https://www.playstation.com/en-us/support/hardware/ps5-4k-resolution-guide/', 'Video Output settings: 120 Hz output, VRR'),
  psvrr: srcX('PlayStation Blog – Variable Refresh Rate support for PS5', 'https://blog.playstation.com/2022/04/25/variable-refresh-rate-support-for-ps5-is-rolling-out-this-week/'),
  pspresets: srcX('PlayStation Support – How to customize game presets on PS5 consoles', 'https://www.playstation.com/en-us/support/games/how-to-customize-game-presets-on-ps5-consoles/'),
  pssr: srcX('PlayStation Blog – Upgraded PSSR upscaler is coming to PS5 Pro', 'https://blog.playstation.com/2026/02/27/upgraded-pssr-upscaler-is-coming-to-ps5-pro/'),
  xb120: srcX('Xbox Support – Set up 4K gaming at 120 Hz on Xbox Series X', 'https://support.xbox.com/en-US/help/hardware-network/display-sound/4k-gaming-at-120hz'),
  xbtv: srcX('Xbox Support – How to change the TV display settings on your Xbox', 'https://support.xbox.com/en-US/help/hardware-network/display-sound/change-tv-display-resolution'),
  ninspecs: srcX('Nintendo – Nintendo Switch 2 tech specs', 'https://www.nintendo.com/us/gaming-systems/switch-2/tech-specs/'),
  ninset: srcX('Nintendo Support – Nintendo Switch 2 System Settings overview', 'https://www.nintendo.com/en-gb/Support/Nintendo-Switch-2/Nintendo-Switch-2-System-Settings-Overview-2892722.html'),
  deck: srcX('Valve – Steam Deck tech specs', 'https://www.steamdeck.com/en/tech', 'screen, refresh rate and battery capacity of both models'),
  freesync: srcX('AMD – AMD FreeSync Technology', 'https://www.amd.com/en/products/graphics/technologies/freesync.html', 'tier requirements'),
  msrefresh: srcX('Microsoft Support – Change the refresh rate on your monitor in Windows', 'https://support.microsoft.com/en-us/windows/hardware/display-graphics/change-the-refresh-rate-on-your-monitor-in-windows')
};
SRC.bc = srcX('Microsoft Learn – Texture block compression in Direct3D 11', 'https://learn.microsoft.com/en-us/windows/win32/direct3d11/texture-block-compression-in-direct3d-11', 'bytes per 4×4 pixel block for BC1 to BC7');
SRC.afmf = srcX('AMD – AMD Fluid Motion Frames', 'https://www.amd.com/en/products/software/adrenalin/afmf.html', 'requirements of the driver-level feature');
SRC.smooth = srcX('NVIDIA – NVIDIA app update: Smooth Motion for GeForce RTX 40 Series', 'https://www.nvidia.com/en-us/geforce/news/nvidia-app-global-dlss-overrides-rtx-40-series-smooth-motion/');
SRC.fsrfg4 = src('AMD – FSR Frame Generation 4.0.2 documentation', 'https://github.com/GPUOpen-LibrariesAndSDKs/FidelityFX-SDK/blob/main/Kits/FidelityFX/docs/techniques/frame-interpolation-ml.md', 'memory use per output resolution');
SRC.fsrsdk = src('AMD – FSR SDK 2.4.0 (README)', 'https://github.com/GPUOpen-LibrariesAndSDKs/FidelityFX-SDK', 'list of techniques, including FSR Ray Regeneration');
SRC.dlssrr = src('NVIDIA – Streamline programming guide for DLSS Ray Reconstruction', 'https://github.com/NVIDIA-RTX/Streamline/blob/main/docs/ProgrammingGuideDLSS_RR.md');
SRC.ninfeat = srcX('Nintendo – Nintendo Switch 2 system features and play modes', 'https://www.nintendo.com/us/gaming-systems/switch-2/features/');
SRC.xbwire = srcX('Xbox Wire – You’re Ready to Power Your Dreams – Is Your TV?', 'https://news.xbox.com/en-us/2020/11/06/is-your-tv-ready-to-power-your-dreams/', 'Video modes, variable refresh rate');

// ---- helpers for dated revisions of an existing guide ----
/** Insert a section after the section whose h2 has the given id. */
export function addAfter(g, id, html) {
  const i = g.sections.findIndex((s) => s.includes(`<h2 id="${id}">`));
  if (i === -1) throw new Error(`${g.slug}: no section #${id}`);
  g.sections.splice(i + 1, 0, html);
}
/** Replace the whole section with the given h2 id. */
export function replaceSection(g, id, html) {
  const i = g.sections.findIndex((s) => s.includes(`<h2 id="${id}">`));
  if (i === -1) throw new Error(`${g.slug}: no section #${id}`);
  g.sections[i] = html;
}
/** Replace one exact piece of text in the lede or a section; fails loudly when it is not there. */
export function swap(g, from, to) {
  if (g.lede.includes(from)) { g.lede = g.lede.replace(from, to); return; }
  const i = g.sections.findIndex((s) => s.includes(from));
  if (i === -1) throw new Error(`${g.slug}: text not found: ${from.slice(0, 50)}`);
  g.sections[i] = g.sections[i].replace(from, to);
}
/** Log a revision: change-log entry (sets "Reviewed" and dateModified) and sources placed first. */
export function revise(g, iso, note, sources = []) {
  g.changelog = [...(g.changelog || [['2026-11-02', 'First published.']]), [iso, note]];
  g.sources = [...sources, ...g.sources];
}
