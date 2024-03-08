/**
 * 布局类型
 *
 * Left-Top-Bottom: 左上下结构(左右布局)
 *
 * Top-Bottom: 上下结构(上下布局)
 *
 * Top-Left-Right: 上左右结构(混合布局)
 */
export type LayoutType = 'Left-Top-Bottom' | 'Top-Bottom' | 'Top-Left-Right'
export type DropdownTextFun = () => string
export interface DropDownItem {
  text: string | DropdownTextFun
  command: string | number | object
  disabled?: boolean
}
