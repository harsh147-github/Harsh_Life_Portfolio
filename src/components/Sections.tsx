import { motion } from "motion/react";
import {
  achievements,
  education,
  glance,
  links,
  projects,
  publications,
  sideQuests,
  toolbox,
  type Chapter,
} from "../data/content";
import { lightbox, media, totalImages } from "../lib/media";
import { ease } from "../lib/motion";
import { scrollToId } from "../lib/scroll";
import { Filmstrip, Shot } from "./Gallery";
import { Reveal, SplitLetters } from "./Reveal";

const jump = (id: string) => (e: React.MouseEvent) => {
  e.preventDefault();
  scrollToId(id);
};

/** The profile at a glance — what a recruiter would otherwise dig out of a CV. */
export function Glance() {
  return (
    <section id="glance" className="glance" data-theme="base" data-label="At a glance">
      <div className="glance-head">
        <Reveal className="label">at a</Reveal>
        <h2 className="display-lg">
          <SplitLetters text="glance." />
        </h2>
        <Reveal as="p" className="glance-sub" delay={0.1}>
          The whole profile in eight lines, for when you don’t have time for the story. Every line links to the proof.
        </Reveal>
      </div>
      <ul className="glance-grid">
        {glance.map((g, i) => (
          <motion.li
            key={g.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -8% 0px" }}
            transition={{ duration: 0.8, ease, delay: (i % 4) * 0.07 }}
          >
            <a href={`#${g.href}`} onClick={jump(g.href ?? "top")}>
              <span className="glance-label">{g.label}</span>
              <span className="glance-value">{g.value}</span>
              <span className="glance-detail">{g.detail}</span>
              <span className="glance-arrow" aria-hidden>
                ↘
              </span>
            </a>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

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
            <a href={`#${c.id}`} onClick={jump(c.id)}>
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

/** Code: the public GitHub work. */
export function Lab() {
  return (
    <section id="lab" className="lab" data-theme="inverse" data-label="The lab">
      <div className="lab-head">
        <Reveal className="label">the</Reveal>
        <h2 className="display-xl">
          <SplitLetters text="lab." />
        </h2>
        <Reveal as="p" className="divider-line" delay={0.1}>
          Things I build on my own time, in the open. Every number below is from the project’s own README.
        </Reveal>
      </div>
      <div className="lab-grid">
        {projects.map((p, i) => (
          <Reveal key={p.name} className={`project ${p.img ? "" : "project-text project-wide"} ${i === 0 ? "project-feature" : ""}`} delay={(i % 3) * 0.06}>
            {p.img && (
              <button type="button" className="project-img" onClick={() => lightbox.open([p.img!], 0)} aria-label={`View larger: ${p.name}`}>
                <img src={media(p.img).thumb} srcSet={`${media(p.img).thumb} 720w, ${media(p.img).src} ${media(p.img).w}w`} sizes="(max-width: 860px) 100vw, 40vw" alt={media(p.img).alt} width={media(p.img).w} height={media(p.img).h} loading="lazy" />
              </button>
            )}
            <div className="project-body">
              <span className="project-kind">{p.kind}</span>
              <h3>{p.name}</h3>
              <p>{p.body}</p>
              <ul>
                {p.facts.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <div className="project-links">
                <a href={p.href} target="_blank" rel="noreferrer">
                  GitHub ↗
                </a>
                {p.site && (
                  <a href={p.site} target="_blank" rel="noreferrer">
                    Live site ↗
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <Filmstrip group="projects" label="From the projects" />
      <Reveal className="lab-more">
        <a className="btn btn-ghost" href={links.github} target="_blank" rel="noreferrer">
          All repositories on GitHub ↗
        </a>
      </Reveal>
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
        <h3 className="also-h">University, research & life</h3>
        <div className="quests">
          {sideQuests.map((q) => (
            <div className="quest" key={q.title}>
              <Reveal className="quest-text">
                <h4>{q.title}</h4>
                <p>{q.body}</p>
              </Reveal>
              <div className={`quest-tiles quest-tiles-${q.tiles.length}`}>
                {q.tiles.map((k) => (
                  <Shot key={k} k={k} set={q.tiles} sizes="(max-width: 860px) 50vw, 20vw" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="also-split">
        <div className="also-block">
          <h3 className="also-h">On the record</h3>
          <ul className="achievements">
            {achievements.map((a, i) => (
              <Reveal as="li" key={a} delay={i * 0.03}>
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
            <Reveal key={t.group} className="tool" delay={(i % 3) * 0.05}>
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
        <span>{totalImages} images · 6 live animations · 0 boring résumés</span>
        <a href="#top" onClick={jump("top")}>
          Back to top ↑
        </a>
      </footer>
    </section>
  );
}
