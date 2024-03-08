import { emitter } from '@/utils/Emitter'
import { EventType } from 'mitt'

/**
 * 自定义事件:重新构建toc内容
 */
export const rerenderTocEvt = Symbol('rerenderToc')

export interface LsyTocEvent extends Record<EventType, unknown> {
  [rerenderTocEvt]: void
}

/**
 * 发送刷新当前路由组件事件
 */
export function emitRerenderToc() {
  emitter.emit(rerenderTocEvt)
}
