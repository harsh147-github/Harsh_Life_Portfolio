import Lenis from "lenis";

let lenis: Lenis | null = null;

export function startSmoothScroll() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => 1 - Math.pow(1 - t, 4),
    anchors: false,
    // let horizontal swipes inside filmstrips scroll natively
    virtualScroll: ({ deltaX, deltaY, event }) => {
      const t = event.target as HTMLElement | null;
      return !(Math.abs(deltaX) > Math.abs(deltaY) && t?.closest?.("[data-hscroll]"));
    },
  });
  let raf = 0;
  const loop = (time: number) => {
    lenis?.raf(time);
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  return () => {
    cancelAnimationFrame(raf);
    lenis?.destroy();
    lenis = null;
  };
}

export function lockScroll(locked: boolean) {
  if (locked) lenis?.stop();
  else lenis?.start();
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

/** Smooth-scroll to an in-page anchor, falling back to native scrolling. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -56 });
  else el.scrollIntoView({ behavior: "smooth" });
  history.replaceState(null, "", `#${id}`);
}
