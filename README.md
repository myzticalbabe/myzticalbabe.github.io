# myzticalbabe.github.io

Static GitHub Pages site for the Azazael project: a graph/data explorer hub plus a
kids science page. Everything here is plain HTML, CSS and JavaScript — no build step,
no server. Push to `main` and Pages serves it.

## Pages

| Page | What it is |
| --- | --- |
| `index.html` | **YGGDRASIL — FOREST INDEX**: the landing hub. Explains the atlas columns, the cleave ladder, the shard plan and the language graphs, and links to Kids Mode. |
| `kids.html` | **Brain Explorer Kids**: the STEM learning page — semantic memory, spiking neurons, graph algorithms and cognitive load, written for ages 8–13 with a Real Scientists view. |
| `interactive.html` | **Azazael Domain Atlas — Interactive Explorer**: the interactive view over the `atlas_*.json` / `domain_*.json` data files. |
| `manifest.json`, `icons/` | Web app manifest and install icons used by `kids.html`. |

The `atlas_*.json`, `domain_*.json` and `forest_manifest.json` files are generated
data consumed by `index.html` and `interactive.html`. They are checked in so the site
stays a pure static deploy.

## Running locally

```bash
python -m http.server 8000
# then open http://localhost:8000/
```

Opening the HTML files directly with `file://` mostly works, but the JSON fetches need
a real HTTP origin.

## Working on the kids page

`kids.html` is the published copy of `demo-pages/kids-index.html` in
[`myzticalbabe/wasm-education`](https://github.com/myzticalbabe/wasm-education).
Edit it there first so the two copies do not drift, then copy the result here:

```bash
cp ../wasm-education/demo-pages/kids-index.html kids.html
```

That repository also has `tools/check_pages.py`, which verifies that every view a page
links to exists and that local assets resolve. Run it before copying:

```bash
cd ../wasm-education && python tools/check_pages.py
```

## Standards the kids page follows

- **Accessibility**: every `<canvas>` carries a text alternative (`role="img"` +
  `aria-label` + fallback content), live state is mirrored into an `.sr-only`
  region, and colour is never the only signal.
- **Age-appropriate science**: each module names the underlying concept, states a
  learning objective, and is tied to a working scientist so girls can see who does
  this work.
- **Progressive disclosure**: module 1 → 4 increases difficulty, so a facilitator can
  stop at any point.

## Licence

This repository does not carry its own `LICENSE` file yet, so GitHub reports the
licence as unknown. The material it publishes comes from
[`myzticalbabe/wasm-education`](https://github.com/myzticalbabe/wasm-education/blob/main/LICENSE),
which ships the SOUL FORGE licence text. Adding a `LICENSE` file here (or confirming
that the SOUL FORGE text should be duplicated) is an owner decision.
