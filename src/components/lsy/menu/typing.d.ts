/**
 * 系统菜单项
 */
export interface LsyMenuItemType {
  /**
   * 当前菜单项所属根菜单项(该项值由前端自行填充)
   *
   * 根菜单项的rootIndex值为undefined或null
   *
   * 在混合布局模式下，点击左侧菜单，需要知道应该高亮哪个头部菜单项目，因此需要知道每个菜单的根菜单
   *
   * @see LsyMenuBreadcrumbTabStore.ts#copyAndFitRootIndex
   * @see BasicLayout.vue#updateElMenuDefaultActive
   */
  rootIndex?: string
  /**
   * 上级菜单唯一标识(该项值由前端自行填充)
   *
   * 根菜单项的parentIndex值为undefined或null
   *
   * 如果菜单项在菜单中是隐藏的(hide属性为true)，那么进入该路由，则需要高亮父级菜单，因此需要知道parentIndex
   *
   * @see LsyMenuBreadcrumbTabStore.ts#menuArrToMap
   * @see LsyMenu.vue#updateActiveMenuItemRouteName
   */
  parentIndex?: string
  /**
   * 系统菜单项唯一标识(建议使用路由名)
   */
  index: string
  /**
   * 菜单标题
   */
  name: string
  /**
   * 图标
   */
  icon?: string
  /**
   * 点击时跳转的url
   */
  routePath?: string
  /**
   * 子菜单
   */
  children?: LsyMenuItemType[]
  /**
   * 是否在菜单组件中隐藏(适用于类似详情/编辑页的情况)
   */
  hide?: boolean
  /**
   * 直属子菜单是否包含hide菜单项. 如果值为true, 则该菜单的子孙菜单都不会显示在菜单中 (该项值由前端自行填充)
   *
   * 侧边菜单渲染时，需要通过该字段判断是否需要渲染子菜单
   *
   * @see LsyMenuBreadcrumbTabStore.ts#menuArrToMap
   * @see LsyMenuItem.vue#hasChildren
   */
  hasHideChild?: boolean
  /**
   * 该菜单下的操作权限
   *
   * 如: 当前菜单是: index: UserMgr (用户管理), 权限为: permission: ['add', 'del'] 表示拥有: 添加, 删除权限
   */
  permission?: string[]
}

/**
 * vertical: 垂直
 *
 * horizontal: 水平
 */
export type LsyMenuMode = 'horizontal' | 'vertical'
