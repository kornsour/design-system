"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Class-based light/dark switching for every feel in the system.
 *
 * Themes ship both a `:root` (light) and a `.dark` token set, so switching mode
 * is just toggling the `dark` class on <html> — no per-theme wiring. Render
 * <ThemeScript /> in the document head to apply the stored choice before first
 * paint (otherwise a light flash precedes a dark page), and <ThemeToggle />
 * wherever the control belongs. Dependency-free by design; if an app already
 * uses `next-themes`, prefer that and use only the token layer from here.
 */

export type ThemeMode = "light" | "dark" | "system";

/** localStorage key shared by <ThemeScript /> and <ThemeToggle /> unless overridden. */
export const THEME_STORAGE_KEY = "theme";

function prefersDark(): boolean {
	return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function resolveMode(mode: ThemeMode): "light" | "dark" {
	if (mode !== "system") return mode;
	return prefersDark() ? "dark" : "light";
}

function applyMode(mode: ThemeMode): void {
	document.documentElement.classList.toggle("dark", resolveMode(mode) === "dark");
}

function readMode(storageKey: string): ThemeMode {
	try {
		const stored = localStorage.getItem(storageKey);
		if (stored === "light" || stored === "dark" || stored === "system") return stored;
	} catch {
		// Storage can be unavailable (private mode, blocked cookies) — fall through.
	}
	return "system";
}

/**
 * Read and change the current mode. `resolvedTheme` is undefined until mounted,
 * because the concrete appearance is only knowable in the browser.
 */
export function useTheme(storageKey: string = THEME_STORAGE_KEY) {
	const [theme, setThemeState] = React.useState<ThemeMode>("system");
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		setThemeState(readMode(storageKey));
		setMounted(true);
	}, [storageKey]);

	// While following the OS, keep up with it changing underneath us.
	React.useEffect(() => {
		if (theme !== "system") return;
		const mq = window.matchMedia("(prefers-color-scheme: dark)");
		const onChange = () => applyMode("system");
		mq.addEventListener("change", onChange);
		return () => mq.removeEventListener("change", onChange);
	}, [theme]);

	const setTheme = React.useCallback(
		(next: ThemeMode) => {
			setThemeState(next);
			applyMode(next);
			try {
				localStorage.setItem(storageKey, next);
			} catch {
				// Non-persistent is still better than not switching at all.
			}
		},
		[storageKey],
	);

	return {
		theme,
		resolvedTheme: mounted ? resolveMode(theme) : undefined,
		setTheme,
		mounted,
	};
}

export interface ThemeScriptProps {
	storageKey?: string;
}

/**
 * Blocking inline script that sets the `dark` class before first paint. Render
 * it inside <head> (in Next's App Router: directly in the root layout's <head>),
 * and add `suppressHydrationWarning` to <html> since the class it writes is not
 * present in the server-rendered markup.
 */
export function ThemeScript({ storageKey = THEME_STORAGE_KEY }: ThemeScriptProps) {
	const key = JSON.stringify(storageKey);
	const js = `(function(){try{var s=localStorage.getItem(${key});var d=s==="dark"||((s===null||s==="system")&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d)}catch(e){}})()`;
	return (
		// biome-ignore lint/security/noDangerouslySetInnerHtml: static, non-user-supplied
		<script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: js }} />
	);
}

export interface ThemeToggleProps extends Omit<ButtonProps, "onClick" | "children"> {
	/** Cycle light → dark → system instead of a plain light/dark flip. */
	withSystem?: boolean;
	storageKey?: string;
}

/**
 * Icon button that switches mode. The sun/moon glyphs are chosen in CSS off the
 * `dark` class rather than from state, so the first paint is correct and there
 * is nothing for hydration to mismatch on.
 */
export function ThemeToggle({
	withSystem = false,
	storageKey,
	variant = "outline",
	size = "icon",
	className,
	...props
}: ThemeToggleProps) {
	const { theme, setTheme, mounted } = useTheme(storageKey);

	function handleClick() {
		if (!withSystem) {
			const isDark = document.documentElement.classList.contains("dark");
			setTheme(isDark ? "light" : "dark");
			return;
		}
		setTheme(theme === "light" ? "dark" : theme === "dark" ? "system" : "light");
	}

	const followingSystem = mounted && withSystem && theme === "system";

	return (
		<Button
			variant={variant}
			size={size}
			className={cn(className)}
			onClick={handleClick}
			aria-label="Toggle theme"
			title="Toggle theme"
			{...props}
		>
			{followingSystem ? (
				<Monitor aria-hidden="true" />
			) : (
				<>
					<Sun className="dark:hidden" aria-hidden="true" />
					<Moon className="hidden dark:block" aria-hidden="true" />
				</>
			)}
		</Button>
	);
}
