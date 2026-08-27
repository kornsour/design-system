# Design System

A React + Tailwind CSS v4 component library, distributed as an installable
package and kept in sync with [Claude Design](https://claude.ai/design) via
`/design-sync`. Supports various themes.

**[View the live showcase →](https://kornsour.github.io/design-system/)** — every
component, all six feels, light and dark, from one page. No install required.

## Using it in an app

```bash
pnpm add @kornorg/design-system   # workspace / git / published dependency
```

```tsx
import { Button, Card, CardHeader, CardTitle } from "@kornorg/design-system";
import "@kornorg/design-system/themes/modern-neutral.css"; // pick a feel

export function Example() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Hello</CardTitle>
			</CardHeader>
		</Card>
	);
}
```

Each theme stylesheet is self-contained (component styles, the full semantic-token
utility vocabulary, and the Geist `@font-face` faces) — no Tailwind setup required
in the consuming app. Token values are also importable from
`@kornorg/design-system/tokens` — `light` and `dark` give resolved literal values
(real oklch colors, real pixel radii) for code that has no CSS to resolve a
`var(--x)` reference against: chart libraries, canvas/SVG rendering, email
templates.

### Components

| Component | Sub-parts | Needs a provider | Radix primitive |
|---|---|---|---|
| `Alert` | `AlertTitle`, `AlertDescription` | — | — |
| `Avatar` | `AvatarImage`, `AvatarFallback` | — | `Avatar` |
| `Badge` | — | — | — |
| `Button` | — | — | `Slot` (for `asChild`) |
| `Card` | `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` | — | — |
| `Checkbox` | — | — | `Checkbox` |
| `Dialog` | `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`, `DialogClose` | — | `Dialog` |
| `Input` | — | — | — |
| `Label` | — | — | `Label` |
| `Select` | `SelectGroup`, `SelectValue`, `SelectTrigger`, `SelectContent`, `SelectLabel`, `SelectItem` | — | `Select` |
| `Switch` | — | — | `Switch` |
| `Table` | `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, `TableCaption` | — | — |
| `Tabs` | `TabsList`, `TabsTrigger`, `TabsContent` | — | `Tabs` |
| `Textarea` | — | — | — |
| `Tooltip` | `TooltipTrigger`, `TooltipContent` | `TooltipProvider` (wrap once near the app root) | `Tooltip` |

`ThemeToggle` is also exported as a component — see [Dark mode](#dark-mode) below.
Where a "Radix primitive" is named, that's where the accessibility behavior
(focus management, keyboard nav, ARIA attributes) comes from; components with
no Radix primitive are plain styled HTML elements.

### Accessibility

Radix is a dependency here specifically for accessible primitives — focus
management, keyboard navigation, and ARIA wiring on every component listed
with one above. That's asserted in CI, not just assumed:

- **`@axe-core/playwright` scans the full showcase** (`/design-system`, every
  component, one page) in both light and dark on every PR
  (`.github/workflows/accessibility.yml`, `e2e/accessibility.spec.ts`) — ARIA
  roles/labels/state, Dialog focus trapping, keyboard operability, landmark
  structure.
- **Every theme's color tokens are checked for WCAG contrast**: all 6 feels ×
  light/dark × 11 foreground/background pairs, computed directly from the
  `oklch()` token values (`scripts/check-contrast.mjs`) and asserted in
  `pnpm test` (`src/__tests__/theme-contrast.test.ts`) so a token change that
  regresses contrast fails CI. The numbers are recorded in
  [`docs/accessibility/contrast.md`](./docs/accessibility/contrast.md) rather
  than left to be re-derived by hand.
- **Known gap**: the axe scan excludes its `color-contrast` rule. Several
  components render normal-weight text small enough (`Button` at 14px,
  `Badge` at 12px) that WCAG holds them to the 4.5:1 body-text threshold
  rather than the relaxed 3:1 for large/bold text, and white text on the more
  saturated `primary`/`success`/`destructive` fills falls short of that by a
  few tenths in places. Fixing it means darkening this library's brand colors
  across all 6 feels — a design call, not a code fix — so it's tracked
  instead of silently passed or silently disabled; see
  [ADR-0014](./docs/adr/0014-accessibility-verified-in-ci.md) for the
  reasoning and exactly what's covered by which check.

### Dark mode

Every theme ships both a `:root` (light) and a `.dark` token set, so switching
mode is just toggling the `dark` class on `<html>` — no per-theme wiring. The
package exports the pieces to do that for you:

- `<ThemeScript />` — a blocking inline script that applies the stored choice
  before first paint (otherwise a light flash precedes a dark page). Render it
  inside `<head>`, and add `suppressHydrationWarning` to `<html>` since the
  class it writes is not present in the server-rendered markup.
- `<ThemeToggle />` — an icon button that switches mode. Pass `withSystem` to
  cycle light → dark → system instead of a plain light/dark flip.
- `useTheme()` — `{ theme, resolvedTheme, setTheme, mounted }` for building a
  custom control.

```tsx
// app/layout.tsx
import { ThemeScript } from "@kornorg/design-system";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<ThemeScript />
			</head>
			<body>{children}</body>
		</html>
	);
}
```

Dependency-free by design; if your app already uses `next-themes`, prefer that
and use only the token layer from here (i.e. skip `class="dark"` manually).

### Feels (themes)

The same components ship in multiple "feels" — pick one by importing its stylesheet:

| Feel | Import | Look |
|------|--------|------|
| Modern Neutral | `@kornorg/design-system/themes/modern-neutral.css` | Zinc neutrals, indigo accent, 8px radius |
| Cobalt | `@kornorg/design-system/themes/cobalt.css` | Dark-first studio look, electric cobalt-blue accent, 6px radius |
| Spartan | `@kornorg/design-system/themes/spartan.css` | Zinc neutrals with a green accent (#18453B), 8px radius |
| GestPlate | `@kornorg/design-system/themes/gestplate.css` | Warm-stone neutrals, teal accent, amber warmth, 8px radius — for health/wellness |
| Sprout | `@kornorg/design-system/themes/sprout.css` | Warm cream ground, fresh spring-green primary, sunny sand accent, generous 16px radius — friendly and rounded |
| Warm | `@kornorg/design-system/themes/warm.css` | Cream and clay neutrals, toasted-amber primary, golden warning, 10px radius — a hearth-lit look |

`@kornorg/design-system/styles.css` re-exports Modern Neutral as the default. Some
feels also have their own Claude Design project (see `.design-sync/NOTES.md` for which).

## Developing

```bash
pnpm dev            # run the component showcase at /design-system
pnpm build          # build the package → dist/ (JS + .d.ts + styles.css + fonts)
pnpm check:fix      # Biome lint + format
pnpm test           # Vitest unit tests
pnpm e2e            # Playwright (local)
pnpm check:contrast # Regenerate docs/accessibility/contrast.md after a token change
```

- **Components** live in `src/components/ui/` (one file each), re-exported from
  `src/components/ui/index.ts`. Styling tokens are in `src/styles/themes/*.css`
  (one file per feel); `src/tokens.ts` types the values with no CSS backing
  (spacing, type scale, font weights) and `scripts/build-css.mjs` resolves the
  default theme's CSS to literal values for the rest.
- **The package build** (tsup + Tailwind CLI) emits `dist/` — see
  [ADR-0011](./docs/adr/0011-design-system-package.md).
- **Adding/changing components**: edit source, run `pnpm build`, then re-sync to
  Claude Design with `/design-sync` (it reads the built `dist/`). The sync inputs
  live in `.design-sync/`.

## Stack

| Tool | Purpose |
|------|---------|
| [React 19](https://react.dev) + [Radix UI](https://www.radix-ui.com) | Components |
| [Tailwind CSS v4](https://tailwindcss.com) | Token-driven styling |
| [tsup](https://tsup.egoist.dev) | Library build (ESM + `.d.ts`) |
| [Biome](https://biomejs.dev) | Linter + formatter |
| [Vitest](https://vitest.dev) / [Playwright](https://playwright.dev) | Tests |
| [Next.js](https://nextjs.org) | Component showcase / docs surface |

## Documentation

Released versions and what changed in each are in [`CHANGELOG.md`](./CHANGELOG.md).
Decisions live in [Architecture Decision Records](./docs/adr); operational
runbooks (e.g. [lockfile recovery](./docs/maintenance/pnpm-lockfile.md)) in
[`docs/maintenance/`](./docs/maintenance). Superseded and historical
documentation lives in [`docs/archive/`](./docs/archive) — its contents are
historical records only and must not be used to understand the current state
of the project or to inform new work.

> Uses pnpm pinned via `packageManager`. Run `corepack enable` once so your
> local pnpm matches the project ([ADR-0002](./docs/adr/0002-package-manager-pnpm-pinned.md)).
