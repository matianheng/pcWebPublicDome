<template>
  <LsyTopMiddleMainContentLayout
    top-card-body-cls="!p-0"
    top-card-cls="!u-el-card-bg-color-none !border-none"
    middle-card-body-cls="!pb-0"
    :main-card-body-cls="isLongScreen ? 'h-full' : ''"
    :fit-all-content="isLongScreen"
  >
    <template #top>
      <!-- tab条  -->
      <DashboardTab
        v-if="renderDashboardTabNextTick"
        v-model:clickedTab="searchFormData.type"
        :tab-item-arr="tabItemArr"
      ></DashboardTab>
    </template>
    <template #middle>
      <!-- 查询表单 -->
      <LsyDynFormResponsive
        v-if="renderLsyDynFormResponsiveNextTick"
        ref="dynFormRef"
        v-model:form-data="searchFormData"
        v-model:needShowToggleBtn="needShowToggleBtn"
        :update-row-col-count-fun="updateRowColCount"
        :form-item-arr="formItemArr"
        :form-item-comp-name-map="map"
        :expand="expand"
      >
        <template #extraElFormItems>
          <el-form-item class="ml-auto">
            <LsyLoadingButton
              type="primary"
              @click="onSearch"
            ></LsyLoadingButton>
            <el-button>重置</el-button>
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
      v-if="renderLsyToolbarJsonPageTableNextTick"
      ref="toolbarJsonPageTableRef"
      v-model:columnArr="columnArr"
      v-model:selectedRows="selectedRows"
      :selection-column="true"
      :index-column="true"
      :search-page-data-method="searchPageData"
      :fit-all-content="isLsyToolbarJsonPageTableFitAllContent"
      :full-screen-callback="onFullScreenCallback"
    >
      <!-- 自定义列开始 -->
      <template #operation="{ rowIndex }">
        <el-popconfirm
          title="是否删除该记录?"
          :teleported="false"
          @confirm="() => onDel(rowIndex)"
        >
          <template #reference>
            <el-link
              type="danger"
              @click="() => fixPopConfirmCoveredByOtherRow(rowIndex)"
            >
              删除
            </el-link>
          </template>
        </el-popconfirm>
        <el-link class="ml-2" type="primary" @click="() => onEdit(rowIndex)">
          修改
        </el-link>
      </template>
      <template #name="{ scope }">
        <el-link
          class="ml-2"
          type="info"
          @click="() => onDetailPage(scope.row)"
        >
          {{ scope.row.name }}
        </el-link>
      </template>
      <!-- 自定义列结束 -->
      <template #leftToolbarGroup>
        <!-- 表格左上角工具按钮 -->
        <el-button v-if="needShowAddBtn" type="primary" class="mr-2">
          新增
        </el-button>
        <LsyDropdownButton
          :dropdown-item-arr="dropdownItemArr"
          @click-dropdown-item="onClickDropdownItem"
        ></LsyDropdownButton>
      </template>
    </LsyToolbarJsonPageTable>
  </LsyTopMiddleMainContentLayout>
</template>

<script setup lang="ts">
import {
  LsyPageParam,
  LsyPageResult,
  LsySortInfo,
  LsyToolbarJsonPageTableInstance,
} from '@/components/lsy/page-table/typing'
import { useSearchForm, useJsonPageTable, useData } from './TabSearchHook'
import { ref } from 'vue'
import DashboardTab, { TabItemType } from './DashboardTab.vue'
import { tabListMockAPI } from '../mock-api/ListApi'
import { computed } from 'vue'
import { UserInfo } from '../mock-api/ApiTyping'
import { useRouter } from 'vue-router'
import { useLsyLayoutStore } from '@/store/LsyLayoutStore'
import { storeToRefs } from 'pinia'
import { renderByRequestAnimationFrame } from '@/utils/VueComponentRenderUtil'
import { onMounted } from 'vue'

defineOptions({ name: 'SimpleSearch' })

const lsyLayoutStore = useLsyLayoutStore()
const { isLongScreen } = storeToRefs(lsyLayoutStore)
const toolbarJsonPageTableRef = ref<LsyToolbarJsonPageTableInstance>()
const selectedRows = ref<any[]>([])
const tabItemArr = ref<TabItemType[]>([
  { count: 10, flag: 'type-a', title: '类型A' },
  { count: 100, flag: 'type-b', title: '类型B' },
  { count: 1000, flag: 'type-c', title: '类型C' },
  {
    count: 10000,
    flag: 'type-d',
    title: '开始很长很长很长很长的类型D结束fjlakdjfl法甲联赛快点放假啊离开',
  },
])
/**
 * 修复确认气泡组件被其他行覆盖问题
 */
function fixPopConfirmCoveredByOtherRow(rowIndex: number) {
  const el = toolbarJsonPageTableRef.value?.$el as HTMLElement
  if (!el) return
  // 要先通过el-table的rowStyle将行的定位方式设置为相对定位, z-index才会生效
  const rowList = el.querySelectorAll<HTMLElement>('.el-table__row')
  // 将其他行的z-index都设置为0
  rowList.forEach(item => {
    item.style.zIndex = '0'
  })
  // 将当前点击行的z-index设置为1(不能设置的太大，否则会将el-table的滚动条给遮挡)
  rowList[rowIndex].style.zIndex = '1'
}
const {
  formItemArr,
  searchFormData,
  updateRowColCount,
  map,
  needShowToggleBtn,
  expand,
  toggleText,
  onToggle,
  onSearch,
  // @ts-ignore
} = useSearchForm(toolbarJsonPageTableRef)
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
const needShowAddBtn = computed(() => {
  if (searchFormData.value) {
    return !searchFormData.value.type || searchFormData.value.type === 'type-a'
  } else {
    return true
  }
})
const { sexDicItemList, statusDicItemList } = useData()

const { columnArr, dropdownItemArr, onClickDropdownItem, onDel, onEdit } =
  useJsonPageTable(
    searchFormData,
    sexDicItemList,
    statusDicItemList,
    selectedRows,
    // @ts-ignore
    toolbarJsonPageTableRef
  )
const $router = useRouter()
function onDetailPage(userInfo: UserInfo) {
  $router.push({
    name: 'NewDetailExample',
    params: { account: userInfo.account },
  })
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

const renderDashboardTabNextTick = ref<boolean>(false)
const renderLsyDynFormResponsiveNextTick = ref<boolean>(false)
const renderLsyToolbarJsonPageTableNextTick = ref<boolean>(false)
onMounted(() => {
  renderByRequestAnimationFrame(
    [
      () => (renderDashboardTabNextTick.value = true),
      () => (renderLsyDynFormResponsiveNextTick.value = true),
      () => (renderLsyToolbarJsonPageTableNextTick.value = true),
    ],
    0
  )
})
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
