/// <reference types="vitest" />
import { ConfigEnv, loadEnv, PluginOption, UserConfigExport } from 'vite'

import path from 'path'
import { setupPackageAnalyzerPlugins } from './build-script/installPackageAnalyzerPlugins'
// import { setupDebugPlugins } from './build-script/installDebugPlugins'
import { setupCompressAndRemoveConsolePlugin } from './build-script/installCompressAndRemoveConsolePlugin'
import { setupUIFrameworkPlugins } from './build-script/installUIFrameworkPlugins'
import { setupCommPlugins } from './build-script/installCommPlugins'
import { setupLegacyPlugin } from './build-script/installLegacyPlugin'
import { optimizeDepsIncludes } from './viteOptimizeDeps'
import dayjs from 'dayjs'
import pkg from './package.json'

function _resolve(dir: string) {
  return path.resolve(__dirname, dir)
}

export default ({ command, mode }: ConfigEnv): UserConfigExport => {
  const root = process.cwd()
  // 读取.env中配置的环境变量
  const env = loadEnv(mode, root)
  console.log(
    '执行命令: ',
    command,
    ', mode:',
    mode,
    ', env配置文件数据: ',
    env
  )

  const { dependencies, devDependencies, name, version } = pkg
  const __APP_INFO__ = {
    pkg: { dependencies, devDependencies, name, version },
    lastBuildTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
  }

  const vitePluginArr: (PluginOption | PluginOption[])[] = []
  setupCommPlugins(command, mode, vitePluginArr, env)
  setupUIFrameworkPlugins(command, mode, vitePluginArr, env)
  setupPackageAnalyzerPlugins(command, mode, vitePluginArr, env)
  // setupDebugPlugins(command, mode, vitePluginArr, env)
  setupLegacyPlugin(command, mode, vitePluginArr, env)
  setupCompressAndRemoveConsolePlugin(
    command,
    mode,
    vitePluginArr,
    env,
    version
  )

  const resultConfig: UserConfigExport = {
    optimizeDeps: optimizeDepsIncludes(mode),
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use '@/assets/scss/_functions.scss' as *;
@use '@/assets/scss/_mixins.scss' as *;`,
        },
      },
    },
    plugins: vitePluginArr,
    test: {
      environment: 'jsdom',
      include: ['test/**/*.test.ts'],
      server: {
        deps: {
          inline: ['element-plus'],
        },
      },
      root: __dirname,
      setupFiles: ['./test/vitest.setup.ts'],
    },
    // 默认为/, 用于发布在非根目录的时候需要设置该值
    base: env.VITE_PUBLIC_BASEPATH,
    server: {
      // 该配置用于服务器启动时提高初始页面加载速度，并防止转换瀑布(效果不明显)
      warmup: {
        clientFiles: ['./index.html', './src/{pages,components,utils}/*'],
      },
      host: '0.0.0.0',
      port: 4200,
      open: true,
      proxy: {
        '/api': {
          target: env.VITE_PROXY_TARGET,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
    resolve: {
      alias: {
        '@': _resolve('src'),
      },
    },
    build: {
      sourcemap: mode !== 'analyzer',
      minify: 'terser', // 启用 terser 压缩
      terserOptions: {
        format: {
          comments: false, //删除代码注释
        },
        compress: {
          pure_funcs: ['console.log'], // 只删除 console.log
          drop_debugger: true, // 删除 debugger
        },
      },
    },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
  }
  return resultConfig
}
