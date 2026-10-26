import { motion } from "motion/react";
import {
  achievements,
  education,
  links,
  more,
  publications,
  toolbox,
  type Chapter,
} from "../data/content";
import { ease } from "../lib/motion";
import { scrollToId } from "../lib/scroll";
import { Reveal, Shot, SplitLetters } from "./Reveal";

/** A chapter index that opens the "work" and "ventures" acts. */
export function Divider({
  id,
  kicker,
  word,
  line,
  chapters,
  theme = "base",
}: {
  id: string;
  kicker: string;
  word: string;
  line: string;
  chapters: Chapter[];
  theme?: string;
}) {
  return (
    <section id={id} className="divider" data-theme={theme} data-label={`${kicker} ${word}`}>
      <div className="divider-head">
        <Reveal className="label">{kicker}</Reveal>
        <h2 className="display-xxl">
          <SplitLetters text={word} />
        </h2>
        <Reveal as="p" className="divider-line" delay={0.15}>
          {line}
        </Reveal>
      </div>
      <ol className="divider-index">
        {chapters.map((c, i) => (
          <motion.li
            key={c.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.8, ease, delay: i * 0.06 }}
          >
            <a
              href={`#${c.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToId(c.id);
              }}
            >
              <span className="di-n">{c.index}</span>
              <span className="di-t">{c.title}</span>
              <span className="di-o">{c.org.split(" · ")[0]}</span>
              <span className="di-p">{c.period}</span>
              <span className="di-arrow">→</span>
            </a>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}

export function Also() {
  return (
    <section id="also" className="also" data-theme="base" data-label="Also">
      <div className="also-head">
        <Reveal className="label">and</Reveal>
        <h2 className="display-xl">
          <SplitLetters text="also." />
        </h2>
      </div>

      <div className="also-block">
        <h3 className="also-h">Publications</h3>
        <ol className="pubs">
          {publications.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 0.06}>
              <a href={p.href} target="_blank" rel="noreferrer">
                <span className="pub-title">{p.title}</span>
                <span className="pub-cite">{p.cite}</span>
                <span className="pub-venue">{p.venue} ↗</span>
              </a>
            </Reveal>
          ))}
        </ol>
      </div>

      <div className="also-block">
        <h3 className="also-h">Side quests</h3>
        <div className="cards">
          {more.map((m, i) => (
            <Reveal key={m.title} className="card" delay={i * 0.06}>
              {m.img && <Shot src={m.img} alt={m.title} />}
              <h4>{m.title}</h4>
              <p>{m.body}</p>
              {m.href && (
                <a href={m.href} target="_blank" rel="noreferrer" className="card-link">
                  View on GitHub ↗
                </a>
              )}
            </Reveal>
          ))}
        </div>
      </div>

      <div className="also-split">
        <div className="also-block">
          <h3 className="also-h">On the record</h3>
          <ul className="achievements">
            {achievements.map((a, i) => (
              <Reveal as="li" key={a} delay={i * 0.04}>
                {a}
              </Reveal>
            ))}
          </ul>
        </div>
        <div className="also-block">
          <h3 className="also-h">Education</h3>
          <Reveal className="edu">
            <p className="edu-school">{education.school}</p>
            <p className="edu-degree">{education.degree}</p>
            <p className="edu-note">{education.note}</p>
          </Reveal>
        </div>
      </div>

      <div className="also-block">
        <h3 className="also-h">Toolbox</h3>
        <dl className="toolbox">
          {toolbox.map((t, i) => (
            <Reveal key={t.group} className="tool" delay={i * 0.05}>
              <dt>{t.group}</dt>
              <dd>{t.items}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

const contacts = [
  { label: "Email", value: links.email, href: `mailto:${links.email}` },
  { label: "LinkedIn", value: "harsh-sonavane", href: links.linkedin },
  { label: "Instagram", value: "@harsh__sonavane", href: links.instagram },
  { label: "GitHub", value: "harsh147-github", href: links.github },
];

export function Contact() {
  return (
    <section id="contact" className="contact" data-theme="inverse" data-label="Contact">
      <div className="contact-head">
        <Reveal className="label">research, roles, ventures, or a race car</Reveal>
        <h2 className="display-xxl">
          <SplitLetters text="let’s talk." />
        </h2>
      </div>
      <ul className="contact-list">
        {contacts.map((c, i) => (
          <Reveal as="li" key={c.label} delay={i * 0.06}>
            <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
              <span className="cl-label">{c.label}</span>
              <span className="cl-value">{c.value}</span>
              <span className="cl-arrow">↗</span>
            </a>
          </Reveal>
        ))}
      </ul>
      <footer className="footer">
        <span>© 2026 Harsh Sonavane</span>
        <span>Namma Bengaluru · Pune</span>
        <span>Built with React, Remotion &amp; a lot of potential flow</span>
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            scrollToId("top");
          }}
        >
          Back to top ↑
        </a>
      </footer>
    </section>
  );
}
