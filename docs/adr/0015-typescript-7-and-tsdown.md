# ADR-0015: TypeScript 7, and tsdown instead of tsup for the package build

- Status: Accepted
- Date: 2026-11-21
- Supersedes: the "build with `tsup`" part of [ADR-0011](./0011-design-system-package.md)
  (everything else in ADR-0011 stands)

## Context

TypeScript 7 is the native (Go) compiler. It ships no JavaScript compiler API:
`require("typescript")` on 7.x returns only `{ version, versionMajorMinor }`.
Tools that call `ts.createProgram` / `ts.parseJsonConfigFileContent` either
fall back to the `@typescript/typescript6` compatibility package or break.

Checked against `typescript@7.0.2`, what in this repo touches the compiler:

| Consumer | Result on TS 7 |
| --- | --- |
| `pnpm exec tsc --noEmit` | works (native binary) |
| `next build` (showcase) | works — Next 16.4 defaults `experimental.useTypeScriptCli: true`, so it spawns `tsc` instead of loading the API |
| Vitest, Biome, Playwright | don't load `typescript` |
| **tsup 9 `dts: true`** | **broken.** Its bundled rollup-plugin-dts falls back to `@typescript/typescript6`, but tsup's own wrapper calls `require("typescript").parseJsonConfigFileContent` directly → `TypeError: … is not a function`, even with the compat package installed. tsup's `typescript` is an optional *peer*, so pnpm `overrides` / `packageExtensions` can't redirect it to the 6.x API. tsup is also unmaintained upstream (its README points to tsdown). |

## Decision

1. **`typescript@^7`.**
2. **Build the package with [tsdown](https://tsdown.dev)** (rolldown + rolldown-plugin-dts)
   instead of tsup. With `typescript@7.0.x` installed, rolldown-plugin-dts uses its
   `tsgo` generator: declarations are emitted by TS 7's own `tsc` from
   `tsconfig.build.json` and bundled to one `.d.mts` per entry — no JS API, no
   `@typescript/typescript6`. `tsdown.config.mts` mirrors the old `tsup.config.ts`
   (same entries, ESM only, `.mjs`/`.d.mts`, same externals); `scripts/postbuild.mjs`
   and `scripts/build-css.mjs` are unchanged in behaviour.
3. **tsconfig conventions for TS 7:**
   - no `baseUrl`; `paths` stay tsconfig-relative (`"@/*": ["./src/*"]`);
   - ambient type packages are listed in `compilerOptions.types` (`["node"]`) —
     TS 7 doesn't auto-include `@types/*`; `@types/node` had only been loaded
     through a reference inside `next/dist/types.d.ts`;
   - the emitting `tsconfig.build.json` sets `rootDir: "./src"` explicitly;
   - `ignoreDeprecations: "6.0"` is dropped — a TS 6-era escape hatch for
     options TS 7 removes outright; nothing here needs it (even tsup 9 on
     TS 6.0.3 builds without it).

Verified when switching: same `dist/` file list; `dist/*.css` byte-identical;
same 57 value + 8 type exports from `.` and 8 + 1 from `./tokens`, each
type-identical between the tsup/TS 6 and tsdown/TS 7 builds (checked with a
mutual-`Equals` type test); `dist/tokens.mjs` deep-equal at runtime;
`"use client"` still the first line of `dist/index.mjs`.

## Consequences

- `.d.ts` output is formatted differently (TS 7's emitter: `export declare`
  inline instead of a trailing `export { … }` block, 2-space indent). Consumers
  see the same types.
- rolldown warns that per-module `"use client"` can't survive bundling; the
  config silences `MODULE_LEVEL_DIRECTIVE` because postbuild re-adds the
  directive to the whole entry (as before with esbuild, which dropped it silently).
- rolldown-plugin-dts 0.30 warns that its `tsgo` generator on TS **7.0** is
  deprecated in favour of TS 7.1's emit API and will be removed "in the next
  minor". tsdown 0.23 depends on `rolldown-plugin-dts@^0.30.0`, so that can't
  arrive by accident; **when bumping tsdown to a release that needs
  rolldown-plugin-dts 0.31+, move to `typescript@^7.1` in the same PR.**
- A tool added later that needs the 6.x compiler API should get
  `@typescript/typescript6`, not a `typescript@6` downgrade.
