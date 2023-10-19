import { babel } from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
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

const jsInputPath = pkg.build.input.path.js;
const cssInputPath = pkg.build.input.path.css;
const outputName = pkg.build.output.name;
const outputPath = pkg.build.output.path;

export default [
    {
        input: cssInputPath,
        output: { file: `${outputPath}css/${outputName}.css`, format: "esm", banner, name: `${outputName}.css` },
        plugins: [postcss({ extract: true, minimize: true })],
    },
    {
        input: jsInputPath,
        output: [
            { file: `${outputPath}js/${outputName}.umd.js`, format: "umd", banner, name: `${outputName}.js` },
            { file: `${outputPath}js/${outputName}.esm.js`, format: "esm", banner, name: `${outputName}.js` },
        ],
    },
    {
        input: jsInputPath,
        output: [
            { file: `${outputPath}js/${outputName}.umd.js`, format: "umd", banner, name: `${outputName}.js` },
            { file: `${outputPath}js/${outputName}.esm.js`, format: "esm", banner, name: `${outputName}.js` },
        ],
    },
    {
        input: jsInputPath,
        output: [
            { file: `${outputPath}js/${outputName}.umd.min.js`, format: "umd", banner, name: `${outputName}.js` },
            { file: `${outputPath}js/${outputName}.esm.min.js`, format: "esm", banner, name: `${outputName}.js` },
        ],
        plugins: [terser()],
    },
    {
        input: jsInputPath,
        output: { file: `${outputPath}js/${outputName}.es5.js`, format: "iife", banner, name: `${outputName}.js` },
        plugins: [babel(babelOptions)],
    },
    {
        input: jsInputPath,
        output: { file: `${outputPath}js/${outputName}.es5.min.js`, format: "iife", banner, name: `${outputName}.js` },
        plugins: [babel(babelOptions), terser()],
    },
];
