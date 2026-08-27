import { expect, test } from "@playwright/test";

/**
 * ThemeToggle applies its class to <html> and reads/writes localStorage — both
 * only observable in a real browser, which is exactly what jsdom-backed Vitest
 * coverage (theme-toggle.test.tsx) can't exercise end to end. These specs
 * confirm the toggle actually repaints the page (not just the class) and that
 * the choice survives a reload.
 */

test.beforeEach(async ({ page }) => {
	await page.goto("/design-system");
});

test("theme toggle flips the dark class and a token-driven color", async ({ page }) => {
	const html = page.locator("html");
	await expect(html).not.toHaveClass(/dark/);

	const lightBackground = await page.evaluate(
		() => getComputedStyle(document.body).backgroundColor,
	);

	const toggle = page.getByRole("button", { name: "Toggle theme" });
	await toggle.click();
	await expect(html).toHaveClass(/dark/);

	const darkBackground = await page.evaluate(
		() => getComputedStyle(document.body).backgroundColor,
	);
	expect(darkBackground).not.toBe(lightBackground);

	await toggle.click();
	await expect(html).not.toHaveClass(/dark/);

	const backToLight = await page.evaluate(
		() => getComputedStyle(document.body).backgroundColor,
	);
	expect(backToLight).toBe(lightBackground);
});

test("theme choice persists in localStorage across a reload", async ({ page }) => {
	const html = page.locator("html");
	const toggle = page.getByRole("button", { name: "Toggle theme" });

	await toggle.click();
	await expect(html).toHaveClass(/dark/);
	const stored = await page.evaluate(() => localStorage.getItem("theme"));
	expect(stored).toBe("dark");

	await page.reload();

	// <html> must already carry .dark on the reloaded document, before any
	// client JS has a chance to run — that's the point of <ThemeScript />.
	await expect(html).toHaveClass(/dark/);
	const storedAfterReload = await page.evaluate(() => localStorage.getItem("theme"));
	expect(storedAfterReload).toBe("dark");
});
