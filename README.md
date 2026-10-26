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

## Editing

All copy, numbers, links and image lists are in **`src/data/content.ts`**. Images are in `public/media/` (WebP).

## Scripts

```bash
npm install
npm run dev        # local dev server
npm run build      # typecheck + production build → dist/
npm run preview    # serve the build
npm run studio     # open Remotion Studio to tweak or render the compositions as MP4
```

The build uses a relative base (`./`), so `dist/` can be deployed to any static host (Vercel, Netlify, GitHub Pages).

## Notes

- Remotion is free for individuals and companies of up to 3 people. See remotion.dev/license.
- Moving animations pause off-screen, can be paused on hover, and respect `prefers-reduced-motion`.
