/*
 * @author: Archy
 * @Date: 2021-12-14 09:59:40
 * @LastEditors: Archy
 * @LastEditTime: 2021-12-22 22:05:18
 * @FilePath: \ink-cli\src\compiler\bundler.ts
 * @description:
 */
import { resolve, parse } from 'path'
import { CWD } from '../shared/constant'
import { isMatch } from 'nanomatch'
import {
  removeDir,
  isSFC,
  isJsx,
  isDir,
  isLess,
  isFile,
  isJs,
  isMD,
  normalizePath,
  getTargetDir,
  isTsx,
  isTs,
} from '../shared/utils'
import { readdir, copy, pathExistsSync, rename } from 'fs-extra'
import { compileScript } from './compile-script'
import { compileLess } from './compile-less'
import { compileSFC } from './compile-sfc'
import { compileMd } from './compile-md'
import { getUMDConfig, mergeConfig } from '../config/config'
import { build } from 'vite'

/**
 * @description: 编译文件夹
 * @param {string} dir
 * @param {CompileOpt} options
 * @return {*}
 */
export async function compileDir(dir: string) {
  const dirs = await readdir(dir)
  await Promise.all(
    dirs.map((filename) => {
      const file = resolve(dir, filename)
      return compileFile(file)
    })
  )
}

/**
 * @description: 编译单个文件
 * @param {*} filePath
 * @param {CompileOpt} options
 * @return {*}
 */
export async function compileSingFile(filePath) {
  const { base, dir } = parse(filePath)
  const copyPath = resolve(dir, '_' + base)
  await copy(filePath, copyPath)
  pathExistsSync(filePath) && (await compileFile(filePath))
  await rename(copyPath, resolve(dir, base))
}

/**
 * @description: 编译文件
 * @param {string} file
 * @param {CompileOpt} options
 * @return {*}
 */
export async function compileFile(file: string) {
  isSFC(file) && (await compileSFC(file))
  ;(isJsx(file) || isTsx(file) || isJs(file) || isTs(file)) &&
    (await compileScript(file))
  isLess(file) && (await compileLess(file))
  isDir(file) && (await compileDir(file))
  isMD(file) && (await compileMd(file))
}

export async function umdCompile() {
  return new Promise<void>((resolve, reject) => {
    build(getUMDConfig())
      .then(() => resolve())
      .catch(reject)
  })
}

/**
 * @description: 编译预操作
 * @param {string} path
 * @param {CompileOpt} options
 * @return {*}
 */
export async function preCompile() {
  const target = process.env.COMPILE_TARGET
  if (target === 'umd') {
    // umd由vite处理
    umdCompile()
    return
  }
  const {
    compileConfig: { include, exclude },
  } = mergeConfig()
  const targetDir = getTargetDir()
  await removeDir(targetDir)
  await Promise.all(
    include.map(async (path) => {
      const fullPath = resolve(CWD, path)
      if (isFile(fullPath)) {
        // 单个文件的编译结果在文件原位置
        return compileSingFile(fullPath)
      } else if (isDir(fullPath)) {
        // 文件夹的编译结果在配置目标文件夹中
        const { base } = parse(fullPath)
        const targetPath = resolve(targetDir, base)
        await copy(fullPath, targetPath, {
          filter: (src, dest) => {
            const _exclude = exclude.map((_) => normalizePath(resolve(CWD, _)))
            const _src = normalizePath(src)
            return !isMatch(_src, _exclude)
          },
        })
        return compileDir(targetPath)
      }
    })
  )
}
