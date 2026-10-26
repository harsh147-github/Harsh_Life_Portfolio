// All copy and facts for the site live here. Edit freely — components only render.
// Images are referenced by key from src/data/media.json (built from the source PDFs,
// repos and live sites); every key there appears somewhere on the page.
import type { Tile } from "../components/Gallery";
import type { CompositionId } from "../remotion/compositions";

export const links = {
  email: "sonawaneharsh147@gmail.com",
  linkedin: "https://www.linkedin.com/in/harsh-sonavane-554801173/",
  instagram: "https://www.instagram.com/harsh__sonavane/",
  github: "https://github.com/harsh147-github",
  sushaasan: "https://sushaasan.in",
  sushaasanDash: "https://sushaasan.in/dashboard",
  rself: "https://www.rself.tech",
  dateify: "https://www.dateify.app",
  mvawt: "https://harsh147-github.github.io/Project_MVAWT/",
  preprint: "https://doi.org/10.2139/ssrn.7649064",
  bearingPaper: "https://doi.org/10.1007/978-981-97-2249-5_6",
  optimizer: "https://github.com/Team-Allen/Super-Aerostructural-Optimizer",
  pinn: "https://github.com/harsh147-github/PINNs---Bernoulli",
  fan: "https://github.com/harsh147-github/CFD-ML-CAD-Final-year-project",
  mvawtRepo: "https://github.com/harsh147-github/Project_MVAWT",
  dateifyRepo: "https://github.com/harsh147-github/Dateify_v3",
  outreach: "https://github.com/harsh147-github/Worldwide-Reachout-Dashboard",
  antigravity: "https://github.com/harsh147-github/Project_WIn",
};

export const hero = {
  first: "harsh",
  last: "sonavane",
  roles: ["Physics-informed ML Engineer", "Aerostructures & CFD", "Founder ×3"],
  place: "Namma Bengaluru · 12.97° N, 77.59° E",
  intro:
    "I’m Harsh Sonavane, a physics-informed ML engineer at the Indian Institute of Science, in Namma Bengaluru. I don’t limit myself to industrial job applications: I compound the same skill set into ventures, with ML engineering and ambition at the core.",
  teaser: "And there’s a very interesting story about how I got here.",
};

export const marquee = [
  "Formula Student · World Rank 2",
  "All India Rank 1 · Formula Bharat 2023",
  "All India Rank 1 · SAE Supra 2024",
  "Second author · CMAME (under review)",
  "Springer · ICMech-REC 2023",
  "Patent filed · South Africa",
  "DPIIT-recognised founder",
  "Sarvam AI startup programme",
  "Claude for Startups",
  "Forbes Marshall Best Project 2025",
];

/** The profile at a glance — the résumé, without the résumé. */
export const glance: { label: string; value: string; detail: string; href?: string }[] = [
  { label: "Now", value: "IISc Bengaluru", detail: "Research Associate, physics-informed ML · NMCAD Lab", href: "iisc" },
  { label: "Building", value: "3 ventures", detail: "Sushaasan · RSelf Ventures / Dateify · CarbonDistrict", href: "ventures" },
  { label: "Before", value: "Aerospace & defence", detail: "Paninian Aerospace · Feynman · Crompton · DIAT (DRDO)", href: "work" },
  { label: "Raced", value: "World Rank 2", detail: "Head of Aero & Composites, Team Veloce Racing", href: "veloce" },
  { label: "Published", value: "2 papers", detail: "CMAME (under review) · Springer LNME", href: "also" },
  { label: "Invented", value: "2 patents filed", detail: "Hybrid vertical-axis wind turbine (South Africa) · compliant steering", href: "lab" },
  { label: "Trained", value: "B.Tech, VIT Pune", detail: "Mechanical · CGPA 8.83 · GoI merit scholarship", href: "also" },
  { label: "The move", value: "Model → ship", detail: "Fast, verifiable models of complex systems, deployed as products", href: "story" },
];

export type StoryBeat = { year: string; title: string; body: string; anchor?: string };

export const story: StoryBeat[] = [
  {
    year: "2021",
    title: "A mechanical engineer from Pune",
    body: "B.Tech in Mechanical Engineering at VIT Pune on a fully funded Government of India merit scholarship.",
  },
  {
    year: "2022",
    title: "Then I joined a race team",
    body: "Veloce Racing. Within three seasons I was heading Aerodynamics & Composite Structures, had personally secured our carbon-fibre sponsorship, and was laying up the team’s first complete CFRP aero package by hand.",
    anchor: "veloce",
  },
  {
    year: "2023",
    title: "The car went to the world stage",
    body: "World Rank 2 in Formula Student (combustion), All India Rank 1 at Formula Bharat. Meanwhile, a 10-sensor rig I built in the tribology lab turned into my first Springer paper, and I started teaching CFD workshops to juniors.",
    anchor: "veloce",
  },
  {
    year: "2024",
    title: "Birds, at 500 m/s",
    body: "At DIAT, the DRDO’s defence institute, I simulated bird strikes and projectiles tearing into composite wings, and learned to optimise a laminate until it stopped failing.",
    anchor: "diat",
  },
  {
    year: "2025",
    title: "The turn: ten simulations were enough",
    body: "At Crompton the budget allowed ten CFD runs. I trained a Gaussian process on them and let it screen 3,000+ fan-blade designs. The model was cheaper than the simulation and still honest about its uncertainty. That changed how I work.",
    anchor: "crompton",
  },
  {
    year: "2025–26",
    title: "Airframes at Mach 0.9",
    body: "Composite UAV airframes at Feynman and Paninian Aerospace: a topology-optimised monocoque 30% lighter, and an open-source MDO pipeline that made design iteration 5× faster.",
    anchor: "paninian",
  },
  {
    year: "2026",
    title: "Physics-informed ML at IISc",
    body: "Now a Research Associate at IISc Bengaluru, building weak-form PIELMs: one eigensolve where the old way needed 53–58.",
    anchor: "iisc",
  },
  {
    year: "Now",
    title: "Same operator, new systems",
    body: "The move never changed: build a fast, verifiable model of a complex system, then ship it. So I pointed it at cities (Sushaasan), at people (RSelf), and back at carbon fibre (CarbonDistrict).",
    anchor: "ventures",
  },
];

export const scaleLadder = ["bearing", "wing", "fan blade", "airframe", "eigenproblem", "city", "person"];

export type Stat = { value: string; label: string };
export type Chapter = {
  id: string;
  theme: string;
  index: string;
  kicker: string;
  title: string;
  org: string;
  role: string;
  period: string;
  lede: string;
  points: string[];
  stats: Stat[];
  motion?: { id: CompositionId; caption: string; props?: Record<string, unknown> };
  /** render the motion piece full-width under the text instead of beside it */
  motionWide?: boolean;
  /** original pitch-deck slides, shown uncropped */
  deck?: { label: string; slides: string[] };
  /** a single hero image when there is no motion piece */
  lead?: string;
  /** an animated tool-chain diagram, for work that can't be shown in pictures */
  pipeline?: { name: string; does: string }[];
  /** live product screenshots in device frames */
  showcase?: { browsers: { k: string; url: string }[]; phone?: string };
  cards?: { title: string; body: string }[];
  mosaics?: { label: string; tiles: Tile[] }[];
  /** complete archives (every image in a media group), as filmstrips */
  archives?: { group: string; label?: string; tall?: boolean }[];
  /** hide the archives behind an "open the full archive" button */
  collapseArchives?: boolean;
  note?: string;
  tags: string[];
  links?: { label: string; href: string }[];
};

export const work: Chapter[] = [
  {
    id: "veloce",
    theme: "veloce",
    index: "01",
    kicker: "the",
    title: "racer.",
    org: "Team Veloce Racing India · Formula Student, VIT Pune",
    role: "Head of Aerodynamics & Composite Structures",
    period: "Feb 2022 – Oct 2024",
    lede: "Three seasons, four international competitions and a 5–6 person sub-team. I designed the team’s first complete carbon-fibre aero package over 100+ OpenFOAM iterations, then manufactured it by hand.",
    points: [
      "Front wing, rear wing (with DRS mode) and diffuser, plus nose, sidepods, side panels, floor and rear body",
      "Weight distribution moved from 48/52 to 49.1/50.9",
      "Secured the composite material sponsorship personally",
      "Team results: World Rank 2 (FS Combustion 2023), All India Rank 1 at Formula Bharat 2023 and SAE Supra 2024 (Electric)",
    ],
    stats: [
      { value: "300 N", label: "downforce" },
      { value: "2.1", label: "lift-to-drag" },
      { value: "−1.8 s", label: "lap time" },
      { value: "#2", label: "world rank, FS combustion 2023" },
    ],
    motion: {
      id: "airflow",
      caption: "Live: potential flow around an inverted Joukowski wing, computed in your browser. Particles travel at the true local velocity.",
    },
    mosaics: [
      {
        label: "Race",
        tiles: [{ k: "veloce-car", span: "tall" }, { k: "veloce-team", span: "big" }, { k: "veloce-pit", span: "tall" }],
      },
      {
        label: "Simulate & make",
        tiles: [
          { k: "v-fullbody", span: "wide" },
          { k: "v-fw-upper" },
          { k: "v-rw-drs" },
          { k: "v-layup-sp" },
          { k: "v-vacuum-nose" },
          { k: "v-main-element", span: "wide" },
        ],
      },
    ],
    collapseArchives: true,
    archives: [
      { group: "v-cad", label: "Archive · Design (CAD)" },
      { group: "v-cfd", label: "Archive · Aerodynamics (CFD)" },
      { group: "v-fea", label: "Archive · Side panel composite FEA" },
      { group: "v-make", label: "Archive · Moulds, lay-up & parts" },
      { group: "v-race", label: "Archive · On track" },
    ],
    note: "Everything above comes from the Formula Bharat 2024 Engineering Design Report I led for Veloce Racing Electric (E08).",
    tags: ["OpenFOAM", "Ansys Fluent", "STAR-CCM+", "SolidWorks", "CFRP hand lay-up", "Vacuum bagging", "k-ω SST"],
  },
  {
    id: "diat",
    theme: "impact",
    index: "02",
    kicker: "the",
    title: "impact.",
    org: "Defence Institute of Advanced Technology (DIAT, DRDO), Pune",
    role: "Research Intern · B.Tech thesis",
    period: "Jun 2024 – Jan 2025",
    lede: "What happens when a bird meets a composite wing at 250–500 m/s? I modelled it with SPH–FEM coupling in LS-DYNA, tracked delamination, matrix cracking and fibre fracture, then re-stacked the laminate until it held.",
    points: [
      "Bird modelled as SPH water; wing as CFRP shells with MAT54 / MAT59 progressive damage",
      "Eight design iterations: Lagrangian vs SPH birds, ply counts, erosion cards, aluminium spars and ribs",
      "CFRP/Kevlar stacking sequences optimised with the Puck failure criterion",
      "Captured shock-wave propagation as the dominant damage driver",
    ],
    stats: [
      { value: "500 m/s", label: "impact velocity" },
      { value: "−30%", label: "peak deformation" },
      { value: "8", label: "design iterations" },
      { value: "SPH–FEM", label: "coupled explicit dynamics" },
    ],
    lead: "diat-sph",
    mosaics: [
      {
        label: "Impact",
        tiles: [
          { k: "diat-final-def", span: "wide" },
          { k: "diat-lag" },
          { k: "diat-r150" },
          { k: "diat-jet", span: "wide" },
          { k: "diat-r155", span: "wide" },
        ],
      },
    ],
    archives: [
      { group: "diat", label: "Archive · Results, every iteration" },
      { group: "diat-setup", label: "Archive · Model setup" },
    ],
    tags: ["LS-DYNA", "SPH", "MAT54 / MAT59", "Puck · Hashin · Tsai–Wu", "Autodyn", "Ansys ACP"],
  },
  {
    id: "crompton",
    theme: "airflow",
    index: "03",
    kicker: "the",
    title: "surrogate.",
    org: "Crompton Greaves Consumer Electricals, Pune",
    role: "Undergraduate Research Assistant",
    period: "Jan 2025 – Mar 2025",
    lede: "Optimise a 1,200 mm BLDC ceiling-fan blade with a budget of ten CFD runs. I trained a Gaussian-process surrogate on those ten, screened 3,000+ designs, and automated OpenFOAM MRF verification of the winners.",
    points: [
      "Ansys Fluent, k-ω SST with a moving reference frame",
      "Design space expanded 8× without extra CFD budget",
      "Forbes Marshall Best Project Award 2025",
      "Continued as open source: a full CFD × ML × CAD pipeline with a GPU PINN ensemble (see the lab)",
    ],
    stats: [
      { value: "−15%", label: "drive power at 230 m³/min" },
      { value: "10", label: "CFD runs to train" },
      { value: "96%", label: "prediction accuracy" },
      { value: "3,000+", label: "designs screened" },
    ],
    motion: {
      id: "surrogate",
      caption: "A real Gaussian process (RBF kernel, Cholesky solve) learning a hidden response from ten samples, then screening candidates.",
    },
    mosaics: [{ label: "Fan", tiles: [{ k: "crompton-cfd", span: "big" }, { k: "fan-streamlines" }, { k: "fan-iso" }, { k: "fan-pareto", span: "wide" }] }],
    archives: [{ group: "crompton", label: "Archive · Fan aerodynamics" }],
    tags: ["Gaussian processes / Kriging", "Ansys Fluent", "OpenFOAM MRF", "Latin hypercube", "PINNs", "Python"],
    links: [{ label: "Open-source follow-up", href: links.fan }],
  },
  {
    id: "paninian",
    theme: "aero",
    index: "04",
    kicker: "the",
    title: "airframe.",
    org: "Paninian Aerospace India · Feynman Aerospace",
    role: "Aerostructural Engineer · Trainee Engineer",
    period: "Mar 2025 – Jul 2026",
    lede: "Composite airframes and load-bearing structures for a fixed-wing UAV family flying to Mach 0.9 inside a 7g envelope. I replaced a commercial workflow with an open-source MDO pipeline, and built a digital twin that tracks fatigue life.",
    points: [
      "Topology-optimised blended-wing-body monocoque: failure index 1.50 → 0.795",
      "Python digital-twin framework for fatigue and remaining-useful-life estimation",
      "1:6-scale demonstrators manufactured to NADCAP and ASTM standards",
      "At Feynman: single-shell monocoque fuselage for a 5 kg-payload UAV, +15% structural performance",
    ],
    stats: [
      { value: "−30%", label: "airframe weight" },
      { value: "+20%", label: "factor of safety" },
      { value: "5×", label: "faster design iteration" },
      { value: "M 0.9", label: "flight envelope, 7g" },
    ],
    pipeline: [
      { name: "OpenVSP", does: "parametric geometry" },
      { name: "VSPAERO", does: "fast aerodynamic loads" },
      { name: "OpenFOAM", does: "high-fidelity checks" },
      { name: "pyNastran", does: "structural model build" },
      { name: "Mystran", does: "open-source FE solve" },
      { name: "PyOptSparse", does: "design-space exploration" },
    ],
    mosaics: [
      {
        label: "Open-source MDO · Super Aerostructural Optimizer",
        tiles: [{ k: "mdo-surface-cp", span: "wide" }, { k: "mdo-mach" }, { k: "mdo-failure" }, { k: "mdo-cp-mach", span: "wide" }, { k: "mdo-deflection", span: "wide" }],
      },
    ],
    archives: [{ group: "mdo", label: "Archive · MDO renders" }],
    note: "Airframe work at Paninian is under NDA, so the images here come from the open-source aerostructural MDO project instead.",
    tags: ["NASTRAN", "Ansys ACP", "OpenVSP / VSPAERO", "pyNastran", "Mystran", "SU2", "PyOptSparse", "OpenFOAM"],
    links: [{ label: "Super Aerostructural Optimizer", href: links.optimizer }],
  },
  {
    id: "iisc",
    theme: "paper",
    index: "05",
    kicker: "the",
    title: "researcher.",
    org: "Indian Institute of Science · NMCAD Lab, Bengaluru",
    role: "Research Associate, Physics-Informed ML · with Prof. Dineshkumar Harursampath",
    period: "Aug 2026 – Present",
    lede: "A weak-form physics-informed extreme learning machine for differential eigenvalue problems: a frozen Bernstein-polynomial basis, Galerkin assembly and a single generalised eigensolve. No backpropagation.",
    points: [
      "Benchmarked on bars, Euler–Bernoulli beams, 2D acoustic cavities and Kirchhoff plates",
      "Mode ordering verified over 325 modes against closed-form, high-precision and FE references",
      "Free-edge plates: avoids the 33–48% DOF penalty of strong form, 3–4 orders lower error",
      "Second author, under review at CMAME · methodology, Python solver, validation",
    ],
    stats: [
      { value: "1 vs 53–58", label: "solves for beams with masses & springs" },
      { value: "16–20×", label: "lower cost" },
      { value: "325", label: "modes verified" },
      { value: "10³–10⁴", label: "lower error, free-edge plates" },
    ],
    motion: {
      id: "eigen",
      caption: "Exact mode shapes of a simply supported beam and plate, the kind of spectrum a weak-form PIELM recovers in one solve.",
    },
    mosaics: [{ label: "Also physics-informed · parametric PINN", tiles: [{ k: "pinn-fields", span: "wide" }, { k: "pinn-timing", span: "wide" }] }],
    archives: [{ group: "pinn", label: "Archive · PINNs-Bernoulli results" }],
    tags: ["PIELM", "PINNs", "PyTorch", "NVIDIA PhysicsNeMo", "Galerkin methods", "Variational Asymptotic Method"],
    links: [{ label: "Read the preprint", href: links.preprint }],
  },
];

export const ventures: Chapter[] = [
  {
    id: "sushaasan",
    theme: "civic",
    index: "06",
    kicker: "the",
    title: "sushaasan.",
    org: "Sushaasan · Civic AI infrastructure · DPIIT recognised",
    role: "Founder · product, strategy, government outreach",
    period: "Jun 2026 – Present",
    lede: "सुशासन: good governance, made measurable. Sushaasan turns scattered citizen complaints from WhatsApp, Instagram, X, Reddit and the news, in 22 Indian languages, into costed, ranked, ward-level action plans for municipal officers, and tracks every fix in the open.",
    points: [
      "Classify → cluster → synthesise → dispatch, on Sarvam-105b with a Claude fallback",
      "CPGRAMS-compatible 21-day SLA loop; Monte Carlo (P10/P50/P90) ROI model for the municipal corporation",
      "Live on Pune data: 1,665 public posts collected, 113 issue clusters across 49 wards, 720 ward digests issued",
      "Built with co-founder & CTO Ramanuj Ladda · Seva First Innovation Challenge 2026",
      "Selected for the Sarvam AI startup programme and Claude for Startups; featured by Rising Startup and Punekar News",
    ],
    stats: [
      { value: "836", label: "complaints, Pune wards 46–47" },
      { value: "113", label: "issue clusters" },
      { value: "₹9.23 Cr", label: "across 345 costed plans" },
      { value: "492", label: "briefs dispatched" },
    ],
    motion: {
      id: "signal",
      caption: "From a hundred tickets to one costed brief. Headline numbers are from the pilot; the per-card values are illustrative.",
    },
    showcase: {
      browsers: [
        { k: "sus-live-map", url: "sushaasan.in" },
        { k: "sus-dashboard", url: "sushaasan.in/dashboard" },
      ],
      phone: "sus-live-phone",
    },
    archives: [{ group: "sushaasan", label: "The pitch deck & product", tall: true }],
    tags: ["Next.js", "Supabase", "Inngest", "Apify", "Cloudflare", "Sarvam AI", "Claude"],
    links: [
      { label: "sushaasan.in", href: links.sushaasan },
      { label: "Transparency dashboard", href: links.sushaasanDash },
    ],
  },
  {
    id: "rself",
    theme: "rself",
    index: "07",
    kicker: "RSelf Ventures",
    title: "rself.tech",
    org: "RSelf Ventures · Human digital twins · first product Dateify",
    role: "Founder",
    period: "Jul 2026 – Present",
    lede: "Compounding human presence with digital twins. The aerospace surrogate workflow, applied to people: a 10-trait personality model and a pre-trained pairwise compatibility operator, tailored to you from about 20 reactions, then put to work in the world on your behalf.",
    points: [
      "Personality: the Big Five plus values, attachment, lifestyle and family intent",
      "Persona universe from Latin-hypercube + Gaussian-copula sampling: n = 224, 49,756 ordered pairs, 40 pair features",
      "Frozen random tanh layer (D = 300) + ridge regression, with a per-user Bayesian head",
      "Multi-fidelity ladder: simulator → LLM rehearsal → real date",
    ],
    stats: [
      { value: "0.73", label: "rank correlation, tailored (from 0.59 pre-trained · ceiling 0.78)" },
      { value: "0.831", label: "search value vs 0.107 random" },
      { value: "~44×", label: "cheaper per search" },
      { value: "~20", label: "reactions to tailor a twin" },
    ],
    motion: {
      id: "persona",
      caption: "Personality → extraction network Φ → latent compatibility function f(z) → digital twin → out into the world. Drawn live with Remotion; trait values are illustrative.",
    },
    motionWide: true,
    deck: {
      label: "From the pitch · Mysore",
      slides: ["rself-deck-cover", "rself-deck-traits", "rself-deck-twin", "rself-deck-apps", "rself-deck-dateify", "rself-deck-why"],
    },
    cards: [
      { title: "Dateify", body: "Matchmaking for people who break up because they’re too busy. Your twin calibrates to you, then swipes, matches and goes on virtual café dates on your behalf." },
      { title: "LinkedIn_fy", body: "Networking: your personality’s presence, compounding in the background, so you’re in the right rooms at the right time." },
      { title: "Founders & Investors", body: "Growth: matching the people who build companies with the people who back them." },
      { title: "Future_fy", body: "Augmenting the future: giving people the ability to see where their personality is likely to take them." },
    ],
    showcase: {
      browsers: [
        { k: "rself-home", url: "rself.tech" },
        { k: "dateify-home", url: "dateify.app" },
      ],
      phone: "dateify-phone",
    },
    tags: ["Random-feature models", "Bayesian updating", "Multi-fidelity", "Node + Express", "Claude", "Capacitor (Android)"],
    links: [
      { label: "rself.tech", href: links.rself },
      { label: "dateify.app", href: links.dateify },
    ],
  },
  {
    id: "carbon",
    theme: "carbon",
    index: "08",
    kicker: "the",
    title: "carbon.",
    org: "CarbonDistrict · Pune",
    role: "Founder & COO",
    period: "Ongoing",
    lede: "High-performance carbon-fibre automotive parts, built with the same CFRP design and hand lay-up methods we developed on the Formula Student car. The craft that started all of this, turned into a business.",
    points: ["CFRP design, tooling, hand lay-up and vacuum bagging", "From race-car aero to road-car parts"],
    stats: [],
    mosaics: [
      {
        label: "Where the methods come from",
        tiles: [{ k: "v-rw-endplate", span: "tall" }, { k: "v-cfrp" }, { k: "v-rod-mount" }, { k: "v-sandwich", span: "tall" }, { k: "v-elements-core", span: "wide" }],
      },
    ],
    tags: ["CFRP", "Kevlar", "Composite tooling", "Vacuum bagging"],
  },
];

export type Project = { name: string; kind: string; body: string; facts: string[]; img?: string; href: string; site?: string };

export const projects: Project[] = [
  {
    name: "PINNs-Bernoulli",
    kind: "Physics-informed ML · open source",
    body: "A parametric PINN that solves Navier–Stokes through a converging–diverging nozzle for every throat diameter at once, with no CFD training data, benchmarked against OpenFOAM.",
    facts: ["0.40% velocity / 1.1% pressure error vs OpenFOAM", "0.26 s per design vs 34.6 s", "Break-even after ~376 designs"],
    img: "pinn-compare",
    href: links.pinn,
  },
  {
    name: "CFD × ML × CAD",
    kind: "Shape optimisation · final-year project",
    body: "Parametric CAD → OpenFOAM MRF → PINN surrogate ensemble on the GPU → active learning → CFD confirmation → manufacturable STEP. Every reported number is confirmed by a real CFD solve.",
    facts: ["+607% air delivery, −13% power", "1,000,000 designs in 1.6 s on an RTX 3060", "Optimum within 2% of CFD"],
    img: "fan-streamlines",
    href: links.fan,
  },
  {
    name: "Super Aerostructural Optimizer",
    kind: "Aerostructural MDO · open source",
    body: "A physics-verified MDO chain for a composite wing: SU2 3-D CFD, MYSTRAN shell FE with per-element Tsai–Wu, and VAM fully-stressed-design sizing.",
    facts: ["9.601 kg optimised wing", "−2° washout: 7.3% lower peak Mach", "150-iteration sizing to failure index 0.8"],
    img: "mdo-surface-cp",
    href: links.optimizer,
  },
  {
    name: "Project MVAWT",
    kind: "Clean energy · patent filed",
    body: "Magnus-effect bladeless wind turbines that harvest vehicle-induced wind along India’s 150,000+ km of highways. Spinning cylinders instead of blades, paired with solar.",
    facts: ["South African patent filed", "Indian filing under SIPP", "4–8 m/s wind pulse from every passing truck"],
    img: "mvawt-home",
    href: links.mvawtRepo,
    site: links.mvawt,
  },
  {
    name: "Dateify v3",
    kind: "AI agents · consumer app",
    body: "An AI-agent dating app: onboard, calibrate your personality in a chat, and your agent swipes, matches and goes on virtual café dates on your behalf, learning your voice over time.",
    facts: ["Node + Express + Claude", "Android via Capacitor", "Razorpay subscriptions"],
    img: "dateify-feel",
    href: links.dateifyRepo,
    site: links.dateify,
  },
  {
    name: "Outreach HQ",
    kind: "AI tooling · personal CRM",
    body: "A worldwide engineering-opportunity dashboard: Claude-powered contact discovery, personalised drafting and a pipeline from ‘identified’ to ‘offer’.",
    facts: ["80+ aerospace & composites organisations", "12 regions", "Next.js 15 · Supabase · Claude"],
    href: links.outreach,
  },
  {
    name: "AntiGravity",
    kind: "Concept · future of work",
    body: "Stop collecting permission, start building proof: a platform that connects real problems to the people who can solve them, regardless of where they studied or worked.",
    facts: ["Proof over pedigree", "Concept / pre-MVP"],
    img: "antigravity",
    href: links.antigravity,
  },
];

export const publications = [
  {
    cite: "Mishra, K. K., Sonavane, H. S., Mallick, R., Harursampath, D.",
    title:
      "Weak-Form PIELM for Differential Eigenvalue Problems: A Frozen-Basis Variational Framework and Structural Comparison with Strong-Form Eig-PIELM",
    venue: "Under review, Computer Methods in Applied Mechanics and Engineering · preprint 2026",
    href: links.preprint,
  },
  {
    cite: "Borse, N., Sonavane, H., Shinde, A., Chippa, S.",
    title:
      "Experimental Study of Temperature Distribution and Oil Flow Rate for Plain and Herringbone-Grooved Hydrodynamic Journal Bearings",
    venue: "ICMech-REC 2023 · Recent Advances in Mechanical Engineering, Vol. 2 · Springer LNME",
    href: links.bearingPaper,
  },
];

/** University research and life, each with its images. */
export const sideQuests: { title: string; body: string; tiles: string[] }[] = [
  {
    title: "Journal bearings, measured",
    body: "Built a 10-sensor Arduino DAQ (LM35, 6 s sampling) and VFD speed control to 2,500 rpm. Herringbone-grooved bearings ran 21% hotter than plain ones. Published with Springer.",
    tiles: ["bearing-rig", "bearing-sensors", "bearing-paper"],
  },
  {
    title: "Cold plasma, with Whirlpool",
    body: "Collaborated with Whirlpool India on a patented concept for plasma-activated sanitisation in washing machines: a dielectric-barrier-discharge module up to 40 kV.",
    tiles: ["plasma-device", "plasma-diagram"],
  },
  {
    title: "Teaching CFD",
    body: "Conducted CFD workshops for the Mechanical department, from meshing to post-processing, with Team Veloce.",
    tiles: ["workshop-teach", "workshop-room", "workshop-group", "workshop-screens"],
  },
  {
    title: "Siemens, and the court",
    body: "Represented VIT for Siemens software testing, and the Mechanical department in basketball at Vishwakarandak.",
    tiles: ["siemens-team", "siemens-testing", "basketball", "vit-campus"],
  },
];

export const achievements = [
  "Formula Student World Rank 2 · combustion, 2023",
  "All India Rank 1 · Formula Bharat 2023 (combustion)",
  "All India Rank 1 · SAE Supra 2024 (electric)",
  "All India Rank 5 · Formula Bharat 2024 (electric)",
  "All India Rank 4 · SAE Supra 2022 (combustion)",
  "All India Rank 4 · Pi-EV 2023, Rank 2 in team management",
  "Patent filed, South Africa · vertical-axis hybrid wind turbine",
  "Patent filed · compliant steering",
  "Forbes Marshall Best Project Award 2025",
  "Best Outgoing Student nominee 2025 · department top 5%",
];

export const toolbox: { group: string; items: string }[] = [
  { group: "Scientific ML", items: "PyTorch, autodiff, PINNs, PIELMs, NVIDIA PhysicsNeMo, GP / Kriging surrogates, CNN reduced-order models, random-feature models, Bayesian updating" },
  { group: "Structures", items: "NASTRAN, pyNastran, Mystran, FEMAP, Ansys Mechanical / ACP, LS-DYNA, Abaqus · CLT/ABD, Puck, Hashin, Tsai–Wu" },
  { group: "CFD", items: "OpenFOAM, Ansys Fluent, SU2, STAR-CCM+, OpenVSP / VSPAERO, XFLR5 · k-ω SST, MRF" },
  { group: "Optimisation", items: "PyOptSparse, OpenMDAO, SciPy, topology optimisation, Latin-hypercube DoE" },
  { group: "Software", items: "Python, MATLAB, C/C++, HPC (PBS/SLURM), Docker · Next.js, Node.js, Supabase, LLM pipelines (Sarvam AI, Claude)" },
  { group: "Making", items: "CFRP / Kevlar hand lay-up, composite tooling, vacuum bagging, Arduino data acquisition" },
];

export const education = {
  school: "Vishwakarma Institute of Technology, Pune",
  degree: "B.Tech, Mechanical Engineering · 2021–2025",
  note: "CGPA 8.83/10 · fully funded Government of India merit scholarship · 3 undergraduate research assistantships and a research internship with DIAT (DRDO) · NPTEL: Composite Mechanics, Applied CFD, Aircraft Stability & Control, CFD for Incompressible Flows",
};
