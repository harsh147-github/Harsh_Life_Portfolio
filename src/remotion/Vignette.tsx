import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { GfxLattice, GfxModes, GfxSurrogate, GfxTwin, GfxWeave, GfxWing } from "./gfx";

export type VignetteScene = "wing" | "surrogate" | "lattice" | "modes" | "twin" | "weave";
export type VignetteProps = { scene: VignetteScene; bg: string; fg: string; accent: string };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** One story graphic on its own, looping: the moving picture on a work card. */
export const Vignette: React.FC<VignetteProps> = ({ scene, bg, fg, accent }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  const pal = { bg, fg, accent };
  // graphics that build up once fade out and restart; the others loop seamlessly
  const once = scene === "surrogate" || scene === "lattice";
  const opacity = once ? Math.min(interpolate(frame, [0, 10], [0, 1], clamp), interpolate(frame, [D - 16, D - 2], [1, 0], clamp)) : 1;
  return (
    <AbsoluteFill style={{ background: bg }}>
      <svg viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid meet" style={{ position: "absolute", inset: "4%", width: "92%", height: "92%", opacity }}>
        {scene === "wing" && <GfxWing f={frame} pal={pal} steady />}
        {scene === "surrogate" && <GfxSurrogate f={frame} pal={pal} />}
        {scene === "lattice" && <GfxLattice f={frame} pal={pal} />}
        {scene === "modes" && <GfxModes f={frame} pal={pal} steady modeLen={D / 5} />}
        {scene === "twin" && <GfxTwin f={frame} pal={pal} steady />}
        {scene === "weave" && <GfxWeave f={frame} pal={pal} steady />}
      </svg>
    </AbsoluteFill>
  );
};
