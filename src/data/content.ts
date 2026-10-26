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
  name: "Harsh Sonavane",
  roles: ["Physics-informed ML Engineer · IISc", "PINNs & neural operators for aerostructures", "Founder · Sushaasan · RSelf · CarbonDistrict"],
  place: "Namma Bengaluru · 12.97° N, 77.59° E",
  intro:
    "I’m Harsh Sonavane, a physics-informed ML engineer at the Indian Institute of Science, in Namma Bengaluru. I don’t limit myself to industrial job applications: I compound the same skill set into ventures, with ML engineering and ambition at the core.",
  teaser: "And there’s a very interesting story about how I got here.",
  whatIDo:
    "I build physics-informed neural networks and neural operators: models that learn the governing equations of a structure, then predict its full response for a new design in a single forward pass, instead of a fresh simulation.",
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
  { label: "Before", value: "Aerospace & defence", detail: "Paninian Aerospace · Feynman · DIAT (DRDO)", href: "aerospace" },
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
    anchor: "vitlab",
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
    body: "Now a Research Associate at IISc Bengaluru, building weak-form PIELMs: one eigensolve for the whole spectrum, where iterating the strong form needed 79–111. On the side, a parametric PINN that replaces OpenFOAM for a whole family of nozzles.",
    anchor: "iisc",
  },
  {
    year: "Now",
    title: "Same operator, new systems",
    body: "The move never changed: build a fast, verifiable model of a complex system, then ship it. So I pointed it at cities (Sushaasan), at people (RSelf), and back at carbon fibre (CarbonDistrict). The work below starts here, today, and runs back to the race car.",
    anchor: "piml",
  },
];

export const scaleLadder = ["bearing", "wing", "fan blade", "airframe", "eigenproblem", "city", "person"];

export type Stat = { value: string; label: string };
export type Chapter = {
  id: string;
  theme: string;
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
  deck?: { label: string; slides: string[]; cols?: number; aspect?: string };
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

export type Act = {
  id: string;
  num: string;
  title: string;
  kicker: string;
  period: string;
  line: string;
  color: string;
  theme: string;
  entries: Chapter[];
};

/** The work, newest first: four acts, each a ladder of entries. */
export const acts: Act[] = [
  {
    id: "piml",
    num: "01",
    title: "physics-informed ML",
    kicker: "act 01 · where I am now",
    period: "2025 – now",
    line: "Models that obey the physics they predict: physics-informed networks, extreme learning machines and neural surrogates. Fast enough to explore whole design spaces, verifiable enough to trust.",
    color: "#5b6cff",
    theme: "base",
    entries: [
    {
      id: "iisc",
      theme: "paper",
      kicker: "Weak-form PIELM · research",
      title: "IISc Bengaluru",
      org: "Indian Institute of Science · NMCAD Lab, Department of Aerospace Engineering",
      role: "Research Associate, Physics-Informed ML · with Prof. Dineshkumar Harursampath",
      period: "Aug 2026 – Present",
      lede: "Weak-Form PIELM: physics-informed extreme learning machines for differential eigenvalue problems. A frozen Bernstein-polynomial basis, exact enforcement of essential conditions, natural and concentrated mass/stiffness terms entering through variational forms, and the whole vibration spectrum from one symmetric eigensolve. No backpropagation.",
      points: [
        "Benchmarked on bars, Euler–Bernoulli beams, 2D acoustic cavities, in-plane plates and Kirchhoff plates",
        "Beams with masses and springs: iterating the strong form needs 79–111 eigensolves for five modes and takes 35–50× longer; the weak form solves once and stays below 4 × 10⁻¹⁰ % error",
        "Free-edge Kirchhoff plates: no boundary rows on the fully free plate, and 2.5–4 orders of magnitude more accurate at equal degree",
        "Second author, under review at Computer Methods in Applied Mechanics and Engineering · methodology, Python solver, validation",
      ],
      stats: [
        { value: "1", label: "eigensolve for the whole spectrum" },
        { value: "35–50×", label: "faster than iterating the strong form (beams with attachments)" },
        { value: "2.5–4", label: "orders of magnitude more accurate, free-edge plates" },
        { value: "3.6–4.4×", label: "faster than Eig-PIELM on 2D benchmarks" },
      ],
      motion: {
        id: "eigen",
        caption: "Exact mode shapes of a simply supported beam and plate: the spectrum a weak-form PIELM recovers in a single solve.",
      },
      deck: {
        label: "From the paper",
        slides: ["cmame-fig1", "cmame-fig9", "cmame-fig3", "cmame-fig2", "cmame-fig5", "cmame-fig7", "cmame-fig4", "cmame-fig6", "cmame-fig8"],
        cols: 3,
        aspect: "4 / 3",
      },
      tags: ["PIELM", "PINNs", "Rayleigh–Ritz", "Galerkin methods", "Bernstein bases", "PyTorch", "NVIDIA PhysicsNeMo"],
      links: [{ label: "Read the preprint", href: links.preprint }],
    },
    {
      id: "pinns",
      theme: "pinn",
      kicker: "Parametric PINN · open source",
      title: "PINNs-Bernoulli",
      org: "Open source · github.com/harsh147-github/PINNs---Bernoulli",
      role: "Author",
      period: "Aug 2026 – Oct 2026",
      lede: "A physics-informed neural network that solves the Navier–Stokes equations for water through a converging–diverging nozzle, for every throat diameter at once, with no CFD training data. The throat diameter is an input to the network: train once, then each new geometry costs a single forward pass.",
      points: [
        "Parametric over throat ratio d_t = 0.40 to 1.00, including separated flow at the narrowest throats",
        "Benchmarked against OpenFOAM on the identical problem; captures the 9× rise in throat dynamic pressure as the throat closes",
        "Viscous losses and separation that Bernoulli alone misses, learned from the governing equations",
        "Trained once in 3.6 h on a 4-core CPU, no GPU",
      ],
      stats: [
        { value: "0.40%", label: "velocity error vs OpenFOAM (mean relative L2)" },
        { value: "1.1%", label: "pressure error vs OpenFOAM" },
        { value: "0.26 s", label: "per design, vs 34.6 s for OpenFOAM" },
        { value: "22×", label: "cheaper than OpenFOAM at 10,000 designs" },
      ],
      lead: "pinn-anim",
      deck: { label: "Results", slides: ["pinn-compare", "pinn-fields", "pinn-timing", "pinn-sweep"], cols: 2, aspect: "16 / 10" },
      tags: ["PyTorch", "PINNs", "Navier–Stokes", "OpenFOAM", "Amortised inference"],
      links: [{ label: "GitHub", href: links.pinn }],
    },
    {
      id: "fan",
      theme: "fan",
      kicker: "PINN surrogate · shape optimisation",
      title: "CFD × ML × CAD",
      org: "B.Tech final-year project, open-sourced · github.com/harsh147-github",
      role: "Author",
      period: "Feb 2025 – Jul 2026",
      lede: "An end-to-end, physics-validated pipeline for a ceiling-fan blade: parametric CAD, OpenFOAM MRF k-ω SST CFD, a PINN surrogate ensemble trained on the GPU, an optimiser with active learning, and CFD confirmation of every reported number, ending in a manufacturable STEP file.",
      points: [
        "The surrogate proposed the winning design, confirmed by OpenFOAM to within 2% of its own prediction",
        "The optimiser found strong blade washout (tip pitch ≈ 18° below root): a coherent axial jet for less power",
        "36 OpenFOAM cases, 30 kept after strict convergence gating; a CFD-confirmed Pareto front of air delivery vs power",
        "Grew out of the Crompton fan project (see Simulation Engineering)",
      ],
      stats: [
        { value: "+607%", label: "air delivery vs the parametric baseline" },
        { value: "−13%", label: "power input" },
        { value: "1M", label: "designs screened in 1.6 s on an RTX 3060" },
        { value: "≤2%", label: "surrogate vs CFD on the optimum" },
      ],
      lead: "fan-streamlines",
      deck: { label: "Before and after, and the evidence", slides: ["fan-baseline-umag", "fan-umag", "fan-iso", "fan-pareto", "fan-parity", "fan-surrogate-sweep"], cols: 3, aspect: "5 / 4" },
      archives: [{ group: "fan", label: "Archive · all fan results" }],
      tags: ["PINN ensemble", "Active learning", "OpenFOAM MRF", "FreeCAD", "PyTorch", "Pareto optimisation"],
      links: [{ label: "GitHub", href: links.fan }],
    },
    ],
  },
  {
    id: "ventures",
    num: "02",
    title: "ventures",
    kicker: "act 02 · running now",
    period: "2026 – now",
    line: "The same move, pointed outward: build a fast, verifiable model of a complex system, then ship it as a product. For cities, for people, and back to carbon fibre.",
    color: "#f08a24",
    theme: "inverse",
    entries: [
    {
      id: "sushaasan",
      theme: "civic",
      kicker: "Civic AI infrastructure",
      title: "Sushaasan",
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
      kicker: "RSelf Ventures · human digital twins",
      title: "RSelf.tech",
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
      kicker: "High-performance carbon-fibre parts",
      title: "CarbonDistrict",
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
    ],
  },
  {
    id: "aerospace",
    num: "03",
    title: "aerospace structures",
    kicker: "act 03 · airframes and impact",
    period: "2024 – 2026",
    line: "Composite airframes at Mach 0.9 and wings hit by birds at 500 m/s: where I learned what a model of a structure has to get right.",
    color: "#14b8a6",
    theme: "base",
    entries: [
    {
      id: "paninian",
      theme: "aero",
      kicker: "Composite airframes · open-source MDO",
      title: "Paninian Aerospace",
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
      id: "diat",
      theme: "impact",
      kicker: "Bird strike on composite wings",
      title: "DIAT · DRDO",
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
    ],
  },
  {
    id: "simulation",
    num: "04",
    title: "simulation engineering",
    kicker: "act 04 · where it started",
    period: "2022 – 2025",
    line: "Where it started: a race car, a test rig and a ceiling fan. CFD, FEA and experiments, and the first surrogate model that changed how I work.",
    color: "#e10600",
    theme: "inverse",
    entries: [
    {
      id: "crompton",
      theme: "airflow",
      kicker: "Gaussian-process surrogate · CFD",
      title: "Crompton",
      org: "Crompton Greaves Consumer Electricals, Pune",
      role: "Undergraduate Research Assistant",
      period: "Jan 2025 – Mar 2025",
      lede: "Optimise a 1,200 mm BLDC ceiling-fan blade with a budget of ten CFD runs. I trained a Gaussian-process surrogate on those ten, screened 3,000+ designs, and automated OpenFOAM MRF verification of the winners.",
      points: [
        "Ansys Fluent, k-ω SST with a moving reference frame",
        "Design space expanded 8× without extra CFD budget",
        "Forbes Marshall Best Project Award 2025",
        "Continued as CFD × ML × CAD: a PINN surrogate pipeline (see Physics-informed ML)",
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
      mosaics: [{ label: "Fan blade", tiles: [{ k: "crompton-cfd", span: "big" }, { k: "crompton-opt", span: "big" }] }],
      tags: ["Gaussian processes / Kriging", "Ansys Fluent", "OpenFOAM MRF", "Latin hypercube", "PINNs", "Python"],
      links: [{ label: "Open-source follow-up", href: links.fan }],
    },
    {
      id: "veloce",
      theme: "veloce",
      kicker: "Formula Student · aero & composites",
      title: "Veloce Racing",
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
      id: "vitlab",
      theme: "bench",
      kicker: "Experimental tribology · cold plasma",
      title: "VIT research",
      org: "Vishwakarma Institute of Technology, Pune · Tribology and Fluids Lab",
      role: "Undergraduate Research Assistant",
      period: "Oct 2022 – Jun 2024",
      lede: "Experiments before models. I instrumented a journal-bearing test rig from scratch to compare plain and herringbone-grooved bearings, and built a cold-plasma sanitisation module with Whirlpool India.",
      points: [
        "Custom 10-sensor Arduino DAQ (LM35, 6 s sampling) and a VFD-controlled shaft up to 2,500 rpm",
        "Herringbone-grooved bearings ran 21% hotter than plain ones; their temperature rose 30% (vs 12%) as speed went from 1,400 to 2,200 rpm",
        "Published: Springer LNME, ICMech-REC 2023",
        "With Whirlpool India: a dielectric-barrier-discharge cold-plasma module (up to 40 kV) for a patented washing-machine sanitisation concept",
      ],
      stats: [
        { value: "10", label: "thermal sensors, custom DAQ" },
        { value: "2,500", label: "rpm, VFD speed control" },
        { value: "+21%", label: "oil-film temperature, grooved vs plain" },
        { value: "40 kV", label: "cold-plasma module" },
      ],
      lead: "bearing-rig",
      mosaics: [{ label: "Rig, paper and plasma", tiles: [{ k: "bearing-sensors", span: "tall" }, { k: "bearing-paper", span: "big" }, { k: "plasma-device" }, { k: "plasma-diagram" }] }],
      tags: ["Arduino DAQ", "LM35", "VFD control", "Hydrodynamic bearings", "Cold plasma"],
      links: [{ label: "Springer paper", href: links.bearingPaper }],
    },
    ],
  },
];

/** Every entry, in page order. */
export const allEntries = acts.flatMap((a) => a.entries);

/** The journey timeline in the hero. Dates are YYYY-MM; "now" runs to the current month. */
export type TimelineItem = { id: string; label: string; role: string; from: string; to: string; note?: string };
export const timeline: { start: string; end: string; now: string; lanes: { act: string; label: string; color: string; items: TimelineItem[] }[] } = {
  start: "2021-07",
  end: "2027-01",
  now: "2026-10",
  lanes: [
    {
      act: "piml",
      label: "Physics-informed ML",
      color: "#5b6cff",
      items: [
        { id: "iisc", label: "IISc · Weak-form PIELM", role: "Research Associate", from: "2026-08", to: "now", note: "Second author, under review at CMAME" },
        { id: "pinns", label: "PINNs-Bernoulli", role: "Open source", from: "2026-08", to: "2026-10", note: "0.26 s per design vs 34.6 s OpenFOAM" },
        { id: "fan", label: "CFD × ML × CAD", role: "PINN surrogate, open source", from: "2025-02", to: "2026-07", note: "+607% air delivery, −13% power" },
      ],
    },
    {
      act: "ventures",
      label: "Ventures",
      color: "#f08a24",
      items: [
        { id: "sushaasan", label: "Sushaasan", role: "Founder", from: "2026-06", to: "now", note: "Civic AI · 836 complaints → 345 costed plans" },
        { id: "rself", label: "RSelf.tech · Dateify", role: "Founder", from: "2026-07", to: "now", note: "Human digital twins" },
      ],
    },
    {
      act: "aerospace",
      label: "Aerospace",
      color: "#14b8a6",
      items: [
        { id: "diat", label: "DIAT · DRDO", role: "Research Intern", from: "2024-06", to: "2025-01", note: "Bird strike at 250–500 m/s, −30% deformation" },
        { id: "paninian", label: "Feynman", role: "Trainee Engineer", from: "2025-03", to: "2025-06", note: "Monocoque fuselage, +15% structural performance" },
        { id: "paninian", label: "Paninian Aerospace", role: "Aerostructural Engineer", from: "2025-07", to: "2026-07", note: "Mach 0.9 UAV airframes, −30% weight" },
        { id: "paninian", label: "Aerostructural MDO", role: "Open source", from: "2025-10", to: "2026-07", note: "SU2 + MYSTRAN composite wing" },
      ],
    },
    {
      act: "simulation",
      label: "Simulation",
      color: "#e10600",
      items: [
        { id: "veloce", label: "Veloce Racing · Head of Aero", role: "Formula Student", from: "2022-02", to: "2024-10", note: "World Rank 2 · 300 N downforce" },
        { id: "vitlab", label: "RA · experimental HGJB", role: "Research Assistant", from: "2022-10", to: "2024-06", note: "Springer paper, ICMech-REC 2023" },
        { id: "crompton", label: "Crompton", role: "Research Assistant", from: "2025-01", to: "2025-03", note: "GP surrogate, −15% drive power" },
      ],
    },
    {
      act: "also",
      label: "Education",
      color: "#8a8a8a",
      items: [{ id: "also", label: "B.Tech Mechanical · VIT Pune", role: "2021 – 2025", from: "2021-08", to: "2025-06", note: "CGPA 8.83 · GoI merit scholarship" }],
    },
  ],
};


export type Project = { name: string; kind: string; body: string; facts: string[]; img?: string; href: string; site?: string };

export const projects: Project[] = [
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
