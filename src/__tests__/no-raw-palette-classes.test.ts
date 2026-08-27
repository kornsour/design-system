// @vitest-environment node
//
// Pure text/regex scanning — no DOM needed, so this opts out of the jsdom
// default (see vitest.config.ts). Enforces the invariant from CLAUDE.md:
// components consume semantic token utilities only (`bg-primary`,
// `border-input`, …), never hard-coded Tailwind palette classes
// (`bg-black/50`, `text-red-500`, …). Without this, the invariant is
// honor-system — see the design-system#51 dialog overlay regression.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const UI_DIR = join(__dirname, "../components/ui");

/** Utility prefixes that accept a Tailwind color as their value. */
const COLOR_PREFIXES = [
	"bg",
	"text",
	"border",
	"ring",
	"ring-offset",
	"fill",
	"stroke",
	"outline",
	"decoration",
	"caret",
	"accent",
	"divide",
	"placeholder",
	"from",
	"via",
	"to",
	"shadow",
];

/** Tailwind's built-in raw palette families — never allowed directly on a component. */
const RAW_PALETTE_COLORS = [
	"black",
	"white",
	"slate",
	"gray",
	"zinc",
	"neutral",
	"stone",
	"red",
	"orange",
	"amber",
	"yellow",
	"lime",
	"green",
	"emerald",
	"teal",
	"cyan",
	"sky",
	"blue",
	"indigo",
	"violet",
	"purple",
	"fuchsia",
	"pink",
	"rose",
];

const RAW_PALETTE_CLASS_RE = new RegExp(
	`\\b(?:${COLOR_PREFIXES.join("|")})-(?:${RAW_PALETTE_COLORS.join("|")})(?:-\\d{2,3})?(?:/\\d{1,3})?\\b`,
	"g",
);

function findViolations(source: string): string[] {
	return [...source.matchAll(RAW_PALETTE_CLASS_RE)].map((match) => match[0]);
}

const componentFiles = readdirSync(UI_DIR).filter(
	(file) => file.endsWith(".tsx") && !file.endsWith(".test.tsx"),
);

describe("no raw palette classes in src/components/ui", () => {
	// Guards against a typo'd glob or a moved/renamed directory silently
	// passing with zero assertions.
	it("found component files to check", () => {
		expect(componentFiles.length).toBeGreaterThan(0);
	});

	it.each(componentFiles)("%s uses only semantic token utilities", (file) => {
		const source = readFileSync(join(UI_DIR, file), "utf-8");
		const violations = findViolations(source);
		expect(
			violations,
			`${file} uses raw Tailwind palette class(es) ${JSON.stringify(violations)} — ` +
				"use a semantic token utility (bg-primary, border-input, bg-overlay, …) instead.",
		).toEqual([]);
	});
});
