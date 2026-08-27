"use client";

import * as React from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

/**
 * Showcase-only "feel" switcher — swaps which token set (see feel-tokens.css)
 * is active, independently of the light/dark mode ThemeToggle already
 * controls. Not part of the published package: a real app picks one feel at
 * build time by importing that theme's stylesheet (see CLAUDE.md), it doesn't
 * ship a runtime picker.
 *
 * Mirrors src/components/ui/theme-toggle.tsx's approach — a `data-feel`
 * attribute on <html> instead of a `dark` class, persisted the same way.
 */

export interface Feel {
	id: string;
	label: string;
}

/** Keep in sync with src/styles/themes/*.css and feel-tokens.css. */
export const FEELS: Feel[] = [
	{ id: "modern-neutral", label: "Modern Neutral" },
	{ id: "cobalt", label: "Cobalt" },
	{ id: "spartan", label: "Spartan" },
	{ id: "gestplate", label: "GestPlate" },
	{ id: "sprout", label: "Sprout" },
	{ id: "warm", label: "Warm" },
];

const DEFAULT_FEEL = "modern-neutral";
const FEEL_STORAGE_KEY = "feel";

function isFeelId(value: string | null): value is string {
	return value !== null && FEELS.some((feel) => feel.id === value);
}

function readFeel(): string {
	try {
		const stored = localStorage.getItem(FEEL_STORAGE_KEY);
		if (isFeelId(stored)) return stored;
	} catch {
		// Storage can be unavailable (private mode, blocked cookies) — fall through.
	}
	return DEFAULT_FEEL;
}

function applyFeel(feel: string): void {
	document.documentElement.setAttribute("data-feel", feel);
}

/**
 * Blocking inline script that sets `data-feel` before the rest of the page
 * paints, the same job <ThemeScript /> does for light/dark. It only needs to
 * run before this page's own content, so it's rendered as the first thing in
 * the page body rather than in <head> — nothing precedes it to flash.
 */
export function FeelScript() {
	const key = JSON.stringify(FEEL_STORAGE_KEY);
	const ids = JSON.stringify(FEELS.map((feel) => feel.id));
	const js = `(function(){try{var ids=${ids};var s=localStorage.getItem(${key});document.documentElement.setAttribute("data-feel",ids.indexOf(s)>-1?s:${JSON.stringify(DEFAULT_FEEL)})}catch(e){}})()`;
	return (
		// biome-ignore lint/security/noDangerouslySetInnerHtml: static, non-user-supplied
		<script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: js }} />
	);
}

export function FeelPicker() {
	const [feel, setFeel] = React.useState<string>(DEFAULT_FEEL);
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		setFeel(readFeel());
		setMounted(true);
	}, []);

	function handleChange(next: string) {
		setFeel(next);
		applyFeel(next);
		try {
			localStorage.setItem(FEEL_STORAGE_KEY, next);
		} catch {
			// Non-persistent is still better than not switching at all.
		}
	}

	return (
		<Select value={mounted ? feel : DEFAULT_FEEL} onValueChange={handleChange}>
			<SelectTrigger className="w-40" aria-label="Feel">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				{FEELS.map(({ id, label }) => (
					<SelectItem key={id} value={id}>
						{label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
