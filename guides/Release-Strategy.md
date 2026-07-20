# Release Strategy

## Overview

This document defines the release strategy for Tutors. It replaces the previous model of staging work on a long-lived `development` branch with a trunk-based workflow where `main` is always the source of truth and releases are cut, hardened, and shipped through a release candidate (RC) process.

## Principles

1. **Main is always releasable.** Every merged PR should leave `main` in a deployable state. This does not mean every commit ships to production, it means every commit _could_.
2. **Small, frequent merges over large batch integrations.** Long-lived feature branches and staging branches create merge risk, hide integration bugs, and make rollbacks painful. PRs should be scoped, reviewed, and merged continuously.
3. **Semver controls the contract.** Version numbers communicate intent to consumers. A major bump signals breaking changes, a minor bump signals new functionality, and a patch signals fixes. The version number is the release's API, not a marketing decision.
4. **Harden through the RC process, not through branch isolation.** Quality comes from testing release candidates under real conditions, not from keeping changes quarantined on a separate branch.
5. **Tags are immutable release artifacts.** Once a version is tagged, it is never moved or deleted. If a fix is needed, cut a new version.

## Problems with the Current Approach

The existing workflow stages commits on a `development` branch for extended periods before merging to `main`. This creates several issues:

- **Merge debt accumulates.** Months of divergence means merge conflicts grow in number and complexity. A year of staged changes is a year of integration risk landing all at once.
- **No incremental feedback loop.** Changes are not validated against `main` until the batch merge, meaning integration bugs are discovered late.
- **Unclear release state.** It is difficult to answer "what is in production?" or "when will this feature ship?" when the pipeline is a single long-lived branch.
- **Rollback granularity is lost.** If a batch merge introduces a regression, reverting means reverting the entire batch rather than a single scoped change.
- **Changelog and version gaps.** The changelog currently stops at v11.3.0 while `package.json` reports v15.2.0, indicating version bumps happened without corresponding release documentation.

## Branching Model

### Branches

| Branch | Purpose | Lifetime |
|--------|---------|----------|
| `main` | Integration trunk. All PRs target this branch. Always deployable. | Permanent |
| `feature/*`, `fix/*`, `chore/*` | Short-lived work branches off `main`. One concern per branch. | Days, not weeks |
| `release/vX.Y.Z` | Cut from `main` when preparing a release. Only bug fixes land here. | Duration of RC hardening (typically 1-2 weeks) |

### What Goes Away

- **`development` branch.** No long-lived integration branch. Once existing work is reconciled (see Migration section), this branch is archived and deleted.
- **Direct commits to `main`.** All changes arrive via pull request.

## Versioning

Follow [Semantic Versioning 2.0.0](https://semver.org/):

- **Major (X.0.0):** Breaking changes to public-facing behaviour, URL structure, course format, or API contracts.
- **Minor (X.Y.0):** New features, enhancements, or non-breaking additions.
- **Patch (X.Y.Z):** Bug fixes, performance improvements, dependency updates with no user-facing behaviour change.

### Pre-release Identifiers

Release candidates use the format `vX.Y.Z-rc.N`:

```
v16.0.0-rc.1   # first release candidate
v16.0.0-rc.2   # incorporates fixes found during hardening
v16.0.0        # final release, promoted from last RC
```

### Tag Format

All tags use the `v` prefix for consistency: `v16.0.0`, `v16.0.0-rc.1`. Historical tags with other formats (e.g. `tutors-10.0`) remain as-is but the convention going forward is `vX.Y.Z`.

## Release Lifecycle

### 1. Development Phase

```
main ─────●─────●─────●─────●─────●──── (PRs merge continuously)
           \   /       \   /       \
            PR1         PR2        PR3
```

- Contributors branch from `main`, open PRs back to `main`.
- Each PR must pass CI (lint, type check, unit tests, build) before merge.
- PRs should be reviewed by at least one other contributor.
- `main` receives continuous integration; no changes are staged elsewhere.

### 2. Release Cut

When `main` has accumulated enough changes for a release (or a time-based cadence is reached):

1. **Determine the version bump.** Review merged PRs since the last release. Apply semver rules.
2. **Create the release branch:** `git checkout -b release/vX.Y.Z main`
3. **Bump the version** in `package.json` and update `CHANGELOG.md`.
4. **Tag the first RC:** `git tag vX.Y.Z-rc.1`
5. **Deploy RC to staging** for validation.

```
main ─────●─────●─────●──────────────●──── (development continues)
                       \             /
                        release/v16.0.0
                        │  rc.1  rc.2  │
                        ●────●────●────● ── tag v16.0.0
```

### 3. Hardening Phase

During the RC phase, the release branch accepts **only** bug fixes:

- Fixes are developed on short-lived branches off `release/vX.Y.Z`.
- Each fix is cherry-picked or merged back to `main` to prevent regression.
- Each fix increments the RC number: `vX.Y.Z-rc.2`, `vX.Y.Z-rc.3`, etc.
- No new features land on the release branch.

### 4. Final Release

When the RC is validated and stable:

1. **Tag the final release:** `git tag vX.Y.Z` on the release branch HEAD.
2. **Merge the release branch back to `main`** to capture any hardening fixes.
3. **Create a GitHub Release** from the tag with release notes.
4. **Deploy to production.**
5. **Delete the release branch.** It has served its purpose.

### 5. Hotfix Process

Critical production bugs that cannot wait for the next release cycle:

1. Branch from the latest release tag: `git checkout -b fix/critical-issue vX.Y.Z`
2. Fix, test, and open a PR against `main`.
3. If a production patch is needed immediately, cut a patch release: tag `vX.Y.Z+1` from the fix branch.
4. Merge the fix to `main`.

## Changelog Discipline

Every release must have a corresponding `CHANGELOG.md` entry. Entries are written at release-cut time by reviewing merged PRs and grouping them:

```markdown
## [16.0.0] - 2026-07-20

### Breaking Changes
- Removed legacy auth flow (#1100)

### Features
- Added Jupyter notebook support (#1085)
- Enhanced card system with landscape layout (#1090)

### Fixes
- Fixed lab navigation scroll behaviour (#1092)
```

The changelog documents what shipped and when. It is not a commit log; it is a curated summary for users and contributors.

## CI/CD Integration

### PR Checks (on every PR to `main`)

- Lint and format (`prettier --check`, `eslint`)
- Type checking (`svelte-check`)
- Unit tests (`vitest`)
- Build verification (`vite build`)

### Release Branch Checks (on RC tags)

- All PR checks, plus:
- Integration / E2E tests (`playwright`)
- Mutation testing (`stryker`) on changed modules
- Staging deployment and smoke test

### Release Checks (on final version tags)

- Production deployment
- Post-deploy smoke test

## Migration from Current Workflow

Transitioning from the `development` branch model:

1. **Audit `development`.** Review the 56 diverged commits. Identify which changes are complete, tested, and ready to ship versus work-in-progress.
2. **Break into PRs.** Decompose the ready changes into scoped PRs against `main`. Each PR should be independently reviewable and mergeable.
3. **Discard or re-branch WIP.** Incomplete work should be rebased onto `main` as new `feature/*` branches, not carried forward as a lump.
4. **Archive and delete.** Once all valuable work is extracted, archive `development` (tag it as `archive/development-final` for reference) and delete the branch.
5. **Align version and changelog.** The current `package.json` version (15.2.0) and last changelog entry (11.3.0) are out of sync. As part of the first release under this strategy, reconcile these: update the changelog to reflect what shipped between 11.3.0 and the current state, and cut the next release with a clean semver baseline.

## Release Cadence

This strategy does not mandate a fixed cadence. Releases are cut when there is meaningful value to ship. However, avoid letting `main` accumulate more than 4-6 weeks of unreleased changes, as this reintroduces the batching problem this strategy eliminates.

A lightweight rhythm to consider:

- **Minor releases:** every 4-6 weeks, or when a significant feature lands.
- **Patch releases:** as needed for bug fixes.
- **Major releases:** planned, with a deprecation notice in the prior minor release.

## Summary

| Aspect | Old Model | New Model |
|--------|-----------|-----------|
| Integration branch | `development` (long-lived) | `main` (continuous) |
| Release mechanism | Batch merge to `main` | RC branch, tag, harden, ship |
| Version bumps | Ad-hoc in `package.json` | Semver with changelog entry |
| Tags | Inconsistent naming | `vX.Y.Z` / `vX.Y.Z-rc.N` |
| Rollback granularity | Entire batch | Individual PR revert |
| Time to production | Months | Days to weeks |
| Risk profile | High (big bang) | Low (incremental) |
