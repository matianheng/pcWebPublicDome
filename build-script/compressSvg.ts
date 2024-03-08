import { optimize } from 'svgo'
import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs'
import { resolve, join, parse } from 'path'

function compressDirSvgFile(dirFullPath: string) {
  readdirSync(dirFullPath).map(fileOrDirName => {
    const fileOrDirFullName = join(dirFullPath, fileOrDirName)
    const fileOrDirStat = statSync(fileOrDirFullName)
    if (fileOrDirStat.isDirectory()) {
      // 当前是目录, 进入该目录压缩svg文件
      compressDirSvgFile(fileOrDirFullName)
    } else if (fileOrDirStat.isFile()) {
      // 当前是文件
      const fileInfo = parse(fileOrDirFullName)
      if (fileInfo.ext && fileInfo.ext.toLowerCase() === '.svg') {
        // 当前是svg文件
        const svgContent = readFileSync(fileOrDirFullName, {
          encoding: 'utf-8',
        })
        const svgCompressResult = optimize(svgContent)
        writeFileSync(fileOrDirFullName, svgCompressResult.data, {
          encoding: 'utf-8',
        })
        console.log(`已压缩: [ ${fileOrDirFullName} ]`)
      }
    }
  })
}

const basePath = resolve('src')
const svgRootDir = join(basePath, 'assets', 'svg')

console.log(`开始压缩[ ${svgRootDir} ]目录的svg文件`)
console.log('****************')
compressDirSvgFile(svgRootDir)
console.log('****************')
