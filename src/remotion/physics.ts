// Small, dependency-free numerics used by the compositions.
// Everything here is deterministic so Remotion can render any frame in isolation.

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
