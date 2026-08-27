/**
 * Design tokens — typed source of truth for the values that have no CSS
 * backing (spacing scale, type scale, font weights).
 *
 * Color, radius, and font-family values live in a theme's CSS custom
 * properties (`src/styles/themes/<feel>.css`) instead — components consume
 * those through Tailwind utility classes (e.g. `bg-primary`), which is the
 * only place a `var(--x)` reference resolves. The published `tokens` export
 * needs to work without a DOM (chart libraries, canvas/SVG rendering, email
 * templates), so `scripts/build-css.mjs` resolves the default theme's CSS to
 * literal values at build time and appends them to this file's build output
 * as `light` / `dark` (see `scripts/generate-tokens.mjs`), plus `radii` and
 * `fontFamily`. Import them from `@kornorg/design-system/tokens` alongside
 * the tokens defined here — this source file only has the pieces below.
 */

/**
 * Spacing scale (rem). Matches Tailwind's default 4px step so utility classes
 * (`p-4`, `gap-2`, …) and token references stay aligned.
 */
export const spacing = {
	0: "0rem",
	0.5: "0.125rem", // 2px
	1: "0.25rem", // 4px
	2: "0.5rem", // 8px
	3: "0.75rem", // 12px
	4: "1rem", // 16px
	5: "1.25rem", // 20px
	6: "1.5rem", // 24px
	8: "2rem", // 32px
	10: "2.5rem", // 40px
	12: "3rem", // 48px
	16: "4rem", // 64px
} as const;

/** Typography scale: [font-size, line-height]. */
export const fontSize = {
	xs: ["0.75rem", "1rem"],
	sm: ["0.875rem", "1.25rem"],
	base: ["1rem", "1.5rem"],
	lg: ["1.125rem", "1.75rem"],
	xl: ["1.25rem", "1.75rem"],
	"2xl": ["1.5rem", "2rem"],
	"3xl": ["1.875rem", "2.25rem"],
	"4xl": ["2.25rem", "2.5rem"],
	"5xl": ["3rem", "1"],
} as const;

export const fontWeight = {
	normal: "400",
	medium: "500",
	semibold: "600",
	bold: "700",
} as const;
