import { useMemo } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { gpPosterior, rng } from "./physics";

export type SurrogateProps = { bg: string; ink: string; accent: string };

// Hidden "expensive CFD" response: normalised drive power vs one blade design variable.
const truth = (x: number) => 0.92 - 0.38 * Math.exp(-(((x - 0.63) / 0.13) ** 2)) + 0.09 * Math.sin(8.5 * x) + 0.08 * x;
// Ten space-filling CFD runs, in the order they were "computed".
const runs = [0.06, 0.94, 0.5, 0.27, 0.74, 0.16, 0.6, 0.39, 0.84, 0.67];

const mono = "'JetBrains Mono', ui-monospace, monospace";

export const Surrogate: React.FC<SurrogateProps> = ({ bg, ink, accent }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const L = 140;
  const R = width - 120;
  const T = 170;
  const B = height - 170;
  const X = (x: number) => L + x * (R - L);
  const Y = (y: number) => B - ((y - 0.35) / 0.85) * (B - T);

  const perRun = 22;
  const shown = Math.min(runs.length, Math.floor(frame / perRun) + 1);
  const grid = useMemo(() => Array.from({ length: 161 }, (_, i) => i / 160), []);

  const post = useMemo(() => {
    const xs = runs.slice(0, shown);
    return gpPosterior(xs, xs.map(truth), grid, 0.11, 0.28, 1e-5);
  }, [shown, grid]);

  // 3,000 screened candidates (drawn as a light rain once the surrogate is trained)
  const screenStart = runs.length * perRun + 12;
  const screen = useMemo(() => {
    const r = rng(7);
    return Array.from({ length: 420 }, () => r());
  }, []);
  const screenP = interpolate(frame, [screenStart, screenStart + 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const best = grid.reduce((b, _x, i) => (post[i].m < post[b].m ? i : b), 0);
  const bestP = spring({ frame: frame - (screenStart + 70), fps, config: { damping: 14 } });

  const meanPath = post.map((p, i) => `${i ? "L" : "M"}${X(grid[i]).toFixed(1)},${Y(p.m).toFixed(1)}`).join(" ");
  const band =
    post.map((p, i) => `${i ? "L" : "M"}${X(grid[i]).toFixed(1)},${Y(p.m + 2 * p.s).toFixed(1)}`).join(" ") +
    " " +
    [...post]
      .reverse()
      .map((p, i) => `L${X(grid[grid.length - 1 - i]).toFixed(1)},${Y(p.m - 2 * p.s).toFixed(1)}`)
      .join(" ") +
    " Z";
  const truthPath = grid.map((x, i) => `${i ? "L" : "M"}${X(x).toFixed(1)},${Y(truth(x)).toFixed(1)}`).join(" ");
  const fade = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: bg, color: ink, fontFamily: mono }}>
      <svg width={width} height={height} opacity={fade}>
        <line x1={L} x2={R} y1={B} y2={B} stroke={ink} strokeOpacity={0.3} />
        <line x1={L} x2={L} y1={T} y2={B} stroke={ink} strokeOpacity={0.3} />
        <path d={truthPath} fill="none" stroke={ink} strokeOpacity={0.18} strokeWidth={2} strokeDasharray="6 8" />
        <path d={band} fill={accent} fillOpacity={0.16} />
        <path d={meanPath} fill="none" stroke={accent} strokeWidth={4} />
        {screen.map((x, i) =>
          i / screen.length < screenP ? (
            <circle key={i} cx={X(x)} cy={Y(post[Math.round(x * 160)].m)} r={3} fill={ink} fillOpacity={0.35} />
          ) : null,
        )}
        {runs.slice(0, shown).map((x, i) => {
          const s = spring({ frame: frame - i * perRun, fps, config: { damping: 12 } });
          return (
            <g key={x}>
              <line x1={X(x)} x2={X(x)} y1={B} y2={Y(truth(x))} stroke={ink} strokeOpacity={0.12 * s} />
              <circle cx={X(x)} cy={Y(truth(x))} r={10 * s} fill={bg} stroke={ink} strokeWidth={3} />
            </g>
          );
        })}
        {bestP > 0.01 && (
          <g transform={`translate(${X(grid[best])},${Y(post[best].m)})`} opacity={Math.min(1, bestP)}>
            <circle r={26 * bestP} fill="none" stroke={accent} strokeWidth={3} />
            <line x1={0} x2={0} y1={34} y2={110} stroke={accent} strokeWidth={2} />
            <text y={146} textAnchor="middle" fontSize={26} fill={accent}>
              −15% DRIVE POWER
            </text>
          </g>
        )}
      </svg>
      <div style={{ position: "absolute", left: L, top: 60, fontSize: 24, letterSpacing: "0.06em" }}>
        <span style={{ color: accent }}>●</span> GAUSSIAN-PROCESS SURROGATE
      </div>
      <div style={{ position: "absolute", right: 120, top: 60, fontSize: 24, textAlign: "right" }}>
        CFD RUNS <b style={{ fontSize: 40, color: accent }}>{String(shown).padStart(2, "0")}</b>/10
        <div style={{ opacity: 0.6, marginTop: 6 }}>
          designs screened {Math.round(screenP * 3000).toLocaleString("en-IN")}
          {screenP >= 1 ? "+" : ""}
        </div>
      </div>
      <div style={{ position: "absolute", left: L, bottom: 90, fontSize: 22, opacity: 0.6 }}>
        design variable →
      </div>
      <div style={{ position: "absolute", left: 40, top: T, fontSize: 22, opacity: 0.6, writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
        drive power →
      </div>
      <div style={{ position: "absolute", right: 120, bottom: 90, fontSize: 22, opacity: 0.6 }}>
        mean ± 2σ · dashed = ground truth
      </div>
    </AbsoluteFill>
  );
};
