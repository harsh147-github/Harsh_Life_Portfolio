/* ------------------------------------------------------------------ */
/* A human silhouette as a signed distance field (height 1, x centred) */
/* ------------------------------------------------------------------ */
const cap = (px: number, py: number, ax: number, ay: number, bx: number, by: number, r: number) => {
  const pax = px - ax;
  const pay = py - ay;
  const bax = bx - ax;
  const bay = by - ay;
  const h = Math.min(1, Math.max(0, (pax * bax + pay * bay) / (bax * bax + bay * bay || 1)));
  return Math.hypot(pax - bax * h, pay - bay * h) - r;
};
export function body(x: number, y: number) {
  const ax = Math.abs(x);
  return Math.min(
    Math.hypot(x, y - 0.075) - 0.062,
    cap(x, y, 0, 0.13, 0, 0.17, 0.028),
    cap(ax, y, 0, 0.205, 0.1, 0.205, 0.045),
    cap(x, y, 0, 0.215, 0, 0.33, 0.088),
    cap(x, y, 0, 0.33, 0, 0.46, 0.07),
    cap(ax, y, 0, 0.48, 0.045, 0.48, 0.06),
    cap(ax, y, 0.125, 0.215, 0.145, 0.36, 0.033),
    cap(ax, y, 0.145, 0.36, 0.155, 0.5, 0.027),
    Math.hypot(ax - 0.157, y - 0.525) - 0.03,
    cap(ax, y, 0.05, 0.5, 0.056, 0.73, 0.046),
    cap(ax, y, 0.056, 0.73, 0.06, 0.94, 0.034),
    cap(ax, y, 0.055, 0.965, 0.085, 0.97, 0.022),
  );
}
