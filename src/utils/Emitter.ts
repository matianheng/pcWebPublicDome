import {
  LsyRouteTabsEvent,
  LsyRouterViewKeepAliveWrapperEvent,
} from '@/components/lsy/router-tabs/events'
import { LsyTocEvent } from '@/components/lsy/toc/TocEmitter'
import mitt from 'mitt'

export interface CustomEmitterEvent
  extends LsyRouteTabsEvent,
    LsyRouterViewKeepAliveWrapperEvent,
    LsyTocEvent {
  // TODO 在这里添加自定义事件的声明，key为事件名, value为事件参数的类型声明
}

export const emitter = mitt<CustomEmitterEvent>()

// 新增事件监听
// function refreshCall(evt:string) {
//   console.log('refresh')
// }
// emitter.on('refresh', refreshCall)

// 取消事件监听的指定监听函数
// emitter.off('refresh', refreshCall)

// 取消事件的所有监听函数
// emitter.off('refresh')

// 清除所有事件的所有事件监听函数
// emitter.all.clear()

// 触发事件
// emitter.emit('refresh', 'hello')
