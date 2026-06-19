# Modern Neutral — Design System

A React + Tailwind CSS v4 component library, distributed as an installable
package and kept in sync with [Claude Design](https://claude.ai/design) via
`/design-sync`. Neutral zinc surfaces, an indigo brand accent, an 8px base
radius, soft shadows, full light + dark mode.

## Using it in an app

```bash
pnpm add design-system   # workspace / git / published dependency
```

```tsx
import { Button, Card, CardHeader, CardTitle } from "design-system";
import "design-system/styles.css"; // tokens + utilities + Geist fonts

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

`styles.css` is self-contained (component styles, the full semantic-token utility
vocabulary, and the Geist `@font-face` faces) — no Tailwind setup required in the
consuming app. Dark mode: add `class="dark"` to a root element. Token values are
also importable from `design-system/tokens`.

## Developing

```bash
pnpm dev            # run the component showcase at /design-system
pnpm build          # build the package → dist/ (JS + .d.ts + styles.css + fonts)
pnpm check:fix      # Biome lint + format
pnpm test           # Vitest unit tests
pnpm e2e            # Playwright (local)
```

- **Components** live in `src/components/ui/` (one file each), re-exported from
  `src/components/ui/index.ts`. Styling tokens are in `src/app/globals.css`
  (mirrored as typed values in `src/tokens.ts`).
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

Decisions live in [Architecture Decision Records](./docs/adr); operational
runbooks (e.g. [lockfile recovery](./docs/maintenance/pnpm-lockfile.md)) in
[`docs/maintenance/`](./docs/maintenance).

> Uses pnpm pinned via `packageManager`. Run `corepack enable` once so your
> local pnpm matches the project ([ADR-0002](./docs/adr/0002-package-manager-pnpm-pinned.md)).
