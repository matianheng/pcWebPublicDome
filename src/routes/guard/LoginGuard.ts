import { BizApiExecuteException } from '@/exception/BizApiExecuteException'
import { HttpStatus500Exception } from '@/exception/HttpStatus500Exception'
import { useLsyMenuBreadcrumbTabStore } from '@/store/LsyMenuBreadcrumbTabStore'
import { isLogin, getLoginFlag, clearLoginData } from '@/utils/LoginUtil'
import { isLoginRouteName, white_route_name_arr } from '@/utils/SystemConstants'
import { Router } from 'vue-router'

/**
 * 是否登录进行验证
 * @param router
 */
export function setupLoginGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const toRouteName = to.name as string
    if (
      white_route_name_arr.indexOf(toRouteName) >= 0 &&
      !isLoginRouteName(toRouteName)
    ) {
      // 访问的是白名单路由,且非登录路由, 则直接通过
      next()
    } else {
      // 访问的非白名单路由或访问的是登录路由
      const systemMenuBreadcrumbTabStore = useLsyMenuBreadcrumbTabStore()
      const { loadMenuDataToStore } = systemMenuBreadcrumbTabStore
      if (isLogin()) {
        // 已登录
        if (isLoginRouteName(toRouteName)) {
          // 已登录，且访问的是登录页，则转入首页
          next({ name: 'Index' })
        } else {
          // 已登录，访问的非登录页，则直接转入，在转入之前先获取菜单信息
          const loginFlag = getLoginFlag()
          try {
            loginFlag && (await loadMenuDataToStore(loginFlag))
            next()
          } catch (e) {
            // 菜单数据的获取和处理如果发生异常，则清除登录状态(避免异常循环)
            clearLoginData()
            if (
              e instanceof BizApiExecuteException ||
              e instanceof HttpStatus500Exception
            ) {
              // 在路由守卫中ajax接口发生业务异常或http响应状态码为500, 则进入500页面
              next({ name: 'Page500' })
            } else {
              // 其他未知异常, 直接向上抛出
              throw e
            }
          }
        }
      } else {
        // 未登录
        if (isLoginRouteName(toRouteName)) {
          // 未登录,访问登录页,放行
          next()
        } else {
          // 访问非登录页, 转入登录页
          next({ name: 'Login' })
        }
      }
    }
  })
}
