# Changelog

All notable changes to `@kornorg/design-system` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.8.0] - 2026-08-27

### Changed

- `@kornorg/design-system/tokens` now exports `light` and `dark` — resolved
  literal color and shadow values for the default theme's two modes — in
  place of the old mode-less `colors` and `shadows` exports, which held
  `var(--x)` references that only resolved inside a DOM styling context.
  `radii` and `fontFamily` are unchanged. These values are now generated at
  build time from the theme's CSS (`scripts/generate-tokens.mjs` +
  `scripts/build-css.mjs`) instead of hand-maintained in `src/tokens.ts`, so
  the exported tokens can no longer drift from what the CSS actually ships.
  `src/tokens.ts` itself now only types the values with no CSS backing
  (spacing, type scale, font weights).

## [0.7.1] - 2026-08-27

### Added

- Accessibility is now verified in CI instead of assumed ([ADR-0014](./docs/adr/0014-accessibility-verified-in-ci.md)): an `@axe-core/playwright` scan of the full `/design-system` showcase, in both light and dark, runs in a dedicated workflow (`.github/workflows/accessibility.yml`); a WCAG contrast check over every theme's foreground/background token pairs runs in `pnpm test` and is recorded in [`docs/accessibility/contrast.md`](./docs/accessibility/contrast.md) (regenerate after a token change with the new `pnpm check:contrast`).

### Fixed

- `Table`'s horizontally scrollable wrapper had no way to reach it by keyboard, failing WCAG 2.1.1 — added `tabIndex`, `role="region"`, and an `aria-label`.
- Nudged `muted-foreground` and dark-mode `destructive` a few hundredths of L across the `cobalt`, `gestplate`, `modern-neutral`, and `spartan` themes to close token pairs that fell just short of WCAG AA contrast.

## [0.6.1] - 2026-08-27

### Changed

- No changes to the published package. The version bump satisfied
  `version-guard.yml`, whose publishable-path check also matches the new
  component test files added in this range (`src/components/ui/*.test.tsx`) —
  tests are exempt in intent but not yet in the check's path pattern.

## [0.6.0] - 2026-08-15

### Added

- `warm` theme — cream and clay neutrals, toasted-amber primary, 10px radius.
- A light/dark mode switching API exported from the package: `ThemeToggle`,
  `ThemeScript`, and `useTheme`. Mode is orthogonal to feel, so one toggle
  works across all themes; `ThemeScript` applies the stored choice before
  first paint to avoid a light-mode flash on a dark page.

## [0.5.0] - 2026-07-19

### Added

- `sprout` theme — warm cream ground, spring-green primary, sunny sand accent,
  16px radius.

## [0.4.0] - 2026-07-12

### Added

- `gestplate` theme — warm-stone neutrals, teal accent, amber warmth, 8px
  radius.

## [0.3.0] - 2026-07-07

### Added

- `spartan` theme — zinc neutrals with a green accent, 8px radius.

## [0.2.0] - 2026-06-22

### Changed

- Renamed the `soundkata` theme to `cobalt`.

## [0.1.0] - 2026-06-19

### Added

- Initial release of `@kornorg/design-system`: components, design tokens, and
  bundled Geist fonts, distributed as an installable package with multi-theme
  support and an initial theme (later renamed `cobalt` in 0.2.0).

[Unreleased]: https://github.com/kornsour/design-system/compare/v0.8.0...HEAD
[0.8.0]: https://github.com/kornsour/design-system/compare/v0.7.1...v0.8.0
[0.7.1]: https://github.com/kornsour/design-system/compare/v0.7.0...v0.7.1
[0.6.1]: https://github.com/kornsour/design-system/compare/v0.6.0...v0.6.1
[0.6.0]: https://github.com/kornsour/design-system/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/kornsour/design-system/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/kornsour/design-system/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/kornsour/design-system/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/kornsour/design-system/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/kornsour/design-system/releases/tag/v0.1.0
