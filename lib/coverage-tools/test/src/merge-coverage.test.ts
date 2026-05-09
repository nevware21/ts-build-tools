/*
 * @nevware21/ts-build-tools
 * https://github.com/nevware21/ts-build-tools
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { expect } from "@nevware21/tripwire";
import { normalizeCoverageKeys } from "../../src/merge-coverage";

describe("normalizeCoverageKeys", () => {
    it("should return an empty object for an empty input", () => {
        expect(normalizeCoverageKeys({})).deep.equals({});
    });

    it("should leave forward-slash keys unchanged", () => {
        const input = {
            "D:/project/src/foo.ts": { path: "D:/project/src/foo.ts", s: {}, b: {}, f: {}, fnMap: {}, statementMap: {}, branchMap: {} }
        };
        const result = normalizeCoverageKeys(input);
        expect(Object.keys(result)).deep.equals(["D:/project/src/foo.ts"]);
        expect(result["D:/project/src/foo.ts"].path).equals("D:/project/src/foo.ts");
    });

    it("should convert backslash keys to forward slashes", () => {
        const input = {
            "D:\\project\\src\\foo.ts": { path: "D:\\project\\src\\foo.ts", s: {}, b: {}, f: {}, fnMap: {}, statementMap: {}, branchMap: {} }
        };
        const result = normalizeCoverageKeys(input);
        expect(Object.keys(result)).deep.equals(["D:/project/src/foo.ts"]);
        expect(result["D:/project/src/foo.ts"].path).equals("D:/project/src/foo.ts");
    });

    it("should normalize both backslash and forward-slash entries to the same key", () => {
        // Simulate nyc (backslash) + karma-typescript (forward-slash) for the same file
        const input = {
            "D:\\project\\src\\foo.ts": { path: "D:\\project\\src\\foo.ts", s: { "0": 1 }, b: {}, f: {}, fnMap: {}, statementMap: {}, branchMap: {} },
            "D:/project/src/bar.ts": { path: "D:/project/src/bar.ts", s: {}, b: {}, f: {}, fnMap: {}, statementMap: {}, branchMap: {} }
        };
        const result = normalizeCoverageKeys(input);
        const keys = Object.keys(result).sort();
        expect(keys).deep.equals(["D:/project/src/bar.ts", "D:/project/src/foo.ts"]);
        expect(result["D:/project/src/foo.ts"].path).equals("D:/project/src/foo.ts");
        expect(result["D:/project/src/bar.ts"].path).equals("D:/project/src/bar.ts");
    });

    it("should not modify entries without a path property", () => {
        const input = {
            "D:\\project\\src\\foo.ts": { s: {}, b: {}, f: {}, fnMap: {}, statementMap: {}, branchMap: {} }
        };
        const result = normalizeCoverageKeys(input);
        expect(Object.keys(result)).deep.equals(["D:/project/src/foo.ts"]);
        expect(result["D:/project/src/foo.ts"].path).equals(undefined);
    });
});
