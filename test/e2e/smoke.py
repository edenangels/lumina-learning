#!/usr/bin/env python3
"""End-to-end smoke test for EdenRise Academy — run it before every deploy.

    python3 test/e2e/smoke.py http://localhost:8080/                 # phone width (390), English
    python3 test/e2e/smoke.py https://edenrise-academy.pages.dev/ 1280 pt

Walks, as a guest: sign-in card → onboarding (name, department, goal) → home →
play the first lesson → finish it → takeaways → the two questions → result → Continue →
reels → library → My learning. Prints each check, saves screenshots to test/e2e/shots/,
exits 1 if anything fails or the browser logs an error.

Needs: pip install playwright && playwright install chromium   (or Google Chrome installed)
"""
import sys, os
from playwright.sync_api import sync_playwright

B = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:8080/'
W = int(sys.argv[2]) if len(sys.argv) > 2 else 390
L = sys.argv[3] if len(sys.argv) > 3 else 'en'
SHOTS = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'shots'); os.makedirs(SHOTS, exist_ok=True)
FAILS = []

def check(name, ok, got=''):
    print(('  ok  ' if ok else 'FAIL  ') + name, '' if ok else got, flush=True)
    if not ok: FAILS.append(name)

with sync_playwright() as p:
    ENGINE = os.environ.get('E2E_BROWSER', 'chromium')   # chromium | webkit (Safari's engine) | firefox
    if ENGINE != 'chromium': b = getattr(p, ENGINE).launch()
    else:
        try: b = p.chromium.launch()
        except Exception: b = p.chromium.launch(channel='chrome')   # Playwright's own browser missing → installed Chrome
    c = b.new_context(viewport={'width': W, 'height': 844}, service_workers='block')
    if L == 'pt':
        c.add_init_script("localStorage.getItem('edenrise-state-v2')||localStorage.setItem('edenrise-state-v2',JSON.stringify({lang:'pt'}))")
    pg = c.new_page(); pg.set_default_timeout(10000); errs = []
    VIMEO_NOISE = 'player.vimeo.com" from accessing a frame'
    EXTERNAL = ('opentimestamps.org', 'net::ERR_FAILED')   # public timestamp calendars: best-effort, outages are not ours   # Safari: Vimeo's own frame probing its parent; not ours, harmless
    pg.on('pageerror', lambda e: (None if VIMEO_NOISE in str(e) else errs.append('PAGEERR ' + str(e)[:200])))
    pg.on('console', lambda m: errs.append('CONSOLE ' + m.text[:160]) if m.type == 'error' and not any(x in m.text for x in EXTERNAL) and 'ERR_NETWORK' not in m.text else None)

    pg.goto(B + '#/home'); pg.wait_for_timeout(4000)
    g = pg.query_selector('#authGuest')
    check('sign-in card shows', bool(g and g.is_visible()))
    pg.screenshot(path=f'{SHOTS}/1-signin-{L}-{W}.png')
    if g and g.is_visible(): g.click(); pg.wait_for_timeout(2500)

    check('onboarding opens', pg.evaluate("!!document.querySelector('#onboard.open')"))
    if pg.query_selector('#obUsername'): pg.fill('#obUsername', 'maria')
    pg.click('#onboard .ob-option >> nth=0'); pg.click('#obNext'); pg.wait_for_timeout(500)
    pg.click('#onboard .ob-option >> nth=0'); pg.click('#obNext'); pg.wait_for_timeout(7000)
    pg.evaluate("document.querySelector('#tourOv') && endTour()")
    check('path built', pg.evaluate("S.onboarded && (S.path||[]).length > 0"))
    pg.screenshot(path=f'{SHOTS}/2-home-{L}-{W}.png')

    pg.click('[data-action=play] >> nth=0'); pg.wait_for_timeout(3000)
    check('a lesson plays', pg.evaluate("typeof playing !== 'undefined' && !!(playing && playing.courseId)"))
    cid, mod = pg.evaluate("[playing.courseId, playing.mod]")
    pg.evaluate(f"completeModule('{cid}',{mod})"); pg.wait_for_timeout(1500)
    check('takeaways after the lesson', bool(pg.query_selector('#takeModal')) and pg.is_visible('#takeModal'))
    pg.evaluate("(()=>{const b=document.querySelector('#takeModal [data-action=take-go]')||[...document.querySelectorAll('#takeModal button')].find(b=>b.offsetParent&&/btn-primary/.test(b.className));b&&b.click()})()")
    pg.wait_for_timeout(1500)
    n = pg.evaluate("new Set([...document.querySelectorAll('#ckOv .q-opt')].map(e=>e.dataset.q)).size")
    check('questions after the lesson', n > 0, n)
    for qi in range(n): pg.click(f'#ckOv .q-opt[data-q="{qi}"] >> nth=0')
    pg.screenshot(path=f'{SHOTS}/3-questions-{L}-{W}.png')
    pg.click('#mcGo'); pg.wait_for_timeout(1000)
    check('result shows', 'RESULT' in pg.evaluate("document.querySelector('#ckOv').innerText.toUpperCase()") or 'RESULTADO' in pg.evaluate("document.querySelector('#ckOv').innerText.toUpperCase()"))
    pg.click('#mcDone'); pg.wait_for_timeout(2000)
    pg.evaluate("typeof closePlayer === 'function' && closePlayer()"); pg.wait_for_timeout(800)

    pg.evaluate("location.hash='#/reels'"); pg.wait_for_timeout(3500)
    check('reels load', pg.evaluate("document.querySelectorAll('article.reel').length") > 0)
    pg.screenshot(path=f'{SHOTS}/4-reels-{L}-{W}.png')
    pg.evaluate("document.querySelector('.reel-x') && document.querySelector('.reel-x').click()"); pg.wait_for_timeout(800)

    pg.evaluate("location.hash='#/library'"); pg.wait_for_timeout(2000)
    check('library lists courses', pg.evaluate("document.querySelectorAll('[data-action=open-course]').length") > 0)
    pg.evaluate("location.hash='#/me'"); pg.wait_for_timeout(2000)
    check('My learning opens', pg.evaluate("location.hash") == '#/me')
    pg.screenshot(path=f'{SHOTS}/5-me-{L}-{W}.png')
    overflow = pg.evaluate("document.documentElement.scrollWidth - innerWidth")
    check('no sideways scroll', overflow <= 1, f'{overflow}px')

    check('no browser errors', not errs, errs)
    b.close()

print('\nPASS' if not FAILS else '\nFAILED: ' + ', '.join(FAILS))
sys.exit(1 if FAILS else 0)
