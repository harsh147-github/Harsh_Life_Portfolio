import { motion } from "motion/react";
import { hero, links } from "../data/content";
import { media } from "../lib/media";
import { ease } from "../lib/motion";
import { scrollToId } from "../lib/scroll";
import { Journey } from "./Journey";
import { MotionPlayer } from "./MotionPlayer";
import { Reveal, SplitLetters } from "./Reveal";

export function Hero() {
  const photo = media("portrait");

  return (
    <section id="top" className="hero" data-theme="base" data-label="Index">
      <div className="hero-head">
        <h1 className="hero-name">
          <SplitLetters text={hero.name} delay={1.25} />
        </h1>
        <ul className="hero-roles">
          {hero.roles.map((r, i) => (
            <Reveal as="li" key={r} delay={1.55 + i * 0.08}>
              {r}
            </Reveal>
          ))}
          <Reveal as="li" className="hero-place" delay={1.8}>
            {hero.place}
          </Reveal>
        </ul>
      </div>

      <div className="hero-motion">
        <div className="hero-motion-head">
          <Reveal className="label" delay={1.5}>
            what I do
          </Reveal>
          <Reveal as="p" className="hero-motion-text" delay={1.6}>
            {hero.whatIDo}
          </Reveal>
        </div>
        <MotionPlayer
          id="pinnHero"
          className="motion-dark"
          caption="Illustrative: a physics-informed neural network learns how a composite wing bends under load. The governing plate equation sits inside the loss, the residual at every collocation point is driven to zero, and the trained network then predicts the full stress field for each new design in one forward pass."
        />
      </div>

      <motion.div className="hero-journey" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.2 }}>
        <Journey />
      </motion.div>

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
        <figure className="hero-portrait">
          <img src={photo.src} alt={photo.alt} width={photo.w} height={photo.h} />
          <figcaption>{photo.caption}</figcaption>
        </figure>
      </div>

    </section>
  );
}
