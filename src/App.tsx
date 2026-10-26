import { Fragment, useEffect } from "react";
import { Chapter } from "./components/Chapter";
import { Lightbox } from "./components/Gallery";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { Nav } from "./components/Nav";
import { Preloader } from "./components/Preloader";
import { ActDivider, ActRail, Also, Contact, Glance, Lab } from "./components/Sections";
import { Story } from "./components/Story";
import { acts, marquee } from "./data/content";
import { scrollToId, startSmoothScroll } from "./lib/scroll";
import { ThemeProvider } from "./lib/theme";

export function App() {
  useEffect(() => {
    const stop = startSmoothScroll();
    const hash = location.hash.slice(1);
    if (hash) setTimeout(() => scrollToId(hash), 300);
    return stop;
  }, []);

  return (
    <ThemeProvider>
      <a className="skip" href="#story">
        Skip to content
      </a>
      <Preloader />
      <Nav />
      <ActRail />
      <main>
        <Hero />
        <Marquee items={marquee} />
        <Glance />
        <Story />
        {acts.map((act) => (
          <Fragment key={act.id}>
            <ActDivider act={act} />
            {act.entries.map((c, i) => (
              <Chapter key={c.id} c={c} act={act} pos={i} />
            ))}
          </Fragment>
        ))}
        <Lab />
        <Also />
        <Contact />
      </main>
      <Lightbox />
    </ThemeProvider>
  );
}
