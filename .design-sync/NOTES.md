# design-sync notes — Modern Neutral

This repo is a **Next.js app**, not a published component library, so the sync
runs the package shape in **synth-entry mode** (no `dist/`). A few repo-specific
things make that work — keep them in mind on re-sync.

## Build setup (must exist before running the converter)

The converter resolves the package from `node_modules/<pkg>`, which npm/pnpm
won't self-install for the repo's own package. We fake a **clean, non-recursive
package root** so `PKG_DIR` points at real source without a self-referential
`node_modules` (a symlink-to-repo-root makes ts-morph loop forever through
`node_modules/typescript-template/node_modules/…`). Recreate it on a fresh clone:

```sh
mkdir -p node_modules/typescript-template
ln -sfn ../../src            node_modules/typescript-template/src
ln -sfn ../../tsconfig.json  node_modules/typescript-template/tsconfig.json
ln -sfn ../../package.json   node_modules/typescript-template/package.json
```

- **Real `.d.ts` come from a focused tsc emit** (synth mode alone gives empty
  `{ [key: string]: unknown }` contracts). Run before the converter:
  `npx tsc -p tsconfig.dts.json` → emits to `node_modules/typescript-template/dist-types/`,
  which the converter's `.d.ts` glob then reads. Radix `.Root` re-exports and the
  plain `div`/`table` wrappers still don't extract — their props are hand-written
  in `cfg.dtsPropsFor` (Avatar, Card, Table, Label, Checkbox, Switch, Dialog,
  Tooltip, Tabs, Select). Update those if those components' APIs change.
- **CSS must be pre-compiled** — `cfg.cssEntry` is copied verbatim, the converter
  does NOT run Tailwind, and `src/app/globals.css` is raw Tailwind v4 source. Build
  the shipped stylesheet into the package root (a real file, so it passes the
  cssEntry containment check):
  `npx @tailwindcss/cli@4 -i .design-sync/ds-theme.css -o node_modules/typescript-template/ds-compiled.css`
  `ds-theme.css` imports `globals.css` and force-generates the full semantic-token
  utility set via `@source inline(...)` so the design agent can use the whole
  `bg-primary / text-muted-foreground / border-input / …` vocabulary, not just the
  subset the components happened to use. It also defines `--font-geist-sans/mono`
  fallbacks (see below). This is design-sync-only; the app's own CSS is unaffected.

## Component scoping

- `cfg.srcDir` = `src/components/ui` so app/page exports don't get picked up.
- `cfg.componentSrcMap` nulls the ~35 compound sub-parts (CardHeader, DialogContent,
  …) so the DS pane shows 15 clean cards. They remain importable — the bundle
  exports all 53 symbols — and are composed inside their parent's preview.

## Overrides

- `Dialog` / `Tooltip`: `cardMode: single` + viewport (open overlays render in-card).
- `Table`: `cardMode: column` (full-width).
- Dialog viewport is 700px wide on purpose — below 640px the footer stacks
  (its `sm:` breakpoint), which looks wrong in a card.

## Known render warns

None outstanding. Final validate: 15/15 render clean, 119 tokens defined / 0
missing, bundle complete with no warnings.

## Re-sync risks (watch list)

- **`ds-compiled.css` and `dist-types/` live in `node_modules`** (gitignored) and
  are regenerated, not committed. A re-sync MUST re-run the tsc emit and the
  Tailwind compile (commands above) before `package-build.mjs`, or it falls back
  to empty contracts / unstyled CSS.
- **Brand font (Geist) IS shipped.** woff2 weights (Sans 400/500/600/700, Mono
  400/500) are vendored from the `geist` npm package into `.design-sync/fonts/`
  (committed), wired via `cfg.extraFonts` → `.design-sync/fonts/geist.css`. The
  converter copies them into the bundle's `fonts/` and `@import`s `fonts/fonts.css`
  from `styles.css`. `--font-geist-sans/mono` (in `ds-theme.css`) name "Geist" /
  "Geist Mono" first with a system fallback. If you add a new font weight to a
  component, vendor that woff2 and add an `@font-face` to `geist.css`.
- **Adding a component**: add its `.tsx` under `src/components/ui`, then re-run
  the tsc emit, the Tailwind compile, and the build. If it's a Radix re-export it
  will likely need a `cfg.dtsPropsFor` entry, and if it exports sub-parts add them
  to the `componentSrcMap` nulls.
