# Nilson Lopes — virtual résumé

A bilingual (PT/EN) résumé built as a route you travel: a fiber-optic cable that runs from where I started, in networks, to where I work now, in data. Each project is a node on the cable, and each one told as a short story, from the problem to the result.

## Why it exists

A résumé is usually a list of nouns: it says what someone worked with, not how they think, so two candidates with the same keywords look identical. This one makes the path the content. The page follows my career in the order it happened (design, networks, operations, data) and then tells each tool as a short story: what was broken, what I did about it, and what changed afterwards. The cable is lit only as far as the visitor has travelled, and picking a tool sends a pulse of light down its branch. The result is a single page that works as a résumé and as a set of case studies, and that still reads as plain text without JavaScript or WebGL. It prints to a clean PDF from the browser.

## What is on the page

- **Origin:** design (2021), networks (2023), operations (2024), data (2026).
- **Alloha Planejamento:** four tools from day-to-day Planning and MIS work. The code is private to the company, so the page shows the problem and the path, not the data.
  Each tool also has a short animated demonstration of its mechanism (a three-node fibre with the same red pulse), in `scripts/demos.mjs` and `site/demos.css`. They are illustrative and show no real data or code; under reduced motion they rest on the final state.
- **Side project:** df-DnD (on hold, public).
- **Contact:** LinkedIn, GitHub, and a "Save as PDF" button.

## Run it

```sh
npm install
npm run build     # regenerates site/index.html and site/scripts/copy.js
npm run preview   # http://127.0.0.1:4178  (use ?lang=en for English)
```

The copy for both languages lives in `scripts/site-content.mjs`. `npm run build` turns it into the Portuguese HTML plus the translation table the language switch reads. Do not edit `site/index.html` or `site/scripts/copy.js` by hand.

## How it is made

- **The scene** (`site/scripts/fiber.js`) is procedural Three.js (r170, vendored under `site/assets/vendor/`, MIT): a Catmull-Rom curve for the cable, a lit tube whose draw range follows the scroll, branch tubes for the nodes, travelling pulses and dust. No imported 3D models.
- **Quality per device:** one table (`TIERS`) sets the pixel ratio and the amount of dust. It is chosen from cores, memory and width, and steps down by itself if frames take too long.
- **Floor:** the scene starts only with WebGL2 and when reduced motion is not requested. Under reduced motion, without WebGL or without scripts, the page is plain text with the same content. No sound is used.
- **Type:** Fraunces, Geist and Geist Mono (SIL Open Font License, files and licenses under `site/assets/fonts/`).
- **Weight:** about 840 KB on first view, 700 KB of it the Three.js module.

## Images

- The portrait is supplied by Nilson and stored in `site/assets/images/nilson-lopes.jpg`.
- The Planning Intelligence image is a screenshot of the public [`website-analytics`](https://github.com/jounimn/website-analytics) sample. Its organization names and data are fictional.
- No stock imagery.

## Deploy

`.github/workflows/deploy-pages.yml` publishes only `site/` to GitHub Pages on pushes to `main`. In the repository settings, Pages must use **GitHub Actions** as its source.

## Prototypes

`auditions/yolo/` holds the three directions that were compared before this one (a flight through a pipeline, a control desk with tickets, a living spreadsheet). They are kept for reference and are not deployed.
