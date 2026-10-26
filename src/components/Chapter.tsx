import { motion } from "motion/react";
import type { Chapter as ChapterT } from "../data/content";
import { ease } from "../lib/motion";
import { MotionPlayer } from "./MotionPlayer";
import { Reveal, Shot, SplitLetters } from "./Reveal";

export function Chapter({ c, total }: { c: ChapterT; total: number }) {
  const visual = c.motion ? (
    <MotionPlayer id={c.motion.id} caption={c.motion.caption} inputProps={c.motion.props} />
  ) : c.pipeline ? (
    <Pipeline steps={c.pipeline} />
  ) : c.lead ? (
    <Shot src={c.lead.src} alt={c.lead.alt} caption={c.lead.caption} className="shot-lead" />
  ) : null;

  return (
    <section id={c.id} className={`chapter chapter-${c.id}`} data-theme={c.theme} data-label={`${c.index} — ${c.title}`}>
      <header className="ch-head">
        <div className="ch-index">
          <span className="accent">{c.index}</span> / {String(total).padStart(2, "0")}
        </div>
        <h2 className="ch-title">
          <Reveal className="label">{c.kicker}</Reveal>
          <span className="display-xl">
            <SplitLetters text={c.title} />
          </span>
        </h2>
        <dl className="ch-meta">
          <Reveal>
            <dt>Where</dt>
            <dd>{c.org}</dd>
          </Reveal>
          <Reveal delay={0.06}>
            <dt>Role</dt>
            <dd>{c.role}</dd>
          </Reveal>
          <Reveal delay={0.12}>
            <dt>When</dt>
            <dd>{c.period}</dd>
          </Reveal>
        </dl>
      </header>

      <div className={`ch-body ${visual ? "" : "ch-body-solo"}`}>
        <div className="ch-text">
          <Reveal as="p" className="ch-lede">
            {c.lede}
          </Reveal>
          <ul className="ch-points">
            {c.points.map((p, i) => (
              <Reveal as="li" key={p} delay={0.05 * i}>
                {p}
              </Reveal>
            ))}
          </ul>
          {c.links && (
            <Reveal className="btn-row">
              {c.links.map((l) => (
                <a key={l.href} className="btn" href={l.href} target="_blank" rel="noreferrer">
                  {l.label} ↗
                </a>
              ))}
            </Reveal>
          )}
        </div>
        {visual && <div className="ch-visual">{visual}</div>}
      </div>

      {c.stats.length > 0 && (
        <div className="ch-stats">
          {c.stats.map((s, i) => (
            <Reveal key={s.label} className="stat" delay={i * 0.07}>
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </Reveal>
          ))}
        </div>
      )}

      {c.lead && (c.motion || c.pipeline) && (
        <div className="ch-gallery">
          <Shot src={c.lead.src} alt={c.lead.alt} caption={c.lead.caption} className="span-wide" />
        </div>
      )}

      {c.galleries?.map((g) => (
        <div className="ch-gallery-block" key={g.label}>
          <div className="ch-gallery-label">
            <span className="accent">●</span> {g.label}
          </div>
          <div className="ch-gallery">
            {g.items.map((m) => (
              <Shot key={m.src} src={m.src} alt={m.alt} caption={m.caption} className={m.span ? `span-${m.span}` : ""} />
            ))}
          </div>
        </div>
      ))}

      <ul className="ch-tags" aria-label="Tools">
        {c.tags.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </section>
  );
}

function Pipeline({ steps }: { steps: { name: string; does: string }[] }) {
  return (
    <figure className="pipeline">
      <div className="pipeline-head">
        <span className="accent">●</span> OPEN-SOURCE AEROSTRUCTURAL MDO LOOP
      </div>
      <ol className="pipeline-steps">
        {steps.map((s, i) => (
          <motion.li
            key={s.name}
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.7, ease, delay: i * 0.1 }}
          >
            <span className="pipeline-n">{String(i + 1).padStart(2, "0")}</span>
            <span className="pipeline-name">{s.name}</span>
            <span className="pipeline-does">{s.does}</span>
            <span className="pipeline-flow" aria-hidden />
          </motion.li>
        ))}
      </ol>
      <div className="pipeline-loop" aria-hidden>
        ↺ iterate · replaced a commercial workflow · 5× faster
      </div>
      <div className="pipeline-fi">
        <span className="pipeline-fi-label">failure index</span>
        <span className="pipeline-fi-value">
          1.50 <span className="accent">→</span> 0.795
        </span>
      </div>
    </figure>
  );
}
