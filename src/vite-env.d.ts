/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<
    Record<string, unknown>,
    Record<string, unknown>,
    any
  >
  export default component
}
declare module '*.json' {
  const value: any
  export default value
}
/**
 * env配置文件boolean值类型
 */
type ENV_BOOLEAN_VALUE_TYPE = 'true' | 'false' | '' | undefined
// 这个ImportMetaEnv的类型声明的作用，是为了让我们在使用自定义的环境变量`import.meta.env.XXX`时，让ts能够自动推导出对应的变量名和变量类型
// eslint-disable-next-line no-unused-vars
interface ImportMetaEnv {
  VITE_HELLO: string
  /**
   * 是否进行包分析
   */
  VITE_PACKAGE_ANALYZER: ENV_BOOLEAN_VALUE_TYPE
  /**
   * 是否需要兼容老版本浏览器
   */
  VITE_compatible_old_browser: ENV_BOOLEAN_VALUE_TYPE
  /**
   * 是否启用VConsole插件
   */
  VITE_PROXY_TARGET: ENV_BOOLEAN_VALUE_TYPE
  /*
production环境是否删除所有console语句
*/
  VITE_REMOVE_CONSOLE: ENV_BOOLEAN_VALUE_TYPE
  /**
   * 后端服务api入口
   */
  VITE_PROXY_TARGET: string
  /**
   * 本地开发是否强制使用 VITE_PROXY_TARGET 配置
   */
  VITE_LOCAL_FORCE_USE_PROXY_TARGET: ENV_BOOLEAN_VALUE_TYPE
  PROJECT_TITLE: string
}
