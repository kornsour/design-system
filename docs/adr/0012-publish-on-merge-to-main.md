# ADR-0012: Publish to npm on merge to `main`, with the version bumped in the PR

- Status: Accepted
- Date: 2026-08-15

## Context

Releasing used to take two deliberate acts: merge a PR that bumped `version` in
`package.json`, then separately publish a GitHub Release, whose `release:
published` event triggered `release.yml`.

The second act is easy to skip, and skipping it is invisible. `main` ends up
carrying code that looks released — merged, green, version bumped — while npm
still serves the previous version. Consumers pinning `^0.x` get nothing. The
merge is the moment the team treats the change as shipped, so the merge should
be what ships it.

Two constraints shape how far this can be automated:

1. **The `main` ruleset requires a pull request for every change and defines no
   bypass actors.** A workflow cannot push a version-bump commit back to `main`.
   So the common "derive the version from conventional commits and commit the
   bump" pattern is not available without weakening the ruleset.
2. **Dependabot PRs auto-merge** (patch/minor). Anything that publishes on every
   merge must not publish on those.

The alternative to bumping in the PR is to compute the version at publish time
from commit messages and never commit it. That would leave the committed
`package.json` permanently stale and quietly move the source of truth to git
tags, contradicting ADR-0011's treatment of `package.json` as the package
manifest.

## Decision

`release.yml` triggers on `push` to `main` (plus `workflow_dispatch` for
recovery). It reads `version` from `package.json` and asks npm whether that
version exists:

- **already published** → the job stops before installing, building, or
  contacting npm again. This is the path every Dependabot merge takes.
- **new** → build via `prepack`, `npm publish --provenance` under OIDC trusted
  publishing, then create the `v<version>` tag and GitHub Release **from** the
  successful publish.

The version stays in `package.json`, bumped by hand as an explicit line in the
feature PR. `version-guard.yml` fails any PR that modifies what actually ships
(`src/components`, `src/styles`, `src/lib`, `src/tokens.ts`, `scripts/`,
`tsup.config.ts`, `tsconfig.build.json`) without changing `version`. Showcase
code (`src/app/**`) and tests are exempt — they cannot alter `dist/`. Dependabot
is exempt.

Publishing is ordered after the npm publish succeeds so a failed publish never
leaves behind a tag claiming a release that does not exist.

## Consequences

- Merging a version-bumping PR is now sufficient to ship. There is no second
  step to forget, and no hand-cut Releases — a manually published Release no
  longer triggers anything.
- The bump remains a reviewable decision in the PR diff, rather than being
  inferred from commit-message prefixes. Reviewers see "this is a minor" at the
  same time they see why.
- Forgetting the bump fails the PR instead of silently publishing nothing.
- `package.json` stays the single source of truth for the published version
  (ADR-0011); tags and Releases are outputs, not inputs.
- Re-running a partially failed release is idempotent — the npm existence check
  makes a second run a no-op once the publish landed.
- The trade-off accepted: version numbers are chosen by a human, so a PR can
  still pick the *wrong* semver level. The guard enforces that a bump happened,
  not that it was the right size.
- If the `main` ruleset ever gains a GitHub Actions bypass actor, fully derived
  versioning (release-please or semantic-release) becomes possible and this ADR
  should be revisited. Note that semantic-release's npm plugin has not supported
  OIDC trusted publishing, so that path would likely reintroduce an `NPM_TOKEN`.
