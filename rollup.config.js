import { babel } from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import pkg from "./package.json" assert { type: "json" };

const banner = `/*
 * svg-path-helper.js v${pkg.version}
 * Copyright © ${new Date().getFullYear()} o0sh4d0w0o
 * Released under the MIT license
 * @copyright
*/`;

const outputPath = "build/";

const babelOptions = {
    presets: ["@babel/preset-env"],
    babelHelpers: "bundled",
};

export default [
    {
        input: pkg.main,
        output: [
            { file: `${outputPath}${pkg.name}.umd.js`, format: "umd", banner, name: pkg.main },
            { file: `${outputPath}${pkg.name}.esm.js`, format: "esm", banner, name: pkg.main },
        ],
    },
    {
        input: pkg.main,
        output: [
            { file: `${outputPath}${pkg.name}.umd.min.js`, format: "umd", banner, name: pkg.main },
            { file: `${outputPath}${pkg.name}.esm.min.js`, format: "esm", banner, name: pkg.main },
        ],
        plugins: [terser()],
    },
    {
        input: pkg.main,
        output: { file: `${outputPath}${pkg.name}.es5.js`, format: "iife", banner, name: pkg.main },
        plugins: [babel(babelOptions)],
    },
    {
        input: pkg.main,
        output: { file: `${outputPath}${pkg.name}.es5.min.js`, format: "iife", banner, name: pkg.main },
        plugins: [babel(babelOptions), terser()],
    },
];
