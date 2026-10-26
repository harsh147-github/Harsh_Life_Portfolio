import { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { rng } from "./physics";

export type SignalProps = { bg: string; ink: string; accent: string; good: string };

const channels = ["WhatsApp", "Instagram", "X", "News", "Reddit"];
const issues = [
  "Drainage",
  "Potholes",
  "Garbage",
  "Water supply",
  "Streetlights",
  "Traffic",
  "Footpaths",
  "Tree fall",
  "Encroachment",
  "Stray dogs",
  "Power cuts",
  "Waterlogging",
];
const mono = "'JetBrains Mono', ui-monospace, monospace";
const ease = Easing.bezier(0.65, 0, 0.35, 1);

export const SignalToBrief: React.FC<SignalProps> = ({ bg, ink, accent, good }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const centers = useMemo(
    () => issues.map((_, i) => ({ x: 470 + (i % 4) * 190, y: 250 + Math.floor(i / 4) * 210 })),
    [],
  );
  const dots = useMemo(() => {
    const r = rng(46);
    return Array.from({ length: 240 }, (_, i) => {
      const c = Math.floor(Math.pow(r(), 1.4) * issues.length);
      const a = r() * Math.PI * 2;
      const rad = 10 + r() * 42;
      return {
        ch: Math.floor(r() * channels.length),
        sx: 400 + r() * 760,
        sy: 170 + r() * 640,
        cx: centers[c].x + Math.cos(a) * rad,
        cy: centers[c].y + Math.sin(a) * rad * 0.7,
        t0: (i / 240) * 80 + r() * 6,
        j: r() * 24,
      };
    });
  }, [centers]);
  const costs = useMemo(() => {
    const r = rng(9);
    return issues.map(() => ({ lakh: (0.6 + r() * 3.4).toFixed(1), days: 7 + Math.floor(r() * 4) * 7 }));
  }, []);

  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const cardIn = (i: number) => spring({ frame: frame - 200 - i * 3, fps, config: { damping: 16 } });
  const send = (i: number) => interpolate(frame, [292 + i * 4, 330 + i * 4], [0, 1], { ...clamp, easing: ease });

  const stage = frame < 100 ? 0 : frame < 195 ? 1 : frame < 285 ? 2 : 3;
  const counters = [
    { v: Math.round(interpolate(frame, [0, 90], [0, 836], clamp)), l: "complaints · 22 languages" },
    { v: Math.round(interpolate(frame, [100, 190], [0, 113], clamp)), l: "issue clusters" },
    { v: Math.round(interpolate(frame, [200, 280], [0, 345], clamp)), l: "costed plans · ₹9.23 Cr" },
    { v: Math.round(interpolate(frame, [292, 370], [0, 492], clamp)), l: "briefs dispatched" },
  ];

  const officer = { x: 1330, y: 300, w: 220, h: 300 };

  return (
    <AbsoluteFill style={{ background: bg, color: ink, fontFamily: mono }}>
      {/* channels */}
      {channels.map((c, i) => (
        <div
          key={c}
          style={{
            position: "absolute",
            left: 70,
            top: 210 + i * 130,
            fontSize: 24,
            opacity: interpolate(frame, [i * 6, i * 6 + 20], [0, 1], clamp) * (stage > 1 ? 0.35 : 1),
          }}
        >
          <span style={{ color: accent }}>→</span> {c}
        </div>
      ))}

      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {dots.map((d, i) => {
          if (frame < d.t0) return null;
          const a = interpolate(frame, [d.t0, d.t0 + 22], [0, 1], { ...clamp, easing: ease });
          const b = interpolate(frame, [100 + d.j, 170 + d.j], [0, 1], { ...clamp, easing: ease });
          const fadeOut = interpolate(frame, [195, 225], [1, 0], clamp);
          const ox = 250;
          const oy = 222 + d.ch * 130;
          const x1 = ox + (d.sx - ox) * a;
          const y1 = oy + (d.sy - oy) * a;
          const x = x1 + (d.cx - x1) * b;
          const y = y1 + (d.cy - y1) * b;
          return <circle key={i} cx={x} cy={y} r={5} fill={b > 0.5 ? accent : ink} opacity={0.85 * fadeOut} />;
        })}
        {/* dispatch rails */}
        {stage >= 3 &&
          centers.map((c, i) => (
            <line
              key={i}
              x1={c.x + 70}
              y1={c.y}
              x2={c.x + 70 + (officer.x - c.x - 70) * send(i)}
              y2={c.y + (officer.y + officer.h / 2 - c.y) * send(i)}
              stroke={good}
              strokeOpacity={0.5}
              strokeWidth={2}
            />
          ))}
      </svg>

      {/* cards */}
      {centers.map((c, i) => {
        const s = cardIn(i);
        if (s <= 0.001) return null;
        const sent = send(i);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: c.x - 80,
              top: c.y - 62,
              width: 160,
              height: 124,
              border: `2px solid ${sent > 0.5 ? good : ink}`,
              background: bg,
              padding: "12px 14px",
              transform: `scale(${s})`,
              fontSize: 18,
              lineHeight: 1.35,
              boxShadow: `6px 6px 0 ${sent > 0.5 ? good : accent}`,
            }}
          >
            <div style={{ fontWeight: 700 }}>{issues[i]}</div>
            <div style={{ opacity: 0.7 }}>₹{costs[i].lakh} L</div>
            <div style={{ opacity: 0.7 }}>{costs[i].days} days</div>
            {sent > 0.5 && <div style={{ color: good, fontWeight: 700 }}>✓ SENT</div>}
          </div>
        );
      })}

      {/* ward officer */}
      <div
        style={{
          position: "absolute",
          left: officer.x,
          top: officer.y,
          width: officer.w,
          height: officer.h,
          border: `2px solid ${ink}`,
          padding: 18,
          fontSize: 20,
          opacity: interpolate(frame, [270, 290], [0, 1], clamp),
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>WARD OFFICE</div>
        <div style={{ fontSize: 64, fontWeight: 800, color: good, fontFamily: "'Inter Tight', sans-serif" }}>
          {Math.round(interpolate(frame, [292, 370], [0, 12], clamp))}
        </div>
        <div style={{ opacity: 0.7 }}>ranked briefs, not tickets</div>
      </div>

      {/* counters */}
      <div style={{ position: "absolute", left: 70, top: 60, display: "flex", gap: 56, fontSize: 20 }}>
        {counters.map((c, i) => (
          <div key={i} style={{ opacity: stage >= i ? 1 : 0.25, transition: "none" }}>
            <div
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontWeight: 800,
                fontSize: 54,
                lineHeight: 1,
                color: stage === i ? accent : ink,
              }}
            >
              {c.v}
            </div>
            <div style={{ marginTop: 6, opacity: 0.7 }}>{c.l}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
