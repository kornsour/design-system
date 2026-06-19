# ADR-0011: Repurpose the repo as a distributable design-system package

- Status: Accepted
- Date: 2026-06-19

## Context

This repo began as a general-purpose Next.js app template. Its actual purpose
became a **design system**: a React + Tailwind component library reused across
applications and synced to Claude Design (claude.ai/design) via `/design-sync`.

The app-template scaffolding — a database layer (Drizzle + Neon), type-safe env
validation, and `next-safe-action` server actions — was never referenced by the
components or the sync, and misrepresented what the repo is.

Separately, the first `/design-sync` ran in "synth-entry" mode because the repo
shipped no build: it needed a fake package-root symlink, a separate `tsc`
declaration emit, and a Tailwind pre-compile step to feed the converter.

## Decision

1. **Remove the unused app scaffolding** — the DB layer, env validation, and
   server-action layers and their dependencies. This supersedes
   **ADR-0005** (Drizzle/Neon), **ADR-0006** (type-safe env), and **ADR-0007**
   (next-safe-action), which no longer apply.
2. **Build the repo as an installable package** with `tsup`:
   - `dist/index.mjs` + `dist/index.d.ts` — components, externalizing
     react/react-dom (peers) and radix-ui/lucide/cva/clsx/tailwind-merge.
     A `"use client"` directive is prepended post-build (esbuild strips it from
     a bundled banner) so the components work in Next.js Server Component trees.
   - `dist/tokens.mjs` + `.d.ts` — typed token values.
   - `dist/styles.css` (+ `dist/fonts/`) — Tailwind compiled from
     `src/styles/package.css`: token layer, the full semantic-token utility
     vocabulary (`@source inline`), and the Geist `@font-face` faces. Consumers
     import one stylesheet; no Tailwind setup required downstream.
   - `package.json` `exports`/`types`/`files` expose `.`, `./tokens`,
     `./styles.css`; `prepack` builds before publish.
3. **Point `/design-sync` at the real `dist/`** (`--entry ./dist/index.mjs`,
   `cssEntry: dist/styles.css`), which removes the synth-entry workarounds.

The Next.js app remains as the component **showcase/docs** surface (`pnpm dev`,
route `/design-system`) and the Tailwind authoring context — it is not the
product. Security headers (ADR-0009) still apply to that showcase.

## Consequences

- Apps consume the system via `pnpm add design-system` + one CSS import.
- `/design-sync` re-syncs are simpler: `pnpm build`, then the converter reads
  `dist/`. See `.design-sync/NOTES.md`.
- The package is `private: true`; flip it (and pick a scope) to publish to npm.
- All-client components: a consumer can't render these as Server Components — an
  accepted tradeoff for a UI kit. Revisit if server-only variants are needed.
