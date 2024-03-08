import { LsyMenuItemType } from './typing'

/**
 * 将 LsyMenuItemType 数组转换为map数据结构. key为菜单项的index
 * @param menuArr 待转换数据
 * @param map 存放转换结果 key 为 LsyMenuItemType 的 index 值
 */
export function reduceMenuArr(
  menuArr: LsyMenuItemType[],
  map: Map<string, LsyMenuItemType>
) {
  menuArr.reduce((prev, cur) => {
    prev.set(cur.index, cur)
    if (cur.children && cur.children.length > 0) {
      reduceMenuArr(cur.children, map)
    }
    return prev
  }, map)
}
