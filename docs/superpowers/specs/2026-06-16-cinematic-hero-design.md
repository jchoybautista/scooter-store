# Cinematic Spotlight Hero — Design

**Date:** 2026-06-16
**Component:** `src/storefront/components/HeroSlider.tsx`
**Status:** Approved, building

## Goal

Make the storefront hero more visually striking, modern, and motion-rich while keeping
all current functionality. Direction chosen: **Cinematic Spotlight** — a dark "stage"
with the rotating scooter under a glowing spotlight, cursor-driven 3D depth, and a
glassy search bar.

## Decisions (locked)

- **Direction:** Cinematic Spotlight (dark, motion-led).
- **Layout:** Asymmetric Stage — copy + search on the left, scooter glowing on the right.
- **Search:** Keep the Category + Brand + Search finder; restyle as a frosted-glass bar.
- **Slides:** Keep the 4-slide rotation (Vespa, Lambretta, Italjet, Giorno) + autoplay + pause-on-hover.
- **Headline:** Keep the original looping typewriter (delete line 1 → retype line 1 → delete
  line 2 → retype line 2 → loop). Copy unchanged: "The Finest Italian" / "Scooters & Parts"
  (orange accent on line 2). _(Revised 2026-06-16: an earlier mask-reveal was reverted to the
  typewriter at the user's request.)_
- **Stat row:** Include a slim, muted stat row under the search (e.g. 600+ in stock · 24 branches · 12 yrs).

## Visual treatment

- Near-black base (`#08080b`).
- Animated **dot grid** that drifts slowly and parallaxes opposite the cursor for depth.
- Large **orange spotlight glow** behind the scooter that "breathes" (slow opacity/scale pulse),
  giving rim light to the dark scooter PNG.
- **Ground reflection** of the scooter (flipped, mask-faded).
- Vignette + subtle gradient for text legibility.
- Tokens unchanged: carrot `#F95D0E`, night `#0E0E12`.

## Animations & interactions

- **Entrance:** stage fades up, dot grid blooms, headline words mask-reveal with stagger,
  scooter scales/slides in as glow blooms, search + chips fade up.
- **Cursor 3D tilt:** scooter + glow get subtle `rotateX/rotateY` parallax following the mouse;
  dot grid drifts opposite. Implemented with GPU transforms via motion values (not React state).
- **Slide transitions:** cinematic crossfade — outgoing scooter scales down + blurs out, incoming
  scales up + sharpens. Brand wordmark + price badge animate. Floating spec chips swap per slide.
- **Glassy search:** frosted bar; hover/focus glow; Search button has a small magnetic hover pull.
- **Dots:** carry an autoplay progress fill. Hover anywhere pauses autoplay (kept).
- **Levitation:** the floating spec chips (Engine, Power) and the price card continuously bob
  up/down on independent, out-of-sync loops (disabled under reduced motion).
- **Glow:** softened from the first pass (peak alpha 0.5 → 0.42, breathing opacity 1.0 → 0.85).

## Unchanged

- 4-slide rotation, autoplay, pause-on-hover.
- Finder navigation logic (`/shop/:type?brand=`).
- Price badge, brand wordmark, prev/next arrows, slide dots.
- Props API (`{ slides, brands }`) — `Home.tsx` does not change.

## Accessibility & performance

- Full `prefers-reduced-motion` fallback: no tilt/drift/breathing; slides crossfade instantly;
  headline simply fades.
- Tilt/parallax via GPU transforms outside React render path.
- Hero images preloaded so slide swaps don't flash.

## Code shape

Single self-contained `HeroSlider.tsx` (matches project pattern), with internal hooks:
`useHeadlineReveal` (replaces `useTypewriter`), `useTilt`, and a reduced-motion check.
