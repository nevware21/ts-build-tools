<h1 align="center">@nevware21/ts-build-tools</h1>
<h2 align="center">This repo is a mono-repo containing TypeScript build tools</h2>

![GitHub Workflow Status (main)](https://img.shields.io/github/actions/workflow/status/nevware21/ts-build-tools/ci.yml?branch=main)
![GitHub Issues](https://img.shields.io/github/issues/nevware21/ts-build-tools)
![Pull Requests](https://img.shields.io/github/issues-pr/nevware21/ts-build-tools)
![GitHub Release Date](https://img.shields.io/github/release-date/nevware21/ts-build-tools)
<!-- [![codecov](https://codecov.io/gh/nevware21/ts-build-tools/graph/badge.svg?token=xDZAwPRKtX)](https://codecov.io/gh/nevware21/ts-build-tools) -->


## Description

This is a mono-repo containing multiple TypeScript build tools:

CI validation currently runs on Node.js `18`, `20`, `22`, and `24`.

| Package                                                | Description                              | Details
| -------------------------------------------------------|------------------------------------------|----------
| [@nevware21/<wbr>ts&#8209;preproc](./lib/pre-proc/README.md)<br><ul><li>ts&#8209;preproc</li><li>ts&#8209;preproc&#8209;restore</li></ul> | A simple pre-processor which can be run against your TypeScript or JavaScript files using single line comments to comment out the code which does not "pass" the pre-processor directives. | [![npm version](https://badge.fury.io/js/%40nevware21%2Fts-preproc.svg)](https://badge.fury.io/js/%40nevware21%2Fts-preproc) [![downloads](https://img.shields.io/npm/dt/%40nevware21/ts-preproc.svg)](https://www.npmjs.com/package/%40nevware21/ts-preproc) [![downloads](https://img.shields.io/npm/dm/%40nevware21/ts-preproc.svg)](https://www.npmjs.com/package/%40nevware21/ts-preproc)
| [@nevware21/<wbr>publish&#8209;npm](./lib/publish-npm/README.md)<br><ul><li>publish&#8209;npm</li></ul> | Simple tools for automating the publishing of packages to npm. | [![npm version](https://badge.fury.io/js/%40nevware21%2Fpublish-npm.svg)](https://badge.fury.io/js/%40nevware21%2Fpublish-npm) [![downloads](https://img.shields.io/npm/dt/%40nevware21/publish-npm.svg)](https://www.npmjs.com/package/%40nevware21/publish-npm) [![downloads](https://img.shields.io/npm/dm/%40nevware21/publish-npm.svg)](https://www.npmjs.com/package/%40nevware21/publish-npm)
| [@nevware21/<wbr>coverage&#8209;tools](./lib/coverage-tools/README.md)<br><ul><li>merge&#8209;coverage</li></ul> | Tools for merging coverage reports. | [![npm version](https://badge.fury.io/js/%40nevware21%2Fcoverage-tools.svg)](https://badge.fury.io/js/%40nevware21%2Fcoverage-tools) [![downloads](https://img.shields.io/npm/dt/%40nevware21/coverage-tools.svg)](https://www.npmjs.com/package/%40nevware21/coverage-tools) [![downloads](https://img.shields.io/npm/dm/%40nevware21/coverage-tools.svg)](https://www.npmjs.com/package/%40nevware21/coverage-tools)


> To date (v0.1.0) these tools have existed within the individual repo's ( [`@nevware21/ts-utils`](https://github.com/nevware21/ts-utils); [`@nevware21/ts-async`](https://github.com/nevware21/ts-utils); [`@nevware21/grunt-plugins`](https://github.com/nevware21/grunt-plugins); and [`@nevware21/tripwire`](https://github.com/nevware21/tripwire) ) is various forms and mostly the same set of features. As individually released projects the code has been refactored to be more generic while still providing the same functionality. Moving forward these tools will be extended as required, including any community requests.
