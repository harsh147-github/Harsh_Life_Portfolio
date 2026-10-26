import { motion, useScroll, useSpring } from "motion/react";
import { useState } from "react";
import { links } from "../data/content";
import { scrollToId } from "../lib/scroll";
import { useTheme } from "../lib/theme";

const items = [
  { id: "story", label: "Story" },
  { id: "work", label: "Work" },
  { id: "ventures", label: "Ventures" },
  { id: "lab", label: "Lab" },
  { id: "also", label: "Also" },
  { id: "contact", label: "Contact" },
];

export function Nav() {
  const { mode, toggle, active } = useTheme();
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(id);
  };

  return (
    <header className={`nav ${open ? "is-open" : ""}`}>
      <motion.div className="nav-progress" style={{ scaleX: progress }} aria-hidden />
      <a href="#top" className="nav-logo" onClick={go("top")} aria-label="Harsh Sonavane, back to top">
        HS<span className="accent">.</span>
      </a>
      <span className="nav-now" aria-live="polite">
        {active.label}
      </span>
      <nav className="nav-links" aria-label="Sections">
        {items.map((i) => (
          <a key={i.id} href={`#${i.id}`} onClick={go(i.id)}>
            {i.label}
          </a>
        ))}
      </nav>
      <div className="nav-right">
        <a className="nav-social" href={links.linkedin} target="_blank" rel="noreferrer">
          in
        </a>
        <a className="nav-social" href={links.instagram} target="_blank" rel="noreferrer">
          ig
        </a>
        <button type="button" className="mode-toggle" onClick={toggle} aria-label={`Switch to ${mode === "light" ? "dark" : "light"} mode`}>
          <span>{mode === "light" ? "LIGHT" : "DARK"}</span>
          <span className="mode-glyph" aria-hidden />
        </button>
        <button type="button" className="burger" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label="Menu">
          <span />
          <span />
          <span />
        </button>
      </div>
      <div className="nav-sheet" hidden={!open}>
        {items.map((i, n) => (
          <a key={i.id} href={`#${i.id}`} onClick={go(i.id)}>
            <small>0{n + 1}</small> {i.label}
          </a>
        ))}
      </div>
    </header>
  );
}
