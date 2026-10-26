import { motion, useScroll } from "motion/react";
import { useRef } from "react";
import { scaleLadder, story } from "../data/content";
import { ease } from "../lib/motion";
import { scrollToId } from "../lib/scroll";
import { Reveal, SplitLetters } from "./Reveal";

export function Story() {
  const list = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: list, offset: ["start 70%", "end 60%"] });

  return (
    <section id="story" className="story" data-theme="inverse" data-label="The story">
      <div className="story-grid">
        <div className="story-head">
          <div className="story-sticky">
            <Reveal className="label">the</Reveal>
            <h2 className="display-lg">
              <SplitLetters text="story." />
            </h2>
            <Reveal as="p" className="story-sub" delay={0.1}>
              How a mechanical engineer from Pune ended up building physics-informed ML for aerostructures at IISc, and three ventures alongside it. Eight steps, each one leading to the next.
            </Reveal>
          </div>
        </div>

        <ol className="story-list" ref={list}>
          <motion.span className="story-rail" style={{ scaleY: scrollYProgress }} aria-hidden />
          {story.map((b, i) => (
            <motion.li
              key={b.title}
              className="beat"
              initial={{ opacity: 0.32 }}
              whileInView={{ opacity: 1 }}
              viewport={{ margin: "-35% 0px -35% 0px" }}
              transition={{ duration: 0.6, ease }}
            >
              <div className="beat-when">
                <span className="beat-year">{b.when}</span>
                <span className="beat-where">{b.where}</span>
              </div>
              <div className="beat-body">
                <h3>{b.title}</h3>
                <p>{b.body}</p>
                {b.thread && <p className="beat-thread">{b.thread}</p>}
                {b.anchor && (
                  <a
                    href={`#${b.anchor}`}
                    className="beat-link"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToId(b.anchor!);
                    }}
                  >
                    {b.anchor === "piml" ? "Start with the work →" : "See this chapter →"}
                  </a>
                )}
              </div>
              <span className="beat-n">{String(i + 1).padStart(2, "0")}</span>
            </motion.li>
          ))}
        </ol>
      </div>

      <div className="ladder">
        <Reveal className="label">the systems I’ve modelled, roughly in the order I met them</Reveal>
        <p className="ladder-row">
          {scaleLadder.map((w, i) => (
            <motion.span
              key={w}
              className="ladder-word"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.8, ease, delay: i * 0.09 }}
            >
              {w}
              {i < scaleLadder.length - 1 && <span className="ladder-arrow">→</span>}
            </motion.span>
          ))}
        </p>
      </div>
    </section>
  );
}
