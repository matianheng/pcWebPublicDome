import { PluginOption } from 'vite'
import { envStrValIsTrue } from './utils'
import removeConsole from 'vite-plugin-remove-console'
import viteCompression from 'vite-plugin-compression'
import uglifyHtmlPlugin from './uglifyHtmlPlugin'

/**
 * 打包结果压缩以及console.log代码删除以及低版本浏览器兼容性插件
 * @param command
 * @param mode
 * @param pluginArr
 * @param env
 */
export function setupCompressAndRemoveConsolePlugin(
  command: string,
  mode: string,
  pluginArr: (PluginOption | PluginOption[])[],
  env: Record<string, string>,
  version: string
) {
  if (command !== 'serve' && mode !== 'development') {
    pluginArr.push(uglifyHtmlPlugin(version))
    if (envStrValIsTrue(env.VITE_REMOVE_CONSOLE)) {
      pluginArr.push(removeConsole())
    }
    pluginArr.push(
      /*
        该插件用于在原打包结果文件基础上再对原始文件进行gz压缩，并形成额外的gz文件。
        nginx也有gzip功能，为什么前端还要打包成gz文件? 
        nginx是动态生成gz文件，前端打包是静态生成gz文件，极端情况，能节省服务器的计算资源
         */
      viteCompression({
        // 是否在控制台输出压缩结果
        verbose: true,
        // 如果不想压缩某个文件：则启用下面这个方法，通过file判断文件名，返回true和false控制是否压缩
        // filter:(file:string)=>true
        // 大于50kb才压缩
        threshold: 51200,
      })
    )
  }
}
