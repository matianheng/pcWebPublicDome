import { compile } from 'sass'
import { globSync } from 'glob'
import path from 'path'
import { writeFileSync, mkdirSync, existsSync } from 'fs'

const pattern = 'dist/**/*.scss'
const files = globSync(pattern)

console.log(
  `准备将表达式【 ${pattern} 】匹配到的【 ${files.length} 】个文件,编译为css文件`
)
console.log('=========================')
let count = 0
files.forEach(item => {
  const sourceFileFullPath = path.resolve(item)
  //   console.log(sourceFileFullPath)
  const result = compile(sourceFileFullPath)
  const filePathInfo = path.parse(sourceFileFullPath)
  //   console.log(filePathInfo)
  const cssFileName = filePathInfo.name + '.css'
  // 文件所在目录
  const fileDir = filePathInfo.dir
  const targetDir = path.join(fileDir, 'dist')
  if (!existsSync(targetDir)) {
    // 文件夹不存在,则创建文件夹
    mkdirSync(targetDir, { recursive: true })
  }
  const targetFileFullPath = path.join(targetDir, cssFileName)
  writeFileSync(targetFileFullPath, result.css)
  console.log(filePathInfo.base, '编译为css文件:', targetFileFullPath)
  count += 1
})
console.log('=========================')
console.log(
  `css文件编译完毕, 预计编译【 ${files.length} 】个文件,实际编译完成【 ${count} 】个文件\n`
)
