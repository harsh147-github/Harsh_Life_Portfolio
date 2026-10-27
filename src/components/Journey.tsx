import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { timeline, type TimelineItem } from "../data/content";
import { ease } from "../lib/motion";
import { scrollToId } from "../lib/scroll";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const toM = (d: string) => {
  const [y, m] = (d === "now" ? timeline.now : d).split("-").map(Number);
  return y * 12 + (m - 1);
};
const M0 = toM(timeline.start);
const M1 = toM(timeline.end);
// Recent years are denser, so each year gets its own width (relative units).
const YEAR_W: Record<number, number> = { 2021: 0.35, 2022: 0.75, 2023: 0.75, 2024: 1, 2025: 1.5, 2026: 2.3 };
const segs = (() => {
  const out: { m0: number; m1: number; x0: number; w: number }[] = [];
  let x = 0;
  for (let y = Math.floor(M0 / 12); y * 12 < M1; y++) {
    const m0 = Math.max(M0, y * 12);
    const m1 = Math.min(M1, y * 12 + 12);
    const w = YEAR_W[y] ?? 1;
    out.push({ m0, m1, x0: x, w });
    x += w;
  }
  return { out, total: x };
})();
const pctM = (m: number) => {
  const s = segs.out.find((g) => m >= g.m0 && m <= g.m1) ?? segs.out[segs.out.length - 1];
  return ((s.x0 + ((m - s.m0) / (s.m1 - s.m0)) * s.w) / segs.total) * 100;
};
const pct = (d: string) => pctM(toM(d));
const fmt = (d: string) => (d === "now" ? "now" : `${MONTHS[Number(d.split("-")[1]) - 1]} ${d.split("-")[0]}`);
const ROW = 48;
const NOMINAL = 1000; // px width the label-collision layout assumes

/** Greedy row packing that accounts for each bar's label width. */
function pack(items: TimelineItem[]) {
  const rows: number[] = [];
  return items
    .slice()
    .sort((a, b) => toM(a.from) - toM(b.from))
    .map((it) => {
      const lw = ((it.label.length * 8.8 + 20) / NOMINAL) * 100;
      const right = pct(it.from) + lw > pct("now") - 0.5;
      const a = right ? pct(it.to) - lw : pct(it.from);
      const b = right ? pct(it.to) : Math.max(pct(it.to), pct(it.from) + lw);
      let r = rows.findIndex((end) => end <= a - 0.6);
      if (r === -1) {
        r = rows.length;
        rows.push(0);
      }
      rows[r] = b;
      return { it, row: r, right };
    })
    .map((x) => ({ ...x, rows: rows.length }));
}

type Hover = { item: TimelineItem; lane: string; color: string; x: number; y: number };

export function Journey() {
  const wrap = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  // on narrow screens the plot scrolls sideways: open it at "now", where the recent work is
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);
  const [hover, setHover] = useState<Hover | null>(null);
  const lanes = useMemo(() => timeline.lanes.map((l) => ({ ...l, packed: pack(l.items) })), []);
  const years = useMemo(() => {
    const out: { y: number; p: number }[] = [];
    for (let y = Math.ceil(M0 / 12); y * 12 <= toM(timeline.now); y++) out.push({ y, p: pctM(y * 12) });
    return out;
  }, []);
  const nowP = pct("now");

  const show = (e: React.SyntheticEvent<HTMLElement>, item: TimelineItem, lane: string, color: string) => {
    const box = wrap.current?.getBoundingClientRect();
    const r = e.currentTarget.getBoundingClientRect();
    if (!box) return;
    setHover({ item, lane, color, x: Math.min(Math.max(r.left - box.left, 0), box.width - 300), y: r.bottom - box.top + 10 });
  };

  return (
    <div className={`journey ${hover ? "has-hover" : ""}`} ref={wrap} onMouseLeave={() => setHover(null)}>
      <div className="journey-head">
        <span className="journey-title">The journey</span>
        <span className="journey-hint">Hover to preview · click to jump to the section</span>
      </div>
      <div className="journey-scroll" data-hscroll ref={scroller}>
        <div className="journey-grid">
          <div className="journey-axis">
            <span />
            <div className="journey-years">
              {years.map((y) => (
                <span key={y.y} style={{ left: `${y.p}%` }}>
                  {y.y}
                </span>
              ))}
            </div>
          </div>

          <div className="journey-lanes">
            <div className="journey-overlay" aria-hidden>
              {years.map((y) => (
                <i key={y.y} className="journey-gridline" style={{ left: `${y.p}%` }} />
              ))}
              <i className="journey-now" style={{ left: `${nowP}%` }}>
                <b>Now · {fmt(timeline.now)}</b>
              </i>
            </div>

            {lanes.map((lane, li) => {
              const rows = lane.packed[0]?.rows ?? 1;
              return (
                <div className="journey-lane" key={lane.act} style={{ ["--c" as string]: lane.color }}>
                  <button type="button" className="journey-lane-label" onClick={() => scrollToId(lane.act)}>
                    <i />
                    {lane.label}
                  </button>
                  <div className="journey-plot" style={{ height: rows * ROW + 8 }}>
                    {lane.packed.map(({ it, row, right }, k) => {
                      const x0 = pct(it.from);
                      const w = Math.max(0.8, pct(it.to) - x0);
                      const live = it.to === "now";
                      const isHover = hover?.item === it;
                      return (
                        <button
                          type="button"
                          key={`${it.id}-${k}`}
                          className={`journey-bar ${live ? "is-live" : ""} ${isHover ? "is-hover" : ""} ${right ? "is-right" : ""}`}
                          style={{ left: `${x0}%`, width: `${w}%`, top: row * ROW + 4 }}
                          onMouseEnter={(e) => show(e, it, lane.label, lane.color)}
                          onFocus={(e) => show(e, it, lane.label, lane.color)}
                          onBlur={() => setHover(null)}
                          onClick={() => scrollToId(it.id)}
                          aria-label={`${it.label}, ${it.role}, ${fmt(it.from)} to ${fmt(it.to)}. Jump to section.`}
                        >
                          <span className="journey-bar-label">{it.label}</span>
                          <motion.span
                            className="journey-bar-line"
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.1, ease, delay: 0.4 + li * 0.08 + x0 / 120 }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {hover && (
        <motion.div
          className="journey-card"
          style={{ left: hover.x, top: hover.y, ["--c" as string]: hover.color }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease }}
          aria-hidden
        >
          <span className="journey-card-lane">{hover.lane}</span>
          <strong>{hover.item.label}</strong>
          <span className="journey-card-role">
            {hover.item.role}
            {hover.lane !== "Education" && ` · ${fmt(hover.item.from)} – ${fmt(hover.item.to)}`}
          </span>
          {hover.item.note && <span className="journey-card-note">{hover.item.note}</span>}
          <span className="journey-card-go">Click to jump ↓</span>
        </motion.div>
      )}
    </div>
  );
}
