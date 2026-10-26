import { Player, type PlayerRef } from "@remotion/player";
import { useEffect, useRef, useState } from "react";
import { compositions, FPS, type CompositionId } from "../remotion/compositions";
import { useReducedMotion } from "../lib/motion";

type Props = {
  id: CompositionId;
  inputProps?: Record<string, unknown>;
  caption?: string;
  className?: string;
};

/**
 * A Remotion <Player> that only mounts near the viewport and only plays while visible,
 * so several compositions can live on one page without costing frames.
 */
export function MotionPlayer({ id, inputProps, caption, className }: Props) {
  const c = compositions[id];
  const wrap = useRef<HTMLDivElement>(null);
  const player = useRef<PlayerRef>(null);
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const near = new IntersectionObserver(([e]) => e.isIntersecting && setMounted(true), { rootMargin: "600px 0px" });
    const seen = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 });
    near.observe(el);
    seen.observe(el);
    return () => {
      near.disconnect();
      seen.disconnect();
    };
  }, []);

  useEffect(() => {
    const p = player.current;
    if (!p) return;
    if (visible && !paused && !reduced) p.play();
    else p.pause();
  }, [visible, paused, reduced, mounted]);

  return (
    <figure className={`motion ${className ?? ""}`}>
      <div ref={wrap} className="motion-stage" style={{ aspectRatio: `${c.width} / ${c.height}` }}>
        {mounted && (
          <Player
            ref={player}
            component={c.component}
            inputProps={{ ...c.defaultProps, ...inputProps }}
            durationInFrames={c.durationInFrames}
            compositionWidth={c.width}
            compositionHeight={c.height}
            fps={FPS}
            loop
            controls={false}
            clickToPlay={false}
            initialFrame={reduced ? Math.floor(c.durationInFrames * 0.7) : 0}
            acknowledgeRemotionLicense
            style={{ width: "100%", height: "100%" }}
          />
        )}
        {!reduced && (
          <button
            type="button"
            className="motion-toggle"
            onClick={() => setPaused((v) => !v)}
            aria-label={paused ? "Play animation" : "Pause animation"}
          >
            {paused ? "▶ play" : "❚❚ pause"}
          </button>
        )}
      </div>
      {caption && (
        <figcaption className="motion-caption">
          <span className="dot" aria-hidden /> {caption}
        </figcaption>
      )}
    </figure>
  );
}
