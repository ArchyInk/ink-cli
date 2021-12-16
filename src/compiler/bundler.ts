/*
 * @author: Archy
 * @Date: 2021-12-14 09:59:40
 * @LastEditors: Archy
 * @LastEditTime: 2021-12-16 21:31:11
 * @FilePath: \ink-cli\src\compiler\bundler.ts
 * @description:
 */
import { resolve, parse } from 'path'
import { CWD, ES_DIR, TARGET_DIC } from '../shared/constant'
import {
  removeDir,
  isSFC,
  isJsx,
  isDir,
  isLess,
  isFile,
  isJs,
} from '../shared/utils'
import { readdir, copy, pathExistsSync, rename } from 'fs-extra'
import { compileJsx } from './compile-jsx'
import { compileLess } from './compile-less'
import { compileSFC } from './compile-sfc'
import { compileJs } from './compile-js'
import type { CompileOpt } from '../types/compiler'

/**
 * @description: 编译文件夹
 * @param {string} dir
 * @param {CompileOpt} options
 * @return {*}
 */
export async function compileDir(dir: string, options?: CompileOpt) {
  const dirs = await readdir(dir)
  await Promise.all(
    dirs.map((filename) => {
      const file = resolve(dir, filename)
      return compileFile(file, options)
    })
  )
}

/**
 * @description: 编译单个文件
 * @param {*} filePath
 * @param {CompileOpt} options
 * @return {*}
 */
export async function compileSingFile(filePath, options?: CompileOpt) {
  const { base, dir } = parse(filePath)
  const copyPath = resolve(dir, '_' + base)
  await copy(filePath, copyPath)
  pathExistsSync(filePath) && (await compileFile(filePath, options))
  await rename(copyPath, resolve(dir, base))
}

/**
 * @description: 编译文件
 * @param {string} file
 * @param {CompileOpt} options
 * @return {*}
 */
export async function compileFile(file: string, options?: CompileOpt) {
  const { sfcOptions, babelConfig, lessOptions } = options
  isSFC(file) && (await compileSFC(file, sfcOptions))
  // isJs(file) && (await compileJs(file, babelOptions))
  isJsx(file) && (await compileJsx(file, babelConfig))
  isLess(file) && (await compileLess(file, lessOptions))
  isDir(file) && (await compileDir(file, options))
}

/**
 * @description: 编译预操作
 * @param {string} path
 * @param {CompileOpt} options
 * @return {*}
 */
export async function preCompile(path: string, options?: CompileOpt) {

    const fullPath = resolve(CWD, path)
    if (isFile(fullPath)) {
      await compileSingFile(fullPath, options)
    } else if (isDir(fullPath)) {
      await removeDir(path)
      await copy(fullPath, path)
      await compileDir(path, options)
    }
}
