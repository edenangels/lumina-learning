/* ============================================================================
   INSTANCE · EdenRise  (brand pack — pure config, ZERO engine code)
   ----------------------------------------------------------------------------
   Registers this company into the shared registry the core loader reads.
   To create a new client: copy this folder, change the values + point at its
   OWN Firebase project + hostname. Nothing here is logic — see PRODUCT.md.
============================================================================ */
(window.EdenBrands = window.EdenBrands || {}).edenrise = {
  id: 'edenrise',
  name: 'EdenRise',
  academy: 'EdenRise Academy',
  tagline: 'Regenerative Living, Learned',
  title: 'EdenRise Academy — Regenerative Living, Learned',
  ogDesc: 'Where nature leads, the land heals, and stewardship shapes everything we learn.',
  twDesc: 'Regenerative living, learned — with adaptive AI paths and an AI tutor.',
  domain: 'academy.edenrise.com',
  hostnames: ['academy.edenrise.com'],
  lang: 'en',
  /* the "school ethos" the AI tutor is grounded in (see buildTutorSystem) */
  ethos: 'EdenRise, a regenerative-living farm and school in the Baixo Alentejo, Portugal. Its ethos: where nature leads, the land heals, and stewardship shapes everything. The courses teach regenerative living — soil, water, food forests, native flora, foraging, natural building, fire stewardship and nature connection.',
  shortDesc: 'a regenerative-living school in the Baixo Alentejo, Portugal',   /* used inside AI prompts */
  realm: 'the Alentejo reality (heat, drought, fire season, cork-oak montado, clay soils, water scarcity, working as a team)',  /* AI quiz/scenario grounding */
  location: 'Baixo Alentejo, Portugal',   /* certificate / footer line */
  /* this instance's OWN Firebase project */
  firebase: {
    apiKey: 'AIzaSyBt4pfWRLWUdAjVL8xoEoR7o4wFCjUCUjs',
    authDomain: 'edenrise-academy.firebaseapp.com',
    projectId: 'edenrise-academy',
    storageBucket: 'edenrise-academy.firebasestorage.app',
    messagingSenderId: '295112713200',
    appId: '1:295112713200:web:4f3beb0324b9b995383335',
    measurementId: 'G-SWLQKTVJQS'
  },
  superadmins: ['admin@edenrise.com', 'info@edenrise.com', 'john@edenrise.com'],
  /* Declared because the core no longer guesses either of these.
     authModeKey preserves the key this deployment's learners already hold —
     renaming it would sign every returning learner back out to the gate. */
  authModeKey: 'eden-auth-mode',
  landflow: 'https://landflow.edenrise.workers.dev',
  themeColor: '#0e140f',
  wordSub: 'Academy',     /* the small word under the logo name */
  /* REQ-L-003 — who supplied the content, printed on every proof document.
     EMPTY for EdenRise: it filmed its own courses, so the employer is also the
     author and there is no external provider to name. A white-label client
     running our library MUST set this — under the content-supply model
     (legal spec Part 1.2) the training is legally the employer's and we are the
     external content provider, which only holds if we are named. */
  contentProvider: '',
  /* The billboard this instance leads with. Without it the hero auto-picks the
     most-filmed course, which is a sensible default and a poor storefront: the
     tenant, not a ranking function, decides what a visitor sees first. The
     learner's own place is never lost — it stays one row down in "Continue". */
  heroCourse: 'alignment-journey',   /* John's welcome leads (13 Oct 2026) */
  logoSvg: null,          /* founding brand keeps the inline SVG in index.html; a client ships its own here */
  favicon: null,          /* keep index.html's versioned favicon for the founding brand */
  ogImage: 'https://academy.edenrise.com/og-image.png',
  content: 'data.js',     /* this instance's course catalog (Stage 2 splits per-brand) */
  fonts: {
    /* self-hosted (GDPR: no visitor IP to a third party) — scripts/selfhost-fonts.py */
    link: 'fonts/fonts.css',
    display: '"Cormorant Garamond", Georgia, serif',
    body: '"Inter", -apple-system, sans-serif'
  },
  theme: {
    '--bg': '#0e140f', '--bg-2': '#161f18',
    '--surface': 'rgba(231,237,227,.045)', '--surface-2': 'rgba(231,237,227,.085)',
    '--line': 'rgba(231,237,227,.11)',
    '--text': '#f7f6f1', '--text-dim': '#c2cabb', '--text-faint': '#828c7c',
    '--accent': '#c8a45d', '--accent-2': '#a6c3a5', '--glow': 'rgba(200,164,93,.38)',
    '--forest': '#40563e', '--olive': '#5a6f50', '--cork': '#8a6e4b', '--clay': '#b98562',
    '--atlantic': '#4f7f89', '--mist': '#d2d8d3', '--ivory': '#f7f6f1', '--focus': '#a6c3a5'
  }
};
