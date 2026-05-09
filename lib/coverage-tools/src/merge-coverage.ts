/*
 * @nevware21/ts-build-tools
 * https://github.com/nevware21/ts-build-tools
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const istanbulCoverage = require("istanbul-lib-coverage");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const istanbulReport = require("istanbul-lib-report");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const istanbulReportGenerator = require("istanbul-reports");

import * as fs from "fs";
import * as path from "path";
import { globbySync } from "globby";
import { IMergeCoverageArgs } from "./interfaces/IMergeCoverageArgs";
import { findPath, getJson } from "./utils";

export { IMergeCoverageArgs };

/**
 * Normalize all path keys and `path` properties in a coverage JSON blob to use
 * forward slashes. This ensures that entries produced by tools that emit
 * Windows-style backslash paths (e.g. nyc) are treated as the same file as
 * entries produced by tools that emit POSIX-style forward-slash paths
 * (e.g. karma-typescript) when istanbul merges the coverage maps.
 */
export function normalizeCoverageKeys(jsonBlob: any): any {
    const normalized: any = {};
    Object.keys(jsonBlob).forEach((key: string) => {
        const normalizedKey = key.replace(/\\/g, "/");
        const entry = jsonBlob[key];
        const normalizedEntry = entry && typeof entry === "object" ? { ...entry } : entry;

        normalized[normalizedKey] = normalizedEntry;
        if (normalizedEntry && normalizedEntry.path) {
            normalizedEntry.path = normalizedEntry.path.replace(/\\/g, "/");
        }
    });
    return normalized;
}

export function findCoverage(thePath: string): string {
    let foundPath = findPath((thePath) => {
        if (fs.existsSync(thePath + "coverage")) {
            return thePath + "coverage";
        }

        if (fs.existsSync(thePath + ".git")) {
            // Looks like we are at the root of the repo, so stop
            return null;
        }

        return;
    }, thePath);

    if (!foundPath) {
        console.error("!!! Unable to locate coverage folder [" + path.join(process.cwd(), thePath) + "]");
    }

    return foundPath;
}

export function mergeCoverage(cfg: IMergeCoverageArgs) {
    let rootPath = cfg.coverageRoot;
    if (!rootPath) {
        rootPath = findCoverage("./");
        if (!rootPath) {
            console.error("No coverage directory found in parent or current directory");
            return;
        }
    }

    console.log(`Merging coverage files in ${rootPath} - [${fs.realpathSync(rootPath)}]`);
    // Find any files named "coverage-final.json" (excluding any existing merged one)
    // Normalize to forward slashes so the filter works correctly on Windows too
    let jsonFiles = globbySync(`${rootPath}/**/coverage-final.json`)
        .map((possibleFile: string) => possibleFile.replace(/\\/g, "/"))
        .filter((possibleFile: string) => (possibleFile.indexOf("report") === -1 && possibleFile.indexOf("coverage/coverage-final.json") === -1));

    console.log(`Found ${jsonFiles.length} coverage files to merge:`);
    jsonFiles.forEach((file: string) => console.log(`  merging: ${file}`));

    // Load the json blobs from the discovered .json files, normalizing path keys
    // to forward slashes so that nyc (backslash) and karma-typescript (forward slash)
    // entries are treated as the same file on Windows.
    const jsonBlobs = jsonFiles.map((file: string) => normalizeCoverageKeys(getJson(file)));

    // Create an empty map and merge in all the loaded maps
    let mergedMap = istanbulCoverage.createCoverageMap();
    jsonBlobs.forEach((jsonBlob: any) => {
        mergedMap.merge(istanbulCoverage.createCoverageMap(jsonBlob));
    });

    // Create an empty coverage summary and merge in a file coverage
    //  summary for each of files in the merged map
    const mergedSummary = istanbulCoverage.createCoverageSummary();
    mergedMap.files().forEach((file: any) => {
        const coverageFile = mergedMap.fileCoverageFor(file);
        const coverageSummary = coverageFile.toSummary();
        mergedSummary.merge(coverageSummary);
    });

    // Generate the report
    const reportGenerationContext = istanbulReport.createContext({
        dir: `${rootPath}/report`,
        defaultSummarizer: "nested",
        coverageMap: mergedMap
    });

    // call execute to synchronously create and write the report to disk
    const report = istanbulReportGenerator.create("html-spa");
    report.execute(reportGenerationContext);

    const txtReport = istanbulReportGenerator.create("text");
    txtReport.execute(istanbulReport.createContext({
        coverageMap: mergedMap
    }));

    const jsonReport = istanbulReportGenerator.create("json");
    jsonReport.execute(istanbulReport.createContext({
        dir: rootPath,

        coverageMap: mergedMap
    }));


    console.log(`Merged coverage generated in ${rootPath}/report`);
}