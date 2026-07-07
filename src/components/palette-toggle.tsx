"use client";

import { Palette } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * Toggles the "Spartan" theme by flipping the `theme-spartan` class on <html>,
 * which remaps the brand accent tokens in globals.css. Composes with the `dark`
 * class from ThemeToggle. Persists choice to localStorage. Mirrors the
 * dependency-free approach of ThemeToggle.
 */
export function PaletteToggle() {
	const [spartan, setSpartan] = useState(false);

	useEffect(() => {
		const isSpartan = localStorage.getItem("palette") === "spartan";
		setSpartan(isSpartan);
		document.documentElement.classList.toggle("theme-spartan", isSpartan);
	}, []);

	function toggle() {
		const next = !spartan;
		setSpartan(next);
		document.documentElement.classList.toggle("theme-spartan", next);
		localStorage.setItem("palette", next ? "spartan" : "default");
	}

	return (
		<Button
			variant={spartan ? "primary" : "outline"}
			size="icon"
			onClick={toggle}
			aria-label="Toggle Spartan theme"
			aria-pressed={spartan}
		>
			<Palette />
		</Button>
	);
}
