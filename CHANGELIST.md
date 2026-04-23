# Unreleased

## Changelog

- [Breaking][Tooling] Updated the CI Node.js matrix to `18`, `20`, `22`, and `24`; removed Node.js `16`.
  - Why: Node.js 16 is EOL and current dependencies (for example `@pnpm/error` and `puppeteer`) now require Node.js 18+.
  - Why: CI started failing on Node.js 16 because required runtime features like `structuredClone` are not available.

# v0.1.4 Nov 18th, 2024

## Changelog

- [#48](https://github.com/nevware21/ts-build-tools/issues/48) [Bug] Error message dumps entire script on error #48 [#49](https://github.com/nevware21/ts-build-tools/pull/49)

# v0.1.3 Nov 17th, 2024

## Changelog

- [#40](https://github.com/nevware21/ts-build-tools/issues/40) [Bug] publish-npm with no config file #40 [#41](https://github.com/nevware21/ts-build-tools/pull/41)

# v0.1.2 Nov 17th, 2024

## Changelog

- [#37](https://github.com/nevware21/ts-build-tools/issues/37) [Bug] Update the default location of the package-groups.json
- Added support for auto locating the repo root when not specified

# v0.1.1 Nov 16th, 2024

## Changelog

- [#34](https://github.com/nevware21/ts-build-tools/issues/34) [Bug] The bin files are not created correctly on install #34 [#35](https://github.com/nevware21/ts-build-tools/pull/35)


# v0.1.0 Nov 16th, 2024

## ChangeLog

Initial release of all CLI tools as separate packages, this initial release is to primarily support the release process for the @nevware21 projects.

To date these tools have existed within the individual repo's ( [`@nevware21/ts-utils`](https://github.com/nevware21/ts-utils); [`@nevware21/ts-async`](https://github.com/nevware21/ts-utils); [`@nevware21/grunt-plugins`](https://github.com/nevware21/grunt-plugins); and [`@nevware21/tripwire`](https://github.com/nevware21/tripwire) ) is various forms and mostly the same set of features. As individually released projects the code has been refactored to be more generic while still providing the same functionality. Moving forward these tools will be extended as required, including any community requests.

-  @nevware21/coverage-tools
  - merge-coverage

- @nevware21/ts-preproc
  - ts-preproc
  - ts-preproc-restore

- @nevware21/publish-npm
  - publish-npm
