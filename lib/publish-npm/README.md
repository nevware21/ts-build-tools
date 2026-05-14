<h1 align="center">@nevware21/publish-npm</h1>
<h2 align="center">Tools to automate the publishing packages to npm.</h2>

![GitHub Workflow Status (main)](https://img.shields.io/github/actions/workflow/status/nevware21/ts-build-tools/ci.yml?branch=main)
[![npm version](https://badge.fury.io/js/%40nevware21%2Fts-preproc.svg)](https://badge.fury.io/js/%40nevware21%2Fts-preproc)
[![downloads](https://img.shields.io/npm/dt/%40nevware21/ts-preproc.svg)](https://www.npmjs.com/package/%40nevware21/ts-preproc)
[![downloads](https://img.shields.io/npm/dm/%40nevware21/ts-preproc.svg)](https://www.npmjs.com/package/%40nevware21/ts-preproc)

## Description

Simple tools for automating the publishing of packages to npm.


### Quick Start

Install the npm packare: `npm install @nevware21/publish-npm --save-dev`

> It is suggested / recommended that you use the following definition in your `package.json` so that you are compatible with any future releases as they become available
> we do not intend to make ANY known breaking changes moving forward until v2.x 
> ```json
> "@nevware21/publish-npm": ">= 0.1.5 < 2.x"
> ```

Create a configuration file with your group settings, where the
- `default` identifies the default group when no group is passed on the command line
- each `group` identifies the path to the repo where the `package.json` will be loaded to obtain the `name`

```json
// ------------------------------
// NPM Publish group definitions
// ------------------------------
{
    "repoRoot": "../../..",
    "default": "all",
    "groups": {
        "all": [
            "./lib/pre-proc",
            "./lib/coverage-tools",
            "./lib/publish-npm"
        ],
        "preProc": [
            "./lib/pre-proc"
        ],
        "mergeCoverage": [
            "./lib/coverage-tools"
        ],
        "npmPublish": [
            "./lib/publish-npm"
        ]
    }
}
```
And then just used the helper in your package.json

```json
{
    "scripts": {
        "publish-npm": "publish-npm groupName"
    }
}
```
