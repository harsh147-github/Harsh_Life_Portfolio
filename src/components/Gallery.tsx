import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { lightbox, media, mediaGroup } from "../lib/media";
import { ease } from "../lib/motion";
import { lockScroll } from "../lib/scroll";

/* ------------------------------------------------------------------ */
/* Shot: one image, wipes in, monochrome → colour, opens the viewer    */
/* ------------------------------------------------------------------ */
export function Shot({
  k,
  set,
  className,
  sizes = "(max-width: 860px) 100vw, 50vw",
  caption = true,
}: {
  k: string;
  /** the keys the lightbox can step through; defaults to just this image */
  set?: string[];
  className?: string;
  sizes?: string;
  caption?: boolean;
}) {
  const it = media(k);
  const keys = set ?? [k];
  return (
    <motion.figure
      className={`shot ${className ?? ""}`}
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 1.1, ease }}
    >
      <button type="button" className="shot-btn" onClick={() => lightbox.open(keys, Math.max(0, keys.indexOf(k)))} aria-label={`View larger: ${it.caption}`}>
        <img
          src={it.thumb}
          srcSet={`${it.thumb} 720w, ${it.src} ${it.w}w`}
          sizes={sizes}
          width={it.w}
          height={it.h}
          alt={it.alt}
          loading="lazy"
          decoding="async"
        />
      </button>
      {caption && <figcaption>{it.caption}</figcaption>}
    </motion.figure>
  );
}

/* ------------------------------------------------------------------ */
/* Mosaic: curated grid with spans                                      */
/* ------------------------------------------------------------------ */
export type Tile = { k: string; span?: "wide" | "tall" | "big" };

export function Mosaic({ label, tiles }: { label?: string; tiles: Tile[] }) {
  const keys = tiles.map((t) => t.k);
  return (
    <div className="mosaic-block">
      {label && (
        <div className="block-label">
          <span className="accent">●</span> {label}
        </div>
      )}
      <div className="mosaic">
        {tiles.map((t) => (
          <Shot key={t.k} k={t.k} set={keys} className={t.span ? `span-${t.span}` : ""} sizes="(max-width: 860px) 50vw, 25vw" />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Filmstrip: a complete, horizontally scrolling archive of a group     */
/* ------------------------------------------------------------------ */
export function Filmstrip({ group, label, tall = false }: { group: string; label?: string; tall?: boolean }) {
  const g = mediaGroup(group);
  const track = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const t = track.current;
    if (!t) return;
    setEdge({ start: t.scrollLeft < 8, end: t.scrollLeft + t.clientWidth > t.scrollWidth - 8 });
  }, []);
  useEffect(update, [update]);

  const nudge = (dir: number) => {
    const t = track.current;
    if (t) t.scrollBy({ left: dir * t.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className={`strip ${tall ? "strip-tall" : ""}`}>
      <div className="strip-head">
        <span className="block-label">
          <span className="accent">●</span> {label ?? g.label}
        </span>
        <span className="strip-count">{g.items.length} images</span>
        <span className="strip-nav">
          <button type="button" onClick={() => nudge(-1)} disabled={edge.start} aria-label="Scroll left">
            ←
          </button>
          <button type="button" onClick={() => nudge(1)} disabled={edge.end} aria-label="Scroll right">
            →
          </button>
        </span>
      </div>
      <div className="strip-track" ref={track} onScroll={update} data-hscroll tabIndex={0} aria-label={`${label ?? g.label} archive`}>
        {g.items.map((k, i) => {
          const it = media(k);
          return (
            <figure className="strip-item" key={k}>
              <button type="button" className="shot-btn" style={{ width: `calc(var(--h) * ${(it.w / it.h).toFixed(4)})` }} onClick={() => lightbox.open(g.items, i)} aria-label={`View larger: ${it.caption}`}>
                <img src={it.thumb} width={it.w} height={it.h} alt={it.alt} loading="lazy" decoding="async" />
              </button>
              <figcaption>{it.caption}</figcaption>
            </figure>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Device frames for live product screenshots                           */
/* ------------------------------------------------------------------ */
export function BrowserFrame({ k, url, set }: { k: string; url: string; set?: string[] }) {
  const it = media(k);
  const keys = set ?? [k];
  return (
    <motion.figure
      className="browser"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1, ease }}
    >
      <div className="browser-bar" aria-hidden>
        <span className="browser-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="browser-url">{url}</span>
      </div>
      <button type="button" className="shot-btn" onClick={() => lightbox.open(keys, Math.max(0, keys.indexOf(k)))} aria-label={`View larger: ${it.caption}`}>
        <img src={it.thumb} srcSet={`${it.thumb} 720w, ${it.src} ${it.w}w`} sizes="(max-width: 860px) 100vw, 60vw" width={it.w} height={it.h} alt={it.alt} loading="lazy" />
      </button>
      <figcaption>{it.caption}</figcaption>
    </motion.figure>
  );
}

export function PhoneFrame({ k, set }: { k: string; set?: string[] }) {
  const it = media(k);
  const keys = set ?? [k];
  return (
    <motion.figure
      className="phone"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.1, ease, delay: 0.1 }}
    >
      <div className="phone-body">
        <span className="phone-notch" aria-hidden />
        <button type="button" className="shot-btn" onClick={() => lightbox.open(keys, Math.max(0, keys.indexOf(k)))} aria-label={`View larger: ${it.caption}`}>
          <img src={it.thumb} width={it.w} height={it.h} alt={it.alt} loading="lazy" />
        </button>
      </div>
      <figcaption>{it.caption}</figcaption>
    </motion.figure>
  );
}

/* ------------------------------------------------------------------ */
/* Lightbox                                                             */
/* ------------------------------------------------------------------ */
export function Lightbox() {
  const [state, setState] = useState<{ keys: string[]; index: number } | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opener = useRef<Element | null>(null);
  const touchX = useRef<number | null>(null);

  useEffect(
    () =>
      lightbox.subscribe((o) => {
        opener.current = document.activeElement;
        setState(o);
      }),
    [],
  );

  const close = useCallback(() => {
    setState(null);
    (opener.current as HTMLElement | null)?.focus?.();
  }, []);
  const step = useCallback(
    (d: number) => setState((s) => (s ? { ...s, index: (s.index + d + s.keys.length) % s.keys.length } : s)),
    [],
  );

  useEffect(() => {
    lockScroll(!!state);
    if (!state) return;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state, close, step]);

  const it = state ? media(state.keys[state.index]) : null;

  return (
    <AnimatePresence>
      {state && it && (
        <motion.div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={it.caption}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease }}
          onClick={(e) => e.target === e.currentTarget && close()}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          <div className="lightbox-top">
            <span>
              {String(state.index + 1).padStart(2, "0")} / {String(state.keys.length).padStart(2, "0")}
            </span>
            <button ref={closeBtn} type="button" onClick={close} className="lightbox-close">
              Close ✕
            </button>
          </div>
          <motion.img
            key={it.key}
            src={it.src}
            alt={it.alt}
            width={it.w}
            height={it.h}
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease }}
          />
          <div className="lightbox-bottom">
            <button type="button" onClick={() => step(-1)} aria-label="Previous image" disabled={state.keys.length < 2}>
              ←
            </button>
            <p>{it.caption}</p>
            <button type="button" onClick={() => step(1)} aria-label="Next image" disabled={state.keys.length < 2}>
              →
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
