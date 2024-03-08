import { Md5 } from 'ts-md5'
import { RouteLocationNormalizedLoaded } from 'vue-router'

export function buildWrapperCompNameByRoute(
  route: RouteLocationNormalizedLoaded
) {
  const meta = route.meta
  const { useRoutePathAsWrapperCompName = true } = meta
  return buildWrapperCompName(
    useRoutePathAsWrapperCompName,
    route.name as string,
    route.fullPath
  )
}
export function buildWrapperCompName(
  useRoutePathAsWrapperCompName: boolean,
  routeName: string,
  routePath: string
) {
  return useRoutePathAsWrapperCompName
    ? `${routeName}_${Md5.hashStr(routePath)}`
    : `${routeName}_Wrapper`
}
export function removeListStrVal(list: string[], needRemoveStr: string) {
  const idx = list.findIndex(item => item === needRemoveStr)
  if (idx >= 0) {
    list.splice(idx, 1)
  }
}
