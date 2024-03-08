import { VNode, Component as VueComp, defineComponent, h } from 'vue'
import { removeListStrVal } from './CommUtils'

// @ts-ignore
window.map = new Map<string, VueComp>()
/**
 * 存放被包装渲染的动态名组件. key为组件名, value为组件实例
 */
// @ts-ignore
const dynNameWrapperCompCacheMap = window.map

export function removeDynNameWrapperComp(key: string) {
  return dynNameWrapperCompCacheMap.delete(key)
}
export function setDynNameWrapperCompCacheMap(key: string, comp: VueComp) {
  dynNameWrapperCompCacheMap.set(key, comp)
}

export function checkHasKey(key: string) {
  return dynNameWrapperCompCacheMap.has(key)
}

export function getDynNameWrapperCompFromCacheMap(key: string) {
  return dynNameWrapperCompCacheMap.get(key)
}

export function getOrWrapperVNodeToVueCom(
  wrapperCompName: string,
  componentVNode: VNode
) {
  let wrapper = getDynNameWrapperCompFromCacheMap(wrapperCompName) as VueComp
  if (!wrapper) {
    wrapper = defineComponent({
      name: wrapperCompName,
      render() {
        return h(componentVNode)
      },
    })
    setDynNameWrapperCompCacheMap(wrapperCompName, wrapper)
  }
  return wrapper
}

export function updateKeepAliveInclude(
  keepAliveCacheCompNameList: string[],
  compName: string,
  routeNeedKeepAlive?: boolean
) {
  if (!routeNeedKeepAlive) {
    removeListStrVal(keepAliveCacheCompNameList, compName)
  } else if (!keepAliveCacheCompNameList.includes(compName)) {
    keepAliveCacheCompNameList.push(compName)
  }
}
