import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import cleanup from "rollup-plugin-cleanup";

const UglifyJs = require('uglify-js');

const version = require("./package.json").version;
const banner = [
    "/*!",
    ` * NevWare21 Solutions LLC - pre-proc, ${version}`,
    " * https://github.com/nevware21/ts-build-tools",
    " * Copyright (c) NevWare21 Solutions LLC and contributors. All rights reserved.",
    " * Licensed under the MIT license.",
    " */"
].join("\n");

function isSourceMapEnabled(options) {
    if (options) {
        return options.sourceMap !== false && options.sourcemap !== false;
    }

    return false;
}

function _doMinify(code, filename, options, chunkOptions) {
    var theCode = {};
    theCode[filename] = code;

    let theOptions = Object.assign({}, options);
    if (theOptions.hasOwnProperty("sourcemap")) {
        delete theOptions.sourcemap;
    }

    if (isSourceMapEnabled(options)) {
        theOptions.sourceMap = {
            filename: filename
        };
        if (filename) {
            theOptions.sourceMap.url = filename + ".map";
        }
    }

    var result = UglifyJs.minify(theCode, theOptions);

    if (result.error) {
        throw new Error(JSON.stringify(result.error));
    }

    var transform = {
        code: result.code
    };

    if (isSourceMapEnabled(options) && result.map) {
        transform.map = result.map;
    }

    return transform;
}

export function uglify3(options = {}) {

    return {
        name: "internal-rollup-uglify-js",
        renderChunk(code, chunk, chkOpt) {
            return _doMinify(code, chunk.filename, options, chkOpt);
        }
    }
}

const rollupConfigMainEntry = (srcPath, destPath, path, format, entryPoint = "index.js", outputName = "preproc", bannerPrefix = undefined) => {
    let mainFields = [ "module", "main" ];
    if (destPath === "es6") {
        mainFields = [ "esnext", "module", "main" ];
    }

    const taskRollupConfig = {
        input: `./${srcPath}/${entryPoint}`,
        output: {
            file: `./${destPath}/${path}/${outputName}.js`,
            banner: bannerPrefix ? (bannerPrefix + "\n" + banner) : banner,
            format: format,
            freeze: false,
            sourcemap: true
        },
        plugins: [
            nodeResolve({
                mainFields: mainFields,
                preferBuiltins: true
            }),
            commonjs(),
            cleanup({
                comments: [
                    /[#@]__/,
                    /^!/,
                    "some",
                    "ts"
                ]
            }),
            uglify3({
                ie8: false,
                toplevel: true,
                compress: {
                    passes:3,
                    unsafe: true
                },
                output: {
                    preamble: banner,
                    webkit:true
                }
            })
        ]
    };

    return taskRollupConfig;
};

export default [
    rollupConfigMainEntry("build/es5/mod", "dist", "bin", "cjs", "cli/preProcCli.js", "ts-preproc",  "#!/usr/bin/env node"),
    rollupConfigMainEntry("build/es5/mod", "dist", "bin", "cjs", "cli/preProcRestoreCli.js", "ts-preproc-restore",  "#!/usr/bin/env node"),

    rollupConfigMainEntry("build/es5/mod", "dist/es5", "main", "cjs"),
    rollupConfigMainEntry("build/es6/mod", "dist/es6", "main", "cjs"),
    rollupConfigMainEntry("build/es5/mod", "dist/es5", "mod", "es"),
    rollupConfigMainEntry("build/es6/mod", "dist/es6", "mod", "es"),
];
