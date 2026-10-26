import manifest from "../data/media.json";

export type MediaItem = { key: string; src: string; thumb: string; w: number; h: number; caption: string; alt: string };

type Manifest = {
  items: Record<string, { w: number; h: number; caption: string; alt: string }>;
  groups: { id: string; label: string; items: string[] }[];
};
const m = manifest as Manifest;

/** Look up an image from the generated manifest (scripts → src/data/media.json). */
export function media(key: string): MediaItem {
  const it = m.items[key];
  if (!it) throw new Error(`Unknown media key: ${key}`);
  return { key, src: `media/${key}.webp`, thumb: `media/${key}.t.webp`, ...it };
}

export function mediaGroup(id: string) {
  const g = m.groups.find((x) => x.id === id);
  if (!g) throw new Error(`Unknown media group: ${id}`);
  return g;
}

export const totalImages = Object.keys(m.items).length;

/* ---- lightbox bus: any thumbnail can open the viewer on its own set ---- */
type Open = { keys: string[]; index: number };
const listeners = new Set<(o: Open) => void>();
export const lightbox = {
  open(keys: string[], index: number) {
    listeners.forEach((l) => l({ keys, index }));
  },
  subscribe(fn: (o: Open) => void) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
};
