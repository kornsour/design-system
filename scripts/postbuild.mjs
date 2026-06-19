// Post-build fixups for the package dist:
//  1. Rename tsup's .d.mts declarations to .d.ts so the `types` exports
//     condition (and the design-sync converter's .d.ts glob) resolve them.
//  2. Prepend "use client" to the component entry — esbuild strips a banner
//     directive when bundling, so it must be added after the bundle is written.
import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";

for (const name of ["index", "tokens"]) {
	const mts = `dist/${name}.d.mts`;
	if (existsSync(mts)) renameSync(mts, `dist/${name}.d.ts`);
}

const entry = "dist/index.mjs";
const src = readFileSync(entry, "utf8");
if (!src.startsWith('"use client"')) {
	writeFileSync(entry, `"use client";\n${src}`);
}
