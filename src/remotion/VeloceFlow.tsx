import { useEffect, useMemo, useRef } from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FIELD } from "./veloceField";

export type VeloceFlowProps = { src: string; accent: string };

const mono = "'JetBrains Mono', ui-monospace, monospace";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type Line = { x: Float32Array; y: Float32Array; s: Float32Array; t: Float32Array; total: number };

/** Decode the int8 (u, v) grid and trace evenly spread streamlines through it. */
function traceStreamlines(): Line[] {
  const raw = atob(FIELD.data);
  const q = new Int8Array(raw.length);
  for (let i = 0; i < raw.length; i++) q[i] = (raw.charCodeAt(i) << 24) >> 24;
  const { gw, gh, cell, w, h } = FIELD;
  const vel = (x: number, y: number): [number, number] => {
    const gx = Math.min(Math.max(x / cell - 0.5, 0), gw - 1.001);
    const gy = Math.min(Math.max(y / cell - 0.5, 0), gh - 1.001);
    const j = Math.floor(gx);
    const i = Math.floor(gy);
    const fx = gx - j;
    const fy = gy - i;
    const at = (ii: number, jj: number, c: number) => q[(ii * gw + jj) * 2 + c] / 127;
    const u = at(i, j, 0) * (1 - fx) * (1 - fy) + at(i, j + 1, 0) * fx * (1 - fy) + at(i + 1, j, 0) * (1 - fx) * fy + at(i + 1, j + 1, 0) * fx * fy;
    const v = at(i, j, 1) * (1 - fx) * (1 - fy) + at(i, j + 1, 1) * fx * (1 - fy) + at(i + 1, j, 1) * (1 - fx) * fy + at(i + 1, j + 1, 1) * fx * fy;
    return [u, v];
  };

  const occ = 14; // occupancy cell (px) used to spread seeds evenly
  const ow = Math.ceil(w / occ);
  const oh = Math.ceil(h / occ);
  const visited = new Uint8Array(ow * oh);
  const lines: Line[] = [];

  const trace = (x0: number, y0: number) => {
    const xs: number[] = [];
    const ys: number[] = [];
    const ss: number[] = [];
    const ts: number[] = [];
    let x = x0;
    let y = y0;
    let t = 0;
    const hStep = 3;
    for (let k = 0; k < 900; k++) {
      const [u, v] = vel(x, y);
      const sp = Math.hypot(u, v);
      if (sp < 0.02) break;
      xs.push(x);
      ys.push(y);
      ss.push(sp);
      ts.push(t);
      const [u2, v2] = vel(x + (u / sp) * hStep * 0.5, y + (v / sp) * hStep * 0.5);
      const s2 = Math.hypot(u2, v2);
      if (s2 < 0.02) break;
      x += (u2 / s2) * hStep;
      y += (v2 / s2) * hStep;
      t += hStep / Math.max(s2, 0.06);
      if (x < 0 || x > w || y < 0 || y > h) break;
    }
    if (xs.length < 70) return;
    for (let k = 0; k < xs.length; k += 2) visited[Math.floor(ys[k] / occ) * ow + Math.floor(xs[k] / occ)] = 1;
    lines.push({ x: Float32Array.from(xs), y: Float32Array.from(ys), s: Float32Array.from(ss), t: Float32Array.from(ts), total: t });
  };

  for (let y = 5; y < h; y += 9) trace(2, y);
  // fill wakes and gaps: seed wherever no streamline has passed yet
  for (let j = 1; j < ow; j++)
    for (let i = 0; i < oh; i++) {
      if (visited[i * ow + j]) continue;
      const x = (j + 0.5) * occ;
      const y = (i + 0.5) * occ;
      const [u, v] = vel(x, y);
      if (Math.hypot(u, v) > 0.03) trace(x, y);
    }
  return lines;
}

function sampleAt(l: Line, time: number) {
  const n = l.t.length;
  if (time <= 0) return [l.x[0], l.y[0], l.s[0]];
  if (time >= l.t[n - 1]) return [l.x[n - 1], l.y[n - 1], l.s[n - 1]];
  let lo = 0;
  let hi = n - 1;
  while (hi - lo > 1) {
    const m = (lo + hi) >> 1;
    if (l.t[m] <= time) lo = m;
    else hi = m;
  }
  const f = (time - l.t[lo]) / (l.t[hi] - l.t[lo] || 1);
  return [l.x[lo] + (l.x[hi] - l.x[lo]) * f, l.y[lo] + (l.y[hi] - l.y[lo]) * f, l.s[lo]];
}

const NOTES = [
  { x: 230, y: 455, at: 40, title: "Front wing", body: "turns the air outboard, around the front tyres", dx: 30, dy: 60 },
  { x: 900, y: 105, at: 110, title: "Rear wing with DRS", body: "aero package: 300 N downforce at L/D 2.1", dx: 70, dy: -10 },
  { x: 1060, y: 250, at: 180, title: "Wake", body: "low-velocity air behind the rear wheels", dx: 40, dy: 70 },
];

export const VeloceFlow: React.FC<VeloceFlowProps> = ({ src, accent }) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames, fps } = useVideoConfig();
  const canvas = useRef<HTMLCanvasElement>(null);
  const lines = useMemo(traceStreamlines, []);
  const k = width / FIELD.w;

  // integer cycles per line → seamless loop with near-true relative speeds
  const cycles = useMemo(() => {
    const T = durationInFrames / fps;
    return lines.map((l) => Math.max(1, Math.round((T * 420) / l.total)));
  }, [lines, durationInFrames, fps]);

  useEffect(() => {
    const cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const dpr = 2;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    const fadeIn = interpolate(frame, [0, 30], [0, 1], clamp);
    const prog = frame / durationInFrames;
    ctx.lineCap = "round";
    ctx.globalCompositeOperation = "lighter";
    const tail = 14;
    // faint full streamlines underneath the moving particles
    ctx.strokeStyle = `rgba(255,255,255,${0.1 * fadeIn})`;
    ctx.lineWidth = 0.9 * k;
    lines.forEach((l) => {
      ctx.beginPath();
      for (let i = 0; i < l.x.length; i += 3) (i ? ctx.lineTo : ctx.moveTo).call(ctx, l.x[i] * k, l.y[i] * k);
      ctx.stroke();
    });
    lines.forEach((l, li) => {
      const P = Math.max(1, Math.round(l.total / 520));
      const phase = ((li * 0.618034) % 1) / P; // golden-ratio offset so particles never line up in columns
      for (let p = 0; p < P; p++) {
        const tau = ((prog * cycles[li] + p / P + phase) % 1) * l.total;
        let prev = sampleAt(l, tau);
        const step = 5;
        for (let s = 1; s <= tail; s++) {
          const cur = sampleAt(l, tau - step * s);
          const a = (1 - s / (tail + 1)) * fadeIn;
          const fast = Math.min(1, prev[2] * 1.15);
          ctx.strokeStyle = `rgba(255,255,255,${(0.28 + 0.55 * fast) * a})`;
          ctx.lineWidth = (1.1 + fast * 1.4) * k;
          ctx.beginPath();
          ctx.moveTo(prev[0] * k, prev[1] * k);
          ctx.lineTo(cur[0] * k, cur[1] * k);
          ctx.stroke();
          prev = cur;
        }
      }
    });
    ctx.globalCompositeOperation = "source-over";
  }, [frame, lines, cycles, width, height, k, durationInFrames]);

  return (
    <AbsoluteFill style={{ background: "#0a0a0a", fontFamily: mono }}>
      <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.72) saturate(1.05) contrast(1.05)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(120% 90% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)" }} />
      <canvas ref={canvas} width={width * 2} height={height * 2} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />

      <div style={{ position: "absolute", left: 36, top: 30, display: "flex", gap: 14, alignItems: "center", padding: "10px 16px", background: "rgba(8,8,8,0.72)", color: "#f5f5f5", fontSize: 20, letterSpacing: "0.08em" }}>
        <span style={{ color: accent }}>●</span> FULL-BODY CFD · VELOCITY MAGNITUDE · TOP VIEW
      </div>

      {NOTES.map((n) => {
        const o = interpolate(frame, [n.at, n.at + 20], [0, 1], clamp);
        const x = n.x * k;
        const y = n.y * k;
        return (
          <div key={n.title} style={{ opacity: o }}>
            <div style={{ position: "absolute", left: x - 7, top: y - 7, width: 14, height: 14, borderRadius: 7, background: accent, boxShadow: `0 0 0 ${6 + 4 * Math.sin(frame / 8)}px ${accent}44` }} />
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
              <line x1={x} y1={y} x2={x + n.dx} y2={y + n.dy} stroke="#fff" strokeWidth={1.5} strokeOpacity={0.8} />
            </svg>
            <div
              style={{
                position: "absolute",
                left: x + n.dx,
                top: y + n.dy,
                transform: `translate(${n.dx < 0 ? "-100%" : "0"}, ${n.dy < 0 ? "-100%" : "0"})`,
                padding: "10px 14px",
                background: "rgba(8,8,8,0.82)",
                borderLeft: `3px solid ${accent}`,
                color: "#f5f5f5",
                maxWidth: 360,
              }}
            >
              <div style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 700, fontSize: 24 }}>{n.title}</div>
              <div style={{ fontSize: 16, opacity: 0.8, marginTop: 4, lineHeight: 1.35 }}>{n.body}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
