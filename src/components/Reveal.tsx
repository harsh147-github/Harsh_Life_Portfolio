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

/** Image that wipes in from a clip mask; turns from monochrome to colour when its section is active. */
export function Shot({ src, alt, caption, className }: { src: string; alt: string; caption?: string; className?: string }) {
  return (
    <motion.figure
      className={`shot ${className ?? ""}`}
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.2, ease }}
    >
      <img src={src} alt={alt} loading="lazy" decoding="async" />
      {caption && <figcaption>{caption}</figcaption>}
    </motion.figure>
  );
}
