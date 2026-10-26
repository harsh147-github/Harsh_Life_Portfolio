import type { ComponentType } from "react";
import { Airflow } from "./Airflow";
import { EigenModes } from "./EigenModes";
import { meta, type CompositionId } from "./meta";
import { SignalToBrief } from "./SignalToBrief";
import { Surrogate } from "./Surrogate";
import { TwinMatch } from "./TwinMatch";

export { FPS, type CompositionId } from "./meta";

type Entry = (typeof meta)[CompositionId] & {
  component: ComponentType<Record<string, unknown>>;
  defaultProps: Record<string, unknown>;
};
const C = (c: unknown) => c as ComponentType<Record<string, unknown>>;

// Single source of truth for every motion piece — used by the site's <Player>
// and by Remotion Studio (npm run studio) for rendering MP4s.
export const compositions: Record<CompositionId, Entry> = {
  airflow: {
    ...meta.airflow,
    component: C(Airflow),
    defaultProps: { bg: "#0b0b0b", ink: "#f5f5f5", accent: "#e10600", inverted: true, labels: true, alphaDeg: 8 },
  },
  airflowWide: {
    ...meta.airflowWide,
    component: C(Airflow),
    defaultProps: { bg: "#fafaf8", ink: "#0a0a0a", accent: "#0a0a0a", inverted: false, labels: false, alphaDeg: 6 },
  },
  eigen: { ...meta.eigen, component: C(EigenModes), defaultProps: { bg: "#f3eee3", ink: "#141a3c", accent: "#2d3fbf" } },
  surrogate: { ...meta.surrogate, component: C(Surrogate), defaultProps: { bg: "#e9f3f1", ink: "#062925", accent: "#0e8c7f" } },
  signal: {
    ...meta.signal,
    component: C(SignalToBrief),
    defaultProps: { bg: "#fffaf4", ink: "#1b1611", accent: "#ef7a12", good: "#1f7a4d" },
  },
  twin: { ...meta.twin, component: C(TwinMatch), defaultProps: { bg: "#ffc9e0", ink: "#0b0b0b", accent: "#e8006f" } },
};
