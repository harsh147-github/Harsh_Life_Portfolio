import type { CSSProperties } from "react";

/** Each chapter's own colours. Used by its work card, its case study and its animations. */
export const palettes: Record<string, { bg: string; fg: string; accent: string }> = {
  veloce: { bg: "#0b0b0b", fg: "#f5f5f5", accent: "#e10600" },
  impact: { bg: "#050d1a", fg: "#e6efff", accent: "#3da5ff" },
  airflow: { bg: "#e9f3f1", fg: "#062925", accent: "#0e8c7f" },
  aero: { bg: "#16181b", fg: "#eceef0", accent: "#ff6a13" },
  paper: { bg: "#f3eee3", fg: "#141a3c", accent: "#2d3fbf" },
  civic: { bg: "#fffaf4", fg: "#1b1611", accent: "#ef7a12" },
  rself: { bg: "#0a0a0a", fg: "#f4f1ec", accent: "#ff3d8b" },
  carbon: { bg: "#0e0e0f", fg: "#ede6d6", accent: "#c8a867" },
  pinn: { bg: "#eef3fb", fg: "#0d1b3d", accent: "#1f6feb" },
  fan: { bg: "#0f1417", fg: "#e6f0f1", accent: "#2dd4bf" },
  bench: { bg: "#f6f1e7", fg: "#2a2018", accent: "#b4530f" },
};

/** Inline custom properties that put an element (with class "themed") in a chapter's colours. */
export function themeVars(theme: string): CSSProperties {
  const p = palettes[theme];
  return p ? ({ "--bg": p.bg, "--fg": p.fg, "--accent": p.accent } as CSSProperties) : {};
}
