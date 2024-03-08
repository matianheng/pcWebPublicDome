<template>
  <LsyPageTable
    ref="pageTableRef"
    v-model:current-page="currentPageComp"
    v-model:page-size="pageSizeComp"
    :fit-all-content="fitAllContent"
    :el-table-props="elTableProps"
    :el-table-evt="elTableEvt"
    :el-pagination-props="elTableProps"
    :enable-pagination="enablePagination"
    :table-data="tableData"
    :total="total"
    :loading="loading"
    :element-loading-text="elementLoadingText"
    :element-loading-background="elementLoadingBackground"
    @page-size-change="pageSizeChange"
    @current-page-change="currentPageChange"
  >
    <el-table-column
      v-if="selectionColumn"
      :fixed="hasFixedColumn"
      type="selection"
      :width="selectionColumnWidth"
    />
    <!-- 这里之所以通过自定义列的方式实现索引列，是因为原本的索引列不利于外部进行样式控制 -->
    <el-table-column
      v-if="indexColumn"
      :fixed="hasFixedColumn"
      label="#"
      :width="indexColumnWidth"
    >
      <template #default="scope">
        <div class="o-index-cell">
          {{ indexMethod(scope.$index) }}
        </div>
      </template>
    </el-table-column>
    <template v-for="column in columnArr" :key="column.prop">
      <el-table-column
        v-if="buildShow(column.show)"
        :sortable="column.sortable"
        v-bind="column.elTableColumnProps"
        :prop="column.prop"
        :fixed="column.fixed"
        :label="buildLabel(column.label)"
      >
        <template v-if="column.slotHeaderName" #header>
          <slot :name="column.slotHeaderName" :column="column"></slot>
        </template>
        <template v-if="column.slotName" #default="scope">
          <slot
            v-if="!column.isFormItem || !column.prop"
            :name="column.slotName"
            :column="column"
            :row-index="scope.$index"
            :scope="scope"
          ></slot>
          <el-form-item
            v-else
            :prop="`tableArr.${scope.$index}.${column.prop}`"
            :rules="buildRules(scope.$index, column.prop, column.rules)"
          >
            <NewMarkErrorPopover
              :mark-error-id="
                rowFieldMarkErrorMap.get(scope.$index)?.get(column.prop)?.id
              "
              :val="scope.row[column.prop]"
              :section="section"
              :row="scope.$index"
              :mark-error="
                rowFieldMarkErrorMap.get(scope.$index)?.get(column.prop)?.msg
              "
              :field="column.prop"
              :edit-mode="editModelFactory(scope.$index, column.editMode)"
              @saveMarkError="onSaveMarkError"
            >
              <template #default="{ updateContent }">
                <slot
                  :name="column.slotName"
                  :column="column"
                  :row-index="scope.$index"
                  :scope="scope"
                  :update-content="updateContent"
                  :edit-mode="editModelFactory(scope.$index, column.editMode)"
                ></slot>
              </template>
            </NewMarkErrorPopover>
          </el-form-item>
        </template>
        <template v-else-if="column.dictionaryConvert" #default="scope">
          {{
            column.dictionaryConvert ? column.dictionaryConvert(scope.row) : ''
          }}
        </template>
      </el-table-column>
    </template>
    <slot name="tableTataEmpty"></slot>
  </LsyPageTable>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue'
import LsyPageTable from '@/components/lsy/page-table/LsyPageTable.vue'
import type {
  LsyTableColumn,
  LsyPageTableInstance,
  ElTableProp,
  ElPaginationProp,
  StringReturnFun,
  ElTableInstance,
  BooleanReturnFun,
  RuleBuilder,
  EditModeFactoryFun,
} from './table.typing'
import { computed } from 'vue'
import { FormItemRule } from 'element-plus'
import NewMarkErrorPopover from './NewMarkErrorPopover.vue'
import { MarkErrorInfoType } from '../mock-api/ApiTyping'
import { EditMode } from './typing'

defineOptions({ name: 'BasicJsonPageTable' })

const props = withDefaults(
  defineProps<{
    /**
     * 组件内容是否占满整个父容器高度. 默认:true
     *
     * 为true, 则是类似如下形式的布局结构
     * ```html
     * <div class='h-full flex flex-col'>
     *  <div class='flex-1 h-0'>表格</div>
     *  <div class='flex-sharking-0'>分页条</div>
     * </div>
     * ```
     *
     * 为false, 则是类似如下形式的布局结构 (不会通过flex布局控制高度,也不会占满父容器的所有高度)
     * ```html
     * <div>
     *  <div>表格</div>
     *  <div>分页条</div>
     * </div>
     * ```
     */
    fitAllContent?: boolean
    /**
     * 是否启用selection列
     * 
     * 通过如下方式获取选中项
     * const elTableEvt = {
        'selection-change': (val: UserInfo[]) => {
          // val是选中项
          selectedRows.value = val
        },
      }
     */
    selectionColumn?: boolean
    /**
     * selection列宽度. 默认:55
     */
    selectionColumnWidth?: string | number
    /**
     * 是否启用所引列
     */
    indexColumn?: boolean
    /**
     * 索引列宽度. 默认:55
     */
    indexColumnWidth?: string | number
    /**
     * 列配置
     */
    columnArr: LsyTableColumn[]
    /**
     * 支持el-table中除data以外的所有prop属性
     */
    elTableProps?: ElTableProp
    /**
     * 支持el-table所有事件
     */
    elTableEvt?: Record<string, unknown>
    /**
     * 支持el-pagination组件中,除current-page,page-size,total的所有props属性
     */
    elPaginationProps?: ElPaginationProp
    /**
     * 是否启用分页条组件. 默认:true
     */
    enablePagination?: boolean
    /**
     * 表格数据. 默认:[]
     */
    tableData?: unknown[]
    /**
     * 当前页码. 默认:1
     */
    currentPage?: number
    /**
     * 每页显示记录数. 默认:10
     */
    pageSize?: number
    /**
     * 总记录数. 默认:0
     */
    total?: number
    /**
     * 是否处于数据加载中
     */
    loading?: boolean
    /**
     * loading文案
     */
    elementLoadingText?: string
    /**
     * loading背景颜色
     */
    elementLoadingBackground?: string
    /**
     * 行标记有误数据
     * 最外层map的key为行号
     * 内层map的key为属性名
     */
    rowFieldMarkErrorMap?: Map<number, Map<string, MarkErrorInfoType>>
    section: string
  }>(),
  {
    indexColumnWidth: '55',
    selectionColumnWidth: '55',
    elTableProps: undefined,
    elTableEvt: undefined,
    elPaginationProps: undefined,
    enablePagination: true,
    tableData: () => [],
    currentPage: 1,
    pageSize: 10,
    total: 0,
    elementLoadingText: undefined,
    elementLoadingBackground: undefined,
    rowFieldMarkErrorMap: () => new Map(),
  }
)

const $emits = defineEmits<{
  'update:currentPage': [val: number]
  'update:pageSize': [val: number]
  pageSizeChange: [pageSize: number]
  currentPageChange: [currentPage: number]
  validateRowField: [row: number, field: string]
}>()
function pageSizeChange(pageSize: number) {
  $emits('pageSizeChange', pageSize)
}
function currentPageChange(currentPage: number) {
  $emits('currentPageChange', currentPage)
}
function onSaveMarkError(row: number, field: string) {
  $emits('validateRowField', row, field)
}
const { currentPage, pageSize, columnArr } = toRefs(props)
const hasFixedColumn = computed(
  () => columnArr.value.findIndex(item => item.fixed) >= 0
)
const currentPageComp = computed({
  get() {
    return currentPage.value
  },
  set(val: number) {
    $emits('update:currentPage', val)
  },
})
const pageSizeComp = computed({
  get() {
    return pageSize.value
  },
  set(val: number) {
    $emits('update:pageSize', val)
  },
})
function indexMethod(index: number) {
  return (currentPage.value - 1) * pageSize.value + index + 1
}
function buildLabel(label: string | StringReturnFun | undefined) {
  if (label instanceof Function) {
    return label()
  }
  return label
}
function buildRules(
  row: number,
  field: string,
  rules?: RuleBuilder | FormItemRule[]
) {
  if (rules instanceof Function) {
    return rules(row, field)
  } else {
    return rules
  }
}
function buildShow(show?: boolean | BooleanReturnFun) {
  if (show instanceof Function) {
    return show()
  } else if (show === undefined) {
    return true
  } else {
    return show
  }
}
function editModelFactory(
  row: number,
  editModel?: EditMode | EditModeFactoryFun
) {
  if (editModel instanceof Function) {
    return editModel(row)
  } else if (editModel) {
    return editModel
  } else {
    return 'readonly'
  }
}

/**
 * PageTable的实例
 */
const pageTableRef = ref<LsyPageTableInstance>()

/**
 * 获取el-table的实例
 */
function getElTableRef(): ElTableInstance | undefined {
  return pageTableRef.value?.elTableRef
}

defineExpose({ pageTableRef, getElTableRef })
</script>

<style scoped></style>
