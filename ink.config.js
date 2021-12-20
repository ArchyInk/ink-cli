/*
 * @Author: Archy
 * @Date: 2021-12-17 19:35:55
 * @LastEditors: Archy
 * @LastEditTime: 2021-12-20 15:20:09
 * @FilePath: \ink-cli\ink.config.js
 * @description:
 */
module.exports = {
  compileConfig: {
    babelConfig: {
      plugins: ["@vue/babel-plugin-jsx"],
    },
  },
  include: ["mock", "mock2"],
  exclude: ["mock/ignore/**/*"],
  target: ["commonjs", "esmodule"],
  output: {
    esm: "esm",
    cjs: "cjs",
  },
};