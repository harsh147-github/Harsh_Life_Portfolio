// Lightweight composition metadata (no Remotion imports) so the page can size
// players before the Remotion bundle is lazy-loaded.
export const FPS = 30;

export const meta = {
  veloceFlow: { durationInFrames: 600, width: 1600, height: 804 },
  pinnHero: { durationInFrames: 600, width: 1600, height: 820 },
  eigen: { durationInFrames: 375, width: 1600, height: 900 },
  surrogate: { durationInFrames: 420, width: 1600, height: 900 },
  signal: { durationInFrames: 430, width: 1600, height: 900 },
  persona: { durationInFrames: 480, width: 1600, height: 800 },
} as const;

export type CompositionId = keyof typeof meta;
