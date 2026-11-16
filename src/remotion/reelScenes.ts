// The story reel's scenes. No Remotion imports here, so the page can read the
// timings (for the chapter bar and chips) without loading the player bundle.
export type ReelScene = {
  id: string;
  /** short chip label */
  label: string;
  when: string;
  frames: number;
  kicker: string;
  headline: string;
  stats: { value: string; label: string }[];
  /** the case study this scene opens */
  entry?: string;
  pal?: { bg: string; fg: string; accent: string };
};

export const reelScenes: ReelScene[] = [
  {
    id: "intro",
    label: "Start",
    when: "",
    frames: 84,
    kicker: "Harsh Sonavane",
    headline: "My story, in 40 seconds.",
    stats: [],
  },
  {
    id: "veloce",
    label: "Race car",
    when: "2022–24",
    frames: 150,
    kicker: "2022 – 2024 · Veloce Racing",
    headline: "First, I made a race car stick.",
    stats: [
      { value: "300 N", label: "of downforce, from wings I designed and built" },
      { value: "#2", label: "team world rank, Formula Student 2023" },
    ],
    entry: "veloce",
    pal: { bg: "#0b0b0b", fg: "#f5f5f5", accent: "#e10600" },
  },
  {
    id: "diat",
    label: "Bird strike",
    when: "2024",
    frames: 150,
    kicker: "2024 · DIAT, DRDO",
    headline: "Then I simulated birds hitting wings.",
    stats: [
      { value: "500 m/s", label: "impact on a composite wing" },
      { value: "−30%", label: "deformation after re-stacking the laminate" },
    ],
    entry: "diat",
    pal: { bg: "#050d1a", fg: "#e6efff", accent: "#3da5ff" },
  },
  {
    id: "crompton",
    label: "Surrogate",
    when: "2025",
    frames: 156,
    kicker: "2025 · Crompton",
    headline: "Then ten simulations were enough.",
    stats: [
      { value: "3,000+", label: "fan designs screened by a model trained on 10 runs" },
      { value: "−15%", label: "drive power" },
    ],
    entry: "crompton",
    pal: { bg: "#e9f3f1", fg: "#062925", accent: "#0e8c7f" },
  },
  {
    id: "paninian",
    label: "Airframes",
    when: "2025–26",
    frames: 150,
    kicker: "2025 – 2026 · Paninian Aerospace",
    headline: "So I designed airframes faster.",
    stats: [
      { value: "−30%", label: "airframe weight, Mach 0.9 UAVs" },
      { value: "5×", label: "faster design iteration" },
    ],
    entry: "paninian",
    pal: { bg: "#16181b", fg: "#eceef0", accent: "#ff6a13" },
  },
  {
    id: "iisc",
    label: "Physics-ML",
    when: "2026",
    frames: 165,
    kicker: "2026 · IISc Bengaluru",
    headline: "Now I teach machines the physics.",
    stats: [
      { value: "1", label: "solve for a structure’s whole vibration spectrum" },
      { value: "35–50×", label: "faster than iterating" },
    ],
    entry: "iisc",
    pal: { bg: "#f3eee3", fg: "#141a3c", accent: "#2d3fbf" },
  },
  {
    id: "ventures",
    label: "Ventures",
    when: "Now",
    frames: 204,
    kicker: "Now · three ventures",
    headline: "And I point the method at cities and people.",
    stats: [
      { value: "₹9.23 Cr", label: "of civic fixes costed for Pune · Sushaasan" },
      { value: "3", label: "ventures: Sushaasan, RSelf, CarbonDistrict" },
    ],
    entry: "sushaasan",
    pal: { bg: "#fffaf4", fg: "#1b1611", accent: "#ef7a12" },
  },
  {
    id: "outro",
    label: "The method",
    when: "",
    frames: 150,
    kicker: "The method",
    headline: "Model the system. Ship the product.",
    stats: [],
  },
];

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
