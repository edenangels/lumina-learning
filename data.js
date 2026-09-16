/* ============ EdenRise Academy — catalog & seed data ============ */

const VIDS = [
  'BigBuckBunny', 'ElephantsDream', 'ForBiggerBlazes', 'ForBiggerEscapes',
  'ForBiggerFun', 'ForBiggerJoyrides', 'ForBiggerMeltdowns', 'Sintel',
  'SubaruOutbackOnStreetAndDirt', 'TearsOfSteel'
].map(n => `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/${n}.mp4`);

/* ---- Video hosting ----
   Lesson videos live in the repo /media folder and are served through the free
   jsDelivr global CDN (no account, no card, correct video/mp4 MIME, HTTP range
   for seeking). To move to another host later, just change MEDIA_BASE:
     - Cloudflare R2:  'https://pub-xxxx.r2.dev/'            (free 10GB, needs a card to enable)
     - Cloudinary:     'https://res.cloudinary.com/.../'     (free tier, email signup, no card)
     - local/Pages:    ''                                    (empty → serve from /media)
   One switch flips every lesson. */
const MEDIA_BASE = 'https://cdn.jsdelivr.net/gh/meridante-dev/lumina-learning@main/media/';
const mediaUrl = name => (MEDIA_BASE ? MEDIA_BASE.replace(/\/?$/, '/') : 'media/') + name;

/* The six EdenRise pillars — shown as a band under the hero */
const PILLARS = [
  { icon: 'leaf', label: 'Regenerative' },
  { icon: 'tree', label: 'Rooted' },
  { icon: 'sun', label: 'Restorative' },
  { icon: 'people', label: 'Connected' },
  { icon: 'waves', label: 'Elemental' },
  { icon: 'heart', label: 'Meaningful' }
];


const QUIZ_BANK = {
  'Land & Soil': [
    { q: 'What is the single best indicator of healthy, living soil?', opts: ['Dark colour alone', 'Abundant life — worms, fungi, structure & smell', 'A high price per kilo', 'Being completely weed-free'], a: 1 },
    { q: 'Why do regenerative growers avoid tilling where they can?', opts: ['It looks untidy', 'Tillage destroys soil structure and the fungal network', 'It is illegal', 'Tractors are expensive'], a: 1 },
    { q: 'Bare soil between plants is mainly a problem because…', opts: ['It is ugly', 'It loses water, carbon and life to sun and rain', 'Neighbours complain', 'It attracts birds'], a: 1 }
  ],
  'Water & Climate': [
    { q: 'The core principle of slowing runoff on a landscape is…', opts: ['Drain it away fast', 'Slow it, spread it, sink it', 'Pump it uphill', 'Cover everything in concrete'], a: 1 },
    { q: 'A swale dug on contour primarily…', opts: ['Looks decorative', 'Catches water and lets it soak into the ground', 'Drains the land', 'Marks a boundary'], a: 1 },
    { q: 'The biggest reservoir you can build on most land is…', opts: ['A plastic tank', 'The soil itself, full of organic matter', 'A swimming pool', 'A water tower'], a: 1 }
  ],
  'Food & Forest': [
    { q: 'In a food forest, nitrogen-fixing plants are there to…', opts: ['Look pretty', 'Feed the system by fixing nitrogen for their neighbours', 'Keep people out', 'Be harvested first'], a: 1 },
    { q: 'The golden rule of foraging is…', opts: ['Take as much as you can', 'Identify with absolute certainty before you eat anything', 'Forage only at night', 'Avoid all mushrooms forever'], a: 1 },
    { q: 'A montado (cork-oak savannah) is special because it…', opts: ['Grows the fastest', 'Produces food, cork and habitat from one living system', 'Needs no care', 'Is purely ornamental'], a: 1 }
  ],
  'Stewardship': [
    { q: 'In permaculture design, what comes before any intervention?', opts: ['Buying machinery', 'Long, patient observation of the site', 'Pouring a foundation', 'Planting everything at once'], a: 1 },
    { q: 'Defensible space around a building in fire season means…', opts: ['A tall fence', 'Cleared, managed vegetation that slows an approaching fire', 'A bigger house', 'Nothing — fire is unpredictable'], a: 1 },
    { q: 'Good stewardship measures success over…', opts: ['A single season', 'Years and decades — leaving the land better', 'One harvest', 'A weekend'], a: 1 }
  ],
  '_default': [
    { q: 'What makes a practice truly "regenerative" rather than just sustainable?', opts: ['It costs more', 'It actively rebuilds soil, water and life over time', 'It uses new technology', 'It is certified organic'], a: 1 },
    { q: 'You disagree with a technique taught in a module. Best move?', opts: ['Ignore the course', 'Trial it on a small patch and observe the results yourself', 'Assume the course is wrong', 'Give up'], a: 1 },
    { q: 'The point of the capstone land plan is to…', opts: ['Fill time', 'Apply everything to a real piece of land you can act on', 'Earn a badge', 'Re-watch the videos'], a: 1 }
  ]
};

const PATH_RATIONALES = [
  'You read soil confidently in your last assessment, so the AI skipped two soil modules and moved Water earlier — your terrain quiz showed water is your real bottleneck.',
  'Fresh re-sequence: Agroforestry now follows Water — your answers showed strong plant instincts but shaky earthworks vocabulary.',
  'The AI pulled Rainwater Harvesting into your path: three of your recent tutor questions were about summer drought, and it pairs with your current module.',
  'Capstone moved one step closer — your average score (94%) suggests you can compress the remaining design theory and start planning your own land.'
];


/* One goal, built only from what has actually been filmed. Four presets used to
   fan out across twenty courses that did not exist — a path whose every step
   after the first says "unlocks after assessment" for a lesson nobody shot is
   worse than a short, honest path. Add goals back as the library is produced. */
const GOAL_PRESETS = {
  'Land Team': ['land-team-journey', 'fire-truck-training', 'alignment-journey', 'ai-literacy']
};

const ROLE_OPTIONS = [
  /* Every role leads to the same filmed path for now. Offering a learner a
     choice between four goals that resolve to the same four lessons is a
     costume, not a choice — restore the branching when the library branches. */
  { key: 'land', label: 'Land & Farming', icon: 'sprout', goals: ['Land Team'] },
  { key: 'nature', label: 'Nature & Wellbeing', icon: 'leaf', goals: ['Land Team'] },
  { key: 'water', label: 'Water & Climate', icon: 'drop', goals: ['Land Team'] },
  { key: 'community', label: 'Community & Place', icon: 'people', goals: ['Land Team'] }
];

/* Gamification — growth-themed levels (nature) + subtle badges. Tuned to lift completion. */
const LEVELS = [
  { xp: 0, name: 'Seed' },
  { xp: 150, name: 'Seedling' },
  { xp: 400, name: 'Sprout' },
  { xp: 800, name: 'Sapling' },
  { xp: 1400, name: 'Young Tree' },
  { xp: 2200, name: 'Grove Keeper' },
  { xp: 3200, name: 'Elder Oak' }
];
const XP = { module: 20, quiz: 50, course: 100, cert: 50 };
const BADGES = [
  { id: 'first-steps', icon: 'sprout', title: 'First Steps', desc: 'Complete your first module' },
  { id: 'rooted', icon: 'tree', title: 'Rooted', desc: 'Finish your first course' },
  { id: 'quiz-ace', icon: 'compass', title: 'Quiz Ace', desc: 'Pass a checkpoint quiz' },
  { id: 'grove', icon: 'leaf', title: 'Grove Keeper', desc: 'Finish three courses' },
  { id: 'streak-7', icon: 'sun', title: 'Seven Suns', desc: 'Keep a 7-day streak' },
  { id: 'pathfinder', icon: 'mountain', title: 'Pathfinder', desc: 'Complete a full learning path' },
  { id: 'curious', icon: 'bird', title: 'Curious Mind', desc: 'Learn across three departments' },
  { id: 'certified', icon: 'flower', title: 'Certified', desc: 'Earn a course certificate' }
];

const DEFAULT_STATE = {
  onboarded: false,
  lang: 'en',
  xp: null,          /* seeded from progress on first boot */
  badges: [],
  streak: 0,
  bestStreak: 0,
  mins: {},          /* real minutes learned, by day */
  quizScores: [],
  role: null,
  assignments: [],
  notes: {},
  apiKey: '',
  aiModel: 'claude-opus-4-8',
  goal: 'Land Team',
  path: ['land-team-journey', 'fire-truck-training', 'alignment-journey', 'ai-literacy'],
  progress: {},      /* truth only — earned, never seeded */
  review: {},
  reminders: [],
  rationaleIdx: 0,
  quizzesPassed: 0,
  trainingLog: [],  /* append-only continuous-training hours ledger (40h compliance) */
  checkpoints: {}   /* in-video quick-checks answered, keyed courseId:mod — asked once per lesson */
};

/* ================= course invitation copy — hook headline + subheadline =================
   MasterClass-style invites: every course opens with a line that pulls you in. */
const chook = c => ((_lang() === 'pt' ? (COURSE_HOOKS_PT[c.id] || (c.pt && c.pt.hook && [c.pt.hook, c.pt.hookSub])) : (COURSE_HOOKS[c.id] || (c.hook && [c.hook, c.hookSub]))) || COURSE_HOOKS[c.id] || (c.hook && [c.hook, c.hookSub]) || [ctitle(c), ''])[0];
const chooksub = c => ((_lang() === 'pt' ? (COURSE_HOOKS_PT[c.id] || (c.pt && c.pt.hook && [c.pt.hook, c.pt.hookSub])) : (COURSE_HOOKS[c.id] || (c.hook && [c.hook, c.hookSub]))) || COURSE_HOOKS[c.id] || (c.hook && [c.hook, c.hookSub]) || ['', cdesc(c)])[1];

/* ================= per-course quizzes — real content first =================
   COURSE_QUIZ beats the generic category bank; grounded in the actual lessons. */

/* per-module takeaways — "what you take with you" (real content courses) */

/* ================= email nudge delivery (Google Apps Script webhook) =================
   Deploy apps-script/nudge-mailer.gs as a web app and paste its /exec URL below.
   Empty webhook = delivery off (UI degrades to "not connected" toasts).
   Sends are consent-gated client-side AND rate-capped server-side (1/person/week). */
const MAIL = {
  webhook: 'https://script.google.com/macros/s/AKfycbzb7uQRPEGwiPtUKeMA8ww1AbXqmK3dFUfd7xIWajFnGf2Tcocyfj44d-Rcb06gH428/exec',
  secret: '67763609855821fded169452'
};

/* ================= i18n — English / Português ================= */
const _lang = () => (typeof S !== 'undefined' && S.lang) || 'en';
const UI = {
  en: {
    cov_malformed:'Broken question',
    cov_h:'Does every video end with a question?', cov_module:'Module', cov_none:'No question', cov_ok:'Verified', cov_reel:'Short', cov_sub:'videos have a verified question', cov_unverified:'Unverified', rc_next:'Next', rc_not_quite:'Not quite.', rc_right:'That\u2019s it.', rc_skip:'Skip', reel_h:'Shorts', reel_keep_watching:'Keep watching', srv_local:'On this device only — sign in to keep a server copy', srv_ok:'Every event is mirrored to the server', srv_behind:'{m} of {t} events mirrored to the server', srv_blocked:'The server copy has been refused since {d} — your record is safe on this device and still exports, but it is not yet held independently. Your administrator can see this.', cov_loading:'Loading the question banks…', cov_how:'Every question was written from this module\u2019s own transcript, then answered blind by a second model against the same transcript. Agreement ships it; disagreement corrects it or discards it. Open a row to see the working.', cov_key:'Answer:', cov_said:'At that moment the trainer says:', cov_a_verified:'Both models agreed', cov_a_corrected:'Corrected by the audit', cov_a_unaudited:'Not audited', cov_prov:'Written by {m} from a {s} transcript', cov_no_trail:'audited before the working was recorded', cov_authored:'Written by a person', reel_read:'Read it', reel_hide:'Hide', reel_vlang:'Video is in {l} — this text is in your language', reel_beside:'In the lesson', graph_shorts:'Shorts', graph_related:'Also covered in', close:'Close', loading:'Loading…', reel_pending:'Pending review', reel_none:'No shorts in this library yet.', reel_open:'Open feed', reel_pause_eyebrow:'Take a breath', reel_pause_h:'That is five in a row.', reel_pause_sub:'Shorts are the hook. The hours, and what you can prove, live in the course.', reel_placeholder:'Placeholder — script coming', reel_save:'Save', reel_sound:'Sound',
    lang_fallback:'in English — Portuguese version coming',
    nav_home:'Home', nav_library:'Library', nav_paths:'Paths', nav_live:'Live', nav_progress:'Progress', nav_analytics:'Analytics', nav_admin:'Team', nav_me:'My learning', nav_settings:'Settings', nav_community:'Community',
    comm_title:'Community', comm_sub:'', comm_channels:'Community', comm_paths:'Learning paths', ch_intro:'Introductions', ch_general:'General', ch_wins:'Wins & harvests',
    comm_new:'Start a discussion', comm_title_ph:'Title — ask a question or start a topic', comm_body_ph:'Share your thoughts…', comm_msg_ph:'Write a message…', comm_post:'Post', comm_send:'Send', comm_reply:'Reply', comm_replies:'replies', comm_reply_one:'reply',
    comm_signin_post:'Sign in to join the conversation', comm_empty:'No posts here yet — be the first to start the conversation', comm_empty_replies:'No replies yet. Be the first.', comm_back:'Back', comm_posted:'Posted to the community', comm_just_now:'just now',
    comm_online:'Online now', comm_top:'Leader’s board', comm_newest:'New in the community', comm_next_live:'Next live session', comm_members:'Members', comm_all_members:'See all members →', comm_member_since:'here since', comm_add_poll:'+ Poll', comm_poll_opt:'Option', comm_poll_votes:'votes', comm_vote:'Vote', comm_no_members:'The community grows as the team signs in',
    comm_pinned:'Pinned', comm_official:'Official',
    cert_title:'Record of Training Completed', cert_awarded:'Awarded to', cert_for:'for completing', cert_dl:'Download record', cert_li:'Add to LinkedIn', certs_h:'Training records', certs_sub:'', cert_none:'Finish a course to receive your first training record.',
    asg_assigned:'Assigned to you', asg_due:'Due', asg_overdue:'Overdue', asg_start:'Start', dept_label:'Department', dept_none:'Choose your department', mod_locked:'Finish the previous module to unlock this one',
    mis_h:'Field Mission', mis_sub:'Take what you learned onto the land — photo proof earns real XP.', mis_note_ph:'What did you notice? What did you do?', mis_photo:'Add photo proof', mis_submit:'Submit for review', mis_pending:'Submitted — awaiting review', mis_approved:'Mission approved!', mis_claim:'Claim', mis_declined:'Not approved this time — read the brief again and resubmit.', mis_done:'Mission complete', mis_signin:'Sign in to take on field missions', mis_photo_fail:'That photo couldn’t be used — try a JPG or PNG, or a smaller image.',
    coach_h:'Practice arena', coach_sub:'A safe place to practice the hard conversation — with an AI playing the other side.', coach_goal:'Your goal', coach_start:'Start the conversation', coach_end:'End & get feedback', coach_again:'Practice again', coach_ph:'Your reply…', coach_score:'Your feedback', coach_thinking:'…', coach_err:'Connection hiccup — your last message wasn’t lost. Send it again, or check the AI key in Settings.',
    rate_h:'How was this course?', rate_thanks:'Thank you — this helps us grow the library.',
    res_h:'Resources', cal_add:'Add to calendar',
    mode_hint:'Hint', mode_coach:'Coach', mode_explain:'Explain', mode_practice:'Practice', mode_teach:'Teach the AI',
    mode_tip_hint:'One small nudge — you find the answer', mode_tip_coach:'Questions that make you think', mode_tip_explain:'Teaches the concept with examples', mode_tip_practice:'Gives you an exercise to try', mode_tip_teach:'You teach — the AI plays your apprentice',
    grounded_note:'Answers come only from your courses', trust_title:'AI & your data', trust_sub:'Exactly what the AI can see, and what it can\u2019t.',
    trust_sees:'The AI sees your course progress, goal and the course content — nothing else. No emails, no messages, no files.',
    trust_grounded:'Answers are grounded in the Academy\u2019s own courses. When something isn\u2019t covered, it says so instead of inventing.',
    trust_visible:'Your questions to the AI are visible to your company\u2019s training admins — that\u2019s how learning gets supported, and we\u2019d rather be transparent about it.',
    trust_thinking:'The tutor\u2019s Hint, Coach and Practice modes are designed to build your thinking, not replace it.',
    story_h:'My learning story', story_sub:'', story_btn:'Tell me where I am', story_refresh:'↺ Refresh',
    lesson_goal:'In this lesson', nudge_today_one:'You have 1 suggested action today', nudge_today:'You have {n} suggested actions today',
    trust_peek:'See exactly what the AI knows about me', trust_peek_note:'That’s the whole list — the AI sees nothing else about you.',
    knows_name:'Who you are', knows_goal:'Your goal', knows_path:'Your path', knows_open:'Course open now', knows_stats:'Your rhythm', knows_quizzes:'quizzes passed',
    flash_missed:'missed in a quiz', flash_missed_n:'missed questions queued — they come first',
    quiz_flag_tip:'Something wrong with this question? Flag it for review', quiz_flagged:'Flagged — your training admin will review this question. Thank you!',
    updated_lbl:'Updated', ask_by:'Answered by',
    vc_title:'Proven', vc_sub:'Finished, tested, still remembered a week later.', vc_ring:'verified',
    vc_of:'{v} of {d} completed courses verified', vc_how:'Pass the quiz, then answer again a week later.',
    vc_events:'records', vc_intact:'verified', vc_broken:'chain broken — contact your admin',
    pre_h:'Warm-up', pre_sub:'Two guesses. This never counts.', pre_skip:'Skip', pre_next:'Next', pre_done:'Warm-up done — your brain is primed',
    art4_btn:'AI Act Art.4 pack', art4_done:'AI-literacy evidence pack exported',
    intent_h:'Take it to the land', intent_sub:'What will you apply this week?', intent_ph:'e.g. Walk the swale line before watering', intent_save:'Commit', intent_saved:'Committed. We’ll check in with you in a week — good luck!',
    appcheck_h:'Application check-in', appcheck_sub:'Did it reach the work?', appcheck_day:'day {d}', appcheck_yes:'Applied it', appcheck_no:'Not yet',
    appcheck_bravo:'That’s the whole point of learning — recorded', appcheck_ok:'Honest answer recorded — we’ll ask again later',
    nudge_appcheck_t:'Did it reach the work?', nudge_appcheck_b:'Quick check-in on what you committed to after {c}',
    vc_applied:'{a} of {t} application check-ins: applied on the job',
    ev_export:'Download record', ev_export_done:'Evidence file exported — verifiable without us',
    mconf_h:'Confirm what reached the work', mconf_sub:'Confirm only what you saw.', mconf_yes:'I saw it', mconf_no:'Didn’t see it',
    mconf_done:'Confirmed — recorded on your manager record', mconf_noted:'Noted — recorded honestly',
    vc_confirmed:'{c} of {a} confirmed by a manager', vc_selfrep:'self-reported',
    vcert_btn:'Proven record', vcert_locked:'Not proven yet — finish, then answer again in a week.', hourlog_btn:'Hour log', cert_popup:'Allow pop-ups to open the record', ots_none:'', ots_pending:'Timestamp pending', ots_confirmed:'Timestamped publicly · block {b}',
    ck_h:'Quick check', ck_continue:'Continue watching', ck_right:'Spot on — keep going', ck_wrong:'Not quite — the right answer is highlighted. It will come back in your review deck.',
    gdpr_doc_done:'Document downloaded — open it and print to PDF', gdpr_retention:'Retention policy (PT)', gdpr_art30:'Record of processing — art. 30 (PT)', gdpr_dpa:'DPA template — art. 28 (PT)', edu_about:'About', edu_your:'Your educator', edu_more:'More from', edu_external:'external trainer', edu_teaches:'Teaches', edu_band_h:'Learn from your team', edu_avatar:'AI avatar', edu_avatar_note:'This lesson is presented by an AI avatar of the educator, with their consent. The words and the expertise are theirs.', course_one:'course', courses_n:'courses',
    cap_h:'What you can prove', cap_none:'Nothing proven yet — finish a module and it appears here.',
    cap_module:'module', cap_modules:'modules', cap_proven:'Proven', cap_today:'today',
    cap_lapsed:'Lapsed', cap_expires_in:'Expires in', cap_valid:'Valid',
    cap_gaps:'Your role also asks for', cap_no_course:'No course teaches this yet', cap_close_gap:'Start',
    cap_org_h:'Who can do what', cap_org_sub:'Derived from evidence — never self-rated. Thin cover first.',
    cap_org_none:'No capabilities proven across the team yet.',
    cap_who:'Who', cap_holder:'person', cap_holders:'people', cap_people:'people',
    cap_one_person:'Only one person', cap_nobody:'Nobody',
    attrib_refs:'Referenced in this lesson', edu_learn_more:'Learn more about them',
    qw_h:'Quick wins', qw_none:'No quick wins in this library yet.', qw_deeper:'Go deeper',
    qw_deeper_resume:'Continue the course', qw_deeper_done:'You completed', qw_opens_into:'Opens into',
    qw_no_deeper:'No course behind this one yet', qw_approved_of:'approved of',
    qw_drip:'Drip feed', qw_cadence:'How often', qw_channel:'Where', qw_at:'At',
    qw_c_off:'Paused', qw_c_daily:'Every day', qw_c_2d:'Every two days', qw_c_weekly:'Every week',
    qw_ch_email:'Group email', qw_ch_telegram:'Telegram group', qw_ch_whatsapp:'WhatsApp group',
    qw_wa_note:'WhatsApp needs a connected Business number — until then this schedule will not send.',
    qw_next_up:'Next up:', qw_send_now:'Send now', qw_nothing_queued:'Nothing queued — approve some below.',
    qw_to_review:'To review', qw_in_rotation:'In rotation',
    qw_yes:'That\u2019s us', qw_no:'Not our culture', qw_yes_done:'Added to the rotation', qw_sent:'Sent',
    howto_h:'Quick answers', howto_sub:'Reference clips — always here when you need a reminder. They don\u2019t count toward your 40 hours.', howto_no_path:'Reference clips don\u2019t join the training path — they\u2019re always one search away.',
    topics_h:'Browse by topic — straight from the lessons', pal_moments:'In the lessons',
    tr_loading:'Loading transcript…', tr_none:'No transcript for this lesson yet.', ask_moments:'From the lessons themselves', recall_recent:'Pick up where you asked', sw_update:'A new version is ready', sw_update_btn:'↻ Update now', mark_complete_short:'✓ Done', tutor_foot_gateway:'AI tutor · answers grounded in your courses · this is an AI, not a person', link_copy:'Copy link to this moment', link_copied:'Link copied — opens the video at this second', tag_at:'Said at', ask_speak:'Read the answer aloud', ask_no_moments:'Nothing in the lessons matches that yet — try other words, or ask the tutor.',
    mc_conf:'How sure are you?', mc_conf_sure:'Sure', mc_conf_guess:'Guessing', mc_result:'Your result', mc_correct_was:'Correct answer:', mc_moment:'Review the moment', mc_continue:'Continue', rev_h:'Review', rev_done:'Review done — it sticks better every round', rev_chip:'to review', checks_chip:'lesson(s) awaiting their check',
    mc_eyebrow:'Quick check', mc_sub:'Two questions on what you just watched. Answering is what records your training hours.', mc_note:'Answer both to record this lesson.', mc_submit:'Submit & record', mc_all_right:'Both right — hours recorded', mc_recorded:'Recorded — hours counted, answers kept', mc_ack_q:'Confirm you watched this lesson', mc_ack_label:'I watched this lesson and understood it.', mc_ack_note:'Your confirmation is part of the training record.', mc_pending:'lesson(s) awaiting their check — hours are not counted until you answer',
    ask_h:'Ask the Academy', ask_sub:'Any question about the land — answered from your team\u2019s own courses.', ask_ph:'e.g. How do I fill the water tank on the fire truck?', ask_go:'Ask', ask_refs:'Learn more in', ask_thinking:'Reading the library…', ask_fail:'Could not answer right now — try again.',
    skills_h:'Skills', skills_sub:'',
    comp_expired:'Certification expired', comp_expiring:'Expires soon', comp_renew:'Renew', nudge_recert_t:'Time to recertify', nudge_recert_b:'Your {course} certification {when} — a quick rewatch renews it.',
    jour_h:'Journeys', jour_sub:'Structured paths with milestones, field missions and a capstone.', jour_stage:'Stage', jour_mission_tag:'+ field mission', jour_capstone:'Capstone', jour_done:'Journey complete', jour_cert:'Journey record', jour_progress:'complete', jour_start:'Begin the journey', jour_continue:'Continue the journey',
    flash_h:'Review deck', flash_sub:'Five quick cards from what you\u2019ve learned — keep it fresh.', flash_flip:'Tap to flip', flash_next:'Next', flash_got:'Got it', flash_done:'Deck done — see you tomorrow', flash_empty:'Finish a course to build your review deck.', flash_open:'Review 5 cards',
    board_all:'All time', board_week:'This week', board_dept:'My department', live_attended:'Attendance counted — enjoy the session!',
    tour_welcome_t:'Welcome to EdenRise Academy', tour_welcome_b:'A two-minute walk through your new learning home. You can leave anytime.', tour_path_t:'Your path', tour_path_b:'The AI plans a course sequence toward your goal — start here, and it adapts as you learn.', tour_ask_t:'Ask the Academy', tour_ask_b:'Any question about the land — answered from our own courses, with links to the exact lesson.', tour_comm_t:'Community', tour_comm_b:'Questions, wins and polls with the whole team — organised by learning path.', tour_prog_t:'Your progress', tour_prog_b:'XP, streaks, skills, training records and field missions — everything you\u2019ve earned lives here.', tour_bell_t:'Gentle nudges', tour_bell_b:'Encouraging reminders, never spam — and you control every channel in your profile.', tour_done_t:'That\u2019s the tour', tour_done_b:'Enjoy the academy — and remember: what you learn here is meant for the land.', tour_next:'Next', tour_back:'Back', tour_skip:'Skip tour', tour_finish:'Begin', tour_replay:'Take the tour',
    comp_h:'Training compliance', comp_sub:'40h a year · art. 131.º', comp_target:'Annual target', comp_done:'Completed', comp_left:'remaining', comp_ontrack:'On track', comp_behind:'Behind pace', comp_pace_by:'By now, aim for', comp_log:'Credited sessions', comp_none:'No hours credited yet — complete a lesson to begin.', comp_nif_prompt:'Add your NIF and contract details in your profile to activate the legal training record.', comp_confirmed:'Attendance confirmed', comp_h_unit:'h', comp_cert_btn:'Training record', comp_reg_btn:'Attendance register', comp_cert_dl:'Record downloaded', comp_reg_dl:'Register exported (CSV)', ru_annex_btn:'Relatório Único export',
    prof_nif:'Tax number (NIF)', prof_empno:'Employee no.', prof_contract:'Contract type', prof_fte:'Working time', prof_hire:'Start date',
    contract_permanent:'Permanent', contract_fixed:'Fixed-term', contract_part:'Part-time', fte_full:'Full-time', fte_half:'Part-time (50%)', ck_40h:'40h',
    ready_h:'Role readiness', ready_sub:'', ready_gap:'Biggest gap', ready_rec:'Recommended for this gap', ready_of:'of target', ready_none:'Pick a role on your profile to see your readiness.',
    ask_more:'Ask the Academy: ', dig_h:'This week at EdenRise', dig_sub:'Two minutes per department — stay connected to the whole.', pwa_t:'Take the academy with you', pwa_b:'Add EdenRise to your home screen — one tap from anywhere, even offline.', pwa_btn:'Install', pwa_ios:'On iPhone: tap Share, then \u201cAdd to Home Screen\u201d.', comm_pin:'Pin', comm_unpin:'Unpin', comm_delete:'Delete', comm_confirm_del:'Delete this post for everyone?', comm_confirm_del_reply:'Delete this reply?', comm_deleted:'Deleted', comm_privacy:'Your progress is stored in your EdenRise account (Firestore, EU) and only you — and EdenRise admins — can see it. Turn nudges on or off anytime in your profile.',
    take_title:'What you take with you', take_sub:'Three things worth keeping from this module.', take_continue:'Keep going →', take_done:'Finish course',
    match_goal:'For your goal', missing_ask:'Not seeing what you need? →', missing_prompt:'Tell me what you’re looking for — a topic, a problem on the land, a skill — and I’ll find it or flag it for the EdenRise team to add. Your path only gets smarter when you push back on it.',
    assigned_tag:'Assigned', chosen_tag:'Your pick',
    voice_label:'Voice', voice_listening:'Listening…', voice_hint:'Say it naturally — “I’m looking for something about soil”', voice_unsupported:'Voice search needs Safari or Chrome', voice_search:'Voice search',
    quiz_q:'Question', quiz_of:'of', quiz_ai_building:'Claude is writing fresh questions from this course…', quiz_ai_tag:'AI-generated from this course', take_quiz:'Take the quiz 🎯',
    nudge_refresh_t:'A 2-minute refresher', nudge_refresh_b:'“{course}” was {n} days ago — one look keeps it rooted',
    offline_note:'Offline — your progress is safe on this device and will sync when you’re back', online_note:'Back online — progress synced',
    stats_today:'today', stats_best:'best', stats_quizzes:'quizzes taken', board_grow:'The board grows as the team joins — invite someone', no_data:'—',
    daily_title:'Today’s question', daily_sub:'Thirty seconds to keep it rooted', daily_from:'from', daily_correct:'Rooted! +10 XP', daily_wrong:'Good try — now it’ll stick.', daily_tomorrow:'Come back tomorrow for the next one', daily_streak:'day streak',
    gdpr_title:'Privacy & your data', gdpr_sub:'Export or erase, anytime.', gdpr_export:'Download my data', gdpr_exported:'Your data file is downloading', gdpr_delete:'Delete my account', gdpr_delete_warn:'This permanently erases your account, progress, XP and badges for everyone. Type DELETE to confirm.', gdpr_deleted:'Account deleted. Be well', gdpr_recent_login:'For safety, sign in again first — then delete works.', gdpr_guest_note:'Guest data lives only on this device — deleting clears it here.',
    orgkey_title:'Team AI key', orgkey_sub:'One key for the whole team — every signed-in member gets the tutor, AI quizzes and the Studio automatically. Personal keys (tutor settings) override it.', orgkey_saved:'Team AI key saved — live for everyone signed in',
    studio_title:'AI Course Studio', studio_sub:'Paste a transcript or lesson notes, add the video link — the AI writes the whole bilingual course: modules, invitation, takeaways and quiz. You approve before it goes live.', studio_gen:'Write the course ✦', studio_generating:'Writing the course — modules, takeaways, quiz, both languages…', studio_need_key:'Connect a Claude key first (✦ orb → ⚙ settings) — the Studio writes with your key.', studio_publish:'Publish to Library', studio_draft:'Draft — review before publishing', studio_published:'Published — it’s in everyone’s Library now', studio_video_ph:'Vimeo or YouTube link (optional)', studio_text_ph:'Paste the transcript, notes, or a rich description of the lesson…', studio_title_ph:'Working title (optional)', studio_discard:'Discard', studio_custom:'Published by your team', studio_delete_confirm:'Remove this course for everyone?', studio_failed:'Couldn’t generate — try again (check your key/credits)',
    nudge_bell:'Nudges', nudge_empty:'All caught up Nothing needs you right now.', nudge_board_t:"Someone's gaining on you", nudge_board_b:'{name} is {xp} XP ahead — finish one lesson to catch up', nudge_top_t:"You're leading", nudge_top_b:'Top of the board this week. One lesson keeps you there.',
    nudge_level_t:'Almost a new level', nudge_level_b:'Just {xp} XP from {lvl} — a quiz gets you there.', nudge_streak_t:'{n}-day streak 🔥', nudge_streak_b:'Do one lesson today to keep it alive.', nudge_lesson_t:'Pick up where you left off', nudge_lesson_b:'“{mod}” in {course} is waiting.', nudge_badge_t:'One course from a badge', nudge_badge_b:'Finish one more course to unlock Grove Keeper', nudge_welcome:'Welcome back, {name}',
    notif_title:'Notifications', notif_sub:'Change anytime.', notif_browser:'Browser notifications', notif_browser_d:'Gentle desktop reminders — works right away.', notif_email:'Email', notif_email_d:'A weekly nudge to your inbox.', notif_whatsapp:'WhatsApp', notif_whatsapp_d:'Streak & leaderboard pings on WhatsApp.', notif_phone_ph:'WhatsApp number (+351…)', notif_soon:'ready once delivery is connected', notif_on:'Notifications on', notif_blocked:'Your browser blocked notifications — enable them in site settings.',
    mail_not_connected:'Email delivery isn’t connected yet — deploy the mailer first', mail_sent:'Encouragement sent', mail_rate_limited:'Already nudged this week — we keep it gentle', mail_no_email:'No email on this account', mail_not_opted:'hasn’t opted into email nudges — consent first', mail_optin_sent:'Welcome email sent — check your inbox 📬', mail_failed:'Couldn’t send — try again in a moment',
    search_ph:'Search courses, the land…', org:'EdenRise · Academy',
    featured_eyebrow:'For you', match:'match', modules:'modules', certified:'CERTIFIED', featured_h:'Featured', featured_sub:'Essential programs, front and centre',
    all_levels:'All levels', Beginner:'Beginner', Intermediate:'Intermediate', Advanced:'Advanced', 'All levels':'All levels',
    resume_module:'Resume Module', course_details:'Details', start_learning:'Start learning', start_course:'Start course', rewatch:'Rewatch',
    ai_overview:'Overview', my_path:'+ My Path', in_my_path:'✓ In My Path', complete:'complete', est:'est.', left:'left',
    your_ai_path:'Your path', completed:'Completed', scored:'scored', modules_skipped:'modules you already know',
    in_progress:'In progress', adapted_today:'adapted today', unlocks_after:'Unlocks after assessment', next_up:'Next up', locked:'Locked',
    continue_learning:'Continue learning', synced_devices:'Synced across your devices', assigned_you:'Assigned to you', from_stewardship:'From EdenRise · Stewardship',
    trending:'Trending at EdenRise', community_learning:'What the EdenRise community is learning', because_completed:'Because you completed', ai_recommendations:'AI recommendations', see_all:'See all →',
    generated_by_ai:'Updated 2h ago', your_path_to:'Your path to', path_intro:'Built from your role, your last 6 assessments, and the skills gap analysis your manager shared. It reshapes itself every time you learn.', regenerate_path:'Regenerate path ↺', why_order:'Why this order?',
    learning_streak:'Learning streak', personal_best:'▲ Personal best', this_week:'This week', vs_last_week:'▲ 38% vs last week', skills_verified:'Skills verified', from_quizzes:'from quizzes', avg_score:'Avg. assessment score', top_5:'— Top 5% at EdenRise',
    ai_path_chip:'AI PATH', required:'REQUIRED', team_goal:'TEAM GOAL', new:'NEW', module:'MODULE', this_week_rank:'THIS WEEK', cert_issued:'cert issued', due:'Due',
    library_title:'Library', courses_tended:'courses', filter_library:'Filter the library…', all:'All', nothing_matches:'Nothing matches — try another filter or ask the AI tutor to find it.',
    in_ai_rotation:'Recommended', learners:'learners', quiz_me:'Quiz me', modules_h:'Modules', tap_module:'', coming_soon:'Coming soon', more_in:'More in', related_courses:'Related courses',
    ask_tutor:'Ask the tutor', notes_transcript:'Notes & transcript', mark_complete:'✓ Mark module complete', soon_sub:"This lesson is being filmed for the Land Team Journey — we'll let you know the moment it's ready.", play_lesson:'▶ Play lesson',
    live_title:'Live', live_sub:'Live with real people. Replays next day.', watching:'watching', join_now:'Join now', remind_me:'Remind me',
    my_progress:'My Progress', progress_sub:'',
    level_ab:'Lv', xp:'XP', xp_to:'XP to', highest_level:'Highest level — Elder Oak', board_rank:'Leaderboard rank', of:'of', badges_earned:'Badges earned', nice_work:'', earn_first:'Earn your first', courses_finished:'Courses finished',
    badges_h:'Badges', badges_sub:'', locked_dot:'Locked ·', leaders_board:'Leaderboard · this week', board_sub:'Resets Monday.', keep_alive:'',
    you:'you', xp_ahead_1:'is just', xp_ahead_2:'ahead — about {n} lessons', top_board:"You're top of the board this week. Keep the grove growing.", path_points:'',
    ob_welcome:'Welcome to EdenRise', ob_step:'Step', ob_hi:'Welcome,', ob_pick_handle:"Pick a username — it's how others see you in the community.", ob_role_q:'And what do you do?', ob_q1:'What do you do?', ob_q1_sub:'The AI uses your role to seed your first learning path. You can change everything later.', ob_skip:'Skip — explore on my own', ob_continue:'Continue →',
    ob_destination:'Your destination', ob_q2:'Pick a goal to work toward', ob_q2_sub:'The AI sequences courses toward this goal and re-plans as you prove skills.', ob_build:'Build my path ✦', ob_building:'Building your path to', courses_adaptive:'courses · adaptive', track_more:'track',
    ai_hello:'How can I help you today?', how_answers:'How it answers',
    tutor_foot_live:'AI · answers can be wrong · grounded in your courses',
    tutor_foot_demo:'Demo · scripted replies · grounded in your courses',
    pal_courses:'Courses', pal_recent:'Recent',
    team_load_fail:"We couldn't load your team just now.", retry:'Retry',
    sim_no_credit:"Preview only — this doesn't count toward your training record. Mark it complete once you've watched it.",
    watch_more:'Watch the lesson through to record it.',
    no_access_h:"You don't have access to the team dashboard", no_access_b:'This dashboard is for team leads. If you should have access, ask your company administrator to add you.', back_home:'Back to home', analytics_sub:'Your progress, measured.',
    ob_need_role:'Pick what you do to continue.', ob_need_goal:'Pick a goal to continue.',
    paths_h:'Learning paths', paths_sub:'A sequence toward one goal. Finish a step and the rest re-plans around what you proved you know.',
    active_path:'Active path', courses_in_path:'Courses in this path', in_order:'In order', next_paths:'Suggested next', next_paths_sub:'Based on your goal',
    your_path:'Your path',
    me_h:'My learning', me_progress:'Progress', me_record:'Record', me_activity:'Activity',
    me_paths_sub:'Sequences toward a goal', me_comm_sub:'Questions, answers, your team', me_live_sub:'Sessions and replays',
    nav_live:'Live',
    tutor_name:'EdenRise AI Tutor', tutor_ai_note:'AI assistant — answers can be wrong; verify what matters.', tutor_demo:'● Demo mode · scripted replies', summarize_course:'Summarize', quiz_now:'Quiz me', whats_due:"What's due?", build_path:'Build a path', ask_anything:'Ask anything about your land or courses…',
    connect_ai:'Connect real AI', api_note:"Paste an Anthropic API key to power the tutor with Claude. The key is stored only in this browser's localStorage and sent only to api.anthropic.com.", save:'Save', use_demo:'Use demo mode',
    footer_tag:'· The learning academy of EdenRise',
    prof_title:'Profile', prof_sub:'', prof_edit:'Edit profile', prof_name:'Full name', prof_username:'Username', prof_role:'What you do', prof_goal:'Your learning goal', prof_save:'Save changes', prof_saved:'Profile saved', prof_via:'via', prof_signout:'Sign out', prof_guest:"You're exploring as a guest. Sign in to save your profile and progress to the cloud.", prof_signin:'Sign in',
    auth_welcome:'Welcome to EdenRise Academy', auth_sub:'Sign in to save your progress across every device.', auth_google:'Continue with Google', auth_or:'or', auth_email:'Email', auth_password:'Password', auth_name:'Your name',
    auth_signin:'Sign in', auth_signup:'Create account', auth_to_signup:'New here? Create an account', auth_to_signin:'Already have an account? Sign in', auth_guest:'Continue as guest',
    auth_consent:'I agree to EdenRise storing my learning progress to sync it across my devices (GDPR).', auth_consent_req:'Please accept the privacy notice to continue.', auth_working:'One moment…', auth_signout:'Sign out', auth_signed_as:'Signed in as',
    auth_forgot:'Forgot password?', auth_reset_sent:'Reset link sent — check your inbox', auth_reset_need_email:'Type your email above first, then tap "Forgot password?" again.', auth_verify_sent:'Welcome! We sent a verification link to your email'
  },
  pt: {
    cov_malformed:'Pergunta inválida',
    cov_h:'Todos os vídeos terminam com uma pergunta?', cov_module:'Módulo', cov_none:'Sem pergunta', cov_ok:'Verificada', cov_reel:'Short', cov_sub:'vídeos com pergunta verificada', cov_unverified:'Não verificada', rc_next:'Seguinte', rc_not_quite:'Não é bem.', rc_right:'É isso.', rc_skip:'Saltar', reel_h:'Shorts', reel_keep_watching:'Continuar a ver', srv_local:'Apenas neste dispositivo — inicie sessão para guardar uma cópia no servidor', srv_ok:'Todos os eventos estão espelhados no servidor', srv_behind:'{m} de {t} eventos espelhados no servidor', srv_blocked:'A cópia no servidor está a ser recusada desde {d} — o seu registo está seguro neste dispositivo e continua a exportar, mas ainda não está guardado de forma independente. O seu administrador consegue ver isto.', cov_loading:'A carregar os bancos de perguntas…', cov_how:'Cada pergunta foi escrita a partir da transcrição do próprio módulo e depois respondida às cegas por um segundo modelo, contra a mesma transcrição. Se concordarem, avança; se não, é corrigida ou descartada. Abra uma linha para ver o processo.', cov_key:'Resposta:', cov_said:'Nesse momento o formador diz:', cov_a_verified:'Os dois modelos concordaram', cov_a_corrected:'Corrigida pela auditoria', cov_a_unaudited:'Não auditada', cov_prov:'Escrita por {m} a partir de uma transcrição {s}', cov_no_trail:'auditada antes de o processo ser registado', cov_authored:'Escrita por uma pessoa', reel_read:'Ler', reel_hide:'Fechar', reel_vlang:'O vídeo está em {l} — este texto está na sua língua', reel_beside:'Na lição', graph_shorts:'Shorts', graph_related:'Também em', close:'Fechar', loading:'A carregar…', reel_pending:'Por revisão', reel_none:'Ainda não há shorts nesta biblioteca.', reel_open:'Abrir feed', reel_pause_eyebrow:'Respire', reel_pause_h:'São cinco seguidos.', reel_pause_sub:'Os shorts são o engate. As horas, e o que consegue provar, estão no curso.', reel_placeholder:'Marcador — guião a caminho', reel_save:'Guardar', reel_sound:'Som',
    lang_fallback:'em inglês — versão portuguesa a caminho',
    nav_home:'Início', nav_library:'Biblioteca', nav_paths:'Percursos', nav_live:'Ao Vivo', nav_progress:'Progresso', nav_analytics:'Análises', nav_admin:'Equipa', nav_me:'A minha aprendizagem', nav_settings:'Definições', nav_community:'Comunidade',
    comm_title:'Comunidade', comm_sub:'', comm_channels:'Comunidade', comm_paths:'Percursos', ch_intro:'Apresentações', ch_general:'Geral', ch_wins:'Conquistas',
    comm_new:'Iniciar uma discussão', comm_title_ph:'Título — faça uma pergunta ou inicie um tema', comm_body_ph:'Partilhe as suas ideias…', comm_msg_ph:'Escreva uma mensagem…', comm_post:'Publicar', comm_send:'Enviar', comm_reply:'Responder', comm_replies:'respostas', comm_reply_one:'resposta',
    comm_signin_post:'Entre para participar na conversa', comm_empty:'Ainda sem publicações — seja o primeiro a começar a conversa', comm_empty_replies:'Ainda sem respostas. Seja o primeiro.', comm_back:'Voltar', comm_posted:'Publicado na comunidade', comm_just_now:'agora',
    comm_online:'Online agora', comm_top:'Ranking', comm_newest:'Novos na comunidade', comm_next_live:'Próxima sessão ao vivo', comm_members:'Membros', comm_all_members:'Ver todos os membros →', comm_member_since:'aqui desde', comm_add_poll:'+ Sondagem', comm_poll_opt:'Opção', comm_poll_votes:'votos', comm_vote:'Votar', comm_no_members:'A comunidade cresce à medida que a equipa entra',
    comm_pinned:'Fixado', comm_official:'Oficial',
    cert_title:'Documento Comprovativo de Formação', cert_awarded:'Atribuído a', cert_for:'pela conclusão de', cert_dl:'Transferir documento', cert_li:'Adicionar ao LinkedIn', certs_h:'Documentos comprovativos', certs_sub:'', cert_none:'Termine um curso para receber o seu primeiro documento comprovativo.',
    asg_assigned:'Atribuído a si', asg_due:'Prazo', asg_overdue:'Em atraso', asg_start:'Começar', dept_label:'Departamento', dept_none:'Escolha o seu departamento', mod_locked:'Termine o módulo anterior para desbloquear este',
    mis_h:'Missão de Campo', mis_sub:'Leve o que aprendeu para o terreno — a prova fotográfica vale XP real.', mis_note_ph:'O que reparou? O que fez?', mis_photo:'Adicionar foto', mis_submit:'Submeter para revisão', mis_pending:'Submetido — em revisão', mis_approved:'Missão aprovada!', mis_claim:'Reclamar', mis_declined:'Não aprovada desta vez — releia o guião e volte a submeter.', mis_done:'Missão concluída', mis_signin:'Inicie sessão para aceitar missões de campo', mis_photo_fail:'Não foi possível usar essa foto — tente um JPG ou PNG, ou uma imagem mais pequena.',
    coach_h:'Arena de prática', coach_sub:'Um lugar seguro para praticar a conversa difícil — com uma IA do outro lado.', coach_goal:'O seu objetivo', coach_start:'Começar a conversa', coach_end:'Terminar e receber feedback', coach_again:'Praticar de novo', coach_ph:'A sua resposta…', coach_score:'O seu feedback', coach_thinking:'…', coach_err:'Falha de ligação — a sua mensagem não se perdeu. Envie de novo, ou verifique a chave de IA nas Definições.',
    rate_h:'Como foi este curso?', rate_thanks:'Obrigado — isto ajuda-nos a fazer crescer a biblioteca.',
    res_h:'Recursos', cal_add:'Adicionar ao calendário',
    mode_hint:'Pista', mode_coach:'Coach', mode_explain:'Explicar', mode_practice:'Praticar', mode_teach:'Ensinar a IA',
    mode_tip_hint:'Um pequeno empurrão — a resposta é sua', mode_tip_coach:'Perguntas que fazem pensar', mode_tip_explain:'Ensina o conceito com exemplos', mode_tip_practice:'Dá-lhe um exercício para tentar', mode_tip_teach:'Você ensina — a IA é o seu aprendiz',
    grounded_note:'As respostas vêm apenas dos seus cursos', trust_title:'IA e os seus dados', trust_sub:'Exatamente o que a IA vê — e o que não vê.',
    trust_sees:'A IA vê o seu progresso nos cursos, o seu objetivo e o conteúdo dos cursos — nada mais. Sem emails, sem mensagens, sem ficheiros.',
    trust_grounded:'As respostas baseiam-se nos cursos da própria Academia. Quando algo não está coberto, di-lo em vez de inventar.',
    trust_visible:'As suas perguntas à IA são visíveis para os administradores de formação da sua empresa — é assim que a aprendizagem é apoiada, e preferimos ser transparentes.',
    trust_thinking:'Os modos Pista, Coach e Praticar do tutor foram desenhados para desenvolver o seu raciocínio, não para o substituir.',
    story_h:'A minha história de aprendizagem', story_sub:'', story_btn:'Diz-me onde estou', story_refresh:'↺ Atualizar',
    trust_peek:'Ver exatamente o que a IA sabe sobre mim', trust_peek_note:'É esta a lista completa — a IA não vê mais nada sobre si.',
    knows_name:'Quem é', knows_goal:'O seu objetivo', knows_path:'O seu percurso', knows_open:'Curso aberto agora', knows_stats:'O seu ritmo', knows_quizzes:'quizzes passados',
    flash_missed:'falhada num quiz', flash_missed_n:'perguntas falhadas em fila — vêm primeiro',
    quiz_flag_tip:'Algo errado nesta pergunta? Assinale para revisão', quiz_flagged:'Assinalada — o admin de formação vai rever esta pergunta. Obrigado!',
    updated_lbl:'Atualizado', ask_by:'Respondido por',
    vc_title:'Comprovado', vc_sub:'Concluído, testado, e ainda sabido uma semana depois.', vc_ring:'verificado',
    vc_of:'{v} de {d} cursos concluídos verificados', vc_how:'Para verificar um curso: passe o quiz de cenários da IA e responda a uma pergunta de memória (pergunta diária ou novo quiz) 7+ dias após terminar.',
    vc_events:'registos', vc_intact:'cadeia íntegra ✓', vc_broken:'cadeia quebrada — contacte o seu admin',
    pre_h:'Aquecimento', pre_sub:'Dois palpites rápidos antes de começar — errar é bem-vindo, prepara a memória. Nunca afeta a sua nota.', pre_skip:'Saltar', pre_next:'Seguinte', pre_done:'Aquecimento feito — memória preparada',
    art4_btn:'Pacote Art.4 IA', art4_done:'Pacote de evidência de literacia de IA exportado',
    intent_h:'Levar para a terra', intent_sub:'Um pequeno compromisso torna 3× mais provável que a aprendizagem chegue ao trabalho real. O que vai aplicar esta semana?', intent_ph:'ex.: Percorrer a vala antes de regar', intent_save:'Comprometo-me', intent_saved:'Registado. Voltamos a perguntar daqui a uma semana — boa sorte!',
    appcheck_h:'Verificação de aplicação', appcheck_sub:'Comprometeu-se a aplicar o que aprendeu. Chegou ao trabalho?', appcheck_day:'dia {d}', appcheck_yes:'Apliquei', appcheck_no:'Ainda não',
    appcheck_bravo:'É esse o objetivo de aprender — registado', appcheck_ok:'Resposta honesta registada — voltamos a perguntar',
    nudge_appcheck_t:'Chegou ao trabalho?', nudge_appcheck_b:'Verificação rápida do compromisso após {c}',
    vc_applied:'{a} de {t} verificações de aplicação: aplicado no trabalho',
    ev_export:'Descarregar registo', ev_export_done:'Ficheiro de evidência exportado — verificável sem nós',
    mconf_h:'Confirmar o que chegou ao trabalho', mconf_sub:'A sua equipa diz que aplicou o que aprendeu. Confirmar transforma uma auto-declaração em evidência — confirme apenas o que viu mesmo.', mconf_yes:'Vi acontecer', mconf_no:'Não vi',
    mconf_done:'Confirmado — registado no seu registo de chefia', mconf_noted:'Registado com honestidade',
    vc_confirmed:'{c} de {a} confirmados por uma chefia', vc_selfrep:'auto-declarado',
    vcert_btn:'Documento comprovado', vcert_locked:'O documento comprovado desbloqueia com: conclusão + exercício aplicado + verificação de retenção diferida', hourlog_btn:'Registo de horas', cert_popup:'Permita pop-ups para abrir o documento', ots_none:'', ots_pending:'Selo temporal pendente', ots_confirmed:'Com selo temporal público · bloco {b}',
    ck_h:'Verificação rápida', ck_continue:'Continuar a ver', ck_right:'Em cheio — continue', ck_wrong:'Quase — a resposta certa está destacada. Vai voltar no seu baralho de revisão.',
    gdpr_doc_done:'Documento descarregado — abra e imprima para PDF', gdpr_retention:'Política de retenção', gdpr_art30:'Registo de tratamento — art. 30.º', gdpr_dpa:'Minuta DPA — art. 28.º',
    lesson_goal:'Nesta lição', nudge_today_one:'Tem 1 ação sugerida hoje', nudge_today:'Tem {n} ações sugeridas hoje', edu_about:'Sobre', edu_your:'O seu formador', edu_more:'Mais de', edu_external:'formador externo', edu_teaches:'Ensina', edu_band_h:'Aprenda com a sua equipa', edu_avatar:'avatar IA', edu_avatar_note:'Esta lição é apresentada por um avatar de IA do formador, com o seu consentimento. As palavras e o saber são dele.', course_one:'curso', courses_n:'cursos',
    cap_h:'O que consegue provar', cap_none:'Ainda nada provado — conclua um módulo e aparece aqui.',
    cap_module:'módulo', cap_modules:'módulos', cap_proven:'Provado', cap_today:'hoje',
    cap_lapsed:'Caducado', cap_expires_in:'Caduca em', cap_valid:'Válido',
    cap_gaps:'A sua função pede também', cap_no_course:'Ainda não há curso que ensine isto', cap_close_gap:'Começar',
    cap_org_h:'Quem sabe fazer o quê', cap_org_sub:'Derivado de evidência — nunca autoavaliado. Cobertura fraca primeiro.',
    cap_org_none:'Ainda sem competências provadas na equipa.',
    cap_who:'Quem', cap_holder:'pessoa', cap_holders:'pessoas', cap_people:'pessoas',
    cap_one_person:'Só uma pessoa', cap_nobody:'Ninguém',
    attrib_refs:'Referências desta lição', edu_learn_more:'Saber mais',
    qw_h:'Ganhos rápidos', qw_none:'Ainda não há ganhos rápidos nesta biblioteca.', qw_deeper:'Aprofundar',
    qw_deeper_resume:'Continuar o curso', qw_deeper_done:'Já concluiu', qw_opens_into:'Liga a',
    qw_no_deeper:'Ainda sem curso associado', qw_approved_of:'aprovados de',
    qw_drip:'Envio gradual', qw_cadence:'Frequência', qw_channel:'Onde', qw_at:'Às',
    qw_c_off:'Em pausa', qw_c_daily:'Todos os dias', qw_c_2d:'De dois em dois dias', qw_c_weekly:'Todas as semanas',
    qw_ch_email:'E-mail de grupo', qw_ch_telegram:'Grupo de Telegram', qw_ch_whatsapp:'Grupo de WhatsApp',
    qw_wa_note:'O WhatsApp exige um número Business ligado — até lá este agendamento não envia.',
    qw_next_up:'A seguir:', qw_send_now:'Enviar agora', qw_nothing_queued:'Nada em fila — aprove alguns abaixo.',
    qw_to_review:'Para rever', qw_in_rotation:'Em rotação',
    qw_yes:'Isto é a nossa cara', qw_no:'Não é a nossa cultura', qw_yes_done:'Adicionado à rotação', qw_sent:'Enviado',
    howto_h:'Respostas rápidas', howto_sub:'Clipes de referência — sempre aqui quando precisar de relembrar. Não contam para as suas 40 horas.', howto_no_path:'Clipes de referência não entram no percurso de formação — estão sempre à distância de uma pesquisa.',
    topics_h:'Explorar por tema — direto das lições', pal_moments:'Nas lições',
    tr_loading:'A carregar a transcrição…', tr_none:'Ainda não há transcrição para esta lição.', ask_moments:'Das próprias lições', recall_recent:'Retomar o que perguntou', sw_update:'Há uma nova versão pronta', sw_update_btn:'↻ Atualizar agora', mark_complete_short:'✓ Feito', tutor_foot_gateway:'Tutor de IA · respostas baseadas nos seus cursos · é uma IA, não uma pessoa', link_copy:'Copiar ligação para este momento', link_copied:'Ligação copiada — abre o vídeo neste segundo', tag_at:'Dito aos', ask_speak:'Ler a resposta em voz alta', ask_no_moments:'Nada nas lições corresponde a isso — tente outras palavras, ou pergunte ao tutor.',
    mc_conf:'Que certeza tem?', mc_conf_sure:'Tenho a certeza', mc_conf_guess:'A adivinhar', mc_result:'O seu resultado', mc_correct_was:'Resposta certa:', mc_moment:'Rever o momento', mc_continue:'Continuar', rev_h:'Revisão', rev_done:'Revisão feita — fica mais sólido a cada volta', rev_chip:'para rever', checks_chip:'lição(ões) por verificar',
    mc_eyebrow:'Verificação rápida', mc_sub:'Duas perguntas sobre o que acabou de ver. É a resposta que regista as suas horas de formação.', mc_note:'Responda às duas para registar esta lição.', mc_submit:'Submeter e registar', mc_all_right:'Ambas certas — horas registadas', mc_recorded:'Registado — horas contadas, respostas guardadas', mc_ack_q:'Confirme que viu esta lição', mc_ack_label:'Vi esta lição e compreendi-a.', mc_ack_note:'A sua confirmação faz parte do registo de formação.', mc_pending:'lição(ões) por verificar — as horas só contam depois de responder',
    ask_h:'Pergunte à Academia', ask_sub:'Qualquer pergunta sobre a terra — respondida a partir dos cursos da equipa.', ask_ph:'ex.: Como encho o tanque de água do camião?', ask_go:'Perguntar', ask_refs:'Aprenda mais em', ask_thinking:'A ler a biblioteca…', ask_fail:'Não foi possível responder — tente de novo.',
    skills_h:'Competências', skills_sub:'',
    comp_expired:'Certificação expirada', comp_expiring:'Expira em breve', comp_renew:'Renovar', nudge_recert_t:'Hora de recertificar', nudge_recert_b:'A sua certificação de {course} {when} — uma revisão rápida renova-a.',
    jour_h:'Jornadas', jour_sub:'Percursos estruturados com marcos, missões de campo e um projeto final.', jour_stage:'Etapa', jour_mission_tag:'+ missão de campo', jour_capstone:'Projeto final', jour_done:'Jornada concluída', jour_cert:'Documento da jornada', jour_progress:'concluída', jour_start:'Começar a jornada', jour_continue:'Continuar a jornada',
    flash_h:'Baralho de revisão', flash_sub:'Cinco cartas rápidas do que aprendeu — mantenha fresco.', flash_flip:'Toque para virar', flash_next:'Seguinte', flash_got:'Já sei', flash_done:'Baralho feito — até amanhã', flash_empty:'Termine um curso para criar o seu baralho.', flash_open:'Rever 5 cartas',
    board_all:'Sempre', board_week:'Esta semana', board_dept:'O meu departamento', live_attended:'Presença registada — boa sessão!',
    tour_welcome_t:'Bem-vindo à EdenRise Academy', tour_welcome_b:'Uma volta de dois minutos pela sua nova casa de aprendizagem. Pode sair quando quiser.', tour_path_t:'O seu percurso', tour_path_b:'A IA planeia uma sequência de cursos para o seu objetivo — comece aqui, e ela adapta-se.', tour_ask_t:'Pergunte à Academia', tour_ask_b:'Qualquer pergunta sobre a terra — respondida a partir dos nossos cursos, com links para a lição exata.', tour_comm_t:'Comunidade', tour_comm_b:'Perguntas, vitórias e sondagens com toda a equipa — organizadas por percurso.', tour_prog_t:'O seu progresso', tour_prog_b:'XP, sequências, competências, documentos comprovativos e missões de campo — tudo o que ganhou vive aqui.', tour_bell_t:'Lembretes gentis', tour_bell_b:'Encorajadores, nunca spam — e controla cada canal no seu perfil.', tour_done_t:'Fim da volta', tour_done_b:'Aproveite a academia — e lembre-se: o que aprende aqui é para a terra.', tour_next:'Seguinte', tour_back:'Voltar', tour_skip:'Saltar', tour_finish:'Começar', tour_replay:'Fazer a visita guiada',
    comp_h:'Conformidade de formação', comp_sub:'As suas horas de formação contínua obrigatória do ano — Código do Trabalho, art. 131.º (40h/ano).', comp_target:'Meta anual', comp_done:'Concluídas', comp_left:'em falta', comp_ontrack:'Em dia', comp_behind:'Atrasado', comp_pace_by:'A esta altura, deveria estar em', comp_log:'Sessões creditadas', comp_none:'Ainda sem horas creditadas — conclua uma lição para começar.', comp_nif_prompt:'Adicione o seu NIF e dados do contrato no perfil para ativar o registo legal de formação.', comp_confirmed:'Presença confirmada', comp_h_unit:'h', comp_cert_btn:'Documento comprovativo de formação', comp_reg_btn:'Registo de presenças', comp_cert_dl:'Documento transferido', comp_reg_dl:'Registo exportado (CSV)', ru_annex_btn:'Exportar Relatório Único',
    prof_nif:'NIF', prof_empno:'N.º de trabalhador', prof_contract:'Tipo de contrato', prof_fte:'Tempo de trabalho', prof_hire:'Data de início',
    contract_permanent:'Sem termo', contract_fixed:'A termo', contract_part:'Tempo parcial', fte_full:'Tempo inteiro', fte_half:'Tempo parcial (50%)', ck_40h:'40h',
    ready_h:'Prontidão para a função', ready_sub:'', ready_gap:'Maior lacuna', ready_rec:'Recomendado para esta lacuna', ready_of:'do objetivo', ready_none:'Escolha uma função no seu perfil para ver a sua prontidão.',
    ask_more:'Pergunte à Academia: ', dig_h:'Esta semana na EdenRise', dig_sub:'Dois minutos por departamento — ligados ao todo.', pwa_t:'Leve a academia consigo', pwa_b:'Adicione a EdenRise ao ecrã principal — um toque, mesmo offline.', pwa_btn:'Instalar', pwa_ios:'No iPhone: toque em Partilhar e depois \u201cAdicionar ao ecrã principal\u201d.', comm_pin:'Fixar', comm_unpin:'Soltar', comm_delete:'Eliminar', comm_confirm_del:'Eliminar esta publicação para todos?', comm_confirm_del_reply:'Eliminar esta resposta?', comm_deleted:'Eliminado', comm_privacy:'O seu progresso é guardado na sua conta EdenRise (Firestore, UE) e só você — e os administradores da EdenRise — o podem ver. Ative ou desative os lembretes no seu perfil quando quiser.',
    take_title:'O que leva consigo', take_sub:'Três coisas a guardar deste módulo.', take_continue:'Continuar →', take_done:'Terminar curso',
    match_goal:'Para o seu objetivo', missing_ask:'Não encontra o que precisa? Diga à IA →', missing_prompt:'Diga-me o que procura — um tema, um problema na terra, uma competência — e eu encontro-o ou sinalizo-o à equipa EdenRise para o criar. O seu percurso só fica mais inteligente quando o desafia.',
    assigned_tag:'Atribuído', chosen_tag:'Escolha sua',
    voice_label:'Voz', voice_listening:'A ouvir…', voice_hint:'Diga naturalmente — “procuro algo sobre solo”', voice_unsupported:'A pesquisa por voz precisa de Safari ou Chrome', voice_search:'Pesquisa por voz',
    quiz_q:'Pergunta', quiz_of:'de', quiz_ai_building:'O Claude está a escrever perguntas novas a partir deste curso…', quiz_ai_tag:'Gerado por IA a partir deste curso', take_quiz:'Fazer o teste 🎯',
    nudge_refresh_t:'Uma revisão de 2 minutos', nudge_refresh_b:'“{course}” foi há {n} dias — uma vista de olhos mantém-no enraizado',
    offline_note:'Offline — o seu progresso está seguro neste dispositivo e sincroniza quando voltar', online_note:'De volta online — progresso sincronizado',
    stats_today:'hoje', stats_best:'melhor', stats_quizzes:'testes feitos', board_grow:'O ranking cresce à medida que a equipa entra — convide alguém', no_data:'—',
    daily_title:'A pergunta de hoje', daily_sub:'Trinta segundos para manter as raízes', daily_from:'de', daily_correct:'Enraizado! +10 XP', daily_wrong:'Boa tentativa — agora vai ficar.', daily_tomorrow:'Volte amanhã para a próxima', daily_streak:'dias seguidos',
    gdpr_title:'Privacidade e os seus dados', gdpr_sub:'Exporte ou apague, quando quiser.', gdpr_export:'Descarregar os meus dados', gdpr_exported:'O seu ficheiro de dados está a descarregar', gdpr_delete:'Eliminar a minha conta', gdpr_delete_warn:'Isto apaga permanentemente a sua conta, progresso, XP e distintivos. Escreva DELETE para confirmar.', gdpr_deleted:'Conta eliminada. Fique bem', gdpr_recent_login:'Por segurança, inicie sessão novamente primeiro — depois a eliminação funciona.', gdpr_guest_note:'Os dados de convidado vivem só neste dispositivo — eliminar limpa-os aqui.',
    orgkey_title:'Chave de IA da equipa', orgkey_sub:'Uma chave para toda a equipa — cada membro com sessão iniciada recebe o tutor, os testes IA e o Estúdio automaticamente. Chaves pessoais (definições do tutor) têm prioridade.', orgkey_saved:'Chave de IA da equipa guardada — ativa para todos',
    studio_title:'Estúdio de Cursos IA', studio_sub:'Cole a transcrição ou as notas da lição, junte o link do vídeo — a IA escreve o curso bilingue completo: módulos, convite, aprendizagens e teste. Aprova antes de publicar.', studio_gen:'Escrever o curso ✦', studio_generating:'A escrever o curso — módulos, aprendizagens, teste, nas duas línguas…', studio_need_key:'Ligue primeiro uma chave Claude (✦ orbe → ⚙ definições) — o Estúdio escreve com a sua chave.', studio_publish:'Publicar na Biblioteca', studio_draft:'Rascunho — reveja antes de publicar', studio_published:'Publicado — já está na Biblioteca de todos', studio_video_ph:'Link Vimeo ou YouTube (opcional)', studio_text_ph:'Cole a transcrição, notas, ou uma boa descrição da lição…', studio_title_ph:'Título de trabalho (opcional)', studio_discard:'Descartar', studio_custom:'Publicado pela sua equipa', studio_delete_confirm:'Remover este curso para todos?', studio_failed:'Não foi possível gerar — tente novamente (verifique a chave/créditos)',
    nudge_bell:'Lembretes', nudge_empty:'Tudo em dia Nada precisa de si agora.', nudge_board_t:'Estão a aproximar-se de si', nudge_board_b:'{name} está {xp} XP à frente — termine uma lição para alcançar', nudge_top_t:'Está na liderança', nudge_top_b:'No topo do ranking esta semana. Uma lição mantém-no lá.',
    nudge_level_t:'Quase um novo nível', nudge_level_b:'A apenas {xp} XP de {lvl} — um teste leva-o lá.', nudge_streak_t:'Sequência de {n} dias 🔥', nudge_streak_b:'Faça uma lição hoje para a manter viva.', nudge_lesson_t:'Continue de onde parou', nudge_lesson_b:'“{mod}” em {course} está à espera.', nudge_badge_t:'A um curso de um distintivo', nudge_badge_b:'Termine mais um curso para desbloquear Guardião do Bosque', nudge_welcome:'Bem-vindo de volta, {name}',
    notif_title:'Notificações', notif_sub:'Altere quando quiser.', notif_browser:'Notificações do navegador', notif_browser_d:'Lembretes suaves no ecrã — funcionam já.', notif_email:'Email', notif_email_d:'Um lembrete semanal no seu email.', notif_whatsapp:'WhatsApp', notif_whatsapp_d:'Avisos de sequência e ranking no WhatsApp.', notif_phone_ph:'Número de WhatsApp (+351…)', notif_soon:'pronto assim que o envio for ligado', notif_on:'Notificações ativas', notif_blocked:'O navegador bloqueou as notificações — ative-as nas definições do site.',
    mail_not_connected:'O envio de emails ainda não está ligado — implemente primeiro o mailer', mail_sent:'Incentivo enviado', mail_rate_limited:'Já foi incentivado esta semana — mantemos a suavidade', mail_no_email:'Esta conta não tem email', mail_not_opted:'não ativou os lembretes por email — consentimento primeiro', mail_optin_sent:'Email de boas-vindas enviado — veja a sua caixa 📬', mail_failed:'Não foi possível enviar — tente novamente',
    search_ph:'Procurar cursos, a terra…', org:'EdenRise · Academia',
    featured_eyebrow:'Para si', match:'compatível', modules:'módulos', certified:'CERTIFICADO', featured_h:'Em Destaque', featured_sub:'Programas essenciais, em primeiro plano',
    all_levels:'Todos os níveis', Beginner:'Iniciante', Intermediate:'Intermédio', Advanced:'Avançado', 'All levels':'Todos os níveis',
    resume_module:'Retomar Módulo', course_details:'Detalhes', start_learning:'Começar', start_course:'Começar curso', rewatch:'Rever',
    ai_overview:'Visão da IA', my_path:'+ Meu Percurso', in_my_path:'✓ No Meu Percurso', complete:'concluído', est:'aprox.', left:'restantes',
    your_ai_path:'O seu percurso', completed:'Concluído', scored:'nota', modules_skipped:'módulos ignorados pela IA',
    in_progress:'Em curso', adapted_today:'adaptado hoje', unlocks_after:'Desbloqueia após avaliação', next_up:'A seguir', locked:'Bloqueado',
    continue_learning:'Continuar a aprender', synced_devices:'Sincronizado nos seus dispositivos', assigned_you:'Atribuído a si', from_stewardship:'De EdenRise · Zeladoria',
    trending:'Em Destaque na EdenRise', community_learning:'O que a comunidade EdenRise está a aprender', because_completed:'Porque concluiu', ai_recommendations:'Recomendações da IA', see_all:'Ver tudo →',
    generated_by_ai:'Gerado pela IA da EdenRise · atualizado há 2h', your_path_to:'O seu percurso para', path_intro:'Criado a partir da sua função, das suas últimas 6 avaliações e da análise de lacunas de competências. Reorganiza-se sempre que aprende.', regenerate_path:'Regenerar percurso ↺', why_order:'Porquê esta ordem?',
    learning_streak:'Sequência de estudo', personal_best:'▲ Recorde pessoal', this_week:'Esta semana', vs_last_week:'▲ 38% vs semana passada', skills_verified:'Competências verificadas', from_quizzes:'de questionários', avg_score:'Nota média das avaliações', top_5:'— Top 5% na EdenRise',
    ai_path_chip:'PERCURSO IA', required:'OBRIGATÓRIO', team_goal:'META DE EQUIPA', new:'NOVO', module:'MÓDULO', this_week_rank:'ESTA SEMANA', cert_issued:'documento emitido', due:'Prazo',
    library_title:'Biblioteca', courses_tended:'cursos', filter_library:'Filtrar a biblioteca…', all:'Todos', nothing_matches:'Nada corresponde — experimente outro filtro ou peça ao tutor de IA.',
    in_ai_rotation:'Em rotação de IA', learners:'alunos', quiz_me:'Testar-me', modules_h:'Módulos', tap_module:'', coming_soon:'Em breve', more_in:'Mais em', related_courses:'Cursos relacionados',
    ask_tutor:'Perguntar ao tutor', notes_transcript:'Notas e transcrição', mark_complete:'✓ Marcar como concluído', soon_sub:'Esta lição está a ser filmada para a Jornada da Equipa da Terra — avisamos assim que estiver pronta.', play_lesson:'▶ Reproduzir lição',
    live_title:'Ao Vivo', live_sub:'Sessões com pessoas reais — horas abertas, perguntas e respostas e workshops. As gravações ficam na Biblioteca em um dia.', watching:'a assistir', join_now:'Entrar agora', remind_me:'Lembrar-me',
    my_progress:'O Meu Progresso', progress_sub:'',
    level_ab:'Nv', xp:'XP', xp_to:'XP para', highest_level:'Nível máximo — Carvalho Ancião', board_rank:'Posição no ranking', of:'de', badges_earned:'Distintivos ganhos', nice_work:'▲ Bom trabalho', earn_first:'Ganhe o seu primeiro', courses_finished:'Cursos terminados',
    badges_h:'Distintivos', badges_sub:'', locked_dot:'Bloqueado ·', leaders_board:'Ranking · esta semana', board_sub:'Amigável, reinicia todas as segundas. Uma competição saudável mantém todos a terminar.', keep_alive:'▲ Mantenha viva',
    you:'você', xp_ahead_1:'está apenas', xp_ahead_2:'à sua frente — termine um módulo para alcançar', top_board:'Está no topo do ranking esta semana. Continue a fazer crescer o bosque.', path_points:'',
    ob_welcome:'Bem-vindo à EdenRise', ob_step:'Passo', ob_hi:'Bem-vindo,', ob_pick_handle:'Escolha um nome de utilizador — é assim que os outros o veem na comunidade.', ob_role_q:'E o que faz?', ob_q1:'O que faz?', ob_q1_sub:'A IA usa a sua função para criar o seu primeiro percurso. Pode mudar tudo mais tarde.', ob_skip:'Ignorar — explorar sozinho', ob_continue:'Continuar →',
    ob_destination:'O seu destino', ob_q2:'Escolha um objetivo', ob_q2_sub:'A IA sequencia cursos para este objetivo e replaneia à medida que prova competências.', ob_build:'Criar o meu percurso ✦', ob_building:'A criar o seu percurso para', courses_adaptive:'cursos · adaptativo', track_more:'percurso',
    ai_hello:'Como posso ajudar hoje?', how_answers:'Como responde',
    tutor_foot_live:'IA · as respostas podem conter erros · baseadas nos seus cursos',
    tutor_foot_demo:'Demo · respostas guionadas · baseadas nos seus cursos',
    pal_courses:'Cursos', pal_recent:'Recentes',
    team_load_fail:'Não foi possível carregar a sua equipa.', retry:'Tentar novamente',
    sim_no_credit:'Pré-visualização — esta aula não conta para o seu registo de formação. Marque como concluída quando a tiver visto.',
    watch_more:'Veja a aula até ao fim para a registar.',
    no_access_h:'Sem acesso ao painel da equipa', no_access_b:'Este painel é para responsáveis de equipa. Se devia ter acesso, peça ao administrador da sua empresa para o adicionar.', back_home:'Voltar ao início', analytics_sub:'O seu progresso, medido.',
    ob_need_role:'Escolha o que faz para continuar.', ob_need_goal:'Escolha um objetivo para continuar.',
    paths_h:'Percursos', paths_sub:'Uma sequência para um objetivo. Termine um passo e o resto reorganiza-se com base no que já provou saber.',
    active_path:'Percurso ativo', courses_in_path:'Cursos deste percurso', in_order:'Por ordem', next_paths:'Sugestões seguintes', next_paths_sub:'Com base no seu objetivo',
    your_path:'O seu percurso',
    me_h:'A minha aprendizagem', me_progress:'Progresso', me_record:'Registo', me_activity:'Atividade',
    me_paths_sub:'Sequências para um objetivo', me_comm_sub:'Perguntas, respostas, a sua equipa', me_live_sub:'Sessões e gravações',
    nav_live:'Ao Vivo',
    tutor_name:'Tutor de IA EdenRise', tutor_ai_note:'Assistente de IA — as respostas podem conter erros; confirme o que for importante.', tutor_demo:'● Modo demo · respostas guionadas', summarize_course:'Resumir', quiz_now:'Testar-me', whats_due:'O que falta?', build_path:'Criar percurso', ask_anything:'Pergunte sobre a sua terra ou cursos…',
    connect_ai:'Ligar IA real', api_note:'Cole uma chave da API Anthropic para o tutor usar o Claude. A chave fica apenas neste navegador (localStorage) e é enviada apenas para api.anthropic.com.', save:'Guardar', use_demo:'Usar modo demo',
    footer_tag:'· A academia de aprendizagem da EdenRise',
    prof_title:'Perfil', prof_sub:'', prof_edit:'Editar perfil', prof_name:'Nome completo', prof_username:'Nome de utilizador', prof_role:'O que faz', prof_goal:'O seu objetivo de aprendizagem', prof_save:'Guardar alterações', prof_saved:'Perfil guardado', prof_via:'via', prof_signout:'Sair', prof_guest:'Está a explorar como convidado. Entre para guardar o seu perfil e progresso na cloud.', prof_signin:'Entrar',
    auth_welcome:'Bem-vindo à EdenRise Academy', auth_sub:'Entre para guardar o seu progresso em todos os dispositivos.', auth_google:'Continuar com Google', auth_or:'ou', auth_email:'Email', auth_password:'Palavra-passe', auth_name:'O seu nome',
    auth_signin:'Entrar', auth_signup:'Criar conta', auth_to_signup:'Novo por aqui? Criar conta', auth_to_signin:'Já tem conta? Entrar', auth_guest:'Continuar como convidado',
    auth_consent:'Concordo que a EdenRise guarde o meu progresso para o sincronizar entre dispositivos (RGPD).', auth_consent_req:'Aceite o aviso de privacidade para continuar.', auth_working:'Um momento…', auth_signout:'Sair', auth_signed_as:'Sessão iniciada como',
    auth_forgot:'Esqueceu a palavra-passe?', auth_reset_sent:'Link de recuperação enviado — veja o seu email', auth_reset_need_email:'Escreva o seu email acima e toque de novo em "Esqueceu a palavra-passe?".', auth_verify_sent:'Bem-vindo! Enviámos um link de verificação para o seu email'
  }
};
function t(k){ const l = _lang(); return (UI[l] && UI[l][k] != null ? UI[l][k] : UI.en[k]) ?? k; }

const CATS_PT = { 'Leadership':'Liderança', 'Nature Connection':'Ligação à Natureza', 'Land & Soil':'Terra e Solo', 'Water & Climate':'Água e Clima', 'Food & Forest':'Comida e Floresta', 'Stewardship':'Zeladoria', 'Craft & Hands':'Ofício e Mãos', 'Wellbeing':'Bem-estar', 'Community':'Comunidade' };
const tcat = c => _lang() === 'pt' ? (CATS_PT[c] || c) : c;
const PILLARS_PT = { 'Regenerative':'Regenerativo', 'Rooted':'Enraizado', 'Restorative':'Restaurador', 'Connected':'Conectado', 'Elemental':'Elemental', 'Meaningful':'Significativo' };
const tpillar = l => _lang() === 'pt' ? (PILLARS_PT[l] || l) : l;
const LEVELS_PT = ['Semente','Rebento','Broto','Muda','Árvore Jovem','Guardião do Bosque','Carvalho Ancião'];
const tlevel = i => _lang() === 'pt' ? (LEVELS_PT[i] || LEVELS[i].name) : LEVELS[i].name;
const ROLES_PT = { land:'Terra e Agricultura', nature:'Natureza e Bem-estar', water:'Água e Clima', community:'Comunidade e Lugar' };
const trole = r => _lang() === 'pt' ? (ROLES_PT[r.key] || r.label) : r.label;
const GOALS_PT = { 'Regenerative Steward':'Zelador Regenerativo', 'Food Forester':'Guardião da Floresta Alimentar', 'Land Restorer':'Restaurador da Terra', 'Rooted Living':'Vida Enraizada' };
const tgoal = g => _lang() === 'pt' ? (GOALS_PT[g] || g) : g;
const BADGES_PT = {
  'first-steps':['Primeiros Passos','Conclua o seu primeiro módulo'], 'rooted':['Enraizado','Termine o seu primeiro curso'],
  'quiz-ace':['Ás dos Testes','Passe num questionário'], 'grove':['Guardião do Bosque','Termine três cursos'],
  'streak-7':['Sete Sóis','Mantenha uma sequência de 7 dias'], 'pathfinder':['Desbravador','Complete um percurso inteiro'],
  'curious':['Mente Curiosa','Aprenda em três departamentos'], 'certified':['Certificado','Ganhe um certificado de curso']
};
const tbadge = (b, f) => { if (_lang() === 'pt' && BADGES_PT[b.id]) return f === 'title' ? BADGES_PT[b.id][0] : BADGES_PT[b.id][1]; return f === 'title' ? b.title : b.desc; };

/* Course content — Portuguese (title / desc / modules). Missing fields fall back to English. */
const ctitle = c => (_lang() === 'pt' && ((COURSE_PT[c.id] && COURSE_PT[c.id].title) || (c.pt && c.pt.title))) || c.title;
const cdesc = c => (_lang() === 'pt' && ((COURSE_PT[c.id] && COURSE_PT[c.id].desc) || (c.pt && c.pt.desc))) || c.desc;
const cmods = c => (_lang() === 'pt' && ((COURSE_PT[c.id] && COURSE_PT[c.id].modules) || (c.pt && c.pt.modules))) || c.modules;
const tnote = n => _lang() === 'pt' ? String(n).replace('modules skipped by AI', 'módulos ignorados pela IA').replace('module skipped by AI', 'módulo ignorado pela IA') : n;

/* ================= World-class pack: departments, missions, role-play ================= */
const DEPTS = [
  { key: 'land', en: 'Land & Gardens', pt: 'Terra e Jardins' },
  { key: 'building', en: 'Building & Maintenance', pt: 'Construção e Manutenção' },
  { key: 'hospitality', en: 'Malhão Pardo & Hospitality', pt: 'Malhão Pardo e Hospitalidade' },
  { key: 'animals', en: 'Animal Care', pt: 'Cuidado Animal' },
  { key: 'office', en: 'Office & Leadership', pt: 'Escritório e Liderança' }
];
const tdept = k => { const d = DEPTS.find(x => x.key === k); return d ? (_lang() === 'pt' ? d.pt : d.en) : ''; };

/* Field Missions — learn online, prove it on the land. One mission per course (photo-proof). */
const MISSIONS = {
  'land-team-journey': { xp: 150,
    en: { title: 'Catch yourself below the line', brief: 'For three days, notice one moment each day when you slip below the line — blame, excuse or denial. Write the three moments down, and what pulled you back above. Photograph your notes as proof.' },
    pt: { title: 'Apanhe-se abaixo da linha', brief: 'Durante três dias, repare num momento por dia em que desce abaixo da linha — culpa, desculpa ou negação. Anote os três momentos e o que o trouxe de volta acima. Fotografe as suas notas como prova.' } },
};
const missionFor = id => { const m = MISSIONS[id]; return m ? Object.assign({ xp: m.xp }, _lang() === 'pt' ? m.pt : m.en) : null; };

/* AI Role-Play Coach — practice the hard conversation before it happens */
const ROLEPLAY = {
  'land-team-journey': {
    en: { title: 'The blame spiral', persona: 'Rui, a tired team member', opening: 'Honestly? The seedlings died because Marta never set up the irrigation properly. I did my part. Not my fault.',
      system: 'You are Rui, a hard-working but frustrated land-team member at a regenerative resort in Alentejo, Portugal. A planting bed failed and you are firmly below the line: blaming Marta, making excuses, denying any part in it. Stay realistic and human — a little defensive at first, warming ONLY if the user leads with curiosity and ownership instead of accusation. Keep replies under 60 words, spoken tone. Never break character, never mention being an AI.',
      goal: 'Lead Rui back above the line — without blaming him for blaming.', rubric: ['Stayed above the line yourself', 'Curiosity before correction', 'A clear next step, agreed together'] },
    pt: { title: 'A espiral da culpa', persona: 'Rui, um colega cansado', opening: 'Sinceramente? As mudas morreram porque a Marta nunca montou bem a rega. Eu fiz a minha parte. A culpa não é minha.',
      system: 'És o Rui, um membro trabalhador mas frustrado da equipa de terra num resort regenerativo no Alentejo. Um canteiro falhou e estás firmemente abaixo da linha: a culpar a Marta, a arranjar desculpas, a negar qualquer parte. Sê realista e humano — defensivo no início, abrindo APENAS se o utilizador liderar com curiosidade e responsabilidade em vez de acusação. Respostas com menos de 60 palavras, tom falado. Nunca saias da personagem, nunca digas que és uma IA.',
      goal: 'Traga o Rui de volta acima da linha — sem o culpar por culpar.', rubric: ['Manteve-se acima da linha', 'Curiosidade antes de correção', 'Um próximo passo claro, acordado juntos'] }
  },
};
const roleplayFor = id => { const r = ROLEPLAY[id]; return r ? (_lang() === 'pt' ? r.pt : r.en) : null; };

/* ================= Deep-build pack: skills, journeys ================= */
const SKILLS = [
  { key: 'soil', en: 'Soil literacy', pt: 'Literacia do solo' },
  { key: 'water', en: 'Water design', pt: 'Desenho de água' },
  { key: 'food', en: 'Food & forest', pt: 'Alimento e floresta' },
  { key: 'nature', en: 'Nature connection', pt: 'Ligação à natureza' },
  { key: 'craft', en: 'Craft & building', pt: 'Ofício e construção' },
  { key: 'wellbeing', en: 'Wellbeing', pt: 'Bem-estar' },
  { key: 'community', en: 'Community', pt: 'Comunidade' },
  { key: 'leadership', en: 'Leadership', pt: 'Liderança' },
  { key: 'safety', en: 'Land safety', pt: 'Segurança no terreno' }
];
const tskill = k => { const s = SKILLS.find(x => x.key === k); return s ? (_lang() === 'pt' ? s.pt : s.en) : k; };
const CAT_SKILL = { 'Land & Soil': 'soil', 'Water & Climate': 'water', 'Food & Forest': 'food', 'Nature Connection': 'nature', 'Craft & Hands': 'craft', 'Wellbeing': 'wellbeing', 'Community': 'community', 'Leadership': 'leadership', 'Stewardship': 'nature' };
const skillsOf = c => COURSE_SKILLS[c.id] || [CAT_SKILL[c.cat] || 'nature'];

/* Journeys — structured milestone paths with a capstone */
/* One journey, and every stage of it is filmed. Two journeys used to run over
   eight courses of which one existed — a milestone path whose milestones cannot
   be reached is the most damaging kind of empty, because the learner only finds
   out at the third step. */
const JOURNEYS = [
  {
    id: 'land-team', icon: 'compass', grad: 4, xp: 300,
    en: { title: 'The EdenRise Land Team', desc: 'How this team shows up, how it works the land safely, and how it works with AI — the whole induction, filmed here.' },
    pt: { title: 'A Equipa de Terra EdenRise', desc: 'Como esta equipa se apresenta, como trabalha a terra em segurança e como trabalha com IA — a formação completa, filmada aqui.' },
    stages: [
      { course: 'alignment-journey' },
      { course: 'land-team-journey', mission: true },
      { course: 'fire-truck-training' },
      { course: 'ai-literacy', capstone: true }
    ]
  }
];
const tjour = (j, k) => (_lang() === 'pt' ? j.pt : j.en)[k];

/* ================= Role Readiness — the role→skills→learning graph ================= */
const ROLE_PROFILES = {
  land: { skills: { soil: 70, water: 55, food: 50, safety: 60, nature: 40 } },
  nature: { skills: { nature: 70, wellbeing: 60, food: 40, community: 40 } },
  water: { skills: { water: 75, soil: 50, safety: 55, craft: 35 } },
  community: { skills: { community: 70, leadership: 60, nature: 40, wellbeing: 35 } }
};

