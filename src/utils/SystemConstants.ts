/**
 * 主导航class名称
 */
export const MAIN_NAV_CLS = 'o-lsy-main-nav'
/**
 * 侧边从导航class名称
 */
export const SUB_NAV_CLS = 'o-lsy-sub-nav'

/**
 * 头部从导航class名称
 */
export const HEAD_SUB_NAV_CLS = 'o-lsy-sub-nav-header'
/**
 * 路由白名单
 */
export const white_route_name_arr: string[] = [
  'Login',
  'Page403',
  'Page404',
  'Page500',
]
export function isLoginRouteName(routeName: string) {
  return routeName === 'Login'
}
