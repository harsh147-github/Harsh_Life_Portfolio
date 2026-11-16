import { useRef, useState } from "react";
import { acts, type Act, type Chapter } from "../data/content";
import { caseStudy } from "../lib/caseStudy";
import { media } from "../lib/media";
import { palettes, themeVars } from "../lib/palettes";
import { LoopVideo } from "./FounderVideo";
import { MotionPlayer } from "./MotionPlayer";
import { Reveal, SplitLetters } from "./Reveal";

/** The picture at the top of a work card: an animation, a clip or a real result. */
function CardVisual({ c }: { c: Chapter }) {
  const v = c.card.visual;
  if (v.kind === "vignette") return <MotionPlayer id="vignette" bare inputProps={{ scene: v.scene, ...palettes[c.theme] }} />;
  if (v.kind === "motion") return <MotionPlayer id={v.id} bare inputProps={v.props} />;
  if (v.kind === "video" && c.video) return <LoopVideo v={c.video} />;
  if (v.kind === "image") {
    const it = media(v.k);
    return <img className={v.fit === "contain" ? "is-contain" : ""} src={it.thumb} srcSet={`${it.thumb} 720w, ${it.src} ${it.w}w`} sizes="(max-width: 1100px) 84vw, 32vw" width={it.w} height={it.h} alt={it.alt} loading="lazy" decoding="async" />;
  }
  return null;
}

function WorkCard({ c, n, of }: { c: Chapter; n: number; of: number }) {
  const v = c.card.visual;
  const chips = c.card.stats.length ? null : c.tags.slice(0, 3);
  return (
    <article className="wcard themed" style={themeVars(c.theme)} data-entry={c.id}>
      <div className={`wcard-media ${v.kind === "image" && v.fit === "contain" ? "is-light" : ""}`}>
        <CardVisual c={c} />
        <span className="wcard-n">
          {String(n).padStart(2, "0")} / {String(of).padStart(2, "0")}
        </span>
      </div>
      <div className="wcard-body">
        <p className="wcard-meta">
          <span>{c.card.role}</span>
          <span>{c.period}</span>
        </p>
        <h3 className="wcard-title">
          {c.title}
          <span className="accent">.</span>
        </h3>
        <p className="wcard-line">{c.card.line}</p>
        {chips ? (
          <ul className="wcard-chips">
            {chips.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        ) : (
          <dl className="wcard-stats">
            {c.card.stats.map((s) => (
              <div key={s.label}>
                <dt>{s.value}</dt>
                <dd>{s.label}</dd>
              </div>
            ))}
          </dl>
        )}
        <span className="wcard-cta" aria-hidden>
          Open the case study <i>→</i>
        </span>
      </div>
      <a
        className="wcard-hit"
        href={`#${c.id}`}
        aria-label={`Open the case study: ${c.title}`}
        onClick={(e) => {
          e.preventDefault();
          caseStudy.open(c.id);
        }}
      />
    </article>
  );
}

/** One act: a header and a row of cards (a swipeable row on small screens). */
function ActSection({ act }: { act: Act }) {
  const track = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const n = act.entries.length;

  const step = () => {
    const t = track.current;
    const first = t?.firstElementChild as HTMLElement | null;
    if (!t || !first) return 1;
    return first.offsetWidth + parseFloat(getComputedStyle(t).columnGap || "0");
  };
  const onScroll = () => {
    const t = track.current;
    if (t) setIdx(Math.min(n - 1, Math.max(0, Math.round(t.scrollLeft / step()))));
  };
  const go = (i: number) => track.current?.scrollTo({ left: i * step(), behavior: "smooth" });

  return (
    <section id={act.id} className="act" data-theme={act.theme} data-act={act.id} data-label={`Act ${act.num} · ${act.title}`} style={{ ["--c" as string]: act.color }}>
      <header className="act-head">
        <Reveal className="act-kicker">
          <i /> Act {act.num} · {act.period}
        </Reveal>
        <h2 className="act-title">
          <SplitLetters text={act.title} />
          <span className="act-dot">.</span>
        </h2>
        <Reveal as="p" className="act-line" delay={0.1}>
          {act.short}
        </Reveal>
      </header>

      <div className={`wrow-track n-${n}`} ref={track} onScroll={onScroll} data-hscroll>
        {act.entries.map((c, i) => (
          <WorkCard key={c.id} c={c} n={i + 1} of={n} />
        ))}
      </div>

      <div className="wrow-nav" aria-hidden={n < 2}>
        <span className="wrow-dots">
          {act.entries.map((c, i) => (
            <button key={c.id} type="button" className={i === idx ? "is-on" : ""} onClick={() => go(i)} aria-label={`Show ${c.title}`} />
          ))}
        </span>
        <span className="wrow-hint">Swipe · {idx + 1} of {n}</span>
        <span className="wrow-arrows">
          <button type="button" onClick={() => go(idx - 1)} disabled={idx === 0} aria-label="Previous">
            ←
          </button>
          <button type="button" onClick={() => go(idx + 1)} disabled={idx === n - 1} aria-label="Next">
            →
          </button>
        </span>
      </div>
    </section>
  );
}

export function Work() {
  return (
    <>
      {acts.map((act) => (
        <ActSection key={act.id} act={act} />
      ))}
    </>
  );
}
