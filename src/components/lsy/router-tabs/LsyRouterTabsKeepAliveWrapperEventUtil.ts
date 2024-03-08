import { emitter } from '@/utils/Emitter'
import {
  refreshCur,
  closeCurAndToRoute,
  openTabAndToRoute,
  closeOther,
} from './events'
import { RouteLocationRaw } from 'vue-router'

/**
 * 发送关闭当前标签页并转入其他路由事件
 *
 * p.s. 当前关闭的路由和to路由不能是同一个路由
 */
export function emitCloseCurAndToRoute(to: RouteLocationRaw) {
  return new Promise<void>(resolve => {
    emitter.emit(closeCurAndToRoute, [to, resolve])
  })
}
/**
 * 发送关闭当前标签页并转入其他路由事件
 */
export function emitCloseOther() {
  emitter.emit(closeOther)
}
/**
 * 发送打开标签页并转入其他路由事件
 */
export function emitOpenTabAndToRoute(to: RouteLocationRaw) {
  emitter.emit(openTabAndToRoute, to)
}
/**
 * 发送刷新当前路由组件事件
 */
export function emitRefreshCur() {
  emitter.emit(refreshCur)
}
