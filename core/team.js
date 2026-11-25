/* ============================================================================
   Team view for admins — what each person is doing, in curriculum terms.

   The cockpit in app.js was written for the item model: "path progress" was
   whole catalogue items marked done, and "last active" was the time the
   account document was last written (which a sync refreshes without the
   learner doing anything). With CURRICULUM loaded, a member's progress is
   lessons, their position is Course › Module › Lesson, and activity is the
   time of their last recorded lesson, retake or certificate.

   This file re-points the cockpit's own helpers (memberSummary, memberRow,
   adminCockpitHTML, paintMgrDash, openMemberDetail) so every number the
   cockpit shows — stats, roster, attention queue, CSV, AI digest — agrees,
   and adds a "What the team is doing" feed. Loads after core/curriculum.js;
   does nothing without it.
   ========================================================================== */
(function () {
  if (!window.CUR) return;
  const C = window.CUR, L0 = C.L;
  const PT = () => _lang() === 'pt';
  const W = (en, pt) => (PT() ? pt : en);
  const DAY = 86400000;

  /* every CUR helper reads the global learner state S; evaluate one member's state in its place */
  function withState(st, fn) {
    /* a member's stored state can predate fields the app fills in on load */
    const prev = S; S = Object.assign({ progress: {}, trainingLog: [], ledger: [], checkRetakes: {}, path: [] }, st || {}, { lang: prev && prev.lang });   /* titles in the admin's language, not the member's */
    try { return fn(); } finally { S = prev; }
  }
  const ms = v => typeof v === 'number' ? v : (v ? Date.parse(v) || 0 : 0);
  const lessonLabel = (src, i) => { const m = C.moduleOfLesson(src, i); return { lesson: C.lTitle(src, i), module: m ? C.mTitle(m) : '' }; };

  /* ---------- one member, in curriculum terms ---------- */
  function curOf(m) {
    const st = m.state || {}, pf = m.profile || {};
    return withState(st, () => {
      const courses = C.courses.map(co => Object.assign({ id: co.id, title: C.cTitle(co) }, C.courseStats(co.id)));
      const req = courses.reduce((a, c) => a + c.lessons, 0), done = courses.reduce((a, c) => a + c.done, 0);
      const nx = C.nextLessonGlobal();
      let now = null;
      if (nx) {
        const co = C.courses.find(x => x.id === nx.m.courseId);
        now = { course: C.cTitle(co), module: C.mTitle(nx.m), lesson: C.lTitle(nx.m.source, nx.i), n: nx.m.lessons.indexOf(nx.i) + 1, of: nx.m.lessons.length,
          started: courses.some(c => c.done > 0) };
      }
      const events = [];
      (st.trainingLog || []).forEach(e => {
        if (!e || !C.moduleOfLesson(e.courseId, e.mod)) return;
        const ck = e.ev && e.ev.check, lb = lessonLabel(e.courseId, e.mod);
        events.push({ at: ms(e.at), kind: 'lesson', title: lb.lesson, sub: lb.module, score: ck && ck.total ? ck.score + '/' + ck.total : null });
      });
      Object.entries(st.checkRetakes || {}).forEach(([k, arr]) => {
        const [src, i] = k.split(':'); if (!C.moduleOfLesson(src, +i)) return;
        (arr || []).forEach(a => events.push({ at: ms(a.at), kind: 'retake', title: C.lTitle(src, +i), sub: lessonLabel(src, +i).module, score: a.total ? a.score + '/' + a.total : null }));
      });
      (st.ledger || []).forEach(e => {
        if (e.type === 'cert_issued' && e.kind === 'program') {
          const co = C.courses.find(x => x.id === e.programId);
          if (co) events.push({ at: ms(e.at), kind: 'cert', title: C.cTitle(co), sub: e.score != null ? e.score + '%' : '' });
        }
      });
      events.sort((a, b) => b.at - a.at);
      const lastAt = events.length ? events[0].at : 0;
      const days = lastAt ? Math.floor((Date.now() - lastAt) / DAY) : null;
      const scored = courses.filter(c => c.score != null);
      const failing = scored.filter(c => c.answered === c.assessable && !c.passed);
      return {
        dept: pf.dept || (st.profile && st.profile.dept) || '',
        courses, req, done, pct: req ? Math.round(done / req * 100) : 0, now, events, lastAt, days,
        coursesDone: courses.filter(c => c.complete).length, certs: courses.filter(c => c.eligible).length,
        score: scored.length ? Math.round(scored.reduce((a, c) => a + c.score, 0) / scored.length) : null,
        failing, weekLessons: events.filter(e => e.kind === 'lesson' && Date.now() - e.at < 7 * DAY).length
      };
    });
  }

  /* ---------- the cockpit's own summary, re-pointed: one source for every cockpit number ---------- */
  const baseSummary = memberSummary;
  window.memberSummary = memberSummary = function (m) {
    const s = baseSummary(m), c = curOf(m);
    /* initials from letters only: "Admin (test)" was "A(" */
    s.initials = s.name.replace(/[^\p{L}\s]/gu, ' ').trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase() || s.initials;
    s.cur = c; s.pathPct = c.pct; s.coursesDone = c.coursesDone; s.days = c.days;
    /* needs attention: never started, quiet for 10+ days, or finished a course's questions below the pass mark */
    s.atRisk = c.done === 0 || (c.days != null && c.days > 10) || c.failing.length > 0;
    return s;
  };

  const statusOf = s => {
    const c = s.cur;
    if (c.done === 0) return { cls: 'risk', txt: W('Not started', 'Por começar') };
    if (c.failing.length) return { cls: 'risk', txt: W('Below pass mark', 'Abaixo do mínimo') };
    if (c.days != null && c.days > 10) return { cls: 'risk', txt: W(`Quiet ${c.days}d`, `Parado há ${c.days}d`) };
    if (!c.now) return { cls: 'ok', txt: W('All complete', 'Tudo concluído') };
    return { cls: 'ok', txt: W('On track', 'Em dia') };
  };
  const ago = d => d == null ? '—' : d === 0 ? W('today', 'hoje') : d === 1 ? W('yesterday', 'ontem') : W(`${d}d ago`, `há ${d}d`);
  const agoMs = t => { const mins = Math.round((Date.now() - t) / 60000); if (mins < 60) return W(`${Math.max(1, mins)} min ago`, `há ${Math.max(1, mins)} min`); const h = Math.round(mins / 60); if (h < 24) return W(`${h}h ago`, `há ${h}h`); return ago(Math.floor(h / 24)); };
  const courseDots = c => `<div class="tm-courses">${c.courses.map(co => `<span class="tm-co ${co.eligible ? 'cert' : co.complete ? 'done' : co.done ? 'part' : ''}" title="${esc(co.title)} · ${co.done}/${co.lessons}${co.score != null ? ' · ' + co.score + '%' : ''}${co.eligible ? ' · ' + W('certificate earned', 'comprovativo obtido') : ''}"><i style="width:${co.pct}%"></i></span>`).join('')}</div>`;

  window.memberRow = memberRow = function (s) {
    const c = s.cur, st = statusOf(s);
    const now = c.now
      ? `<div class="tm-now"><b>${esc(c.now.lesson)}</b><small>${esc(c.now.course)} › ${esc(c.now.module)} · ${W('lesson', 'lição')} ${c.now.n}/${c.now.of}</small></div>`
      : `<div class="tm-now"><b>✓ ${W('Every course complete', 'Todos os cursos concluídos')}</b></div>`;
    return `<tr class="mrow" data-action="member-detail" data-uid="${esc(s.uid)}" tabindex="0" aria-label="${esc(s.name)}">
      <td><div class="member"><span class="mi t-grad-3">${esc(s.initials)}</span><div>${esc(s.name)}<div class="mr">${esc(tdept(c.dept) || W('No department', 'Sem departamento'))}</div></div></div></td>
      <td>${now}</td>
      <td style="min-width:130px;"><div class="tm-pct"><div class="track"><div class="fill" style="width:${c.pct}%"></div></div><span>${c.done}/${c.req}</span></div>${courseDots(c)}</td>
      <td>${c.score == null ? '<span class="tm-faint">—</span>' : `<span class="tm-score ${c.score >= C.PASS ? 'ok' : 'low'}">${c.score}%</span>`}</td>
      <td><span class="comp-cell ${s.compHours >= s.compTarget ? 'ok' : s.compHours >= trainingPace(s.compTarget) - 1 ? '' : 'low'}">${s.compHours}/${s.compTarget}h</span></td>
      <td class="tm-faint">${ago(c.days)}</td>
      <td><span class="status-chip ${st.cls}">${st.cls === 'risk' ? '⚠' : '●'} ${st.txt}</span></td>
      <td><button class="btn btn-glass btn-sm" data-action="nudge" data-uid="${esc(s.uid)}" data-name="${esc(s.name)}">${W('Nudge', 'Lembrar')}</button></td>
    </tr>`;
  };

  /* the roster header matches the new columns; the stats row is replaced by the team panel */
  const baseCockpit = adminCockpitHTML;
  window.adminCockpitHTML = adminCockpitHTML = function () {
    return baseCockpit()
      .replace(/<thead><tr>.*?<\/tr><\/thead>/, `<thead><tr><th>${W('Member', 'Pessoa')}</th><th>${W('Doing now', 'A fazer agora')}</th><th>${W('Progress · courses', 'Progresso · cursos')}</th><th>${W('Score', 'Nota')}</th><th>40h</th><th>${W('Last active', 'Última atividade')}</th><th>${W('Status', 'Estado')}</th><th></th></tr></thead>`)
      .replace('<div id="mgrDash"></div>', '<div id="curTeam"></div><div id="mgrDash"></div>')
      .replace(/<p class="sect-sub">Your real members, sorted by who needs attention\.[^<]*<\/p>/, `<p class="sect-sub">${W('Everyone on the team, who needs attention first. Click a person for their courses and history.', 'Toda a equipa, primeiro quem precisa de atenção. Clique numa pessoa para ver os cursos e o histórico.')}</p>`);
  };

  /* ---------- the team panel: four numbers, then what people did recently ---------- */
  const baseMgr = paintMgrDash;
  window.paintMgrDash = paintMgrDash = function () {
    baseMgr();
    const el = $('#curTeam'); if (!el || !adminMembers) return;
    const pool = filteredMembers(), sums = pool.map(memberSummary);
    const stats = $('#cockpitStats'); if (stats) stats.style.display = 'none';
    const active = sums.filter(s => s.cur.days != null && s.cur.days <= 7).length;
    const week = sums.reduce((a, s) => a + s.cur.weekLessons, 0);
    const certs = sums.reduce((a, s) => a + s.cur.certs, 0);
    const attn = sums.filter(s => s.atRisk).length;
    const feed = sums.flatMap(s => s.cur.events.map(e => Object.assign({ s }, e))).sort((a, b) => b.at - a.at).slice(0, 14);
    const verb = e => e.kind === 'cert' ? W('earned the certificate for', 'obteve o comprovativo de')
      : e.kind === 'retake' ? W('retook the questions of', 'repetiu as perguntas de') : W('completed', 'concluiu');
    el.innerHTML = `<div class="admin-section cur-team">
      <div class="tm-stats">
        <div><b>${pool.length}</b><span>${W('People', 'Pessoas')}</span></div>
        <div><b>${active}</b><span>${W('Active this week', 'Ativas esta semana')}</span></div>
        <div><b>${week}</b><span>${W('Lessons done this week', 'Lições esta semana')}</span></div>
        <div><b>${certs}</b><span>${W('Certificates earned', 'Comprovativos obtidos')}</span></div>
        <div class="${attn ? 'warn' : ''}"><b>${attn}</b><span>${W('Need attention', 'Precisam de atenção')}</span></div>
      </div>
      <h2 style="margin-top:22px">${W('What the team is doing', 'O que a equipa está a fazer')}</h2>
      <p class="sect-sub">${W('The latest lessons, retakes and certificates, newest first.', 'As últimas lições, repetições e comprovativos, do mais recente.')}</p>
      ${feed.length ? `<div class="tm-feed">${feed.map(e => `<div class="tm-ev ${e.kind}" data-action="member-detail" data-uid="${esc(e.s.uid)}" role="button" tabindex="0">
          <span class="mi t-grad-3">${esc(e.s.initials)}</span>
          <div class="grow"><b>${esc(e.s.name)}</b> ${verb(e)} <b>${esc(e.title)}</b>${e.sub ? `<small>${esc(e.sub)}${e.score ? ' · ' + W('questions', 'perguntas') + ' ' + e.score : ''}</small>` : ''}</div>
          <span class="tm-when">${agoMs(e.at)}</span></div>`).join('')}</div>`
        : `<p class="empty-note" style="text-align:left;padding:6px 0;">${W('Nothing recorded yet. As people complete lessons, they appear here.', 'Ainda nada registado. À medida que concluem lições, aparecem aqui.')}</p>`}
    </div>`;
  };

  /* ---------- the person drawer: their courses, lesson by lesson ---------- */
  const baseDetail = openMemberDetail;
  window.openMemberDetail = openMemberDetail = function (uid) {
    baseDetail(uid);
    const m = (adminMembers || []).find(x => x.uid === uid), card = document.querySelector('#mdetModal .mdet'); if (!m || !card) return;
    const c = curOf(m);
    const rows = withState(m.state || {}, () => C.courses.map(co => {
      const cs = C.courseStats(co.id);
      const mods = C.modulesOfCourse(co.id).map(md => {
        const s = C.moduleStats(md);
        return `<div class="tm-mod"><span class="tm-dot ${s.complete ? 'done' : s.started ? 'part' : ''}"></span><span class="grow">${esc(C.mTitle(md))}</span><small>${s.done}/${s.required}</small></div>`;
      }).join('');
      const state = cs.eligible ? W('Certificate earned', 'Comprovativo obtido') : cs.passed ? W('Assessment passed', 'Avaliação aprovada') : cs.complete ? W('Completed', 'Concluído') : cs.done ? W('In progress', 'Em curso') : W('Not started', 'Por começar');
      return `<details class="tm-course" ${cs.done && !cs.complete ? 'open' : ''}><summary><b>${esc(C.cTitle(co))}</b><span>${cs.done}/${cs.lessons} · ${cs.score == null ? '—' : cs.score + '%'} · ${state}</span></summary>${mods}</details>`;
    }).join(''));
    const now = c.now ? `<p class="tm-drawer-now">${W('Doing now', 'A fazer agora')}: <b>${esc(c.now.lesson)}</b> · ${esc(c.now.course)} › ${esc(c.now.module)}</p>` : '';
    const anchor = [...card.querySelectorAll('.ob-eyebrow')].find(e => /Training log|Registo/.test(e.textContent));
    const html = `<div class="ob-eyebrow" style="margin-top:16px;">${W('Courses', 'Cursos')} · ${W('pass mark', 'mínimo')} ${C.PASS}%</div>${now}<div class="tm-courses-list">${rows}</div>`;
    if (anchor) anchor.insertAdjacentHTML('beforebegin', html); else card.insertAdjacentHTML('beforeend', html);
    const cd = [...card.querySelectorAll('.between')].find(r => /Courses done/.test(r.textContent)); if (cd) cd.querySelector('b').textContent = `${c.coursesDone}/${C.courses.length}`;
  };
})();
