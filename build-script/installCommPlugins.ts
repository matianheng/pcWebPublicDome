import vue from '@vitejs/plugin-vue'
import { PluginOption } from 'vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import vueJsx from '@vitejs/plugin-vue-jsx'
import eslintPlugin from 'vite-plugin-eslint'
import path from 'path'

/**
 * ts vue3 项目开发通用插件
 * @param command
 * @param mode
 * @param pluginArr
 * @param env
 */
export function setupCommPlugins(
  command: string,
  mode: string,
  pluginArr: (PluginOption | PluginOption[])[],
  env: Record<string, string>
) {
  pluginArr.push(
    ...[
      vue(),
      vueJsx(),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]',
      }),
      eslintPlugin({
        include: [
          'src/**/*.ts',
          'src/**/*.vue',
          'src/*.ts',
          'src/*.vue',
          'src/*.js',
          'src/**/*.jsx',
          'src/**/*.txs',
          'src/*.jsx',
          'src/*.tsx',
        ],
        cache: false,
      }),
    ]
  )
}
