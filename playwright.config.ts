import { defineConfig, devices } from "@playwright/test";

// A port of its own, not the app's default 3000 — so `pnpm e2e` doesn't
// collide with a `pnpm dev` (or anything else) already bound to 3000.
// Override with PLAYWRIGHT_PORT if 3100 is taken too.
const port = process.env.PLAYWRIGHT_PORT ?? "3100";
const baseURL = `http://localhost:${port}`;

export default defineConfig({
	testDir: "./e2e",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: "html",
	use: {
		baseURL,
		trace: "on-first-retry",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
	webServer: {
		command: "pnpm dev",
		url: baseURL,
		reuseExistingServer: !process.env.CI,
		env: { PORT: port },
	},
});
