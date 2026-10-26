// All copy and facts for the site live here. Edit freely — components only render.
import type { CompositionId } from "../remotion/compositions";

export const links = {
  email: "sonawaneharsh147@gmail.com",
  linkedin: "https://www.linkedin.com/in/harsh-sonavane-554801173/",
  instagram: "https://www.instagram.com/harsh__sonavane/",
  github: "https://github.com/harsh147-github",
  sushaasan: "https://sushaasan.in",
  rself: "https://rself.tech",
  dateify: "https://dateify.app",
  preprint: "https://doi.org/10.2139/ssrn.7649064",
  bearingPaper: "https://doi.org/10.1007/978-981-97-2249-5_6",
  optimizer: "https://github.com/Team-Allen/Super-Aerostructural-Optimizer",
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
  "DPIIT-recognised founder",
  "Sarvam AI startup programme",
  "Claude for Startups",
  "Forbes Marshall Best Project 2025",
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
    body: "World Rank 2 in Formula Student (combustion), All India Rank 1 at Formula Bharat. Meanwhile, a 10-sensor rig I built in the tribology lab turned into my first Springer paper.",
    anchor: "veloce",
  },
  {
    year: "2024",
    title: "Birds, at 500 m/s",
    body: "At DIAT, the defence institute, I simulated bird strikes and projectiles tearing into composite wings, and learned to optimise a laminate until it stopped failing.",
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
export type Media = { src: string; alt: string; caption?: string; span?: "wide" | "tall" | "big" };
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
  lead?: Media;
  /** an animated tool-chain diagram, for work that can't be shown in pictures */
  pipeline?: { name: string; does: string }[];
  galleries?: { label: string; items: Media[] }[];
  tags: string[];
  links?: { label: string; href: string }[];
};

const m = (name: string) => `media/${name}.webp`;

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
      "Front wing, rear wing (with DRS mode) and diffuser, plus nose, sidepods and rear body",
      "Weight distribution moved from 48/52 to 49.1/50.9",
      "Secured the composite material sponsorship personally",
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
    galleries: [
      {
        label: "Simulate",
        items: [
          { src: m("veloce-fullbody"), alt: "Full-car CFD velocity contour, top view", caption: "Full-body CFD · linear run", span: "wide" },
          { src: m("veloce-frontwing"), alt: "Front wing pressure contour", caption: "Front wing · pressure" },
          { src: m("veloce-airfoil"), alt: "Multi-element airfoil velocity field", caption: "Multi-element section" },
          { src: m("veloce-rearwing"), alt: "Rear wing pressure contour", caption: "Rear wing · DRS study" },
          { src: m("veloce-skidpad"), alt: "Skidpad CFD streamlines", caption: "Skidpad full-body CFD", span: "wide" },
          { src: m("veloce-streamlines"), alt: "Streamlines around the rear wing", caption: "Rear wing · streamlines" },
        ],
      },
      {
        label: "Make",
        items: [
          { src: m("veloce-layup-team"), alt: "Team laying up carbon fibre on a mould", caption: "Lay-up night", span: "tall" },
          { src: m("veloce-layup"), alt: "Hand lay-up of carbon fibre with resin", caption: "Hand lay-up" },
          { src: m("veloce-wing-cf"), alt: "Finished carbon-fibre wing element", caption: "Wing element, cured", span: "wide" },
          { src: m("veloce-flap"), alt: "Carbon flap with foam core on the bench", caption: "Flap, demoulded" },
          { src: m("veloce-endplate"), alt: "Carbon-fibre endplate", caption: "Endplate" },
          { src: m("veloce-carbon"), alt: "Carbon-fibre twill fabric", caption: "Twill, before resin" },
        ],
      },
      {
        label: "Race",
        items: [
          { src: m("veloce-car"), alt: "Veloce Racing electric Formula Student car", caption: "E04 · Veloce Racing Electric", span: "tall" },
          { src: m("veloce-team"), alt: "Team Veloce Racing posing with the car", caption: "The team", span: "big" },
          { src: m("veloce-pit"), alt: "Team members discussing in the pits", caption: "Pit lane", span: "tall" },
        ],
      },
    ],
    tags: ["OpenFOAM", "Ansys Fluent", "SolidWorks", "CFRP hand lay-up", "Composite tooling", "k-ω SST"],
  },
  {
    id: "diat",
    theme: "impact",
    index: "02",
    kicker: "the",
    title: "impact.",
    org: "Defence Institute of Advanced Technology (DIAT), Pune",
    role: "Research Intern",
    period: "Jun 2024 – Jan 2025",
    lede: "What happens when a bird meets a composite wing at 250–500 m/s? I modelled it with SPH–FEM coupling in LS-DYNA, tracked delamination, matrix cracking and fibre fracture, then re-stacked the laminate until it held.",
    points: [
      "Bird modelled as SPH water; wing as CFRP shells with MAT54 / MAT59 progressive damage",
      "CFRP/Kevlar stacking sequences optimised with the Puck failure criterion",
      "Captured shock-wave propagation as the dominant damage driver",
    ],
    stats: [
      { value: "500 m/s", label: "impact velocity" },
      { value: "−30%", label: "peak deformation" },
      { value: "SPH–FEM", label: "coupled explicit dynamics" },
      { value: "Puck", label: "failure criterion" },
    ],
    lead: { src: m("diat-sph"), alt: "SPH bird particles impacting a composite wing", caption: "SPH projectile disintegrating on the leading edge" },
    galleries: [
      {
        label: "Impact",
        items: [
          { src: m("diat-impact"), alt: "Composite wing damage contour after impact", caption: "Damage contour, iteration 6", span: "wide" },
          { src: m("diat-impact2"), alt: "Projectile impact on wing panel", caption: "Projectile strike" },
          { src: m("diat-wing"), alt: "Deformation of wing skin after strike", caption: "Shock-wave ripples" },
          { src: m("diat-jet"), alt: "Fighter aircraft in a hangar", caption: "Where the problem is real" },
        ],
      },
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
      "Ansys Fluent, k-ω SST with moving reference frame",
      "Design space expanded 8× without extra CFD budget",
      "Forbes Marshall Best Project Award 2025",
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
    tags: ["Gaussian processes / Kriging", "Ansys Fluent", "OpenFOAM MRF", "Latin hypercube", "Python"],
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
    tags: ["NASTRAN", "Ansys ACP", "OpenVSP / VSPAERO", "pyNastran", "Mystran", "PyOptSparse", "OpenFOAM"],
  },
  {
    id: "iisc",
    theme: "paper",
    index: "05",
    kicker: "the",
    title: "researcher.",
    org: "Indian Institute of Science · NMCAD Lab, Bengaluru",
    role: "Research Associate, Physics-Informed ML · under Prof. Dineshkumar Harursampath",
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
    role: "Founder",
    period: "Jun 2026 – Present",
    lede: "सुशासन — good governance, made measurable. Sushaasan turns scattered citizen complaints from WhatsApp, Instagram, X and the news, in 22 Indian languages, into costed, ranked, ward-level action plans, and tracks every fix in the open.",
    points: [
      "Classify → cluster → synthesise → dispatch, on Sarvam-105b with a Claude fallback",
      "CPGRAMS-compatible 21-day SLA loop; Monte Carlo (P10/P50/P90) ROI model for the municipal corporation",
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
    lead: { src: m("sushaasan-map"), alt: "Live Sushaasan ward map of Pune with issue markers", caption: "The live ward map, Pune" },
    tags: ["Next.js", "Supabase", "Inngest", "Apify", "Cloudflare", "Sarvam AI", "Claude"],
    links: [{ label: "sushaasan.in", href: links.sushaasan }],
  },
  {
    id: "rself",
    theme: "twin",
    index: "07",
    kicker: "the",
    title: "twin.",
    org: "RSelf.tech · Human digital twins · first product Dateify",
    role: "Founder",
    period: "Jul 2026 – Present",
    lede: "The aerospace surrogate workflow, applied to people. A 10-trait personality model and a pre-trained pairwise compatibility operator, tailored to you from about 20 reactions. Dateify is for people who are too busy, not too unlucky.",
    points: [
      "Persona universe from Latin-hypercube + Gaussian-copula sampling: n = 224, 49,756 ordered pairs, 40 pair features",
      "Frozen random tanh layer (D = 300) + ridge regression, with a per-user Bayesian head",
      "Multi-fidelity ladder: simulator → LLM rehearsal → real date",
      "Synthetic validation across 5 planted worlds; real-user validation at the Bangalore launch",
    ],
    stats: [
      { value: "0.59 → 0.73", label: "rank correlation, ceiling 0.78" },
      { value: "0.831", label: "search value vs 0.107 random" },
      { value: "~44×", label: "cheaper per search" },
      { value: "~20", label: "reactions to tailor" },
    ],
    motion: {
      id: "twin",
      caption: "A twin learning from reactions: predictions converge on the planted truth as the per-user head updates. Illustrative data.",
    },
    tags: ["Random-feature models", "Bayesian updating", "Multi-fidelity", "LLM pipelines"],
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
    points: ["CFRP design, tooling and hand lay-up", "From race-car aero to road-car parts"],
    stats: [],
    galleries: [
      {
        label: "Weave",
        items: [
          { src: m("carbon-panel"), alt: "Finished carbon-fibre panel", caption: "Finished panel", span: "tall" },
          { src: m("veloce-bracket"), alt: "Carbon part with aluminium insert", caption: "Bonded insert", span: "tall" },
          { src: m("veloce-mould"), alt: "Carbon fabric on a mould", caption: "On the mould", span: "big" },
        ],
      },
    ],
    tags: ["CFRP", "Kevlar", "Composite tooling", "Vacuum bagging"],
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
    cite: "Sonavane, H. S., Borse, N. R., Shinde, A. B., Chippa, S. P.",
    title:
      "Experimental Study of Temperature Distribution and Oil Flow Rate for Plain and Herringbone-Grooved Hydrodynamic Journal Bearings",
    venue: "ICMech-REC 2023 · Springer LNME",
    href: links.bearingPaper,
  },
];

export const more = [
  {
    title: "Super Aerostructural Optimizer",
    body: "Open source. Gradient-free aerostructural MDO coupling pyNastran structures with OpenFOAM aerodynamics for parametric wing-box sizing.",
    href: links.optimizer,
  },
  {
    title: "Journal bearings, measured",
    body: "Custom 10-sensor Arduino DAQ and VFD speed control to 2,500 rpm. Herringbone-grooved bearings ran 21% hotter than plain.",
    img: m("paper"),
  },
  {
    title: "Cold plasma, with Whirlpool",
    body: "Collaborated with Whirlpool India on a patented concept for plasma-activated sanitisation for washing machines: a dielectric-barrier-discharge module up to 40 kV.",
    img: m("plasma"),
  },
  {
    title: "Off the clock",
    body: "Represented the Mechanical department in basketball at Vishwakarandak. Conducted CFD workshops for the Mechanical department and represented VIT for Siemens software testing.",
    img: m("basketball"),
  },
];

export const achievements = [
  "Formula Student World Rank 2 · combustion, 2023",
  "All India Rank 1 · Formula Bharat 2023 (combustion)",
  "All India Rank 1 · SAE Supra 2024 (electric)",
  "All India Rank 5 · Formula Bharat 2024 (electric)",
  "All India Rank 4 · SAE Supra 2022 (combustion)",
  "All India Rank 4 · Pi-EV 2023, Rank 2 in team management",
  "Forbes Marshall Best Project Award 2025",
  "Best Outgoing Student nominee 2025 · CGPA 8.83, department top 5%",
];

export const toolbox: { group: string; items: string }[] = [
  { group: "Scientific ML", items: "PyTorch, autodiff, PINNs, PIELMs, NVIDIA PhysicsNeMo, GP / Kriging surrogates, CNN reduced-order models, random-feature models, Bayesian updating" },
  { group: "Structures", items: "NASTRAN, pyNastran, Mystran, FEMAP, Ansys Mechanical / ACP, LS-DYNA, Abaqus · CLT/ABD, Puck, Hashin, Tsai–Wu" },
  { group: "CFD", items: "OpenFOAM, Ansys Fluent, SU2, OpenVSP / VSPAERO, XFLR5 · k-ω SST, MRF" },
  { group: "Optimisation", items: "PyOptSparse, OpenMDAO, SciPy, topology optimisation, Latin-hypercube DoE" },
  { group: "Software", items: "Python, MATLAB, C/C++, HPC (PBS/SLURM), Docker · Next.js, Node.js, Supabase, LLM pipelines" },
  { group: "Making", items: "CFRP / Kevlar hand lay-up, composite tooling, Arduino data acquisition" },
];

export const education = {
  school: "Vishwakarma Institute of Technology, Pune",
  degree: "B.Tech, Mechanical Engineering · 2021–2025",
  note: "CGPA 8.83/10 · fully funded Government of India merit scholarship · NPTEL: Composite Mechanics, Applied CFD, Aircraft Stability & Control, CFD for Incompressible Flows",
};
