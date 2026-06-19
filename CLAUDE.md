# CLAUDE.md

## Project Overview

This is a **design system** package built on Next.js (App Router) with Tailwind CSS v4, Biome, Vitest, Playwright, and Drizzle ORM connected to NeonDB (serverless Postgres). It exposes a token-driven React component library that is kept in sync with Claude Design (claude.ai/design) via the `/design-sync` skill, which reads the tokens and components directly from this repo.

## Design System

The design system is "Modern Neutral" — zinc neutrals with an indigo accent, 8px base radius, soft shadows, light + dark mode.

- **Tokens** live in two places that must stay in sync:
  - `src/app/globals.css` — semantic CSS custom properties (`--background`, `--primary`, `--radius`, shadows, …) for both light (`:root`) and dark (`.dark`) modes, exposed to Tailwind utilities (`bg-primary`, `text-muted-foreground`, `rounded-lg`, …) via the `@theme inline` block.
  - `src/tokens.ts` — the same values as a typed export, for code that needs token values directly (charts, canvas, email).
- **Components** live in `src/components/ui/`, one file per component, re-exported from `src/components/ui/index.ts`. Import via `@/components/ui`.
  - Variants use `class-variance-authority` (cva); class merging uses `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge).
  - Interactive components (Dialog, Select, Checkbox, Switch, Tabs, Tooltip, Label, Avatar) wrap **Radix UI** primitives (the unified `radix-ui` package) and carry `"use client"`. Icons are from `lucide-react`. Enter/exit animations come from `tw-animate-css`.
  - Components consume **semantic token utilities only** (`bg-primary`, `border-input`, …) — never hard-coded colors like `bg-indigo-600`. This is what lets the whole system re-skin by editing tokens.
- **Dark mode** is class-based: the `dark` variant is defined in `globals.css` and toggled by adding the `dark` class to `<html>` (see `src/components/theme-toggle.tsx`).
- **Showcase**: `/design-system` (`src/app/design-system/page.tsx`) renders every component for visual review.

### Conventions when adding a component
1. Create `src/components/ui/<name>.tsx`; use `cn()` and cva for variants; semantic tokens only.
2. Add `"use client"` if it uses Radix, state, or event handlers.
3. Export it from `src/components/ui/index.ts` and add an example to the showcase page.
4. Run `pnpm check:fix` and `SKIP_ENV_VALIDATION=1 pnpm build` before committing.

To push changes to Claude Design, run `/design-sync` in Claude Code.

## Decisions & Docs

The rationale for foundational choices (package manager, Node version, tooling, data layer, security headers, testing/CI shape) lives in Architecture Decision Records under `docs/adr/`. **Read the relevant ADR before changing foundational tooling**, and add a superseding ADR when you change a decision. Operational runbooks (e.g. lockfile recovery) are in `docs/maintenance/`.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Linting/Formatting**: Biome (replaces ESLint + Prettier)
- **Unit Testing**: Vitest
- **E2E Testing**: Playwright
- **ORM**: Drizzle ORM
- **Database**: NeonDB (serverless Postgres)
- **Env Validation**: @t3-oss/env-nextjs + Zod
- **Server Actions**: next-safe-action
- **Package Manager**: pnpm

## Project Structure

```
src/
├── app/              # Next.js App Router pages and layouts
├── db/               # Database schema and connection (Drizzle + Neon)
│   ├── index.ts      # DB client (uses type-safe env)
│   └── schema.ts     # Drizzle schema definitions
├── lib/              # Shared utilities and helpers
│   └── safe-action.ts # next-safe-action client
├── env.ts            # Type-safe environment variables (Zod validated)
└── __tests__/        # Unit test files
e2e/                  # Playwright E2E test files
drizzle/              # Generated migrations (do not edit manually)
```

## Common Commands

```bash
pnpm dev              # Start dev server (Turbopack)
pnpm build            # Production build
pnpm check            # Run Biome checks (lint + format)
pnpm check:fix        # Auto-fix Biome issues
pnpm test             # Run unit tests once (Vitest)
pnpm test:watch       # Run unit tests in watch mode
pnpm e2e              # Run E2E tests (Playwright)
pnpm e2e:ui           # Run E2E tests with UI
pnpm db:generate      # Generate migration from schema changes
pnpm db:migrate       # Run pending migrations
pnpm db:push          # Push schema directly (dev only)
pnpm db:studio        # Open Drizzle Studio
```

## Code Style

- Biome handles all linting and formatting — do NOT use ESLint or Prettier
- Indentation: tabs
- Line width: 100
- Quotes: double quotes
- Semicolons: always
- Run `pnpm check:fix` before committing

## Environment Variables

- Defined and validated in `src/env.ts` using `@t3-oss/env-nextjs` + Zod
- Add new server vars to the `server` object, client vars to `client` (must be prefixed `NEXT_PUBLIC_`)
- Always add new vars to both `src/env.ts` and `.env.example`
- Import `env` from `@/env` instead of using `process.env` directly
- Set `SKIP_ENV_VALIDATION=1` to bypass validation (CI builds without a DB, etc.)

## Database

- Schema is defined in `src/db/schema.ts` using Drizzle ORM
- Connection is configured in `src/db/index.ts` using `@neondatabase/serverless`
- Migrations are generated into `drizzle/` — never edit these manually
- Use `pnpm db:push` for rapid prototyping, `pnpm db:generate` + `pnpm db:migrate` for production

## Server Actions

- Use `next-safe-action` for type-safe, validated server actions
- Import `actionClient` from `@/lib/safe-action`
- Define actions with `.schema(zodSchema).action(async ({ parsedInput }) => { ... })`

## Testing

### Unit Tests (Vitest)
- Tests live alongside source code or in `src/__tests__/`
- Name test files `*.test.ts` or `*.test.tsx`
- Use `describe` / `it` / `expect` from Vitest
- Path alias `@/*` resolves to `src/*` in tests

### E2E Tests (Playwright)
- Tests live in `e2e/`
- Name test files `*.spec.ts`
- Playwright auto-starts the dev server for tests
- Only Chromium is configured by default
