# Changelog

All notable changes to `@kornorg/design-system` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/kornsour/design-system/compare/v0.6.1...HEAD
[0.6.1]: https://github.com/kornsour/design-system/compare/v0.6.0...v0.6.1
[0.6.0]: https://github.com/kornsour/design-system/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/kornsour/design-system/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/kornsour/design-system/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/kornsour/design-system/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/kornsour/design-system/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/kornsour/design-system/releases/tag/v0.1.0
