# Harsh Sonavane — portfolio

A single-page portfolio built to be short: about nine phone screens from top to contact. The page itself stays black & white; each piece of work is a poster card in its own palette (racing red for Veloce, navy for DIAT, teal for Crompton, safety orange for Paninian, ink-on-paper for IISc, saffron for Sushaasan, pink for RSelf, carbon-and-gold for CarbonDistrict), and the full write-up opens as a case study on top of the page.

## Stack

- **Vite + React + TypeScript**
- **Remotion** (`@remotion/player`): the motion pieces are real physics, computed in the browser:
  - `reel` / `reelTall`: the story film, cut like a trailer (under a minute) (landscape and portrait cuts of the same scenes; scene list in `src/remotion/reelScenes.ts`, drawings in `src/remotion/gfx.tsx`).
  - `vignette`: the small looping drawings on the work cards.
  - `pinnHero`: a physics-informed network on a composite wing (kept for Remotion Studio; no longer on the page).
  - `veloceFlow`: the Veloce full-body CFD image with streamlines traced live over it (velocity from the image colour bar, direction from potential flow around the car; field in `src/remotion/veloceField.ts`).
  - `eigen`: exact Euler–Bernoulli beam and Kirchhoff plate mode shapes.
  - `surrogate`: a Gaussian process (RBF kernel, Cholesky solve) learning from 10 samples.
  - `signal`: Sushaasan's complaints → clusters → costed briefs → dispatch.
  - `persona`: RSelf: personality → extraction network → latent function → digital twin → the world.
- **Lenis** for smooth scrolling and **Motion** for reveals.
- The theme engine is in `src/lib/theme.tsx`. Every `<section data-theme>` is observed and only the accent colour changes per act. The per-work palettes are in `src/lib/palettes.ts` and are applied to cards and case studies as inline CSS variables (`.themed`).
- Case studies are driven by the URL hash (`src/lib/caseStudy.ts`): `/#veloce` opens one directly and the browser's Back button closes it.

## What's on the page

Hero (photo, title, intro quote) → **My story, in under a minute** (a Remotion film with story-style controls: tap either side to skip, each scene opens its case study) → six headline numbers → the journey timeline (wide screens only) → four acts, each one row of cards → More (tabs: publications, recognition, toolbox, beyond work) → Contact.

The acts run newest first: **Act 01 · Physics-informed ML** (IISc, PINNs-Bernoulli, CFD × ML × CAD), **Act 02 · Ventures** (Sushaasan, RSelf.tech, CarbonDistrict), **Act 03 · Aerospace structures** (Paninian Aerospace, DIAT/DRDO), **Act 04 · Simulation engineering** (Crompton, Veloce Racing, VIT research). On phones and tablets each row swipes sideways. Everything long (the points, figures, decks, galleries and archives) lives inside the case study for that card, one tap away.

- **196 images.** Figures and photos from the Formula Bharat design report, the DIAT bird-strike thesis, the portfolio deck and the Sushaasan/RSelf pitch deck, plus result figures from the public repos and live screenshots of sushaasan.in, rself.tech and the MVAWT site. Any image opens in a lightbox (arrow keys / swipe / Esc).
- Images live in `public/media/<key>.webp` (full size) and `<key>.t.webp` (720px thumbnail). Captions, alt text and dimensions are in `src/data/media.json`.

## Editing

All copy, numbers, links, the acts, the card on each piece of work (`card`), the timeline dates and which images appear where are in **`src/data/content.ts`**. The story film's scenes and headlines are in `src/remotion/reelScenes.ts`. Image captions are in `src/data/media.json`.

## Scripts

```bash
npm install
npm run dev        # local dev server
npm run build      # typecheck + production build → dist/
npm run preview    # serve the build
npm run studio     # open Remotion Studio to tweak or render the compositions as MP4
```

## Deploying

**Live at https://harshsonavane.com.** Cloudflare Workers Builds deploys this branch on every push: it runs `npm run build`, then `npx wrangler deploy`, which uploads `dist/` as static assets and attaches `harshsonavane.com` and `www.harshsonavane.com` (see `wrangler.jsonc`).

The old GitHub Pages address (https://harsh147-github.github.io/Harsh_Life_Portfolio/) redirects to harshsonavane.com, keeping any `#section` in the link. `npm run deploy:gh-redirect` republishes that redirect page.

The build uses a relative base (`./`), so `dist/` can be deployed to any static host (Vercel, Netlify, GitHub Pages).

## Notes

- Remotion is free for individuals and companies of up to 3 people. See remotion.dev/license.
- Moving animations pause off-screen, can be paused on hover, and respect `prefers-reduced-motion`.
