// Pure color math for WCAG contrast checking of the design tokens, which are
// authored in oklch() (see src/styles/themes/*.css). No CSS engine is
// available outside a browser, so this reimplements just enough of the
// CSS Color 4 oklch → sRGB pipeline to score contrast — not a general
// color-conversion library.
//
// Shared by scripts/check-contrast.mjs (regenerates the recorded report) and
// src/__tests__/theme-contrast.test.ts (asserts the same numbers in CI), so
// the two can never drift against each other.

/** Parse `oklch(L C H)` or `oklch(L C H / A)` into { l, c, h, alpha }. Alpha defaults to 1. */
export function parseOklch(value) {
	const match = value
		.trim()
		.match(
			/^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+))?\s*\)$/,
		);
	if (!match) {
		throw new Error(`Not a plain oklch() value: "${value}"`);
	}
	const [, l, c, h, a] = match;
	return {
		l: Number(l),
		c: Number(c),
		h: Number(h),
		alpha: a === undefined ? 1 : Number(a),
	};
}

/**
 * oklch → linear sRGB, via OKLab. Returns { r, g, b } in linear light,
 * *not* clamped to [0, 1] — a token can be slightly out of gamut, and
 * clamping belongs to the caller (relativeLuminance clamps before use).
 * https://www.w3.org/TR/css-color-4/#color-conversion-code
 */
export function oklchToLinearSrgb({ l, c, h }) {
	const hRad = (h * Math.PI) / 180;
	const a = c * Math.cos(hRad);
	const b = c * Math.sin(hRad);

	const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
	const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
	const s_ = l - 0.0894841775 * a - 1.2914855480 * b;

	const l3 = l_ ** 3;
	const m3 = m_ ** 3;
	const s3 = s_ ** 3;

	return {
		r: +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3,
		g: -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3,
		b: -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3,
	};
}

const clamp01 = (v) => Math.min(1, Math.max(0, v));

/**
 * WCAG 2.x relative luminance (uses *linear* RGB directly — oklch → linear
 * sRGB already is the linearized value the WCAG formula asks for, so no
 * separate gamma step is needed here).
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
export function relativeLuminance(oklchValue) {
	const { r, g, b } = oklchToLinearSrgb(oklchValue);
	return 0.2126 * clamp01(r) + 0.7152 * clamp01(g) + 0.0722 * clamp01(b);
}

/** WCAG contrast ratio between two oklch() values, in the range [1, 21]. */
export function contrastRatio(oklchA, oklchB) {
	const lA = relativeLuminance(oklchA);
	const lB = relativeLuminance(oklchB);
	const lighter = Math.max(lA, lB);
	const darker = Math.min(lA, lB);
	return (lighter + 0.05) / (darker + 0.05);
}

/**
 * The foreground/background token pairs worth measuring: every place a
 * component renders text (or an icon carrying meaning) directly on a
 * token-colored surface. `minRatio` is the WCAG 2.1 threshold that applies —
 * 4.5 (AA, normal text) for body-text pairs, 3.0 (AA, large/bold text — these
 * tokens back button labels and badges, which are `font-medium` or larger at
 * minimum) for the UI-accent pairs where components consistently use bold or
 * ≥14pt text.
 */
export const TOKEN_PAIRS = [
	{ fg: "foreground", bg: "background", minRatio: 4.5 },
	{ fg: "card-foreground", bg: "card", minRatio: 4.5 },
	{ fg: "popover-foreground", bg: "popover", minRatio: 4.5 },
	{ fg: "muted-foreground", bg: "muted", minRatio: 4.5 },
	{ fg: "muted-foreground", bg: "background", minRatio: 4.5 },
	{ fg: "primary-foreground", bg: "primary", minRatio: 3.0 },
	{ fg: "secondary-foreground", bg: "secondary", minRatio: 4.5 },
	{ fg: "accent-foreground", bg: "accent", minRatio: 4.5 },
	{ fg: "destructive-foreground", bg: "destructive", minRatio: 3.0 },
	{ fg: "success-foreground", bg: "success", minRatio: 3.0 },
	{ fg: "warning-foreground", bg: "warning", minRatio: 3.0 },
];

/** Extract the `--token-name: oklch(...)` declarations from one `selector { ... }` block. */
export function tokensInBlock(css, selector) {
	const blockMatch = css.match(new RegExp(`${selector}\\s*{([^}]*)}`));
	const block = blockMatch?.[1];
	if (block === undefined) {
		throw new Error(`No \`${selector} { ... }\` block found`);
	}
	const tokens = new Map();
	for (const match of block.matchAll(/--([a-zA-Z0-9-]+)\s*:\s*(oklch\([^;]+\));/g)) {
		const [, name, value] = match;
		tokens.set(name, value.trim());
	}
	return tokens;
}

/**
 * Score every pair in TOKEN_PAIRS for one mode's token map (as returned by
 * tokensInBlock). Pairs whose tokens are absent from this theme are skipped
 * rather than thrown — theme-parity.test.ts already guards token presence.
 */
export function scoreThemeMode(tokens) {
	const results = [];
	for (const { fg, bg, minRatio } of TOKEN_PAIRS) {
		const fgValue = tokens.get(fg);
		const bgValue = tokens.get(bg);
		if (fgValue === undefined || bgValue === undefined) continue;
		const ratio = contrastRatio(parseOklch(fgValue), parseOklch(bgValue));
		results.push({ fg, bg, ratio, minRatio, pass: ratio >= minRatio });
	}
	return results;
}
