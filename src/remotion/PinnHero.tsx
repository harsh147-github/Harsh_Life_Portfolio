import { useEffect, useMemo, useRef } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { rng } from "./physics";

export type PinnHeroProps = { accent: string };

/* Always dark, like a viewport in an engineering tool, whatever the page theme. */
const BG = "#05070b";
const INK = "#e8edf6";
const CYAN = "#58e1ff";
const PINK = "#ff4d8d";
const mono = "'JetBrains Mono', ui-monospace, monospace";
const serif = "'Instrument Serif', Georgia, serif";
const display = "'Inter Tight', sans-serif";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);

const CMAP = ["#30123b", "#4662d7", "#36aaf9", "#1ae4b6", "#72fe5e", "#c8ef34", "#faba39", "#f66b19", "#ca2a04", "#7a0403"].map((h) =>
  [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)),
);
const cmap = (v: number, shade = 1) => {
  const x = Math.min(0.9999, Math.max(0, v)) * (CMAP.length - 1);
  const i = Math.floor(x);
  const f = x - i;
  const c = CMAP[i].map((a, j) => Math.round((a + (CMAP[i + 1][j] - a) * f) * shade));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};
const mix = (a: string, b: string, t: number) => {
  const A = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const B = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return A.map((x, i) => Math.round(x + (B[i] - x) * t));
};

/* ---------------- timeline (600 frames) ---------------- */
const TRAIN_A = 40;
const TRAIN_B = 270;
const INFER_B = 570;

/* ---------------- layout (1600 × 820) ---------------- */
const LX = [640, 735, 830, 925, 1020];
const SIZES = [3, 7, 7, 7, 1];
const NCY = 300;
const nodeY = (n: number, i: number) => NCY + (i - (n - 1) / 2) * 38;
const LEFT = { ox: 56, oy: 392, k: 318 };
const RIGHT = { ox: 1118, oy: 392, k: 318 };
const NS = 36;
const NT = 12;

type Design = { sweep: number; taper: number; q: number };
const designAt = (u: number): Design => ({
  sweep: ((20 + 13 * Math.sin(2 * Math.PI * u)) * Math.PI) / 180,
  taper: 0.42 + 0.17 * Math.sin(2 * Math.PI * 2 * u),
  q: 1 + 0.32 * Math.sin(2 * Math.PI * 3 * u),
});
/** cantilever wing under lift: bending stress ∝ (1−s)², deflection ∝ s²(6−4s+s²) */
const stress = (s: number, t: number, d: Design) =>
  (d.q * (1 - s) ** 2 * (0.82 + 0.36 * Math.sin(Math.PI * t)) * (1 + 0.35 * (1 - d.taper))) / (1.18 * (1 + 0.35 * (1 - d.taper)) * 1.32);
const deflect = (s: number, d: Design) => (d.q * 0.07 * s * s * (6 - 4 * s + s * s)) / 3;

export const PinnHero: React.FC<PinnHeroProps> = ({ accent }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvas = useRef<HTMLCanvasElement>(null);

  const colloc = useMemo(() => {
    const r = rng(42);
    return Array.from({ length: 170 }, () => ({ s: 0.03 + r() * 0.94, t: 0.06 + r() * 0.88, ph: r() * 6.28 }));
  }, []);
  const edges = useMemo(() => {
    const out: { l: number; a: number; b: number }[] = [];
    for (let l = 0; l < 4; l++) for (let a = 0; a < SIZES[l]; a++) for (let b = 0; b < SIZES[l + 1]; b++) out.push({ l, a, b });
    return out;
  }, []);

  const conv = ease(interpolate(frame, [TRAIN_A, TRAIN_B - 20], [0, 1], clamp)) * interpolate(frame, [INFER_B, 598], [1, 0], clamp);
  const training = frame < TRAIN_B;
  const u = interpolate(frame, [TRAIN_B, INFER_B], [0, 1], clamp);
  const d = designAt(u);
  const epoch = Math.floor(interpolate(frame, [TRAIN_A, TRAIN_B], [0, 20000], clamp));
  const designNo = Math.max(1, Math.floor(u * 300));
  // no intro fade: the loop opens on a complete scene, so any single frame reads well
  const appear = (_a: number, _b: number) => 1;

  const loss = {
    pde: 0.03 + 0.97 * (1 - conv) ** 1.6,
    bc: 0.02 + 0.98 * (1 - conv) ** 2.4,
    data: 0.04 + 0.96 * (1 - conv) ** 1.2,
  };
  const total = Math.pow(10, -0.3 - 4.6 * conv);

  useEffect(() => {
    const cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    ctx.setTransform(2, 0, 0, 2, 0, 0);
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, width, height);

    // faint engineering grid
    ctx.strokeStyle = "rgba(232,237,246,0.035)";
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    // panel dividers
    ctx.strokeStyle = "rgba(232,237,246,0.16)";
    [
      [48, 520],
      [600, 1080],
      [1118, 1552],
    ].forEach(([a, b]) => {
      ctx.beginPath();
      ctx.moveTo(a, 112);
      ctx.lineTo(b, 112);
      ctx.stroke();
    });

    const wingP = (o: typeof LEFT, withW: boolean) => (s: number, t: number) => {
      const c = 0.42 * (1 - (1 - d.taper) * s);
      const X = s * Math.tan(d.sweep) + t * c;
      const Z = withW ? deflect(s, d) * conv : 0;
      return [o.ox + (s * 0.92 + X * 0.42) * o.k, o.oy + (-s * 0.36 + X * 0.5) * o.k - Z * o.k] as const;
    };

    /* ---------- 01 · geometry + collocation points ---------- */
    const L = wingP(LEFT, false);
    const a1 = appear(0, 30);
    ctx.globalAlpha = a1;
    const outline = () => {
      ctx.beginPath();
      for (let i = 0; i <= 20; i++) ctx.lineTo(...L(i / 20, 0));
      for (let i = 20; i >= 0; i--) ctx.lineTo(...L(i / 20, 1));
      ctx.closePath();
    };
    outline();
    const g = ctx.createLinearGradient(LEFT.ox, LEFT.oy - 120, LEFT.ox + 420, LEFT.oy + 120);
    g.addColorStop(0, "rgba(120,170,255,0.16)");
    g.addColorStop(1, "rgba(120,170,255,0.03)");
    ctx.fillStyle = g;
    ctx.fill();
    ctx.strokeStyle = "rgba(170,200,255,0.16)";
    for (let i = 1; i < 12; i++) {
      ctx.beginPath();
      ctx.moveTo(...L(i / 12, 0));
      ctx.lineTo(...L(i / 12, 1));
      ctx.stroke();
    }
    for (let j = 1; j < 5; j++) {
      ctx.beginPath();
      for (let i = 0; i <= 12; i++) ctx.lineTo(...L(i / 12, j / 5));
      ctx.stroke();
    }
    outline();
    ctx.strokeStyle = "rgba(200,225,255,0.7)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.lineWidth = 1;
    // lift arrows (elliptic distribution)
    ctx.strokeStyle = "rgba(255,138,61,0.75)";
    ctx.fillStyle = "rgba(255,138,61,0.75)";
    [0.12, 0.3, 0.48, 0.66, 0.84].forEach((s) => {
      const [x, y] = L(s, 0.5);
      const len = 20 + 40 * d.q * Math.sqrt(1 - s * s);
      ctx.beginPath();
      ctx.moveTo(x, y + 12 + len);
      ctx.lineTo(x, y + 16);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y + 9);
      ctx.lineTo(x - 5, y + 18);
      ctx.lineTo(x + 5, y + 18);
      ctx.fill();
    });
    // collocation points, coloured by their PDE residual
    ctx.globalCompositeOperation = "lighter";
    const show = (training ? 1 : 0.45 + 0.55 * interpolate(frame, [INFER_B, 598], [0, 1], clamp));
    colloc.forEach((c) => {
      const [x, y] = L(c.s, c.t);
      const r = (1 - conv) * (0.55 + 0.45 * Math.sin(frame * 0.13 + c.ph)) + 0.03;
      const [cr, cg, cb] = mix(CYAN, PINK, Math.min(1, r));
      ctx.fillStyle = `rgba(${cr},${cg},${cb},${0.18 * show})`;
      ctx.beginPath();
      ctx.arc(x, y, 6 + 5 * r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(${cr},${cg},${cb},${0.95 * show})`;
      ctx.beginPath();
      ctx.arc(x, y, 1.8 + 1.2 * r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;

    /* ---------- links into and out of the network ---------- */
    const a2 = appear(15, 45);
    ctx.globalAlpha = a2;
    const flowDots = (pts: [number, number, number, number, number, number], color: string, speed: number, n: number) => {
      const [x0, y0, cx, cy, x1, y1] = pts;
      ctx.strokeStyle = "rgba(232,237,246,0.12)";
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.quadraticCurveTo(cx, cy, x1, y1);
      ctx.stroke();
      ctx.fillStyle = color;
      for (let i = 0; i < n; i++) {
        const t = ((frame * speed) / 100 + i / n) % 1;
        const x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x1;
        const y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * y1;
        ctx.beginPath();
        ctx.arc(x, y, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    [
      [0.55, 0.3],
      [0.7, 0.6],
      [0.82, 0.45],
    ].forEach(([s, t], i) => {
      const [x, y] = L(s, t);
      flowDots([x, y, 560, nodeY(3, i), LX[0] - 12, nodeY(3, i)], CYAN, 1.6, 4);
    });
    const R = wingP(RIGHT, true);
    const [rx, ry] = R(0.25, 0.4);
    flowDots([LX[4] + 12, NCY, 1090, NCY, rx, ry], accent, 1.8, 5);
    ctx.globalAlpha = 1;

    /* ---------- 02 · the network ---------- */
    ctx.globalAlpha = a2;
    const FW = training ? 40 : 26;
    const F = ((frame % FW) / FW) * 4.8 - 0.4;
    const B = (((frame + FW / 2) % FW) / FW) * 4.8 - 0.4;
    const backOn = interpolate(frame, [TRAIN_A, TRAIN_A + 20, TRAIN_B - 10, TRAIN_B], [0, 1, 1, 0], clamp);
    edges.forEach((e) => {
      const x0 = LX[e.l] + 9;
      const y0 = nodeY(SIZES[e.l], e.a);
      const x1 = LX[e.l + 1] - 9;
      const y1 = nodeY(SIZES[e.l + 1], e.b);
      const tf = F - e.l;
      const hot = tf > 0 && tf < 1 ? 1 - Math.abs(tf - 0.5) * 2 : 0;
      ctx.strokeStyle = `rgba(88,225,255,${0.06 + 0.3 * hot})`;
      ctx.lineWidth = 1 + hot;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    });
    ctx.lineWidth = 1;
    ctx.globalCompositeOperation = "lighter";
    edges.forEach((e, i) => {
      if (i % 2) return;
      const x0 = LX[e.l] + 9;
      const y0 = nodeY(SIZES[e.l], e.a);
      const x1 = LX[e.l + 1] - 9;
      const y1 = nodeY(SIZES[e.l + 1], e.b);
      const tf = F - e.l;
      if (tf > 0 && tf < 1) {
        ctx.fillStyle = "rgba(88,225,255,0.9)";
        ctx.beginPath();
        ctx.arc(x0 + (x1 - x0) * tf, y0 + (y1 - y0) * tf, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      const tb = B - (3 - e.l);
      if (backOn > 0 && tb > 0 && tb < 1) {
        ctx.fillStyle = `rgba(255,77,141,${0.85 * backOn})`;
        ctx.beginPath();
        ctx.arc(x1 + (x0 - x1) * tb, y1 + (y0 - y1) * tb, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    ctx.globalCompositeOperation = "source-over";
    SIZES.forEach((n, l) =>
      Array.from({ length: n }).forEach((_, i) => {
        const x = LX[l];
        const y = nodeY(n, i);
        const act = Math.max(0, 1 - Math.abs(F - l) * 1.4);
        if (act > 0) {
          const gr = ctx.createRadialGradient(x, y, 0, x, y, 24);
          gr.addColorStop(0, `rgba(88,225,255,${0.45 * act})`);
          gr.addColorStop(1, "rgba(88,225,255,0)");
          ctx.fillStyle = gr;
          ctx.beginPath();
          ctx.arc(x, y, 24, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = BG;
        ctx.strokeStyle = `rgba(232,237,246,${0.55 + 0.45 * act})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(x, y, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = `rgba(88,225,255,${0.15 + 0.8 * act})`;
        ctx.beginPath();
        ctx.arc(x, y, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }),
    );
    ctx.lineWidth = 1;

    /* ---------- the physics loop: autodiff → residual → loss → backprop ---------- */
    const a3 = appear(30, 60);
    ctx.globalAlpha = a3;
    ctx.strokeStyle = "rgba(232,237,246,0.35)";
    ctx.setLineDash([4, 6]);
    ctx.lineDashOffset = -frame * 0.8;
    ctx.beginPath();
    ctx.moveTo(LX[4], NCY + 12);
    ctx.lineTo(LX[4], 500);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(938, 520);
    ctx.lineTo(902, 520);
    ctx.stroke();
    // backprop arc into the weights
    ctx.strokeStyle = `rgba(255,77,141,${0.25 + 0.6 * backOn})`;
    ctx.lineWidth = 1.6;
    ctx.lineDashOffset = frame * 1.2;
    ctx.beginPath();
    ctx.moveTo(600, 560);
    ctx.quadraticCurveTo(560, 430, LX[1] - 10, nodeY(7, 6) + 14);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.lineWidth = 1;
    // residual panel
    ctx.strokeStyle = "rgba(232,237,246,0.2)";
    ctx.strokeRect(600, 474, 302, 222);
    const rows = [
      { y: 528, v: loss.pde, c: PINK },
      { y: 578, v: loss.bc, c: "#ffb020" },
      { y: 628, v: loss.data, c: CYAN },
    ];
    rows.forEach((r) => {
      ctx.fillStyle = "rgba(232,237,246,0.08)";
      ctx.fillRect(770, r.y - 6, 116, 10);
      ctx.fillStyle = r.c;
      ctx.fillRect(770, r.y - 6, 116 * r.v, 10);
    });
    // autodiff pill
    ctx.strokeStyle = "rgba(255,138,61,0.8)";
    ctx.fillStyle = "rgba(255,138,61,0.08)";
    ctx.beginPath();
    ctx.roundRect(940, 500, 160, 42, 21);
    ctx.fill();
    ctx.stroke();
    ctx.globalAlpha = 1;

    /* ---------- 03 · predicted field ---------- */
    const a4 = appear(25, 55);
    ctx.globalAlpha = a4;
    const vals: number[][] = [];
    for (let i = 0; i <= NS; i++) {
      vals.push([]);
      for (let j = 0; j <= NT; j++) {
        const s = i / NS;
        const t = j / NT;
        const truth = stress(s, t, d);
        const noise = 0.5 + 0.28 * Math.sin(7 * s + 2 + frame * 0.07) * Math.cos(5 * t + frame * 0.05) + 0.18 * Math.sin(13 * s * t + frame * 0.1);
        vals[i].push(truth * conv + noise * (1 - conv));
      }
    }
    for (let i = 0; i < NS; i++)
      for (let j = 0; j < NT; j++) {
        const p = [R(i / NS, j / NT), R((i + 1) / NS, j / NT), R((i + 1) / NS, (j + 1) / NT), R(i / NS, (j + 1) / NT)];
        const v = (vals[i][j] + vals[i + 1][j] + vals[i + 1][j + 1] + vals[i][j + 1]) / 4;
        const slope = conv * (deflect((i + 1) / NS, d) - deflect(i / NS, d)) * NS;
        const shade = 0.78 + 0.22 * (1 - j / NT) - 0.25 * slope;
        ctx.fillStyle = cmap(v, Math.max(0.55, Math.min(1.05, shade)));
        ctx.strokeStyle = ctx.fillStyle;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(...p[0]);
        p.slice(1).forEach((q) => ctx.lineTo(...q));
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    // iso-stress contour lines (marching squares)
    ctx.strokeStyle = "rgba(255,255,255,0.38)";
    ctx.lineWidth = 1;
    [0.15, 0.3, 0.45, 0.6, 0.75, 0.9].forEach((lev) => {
      ctx.beginPath();
      for (let i = 0; i < NS; i++)
        for (let j = 0; j < NT; j++) {
          const cs = [
            [i, j],
            [i + 1, j],
            [i + 1, j + 1],
            [i, j + 1],
          ];
          const pts: [number, number][] = [];
          for (let e = 0; e < 4; e++) {
            const [ai, aj] = cs[e];
            const [bi, bj] = cs[(e + 1) % 4];
            const va = vals[ai][aj];
            const vb = vals[bi][bj];
            if ((va - lev) * (vb - lev) < 0) {
              const f = (lev - va) / (vb - va);
              const pt = R((ai + (bi - ai) * f) / NS, (aj + (bj - aj) * f) / NT);
              pts.push([pt[0], pt[1]]);
            }
          }
          if (pts.length >= 2) {
            ctx.moveTo(...pts[0]);
            ctx.lineTo(...pts[1]);
          }
          if (pts.length === 4) {
            ctx.moveTo(...pts[2]);
            ctx.lineTo(...pts[3]);
          }
        }
      ctx.stroke();
    });
    // wing outline + undeformed ghost
    const G = wingP(RIGHT, false);
    ctx.strokeStyle = "rgba(232,237,246,0.18)";
    ctx.setLineDash([3, 5]);
    ctx.beginPath();
    for (let i = 0; i <= 20; i++) ctx.lineTo(...G(i / 20, 1));
    ctx.stroke();
    ctx.setLineDash([]);
    // colour bar
    const cb = ctx.createLinearGradient(1130, 0, 1400, 0);
    CMAP.forEach((c, i) => cb.addColorStop(i / (CMAP.length - 1), `rgb(${c.join(",")})`));
    ctx.fillStyle = cb;
    ctx.fillRect(1130, 652, 270, 9);
    ctx.globalAlpha = 1;
  }, [frame, width, height, colloc, edges, conv, d, training, accent, loss.pde, loss.bc, loss.data]);

  const t1 = appear(0, 25);
  const t3 = appear(30, 60);
  const fmtE = (x: number) => x.toExponential(1).replace("e-", "e−");

  return (
    <AbsoluteFill style={{ background: BG, color: INK, fontFamily: mono }}>
      <canvas ref={canvas} width={width * 2} height={height * 2} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />

      {/* header */}
      <div style={{ position: "absolute", left: 48, top: 34, fontSize: 20, letterSpacing: "0.1em", opacity: t1 }}>
        <span style={{ color: accent }}>●</span> PHYSICS-INFORMED NEURAL NETWORK · COMPOSITE WING
      </div>
      <div style={{ position: "absolute", right: 48, top: 34, fontSize: 20, letterSpacing: "0.1em", textAlign: "right", opacity: t1 }}>
        {training ? (
          <>
            TRAINING · epoch <span style={{ color: CYAN }}>{epoch.toLocaleString("en-IN")}</span>
          </>
        ) : (
          <>
            INFERENCE · design <span style={{ color: accent }}>#{String(designNo).padStart(4, "0")}</span>
          </>
        )}
      </div>

      {/* panel titles */}
      {[
        [48, "01", "Geometry, loads, collocation points"],
        [600, "02", "Physics-informed network"],
        [1118, "03", "Predicted stress field"],
      ].map(([x, n, t]) => (
        <div key={n as string} style={{ position: "absolute", left: x as number, top: 80, fontSize: 17, letterSpacing: "0.08em", opacity: t1, textTransform: "uppercase" }}>
          <span style={{ color: accent }}>{n}</span>&nbsp;&nbsp;{t}
        </div>
      ))}

      {/* 01 readouts */}
      <div style={{ position: "absolute", left: 48, top: 640, fontSize: 18, opacity: t1 }}>
        sweep {((d.sweep * 180) / Math.PI).toFixed(0)}° · taper {d.taper.toFixed(2)} · lift {d.q.toFixed(2)}q
      </div>
      <div style={{ position: "absolute", left: 48, top: 672, fontSize: 15, opacity: 0.6 * t1, display: "flex", alignItems: "center", gap: 10 }}>
        collocation residual
        <span style={{ display: "inline-block", width: 90, height: 8, background: `linear-gradient(90deg, ${CYAN}, ${PINK})` }} />
        low → high
      </div>

      {/* 02 network labels */}
      <div style={{ opacity: t1 }}>
        {["x", "y", "p"].map((s, i) => (
          <div key={s} style={{ position: "absolute", left: LX[0] - 46, top: nodeY(3, i) - 20, fontFamily: serif, fontStyle: "italic", fontSize: 30 }}>
            {s}
          </div>
        ))}
        <div style={{ position: "absolute", left: LX[4] + 18, top: NCY - 46, fontFamily: serif, fontStyle: "italic", fontSize: 30 }}>w</div>
        <div style={{ position: "absolute", left: 640, top: 150, fontFamily: serif, fontStyle: "italic", fontSize: 30, color: INK }}>
          u<sub style={{ fontSize: 18 }}>θ</sub>(x, y, p) → w
        </div>
      </div>
      <div style={{ opacity: t3 }}>
        <div style={{ position: "absolute", left: 950, top: 508, width: 140, textAlign: "center", fontSize: 15, color: "#ffb37a" }}>
          autodiff ∇⁴w
        </div>
        <div style={{ position: "absolute", left: 614, top: 486, fontSize: 14, letterSpacing: "0.12em", opacity: 0.65 }}>PHYSICS IN THE LOSS</div>
        {[
          [516, "PDE", "D∇⁴w − q", loss.pde],
          [566, "BC", "w = 0 at root", loss.bc],
          [616, "DATA", "few gauges", loss.data],
        ].map(([y, k, eq, v]) => (
          <div key={k as string} style={{ position: "absolute", left: 614, top: (y as number) - 8, width: 276, display: "flex", fontSize: 15 }}>
            <span style={{ width: 52, opacity: 0.6 }}>{k}</span>
            <span style={{ fontFamily: serif, fontStyle: "italic", fontSize: 19, width: 104, marginTop: -3 }}>{eq}</span>
            <span style={{ marginLeft: "auto", opacity: 0.75, fontSize: 12 }}>{fmtE((v as number) * 0.1)}</span>
          </div>
        ))}
        <div style={{ position: "absolute", left: 614, top: 652, width: 276, display: "flex", justifyContent: "space-between", fontSize: 17 }}>
          <span>L total</span>
          <span style={{ color: conv > 0.95 ? "#72fe5e" : INK }}>{fmtE(total)}</span>
        </div>
        <div style={{ position: "absolute", left: 470, top: 418, fontSize: 15, color: PINK, opacity: 0.5 + 0.5 * (training ? 1 : 0) }}>
          backprop ∇<sub>θ</sub>L
        </div>
      </div>

      {/* 03 readouts */}
      <div style={{ position: "absolute", left: 1130, top: 610, fontSize: 15, opacity: 0.7 * t1, width: 270, display: "flex", justifyContent: "space-between" }}>
        <span>0</span>
        <span>von Mises / max</span>
        <span>1</span>
      </div>
      <div style={{ position: "absolute", left: 1130, top: 684, fontSize: 18, opacity: t1 }}>
        {training ? "learning the physics…" : "full field · one forward pass"}
      </div>
      <div style={{ position: "absolute", left: 1130, top: 714, fontSize: 15, opacity: 0.6 * t1 }}>
        peak stress at the root · deflection at the tip
      </div>

      {/* footer */}
      <div style={{ position: "absolute", left: 48, right: 48, bottom: 30, display: "flex", justifyContent: "space-between", fontSize: 15, opacity: 0.55 }}>
        <span style={{ fontFamily: display, fontSize: 17, letterSpacing: 0 }}>PINNs · neural operators · physics-informed surrogates for aerostructures</span>
        <span>illustrative model · cantilever composite wing</span>
      </div>
    </AbsoluteFill>
  );
};
