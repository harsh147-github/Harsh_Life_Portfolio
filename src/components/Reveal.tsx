import { motion } from "motion/react";
import { Fragment } from "react";
import { ease } from "../lib/motion";

/** Letters rise out of a mask, staggered — used for the big display words. Wraps between words. */
export function SplitLetters({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  let n = 0;
  const words = text.split(" ");
  return (
    <span className={`split ${className ?? ""}`} aria-label={text} role="text">
      {words.map((word, w) => (
        <Fragment key={w}>
        {w > 0 && " "}
        <span className="split-word" aria-hidden>
          {Array.from(word).map((ch) => {
            const i = n++;
            return (
              <span className="split-mask" key={i}>
                <motion.span
                  className="split-char"
                  initial={{ y: "105%" }}
                  whileInView={{ y: "0%" }}
                  viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                  transition={{ duration: 1, ease, delay: delay + i * 0.035 }}
                >
                  {ch}
                </motion.span>
              </span>
            );
          })}
        </span>
        </Fragment>
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
