import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export type EigenProps = { bg: string; ink: string; accent: string };

// Simply supported Euler–Bernoulli beam, EI = ρA = L = 1:  ω_n = (nπ)²
const beamModes = [1, 2, 3, 4];
// Simply supported Kirchhoff plate modes (m, n), cycled
const plateModes: [number, number][] = [
  [1, 1],
  [2, 1],
  [2, 2],
  [3, 1],
  [3, 2],
];

const mono = "'JetBrains Mono', ui-monospace, monospace";

export const EigenModes: React.FC<EigenProps> = ({ bg, ink, accent }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;

  const enter = (d: number) => spring({ frame: frame - d, fps, config: { damping: 200 }, durationInFrames: 36 });

  /* ---- beams (left) ---- */
  const bx0 = 90;
  const bw = 640;
  const rowH = 170;
  const by0 = 210;
  const beams = beamModes.map((n, i) => {
    const omega = (n * Math.PI) ** 2;
    // visual frequency ∝ n² (true ratio), slowed down for the eye
    const phase = Math.cos(2 * Math.PI * 0.16 * n * n * t);
    const amp = 52 * enter(8 + i * 8);
    const pts: string[] = [];
    for (let k = 0; k <= 120; k++) {
      const x = k / 120;
      const w = Math.sin(n * Math.PI * x) * phase * amp;
      pts.push(`${bx0 + x * bw},${by0 + i * rowH + w}`);
    }
    return { n, omega, d: `M${pts.join(" L")}`, y: by0 + i * rowH };
  });

  /* ---- plate (right) ---- */
  const seg = 75; // frames per mode
  const idx = Math.floor(frame / seg) % plateModes.length;
  const nxt = (idx + 1) % plateModes.length;
  const local = (frame % seg) / seg;
  const mix = interpolate(local, [0.78, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const [m1, n1] = plateModes[idx];
  const [m2, n2] = plateModes[nxt];
  const shape = (x: number, y: number) =>
    (1 - mix) * Math.sin(m1 * Math.PI * x) * Math.sin(n1 * Math.PI * y) +
    mix * Math.sin(m2 * Math.PI * x) * Math.sin(n2 * Math.PI * y);
  // 375 frames @30fps = 12.5 s → 0.16·n²·12.5 and 0.56·12.5 are whole cycles: seamless loop
  const pOsc = Math.cos(2 * Math.PI * 0.56 * t);
  const N = 22;
  const cx = 1200;
  const cy = 480;
  const S = 400;
  const H = 120 * enter(30);
  const proj = (x: number, y: number) => {
    const z = shape(x, y) * pOsc * H;
    return [cx + (x - y) * Math.cos(Math.PI / 6) * S, cy - 160 + (x + y) * Math.sin(Math.PI / 6) * S - z] as const;
  };
  const gridLines: { d: string; hot: number }[] = [];
  for (let i = 0; i <= N; i++) {
    const a: string[] = [];
    const b: string[] = [];
    let hotA = 0;
    let hotB = 0;
    for (let j = 0; j <= N; j++) {
      const [x1, y1] = proj(i / N, j / N);
      const [x2, y2] = proj(j / N, i / N);
      a.push(`${x1.toFixed(1)},${y1.toFixed(1)}`);
      b.push(`${x2.toFixed(1)},${y2.toFixed(1)}`);
      hotA = Math.max(hotA, Math.abs(shape(i / N, j / N)));
      hotB = Math.max(hotB, Math.abs(shape(j / N, i / N)));
    }
    gridLines.push({ d: `M${a.join(" L")}`, hot: hotA }, { d: `M${b.join(" L")}`, hot: hotB });
  }
  const curMode = mix > 0.5 ? plateModes[nxt] : plateModes[idx];

  return (
    <AbsoluteFill style={{ background: bg, color: ink, fontFamily: mono }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* beams */}
        {beams.map((b, i) => (
          <g key={b.n} opacity={enter(8 + i * 8)}>
            <line x1={bx0} x2={bx0 + bw} y1={b.y} y2={b.y} stroke={ink} strokeOpacity={0.15} strokeDasharray="4 8" />
            <path d={b.d} fill="none" stroke={i === 0 ? accent : ink} strokeWidth={3.2} />
            <polygon points={`${bx0},${b.y} ${bx0 - 14},${b.y + 22} ${bx0 + 14},${b.y + 22}`} fill="none" stroke={ink} strokeWidth={2} />
            <polygon
              points={`${bx0 + bw},${b.y} ${bx0 + bw - 14},${b.y + 22} ${bx0 + bw + 14},${b.y + 22}`}
              fill="none"
              stroke={ink}
              strokeWidth={2}
            />
            <text x={bx0} y={b.y - 66} fontSize={22} fill={ink} opacity={0.75}>
              MODE {b.n}
            </text>
            <text x={bx0 + bw} y={b.y - 66} fontSize={22} fill={ink} textAnchor="end" opacity={0.75}>
              ω = {b.omega.toFixed(2)}
            </text>
          </g>
        ))}
        {/* plate */}
        <g opacity={enter(30)}>
          {gridLines.map((g, i) => (
            <path
              key={i}
              d={g.d}
              fill="none"
              stroke={g.hot > 0.92 ? accent : ink}
              strokeOpacity={0.35 + 0.5 * g.hot}
              strokeWidth={1.6}
            />
          ))}
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 56,
          fontSize: 24,
          letterSpacing: "0.06em",
          opacity: enter(0),
        }}
      >
        <span style={{ color: accent }}>●</span> EULER–BERNOULLI BEAM · SIMPLY SUPPORTED
      </div>
      <div
        style={{
          position: "absolute",
          right: 90,
          top: 56,
          fontSize: 24,
          letterSpacing: "0.06em",
          textAlign: "right",
          opacity: enter(30),
        }}
      >
        KIRCHHOFF PLATE · MODE ({curMode[0]},{curMode[1]})
      </div>
      <div
        style={{
          position: "absolute",
          right: 90,
          bottom: 64,
          textAlign: "right",
          opacity: enter(50),
        }}
      >
        <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic", fontSize: 76, lineHeight: 1 }}>
          K φ = λ M φ
        </div>
        <div style={{ fontSize: 22, marginTop: 14, opacity: 0.7 }}>one generalised eigensolve · no backpropagation</div>
      </div>
    </AbsoluteFill>
  );
};
