import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ease, useReducedMotion } from "../lib/motion";

export function Preloader() {
  const reduced = useReducedMotion();
  const [n, setN] = useState(0);
  const [done, setDone] = useState(reduced);

  useEffect(() => {
    if (reduced) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1100);
      setN(Math.round(100 * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 180);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="preloader"
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 0.9, ease }}
          aria-hidden
        >
          <span className="preloader-mark">
            HS<span className="accent">.</span>
          </span>
          <span className="preloader-count">{String(n).padStart(3, "0")}</span>
          <span className="preloader-note">physics · machine learning · ventures</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
