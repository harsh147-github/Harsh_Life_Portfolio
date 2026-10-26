import { Player, type PlayerRef } from "@remotion/player";
import { forwardRef } from "react";
import { compositions, FPS, type CompositionId } from "../remotion/compositions";

/** The Remotion player itself — split into its own chunk and loaded on demand. */
const PlayerStage = forwardRef<PlayerRef, { id: CompositionId; inputProps?: Record<string, unknown>; initialFrame: number }>(
  ({ id, inputProps, initialFrame }, ref) => {
    const c = compositions[id];
    return (
      <Player
        ref={ref}
        component={c.component}
        inputProps={{ ...c.defaultProps, ...inputProps }}
        durationInFrames={c.durationInFrames}
        compositionWidth={c.width}
        compositionHeight={c.height}
        fps={FPS}
        loop
        controls={false}
        clickToPlay={false}
        initialFrame={initialFrame}
        acknowledgeRemotionLicense
        style={{ width: "100%", height: "100%" }}
      />
    );
  },
);

export default PlayerStage;
