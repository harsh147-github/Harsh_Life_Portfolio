import { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { rng } from "./physics";

export type PersonaProps = { bg: string; ink: string; accent: string; twin: string };

const mono = "'JetBrains Mono', ui-monospace, monospace";
const display = "'Inter Tight', sans-serif";
const serif = "'Instrument Serif', Georgia, serif";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);

/* ------------------------------------------------------------------ */
/* A human silhouette as a signed distance field (height 1, x centred) */
/* ------------------------------------------------------------------ */
const cap = (px: number, py: number, ax: number, ay: number, bx: number, by: number, r: number) => {
  const pax = px - ax;
  const pay = py - ay;
  const bax = bx - ax;
  const bay = by - ay;
  const h = Math.min(1, Math.max(0, (pax * bax + pay * bay) / (bax * bax + bay * bay || 1)));
  return Math.hypot(pax - bax * h, pay - bay * h) - r;
};
function body(x: number, y: number) {
  const ax = Math.abs(x);
  return Math.min(
    Math.hypot(x, y - 0.075) - 0.062,
    cap(x, y, 0, 0.13, 0, 0.17, 0.028),
    cap(ax, y, 0, 0.205, 0.1, 0.205, 0.045),
    cap(x, y, 0, 0.215, 0, 0.33, 0.088),
    cap(x, y, 0, 0.33, 0, 0.46, 0.07),
    cap(ax, y, 0, 0.48, 0.045, 0.48, 0.06),
    cap(ax, y, 0.125, 0.215, 0.145, 0.36, 0.033),
    cap(ax, y, 0.145, 0.36, 0.155, 0.5, 0.027),
    Math.hypot(ax - 0.157, y - 0.525) - 0.03,
    cap(ax, y, 0.05, 0.5, 0.056, 0.73, 0.046),
    cap(ax, y, 0.056, 0.73, 0.06, 0.94, 0.034),
    cap(ax, y, 0.055, 0.965, 0.085, 0.97, 0.022),
  );
}

/* ---------------- layout (1600 × 800) ---------------- */
const HX = 120; // human
const HY = 160;
const HH = 460;
const CY = 390;
const LX = [480, 570, 660, 750, 840]; // network layers
const SIZES = [5, 7, 3, 7, 5];
const nodeY = (n: number, i: number) => CY + (i - (n - 1) / 2) * (n === 7 ? 56 : 70);
const FX0 = 890; // function plot
const FX1 = 1070;
const FY0 = 250;
const FY1 = 530;
const TX = 1180; // twin
const TY = 175;
const TH = 430;
const WR = 170; // world radius around the twin
const ORIGIN = { x: TX + 10, y: TY + 0.3 * TH };

const TRAITS: [string, string, number][] = [
  ["O", "Openness", 0.78],
  ["C", "Conscientiousness", 0.64],
  ["E", "Extraversion", 0.52],
  ["A", "Agreeableness", 0.83],
  ["N", "Neuroticism", 0.31],
];
const WORLD: { label: string; sub: string; deg: number }[] = [
  { label: "Dateify", sub: "matchmaking", deg: -48 },
  { label: "LinkedIn_fy", sub: "networking", deg: -16 },
  { label: "Future_fy", sub: "foresight", deg: 16 },
  { label: "Founders & Investors", sub: "growth", deg: 48 },
];
const STAGES = [
  { label: "Personality", a: 0, b: 60 },
  { label: "Extraction Φ", a: 60, b: 160 },
  { label: "Latent function", a: 160, b: 250 },
  { label: "Digital twin", a: 250, b: 330 },
  { label: "Into the world", a: 330, b: 450 },
];
// transitions: traits→input, 4 layer hops, output→function
const T_START = (k: number) => 60 + k * 18;
const T_DUR = 22;

const f = (x: number) => 0.62 * Math.sin(3.4 * x + 0.3) + 0.36 * Math.sin(8.2 * x);
const fx = (x: number) => FX0 + 12 + ((x + 1) / 2) * (FX1 - FX0 - 24);
const fy = (y: number) => (FY0 + FY1) / 2 - (y / 1.15) * ((FY1 - FY0) / 2 - 16);

const dot = (x: number, y: number, r: number) =>
  `M${(x - r).toFixed(1)} ${y.toFixed(1)}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
const quad = (a: { x: number; y: number }, c: { x: number; y: number }, b: { x: number; y: number }, t: number) => ({
  x: (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * c.x + t * t * b.x,
  y: (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * c.y + t * t * b.y,
});

export const PersonaTwin: React.FC<PersonaProps> = ({ bg, ink, accent, twin }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  /* ---------- static geometry ---------- */
  const particles = useMemo(() => {
    const r = rng(10);
    const out: { x: number; y: number; sx: number; sy: number; d: number; hot: boolean }[] = [];
    for (let y = 0.01; y < 0.99; y += 0.017)
      for (let x = -0.2; x <= 0.2; x += 0.017) {
        const jx = x + (r() - 0.5) * 0.006;
        const jy = y + (r() - 0.5) * 0.006;
        if (body(jx, jy) < 0) out.push({ x: jx, y: jy, sx: (r() - 0.5) * 1.3, sy: jy + (r() - 0.5) * 0.5, d: jy * 16 + r() * 8, hot: r() < 0.16 });
      }
    return out;
  }, []);

  const twinGeo = useMemo(() => {
    const rows: { y: number; x0: number; x1: number }[] = [];
    for (let y = 0.012; y < 0.99; y += 0.019) {
      let s: number | null = null;
      for (let x = -0.22; x <= 0.2201; x += 0.003) {
        const inside = body(x, y) < 0;
        if (inside && s === null) s = x;
        if (!inside && s !== null) {
          rows.push({ y, x0: s, x1: x });
          s = null;
        }
      }
    }
    const cols: { x: number; y0: number; y1: number }[] = [];
    for (let x = -0.189; x <= 0.19; x += 0.027) {
      let s: number | null = null;
      for (let y = 0; y <= 1.0001; y += 0.004) {
        const inside = body(x, y) < 0;
        if (inside && s === null) s = y;
        if (!inside && s !== null) {
          cols.push({ x, y0: s, y1: y });
          s = null;
        }
      }
    }
    return { rows, cols };
  }, []);

  const nodes = useMemo(() => SIZES.map((n, l) => Array.from({ length: n }, (_, i) => ({ x: LX[l], y: nodeY(n, i) }))), []);
  const edges = useMemo(() => {
    const out: { k: number; a: { x: number; y: number }; b: { x: number; y: number }; j: number }[] = [];
    const r = rng(3);
    TRAITS.forEach((_, i) => out.push({ k: 0, a: { x: 404, y: nodeY(5, i) }, b: { x: LX[0] - 12, y: nodeY(5, i) }, j: r() }));
    for (let l = 0; l < 4; l++)
      for (const a of nodes[l]) for (const b of nodes[l + 1]) out.push({ k: l + 1, a: { x: a.x + 11, y: a.y }, b: { x: b.x - 11, y: b.y }, j: r() });
    nodes[4].forEach((a) => out.push({ k: 5, a: { x: a.x + 11, y: a.y }, b: { x: FX0, y: a.y }, j: r() }));
    return out;
  }, [nodes]);

  const samples = useMemo(() => {
    const r = rng(77);
    return Array.from({ length: 64 }, (_, i) => {
      const x = -1 + (2 * i) / 63;
      return { x, y: f(x) + (r() - 0.5) * 0.24 };
    });
  }, []);

  const world = useMemo(
    () =>
      WORLD.map((w, i) => {
        const a = (w.deg * Math.PI) / 180;
        const n = { x: TX + WR * Math.cos(a), y: CY + WR * Math.sin(a) };
        return { ...w, n, c: { x: ORIGIN.x + 70, y: n.y }, t0: 335 + i * 12 };
      }),
    [],
  );

  /* ---------- timing ---------- */
  const m = interpolate(frame, [448, 478], [1, 0], clamp); // loop fade
  const fadeIn = (a: number, b: number) => interpolate(frame, [a, b], [0, 1], { ...clamp, easing: ease }) * m;
  const base = Math.min(interpolate(frame, [0, 20], [0, 1], clamp), m);

  /* human particles */
  let pN = "";
  let pH = "";
  particles.forEach((p, i) => {
    const t = ease(interpolate(frame, [p.d, p.d + 40], [0, 1], clamp));
    const wob = 0.0025 * Math.sin(frame * 0.09 + i);
    const x = HX + (p.sx + (p.x - p.sx) * t + wob) * HH;
    const y = HY + (p.sy + (p.y - p.sy) * t) * HH;
    if (p.hot) pH += dot(x, y, 2.6);
    else pN += dot(x, y, 2.2);
  });
  const scanY = interpolate(frame, [18, 58], [HY - 10, HY + HH + 10], clamp);
  const scanO = interpolate(frame, [18, 24, 52, 60], [0, 1, 1, 0], clamp) * m;

  /* network */
  let edgeBase = "";
  let edgeHot = "";
  let pulses = "";
  let idle = "";
  edges.forEach((e, idx) => {
    const seg = `M${e.a.x} ${e.a.y}L${e.b.x} ${e.b.y}`;
    edgeBase += seg;
    const s = T_START(e.k);
    if (frame >= s && frame <= s + T_DUR + 14) edgeHot += seg;
    const t = (frame - s) / T_DUR - e.j * 0.25;
    if (t > 0 && t < 1) {
      const tt = ease(t);
      pulses += dot(e.a.x + (e.b.x - e.a.x) * tt, e.a.y + (e.b.y - e.a.y) * tt, 3.4);
    }
    if (frame > 175 && e.k >= 1 && e.k <= 4 && idx % 3 === 0) {
      const u = ((frame - 175) / 40 + e.j) % 1;
      idle += dot(e.a.x + (e.b.x - e.a.x) * u, e.a.y + (e.b.y - e.a.y) * u, 2.4);
    }
  });
  const hotO = interpolate(frame, [60, 70, 165, 180], [0, 0.55, 0.55, 0], clamp) * m;

  /* function */
  const fit = ease(interpolate(frame, [175, 245], [0, 1], clamp));
  let curve = "";
  for (let i = 0; i <= 120; i++) {
    const x = -1 + (2 * i) / 120;
    curve += `${i ? "L" : "M"}${fx(x).toFixed(1)} ${fy(f(x) * fit).toFixed(1)}`;
  }
  let pts = "";
  samples.forEach((s, i) => {
    if (frame > 160 + i * 0.6) pts += dot(fx(s.x), fy(s.y), 3);
  });

  /* twin */
  const reveal = ease(interpolate(frame, [255, 322], [0, 1], clamp));
  const band = frame < 322 ? reveal : (((frame - 322) / 55) % 1.3) - 0.15;
  let rowsBase = "";
  let rowsHi = "";
  for (const r of twinGeo.rows) {
    if (r.y > reveal) continue;
    const seg = `M${(TX + r.x0 * TH).toFixed(1)} ${(TY + r.y * TH).toFixed(1)}H${(TX + r.x1 * TH).toFixed(1)}`;
    if (Math.abs(r.y - band) < 0.035) rowsHi += seg;
    else rowsBase += seg;
  }
  let cols = "";
  for (const c of twinGeo.cols) {
    if (c.y0 > reveal) continue;
    cols += `M${(TX + c.x * TH).toFixed(1)} ${(TY + c.y0 * TH).toFixed(1)}V${(TY + Math.min(c.y1, reveal) * TH).toFixed(1)}`;
  }
  const twinO = Math.min(interpolate(frame, [250, 262], [0, 1], clamp), m);

  /* world */
  const worldIn = fadeIn(330, 350);
  const ripples = [0, 1, 2].map((j) => {
    const u = (((frame - 335) / 80 + j / 3) % 1 + 1) % 1;
    const rr = 110 + u * 240;
    const a0 = (-58 * Math.PI) / 180;
    const a1 = (58 * Math.PI) / 180;
    return {
      d: `M${TX + rr * Math.cos(a0)} ${CY + rr * Math.sin(a0)}A${rr} ${rr} 0 0 1 ${TX + rr * Math.cos(a1)} ${CY + rr * Math.sin(a1)}`,
      o: (1 - u) * 0.3 * worldIn,
    };
  });

  const stage = STAGES.findIndex((s) => frame >= s.a && frame < s.b);
  const activeStage = stage === -1 ? 4 : stage;

  return (
    <AbsoluteFill style={{ background: bg === "transparent" ? undefined : bg, color: ink, fontFamily: mono }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="pt-scan" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={accent} stopOpacity="0" />
            <stop offset="1" stopColor={accent} stopOpacity="0.28" />
          </linearGradient>
          <radialGradient id="pt-glow">
            <stop offset="0" stopColor={twin} stopOpacity="0.35" />
            <stop offset="1" stopColor={twin} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 01 · personality */}
        <g opacity={base}>
          <path d={pN} fill={ink} fillOpacity={0.82} />
          <path d={pH} fill={accent} />
        </g>
        <g opacity={scanO}>
          <rect x={HX - 110} y={scanY - 70} width={220} height={70} fill="url(#pt-scan)" />
          <line x1={HX - 110} x2={HX + 110} y1={scanY} y2={scanY} stroke={accent} strokeWidth={2} />
        </g>
        {TRAITS.map(([k, name, v], i) => {
          const y = nodeY(5, i);
          const g = ease(interpolate(frame, [25 + i * 5, 55 + i * 5], [0, 1], clamp));
          const link = interpolate(frame, [20 + i * 4, 42 + i * 4], [0, 1], clamp);
          return (
            <g key={k} opacity={m}>
              <path
                d={`M${HX + 62} ${HY + 0.3 * HH}C${HX + 100} ${HY + 0.3 * HH} ${200} ${y} ${226} ${y}`}
                fill="none"
                stroke={ink}
                strokeOpacity={0.25}
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset={1 - link}
              />
              <text x={236} y={y + 10} fontFamily={display} fontWeight={800} fontSize={30} fill={ink} opacity={g}>
                {k}
              </text>
              <text x={272} y={y - 10} fontSize={13} letterSpacing="0.1em" fill={ink} opacity={0.55 * g}>
                {name.toUpperCase()}
              </text>
              <rect x={272} y={y} width={120} height={8} fill={ink} fillOpacity={0.12 * g} />
              <rect x={272} y={y} width={120 * v * g} height={8} fill={accent} />
            </g>
          );
        })}

        {/* 02 · extraction network */}
        <path d={edgeBase} stroke={ink} strokeOpacity={0.1 * base} strokeWidth={1} fill="none" />
        <path d={edgeHot} stroke={accent} strokeOpacity={hotO} strokeWidth={1.4} fill="none" />
        <path d={idle} fill={accent} fillOpacity={0.45 * fadeIn(175, 200)} />
        <path d={pulses} fill={accent} opacity={m} />
        {nodes.map((layer, l) =>
          layer.map((p, i) => {
            const arrive = T_START(l) + T_DUR;
            const lit = frame >= arrive;
            const flash = interpolate(frame, [arrive, arrive + 22], [0, 1], clamp);
            return (
              <g key={`${l}-${i}`} opacity={base}>
                <circle cx={p.x} cy={p.y} r={11} fill={bg === "transparent" ? "#0a0a0a" : bg} stroke={ink} strokeOpacity={0.45} strokeWidth={1.5} />
                {lit && <circle cx={p.x} cy={p.y} r={11} fill={l === 2 ? ink : accent} fillOpacity={l === 2 ? 0.9 : 0.85} />}
                {lit && flash < 1 && <circle cx={p.x} cy={p.y} r={11 + flash * 16} fill="none" stroke={accent} strokeOpacity={1 - flash} strokeWidth={2} />}
              </g>
            );
          }),
        )}
        <g fill={ink} opacity={fadeIn(60, 90)}>
          <text x={660} y={288} textAnchor="middle" fontFamily={serif} fontStyle="italic" fontSize={34}>
            z
          </text>
          <text x={570} y={650} textAnchor="middle" fontFamily={serif} fontStyle="italic" fontSize={38}>
            Φ<tspan fontSize={20} dy={8}>extr</tspan>
          </text>
          <text x={750} y={650} textAnchor="middle" fontFamily={serif} fontStyle="italic" fontSize={38}>
            Φ<tspan fontSize={20} dy={8}>gen</tspan>
          </text>
          <text x={570} y={680} textAnchor="middle" fontSize={14} letterSpacing="0.12em" opacity={0.55}>
            EXTRACTION
          </text>
          <text x={750} y={680} textAnchor="middle" fontSize={14} letterSpacing="0.12em" opacity={0.55}>
            GENERATION
          </text>
        </g>

        {/* 03 · latent function */}
        <g opacity={base}>
          <rect x={FX0} y={FY0} width={FX1 - FX0} height={FY1 - FY0} fill="none" stroke={ink} strokeOpacity={0.25} />
          {[0.25, 0.5, 0.75].map((q) => (
            <line key={q} x1={FX0} x2={FX1} y1={FY0 + q * (FY1 - FY0)} y2={FY0 + q * (FY1 - FY0)} stroke={ink} strokeOpacity={0.07} />
          ))}
        </g>
        <path d={pts} fill={ink} fillOpacity={0.5 * m} />
        {frame > 170 && <path d={curve} fill="none" stroke={accent} strokeWidth={4} strokeLinejoin="round" opacity={m} />}
        <g fill={ink} opacity={fadeIn(160, 190)}>
          <text x={(FX0 + FX1) / 2} y={590} textAnchor="middle" fontFamily={serif} fontStyle="italic" fontSize={40}>
            f(z)
          </text>
          <text x={(FX0 + FX1) / 2} y={620} textAnchor="middle" fontSize={14} letterSpacing="0.12em" opacity={0.55}>
            COMPATIBILITY OPERATOR
          </text>
        </g>
        {(() => {
          const t = interpolate(frame, [245, 262], [0, 1], clamp);
          return t > 0 && t < 1 ? <path d={dot(FX1 + t * 40, CY, 4)} fill={twin} /> : null;
        })()}

        {/* 04 · digital twin */}
        <g opacity={twinO}>
          <ellipse cx={TX} cy={CY} rx={150} ry={250} fill="url(#pt-glow)" opacity={reveal} />
          <path d={cols} stroke={twin} strokeOpacity={0.22} strokeWidth={1} fill="none" />
          <path d={rowsBase} stroke={twin} strokeOpacity={0.7} strokeWidth={1.6} fill="none" strokeLinecap="round" />
          <path d={rowsHi} stroke={ink} strokeWidth={2.4} fill="none" strokeLinecap="round" />
        </g>

        {/* 05 · into the world */}
        <g opacity={worldIn}>
          {ripples.map((r, i) => (
            <path key={i} d={r.d} fill="none" stroke={twin} strokeOpacity={r.o} strokeWidth={1.2} />
          ))}
          <path
            d={`M${TX + WR * Math.cos(-1.05)} ${CY + WR * Math.sin(-1.05)}A${WR} ${WR} 0 0 1 ${TX + WR * Math.cos(1.05)} ${CY + WR * Math.sin(1.05)}`}
            fill="none"
            stroke={ink}
            strokeOpacity={0.2}
            strokeDasharray="3 7"
          />
          <path d={dot(ORIGIN.x, ORIGIN.y, 5 + Math.sin(frame * 0.2) * 1.2)} fill={twin} />
        </g>
        {world.map((w, i) => {
          const draw = ease(interpolate(frame, [w.t0, w.t0 + 28], [0, 1], clamp));
          const on = frame >= w.t0 + 28;
          const flash = interpolate(frame, [w.t0 + 28, w.t0 + 52], [0, 1], clamp);
          const pulseT = on ? (((frame - w.t0 - 28) / 45 + i * 0.25) % 1) : draw;
          const pp = quad(ORIGIN, w.c, w.n, pulseT);
          const lab = fadeIn(w.t0 + 22, w.t0 + 44);
          return (
            <g key={w.label} opacity={m}>
              <path
                d={`M${ORIGIN.x} ${ORIGIN.y}Q${w.c.x} ${w.c.y} ${w.n.x} ${w.n.y}`}
                fill="none"
                stroke={twin}
                strokeOpacity={0.5}
                strokeWidth={1.5}
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset={1 - draw}
              />
              {draw > 0 && draw < 1 || on ? <path d={dot(pp.x, pp.y, 3.6)} fill={twin} /> : null}
              {on && <circle cx={w.n.x} cy={w.n.y} r={9} fill={twin} />}
              {on && flash < 1 && <circle cx={w.n.x} cy={w.n.y} r={9 + flash * 22} fill="none" stroke={twin} strokeOpacity={1 - flash} strokeWidth={2} />}
              <g opacity={lab} transform={`translate(${(1 - lab) * -10} 0)`}>
                <text x={w.n.x + 22} y={w.n.y + 2} fontFamily={display} fontWeight={700} fontSize={22} fill={ink} dominantBaseline="middle">
                  {w.label}
                </text>
                <text x={w.n.x + 22} y={w.n.y + 26} fontSize={13} letterSpacing="0.12em" fill={ink} opacity={0.55}>
                  {w.sub.toUpperCase()}
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      {/* header */}
      <div style={{ position: "absolute", left: 60, top: 44, fontSize: 20, letterSpacing: "0.08em" }}>
        <span style={{ color: accent }}>●</span> RSELF · FROM PERSONALITY TO DIGITAL TWIN
      </div>
      <div style={{ position: "absolute", right: 60, top: 44, fontSize: 20, letterSpacing: "0.08em" }}>
        STAGE <span style={{ color: accent }}>{String(activeStage + 1).padStart(2, "0")}</span> / 05
      </div>

      {/* stage ticker */}
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 34, display: "flex", gap: 18 }}>
        {STAGES.map((s, i) => {
          const p = interpolate(frame, [s.a, s.b], [0, 1], clamp);
          const active = i === activeStage;
          return (
            <div key={s.label} style={{ flex: 1 }}>
              <div style={{ height: 3, background: `${ink}22`, position: "relative" }}>
                <div style={{ position: "absolute", inset: 0, width: `${p * 100}%`, background: i >= 3 ? twin : accent }} />
              </div>
              <div style={{ marginTop: 12, fontSize: 18, letterSpacing: "0.04em", opacity: active ? 1 : 0.45 }}>
                <span style={{ color: i >= 3 ? twin : accent }}>{String(i + 1).padStart(2, "0")}</span> {s.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
