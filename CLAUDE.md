# CLAUDE.md

## Project Overview

This is a **design system** — a React + Tailwind CSS v4 component library,
distributed as an installable package (`design-system`) and kept in sync with
Claude Design (claude.ai/design) via the `/design-sync` skill. A Next.js app is
included only as the component **showcase / docs surface**; it is not the
product. There is no database, server-action, or env layer (see ADR-0011).

## Design System

"Modern Neutral" — zinc neutrals with an indigo accent, 8px base radius, soft
shadows, light + dark mode.

- **Components are theme-agnostic** — they use only semantic token utilities (`bg-primary`, `border-input`, …), never hard-coded colors. A new "feel" is a new token set, NOT new components.
- **Tokens** are organized for multiple feels:
  - `src/styles/base.css` — feel-agnostic: Tailwind import, `@theme inline` token→utility mappings, `@source inline` utility vocabulary, base styles. Defines NO token values.
  - `src/styles/themes/<feel>.css` — one per feel; `@import`s base + fonts and supplies the `:root`/`.dark` token values (colors, radius, shadows, fonts). Today: `modern-neutral.css`, `cobalt.css`.
  - `src/tokens.ts` — the Modern Neutral values as a typed export, for code that needs token values directly (charts, canvas, email).
- **Components** live in `src/components/ui/`, one file per component, re-exported from `src/components/ui/index.ts`. Within the repo, import via `@/components/ui`; consumers import from `design-system`.
  - Variants use `class-variance-authority` (cva); class merging uses `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge).
  - Interactive components (Dialog, Select, Checkbox, Switch, Tabs, Tooltip, Label, Avatar) wrap **Radix UI** primitives (the unified `radix-ui` package) and carry `"use client"`. Icons are from `lucide-react`. Enter/exit animations from `tw-animate-css`.
  - Components consume **semantic token utilities only** (`bg-primary`, `border-input`, …) — never hard-coded colors like `bg-indigo-600`. This is what lets the whole system re-skin by editing tokens.
- **Dark mode** is class-based: the `dark` variant is defined in `globals.css` and toggled by adding the `dark` class to a root element (see `src/components/theme-toggle.tsx`).
- **Showcase**: `/design-system` (`src/app/design-system/page.tsx`) renders every component for visual review (`pnpm dev`). It uses the default theme via `src/app/globals.css` (which just `@import`s `themes/modern-neutral.css` — swap that import to preview another feel).

### Multiple feels (themes)
One component library, several token sets. Each feel:
- has a stylesheet `src/styles/themes/<feel>.css` → built to `dist/themes/<feel>.css` (self-contained: utilities + tokens + fonts) and exported as `@kornorg/design-system/themes/<feel>.css`;
- has its own **Claude Design project** and a `.design-sync/<feel>.json` config (own `projectId`, `globalName`, `cssEntry`, conventions header). `config.json` is Modern Neutral (the default); `soundkata.json` is the soundkata site's project, which uses the `cobalt` theme. (Theme names describe a look and are reusable; a project/site picks one.)

To add a feel: copy a theme file, change the token values, `pnpm build` (it's picked up automatically), then create a Claude Design project + a `.design-sync/<feel>.json` and sync. See `.design-sync/NOTES.md`.

### Conventions when adding a component
1. Create `src/components/ui/<name>.tsx`; use `cn()` and cva for variants; semantic tokens only.
2. Add `"use client"` if it uses Radix, state, or event handlers.
3. Export it from `src/components/ui/index.ts` and add an example to the showcase page.
4. Run `pnpm check:fix`, then `pnpm build` (package) and `pnpm build:showcase` to verify.
5. To push to Claude Design, run `/design-sync` (it reads the built `dist/`; sync inputs live in `.design-sync/`).

## Package build & distribution

`pnpm build` produces the installable package in `dist/` via **tsup** + the
Tailwind CLI (config: `tsup.config.ts`, `tsconfig.build.json`, `src/styles/package.css`, `scripts/postbuild.mjs`):

- `dist/index.mjs` + `dist/index.d.ts` — components. react/react-dom are peers; radix-ui/lucide/cva/clsx/tailwind-merge are externalized. `"use client"` is prepended post-build (esbuild strips a bundled banner).
- `dist/tokens.mjs` + `.d.ts` — typed tokens.
- `dist/themes/<feel>.css` (+ `dist/themes/fonts/`) — one Tailwind-compiled stylesheet per feel: utilities + that feel's tokens + Geist `@font-face`. Self-contained; consumers need no Tailwind setup. `dist/styles.css` re-exports the default feel. Built by `scripts/build-css.mjs` (auto-discovers `src/styles/themes/*`).

`package.json` `exports` expose `.`, `./tokens`, `./styles.css`, and `./themes/*`
(wildcard — new themes need no exports change). Published as `@kornorg/design-system`
(`prepack` builds `dist/`, which is gitignored).

## Decisions & Docs

Rationale for foundational choices lives in ADRs under `docs/adr/`. **Read the
relevant ADR before changing foundational tooling**, and add a superseding ADR
when you change a decision. ADR-0011 records the pivot to a package (and
supersedes 0005/0006/0007). Runbooks are in `docs/maintenance/`.

## Tech Stack

- **Components**: React 19 + Radix UI (`radix-ui`), `lucide-react`, cva
- **Styling**: Tailwind CSS v4 (token-driven), `tw-animate-css`, Geist fonts
- **Package build**: tsup (ESM + `.d.ts`) + `@tailwindcss/cli`
- **Showcase**: Next.js 16 (App Router, Turbopack)
- **Lint/Format**: Biome  ·  **Unit**: Vitest  ·  **E2E**: Playwright
- **Package Manager**: pnpm

## Project Structure

```
src/
├── app/                 # Next.js showcase app (layout, /design-system page)
│   └── globals.css      # showcase stylesheet — just @imports the default theme
├── components/
│   ├── ui/              # the component library (one file each) + index.ts barrel
│   └── theme-toggle.tsx # showcase-only dark-mode toggle
├── styles/
│   ├── base.css         # feel-agnostic: @theme mappings + @source inline + base styles
│   ├── fonts.css        # Geist @font-face
│   ├── fonts/           # vendored Geist woff2
│   └── themes/          # one token set per feel (modern-neutral.css, cobalt.css)
├── lib/utils.ts         # cn()
├── tokens.ts            # typed token values (Modern Neutral)
└── __tests__/           # unit tests
scripts/
├── postbuild.mjs        # rename .d.mts→.d.ts, prepend "use client"
└── build-css.mjs        # compile every theme → dist/themes/<feel>.css
.design-sync/            # /design-sync inputs: config.json (modern-neutral),
                         #   soundkata.json, previews/, conventions*.md, NOTES
dist/                    # build output (gitignored): index.mjs/.d.ts, tokens, themes/
e2e/                     # Playwright tests
```

## Common Commands

```bash
pnpm dev              # Showcase dev server (Turbopack)
pnpm build            # Build the package → dist/ (tsup + CSS + fonts)
pnpm build:showcase   # Production build of the Next showcase app
pnpm check            # Biome checks (lint + format)
pnpm check:fix        # Auto-fix Biome issues
pnpm test             # Unit tests (Vitest)
pnpm e2e              # E2E tests (Playwright)
```

## Code Style

- Biome handles all linting and formatting — do NOT use ESLint or Prettier
- Indentation: tabs · Line width: 100 · Quotes: double · Semicolons: always
- Run `pnpm check:fix` before committing

## Testing

### Unit Tests (Vitest)
- Tests live alongside source code or in `src/__tests__/`; name `*.test.ts(x)`
- Use `describe` / `it` / `expect` from Vitest; `@/*` resolves to `src/*`

### E2E Tests (Playwright)
- Tests live in `e2e/`; name `*.spec.ts`
- Playwright auto-starts the dev server; only Chromium is configured by default
