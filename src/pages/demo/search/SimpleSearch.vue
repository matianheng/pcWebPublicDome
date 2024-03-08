<template>
  <LsyTopMainContentLayout
    top-card-body-cls="!pb-0"
    :fit-all-content="isLongScreen"
    :main-card-body-cls="isLongScreen ? 'h-full' : ''"
  >
    <template #top>
      <!-- 查询表单 -->
      <LsyDynFormResponsive
        ref="dynFormRef"
        v-model:form-data="searchFormData"
        v-model:needShowToggleBtn="needShowToggleBtn"
        :update-row-col-count-fun="updateRowColCount"
        :form-item-arr="formItemArr"
        :form-item-comp-name-map="map"
        :expand="expand"
        :el-form-props="{ 'label-width': 'auto' }"
      >
        <template #extraElFormItems>
          <el-form-item class="ml-auto">
            <LsyLoadingButton
              type="primary"
              @click="onSearch"
            ></LsyLoadingButton>
            <el-button @click="onReset">重置</el-button>
            <el-link
              v-if="needShowToggleBtn"
              type="primary"
              class="ml-3"
              @click="onToggle"
            >
              {{ toggleText }}
            </el-link>
          </el-form-item>
        </template>
      </LsyDynFormResponsive>
    </template>
    <LsyToolbarJsonPageTable
      ref="toolbarJsonPageTableRef"
      v-model:columnArr="columnArr"
      v-model:selectedRows="selectedRows"
      :selection-column="true"
      :index-column="true"
      :search-page-data-method="searchPageData"
      :show-settings="true"
      :fit-all-content="isLsyToolbarJsonPageTableFitAllContent"
      :full-screen-callback="onFullScreenCallback"
    >
      <!-- 自定义列开始 -->
      <template #operation="{ rowIndex }">
        <el-link type="danger" @click="() => onDel(rowIndex, isFullScreen)"
          >删除</el-link
        >
        <el-link type="primary" class="ml-2" @click="() => onEdit(rowIndex)">
          修改
        </el-link>
      </template>
      <!-- 自定义列结束 -->
      <template #leftToolbarGroup>
        <!-- 表格左上角工具按钮 -->
        <el-button type="primary" class="mr-2">新增</el-button>
        <LsyDropdownButton
          :dropdown-item-arr="dropdownItemArr"
          @click-dropdown-item="onClickDropdownItem"
        ></LsyDropdownButton>
      </template>
    </LsyToolbarJsonPageTable>
  </LsyTopMainContentLayout>
</template>

<script setup lang="ts">
import {
  LsyPageParam,
  LsyPageResult,
  LsySortInfo,
  LsyToolbarJsonPageTableInstance,
} from '@/components/lsy/page-table/typing'
import { useSearchForm, useJsonPageTable, useData } from './SimpleSearchHook'
import { computed, ref } from 'vue'
import { tabListMockAPI } from '../mock-api/ListApi'
import { useLsyLayoutStore } from '@/store/LsyLayoutStore'
import { storeToRefs } from 'pinia'
defineOptions({ name: 'SimpleSearch' })

const lsyLayoutStore = useLsyLayoutStore()
const { isLongScreen } = storeToRefs(lsyLayoutStore)
const toolbarJsonPageTableRef = ref<LsyToolbarJsonPageTableInstance>()
const selectedRows = ref<any[]>([])
const { sexDicItemList, statusDicItemList } = useData()
const {
  formItemArr,
  searchFormData,
  updateRowColCount,
  map,
  needShowToggleBtn,
  expand,
  toggleText,
  onToggle,
  onReset,
} = useSearchForm()

const { columnArr, dropdownItemArr, onClickDropdownItem, onDel, onEdit } =
  useJsonPageTable(
    searchFormData,
    selectedRows,
    sexDicItemList,
    statusDicItemList,
    // @ts-ignore
    toolbarJsonPageTableRef
  )

function searchPageData(
  pageParam?: LsyPageParam,
  sortInfo?: LsySortInfo
): Promise<LsyPageResult<any>> {
  console.log('排序条件:', sortInfo)
  return tabListMockAPI({
    searchParams: searchFormData.value,
    pageParams: pageParam,
  })
}
function onSearch() {
  toolbarJsonPageTableRef.value?.runSearchMethod({ page: 1 })
}
const isFullScreen = ref<boolean>(false)
const isLsyToolbarJsonPageTableFitAllContent = computed(() => {
  if (isFullScreen.value) {
    // 是全屏，则带工具条的表格需要充满整个容器高度
    return true
  } else {
    // 非全屏，则带工具条的表格是否充满整个容器高度, 由 isLongScreen 值决定
    return isLongScreen.value
  }
})
function onFullScreenCallback(flag: boolean) {
  setTimeout(() => {
    isFullScreen.value = flag
  }, 280)
}
</script>

<style scoped lang="scss">
.o-dyn-form-wrapper {
  ::v-deep(> form > .o-responsive-wrapper) {
    display: flex;
    flex-flow: row wrap;

    > div {
      padding-right: 5px;
      padding-left: 5px;

      // 当项div总数量少于colCount的时候，让最后一个保持右浮动
      &:last-child {
        margin-left: auto;
      }
    }
  }
}
</style>
