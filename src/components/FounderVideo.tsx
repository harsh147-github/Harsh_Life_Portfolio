import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ease, useReducedMotion } from "../lib/motion";
import { lockScroll } from "../lib/scroll";

type V = { loop: string; poster: string; full: string; caption: string };
const webm = (mp4: string) => mp4.replace(/\.mp4$/, ".webm");

/** A muted loop that only loads near the viewport and only plays while visible. */
export function LoopVideo({ v, className }: { v: V; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [near, setNear] = useState(false);
  const visible = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        visible.current = e.isIntersecting;
        if (e.isIntersecting) setNear(true);
        if (e.isIntersecting && !reduced) el.play().catch(() => {});
        else el.pause();
      },
      { rootMargin: "200px 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  // sources mount once the video is near the viewport; load them, then play if on screen
  useEffect(() => {
    const el = ref.current;
    if (!near || !el) return;
    el.load();
    if (visible.current && !reduced) el.play().catch(() => {});
  }, [near, reduced]);

  return (
    <video ref={ref} className={className} poster={v.poster} muted loop playsInline preload="none" aria-hidden>
      {near && <source src={webm(v.loop)} type="video/webm" />}
      {near && <source src={v.loop} type="video/mp4" />}
    </video>
  );
}

/** "Watch with sound": the full clip in a modal. */
export function TalkButton({ v, label = "Watch the talk with sound" }: { v: V; label?: string }) {
  const [open, setOpen] = useState(false);
  const close = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    lockScroll(open);
    if (!open) return;
    close.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button type="button" className="talk-btn" onClick={() => setOpen(true)}>
        <span className="talk-btn-icon" aria-hidden>
          ▶
        </span>
        {label}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="lightbox talk-modal"
            role="dialog"
            aria-modal="true"
            aria-label={v.caption}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            onClick={(e) => e.target === e.currentTarget && setOpen(false)}
          >
            <div className="lightbox-top">
              <span>{v.caption}</span>
              <button ref={close} type="button" className="lightbox-close" onClick={() => setOpen(false)}>
                Close ✕
              </button>
            </div>
            <video poster={v.poster} controls autoPlay playsInline>
              <source src={webm(v.full)} type="video/webm" />
              <source src={v.full} type="video/mp4" />
            </video>
            <div />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** Portrait founder clip, framed, with its caption and a sound button. */
export function VideoCard({ v }: { v: V }) {
  return (
    <motion.figure
      className="video-card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1, ease }}
    >
      <div className="video-card-frame">
        <LoopVideo v={v} />
        <span className="video-card-live">
          <i /> On stage
        </span>
      </div>
      <figcaption>
        <span>{v.caption}</span>
        <TalkButton v={v} />
      </figcaption>
    </motion.figure>
  );
}
