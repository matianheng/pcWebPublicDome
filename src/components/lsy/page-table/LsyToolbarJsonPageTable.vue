<template>
  <div
    ref="tableWrapperDomRef"
    class="flex flex-col"
    :class="`${fitAllContent ? 'h-full' : ''}`"
  >
    <div
      :class="`${fitAllContent ? 'flex-shrink-0' : ''}`"
      class="flex flex-col pb-3 sm:flex-row"
    >
      <div class="mb-2 sm:mb-0">
        <slot name="leftToolbarGroup"></slot>
      </div>
      <LsyTableToolbar
        v-model:elTableProp="realElTableProp"
        v-model:column-arr="columnArrComputed"
        class="sm:ml-auto"
        :full-ele="tableWrapperDomRef"
        :fullscreen-parent="true"
        :show-settings="showSettings"
        :full-screen-callback="fullScreenCallback"
        @refresh="onRefresh"
      ></LsyTableToolbar>
    </div>
    <div :class="`${fitAllContent ? 'flex-1 h-0' : ''}`">
      <!-- 分页表格 -->
      <LsyJsonPageTable
        v-model:current-page="pageParam.page"
        v-model:page-size="pageParam.size"
        :fit-all-content="fitAllContent"
        :selection-column="selectionColumn"
        :index-column="indexColumn"
        :column-arr="columnArr"
        :el-table-props="realElTableProp"
        class="u-system-table"
        :el-table-evt="elTableEvt"
        :table-data="pageTableData.tableData"
        :total="pageTableData.total"
        :loading="loading"
        @page-size-change="onPageSizeChange"
        @current-page-change="onCurrentPageChange"
      >
        <!-- 
          这里slot的定义顺序，必须时先slotHeaderNameArr，
          再columnSlotNameArr，否则会有ts239的错误，认为缺失rowIndex属性，
          实际headerSlot没有，但单元格的slot是有的，ts可能是根据最后一个slot定义判断的 
        -->
        <!-- 自定义表头的slot -->
        <template
          v-for="columnSlotHeaderName in slotHeaderNameArr"
          #[columnSlotHeaderName]="{ column }"
        >
          <slot :name="columnSlotHeaderName" :column="column"></slot>
        </template>
        <!-- 自定义表格单元格内容的slot -->
        <template
          v-for="columnSlotName in columnSlotNameArr"
          #[columnSlotName]="{ rowIndex, scope, column }"
        >
          <slot
            :name="columnSlotName"
            :row-index="rowIndex"
            :scope="scope"
            :column="column"
          ></slot>
        </template>
      </LsyJsonPageTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ElTableProp,
  LsySearchMethodParam,
} from '@/components/lsy/page-table/typing'
import { ref, watch } from 'vue'
import { computed } from 'vue'
import { LsyPageParam, LsyTableColumn, LsySearchPageDataMethod } from './typing'
import { useRequest } from 'vue-request'
import { toRefs } from 'vue'

defineOptions({ name: 'LsyToolbarJsonPageTable' })

const props = withDefaults(
  defineProps<{
    /**
     * 组件内容是否占满整个父容器高度. 默认:true
     *
     * 为true, 则是类似如下形式的布局结构
     * ```html
     * <div class='h-full flex flex-col'>
     *  <div class='flex-sharking-0'>工具条</div>
     *  <div class='flex-1 h-0'>分页表格</div>
     * </div>
     * ```
     *
     * 为false, 则是类似如下形式的布局结构 (不会通过flex布局控制高度,也不会占满父容器的所有高度)
     * ```html
     * <div class='flex flex-col'>
     *  <div>工具条</div>
     *  <div>分页表格</div>
     * </div>
     * ```
     */
    fitAllContent?: boolean
    /**
     * 列配置(v-model)
     */
    columnArr: LsyTableColumn[]
    /**
     * 选中列(v-model)
     */
    selectedRows: any[]
    /**
     * 是否启用selection列
     */
    selectionColumn?: boolean
    /**
     * 是否启用所引列
     */
    indexColumn?: boolean
    /**
     * 数据查询方法
     */
    searchPageDataMethod: LsySearchPageDataMethod
    /**
     * 是否启用表格右上角工具条中的设置工具
     */
    showSettings?: boolean
    /**
     * 全屏/退出全屏前的回调函数
     *
     * @param flag true表示当前是从非全屏到全屏, 反之表示从全屏到非全屏
     */
    fullScreenCallback?: (flag: boolean) => void
    /**
     * el-table配置
     */
    elTableProps?: ElTableProp
  }>(),
  {
    fitAllContent: true,
    fullScreenCallback: undefined,
    elTableProps: () => ({
      rowStyle: {
        position: 'relative',
      },
    }),
  }
)

const { columnArr, selectedRows, elTableProps } = toRefs(props)
const columnSlotNameArr = computed(() =>
  columnArr.value
    .filter(item => item.slotName)
    .map(item => item.slotName as string)
)
const slotHeaderNameArr = computed(() =>
  columnArr.value
    .filter(item => item.slotHeaderName)
    .map(item => item.slotHeaderName as string)
)
const $emits = defineEmits<{
  'update:columnArr': [LsyTableColumn[]]
  'update:selectedRows': [any[]]
}>()

const columnArrComputed = computed({
  get() {
    return columnArr.value
  },
  set(val: LsyTableColumn[]) {
    $emits('update:columnArr', val)
  },
})

const tableWrapperDomRef = ref<HTMLElement>()
const realElTableProp = ref<ElTableProp>({})
watch(
  elTableProps,
  val => {
    console.log('props.elTableProps', val)
    realElTableProp.value = {
      ...val,
      rowStyle: {
        position: 'relative',
      },
    }
  },
  {
    immediate: true,
  }
)

const selectedRowsComputed = computed<any[]>({
  set(val: any[]) {
    $emits('update:selectedRows', val)
  },
  get() {
    return selectedRows.value
  },
})

const initPageParam: LsyPageParam = { page: 1, size: 20 }
const pageParam = ref<LsyPageParam>({ ...initPageParam })
const { run, loading, data } = useRequest(props.searchPageDataMethod, {
  loadingDelay: 350,
  defaultParams: [pageParam.value],
})
const elTableEvt = {
  'sort-change': ({ prop, order }: { prop: string; order: string }) => {
    // ascending: 升序
    // descending: 降序
    pageParam.value = { ...pageParam.value, page: 1 }
    run(pageParam.value, { field: prop, order })
  },
  'selection-change': (val: any[]) => {
    // val是选中项
    selectedRowsComputed.value = val
  },
}

function onPageSizeChange() {
  run(pageParam.value)
}
function onCurrentPageChange() {
  run(pageParam.value)
}
const pageTableData = computed(() => {
  let tableData: any[] = data.value?.list ?? []
  let total = data.value?.total ?? 0
  return {
    tableData,
    total,
  }
})

function onRefresh() {
  run(pageParam.value)
}
function runSearchMethod({ page }: LsySearchMethodParam = {}) {
  if (page) {
    pageParam.value.page = page
  }
  run(pageParam.value)
}
defineExpose({
  runSearchMethod,
})
</script>
