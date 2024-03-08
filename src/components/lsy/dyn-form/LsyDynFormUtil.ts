import { VueComp } from './typing'

/**
 * 将vue组件信息，转换为map结构. key为文件名(同时也是组件名), value为组件实例
 * @param modules vue组件信息
 * @returns
 */
export function loadVueCompFromModules(
  modules: Record<string, unknown>
): Map<string, VueComp> {
  const map = new Map<string, VueComp>()
  Object.keys(modules).reduce((prev, cur) => {
    //匹配.vue结尾的文件名
    const match: RegExpMatchArray | null = cur.match(/[\w]+(?=.vue)/)
    if (match) {
      const tmp = modules[cur]
      //组件名
      const componentName: string = match[0]
      if (tmp) {
        // @ts-ignore
        map.set(componentName, tmp.default)
      }
    }
    return prev
  }, map)
  return map
}
