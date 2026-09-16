/* ============ Academy core — Firebase auth + per-profile cloud sync ============
   Loads the Firebase modular SDK from the gstatic CDN (no build step). Handles
   Google + email/password sign-in, stores each learner's state under users/{uid}
   in Firestore, and bridges to app.js via window.EdenApp / window.EdenCloud.        */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import {
  getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence, indexedDBLocalPersistence,
  GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile,
  sendPasswordResetEmail, sendEmailVerification, deleteUser
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager, doc, getDoc, getDocs, setDoc, serverTimestamp, collection, addDoc, updateDoc, deleteDoc, onSnapshot, query, where, increment, arrayUnion, arrayRemove, orderBy, limit } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

/* Firebase project comes from the active brand (brandkit.js). Each instance
   points at its OWN project.

   THE FALLBACK FAILS CLOSED — ON PURPOSE. In the founding repo this fell back
   to EdenRise's live project with a real API key, so an instance whose
   brand.js was missing or mistyped would silently read and write EdenRise's
   Firestore, with EdenRise's staff as its superadmins. Cross-tenant leakage
   should never be the default branch. A PLACEHOLDER key trips BACKEND_READY
   below and the app runs in honest guest-only preview until a real project is
   wired — which is also exactly the state a new client should ship in. */
const firebaseConfig = (window.BRAND && window.BRAND.firebase) || {
  apiKey: 'PLACEHOLDER_NOT_CONFIGURED',
  authDomain: '', projectId: '', storageBucket: '',
  messagingSenderId: '', appId: ''
};

/* A white-label brand ships with a PLACEHOLDER Firebase key until its own
   project is stood up (see brands/<id>/brand.js). Detect that so the app
   degrades to an honest guest-only state — a returning learner tapping
   "Sign in" should never hit a raw Firebase error like
   `auth/api-key-not-valid`. This makes "not wired yet" a designed state, not a
   crash, and it is the same guard every future client benefits from. */
const BACKEND_READY = (() => {
  const k = firebaseConfig && firebaseConfig.apiKey;
  if (!k || k.length < 20) return false;
  return !/DEMO|PLACEHOLDER|YOUR_?API|TODO|XXXX|CHANGE_?ME|EXAMPLE/i.test(k);
})();

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
let db;
try {   /* IndexedDB cache: repeat visits read state instantly, offline included */
  db = initializeFirestore(app, { localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) });
} catch (e) { db = getFirestore(app); }
/* Persist the session across app restarts. IndexedDB persistence survives best;
   fall back to localStorage. Returns a promise we await before any sign-in. */
const persistenceReady = setPersistence(auth, indexedDBLocalPersistence)
  .catch(() => setPersistence(auth, browserLocalPersistence)).catch(() => {});
/* Complete a Google redirect sign-in if we're returning from one (mobile/PWA flow). */
if (BACKEND_READY) getRedirectResult(auth).catch(() => {});

/* Must match app.js's STATE_KEY exactly — one origin can host several brands,
   so the saved state is namespaced per brand (the founding brand keeps the
   legacy key). Auth mode is namespaced for the same reason: signing in to one
   academy was marking every other academy on the origin as signed in. */
const BRAND_SLUG = (window.BRAND && window.BRAND.id) || 'app';
const KEY  = BRAND_SLUG + '-state-v2';
const MODE = (window.BRAND && window.BRAND.authModeKey) || (BRAND_SLUG + '-auth-mode');   // 'firebase' | 'guest' | 'out'
const $ = s => document.querySelector(s);
const T = k => (typeof window.t === 'function' ? window.t(k) : k);
const isPT = () => (typeof S !== 'undefined' && S.lang === 'pt');

/* ---------- gate visibility (driven by html[data-gate]) ---------- */
const gate = () => $('#authGate');
function showGate() { document.documentElement.setAttribute('data-gate', 'on'); }
function hideGate() { document.documentElement.setAttribute('data-gate', 'off'); }
function setBusy(on) { const b = $('#authBusy'); if (b) b.classList.toggle('on', on); }
function showErr(msg) { const e = $('#authErr'); if (e) { e.textContent = msg || ''; e.classList.toggle('on', !!msg); } }

/* ---------- state <-> Firestore ---------- */
function localState() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
/* ---- multi-tenant helpers ---- */
const SUPERADMINS = (window.BRAND && window.BRAND.superadmins) || [];   /* never inherit another tenant's admins */
/* The founding tenant of THIS deployment = the active brand. On the EdenRise
   project that is 'edenrise'; on a white-label's own project (e.g. Belong) new
   learners must be stamped with THEIR company, not the founding brand's. */
const BRAND_ID = (window.BRAND && window.BRAND.id) || 'app';
const cid = () => ((localState().profile || {}).companyId) || BRAND_ID;
const isSuperEmail = e => SUPERADMINS.includes((e || '').trim().toLowerCase());
const metaDocId = c => (c || cid()) === 'edenrise' ? '__meta' : '__meta_' + (c || cid());
/* legacy docs without companyId belong to 'edenrise' */
const ofCompany = (obj, c) => ((obj.companyId || BRAND_ID) === (c || cid()));
/* merge instead of clobber — earned things take the best of both devices */
function mergeStates(cloud, local) {
  if (!cloud) return local;
  if (!local || !local.onboarded) return cloud;
  const m = Object.assign({}, cloud);
  m.xp = Math.max(cloud.xp || 0, local.xp || 0);
  m.badges = [...new Set([...(cloud.badges || []), ...(local.badges || [])])];
  m.quizzesPassed = Math.max(cloud.quizzesPassed || 0, local.quizzesPassed || 0);
  m.streak = Math.max(cloud.streak || 0, local.streak || 0);
  m.lang = local.lang || cloud.lang;
  /* per-course: whichever device is further along wins; earliest completion date kept */
  const depth = p => !p ? -1 : (p.done ? 1000 : (p.mod || 0) * 10 + (p.pct || 0) / 10);
  m.progress = Object.assign({}, cloud.progress);
  Object.entries(local.progress || {}).forEach(([id, lp]) => {
    const cp = m.progress[id];
    if (depth(lp) > depth(cp)) m.progress[id] = lp;
    const da = [lp && lp.doneAt, cp && cp.doneAt].filter(Boolean);
    if (da.length && m.progress[id]) m.progress[id].doneAt = Math.min(...da);
  });
  /* notes: union, longer text wins per key */
  m.notes = Object.assign({}, local.notes);
  Object.entries(cloud.notes || {}).forEach(([k, v]) => { if (!m.notes[k] || String(v).length > String(m.notes[k]).length) m.notes[k] = v; });
  /* identity: cloud is source of truth, local fills gaps (e.g. fresh onboarding) */
  m.profile = Object.assign({}, local.profile, cloud.profile);
  if (local.profile && local.profile.notify) m.profile.notify = Object.assign({}, local.profile.notify, (cloud.profile || {}).notify);
  return m;
}
let pushTimer = null;
function stampProfileLocal(profile) {
  const s = localState(); s.profile = profile; localStorage.setItem(KEY, JSON.stringify(s));
}

/* ---------- bridge exposed to app.js ---------- */
window.EdenCloud = {
  push(state) {
    const u = auth.currentUser; if (!u) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(() => { pushTimer = null; window.EdenCloud.flush(); }, 800);
  },
  flush() {
    const u = auth.currentUser; if (!u) return;
    if (pushTimer) { clearTimeout(pushTimer); pushTimer = null; }
    const st = localState();
    /* tenant stamp FIRST, so it reaches the user-doc write below (it previously
       ran after setDoc had captured st — the stamp only ever hit the leaderboard) */
    const p = st.profile || {};
    if (!p.companyId) { p.companyId = BRAND_ID; st.profile = p; }
    /* top-level profile.companyId is what the rules' myCompany() reads — keep it in step */
    setDoc(doc(db, 'users', u.uid), { state: st, profile: { companyId: p.companyId }, updatedAt: serverTimestamp() }, { merge: true }).catch(() => {});
    const name = p.name || (p.email ? p.email.split('@')[0] : 'Learner');
    /* the row only changes when XP, streak, name or week fields change — a
       note typed or a question asked must not cost a leaderboard write */
    const rowKey = [name, p.username, st.xp, st.streak, p.dept, st.weekStart, st.weekBaseXp].join('|');
    if (window.EdenCloud._lastRowKey !== rowKey) { window.EdenCloud._lastRowKey = rowKey;
    setDoc(doc(db, 'leaderboard', u.uid), {
      name, username: p.username || '',
      initials: name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'ER',
      xp: st.xp || 0, streak: st.streak || 0, level: st.xp != null ? st.xp : 0,
      joinedAt: p.joinedAt || null, dept: p.dept || null, companyId: p.companyId || BRAND_ID,
      weekStart: st.weekStart || null, weekBaseXp: st.weekBaseXp || 0,
      lastSeen: serverTimestamp(), updatedAt: serverTimestamp()
    }, { merge: true }).catch(() => {}); }
    window.EdenCloud.syncLedger();
    window.EdenCloud.pullConfirmations();
  },
  /* ---- evidence ledger → server truth --------------------------------------
     Mirrors S.ledger events into users/{uid}/events (create-only rules) and pins
     the chain head into users/{uid}/anchors with a SERVER timestamp. Event doc
     id = event.id → idempotent across devices (an already-exists error means
     another device mirrored it first — that counts as synced). Fault-tolerant:
     while the create-only rules aren't deployed yet, permission-denied simply
     stops the batch and the cursor stays put — nothing is lost, retried on the
     next flush. Cursor lives OUTSIDE the state blob so syncing never mutates
     the chain it is syncing. */
  /* Mirror manager verdicts about ME into my own state, so my export can show
     them (as copies — the manager's chain remains the original). */
  async pullConfirmations() {
    if (window.__pullConfBusy) return; window.__pullConfBusy = true;
    try {
      const list = await window.EdenCloud.listConfirmations();
      if (!list.length) return;
      const st = localState();
      const have = new Set((st.confirmations || []).map(c => c.mgrEventHash));
      const add = list.filter(c => !have.has(c.mgrEventHash))
        .map(c => ({ learnerEventHash: c.learnerEventHash, courseId: c.courseId, verdict: c.verdict,
                     byName: c.byName || '', byUid: c.byUid, mgrEventHash: c.mgrEventHash, at: c.at }));
      if (!add.length) return;
      /* merge into a FRESH read and touch only this key — writing the stale
         full snapshot could clobber concurrent XP/progress writes */
      const fresh = localState();
      const have2 = new Set((fresh.confirmations || []).map(c => c.mgrEventHash));
      fresh.confirmations = (fresh.confirmations || []).concat(add.filter(c => !have2.has(c.mgrEventHash)));
      localStorage.setItem(KEY, JSON.stringify(fresh));
      if (window.S) { S.confirmations = st.confirmations; if (window.render) render(); }
    } catch (e) { /* not live yet — harmless */ }
    finally { window.__pullConfBusy = false; }
  },
  async syncLedger() {
    const u = auth.currentUser; if (!u) return;
    if (window.__ledgerSyncBusy) return; window.__ledgerSyncBusy = true;
    let blocked = null;                       /* set by any step that could not write */
    try {
      const st = localState();
      const L = st.ledger || [];
      const curKey = 'eden-ledger-synced-' + u.uid;
      let cursor = +(localStorage.getItem(curKey) || 0);
      /* ---- events -------------------------------------------------------
         THE CURSOR GUARDS THIS LOOP ONLY. It used to guard the whole function
         (`if (cursor >= L.length) return;`), which quietly broke the two steps
         below for exactly the learner who matters most:

         · a finished learner sits at cursor === L.length permanently, so an
           anchor write that failed once was never retried again;
         · an OpenTimestamps proof is upgraded from `pending` to `confirmed`
           HOURS OR DAYS after the events were mirrored, when Bitcoin confirms
           the block. By then the early return fired every time, so the confirmed
           proof — the strongest evidence this product has — was never mirrored
           server-side at all.

         Both failures are shaped exactly like a completed course, which is why
         three weeks of silence looked like success. */
      for (let i = cursor; i < L.length; i++) {
        const ev = L[i];
        try {
          await setDoc(doc(db, 'users', u.uid, 'events', ev.id), Object.assign({}, ev, { recordedAt: serverTimestamp() }));
          cursor = i + 1; localStorage.setItem(curKey, String(cursor));
        } catch (e) {
          if ((e && e.code) === 'permission-denied') {
            /* Two very different causes look identical here: (a) the create-only
               rules aren't deployed yet, or (b) another device already mirrored
               this event, so our setDoc is an UPDATE and updates are forbidden.
               Disambiguate by reading the doc (own-uid reads are allowed). */
            try {
              const snap = await getDoc(doc(db, 'users', u.uid, 'events', ev.id));
              if (snap.exists()) { cursor = i + 1; localStorage.setItem(curKey, String(cursor)); continue; }
            } catch (e2) { /* read failed too → rules genuinely not live */ }
            blocked = 'events:permission-denied';
            break;    /* nothing lost, retried next flush — but now RECORDED */
          }
          blocked = 'events:' + ((e && e.code) || 'error');
          break;
        }
      }
      /* ---- anchor -------------------------------------------------------
         Only when EVERY event is mirrored. The anchor asserts `count: L.length`
         — pinning it while events are missing would be a stronger claim than the
         data supports, and this layer's whole value is that it never does that. */
      const head = L[L.length - 1];
      if (head && head.hash && cursor >= L.length) {
        try {
          await setDoc(doc(db, 'users', u.uid, 'anchors', head.hash), {
            headHash: head.hash, count: L.length,
            brandId: head.brandId || BRAND_ID,
            recordedAt: serverTimestamp()
          });
        } catch (e) {
          /* was `.catch(() => {})` — a silent swallow on the one write that makes
             back-dating detectable */
          if (!blocked) blocked = 'anchor:' + ((e && e.code) || 'error');
        }
      }
      /* Bitcoin proofs → create-only mirror. Doc id includes the status, so an
         upgraded proof lands as a NEW doc instead of mutating the pending one
         (updates are forbidden by design, and a swapped proof would be exactly
         the thing this whole layer exists to make impossible). */
      for (const rec of (st.ots || [])) {
        if (!rec.ots) continue;
        const id = rec.head.slice(0, 32) + '-' + (rec.status === 'confirmed' ? 'btc' : 'pending');
        const key = 'eden-ots-put-' + u.uid + '-' + id;
        if (localStorage.getItem(key)) continue;          /* already mirrored */
        try {
          await setDoc(doc(db, 'users', u.uid, 'proofs', id), {
            headHash: rec.head, eventsAtStamp: rec.count, status: rec.status,
            bitcoinBlock: rec.height || null, ots: rec.ots,
            stampedAt: rec.at, recordedAt: serverTimestamp()
          });
          localStorage.setItem(key, '1');
        } catch (e) {
          /* A proof is self-verifying and independent of the events, so it is
             attempted even when they are blocked — but a CONFIRMED proof that
             cannot be stored is the single most important failure in this file
             and is no longer swallowed. */
          if (!blocked || rec.status === 'confirmed') {
            blocked = 'proof:' + (rec.status === 'confirmed' ? 'btc:' : '') + ((e && e.code) || 'error');
          }
        }
      }
    } catch (e) {
      if (!blocked) blocked = 'sync:' + ((e && e.code) || e && e.message || 'error');
    } finally {
      window.__ledgerSyncBusy = false;
      window.EdenCloud.__noteLedgerSync(u, blocked);
    }
  },
  /* ---- R3-1d: the evidence layer must never fail silently -------------------
     Every branch above preserves data and retries, which is correct — and for
     three weeks it meant nobody knew the server tier was dark. NIST AU-5 treats
     the ALERT as the control, and OWASP renamed A09 to "Logging and Alerting
     Failures" in 2025 for this exact shape of bug.

     Persisted OUTSIDE the state blob, like the cursor, so recording a failure can
     never clobber the chain it is describing. `firstSeen` is what makes a
     three-week silence legible after the fact rather than only in the moment. */
  __noteLedgerSync(u, blocked) {
    try {
      const k = 'eden-ledger-blocked-' + u.uid;
      if (!blocked) { localStorage.removeItem(k); return; }
      let rec = null;
      try { rec = JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) {}
      const now = Date.now();
      const fresh = !rec || rec.code !== blocked;
      rec = fresh
        ? { code: blocked, firstSeen: now, lastSeen: now, count: 1 }
        : Object.assign(rec, { lastSeen: now, count: (rec.count || 1) + 1 });
      localStorage.setItem(k, JSON.stringify(rec));
      /* On the TRANSITION only, put it through the error beacon as well. That
         buffer rides the ordinary user-state sync — a different rule path from
         the events subcollection, so it still reaches an admin precisely when
         the evidence mirror is refused. Without this the learner sees a warning
         and nobody who could fix it ever does. */
      if (fresh && window.EdenBeacon) window.EdenBeacon('ledger', 'evidence mirror refused: ' + blocked, 'auth.js/syncLedger');
    } catch (e) { /* storage full/blocked — the app must still run */ }
  },
  /* Read by the admin surface AND by anything that would otherwise claim
     "server-verified". Health-checks on the ABSENCE of a block, so a missing
     signal reads as unknown rather than as success. */
  ledgerSyncStatus() {
    const u = auth.currentUser;
    if (!u) return { signedIn: false, blocked: null, mirrored: 0, total: 0 };
    let rec = null;
    try { rec = JSON.parse(localStorage.getItem('eden-ledger-blocked-' + u.uid) || 'null'); } catch (e) {}
    /* mirrored/total are reported so the UI can distinguish "the server has all of
       it" from "sync has never run" — the absence of an error is not evidence of
       success, and that conflation is what hid this for three weeks. */
    const total = ((localState() || {}).ledger || []).length;
    const mirrored = Math.min(total, +(localStorage.getItem('eden-ledger-synced-' + u.uid) || 0));
    return { signedIn: true, blocked: rec, mirrored, total };
  },
  /* ---- manager confirmations (R2-18b) ---------------------------------
     A company-scoped, create-only record. The manager's OWN chain is the
     original; this doc is the shareable cross-reference, carrying the hash of
     the manager's chain event AND the learner's, so the two records can be
     checked against each other by anyone holding both. */
  async confirmApplication({ subjectUid, learnerEventHash, courseId, verdict, mgrEvent }) {
    const u = auth.currentUser; if (!u) throw new Error('not-signed-in');
    if (u.uid === subjectUid) throw new Error('self-confirm');   /* also refused by rules */
    const st = localState(), p = st.profile || {};
    const id = learnerEventHash.slice(0, 32) + '-' + u.uid.slice(0, 8);
    await setDoc(doc(db, 'confirmations', id), {
      subjectUid, learnerEventHash, courseId, verdict,
      byUid: u.uid, byName: p.name || p.username || (u.email || '').split('@')[0], byEmail: u.email || '',
      companyId: cid(),
      mgrEventHash: mgrEvent.hash, mgrPrevHash: mgrEvent.prevHash, at: mgrEvent.at,
      recordedAt: serverTimestamp()
    });
  },
  /* the learner pulls confirmations ABOUT them into their own record */
  async listConfirmations() {
    const u = auth.currentUser; if (!u) return [];
    try {
      const snap = await getDocs(query(collection(db, 'confirmations'), where('subjectUid', '==', u.uid)));
      return snap.docs.map(d => d.data());
    } catch (e) { return []; }
  },
  async saveOrgConfig(cfg) {
    if (!auth.currentUser) throw new Error('not-signed-in');
    await setDoc(doc(db, 'config', cid() === 'edenrise' ? 'org' : cid()), cfg, { merge: true });
  },
  heartbeat() {
    const u = auth.currentUser; if (!u) return;
    setDoc(doc(db, 'leaderboard', u.uid), { lastSeen: serverTimestamp() }, { merge: true }).catch(() => {});
  },
  async listBoard() {
    /* SERVER-scoped to the caller's company (was: fetch-all + client filter —
       which let any signed-in user of another tenant read every name on the
       platform; the DPA promises isolation, so the QUERY must enforce it).
       Superadmins keep the unfiltered view, then scope client-side. */
    const u = auth.currentUser;
    const base = collection(db, 'leaderboard');
    /* SCALE. This read used to fetch the WHOLE company collection on every
       visit to My Learning and 2.5 s after every boot: at 1,000 members that is
       1,000 document reads per visit, and fifty visits a day exhaust the free
       plan's read quota for everyone. Two changes:
       · a per-device cache (10 min) — one read per session, not per visit;
       · a bounded query — the top BOARD_LIMIT by XP plus the newest joiners —
         when the tenant has the composite index (companyId + xp), declared in
         firestore.indexes.json and flagged by BRAND.boardIndexed. Without the
         index the equality filter alone is still bounded by limit(). */
    const KEYC = 'edenBoard:' + cid();
    try { const c = JSON.parse(localStorage.getItem(KEYC) || 'null'); if (c && Date.now() - c.at < 10 * 60e3 && Array.isArray(c.rows)) return c.rows; } catch (e) {}
    const LIM = 100;
    const indexed = !!(window.BRAND && BRAND.boardIndexed);
    let snap;
    if (u && isSuperEmail(u.email)) snap = await getDocs(indexed ? query(base, orderBy('xp', 'desc'), limit(LIM)) : query(base, limit(LIM)));
    else snap = await getDocs(indexed ? query(base, where('companyId', '==', cid()), orderBy('xp', 'desc'), limit(LIM)) : query(base, where('companyId', '==', cid()), limit(LIM)));
    const rows = snap.docs.map(d => Object.assign({ uid: d.id }, d.data())).filter(r => ofCompany(r));
    try { localStorage.setItem(KEYC, JSON.stringify({ at: Date.now(), rows })); } catch (e) {}
    return rows;
  },
  async signOut() {
    localStorage.setItem(MODE, 'out');
    try { await signOut(auth); } catch (e) {}
    localStorage.removeItem(KEY);   // clear this device; cloud copy is safe
    location.reload();
  },
  async updateName(name) {
    const u = auth.currentUser; if (!u || !name) return;
    try { await updateProfile(u, { displayName: name }); } catch (e) {}
  },
  /* GDPR: erase the Firestore doc, the auth account, and this device's copy */
  async deleteAccount() {
    const u = auth.currentUser; if (!u) throw new Error('not-signed-in');
    const backup = localState();               /* for rollback if auth deletion fails */
    await deleteDoc(doc(db, 'users', u.uid));
    await deleteDoc(doc(db, 'leaderboard', u.uid)).catch(() => {});
    try {
      await deleteUser(u);                     /* throws auth/requires-recent-login if stale */
    } catch (e) {
      /* auth account survived — restore the data so the account isn't left
         half-deleted (docs gone, login alive). The user re-auths and retries. */
      await setDoc(doc(db, 'users', u.uid), { state: backup, profile: { companyId: (backup.profile || {}).companyId || BRAND_ID }, updatedAt: serverTimestamp() }, { merge: true }).catch(() => {});
      throw e;
    }
    localStorage.removeItem(KEY);
    localStorage.setItem(MODE, 'out');
    setTimeout(() => location.reload(), 900);
  },
  /* team-published courses (AI Course Studio) — readable by everyone */
  async saveCourse(course) {
    const u = auth.currentUser; if (!u) throw new Error('not-signed-in');
    const cc = isSuperEmail(u.email) ? null : cid();   /* superadmin publishes to the global catalog */
    await setDoc(doc(db, 'courses', course.id), { course, companyId: cc, authorUid: u.uid, authorEmail: u.email || '', createdAt: serverTimestamp() });
  },
  async deleteCourse(id) {
    if (!auth.currentUser) return;
    await deleteDoc(doc(db, 'courses', id));
  },
  async listCourses() {
    /* A collection-wide list can't be proven against per-doc read rules, so it
       was denied for everyone but supers (and silently swallowed). Split into
       provable queries: the global catalog (companyId == null) for all, plus
       the caller's tenant set when signed in. Supers keep the full view. */
    const u = auth.currentUser;
    let docs;
    if (u && isSuperEmail(u.email)) {
      docs = (await getDocs(collection(db, 'courses'))).docs;
    } else {
      let pub = { docs: [] };
      try { pub = await getDocs(query(collection(db, 'courses'), where('companyId', '==', null))); } catch (e) {}
      let mine = { docs: [] };
      if (u) { try { mine = await getDocs(query(collection(db, 'courses'), where('companyId', '==', cid()))); } catch (e) {} }
      docs = [...pub.docs, ...mine.docs];
    }
    const snap = { docs };
    const out = { courses: [], meta: null, digests: [] };
    const myMeta = metaDocId();
    snap.docs.forEach(d => {
      const x = d.data();
      if (d.id === myMeta) out.meta = x.meta || null;
      else if (d.id.startsWith('__meta')) return;                       /* other tenants' meta */
      else if (x.digest) { if (ofCompany(x.digest)) out.digests.push(x.digest); }
      else if (x.course) { if (!x.companyId || ofCompany(x)) out.courses.push(x.course); }
    });
    out.digests.sort((a, b) => (b.at || 0) - (a.at || 0));
    return out;
  },
  /* department digests — published into the same public collection */
  async saveDigest(d) {
    const u = auth.currentUser; if (!u) throw new Error('not-signed-in');
    d.companyId = d.companyId || cid();
    await setDoc(doc(db, 'courses', 'digest-' + d.id), { digest: d, companyId: d.companyId, authorUid: u.uid, createdAt: serverTimestamp() });
  },
  async deleteDigest(id) {
    if (!auth.currentUser) return;
    await deleteDoc(doc(db, 'courses', 'digest-' + id));
  },
  /* studio meta (live sessions schedule, …) — lives in the public courses collection
     so guests can read it and ONLY admins can write it, with the existing rules */
  async saveMeta(meta) {
    const u = auth.currentUser; if (!u) throw new Error('not-signed-in');
    await setDoc(doc(db, 'courses', metaDocId()), { meta, companyId: cid(), authorUid: u.uid, updatedAt: serverTimestamp() });
  },
  // admin-only (enforced by Firestore rules): read every member's profile + state
  async listMembers() {
    const u = auth.currentUser;
    const mapDoc = d => { const x = d.data(); return { uid: d.id, profile: x.profile || {}, state: x.state || {}, updatedAt: (x.updatedAt && x.updatedAt.toMillis) ? x.updatedAt.toMillis() : 0, createdAt: (x.createdAt && x.createdAt.toMillis) ? x.createdAt.toMillis() : 0 }; };
    if (u && isSuperEmail(u.email)) {   /* superadmin: all docs, client-scope to the active tenant */
      const snap = await getDocs(collection(db, 'users'));
      return snap.docs.map(mapDoc).filter(m => ofCompany(m.profile || {}));
    }
    /* company admin: server-scoped query (rules enforce it) */
    const snap = await getDocs(query(collection(db, 'users'), where('profile.companyId', '==', cid())));
    return snap.docs.map(mapDoc);
  },
  /* ---- Phase 5: tenant management ---- */
  async loadCompany() {
    try {
      const snap = await getDoc(doc(db, 'companies', cid()));
      window.EdenCompany = snap.exists() ? Object.assign({ id: cid() }, snap.data())
        : { id: cid(), name: cid() === 'edenrise' ? 'EdenRise' : cid(), status: 'active', adminEmails: [] };
    } catch (e) { window.EdenCompany = { id: cid(), name: 'EdenRise', status: 'active', adminEmails: [] }; }
    if (window.EdenApp && window.EdenApp.applyCompany) window.EdenApp.applyCompany(window.EdenCompany);
    return window.EdenCompany;
  },
  async saveCompany(data) {
    await setDoc(doc(db, 'companies', data.id || cid()), data, { merge: true });
    if ((data.id || cid()) === cid()) { window.EdenCompany = Object.assign({}, window.EdenCompany, data); if (window.EdenApp && window.EdenApp.applyCompany) window.EdenApp.applyCompany(window.EdenCompany); }
  },
  async createCompany({ id, name, nif, adminEmail }) {
    const code = (id + '-' + Math.random().toString(36).slice(2, 8)).toUpperCase();
    await setDoc(doc(db, 'companies', id), { name, nif: nif || '', status: 'active', plan: 'trial', adminEmails: adminEmail ? [adminEmail.toLowerCase()] : [], inviteCode: code, createdAt: serverTimestamp() });
    await setDoc(doc(db, 'invites', code), { companyId: id, createdAt: serverTimestamp() });
    return code;
  },
  async listCompanies() {
    const snap = await getDocs(collection(db, 'companies'));
    return snap.docs.map(d => Object.assign({ id: d.id }, d.data()));
  },
  async resolveInvite(code) {
    const snap = await getDoc(doc(db, 'invites', (code || '').trim().toUpperCase()));
    return snap.exists() ? snap.data().companyId : null;
  },
  async joinCompany(code) {
    const companyId = await window.EdenCloud.resolveInvite(code);
    if (!companyId) throw new Error('invalid-code');
    const s = localState(); s.profile = Object.assign({}, s.profile, { companyId });
    localStorage.setItem(KEY, JSON.stringify(s));
    window.EdenCloud.flush();
    await window.EdenCloud.loadCompany();
    return companyId;
  },
  async rotateInvite() {
    const code = (cid() + '-' + Math.random().toString(36).slice(2, 8)).toUpperCase();
    await setDoc(doc(db, 'invites', code), { companyId: cid(), createdAt: serverTimestamp() });
    await setDoc(doc(db, 'companies', cid()), { inviteCode: code }, { merge: true });
    window.EdenCompany = Object.assign({}, window.EdenCompany, { inviteCode: code });
    return code;
  }
};

/* ================= Community forum (real-time Firestore) ================= */
function authorStub() {
  const u = auth.currentUser;
  const s = localState();
  const prof = s.profile || {};
  const name = (u && u.displayName) || prof.name || 'Learner';
  const handle = prof.username || (u && u.email ? u.email.split('@')[0] : '');
  const initials = name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'ER';
  return { authorUid: u ? u.uid : null, authorName: name, authorHandle: handle, authorInitials: initials };
}
window.EdenForum = {
  canPost() { return !!auth.currentUser; },
  me() { return authorStub(); },
  // live feed of a channel; cb receives an array of posts (sorted newest-activity first)
  subscribeChannel(channel, cb) {
    /* company-scoped at the QUERY (rules enforce it server-side) */
    const q = query(collection(db, 'forum_posts'), where('channel', '==', channel), where('companyId', '==', cid()));
    return onSnapshot(q, snap => {
      const posts = snap.docs.map(d => Object.assign({ id: d.id }, d.data())).filter(p => ofCompany(p));
      posts.sort((a, b) => (ms(b.lastActivity) || ms(b.createdAt)) - (ms(a.lastActivity) || ms(a.createdAt)));
      cb(posts);
    }, err => { console.error('[forum] channel sub', err); cb([]); });
  },
  subscribeThread(postId, cb) {
    const q = query(collection(db, 'forum_posts', postId, 'replies'));
    return onSnapshot(q, snap => {
      const replies = snap.docs.map(d => Object.assign({ id: d.id }, d.data()));
      replies.sort((a, b) => (ms(a.createdAt) || 0) - (ms(b.createdAt) || 0));
      cb(replies);
    }, err => { console.error('[forum] thread sub', err); cb([]); });
  },
  async createPost({ channel, kind, title, body, poll, official, pinned }) {
    if (!auth.currentUser) throw new Error('not-signed-in');
    return addDoc(collection(db, 'forum_posts'), Object.assign({
      companyId: cid(),
      channel, kind: kind || 'message', title: title || '', body,
      createdAt: serverTimestamp(), lastActivity: serverTimestamp(),
      replyCount: 0, likes: 0, likedBy: []
    }, poll ? { poll } : {}, official ? { official: true } : {}, pinned ? { pinned: true } : {}, authorStub()));
  },
  /* all official broadcasts across channels (equality-only where — no index needed) */
  async listOfficial() {
    try {
      const snap = await getDocs(query(collection(db, 'forum_posts'), where('official', '==', true), where('companyId', '==', cid())));
      const posts = snap.docs.map(d => Object.assign({ id: d.id }, d.data())).filter(p => ofCompany(p));
      posts.sort((a, b) => (ms(b.createdAt) || 0) - (ms(a.createdAt) || 0));
      return posts;
    } catch (e) { return []; }   /* guests / rules propagating — official rail degrades to empty */
  },
  async addReply(postId, body) {
    if (!auth.currentUser) throw new Error('not-signed-in');
    await addDoc(collection(db, 'forum_posts', postId, 'replies'), Object.assign({
      body, createdAt: serverTimestamp(), likes: 0, likedBy: []
    }, authorStub()));
    await updateDoc(doc(db, 'forum_posts', postId), { replyCount: increment(1), lastActivity: serverTimestamp() }).catch(() => {});
  },
  async toggleLike(postId, liked) {
    const u = auth.currentUser; if (!u) return;
    await updateDoc(doc(db, 'forum_posts', postId), {
      likes: increment(liked ? -1 : 1),
      likedBy: liked ? arrayRemove(u.uid) : arrayUnion(u.uid)
    }).catch(() => {});
  },
  async toggleReplyLike(postId, replyId, liked) {
    const u = auth.currentUser; if (!u) return;
    await updateDoc(doc(db, 'forum_posts', postId, 'replies', replyId), {
      likes: increment(liked ? -1 : 1),
      likedBy: liked ? arrayRemove(u.uid) : arrayUnion(u.uid)
    }).catch(() => {});
  },
  async react(postId, emoji, on) {
    const u = auth.currentUser; if (!u) return;
    await updateDoc(doc(db, 'forum_posts', postId), { ['reactions.' + emoji]: on ? arrayUnion(u.uid) : arrayRemove(u.uid) }).catch(() => {});
  },
  async vote(postId, optionIndex) {
    const u = auth.currentUser; if (!u) return;
    await updateDoc(doc(db, 'forum_posts', postId), { ['poll.votes.' + u.uid]: optionIndex }).catch(() => {});
  },
  async remove(postId) {
    if (!auth.currentUser) return;
    await deleteDoc(doc(db, 'forum_posts', postId)).catch(() => {});
  },
  async removeReply(postId, replyId) {
    if (!auth.currentUser) return;
    await deleteDoc(doc(db, 'forum_posts', postId, 'replies', replyId)).catch(() => {});
    await updateDoc(doc(db, 'forum_posts', postId), { replyCount: increment(-1) }).catch(() => {});
  },
  async togglePin(postId, pinned) {
    if (!auth.currentUser) return;
    await updateDoc(doc(db, 'forum_posts', postId), { pinned: !pinned }).catch(() => {});
  },
  uid() { const u = auth.currentUser; return u ? u.uid : null; }
};
function ms(ts) { return ts && typeof ts.toMillis === 'function' ? ts.toMillis() : (ts && ts.seconds ? ts.seconds * 1000 : 0); }

/* ================= Field Missions — real-world proof, reviewed by admins ================= */
window.EdenMissions = {
  async submit({ courseId, note, photo }) {
    const u = auth.currentUser; if (!u) throw new Error('not-signed-in');
    return addDoc(collection(db, 'missions'), Object.assign({
      companyId: cid(),
      courseId, note: note || '', photo: photo || '',
      status: 'pending', claimed: false, createdAt: serverTimestamp()
    }, authorStub()));
  },
  async listMine() {
    const u = auth.currentUser; if (!u) return [];
    try {
      const snap = await getDocs(query(collection(db, 'missions'), where('authorUid', '==', u.uid)));
      return snap.docs.map(d => Object.assign({ id: d.id }, d.data()));
    } catch (e) { return []; }
  },
  async listPending() {
    const u = auth.currentUser; if (!u) return [];
    const q0 = isSuperEmail(u.email)
      ? query(collection(db, 'missions'), where('status', '==', 'pending'))
      : query(collection(db, 'missions'), where('status', '==', 'pending'), where('companyId', '==', cid()));
    const snap = await getDocs(q0).catch(() => ({ docs: [] }));
    const list = snap.docs.map(d => Object.assign({ id: d.id }, d.data())).filter(m => ofCompany(m));
    list.sort((a, b) => (ms(a.createdAt) || 0) - (ms(b.createdAt) || 0));
    return list;
  },
  async review(id, approved) {
    if (!auth.currentUser) return;
    await updateDoc(doc(db, 'missions', id), { status: approved ? 'approved' : 'declined', reviewedAt: serverTimestamp() });
  },
  async claim(id) {
    if (!auth.currentUser) return;
    await updateDoc(doc(db, 'missions', id), { claimed: true });
  }
};

/* load team-published courses + studio meta for everyone (guests included) */
(function loadCustomCourses(tries) {
  if (!BACKEND_READY) return;                  /* placeholder key — nothing to load */
  window.EdenCloud.listCourses().then(({ courses, meta, digests }) => {
    if (!window.EdenApp) return;
    if (meta && window.EdenApp.applyMeta) window.EdenApp.applyMeta(meta);
    if (digests && digests.length && window.EdenApp.applyDigests) window.EdenApp.applyDigests(digests);
    if (courses.length) window.EdenApp.applyCustomCourses(courses);
  }).catch(() => { if ((tries || 0) < 3) setTimeout(() => loadCustomCourses((tries || 0) + 1), 4000); });
})(0);

async function loadOrgConfig() {
  try {
    const snap = await getDoc(doc(db, 'config', cid() === 'edenrise' ? 'org' : cid()));
    if (snap.exists()) { window.EdenOrg = snap.data(); if (window.syncTutorStatus) window.syncTutorStatus(); }
  } catch (e) { /* not signed in yet or rules pending */ }
}

/* ---------- auth state ---------- */
/* Backend not wired → never touch Firebase auth (its calls would throw). Run
   guest-only, and let the UI show an honest "preview mode" note. */
if (!BACKEND_READY) {
  try { console.info('[auth] backend not configured for this brand — running in local preview mode'); } catch (e) {}
  const mode = localStorage.getItem(MODE);
  if (mode === 'firebase') localStorage.setItem(MODE, 'guest');   /* a stale flag from another instance */
  document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem(MODE) === 'guest') { hideGate(); if (window.EdenApp) window.EdenApp.maybeOnboard(); }
    else showGate();
  });
}
onAuthStateChanged(auth, async user => {
  if (!BACKEND_READY) return;              /* handled above */
  if (user) {
    localStorage.setItem(MODE, 'firebase');
    /* enter IMMEDIATELY — sync happens behind the app, not in front of the user */
    hideGate(); setBusy(false); showErr('');
    const profile = {
      uid: user.uid, email: user.email || '',
      name: user.displayName || (user.email ? user.email.split('@')[0] : 'Learner'),
      photo: user.photoURL || '',
      provider: (user.providerData[0] && user.providerData[0].providerId) || 'password',
      /* CRITICAL: the security rules' myCompany() reads THIS top-level map —
         not state.profile. Without companyId here, every company-scoped rule
         compares against null and every non-super read is denied. (Found in
         the release audit; masked for supers by the isSuper() short-circuit.) */
      companyId: (localState().profile || {}).companyId || BRAND_ID
    };
    stampProfileLocal(profile);
    if (window.EdenApp) window.EdenApp.applyProfile(profile);
    try {
      /* ONE read for state+profile, org config in parallel (both instant from cache on repeat visits) */
      const [snap] = await Promise.all([getDoc(doc(db, 'users', user.uid)), loadOrgConfig(), window.EdenCloud.loadCompany()]);
      const data = snap.exists() ? snap.data() : null;
      if (data && data.state) localStorage.setItem(KEY, JSON.stringify(mergeStates(data.state, localState())));
      if (window.EdenApp) { window.EdenApp.reloadState(); window.EdenApp.applyProfile(profile); }
      /* the profile write is bookkeeping — deferred so it never blocks entry */
      setTimeout(() => {
        const payload = { profile, updatedAt: serverTimestamp() };
        if (!data) {
          payload.state = localState(); payload.createdAt = serverTimestamp();
          /* GDPR: record consent for EVERY first sign-in, not just the email
             form. The auth gate shows the notice + privacy link beside every
             entry path; continuing is the affirmative action (Art. 4(11) /
             Art. 7 — we must be able to DEMONSTRATE it, hence the record). */
          payload.consent = true; payload.consentAt = serverTimestamp();
          payload.consentVia = profile.provider || 'password';
        }
        setDoc(doc(db, 'users', user.uid), payload, { merge: true }).catch(() => {});
      }, 400);
    } catch (e) { console.error('[auth] sync failed', e); }
  } else {
    const mode = localStorage.getItem(MODE);
    if (mode === 'guest') { hideGate(); if (window.EdenApp) window.EdenApp.maybeOnboard(); }
    else if (mode === 'firebase') { hideGate(); if (window.EdenApp) window.EdenApp.reloadState(); }  /* remembered: a returning member stays in with their cached state even if the session needs a moment (or is briefly offline) */
    else showGate();
  }
});

/* ---------- error copy ---------- */
function friendly(code) {
  const pt = isPT();
  const m = {
    'auth/invalid-email': pt ? 'Email inválido.' : 'Invalid email.',
    'auth/missing-password': pt ? 'Introduza a palavra-passe.' : 'Enter a password.',
    'auth/weak-password': pt ? 'A palavra-passe precisa de pelo menos 6 caracteres.' : 'Password needs at least 6 characters.',
    'auth/email-already-in-use': pt ? 'Este email já tem conta — inicie sessão.' : 'That email already has an account — sign in instead.',
    'auth/invalid-credential': pt ? 'Email ou palavra-passe incorretos.' : 'Wrong email or password.',
    'auth/user-not-found': pt ? 'Conta não encontrada.' : 'No account found for that email.',
    'auth/wrong-password': pt ? 'Palavra-passe incorreta.' : 'Wrong password.',
    'auth/popup-closed-by-user': pt ? 'Janela fechada antes de concluir.' : 'Sign-in window closed before finishing.',
    'auth/popup-blocked': pt ? 'O navegador bloqueou a janela — permita popups.' : 'Your browser blocked the popup — allow popups and retry.',
    'auth/operation-not-allowed': pt ? 'Ative Email/Password no Firebase (Authentication → Sign-in method).' : 'Enable Email/Password in Firebase (Authentication → Sign-in method).',
    'auth/unauthorized-domain': pt ? 'Domínio não autorizado (Firebase → Authentication → Settings → Authorized domains).' : 'Domain not authorized (Firebase → Authentication → Settings → Authorized domains).'
  };
  return m[code] || (pt ? 'Algo correu mal. Tente novamente.' : 'Something went wrong. Please try again.');
}

/* ---------- login form ---------- */
let signupMode = false;
function refreshMode() {
  const g = gate(); if (!g) return;
  g.classList.toggle('signup', signupMode);
  const submit = $('#authSubmit'); if (submit) submit.textContent = signupMode ? T('auth_signup') : T('auth_signin');
  const toggle = $('#authToggle'); if (toggle) toggle.textContent = signupMode ? T('auth_to_signin') : T('auth_to_signup');
  showErr('');
}
function translateGate() {
  const set = (sel, k) => { const el = $(sel); if (el) el.textContent = T(k); };
  set('#authTitle', 'auth_welcome'); set('#authSub', 'auth_sub');
  set('#authGoogleTxt', 'auth_google'); set('#authOr', 'auth_or');
  set('#authConsentTxt', 'auth_consent');
  const em = $('#authEmail'); if (em) em.placeholder = T('auth_email');
  const pw = $('#authPass'); if (pw) pw.placeholder = T('auth_password');
  const nm = $('#authName'); if (nm) nm.placeholder = T('auth_name');
  const guest = $('#authGuest'); if (guest) guest.textContent = T('auth_guest');
  const forgot = $('#authForgot'); if (forgot) forgot.textContent = T('auth_forgot');
  refreshMode();
}

document.addEventListener('DOMContentLoaded', wire);
if (document.readyState !== 'loading') wire();
function wire() {
  const g = gate(); if (!g || g.dataset.wired) return; g.dataset.wired = '1';
  translateGate();

  /* Backend not wired → this instance cannot authenticate. Hide the sign-in
     options and say so plainly, rather than letting a tap fail with a raw
     Firebase error. Guest ("explore") stays, so the demo is fully walkable. */
  if (!BACKEND_READY) {
    ['#authGoogle', '#authForm', '#authToggle', '#authOr', '.auth-divider'].forEach(sel => {
      const el = g.querySelector(sel); if (el) el.style.display = 'none';
    });
    const acad = (window.BRAND && window.BRAND.academy) || 'the academy';
    const sub = g.querySelector('#authSub');
    if (sub) sub.textContent = isPT()
      ? `Pré-visualização: explore ${acad} neste dispositivo. As contas ativam-se quando o backend for ligado.`
      : `Preview: explore ${acad} on this device. Accounts turn on once the backend is connected.`;
    const gbtn = g.querySelector('#authGuest');
    if (gbtn) {
      gbtn.textContent = isPT() ? `Explorar ${acad} →` : `Explore ${acad} →`;
      gbtn.addEventListener('click', () => { localStorage.setItem(MODE, 'guest'); hideGate(); if (window.EdenApp) window.EdenApp.maybeOnboard(); });
    }
    return;   /* skip the cloud handlers entirely */
  }

  $('#authGoogle').addEventListener('click', async () => {
    showErr(''); setBusy(true);
    try {
      await persistenceReady;                       /* guarantee local persistence before sign-in */
      const provider = new GoogleAuthProvider();
      const standalone = navigator.standalone || matchMedia('(display-mode: standalone)').matches;
      const mobile = /iphone|ipad|ipod|android/i.test(navigator.userAgent);
      /* Popups don't persist reliably in iOS/Android PWAs — use full-page redirect there. */
      if (standalone || mobile) await signInWithRedirect(auth, provider);
      else await signInWithPopup(auth, provider);
    } catch (e) { setBusy(false); showErr(friendly(e.code)); }
  });

  $('#authForm').addEventListener('submit', async e => {
    e.preventDefault(); showErr('');
    const email = $('#authEmail').value.trim();
    const pass = $('#authPass').value;
    const name = $('#authName').value.trim();
    const focusBad = sel => { const el = $(sel); if (el) { el.focus(); el.classList.add('field-bad'); setTimeout(() => el.classList.remove('field-bad'), 1600); } };
    if (!email) { showErr(isPT() ? 'Escreva o seu email.' : 'Enter your email.'); focusBad('#authEmail'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { showErr(isPT() ? 'Esse email não parece completo.' : "That email doesn't look complete."); focusBad('#authEmail'); return; }
    if (!pass) { showErr(isPT() ? 'Escreva a sua palavra-passe.' : 'Enter your password.'); focusBad('#authPass'); return; }
    if (signupMode) {
      if (pass.length < 6) { showErr(isPT() ? 'A palavra-passe precisa de pelo menos 6 caracteres.' : 'Use at least 6 characters.'); focusBad('#authPass'); return; }
      if (!$('#authConsent').checked) { showErr(T('auth_consent_req')); return; }
      if (!name) { showErr(isPT() ? 'Introduza o seu nome.' : 'Please enter your name.'); focusBad('#authName'); return; }
    }
    /* if the backend is not reachable at all, say so rather than spinning */
    if (typeof BACKEND_READY !== 'undefined' && !BACKEND_READY) {
      showErr(isPT() ? 'Sessão indisponível de momento — continue como convidado.' : 'Sign-in is unavailable right now — continue as a guest.');
      return;
    }
    setBusy(true);
    try {
      await persistenceReady;                        /* remember this device across restarts */
      if (signupMode) {
        const cred = await createUserWithEmailAndPassword(auth, email, pass);
        if (name) await updateProfile(cred.user, { displayName: name });
        await setDoc(doc(db, 'users', cred.user.uid), { consent: true, consentAt: serverTimestamp() }, { merge: true });
        sendEmailVerification(cred.user).then(() => { if (window.toast) window.toast(T('auth_verify_sent'), '📬'); }).catch(() => {});
        // onAuthStateChanged already fired; refresh profile name
        if (window.EdenApp) window.EdenApp.applyProfile({ name: name || email.split('@')[0], email });
      } else {
        await Promise.race([
          signInWithEmailAndPassword(auth, email, pass),
          new Promise((_, rej) => setTimeout(() => rej({ code: 'auth/network-request-failed' }), 15000))
        ]);
      }
    } catch (err) { setBusy(false); showErr(friendly(err.code)); }
  });

  $('#authToggle').addEventListener('click', () => { signupMode = !signupMode; refreshMode(); });
  $('#authForgot').addEventListener('click', async () => {
    showErr('');
    const email = $('#authEmail').value.trim();
    if (!email) { showErr(T('auth_reset_need_email')); return; }
    setBusy(true);
    try { await sendPasswordResetEmail(auth, email); setBusy(false); showErr(''); if (window.toast) window.toast(T('auth_reset_sent'), '📬'); }
    catch (e) { setBusy(false); showErr(friendly(e.code)); }
  });
  $('#authGuest').addEventListener('click', () => { localStorage.setItem(MODE, 'guest'); hideGate(); if (window.EdenApp) window.EdenApp.maybeOnboard(); });

  // language buttons anywhere (incl. the gate) re-translate the gate
  document.addEventListener('click', ev => { if (ev.target.closest('.lang-btn')) setTimeout(translateGate, 0); });
}
