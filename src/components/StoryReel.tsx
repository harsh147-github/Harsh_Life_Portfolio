import type { PlayerRef } from "@remotion/player";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { allEntries } from "../data/content";
import { caseStudy } from "../lib/caseStudy";
import { useReducedMotion } from "../lib/motion";
import { useTheme } from "../lib/theme";
import { meta } from "../remotion/meta";
import { reelFrames, reelScenes, reelStarts, sceneAt } from "../remotion/reelScenes";
import { Reveal } from "./Reveal";

const PlayerStage = lazy(() => import("./PlayerStage"));
const N = reelScenes.length;

function useMedia(query: string) {
  const [on, setOn] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const fn = () => setOn(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, [query]);
  return on;
}

/**
 * The story as a film: a Remotion composition played like a set of stories.
 * Bars along the top show the scenes, tapping either side skips, and each
 * scene links to its case study.
 */
export function StoryReel() {
  const { mode } = useTheme();
  const reduced = useReducedMotion();
  const tall = useMedia("(max-width: 720px)");
  const id = tall ? "reelTall" : "reel";
  const c = meta[id];
  const wrap = useRef<HTMLDivElement>(null);
  const chips = useRef<HTMLOListElement>(null);
  const player = useRef<PlayerRef>(null);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const near = new IntersectionObserver(([e]) => e.isIntersecting && setMounted(true), { rootMargin: "900px 0px" });
    const seen = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 });
    near.observe(el);
    seen.observe(el);
    return () => {
      near.disconnect();
      seen.disconnect();
    };
  }, []);

  // the player chunk loads lazily (and reloads when the format changes): wait for its ref
  useEffect(() => {
    setReady(false);
  }, [id]);
  useEffect(() => {
    if (!mounted || ready) return;
    let raf = 0;
    const tick = () => (player.current ? setReady(true) : (raf = requestAnimationFrame(tick)));
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mounted, ready]);

  useEffect(() => {
    const p = player.current;
    if (!p || !ready) return;
    const want = visible && !paused && !reduced;
    if (want) p.play();
    else p.pause();
    let last = -1;
    let n = 0;
    const t = window.setInterval(() => {
      const f = p.getCurrentFrame();
      setFrame(f);
      if (!want || ++n % 4) return;
      // the player can report "playing" while stuck on a frame; nudge it along
      if (!p.isPlaying()) p.play();
      else if (f === last) p.seekTo(f + 1);
      last = f;
    }, 120);
    return () => window.clearInterval(t);
  }, [visible, paused, reduced, ready]);

  // development only: jump to an exact frame from the console or a test
  useEffect(() => {
    if (import.meta.env.DEV) (window as unknown as { __reelSeek?: (f: number) => void }).__reelSeek = (f) => player.current?.seekTo(f);
  }, []);

  const scene = sceneAt(frame);
  const s = reelScenes[scene];
  const entry = s.entry ? allEntries.find((e) => e.id === s.entry) : null;

  const seek = (i: number) => {
    const to = reelStarts[(i + N) % N];
    player.current?.seekTo(to);
    setFrame(to);
  };

  // keep the current chip in view without moving the page
  useEffect(() => {
    const list = chips.current;
    const el = list?.children[scene] as HTMLElement | undefined;
    if (list && el) list.scrollTo({ left: el.offsetLeft - (list.clientWidth - el.offsetWidth) / 2, behavior: "smooth" });
  }, [scene]);

  const base = mode === "light" ? { bg: "#fafaf8", fg: "#0a0a0a" } : { bg: "#0a0a0a", fg: "#f2f2ee" };

  return (
    <section id="reel" className="reel" data-theme="base" data-label="The story" style={{ ["--ar" as string]: c.width / c.height }}>
      <header className="reel-head">
        <h2 className="reel-title">
          <Reveal as="span">
            My story, in under a minute<span className="accent">.</span>
          </Reveal>
        </h2>
        <Reveal as="p" className="reel-sub" delay={0.1}>
          Tap either side to skip · every scene opens its case study
        </Reveal>
      </header>

      <div className="reel-frame" ref={wrap} style={{ aspectRatio: `${c.width} / ${c.height}`, background: (s.pal ?? base).bg }}>
        {mounted && (
          <Suspense fallback={<div className="motion-loading" aria-hidden />}>
            <PlayerStage key={id} ref={player} id={id} inputProps={base} initialFrame={reduced ? reelFrames - 30 : 0} />
          </Suspense>
        )}
        <div className="reel-bars" aria-hidden>
          {reelScenes.map((x, i) => (
            <i key={x.id}>
              <b style={{ transform: `scaleX(${i < scene ? 1 : i > scene ? 0 : (frame - reelStarts[i]) / x.frames})` }} />
            </i>
          ))}
        </div>
        <button type="button" className="reel-tap is-prev" onClick={() => seek(scene - 1)} aria-label="Previous scene" />
        <button type="button" className="reel-tap is-next" onClick={() => seek(scene + 1)} aria-label="Next scene" />
      </div>

      <div className="reel-controls">
        {!reduced && (
          <button type="button" className="reel-play" onClick={() => setPaused((v) => !v)} aria-label={paused ? "Play the story" : "Pause the story"}>
            {paused ? "▶ Play" : "❚❚ Pause"}
          </button>
        )}
        <ol className="reel-chips" ref={chips} data-hscroll>
          {reelScenes.map((x, i) => (
            <li key={x.id}>
              <button type="button" className={i === scene ? "is-on" : ""} onClick={() => seek(i)} aria-current={i === scene}>
                {x.when && <small>{x.when}</small>}
                {x.label}
              </button>
            </li>
          ))}
        </ol>
        <button type="button" className="reel-open" disabled={!entry} onClick={() => entry && caseStudy.open(entry.id)}>
          {entry ? (
            <>
              Open <strong>{entry.title}</strong> →
            </>
          ) : (
            "Scroll for the work ↓"
          )}
        </button>
      </div>
    </section>
  );
}
