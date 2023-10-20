import { babel } from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import replace from "@rollup/plugin-replace";
import postcss from "rollup-plugin-postcss";
import pkg from "./package.json" assert { type: "json" };

const banner = `/*
 * svg-path-helper v${pkg.version}
 * Copyright © ${new Date().getFullYear()} o0sh4d0w0o
 * Released under the MIT license
 * @copyright
*/`;

const babelOptions = {
    presets: ["@babel/preset-env"],
    babelHelpers: "bundled",
};

const postcssOptions = { extract: true, minimize: true };
const deployReplaceOptions = {
    "../../build": "../build",
    delimiters: ["", ""],
    preventAssignment: true,
};

const isDeploy = process.env.MODE === "deploy";
const buildProcess = [];
const deployProcess = [];

if (isDeploy) {
    const outputCssName = pkg.build.output.demoCSSName;
    const outputJsName = pkg.build.output.demoJSName;
    const outputPath = pkg.build.output.demoPath;

    deployProcess.push({
        input: pkg.build.input.path.demoCss,
        output: { file: `${outputPath}css/${outputCssName}.css`, format: "esm", banner, name: `${outputCssName}.css` },
        plugins: [replace(deployReplaceOptions), postcss(postcssOptions)],
    });

    deployProcess.push({
        input: pkg.build.input.path.demoJs,
        external: () => true,
        output: { file: `${outputPath}js/${outputJsName}.js`, format: "esm", banner, name: `${outputJsName}.js` },
        plugins: [replace(deployReplaceOptions), terser()],
    });
} else {
    const jsInputPath = pkg.build.input.path.js;
    const cssInputPath = pkg.build.input.path.css;
    const outputName = pkg.build.output.name;
    const outputPath = pkg.build.output.path;

    buildProcess.push({
        input: cssInputPath,
        output: { file: `${outputPath}css/${outputName}.css`, format: "esm", banner, name: `${outputName}.css` },
        plugins: [postcss(postcssOptions)],
    });

    buildProcess.push({
        input: jsInputPath,
        output: [
            { file: `${outputPath}js/${outputName}.umd.js`, format: "umd", banner, name: `${outputName}.js` },
            { file: `${outputPath}js/${outputName}.esm.js`, format: "esm", banner, name: `${outputName}.js` },
        ],
    });

    buildProcess.push({
        input: jsInputPath,
        output: [
            { file: `${outputPath}js/${outputName}.umd.min.js`, format: "umd", banner, name: `${outputName}.js` },
            { file: `${outputPath}js/${outputName}.esm.min.js`, format: "esm", banner, name: `${outputName}.js` },
        ],
        plugins: [terser()],
    });

    buildProcess.push({
        input: jsInputPath,
        output: { file: `${outputPath}js/${outputName}.es5.js`, format: "iife", banner, name: `${outputName}.js` },
        plugins: [babel(babelOptions)],
    });

    buildProcess.push({
        input: jsInputPath,
        output: { file: `${outputPath}js/${outputName}.es5.min.js`, format: "iife", banner, name: `${outputName}.js` },
        plugins: [babel(babelOptions), terser()],
    });
}

export default [...buildProcess, ...deployProcess];
