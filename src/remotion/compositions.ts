import type { ComponentType } from "react";
import { Airflow } from "./Airflow";
import { EigenModes } from "./EigenModes";
import { SignalToBrief } from "./SignalToBrief";
import { Surrogate } from "./Surrogate";
import { TwinMatch } from "./TwinMatch";

// Single source of truth for every motion piece — used by the site's <Player>
// and by Remotion Studio (npm run studio) for rendering MP4s.
export const FPS = 30;

export const compositions = {
  airflow: {
    component: Airflow as ComponentType<Record<string, unknown>>,
    durationInFrames: 600,
    width: 1600,
    height: 900,
    defaultProps: { bg: "#0b0b0b", ink: "#f5f5f5", accent: "#e10600", inverted: true, labels: true, alphaDeg: 8 },
  },
  airflowWide: {
    component: Airflow as ComponentType<Record<string, unknown>>,
    durationInFrames: 600,
    width: 1600,
    height: 560,
    defaultProps: { bg: "#fafaf8", ink: "#0a0a0a", accent: "#0a0a0a", inverted: false, labels: false, alphaDeg: 6 },
  },
  eigen: {
    component: EigenModes as ComponentType<Record<string, unknown>>,
    durationInFrames: 375,
    width: 1600,
    height: 900,
    defaultProps: { bg: "#f3eee3", ink: "#141a3c", accent: "#2d3fbf" },
  },
  surrogate: {
    component: Surrogate as ComponentType<Record<string, unknown>>,
    durationInFrames: 420,
    width: 1600,
    height: 900,
    defaultProps: { bg: "#e9f3f1", ink: "#062925", accent: "#0e8c7f" },
  },
  signal: {
    component: SignalToBrief as ComponentType<Record<string, unknown>>,
    durationInFrames: 430,
    width: 1600,
    height: 900,
    defaultProps: { bg: "#f4efe6", ink: "#1a1410", accent: "#e07a1f", good: "#1f7a4d" },
  },
  twin: {
    component: TwinMatch as ComponentType<Record<string, unknown>>,
    durationInFrames: 420,
    width: 1600,
    height: 900,
    defaultProps: { bg: "#ffc9e0", ink: "#0b0b0b", accent: "#e8006f" },
  },
} as const;

export type CompositionId = keyof typeof compositions;
