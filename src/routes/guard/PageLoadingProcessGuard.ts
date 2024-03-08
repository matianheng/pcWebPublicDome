import {
  CloseLoadingProcessMethod,
  loadingProcess,
} from '@/components/lsy/page-loading-prcess/LsyPageLoadingProcessController'
import { Router } from 'vue-router'

/**
 * 给路由加载开启loading效果. 进入路由前开启loading, 进入路由后关闭loading.
 *
 * P.S. 该loading与路由组件中的数据加载无关
 * @param router
 */
export function setupPageLoadingProcessGuard(router: Router) {
  let close: CloseLoadingProcessMethod | undefined
  router.beforeEach((to, from, next) => {
    if (close) {
      close()
    }
    // 开启loading
    close = loadingProcess()
    next()
  })
  router.afterEach(() => {
    // 关闭loading
    close && close()
    // close = undefined
  })
}
