# GitHub Copilot Instructions for ts-build-tools

## Project Overview

This is a mono-repo managed with [Rush](https://rushjs.io/) containing three TypeScript build-tool packages:

| Package | Folder | Description |
|---------|--------|-------------|
| `@nevware21/ts-preproc` | `lib/pre-proc/` | C-style pre-processor for TypeScript/JavaScript files |
| `@nevware21/coverage-tools` | `lib/coverage-tools/` | Tools for merging Istanbul/nyc coverage reports |
| `@nevware21/publish-npm` | `lib/publish-npm/` | Automation tool for publishing packages to npm |

All three packages are released together and share the same version number.

## Repository Structure

```
.github/          - GitHub Actions workflows, Copilot instructions, issue templates
common/           - Rush configuration and shared scripts
lib/
  coverage-tools/ - @nevware21/coverage-tools package
  pre-proc/       - @nevware21/ts-preproc package
  publish-npm/    - @nevware21/publish-npm package
shared/           - Shared source/config used across packages
CHANGELIST.md     - Release history (top = newest, includes Unreleased section)
README.md         - Root README with package table and CI badge
package.json      - Root manifest (version mirrors all packages)
rush.json         - Rush monorepo configuration
```

## Building and Testing

From the repository root:

```bash
npm run build   # rush build – builds all packages
npm run test    # rush test  – runs all package tests
```

## Release Process

### Commit Message Format

Every release commit **must** begin with:

```
[Release] Increase version to <new-version>
```

Example: `[Release] Increase version to 0.1.5`

### Files to Update on Every Release

Update **all** of the following files in a single commit:

1. **`package.json`** (root) — bump `"version"` to the new version.

2. **`lib/coverage-tools/package.json`**
   - Bump `"version"` to the new version.
   - Update the exact-pinned devDependency versions for the other internal packages (`@nevware21/publish-npm`).

3. **`lib/pre-proc/package.json`**
   - Bump `"version"` to the new version.
   - Update the exact-pinned devDependency versions for the other internal packages (`@nevware21/coverage-tools`, `@nevware21/publish-npm`).

4. **`lib/publish-npm/package.json`**
   - Bump `"version"` to the new version.

5. **`lib/coverage-tools/README.md`**
   - Update the recommended version range in the Quick Start block, e.g.:
     ```
     "@nevware21/coverage-tools": ">= <new-version> < 2.x"
     ```

6. **`lib/publish-npm/README.md`**
   - Update the recommended version range in the Quick Start block, e.g.:
     ```
     "@nevware21/publish-npm": ">= <new-version> < 2.x"
     ```

7. **`CHANGELIST.md`**
   - Move the content of the `# Unreleased` section into a new dated version section (see format below).
   - Replace the `# Unreleased` section with an empty section ready for the next round of changes.

### CHANGELIST.md Format

Each released version entry follows this pattern:

```markdown
# v<version> <Month> <Day>, <Year>

## Changelog

- <change description>

[Full changelog](https://github.com/nevware21/ts-build-tools/compare/<prev-tag>...<new-tag>)
```

**Rules for the Changelist entry:**
- Include **all items listed in the Unreleased section as-is** — do not remove, summarize, or reduce them.
- Append a **full changelog link** at the end of the entry, comparing the previous release tag to the new tag (e.g., `0.1.4...0.1.5`).
- After moving the Unreleased items, replace the `# Unreleased` block with an empty placeholder:

```markdown
# Unreleased

## Changelog

```

### Cross-Package Dependency Pinning

Internal packages (`@nevware21/coverage-tools`, `@nevware21/ts-preproc`, `@nevware21/publish-npm`) that depend on sibling packages pin the sibling to an **exact version** in `devDependencies`. These pins must be updated to the new version on every release.

## Coding Conventions

- Language: TypeScript. Rollup build outputs vary by package: `lib/pre-proc` produces ES5 and ES6 outputs, while `lib/coverage-tools` and `lib/publish-npm` currently produce ES5 outputs.
- Linting: ESLint with `@typescript-eslint` plugin; run `npm run lint` in individual packages.
- Tests: Mocha via `ts-mocha`; run `npm run test` from root or individual packages.
- No new external runtime dependencies should be introduced without discussion; prefer `@nevware21/ts-utils` utilities.
- Copyright header required on all source files:

```typescript
/*
 * @nevware21/ts-build-tools
 * https://github.com/nevware21/ts-build-tools
 *
 * Copyright (c) [year] NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */
```

## CI

CI runs on Node.js `18`, `20`, `22`, and `24` via GitHub Actions (`.github/workflows/ci.yml`). All PRs must pass CI before merging.
