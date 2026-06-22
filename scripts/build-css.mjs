// Compile every theme in src/styles/themes/ into dist/themes/<feel>.css (each a
// self-contained stylesheet: utilities + that feel's tokens + fonts), copy the
// font files, and alias the default feel to dist/styles.css. Adding a new theme
// file is picked up automatically — no script or exports change needed (the
// package.json "./themes/*" export is a wildcard).
import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";

const DEFAULT_THEME = "modern-neutral";
const themesDir = "src/styles/themes";

mkdirSync("dist/themes", { recursive: true });
const themes = readdirSync(themesDir).filter((f) => f.endsWith(".css"));

for (const file of themes) {
	const name = file.replace(/\.css$/, "");
	execFileSync("tailwindcss", ["-i", `${themesDir}/${file}`, "-o", `dist/themes/${name}.css`, "--minify"], {
		stdio: "inherit",
	});
}

// Fonts sit next to the theme CSS (dist/themes/), since each theme's @font-face
// uses "./fonts/..." relative to its own location.
cpSync("src/styles/fonts", "dist/themes/fonts", { recursive: true });
// Default stylesheet re-exports the default theme so its font url()s still
// resolve from dist/themes/.
writeFileSync("dist/styles.css", `@import "./themes/${DEFAULT_THEME}.css";\n`);
console.log(`built ${themes.length} theme(s): ${themes.map((t) => t.replace(/\.css$/, "")).join(", ")}`);
