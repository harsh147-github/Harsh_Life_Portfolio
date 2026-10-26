import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type Mode = "light" | "dark";
type Active = { theme: string; label: string; act: string };
type Ctx = { mode: Mode; toggle: () => void; active: Active };

const ThemeCtx = createContext<Ctx>({ mode: "light", toggle: () => {}, active: { theme: "base", label: "", act: "" } });
export const useTheme = () => useContext(ThemeCtx);

const read = (): Mode => {
  try {
    const v = localStorage.getItem("hs-mode");
    if (v === "light" || v === "dark") return v;
  } catch {
    /* storage unavailable */
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

/**
 * Drives the page palette. Every <section data-theme> is watched; whichever one
 * crosses the middle of the viewport becomes the active theme. Colours are
 * registered @property values, so the whole page cross-fades between palettes.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>(read);
  const [active, setActive] = useState<Active>({ theme: "base", label: "", act: "" });

  useEffect(() => {
    document.documentElement.dataset.mode = mode;
    try {
      localStorage.setItem("hs-mode", mode);
    } catch {
      /* ignore */
    }
  }, [mode]);

  useEffect(() => {
    document.documentElement.dataset.theme = active.theme;
  }, [active]);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("section[data-theme]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) {
            e.target.classList.remove("is-active");
            continue;
          }
          const el = e.target as HTMLElement;
          sections.forEach((s) => s !== el && s.classList.remove("is-active"));
          el.classList.add("is-active");
          setActive({ theme: el.dataset.theme || "base", label: el.dataset.label || "", act: el.dataset.act || "" });
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const toggle = useCallback(() => setMode((m) => (m === "light" ? "dark" : "light")), []);
  return <ThemeCtx.Provider value={{ mode, toggle, active }}>{children}</ThemeCtx.Provider>;
}
