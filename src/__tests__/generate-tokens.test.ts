// @vitest-environment node
//
// Pure text parsing — no DOM needed, so this opts out of the jsdom default
// (see vitest.config.ts). Exercises scripts/generate-tokens.mjs against the
// real modern-neutral theme, which is what dist/tokens.mjs is built from
// (see scripts/build-css.mjs). This is the regression test for the "done
// when" in issue #54: `tokens` must be usable for canvas/SVG/email, which
// means no `var(...)` reference should survive resolution.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import * as generateTokens from "../../scripts/generate-tokens.mjs";

/** Mirrors the shape scripts/generate-tokens.mjs resolves — it's a plain JS
 *  build-time script (not published, so no hand-maintained .d.ts) and its
 *  object-building loops don't give `tsc --checkJs` enough to infer literal
 *  keys, so this test types the boundary explicitly instead of trusting
 *  inference. Keep in sync with COLOR_PROPS / pickShadows / resolveRadii /
 *  resolveFontFamily in generate-tokens.mjs. */
interface ColorTokens {
	background: string;
	foreground: string;
	card: string;
	cardForeground: string;
	popover: string;
	popoverForeground: string;
	muted: string;
	mutedForeground: string;
	primary: string;
	primaryForeground: string;
	secondary: string;
	secondaryForeground: string;
	accent: string;
	accentForeground: string;
	destructive: string;
	destructiveForeground: string;
	success: string;
	successForeground: string;
	warning: string;
	warningForeground: string;
	border: string;
	input: string;
	ring: string;
	overlay: string;
}
interface ShadowTokens {
	xs: string;
	sm: string;
	md: string;
	lg: string;
}
interface ModeTokens {
	colors: ColorTokens;
	shadows: ShadowTokens;
}
interface ResolvedThemeTokens {
	light: ModeTokens;
	dark: ModeTokens;
	radii: { sm: string; md: string; lg: string; xl: string; full: string };
	fontFamily: { sans: string; mono: string };
}
const resolveThemeTokens = generateTokens.resolveThemeTokens as unknown as (
	css: string,
) => ResolvedThemeTokens;

const css = readFileSync(join(__dirname, "../styles/themes/modern-neutral.css"), "utf-8");
const resolved = resolveThemeTokens(css);

function assertNoVarReference(value: string, label: string) {
	expect(value, `${label} should be a resolved value, not a var() reference`).not.toContain("var(");
}

describe("resolveThemeTokens", () => {
	it("resolves light and dark colors to literal oklch values", () => {
		for (const mode of ["light", "dark"] as const) {
			for (const [key, value] of Object.entries(resolved[mode].colors)) {
				assertNoVarReference(value as string, `${mode}.colors.${key}`);
				expect(value, `${mode}.colors.${key}`).toMatch(/^oklch\(/);
			}
		}
	});

	it("gives light and dark different values for mode-dependent colors", () => {
		expect(resolved.light.colors.primary).not.toBe(resolved.dark.colors.primary);
		expect(resolved.light.colors.background).not.toBe(resolved.dark.colors.background);
	});

	it("resolves light and dark shadows to literal values", () => {
		for (const mode of ["light", "dark"] as const) {
			for (const [key, value] of Object.entries(resolved[mode].shadows)) {
				assertNoVarReference(value as string, `${mode}.shadows.${key}`);
			}
		}
	});

	it("resolves radii to literal pixel values matching the documented scale", () => {
		expect(resolved.radii).toEqual({
			sm: "4px",
			md: "6px",
			lg: "8px",
			xl: "12px",
			full: "9999px",
		});
	});

	it("resolves font families to literal face names", () => {
		assertNoVarReference(resolved.fontFamily.sans, "fontFamily.sans");
		assertNoVarReference(resolved.fontFamily.mono, "fontFamily.mono");
		expect(resolved.fontFamily.sans).toContain("Geist");
		expect(resolved.fontFamily.mono).toContain("Geist Mono");
	});

	it("throws on a theme missing an expected token", () => {
		expect(() => resolveThemeTokens(":root { --background: oklch(1 0 0); }")).toThrow();
	});
});
