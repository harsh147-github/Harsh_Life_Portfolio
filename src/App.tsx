import { useEffect } from "react";
import { CaseStudy } from "./components/CaseStudy";
import { Lightbox } from "./components/Gallery";
import { Hero } from "./components/Hero";
import { Nav } from "./components/Nav";
import { Preloader } from "./components/Preloader";
import { Contact, JourneySection, More, Numbers } from "./components/Sections";
import { StoryReel } from "./components/StoryReel";
import { Work } from "./components/Work";
import { acts } from "./data/content";
import { caseStudy } from "./lib/caseStudy";
import { scrollToId, startSmoothScroll } from "./lib/scroll";
import { ThemeProvider } from "./lib/theme";

// links from before the page was restructured still land somewhere sensible
const MOVED: Record<string, string> = { story: "reel", glance: "numbers", lab: "more", also: "more", work: "piml" };

export function App() {
  useEffect(() => {
    const stop = startSmoothScroll();
    const raw = location.hash.slice(1);
    const hash = MOVED[raw] ?? raw;
    // a case-study link opens the case study, with its act behind it
    const act = acts.find((a) => a.entries.some((e) => e.id === hash));
    const unlisten = caseStudy.init();
    const target = act?.id ?? hash;
    if (target) setTimeout(() => scrollToId(target, { hash: !act && raw === hash ? true : false, instant: !!act }), 300);
    return () => {
      stop();
      unlisten();
    };
  }, []);

  return (
    <ThemeProvider>
      <a className="skip" href="#piml">
        Skip to the work
      </a>
      <Preloader />
      <Nav />
      <main>
        <Hero />
        <StoryReel />
        <Numbers />
        <JourneySection />
        <Work />
        <More />
        <Contact />
      </main>
      <CaseStudy />
      <Lightbox />
    </ThemeProvider>
  );
}
