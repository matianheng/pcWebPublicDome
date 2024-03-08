import { ElTable, ElPagination, ElTableColumn } from 'element-plus'
import type {
  ComponentProps,
  ComponentExposed,
} from 'vue-component-type-helpers'
import LsyPageTable from './LsyPageTable.vue'
import LsyJsonPageTable from './LsyJsonPageTable.vue'
import LsyToolbarJsonPageTable from './LsyToolbarJsonPageTable.vue'

export type ElTableProp =
  | ComponentProps<typeof ElTable>
  | Record<string, unknown>
export type ElPaginationProp =
  | ComponentProps<typeof ElPagination>
  | Record<string, unknown>
export type ElTableColumnProp =
  | ComponentProps<typeof ElTableColumn>
  | Record<string, unknown>
export type ElTableInstance = ComponentExposed<typeof ElTable>
export type ElPaginationInstance = InstanceType<typeof ElPagination>
export type LsyPageTableInstance = ComponentExposed<typeof LsyPageTable>
export type LsyJsonPageTableInstance = ComponentExposed<typeof LsyJsonPageTable>
export type StringReturnFun = () => string
export type BooleanReturnFun = () => boolean
export interface LsyTableColumn {
  /**
   * 列字段
   */
  prop?: string
  /**
   * 是否显示该列. 默认: true
   */
  show?: boolean | BooleanReturnFun
  /**
   * 列名
   */
  label?: string | StringReturnFun
  /**
   * 是否支持排序.
   * 如果设置为 'custom'，则代表用户希望远程排序，需要监听 Table 的 sort-change({prop: string; order: string}) 事件 order取值为: ascending: 升序, descending: 降序
   *
   * https://element-plus.gitee.io/zh-CN/component/table.html#%E6%8E%92%E5%BA%8F
   */
  sortable?: boolean | string
  /**
   * 是否固定列
   *
   * 可选值: true/false/right/left
   */
  fixed?: boolean | string
  /**
   * 自定义slot(不能为tableTataEmpty, 因为tableTataEmpty是用于自定义el-table空数据的展示效果的)
   */
  slotName?: string
  /**
   * 自定义列头slot
   */
  slotHeaderName?: string
  /**
   * 列值转换方法
   */
  dictionaryConvert?: (rowData: any) => string
  /**
   * 支持所有el-table-column的props配置
   */
  elTableColumnProps?: ElTableColumnProp
}
/**
 * 分页条件
 */
export interface LsyPageParam {
  page?: number
  size?: number
}
/**
 * 分页结果
 */
export interface LsyPageResult<T> {
  page: number
  size: number
  total: number
  list: Array<T>
}
export interface LsySortInfo {
  /**
   * 排序字段
   */
  field: string
  /**
   * 排序方式
   * ascending: 升序
   * descending: 降序
   * undefined: 不排序
   */
  order?: string
}
/**
 * 分页数据查询方法
 * @param pageParam 分页条件
 * @param sortInfo 排序条件
 */
export type LsySearchPageDataMethod = (
  pageParam?: LsyPageParam,
  sortInfo?: LsySortInfo
) => Promise<LsyPageResult<any>>
export type LsyToolbarJsonPageTableInstance = ComponentExposed<
  typeof LsyToolbarJsonPageTable
>
export interface LsySearchMethodParam {
  page?: number
  clearSort?: boolean
}
