import type { PlayerRef } from "@remotion/player";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../lib/motion";
import { meta, type CompositionId } from "../remotion/meta";

const PlayerStage = lazy(() => import("./PlayerStage"));

type Props = {
  id: CompositionId;
  inputProps?: Record<string, unknown>;
  caption?: string;
  className?: string;
};

/**
 * A Remotion <Player> that only loads and mounts near the viewport and only plays
 * while visible, so several compositions can live on one page without costing frames.
 */
export function MotionPlayer({ id, inputProps, caption, className }: Props) {
  const c = meta[id];
  const wrap = useRef<HTMLDivElement>(null);
  const player = useRef<PlayerRef>(null);
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const near = new IntersectionObserver(([e]) => e.isIntersecting && setMounted(true), { rootMargin: "800px 0px" });
    const seen = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.15 });
    near.observe(el);
    seen.observe(el);
    return () => {
      near.disconnect();
      seen.disconnect();
    };
  }, []);

  // the lazy chunk resolves after mount; poll the ref once per frame until it exists
  useEffect(() => {
    if (!mounted || ready) return;
    let raf = 0;
    const tick = () => (player.current ? setReady(true) : (raf = requestAnimationFrame(tick)));
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mounted, ready]);

  useEffect(() => {
    const p = player.current;
    if (!p) return;
    const want = visible && !paused && !reduced;
    if (!want) {
      p.pause();
      return;
    }
    p.play();
    // the player can report "playing" while stuck on its first frame; nudge it forward if it stalls
    let last = -1;
    const id = window.setInterval(() => {
      const f = p.getCurrentFrame();
      if (!p.isPlaying()) p.play();
      else if (f === last) p.seekTo(f + 1);
      last = f;
    }, 500);
    return () => window.clearInterval(id);
  }, [visible, paused, reduced, ready]);

  return (
    <figure className={`motion ${className ?? ""}`}>
      <div ref={wrap} className="motion-stage" style={{ aspectRatio: `${c.width} / ${c.height}` }}>
        {mounted && (
          <Suspense fallback={<div className="motion-loading" aria-hidden />}>
            <PlayerStage ref={player} id={id} inputProps={inputProps} initialFrame={reduced ? Math.floor(c.durationInFrames * 0.7) : 0} />
          </Suspense>
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
