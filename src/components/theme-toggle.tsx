"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * Minimal class-based dark mode toggle. Flips the `dark` class on <html>,
 * which is what the token layer in globals.css keys off of. Persists choice
 * to localStorage. For production apps consider `next-themes`; this keeps the
 * design-system package dependency-free.
 */
export function ThemeToggle() {
	const [dark, setDark] = useState(false);

	useEffect(() => {
		const stored = localStorage.getItem("theme");
		const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
		const isDark = stored ? stored === "dark" : prefersDark;
		setDark(isDark);
		document.documentElement.classList.toggle("dark", isDark);
	}, []);

	function toggle() {
		const next = !dark;
		setDark(next);
		document.documentElement.classList.toggle("dark", next);
		localStorage.setItem("theme", next ? "dark" : "light");
	}

	return (
		<Button variant="outline" size="icon" onClick={toggle} aria-label="Toggle theme">
			{dark ? <Moon /> : <Sun />}
		</Button>
	);
}
