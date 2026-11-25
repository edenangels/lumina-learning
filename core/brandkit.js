/* ============================================================================
   CORE · brand loader  (part of the shared product — no client data lives here)
   ----------------------------------------------------------------------------
   Instances register themselves into window.EdenBrands (see brands/<id>/brand.js,
   loaded BEFORE this). This loader picks the active brand by hostname (with a
   ?brand=<id> override for local/preview), then applies its theme + <head>
   identity before first paint. Everything else — the whole app — is brand-blind
   and reads window.BRAND. Fix once here, every client inherits it.
============================================================================ */
(function () {
  const REG = window.EdenBrands || {};
  const host = location.hostname;
  const override = new URLSearchParams(location.search).get('brand');
  const key =
       (override && REG[override] && override)
    || Object.keys(REG).find(k => (REG[k].hostnames || []).includes(host))
    || Object.keys(REG)[0];                       /* default: the only registered brand */

  const B = REG[key] || {};
  window.BRAND = B;

  /* ---- theme tokens (inline on :root — beats any stylesheet, no flash) ---- */
  const rs = document.documentElement.style;
  for (const k in (B.theme || {})) rs.setProperty(k, B.theme[k]);

  /* ---- contrast gate ----------------------------------------------------
     The primary action surface is derived from the tenant's --accent-2, but the
     text ON it used to be a fixed dark green. That is fine for a sage or amber
     tenant and unreadable for a dark one: measured 1.64:1 on a corporate navy
     and 1.59:1 on a deep purple — an unreadable primary button on every screen
     of a product sold on EU accessibility compliance. Pick the on-colour from
     the accent's own luminance instead, and say so out loud when a tenant ships
     a token pair that cannot pass AA whatever we do. */
  const _rgb = c => {
    c = String(c || '').trim();
    let m = c.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (m) { let h = m[1]; if (h.length === 3) h = h.split('').map(x => x + x).join('');
      return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); }
    m = c.match(/rgba?\(([^)]+)\)/i);
    return m ? m[1].split(',').slice(0, 3).map(v => parseFloat(v)) : null;
  };
  const _lum = rgb => rgb.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); })
    .reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
  const _ratio = (a, b) => { const L1 = _lum(a), L2 = _lum(b); return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05); };
  const th = B.theme || {};
  const cta = _rgb(th['--accent-2']);
  if (cta) {
    const dark = [23, 33, 26], light = [247, 246, 241];
    const onCta = _ratio(cta, dark) >= _ratio(cta, light) ? dark : light;
    rs.setProperty('--on-cta', 'rgb(' + onCta.join(',') + ')');
    const best = Math.max(_ratio(cta, dark), _ratio(cta, light));
    if (best < 4.5) console.warn('[brandkit] --accent-2 ' + th['--accent-2'] + ' reaches only ' +
      best.toFixed(2) + ':1 against its best on-colour — below WCAG AA (4.5:1) for the primary action.');
  }
  const bg = _rgb(th['--bg']), acc = _rgb(th['--accent']);
  if (bg && acc && _ratio(acc, bg) < 4.5) console.warn('[brandkit] --accent ' + th['--accent'] +
    ' on --bg ' + th['--bg'] + ' is ' + _ratio(acc, bg).toFixed(2) + ':1 — below WCAG AA for text.');
  if (B.fonts) { rs.setProperty('--font-display', B.fonts.display); rs.setProperty('--font-body', B.fonts.body); }
  if (B.id) document.documentElement.setAttribute('data-brand', B.id);

  /* ---- <head> identity (title, metas, favicon, fonts) -------------------- */
  const meta = (sel, attr, val) => { const el = document.querySelector(sel); if (el && val != null) el.setAttribute(attr, val); };
  if (B.title || B.academy) document.title = B.title || (B.academy + ' — ' + (B.tagline || ''));
  meta('meta[name="theme-color"]', 'content', B.themeColor);
  meta('meta[property="og:title"]', 'content', B.title);
  meta('meta[property="og:description"]', 'content', B.ogDesc);
  meta('meta[property="og:url"]', 'content', B.domain ? 'https://' + B.domain + '/' : null);
  meta('meta[property="og:image"]', 'content', B.ogImage);
  meta('meta[name="twitter:title"]', 'content', B.academy);
  meta('meta[name="twitter:description"]', 'content', B.twDesc);
  meta('meta[name="twitter:image"]', 'content', B.ogImage);
  const fav = document.querySelector('link[rel="icon"]'); if (fav && B.favicon) fav.setAttribute('href', B.favicon);
  const fl = document.getElementById('brandFonts');
  /* compare without the ?v= cache-buster: index.html already links this file,
     and swapping in the bare URL fetched and parsed it a second time */
  if (fl && B.fonts && B.fonts.link && (fl.getAttribute('href') || '').split('?')[0] !== B.fonts.link.split('?')[0]) fl.setAttribute('href', B.fonts.link);

  /* ---- logo + wordmark (body elements — after DOM is ready) --------------
     Wordmark text is always applied (reproduces the founding brand exactly);
     the logo SVG is only swapped when a brand ships its own `logoSvg`. */
  const applyMark = () => {
    const nm = B.wordName || B.name;
    if (nm) document.querySelectorAll('.er-name').forEach(e => { e.textContent = nm.toUpperCase(); });
    document.querySelectorAll('.er-sub').forEach(e => { e.textContent = B.wordSub || 'Academy'; });
    if (B.logoSvg) document.querySelectorAll('.logo-mark').forEach(e => { e.innerHTML = B.logoSvg; });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyMark);
  else applyMark();
})();
