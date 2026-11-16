/**
 * A stat mid-count: "3,000+" at t = 0.5 reads "1,500+". Only plain figures count up;
 * ranges ("35–50×"), ranks ("#2") and words appear as they are.
 */
export function figure(value: string, t: number) {
  const m = /^([−+₹]?)(\d[\d,]*\.?\d*)(.*)$/.exec(value);
  if (!m || /[–-]/.test(m[3]) || t >= 1) return value;
  const target = Number(m[2].replace(/,/g, ""));
  const dec = (m[2].split(".")[1] ?? "").length;
  const n = target * Math.max(0, t);
  return `${m[1]}${dec ? n.toFixed(dec) : Math.round(n).toLocaleString("en-IN")}${m[3]}`;
}
