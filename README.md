# Harsh Sonavane — portfolio

A single-page portfolio. It starts in black & white, and each chapter fades into its own palette as you scroll: racing red for Veloce, navy for DIAT, teal for Crompton, safety orange for Paninian, ink-on-paper for IISc, saffron for Sushaasan, pink for RSelf, and carbon-and-gold for CarbonDistrict.

## Stack

- **Vite + React + TypeScript**
- **Remotion** (`@remotion/player`): the motion pieces are real physics, computed in the browser:
  - `airflow` / `airflowWide`: potential flow around a Joukowski airfoil with the Kutta condition. Particles move at the true local velocity.
  - `eigen`: exact Euler–Bernoulli beam and Kirchhoff plate mode shapes.
  - `surrogate`: a Gaussian process (RBF kernel, Cholesky solve) learning from 10 samples.
  - `signal`: Sushaasan's complaints → clusters → costed briefs → dispatch.
  - `twin`: RSelf's digital twin converging from ~20 reactions.
- **Lenis** for smooth scrolling and **Motion** for reveals.
- The theme engine is in `src/lib/theme.tsx`. Every `<section data-theme>` is observed, and the palette colours are registered `@property` values, so the whole page cross-fades between them.

## What's on the page

Index → At a glance → The story → **Work** (Veloce Racing, DIAT/DRDO, Crompton, Paninian Aerospace, IISc) → **Ventures** (Sushaasan, RSelf/Dateify, CarbonDistrict) → The lab (public GitHub projects) → Also (publications, university research, life, achievements, toolbox) → Contact.

- **180 images.** Every usable figure and photo from the Formula Bharat design report, the DIAT bird-strike thesis, the portfolio deck and the Sushaasan/RSelf pitch deck. Also result figures from the public repos and live screenshots of sushaasan.in, rself.tech, dateify.app and the MVAWT site. Curated mosaics show the highlights, and complete archives scroll horizontally. Any image opens in a lightbox (arrow keys / swipe / Esc).
- Images live in `public/media/<key>.webp` (full size) and `<key>.t.webp` (720px thumbnail). Captions, alt text and dimensions are in `src/data/media.json`.

## Editing

All copy, numbers, links and which images appear where are in **`src/data/content.ts`**. Image captions are in `src/data/media.json`.

## Scripts

```bash
npm install
npm run dev        # local dev server
npm run build      # typecheck + production build → dist/
npm run preview    # serve the build
npm run studio     # open Remotion Studio to tweak or render the compositions as MP4
```

## Deploying

`npm run deploy` builds the site and publishes `dist/` to the `gh-pages` branch, which GitHub Pages serves at https://harsh147-github.github.io/Harsh_Life_Portfolio/. To use a custom domain later, add it under the repo's Settings → Pages and put a `CNAME` file containing the domain in `public/`.

The build uses a relative base (`./`), so `dist/` can be deployed to any static host (Vercel, Netlify, GitHub Pages).

## Notes

- Remotion is free for individuals and companies of up to 3 people. See remotion.dev/license.
- Moving animations pause off-screen, can be paused on hover, and respect `prefers-reduced-motion`.
