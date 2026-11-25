/* ============================================================================
   CURRICULUM LAYER — Academy → Courses → Modules → Lessons
   ----------------------------------------------------------------------------
   Loaded after core/app.js. It does nothing unless the tenant's content file
   defines CURRICULUM, so EdenRise and Taipa are unaffected.

   THE MODEL
   · A CATALOG item is a MODULE (or the source of several, see `lessons:[]`).
     It keeps its id, so every learner record stays valid.
   · A LESSON is one video of an item, identified "<item id>:<index>" — the
     exact key learner records already use (trainingLog, ledger, progress).
   · A COURSE groups modules and owns the outcomes, the published requirements
     and the certificate.

   WHAT IS MEASURED, KEPT APART
   · Content progress  — lessons completed / required lessons.
                         A lesson is completed when its questions were answered
                         (the moment that records training time), or when the
                         whole item was finished under the previous rules.
   · Assessment score  — right answers / questions across the course, best
                         attempt per lesson. Retakes allowed; history kept.
   · Pass mark         — CURRICULUM.passMark (70%).
   · Certificate       — every required lesson completed AND score ≥ pass mark.
   · Estimated time    — video minutes + ~1 minute of questions per lesson.
   · Recorded training — the hours in the training log, which credit only what
                         the player saw being watched.

   MIGRATION: nothing stored is rewritten. Retakes add S.checkRetakes only.
   Earlier per-module certificate records stay as historical awards with their
   original scope (Record tab). Delete CURRICULUM to revert.
============================================================================ */
(function () {
  if (typeof CURRICULUM === 'undefined' || !CURRICULUM || !Array.isArray(CURRICULUM.courses)) return;
  const PT = () => _lang() === 'pt';
  const PASS = CURRICULUM.passMark || 70;

  /* ---------- copy (EN / PT-PT) ---------- */
  const STR = {
    course: ['Course', 'Curso'], courses: ['Courses', 'Cursos'], module: ['Module', 'Módulo'], modules: ['modules', 'módulos'],
    module_one: ['module', 'módulo'], lesson: ['Lesson', 'Lição'], lessons: ['Lessons', 'Lições'], lessons_lc: ['lessons', 'lições'], lesson_one: ['lesson', 'lição'],
    academy: ['Academy', 'Academia'], est_time: ['Estimated time', 'Tempo estimado'], left: ['left', 'em falta'],
    est_note: ['videos plus about a minute of questions per lesson', 'vídeos e cerca de um minuto de perguntas por lição'],
    recorded: ['Recorded training time', 'Tempo de formação registado'], progress: ['Progress', 'Progresso'],
    completed: ['Completed', 'Concluído'], assess_passed: ['Assessment passed', 'Avaliação aprovada'], cert_earned: ['Certificate earned', 'Comprovativo obtido'],
    not_started: ['Not started', 'Por começar'], in_progress: ['In progress', 'Em curso'],
    outcomes_h: ['What you will be able to do', 'O que vai conseguir fazer'], audience_h: ['Who it is for', 'Para quem é'], prereq_h: ['Before you start', 'Antes de começar'],
    req_h: ['Assessment and completion', 'Avaliação e conclusão'],
    req_1: ['Complete every required lesson: watch it and answer its two questions.', 'Concluir todas as lições obrigatórias: ver e responder às duas perguntas.'],
    req_2: ['Assessment: the questions at the end of each lesson. Pass mark {p}% across the course; your best attempt at each lesson counts, and you can retake any lesson\'s questions.', 'Avaliação: as perguntas no fim de cada lição. Nota mínima de {p}% no curso; conta a melhor tentativa em cada lição, e pode repetir as perguntas de qualquer lição.'],
    req_3: ['Certificate: issued for the course once both are met.', 'Comprovativo: emitido para o curso quando as duas condições estão cumpridas.'],
    req_note: ['Optional lessons do not count towards completion or the assessment.', 'As lições opcionais não contam para a conclusão nem para a avaliação.'],
    cert_h: ['Certificate', 'Comprovativo'], cert_dl: ['Download certificate', 'Transferir comprovativo'],
    cert_locked: ['Not earned yet. It is issued when every required lesson is completed and the assessment is passed.', 'Ainda não obtido. É emitido quando todas as lições obrigatórias estão concluídas e a avaliação aprovada.'],
    score_lbl: ['Assessment score', 'Resultado da avaliação'], pass_lbl: ['pass mark', 'nota mínima'], answered: ['questions answered', 'perguntas respondidas'],
    not_yet_passed: ['Below the pass mark: fix the questions you missed in the lessons marked "Fix".', 'Abaixo da nota mínima: corrija as perguntas que falhou nas lições marcadas "Corrigir".'],
    start: ['Start', 'Começar'], resume: ['Continue', 'Continuar'], start_lesson: ['Start lesson', 'Começar a lição'], continue_lesson: ['Continue learning', 'Continuar a aprender'],
    rewatch: ['Watch again', 'Ver de novo'], next_module: ['Continue to next module', 'Continuar para o módulo seguinte'], next_course: ['Next course', 'Curso seguinte'],
    retake: ['Retake', 'Repetir'], questions: ['questions', 'perguntas'], optional: ['Optional', 'Opcional'],
    q_pending: ['Questions pending', 'Perguntas por responder'], answer_q: ['Answer the questions', 'Responder às perguntas'],
    unanswered: ['{n} required lesson(s) still need their questions answered before the certificate.', 'Faltam responder às perguntas de {n} lição(ões) obrigatória(s) para o comprovativo.'], watched: ['Watched', 'Visto'],
    in_course: ['Part of', 'Parte de'], module_done: ['Module complete', 'Módulo concluído'], course_done: ['Course complete', 'Curso concluído'],
    explore_sub: ['Courses', 'Cursos'], lib_courses_sub: ['Each course is a full learning experience with its own certificate.', 'Cada curso é uma experiência de formação completa, com o seu comprovativo.'],
    lib_other_h: ['Other courses', 'Outros cursos'], lib_modules_h: ['All modules', 'Todos os módulos'], lib_modules_sub: ['Filter by department to see what is useful in each team. Every module belongs to a course.', 'Filtre por departamento para ver o que é útil em cada equipa. Cada módulo pertence a um curso.'],
    prev: ['Previous lesson', 'Lição anterior'], next: ['Next lesson', 'Lição seguinte'], back_module: ['Module', 'Módulo'],
    result_h: ['Course complete', 'Curso concluído'], result_cert: ['Your certificate is ready.', 'O seu comprovativo está pronto.'],
    result_retake: ['Retake the questions you missed to reach the pass mark.', 'Repita as perguntas que falhou para chegar à nota mínima.'],
    go_course: ['Open the course', 'Abrir o curso'], close: ['Close', 'Fechar'],
    hist_h: ['Earlier records', 'Registos anteriores'],
    hist_sub: ['Issued under the rules in force at the time, with their original scope. They are kept as they were.', 'Emitidos com as regras em vigor na altura, com o âmbito original. Mantêm-se como foram emitidos.'],
    hist_scope: ['Module record', 'Registo de módulo'], hist_flag: ['For review: below the current {p}% pass mark, or issued without an assessment score.', 'A rever: abaixo da nota mínima atual de {p}%, ou emitido sem resultado de avaliação.'],
    course_certs_h: ['Course certificates', 'Comprovativos de curso'], none_yet: ['None yet. Complete a course and pass its assessment.', 'Ainda nenhum. Conclua um curso e passe a avaliação.'],
    modules_of: ['modules', 'módulos'],
    mods_in_path: ['Modules in your path', 'Módulos do seu percurso'], next_courses: ['Where to go next', 'Para onde ir a seguir'],
    explore_sub2: ['Beyond your path', 'Para além do seu percurso'],
    up_next: ['Up next', 'A seguir'],
    videos: ['videos', 'vídeos'], video_one: ['video', 'vídeo'],
    see_more: ['See more', 'Ver mais'], see_less: ['Show less', 'Mostrar menos'],
    about_course: ['About this course', 'Sobre este curso'], chapters: ['Chapters', 'Capítulos'],
    next_in_course: ['Next in this course', 'A seguir neste curso'], more_modules: ['Other modules in this course', 'Outros módulos deste curso'],
    fix_one: ['Review 1 question', 'Rever 1 pergunta'], fix_n: ['Review {n} questions', 'Rever {n} perguntas'],
    fix_h: ['Review', 'Rever'],
    fix_sub: ['The questions you have not got yet, one lesson at a time. Watch the moment again, then answer: your best result is what counts, and it is what earns the certificate.', 'As perguntas que ainda não acertou, uma lição de cada vez. Veja o momento de novo e responda: conta o seu melhor resultado, e é ele que dá o comprovativo.'],
    fix_none: ['Nothing to review. Every question you have answered is right.', 'Nada para rever. Todas as perguntas que respondeu estão certas.'],
    mods_done: ['modules', 'módulos'],
    fix_item: ['{n} to fix', '{n} para corrigir'], see_course: ['See the course', 'Ver o curso'], your_path: ['Your path', 'O seu percurso']
  };
  const L = (k, vars) => { const v = (STR[k] || [k, k])[PT() ? 1 : 0]; return vars ? v.replace(/\{(\w+)\}/g, (_, n) => vars[n]) : v; };

  /* ---------- model ---------- */
  const courses = CURRICULUM.courses;
  const modules = [];
  courses.forEach(co => co.modules.forEach(m => {
    const src = m.source || m.id, item = courseById(src); if (!item) return;
    modules.push({ id: m.id, courseId: co.id, source: src, item, lessons: m.lessons || item.modules.map((_, i) => i), optional: m.optional || [], def: m });
  }));
  const courseOf = id => courses.find(c => c.id === id) || null;
  const moduleOf = id => modules.find(m => m.id === id) || null;
  const modulesOfCourse = id => modules.filter(m => m.courseId === id);
  const moduleOfLesson = (src, i) => modules.find(m => m.source === src && m.lessons.includes(i)) || null;
  const lkey = (src, i) => src + ':' + i;
  const cTitle = co => (PT() && co.pt && co.pt.title) || co.title;
  const cField = (co, f) => (PT() && co.pt && co.pt[f]) || co[f];
  const mTitle = m => m.def.title ? ((PT() && m.def.pt && m.def.pt.title) || m.def.title) : ctitle(m.item);
  const mOutcome = m => m.def.outcome ? ((PT() && m.def.pt && m.def.pt.outcome) || m.def.outcome) : (((PT() && m.item.outcomes_pt) || m.item.outcomes || [])[0] || chook(m.item));
  const lTitle = (src, i) => { const o = CURRICULUM.lessonTitles && CURRICULUM.lessonTitles[lkey(src, i)]; return (o && (PT() ? o.pt : o.en)) || cmods(courseById(src))[i] || courseById(src).modules[i]; };
  const lMins = (src, i) => { const c = courseById(src); return (c.moduleDurations && c.moduleDurations[i]) || 6; };
  const isOptional = (m, i) => m.optional.includes(i);

  /* ---------- lesson state ---------- */
  const logEntry = (src, i) => (S.trainingLog || []).find(e => e && e.courseId === src && e.mod === i);
  const watched = (src, i) => (S.ledger || []).some(e => e.type === 'module_complete' && e.courseId === src && e.mod === i);
  /* A lesson is done when its check is recorded. The item-level `done` flag is set when the item's LAST
     lesson is watched, so read as "every lesson done" it let a learner who opened a module's last lesson
     first complete the whole module. It is kept only for records made before the curriculum existed
     (CURRICULUM.since), so earlier learners keep the progress they had. */
  const SINCE = Date.parse(CURRICULUM.since || '2026-11-05T00:00:00Z');
  const legacyDone = src => { const p = (S.progress || {})[src]; return !!(p && p.done && (!p.doneAt || p.doneAt < SINCE)); };
  const lessonDone = (src, i) => !!logEntry(src, i) || legacyDone(src);
  function attempts(src, i) {
    const out = [], e = logEntry(src, i), ck = e && e.ev && e.ev.check;
    if (ck && ck.kind === 'assessment' && ck.total) out.push({ score: ck.score, total: ck.total, at: ck.at || e.at });
    ((S.checkRetakes || {})[lkey(src, i)] || []).forEach(a => out.push(a));
    return out;
  }
  const best = (src, i) => attempts(src, i).reduce((b, a) => (!b || a.score / a.total > b.score / b.total) ? a : b, null);
  /* The questions still wrong in this lesson: from the best attempt that kept its per-question detail
     (first submissions always do; fixes and retakes do from bel115). null = nothing known to fix. */
  function misses(src, i) {
    const e = logEntry(src, i), ck = e && e.ev && e.ev.check;
    const all = [];
    if (ck && ck.kind === 'assessment' && ck.total && Array.isArray(ck.detail)) all.push({ score: ck.score, total: ck.total, detail: ck.detail });
    ((S.checkRetakes || {})[lkey(src, i)] || []).forEach(a => { if (Array.isArray(a.detail)) all.push(a); });
    if (!all.length) return null;
    const b = all.reduce((x, a) => (!x || a.score / a.total >= x.score / x.total) ? a : x, null);
    /* an older attempt without detail can be the real best (retakes before bel115): never ask to fix a lesson
       whose best result is already full, or one whose detail-bearing attempt is worse than the best */
    const top = best(src, i);
    if (top && (top.score >= top.total || top.score / top.total > b.score / b.total)) return null;
    const wrong = b.detail.filter(d => !d.ok);
    return wrong.length ? { base: b, wrong } : null;
  }
  /* lesson summaries + chapters, written from each transcript; fetched once, after first paint */
  let LMETA = null, lmetaAsked = false;
  function lessonMeta(src, i) {
    if (!lmetaAsked) {
      lmetaAsked = true;
      const v = ((document.querySelector('script[src*="curriculum.js"]') || {}).src || '').match(/v=(\w+)/);
      fetch('knowledge/lessons.json' + (v ? '?v=' + v[1] : '')).then(r => r.ok ? r.json() : null).then(j => {
        if (!j) return; LMETA = j;
        if (/^#\/(course|module)\//.test(location.hash) && typeof render === 'function') {
          /* keep what the learner already opened: modules and lesson details survive the re-render */
          const openMods = [...document.querySelectorAll('details.cur-module')].map(d => d.open);
          const openRows = [...document.querySelectorAll('.cl-more.on')].map(b => b.getAttribute('aria-controls'));
          render();
          requestAnimationFrame(() => {
            document.querySelectorAll('details.cur-module').forEach((d, k) => { if (openMods[k] != null) d.open = openMods[k]; });
            openRows.forEach(id => { const b = document.querySelector(`.cl-more[aria-controls="${id}"]`), d = document.getElementById(id); if (b && d) { d.hidden = false; b.classList.add('on'); b.setAttribute('aria-expanded', 'true'); } });
          });
        }
      }).catch(() => {});
    }
    return LMETA && LMETA[src] && LMETA[src][String(i)] || null;
  }
  const lThumb = (src, i) => { const b = (typeof LESSON_THUMBS !== 'undefined' && LESSON_THUMBS[lkey(src, i)]) || ''; return b ? b + '_320x180' : ''; };
  const tc = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');

  /* ---------- module / course state ---------- */
  function moduleStats(m) {
    const req = m.lessons.filter(i => !isOptional(m, i));
    const done = req.filter(i => lessonDone(m.source, i)).length;
    const minsAll = m.lessons.reduce((a, i) => a + lMins(m.source, i) + 1, 0);
    const minsLeft = req.filter(i => !lessonDone(m.source, i)).reduce((a, i) => a + lMins(m.source, i) + 1, 0);
    return { lessons: m.lessons.length, required: req.length, done, complete: req.length > 0 && done === req.length, pct: req.length ? Math.round(done / req.length * 100) : 0, mins: minsAll, minsLeft, started: m.lessons.some(i => lessonDone(m.source, i) || watched(m.source, i)) };
  }
  function courseStats(id) {
    const ms = modulesOfCourse(id);
    const req = ms.flatMap(m => m.lessons.filter(i => !isOptional(m, i)).map(i => [m.source, i]));
    const done = req.filter(([s, i]) => lessonDone(s, i)).length;
    let right = 0, total = 0, answered = 0, assessable = 0;
    req.forEach(([s, i]) => { const b = best(s, i); assessable++; if (b) { answered++; right += b.score; total += b.total; } });
    const score = total ? Math.round(right / total * 100) : null;
    const recordedH = (S.trainingLog || []).filter(e => e && ms.some(m => m.source === e.courseId && m.lessons.includes(e.mod))).reduce((a, e) => a + (e.hours || 0), 0);
    const complete = req.length > 0 && done === req.length;
    const passed = score != null && answered === assessable && score >= PASS;
    const lastAt = Math.max(0, ...req.map(([s, i]) => Math.max(0, ...attempts(s, i).map(a => +new Date(a.at) || 0), (logEntry(s, i) || {}).at || 0)));
    const unanswered = req.filter(([s, i]) => lessonDone(s, i) && !best(s, i)).length;   /* done, but no questions on record */
    return { unanswered, modules: ms.length, lessons: req.length, done, complete, pct: req.length ? Math.round(done / req.length * 100) : 0,
      mins: ms.reduce((a, m) => a + moduleStats(m).mins, 0), minsLeft: ms.reduce((a, m) => a + moduleStats(m).minsLeft, 0),
      recordedH, score, answered, assessable, passed, eligible: complete && passed, completedAt: complete ? (lastAt || null) : null };
  }
  /* the next lesson to open in a course (first incomplete required, in order), else null */
  function nextInCourse(id) {
    for (const m of modulesOfCourse(id)) for (const i of m.lessons) if (!isOptional(m, i) && !lessonDone(m.source, i)) return { m, i };
    return null;
  }
  /* the learner's path, as modules: each path item expands into its modules, in curriculum order */
  function pathModules() {
    const out = [];
    /* the goal's exact modules first (S.pathMods), then anything the learner added that they don't cover */
    (Array.isArray(S.pathMods) ? S.pathMods : []).forEach(id => { const m = moduleOf(id); if (m && !out.includes(m)) out.push(m); });
    (S.path || []).forEach(id => { if (out.some(m => m.source === id)) return; modules.filter(m => m.source === id).forEach(m => { if (!out.includes(m)) out.push(m); }); });
    return out;
  }
  function nextLessonGlobal() {
    for (const m of pathModules()) for (const i of m.lessons) if (!isOptional(m, i) && !lessonDone(m.source, i)) return { m, i };
    for (const co of courses) { const n = nextInCourse(co.id); if (n) return n; }
    return null;
  }
  /* Analytics: average progress per library category (department) the learner has touched */
  function categoryProgress() {
    const cats = CURRICULUM.categories || [];
    return cats.map(c => {
      const ms = modules.filter(m => (m.def.cats || []).includes(c.key)); if (!ms.length) return null;
      const st = ms.map(moduleStats); if (!st.some(x => x.done || x.started)) return null;
      return [PT() ? c.pt : c.en, Math.round(st.reduce((a, x) => a + x.pct, 0) / st.length)];
    }).filter(Boolean);
  }
  window.CUR = { misses, categoryProgress, courses, modules, courseOf, moduleOf, modulesOfCourse, moduleOfLesson, moduleStats, courseStats, nextInCourse, nextLessonGlobal, pathModules, lessonDone, best, attempts, L, cTitle, mTitle, lTitle, PASS };

  /* ---------- small renderers ---------- */
  const bar = pct => `<div class="cur-bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div>`;
  const posterStyle = (src, pos) => src ? ` data-bg="${(window.thumbOf || (x => x))(src)}"${pos ? ` style="background-position:${pos}"` : ''}` : '';
  const typeTag = (k, extra) => `<span class="cur-type">${L(k)}${extra ? ` · ${esc(extra)}` : ''}</span>`;
  function stateLabel(st) {
    if (st.eligible) return `<span class="cur-state ok">✓ ${L('cert_earned')}</span>`;
    if (st.complete) return `<span class="cur-state ok">✓ ${L('completed')}</span>`;
    if (st.done) return `<span class="cur-state">${L('in_progress')} · ${st.pct}%</span>`;
    return '';
  }
  const vids = co => modulesOfCourse(co.id).reduce((a, m) => a + m.lessons.length, 0);
  function courseCardHTML(co) {
    const st = courseStats(co.id);
    return `<article class="card cur-card" data-action="goto" data-route="#/course/${co.id}">
      <div class="thumb t-grad-1 ${co.poster ? 'has-poster' : ''}"${posterStyle(co.poster, co.posterPos)}></div>
      <div class="card-body">
        ${typeTag('course')}
        <h3>${esc(cTitle(co))}</h3>
        <p class="card-hook">${esc(cField(co, 'promise'))}</p>
        <div class="meta"><span>${st.modules} ${L('modules')}</span><span class="dot"></span><span>${vids(co)} ${L('videos')}</span><span class="dot"></span><span>${fmtMins(st.mins)}</span></div>
        ${st.done ? bar(st.pct) : ''}
        ${stateLabel(st)}
      </div>
    </article>`;
  }
  /* modules cut from one item share its poster; never show the same thumbnail twice (round 5) */
  const sharedPoster = m => modules.filter(x => x.source === m.source).length > 1;
  const modPoster = m => (sharedPoster(m) && lThumb(m.source, m.lessons[0])) ? lThumb(m.source, m.lessons[0]).replace('_320x180', '_640x360') : m.item.poster;
  function moduleCardHTML(m, locked) {
    const st = moduleStats(m), co = courseOf(m.courseId), pos = sharedPoster(m) ? null : m.item.posterPos;
    return `<article class="card cur-card${locked ? ' locked' : ''}"${locked ? ' aria-disabled="true"' : ` data-action="goto" data-route="#/module/${m.id}"`}>
      <div class="thumb t-grad-${m.item.grad} ${modPoster(m) ? 'has-poster' : ''}"${posterStyle(modPoster(m), pos)}>${locked ? '<span class="lock-badge" aria-hidden="true">🔒</span>' : ''}</div>
      <div class="card-body">
        ${typeTag('module', cTitle(co))}
        <h3>${esc(mTitle(m))}</h3>
        <p class="card-hook">${esc(mOutcome(m))}</p>
        <div class="meta"><span>${st.lessons} ${st.lessons === 1 ? L('video_one') : L('videos')}</span><span class="dot"></span><span>${fmtMins(st.mins)}</span></div>
        ${st.done && !st.complete ? bar(st.pct) : ''}
        ${st.complete ? `<span class="cur-state ok">✓ ${L('completed')}</span>` : ''}
      </div>
    </article>`;
  }
  const crumbs = parts => `<nav class="cur-crumbs" aria-label="Breadcrumb">${parts.map((p, k) => p.href && k < parts.length - 1 ? `<a href="${p.href}">${esc(p.t)}</a>` : `<span${k === parts.length - 1 ? ' aria-current="page"' : ''}>${esc(p.t)}</span>`).join('<span class="sep" aria-hidden="true">›</span>')}</nav>`;

  function lessonRowHTML(m, i, n) {
    const done = lessonDone(m.source, i), b = best(m.source, i), opt = isOptional(m, i), w = watched(m.source, i);
    const nx = nextInCourse(m.courseId), isNext = nx && nx.m === m && nx.i === i;
    const ms = misses(m.source, i);
    const q = b ? `<span class="cur-q ${b.score === b.total ? 'ok' : ''}">${b.score}/${b.total} ${L('questions')}</span>` : (w && !done ? `<span class="cur-q">${L('q_pending')}</span>` : '');
    /* missed questions → a focused fix (only those, with the moment); no known detail → the old retake */
    const act = ms ? `<button class="cur-fix" data-action="cur-fix" data-id="${m.source}" data-mod="${i}">${ms.wrong.length === 1 ? L('fix_one') : L('fix_n', { n: ms.wrong.length })}</button>`
      : b && b.score < b.total ? `<button class="cur-retake" data-action="cur-retake" data-id="${m.source}" data-mod="${i}">${L('retake')}</button>`
      : (done && !b && !opt ? `<button class="cur-retake" data-action="cur-retake" data-id="${m.source}" data-mod="${i}">${L('answer_q')}</button>` : '');
    const meta = lessonMeta(m.source, i), th = lThumb(m.source, i), did = `cl-${m.source}-${i}`;
    const sum = meta && meta.summary ? (PT() ? meta.summary.pt : meta.summary.en) : '';
    const chs = meta && Array.isArray(meta.chapters) ? meta.chapters : [];
    /* round 6 gate: a lesson is open when it is done, or it is the first not-done lesson of its module */
    /* optional lessons are always open and never block the required ones after them */
    const firstOpen = m.lessons.find(x => !isOptional(m, x) && !lessonDone(m.source, x));
    const locked = !done && !opt && i !== firstOpen;
    return `<div class="cl ${done ? 'done' : ''} ${isNext ? 'current' : ''}${locked ? ' locked' : ''}">
      <button class="cl-main" ${locked ? 'disabled aria-disabled="true"' : `data-action="play" data-id="${m.source}" data-mod="${i}"`} aria-label="${L('lesson')} ${n}: ${esc(lTitle(m.source, i))}${done ? ' · ' + L('completed') : ''}${locked ? ' · 🔒' : ''}${b ? ` · ${b.score}/${b.total} ${L('questions')}` : ''}">
        <span class="cl-thumb"${th ? ` style="background-image:url('${th}')"` : ''}><span class="cl-len">${lMins(m.source, i)} min</span>${done ? '<span class="cl-tick" aria-hidden="true">✓</span>' : ''}</span>
        <span class="cl-text"><span class="cl-n">${L('lesson')} ${n}${opt ? ` · ${L('optional')}` : ''}${isNext ? ` · ${(w || ((prog(m.source) || {}).pos || {}).mod === i) ? L('resume') : L('up_next')}` : ''}</span><b>${esc(lTitle(m.source, i))}</b>${q ? `<span class="cl-q">${q}</span>` : ''}</span>
      </button>
      <span class="cl-side">${act}${sum || chs.length ? `<button class="cl-more" data-action="cur-more" aria-expanded="false" aria-controls="${did}" aria-label="${L('see_more')}"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></button>` : ''}</span>
      ${sum || chs.length ? `<div class="cl-detail" id="${did}" hidden>
        ${sum ? `<p class="cl-sum">${esc(sum)}</p>` : ''}
        ${chs.length ? `<div class="cl-ch-h">${L('chapters')}</div><ol class="cl-chs">${chs.map(c => `<li><button data-action="review-moment" data-id="${m.source}" data-mod="${i}" data-t="${c.t}"><span class="cl-tc">${tc(c.t)}</span><span>${esc(PT() ? c.pt : c.en)}</span></button></li>`).join('')}</ol>` : ''}
      </div>` : ''}
    </div>`;
  }

  /* ---------- course overview ---------- */
  function renderCourseOverview(id) {
    const co = courseOf(id); if (!co) return null;
    const ms = modulesOfCourse(id); if (!ms.length) return null;   /* a course whose modules all failed to resolve */
    const st = courseStats(id), nx = nextInCourse(id);
    const outcomes = cField(co, 'outcomes') || [];
    const aud = cField(co, 'audience'), pre = cField(co, 'prerequisites');
    const primary = nx ? `<button class="btn btn-primary" data-action="play" data-id="${nx.m.source}" data-mod="${nx.i}">▶&nbsp; ${st.done ? L('resume') : L('start')}: ${esc(lTitle(nx.m.source, nx.i))}</button>`
      : `<button class="btn btn-primary" data-action="goto" data-route="#/module/${ms[0].id}">▶&nbsp; ${L('rewatch')}</button>`;
    const certBtn = st.eligible ? `<button class="btn btn-glass" data-action="cur-cert" data-id="${id}">⤓ ${L('cert_dl')}</button>` : '';
    return `<div class="page">
      <div class="course-hero">
        <div class="bg t-grad-1"${co.poster ? ` style="background-image:url('${co.poster}');background-size:cover;background-position:center"` : ''}></div>
        <div class="course-hero-inner">
          ${co.poster ? `<div class="course-poster has-poster" style="background-image:url('${co.poster}')${co.posterPos ? `;background-position:${co.posterPos}` : ''}"></div>` : ''}
          <div class="course-info">
            ${crumbs([{ t: brandAcademy(), href: '#/home' }, { t: cTitle(co) }])}
            <div class="hero-meta">${typeTag('course')}<span class="sep"></span><span>${st.modules} ${L('modules')} · ${st.lessons} ${L('lessons_lc')}</span><span class="sep"></span><span>${L('est_time')} ${fmtMins(st.mins)}</span></div>
            <h1>${esc(cTitle(co))}</h1>
            <p class="course-hook">${esc(cField(co, 'promise'))}</p>
            <div class="hero-actions">${primary}${certBtn}</div>
            <div class="cur-status">
              ${bar(st.pct)}
              <span>${L('progress')} ${st.pct}% · ${st.done}/${st.lessons} ${L('lessons_lc')}${st.minsLeft ? ` · ${fmtMins(st.minsLeft)} ${L('left')}` : ''}</span>
              <span class="cur-chips">${st.complete ? `<span class="cur-state ok">✓ ${L('completed')}</span>` : ''}${st.passed ? `<span class="cur-state ok">✓ ${L('assess_passed')}</span>` : ''}${st.eligible ? `<span class="cur-state ok">✓ ${L('cert_earned')}</span>` : ''}</span>
            </div>
            ${st.score != null && st.answered === st.assessable && !st.passed ? `<p class="cur-warn">${L('not_yet_passed')}</p>` : ''}
            ${st.unanswered ? `<p class="cur-warn">${L('unanswered', { n: st.unanswered })}</p>` : ''}
          </div>
        </div>
      </div>
      <details class="cur-about"><summary><span>${L('about_course')}</span><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></summary>
      <p class="cur-p cur-about-desc">${esc(cField(co, 'desc'))}</p>
      <section class="course-intro cur-intro">
        <div class="ci-col"><h2>${L('outcomes_h')}</h2><ul class="ci-list">${outcomes.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
          ${aud ? `<h3 class="cur-h3">${L('audience_h')}</h3><p class="cur-p">${esc(aud)}</p>` : ''}
          ${pre ? `<h3 class="cur-h3">${L('prereq_h')}</h3><p class="cur-p">${esc(pre)}</p>` : ''}</div>
        <div class="ci-col"><h2>${L('req_h')}</h2><ol class="ci-steps"><li>${L('req_1')}</li><li>${L('req_2', { p: PASS })}</li><li>${L('req_3')}</li></ol>
          <p class="ci-note">${L('req_note')}</p>
          <div class="cur-assess">
            <div><span>${L('score_lbl')}</span><b>${st.score != null ? st.score + '%' : '—'}</b><small>${L('pass_lbl')} ${PASS}% · ${st.answered}/${st.assessable} ${L('answered')}</small></div>
            <div><span>${L('recorded')}</span><b>${fmtMins(Math.round(st.recordedH * 60))}</b><small>${L('est_time')} ${fmtMins(st.mins)} (${L('est_note')})</small></div>
          </div>
          <h3 class="cur-h3">${L('cert_h')}</h3>
          <p class="cur-p">${st.eligible ? `✓ ${L('cert_earned')} · ${fmtCertDate(new Date(st.completedAt))}` : L('cert_locked')}</p>
        </div>
      </section></details>
      <div class="rail-head" style="margin-top:14px;"><h2>${L('courses') === 'Cursos' ? 'Módulos' : 'Modules'}</h2></div>
      <div class="cur-modules">${ms.map((m, k) => {
        const s = moduleStats(m);
        return `<details class="cur-module"${s.done && !s.complete ? ' open' : (k === 0 && !st.done ? ' open' : '')}>
          <summary><span class="cur-mnum">${s.complete ? '✓' : k + 1}</span><span class="cur-mtitle"><b>${esc(mTitle(m))}</b><small>${esc(mOutcome(m))}</small></span>
            <span class="cur-mmeta">${s.lessons} ${s.lessons === 1 ? L('lesson_one') : L('lessons_lc')} · ${fmtMins(s.mins)}${s.done ? ` · ${s.pct}%` : ''}</span></summary>
          <div class="module-list cur-inner">${m.lessons.map((i, n) => lessonRowHTML(m, i, n + 1)).join('')}</div>
          <a class="cur-open" href="#/module/${m.id}">${L('module')}: ${esc(mTitle(m))} →</a>
        </details>`; }).join('')}</div>
      <div class="page-pad" style="padding-top:0;">${missionCardHTML({ id })}${window.missionAdminHTML ? missionAdminHTML(id) : ''}</div>
      ${footerHTML()}</div>`;
  }

  /* ---------- module detail ---------- */
  function renderModulePage(id) {
    const m = moduleOf(id); if (!m) return null;
    const c = m.item, co = courseOf(m.courseId), st = moduleStats(m);
    const ms = modulesOfCourse(m.courseId), k = ms.indexOf(m), nextM = ms[k + 1];
    const nx = m.lessons.find(i => !isOptional(m, i) && !lessonDone(m.source, i));
    const first = m.lessons[0];
    const primary = nx != null
      ? `<button class="btn btn-primary" data-action="play" data-id="${m.source}" data-mod="${nx}">▶&nbsp; ${st.started ? L('resume') : L('start_lesson')}: ${esc(lTitle(m.source, nx))}</button>`
      : `<button class="btn btn-primary" data-action="play" data-id="${m.source}" data-mod="${first}">▶&nbsp; ${L('rewatch')}</button>`;
    const nextBtn = nextM && st.complete ? `<button class="btn btn-glass" data-action="goto" data-route="#/module/${nextM.id}">${L('next_module')} →</button>` : '';
    const optNote = m.def.optionalNote ? ((PT() && m.def.pt && m.def.pt.optionalNote) || m.def.optionalNote) : '';
    return `<div class="page">
      <div class="course-hero">
        <div class="bg t-grad-${c.grad}"${(c.heroArt || c.poster) ? ` style="background-image:url('${c.heroArt || c.poster}');background-size:cover;background-position:center"` : ''}></div>
        <div class="course-hero-inner">
          ${c.poster ? `<div class="course-poster has-poster" style="background-image:url('${c.poster}')${c.posterPos ? `;background-position:${c.posterPos}` : ''}"></div>` : `<div class="course-poster t-grad-${c.grad}">${svgIcon(c.icon)}</div>`}
          <div class="course-info">
            ${crumbs([{ t: brandAcademy(), href: '#/home' }, { t: cTitle(co), href: '#/course/' + co.id }, { t: mTitle(m) }])}
            <div class="hero-meta">${typeTag('module', `${k + 1}/${ms.length}`)}<span class="sep"></span><span>${st.lessons} ${st.lessons === 1 ? L('lesson_one') : L('lessons_lc')}</span><span class="sep"></span><span>${L('est_time')} ${fmtMins(st.mins)}</span></div>
            <h1>${esc(mTitle(m))}</h1>
            ${eduBylineHTML(c)}
            <p class="course-hook">${esc(mOutcome(m))}</p>
            <div class="hero-actions">${primary}${nextBtn}</div>
            <div class="cur-status">${bar(st.pct)}<span>${L('progress')} ${st.pct}% · ${st.done}/${st.required} ${L('lessons_lc')}${st.minsLeft ? ` · ${fmtMins(st.minsLeft)} ${L('left')}` : ''}</span>${st.complete ? `<span class="cur-state ok">✓ ${L('completed')}</span>` : ''}</div>
            <p class="cur-in">${L('in_course')} <a href="#/course/${co.id}">${esc(cTitle(co))}</a></p>
          </div>
        </div>
      </div>
      <div class="rail-head cur-lessons-head" style="margin-top:14px;"><h2>${L('lessons')}</h2>${optNote ? `<span class="hint">${esc(optNote)}</span>` : ''}</div>
      <div class="module-list">${m.lessons.map((i, n) => lessonRowHTML(m, i, n + 1)).join('')}</div>
      <div class="page-pad" style="padding-top:0;">${resourcesHTML(c)}${coachCardHTML(c)}</div>
      ${(() => { /* what comes after this module in its course; the last module points to the next course */
        const after = ms.slice(k + 1);
        if (after.length) return railHTML(L('next_in_course'), L('see_course'), after.map(moduleCardHTML), '#/course/' + co.id);
        const ci = courses.indexOf(co), nc = courses[ci + 1];
        return nc ? railHTML(L('next_course'), cTitle(nc), [courseCardHTML(nc)], '#/course/' + nc.id) : '';
      })()}
      ${footerHTML()}</div>`;
  }

  /* ---------- routing: #/course/<course|module>, #/module/<module> ---------- */
  window.curRoute = (route, param) => {
    if (route === 'module') return renderModulePage(param);
    if (route !== 'course') return null;
    if (courseOf(param)) return renderCourseOverview(param);
    if (moduleOf(param)) { history.replaceState(null, '', '#/module/' + param); return renderModulePage(param); }
    /* an item split into several modules (old link): the module holding the next lesson */
    const ms = modules.filter(m => m.source === param);
    if (ms.length) { const m = ms.find(x => !moduleStats(x).complete) || ms[0]; history.replaceState(null, '', '#/module/' + m.id); return renderModulePage(m.id); }
    return null;
  };

  /* ---------- cards everywhere: an item card becomes a module card ---------- */
  const _cardHTML = cardHTML;
  window.cardHTML = cardHTML = function (c, opts) {
    const ms = modules.filter(m => m.source === c.id);
    if (ms.length === 1) return moduleCardHTML(ms[0]);
    if (ms.length > 1) return courseCardHTML(courseOf(ms[0].courseId));
    return _cardHTML(c, opts);
  };
  window.curCourseCardHTML = courseCardHTML;
  /* the router captured the original library renderer by reference */
  if (typeof routes === 'object') { routes.library = function () { return renderLibrary(); }; }
  /* My learning → Your path: the stepper lists modules (with their course), not items */
  window.pathStepperHTML = pathStepperHTML = function () {
    const pm = pathModules(); const cur = pm.find(m => !moduleStats(m).complete);
    return `<div class="stepper">${pm.map(m => {
      const s = moduleStats(m), st = s.complete ? 'done' : m === cur ? 'current' : 'locked';
      const node = st === 'done' ? '✓' : st === 'current' ? '▶' : svgIcon(m.item.icon);
      const sub = st === 'done' ? L('completed') : st === 'current' ? `${L('in_progress')} · ${s.pct}%` : t('unlocks_after');
      return `<div class="seg ${st}"${st === 'locked' ? ' aria-disabled="true"' : ` data-action="goto" data-route="#/module/${m.id}"`}><div class="snode">${node}</div><div class="sl">${esc(mTitle(m))}</div><div class="sd">${sub}</div></div>`;
    }).join('')}</div>`;
  };

  /* ---------- home: path row of modules, Explore more = courses ---------- */
  window.pathRowHTML = pathRowHTML = function () {
    const pm = pathModules().slice(0, 8); if (!pm.length) return '';
    const cur = pm.find(m => !moduleStats(m).complete);
    const steps = pm.map((m, k) => {
      const s = moduleStats(m), st = s.complete ? 'done' : m === cur ? 'current' : 'locked';
      /* the first two tiles are on screen; the rest of the row is off to the right
         and fetches its art as the row scrolls (app.js lazyBackgrounds) */
      /* artwork ABOVE the words, never words over artwork: the covers carry their own lettering, and
         laying a second title over a cropped cover cut both (feedback 2, 5 Nov 2026). A 16:9 frame shows
         the whole 16:9 cover; hover lifts the tile like the Explore cards; a locked step does nothing. */
      const tag = st === 'locked' ? 'div' : 'button', thumb = (window.thumbOf || (x => x))(modPoster(m)),
        art = !modPoster(m) ? '' : k < 2 ? ` style="background-image:url('${thumb}')"` : ` data-bg="${thumb}"`;
      const sub = st === 'done' ? L('completed') : st === 'current' ? `${s.pct}% · ${fmtMins(s.minsLeft)} ${L('left')}` : t('unlocks_after');
      return `<${tag} class="pstep ps2 ${st}"${st === 'locked' ? ' aria-disabled="true"' : ` data-action="goto" data-route="#/module/${m.id}"`} aria-label="${k + 1}. ${esc(mTitle(m))} · ${sub}">
        <span class="ps-art t-grad-${m.item.grad || 1}"${art}><span class="pstep-n">${st === 'done' ? '✓' : k + 1}</span>${st === 'locked' ? '<span class="ps-lock" aria-hidden="true">🔒</span>' : ''}
          ${st === 'current' ? `<span class="pstep-bar"><i style="width:${s.pct}%"></i></span>` : ''}</span>
        <span class="ps-body"><span class="pstep-type">${L('module')} · ${esc(cTitle(courseOf(m.courseId)))}</span>
          <span class="pstep-t">${esc(mTitle(m))}</span>
          <span class="pstep-s">${sub}</span></span>
      </${tag}>`;
    }).join('');
    return `<section class="rail-section path-row-section">
      <div class="rail-head"><h2>${L('your_path')}</h2><a class="see-all" href="#/paths">${t('see_all')}</a></div>
      <div class="path-row">${steps}</div>
    </section>`;
  };
  /* My learning: the path as MODULES only (an item split into several modules used to surface as its course card),
     and "where to go next" as the courses not yet started */
  window.curPathRailsHTML = () => {
    const pm = pathModules();
    const rest = courses.filter(co => !modulesOfCourse(co.id).some(m => pm.includes(m)) && !courseStats(co.id).complete);
    const cur = pm.find(m => !moduleStats(m).complete);
    return railHTML(L('mods_in_path'), t('in_order'), pm.map(m => moduleCardHTML(m, !moduleStats(m).complete && m !== cur)), '#/library')
      + (rest.length ? railHTML(L('next_courses'), L('courses'), rest.map(courseCardHTML), '#/library') : '');
  };
  /* Explore more never repeats the path (feedback 3): the modules you don't have yet, then any course untouched by it */
  window.curExploreHTML = () => {
    const pm = pathModules();
    const ms = modules.filter(m => !pm.includes(m));
    const cs = courses.filter(co => !modulesOfCourse(co.id).some(m => pm.includes(m)));
    const cards = ms.map(moduleCardHTML).concat(cs.map(courseCardHTML));
    return cards.length ? railHTML(t('trending'), L('explore_sub2'), cards, '#/library') : '';
  };
  /* hero: whatever it features, say which course and module it belongs to, and open the next lesson */
  window.curHero = featured => {
    const n = nextLessonGlobal(); if (!n) return null;
    const m = n.m, co = courseOf(m.courseId), st = moduleStats(m);
    return {
      source: m.source, title: mTitle(m), hook: mOutcome(m),
      count: `${st.lessons} ${st.lessons === 1 ? L('lesson_one') : L('lessons_lc')}`, time: `${L('est_time')} ${fmtMins(st.mins)}`,
      pct: st.pct, progress: `${L('module')} ${st.pct}% · ${fmtMins(st.minsLeft)} ${L('left')}`,
      eyebrow: `<span class="hero-eyebrow cur-hero-ctx">${esc(cTitle(co))} · ${L('module')} ${modulesOfCourse(co.id).indexOf(m) + 1} ${t('of')} ${modulesOfCourse(co.id).length}</span>`,
      play: `<button class="btn btn-primary" data-action="play" data-id="${m.source}" data-mod="${n.i}">▶&nbsp; ${st.started ? L('continue_lesson') : L('start_lesson')}: ${esc(lTitle(m.source, n.i))}</button>`,
      details: `<button class="btn btn-glass" data-action="goto" data-route="#/module/${m.id}">${L('module')}</button>`
    };
  };

  /* ---------- library: courses first, then modules by category ---------- */
  window.renderLibrary = renderLibrary = function () {
    /* department categories when the curriculum defines them; the item's own label otherwise */
    const DC = CURRICULUM.categories || null;
    const catsOf = m => DC ? (m.def.cats || []) : [m.item.cat];
    const catName = k => { if (!DC) return tcat(k); const c = DC.find(x => x.key === k); return c ? (PT() ? c.pt : c.en) : k; };
    const cats = ['All', ...(DC ? DC.map(c => c.key).filter(k => modules.some(m => catsOf(m).includes(k))) : [...new Set(modules.map(m => m.item.cat))])];
    if (!cats.includes(libFilter)) libFilter = 'All';
    const q = (libQuery || '').toLowerCase();
    const ml = modules.filter(m => (libFilter === 'All' || catsOf(m).includes(libFilter)) && (!q || (mTitle(m) + ' ' + mOutcome(m) + ' ' + cTitle(courseOf(m.courseId)) + ' ' + catsOf(m).map(catName).join(' ')).toLowerCase().includes(q)));
    const cl = courses.filter(co => !q || (cTitle(co) + ' ' + cField(co, 'promise') + ' ' + cField(co, 'desc')).toLowerCase().includes(q));
    return `<div class="page"><div class="page-pad">
      <h1 class="page-title">${t('library_title')}</h1>
      <p class="page-sub">${courses.length} ${L('courses').toLowerCase()} · ${modules.length} ${L('modules')}</p>
      <div class="lib-search">⌕ <input id="libSearch" placeholder="${t('filter_library')}" value="${esc(libQuery)}"></div>
      <h2 class="sect-h cur-sect">${L('courses')}</h2><p class="page-sub" style="margin-top:2px">${L('lib_courses_sub')}</p>
      <div class="grid">${cl.map(courseCardHTML).join('')}</div>
      <h2 class="sect-h cur-sect">${L('lib_modules_h')}</h2><p class="page-sub" style="margin-top:2px">${L('lib_modules_sub')}</p>
      <div class="filter-row">${cats.map(c => `<button class="filter-chip ${c === libFilter ? 'active' : ''}" data-action="lib-filter" data-cat="${c}">${c === 'All' ? t('all') : catName(c)}</button>`).join('')}</div>
      <div class="grid">${ml.map(moduleCardHTML).join('')}</div>
      ${(() => { /* items outside the curriculum (e.g. made in Course Studio) still need a home */
        const extra = CATALOG.filter(c => !c.hidden && !modules.some(m => m.source === c.id) && (!q || (ctitle(c) + ' ' + (c.desc || '')).toLowerCase().includes(q)));
        return extra.length ? `<h2 class="sect-h cur-sect">${L('lib_other_h')}</h2><div class="grid">${extra.map(c => cardHTML(c)).join('')}</div>` : '';
      })()}
      ${ml.length || cl.length ? '' : `<p class="empty-note">${t('nothing_matches')}</p>`}
    </div>${footerHTML()}</div>`;
  };

  /* ---------- player: course › module context, the module's lessons, prev / next ---------- */
  function lessonSeq(courseId) { return modulesOfCourse(courseId).flatMap(m => m.lessons.map(i => ({ m, i }))); }
  window.curPlayer = (c, mod) => {
    const m = moduleOfLesson(c.id, mod); if (!m) return;
    const co = courseOf(m.courseId), pos = m.lessons.indexOf(mod);
    const pt = $('#playerTitle'), ps = $('#playerSub');
    if (pt) pt.innerHTML = `<a href="#/course/${co.id}" class="cur-pl-link" data-action="cur-pl-go" data-route="#/course/${co.id}">${esc(cTitle(co))}</a> <span aria-hidden="true">›</span> <a href="#/module/${m.id}" class="cur-pl-link" data-action="cur-pl-go" data-route="#/module/${m.id}">${esc(mTitle(m))}</a>`;
    if (ps) ps.textContent = `${L('lesson')} ${pos + 1} ${t('of')} ${m.lessons.length} · ${lTitle(c.id, mod)}${lessonDone(c.id, mod) ? ' · ✓ ' + L('completed') : ''}`;
    const pills = $('#playerPills');
    /* round 6 gate: a lesson opens only when every lesson before it in the module is completed (its questions
       answered). Done lessons and the current one stay open; nothing further can be skipped to. */
    const firstOpen = m.lessons.find(i => !isOptional(m, i) && !lessonDone(c.id, i));
    const reachable = i => i === mod || lessonDone(c.id, i) || isOptional(m, i) || i === firstOpen;
    if (pills) pills.innerHTML = m.lessons.map((i, n) => { const ok = reachable(i);
      return `<button class="mod-pill ${i === mod ? 'current' : lessonDone(c.id, i) ? 'done' : ''}${ok ? '' : ' locked'}" ${ok ? `data-action="play" data-id="${c.id}" data-mod="${i}"` : 'disabled aria-disabled="true"'}><span class="mp-n">${lessonDone(c.id, i) ? '✓ ' : ok ? '' : '🔒 '}${n + 1}</span> ${esc(lTitle(c.id, i))}</button>`; }).join('');
    const seq = lessonSeq(co.id), at = seq.findIndex(x => x.m === m && x.i === mod), prev = seq[at - 1], next = seq[at + 1];
    let nav = $('#curPlNav');
    if (!nav) { nav = document.createElement('div'); nav.id = 'curPlNav'; nav.className = 'cur-pl-nav'; const pb = document.querySelector('.player-bottom'); if (pb) pb.insertBefore(nav, pb.firstChild); }
    nav.innerHTML = `<button class="pl-ic" ${prev ? `data-action="play" data-id="${prev.m.source}" data-mod="${prev.i}"` : 'disabled'} aria-label="${L('prev')}" title="${L('prev')}">‹</button>
      <button class="pl-ic" ${next && lessonDone(c.id, mod) ? `data-action="play" data-id="${next.m.source}" data-mod="${next.i}"` : 'disabled'} aria-label="${L('next')}" title="${next && next.m !== m ? L('next_module') : L('next')}">›</button>`;
  };

  /* ---------- end of a lesson: the next lesson in curriculum order, no overview screens between ---------- */
  window.curNext = (src, mod, next) => {
    const m = moduleOfLesson(src, mod); if (!m) return next;
    const seq = lessonSeq(m.courseId), at = seq.findIndex(x => x.m === m && x.i === mod);
    const after = seq.slice(at + 1).find(x => !lessonDone(x.m.source, x.i) && !(x.m.source === src && x.i === mod)) || seq[at + 1];
    const base = { checkFor: next && next.checkFor };
    if (after && after.m === m) return Object.assign(base, { kind: 'next', courseId: after.m.source, mod: after.i });
    /* the module is finished (round 6): stop on a "Module complete" window that offers the next module IN THE PATH */
    if (after && moduleStats(m).complete) return Object.assign(base, { kind: 'cur-module-end', moduleId: m.id, courseId: src });
    if (after) { /* module not finished yet (a lesson was skipped): go back to its first open lesson, never jump modules */
      const back = m.lessons.find(i => !isOptional(m, i) && !lessonDone(m.source, i) && !(m.source === src && i === mod));
      if (back != null) return Object.assign(base, { kind: 'next', courseId: m.source, mod: back });
      return Object.assign(base, { kind: 'cur-module-end', moduleId: m.id, courseId: src }); }
    return Object.assign(base, { kind: 'cur-course-end', programId: m.courseId, courseId: src });
  };
  window.curModuleToast = (src, mod) => {
    const m = moduleOfLesson(src, mod); if (!m) return;
    if (moduleStats(m).complete) toast(`${L('module_done')}: ${mTitle(m)}`, '✓');
  };
  /* after the last lesson's questions: the course result */
  window.curAfter = n => {
    if (n.kind === 'cur-module-end') { closePlayer(); setTimeout(() => showModuleDone(n.moduleId), 300); return true; }
    if (n.kind !== 'cur-course-end') return false;
    closePlayer();
    setTimeout(() => showCourseResult(n.programId), 300);
    return true;
  };
  function nextModuleAfter(m) {
    const pm = pathModules(), k = pm.indexOf(m);
    const inPath = pm.slice(k + 1).concat(pm.slice(0, Math.max(0, k))).find(x => !moduleStats(x).complete);
    if (inPath) return inPath;
    const ms = modulesOfCourse(m.courseId);
    return ms.slice(ms.indexOf(m) + 1).find(x => !moduleStats(x).complete) || modules.find(x => x !== m && !moduleStats(x).complete) || null;
  }
  function showModuleDone(id) {
    const m = moduleOf(id); if (!m) return;
    const nx = nextModuleAfter(m), first = nx && (nx.lessons.find(i => !lessonDone(nx.source, i)) ?? nx.lessons[0]);
    let ov = $('#certEarned');
    if (!ov) { ov = document.createElement('div'); ov.id = 'certEarned'; ov.className = 'ck-ov'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); document.body.appendChild(ov); }
    ov.innerHTML = `<div class="ck-card cert-earned">
      <div class="ce-seal" aria-hidden="true">✓</div>
      <div class="ob-eyebrow">${t('mod_done_h')}</div>
      <h2 class="ce-title">${esc(mTitle(m))}</h2>
      <p class="ce-meta">${esc(cTitle(courseOf(m.courseId)))}</p>
      ${nx ? `<p class="ce-meta">${L('next_in_course') === 'A seguir neste curso' ? 'A seguir' : 'Up next'}: <b>${esc(mTitle(nx))}</b></p>` : `<p class="ce-meta">${t('mod_path_done')}</p>`}
      <div class="ce-actions">
        ${nx ? `<button class="btn btn-primary" data-action="cur-modnext" data-id="${nx.source}" data-mod="${first}">▶ ${t('mod_next')}</button>` : ''}
        <button class="btn btn-glass" data-action="cur-modpath">${t('mod_back_path')}</button>
      </div></div>`;
    ov.classList.add('on');
    try { makeFocusable(ov); } catch (e) {}
  }
  function showCourseResult(id) {
    const co = courseOf(id), st = courseStats(id); if (!co) return;
    if (st.complete) ledgerAppend('program_complete', { programId: id, score: st.score });
    let ov = $('#certEarned');
    if (!ov) { ov = document.createElement('div'); ov.id = 'certEarned'; ov.className = 'ck-ov'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); document.body.appendChild(ov); }
    ov.innerHTML = `<div class="ck-card cert-earned">
      <div class="ce-seal" aria-hidden="true">${svgIcon('flower')}</div>
      <div class="ob-eyebrow">${st.eligible ? L('cert_earned') : st.complete ? L('result_h') : L('in_progress')}</div>
      <h2 class="ce-title">${esc(cTitle(co))}</h2>
      <p class="ce-meta">${st.done}/${st.lessons} ${L('lessons_lc')} · ${L('score_lbl')} ${st.score != null ? st.score + '%' : '—'} (${L('pass_lbl')} ${PASS}%)</p>
      <p class="ce-meta">${st.eligible ? L('result_cert') : st.complete ? L('result_retake') : ''}</p>
      <div class="ce-actions">
        ${st.eligible ? `<button class="btn btn-primary" data-action="cur-cert" data-id="${id}">⤓ ${L('cert_dl')}</button>` : ''}
        <button class="btn btn-glass" data-action="ce-next" data-id="${id}">${L('go_course')}</button>
      </div></div>`;
    ov.classList.add('on');
    try { makeFocusable(ov); } catch (e) {}
  }
  window.showCourseResult = showCourseResult;

  /* ---------- certificates: course level ---------- */
  function courseCert(id) {
    const co = courseOf(id), st = courseStats(id); if (!co) return;
    if (!st.eligible) { toast(L('cert_locked'), 'ℹ'); location.hash = '#/course/' + id; return; }
    const pt = PT();
    openPrintDoc(buildCertHTML({
      docTitle: (pt ? 'Documento Comprovativo — ' : 'Training Record — ') + cTitle(co),
      eyebrow: pt ? 'Documento Comprovativo de Formação' : 'Record of Training Completed',
      who: certIdentity(),
      did: pt ? 'concluiu o curso de formação' : 'has completed the training course',
      what: cTitle(co),
      facts: [
        { k: pt ? 'Módulos' : 'Modules', v: String(st.modules) },
        { k: pt ? 'Lições' : 'Lessons', v: String(st.lessons) },
        { k: pt ? 'Tempo registado' : 'Recorded training', v: fmtMins(Math.round(st.recordedH * 60)) },
        { k: pt ? 'Avaliação' : 'Assessment', v: `${st.score}% (${pt ? 'mín.' : 'pass'} ${PASS}%)` },
        { k: pt ? 'Concluído a' : 'Completed', v: fmtCertDate(new Date(st.completedAt)) }
      ],
      meta: ''
    }));
    ledgerAppend('cert_issued', { programId: id, kind: 'program', score: st.score });
  }
  window.curCourseCert = courseCert;

  /* Record tab: course certificates, then earlier per-module records as they were issued */
  function historical() {
    const out = [];
    (S.ledger || []).filter(e => e.type === 'cert_issued' && e.kind === 'course' && e.courseId).forEach(e => {
      if (!out.some(x => x.courseId === e.courseId)) out.push({ courseId: e.courseId, at: Date.parse(e.at) || e.at, score: e.score });
    });
    Object.entries(S.certs || {}).forEach(([cid, r]) => { if (r && r.passed && !out.some(x => x.courseId === cid)) out.push({ courseId: cid, at: r.at, score: r.score, quiz: true }); });
    return out.filter(x => courseById(x.courseId));
  }
  window.CUR.historical = historical;
  const reviewItems = () => { const items = [];
    modules.forEach(m => m.lessons.forEach(i => { const x = misses(m.source, i); if (x) items.push({ m, i, n: x.wrong.length }); }));
    return items; };
  window.curReviewCount = () => reviewItems().reduce((a, x) => a + x.n, 0);
  window.curFixHTML = function (full) {
    const items = reviewItems();
    if (!items.length) return full ? `<section class="admin-section cur-fixbox"><h2>${L('fix_h')}</h2><p class="sect-sub sub-auto">${L('fix_none')}</p></section>` : '';
    return `<section class="admin-section cur-fixbox">
      <h2>${L('fix_h')}</h2><p class="sect-sub sub-auto">${L('fix_sub')}</p>
      ${items.map(x => `<div class="cur-fixrow"><span class="cl-thumb sm"${lThumb(x.m.source, x.i) ? ` style="background-image:url('${lThumb(x.m.source, x.i)}')"` : ''}></span>
        <span class="cf-t"><b>${esc(lTitle(x.m.source, x.i))}</b><small>${esc(cTitle(courseOf(x.m.courseId)))} · ${esc(mTitle(x.m))}</small></span>
        <button class="btn btn-primary btn-sm" data-action="cur-fix" data-id="${x.m.source}" data-mod="${x.i}">${x.n === 1 ? L('fix_one') : L('fix_n', { n: x.n })}</button></div>`).join('')}
    </section>`;
  };
  window.certsSectionHTML = certsSectionHTML = function () {
    const earned = courses.filter(co => courseStats(co.id).eligible);
    const hist = historical();
    return `<div class="admin-section">
      <h2>${L('course_certs_h')}</h2>
      ${earned.length ? `<div class="cert-grid">${earned.map(co => `<div class="cert-card"><div class="cert-art"><span>✦</span><b>${esc(cTitle(co))}</b><span class="cert-d">${fmtCertDate(new Date(courseStats(co.id).completedAt))}</span></div>
        <div class="cert-actions"><button class="btn btn-glass btn-sm" data-action="cur-cert" data-id="${co.id}">⤓ ${L('cert_dl')}</button></div></div>`).join('')}</div>`
        : `<p class="empty-note" style="text-align:left;padding:8px 0;">${L('none_yet')}</p>`}
      ${hist.length ? `<h3 class="cur-h3" style="margin-top:22px">${L('hist_h')}</h3><p class="sect-sub">${L('hist_sub')}</p>
        <div class="cur-hist">${hist.map(h => { const flag = h.score == null || h.score < PASS; const it = courseById(h.courseId); return `<div class="cur-hrow">
          <span><b>${esc(ctitle(it))}</b><small>${L('hist_scope')} · ${new Date(h.at).toLocaleDateString(PT() ? 'pt-PT' : 'en-GB')}${h.score != null ? ' · ' + h.score + '%' : ''}</small>
          ${flag && isAdmin() ? `<em class="cur-flag">${L('hist_flag', { p: PASS })}</em>` : ''}</span>
          <button class="btn btn-glass btn-sm" data-action="cur-hist-dl" data-id="${h.courseId}">⤓</button></div>`; }).join('')}</div>` : ''}
    </div>`;
  };
  /* a historical record re-opens exactly as it was scoped: the module, its own date and score */
  window.curHistoricalCert = id => {
    const h = historical().find(x => x.courseId === id), c = courseById(id); if (!h || !c) return;
    const pt = PT();
    openPrintDoc(buildCertHTML({
      docTitle: (pt ? 'Registo anterior — ' : 'Earlier record — ') + ctitle(c),
      eyebrow: pt ? 'Registo de módulo (anterior)' : 'Module record (earlier rules)',
      who: certIdentity(), did: pt ? 'concluiu o módulo' : 'completed the module', what: ctitle(c),
      facts: [{ k: pt ? 'Âmbito' : 'Scope', v: pt ? 'Módulo' : 'Module' }, ...(h.score != null ? [{ k: pt ? 'Resultado' : 'Score', v: h.score + '%' }] : []), { k: pt ? 'Emitido a' : 'Issued', v: fmtCertDate(new Date(h.at)) }],
      meta: '', extraNote: pt ? 'Registo histórico emitido com as regras anteriores; não é um comprovativo de curso.' : 'Historical record issued under earlier rules; not a course certificate.'
    }));
  };

  /* ---------- actions ---------- */
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-action^="cur-"]'); if (!el) return;
    const a = el.dataset.action;
    if (a === 'cur-cert') { e.preventDefault(); e.stopPropagation(); courseCert(el.dataset.id); }
    else if (a === 'cur-hist-dl') { e.preventDefault(); e.stopPropagation(); window.curHistoricalCert(el.dataset.id); }
    else if (a === 'cur-modnext' || a === 'cur-modpath') { e.preventDefault(); e.stopPropagation();
      const ov = $('#certEarned'); if (ov) ov.classList.remove('on');
      if (a === 'cur-modpath') { meTab = 'path'; location.hash = '#/me'; render(); }
      else { _openPaused = true; openPlayer(el.dataset.id, +el.dataset.mod); } }
    else if (a === 'cur-more') { e.preventDefault(); e.stopPropagation();
      const d = document.getElementById(el.getAttribute('aria-controls')); if (!d) return;
      const open = d.hidden; d.hidden = !open; el.setAttribute('aria-expanded', String(open)); el.classList.toggle('on', open); }
    else if (a === 'cur-fix') { e.preventDefault(); e.stopPropagation();
      const c = courseById(el.dataset.id), mod = +el.dataset.mod, x = misses(el.dataset.id, mod); if (!c || !x) return;
      /* the lesson opens paused behind the fix, so "watch the answer" can jump straight to the moment */
      _openPaused = true; openPlayer(c.id, mod);
      const fromReview = /^#\/me/.test(location.hash);
      setTimeout(() => showModuleCheck(c, mod, () => {
        /* no dead end: close the lesson and land somewhere with a next step */
        closePlayer();
        const left = window.curReviewCount ? curReviewCount() : 0, m = moduleOfLesson(c.id, mod);
        setTimeout(() => { if (fromReview || left) { meTab = 'review'; location.hash = '#/me'; render(); } else if (m) location.hash = '#/module/' + m.id; else render(); }, 120);
      }, { fix: x }), 450); }
    else if (a === 'cur-retake') { e.preventDefault(); e.stopPropagation(); const c = courseById(el.dataset.id); if (c) showModuleCheck(c, +el.dataset.mod, () => render(), { retake: true }); }
    else if (a === 'cur-pl-go') { e.preventDefault(); e.stopPropagation(); closePlayer(); setTimeout(() => { location.hash = el.dataset.route; }, 50); }
  }, true);
})();
