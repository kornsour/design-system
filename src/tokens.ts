/**
 * Design tokens — typed source of truth.
 *
 * These mirror the CSS custom properties declared in `src/app/globals.css`.
 * Components consume tokens through Tailwind utility classes (e.g. `bg-primary`);
 * this file is for code that needs token values directly — chart libraries,
 * canvas/SVG rendering, email templates, or programmatic theming.
 *
 * Keep this in sync with globals.css when values change.
 */

/** Semantic color tokens. Values are the light-mode references; the dark
 *  variant is applied at runtime via the `.dark` class in globals.css. */
export const colors = {
	background: "var(--background)",
	foreground: "var(--foreground)",
	card: "var(--card)",
	cardForeground: "var(--card-foreground)",
	popover: "var(--popover)",
	popoverForeground: "var(--popover-foreground)",
	muted: "var(--muted)",
	mutedForeground: "var(--muted-foreground)",
	primary: "var(--primary)",
	primaryForeground: "var(--primary-foreground)",
	secondary: "var(--secondary)",
	secondaryForeground: "var(--secondary-foreground)",
	accent: "var(--accent)",
	accentForeground: "var(--accent-foreground)",
	destructive: "var(--destructive)",
	destructiveForeground: "var(--destructive-foreground)",
	success: "var(--success)",
	successForeground: "var(--success-foreground)",
	warning: "var(--warning)",
	warningForeground: "var(--warning-foreground)",
	border: "var(--border)",
	input: "var(--input)",
	ring: "var(--ring)",
} as const;

/**
 * "Spartan" theme palette — Michigan State green, anchored on the official
 * #18453B at the 700 shade. Activated in the DOM via the `theme-spartan` class
 * (see globals.css), which remaps the semantic `--primary`/`--ring` tokens.
 * These raw values are for code that can't read CSS variables (charts, canvas,
 * email). The semantic `colors` export above already resolves to the active
 * theme, so prefer it for anything rendered in the DOM.
 */
export const spartan = {
	50: "#eef6f2",
	100: "#d6ebe3",
	200: "#aed7c9",
	300: "#78bca5",
	400: "#4aa084",
	500: "#2f8067",
	600: "#1a5c49",
	700: "#18453b",
	800: "#143a32",
	900: "#0f2e28",
	950: "#081b17",
} as const;

/** Border-radius scale. Base radius is 0.5rem (8px). */
export const radii = {
	sm: "var(--radius-sm)", // 4px
	md: "var(--radius-md)", // 6px
	lg: "var(--radius-lg)", // 8px
	xl: "var(--radius-xl)", // 12px
	full: "9999px",
} as const;

/** Soft elevation shadow scale. */
export const shadows = {
	xs: "var(--shadow-xs)",
	sm: "var(--shadow-sm)",
	md: "var(--shadow-md)",
	lg: "var(--shadow-lg)",
} as const;

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

export const fontFamily = {
	sans: "var(--font-geist-sans), system-ui, sans-serif",
	mono: "var(--font-geist-mono), ui-monospace, monospace",
} as const;

export const tokens = {
	colors,
	spartan,
	radii,
	shadows,
	spacing,
	fontSize,
	fontWeight,
	fontFamily,
} as const;

export type Tokens = typeof tokens;
