import { motion } from "motion/react";
import { useState } from "react";
import type { Act, Chapter as ChapterT } from "../data/content";
import { mediaGroup } from "../lib/media";
import { ease } from "../lib/motion";
import { BrowserFrame, Filmstrip, Mosaic, PhoneFrame, Shot } from "./Gallery";
import { MotionPlayer } from "./MotionPlayer";
import { Reveal, SplitLetters } from "./Reveal";

export function Chapter({ c, act, pos }: { c: ChapterT; act: Act; pos: number }) {
  const [archivesOpen, setArchivesOpen] = useState(!c.collapseArchives);
  const archiveCount = c.archives?.reduce((n, a) => n + mediaGroup(a.group).items.length, 0) ?? 0;
  const visual = c.motion && !c.motionWide ? (
    <MotionPlayer id={c.motion.id} caption={c.motion.caption} inputProps={c.motion.props} />
  ) : c.pipeline ? (
    <Pipeline steps={c.pipeline} />
  ) : c.lead ? (
    <Shot k={c.lead} className="shot-lead" sizes="(max-width: 1100px) 100vw, 58vw" />
  ) : null;

  const showcaseKeys = c.showcase ? [...c.showcase.browsers.map((b) => b.k), ...(c.showcase.phone ? [c.showcase.phone] : [])] : [];

  return (
    <section
      id={c.id}
      className={`chapter chapter-${c.id}`}
      data-theme={c.theme}
      data-act={act.id}
      data-label={`${act.title} · ${c.title}`}
    >
      <header className="ch-head">
        <div className="ch-index">
          <span className="ch-act" style={{ ["--c" as string]: act.color }}>
            <i /> Act {act.num} · {act.title}
          </span>
          <span className="ch-pos">
            <span className="accent">{String(pos + 1).padStart(2, "0")}</span> / {String(act.entries.length).padStart(2, "0")}
          </span>
        </div>
        <h2 className="ch-title">
          <Reveal className="label">{c.kicker}</Reveal>
          <span className="ch-name">
            <SplitLetters text={c.title} />
            <span className="accent">.</span>
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

      {c.motion && c.motionWide && (
        <div className="ch-motion-wide">
          <MotionPlayer id={c.motion.id} caption={c.motion.caption} inputProps={c.motion.props} />
        </div>
      )}

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

      {c.deck && (
        <div className="deck-block">
          <div className="block-label">
            <span className="accent">●</span> {c.deck.label}
          </div>
          <div className="deck-grid" style={{ ["--cols" as string]: c.deck.cols ?? 2, ["--ar" as string]: c.deck.aspect ?? "16 / 9" }}>
            {c.deck.slides.map((k) => (
              <Shot key={k} k={k} set={c.deck!.slides} className="deck-slide" sizes="(max-width: 860px) 100vw, 40vw" />
            ))}
          </div>
        </div>
      )}

      {c.cards && (
        <div className="cards-grid">
          {c.cards.map((card, i) => (
            <Reveal key={card.title} className="idea-card" delay={i * 0.06}>
              <span className="idea-n">{String(i + 1).padStart(2, "0")}</span>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </Reveal>
          ))}
        </div>
      )}

      {c.showcase && (
        <div className={`showcase ${c.showcase.phone ? "" : "showcase-solo"}`}>
          <div className="showcase-browsers">
            {c.showcase.browsers.map((b) => (
              <BrowserFrame key={b.k} k={b.k} url={b.url} set={showcaseKeys} />
            ))}
          </div>
          {c.showcase.phone && <PhoneFrame k={c.showcase.phone} set={showcaseKeys} />}
        </div>
      )}

      {c.mosaics?.map((m) => <Mosaic key={m.label} label={m.label} tiles={m.tiles} />)}

      {c.archives && c.collapseArchives && (
        <button type="button" className="archive-toggle" onClick={() => setArchivesOpen((v) => !v)} aria-expanded={archivesOpen}>
          <span>{archivesOpen ? "Close the full archive" : "Open the full archive"}</span>
          <span className="archive-toggle-n">
            {archiveCount} images {archivesOpen ? "↑" : "↓"}
          </span>
        </button>
      )}
      {c.archives && archivesOpen && (
        <div className="archives">
          {c.archives.map((a) => (
            <Filmstrip key={a.group} group={a.group} label={a.label} tall={a.tall} />
          ))}
        </div>
      )}

      <footer className="ch-foot">
        <ul className="ch-tags" aria-label="Tools">
          {c.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        {c.note && <p className="ch-note">{c.note}</p>}
      </footer>
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
