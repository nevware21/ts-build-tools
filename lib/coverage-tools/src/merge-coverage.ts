/*
 * @nevware21/ts-build-tools
 * https://github.com/nevware21/ts-build-tools
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const glob = require("glob");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const istanbulCoverage = require("istanbul-lib-coverage");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const istanbulReport = require("istanbul-lib-report");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const istanbulReportGenerator = require("istanbul-reports");

import { IMergeCoverageArgs } from "./interfaces/IMergeCoverageArgs";
import { getJson } from "./utils";

export function mergeCoverage(cfg: IMergeCoverageArgs) {
    let rootPath = cfg.coverageRoot;
    if (!rootPath) {
        if (fs.existsSync("./coverage")) {
            rootPath = "./coverage";
        } else if (fs.existsSync("../coverage")) {
            rootPath = "../coverage";
        } else if (fs.existsSync("../../coverage")) {
            rootPath = "../../coverage";
        } else {
            console.error("No coverage directory found in parent or current directory");
            return;
        }
    }

    console.log(`Merging coverage files in ${rootPath} - [${fs.realpathSync(rootPath)}]`);
    // Find any files named "coverage-final.json" (excluding any existing merged one)
    let jsonFiles = glob.sync(`${rootPath}/**/coverage-final.json`)
        .filter((possibleFile: any) => (possibleFile.indexOf("report") === -1 && possibleFile.indexOf("coverage/coverage-final.json") === -1));

    console.log(`Found ${jsonFiles.length} coverage files to merge:`);
    jsonFiles.forEach((file: any) => console.log(`  merging: ${file}`));

    // Load the json blobs from the discovered .json files
    var jsonBlobs = jsonFiles.map((file: any) => getJson(file));

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