import { PluginOption } from 'vite'
import { envStrValIsTrue } from './utils'
import { visualizer } from 'rollup-plugin-visualizer'

/**
 * 打包产物分析相关插件
 *
 * @param command
 * @param mode
 * @param pluginArr
 * @param env
 */
export function setupPackageAnalyzerPlugins(
  command: string,
  mode: string,
  pluginArr: (PluginOption | PluginOption[])[],
  env: Record<string, string>
) {
  // 是否进行包分析
  if (envStrValIsTrue(env.VITE_PACKAGE_ANALYZER)) {
    // 启用包分析
    pluginArr.push(
      visualizer({
        filename: './node_modules/.cache/visualizer/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
      }) as unknown as PluginOption
    )
  }
}
