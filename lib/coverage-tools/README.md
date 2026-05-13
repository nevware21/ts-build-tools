<h1 align="center">@nevware21/coverage-tools</h1>
<h2 align="center">Tools for merging coverage reports.</h2>

![GitHub Workflow Status (main)](https://img.shields.io/github/actions/workflow/status/nevware21/ts-build-tools/ci.yml?branch=main)
[![npm version](https://badge.fury.io/js/%40nevware21%2Fcoverage-tools.svg)](https://badge.fury.io/js/%40nevware21%2Fcoverage-tools)
[![downloads](https://img.shields.io/npm/dt/%40nevware21/coverage-tools.svg)](https://www.npmjs.com/package/%40nevware21/coverage-tools)
[![downloads](https://img.shields.io/npm/dm/%40nevware21/coverage-tools.svg)](https://www.npmjs.com/package/%40nevware21/coverage-tools)

## Description

Tools for merging coverage reports.

### Quick Start

Install the npm packare: `npm install @nevware21/coverage-tools --save-dev`

> It is suggested / recommended that you use the following definition in your `package.json` so that you are compatible with any future releases as they become available
> we do not intend to make ANY known breaking changes moving forward until v2.x 
> ```json
> "@nevware21/coverage-tools": ">= 0.1.5 < 2.x"
> ```

And then just used the helper in your package.json

```json
{
    "scripts": {
        "coverage": "merge-coverage"
    }
}
```
