import { PluginOption } from 'vite'
import {
  createStyleImportPlugin,
  ElementPlusResolve,
} from 'vite-plugin-style-import'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

/**
 * vue3开发UI相关插件
 *
 * @param command
 * @param mode
 * @param pluginArr
 * @param env
 */
export function setupUIFrameworkPlugins(
  command: string,
  mode: string,
  pluginArr: (PluginOption | PluginOption[])[],
  env: Record<string, string>
) {
  pluginArr.push(
    ...[
      // 解决类Message组件样式无法自动引入问题
      createStyleImportPlugin({
        resolves: [ElementPlusResolve()],
        libs: [
          {
            // importTest 的正则表达式表示，凡属单独引入 element-plus 的 import 语句，只要不包含 useFormItem , 则自动引入 css
            // importTest: /^(?!.*useFormItem).*/,
            importTest: /[^useFormItem]/,
            libraryName: 'element-plus',
            esModule: true,
            resolveStyle: (name: string) => {
              return `element-plus/theme-chalk/${name}.css`
            },
          },
        ],
      }),
      AutoImport({
        resolvers: [ElementPlusResolver()],
        dts: './src/auto-imports.d.ts',
        eslintrc: {
          enabled: true, // Default `false`
          filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
          globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
        },
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: './src/components.d.ts',
      }),
    ]
  )
}
