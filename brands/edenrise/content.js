/* ============================================================================
   INSTANCE CONTENT · EdenRise  (the course catalog — pure data, swap per client)
   ----------------------------------------------------------------------------
   Loaded BEFORE the core framework (data.js). A new client ships its own
   brands/<id>/content.js with the same globals: CATALOG + course maps.
   The engine's helpers (chook/ctitle/skillsOf…) live in the shared framework.
============================================================================ */

const CATALOG = [
  {
    id: 'land-team-journey', title: 'Above the Line', cat: 'Leadership', grad: 4, icon: 'compass',
    /* 340 learners and 4.9 stars were invented. This platform's whole claim is
       that its records are provable — inventing the social proof on the front of
       it is the one lie that discredits everything behind it. Zero until real. */
    level: 'All levels', learners: 0, ai: true, featured: true, poster: 'media/above-below-line-cover.webp', heroArt: 'media/covers/land-team-journey-hero.webp', updated: '2026-07',
    hook: 'Choose how you show up — even on the hard days.',
    hookSub: 'Eight mindset habits that make you someone the team can rely on.',
    desc: 'The course every EdenRise team member starts with. In eight short lessons from John you learn the one question that changes how you show up, how to treat mistakes as feedback, how to own outcomes, and the habits of people others trust: clarify instead of assuming, benchmark excellence, notice the details, keep learning, stay grateful. Finish it and you have a shared language with everyone on the land.',
    /* 13 Oct 2026 (John): everything Above-the-Line / No-Failure lives HERE, nowhere else.
       The long-form lessons that used to sit in the Alignment Journey are appended as a
       "Go deeper" block — appended, not interleaved, so every hour already recorded
       against modules 1-8 keeps pointing at the lesson it was earned on. The two old
       one-minute "Intro" clips were dropped: modules 1 and 2 ARE the intros now. */
    modules: ['Above the Line, Below the Line', 'No Failure, Only Feedback', 'Total Responsibility', "Don't Assume, Clarify", 'Benchmarking Excellence', 'Attention to Detail', 'Lifelong Learner', 'The Science of Gratitude',
      'Go deeper · Above the Line: Simple & Powerful Thinking', 'Go deeper · Above the Line: Deep Dive', 'Go deeper · Above the Line: Summary',
      'Go deeper · No Failure: the Animation', 'Go deeper · No Failure: Summary'],
    moduleDurations: [4, 4, 6, 6, 6, 5, 5, 5, 3, 10, 1, 4, 10],   /* real Vimeo lengths: 4:09 4:04 5:40 5:40 5:35 5:29 5:21 5:28 · 2:59 10:09 0:52 4:07 9:39 */
    /* The Portuguese cut, from the "Approved PT" Vimeo folder. The academy plays
       whichever matches the reader's language (modMedia in core/app.js).
       Module 8 has no PT recording yet — it falls back to English WITH a notice,
       because silently serving English to someone who chose Portuguese is what
       makes people stop trusting the language switch. */
    moduleMedia_pt: [
      { type: 'vimeo', id: '1206810959' },   /* 1. Acima da Linha, Abaixo da Linha */
      { type: 'vimeo', id: '1206811136' },   /* 2. Não Há Fracasso, Só Feedback */
      { type: 'vimeo', id: '1217937969' },   /* 3. Responsabilidade Total */
      { type: 'vimeo', id: '1217938258' },   /* 4. Comunicação — Esclareça */
      { type: 'vimeo', id: '1217938100' },   /* 5. Benchmark de Excelência */
      { type: 'vimeo', id: '1217937799' },   /* 6. Atenção ao Detalhe */
      { type: 'vimeo', id: '1217939147' }    /* 7. Seja Aprendiz */
      /* 8. A Ciência da Gratidão — not recorded in PT yet */
    ],
    moduleDurations_pt: [5, 4, 6, 6, 6, 6, 6],   /* real: 5:06 4:29 6:19 6:20 6:19 5:39 5:48 */
    moduleMedia: [
      { type: 'vimeo', id: '1217932399', h: '4e18df6b14' },   /* 1. Above the Line, Below the Line */
      { type: 'vimeo', id: '1217936795', h: '3d115763ba' },   /* 2. No Failure, Only Feedback */
      { type: 'vimeo', id: '1217934684', h: '36b9126a17' },   /* 3. Total Responsibility */
      { type: 'vimeo', id: '1217933990', h: '0b3c705815' },   /* 4. Don't Assume, Clarify */
      { type: 'vimeo', id: '1217934619', h: 'f983b08c58' },   /* 5. Benchmarking Excellence */
      { type: 'vimeo', id: '1217933175', h: '0921f2fe28' },   /* 6. Attention to Detail */
      { type: 'vimeo', id: '1217933425', h: 'a18a64990d' },   /* 7. Lifelong Learner */
      /* 8. The Science of Gratitude. WAS 1218881643, which Vimeo now reports as
         "in purgatory and unavailable" — the cut was replaced and the old id
         deleted, so English module 8 was serving a dead player. This id is the
         one actually sitting in the "Approved ENG" folder, verified against the
         API rather than carried over. A dead embed does not throw: it renders a
         grey box, records no watch time, and credits no hour — which is exactly
         the failure that looks like a learner who did not bother. */
      { type: 'vimeo', id: '1218950536', h: '57ea194bc1' },   /* 8. The Science of Gratitude */
      { type: 'vimeo', id: '1057946039', h: '01b76c3f3a' },   /* 9. Mindset Sport — Simple & Powerful (ex Alignment 1.2) */
      { type: 'vimeo', id: '1057946404', h: '32d1731d94' },   /* 10. Above the Line deep dive (ex Alignment 1.3) */
      { type: 'vimeo', id: '1057946740', h: 'ad497964dd' },   /* 11. Above the Line summary (ex Alignment 1.4) */
      { type: 'vimeo', id: '1057993253', h: 'a0e377a463' },   /* 12. Sport 2 — no failure (ex Alignment 2.2) */
      { type: 'vimeo', id: '1057993947', h: '050f21a22a' }    /* 13. Summary no failure (ex Alignment 2.3) */
    ]
  },
  {
    id: 'growth-journey', title: 'Ultimate Purpose', cat: 'Leadership', grad: 3, icon: 'compass',
    /* The Land Team's SECOND journey. Vimeo folders "2nd Course" (EN 30238825,
       PT 30238997), uploaded 13 Aug → 2 Sep 2026. Module numbering on Vimeo
       runs 1,2,3,4,6 — there is no "5." in either folder, so this course ships
       with five modules and the sixth Vimeo file is module 5 here. Add a module
       here the day the missing recording lands. Kaizen EN is the 27 Aug
       "with Music" re-render (same cut, 6:32); PT module 5 is the 2 Sep native
       recording — the two "Part 1" variants uploaded on 4 Sep (dubbed / adapted)
       are NOT wired; João chooses. Title is provisional until the transcripts
       say what the trainer calls it. */
    level: 'All levels', learners: 0, ai: true, isNew: true, updated: '2026-10', poster: 'media/covers/growth-journey.webp', heroArt: 'media/covers/growth-journey-hero.webp',
    hook: 'Know why you get up — and set goals that stick.',
    hookSub: 'Purpose, 90-day goals, kaizen and the beliefs that carry you through a hard season.',
    desc: 'The second journey, from the inside out. You will name your ultimate purpose, turn it into 90-day and top-5 goals you actually keep, build the kaizen habit of small daily improvements, replace limiting beliefs with winning ones, and understand the six human needs behind every reaction — yours and your teammates\'.',
    /* 13 Oct 2026 (John): everything goal-setting lives HERE. The 90-day / top-5 workshop
       lessons from the old Alignment Journey are appended as a "Go deeper" block (appended
       so recorded hours keep their module). The one-minute old intro was dropped. */
    modules: ['Ultimate Purpose', 'Goal Setting', 'Kaizen', 'Winning Beliefs', 'Six Core Human Needs',
      'Go deeper · Goal Setting: the Animation', 'Go deeper · Your 90-Day Goals', 'Go deeper · Your Top 5 Goals', 'Go deeper · Goal Setting: Summary'],
    moduleDurations: [6, 6, 7, 6, 5, 3, 10, 10, 2],   /* real Vimeo lengths: 5:41 6:17 6:32 5:33 5:03 · 3:20 9:35 9:31 1:34 */
    moduleMedia: [
      { type: 'vimeo', id: '1217934850', h: 'dca2bb30cf' },   /* 1. Ultimate purpose */
      { type: 'vimeo', id: '1220781804', h: '16c7dabe91' },   /* 2. Goal Setting */
      { type: 'vimeo', id: '1221805602', h: 'd88d420ea7' },   /* 3. Kaizen (with music, 27 Aug) */
      { type: 'vimeo', id: '1222970261', h: '994b07a80c' },   /* 4. Winning Beliefs */
      { type: 'vimeo', id: '1223416806', h: 'd27a3a4bc7' },   /* 6. Six core human needs — master your reactions */
      { type: 'vimeo', id: '1058013428', h: '4889d44aee' },   /* 6. Goal Setting animation (ex Alignment 4.1) */
      { type: 'vimeo', id: '1058013161', h: '9ec326fc49' },   /* 7. 90-Day Goals (ex Alignment 4.2) */
      { type: 'vimeo', id: '1058013794', h: '148790e3a6' },   /* 8. Top 5 Goals (ex Alignment 4.3) */
      { type: 'vimeo', id: '1058014738', h: 'd33926d00a' }    /* 9. Goal Summary (ex Alignment 4.4) */
    ],
    moduleDurations_pt: [7, 7, 6, 6, 6],   /* real: 6:59 6:43 6:06 6:26 5:55 */
    moduleMedia_pt: [
      { type: 'vimeo', id: '1217931540' },   /* 1. Propósito último */
      { type: 'vimeo', id: '1220784470' },   /* 2. Definição de objetivos */
      { type: 'vimeo', id: '1221805932' },   /* 3. Kaizen */
      { type: 'vimeo', id: '1222970612' },   /* 4. Crenças vencedoras */
      { type: 'vimeo', id: '1223417488' }    /* As seis necessidades humanas básicas — domine a sua reação */
    ]
  },
  {
    id: 'fire-truck-training', title: 'Fire Truck Training', cat: 'Stewardship', grad: 4, icon: 'fire', recertMonths: 12, featured: true, updated: '2026-07',
    level: 'All levels', rating: 5.0, learners: 0, isNew: true, poster: 'media/covers/fire-truck-training.webp',
    /* The poster is a title card — it carries its own giant lettering, so at
       hero scale the course name appeared twice and the four coloured badges
       fought the palette. heroArt is the photographic plate cut out of it;
       heroFit:'key' frames it as a right-hand panel that fades into the page,
       the way key art works when the artwork is not full-bleed landscape. */
    heroArt: 'media/covers/fire-truck-training-key.webp', heroFit: 'key',
    hook: 'When fire comes, you will know the truck.',
    hookSub: 'Start it, drive it, fill it, pump it — hands-on, step by step, before you ever need it.',
    desc: 'Hands-on operation of the land\'s fire truck: starting and driving it, filling the water tank, off-road handling, the pump and spray, and the power and safety drill. When fire season comes, everyone on the land should know how to move water. Four short lessons; the walk-around becomes muscle memory.',
    modules: ['Starting & Driving the Truck', 'Filling the Water Tank', 'Off-Road, Pump & Spray', 'Power, Safety & the Drill'],
    moduleDurations: [6, 10, 10, 9],   /* real Vimeo lengths: 5:55 10:11 9:49 9:28 */
    moduleMedia: [
      { type: 'vimeo', id: '1207710846' },   /* 1. Start & Drive */
      { type: 'vimeo', id: '1208024648' },   /* 2. Water Fill */
      { type: 'vimeo', id: '1208024647' },   /* 3. Off-road, Pump & Spray */
      { type: 'vimeo', id: '1208024649' }     /* 4. Power, Safety & Drill */
    ]
  },
  {
    id: 'alignment-journey', title: 'The EdenRise Alignment Journey', cat: 'Leadership', grad: 1, icon: 'compass', featured: true, updated: '2026-07',
    level: 'All levels', rating: 5.0, learners: 0, isNew: true, poster: 'media/covers/alignment-journey.webp', heroArt: 'media/covers/alignment-journey-hero.webp',
    hook: 'One team, one way of working — starting with a warm welcome.',
    hookSub: 'John\'s welcome, the ESIP framework, moving beyond fear, and caring for body, soul and spirit.',
    desc: 'John welcomes you personally and lays out the frame everything else at EdenRise hangs on: ESIP, the framework for how we think and act together. Then two deeper journeys — moving beyond fear, and looking after body, soul and spirit — so you can bring your whole self to the work.',
    /* 13 Oct 2026 (John): no duplication across courses. Above-the-Line / No-Failure moved
       to "Above the Line", Goal Setting moved to "Ultimate Purpose". What stays is what only
       this journey has: John's welcome, the ESIP framework, Beyond Fear, Body/Soul/Spirit. */
    modules: [
      'Warm Welcome',
      'ESIP · The Framework',
      'Beyond Fear · Intro', 'Beyond Fear · Animation', 'Beyond Fear · Unpack & Summary',
      'Body, Soul & Spirit · Intro', 'Body, Soul & Spirit · Deep Dive'
    ],
    moduleDurations: [5, 16, 2, 6, 12, 1, 13],
    moduleMedia: [
      { type: 'vimeo', id: '1060039319', h: '359d98f5b5' },   /* Warm Welcome — Intro to training */
      { type: 'vimeo', id: '1058001287', h: 'aacf5e8fee' },   /* ESIP Intro */
      { type: 'vimeo', id: '1058001585', h: 'd0776cc1f4' },   /* Beyond Fear Intro */
      { type: 'vimeo', id: '1058002386', h: '82d3bb9d67' },   /* Animation Fear */
      { type: 'vimeo', id: '1058003540', h: '79850e86ba' },   /* Unpack & Summary */
      { type: 'vimeo', id: '1058016139', h: 'b5e41053e2' },   /* Body, Soul and Spirit */
      { type: 'vimeo', id: '1058015323', h: 'be2e764833' }    /* Body Soul Spirit deep dive */
    ]
  },
  {
    id: 'ai-literacy', title: 'Level Up with AI', cat: 'Leadership', grad: 2, icon: 'compass', recertMonths: 12,
    level: 'All levels', rating: 5.0, learners: 0, isNew: true, updated: '2026-07',
    /* Cards and the course page render the title in our own type directly
       beside the artwork, so a poster carrying its own lettering printed the
       name twice — and on a 16:9 card `cover` fits the width exactly, leaving
       ~30px of vertical slack, far too little to shift the lockup out of
       frame. Reframing needed its own crop, not a background-position. */
    poster: 'media/covers/ai-literacy-card.webp',
    /* Same rule as the fire truck: the poster is a composed card carrying its
       own lettering, which is right at card size and wrong full-bleed — the
       hero would set "LEVEL UP WITH AI" twice. heroArt is the photographic
       right-hand side of it, framed as key art. */
    heroArt: 'media/covers/ai-literacy-key.webp', heroFit: 'key',
    hook: 'AI is on the team now. Use it well.', hookSub: 'The literacy every EU workplace must have — practical, honest, ours.',
    desc: 'The EU AI Act (Article 4) asks every organisation using AI to make sure its people are AI-literate. This is our version: what AI is and isn\'t, how to work with the Academy\'s AI honestly and safely, what it does with your data, and what the law expects of us.',
    modules: ['What AI Is (and Isn\'t)', 'Working with Our AI Tutor', 'When AI Is Wrong', 'Your Data & Privacy', 'The EU AI Act & Us'],
    moduleDurations: [4, 5, 5, 4, 5],
    /* scripted, not yet filmed — every row reads \"Coming soon\" until the footage lands */
    moduleMedia: Array.from({ length: 5 }, () => ({ type: 'soon' }))
  }
];
/* designed brand covers — every course ships with art (land-team-journey keeps its filmed cover) */
CATALOG.forEach(c => { if (!c.poster) c.poster = 'media/covers/' + c.id + '.svg'; });
const LIVE_SESSIONS = [
  { id: 'live-now', title: 'Field Hours: Live Soil Clinic', host: 'Marta Oliveira · Head of Regeneration', when: 'LIVE NOW', live: true, viewers: 47, grad: 7, icon: 'sprout', desc: 'Bring a photo or sample of your soil — Marta reads it live and prescribes the first three things to do.' },
  { id: 'exec-ama', title: 'Founder AMA: Why Regeneration', host: 'João Amaral · Founder', when: 'Fri 14:00 WET', grad: 1, icon: 'tree', desc: 'Unfiltered Q&A on building EdenRise and stewarding land in the Baixo Alentejo.' },
  { id: 'water-workshop', title: 'Workshop: Map Your Water', host: 'Dev Santos · Water Lead', when: 'Tue 17 · 16:00 WET', grad: 5, icon: 'drop', desc: 'Hands-on, 90 minutes. Bring a map of your land and leave with a water plan sketched on contour.' },
  { id: 'season-circle', title: 'Seasonal Circle: Midsummer', host: 'Marta Oliveira · Head of Regeneration', when: 'Thu 19 · 19:00 WET', grad: 6, icon: 'sun', desc: 'A gathering to mark midsummer — what to tend, what to harvest, what to let rest.' }
];
const COURSE_HOOKS = {
  'ai-literacy': ['AI is on the team now. Use it well.', 'The literacy every EU workplace must have — practical, honest, ours.'],
  'fire-truck-training': ['When fire comes, know the truck.', 'Start it, drive it, fill it, and put water where it’s needed — hands-on, step by step.'],
  'alignment-journey': ['One team, one way of showing up.', 'Six shifts that align how we think, set goals, meet fear, and work the land together.'],
  'growth-journey': ['You bring the purpose. Not the job.', 'Make the day count — purpose, goals, kaizen, beliefs and the six needs behind every reaction. The second journey, from the inside out.'],
  'land-team-journey': ['One question changes how you show up.', 'Above the line or below it — the mindset the whole journey grows from.'],
  'land-literacy': ['Learn to read the land like a story.', 'Slope, soil, water, wind — see what the land has been telling you all along.'],
  'living-soil': ['There’s a universe under your feet.', 'Feed the soil, and everything above it thrives.'],
  'water-cycles': ['Water writes the landscape.', 'Slow it, sink it, store it — become fluent in the land’s oldest language.'],
  'agroforestry': ['Plant a forest you can eat.', 'Layers, guilds and time — design abundance that outlives you.'],
  'regen-design': ['Design the way nature does.', 'Patterns, edges and flows — turn observation into regeneration.'],
  'capstone-land': ['Your land. Your plan.', 'Bring everything together into a living plan for a real place.'],
  'composting': ['Turn waste into wealth.', 'The quiet alchemy of decay — master the art of living compost.'],
  'seed-saving': ['Every seed is a memory.', 'Save, select and pass on the varieties that belong to this land.'],
  'foraging': ['The Alentejo is already a pantry.', 'What’s edible, medicinal and sacred on the paths you walk every day.'],
  'native-flora': ['Meet your wild neighbours.', 'Native plants and pollinators — the quiet workforce of a living land.'],
  'rainwater': ['Catch the rain before it runs.', 'Swales, tanks and soil — harvest the winter for the summer.'],
  'rewilding': ['Let the wild come home.', 'Habitat, corridors and patience — invite life back in.'],
  'cork-oak': ['The montado is a masterpiece.', 'Portugal’s cork oak landscape — tending a thousand-year system.'],
  'natural-building': ['Build with what the land gives.', 'Earth, straw and lime — structures that breathe.'],
  'herbal': ['Your pharmacy grows outside.', 'Gather, dry and prepare the plants that heal.'],
  'fire-safety': ['Fire season is coming. Be ready.', 'Defensible space, fuel breaks and calm plans for hot days.'],
  'ethics': ['Whose land is it, really?', 'Stewardship, rights and responsibility — the ethics beneath everything.'],
  'seasonal-rhythm': ['Live at the speed of seasons.', 'Plant, harvest, rest — sync your year with the land’s calendar.'],
  'nature-connection': ['Slow down. Notice everything.', 'The art of attention — the skill every other skill grows from.'],
  'community-land': ['No one stewards alone.', 'Commons, councils and shared care for shared ground.']
};
const COURSE_HOOKS_PT = {
  'ai-literacy': ['A IA já faz parte da equipa. Use-a bem.', 'A literacia que todos os locais de trabalho na UE devem ter — prática, honesta, nossa.'],
  'fire-truck-training': ['Quando o fogo vem, conheça o camião.', 'Arrancar, conduzir, encher e pôr água onde é preciso — na prática, passo a passo.'],
  'alignment-journey': ['Uma equipa, uma forma de estar.', 'Seis mudanças que alinham como pensamos, definimos objetivos, enfrentamos o medo e trabalhamos a terra juntos.'],
  'growth-journey': ['És tu que trazes o propósito. Não o trabalho.', 'Fazer o dia valer — propósito, objetivos, kaizen, crenças e as seis necessidades por trás de cada reação. A segunda jornada, de dentro para fora.'],
  'land-team-journey': ['Uma pergunta muda como aparecemos.', 'Acima ou abaixo da linha — a mentalidade de onde cresce toda a jornada.'],
  'land-literacy': ['Aprenda a ler a terra como uma história.', 'Declive, solo, água, vento — veja o que a terra sempre lhe quis dizer.'],
  'living-soil': ['Há um universo debaixo dos seus pés.', 'Alimente o solo, e tudo acima dele floresce.'],
  'water-cycles': ['A água escreve a paisagem.', 'Abrande-a, infiltre-a, guarde-a — fale a língua mais antiga da terra.'],
  'agroforestry': ['Plante uma floresta que se come.', 'Camadas, consórcios e tempo — desenhe uma abundância que lhe sobrevive.'],
  'regen-design': ['Desenhe como a natureza desenha.', 'Padrões, margens e fluxos — transforme observação em regeneração.'],
  'capstone-land': ['A sua terra. O seu plano.', 'Junte tudo num plano vivo para um lugar real.'],
  'composting': ['Transforme resto em riqueza.', 'A alquimia silenciosa da decomposição — a arte do composto vivo.'],
  'seed-saving': ['Cada semente é uma memória.', 'Guarde, selecione e transmita as variedades que pertencem a esta terra.'],
  'foraging': ['O Alentejo já é uma despensa.', 'O que é comestível, medicinal e sagrado nos caminhos que percorre.'],
  'native-flora': ['Conheça os seus vizinhos selvagens.', 'Flora nativa e polinizadores — a força de trabalho silenciosa da terra.'],
  'rainwater': ['Apanhe a chuva antes que fuja.', 'Valas, cisternas e solo — colha o inverno para o verão.'],
  'rewilding': ['Deixe o selvagem voltar a casa.', 'Habitat, corredores e paciência — convide a vida a regressar.'],
  'cork-oak': ['O montado é uma obra-prima.', 'A paisagem do sobreiro — cuidar de um sistema com mil anos.'],
  'natural-building': ['Construa com o que a terra dá.', 'Terra, palha e cal — estruturas que respiram.'],
  'herbal': ['A sua farmácia cresce lá fora.', 'Colha, seque e prepare as plantas que curam.'],
  'fire-safety': ['A época dos fogos vem aí. Esteja pronto.', 'Espaço defensável, faixas de gestão e planos serenos para dias quentes.'],
  'ethics': ['De quem é a terra, realmente?', 'Zeladoria, direitos e responsabilidade — a ética por baixo de tudo.'],
  'seasonal-rhythm': ['Viva ao ritmo das estações.', 'Plantar, colher, descansar — sincronize o ano com o calendário da terra.'],
  'nature-connection': ['Abrande. Repare em tudo.', 'A arte da atenção — a competência de onde crescem todas as outras.'],
  'community-land': ['Ninguém cuida sozinho.', 'Baldios, conselhos e cuidado partilhado por um chão partilhado.']
};
const COURSE_QUIZ = {
  /* The flagship — 19 questions, INDEX-ALIGNED to the 19 modules (checkpoint
     picks qs[mod]), so every in-video pause asks about THIS lesson. EN mirrors
     PT. Module 8 (ESIP) is a bridge question until the acronym's content is
     confirmed — do not guess at it. */
  'alignment-journey': {
    en: [
      { q: 'The Alignment Journey is built around six inner shifts. What are they designed to change first?', opts: ['The mindset you bring to the work and to each other', 'The tools you use on the land', 'Your daily schedule', 'How you are paid'], a: 0 },
      { q: 'You arrive and find a job has gone wrong. Which response is "above the line"?', opts: ['Ask: what here can I own and help fix?', 'Work out who is to blame first', 'Explain why it could not have been you', 'Say nothing and move on'], a: 0 },
      { q: 'According to the course, operating above the line is best described as…', opts: ['A moment-to-moment choice anyone can make', 'A personality type some people have', 'Positive thinking that ignores real problems', 'A technique reserved for managers'], a: 0 },
      { q: 'Which trio marks BELOW-the-line thinking?', opts: ['Blame, excuses, denial', 'Ownership, accountability, responsibility', 'Goals, plans, reviews', 'Body, soul, spirit'], a: 0 },
      { q: 'Mid-conversation you catch yourself below the line. What is the first move?', opts: ['Notice it, and choose to step back above the line', 'Push your point harder', 'Apologise for everything and withdraw', 'Change the subject'], a: 0 },
      { q: 'In "No failure, only feedback", a mistake is treated as…', opts: ['Information to learn from', 'Proof you are not suited to the work', 'Something to keep quiet', 'Someone else\'s fault'], a: 0 },
      { q: 'A teammate tries a new approach and it does not work. The no-failure response is to…', opts: ['Ask together what the attempt just taught you', 'Agree to avoid risks from now on', 'Note who approved it', 'Lower the standard so it counts as a win'], a: 0 },
      { q: 'When a team genuinely adopts "no failure, only feedback", what becomes easier?', opts: ['Trying new approaches openly', 'Hiding mistakes', 'Avoiding hard conversations', 'Working alone'], a: 0 },
      { q: 'The journey works on mindset before it turns to goals. Why that order?', opts: ['Goals set from below-the-line thinking collapse into blame and excuses', 'Goals are less important than attitude', 'Mindset is easier, so it comes first', 'The order does not matter'], a: 0 },
      { q: 'Why does goal-setting sit in the middle of the journey rather than the start?', opts: ['A clear, owned mindset gives goals a foundation to stand on', 'It was the only slot left', 'Goals only matter for leaders', 'To leave time for paperwork'], a: 0 },
      { q: 'Which of these is a goal rather than a wish?', opts: ['"Plant the north beds by 15 March — I own it"', '"Get better at farming"', '"Hopefully improve this year"', '"Someone should fix the irrigation"'], a: 0 },
      { q: 'What time horizon does the journey use for a goal cycle?', opts: ['90 days', 'One week', 'One year', 'Five years'], a: 0 },
      { q: 'You have listed everything you want to achieve. What does the course ask next?', opts: ['Narrow the list to your top 5 and focus there', 'Attempt all of them at once', 'Pick only the easiest ones', 'Hand the list to your manager'], a: 0 },
      { q: 'A 90-day goal has stalled at day 30. The journey-consistent response is to…', opts: ['Review it above the line: what can I own and adjust?', 'Quietly drop it', 'Blame the season', 'Wait until the next cycle'], a: 0 },
      { q: 'How does the journey frame fear?', opts: ['A normal signal you are at your growth edge — not a stop sign', 'A weakness to hide from the team', 'A reason to stop', 'Something experienced people no longer feel'], a: 0 },
      { q: 'You are offered a responsibility that scares you. The Beyond-Fear move is to…', opts: ['Name the fear and take the step anyway, with support', 'Decline until you feel fully ready', 'Pretend you feel no fear', 'Ask someone else to take it'], a: 0 },
      { q: 'What is the problem with waiting until fear disappears before acting?', opts: ['It rarely does — action comes first, confidence follows', 'Nothing; waiting is safest', 'Fear always vanishes within days', 'Others will act for you'], a: 0 },
      { q: 'Why does the journey end with body, soul and spirit?', opts: ['Lasting performance needs the whole person cared for, not just skills', 'To fill remaining time', 'It is only about physical fitness', 'It replaces the other five shifts'], a: 0 },
      { q: 'Weeks of tiredness are dragging your work down. The whole-person response is to…', opts: ['Treat rest and inner life as part of the work, not a reward after it', 'Push through and hope', 'Hide it from the team', 'Care only for the body and ignore the rest'], a: 0 }
    ],
    pt: [
      { q: 'O Percurso de Alinhamento assenta em seis mudanças interiores. O que procuram mudar primeiro?', opts: ['A mentalidade que trazemos para o trabalho e uns para os outros', 'As ferramentas que usamos na terra', 'O horário do dia', 'A forma de pagamento'], a: 0 },
      { q: 'Chega e encontra um trabalho que correu mal. Qual é a resposta "acima da linha"?', opts: ['Perguntar: o que posso assumir e ajudar a resolver?', 'Descobrir primeiro de quem é a culpa', 'Explicar porque não podia ter sido você', 'Não dizer nada e seguir'], a: 0 },
      { q: 'Segundo o curso, viver acima da linha é sobretudo…', opts: ['Uma escolha de momento a momento, ao alcance de qualquer pessoa', 'Um tipo de personalidade', 'Pensamento positivo que ignora problemas reais', 'Uma técnica só para chefias'], a: 0 },
      { q: 'Que trio marca o pensamento ABAIXO da linha?', opts: ['Culpa, desculpas, negação', 'Posse, responsabilidade, compromisso', 'Metas, planos, revisões', 'Corpo, alma, espírito'], a: 0 },
      { q: 'A meio de uma conversa, dá por si abaixo da linha. Qual é o primeiro passo?', opts: ['Perceber, e escolher voltar para cima da linha', 'Insistir com mais força', 'Pedir desculpa por tudo e retrair-se', 'Mudar de assunto'], a: 0 },
      { q: 'Em "Não há fracasso, só feedback", um erro é tratado como…', opts: ['Informação para aprender', 'Prova de que não serve para o trabalho', 'Algo a esconder', 'Culpa de outra pessoa'], a: 0 },
      { q: 'Um colega tenta uma abordagem nova e não resulta. A resposta "só feedback" é…', opts: ['Perguntar juntos o que a tentativa acabou de ensinar', 'Combinar evitar riscos daqui em diante', 'Registar quem aprovou', 'Baixar a fasquia para contar como vitória'], a: 0 },
      { q: 'Quando uma equipa adota a sério "não há fracasso, só feedback", o que se torna mais fácil?', opts: ['Experimentar abertamente novas abordagens', 'Esconder erros', 'Evitar conversas difíceis', 'Trabalhar sozinho'], a: 0 },
      { q: 'O percurso trabalha a mentalidade antes de passar às metas. Porquê essa ordem?', opts: ['Metas definidas abaixo da linha desmoronam-se em culpa e desculpas', 'As metas importam menos do que a atitude', 'A mentalidade é mais fácil, por isso vem primeiro', 'A ordem é indiferente'], a: 0 },
      { q: 'Porque é que definir metas surge a meio do percurso e não no início?', opts: ['Uma mente clara e assumida dá às metas uma base onde assentar', 'Era o único espaço livre', 'Metas só interessam a chefias', 'Para sobrar tempo para papelada'], a: 0 },
      { q: 'Qual destas é uma meta e não um desejo?', opts: ['"Plantar os canteiros norte até 15 de março — assumo eu"', '"Ficar melhor na agricultura"', '"Oxalá melhore este ano"', '"Alguém devia arranjar a rega"'], a: 0 },
      { q: 'Que horizonte de tempo usa o percurso para um ciclo de metas?', opts: ['90 dias', 'Uma semana', 'Um ano', 'Cinco anos'], a: 0 },
      { q: 'Já listou tudo o que quer alcançar. O que pede o curso a seguir?', opts: ['Reduzir a lista às 5 principais e concentrar-se aí', 'Tentar tudo ao mesmo tempo', 'Escolher só as mais fáceis', 'Entregar a lista ao responsável'], a: 0 },
      { q: 'Uma meta de 90 dias está parada ao dia 30. A resposta coerente com o percurso é…', opts: ['Revê-la acima da linha: o que posso assumir e ajustar?', 'Deixá-la cair em silêncio', 'Culpar a estação', 'Esperar pelo próximo ciclo'], a: 0 },
      { q: 'Como é que o percurso encara o medo?', opts: ['Um sinal normal de que está no limite do seu crescimento — não um sinal de paragem', 'Uma fraqueza a esconder da equipa', 'Uma razão para parar', 'Algo que os experientes já não sentem'], a: 0 },
      { q: 'É-lhe oferecida uma responsabilidade que assusta. O passo "Para lá do Medo" é…', opts: ['Nomear o medo e dar o passo na mesma, com apoio', 'Recusar até se sentir totalmente pronto', 'Fingir que não sente medo', 'Pedir a outro que assuma'], a: 0 },
      { q: 'Qual é o problema de esperar que o medo desapareça antes de agir?', opts: ['Raramente desaparece — a ação vem primeiro, a confiança depois', 'Nenhum; esperar é o mais seguro', 'O medo passa sempre em poucos dias', 'Outros agirão por si'], a: 0 },
      { q: 'Porque termina o percurso com corpo, alma e espírito?', opts: ['Desempenho duradouro exige cuidar da pessoa inteira, não só das competências', 'Para preencher o tempo restante', 'É apenas sobre forma física', 'Substitui as outras cinco mudanças'], a: 0 },
      { q: 'Semanas de cansaço estão a pesar no trabalho. A resposta de pessoa-inteira é…', opts: ['Tratar o descanso e a vida interior como parte do trabalho, não um prémio no fim', 'Aguentar e esperar que passe', 'Escondê-lo da equipa', 'Cuidar só do corpo e ignorar o resto'], a: 0 }
    ]
  },
  'ai-literacy': {
    en: [
      { q: 'The Academy AI gives you a confident, detailed answer about a legal deadline. What is the right next move?', opts: ['Trust it — it sounded specific and confident', 'Check it against the official source before acting on it', 'Ask the AI to repeat it to confirm', 'Share it with the team immediately'], a: 1 },
      { q: 'You want the AI tutor to help you actually LEARN a topic, not just hand you answers. Which is the best use?', opts: ['Ask for the final answer straight away', 'Have it quiz you and explain what you got wrong', 'Copy its summary into your notes unread', 'Avoid the AI entirely'], a: 1 },
      { q: 'A colleague wants to paste a member\'s personal data into a public AI chatbot to draft a letter. What do you say?', opts: ['Fine — chatbots are private', 'Only if the letter is short', 'Don\'t — personal data stays inside our GDPR-covered tools; anonymise it first', 'Only paste the NIF, not the name'], a: 2 }
    ],
    pt: [
      { q: 'A IA da Academia dá-lhe uma resposta confiante e detalhada sobre um prazo legal. Qual é o passo certo?', opts: ['Confiar — parecia específica e confiante', 'Verificar na fonte oficial antes de agir', 'Pedir à IA para repetir, para confirmar', 'Partilhar já com a equipa'], a: 1 },
      { q: 'Quer que o tutor de IA o ajude a APRENDER de verdade, não só a dar respostas. Qual é o melhor uso?', opts: ['Pedir logo a resposta final', 'Pedir que o teste e explique o que errou', 'Copiar o resumo para as notas sem ler', 'Evitar a IA por completo'], a: 1 },
      { q: 'Um colega quer colar dados pessoais de um membro num chatbot público de IA para redigir uma carta. O que diz?', opts: ['Pode ser — os chatbots são privados', 'Só se a carta for curta', 'Não — dados pessoais ficam nas nossas ferramentas cobertas pelo RGPD; anonimizar primeiro', 'Colar só o NIF, não o nome'], a: 2 }
    ]
  },
  'fire-truck-training': {
    en: [
      { q: 'Driving the truck off-road with a full tank, the biggest change to handle is…', opts: ['The radio volume', 'The shifting weight of the water moving the truck around', 'The colour of the dashboard', 'Nothing changes'], a: 1 },
      { q: 'When filling the water tank you should…', opts: ['Fill past the top for extra water', 'Watch the level, stop before it overflows, and secure the cap', 'Leave it unattended', 'Fill with the pump running dry'], a: 1 },
      { q: 'To get water from the pump to the hose, the truck’s power take-off (PTO) must be…', opts: ['Switched off', 'Engaged, with the engine at the right RPM', 'Removed', 'Painted red'], a: 1 },
      { q: 'The most important habit in a fire drill is…', opts: ['Working alone to be faster', 'Knowing your role and where the water is before you need it', 'Skipping the walk-through', 'Leaving the keys out of the truck'], a: 1 }
    ],
    pt: [
      { q: 'A conduzir o camião em todo-o-terreno com o depósito cheio, a maior mudança a controlar é…', opts: ['O volume do rádio', 'O peso da água a deslocar-se, que move o camião', 'A cor do painel', 'Nada muda'], a: 1 },
      { q: 'Ao encher o depósito de água deve…', opts: ['Encher acima do limite para ter mais água', 'Vigiar o nível, parar antes de transbordar e fechar bem a tampa', 'Deixar sem vigilância', 'Encher com a bomba a trabalhar em seco'], a: 1 },
      { q: 'Para levar a água da bomba à mangueira, a tomada de força (PTO) do camião tem de estar…', opts: ['Desligada', 'Engatada, com o motor nas rotações certas', 'Retirada', 'Pintada de vermelho'], a: 1 },
      { q: 'O hábito mais importante num exercício de incêndio é…', opts: ['Trabalhar sozinho para ser mais rápido', 'Saber a sua função e onde está a água antes de precisar', 'Saltar o reconhecimento', 'Deixar as chaves fora do camião'], a: 1 }
    ]
  },
  'land-team-journey': {
    en: [
      { q: 'You catch yourself defending a decision instead of listening. Where are you?', opts: ['Above the line', 'Below the line', 'On the line', 'It depends on who is right'], a: 1 },
      { q: 'What is the fastest way to shift from below the line back above it?', opts: ['Prove your point more firmly', 'Wait for the feeling to pass', 'Notice it and ask “where am I right now?”', 'Change the subject'], a: 2 },
      { q: 'In a “no failure, only feedback” culture, a mistake on the land is treated as…', opts: ['A reason to assign blame', 'Information about the system to learn from', 'Something to hide until it is fixed', 'Proof someone is not capable'], a: 1 },
      { q: 'Which question belongs ABOVE the line?', opts: ['“Whose fault is this?”', '“Why does this always happen to me?”', '“What is this teaching us?”', '“Who told you to do that?”'], a: 2 }
    ],
    pt: [
      { q: 'Apanha-se a defender uma decisão em vez de escutar. Onde está?', opts: ['Acima da linha', 'Abaixo da linha', 'Em cima da linha', 'Depende de quem tem razão'], a: 1 },
      { q: 'Qual é a forma mais rápida de voltar de baixo da linha para cima?', opts: ['Defender o seu ponto com mais força', 'Esperar que a sensação passe', 'Reparar e perguntar “onde estou agora?”', 'Mudar de assunto'], a: 2 },
      { q: 'Numa cultura de “não há fracasso, só feedback”, um erro na terra é tratado como…', opts: ['Um motivo para atribuir culpa', 'Informação sobre o sistema, para aprender', 'Algo a esconder até estar resolvido', 'Prova de que alguém não é capaz'], a: 1 },
      { q: 'Qual destas perguntas pertence ACIMA da linha?', opts: ['“De quem é a culpa?”', '“Porque é que isto me acontece sempre a mim?”', '“O que é que isto nos está a ensinar?”', '“Quem te mandou fazer isso?”'], a: 2 }
    ]
  }
};
const TAKEAWAYS = {
  'ai-literacy': {
    en: [
      ['Explain what a language model does (predicts likely text) and what it does not do (know or verify facts)', 'Name one task AI is strong at and one it is weak at in your own work', 'Spot marketing hype vs a real capability'],
      ['Pick the right tutor mode (hint / coach / explain / practice / teach) for what you need', 'Ask grounded questions tied to your courses instead of vague ones', 'Use the AI to build your thinking, not to replace it'],
      ['Recognise a hallucination: confident, specific, and wrong', 'Verify any AI claim that matters against an official or primary source', 'Correct the AI and re-ask instead of accepting a bad answer'],
      ['State what our AI sees about you (progress + courses) and what it never sees', 'Keep personal data out of public AI tools; anonymise before drafting', 'Exercise your GDPR rights: export or erase your data anytime'],
      ['State the Article 4 duty in one sentence: staff who use AI must be AI-literate', 'Know the enforcement date (2 Aug 2026) and that our internal record is the evidence', 'Point a colleague to this course as our AI-literacy path']
    ],
    pt: [
      ['Explicar o que um modelo de linguagem faz (prevê texto provável) e o que não faz (saber ou verificar factos)', 'Nomear uma tarefa em que a IA é forte e uma em que é fraca no seu trabalho', 'Distinguir publicidade de capacidade real'],
      ['Escolher o modo certo do tutor (pista / coach / explicar / praticar / ensinar) para o que precisa', 'Fazer perguntas ligadas aos seus cursos, em vez de perguntas vagas', 'Usar a IA para desenvolver o raciocínio, não para o substituir'],
      ['Reconhecer uma alucinação: confiante, específica e errada', 'Verificar qualquer afirmação importante da IA numa fonte oficial', 'Corrigir a IA e voltar a perguntar, em vez de aceitar uma má resposta'],
      ['Dizer o que a nossa IA vê sobre si (progresso + cursos) e o que nunca vê', 'Manter dados pessoais fora de IA pública; anonimizar antes de redigir', 'Exercer os direitos RGPD: exportar ou apagar os seus dados quando quiser'],
      ['Dizer o dever do Artigo 4.º numa frase: quem usa IA deve ter literacia de IA', 'Saber a data de aplicação (2 ago 2026) e que o nosso registo interno é a prova', 'Indicar este curso a um colega como o nosso percurso de literacia de IA']
    ]
  },
  'fire-truck-training': {
    en: [
      ['Know the truck cold: ignition sequence, gears, brakes and the gauges that matter before you move.',
       'A loaded water truck handles slow and heavy — anticipate, brake early, take corners wide.',
       'Do the walk-around first: tyres, leaks, water level, and a clear path out.'],
      ['Fill from a known source; watch the level and stop before it overflows.',
       'Secure the cap and valves — a loose fitting sprays or drains when you least want it.',
       'A full tank changes the truck’s weight and balance — re-check handling before you set off.'],
      ['Engage the PTO and bring the engine to the right RPM before you expect pressure at the hose.',
       'On rough ground, stabilise and level the truck before you pump — never spray from an unsafe position.',
       'Control the jet: right pressure, right pattern, aimed at the base of the fire, not the flames.'],
      ['Learn the power system — PTO, pump and cut-offs — and how to shut it all down safely.',
       'Never work alone at the pump; know your role, your water source and your exit before the drill starts.',
       'Drill it until it’s muscle memory — in a real fire there’s no time to read the manual.']
    ],
    pt: [
      ['Conheça o camião de cor: sequência de arranque, mudanças, travões e os indicadores que importam antes de andar.',
       'Um camião com água conduz-se pesado e lento — antecipe, trave cedo, faça as curvas largas.',
       'Faça a volta de inspeção primeiro: pneus, fugas, nível de água e um caminho de saída livre.'],
      ['Encha de uma fonte conhecida; vigie o nível e pare antes de transbordar.',
       'Feche bem a tampa e as válvulas — uma ligação solta esguicha ou esvazia na pior altura.',
       'Um depósito cheio muda o peso e o equilíbrio do camião — reconfirme a condução antes de partir.'],
      ['Engate a tomada de força (PTO) e leve o motor às rotações certas antes de esperar pressão na mangueira.',
       'Em terreno acidentado, estabilize e nivele o camião antes de bombear — nunca projete de uma posição insegura.',
       'Controle o jato: pressão certa, padrão certo, apontado à base do fogo e não às chamas.'],
      ['Aprenda o sistema de potência — PTO, bomba e cortes — e como desligar tudo em segurança.',
       'Nunca trabalhe sozinho na bomba; saiba a sua função, a sua fonte de água e a sua saída antes de começar.',
       'Treine até ser memória muscular — num incêndio real não há tempo para ler o manual.']
    ]
  },
  'growth-journey': {
    en: [
      ['The job does not give you purpose — you bring it. Meaning, intention and energy arrive with you.',
       'Your governing intention is the sentence under your day: “get through it” or “make it count”. Same hours, very different people over time.',
       'You will spend thousands of hours working — use them to become more skilled, more resilient, someone people trust.'],
      ['Two people with the same role and support end up in different places: one worked, the other worked with direction.',
       'No one can take responsibility for your development for you. Goals are how you own it.',
       'Ask “what do I want to be better at six months from now?” — then pick the skill and make it visible.'],
      ['Kaizen: “this is how we do it today — could it be better?” instead of “this is how we do it”.',
       'Pay attention to how the work gets done: unnecessary steps, repeated mistakes, work that has to be redone.',
       'Improve one small thing and test it. Leave every process better than you found it.'],
      ['Event → interpretation → belief → self-talk → action → result. To change the result, examine the pattern before the action.',
       'The same feedback can mean “I’m not good enough” or “now I know what to work on” — the belief decides.',
       'Your self-talk is your beliefs speaking in sentences. Choose sentences that make you try again.'],
      ['Six core needs drive every reaction under pressure: certainty, variety, significance, connection, growth, contribution.',
       'None of them is wrong — the skill is noticing which one you are protecting before it controls your behaviour.',
       'Pause, notice the need, choose the response. Awareness creates choice, and better choices create better results.']
    ],
    pt: [
      ['O trabalho não te dá propósito — és tu que o trazes. O sentido, a intenção e a energia chegam contigo.',
       'A tua intenção governante é a frase por baixo do dia: “aguentar até ao fim” ou “fazer o dia valer”. As mesmas horas, pessoas muito diferentes com o tempo.',
       'Vais passar milhares de horas a trabalhar — usa-as para te tornares mais competente, mais resiliente, alguém em quem se confia.'],
      ['Duas pessoas com a mesma função e o mesmo apoio acabam em lugares diferentes: uma trabalhou, a outra trabalhou com direção.',
       'Ninguém pode assumir a responsabilidade pelo teu desenvolvimento por ti. Os objetivos são a forma de o assumires.',
       'Pergunta “em que quero ser melhor daqui a seis meses?” — escolhe a competência e torna-a visível.'],
      ['Kaizen: “é assim que fazemos hoje — podia ser melhor?” em vez de “é assim que se faz”.',
       'Repara em como o trabalho é feito: passos desnecessários, erros repetidos, trabalho que tem de ser refeito.',
       'Melhora uma coisa pequena e testa. Deixa cada processo melhor do que o encontraste.'],
      ['Acontecimento → interpretação → crença → diálogo interior → ação → resultado. Para mudar o resultado, examina o padrão antes da ação.',
       'O mesmo feedback pode significar “não sou bom o suficiente” ou “agora sei o que trabalhar” — a crença decide.',
       'O teu diálogo interior são as tuas crenças a falar em frases. Escolhe frases que te façam tentar outra vez.'],
      ['Seis necessidades essenciais movem cada reação sob pressão: certeza, variedade, significância, ligação, crescimento, contribuição.',
       'Nenhuma está errada — a competência é reparar qual estás a proteger antes de ela controlar o teu comportamento.',
       'Para, repara na necessidade, escolhe a resposta. A consciência cria escolha, e melhores escolhas criam melhores resultados.']
    ]
  },
  'land-team-journey': {
    en: [
      ['Above the line is openness, curiosity and commitment to learning; below it is defensiveness, blame and needing to be right.',
       'Everyone drifts below the line — the skill is noticing it in the moment, without judgement.',
       'One honest question shifts everything: “Where am I right now?”'],
      ['Failure is data — every result is information about the system, not a verdict on you.',
       'Teams that treat mistakes as feedback learn faster and hide less.',
       'Ask “what is this teaching us?” before “whose fault is this?”'],
      ['Excellence lives in the details others walk past — the loose gate, the mislabelled seedling, the half-finished job.',
       'Attention to detail is a form of respect: for the land, the work, and whoever comes after you.',
       'Before you call it done, look once more — what would the most careful version of you check?'],
      ['Total responsibility means owning the result, not just your slice of it — no “that wasn’t my job.”',
       'When something goes wrong, the strong question is “what could I have done differently?” not “who’s to blame?”',
       'Taking full ownership is what turns a worker into someone the team can rely on.'],
      ['The land never stops teaching — the day you think you know it all is the day you stop growing.',
       'Every task, mistake and season is a lesson if you stay curious enough to receive it.',
       'Ask more than you assume; the best on the team never stopped being students.'],
      ['Most mistakes on the land begin as a misunderstanding nobody checked.',
       'Don’t assume you understood — say it back, ask the question, confirm before you act.',
       'Clear beats clever: a short “let me make sure I’ve got this” saves hours of redoing.'],
      ['Set the standard by how you’d want it done if this were your own land.',
       'Excellence isn’t a burst of effort — it’s the standard you hold when nobody is watching.',
       'Be the benchmark others measure against; raise the bar and the whole team rises with you.']
    ],
    pt: [
      ['Acima da linha é abertura, curiosidade e vontade de aprender; abaixo é defesa, culpa e precisar de ter razão.',
       'Todos deslizamos para baixo da linha — a competência é reparar no momento, sem julgamento.',
       'Uma pergunta honesta muda tudo: “Onde estou agora?”'],
      ['O fracasso é informação — cada resultado fala do sistema, não é um veredicto sobre si.',
       'Equipas que tratam erros como feedback aprendem mais depressa e escondem menos.',
       'Pergunte “o que nos está a ensinar?” antes de “de quem é a culpa?”'],
      ['A excelência vive nos detalhes que os outros ignoram — o portão solto, a muda mal etiquetada, o trabalho a meio.',
       'A atenção ao detalhe é uma forma de respeito: pela terra, pelo trabalho e por quem vem a seguir.',
       'Antes de dizer que está feito, olhe mais uma vez — o que verificaria a sua versão mais cuidadosa?'],
      ['Responsabilidade total é assumir o resultado, não só a sua parte — nada de “isso não era comigo.”',
       'Quando algo corre mal, a pergunta forte é “o que poderia eu ter feito diferente?” e não “de quem é a culpa?”',
       'Assumir por inteiro é o que transforma um trabalhador em alguém com quem a equipa pode contar.'],
      ['A terra nunca deixa de ensinar — o dia em que julga saber tudo é o dia em que deixa de crescer.',
       'Cada tarefa, erro e estação é uma lição, se mantiver a curiosidade para a receber.',
       'Pergunte mais do que presume; os melhores da equipa nunca deixaram de ser aprendizes.'],
      ['A maioria dos erros na terra começa num mal-entendido que ninguém confirmou.',
       'Não presuma que percebeu — repita por palavras suas, faça a pergunta, confirme antes de agir.',
       'Claro vale mais que esperto: um breve “deixa-me confirmar” poupa horas de retrabalho.'],
      ['Defina o padrão pela forma como o quereria feito se a terra fosse sua.',
       'A excelência não é um rasgo de esforço — é o padrão que mantém quando ninguém está a ver.',
       'Seja a referência pela qual os outros se medem; eleve a fasquia e toda a equipa sobe consigo.']
    ]
  }
};
const COURSE_PT = {
  'ai-literacy': { title:'Trabalhar Bem com a IA', desc:'O Regulamento IA da UE (Artigo 4.º) pede a todas as organizações que usam IA que garantam a literacia de IA das suas pessoas. Esta é a nossa versão: o que a IA é e não é, como trabalhar com a IA da Academia com honestidade e segurança, o que ela faz com os seus dados, e o que a lei espera de nós.', modules:['O que a IA É (e Não É)','Trabalhar com o Nosso Tutor de IA','Quando a IA Está Errada','Os Seus Dados e Privacidade','O Regulamento IA da UE e Nós'] },
  'fire-truck-training': { title:'Formação — Camião de Incêndio', desc:'Operação prática do camião de combate a incêndios da propriedade — arrancar, conduzir, encher e pôr água exatamente onde é preciso. Quando chega a época de fogos, todos devem saber mover água.', modules:['Arrancar e Conduzir o Camião','Encher o Depósito de Água','Todo-o-Terreno, Bomba e Jato','Potência, Segurança e o Exercício'] },
  'alignment-journey': { title:'A Jornada de Alinhamento EdenRise', desc:'John dá-lhe as boas-vindas pessoalmente e apresenta a estrutura em que tudo o resto na EdenRise assenta: o ESIP, a forma como pensamos e agimos em conjunto. Depois, duas jornadas mais profundas — para além do medo, e cuidar do corpo, da alma e do espírito — para trazer a pessoa inteira para o trabalho.', hook:'Uma equipa, uma forma de trabalhar — a começar por boas-vindas calorosas.', hookSub:'As boas-vindas do John, o ESIP, ir para além do medo, e cuidar do corpo, alma e espírito.', modules:[
    'Boas-vindas',
    'ESIP · A Estrutura',
    'Para Além do Medo · Introdução', 'Para Além do Medo · Animação', 'Para Além do Medo · Desmontar e Sintetizar',
    'Corpo, Alma e Espírito · Introdução', 'Corpo, Alma e Espírito · Análise Profunda'
  ] },
  'growth-journey': { title:'Propósito Último', desc:'A segunda jornada da Equipa da Terra — do propósito à prática diária. Porque se levanta, os objetivos que daí decorrem, a disciplina das pequenas melhorias, as crenças que o sustentam e as seis necessidades por trás de cada reação.', hook:'Saiba porque se levanta — e defina objetivos que ficam.', hookSub:'Propósito, objetivos a 90 dias, kaizen e as crenças que o sustentam numa época difícil.', modules:['Propósito Último', 'Definição de Objetivos', 'Kaizen', 'Crenças Vencedoras', 'As Seis Necessidades Humanas', 'Aprofundar · Definição de Objetivos: Animação', 'Aprofundar · Os Seus Objetivos a 90 Dias', 'Aprofundar · Os Seus 5 Principais Objetivos', 'Aprofundar · Definição de Objetivos: Síntese'] },
  'land-team-journey': { title:'Acima da Linha', desc:'A jornada de crescimento da Equipa da Terra — a mentalidade e os hábitos que moldam como trabalhamos a terra, e uns aos outros. Começa com uma pergunta que muda a forma como aparecemos.', modules:['Acima da Linha, Abaixo da Linha','Não Há Fracasso, Só Feedback','Responsabilidade Total','Comunicação — Esclareça','Benchmark de Excelência','Atenção ao Detalhe','Seja Aprendiz','A Ciência da Gratidão','Aprofundar · Acima da Linha: Pensamento Simples e Poderoso','Aprofundar · Acima da Linha: Análise Profunda','Aprofundar · Acima da Linha: Síntese','Aprofundar · Sem Fracasso: a Animação','Aprofundar · Sem Fracasso: Síntese'], hook:'Escolha como aparece — mesmo nos dias difíceis.', hookSub:'Oito hábitos de mentalidade que fazem de si alguém em quem a equipa pode confiar.' },
  'land-literacy': { title:'Ler a Terra', desc:'Antes de mudar uma paisagem, aprenda a lê-la. Declive, água, solo, sol e sucessão — a literacia com que começa todo o ato de zeladoria.', modules:['Ficar quieto: como observar','Ler o declive e a água','O solo ao toque e à vista','Sol, sombra e exposição','Sucessão e o que a terra quer','Mapear o seu terreno'] },
  'living-soil': { title:'Solo Vivo', desc:'O solo não é terra morta — é uma comunidade viva. Conheça o microbioma sob os seus pés e as práticas que o alimentam em vez de o esgotar.', modules:['A teia alimentar do solo','Porque deixámos de lavrar','Compostagem como inoculante','Culturas de cobertura e raízes vivas','Cobertura morta e solo nu','Ler uma análise de solo'] },
  'water-cycles': { title:'A Água e a Paisagem Viva', desc:'Domine o pequeno ciclo da água de que a sua terra depende. Este programa adapta-se ao seu terreno — a IA da EdenRise reordena cada módulo conforme o que já sabe.', modules:['O pequeno ciclo da água','Para onde vai a sua água','Abrandar, espalhar, infiltrar','Valas de infiltração em curva de nível','Charcos e represas','Reidratar terra seca','Águas cinzentas, com cuidado','Proteger uma horta da seca','Ler uma bacia','Nascentes e olheiros','Medir a infiltração','Avaliação final'] },
  'agroforestry': { title:'Agrofloresta e a Floresta Comestível', desc:'Construa uma floresta que o alimenta. Sete camadas, fixadores de azoto e a arte paciente de desenhar um sistema cada vez mais abundante.', modules:['As sete camadas','Escolher o dossel','Fixadores de azoto e espécies de apoio','Consórcios que funcionam','Plantar para a sucessão','Cuidar da floresta jovem'] },
  'regen-design': { title:'Desenhar com a Natureza', desc:'Desenho de permacultura da observação ao plano: zonas, setores e como colocar cada elemento para que a terra faça o trabalho.', modules:['Observar antes de agir','Zonas e setores','Colocar elementos por relação','Dos padrões aos detalhes','O plano do sítio inteiro'] },
  'capstone-land': { title:'Projeto Final: O Seu Plano de Terra', desc:'O final avaliado: produza e apresente um plano de regeneração de um ano para uma terra real. A IA da EdenRise avalia água, solo e sequência.', modules:['Apresentar o seu sítio','Desenho a começar pela água','Sequenciar o primeiro ano','Ensaio com feedback da IA','Revisão avaliada por IA'] },
  'composting': { title:'A Arte da Compostagem', desc:'Transforme resíduos em ouro negro. Pilhas quentes, frias, minhocas e as proporções simples que fazem composto de forma fiável, sem cheiro.', modules:['Verdes e castanhos','Fazer uma pilha quente','Minhocas e vermicomposto','Chá de composto e extratos','Resolver maus cheiros','Usar o composto pronto'] },
  'seed-saving': { title:'Guardar Sementes e Variedades Antigas', desc:'Mantenha a linhagem viva. Guarde, seque e armazene semente da sua horta — e as variedades de polinização aberta a proteger no Alentejo.', modules:['Porque importa a polinização aberta','Isolamento e pureza','Processar semente húmida e seca','Secar e armazenar','Uma biblioteca de sementes'] },
  'foraging': { title:'Colher no Alentejo', desc:'Saia e volte alimentado. Ervas silvestres, cogumelos, plantas e a regra de ouro — identifique com certeza, colha com cuidado.', modules:['A mentalidade do colhedor','Identificar com certeza','Verduras silvestres do prado','Cogumelos: respeito e cautela','Ervas e chás silvestres','Ética da colheita','Calendário sazonal','Conservar a colheita silvestre','Sósias a nunca confundir','Um primeiro passeio de colheita'] },
  'native-flora': { title:'Flora Nativa e Polinizadores', desc:'Traga de volta o zumbido. Plantas nativas, sebes e as pequenas mudanças que tornam um jardim num corredor de polinizadores.', modules:['Quem são os seus polinizadores','Plantas nativas primeiro','Sebes e corredores','Floração todo o ano','Um canteiro de polinizadores'] },
  'rainwater': { title:'Captação de Água da Chuva e Valas', desc:'Aproveite cada gota. Telhados, tanques, valas e terraplenagens que guardam as chuvas de inverno no solo para o longo verão alentejano.', modules:['Dimensionar a bacia','Tanques e primeiro fluxo','Cavar em curva de nível','Extravasamento e segurança','Guardar água no solo'] },
  'rewilding': { title:'Rewilding e Habitat', desc:'Recue e deixe a vida regressar. Onde intervir, onde esperar e como medir uma paisagem a voltar à vida.', modules:['Ler o que falta','Espécies-chave','Quando não fazer nada','Charcos, troncos e limites','Medir o regresso'] },
  'cork-oak': { title:'O Montado e o Sobreiro', desc:'A obra-prima viva do Alentejo. Como a savana de sobreiros alimenta pessoas, gado e vida selvagem — e como cuidá-la por séculos.', modules:['O que é um montado','O ciclo da cortiça','Pastoreio sob as árvores','Bolota, porcos e pessoas','Regenerar sobreiros velhos'] },
  'natural-building': { title:'Construção Natural com Terra', desc:'Construa com o que a terra dá. Taipa, cal, reboco de terra e as paredes quentes que abrigam o Alentejo há gerações.', modules:['A terra como material','Testar a sua mistura','Bases de taipa e adobe','Rebocos de cal e terra','Acabamentos que duram'] },
  'herbal': { title:'A Botica de Ervas', desc:'Cultive o seu remédio. Um jardim de ervas medicinais e as preparações simples — chás, tinturas, pomadas — que fazem de uma colheita uma botica.', modules:['Um jardim que cura','Colher na altura certa','Secar e guardar ervas','Chás, tinturas e infusões','Pomadas e bálsamos','A sua botica caseira'] },
  'fire-safety': { title:'Segurança contra Incêndios na Terra', desc:'O verão alentejano pede respeito. Espaço defensável, janelas de queima seguras, equipamento e o que fazer nos primeiros sessenta segundos.', modules:['A época de fogos de 2026','Espaço defensável junto a edifícios','Janelas de queima seguras','Ferramentas e água à mão','Ler o vento e o terreno','Os primeiros 60 segundos','Alertar e evacuar','Limpar terreno em segurança','Verificação de certificação'] },
  'ethics': { title:'Ética da Zeladoria e Direitos da Terra', desc:'A zeladoria é uma relação de dever. Direitos da terra, direitos de água, vizinhos e a ética de deixar um lugar melhor do que o encontrou.', modules:['A terra como relação, não bem','Direitos de água e partilha','Trabalhar com vizinhos','Deixar melhor','Verificação de certificação'] },
  'seasonal-rhythm': { title:'Viver ao Ritmo das Estações', desc:'Reafine a sua vida ao calendário da terra. Uma série em seis partes sobre trabalhar com as estações do Alentejo, e não contra elas.', modules:['A roda do ano','Primavera: plantar e energia','Verão: cuidar e descansar','Outono: colher e guardar','Inverno: quietude e planeamento'] },
  'nature-connection': { title:'A Arte de Reparar', desc:'Uma prática de atenção. Caminhadas lentas, lugares de contemplação e o hábito diário de reparar que transforma onde vive num lugar a que pertence.', modules:['O seu lugar de contemplação','Alargar os sentidos','Um diário diário da natureza','Acompanhar mudanças ao longo de semanas','Pertencer a um lugar','Partilhar o que vê'] },
  'community-land': { title:'Comunidade e os Bens Comuns', desc:'A terra cura mais depressa em conjunto. Ferramentas partilhadas, mutirões e as estruturas que permitem a uma comunidade cuidar de um lugar como um só.', modules:['Porque funcionam os comuns','Partilhar ferramentas e trabalho','Organizar um mutirão','Decidir sem esgotamento','Um plano comunitário de 90 dias'] }
};
const COURSE_SKILLS = {
  'ai-literacy': ['leadership'],
  'fire-truck-training': ['safety'],
  'alignment-journey': ['leadership', 'community'],
  'land-team-journey': ['leadership', 'community'],
  'growth-journey': ['leadership'],
};

/* ===== REQ-L-021 · SPECIAL REGIMES =========================================
   Some training is governed by its own regime with its own provider rules —
   food hygiene / HACCP (Reg. CE 852/2004; DL 113/2006) and safety and health at
   work (SST). Legal spec Part 6 Q5 asks whether those may be employer-delivered
   through this platform at all, and it is UNANSWERED.

   Until it is answered, a course in one of these regimes may still be taken and
   still counts toward the art. 131.º 40 hours — that part is not in doubt — but
   the platform must never state or imply that it DISCHARGES the special regime.
   Fire Truck Training is the live example: plausibly SST, and exactly the kind
   of course a client would assume covers their safety obligation. */
/* ===== EDUCATORS — the people who teach ====================================
   A premium academy names its teacher. Here that is not decoration: at
   EdenRise (and at every tenant) the educator is a COLLEAGUE, and putting
   their face and their "why" on the module is how passing knowledge down
   becomes a form of dignity rather than a chore. It also does legal work —
   REQ-L-003 requires the training record to name the trainer, not only the
   supplier organisation.

   Fields: name · role · line (one credibility sentence) · why (their own words,
   first person) · portrait (optional — a monogram is rendered when absent, so a
   tenant is never blocked on a photoshoot) · external:true when the trainer is
   NOT an employee (that name flows onto the certificate).

   BINDING IS PER MODULE. The educator shows inside the lesson, under the video,
   so a course can carry several experts:
     moduleEducators: ['tiago', 'alina', 'tiago', 'tiago']   // one per module
     educator: 'tiago'                                        // fallback default
     modulePresentation: [null, null, 'avatar', null]         // synthetic likeness
   A module with an entry in moduleEducators wins; otherwise the course default
   applies. `presentation`/`modulePresentation` of 'avatar' always renders the
   disclosure badge next to the name.

   ⚠️ JOÃO — the names below are the ONLY thing missing. I have not invented
   colleagues. Everything else is built and live.
   ========================================================================= */
const EDUCATORS = {
  /* example shape — replace with real people, then set `educator:` on courses
  'alina': {
    name: 'Alina',
    role: { en: 'Wine & bar', pt: 'Vinhos e bar' },
    line: { en: 'Runs the bar list and knows the Alentejo growers by name.',
            pt: 'Responsável pela carta e conhece os produtores alentejanos pelo nome.' },
    why:  { en: 'A guest asking about a wine is asking about a place. I want you to be able to answer.',
            pt: 'Quem pergunta por um vinho está a perguntar por um lugar. Quero que saibam responder.' },
    portrait: 'media/educators/alina.webp',   // optional — a monogram renders without it
  },
  */
};

const COURSE_REGIME = {
  'fire-truck-training': 'SST'
};

/* ===== REELS — short-form vertical lessons ==================================
   20–60 seconds, 9:16, swipe feed. The mechanics people already have in their
   thumbs, pointed at learning instead of at time.

   ONE LIBRARY, THREE DOORS. A reel is the content object: seen in the FEED
   (#/reels), pushed by the DRIP as an approved "quick win", and listed on the
   home RAIL. One library, one curation state, one production queue.

   THREE RULES, ALL STRUCTURAL:

   1 · A REEL CAN NEVER CREDIT TRAINING HOURS. Reels are not in CATALOG, so they
       cannot reach creditTraining() at all — 30 seconds fails both gates in
       LEGAL-40H-LINE.md. A flag could be flipped; a different kind of object
       cannot be.

   2 · EVERY REEL POINTS AT ITS DEPTH via `deeper`. The reel is the hook; the
       course is where the hours and the capability live. All eight below are
       principles OF Above the Line, so `deeper` is the real course, not a guess.

   3 · THE FEED ENDS (FEED_PAUSE_AFTER). Infinite scroll is engineered for
       compulsion; on company time that is not a mechanic to copy. The loop
       stays — repetition is how a 30-second idea sticks — the bottomlessness
       goes.

   WHY THESE SIX AND NOT INVENTED ONES. Above the Line is already recorded,
   transcribed and gated in this repo, so each reel below is a REAL principle
   the team will meet again at depth, and swiping one lands somewhere that
   exists. What is still a placeholder is the FOOTAGE (`media: {type:'soon'}`
   renders a designed card, never a broken player) and therefore the CHECK:
   every `check` here carries `placeholder: true`, because a verified check is
   one generated from a transcript by scripts/reel-check.mjs and blind-gated —
   and there is no clip to transcribe yet. `placeholder: true` on the reel keeps
   all six out of every tenant-facing count.

   BOTH LANGUAGES INCLUDING THE CHECK. The template's placeholders carried `en:`
   only, and validQuestion() falls back to English — so a Portuguese learner
   would have been asked an English question underneath a Portuguese title. Same
   class of leak as the PT transcripts. Every field below is en + pt.        */
const REELS = [
  { id: "bring-the-energy", seconds: 20, theme: "energy",
    title: { en: "Give Energy", pt: "Dá Energia" },
    hook:  { en: "You can be the person who gives energy to others just by interacting with them.", pt: "Podes ser a pessoa que dá energia aos outros." },
    line:  { en: "Leave people stronger than you found them.", pt: "Deixe as pessoas mais fortes do que as encontrou." },
    /* Written from this clip's own Whisper transcript and blind-verified against
       it by a second model (en: verified · pt: verified). The
       recording is English; the Portuguese here is localised TEXT, not a claim
       that anyone spoke it — videoLang says so and the player shows the notice. */
    lesson: { en: "Great teammates create energy in other people by listening fully, noticing effort, bringing solutions, and sharing belief. Every interaction leaves something behind, so it's essential to consider the impact you have on others. Ask yourself if people are stronger after interacting with you.", pt: "Os grandes colegas de trabalho não só completam tarefas, mas também criam energia nos outros. Para isso, é preciso ouvir atentamente, notar o esforço, trazer soluções e partilhar crenças. Cada interação deixa algo para trás." },
    videoLang: 'en',
    check: { type: "application", a: 1, audit: "verified",
      en: { q: "What can you do to create energy in others?", opts: ["Just complete tasks", "Listen fully and notice effort", "Ignore others' feelings"], why: "The passage states that great teammates create energy by listening fully, noticing effort, bringing solutions, and sharing belief." },
      pt: { q: "O que é que os grandes colegas de trabalho criam nos outros?", opts: ["Tensão", "Energia", "Desânimo"], why: "Porque os grandes colegas de trabalho criam energia nos outros, como é referido no texto." } },
    media: { type: 'mp4', src: 'https://edenrise-reels.pages.dev/bring-the-energy.mp4' }, poster: 'https://edenrise-reels.pages.dev/bring-the-energy.jpg',
    approved: true,   /* published by the tenant — see qwPublished in core/app.js */
    deeper: 'land-team-journey' },
  { id: "culture", seconds: 20, theme: "culture",
    title: { en: "Defining Excellence", pt: "O que é cultura" },
    hook:  { en: "Accepting 'good enough' can actually lower our standards over time.", pt: "A cultura não é o que escrevemos na parede, mas o que acontece quando ninguém está a olhar." },
    line:  { en: "What you walk past is what you accept.", pt: "Aquilo por que passamos ao lado é aquilo que aceitamos." },
    /* Written from this clip's own Whisper transcript and blind-verified against
       it by a second model (en: verified · pt: verified). The
       recording is English; the Portuguese here is localised TEXT, not a claim
       that anyone spoke it — videoLang says so and the player shows the notice. */
    lesson: { en: "Culture is not just what we say, but what we do when no one is watching. Accepting 'good enough' can quietly redefine what we consider good. Excellence is about caring enough to notice and act, not about being perfect.", pt: "A cultura não é apenas o que dizemos, mas sim o que fazemos quando ninguém está a olhar. Quando aceitamos o 'bom o suficiente', estamos a redefinir o que é bom. A excelência não é perfeição, mas sim cuidar o suficiente para notar e ter coragem para agir." },
    videoLang: 'en',
    check: { type: "application", a: 2, audit: "verified",
      en: { q: "What happens when we accept 'good enough'?", opts: ["We achieve perfection", "We maintain our current standards", "We redefine what good means"], why: "According to the passage, every time we accept good enough, we quietly redefine what good means." },
      pt: { q: "O que acontece quando aceitamos o 'bom o suficiente'?", opts: ["O padrão de qualidade aumenta", "O padrão de qualidade diminui", "Não há mudança no padrão de qualidade"], why: "Porque aceitar o 'bom o suficiente' redefine o que é bom e pode levar a uma diminuição do padrão de qualidade." } },
    media: { type: 'mp4', src: 'https://edenrise-reels.pages.dev/culture.mp4' }, poster: 'https://edenrise-reels.pages.dev/culture.jpg',
    approved: true,   /* published by the tenant — see qwPublished in core/app.js */
    deeper: 'land-team-journey' },
  { id: "own-the-outcome", seconds: 20, theme: "ownership",
    title: { en: "Own The Outcome", pt: "Mudar o resultado" },
    hook:  { en: "High performing teams can change the outcome of a problem by owning their part.", pt: "As equipas de alto desempenho não procuram culpados, mas sim soluções." },
    line:  { en: "One question that turns blame into progress.", pt: "Uma pergunta que troca a culpa por progresso." },
    /* Written from this clip's own Whisper transcript and blind-verified against
       it by a second model (en: verified · pt: verified). The
       recording is English; the Portuguese here is localised TEXT, not a claim
       that anyone spoke it — videoLang says so and the player shows the notice. */
    lesson: { en: "When something goes wrong, you can either ask who's at fault or what you can do now. High performing teams choose the second option, seeing the problem, owning their part, and moving it forward. Ownership is about power, not blame.", pt: "Quando algo correr mal, em vez de perguntar quem é o culpado, pergunta o que podes fazer agora. A responsabilidade não é sobre culpa, é sobre poder. Ao assumires a tua parte, podes mudar o resultado. As equipas de alto desempenho veem o problema, assumem a sua parte e avançam." },
    videoLang: 'en',
    check: { type: "application", a: 1, audit: "verified",
      en: { q: "What do high performing teams do when something goes wrong?", opts: ["They blame someone", "They own their part and move forward", "They do nothing"], why: "Because they see the problem, own their part, and move it forward, as stated in the passage." },
      pt: { q: "O que fazem as equipas de alto desempenho quando algo correr mal?", opts: ["Procuram culpados", "Assumem a responsabilidade e avançam", "Ignoram o problema"], why: "Porque assumir a responsabilidade e avançar permite mudar o resultado, como referido na passagem." } },
    media: { type: 'mp4', src: 'https://edenrise-reels.pages.dev/own-the-outcome.mp4' }, poster: 'https://edenrise-reels.pages.dev/own-the-outcome.jpg',
    approved: true,   /* published by the tenant — see qwPublished in core/app.js */
    deeper: 'land-team-journey' },
  { id: "raise-the-energy", seconds: 20, theme: "energy",
    title: { en: "Raise The Space", pt: "Energia Positiva" },
    hook:  { en: "Your energy is never just yours and can impact those around you.", pt: "A sua energia nunca é só sua." },
    line:  { en: "You change a room before you say anything.", pt: "Muda uma sala antes de dizer alguma coisa." },
    /* Written from this clip's own Whisper transcript and blind-verified against
       it by a second model (en: verified · pt: verified). The
       recording is English; the Portuguese here is localised TEXT, not a claim
       that anyone spoke it — videoLang says so and the player shows the notice. */
    lesson: { en: "When you enter a space, you bring energy with you. This energy can be positive or negative. Bring curiosity, courage, and generosity to raise the space and leave people stronger.", pt: "Quando entra num espaço, traz consigo energia, possibilidade ou momentum. Pode optar por trazer curiosidade, coragem e generosidade. Isso pode deixar as pessoas mais fortes." },
    videoLang: 'en',
    check: { type: "application", a: 1, audit: "verified",
      en: { q: "What can you bring into a space to raise its energy?", opts: ["Fear", "Curiosity", "Apathy"], why: "The passage suggests bringing curiosity, courage, and generosity to raise the space." },
      pt: { q: "O que pode acontecer quando você traz energia positiva para um espaço?", opts: ["As pessoas se tornam mais fracas", "As pessoas se tornam mais fortes", "Nada muda"], why: "Porque a energia positiva pode inspirar e motivar os outros." } },
    media: { type: 'mp4', src: 'https://edenrise-reels.pages.dev/raise-the-energy.mp4' }, poster: 'https://edenrise-reels.pages.dev/raise-the-energy.jpg',
    approved: true,   /* published by the tenant — see qwPublished in core/app.js */
    deeper: 'land-team-journey' },
  { id: "safe-to-speak", seconds: 20, theme: "teamwork",
    title: { en: "Safe to Speak", pt: "Falar Sem Medo" },
    hook:  { en: "The strongest team is not the one where everyone agrees, but where someone can speak up without fear of judgment.", pt: "A equipe mais forte é aquela onde alguém pode dizer que está errada." },
    line:  { en: "The team that can disagree is the team that improves.", pt: "A equipa que consegue discordar é a que melhora." },
    /* Written from this clip's own Whisper transcript and blind-verified against
       it by a second model (en: verified · pt: verified). The
       recording is English; the Portuguese here is localised TEXT, not a claim
       that anyone spoke it — videoLang says so and the player shows the notice. */
    lesson: { en: "A strong team is one where members can express themselves freely, saying 'I think we are wrong' or 'I need help' without fear of being judged. The best idea should matter more than who came up with it. This allows for open communication and collaboration.", pt: "A equipe mais forte não é aquela onde todos concordam, mas sim onde alguém pode dizer que está errada ou precisa de ajuda. Isso permite que as melhores ideias sejam compartilhadas. O importante é criar um ambiente seguro para falar." },
    videoLang: 'en',
    check: { type: "application", a: 1, audit: "verified",
      en: { q: "What makes a team strong according to this idea?", opts: ["Everyone agreeing on everything", "Members feeling safe to speak up", "Having a clear hierarchy"], why: "The passage states that the strongest team is where someone can say 'I think we are wrong' or 'I need help' without fear of judgment, indicating that open and safe communication is key." },
      pt: { q: "O que é mais importante para uma equipe forte?", opts: ["Que todos concordem", "Que as pessoas sejam honestas", "Que o chefe esteja sempre certo"], why: "Porque a honestidade permite que as melhores ideias sejam compartilhadas e que os erros sejam corrigidos." } },
    media: { type: 'mp4', src: 'https://edenrise-reels.pages.dev/safe-to-speak.mp4' }, poster: 'https://edenrise-reels.pages.dev/safe-to-speak.jpg',
    approved: true,   /* published by the tenant — see qwPublished in core/app.js */
    deeper: 'land-team-journey' },
  /* NEW BATCH 2026-09-04 — from reels-source/Vertical (not the Approved folder):
     staged PENDING so it reaches nobody until approved in Studio → Quick wins.
     Written from this clip's own Whisper transcript and blind-verified against
     it (en: verified · pt: verified). The recording is English;
     the Portuguese is localised TEXT — videoLang says so. */
  { id: "agreed-values", seconds: 20, theme: "values",
    title: {"en": "Agreed Team Values", "pt": "Valores em equipa"},
    hook:  {"en": "Without agreed values, team decisions are based on who is loudest or most tired.", "pt": "Sem valores acordados, as decisões são baseadas em quem é mais barulhento ou no que aconteceu por último."},
    line:  {"en": "You will learn why agreed values are crucial for making consistent team decisions.", "pt": "Tu aprenderá como a falta de valores afeta as decisões da equipa."},
    lesson: {"en": "When a team lacks agreed values, decisions are made based on factors like who is loudest or how tired everyone is. This can lead to inconsistent decisions. Agreed values provide a clear basis for decision-making.", "pt": "Quando uma equipa não tem valores acordados, as decisões são baseadas em fatores como quem é mais barulhento, o que aconteceu por último ou o nível de cansaço. Isso ocorre porque não há uma diretriz clara para tomar decisões. Os valores são essenciais para guiar as decisões da equipa."},
    videoLang: 'en',
    check: { type: "application", a: 1, audit: "verified",
      en: {"q": "What happens when a team has no agreed values?", "opts": ["Decisions are based on facts", "Decisions are based on values or moods", "Decisions are always consistent"], "why": "The passage states that without agreed values, decisions run on 'whoever is loudest, whatever happened last, how tired everyone is', which corresponds to 'values or moods'."},
      pt: {"q": "O que acontece com as decisões da equipa quando não há valores acordados?", "opts": ["São baseadas em fatos", "São baseadas em quem é mais barulhento ou no que aconteceu por último", "São sempre unânimes"], "why": "Porque a falta de valores acordados leva a decisões baseadas em fatores como quem é mais barulhento ou o que aconteceu por último."} },
    media: { type: 'mp4', src: 'https://edenrise-reels.pages.dev/agreed-values.mp4' }, poster: 'https://edenrise-reels.pages.dev/agreed-values.jpg',
    approved: false,
    deeper: 'land-team-journey' },
  /* NEW BATCH 2026-09-04 — from reels-source/Vertical (not the Approved folder):
     staged PENDING so it reaches nobody until approved in Studio → Quick wins.
     Written from this clip's own Whisper transcript and blind-verified against
     it (en: verified · pt: verified). The recording is English;
     the Portuguese is localised TEXT — videoLang says so. */
  { id: "three-solutions", seconds: 20, theme: "solutions",
    title: {"en": "Bring Solutions", "pt": "Três Soluções"},
    hook:  {"en": "One simple rule can turn complaining into thinking in your meetings.", "pt": "Uma regra pode transformar as reclamações em pensamento."},
    line:  {"en": "You will learn how to approach problems with solutions in mind.", "pt": "Vai aprender a apresentar problemas com soluções."},
    lesson: {"en": "When bringing a problem to a meeting, always come with three possible solutions. If you can't find three, discuss with a colleague first before taking it to your leader. This helps turn problems into thoughtful discussions.", "pt": "Nunca leve um problema sem três soluções possíveis. Se não encontrar três, leve ao colega antes de levar ao líder. Isso transforma reclamações em pensamento."},
    videoLang: 'en',
    check: { type: "application", a: 1, audit: "verified",
      en: {"q": "What should you do if you can't find three solutions to a problem?", "opts": ["Take it to your leader", "Discuss with a colleague first", "Drop the problem"], "why": "Because discussing with a colleague first can help you find more solutions before taking it to your leader."},
      pt: {"q": "O que deve fazer se não encontrar três soluções?", "opts": ["Levar ao líder", "Levar ao colega", "Esquecer o problema"], "why": "Porque levar ao colega primeiro pode ajudar a encontrar soluções antes de levar ao líder."} },
    media: { type: 'mp4', src: 'https://edenrise-reels.pages.dev/three-solutions.mp4' }, poster: 'https://edenrise-reels.pages.dev/three-solutions.jpg',
    approved: false,
    deeper: 'alignment-journey' },
  /* NEW BATCH 2026-09-04 — from reels-source/Vertical (not the Approved folder):
     staged PENDING so it reaches nobody until approved in Studio → Quick wins.
     Written from this clip's own Whisper transcript and blind-verified against
     it (en: verified · pt: verified). The recording is English;
     the Portuguese is localised TEXT — videoLang says so. */
  { id: "three-words", seconds: 20, theme: "problems",
    title: {"en": "Fixing Issues", "pt": "Três Palavras"},
    hook:  {"en": "Saying three words has never fixed anything, according to this approach.", "pt": "Três palavras nunca resolveram nada."},
    line:  {"en": "You will learn a new way to think about solving problems.", "pt": "Vai aprender o que dizer quando algo corre mal."},
    lesson: {"en": "When something goes wrong, saying three words can sound like an answer, but it doesn't fix the problem. The problem stays even if the person is removed and a new person arrives. This suggests that the person is not the main issue.", "pt": "Quando algo corre mal, alguém diz três palavras que soam como uma resposta, mas nunca resolveram nada. O problema permanece mesmo após a pessoa ser substituída. É importante considerar o problema em si, e não apenas a pessoa."},
    videoLang: 'en',
    check: { type: "application", a: 1, audit: "verified",
      en: {"q": "What happens to the problem when a new person arrives?", "opts": ["It gets worse", "It stays the same", "It gets fixed"], "why": "The passage states that the problem stays even if the person is removed and a new person arrives."},
      pt: {"q": "O que acontece quando uma pessoa é substituída e o problema persiste?", "opts": ["O problema some", "O problema permanece", "O problema muda"], "why": "Porque o problema está relacionado à situação, e não apenas à pessoa."} },
    media: { type: 'mp4', src: 'https://edenrise-reels.pages.dev/three-words.mp4' }, poster: 'https://edenrise-reels.pages.dev/three-words.jpg',
    approved: false,
    deeper: 'alignment-journey' },
  /* NEW BATCH 2026-09-04 — from reels-source/Vertical (not the Approved folder):
     staged PENDING so it reaches nobody until approved in Studio → Quick wins.
     Written from this clip's own Whisper transcript and blind-verified against
     it (en: verified · pt: verified). The recording is English;
     the Portuguese is localised TEXT — videoLang says so. */
  { id: "agreed-not-told", seconds: 21, theme: "communication",
    title: {"en": "Agreed vs Told", "pt": "Data Acordada"},
    hook:  {"en": "People are more likely to miss deadlines they were simply told about rather than agreed to.", "pt": "As pessoas protegem as datas que acordam."},
    line:  {"en": "You will learn how to improve team commitment to deadlines by distinguishing between agreed and told dates.", "pt": "Vai aprender a diferença entre datas acordadas e impostas."},
    lesson: {"en": "Before assuming your team doesn't care about a missed deadline, ask if the date was agreed upon or just told to them. People tend to miss dates they were told, but protect dates they agreed to. This distinction can help you improve team commitment.", "pt": "Antes de decidir que a equipa não se importa, pergunte se a data foi acordada ou apenas informada. As pessoas tendem a proteger as datas que acordam, mas podem perder as datas que lhes são impostas. Isso pode afetar o cumprimento de prazos."},
    videoLang: 'en',
    check: { type: "application", a: 1, audit: "verified",
      en: {"q": "What should you do before deciding your team doesn't care about a missed deadline?", "opts": ["Assume they are irresponsible", "Ask if the date was agreed or told", "Scold them for missing the deadline"], "why": "Asking if the date was agreed or told helps you understand if the team was truly committed to the deadline."},
      pt: {"q": "O que deve ser feito antes de decidir que a equipa não se importa com uma data?", "opts": ["Ignorar a data e continuar em frente", "Perguntar se a data foi acordada ou apenas informada", "Aumentar a pressão sobre a equipa"], "why": "Porque é importante saber se a data foi acordada ou apenas informada para entender o comprometimento da equipa."} },
    media: { type: 'mp4', src: 'https://edenrise-reels.pages.dev/agreed-not-told.mp4' }, poster: 'https://edenrise-reels.pages.dev/agreed-not-told.jpg',
    approved: false,
    deeper: 'alignment-journey' },
  /* NEW BATCH 2026-09-04 — from reels-source/Vertical (not the Approved folder):
     staged PENDING so it reaches nobody until approved in Studio → Quick wins.
     Written from this clip's own Whisper transcript and blind-verified against
     it (en: verified · pt: verified). The recording is English;
     the Portuguese is localised TEXT — videoLang says so. */
  { id: "standards-vs-expectations", seconds: 20, theme: "standards",
    title: {"en": "Standards vs Expectations", "pt": "Padrões vs Expectativas"},
    hook:  {"en": "Nearly all friction at work is caused by high expectations sitting on a low standard.", "pt": "Duas palavras podem acabar com a maioria dos conflitos no trabalho."},
    line:  {"en": "You will learn how to identify and adjust your standards and expectations to reduce friction at work.", "pt": "Vai aprender a distinguir entre padrões e expectativas."},
    lesson: {"en": "Standards are what you demand of yourself, while expectations are what you demand of others. To reduce friction, you should raise your standard before raising your expectation. This means focusing on your own performance and behavior before expecting others to meet certain standards.", "pt": "Os padrões são o que eu exijo de mim próprio, enquanto as expectativas são o que eu exijo dos outros. A maioria da fricção surge quando as expectativas são altas e os padrões são baixos. É importante elevar os padrões antes de elevar as expectativas."},
    videoLang: 'en',
    check: { type: "application", a: 1, audit: "verified",
      en: {"q": "What should you do before raising your expectations of others?", "opts": ["Raise your expectations of others first", "Raise your standard first", "Meet your expectations first"], "why": "Because raising your standard first helps to reduce friction caused by high expectations sitting on a low standard."},
      pt: {"q": "O que deve ser elevado antes de elevar as expectativas?", "opts": ["A comunicação", "Os padrões", "As expectativas"], "why": "Porque elevar os padrões antes de elevar as expectativas ajuda a reduzir a fricção e a melhorar a relação com os outros."} },
    media: { type: 'mp4', src: 'https://edenrise-reels.pages.dev/standards-vs-expectations.mp4' }, poster: 'https://edenrise-reels.pages.dev/standards-vs-expectations.jpg',
    approved: false,
    deeper: 'alignment-journey' },
  /* NEW BATCH 2026-09-04 — from reels-source/Vertical (not the Approved folder):
     staged PENDING so it reaches nobody until approved in Studio → Quick wins.
     Written from this clip's own Whisper transcript and blind-verified against
     it (en: verified · pt: verified). The recording is English;
     the Portuguese is localised TEXT — videoLang says so. */
  { id: "clean-the-site", seconds: 20, theme: "communication",
    title: {"en": "Define Finished", "pt": "Definir o Trabalho"},
    hook:  {"en": "You can't assume everyone has the same understanding of what 'finished' means.", "pt": "A falta de definição pode levar a mal-entendidos no local de trabalho."},
    line:  {"en": "You'll learn how to ensure everyone is on the same page when it comes to completing a task.", "pt": "Vai aprender a importância de definir o que significa terminar um trabalho."},
    lesson: {"en": "When giving a task, define what 'finished' looks like to avoid confusion. This means explaining the expected outcome before starting the job. By doing so, you can ensure everyone has the same understanding of what needs to be done.", "pt": "Quando se atribui uma tarefa a uma equipa, é importante definir o que significa terminar. Isso evita mal-entendidos e assegura que todos têm a mesma visão. Antes de começar, defina o que é considerado concluído."},
    videoLang: 'en',
    check: { type: "application", a: 1, audit: "verified",
      en: {"q": "What should you do before starting a task to avoid confusion?", "opts": ["Start working immediately", "Explain what 'finished' looks like", "Wait for someone else to define it"], "why": "Defining what 'finished' looks like helps ensure everyone has the same understanding of the expected outcome."},
      pt: {"q": "O que deve ser feito antes de uma equipa começar a trabalhar?", "opts": ["Definir as ferramentas necessárias", "Definir o que significa terminar o trabalho", "Definir a hora do almoço"], "why": "Porque definir o que significa terminar o trabalho evita mal-entendidos e assegura que todos têm a mesma visão."} },
    media: { type: 'mp4', src: 'https://edenrise-reels.pages.dev/clean-the-site.mp4' }, poster: 'https://edenrise-reels.pages.dev/clean-the-site.jpg',
    approved: false,
    deeper: 'alignment-journey' },
  /* NEW BATCH 2026-09-04 — from reels-source/Vertical (not the Approved folder):
     staged PENDING so it reaches nobody until approved in Studio → Quick wins.
     Written from this clip's own Whisper transcript and blind-verified against
     it (en: verified · pt: verified). The recording is English;
     the Portuguese is localised TEXT — videoLang says so. */
  { id: "who-did-it", seconds: 20, theme: "investigation",
    title: {"en": "Start of Investigation", "pt": "Ordem Importa"},
    hook:  {"en": "Starting an investigation with people will always lead to finding a person at fault.", "pt": "A equipa sempre encontra um culpado se começar pelo fim."},
    line:  {"en": "You will learn how the starting point of an investigation can influence its outcome.", "pt": "Vai aprender por que a ordem de investigação é crucial."},
    lesson: {"en": "Most teams start an investigation at the end, looking for who did it, which leads to finding someone to blame. Starting with people will always result in finding a person. The starting point of an investigation can influence its outcome.", "pt": "A ordem de investigação importa. Se começarmos pelo fim, sempre encontraremos um culpado. É importante começar do início para entender o que aconteceu."},
    videoLang: 'en',
    check: { type: "application", a: 1, audit: "verified",
      en: {"q": "What happens when a team starts an investigation by looking for who did it?", "opts": ["They will never find a person to blame", "They will always find a person to blame", "They will find the root cause of the problem"], "why": "The passage states that if you start with people, you will always find a person, because that is where you started looking."},
      pt: {"q": "O que acontece se a equipa começar a investigação pelo fim?", "opts": ["Sempre encontram a causa raiz", "Sempre encontram um culpado", "Nunca encontram um culpado"], "why": "Porque a equipa está focada em encontrar um culpado, em vez de entender o que aconteceu."} },
    media: { type: 'mp4', src: 'https://edenrise-reels.pages.dev/who-did-it.mp4' }, poster: 'https://edenrise-reels.pages.dev/who-did-it.jpg',
    approved: false,
    deeper: 'alignment-journey' },
  /* NEW BATCH 2026-09-04 — from reels-source/Vertical (not the Approved folder):
     staged PENDING so it reaches nobody until approved in Studio → Quick wins.
     Written from this clip's own Whisper transcript and blind-verified against
     it (en: verified · pt: verified). The recording is English;
     the Portuguese is localised TEXT — videoLang says so. */
  { id: "great-teammates", seconds: 20, theme: "teamwork",
    title: {"en": "Great Teammates", "pt": "Seja um grande colega"},
    hook:  {"en": "Great teammates can actually create energy in other people just by being around them.", "pt": "Pode ser o responsável por criar energia nos outros colegas de trabalho."},
    line:  {"en": "You will learn how to be a great teammate who gives energy to others.", "pt": "Vai aprender a ser o tipo de colega que inspira e motiva os outros."},
    lesson: {"en": "Great teammates create energy in other people by listening fully, noticing effort, bringing solutions, and sharing belief. They make others feel clearer, lighter, and more capable after interacting with them. By being a great teammate, you can be the person who gives energy to others.", "pt": "Os grandes colegas de trabalho criam energia nos outros. Para isso, é importante ouvir atentamente, notar o esforço, trazer soluções, partilhar crenças e ser uma pessoa que dá energia. Isso pode ser feito através de pequenas ações diárias."},
    videoLang: 'en',
    check: { type: "application", a: 1, audit: "verified",
      en: {"q": "What can great teammates do to create energy in others?", "opts": ["Listen partially", "Notice effort", "Avoid solutions"], "why": "The passage states that great teammates create energy by noticing effort, among other things."},
      pt: {"q": "O que é um sinal de um grande colega de trabalho?", "opts": ["Alguém que reclama constantemente", "Alguém que ouve atentamente e traz soluções", "Alguém que ignora os outros"], "why": "Porque ouvir atentamente e trazer soluções são comportamentos que criam energia nos outros, como mencionado no texto."} },
    media: { type: 'mp4', src: 'https://edenrise-reels.pages.dev/great-teammates.mp4' }, poster: 'https://edenrise-reels.pages.dev/great-teammates.jpg',
    approved: false,
    deeper: 'land-team-journey' }
];

const QUICKWINS = REELS;
