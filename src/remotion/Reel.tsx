import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { figure } from "../lib/figure";
import { GfxClusters, GfxLattice, GfxModes, GfxStrike, GfxSurrogate, GfxTwin, GfxWeave, GfxWing, type G, type Pal } from "./gfx";
import { reelScenes, reelStarts, sceneAt, type ReelScene } from "./reelScenes";

export type ReelProps = { bg: string; fg: string };

const mono = "'JetBrains Mono', ui-monospace, monospace";
const display = "'Inter Tight', 'Helvetica Neue', Arial, sans-serif";
const serif = "'Instrument Serif', Georgia, serif";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ez = Easing.bezier(0.22, 1, 0.36, 1);
const ip = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...cl, easing: ez });
const WIPE = 16;

/** where each scene sits on the 2022 → now rail (0 = 2022, 4 = 2026) */
const NOW = 4.85;
const SPAN: Record<string, [number, number]> = {
  intro: [0, 0],
  veloce: [0.1, 2.8],
  diat: [2.45, 3.05],
  crompton: [3.0, 3.2],
  paninian: [3.2, 4.55],
  iisc: [4.6, NOW],
  ventures: [4.45, NOW],
  outro: [NOW, NOW],
};
const PREVIEWS = [GfxWing, GfxStrikeStill, GfxSurrogateStill, GfxLatticeStill, GfxModes, GfxTwin];
const LADDER = ["bearing", "wing", "fan blade", "airframe", "eigenproblem", "city", "person"];

/* stills of the graphics that build up, for the intro previews */
function GfxStrikeStill({ pal }: G) {
  return <GfxStrike f={46} pal={pal} />;
}
function GfxSurrogateStill({ pal }: G) {
  return <GfxSurrogate f={150} pal={pal} />;
}
function GfxLatticeStill({ pal }: G) {
  return <GfxLattice f={150} pal={pal} />;
}

function Scene({ s, f, base, wipe }: { s: ReelScene; f: number; base: Pal; wipe: number }) {
  const { width: W, height: H } = useVideoConfig();
  const P = H > W;
  const pal = s.pal ?? base;
  const pad = P ? 64 : 72;
  const railY = P ? H - 74 : H - 66;
  const words = s.headline.split(" ");
  const bare = s.id === "intro" || s.id === "outro";
  const out = s.id === "outro" ? 1 - interpolate(f, [s.frames - 14, s.frames - 1], [0, 1], cl) : 1;
  const introIn = s.id === "intro" ? interpolate(f, [0, 12], [0, 1], cl) : 1;

  // rail
  const [a, b] = SPAN[s.id];
  const pos = a + (b - a) * interpolate(f, [WIPE, s.frames - 10], [0, 1], cl);
  const rx = (v: number) => pad + (v / NOW) * (W - 2 * pad);

  const gfx = P ? { left: (W - 900) / 2, top: 730, width: 900, height: 700 } : { left: 790, top: 90, width: 760, height: 670 };

  return (
    <AbsoluteFill style={{ background: pal.bg, color: pal.fg, clipPath: wipe < 1 ? `inset(0 0 0 ${(1 - wipe) * 100}%)` : undefined }}>
      <div style={{ position: "absolute", inset: 0, opacity: out * introIn }}>
        {/* text */}
        <div
          style={{
            position: "absolute",
            left: pad,
            top: P ? 140 : 110,
            width: bare ? W - 2 * pad : P ? W - 2 * pad : 690,
            height: P && !bare ? undefined : railY - (P ? 140 : 110) - 70,
            display: "flex",
            flexDirection: "column",
            justifyContent: P && !bare ? "flex-start" : "center",
            gap: P ? 34 : 30,
          }}
        >
          <div style={{ fontFamily: mono, fontSize: P ? 32 : 23, letterSpacing: "0.12em", textTransform: "uppercase", opacity: ip(f, 2, 18) }}>
            <span style={{ color: pal.accent }}>●</span>&nbsp; {s.kicker}
          </div>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: bare ? (P ? 128 : 132) : P ? 100 : 90, lineHeight: 0.94, letterSpacing: "-0.055em", maxWidth: bare && !P ? 1200 : undefined }}>
            {words.map((w, i) => {
              const t = ip(f, 6 + i * 3, 26 + i * 3);
              return (
                <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: "0.12em", marginBottom: "-0.12em", marginRight: "0.22em" }}>
                  <span style={{ display: "inline-block", transform: `translateY(${(1 - t) * 105}%)` }}>{w}</span>
                </span>
              );
            })}
          </div>
          {s.stats.length > 0 && (
            <div style={{ display: "flex", gap: P ? 40 : 44, marginTop: P ? 6 : 14 }}>
              {s.stats.map((st, i) => {
                const t = ip(f, 34 + i * 12, 58 + i * 12);
                return (
                  <div key={st.label} style={{ flex: 1, opacity: Math.min(1, t * 3), transform: `translateY(${(1 - t) * 26}px)`, borderTop: `3px solid ${pal.fg}`, paddingTop: P ? 18 : 16 }}>
                    <div style={{ fontFamily: display, fontWeight: 800, fontSize: P ? 96 : 84, lineHeight: 1, letterSpacing: "-0.05em", color: pal.accent, whiteSpace: "nowrap" }}>{figure(st.value, t)}</div>
                    <div style={{ fontFamily: mono, fontSize: P ? 30 : 21, lineHeight: 1.35, marginTop: P ? 12 : 10, opacity: 0.8 }}>{st.label}</div>
                  </div>
                );
              })}
            </div>
          )}

          {s.id === "intro" && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: P ? "14px 18px" : "12px 20px", marginTop: P ? 40 : 30, fontFamily: serif, fontStyle: "italic", fontSize: P ? 58 : 50, lineHeight: 1.1 }}>
              {reelScenes.slice(1, -1).map((x, i) => (
                <span key={x.id} style={{ opacity: ip(f, 26 + i * 5, 40 + i * 5) }}>
                  {x.label.toLowerCase()}
                  {i < reelScenes.length - 3 && <span style={{ opacity: 0.4, fontStyle: "normal" }}> →</span>}
                </span>
              ))}
            </div>
          )}
          {s.id === "intro" && (
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${P ? 3 : 6}, 1fr)`, gap: P ? 22 : 20, marginTop: P ? 36 : 26 }}>
              {PREVIEWS.map((Pv, i) => (
                <svg key={i} viewBox="0 0 1000 800" style={{ width: "100%", border: `2px solid ${pal.fg}`, opacity: ip(f, 30 + i * 5, 46 + i * 5) }}>
                  <Pv f={f + 30 + i * 12} pal={pal} steady />
                </svg>
              ))}
            </div>
          )}
          {s.id === "outro" && (
            <>
              <div style={{ fontFamily: serif, fontStyle: "italic", fontSize: P ? 54 : 46, lineHeight: 1.2, maxWidth: P ? undefined : 1100, opacity: ip(f, 30, 50) }}>
                Fast, verifiable models of complex systems, deployed as products. So far:
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: P ? "16px 14px" : "14px 14px", fontFamily: mono, fontSize: P ? 34 : 26 }}>
                {LADDER.map((w, i) => {
                  const t = ip(f, 44 + i * 8, 58 + i * 8);
                  const last = i === LADDER.length - 1;
                  return (
                    <span
                      key={w}
                      style={{
                        opacity: t,
                        transform: `translateY(${(1 - t) * 18}px)`,
                        padding: P ? "12px 22px" : "10px 18px",
                        border: `2px solid ${pal.fg}`,
                        background: last ? pal.fg : "transparent",
                        color: last ? pal.bg : pal.fg,
                      }}
                    >
                      {w}
                    </span>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* graphic */}
        {!bare && (
          <svg viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid meet" style={{ position: "absolute", ...gfx }}>
            {s.id === "veloce" && <GfxWing f={f} pal={pal} />}
            {s.id === "diat" && (
              <g transform="translate(-190 -100) scale(1.25)">
                <GfxStrike f={f - 8} pal={pal} />
              </g>
            )}
            {s.id === "crompton" && <GfxSurrogate f={f - 10} pal={pal} />}
            {s.id === "paninian" && <GfxLattice f={f - 8} pal={pal} />}
            {s.id === "iisc" && <GfxModes f={f} pal={pal} />}
            {s.id === "ventures" && <Ventures f={f} pal={pal} />}
          </svg>
        )}

        {/* the rail: 2022 → now */}
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <line x1={pad} x2={W - pad} y1={railY} y2={railY} stroke={pal.fg} strokeOpacity={0.25} strokeWidth={3} />
          {["2022", "2023", "2024", "2025", "2026"].map((y, i) => (
            <g key={y}>
              <line x1={rx(i)} x2={rx(i)} y1={railY - 9} y2={railY + 9} stroke={pal.fg} strokeOpacity={0.5} strokeWidth={3} />
              <text x={rx(i)} y={railY + (P ? 46 : 38)} fontFamily={mono} fontSize={P ? 27 : 19} fill={pal.fg} fillOpacity={0.6} textAnchor={i === 0 ? "start" : "middle"}>
                {y}
              </text>
            </g>
          ))}
          <text x={rx(NOW)} y={railY + (P ? 46 : 38)} fontFamily={mono} fontSize={P ? 27 : 19} fill={pal.fg} fillOpacity={0.6} textAnchor="end">
            now
          </text>
          {b > a && <line x1={rx(a)} x2={rx(pos)} y1={railY} y2={railY} stroke={pal.accent} strokeWidth={7} strokeLinecap="round" />}
          {s.id === "outro" && <line x1={rx(0)} x2={rx(NOW * ip(f, 0, 40))} y1={railY} y2={railY} stroke={pal.fg} strokeWidth={5} strokeLinecap="round" />}
          {s.id !== "intro" && <circle cx={rx(pos)} cy={railY} r={P ? 15 : 12} fill={pal.accent} stroke={pal.bg} strokeWidth={4} />}
        </svg>
      </div>
    </AbsoluteFill>
  );
}

/** three ventures, one after another */
function Ventures({ f, pal }: { f: number; pal: Pal }) {
  const parts = [
    { from: 6, label: "Sushaasan · cities", accent: "#ef7a12" },
    { from: 86, label: "RSelf · people", accent: "#e8006f" },
    { from: 146, label: "CarbonDistrict · carbon", accent: "#b8862b" },
  ];
  return (
    <>
      {parts.map((p, i) => {
        const end = parts[i + 1]?.from ?? 999;
        if (f < p.from || f > end + 8) return null;
        const o = Math.min(interpolate(f, [p.from, p.from + 8], [0, 1], cl), 1 - interpolate(f, [end, end + 8], [0, 1], cl));
        const lf = f - p.from;
        const pp = { ...pal, accent: p.accent };
        return (
          <g key={p.label} opacity={o}>
            <g transform="translate(60 0) scale(0.88)">
              {i === 0 && <GfxClusters f={lf * 1.75} pal={pp} />}
              {i === 1 && <GfxTwin f={lf * 1.6} pal={pp} />}
              {i === 2 && <GfxWeave f={lf * 1.4 + 20} pal={pp} />}
            </g>
            <text x={500} y={776} textAnchor="middle" fontFamily={display} fontWeight={800} fontSize={46} letterSpacing="-0.03em" fill={pal.fg}>
              {p.label}
            </text>
          </g>
        );
      })}
    </>
  );
}

export const Reel: React.FC<ReelProps> = ({ bg, fg }) => {
  const frame = useCurrentFrame();
  const base = { bg, fg, accent: fg };
  const idx = sceneAt(frame);
  const local = frame - reelStarts[idx];
  const wiping = idx > 0 && local < WIPE;
  return (
    <AbsoluteFill style={{ background: bg }}>
      {wiping && <Scene s={reelScenes[idx - 1]} f={frame - reelStarts[idx - 1]} base={base} wipe={1} />}
      <Scene s={reelScenes[idx]} f={local} base={base} wipe={wiping ? ip(local, 0, WIPE) : 1} />
    </AbsoluteFill>
  );
};
