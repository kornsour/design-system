// @vitest-environment node
//
// Pure text parsing — no DOM needed, so this opts out of the jsdom default
// (see vitest.config.ts) and stays cheap even as the DOM suite grows.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const THEMES_DIR = join(__dirname, "../styles/themes");

/** Token names that legitimately differ — or are absent — between :root and .dark. */
const MODE_INDEPENDENT_PREFIXES = ["radius", "font-"];

function isModeIndependent(token: string): boolean {
	return MODE_INDEPENDENT_PREFIXES.some((prefix) => token.startsWith(prefix));
}

/** Extract the `--token-name` declarations from a single `selector { ... }` block. */
function tokensInBlock(css: string, selector: string): Set<string> {
	// Theme files never nest braces inside :root/.dark (no media queries, no
	// calc() with braces), so a non-greedy match up to the first `}` is safe.
	const blockMatch = css.match(new RegExp(`${selector}\\s*{([^}]*)}`));
	const block = blockMatch?.[1];
	if (block === undefined) {
		throw new Error(`No \`${selector} { ... }\` block found`);
	}
	const tokens = new Set<string>();
	for (const match of block.matchAll(/--([a-zA-Z0-9-]+)\s*:/g)) {
		const name = match[1];
		if (name !== undefined) tokens.add(name);
	}
	return tokens;
}

const themeFiles = readdirSync(THEMES_DIR).filter((file) => file.endsWith(".css"));

describe("theme light/dark parity", () => {
	// Guards against a typo'd glob or an empty/moved themes directory silently
	// passing with zero assertions.
	it("found theme files to check", () => {
		expect(themeFiles.length).toBeGreaterThan(0);
	});

	for (const file of themeFiles) {
		describe(file, () => {
			const css = readFileSync(join(THEMES_DIR, file), "utf-8");
			const rootTokens = tokensInBlock(css, ":root");
			const darkTokens = tokensInBlock(css, "\\.dark");

			it("defines at least one color token in :root", () => {
				const colorTokens = [...rootTokens].filter((t) => !isModeIndependent(t));
				expect(colorTokens.length).toBeGreaterThan(0);
			});

			const colorTokens = [...rootTokens].filter((t) => !isModeIndependent(t));
			it.each(colorTokens)("--%s is also set in .dark", (token) => {
				expect(darkTokens.has(token)).toBe(true);
			});
		});
	}
});
