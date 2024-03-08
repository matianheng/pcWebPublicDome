import htmlnano from 'htmlnano'
import type { HtmlnanoOptions } from 'htmlnano'
export interface UserOptions {
  version: string
}
/**
 * 压缩html，并将页面的`__system_package-version__`替换为`version`
 * @param version 版本号
 * @returns
 */
const uglifyHtmlPlugin = (version: string) => {
  return {
    name: 'uglifyHtmlPlugin', // 必须的，将会在 warning 和 error 中显示
    async transformIndexHtml(html: string) {
      const htmlVersion = html
        .replace(/__system_package-version__/g, version)
        .replace(/__TIME_SECOND__/g, `${new Date().getTime()}`)
      // 对html页面进行压缩
      const options: HtmlnanoOptions = {
        removeComments: true,
        removeEmptyAttributes: true, // Disable the module "removeEmptyAttributes"
        collapseWhitespace: 'conservative', // Pass options to the module "collapseWhitespace"
        removeOptionalTags: true,
      }
      const ret = await htmlnano.process(htmlVersion, options)
      return ret.html
    },
  }
}
export default uglifyHtmlPlugin
