import { useLsyMenuBreadcrumbTabStore } from '@/store/LsyMenuBreadcrumbTabStore'
import { white_route_name_arr } from '@/utils/SystemConstants'
import { storeToRefs } from 'pinia'
import { Router } from 'vue-router'

/**
 * 路由访问权限验证
 * @param router
 */
export function setupRouteGuard(router: Router) {
  router.beforeEach((to, from, next) => {
    const toRouteName = to.name as string
    const lsyMenuBreadcrumbTabStore = useLsyMenuBreadcrumbTabStore()
    const { routeNameList } = storeToRefs(lsyMenuBreadcrumbTabStore)
    if (white_route_name_arr.indexOf(toRouteName) >= 0) {
      // 白名单路由，则直接通过
      next()
    } else if (routeNameList.value.indexOf(toRouteName) >= 0) {
      // 有权限，则直接通过
      next()
    } else {
      // 无权限，则转入无权限界面
      console.warn(`无【 ${toRouteName} 】路由访问权限`)
      next({ name: 'Page403' })
    }
  })
}
