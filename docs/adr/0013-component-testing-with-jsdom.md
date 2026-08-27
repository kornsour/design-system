# ADR-0013: Test components with jsdom + Testing Library

- Status: Accepted
- Date: 2026-08-27
- Supersedes: [ADR-0010](./0010-unit-testing-vitest.md)

## Context

ADR-0010 configured Vitest with `environment: "node"` and no React plugin,
because the repo was a Next.js app template with no component tests, and
component testing was called out as an opt-in a downstream project could add
if it needed one. ADR-0011 repurposed the same repo, the same day, into the
component library itself — 15 components in `src/components/ui/` whose entire
job is to render correctly. That pivot never revisited the testing decision:
`node` environment stuck around, so nothing here could actually render a
component to test it.

The result was a single placeholder suite (`expect(1 + 1).toBe(2)`) and no
safety net for the two failure modes that matter most for a component
library:

1. A component that throws, or a broken export/import, shipping in `dist/`.
2. A `cva` variant silently losing its class mapping.

There's also a system-wide promise — every theme ships both a `:root` and a
`.dark` token set (see CLAUDE.md's "Dark mode" section) — that nothing
verified. A theme could add a new semantic token to `:root` and forget `.dark`,
and it would only surface as a visual bug in whichever component happened to
use that token in dark mode.

## Decision

1. **Add a DOM environment**: `jsdom`, `@vitejs/plugin-react`, and
   `@testing-library/react` (+ `@testing-library/user-event` for interaction).
   `vitest.config.ts` now defaults to `environment: "jsdom"`; a file that
   doesn't need a DOM opts out per-file with `// @vitest-environment node`
   rather than the whole suite paying for jsdom by default.
2. **Smoke-render every component** (`src/components/ui/*.test.tsx`,
   colocated with its source) so a broken export, a bad import, or a component
   that throws on mount fails `pnpm test` — and therefore CI — immediately.
3. **Assert `cva` variant classes** for Button, Badge, and Alert, the
   components whose whole contract is "prop in, specific semantic class out."
4. **Add a theme-parity test** (`src/__tests__/theme-parity.test.ts`) that
   parses every `src/styles/themes/*.css`, and fails if any non-`radius`,
   non-`font-*` token defined in `:root` is missing from `.dark`. It needs no
   DOM, so it opts out of jsdom per-file and runs standalone.

## Consequences

- `pnpm test` now exercises React rendering, not just plain TypeScript, so the
  DOM environment and setup (`src/__tests__/setup.ts`: RTL's `afterEach`
  cleanup, a `matchMedia` polyfill jsdom doesn't provide) are fixed costs for
  every test run, not an opt-in per downstream project. That trade only makes
  sense because this repo's entire product is components — see ADR-0011.
- Coverage here is a first tier, not exhaustive: smoke renders plus variant
  classes for the three `cva`-heavy components. Radix internals (popover
  positioning, focus trap, pointer capture) are exercised by Playwright
  end-to-end instead (ADR-0008) — jsdom doesn't implement the browser APIs
  those depend on, so component tests here close a component either in its
  closed/default state or through a plain click, not a full open/interact
  cycle for every Radix-wrapped component.
- E2E coverage of the rendered showcase remains Playwright's job (ADR-0008);
  this tier catches render/import/variant regressions fast, in-process, on
  every PR.
