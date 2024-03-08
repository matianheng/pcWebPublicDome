import { EventType } from 'mitt'
import { RouteLocationRaw } from 'vue-router'

/**
 * 自定义事件:刷新当前路由组件
 */
export const refreshCur = Symbol('refreshCur')
/**
 * 自定义事件:关闭当前标签,并转入新路由
 */
export const closeCurAndToRoute = Symbol('closeCurAndToRoute')
/**
 * 自定义事件:关闭其他标签页
 */
export const closeOther = Symbol('closeOther')
/**
 * 自定义事件:打开新标签并跳转路由
 */
export const openTabAndToRoute = Symbol('closeCur')
export interface LsyRouterViewKeepAliveWrapperEvent
  extends Record<EventType, unknown> {
  /**
   * 自定义事件:刷新当前路由组件
   */
  [refreshCur]: void
}
export interface LsyRouteTabsEvent extends Record<EventType, unknown> {
  /**
   * 自定义事件:关闭当前标签,并转入新路由
   */
  [closeCurAndToRoute]: [to: RouteLocationRaw, resolve: () => void]
  /**
   * 自定义事件:打开新标签并跳转路由
   */
  [openTabAndToRoute]: RouteLocationRaw
  /**
   * 关闭其他标签页
   */
  [closeOther]: void
}
