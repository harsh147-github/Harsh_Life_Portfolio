import { useMemo } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { rng } from "./physics";

export type TwinProps = { bg: string; ink: string; accent: string };

const mono = "'JetBrains Mono', ui-monospace, monospace";
const display = "'Inter Tight', sans-serif";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const TwinMatch: React.FC<TwinProps> = ({ bg, ink, accent }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const data = useMemo(() => {
    const r = rng(224);
    const truth = Array.from({ length: 10 }, () => 0.3 + r() * 0.65);
    const cands = Array.from({ length: 6 }, (_, i) => {
      const t = 0.25 + r() * 0.7;
      return { id: `#${(1000 + Math.floor(r() * 8999)).toString()}`, truth: t, prior: Math.min(0.95, Math.max(0.08, t + (r() - 0.5) * 0.55)), k: i };
    });
    return { truth, cands };
  }, []);

  const reactions = interpolate(frame, [40, 270], [0, 20], clamp);
  const learn = reactions / 20;
  const rho = 0.59 + (0.73 - 0.59) * learn;

  // radar
  const cx = 330;
  const cy = 470;
  const RR = 220;
  const est = data.truth.map((v) => 0.55 + (v - 0.55) * learn * 0.92);
  const poly = (vals: number[]) =>
    vals
      .map((v, i) => {
        const a = -Math.PI / 2 + (i / vals.length) * Math.PI * 2;
        return `${(cx + Math.cos(a) * RR * v).toFixed(1)},${(cy + Math.sin(a) * RR * v).toFixed(1)}`;
      })
      .join(" ");
  const enter = (d: number) => spring({ frame: frame - d, fps, config: { damping: 200 }, durationInFrames: 30 });

  const barsX = 640;
  const barsW = 440;
  const ladder = ["Simulator", "LLM rehearsal", "Real date"];

  return (
    <AbsoluteFill style={{ background: bg, color: ink, fontFamily: mono }}>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {[0.25, 0.5, 0.75, 1].map((s) => (
          <polygon key={s} points={poly(new Array(10).fill(s))} fill="none" stroke={ink} strokeOpacity={0.15} />
        ))}
        {data.truth.map((_, i) => {
          const a = -Math.PI / 2 + (i / 10) * Math.PI * 2;
          return (
            <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(a) * RR} y2={cy + Math.sin(a) * RR} stroke={ink} strokeOpacity={0.15} />
          );
        })}
        <polygon points={poly(data.truth)} fill="none" stroke={ink} strokeOpacity={0.45} strokeDasharray="6 8" strokeWidth={2} />
        <polygon points={poly(est)} fill={accent} fillOpacity={0.25} stroke={accent} strokeWidth={4} opacity={enter(0)} />

        {/* operator arrow */}
        <g opacity={enter(20)}>
          <line x1={566} x2={600} y1={470} y2={470} stroke={ink} strokeWidth={3} />
          <polygon points="600,460 618,470 600,480" fill={ink} />
        </g>

        {/* candidate bars */}
        {data.cands.map((c, i) => {
          const y = 230 + i * 78;
          const p = c.prior + (c.truth - c.prior) * learn * 0.9;
          const s = enter(24 + i * 5);
          return (
            <g key={c.id} opacity={s}>
              <text x={barsX} y={y + 6} fontSize={20} fill={ink} opacity={0.7}>
                {c.id}
              </text>
              <rect x={barsX + 90} y={y - 14} width={barsW} height={28} fill={ink} fillOpacity={0.08} />
              <rect x={barsX + 90} y={y - 14} width={barsW * p * s} height={28} fill={ink} />
              <line x1={barsX + 90 + barsW * c.truth} x2={barsX + 90 + barsW * c.truth} y1={y - 22} y2={y + 22} stroke={accent} strokeWidth={4} />
            </g>
          );
        })}
      </svg>

      <div style={{ position: "absolute", left: 70, top: 60, fontSize: 22, letterSpacing: "0.06em" }}>
        <span style={{ color: accent }}>●</span> HUMAN DIGITAL TWIN · 10 TRAITS
      </div>
      <div style={{ position: "absolute", left: 70, top: 96, fontSize: 20, opacity: 0.65 }}>
        reactions learned <b style={{ color: ink }}>{Math.round(reactions)}</b>/20 · dashed = planted truth
      </div>
      <div style={{ position: "absolute", left: barsX, top: 150, fontSize: 20, opacity: 0.65 }}>
        predicted compatibility <span style={{ color: accent }}>| true</span>
      </div>

      {/* rank correlation meter */}
      <div style={{ position: "absolute", right: 70, top: 150, width: 330, textAlign: "right" }}>
        <div style={{ fontSize: 20, opacity: 0.65 }}>rank correlation</div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 120, lineHeight: 1, letterSpacing: "-0.04em" }}>
          {rho.toFixed(2)}
        </div>
        <div style={{ fontSize: 20, opacity: 0.65 }}>pre-trained 0.59 → tailored 0.73 · ceiling 0.78</div>
        <div style={{ position: "relative", height: 10, marginTop: 14, background: `${ink}22` }}>
          <div style={{ position: "absolute", inset: 0, width: `${(rho / 0.78) * 100}%`, background: accent }} />
        </div>
      </div>

      {/* multi-fidelity ladder */}
      <div style={{ position: "absolute", left: 70, right: 70, bottom: 60, display: "flex", gap: 18, alignItems: "stretch" }}>
        {ladder.map((l, i) => {
          const on = interpolate(frame, [290 + i * 22, 310 + i * 22], [0, 1], clamp);
          return (
            <div
              key={l}
              style={{
                flex: 1,
                border: `2px solid ${ink}`,
                padding: "14px 18px",
                fontSize: 22,
                background: on > 0.5 ? ink : "transparent",
                color: on > 0.5 ? bg : ink,
              }}
            >
              <span style={{ opacity: 0.6 }}>0{i + 1}</span> {l}
            </div>
          );
        })}
        <div
          style={{
            flex: 1.1,
            fontFamily: display,
            fontWeight: 800,
            fontSize: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            color: accent,
            opacity: interpolate(frame, [360, 380], [0, 1], clamp),
          }}
        >
          ~44× cheaper / search
        </div>
      </div>
    </AbsoluteFill>
  );
};
