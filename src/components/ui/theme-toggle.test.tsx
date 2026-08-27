import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { THEME_STORAGE_KEY, ThemeScript, ThemeToggle } from "./theme-toggle";

afterEach(() => {
	document.documentElement.classList.remove("dark");
	localStorage.clear();
});

describe("ThemeScript", () => {
	it("renders a blocking inline script that references the storage key", () => {
		const { container } = render(<ThemeScript />);
		const script = container.querySelector("script");
		expect(script).toBeDefined();
		expect(script?.innerHTML).toContain(THEME_STORAGE_KEY);
	});
});

describe("ThemeToggle", () => {
	it("renders a labeled toggle button", () => {
		render(<ThemeToggle />);
		expect(screen.getByRole("button", { name: "Toggle theme" })).toBeDefined();
	});

	it("flips the `dark` class on <html> when clicked", async () => {
		render(<ThemeToggle />);
		expect(document.documentElement.classList.contains("dark")).toBe(false);

		await userEvent.click(screen.getByRole("button", { name: "Toggle theme" }));
		expect(document.documentElement.classList.contains("dark")).toBe(true);

		await userEvent.click(screen.getByRole("button", { name: "Toggle theme" }));
		expect(document.documentElement.classList.contains("dark")).toBe(false);
	});

	it("persists the chosen mode under its storage key", async () => {
		render(<ThemeToggle />);
		await userEvent.click(screen.getByRole("button", { name: "Toggle theme" }));
		expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
	});
});
