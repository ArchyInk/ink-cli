/*
 * @author: Archy
 * @Date: 2021-12-14 09:53:57
 * @LastEditors: Archy
 * @LastEditTime: 2021-12-20 23:48:58
 * @FilePath: \ink-cli\src\cli.ts
 * @description:
 */
import { Command } from 'commander'
import { compile } from './commands'
const program = new Command()
program
  .command('compile')
  .description('Compile dir')
  .option('-p,--path [dirPath]', 'the dir or file need to compile')
  .option('-op,--optPath [optPath]', 'the compiler config file')
  .action(compile)

program.parse()
