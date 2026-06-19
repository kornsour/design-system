import { defineConfig } from "tsup";

export default defineConfig({
	entry: {
		index: "src/components/ui/index.ts",
		tokens: "src/tokens.ts",
	},
	format: ["esm"],
	dts: true,
	tsconfig: "tsconfig.build.json",
	clean: true,
	treeshake: true,
	// Peers and runtime deps are resolved by the consumer, not bundled in.
	external: [
		/^react($|\/)/,
		/^react-dom($|\/)/,
		"radix-ui",
		"lucide-react",
		"class-variance-authority",
		"clsx",
		"tailwind-merge",
	],
	outExtension: () => ({ js: ".mjs" }),
});
