import { expect, test } from "@playwright/test";

/**
 * Focus trapping and Escape-to-close come from Radix's FocusScope, which only
 * does anything in a real browser (jsdom never moves focus). These specs
 * exist to catch a regression in how Dialog wires those primitives up, not to
 * re-test Radix itself.
 */

test("dialog traps focus and closes on Escape", async ({ page }) => {
	await page.goto("/design-system");

	const trigger = page.getByRole("button", { name: "Open dialog" });
	await trigger.click();

	const dialog = page.getByRole("dialog");
	await expect(dialog).toBeVisible();
	await expect(dialog).toContainText("Are you sure?");

	const focusIsInsideDialog = () =>
		page.evaluate(() => {
			const dialogEl = document.querySelector('[role="dialog"]');
			return dialogEl != null && dialogEl.contains(document.activeElement);
		});

	// Focus lands inside the dialog on open, and stays there through more Tab
	// presses than the dialog has focusable elements — proving it wraps
	// instead of escaping to the page behind it.
	expect(await focusIsInsideDialog()).toBe(true);
	for (let i = 0; i < 6; i++) {
		await page.keyboard.press("Tab");
		expect(await focusIsInsideDialog()).toBe(true);
	}

	await page.keyboard.press("Escape");
	await expect(dialog).not.toBeVisible();

	// Radix restores focus to the trigger that opened the dialog.
	await expect(trigger).toBeFocused();
});
