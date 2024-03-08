export interface LsyBaseBreadcrumbItem extends Record<string, unknown> {
  /**
   * 唯一标识(必填)[为方便查找，建议采用路由名]
   */
  index?: string
  /**
   * 菜单名(必填)
   */
  name?: string
  /**
   * 菜单图标
   */
  icon?: string
  /**
   * 菜单跳转路由地址
   */
  routePath?: string
  /**
   * 用户自定义数据
   */
  customDataMap?: Map<string, unknown>
}
/**
 * 面包屑数据结构
 */
export interface LsyBreadcrumbItem extends LsyBaseBreadcrumbItem {
  /**
   * 子菜单
   */
  children?: LsyBreadcrumbItem[]
}
/**
 * 面包屑对象字段动态映射
 */
export interface LsyBreadcrumbItemFieldMapping {
  index?: string
  name?: string
  icon?: string
  routePath?: string
  children?: string
  customDataMap?: string
}
export interface InnerLsyBreadcrumbItem extends LsyBaseBreadcrumbItem {
  /**
   * 上级菜单的唯一标识[无上级菜单时，该属性为null或undefined或空字符串]
   */
  parentIndex?: string
  /**
   * 所有先辈节点的唯一标识集合，数组值得顺序是从祖先到当代. 无先辈节点时，该字段为null或undefined或空数组(不包含本身的index)
   */
  ancestorIndexArr?: string[]
  /**
   * 子菜单
   */
  children?: LsyBreadcrumbItem[]
}
