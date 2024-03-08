import { HistoryState } from 'vue-router'
import LsyRouterViewKeepAliveWrapper from './LsyRouterViewKeepAliveWrapper.vue'
import LsyRouterTabs from './LsyRouterTabs.vue'

export interface LsyTabMetadataFieldMapping {
  index?: string
  name?: string
  icon?: string
  routePath?: string
  children?: string
  customDataMap?: string
  closeAble?: string
  keepAlive?: string
}
export interface LsyBaseTabMetadata extends Record<string, unknown> {
  /**
   * 唯一标识(必填)
   */
  index?: string
  /**
   * 名称(必填)
   */
  name?: string
  /**
   * 图标
   */
  icon?: string
  /**
   * 菜单跳转路由地址
   */
  routePath?: string
  /**
   * 用户自定义数据
   */
  customDataMap?: Map<string, unknown>
  /**
   * 标签页是否可关闭. 默认: true
   */
  closeAble: boolean
}
export interface LsyTabMetadata extends LsyBaseTabMetadata {
  /**
   * 子菜单
   */
  children?: LsyTabMetadata[]
}
export interface LsyOpenedTabMetadata extends LsyBaseTabMetadata {
  /**
   * 标签页是否可关闭. 默认:true
   */
  closeAble?: boolean
  /**
   * 原始的路由名
   */
  originalRouteName?: string
}
export type CardTabType = 'card' | 'border-card'

declare interface WindowHistoryState extends HistoryState {
  /************ 以下都是vue-router自动添加的参数 ************/
  current: string | null
  back: string | null
  forward: string | null
  /**
   * 路由跳转方式. 是push还是replace. 值为true则表示是通过replace进行的跳转
   */
  replaced: boolean
  scroll: boolean

  /************ 以下是 router-tabs 组件会用到的参数 ************/
  /**
   * 如果在使用vue-router跳转的时候，在state中设置openInSameTab为true，则router-tabs组件会在当前标签页中打开新路由
   * 使用方式 $router.push({name:'Detail',state:{openInSameTab: true}})
   */
  _openInSameTab?: boolean
}

declare module 'vue-router' {
  interface RouteMeta {
    // 该vue组件对应的tab是否可关闭. 默认: true
    closeAble?: boolean
    // 是否对该vue组件实例进行keep-alive缓存. 默认: false
    keepAlive?: boolean
    /**
     * 当keepAlive为true时, 该配置生效. 表示仅当从当前路由到指定路由时，才保存当前路由的keep-alive缓存，否清除该缓存
     * 当keepAlive为true时, 如果不配置该字段，则表示当前路由在任何时候，都启用keep-alive缓存
     */
    onlyToRouteKeepAlive?: string[]
    /**
     * keep-alive渲染的包装组件是否使用route.path值构建.默认:true
     * 如果为true, 则包装的组件名为: RouteName_md5(route.path)
     * 如果为false, 则包装的组件名为: RouteName_Wrapper
     *
     * 显示用途说明: useRoutePathAsWrapperCompName设置为false表示对应路由仅打开一个tab页面(如果useRoutePathAsWrapperCompName保持默认或设置为true，则会为对应路由的每个不同的path,分别打开不同的tab)
     */
    useRoutePathAsWrapperCompName?: boolean
  }
}
export type LsyRouterViewKeepAliveWrapperInstance = InstanceType<
  typeof LsyRouterViewKeepAliveWrapper
>
export type LsyRouterTabsInstance = InstanceType<typeof LsyRouterTabs>
