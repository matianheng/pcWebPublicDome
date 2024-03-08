import { readdirSync, accessSync } from 'fs'
import { DepOptimizationOptions } from 'vite'

export function optimizeDepsIncludes(
  mode: string
): DepOptimizationOptions | undefined {
  if (mode === 'development') {
    const optimizeDepsIncludes = ['element-plus/es']
    readdirSync('node_modules/element-plus/es/components').map(dirname => {
      try {
        accessSync(
          `node_modules/element-plus/es/components/${dirname}/style/css.mjs`
        )
        optimizeDepsIncludes.push(
          `element-plus/es/components/${dirname}/style/css`
        )
      } catch (error) {
        // console.log(error)
      }
    })
    readdirSync('node_modules/tinymce/plugins').map(dirname => {
      try {
        accessSync(`node_modules/tinymce/plugins/${dirname}/index.js`)
        optimizeDepsIncludes.push(`tinymce/plugins/${dirname}`)
      } catch (error) {
        // console.log(error)
      }
    })
    optimizeDepsIncludes.push(`core-js/actual/promise`)
    optimizeDepsIncludes.push(`tinymce/tinymce`)
    optimizeDepsIncludes.push(`@tinymce/tinymce-vue`)
    optimizeDepsIncludes.push(`tinymce/themes/silver`)
    optimizeDepsIncludes.push(`tinymce/icons/default`)
    console.log(
      `预构建数量[${optimizeDepsIncludes.length}], 内容: \n${optimizeDepsIncludes}`
    )
    return { include: optimizeDepsIncludes }
  }
  return undefined
}
