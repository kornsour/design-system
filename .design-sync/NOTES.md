# design-sync notes

This repo builds an installable package (`@kornorg/design-system`, ADR-0011) with
**multiple feels** (themes) over one shared component set. `/design-sync` runs the
**package shape against the real `dist/`** — no synth-entry hacks.

## Feels → Claude Design projects

One component library, one token set per feel, one Claude Design project per feel.

| Feel | Config | projectId | global | cssEntry |
|------|--------|-----------|--------|----------|
| Modern Neutral (default) | `.design-sync/config.json` | `bfeff1a8-30b8-472e-a5a0-bb772e979018` | `ModernNeutral` | `dist/themes/modern-neutral.css` |
| cobalt | `.design-sync/cobalt.json` | `ddc8cdc1-a922-4b59-a027-9c6bdce3db2f` | `Cobalt` | `dist/themes/cobalt.css` |
| spartan | `.design-sync/spartan.json` | `9717fc63-74e8-4290-b8e0-4e4b12ecf7cc` | `Spartan` | `dist/themes/spartan.css` |

Everything else (pkg, dtsPropsFor, componentSrcMap, overrides, previews) is shared
across feels — the configs differ only in projectId/global/cssEntry/readmeHeader.

## Re-sync flow (per feel)

1. `pnpm install` (fresh clone) — pnpm, frozen lockfile.
2. `pnpm build` — produces `dist/` incl. `dist/themes/*` (this is `cfg.buildCmd`).
3. Re-copy the staged scripts and run the driver per feel, pointing at the dist
   entry. First-ever sync of a feel omits `--remote`. Use a per-feel out dir and
   remote-cache so feels don't clobber each other:

```sh
# Modern Neutral
node .ds-sync/resync.mjs --config .design-sync/config.json \
  --node-modules ./node_modules --entry ./dist/index.mjs \
  --out ./ds-bundle --remote .design-sync/.cache/remote-modern-neutral.json
# cobalt
node .ds-sync/resync.mjs --config .design-sync/cobalt.json \
  --node-modules ./node_modules --entry ./dist/index.mjs \
  --out ./ds-bundle-cobalt --remote .design-sync/.cache/remote-cobalt.json
# spartan
node .ds-sync/resync.mjs --config .design-sync/spartan.json \
  --node-modules ./node_modules --entry ./dist/index.mjs \
  --out ./ds-bundle-spartan --remote .design-sync/.cache/remote-spartan.json
```

`--entry ./dist/index.mjs` makes the converter resolve the package from the repo
root and read `dist/*.d.ts`.

## Config notes (shared across feels)

- `pkg: "@kornorg/design-system"`, `buildCmd: "pnpm build"`, `srcDir: "src/components/ui"`.
- `dtsPropsFor` hand-writes props for the 10 components whose types don't flatten
  through extraction — the Radix `.Root` re-exports (Dialog/Select/Tabs/Tooltip/
  Checkbox/Switch/Label/Avatar) and the `ComponentProps<"div"|"table">` wrappers
  (Card/Table). Update these if those components' APIs change.
- `componentSrcMap` nulls the ~35 compound sub-parts so the pane shows 15 clean
  cards. They stay importable — `dist/index.mjs` exports all 53 symbols.
- Overrides: `Dialog`/`Tooltip` = `cardMode: single` + viewport; `Table` = `column`.
  Dialog viewport is 700px wide on purpose (below 640px its footer stacks).
- `guidelinesGlob` pinned to `docs/guides/**/*.md` so default `docs/*.md` doesn't
  sweep in the ADR index.

## Fonts (and a path gotcha)

Geist ships with the package: woff2 in `src/styles/fonts/`, `@font-face` in
`src/styles/fonts.css` using `url("./fonts/…")`. Because each theme builds to
`dist/themes/<feel>.css`, the build copies fonts to **`dist/themes/fonts/`** (next
to the theme CSS) so that `./fonts/…` resolves — NOT `dist/fonts/`. `dist/styles.css`
is a one-line `@import "./themes/modern-neutral.css"` so its font urls resolve too.
design-sync picks fonts up automatically via `cssEntry` (no `cfg.extraFonts`).

## Re-sync risks (watch list)

- **`dist/` is gitignored and regenerated** — always `pnpm build` before the
  converter. `cfg.buildCmd` handles it on a driver run.
- **Font path**: if you change where themes or fonts are emitted, keep the woff2
  adjacent to the theme CSS (the `@font-face` url is relative). Symptom of getting
  it wrong: the design-sync bundle has no `fonts/` and renders in a fallback font.
- **Grades cache is shared** across feels (`.design-sync/.cache/review/`); since the
  previews are identical and render good in every feel, a `good` grade is valid for
  all. Each project's uploaded `_ds_sync.json` is its own durable anchor.
- **Render-check browser on macOS**: `playwright install chromium` defaults to
  `~/Library/Caches/ms-playwright`, but the driver's render check looks in
  `~/.cache/ms-playwright`. Install (and run the driver) with
  `PLAYWRIGHT_BROWSERS_PATH=$HOME/.cache/ms-playwright` so chromium is found —
  otherwise validate reports `[RENDER_SKIPPED]`. The pinned playwright build must
  match the cached `chromium-<build>` dir (repo pin was 1.61.1 → build v1228).
- **`dtsPropsFor` can drift** from the real component APIs (hand-written).
- **All components ship `"use client"`** (prepended in `scripts/postbuild.mjs`).
- **Adding a feel**: copy `src/styles/themes/<feel>.css`, change token values,
  `pnpm build`; create a Claude Design project + `.design-sync/<feel>.json` (own
  projectId/global/cssEntry/readmeHeader); sync. **Adding a component**: add its
  `.tsx` and a barrel export, `pnpm build`, then re-sync each feel; a new Radix
  re-export needs a `dtsPropsFor` entry; new sub-parts go in `componentSrcMap` nulls.
