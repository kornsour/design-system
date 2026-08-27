// Resolves a theme's CSS custom properties into literal token values — real
// oklch colors, real pixel radii, real font-family strings — with no `var()`
// left in them. `var()` only resolves inside a DOM styling context; the
// published `tokens` export exists specifically for code that has no DOM to
// resolve against (chart libraries, canvas/SVG rendering, email templates),
// so those consumers need the resolved values, not the CSS variable names.
//
// Kept dependency-free and side-effect-free so both scripts/build-css.mjs
// (which appends its output to the built dist/tokens.mjs + dist/tokens.d.ts)
// and its unit test can call it directly against real theme CSS.

/** Keys of `src/tokens.ts`'s `colors` shape, as the `--kebab-case` custom
 *  property names they're read from. */
const COLOR_PROPS = [
	"background",
	"foreground",
	"card",
	"card-foreground",
	"popover",
	"popover-foreground",
	"muted",
	"muted-foreground",
	"primary",
	"primary-foreground",
	"secondary",
	"secondary-foreground",
	"accent",
	"accent-foreground",
	"destructive",
	"destructive-foreground",
	"success",
	"success-foreground",
	"warning",
	"warning-foreground",
	"border",
	"input",
	"ring",
];

function toCamelCase(kebab) {
	return kebab.replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase());
}

/** Extract the `--name: value;` custom properties declared in one
 *  `selector { ... }` block. Mirrors the block-matching approach in
 *  `src/__tests__/theme-parity.test.ts`: theme files never nest braces
 *  inside :root/.dark, so a non-greedy match up to the first `}` is safe. */
function propsInBlock(css, selector) {
	const blockMatch = css.match(new RegExp(`${selector}\\s*{([^}]*)}`));
	const block = blockMatch?.[1];
	if (block === undefined) {
		throw new Error(`No \`${selector} { ... }\` block found`);
	}
	const props = new Map();
	for (const match of block.matchAll(/--([a-zA-Z0-9-]+)\s*:\s*([^;]+);/g)) {
		props.set(match[1], match[2].trim().replace(/\s+/g, " "));
	}
	return props;
}

function mustGet(props, name) {
	const value = props.get(name);
	if (value === undefined) {
		throw new Error(`Missing \`--${name}\``);
	}
	return value;
}

function pickColors(props) {
	const out = {};
	for (const prop of COLOR_PROPS) {
		out[toCamelCase(prop)] = mustGet(props, prop);
	}
	return out;
}

function pickShadows(props) {
	return {
		xs: mustGet(props, "shadow-xs"),
		sm: mustGet(props, "shadow-sm"),
		md: mustGet(props, "shadow-md"),
		lg: mustGet(props, "shadow-lg"),
	};
}

/** Resolve the radius scale from `:root`'s `--radius` base plus the
 *  `calc(var(--radius) ± Npx)` offsets, assuming the standard 16px root font
 *  size (Tailwind's default, matching the rest of this repo's rem scale).
 *  There's no `.dark` override for radius today (see
 *  MODE_INDEPENDENT_PREFIXES in theme-parity.test.ts), so this reads only
 *  `:root`. */
function resolveRadii(rootProps) {
	const base = mustGet(rootProps, "radius");
	const remMatch = base.match(/^([\d.]+)rem$/);
	if (!remMatch) {
		throw new Error(`--radius is not a plain rem value: ${base}`);
	}
	const basePx = Number(remMatch[1]) * 16;

	const offset = (name) => {
		const value = mustGet(rootProps, name);
		const calcMatch = value.match(/^calc\(var\(--radius\)\s*([+-])\s*(\d+)px\)$/);
		if (!calcMatch) {
			throw new Error(`--${name} is not calc(var(--radius) ± Npx): ${value}`);
		}
		const sign = calcMatch[1] === "-" ? -1 : 1;
		return `${basePx + sign * Number(calcMatch[2])}px`;
	};

	const lg = mustGet(rootProps, "radius-lg");
	if (lg !== "var(--radius)") {
		throw new Error(`--radius-lg is not var(--radius): ${lg}`);
	}

	return {
		sm: offset("radius-sm"),
		md: offset("radius-md"),
		lg: `${basePx}px`,
		xl: offset("radius-xl"),
		full: "9999px",
	};
}

/** Font stacks with `var(--font-geist-*)` swapped for the literal face names
 *  they resolve to — no `.dark` override for these either. */
function resolveFontFamily(rootProps) {
	const sansVar = mustGet(rootProps, "font-geist-sans");
	const monoVar = mustGet(rootProps, "font-geist-mono");
	return {
		sans: sansVar,
		mono: monoVar,
	};
}

/**
 * Resolve one theme's CSS into fully literal token values:
 * `{ light: { colors, shadows }, dark: { colors, shadows }, radii, fontFamily }`.
 * Colors and shadows differ by mode; radii and font family don't, so those
 * are resolved once from `:root`.
 */
export function resolveThemeTokens(css) {
	const rootProps = propsInBlock(css, ":root");
	const darkProps = propsInBlock(css, "\\.dark");

	return {
		light: {
			colors: pickColors(rootProps),
			shadows: pickShadows(rootProps),
		},
		dark: {
			colors: pickColors(darkProps),
			shadows: pickShadows(darkProps),
		},
		radii: resolveRadii(rootProps),
		fontFamily: resolveFontFamily(rootProps),
	};
}
