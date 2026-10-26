// Small, dependency-free numerics used by the compositions.
// Everything here is deterministic so Remotion can render any frame in isolation.

export type C = [number, number];

const add = (a: C, b: C): C => [a[0] + b[0], a[1] + b[1]];
const sub = (a: C, b: C): C => [a[0] - b[0], a[1] - b[1]];
const mul = (a: C, b: C): C => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const div = (a: C, b: C): C => {
  const d = b[0] * b[0] + b[1] * b[1];
  return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d];
};
const abs = (a: C) => Math.hypot(a[0], a[1]);
const expi = (t: number): C => [Math.cos(t), Math.sin(t)];
const csqrt = (a: C): C => {
  const r = abs(a);
  const re = Math.sqrt((r + a[0]) / 2);
  const im = Math.sign(a[1] || 1) * Math.sqrt(Math.max(0, (r - a[0]) / 2));
  return [re, im];
};

/* ------------------------------------------------------------------ */
/* Joukowski airfoil in potential flow (Kutta condition enforced)      */
/* ------------------------------------------------------------------ */

export type Streamline = {
  pts: { x: number; y: number }[];
  /** cumulative time-of-flight at each point (for velocity-true particles) */
  t: number[];
  /** local speed |V|/U∞ at each point */
  speed: number[];
  total: number;
};

export type FlowField = {
  airfoil: { x: number; y: number }[];
  lines: Streamline[];
  cl: number;
};

export function joukowskiFlow(opts: {
  alphaDeg: number;
  lines: number;
  yMin: number;
  yMax: number;
  xStart: number;
  xEnd: number;
  camber?: number;
  thickness?: number;
}): FlowField {
  const c = 1;
  const mu: C = [-(opts.thickness ?? 0.09), opts.camber ?? 0.09];
  const R = abs(sub([c, 0], mu));
  const alpha = (opts.alphaDeg * Math.PI) / 180;
  const beta = Math.asin(mu[1] / R);
  const U = 1;
  const gamma = 4 * Math.PI * U * R * Math.sin(alpha + beta);

  const toZ = (zeta: C): C => add(zeta, div([c * c, 0], zeta));
  const dzdzeta = (zeta: C): C => sub([1, 0], div([c * c, 0], mul(zeta, zeta)));
  const dwdzeta = (zeta: C): C => {
    const zp = sub(zeta, mu);
    const t1 = mul([U, 0], sub(expi(-alpha), div(mul([R * R, 0], expi(alpha)), mul(zp, zp))));
    const t2 = div([0, gamma / (2 * Math.PI)], zp);
    return add(t1, t2);
  };
  const fromZ = (z: C): C => {
    const s = csqrt(sub(mul(z, z), [4 * c * c, 0]));
    const a = mul(add(z, s), [0.5, 0]);
    const b = mul(sub(z, s), [0.5, 0]);
    return abs(sub(a, mu)) >= abs(sub(b, mu)) ? a : b;
  };

  const airfoil: { x: number; y: number }[] = [];
  for (let i = 0; i <= 180; i++) {
    const th = (i / 180) * Math.PI * 2;
    const z = toZ(add(mu, mul([R, 0], expi(th))));
    airfoil.push({ x: z[0], y: z[1] });
  }

  const lines: Streamline[] = [];
  const h = 0.018;
  for (let k = 0; k < opts.lines; k++) {
    const y0 = opts.yMin + ((opts.yMax - opts.yMin) * (k + 0.5)) / opts.lines;
    let zeta = fromZ([opts.xStart, y0]);
    const pts: { x: number; y: number }[] = [];
    const t: number[] = [];
    const speed: number[] = [];
    let time = 0;
    let ok = true;
    for (let step = 0; step < 1400; step++) {
      const z = toZ(zeta);
      const dw = dwdzeta(zeta);
      const dz = dzdzeta(zeta);
      const dzAbs = Math.max(abs(dz), 0.25);
      const vz = abs(dw) / dzAbs;
      pts.push({ x: z[0], y: z[1] });
      speed.push(vz);
      t.push(time);
      if (z[0] > opts.xEnd) break;
      // direction of the velocity in the zeta plane = conj(dw/dzeta)
      const dir: C = [dw[0], -dw[1]];
      const n = abs(dir) || 1;
      const stepZeta = h / dzAbs;
      zeta = add(zeta, [(dir[0] / n) * stepZeta, (dir[1] / n) * stepZeta]);
      if (abs(sub(zeta, mu)) < R * 1.002) {
        ok = false;
        break;
      }
      time += h / Math.max(vz, 0.08);
    }
    if (ok && pts.length > 20) lines.push({ pts, t, speed, total: time });
  }
  const xsA = airfoil.map((p) => p.x);
  const chord = Math.max(...xsA) - Math.min(...xsA);
  // Kutta–Joukowski: L' = ρ U Γ  →  C_L = 2Γ / (U c)
  return { airfoil, lines, cl: (2 * gamma) / (U * chord) };
}

/** Position on a streamline at a given time of flight (linear interpolation). */
export function sampleAt(line: Streamline, time: number) {
  const { t, pts, speed } = line;
  if (time <= 0) return { ...pts[0], v: speed[0] };
  let lo = 0;
  let hi = t.length - 1;
  if (time >= t[hi]) return { ...pts[hi], v: speed[hi] };
  while (hi - lo > 1) {
    const m = (lo + hi) >> 1;
    if (t[m] <= time) lo = m;
    else hi = m;
  }
  const f = (time - t[lo]) / (t[hi] - t[lo] || 1);
  return {
    x: pts[lo].x + (pts[hi].x - pts[lo].x) * f,
    y: pts[lo].y + (pts[hi].y - pts[lo].y) * f,
    v: speed[lo] + (speed[hi] - speed[lo]) * f,
  };
}

/* ------------------------------------------------------------------ */
/* Gaussian-process regression (RBF kernel, Cholesky solve)            */
/* ------------------------------------------------------------------ */

export function gpPosterior(
  xs: number[],
  ys: number[],
  grid: number[],
  ell = 0.12,
  sf = 0.3,
  noise = 1e-4,
) {
  const n = xs.length;
  const k = (a: number, b: number) => sf * sf * Math.exp(-((a - b) ** 2) / (2 * ell * ell));
  const mean0 = n ? ys.reduce((s, v) => s + v, 0) / n : 0;
  if (n === 0) return grid.map(() => ({ m: mean0, s: sf }));
  const K: number[][] = xs.map((a, i) => xs.map((b, j) => k(a, b) + (i === j ? noise : 0)));
  // Cholesky
  const L: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let s = K[i][j];
      for (let p = 0; p < j; p++) s -= L[i][p] * L[j][p];
      L[i][j] = i === j ? Math.sqrt(Math.max(s, 1e-12)) : s / L[j][j];
    }
  }
  const fwd = (b: number[]) => {
    const y = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      let s = b[i];
      for (let p = 0; p < i; p++) s -= L[i][p] * y[p];
      y[i] = s / L[i][i];
    }
    return y;
  };
  const bwd = (y: number[]) => {
    const x = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let s = y[i];
      for (let p = i + 1; p < n; p++) s -= L[p][i] * x[p];
      x[i] = s / L[i][i];
    }
    return x;
  };
  const alpha = bwd(fwd(ys.map((v) => v - mean0)));
  return grid.map((g) => {
    const ks = xs.map((a) => k(a, g));
    const m = mean0 + ks.reduce((s, v, i) => s + v * alpha[i], 0);
    const v = fwd(ks);
    const varr = sf * sf - v.reduce((s, q) => s + q * q, 0);
    return { m, s: Math.sqrt(Math.max(varr, 0)) };
  });
}

/** Seeded PRNG (mulberry32) for deterministic scatter. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
