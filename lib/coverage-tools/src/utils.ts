/*
 * @nevware21/ts-build-tools
 * https://github.com/nevware21/ts-build-tools
 *
 * Copyright (c) 2023 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import * as fs from "fs";
import * as path from "path";
import { strEndsWith, strLeft, strRight } from "@nevware21/ts-utils";

export function removeJsonTrailingComma(text: string): string {
    return text.replace(/,(\s*[}\],])/g, "$1");
}

export function removeComments(text: string): string {
    return text.replace(/(\s*\/\/\s*.*$)|(\s*$)/gm, "");
}

// Helper to load a json blob from a .json file
export function getJson(fileName: string) {
    let value = removeComments(removeJsonTrailingComma(fs.readFileSync(fileName, "utf-8")));
    return JSON.parse(value);
}

export function findPath(cb: (thePath: string) => string, thePath: string, cnt = 0): string {
    if (thePath && strRight(thePath, 1) != "/") {
        thePath += "/";
    }

    if (!thePath) {
        thePath = "./";
    }

    thePath = thePath.replace(/\\/g, "/").replace("/./", "/");
    let foundPath = cb(thePath);
    if (foundPath || foundPath === null) {
        return foundPath ? foundPath.replace(/\\/g, "/") : foundPath;
    }

    let current: string;
    if (!path.isAbsolute(thePath)) {
        current = path.normalize(path.join(process.cwd(), thePath));
    } else {
        current = path.normalize(thePath);
    }

    let checkPath = thePath;
    if (!path.isAbsolute(thePath)) {
        checkPath = path.normalize(path.join(process.cwd(), thePath));
    }

    if (current == path.normalize(checkPath + "../")) {
        // Looks like we are at the root of the file system, so stop
        return null;
    }

    if (cnt > 10) {
        return null;
    }

    if (thePath == "./") {
        thePath = "";
    }

    return findPath(cb, thePath + "../", cnt + 1);
}

/**
 * Normalize all path keys and `path` properties in a coverage JSON blob to use
 * forward slashes. This ensures that entries produced by tools that emit
 * Windows-style backslash paths (e.g. nyc) are treated as the same file as
 * entries produced by tools that emit POSIX-style forward-slash paths
 * (e.g. karma-typescript) when istanbul merges the coverage maps.
 *
 * Returns a new object; does not mutate the input.
 */
export function normalizeCoverageKeys(jsonBlob: Record<string, any>): Record<string, any> {
    const normalized: Record<string, any> = {};
    Object.keys(jsonBlob).forEach((key: string) => {
        const normalizedKey = key.replace(/\\/g, "/");
        const entry = jsonBlob[key];
        const normalizedEntry = entry && typeof entry === "object" ? { ...entry } : entry;

        if (normalizedEntry && normalizedEntry.path) {
            normalizedEntry.path = normalizedEntry.path.replace(/\\/g, "/");
        }

        // The later entry wins if both a backslash-keyed and a forward-slash-keyed entry
        // normalize to the same key. Cross-blob merging is handled by istanbul in the
        // main mergeCoverage loop.
        normalized[normalizedKey] = normalizedEntry;
    });
    return normalized;
}

export function findRepoRoot(thePath: string): string {
    let foundPath = findPath((thePath) => {
        console.log("Checking [" + thePath + ".git]");
        if (fs.existsSync(thePath + ".git")) {
            // Looks like we are at the root of the repo, so stop
            return thePath.replace(/\\/g, "/").replace("/./", "/");
        }

        return;
    }, thePath);

    if (!foundPath) {
        console.error("!!! Unable to locate the repo root [" + path.join(process.cwd(), thePath) + "]");
    } else {
        while (foundPath && strEndsWith(foundPath, "/")) {
            foundPath = strLeft(foundPath, foundPath.length - 1);
        }
    }

    return foundPath;
}

