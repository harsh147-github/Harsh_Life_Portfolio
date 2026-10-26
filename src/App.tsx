import { useEffect } from "react";
import { Chapter } from "./components/Chapter";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { Nav } from "./components/Nav";
import { Preloader } from "./components/Preloader";
import { Also, Contact, Divider } from "./components/Sections";
import { Story } from "./components/Story";
import { marquee, ventures, work } from "./data/content";
import { scrollToId, startSmoothScroll } from "./lib/scroll";
import { ThemeProvider } from "./lib/theme";

const total = work.length + ventures.length;

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
      <main>
        <Hero />
        <Marquee items={marquee} />
        <Story />
        <Divider
          id="work"
          kicker="the"
          word="work."
          line="Five chapters in engineering, each one in its own colours. They start in black & white and earn their palette as you scroll."
          chapters={work}
        />
        {work.map((c) => (
          <Chapter key={c.id} c={c} total={total} />
        ))}
        <Divider
          id="ventures"
          kicker="the"
          word="founder."
          line="Same operator, different systems. A fast, verifiable model of something complex, then shipped as a product."
          chapters={ventures}
          theme="inverse"
        />
        {ventures.map((c) => (
          <Chapter key={c.id} c={c} total={total} />
        ))}
        <Also />
        <Contact />
      </main>
    </ThemeProvider>
  );
}
