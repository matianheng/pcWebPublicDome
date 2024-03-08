export interface CustomData extends Record<string, any> {
  id: string | number
  hasNext: boolean
  hasPreview: boolean
}
export interface ItemData {
  /**
   * 实际的项数据(必须包含id属性,类型为string或number, 作为数据的唯一标识, 必须包含hasNext属性，表示该数据之后,是否还有数据, 必须包含hasPreview属性，表示该数据之前是否还有数据)
   */
  customData: CustomData
  /**
   * 该数据项在数组中的下标
   */
  arrPos: number
}
/**
 * 数据项的位置与高度
 */
export interface DataPositionHeight {
  /**
   * 开始位置
   */
  startPx: number
  /**
   * 结束位置
   */
  endPx: number
  /**
   * 高度
   */
  height: number
}
/**
 * 分页结果
 */
export interface PageResult {
  /**
   * 数据项集合
   */
  list: any[]
  /**
   * 总记录数
   */
  total: number
  /**
   * 每页记录数
   */
  size: number
  /**
   * 当前页号
   */
  page: number
}
