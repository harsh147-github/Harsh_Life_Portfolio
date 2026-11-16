// Lightweight composition metadata (no Remotion imports) so the page can size
// players before the Remotion bundle is lazy-loaded.
export const FPS = 30;

import { reelFrames } from "./reelScenes";

export const meta = {
  reel: { durationInFrames: reelFrames, width: 1600, height: 900 },
  reelTall: { durationInFrames: reelFrames, width: 1080, height: 1520 },
  vignette: { durationInFrames: 240, width: 800, height: 600 },
  veloceFlow: { durationInFrames: 600, width: 1600, height: 804 },
  pinnHero: { durationInFrames: 600, width: 1600, height: 820 },
  eigen: { durationInFrames: 375, width: 1600, height: 900 },
  surrogate: { durationInFrames: 420, width: 1600, height: 900 },
  signal: { durationInFrames: 430, width: 1600, height: 900 },
  persona: { durationInFrames: 480, width: 1600, height: 800 },
} as const;

export type CompositionId = keyof typeof meta;
