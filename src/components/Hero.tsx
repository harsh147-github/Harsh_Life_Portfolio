import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { hero, links } from "../data/content";
import { ease } from "../lib/motion";
import { scrollToId } from "../lib/scroll";
import { useTheme } from "../lib/theme";
import { MotionPlayer } from "./MotionPlayer";
import { Reveal, SplitLetters } from "./Reveal";

export function Hero() {
  const { mode } = useTheme();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const ink = mode === "light" ? "#0a0a0a" : "#f2f2ee";

  return (
    <section id="top" ref={ref} className="hero" data-theme="base" data-label="Index">
      <div className="hero-head">
        <motion.h1 className="wordmark" style={{ y: drift }}>
          <span className="sr-only">Harsh Sonavane</span>
          <span className="wordmark-line" aria-hidden>
            <SplitLetters text={hero.first} delay={1.3} />
          </span>
          <span className="wordmark-line" aria-hidden>
            <SplitLetters text={hero.last} delay={1.45} />
            <motion.span
              className="wordmark-dot"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, ease, delay: 1.95 }}
            >
              .
            </motion.span>
          </span>
        </motion.h1>
        <aside className="hero-roles">
          <ul>
            {hero.roles.map((r, i) => (
              <Reveal as="li" key={r} delay={1.6 + i * 0.08}>
                {r}
              </Reveal>
            ))}
          </ul>
          <Reveal delay={1.9} className="hero-place">
            {hero.place}
          </Reveal>
        </aside>
      </div>

      <div className="hero-intro">
        <div className="hero-copy">
          <Reveal className="label">the</Reveal>
          <h2 className="display-md">
            <SplitLetters text="engineer." />
          </h2>
          <Reveal as="p" className="lede" delay={0.1}>
            {hero.intro}
          </Reveal>
          <Reveal as="p" className="teaser" delay={0.2}>
            {hero.teaser}
          </Reveal>
          <Reveal className="btn-row" delay={0.3}>
            <a
              className="btn"
              href="#story"
              onClick={(e) => {
                e.preventDefault();
                scrollToId("story");
              }}
            >
              Read the story ↓
            </a>
            <a className="btn btn-ghost" href={links.linkedin} target="_blank" rel="noreferrer">
              LinkedIn ↗
            </a>
            <a className="btn btn-ghost" href={links.instagram} target="_blank" rel="noreferrer">
              Instagram ↗
            </a>
          </Reveal>
        </div>
        <div className="hero-portrait">
          <img src="media/portrait.webp" alt="Harsh Sonavane in a convertible, looking over his shoulder" />
          <span className="hero-portrait-tag">Pune → Bengaluru</span>
        </div>
      </div>

      <div className="hero-motion">
        <MotionPlayer
          id="airflowWide"
          inputProps={{ bg: "transparent", ink, accent: ink, inverted: false, labels: false, alphaDeg: 6 }}
          caption="Potential flow past a Joukowski airfoil, solved live in your browser with Remotion. Where it all started: making air behave."
        />
      </div>
    </section>
  );
}
