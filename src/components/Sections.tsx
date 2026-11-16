import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { achievements, education, links, numbers, publications, sideQuests, toolbox } from "../data/content";
import { caseStudy } from "../lib/caseStudy";
import { figure } from "../lib/figure";
import { totalImages } from "../lib/media";
import { ease, useReducedMotion } from "../lib/motion";
import { scrollToId } from "../lib/scroll";
import { Shot } from "./Gallery";
import { Journey } from "./Journey";
import { Reveal, SplitLetters } from "./Reveal";

const jump = (id: string) => (e: React.MouseEvent) => {
  e.preventDefault();
  scrollToId(id);
};

/** A stat that counts up the first time it scrolls into view. */
function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const [t, setT] = useState(reduced ? 1 : 0);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / 1300);
          setT(1 - Math.pow(1 - p, 3));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [reduced]);
  return <span ref={ref}>{figure(value, t)}</span>;
}

/** Six numbers that carry the profile; each opens its case study. */
export function Numbers() {
  return (
    <section id="numbers" className="numbers" data-theme="base" data-label="In numbers">
      <Reveal className="label">the proof, in six numbers</Reveal>
      <ul className="numbers-grid">
        {numbers.map((n, i) => (
          <motion.li
            key={n.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -8% 0px" }}
            transition={{ duration: 0.8, ease, delay: (i % 3) * 0.07 }}
          >
            <a
              href={`#${n.entry}`}
              onClick={(e) => {
                e.preventDefault();
                caseStudy.open(n.entry);
              }}
            >
              <span className="numbers-value">
                <CountUp value={n.value} />
              </span>
              <span className="numbers-label">{n.label}</span>
              <span className="numbers-arrow" aria-hidden>
                ↗
              </span>
            </a>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

/** The dated timeline: everything in parallel, at a glance. Wide screens only. */
export function JourneySection() {
  return (
    <section id="journey" className="journey-section" data-theme="base" data-label="The journey">
      <Journey />
    </section>
  );
}

const TABS = ["Publications", "Recognition", "Toolbox", "Beyond work"] as const;
type Tab = (typeof TABS)[number];

/** Everything that isn't a chapter, one tab at a time. */
export function More() {
  const [tab, setTab] = useState<Tab>("Publications");
  return (
    <section id="more" className="more" data-theme="base" data-label="More">
      <header className="more-head">
        <div>
          <Reveal className="label">and</Reveal>
          <h2 className="display-md">
            <SplitLetters text="more." />
          </h2>
        </div>
        <div className="more-tabs" role="tablist" aria-label="More about Harsh" data-hscroll>
          {TABS.map((t) => (
            <button key={t} type="button" role="tab" aria-selected={t === tab} className={t === tab ? "is-on" : ""} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>
      </header>

      <motion.div key={tab} className="more-panel" role="tabpanel" aria-label={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
        {tab === "Publications" && (
          <ol className="pubs">
            {publications.map((p) => (
              <li key={p.title}>
                <a href={p.href} target="_blank" rel="noreferrer">
                  <span className="pub-title">{p.title}</span>
                  <span className="pub-cite">{p.cite}</span>
                  <span className="pub-venue">{p.venue} ↗</span>
                </a>
              </li>
            ))}
          </ol>
        )}

        {tab === "Recognition" && (
          <ul className="achievements">
            {achievements.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        )}

        {tab === "Toolbox" && (
          <dl className="toolbox">
            {toolbox.map((t) => (
              <div key={t.group} className="tool">
                <dt>{t.group}</dt>
                <dd>{t.items}</dd>
              </div>
            ))}
          </dl>
        )}

        {tab === "Beyond work" && (
          <div className="beyond">
            <div className="edu">
              <p className="edu-school">{education.school}</p>
              <p className="edu-degree">{education.degree}</p>
              <p className="edu-note">{education.note}</p>
            </div>
            {sideQuests.map((q) => (
              <div className="quest" key={q.title}>
                <div className="quest-text">
                  <h4>{q.title}</h4>
                  <p>{q.body}</p>
                </div>
                <div className={`quest-tiles quest-tiles-${q.tiles.length}`}>
                  {q.tiles.map((k) => (
                    <Shot key={k} k={k} set={q.tiles} sizes="(max-width: 860px) 50vw, 20vw" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
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
        <h2 className="display-xl">
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
        <span>{totalImages} images · 11 case studies · 0 boring résumés</span>
        <a href="#top" onClick={jump("top")}>
          Back to top ↑
        </a>
      </footer>
    </section>
  );
}
