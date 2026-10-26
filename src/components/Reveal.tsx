import { motion } from "motion/react";
import { ease } from "../lib/motion";

/** Letters rise out of a mask, staggered — used for the big display words. */
export function SplitLetters({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  return (
    <span className={`split ${className ?? ""}`} aria-label={text} role="text">
      {Array.from(text).map((ch, i) => (
        <span className="split-mask" key={i} aria-hidden>
          <motion.span
            className="split-char"
            initial={{ y: "105%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 1, ease, delay: delay + i * 0.035 }}
          >
            {ch === " " ? "\u00A0" : ch}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/** Generic fade-up on enter. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "p" | "figure" | "span";
}) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </M>
  );
}
