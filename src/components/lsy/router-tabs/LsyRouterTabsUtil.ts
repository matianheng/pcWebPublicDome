import { RouteRecordRaw } from 'vue-router'
import {
  LsyOpenedTabMetadata,
  LsyTabMetadata,
  LsyTabMetadataFieldMapping,
} from './typing'
import {
  clearLocalStorageByKey,
  loadObjFromLocalStorage,
  saveObjToLocalStorage,
} from '@/utils/StorageUtil.ts'

/**
 * 用于检查路由定义是否符合RouterTabs组件的要求.
 *
 * RouterTabs组件对路由的要求: 所有有 component 属性定义的路由，都必须定义字符串类型的路由名，且路由名必须唯一
 *
 * @param routes 路由定义集合
 * @param routeNameArr 存放已定义的路由名
 */
export function checkRouteDefine(
  routes: RouteRecordRaw[],
  routeNameArr: string[] = []
) {
  routes.forEach(route => {
    if (route.component) {
      if (!route.name) {
        throw new Error('路由定义中存在定义了component属性，但未定义name的路由')
      }
      if (typeof route.name === 'symbol') {
        throw new Error('路由name值只能是字符类型，不能是symbol类型')
      }
      if (routeNameArr.includes(route.name as string)) {
        throw new Error(`路由name值[${route.name}]重复`)
      }
      routeNameArr.push(route.name as string)
    }
    if (route.children && route.children.length > 0) {
      checkRouteDefine(route.children, routeNameArr)
    }
  })
}

/**
 * 将数组结构的tab元数据转换为map结构
 * @param arr tab元数据
 * @param map 存放转换结果.key为TabMetadata的index值
 * @param fieldMapping 转换时的字段映射方式
 */
export function convertTabMetadataArr(
  arr: LsyTabMetadata[],
  map: Map<string, LsyTabMetadata>,
  fieldMapping: LsyTabMetadataFieldMapping
): LsyTabMetadata[] {
  return arr.reduce<LsyTabMetadata[]>((prev, cur) => {
    const item = convertTabMetadata(cur, fieldMapping)
    map.set(item.index as string, item)
    prev.push(item)
    if (item.children && item.children.length > 0) {
      convertTabMetadataArr(item.children, map, fieldMapping)
    }
    return prev
  }, [])
}
export function convertTabMetadata(
  tabData: LsyTabMetadata,
  fieldMapping: LsyTabMetadataFieldMapping
): LsyTabMetadata {
  const index = tabData[fieldMapping.index as string]
    ? (tabData[fieldMapping.index as string] as string)
    : undefined
  const name = tabData[fieldMapping.name as string]
    ? (tabData[fieldMapping.name as string] as string)
    : undefined
  const icon = tabData[fieldMapping.icon as string]
    ? (tabData[fieldMapping.icon as string] as string)
    : undefined
  const routePath = tabData[fieldMapping.routePath as string]
    ? (tabData[fieldMapping.routePath as string] as string)
    : undefined
  const children = tabData[fieldMapping.children as string]
    ? (tabData[fieldMapping.children as string] as LsyTabMetadata[])
    : undefined
  const customDataMap = tabData[fieldMapping.customDataMap as string]
    ? (tabData[fieldMapping.customDataMap as string] as Map<string, unknown>)
    : undefined
  const closeAble =
    tabData[fieldMapping.closeAble as string] === false ? false : true
  const keepAlive =
    tabData[fieldMapping.keepAlive as string] === false ? false : true
  return {
    index,
    name,
    icon,
    routePath,
    children,
    customDataMap,
    closeAble,
    keepAlive,
  }
}

const openedTabDataLocalStorageKey = '_tabData'
export function saveOpenedTabDataToLocalStorage(arr: LsyOpenedTabMetadata[]) {
  saveObjToLocalStorage(openedTabDataLocalStorageKey, arr)
}
export function loadOpenedTabDataFromLocalStorage(): LsyOpenedTabMetadata[] {
  const ret = loadObjFromLocalStorage<LsyOpenedTabMetadata[]>(
    openedTabDataLocalStorageKey
  )
  return ret ? ret : []
}
export function clearOpenedTabDataFromLocalStorage() {
  clearLocalStorageByKey(openedTabDataLocalStorageKey)
}
