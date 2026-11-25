/* ============================================================================
   compat.js — keeps the academy looking right on older Safari (macOS Big Sur /
   Monterey era, Safari < 16.2) that does not understand CSS color-mix().

   Why: core/styles.css uses color-mix() ~200 times (tints of the brand accent).
   A browser without it DROPS each of those declarations, so backgrounds, borders
   and highlights vanish and the app looks broken. Modern browsers return at the
   first line and this file costs nothing.

   How: fetch the same-origin stylesheets as text, replace every
   color-mix(in srgb, A p%, B q%) with the rgba() it computes to (var()s resolved
   against :root, where brandkit.js sets the theme), and append the rewritten CSS
   after the original so the cascade order is unchanged.
   ========================================================================== */
(function () {
  var supported = false;
  try { supported = !!(window.CSS && CSS.supports && CSS.supports('color', 'color-mix(in srgb, red 50%, blue)')); } catch (e) {}
  if (supported && !window.__forceColorMixPolyfill) return;

  var probe;
  function rootVar(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }
  function resolveVars(s, depth) {
    depth = depth || 0;
    if (depth > 8) return s;
    return s.replace(/var\(\s*(--[\w-]+)\s*(?:,\s*([^()]*(?:\([^()]*\))?[^()]*))?\)/g, function (_, n, fb) {
      var v = rootVar(n); return resolveVars(v || (fb || '').trim(), depth + 1);
    });
  }
  function toRGBA(c) {
    c = resolveVars(c.trim());
    if (/^color-mix\(/i.test(c)) c = mix(c);
    if (!probe) { probe = document.createElement('i'); probe.style.display = 'none'; document.documentElement.appendChild(probe); }
    probe.style.color = ''; probe.style.color = c;
    if (!probe.style.color) return null;
    var m = getComputedStyle(probe).color.match(/[\d.]+/g);
    if (!m) return null;
    return [+m[0], +m[1], +m[2], m[3] == null ? 1 : +m[3]];
  }
  /* split the arguments of a function at top-level commas */
  function args(s) {
    var out = [], depth = 0, cur = '';
    for (var i = 0; i < s.length; i++) {
      var ch = s[i];
      if (ch === '(') depth++; else if (ch === ')') depth--;
      if (ch === ',' && depth === 0) { out.push(cur); cur = ''; } else cur += ch;
    }
    out.push(cur); return out.map(function (x) { return x.trim(); });
  }
  function part(p) {   /* "var(--accent) 38%" → {c, pct} */
    var m = p.match(/^(.*?)(?:\s+([\d.]+)%)?$/);
    return { c: m[1], pct: m[2] == null ? null : +m[2] };
  }
  function mix(expr) {
    var inner = expr.slice(expr.indexOf('(') + 1, expr.lastIndexOf(')'));
    var a = args(inner);   /* ["in srgb", "A p%", "B q%"] */
    if (a.length < 3) return expr;
    var A = part(a[1]), B = part(a[2]);
    var p1 = A.pct, p2 = B.pct;
    if (p1 == null && p2 == null) { p1 = 50; p2 = 50; }
    else if (p1 == null) p1 = 100 - p2;
    else if (p2 == null) p2 = 100 - p1;
    var sum = p1 + p2; if (!sum) return 'transparent';
    var alphaMul = sum < 100 ? sum / 100 : 1;
    p1 /= sum; p2 /= sum;
    var c1 = toRGBA(A.c), c2 = toRGBA(B.c);
    if (!c1 || !c2) return expr;
    /* premultiplied-alpha interpolation, as the spec does */
    var a1 = c1[3], a2 = c2[3], al = a1 * p1 + a2 * p2;
    function ch(i) { return al ? (c1[i] * a1 * p1 + c2[i] * a2 * p2) / al : 0; }
    var r = Math.round(ch(0)), g = Math.round(ch(1)), b = Math.round(ch(2));
    return 'rgba(' + r + ',' + g + ',' + b + ',' + +(al * alphaMul).toFixed(4) + ')';
  }
  /* replace every color-mix(...) in a CSS text, innermost first */
  function rewrite(css) {
    var guard = 0, i;
    while ((i = css.lastIndexOf('color-mix(')) !== -1 && guard++ < 5000) {
      var depth = 0, j = i + 'color-mix'.length;
      for (; j < css.length; j++) { if (css[j] === '(') depth++; else if (css[j] === ')') { depth--; if (!depth) break; } }
      var expr = css.slice(i, j + 1), val = mix(expr);
      if (val === expr) val = 'transparent';   /* unresolvable: never leave the unsupported function in place */
      css = css.slice(0, i) + val + css.slice(j + 1);
    }
    return css;
  }
  function run() {
    var links = [].slice.call(document.querySelectorAll('link[rel="stylesheet"]')).filter(function (l) {
      try { return new URL(l.href, location.href).origin === location.origin; } catch (e) { return false; }
    });
    links.forEach(function (l) {
      fetch(l.href).then(function (r) { return r.ok ? r.text() : ''; }).then(function (css) {
        if (!css || css.indexOf('color-mix(') === -1) return;
        var st = document.createElement('style');
        st.setAttribute('data-compat', 'color-mix');
        /* relative url(...) inside the sheet must keep resolving from the sheet's own folder */
        var base = l.href.replace(/[^/]*(\?.*)?$/, '');
        st.textContent = rewrite(css).replace(/url\((['"]?)(?!data:|https?:|\/)([^'")]+)\1\)/g, function (_, q, u) { return 'url(' + q + base + u + q + ')'; });
        l.parentNode.insertBefore(st, l.nextSibling);
      }).catch(function () {});
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  window.__colorMixPolyfill = { mix: mix, rewrite: rewrite };
})();
