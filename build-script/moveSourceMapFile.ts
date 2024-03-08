import { globSync } from 'glob'
import path from 'path'
import fs from 'fs'
import { rimrafSync } from 'rimraf'

const jsMapsDir = path.resolve('js-maps')
// 删除 js-maps 目录
rimrafSync(jsMapsDir)
// 新建 js-maps 目录
if (!fs.existsSync(jsMapsDir)) {
  fs.mkdirSync(jsMapsDir)
}
console.log('已清空 [js-maps] 目录', jsMapsDir)

const pattern = 'dist/**/*.js.map'
const files = globSync(pattern)
console.log(
  `开始移动表达式【 ${pattern} 】匹配到的 sourcemap 文件, 到 js-maps 目录`
)

console.log('=========================')
let moveFileCount = 0
files.forEach(item => {
  const sourceFileFullPath = path.resolve(item)
  const fileName = path.basename(sourceFileFullPath)
  const targetFileFullPath = path.resolve(path.join('js-maps', fileName))
  fs.renameSync(sourceFileFullPath, targetFileFullPath)
  console.log(`移动 [${fileName}] 文件到 js-maps 目录`)
  moveFileCount += 1
})
console.log('=========================')
console.log(
  `预计移动【 ${files.length} 】个文件, 实际移动 【 ${moveFileCount} 】 个文件\n`
)
