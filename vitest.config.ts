import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	test: {
		// Component tests need a DOM; logic-only tests (e.g. the theme-parity
		// check) opt out per-file with a `// @vitest-environment node` pragma,
		// since jsdom is unneeded weight for them.
		environment: "jsdom",
		setupFiles: ["./src/__tests__/setup.ts"],
		include: ["src/**/*.test.{ts,tsx}"],
		coverage: {
			provider: "v8",
			include: ["src/**/*.{ts,tsx}"],
			exclude: ["src/**/*.test.{ts,tsx}", "src/**/*.d.ts"],
		},
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
});
