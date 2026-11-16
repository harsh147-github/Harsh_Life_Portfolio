import { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { figure } from "../lib/figure";
import { GfxClusters, GfxLattice, GfxModes, GfxStrike, GfxSurrogate, GfxTwin, GfxWeave, GfxWing, type Pal } from "./gfx";
import { rng } from "./physics";
import { beatAt, reelScenes, reelStarts, sceneAt, type Beat } from "./reelScenes";

export type ReelProps = { bg: string; fg: string };

const mono = "'JetBrains Mono', ui-monospace, monospace";
const display = "'Inter Tight', 'Helvetica Neue', Arial, sans-serif";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ez = Easing.bezier(0.22, 1, 0.36, 1);
const pop = Easing.out(Easing.back(1.7));
const ip = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...cl, easing: ez });
const lin = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], cl);
const WIPE = 8;
const OUT = 4;

/** where each scene sits on the 2022 → now rail (0 = 2022, 4 = 2026) */
const NOW = 4.85;
const SPAN: Record<string, [number, number]> = {
  problem: [0, 0],
  veloce: [0.1, 2.8],
  diat: [2.45, 3.45],
  crompton: [3.0, 3.2],
  paninian: [3.5, 4.55],
  iisc: [4.6, NOW],
  ventures: [4.45, NOW],
  goal: [NOW, NOW],
};

const lum = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/** "*the truth*." → words, each flagged if it sits inside the asterisks */
function words(text: string) {
  let em = false;
  return text.split(" ").map((raw) => {
    let w = raw;
    if (w.startsWith("*")) {
      em = true;
      w = w.slice(1);
    }
    const closes = w.includes("*");
    const out = { w: w.replace("*", ""), em };
    if (closes) em = false;
    return out;
  });
}

/* ------------------------------------------------------------------ */
/* The design space: every dot is a design you could simulate.          */
/* ------------------------------------------------------------------ */
const COLS = 34;
const ROWS = 22;
const STEP = 26;
const X0 = (1000 - (COLS - 1) * STEP) / 2;
const Y0 = (800 - (ROWS - 1) * STEP) / 2;
const TEN = [3 * COLS + 5, 6 * COLS + 21, 9 * COLS + 12, 4 * COLS + 29, 12 * COLS + 3, 14 * COLS + 25, 17 * COLS + 9, 18 * COLS + 30, 10 * COLS + 17, 19 * COLS + 18];

function GfxSpace({ f, stage, pal }: { f: number; stage: number; pal: Pal }) {
  const dots = useMemo(() => {
    const r = rng(7);
    return Array.from({ length: COLS * ROWS }, (_, i) => ({ x: X0 + (i % COLS) * STEP, y: Y0 + Math.floor(i / COLS) * STEP, col: i % COLS, conf: r() }));
  }, []);
  const shown = stage === 0 ? 1 : 10;
  const sweep = stage === 3 ? lin(f, 2, 34) * (COLS + 3) : stage > 3 ? COLS + 3 : 0;
  const doubt = stage === 4 ? ip(f, 6, 26) : 0;
  const wake = stage === 2 ? 0.16 + 0.34 * ip(f, 0, 12) : 0.16;
  const ring = 2 * Math.PI * 30;
  return (
    <>
      {dots.map((d, i) => {
        const lit = sweep > d.col ? Math.min(1, (sweep - d.col) / 3) : 0;
        const unsure = d.conf < 0.28 ? doubt : 0;
        return (
          <circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={5 + 2 * lit}
            fill={lit > 0 ? pal.accent : pal.fg}
            fillOpacity={lit > 0 ? (0.5 + 0.5 * (1 - doubt) + 0.5 * doubt * d.conf) * lit * (1 - unsure) : wake}
            stroke={pal.accent}
            strokeWidth={2.5}
            strokeOpacity={unsure}
          />
        );
      })}
      {TEN.slice(0, shown).map((k, i) => {
        const d = dots[k];
        const t = stage === 1 ? interpolate(f, [2 + i * 3, 9 + i * 3], [0, 1], { ...cl, easing: pop }) : stage === 0 ? ip(f, 0, 8) : 1;
        return (
          <g key={k}>
            <circle cx={d.x} cy={d.y} r={Math.max(0, 12 * t)} fill={pal.accent} />
            {stage === 0 ? (
              <>
                <circle cx={d.x} cy={d.y} r={30} fill="none" stroke={pal.fg} strokeOpacity={0.2} strokeWidth={5} />
                <circle cx={d.x} cy={d.y} r={30} fill="none" stroke={pal.accent} strokeWidth={5} strokeDasharray={ring} strokeDashoffset={ring * (1 - 0.32 * lin(f, 4, 42))} transform={`rotate(-90 ${d.x} ${d.y})`} />
              </>
            ) : (
              <circle cx={d.x} cy={d.y} r={Math.max(0, 12 + 12 * t)} fill="none" stroke={pal.accent} strokeWidth={3} strokeOpacity={stage > 2 ? 0 : 0.7 * t} />
            )}
          </g>
        );
      })}
    </>
  );
}

function Drawing({ b, gf, bf, pal }: { b: Beat; gf: number; bf: number; pal: Pal }) {
  const f = gf * (b.speed ?? 1);
  switch (b.gfx) {
    case "space":
      return <GfxSpace f={bf} stage={b.stage ?? 0} pal={pal} />;
    case "wing":
      return <GfxWing f={f} pal={pal} />;
    case "strike":
      return (
        <g transform="translate(-190 -100) scale(1.25)">
          <GfxStrike f={f} pal={pal} />
        </g>
      );
    case "surrogate":
      return <GfxSurrogate f={f} pal={pal} />;
    case "lattice":
      return <GfxLattice f={f} pal={pal} />;
    case "modes":
      return <GfxModes f={f} pal={pal} />;
    case "clusters":
      return <GfxClusters f={f} pal={pal} />;
    case "twin":
      return <GfxTwin f={f} pal={pal} />;
    case "weave":
      return <GfxWeave f={f + 20} pal={pal} steady />;
    default:
      return null;
  }
}

/** type sizes: a line is sized by its length, so every beat fills the frame */
function sizes(len: number, col: boolean, P: boolean) {
  if (P) return len <= 14 ? 172 : len <= 24 ? 142 : len <= 36 ? 118 : 100;
  if (col) return len <= 16 ? 132 : len <= 28 ? 108 : len <= 42 ? 90 : 78;
  return len <= 14 ? 230 : len <= 24 ? 182 : len <= 34 ? 150 : 128;
}

function Scene({ idx, f, base, wipe }: { idx: number; f: number; base: Pal; wipe: number }) {
  const { width: W, height: H } = useVideoConfig();
  const P = H > W;
  const s = reelScenes[idx];
  const { i: bi, f: bf } = beatAt(idx, f);
  const b = s.beats[bi];
  const scenePal = s.pal ?? base;
  const accent = b.accent ?? scenePal.accent;
  // a "flip" beat fills the frame with the accent colour
  const ink = contrast(scenePal.fg, accent) >= contrast(scenePal.bg, accent) ? scenePal.fg : scenePal.bg;
  const pal: Pal = b.flip ? { bg: accent, fg: ink, accent: ink } : { ...scenePal, accent };

  const pad = P ? 64 : 80;
  const railY = P ? H - 74 : H - 66;
  const top = P ? 170 : 124;
  const hasGfx = !!b.gfx && !b.flip;
  const box = P ? { left: 90, top: 800, width: 900, height: 600 } : { left: 830, top: 126, width: 700, height: 600 };
  const textH = (P && hasGfx ? box.top - 30 : railY - 70) - top;
  const textW = !P && hasGfx ? 720 : W - 2 * pad;

  // how long the current drawing has been running (it carries over between beats)
  let gf = bf;
  for (let k = bi - 1; k >= 0 && s.beats[k].gfx === b.gfx && !s.beats[k].flip; k--) gf += s.beats[k].d;

  const plain = b.text.replace(/\*/g, "");
  const fs = sizes(plain.length, hasGfx, P);
  const bigFs = P ? (b.flip ? 400 : 230) : b.flip ? 340 : 170;
  const labelFs = P ? 64 : b.flip ? 76 : 54;
  const out = bi === s.beats.length - 1 && idx === reelScenes.length - 1 ? 1 - lin(bf, b.d - 12, b.d - 1) : 1 - lin(bf, b.d - OUT, b.d);
  const drift = 1 + 0.035 * (bf / b.d);

  // rail
  const [a, z] = SPAN[s.id];
  const pos = a + (z - a) * lin(f, WIPE, s.frames - 10);
  const rx = (v: number) => pad + (v / NOW) * (W - 2 * pad);

  const line = (text: string, size: number, start: number, weight = 800) => (
    <div style={{ fontFamily: display, fontWeight: weight, fontSize: size, lineHeight: 0.96, letterSpacing: "-0.055em" }}>
      {words(text).map((w, i) => {
        const t = ip(bf, start + i * 2, start + 9 + i * 2);
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: "0.14em", marginBottom: "-0.14em", marginRight: "0.2em" }}>
            <span style={{ display: "inline-block", transform: `translateY(${(1 - t) * 108}%)`, color: w.em ? pal.accent : undefined }}>{w.w}</span>
          </span>
        );
      })}
    </div>
  );

  return (
    <AbsoluteFill style={{ background: pal.bg, color: pal.fg, clipPath: wipe < 1 ? `inset(0 0 0 ${(1 - wipe) * 100}%)` : undefined }}>
      {/* where we are */}
      <div style={{ position: "absolute", left: pad, top: P ? 84 : 58, right: pad, fontFamily: mono, fontSize: P ? 29 : 22, letterSpacing: "0.12em", textTransform: "uppercase", opacity: ip(f, 0, 10), whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        <span style={{ color: pal.accent }}>●</span>&nbsp; {s.kicker}
      </div>

      {/* the beat */}
      <div style={{ position: "absolute", left: pad, top, width: textW, height: textH, display: "flex", flexDirection: "column", justifyContent: "center", opacity: out, transform: `translateY(${(1 - out) * -18}px) scale(${drift})`, transformOrigin: "0% 50%" }}>
        {b.big ? (
          <>
            <div
              style={{
                fontFamily: display,
                fontWeight: 800,
                fontSize: bigFs,
                lineHeight: 0.9,
                letterSpacing: "-0.06em",
                color: pal.accent,
                whiteSpace: "nowrap",
                transformOrigin: "0% 100%",
                transform: `scale(${interpolate(bf, [0, 9], [0.82, 1], { ...cl, easing: pop })})`,
                opacity: lin(bf, 0, 3),
              }}
            >
              {figure(b.big, ip(bf, 0, 16))}
            </div>
            <div style={{ marginTop: P ? 26 : 22, maxWidth: b.flip && !P ? 1200 : undefined }}>{line(b.text, labelFs, 6, 700)}</div>
          </>
        ) : (
          line(b.text, fs, 1)
        )}
        {b.sub && (
          <div style={{ marginTop: P ? 34 : 30, fontFamily: mono, fontSize: P ? 30 : 24, letterSpacing: "0.04em", opacity: ip(bf, 16, 28) }}>
            <span style={{ color: pal.accent }}>→</span> {b.sub}
          </div>
        )}
      </div>

      {/* the drawing */}
      {hasGfx && (
        <svg viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid meet" style={{ position: "absolute", ...box, opacity: Math.min(ip(gf, 0, 8), out) }}>
          <Drawing b={b} gf={gf} bf={bf} pal={pal} />
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
        {z > a && <line x1={rx(a)} x2={rx(pos)} y1={railY} y2={railY} stroke={pal.accent} strokeWidth={7} strokeLinecap="round" />}
        {s.id === "goal" && <line x1={rx(0)} x2={rx(NOW * ip(f, 0, 40))} y1={railY} y2={railY} stroke={pal.accent} strokeWidth={6} strokeLinecap="round" />}
        {s.id !== "problem" && <circle cx={rx(pos)} cy={railY} r={P ? 15 : 12} fill={pal.accent} stroke={pal.bg} strokeWidth={4} />}
      </svg>
    </AbsoluteFill>
  );
}

export const Reel: React.FC<ReelProps> = ({ bg, fg }) => {
  const frame = useCurrentFrame();
  const base = { bg, fg, accent: lum(bg) < 0.2 ? "#8894ff" : "#4a5cf0" };
  const idx = sceneAt(frame);
  const local = frame - reelStarts[idx];
  const wiping = idx > 0 && local < WIPE;
  return (
    <AbsoluteFill style={{ background: bg }}>
      {wiping && <Scene idx={idx - 1} f={reelScenes[idx - 1].frames - 1} base={base} wipe={1} />}
      <Scene idx={idx} f={local} base={base} wipe={wiping ? ip(local, 0, WIPE) : 1} />
    </AbsoluteFill>
  );
};
