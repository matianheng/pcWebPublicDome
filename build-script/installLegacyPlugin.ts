import { PluginOption } from 'vite'
import legacy from '@vitejs/plugin-legacy'
// @ts-ignore
import packageInfo from '../package.json'
import { envStrValIsTrue } from './utils'

/**
 * 配置 legacy 插件, 用于兼容老版本的现代浏览器
 * @param command
 * @param mode
 * @param pluginArr
 * @param env
 */
export function setupLegacyPlugin(
  command: string,
  mode: string,
  pluginArr: (PluginOption | PluginOption[])[],
  env: Record<string, string>
) {
  if (
    command !== 'serve' &&
    mode !== 'development' &&
    mode !== 'analyzer' &&
    envStrValIsTrue(env.VITE_compatible_old_browser)
  ) {
    // 解决vue3对低版本浏览器的兼容性
    pluginArr.push(
      legacy({
        targets: packageInfo.browserslist, //需要兼容的浏览器以及对应版本，统一配置在了package.json的browserslist
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      })
    )
  }
}
