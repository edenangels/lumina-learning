/* ============================================================================
   Local database — a drop-in stand-in for core/auth.js (Firebase), selected by
   BRAND.backend === 'local' (see the loader at the bottom of index.html).

   It implements the same globals the app already calls — EdenCloud,
   EdenForum, EdenMissions, EdenCompany — on top of one localStorage document
   per brand, so every screen (sign-in, My learning, Admin → team progress,
   forum, missions) works with no external service.

   What it is NOT: shared. The database lives in this browser on this device.
   Accounts made on a phone are not visible on a laptop. Passwords are hashed
   (SHA-256 + per-user salt) only so they are not stored in clear; this is a
   test/internal store, not an identity provider. To go live with real
   accounts across devices, set BRAND.backend = 'firebase' — nothing else
   changes, and core/auth.js takes over with the same interface.

   Learner state stays where the app keeps it (STATE_KEY). Signing in swaps
   the current account's state into that key; signing out writes it back to
   the account row first, so several people can test on one device.
   ========================================================================== */
(function () {
  const BRAND_ID = (window.BRAND && window.BRAND.id) || 'app';
  const KEY = BRAND_ID + '-state-v2';                       /* must match app.js STATE_KEY */
  const MODE = (window.BRAND && window.BRAND.authModeKey) || (BRAND_ID + '-auth-mode');
  const DBKEY = BRAND_ID + '-localdb-v1';
  const SUPERADMINS = ((window.BRAND && window.BRAND.superadmins) || []).map(e => String(e).toLowerCase());
  const $ = s => document.querySelector(s);
  const T = k => (typeof window.t === 'function' ? window.t(k) : k);
  const isPT = () => (typeof S !== 'undefined' && S.lang === 'pt');

  /* ---------- the store ---------- */
  const empty = () => ({ v: 1, session: null, users: {}, companies: {}, invites: {}, config: {}, courses: {},
    forum: {}, replies: {}, missions: {}, confirmations: {} });
  let mem = null;
  function db() {
    if (mem) return mem;
    try { mem = Object.assign(empty(), JSON.parse(localStorage.getItem(DBKEY)) || {}); } catch (e) { mem = empty(); }
    return mem;
  }
  function commit() { try { localStorage.setItem(DBKEY, JSON.stringify(db())); } catch (e) { console.warn('[localdb] could not save', e); } }
  /* another tab wrote the store: drop the cached copy */
  /* Test accounts (no password) work only on a development host. On a deployed site they are hidden and
     refused, so a published preview never offers one-tap admin. */
  const DEV_HOST = /^(localhost|127\.0\.0\.1|\[::1\])$|\.localhost$|\.test$/.test(location.hostname);
  /* another tab wrote the store: drop the cached copy; if it signed a different account in or out,
     reload this tab, so it never writes one person's progress into another person's account */
  let bootSession;
  window.addEventListener('storage', e => {
    if (e.key !== DBKEY) return;
    mem = null;
    if (bootSession !== undefined && db().session !== bootSession) location.reload();
  });

  const id = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const now = () => Date.now();
  const cid = () => { try { return ((JSON.parse(localStorage.getItem(KEY)) || {}).profile || {}).companyId || BRAND_ID; } catch (e) { return BRAND_ID; } };
  const ofCompany = o => ((o && o.companyId) || BRAND_ID) === cid();
  const localState = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const me = () => { const d = db(); return d.session && d.users[d.session] ? d.users[d.session] : null; };
  const isSuper = u => !!u && SUPERADMINS.includes(u.email);
  const clone = o => JSON.parse(JSON.stringify(o));

  async function hash(pass, salt) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + ':' + pass));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /* ---------- seed: the company row, and the test accounts named in brand.js ----------
     BRAND.localSeed = { adminEmails: [...], accounts: [{ email, name, role, dept }] }.
     Seeded accounts have no password: they are entered from the "Test accounts"
     buttons on the sign-in card, which only exist in local mode. */
  function seed() {
    const d = db(), sd = (window.BRAND && window.BRAND.localSeed) || {};
    if (!d.companies[BRAND_ID]) {
      d.companies[BRAND_ID] = { name: (window.BRAND && (BRAND.company || BRAND.name)) || BRAND_ID, status: 'active',
        adminEmails: (sd.adminEmails || []).map(e => e.toLowerCase()), inviteCode: (BRAND_ID + '-local').toUpperCase(), createdAt: now() };
      d.invites[d.companies[BRAND_ID].inviteCode] = { companyId: BRAND_ID };
    }
    (sd.accounts || []).forEach(a => {
      const email = a.email.toLowerCase();
      if (Object.values(d.users).some(u => u.email === email)) return;
      const uid = 'seed-' + email.replace(/[^a-z0-9]/g, '');
      d.users[uid] = { uid, email, name: a.name, seeded: true, role: a.role || 'learner', createdAt: now(), updatedAt: now(),
        consent: true, consentAt: now(), consentVia: 'local-seed',
        profile: { uid, email, name: a.name, companyId: BRAND_ID, dept: a.dept || '' }, state: { profile: { uid, email, name: a.name, companyId: BRAND_ID, dept: a.dept || '' } } };
    });
    commit();
  }

  /* ---------- session ---------- */
  function park() {   /* write the live learner state back to the signed-in account */
    const u = me(); if (!u) return;
    const st = localState();
    /* the state key belongs to someone else (a session switched under this tab): never cross-write */
    if (st.profile && st.profile.uid && st.profile.uid !== u.uid) return;
    u.state = st; u.updatedAt = now();
    u.profile = Object.assign({}, u.profile, (u.state.profile || {}), { uid: u.uid, email: u.email });
    commit();
  }
  function enter(u) {
    const d = db();
    park();                                                   /* someone else was signed in on this device */
    d.session = u.uid; commit();
    const st = clone(u.state || {});
    st.profile = Object.assign({}, st.profile, { uid: u.uid, email: u.email, name: (st.profile && st.profile.name) || u.name, companyId: (st.profile && st.profile.companyId) || BRAND_ID });
    localStorage.setItem(KEY, JSON.stringify(st));
    localStorage.setItem(MODE, 'local');
    location.reload();                                        /* boot the app cleanly as this account */
  }
  function author() {
    const u = me(), p = (localState().profile || {});
    const name = p.name || (u && u.name) || 'Learner';
    return { authorUid: u ? u.uid : null, authorName: name, authorHandle: p.username || (u ? u.email.split('@')[0] : ''),
      authorInitials: typeof initialsOf === 'function' ? initialsOf(name) : name.slice(0, 2).toUpperCase() };
  }
  const company = () => Object.assign({ id: cid() }, db().companies[cid()] || { name: (window.BRAND && (BRAND.company || BRAND.name)) || cid(), status: 'active', adminEmails: [] });

  /* ---------- EdenCloud ---------- */
  let pushTimer = null;
  window.EdenCloud = {
    backend: 'local',
    push() { if (!me()) return; clearTimeout(pushTimer); pushTimer = setTimeout(() => window.EdenCloud.flush(), 500); },
    flush() { clearTimeout(pushTimer); pushTimer = null; park(); },
    heartbeat() { const u = me(); if (u) { u.lastSeen = now(); commit(); } },
    ledgerSyncStatus() { return { backend: 'local', ok: true }; },
    async syncLedger() {},
    async pullConfirmations() {},
    async confirmApplication({ subjectUid, learnerEventHash, courseId, verdict, mgrEvent }) {
      const u = me(); if (!u) throw new Error('not-signed-in');
      if (u.uid === subjectUid) throw new Error('self-confirm');
      db().confirmations[learnerEventHash.slice(0, 32) + '-' + u.uid.slice(0, 8)] = { subjectUid, learnerEventHash, courseId, verdict,
        byUid: u.uid, byName: u.name, byEmail: u.email, companyId: cid(), mgrEventHash: mgrEvent.hash, mgrPrevHash: mgrEvent.prevHash, at: mgrEvent.at, recordedAt: now() };
      commit();
    },
    async listConfirmations() { const u = me(); return u ? Object.values(db().confirmations).filter(c => c.subjectUid === u.uid) : []; },
    async saveOrgConfig(cfg) { if (!me()) throw new Error('not-signed-in'); db().config[cid()] = Object.assign({}, db().config[cid()], cfg); commit(); window.EdenOrg = db().config[cid()]; },
    async listBoard() {
      return Object.values(db().users).filter(u => ofCompany(u.profile)).map(u => {
        const s = u.uid === (me() || {}).uid ? localState() : (u.state || {});
        const nm = (s.profile && s.profile.name) || u.name;
        return { uid: u.uid, name: nm, initials: typeof initialsOf === 'function' ? initialsOf(nm) : '', username: (s.profile && s.profile.username) || '', dept: (u.profile && u.profile.dept) || (s.profile && s.profile.dept) || null, xp: s.xp || 0, streak: s.streak || 0, companyId: (u.profile || {}).companyId || BRAND_ID, lastSeen: u.lastSeen || u.updatedAt };
      });
    },
    async signOut() { park(); db().session = null; commit(); localStorage.setItem(MODE, 'out'); localStorage.removeItem(KEY); location.reload(); },
    /* Reset demo: wipe the signed-in account's progress, keep who they are */
    resetMine() { const u = me(); if (!u) return; u.state = { profile: Object.assign({}, (u.state || {}).profile) }; u.updatedAt = now(); commit(); },
    async updateName(name) { const u = me(); if (u && name) { u.name = name; commit(); } },
    async deleteAccount() {
      const u = me(); if (!u) throw new Error('not-signed-in');
      delete db().users[u.uid]; db().session = null; commit();
      localStorage.removeItem(KEY); localStorage.setItem(MODE, 'out'); setTimeout(() => location.reload(), 900);
    },
    async saveCourse(course) { const u = me(); if (!u) throw new Error('not-signed-in'); db().courses[course.id] = { course, companyId: isSuper(u) ? null : cid(), authorUid: u.uid, createdAt: now() }; commit(); },
    async deleteCourse(cId) { delete db().courses[cId]; commit(); },
    async listCourses() {
      const out = { courses: [], meta: null, digests: [] };
      Object.entries(db().courses).forEach(([k, x]) => {
        if (k === '__meta_' + cid()) out.meta = x.meta || null;
        else if (k.startsWith('__meta')) return;
        else if (x.digest) { if (ofCompany(x.digest)) out.digests.push(x.digest); }
        else if (x.course && (!x.companyId || ofCompany(x))) out.courses.push(x.course);
      });
      out.digests.sort((a, b) => (b.at || 0) - (a.at || 0));
      return out;
    },
    async saveDigest(d) { if (!me()) throw new Error('not-signed-in'); d.companyId = d.companyId || cid(); db().courses['digest-' + d.id] = { digest: d, companyId: d.companyId, createdAt: now() }; commit(); },
    async deleteDigest(dId) { delete db().courses['digest-' + dId]; commit(); },
    async saveMeta(meta) { if (!me()) throw new Error('not-signed-in'); db().courses['__meta_' + cid()] = { meta, companyId: cid(), updatedAt: now() }; commit(); },
    /* Admin → team progress reads every account in this local store */
    async listMembers() {
      park();
      return Object.values(db().users).filter(u => ofCompany(u.profile)).map(u => ({ uid: u.uid, profile: Object.assign({}, u.profile, { email: u.email }),
        state: clone(u.state || {}), updatedAt: u.updatedAt || 0, createdAt: u.createdAt || 0 }));
    },
    async loadCompany() { window.EdenCompany = company(); if (window.EdenApp && EdenApp.applyCompany) EdenApp.applyCompany(window.EdenCompany); return window.EdenCompany; },
    async saveCompany(data) {
      const k = data.id || cid(); db().companies[k] = Object.assign({}, db().companies[k], data); delete db().companies[k].id; commit();
      if (k === cid()) window.EdenCloud.loadCompany();
    },
    async createCompany({ id: k, name, nif, adminEmail }) {
      const code = (k + '-' + Math.random().toString(36).slice(2, 8)).toUpperCase();
      db().companies[k] = { name, nif: nif || '', status: 'active', plan: 'trial', adminEmails: adminEmail ? [adminEmail.toLowerCase()] : [], inviteCode: code, createdAt: now() };
      db().invites[code] = { companyId: k }; commit(); return code;
    },
    async listCompanies() { return Object.entries(db().companies).map(([k, v]) => Object.assign({ id: k }, v)); },
    async resolveInvite(code) { const i = db().invites[(code || '').trim().toUpperCase()]; return i ? i.companyId : null; },
    async joinCompany(code) {
      const k = await window.EdenCloud.resolveInvite(code); if (!k) throw new Error('invalid-code');
      const s = localState(); s.profile = Object.assign({}, s.profile, { companyId: k }); localStorage.setItem(KEY, JSON.stringify(s));
      park(); await window.EdenCloud.loadCompany(); return k;
    },
    async rotateInvite() {
      const code = (cid() + '-' + Math.random().toString(36).slice(2, 8)).toUpperCase();
      db().invites[code] = { companyId: cid() }; (db().companies[cid()] || {}).inviteCode = code; commit();
      window.EdenCompany = Object.assign({}, window.EdenCompany, { inviteCode: code }); return code;
    }
  };

  /* ---------- EdenForum (polled: localStorage has no live listeners across one tab) ---------- */
  const listeners = new Set();
  const notify = () => listeners.forEach(fn => { try { fn(); } catch (e) {} });
  const posts = () => Object.entries(db().forum).map(([k, p]) => Object.assign({ id: k }, p)).filter(ofCompany);
  const mutate = (pid, fn) => { const p = db().forum[pid]; if (p) { fn(p); commit(); notify(); } };
  const toggleIn = (arr, v, on) => { arr = arr || []; return on ? [...new Set([...arr, v])] : arr.filter(x => x !== v); };
  window.EdenForum = {
    canPost() { return !!me(); },
    me() { return author(); },
    uid() { const u = me(); return u ? u.uid : null; },
    subscribeChannel(channel, cb) {
      const fn = () => cb(posts().filter(p => p.channel === channel).sort((a, b) => (b.lastActivity || b.createdAt) - (a.lastActivity || a.createdAt)));
      listeners.add(fn); fn(); return () => listeners.delete(fn);
    },
    subscribeThread(pid, cb) {
      const fn = () => cb(Object.entries(db().replies[pid] || {}).map(([k, r]) => Object.assign({ id: k }, r)).sort((a, b) => a.createdAt - b.createdAt));
      listeners.add(fn); fn(); return () => listeners.delete(fn);
    },
    async createPost({ channel, kind, title, body, poll, official, pinned }) {
      if (!me()) throw new Error('not-signed-in');
      const k = id();
      db().forum[k] = Object.assign({ companyId: cid(), channel, kind: kind || 'message', title: title || '', body, createdAt: now(), lastActivity: now(), replyCount: 0, likes: 0, likedBy: [] },
        poll ? { poll } : {}, official ? { official: true } : {}, pinned ? { pinned: true } : {}, author());
      commit(); notify(); return { id: k };
    },
    async listOfficial() { return posts().filter(p => p.official).sort((a, b) => b.createdAt - a.createdAt); },
    async addReply(pid, body) {
      if (!me()) throw new Error('not-signed-in');
      (db().replies[pid] = db().replies[pid] || {})[id()] = Object.assign({ body, createdAt: now(), likes: 0, likedBy: [] }, author());
      mutate(pid, p => { p.replyCount = (p.replyCount || 0) + 1; p.lastActivity = now(); });
    },
    async toggleLike(pid, liked) { const u = me(); if (u) mutate(pid, p => { p.likes = Math.max(0, (p.likes || 0) + (liked ? -1 : 1)); p.likedBy = toggleIn(p.likedBy, u.uid, !liked); }); },
    async toggleReplyLike(pid, rid, liked) {
      const u = me(), r = (db().replies[pid] || {})[rid]; if (!u || !r) return;
      r.likes = Math.max(0, (r.likes || 0) + (liked ? -1 : 1)); r.likedBy = toggleIn(r.likedBy, u.uid, !liked); commit(); notify();
    },
    async react(pid, emoji, on) { const u = me(); if (u) mutate(pid, p => { p.reactions = p.reactions || {}; p.reactions[emoji] = toggleIn(p.reactions[emoji], u.uid, on); }); },
    async vote(pid, i) { const u = me(); if (u) mutate(pid, p => { if (p.poll) { p.poll.votes = p.poll.votes || {}; p.poll.votes[u.uid] = i; } }); },
    async remove(pid) { delete db().forum[pid]; delete db().replies[pid]; commit(); notify(); },
    async removeReply(pid, rid) { if (db().replies[pid]) delete db().replies[pid][rid]; mutate(pid, p => { p.replyCount = Math.max(0, (p.replyCount || 1) - 1); }); },
    async togglePin(pid, pinned) { mutate(pid, p => { p.pinned = !pinned; }); }
  };

  /* ---------- EdenMissions ---------- */
  window.EdenMissions = {
    async submit({ courseId, note, photo }) {
      if (!me()) throw new Error('not-signed-in');
      const k = id(); db().missions[k] = Object.assign({ companyId: cid(), courseId, note: note || '', photo: photo || '', status: 'pending', claimed: false, createdAt: now() }, author());
      commit(); return { id: k };
    },
    async listMine() { const u = me(); return u ? Object.entries(db().missions).map(([k, m]) => Object.assign({ id: k }, m)).filter(m => m.authorUid === u.uid) : []; },
    async listPending() { return Object.entries(db().missions).map(([k, m]) => Object.assign({ id: k }, m)).filter(m => m.status === 'pending' && ofCompany(m)).sort((a, b) => a.createdAt - b.createdAt); },
    async review(k, ok) { const m = db().missions[k]; if (m) { m.status = ok ? 'approved' : 'declined'; m.reviewedAt = now(); commit(); } },
    async claim(k) { const m = db().missions[k]; if (m) { m.claimed = true; commit(); } }
  };

  /* ---------- the sign-in card, in local mode ---------- */
  const gate = () => $('#authGate');
  const showGate = () => document.documentElement.setAttribute('data-gate', 'on');
  const hideGate = () => document.documentElement.setAttribute('data-gate', 'off');
  const showErr = m => { const e = $('#authErr'); if (e) { e.textContent = m || ''; e.classList.toggle('on', !!m); } };
  let signup = false;
  function words() {
    const pt = isPT();
    return {
      sub: pt ? 'Base de dados interna de teste: as contas ficam guardadas neste dispositivo.' : 'Internal test database: accounts are stored on this device.',
      test: pt ? 'Contas de teste' : 'Test accounts',
      signin: T('auth_signin'), signupB: T('auth_signup'), toIn: T('auth_to_signin'), toUp: T('auth_to_signup'),
      noAcc: pt ? 'Não existe conta com esse email neste dispositivo.' : 'No account with that email on this device.',
      badPw: pt ? 'Palavra-passe incorreta.' : 'Wrong password.',
      taken: pt ? 'Este email já tem conta — inicie sessão.' : 'That email already has an account — sign in instead.'
    };
  }
  function refresh() {
    const g = gate(); if (!g) return; const w = words();
    g.classList.toggle('signup', signup);
    $('#authSubmit').textContent = signup ? w.signupB : w.signin;
    $('#authToggle').textContent = signup ? w.toIn : w.toUp;
    const sub = $('#authSub'); if (sub) sub.textContent = w.sub;
    const tl = $('#authTestH'); if (tl) tl.textContent = w.test;
    showErr('');
  }
  function testButtons() {
    const d = db(), admins = company().adminEmails || [];
    const seeded = Object.values(d.users).filter(u => u.seeded);
    if (!seeded.length || !DEV_HOST) return '';
    return `<div class="auth-test"><div class="auth-test-h" id="authTestH"></div>${seeded.map(u => {
      const adm = admins.includes(u.email) || SUPERADMINS.includes(u.email);
      return `<button type="button" class="auth-test-btn" data-uid="${u.uid}"><b>${u.name.replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch])}</b><span>${adm ? 'Admin' : (u.role === 'leader' ? (isPT() ? 'Chefe de equipa' : 'Team leader') : (isPT() ? 'Formando' : 'Learner'))}</span></button>`;
    }).join('')}</div>`;
  }
  function wire() {
    const g = gate(); if (!g || g.dataset.wired) return; g.dataset.wired = '1';
    ['#authGoogle', '.auth-divider', '#authForgot'].forEach(s => { const el = g.querySelector(s); if (el) el.style.display = 'none'; });
    const form = $('#authForm');
    form.insertAdjacentHTML('beforebegin', testButtons());
    g.querySelectorAll('.auth-test-btn').forEach(b => b.addEventListener('click', () => { const u = db().users[b.dataset.uid]; if (u && DEV_HOST) enter(u); }));
    refresh();
    form.addEventListener('submit', async e => {
      e.preventDefault(); showErr('');
      const w = words(), email = $('#authEmail').value.trim().toLowerCase(), pass = $('#authPass').value, name = $('#authName').value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { showErr(isPT() ? 'Esse email não parece completo.' : "That email doesn't look complete."); return; }
      if (!pass) { showErr(isPT() ? 'Escreva a sua palavra-passe.' : 'Enter your password.'); return; }
      const d = db(), found = Object.values(d.users).find(u => u.email === email);
      if (signup) {
        if (pass.length < 6) { showErr(isPT() ? 'A palavra-passe precisa de pelo menos 6 caracteres.' : 'Use at least 6 characters.'); return; }
        if (!$('#authConsent').checked) { showErr(T('auth_consent_req')); return; }
        if (!name) { showErr(isPT() ? 'Introduza o seu nome.' : 'Please enter your name.'); return; }
        if (found) { showErr(w.taken); return; }   /* a seeded test account cannot be claimed by signing up with its email */
        const u = found || { uid: 'u-' + id(), email, createdAt: now() };
        u.salt = id(); u.pass = await hash(pass, u.salt); u.name = name; u.seeded = false; u.updatedAt = now();
        u.consent = true; u.consentAt = now(); u.consentVia = 'password';
        u.profile = Object.assign({ companyId: BRAND_ID }, u.profile, { uid: u.uid, email, name });
        u.state = Object.assign({}, u.state || localState(), { profile: Object.assign({}, (u.state || {}).profile, u.profile) });
        d.users[u.uid] = u; commit(); enter(u); return;
      }
      if (!found) { showErr(w.noAcc); return; }
      if (!found.pass && !DEV_HOST) { showErr(w.noAcc); return; }   /* password-less test accounts: development host only */
      if (found.pass && await hash(pass, found.salt) !== found.pass) { showErr(w.badPw); return; }
      enter(found);
    });
    $('#authToggle').addEventListener('click', () => { signup = !signup; refresh(); });
    $('#authGuest').addEventListener('click', () => { localStorage.setItem(MODE, 'guest'); hideGate(); if (window.EdenApp) EdenApp.maybeOnboard(); });
    document.addEventListener('click', ev => { if (ev.target.closest('.lang-btn')) setTimeout(refresh, 0); });
  }

  /* ---------- boot ---------- */
  seed();
  function boot() {
    bootSession = db().session;
    wire();
    /* 'open' backend: no sign-in at all — everyone goes straight in; progress stays on this device */
    if (window.BRAND && BRAND.backend === 'open') { localStorage.setItem(MODE, 'guest'); if (db().session) { db().session = null; commit(); } }
    const u = me(), mode = localStorage.getItem(MODE);
    window.EdenCloud.loadCompany();
    window.EdenOrg = db().config[cid()] || window.EdenOrg;
    if (u && mode === 'local') {
      hideGate();
      if (window.EdenApp) { EdenApp.reloadState(); EdenApp.applyProfile(Object.assign({}, u.profile, { uid: u.uid, email: u.email, name: (localState().profile || {}).name || u.name, provider: 'local' })); }
    } else if (mode === 'guest') { hideGate(); if (window.EdenApp) EdenApp.maybeOnboard(); }
    else showGate();
    window.EdenCloud.listCourses().then(({ courses, meta, digests }) => {
      if (!window.EdenApp) return;
      if (meta && EdenApp.applyMeta) EdenApp.applyMeta(meta);
      if (digests.length && EdenApp.applyDigests) EdenApp.applyDigests(digests);
      if (courses.length && EdenApp.applyCustomCourses) EdenApp.applyCustomCourses(courses);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  try { console.info('[localdb] internal database active — set BRAND.backend = "firebase" to use Firebase'); } catch (e) {}
})();
