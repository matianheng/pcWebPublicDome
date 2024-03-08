import { PluginOption } from 'vite'
import { envStrValIsTrue } from './utils'
// import {VueDevTools} from 'vite-plugin-vue-devtools'
import mockDevServerPlugin from 'vite-plugin-mock-dev-server'

/**
 * 代码调试相关插件
 *
 * @param command
 * @param mode
 * @param pluginArr
 * @param env
 */
export function setupDebugPlugins(
  command: string,
  mode: string,
  pluginArr: (PluginOption | PluginOption[])[],
  env: Record<string, string>
) {
  if (mode === 'development') {
    // pluginArr.push(VueDevTools())
    pluginArr.push(
      mockDevServerPlugin({
        prefix: '/local-mock-api',
        include: 'local-mock/**/*.ts',
      })
    )
  }
}
