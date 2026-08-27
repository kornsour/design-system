import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// RTL doesn't auto-register its afterEach cleanup unless the test runner
// exposes globals (Vitest doesn't by default) — so do it once, here.
afterEach(() => {
	cleanup();
});

// jsdom doesn't implement matchMedia. useTheme()/ThemeToggle (and any future
// code that checks prefers-color-scheme) call it unconditionally, so a bare
// jsdom environment throws without this polyfill.
if (typeof window !== "undefined" && !window.matchMedia) {
	window.matchMedia = (query: string) =>
		({
			matches: false,
			media: query,
			onchange: null,
			addListener: () => {},
			removeListener: () => {},
			addEventListener: () => {},
			removeEventListener: () => {},
			dispatchEvent: () => false,
		}) as MediaQueryList;
}
