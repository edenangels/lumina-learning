/* EdenRise Academy — offline app shell + cached art
   Strategy: network-first for code/HTML (updates always win, cache is the
   offline fallback); cache-first for media/fonts (immutable-ish). */
const VERSION = 'edenrise-v202';
const CORE = ['./', './index.html', './brands/edenrise/brand.js', './brands/_example/brand.js', './core/brandkit.js', './core/ots.js', './core/styles.css', './fonts/fonts.css', './core/app.js', './core/landflow.js', './vendor/gsap.min.js', './vendor/ScrollTrigger.min.js', './brands/edenrise/content.js', './data.js', './manifest.json', './favicon.svg', './icon-192.png', './icon-512.png', './og-image.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => Promise.allSettled(CORE.map(u => c.add(u)))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  /* same-origin media (covers, posters, icons) → cache-first */
  if (url.origin === location.origin && /\.(jpg|jpeg|png|svg|webp|avif|woff2)$/.test(url.pathname)) {
    e.respondWith(
      caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
        return res;
      }))
    );
    return;
  }

  /* same-origin shell (html/js/css/json) → network-first, cache fallback */
  if (url.origin === location.origin && (req.mode === 'navigate' || /\.(js|css|json|html)$/.test(url.pathname) || url.pathname.endsWith('/'))) {
    e.respondWith(
      fetch(req).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => caches.match(req, { ignoreSearch: true }).then(hit => hit || (req.mode === 'navigate' ? caches.match('./index.html', { ignoreSearch: true }) : undefined)))
    );
    return;
  }

  /* google fonts → cache-first (stable urls) */
  if (/fonts\.(googleapis|gstatic)\.com/.test(url.host)) {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
        return res;
      }))
    );
  }
  /* everything else (Firebase, Vimeo, APIs) → straight to network */
});
/* the page asks the waiting worker to take over (update toast) */
self.addEventListener('message', e => { if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting(); });
