import { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { rng } from "./physics";

export type OperatorProps = { ink: string; accent: string };

const mono = "'JetBrains Mono', ui-monospace, monospace";
const serif = "'Instrument Serif', Georgia, serif";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);

/* turbo-like colormap that reads on light and dark backgrounds */
const CMAP = ["#3b2e8f", "#3f7ee8", "#1fc2c1", "#8fe04d", "#f5c330", "#f2671f", "#b51d14"];
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const CM = CMAP.map(hex);
function cmap(v: number) {
  const x = Math.min(0.9999, Math.max(0, v)) * (CM.length - 1);
  const i = Math.floor(x);
  const f = x - i;
  const c = CM[i].map((a, j) => Math.round(a + (CM[i + 1][j] - a) * f));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

/* ---------------- layout (1600 × 720) ---------------- */
const NS = 12; // spanwise panels
const NT = 5; // chordwise panels
const TRAIN_END = 150;
const INFER_END = 570;
const BLOCKS = [600, 740, 880]; // Fourier layer x positions (width 120)
const BY0 = 210;
const BY1 = 410;
const KMAX = 8;

type Design = { sweep: number; taper: number; q: number };
const designAt = (u: number): Design => ({
  sweep: (18 + 14 * Math.sin(2 * Math.PI * u)) * (Math.PI / 180),
  taper: 0.45 + 0.18 * Math.sin(2 * Math.PI * 2 * u + 1) - 0.18 * Math.sin(1),
  q: 1 + 0.35 * Math.sin(2 * Math.PI * 3 * u),
});

/** cantilever wing: bending stress ∝ (1−s)², tip deflection ∝ s²(6−4s+s²) */
const stress = (s: number, t: number, d: Design) => d.q * (1 - s) ** 2 * (0.85 + 0.3 * Math.sin(Math.PI * t)) * (1 + 0.25 * (1 - d.taper));
const deflect = (s: number, d: Design) => (d.q * 0.075 * s * s * (6 - 4 * s + s * s)) / 3;

export const NeuralOperator: React.FC<OperatorProps> = ({ ink, accent }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const noise = useMemo(() => {
    const r = rng(5);
    return Array.from({ length: NS * NT }, () => r() * 20);
  }, []);
  const specBase = useMemo(() => Array.from({ length: 12 }, (_, k) => Math.exp(-k / 3.6) * (0.75 + 0.25 * Math.cos(k * 1.7))), []);

  /* ---------- phase ---------- */
  const training = frame < TRAIN_END;
  const conv = ease(interpolate(frame, [10, 140], [0, 1], clamp)) * interpolate(frame, [INFER_END, 598], [1, 0], clamp);
  const u = interpolate(frame, [TRAIN_END, INFER_END], [0, 1], clamp);
  const d = designAt(u);
  const designNo = Math.max(1, Math.floor(u * 420));
  const epoch = Math.floor(interpolate(frame, [0, TRAIN_END], [0, 2000], clamp));
  const enter = (a: number, b: number) => interpolate(frame, [a, b], [0, 1], { ...clamp, easing: ease });

  /* ---------- wing geometry ---------- */
  const wing = (ox: number, oy: number, k: number, withDeflection: boolean) => {
    const P = (s: number, t: number) => {
      const c = 0.42 * (1 - (1 - d.taper) * s);
      const X = s * Math.tan(d.sweep) + t * c;
      const Y = s;
      const Z = withDeflection ? deflect(s, d) * (0.2 + 0.8 * conv) : 0;
      return { x: ox + (Y * 0.92 + X * 0.42) * k, y: oy + (-Y * 0.36 + X * 0.5) * k - Z * k };
    };
    return P;
  };
  const W1 = wing(52, 372, 318, false);
  const W3 = wing(1124, 372, 318, true);

  const quads = (P: (s: number, t: number) => { x: number; y: number }) => {
    const out: { pts: string; s: number; t: number; i: number }[] = [];
    for (let i = 0; i < NS; i++)
      for (let j = 0; j < NT; j++) {
        const s0 = i / NS;
        const s1 = (i + 1) / NS;
        const t0 = j / NT;
        const t1 = (j + 1) / NT;
        const c = [P(s0, t0), P(s1, t0), P(s1, t1), P(s0, t1)];
        out.push({ pts: c.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" "), s: (s0 + s1) / 2, t: (t0 + t1) / 2, i: i * NT + j });
      }
    return out;
  };
  const q1 = quads(W1);
  const q3 = quads(W3);
  const sMax = stress(0, 0.5, d);

  /* load arrows (elliptic lift) */
  const arrows = [0.12, 0.28, 0.44, 0.6, 0.76, 0.9].map((s) => {
    const p = W1(s, 0.5);
    const L = 18 + 46 * d.q * Math.sqrt(1 - s * s);
    return { x: p.x, y0: p.y + 10 + L, y1: p.y + 10 };
  });

  /* signal particles through the operator */
  let parts = "";
  for (let i = 0; i < 26; i++) {
    const x = 500 + (((frame * 3.2 + i * 23) % 600) + 600) % 600;
    if (x > 1100) continue;
    const y = 310 + Math.sin(x / 38 + i) * 6;
    parts += `M${x - 3} ${y}a3 3 0 1 0 6 0a3 3 0 1 0 -6 0`;
  }

  /* loss curve */
  let loss = "";
  const lossDraw = interpolate(frame, [0, TRAIN_END], [0, 1], clamp);
  for (let i = 0; i <= 80 * lossDraw; i++) {
    const e = i / 80;
    const v = Math.log10(0.9 * Math.exp(-6 * e) + 0.004 + 0.02 * Math.exp(-3 * e) * Math.abs(Math.sin(i * 1.3)));
    const x = 810 + e * 240;
    const y = 470 + ((v - 0) / -2.5) * 110;
    loss += `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  const lossO = interpolate(frame, [INFER_END, 595], [1, 0.25], clamp);

  return (
    <AbsoluteFill style={{ color: ink, fontFamily: mono }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="no-cbar" x1="0" x2="0" y1="1" y2="0">
            {CMAP.map((c, i) => (
              <stop key={c} offset={i / (CMAP.length - 1)} stopColor={c} />
            ))}
          </linearGradient>
          <marker id="no-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" fill={accent} />
          </marker>
        </defs>

        {/* panel frames */}
        {[
          [40, 480, "01  GEOMETRY + LOADS"],
          [520, 1080, "02  NEURAL OPERATOR  Gθ"],
          [1120, 1560, "03  PREDICTED STRESS FIELD"],
        ].map(([a, b, t], i) => (
          <g key={i} opacity={enter(i * 8, i * 8 + 24)}>
            <line x1={a as number} x2={b as number} y1={100} y2={100} stroke={ink} strokeOpacity={0.25} />
            <text x={a as number} y={88} fontSize={18} letterSpacing="0.1em" fill={ink}>
              {t}
            </text>
          </g>
        ))}

        {/* 01 · geometry + loads */}
        <g opacity={enter(0, 30)}>
          {q1.map((q) => (
            <polygon key={q.i} points={q.pts} fill={ink} fillOpacity={0.04} stroke={ink} strokeOpacity={0.55} strokeWidth={1.1} />
          ))}
          {arrows.map((a, i) => (
            <line key={i} x1={a.x} x2={a.x} y1={a.y0} y2={a.y1} stroke={accent} strokeWidth={2.2} markerEnd="url(#no-arrow)" />
          ))}
          <text x={40} y={600} fontSize={17} fill={ink} opacity={0.7}>
            {`sweep ${((d.sweep * 180) / Math.PI).toFixed(0).padStart(2, " ")}°  ·  taper ${d.taper.toFixed(2)}  ·  load ${d.q.toFixed(2)}q`}
          </text>
          <text x={40} y={628} fontSize={15} fill={ink} opacity={0.45}>
            composite wing · cantilever at the root · lift loads
          </text>
        </g>

        {/* flow: panel 1 → operator → panel 3 */}
        <g opacity={enter(20, 50)}>
          <line x1={470} x2={1110} y1={310} y2={310} stroke={ink} strokeOpacity={0.18} strokeDasharray="4 8" />
          <path d={parts} fill={accent} fillOpacity={0.85} />
        </g>

        {/* 02 · operator blocks */}
        <g opacity={enter(15, 45)}>
          {/* lift P and projection Q */}
          {[
            [540, "P", "lift"],
            [1030, "Q", "project"],
          ].map(([x, l, s]) => (
            <g key={l as string}>
              <rect x={x as number} y={250} width={34} height={120} rx={4} fill={ink} fillOpacity={0.9} />
              <text x={(x as number) + 17} y={318} textAnchor="middle" fontFamily={serif} fontStyle="italic" fontSize={28} fill={ink === "#0a0a0a" ? "#fafaf8" : "#0a0a0a"}>
                {l}
              </text>
              <text x={(x as number) + 17} y={392} textAnchor="middle" fontSize={13} fill={ink} opacity={0.55}>
                {s}
              </text>
            </g>
          ))}
          {BLOCKS.map((bx, li) => {
            const wob = training ? 1 - conv : 0;
            return (
              <g key={bx}>
                <rect x={bx} y={BY0} width={120} height={BY1 - BY0} rx={6} fill={ink} fillOpacity={0.05} stroke={ink} strokeOpacity={0.45} />
                <text x={bx + 10} y={BY0 + 24} fontSize={14} fill={ink} opacity={0.7}>
                  Fourier {li + 1}
                </text>
                <text x={bx + 10} y={BY0 + 50} fontFamily={serif} fontStyle="italic" fontSize={20} fill={ink}>
                  𝓕⁻¹(R·𝓕v)
                </text>
                {specBase.map((b, k) => {
                  const live = b * (1 + 0.28 * Math.sin(2 * Math.PI * (k + 1) * u + li) * (training ? 0 : 1)) * (1 + 0.5 * wob * Math.sin(frame * 0.7 + k * 3 + li));
                  const h = Math.max(2, live * 110);
                  const x = bx + 10 + k * 8.5;
                  return <rect key={k} x={x} y={BY1 - 16 - h} width={6} height={h} fill={k < KMAX ? accent : ink} fillOpacity={k < KMAX ? 0.9 : 0.18} />;
                })}
                <line x1={bx + 10 + KMAX * 8.5 - 1.2} x2={bx + 10 + KMAX * 8.5 - 1.2} y1={BY0 + 84} y2={BY1 - 12} stroke={ink} strokeOpacity={0.5} strokeDasharray="3 4" />
                <text x={bx + 10 + KMAX * 8.5 + 2} y={BY0 + 96} fontSize={11} fill={ink} opacity={0.6}>
                  k≤{KMAX}
                </text>
                {/* skip connection W */}
                <path d={`M${bx - 8} ${BY1 - 30} V${BY1 + 22} H${bx + 128} V${BY1 - 30}`} fill="none" stroke={ink} strokeOpacity={0.35} />
                <text x={bx + 60} y={BY1 + 40} textAnchor="middle" fontFamily={serif} fontStyle="italic" fontSize={18} fill={ink} opacity={0.8}>
                  + Wv
                </text>
              </g>
            );
          })}
        </g>

        {/* physics-informed loss */}
        <g opacity={enter(40, 70) * lossO}>
          <text x={545} y={505} fontFamily={serif} fontStyle="italic" fontSize={40} fill={ink}>
            D ∇⁴w = q
          </text>
          <text x={545} y={535} fontSize={14} fill={ink} opacity={0.6}>
            plate-bending physics,
          </text>
          <text x={545} y={555} fontSize={14} fill={ink} opacity={0.6}>
            enforced in the loss
          </text>
          <line x1={810} x2={810} y1={460} y2={590} stroke={ink} strokeOpacity={0.3} />
          <line x1={810} x2={1060} y1={590} y2={590} stroke={ink} strokeOpacity={0.3} />
          <path d={loss} fill="none" stroke={accent} strokeWidth={3} />
          <text x={1060} y={612} textAnchor="end" fontSize={13} fill={ink} opacity={0.6}>
            L = L_data + λ·L_physics (log)
          </text>
        </g>

        {/* 03 · predicted field */}
        <g opacity={enter(25, 55)}>
          {q3.map((q) => {
            const truth = stress(q.s, q.t, d) / sMax;
            const n = 0.5 + 0.5 * Math.sin(frame * 0.25 + noise[q.i]);
            const v = truth * conv + n * (1 - conv);
            return <polygon key={q.i} points={q.pts} fill={cmap(v)} stroke={ink} strokeOpacity={0.25} strokeWidth={0.8} />;
          })}
          <rect x={1528} y={150} width={14} height={320} fill="url(#no-cbar)" />
          <text x={1520} y={160} textAnchor="end" fontSize={13} fill={ink} opacity={0.7}>
            σ max
          </text>
          <text x={1520} y={470} textAnchor="end" fontSize={13} fill={ink} opacity={0.7}>
            0
          </text>
          <text x={1120} y={600} fontSize={17} fill={ink} opacity={0.7}>
            {training ? "learning the physics…" : "full field · one forward pass"}
          </text>
          <text x={1120} y={628} fontSize={15} fill={ink} opacity={0.45}>
            stress peaks at the root, deflection at the tip
          </text>
        </g>
      </svg>

      {/* header */}
      <div style={{ position: "absolute", left: 40, top: 26, fontSize: 18, letterSpacing: "0.08em" }}>
        <span style={{ color: accent }}>●</span> PHYSICS-INFORMED NEURAL OPERATOR · AEROSTRUCTURES
      </div>
      <div style={{ position: "absolute", right: 40, top: 26, fontSize: 18, letterSpacing: "0.08em", textAlign: "right" }}>
        {training ? (
          <>
            TRAINING · epoch <span style={{ color: accent }}>{epoch.toLocaleString("en-IN")}</span>
          </>
        ) : (
          <>
            INFERENCE · design <span style={{ color: accent }}>#{String(designNo).padStart(4, "0")}</span>
          </>
        )}
      </div>
      <div style={{ position: "absolute", left: 40, right: 40, bottom: 26, display: "flex", justifyContent: "space-between", fontSize: 16, opacity: 0.6 }}>
        <span>PINNs · neural operators · physics-informed surrogates</span>
        <span>illustrative model · cantilever-wing bending</span>
      </div>
    </AbsoluteFill>
  );
};
