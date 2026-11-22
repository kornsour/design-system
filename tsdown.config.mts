import { defineConfig } from "tsdown";

export default defineConfig({
	entry: {
		index: "src/components/ui/index.ts",
		tokens: "src/tokens.ts",
	},
	format: ["esm"],
	// Declarations are emitted by TypeScript 7's native `tsc` (rolldown-plugin-dts
	// picks its tsgo generator when typescript@7 is installed) and bundled into
	// one .d.mts per entry. See ADR-0015.
	dts: true,
	tsconfig: "tsconfig.build.json",
	clean: true,
	treeshake: true,
	// `.mjs` / `.d.mts` (postbuild renames the latter to `.d.ts`).
	fixedExtension: true,
	inputOptions: {
		// Every Radix-backed component starts with "use client"; bundling can't
		// keep per-module directives, so rolldown warns once per file. The
		// directive is re-added to the whole entry by scripts/postbuild.mjs.
		onLog(level, log, handler) {
			if (log.code === "MODULE_LEVEL_DIRECTIVE") return;
			handler(level, log);
		},
	},
	deps: {
		// Peers and runtime deps are resolved by the consumer, not bundled in.
		// tsdown already externalizes everything in dependencies/peerDependencies;
		// listing them keeps the contract explicit.
		neverBundle: [
			/^react($|\/)/,
			/^react-dom($|\/)/,
			"radix-ui",
			"lucide-react",
			"class-variance-authority",
			"clsx",
			"tailwind-merge",
		],
	},
});
