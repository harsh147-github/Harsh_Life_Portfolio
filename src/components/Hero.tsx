import { motion } from "motion/react";
import { hero, links } from "../data/content";
import { media } from "../lib/media";
import { ease } from "../lib/motion";
import { scrollToId } from "../lib/scroll";
import { Journey } from "./Journey";
import { Reveal, SplitLetters } from "./Reveal";

export function Hero() {
  const photo = media("portrait");

  return (
    <section id="top" className="hero" data-theme="base" data-label="Index">
      <div className="hero-intro">
        <motion.figure
          className="hero-portrait"
          initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ duration: 1.4, ease, delay: 1.2 }}
        >
          <motion.img
            src={photo.src}
            alt={photo.alt}
            width={photo.w}
            height={photo.h}
            initial={{ scale: 1.12 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.2, ease, delay: 1.2 }}
          />
          <figcaption>{photo.caption}</figcaption>
        </motion.figure>

        <div className="hero-copy">
          <Reveal className="hero-kicker" delay={1.4}>
            {hero.name} · {hero.place}
          </Reveal>
          <h1 className="hero-title">
            <SplitLetters text={hero.title} delay={1.45} />
            <span className="accent">.</span>
          </h1>
          <Reveal as="p" className="hero-quote" delay={2.1}>
            <span className="hero-quote-mark" aria-hidden>
              “
            </span>
            {hero.quote}
            <span aria-hidden>”</span>
          </Reveal>
          <Reveal className="btn-row" delay={2.3}>
            <a
              className="btn"
              href="#story"
              onClick={(e) => {
                e.preventDefault();
                scrollToId("story");
              }}
            >
              Read my story ↓
            </a>
            <a className="btn btn-ghost" href={links.linkedin} target="_blank" rel="noreferrer">
              LinkedIn ↗
            </a>
            <a className="btn btn-ghost" href={links.instagram} target="_blank" rel="noreferrer">
              Instagram ↗
            </a>
          </Reveal>
        </div>
      </div>

      <motion.div
        className="hero-journey"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 1, ease }}
      >
        <Journey />
      </motion.div>
    </section>
  );
}
