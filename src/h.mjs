// Small authoring helpers for guide and tool content (tables and figures).
export function tbl(caption, head, rows, note) {
  return `<div class="tbl" role="region" aria-label="${caption.replace(/<[^>]+>/g, '').replace(/"/g, '&quot;')}" tabindex="0"><table><caption>${caption}</caption><thead><tr>${head.map((h) => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c, i) => i === 0 ? `<th scope="row">${c}</th>` : `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>${note ? `<p class="small">${note}</p>` : ''}`;
}
export function fig(id, title, inner, caption, vb = '0 0 640 260') {
  return `<figure class="fig"><div class="fig-scroll" tabindex="0" role="group" aria-label="Diagram, scrolls sideways on small screens"><svg viewBox="${vb}" role="img" aria-labelledby="${id}-t"><title id="${id}-t">${title}</title>${inner}</svg></div><figcaption>${caption}</figcaption></figure>`;
}
// level words used in tables: 0..3
export const LV = ['minimal', 'low', 'moderate', 'high'];
