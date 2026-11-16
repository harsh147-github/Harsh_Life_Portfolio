import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { acts, allEntries } from "../data/content";
import { caseStudy } from "../lib/caseStudy";
import { ease } from "../lib/motion";
import { themeVars } from "../lib/palettes";
import { lockScroll } from "../lib/scroll";
import { Chapter } from "./Chapter";

/** The full case study for one piece of work, as a sheet over the page. */
export function CaseStudy() {
  const [id, setId] = useState<string | null>(caseStudy.get());
  const closeBtn = useRef<HTMLButtonElement>(null);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => caseStudy.subscribe(setId), []);

  const i = allEntries.findIndex((e) => e.id === id);
  const c = i >= 0 ? allEntries[i] : null;
  const act = c ? acts.find((a) => a.entries.includes(c))! : null;
  const prev = c ? allEntries[(i - 1 + allEntries.length) % allEntries.length] : null;
  const next = c ? allEntries[(i + 1) % allEntries.length] : null;

  useEffect(() => {
    lockScroll(!!c);
    if (!c) return;
    closeBtn.current?.focus({ preventScroll: true });
    scroller.current?.scrollTo(0, 0);
    const onKey = (e: KeyboardEvent) => {
      // the image viewer and talk player sit on top and handle their own keys
      if (document.querySelector(".lightbox")) return;
      if (e.key === "Escape") caseStudy.close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [c]);

  return (
    <AnimatePresence>
      {c && act && prev && next && (
        <motion.div
          key="cs"
          className="cs themed is-active"
          style={themeVars(c.theme)}
          role="dialog"
          aria-modal="true"
          aria-label={`Case study: ${c.title}`}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.6, ease }}
        >
          <header className="cs-bar">
            <span className="cs-act" style={{ ["--c" as string]: act.color }}>
              <i /> Act {act.num} · {act.title}
            </span>
            <span className="cs-tools">
              <button type="button" onClick={() => caseStudy.open(prev.id)} aria-label={`Previous: ${prev.title}`}>
                ←
              </button>
              <span className="cs-count">
                {String(i + 1).padStart(2, "0")} / {allEntries.length}
              </span>
              <button type="button" onClick={() => caseStudy.open(next.id)} aria-label={`Next: ${next.title}`}>
                →
              </button>
              <button ref={closeBtn} type="button" className="cs-close" onClick={() => caseStudy.close()}>
                Close ✕
              </button>
            </span>
          </header>
          <div className="cs-scroll" ref={scroller} data-lenis-prevent>
            <Chapter key={c.id} c={c} />
            <button type="button" className="cs-next" onClick={() => caseStudy.open(next.id)}>
              <span>Next case study</span>
              <strong>
                {next.title} <i>→</i>
              </strong>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
