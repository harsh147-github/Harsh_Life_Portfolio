import type { ComponentType } from "react";
import { EigenModes } from "./EigenModes";
import { meta, type CompositionId } from "./meta";
import { PinnHero } from "./PinnHero";
import { SignalToBrief } from "./SignalToBrief";
import { Surrogate } from "./Surrogate";
import { VeloceFlow } from "./VeloceFlow";
import { PersonaTwin } from "./PersonaTwin";

export { FPS, type CompositionId } from "./meta";

type Entry = (typeof meta)[CompositionId] & {
  component: ComponentType<Record<string, unknown>>;
  defaultProps: Record<string, unknown>;
};
const C = (c: unknown) => c as ComponentType<Record<string, unknown>>;

// Single source of truth for every motion piece — used by the site's <Player>
// and by Remotion Studio (npm run studio) for rendering MP4s.
export const compositions: Record<CompositionId, Entry> = {
  veloceFlow: {
    ...meta.veloceFlow,
    component: C(VeloceFlow),
    defaultProps: { src: "media/v-fullbody.webp", accent: "#e10600" },
  },
  pinnHero: {
    ...meta.pinnHero,
    component: C(PinnHero),
    defaultProps: { accent: "#ff8a3d" },
  },
  eigen: { ...meta.eigen, component: C(EigenModes), defaultProps: { bg: "#f3eee3", ink: "#141a3c", accent: "#2d3fbf" } },
  surrogate: { ...meta.surrogate, component: C(Surrogate), defaultProps: { bg: "#e9f3f1", ink: "#062925", accent: "#0e8c7f" } },
  signal: {
    ...meta.signal,
    component: C(SignalToBrief),
    defaultProps: { bg: "#fffaf4", ink: "#1b1611", accent: "#ef7a12", good: "#1f7a4d" },
  },
  persona: {
    ...meta.persona,
    component: C(PersonaTwin),
    defaultProps: { bg: "transparent", ink: "#f4f1ec", accent: "#ff3d8b", twin: "#3ef0b0" },
  },
};
