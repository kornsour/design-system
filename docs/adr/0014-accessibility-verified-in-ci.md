# ADR-0014: Verify accessibility in CI instead of assuming it

- Status: Accepted
- Date: 2026-08-27

## Context

This library depends on Radix UI specifically for accessible primitives, and
components consistently carry accessibility affordances — `focus-visible`
rings, `role="alert"` on Alert, an `sr-only` label on the Dialog close,
`aria-hidden` icons on ThemeToggle. None of that was verified anywhere:
`README.md` said nothing about accessibility, and there was no `axe-core`,
`@axe-core/playwright`, or `jest-axe` in the repo. The value Radix is meant to
provide was assumed, not checked.

One concrete bug fell out of that gap immediately: `Table`'s horizontally
scrollable wrapper (`src/components/ui/table.tsx`) had no `tabIndex` and no
accessible name, failing WCAG 2.1.1 — axe's `scrollable-region-focusable`
rule. Fixed directly (`tabIndex={0}`, `role="region"`, `aria-label`).

## Decision

Two independent, complementary checks, because they catch different classes
of problem:

1. **`@axe-core/playwright` against the rendered showcase** (`e2e/accessibility.spec.ts`),
   in both light and dark — the two modes every theme ships (README's "Dark
   mode"). This is what actually verifies the Radix value: every ARIA
   role/label/state a primitive wires up, Dialog focus handling, keyboard
   operability, landmark structure. It runs in a dedicated GitHub Actions
   workflow (`.github/workflows/accessibility.yml`) rather than joining the
   general E2E suite — ADR-0008 keeps the broad Playwright suite out of CI
   deliberately (browser download + dev-server boot cost, flake surface for a
   suite that was minimal at the time); this is the narrowly-scoped exception
   ADR-0008's own "Consequences" section anticipated ("a project that grows a
   meaningful E2E suite can add a dedicated ... workflow"). One spec file, one
   job, not the whole suite.

   The scan excludes axe's `color-contrast` rule — see #2 below for why, and
   README's Accessibility section for the known gap that leaves open.

2. **A scripted WCAG contrast check over every theme's tokens**
   (`scripts/lib/color-contrast.mjs` implements the oklch → sRGB → relative
   luminance → contrast-ratio pipeline; `scripts/check-contrast.mjs` runs it
   over all 6 themes × 2 modes × 11 foreground/background token pairs and
   (re)generates `docs/accessibility/contrast.md`; `src/__tests__/theme-contrast.test.ts`
   asserts the same numbers so `pnpm test` — and therefore CI — fails on a
   regression). This measures the *token* pairing directly, independent of
   which demo text a showcase page happens to render it as. Fixing the seven
   pairs it originally found short (a handful of hundredths in L on `muted-foreground`
   and dark-mode `destructive` across four themes) closed them all without a
   perceptible visual change — see the theme CSS diffs in this PR.

   This is deliberately *not* the same check as axe's `color-contrast` rule:
   axe measures contrast on actual rendered text at its actual size/weight,
   and several components (`Button` at `text-sm`/14px, `Badge` at
   `text-xs`/12px) render normal-weight text too small to qualify for WCAG's
   relaxed "large text" 3:1 threshold — so axe holds them to 4.5:1, and some
   of those combinations (white text on saturated `primary`/`success`/
   `destructive` fills) fall short by a few tenths. Closing that would mean
   perceptibly darkening this library's brand colors across all 6 themes —
   three of which are live Claude Design projects (`.design-sync/NOTES.md`) —
   which is a design decision this ADR doesn't make unilaterally. Tracked as a
   known gap (README's Accessibility section), not hidden: `color-contrast` is
   excluded from the axe scan with a comment pointing here, rather than left
   in and silently ignored or the whole scan disabled.

3. **State the posture in README.** A "Accessibility" section now says what's
   verified (Radix-driven ARIA/keyboard/focus behavior, via axe, in CI; the
   token contrast numbers, recorded and re-checked) and what isn't yet (some
   small/normal-weight component text against saturated fills falls short of
   AA's 4.5:1 in axe's stricter per-element measurement).

## Consequences

- CI now fails on a real accessibility regression in either dimension —
  broken ARIA/keyboard/focus behavior (axe, dedicated workflow) or a token
  pairing losing contrast (theme-contrast.test.ts, general `pnpm test`) —
  instead of a maintainer having to remember to check by hand.
- The `color-contrast` gap is real and stays open until someone makes the
  brand-color call across 6 themes; this ADR does not close it, only makes it
  visible instead of assumed-away.
- Adding a 7th theme or a new semantic token pair needs no script change for
  the token-contrast check (it derives pairs from `TOKEN_PAIRS` in
  `scripts/lib/color-contrast.mjs`, generalized over whatever `:root`/`.dark`
  blocks exist) — but does need `TOKEN_PAIRS` updated if the new token is a
  foreground/background pair worth measuring.
