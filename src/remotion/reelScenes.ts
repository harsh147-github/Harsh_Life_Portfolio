// The story film's script. No Remotion imports here, so the page can read the
// timings (for the chapter bar and chips) without loading the player bundle.
//
// The film is cut like a trailer: each scene is a run of short beats, one line
// on screen at a time. Wrap words in *asterisks* to set them in the accent colour.

export type Drawing = "car" | "net" | "photo" | "space" | "wing" | "strike" | "surrogate" | "lattice" | "modes" | "clusters" | "twin" | "weave";

export type Beat = {
  /** how long the beat holds, in frames (30 per second) */
  d: number;
  text: string;
  /** a figure that leads the beat; the text becomes its label */
  big?: string;
  /** a small line under the text */
  sub?: string;
  /** the drawing beside the text; consecutive beats with the same drawing keep it running */
  gfx?: Drawing;
  /** which step of the drawing ("space" only) */
  stage?: number;
  /** playback speed of the drawing */
  speed?: number;
  /** fill the frame with the accent colour for this beat */
  flip?: boolean;
  /** accent colour for this beat only */
  accent?: string;
};

export type ReelScene = {
  id: string;
  /** short chip label */
  label: string;
  when: string;
  kicker: string;
  beats: Beat[];
  /** the case study this scene opens */
  entry?: string;
  pal?: { bg: string; fg: string; accent: string };
};

const script: ReelScene[] = [
  {
    id: "problem",
    label: "The problem",
    when: "",
    kicker: "Harsh Sonavane · the short version",
    beats: [
      { d: 44, text: "A simulation tells engineers *the truth*." },
      { d: 42, text: "But one run takes *hours*.", gfx: "space", stage: 0 },
      { d: 44, text: "So you test *10* designs.", gfx: "space", stage: 1 },
      { d: 38, text: "Not *10,000*.", gfx: "space", stage: 2 },
      { d: 70, text: "I build *machine-learning models* that close that gap.", gfx: "net" },
    ],
  },
  {
    id: "veloce",
    label: "Race car",
    when: "2022–24",
    kicker: "2022 – 2024 · Veloce Racing, Formula Student",
    entry: "veloce",
    pal: { bg: "#0b0b0b", fg: "#f5f5f5", accent: "#e10600" },
    beats: [
      { d: 40, text: "It started with a *race car*." },
      { d: 58, text: "One 2D airfoil became a full *aero package*.", gfx: "car" },
      { d: 50, big: "300 N", text: "of downforce, from wings I designed and built", gfx: "car" },
      { d: 50, big: "2", text: "national titles. World rank 2.", flip: true },
    ],
  },
  {
    id: "diat",
    label: "Aerospace",
    when: "2024–25",
    kicker: "2024 – 2025 · DIAT (DRDO) · Feynman Aerospace",
    entry: "diat",
    pal: { bg: "#050d1a", fg: "#e6efff", accent: "#3da5ff" },
    beats: [
      { d: 38, text: "Then: *aerospace*." },
      { d: 56, big: "500 m/s", text: "bird strikes on composite wings", gfx: "strike", speed: 1.3 },
      { d: 46, text: "Aerodynamics. Now *structures* too.", gfx: "strike", speed: 1.3 },
    ],
  },
  {
    id: "crompton",
    label: "The wall",
    when: "2025",
    kicker: "2025 · bachelor’s thesis with Crompton",
    entry: "crompton",
    pal: { bg: "#e9f3f1", fg: "#062925", accent: "#0e8c7f" },
    beats: [
      { d: 36, text: "Then I hit *the wall*." },
      { d: 44, text: "One ceiling fan. *15* designs planned." },
      { d: 40, text: "Time to simulate *10*." },
      { d: 56, text: "So I taught myself to build a *surrogate model*.", gfx: "surrogate", speed: 1.4 },
      { d: 50, big: "3,000", text: "designs screened, from those 10 runs", gfx: "surrogate", speed: 1.4 },
      { d: 48, big: "−15%", text: "drive power. Best Project Award.", flip: true },
    ],
  },
  {
    id: "paninian",
    label: "Airframes",
    when: "2025–26",
    kicker: "2025 – 2026 · Paninian Aerospace",
    entry: "paninian",
    pal: { bg: "#16181b", fg: "#eceef0", accent: "#ff6a13" },
    beats: [
      { d: 38, text: "Next: *real airframes*." },
      { d: 54, text: "An open-source design pipeline for *Mach 0.9* UAVs.", gfx: "lattice" },
      { d: 48, big: "5×", text: "faster than the commercial workflow", gfx: "lattice" },
      { d: 44, big: "−30%", text: "airframe weight", gfx: "lattice" },
    ],
  },
  {
    id: "iisc",
    label: "IISc",
    when: "2026",
    kicker: "2026 · Indian Institute of Science, Bengaluru",
    entry: "iisc",
    pal: { bg: "#f3eee3", fg: "#141a3c", accent: "#2d3fbf" },
    beats: [
      { d: 42, text: "Now: the *mathematics* underneath." },
      { d: 58, text: "A physics-informed *neural network* for how structures vibrate.", gfx: "net" },
      { d: 48, big: "35–50×", text: "faster. One solve, the whole spectrum.", gfx: "modes" },
      { d: 44, text: "Paper under review at *CMAME*.", gfx: "modes" },
    ],
  },
  {
    id: "ventures",
    label: "Ventures",
    when: "Now",
    kicker: "Now · entrepreneurship · three ventures I founded",
    entry: "sushaasan",
    pal: { bg: "#fffaf4", fg: "#1b1611", accent: "#ef7a12" },
    beats: [
      { d: 42, text: "I am also a *founder*." },
      { d: 46, text: "Three ventures. *Same method.*", sub: "Model the system, then ship it as a product" },
      { d: 64, text: "*Sushaasan.* A city’s complaints become costed plans.", sub: "Civic AI startup · featured by Rising Startup and Punekar News", gfx: "clusters", speed: 2.3 },
      { d: 56, text: "*RSelf.* A person becomes a digital twin.", sub: "AI startup · human digital twins", gfx: "twin", speed: 1.4, accent: "#e8006f" },
      { d: 52, text: "*CarbonDistrict.* Carbon-fibre parts, made in Pune.", sub: "Manufacturing business", gfx: "weave", accent: "#b8862b" },
    ],
  },
  {
    id: "goal",
    label: "Where it goes",
    when: "",
    kicker: "Where this goes",
    beats: [
      { d: 46, text: "Thousands of designs, *in minutes*.", gfx: "space", stage: 3 },
      { d: 52, text: "And knowing how far to *trust* each one.", gfx: "space", stage: 4 },
      { d: 60, text: "That is *Physics AI*. It is what I build.", gfx: "net" },
      { d: 96, text: "Let’s *connect*.", sub: "Harsh Sonavane · scroll for the work ↓", gfx: "photo" },
    ],
  },
];

export const reelScenes = script.map((s) => ({ ...s, frames: s.beats.reduce((n, b) => n + b.d, 0) }));

export const reelStarts = reelScenes.reduce<number[]>((acc, _s, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + reelScenes[i - 1].frames);
  return acc;
}, []);
export const reelFrames = reelScenes.reduce((n, s) => n + s.frames, 0);
export const sceneAt = (frame: number) => {
  let i = reelStarts.length - 1;
  while (i > 0 && frame < reelStarts[i]) i--;
  return i;
};
/** which beat of a scene a scene-local frame falls in, and the frame within it */
export const beatAt = (scene: number, local: number) => {
  const beats = reelScenes[scene].beats;
  let i = 0;
  let f = local;
  while (i < beats.length - 1 && f >= beats[i].d) f -= beats[i++].d;
  return { i, f };
};
