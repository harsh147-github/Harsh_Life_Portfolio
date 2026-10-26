import { Composition } from "remotion";
import { compositions, FPS } from "./compositions";

export const RemotionRoot: React.FC = () => (
  <>
    {Object.entries(compositions).map(([id, c]) => (
      <Composition
        key={id}
        id={id}
        component={c.component}
        durationInFrames={c.durationInFrames}
        fps={FPS}
        width={c.width}
        height={c.height}
        defaultProps={c.defaultProps}
      />
    ))}
  </>
);
