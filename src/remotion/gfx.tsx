// Small animated graphics, one per chapter of the story. Each draws into a 1000 × 800
// SVG viewBox and takes a local frame `f`, so the story reel and the work cards can
// share them. All are deterministic functions of `f`.
import { useMemo } from "react";
import { Easing, interpolate } from "remotion";
import { body } from "./body";
import { gpPosterior, rng } from "./physics";

export type Pal = { bg: string; fg: string; accent: string };
/** `steady` skips the entrance so the graphic can loop seamlessly on a card */
export type G = { f: number; pal: Pal; steady?: boolean };

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ez = Easing.bezier(0.22, 1, 0.36, 1);
/** eased 0→1 between frames a and b */
export const ip = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...cl, easing: ez });
const lin = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], cl);
const smooth = (t: number) => {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
};
const dot = (x: number, y: number, r: number) =>
  `M${(x - r).toFixed(1)} ${y.toFixed(1)}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;

/* ------------------------------------------------------------------ */
/* Veloce: air around an inverted race-car wing, and the downforce      */
/* ------------------------------------------------------------------ */
const WING = "M300 410 C 330 356, 520 346, 700 326 C 580 420, 410 468, 322 440 C 306 432, 298 420, 300 410 Z";
const FLAP = "M716 300 C 740 268, 812 236, 884 196 C 836 276, 778 318, 726 322 C 716 318, 712 308, 716 300 Z";

export function GfxWing({ f, pal, steady }: G) {
  const lines = useMemo(() => {
    const out: { d: string; fast: boolean }[] = [];
    for (let k = 0; k < 14; k++) {
      const y0 = 120 + k * 44;
      let d = "";
      for (let x = -20; x <= 1020; x += 20) {
        const up = smooth((x - 380) / 380);
        const A = 150 * Math.exp(-(((y0 - 360) / 230) ** 2));
        const bump = Math.exp(-(((x - 500) / 190) ** 2)) * Math.exp(-(((y0 - 400) / 110) ** 2));
        const y = y0 - A * up + (y0 < 400 ? -46 : 46) * bump;
        d += `${x === -20 ? "M" : "L"}${x} ${y.toFixed(1)}`;
      }
      out.push({ d, fast: y0 > 410 && y0 < 580 });
    }
    return out;
  }, []);
  const show = steady ? 1 : lin(f, 0, 18);
  const force = steady ? 1 : ip(f, 34, 78);
  return (
    <g>
      {lines.map((l, i) => (
        <path
          key={i}
          d={l.d}
          fill="none"
          stroke={l.fast ? pal.accent : pal.fg}
          strokeOpacity={(l.fast ? 0.95 : 0.4) * show}
          strokeWidth={l.fast ? 4 : 2.5}
          strokeLinecap="round"
          strokeDasharray="46 34"
          strokeDashoffset={-f * (l.fast ? 9 : 5)}
        />
      ))}
      <path d={WING} fill={pal.fg} />
      <path d={FLAP} fill={pal.fg} />
      {/* downforce */}
      <g opacity={force}>
        <line x1={500} x2={500} y1={476} y2={476 + 150 * force} stroke={pal.accent} strokeWidth={9} />
        <path d={`M500 ${500 + 150 * force} l-22 -34 h44 z`} fill={pal.accent} />
      </g>
      {/* the road */}
      <line x1={0} x2={1000} y1={742} y2={742} stroke={pal.fg} strokeOpacity={0.5} strokeWidth={3} strokeDasharray="60 40" strokeDashoffset={-f * 14} />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* DIAT: a bird (SPH particles) hits a composite leading edge           */
/* ------------------------------------------------------------------ */
const noseX = (y: number) => 560 + ((y - 400) / 190) ** 2 * 440;
const IMPACT = 52;

export function GfxStrike({ f, pal }: G) {
  const bird = useMemo(() => {
    const r = rng(11);
    return Array.from({ length: 120 }, () => {
      const a = r() * Math.PI * 2;
      const rad = Math.sqrt(r());
      const py = 400 + Math.sin(a) * rad * 54;
      const px = -70 + Math.cos(a) * rad * 96;
      return { px, py, th: (noseX(py) - px) / 12, r1: r(), r2: r(), s: r() < 0.5 ? -1 : 1 };
    });
  }, []);
  const restack = ip(f, 100, 132);
  const dent = ip(f, IMPACT, IMPACT + 8) * 36 * (1 - 0.3 * restack);
  const ply = (off: number) => {
    let d = "";
    for (let y = 208; y <= 592; y += 8) d += `${y === 208 ? "M" : "L"}${(noseX(y) + off + dent * Math.exp(-(((y - 400) / 72) ** 2))).toFixed(1)} ${y}`;
    return d;
  };
  let free = "";
  let splash = "";
  for (const p of bird) {
    if (f < p.th) {
      free += dot(p.px + 12 * f, p.py, 5);
      continue;
    }
    const t = f - p.th;
    const sgn = Math.abs(p.py - 400) < 8 ? p.s : Math.sign(p.py - 400);
    const y = p.py + sgn * 150 * (1 - Math.exp(-t / 16)) * (0.5 + p.r1);
    if (y < 214 || y > 586) continue;
    const x = noseX(y) - 8 - (16 + 90 * p.r2) * (1 - Math.exp(-t / 12));
    splash += dot(x, y, Math.max(2, 5 - t / 30));
  }
  const splashO = interpolate(f, [IMPACT, IMPACT + 70, IMPACT + 100], [1, 0.75, 0.3], cl);
  return (
    <g>
      {/* the wing section, filled faintly */}
      <path d={`${ply(0)} L1000 592 L1000 208 Z`} fill={pal.fg} fillOpacity={0.07} />
      {[0, 16, 32, 48].map((off, i) => {
        const hot = lin(f, 100 + i * 8, 110 + i * 8);
        return <path key={off} d={ply(off)} fill="none" stroke={hot > 0 ? pal.accent : pal.fg} strokeOpacity={i === 0 ? 1 : 0.35 + 0.65 * hot} strokeWidth={i === 0 ? 5 : 3} />;
      })}
      {/* shock waves through the structure */}
      {[0, 1, 2].map((j) => {
        const r = (f - IMPACT - j * 9) * 9;
        if (r <= 0 || r > 400) return null;
        const a = 1.15;
        return (
          <path
            key={j}
            d={`M${600 + r * Math.cos(-a)} ${400 + r * Math.sin(-a)}A${r} ${r} 0 0 1 ${600 + r * Math.cos(a)} ${400 + r * Math.sin(a)}`}
            fill="none"
            stroke={pal.accent}
            strokeWidth={3}
            strokeOpacity={0.8 * (1 - r / 400)}
          />
        );
      })}
      {/* speed lines, then the bird */}
      {f < IMPACT &&
        [352, 400, 448].map((y, i) => (
          <line key={y} x1={-260 + 12 * f - i * 30} x2={-150 + 12 * f - i * 30} y1={y} y2={y} stroke={pal.fg} strokeOpacity={0.35} strokeWidth={3} strokeLinecap="round" />
        ))}
      <path d={free} fill={pal.fg} />
      <path d={splash} fill={pal.accent} fillOpacity={splashO} />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Crompton: a Gaussian process learns from ten expensive simulations   */
/* ------------------------------------------------------------------ */
const truth = (x: number) => 0.92 - 0.38 * Math.exp(-(((x - 0.63) / 0.13) ** 2)) + 0.09 * Math.sin(8.5 * x) + 0.08 * x;
const RUNS = [0.06, 0.94, 0.5, 0.27, 0.74, 0.16, 0.6, 0.39, 0.84, 0.67];
const GRID = Array.from({ length: 81 }, (_, i) => i / 80);

export function GfxSurrogate({ f, pal }: G) {
  const shown = Math.max(1, Math.min(RUNS.length, Math.floor((f - 4) / 8) + 1));
  const post = useMemo(() => {
    const xs = RUNS.slice(0, shown);
    return gpPosterior(xs, xs.map(truth), GRID, 0.11, 0.28, 1e-5);
  }, [shown]);
  const cands = useMemo(() => {
    const r = rng(7);
    return Array.from({ length: 64 }, () => r());
  }, []);
  const X = (x: number) => 90 + x * 850;
  const Y = (y: number) => 640 - ((y - 0.35) / 0.85) * 520;
  const mean = post.map((p, i) => `${i ? "L" : "M"}${X(GRID[i]).toFixed(1)} ${Y(p.m).toFixed(1)}`).join("");
  const band =
    post.map((p, i) => `${i ? "L" : "M"}${X(GRID[i]).toFixed(1)} ${Y(p.m + 2 * p.s).toFixed(1)}`).join("") +
    [...post].reverse().map((p, i) => `L${X(GRID[80 - i]).toFixed(1)} ${Y(p.m - 2 * p.s).toFixed(1)}`).join("") +
    "Z";
  const sweep = lin(f, 92, 128);
  const best = GRID.reduce((b, _x, i) => (post[i].m < post[b].m ? i : b), 0);
  const found = ip(f, 124, 140);
  return (
    <g>
      <path d="M90 120V640H940" fill="none" stroke={pal.fg} strokeOpacity={0.4} strokeWidth={3} />
      <path d={band} fill={pal.accent} fillOpacity={0.2} />
      <path d={mean} fill="none" stroke={pal.accent} strokeWidth={6} strokeLinejoin="round" />
      {cands.map((x, i) =>
        i / cands.length < sweep ? <line key={i} x1={X(x)} x2={X(x)} y1={640} y2={664} stroke={pal.fg} strokeOpacity={0.55} strokeWidth={3} /> : null,
      )}
      {RUNS.slice(0, shown).map((x, i) => {
        const pop = ip(f, 4 + i * 8, 12 + i * 8);
        return <circle key={x} cx={X(x)} cy={Y(truth(x))} r={13 * pop} fill={pal.bg} stroke={pal.fg} strokeWidth={5} />;
      })}
      {found > 0 && (
        <g opacity={found}>
          <circle cx={X(GRID[best])} cy={Y(post[best].m)} r={20 + 14 * found} fill="none" stroke={pal.accent} strokeWidth={5} />
          <circle cx={X(GRID[best])} cy={Y(post[best].m)} r={8} fill={pal.accent} />
        </g>
      )}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Paninian: an airframe's internal structure, lightened by 30%         */
/* ------------------------------------------------------------------ */
const PLAN: [number, number][] = [
  [500, 60], [548, 150], [590, 300], [950, 600], [925, 668], [610, 640], [560, 720],
  [500, 700], [440, 720], [390, 640], [75, 668], [50, 600], [410, 300], [452, 150],
];
const inside = (x: number, y: number) => {
  let c = false;
  for (let i = 0, j = PLAN.length - 1; i < PLAN.length; j = i++) {
    const [xi, yi] = PLAN[i];
    const [xj, yj] = PLAN[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};
const segDist = (px: number, py: number, ax: number, ay: number, bx: number, by: number) => {
  const t = Math.min(1, Math.max(0, ((px - ax) * (bx - ax) + (py - ay) * (by - ay)) / ((bx - ax) ** 2 + (by - ay) ** 2)));
  return Math.hypot(px - ax - t * (bx - ax), py - ay - t * (by - ay));
};
const BUCKETS = 8;

export function GfxLattice({ f, pal }: G) {
  const mesh = useMemo(() => {
    const r = rng(5);
    const s = 40;
    const edges: { d: string; imp: number }[] = [];
    const add = (x1: number, y1: number, x2: number, y2: number) => {
      if (!inside(x1, y1) || !inside(x2, y2)) return;
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      const spar = Math.min(segDist(mx, my, 500, 330, 925, 630), segDist(mx, my, 500, 330, 75, 630), segDist(mx, my, 500, 80, 500, 700));
      edges.push({ d: `M${x1} ${y1}L${x2} ${y2}`, imp: Math.exp(-spar / 34) + 0.45 * r() });
    };
    for (let x = 60; x <= 940; x += s)
      for (let y = 70; y <= 720; y += s) {
        add(x, y, x + s, y);
        add(x, y, x, y + s);
        if ((x / s + y / s) % 2 === 0) add(x, y, x + s, y + s);
        else add(x + s, y, x, y + s);
      }
    edges.sort((a, b) => a.imp - b.imp);
    const cut = Math.round(edges.length * 0.3);
    const removed = Array.from({ length: BUCKETS }, () => "");
    edges.slice(0, cut).forEach((e, i) => (removed[Math.floor((i / cut) * BUCKETS)] += e.d));
    return { kept: edges.slice(cut).map((e) => e.d).join(""), removed };
  }, []);
  const outline = `M${PLAN.map((p) => p.join(" ")).join("L")}Z`;
  const draw = lin(f, 0, 24);
  const done = ip(f, 104, 130);
  const mass = 100 - 30 * lin(f, 34, 110);
  return (
    <g>
      <path d={outline} fill={pal.fg} fillOpacity={0.06} stroke={pal.fg} strokeWidth={4} strokeLinejoin="round" />
      {mesh.removed.map((d, i) => (
        <path key={i} d={d} stroke={pal.fg} strokeWidth={2} strokeOpacity={0.55 * draw * (1 - lin(f, 34 + i * 9, 46 + i * 9))} fill="none" />
      ))}
      <path d={mesh.kept} stroke={pal.fg} strokeWidth={2 + done} strokeOpacity={0.55 * draw * (1 - done)} fill="none" />
      <path d={mesh.kept} stroke={pal.accent} strokeWidth={2 + done} strokeOpacity={done} fill="none" />
      {/* mass bar */}
      <rect x={300} y={762} width={400} height={10} fill={pal.fg} fillOpacity={0.18} />
      <rect x={300} y={762} width={4 * mass} height={10} fill={pal.accent} />
      <text x={716} y={774} fontFamily="'JetBrains Mono', monospace" fontSize={30} fill={pal.fg}>
        {mass.toFixed(0)}% mass
      </text>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* IISc: a plate's vibration modes, the whole spectrum from one solve   */
/* ------------------------------------------------------------------ */
const MODES: [number, number][] = [[1, 1], [2, 1], [2, 2], [3, 1], [3, 2]];
const SPECTRUM = [2, 5, 5, 8, 10, 10, 13, 13, 17, 17, 18, 20];
const MODE_LEN = 40;

export function GfxModes({ f, pal, steady, modeLen = MODE_LEN }: G & { modeLen?: number }) {
  const idx = Math.floor(f / modeLen) % MODES.length;
  const nxt = (idx + 1) % MODES.length;
  const mix = smooth(((f % modeLen) / modeLen - 0.75) / 0.25);
  const [m1, n1] = MODES[idx];
  const [m2, n2] = MODES[nxt];
  const shape = (x: number, y: number) =>
    (1 - mix) * Math.sin(m1 * Math.PI * x) * Math.sin(n1 * Math.PI * y) + mix * Math.sin(m2 * Math.PI * x) * Math.sin(n2 * Math.PI * y);
  const osc = Math.cos((2 * Math.PI * f) / modeLen);
  const N = 18;
  const amp = 105 * (steady ? 1 : lin(f, 0, 20));
  const P = (x: number, y: number) => {
    const z = shape(x, y) * osc * amp;
    return `${(500 + (x - y) * 0.866 * 430).toFixed(1)} ${(150 + (x + y) * 0.5 * 430 - z).toFixed(1)}`;
  };
  const lines: { d: string; hot: number }[] = [];
  for (let i = 0; i <= N; i++) {
    let a = "";
    let b = "";
    let ha = 0;
    let hb = 0;
    for (let j = 0; j <= N; j++) {
      a += `${j ? "L" : "M"}${P(i / N, j / N)}`;
      b += `${j ? "L" : "M"}${P(j / N, i / N)}`;
      ha = Math.max(ha, Math.abs(shape(i / N, j / N)));
      hb = Math.max(hb, Math.abs(shape(j / N, i / N)));
    }
    lines.push({ d: a, hot: ha }, { d: b, hot: hb });
  }
  const cur = mix > 0.5 ? MODES[nxt] : MODES[idx];
  const curW = cur[0] ** 2 + cur[1] ** 2;
  const flash = steady ? 1 : ip(f, 22, 40);
  return (
    <g>
      {lines.map((l, i) => (
        <path key={i} d={l.d} fill="none" stroke={l.hot > 0.92 ? pal.accent : pal.fg} strokeOpacity={0.3 + 0.6 * l.hot} strokeWidth={l.hot > 0.92 ? 3.5 : 2} />
      ))}
      {/* the spectrum: every natural frequency at once */}
      <line x1={170} x2={840} y1={736} y2={736} stroke={pal.fg} strokeOpacity={0.4} strokeWidth={3} />
      {SPECTRUM.map((w, i) => {
        const on = w === curW;
        const h = (on ? 62 : 38) * flash;
        return <line key={i} x1={190 + (w / 20) * 620 + (i % 2) * 7} x2={190 + (w / 20) * 620 + (i % 2) * 7} y1={736} y2={736 - h} stroke={on ? pal.accent : pal.fg} strokeWidth={on ? 8 : 5} strokeLinecap="round" />;
      })}
      <text x={862} y={746} fontFamily="'Instrument Serif', Georgia, serif" fontStyle="italic" fontSize={40} fill={pal.fg}>
        ω
      </text>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Sushaasan: scattered complaints cluster into costed briefs           */
/* ------------------------------------------------------------------ */
const CENTRES: [number, number][] = [[250, 250], [740, 220], [270, 560], [730, 570]];

export function GfxClusters({ f, pal }: G) {
  const dots = useMemo(() => {
    const r = rng(46);
    return Array.from({ length: 72 }, (_, i) => {
      const c = CENTRES[i % 4];
      const a = r() * 6.283;
      const rad = 20 + r() * 70;
      return { sx: 80 + r() * 840, sy: 90 + r() * 620, cx: c[0] + Math.cos(a) * rad, cy: c[1] + Math.sin(a) * rad * 0.8, j: r() * 14, c: i % 4 };
    });
  }, []);
  let d = "";
  for (const p of dots) {
    const t = ip(f, 26 + p.j, 64 + p.j);
    const fold = ip(f, 70, 86);
    const cx = CENTRES[p.c][0];
    const cy = CENTRES[p.c][1];
    const x = p.sx + (p.cx - p.sx) * t;
    const y = p.sy + (p.cy - p.sy) * t;
    d += dot(x + (cx - x) * fold, y + (cy - y) * fold, 12 * lin(f, p.j, p.j + 10) * (1 - 0.7 * fold));
  }
  return (
    <g>
      <path d={d} fill={f > 40 ? pal.accent : pal.fg} fillOpacity={1 - lin(f, 80, 90)} />
      {CENTRES.map(([x, y], i) => {
        const s = ip(f, 80 + i * 5, 98 + i * 5);
        const sent = ip(f, 112 + i * 6, 124 + i * 6);
        return (
          <g key={i} transform={`translate(${x} ${y}) scale(${s})`} opacity={s}>
            <rect x={-120} y={-80} width={240} height={160} rx={6} fill={pal.bg} stroke={sent > 0.5 ? pal.accent : pal.fg} strokeWidth={5} />
            <rect x={-92} y={-48} width={110} height={14} fill={pal.fg} />
            <rect x={-92} y={-16} width={184} height={9} fill={pal.fg} fillOpacity={0.35} />
            <rect x={-92} y={6} width={150} height={9} fill={pal.fg} fillOpacity={0.35} />
            <text x={-92} y={56} fontFamily="'Inter Tight', sans-serif" fontWeight={800} fontSize={34} fill={pal.accent}>
              ₹
            </text>
            <rect x={-62} y={38} width={70} height={14} fill={pal.accent} />
            <path d="M58 44l14 14l28 -30" fill="none" stroke={pal.accent} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - sent} />
          </g>
        );
      })}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* RSelf: half a person, half their digital twin                        */
/* ------------------------------------------------------------------ */
export function GfxTwin({ f, pal, steady }: G) {
  const geo = useMemo(() => {
    const H = 700;
    const X = (x: number) => 500 + x * H;
    const Y = (y: number) => 50 + y * H;
    let dots = "";
    for (let y = 0.012; y < 0.99; y += 0.02) for (let x = -0.21; x < -0.004; x += 0.02) if (body(x, y) < 0) dots += dot(X(x), Y(y), 4.6);
    const rows: { y: number; d: string }[] = [];
    for (let y = 0.012; y < 0.99; y += 0.02) {
      let s: number | null = null;
      let d = "";
      for (let x = 0.004; x <= 0.2201; x += 0.004) {
        const inb = body(x, y) < 0;
        if (inb && s === null) s = x;
        if (!inb && s !== null) {
          d += `M${X(s).toFixed(1)} ${Y(y).toFixed(1)}H${X(x).toFixed(1)}`;
          s = null;
        }
      }
      if (d) rows.push({ y, d });
    }
    return { dots, rows, Y };
  }, []);
  const reveal = steady ? 1 : ip(f, 8, 70);
  const band = ((f / 80) % 1) * 1.2 - 0.1;
  let base = "";
  let hot = "";
  for (const r of geo.rows) {
    if (r.y > reveal) continue;
    if (Math.abs(r.y - band) < 0.04) hot += r.d;
    else base += r.d;
  }
  return (
    <g>
      <path d={geo.dots} fill={pal.fg} fillOpacity={0.9 * (steady ? 1 : lin(f, 0, 16))} />
      <line x1={500} x2={500} y1={30} y2={770} stroke={pal.fg} strokeOpacity={0.3} strokeWidth={2} strokeDasharray="4 10" />
      <path d={base} stroke={pal.accent} strokeWidth={4} strokeLinecap="round" fill="none" />
      <path d={hot} stroke={pal.fg} strokeWidth={5.5} strokeLinecap="round" fill="none" />
      <line x1={500} x2={760} y1={geo.Y(band)} y2={geo.Y(band)} stroke={pal.accent} strokeOpacity={band > 0 && band < reveal ? 0.5 : 0} strokeWidth={2} />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* CarbonDistrict: a 2×2 twill weave                                    */
/* ------------------------------------------------------------------ */
export function GfxWeave({ f, pal, steady }: G) {
  const cells = useMemo(() => {
    const out: { x: number; y: number; over: boolean; k: number }[] = [];
    const s = 50;
    for (let i = 0; i < 14; i++) for (let j = 0; j < 12; j++) out.push({ x: 150 + i * s, y: 100 + j * s, over: (((i - j) % 4) + 4) % 4 < 2, k: i + j });
    return out;
  }, []);
  const pos = ((f / 80) % 1) * 34 - 4;
  const show = steady ? 1 : lin(f, 0, 20);
  return (
    <g>
      {cells.map((c, i) => {
        const glint = Math.exp(-(((c.k - pos) / 2.2) ** 2));
        return (
          <rect
            key={i}
            x={c.x + (c.over ? 5 : 2)}
            y={c.y + (c.over ? 2 : 5)}
            width={c.over ? 40 : 46}
            height={c.over ? 46 : 40}
            rx={7}
            fill={glint > 0.35 ? pal.accent : pal.fg}
            fillOpacity={(c.over ? 0.82 : 0.34) * show + 0.18 * glint}
          />
        );
      })}
    </g>
  );
}
