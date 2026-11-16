import { allEntries } from "../data/content";

/**
 * Which case study is open. The id lives in the URL hash (#veloce), so a case
 * study can be linked to directly and the browser's Back button closes it.
 */
const ids = new Set(allEntries.map((e) => e.id));
type Listener = (id: string | null) => void;
const listeners = new Set<Listener>();
let current: string | null = null;

const set = (id: string | null) => {
  current = id;
  listeners.forEach((l) => l(id));
};
const fromHash = () => {
  const h = location.hash.slice(1);
  return ids.has(h) ? h : null;
};

export const caseStudy = {
  has: (id: string) => ids.has(id),
  get: () => current,
  open(id: string) {
    if (!ids.has(id)) return;
    // moving between case studies replaces the entry, so Back always returns to the page
    if (current) history.replaceState({ cs: id }, "", `#${id}`);
    else history.pushState({ cs: id }, "", `#${id}`);
    set(id);
  },
  close() {
    if (!current) return;
    if (history.state?.cs) history.back();
    else {
      history.replaceState(null, "", location.pathname + location.search);
      set(null);
    }
  },
  subscribe(fn: Listener) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
  /** call once on load: opens a deep-linked case study and follows Back/Forward */
  init() {
    const first = fromHash();
    if (first) {
      history.replaceState(null, "", location.pathname + location.search);
      history.pushState({ cs: first }, "", `#${first}`);
      set(first);
    }
    const onPop = () => set(fromHash());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  },
};
