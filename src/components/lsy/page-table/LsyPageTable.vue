<!--

@author: pan
@createDate: 2023-09-13 10:05
-->
<script setup lang="ts">
import { ElTable, ElPagination } from 'element-plus'
import { computed, toRefs } from 'vue'
import {
  ElPaginationProp,
  ElTableInstance,
  ElTableProp,
  StringReturnFun,
} from './typing'
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    /**
     * 组件内容是否占满整个父容器高度. 默认:true
     *
     * 为true, 则是如下形式的布局结构
     * ```html
     * <div class='h-full flex flex-col'>
     *  <div class='flex-1 h-0'>表格</div>
     *  <div class='flex-sharking-0'>分页条</div>
     * </div>
     * ```
     *
     * 为false, 则是如下形式的布局结构 (不会控制高度,也不会占满父容器的所有高度)
     * ```html
     * <div class='flex flex-col'>
     *  <div>表格</div>
     *  <div>分页条</div>
     * </div>
     * ```
     */
    fitAllContent?: boolean
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
    elementLoadingText?: string | StringReturnFun
    /**
     * loading背景颜色
     */
    elementLoadingBackground?: string
  }>(),
  {
    elTableProps: undefined,
    elTableEvt: () => ({}),
    elPaginationProps: undefined,
    enablePagination: true,
    tableData: () => [],
    currentPage: 1,
    pageSize: 10,
    total: 0,
    loading: true,
    elementLoadingText: undefined,
    elementLoadingBackground: undefined,
    fitAllContent: true,
  }
)

const { currentPage, pageSize, loading, tableData } = toRefs(props)

/* eslint-disable */
const $emits = defineEmits({
  'update:currentPage': (val: number) => true,
  'update:pageSize': (val: number) => true,
  pageSizeChange: (pageSize: number) => true,
  currentPageChange: (currentPage: number) => true,
})
/* eslint-disable */

const currentPageComp = computed({
  set(val: number) {
    $emits('update:currentPage', val)
  },
  get() {
    return currentPage.value
  },
})
const pageSizeComp = computed({
  set(val: number) {
    $emits('update:pageSize', val)
  },
  get() {
    return pageSize.value
  },
})

function onPageSizeChange(pageSize: number) {
  $emits('pageSizeChange', pageSize)
}
function onCurrentPageChange(currentPage: number) {
  $emits('currentPageChange', currentPage)
}
function buildLoadingText() {
  const elementLoadingText = props.elementLoadingText
  if (elementLoadingText instanceof Function) {
    return elementLoadingText()
  }
  return elementLoadingText
}
const elTableRef = ref<ElTableInstance>()
const pageTableRootDomRef = ref<HTMLDivElement>()
defineExpose({ elTableRef, pageTableRootDomRef })
</script>

<template>
  <div
    class="flex flex-col pageTable"
    :class="`${fitAllContent ? 'h-full' : ''}`"
    v-loading="loading"
    :element-loading-text="buildLoadingText()"
    :element-loading-background="elementLoadingBackground"
    ref="pageTableRootDomRef"
  >
    <div :class="`${fitAllContent ? 'flex-1 h-0' : ''}`">
      <el-table
        ref="elTableRef"
        v-bind="elTableProps"
        :data="tableData"
        class="h-full !w-full"
        height="100%"
        max-height="100%"
        v-on="elTableEvt"
      >
        <slot></slot>
        <template v-slot:empty>
          <slot name="tableTataEmpty">
            <div class="h-full overflow-hidden flex flex-col justify-center">
              表格无数据
            </div>
          </slot>
        </template>
      </el-table>
    </div>
    <div
      class="pt-3"
      :class="`${fitAllContent ? 'flex-shrink-0' : ''}`"
      v-if="enablePagination"
    >
      <div class="flex flex-row">
        <div class="overflow-x-auto sm:ml-auto">
          <el-pagination
            v-bind="elPaginationProps"
            v-model:current-page="currentPageComp"
            v-model:page-size="pageSizeComp"
            :total="total"
            @size-change="onPageSizeChange"
            @current-change="onCurrentPageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pageTable {
  :deep(.el-table__empty-text) {
    padding-top: 8px;
    width: 97%;
    height: 100%;
    line-height: 35px;
  }
}
</style>
