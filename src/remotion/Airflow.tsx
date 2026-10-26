import { useEffect, useMemo, useRef } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { joukowskiFlow, sampleAt } from "./physics";

export type AirflowProps = {
  bg: string;
  ink: string;
  accent: string;
  /** flip the wing so it makes downforce (race-car wing) */
  inverted: boolean;
  labels: boolean;
  alphaDeg: number;
};

const X0 = -3.1;
const X1 = 3.3;

export const Airflow: React.FC<AirflowProps> = ({ bg, ink, accent, inverted, labels, alphaDeg }) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const canvas = useRef<HTMLCanvasElement>(null);

  const field = useMemo(
    () =>
      joukowskiFlow({
        alphaDeg,
        lines: 46,
        yMin: -2.1,
        yMax: 2.1,
        xStart: X0,
        xEnd: X1,
        camber: 0.1,
        thickness: 0.1,
      }),
    [alphaDeg],
  );

  // per-line integer cycle counts → seamless loop, near-true relative speeds
  const cycles = useMemo(() => {
    const T = durationInFrames / fps;
    const flow = 1.15; // world-time units per second
    return field.lines.map((l) => Math.max(1, Math.round((flow * T) / l.total)));
  }, [field, durationInFrames, fps]);

  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const s = width / (X1 - X0);
    const flip = inverted ? -1 : 1;
    const px = (x: number) => (x - X0) * s;
    const py = (y: number) => height / 2 - y * s * flip;

    ctx.clearRect(0, 0, width, height);
    if (bg !== "transparent") {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);
    }

    const reveal = interpolate(frame, [0, 50], [0, 1], { extrapolateRight: "clamp" });
    const settle = frame < 50 ? reveal : 1;

    // faint streamlines
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = ink;
    ctx.globalAlpha = 0.16;
    for (const l of field.lines) {
      const n = Math.floor(l.pts.length * settle);
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const p = l.pts[i];
        if (i === 0) ctx.moveTo(px(p.x), py(p.y));
        else ctx.lineTo(px(p.x), py(p.y));
      }
      ctx.stroke();
    }

    // velocity-true particle streaks
    const progress = frame / durationInFrames;
    const P = 6;
    const tailSteps = 9;
    ctx.lineCap = "round";
    field.lines.forEach((l, li) => {
      for (let j = 0; j < P; j++) {
        const tau = ((progress * cycles[li] + j / P) % 1) * l.total;
        const tail = l.total * 0.012;
        let prev = sampleAt(l, tau);
        for (let k = 1; k <= tailSteps; k++) {
          const cur = sampleAt(l, tau - tail * k);
          const fast = Math.min(1, Math.max(0, (prev.v - 0.9) / 0.9));
          ctx.globalAlpha = settle * (1 - k / (tailSteps + 1)) * (0.55 + 0.45 * fast);
          ctx.strokeStyle = fast > 0.35 ? accent : ink;
          ctx.lineWidth = 2.6 + fast * 1.6;
          ctx.beginPath();
          ctx.moveTo(px(prev.x), py(prev.y));
          ctx.lineTo(px(cur.x), py(cur.y));
          ctx.stroke();
          prev = cur;
        }
      }
    });

    // the wing
    ctx.globalAlpha = 1;
    ctx.beginPath();
    field.airfoil.forEach((p, i) => (i ? ctx.lineTo(px(p.x), py(p.y)) : ctx.moveTo(px(p.x), py(p.y))));
    ctx.closePath();
    ctx.fillStyle = ink;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = accent;
    ctx.stroke();
  }, [frame, field, cycles, width, height, bg, ink, accent, inverted, durationInFrames]);

  const label = (delay: number) =>
    spring({ frame: frame - delay, fps, config: { damping: 200 }, durationInFrames: 30 });

  const cl = (inverted ? -1 : 1) * field.cl;

  return (
    <AbsoluteFill style={{ background: bg === "transparent" ? undefined : bg }}>
      <canvas ref={canvas} width={width} height={height} style={{ width: "100%", height: "100%" }} />
      {labels && (
        <AbsoluteFill
          style={{
            color: ink,
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 26,
            letterSpacing: "0.04em",
            padding: 56,
            justifyContent: "space-between",
            pointerEvents: "none",
          }}
        >
          <div style={{ opacity: label(10), transform: `translateY(${(1 - label(10)) * 16}px)` }}>
            <div style={{ color: accent }}>● LIVE · POTENTIAL FLOW</div>
            <div style={{ opacity: 0.7, marginTop: 8 }}>Joukowski section · Kutta condition</div>
          </div>
          <div
            style={{
              display: "flex",
              gap: 64,
              opacity: label(40),
              transform: `translateY(${(1 - label(40)) * 16}px)`,
            }}
          >
            <span>α = {inverted ? "−" : ""}{alphaDeg}°</span>
            <span>
              C<sub>L</sub> = {cl.toFixed(2)}
            </span>
            <span style={{ color: accent }}>{inverted ? "↓ downforce" : "↑ lift"}</span>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
