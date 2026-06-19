# design-sync notes — Modern Neutral

This repo builds an installable package (`design-system`, ADR-0011). `/design-sync`
runs the **package shape against the real `dist/`** — no synth-entry hacks.

## Re-sync flow (one path)

1. `pnpm install` (fresh clone) — pnpm, frozen lockfile.
2. `pnpm build` — produces `dist/` (this is `cfg.buildCmd`; the converter reads it).
3. Re-copy the staged scripts and run the driver pointing at the dist entry.
   First-ever sync omits `--remote`. `--entry ./dist/index.mjs` makes the
   converter resolve the package from the repo root and read `dist/*.d.ts`:

```sh
node .ds-sync/resync.mjs --config .design-sync/config.json \
  --node-modules ./node_modules --entry ./dist/index.mjs \
  --out ./ds-bundle --remote .design-sync/.cache/remote-sync.json
```

## Config notes (`.design-sync/config.json`)

- `pkg: "design-system"`, `globalName: "ModernNeutral"`, `cssEntry: "dist/styles.css"`,
  `buildCmd: "pnpm build"`.
- `dtsPropsFor` hand-writes props for the 10 components whose types don't flatten
  through extraction — the Radix `.Root` re-exports (Dialog/Select/Tabs/Tooltip/
  Checkbox/Switch/Label/Avatar) and the `ComponentProps<"div"|"table">` wrappers
  (Card/Table). Update these if those components' APIs change.
- `componentSrcMap` nulls the ~35 compound sub-parts (CardHeader, DialogContent, …)
  so the pane shows 15 clean cards. They stay importable — `dist/index.mjs` exports
  all 53 symbols — and are composed inside their parent's preview.
- Overrides: `Dialog`/`Tooltip` = `cardMode: single` + viewport (open overlays);
  `Table` = `cardMode: column`. Dialog viewport is 700px wide on purpose (below
  640px its footer stacks).
- `guidelinesGlob` is pinned to `docs/guides/**/*.md` so the default `docs/*.md`
  doesn't sweep in the ADR index.

## Fonts

Geist ships **with the package**: woff2 in `src/styles/fonts/`, `@font-face` in
`src/styles/fonts.css`, both pulled into `dist/styles.css` by the build. design-sync
gets them automatically via `cssEntry` (the converter copies the `@font-face`
`url()` targets into the bundle's `fonts/`). No `cfg.extraFonts` needed.

## Known render warns

None outstanding. Last validate: 15/15 render clean, 119 tokens defined / 0 missing,
bundle complete, no warnings.

## Re-sync risks (watch list)

- **`dist/` is gitignored and regenerated** — always `pnpm build` before the
  converter, or it reads a stale/missing entry. `cfg.buildCmd` handles this on a
  driver run.
- **`dtsPropsFor` can drift** from the real component APIs (it's hand-written).
  If you change a Radix-wrapped component's props, update its entry.
- **All components ship `"use client"`** (prepended in `scripts/postbuild.mjs`).
  If a future tsup upgrade preserves per-file directives, revisit.
- **Adding a component**: add `.tsx` + export from the barrel, `pnpm build`, then
  re-sync. New Radix re-export → likely needs a `dtsPropsFor` entry; new sub-parts
  → add to `componentSrcMap` nulls; new font weight → vendor the woff2 + add an
  `@font-face` to `src/styles/fonts.css`.
