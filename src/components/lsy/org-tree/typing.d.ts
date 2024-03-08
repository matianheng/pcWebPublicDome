interface BaseOrgTreeNodeData {
  /**
   * 唯一标识
   */
  key: string
  /**
   * 标题
   */
  title: string
  /**
   * 是否有子节点
   */
  hasChildren?: boolean
  /**
   * 自定义节点数据
   */
  customData?: Map<string, unknown>
}
export interface OrgTreeNodeData extends BaseOrgTreeNodeData {
  /**
   * 唯一标识
   */
  key: string
  /**
   * 标题
   */
  title: string
  /**
   * 子节点
   */
  children?: OrgTreeNodeData[]
  /**
   * 是否有子节点
   */
  hasChildren?: boolean
  /**
   * 自定义节点数据
   */
  customData?: Map<string, unknown>
}

export interface OrgTreeNodeDataInner extends BaseOrgTreeNodeData {
  /**
   * 是否显示子节点
   */
  showChildren: boolean
  /**
   * 子节点
   */
  children?: OrgTreeNodeDataInner[]
}
