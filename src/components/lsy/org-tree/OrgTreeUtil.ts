import { OrgTreeNodeData, OrgTreeNodeDataInner } from './typing'

/**
 * 将OrgTreeNodeData转为OrgTreeNodeDataInner数据结构
 * @param treeData 待转换数据
 * @param level 当前遍历层级
 * @param initExpandLevel 初始展开层级. 不传则展开所有层级
 * @returns
 */
export function orgTreeNodeDataToInnerData(
  treeData: OrgTreeNodeData[],
  level = 0,
  initExpandLevel?: number
): OrgTreeNodeDataInner[] {
  const ret: OrgTreeNodeDataInner[] = []
  treeData &&
    treeData.forEach(nodeData => {
      const item: OrgTreeNodeDataInner = {
        ...nodeData,
        showChildren:
          initExpandLevel === undefined ? true : level < initExpandLevel,
        children: [],
      }
      ret.push(item)
      if (nodeData.children && nodeData.children.length > 0) {
        item.children = orgTreeNodeDataToInnerData(
          nodeData.children,
          level + 1,
          initExpandLevel
        )
      }
    })
  return ret
}
