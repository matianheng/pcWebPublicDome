<!--
实现tab效果

@author: pan
@createDate: 2023-09-06 09:50
-->
<script setup lang="ts">
import { useRoute } from 'vue-router'
import {
  LsyTabMetadata,
  CardTabType,
  LsyTabMetadataFieldMapping,
  LsyOpenedTabMetadata,
  WindowHistoryState,
} from './typing'
import {
  convertTabMetadataArr,
  clearOpenedTabDataFromLocalStorage,
  loadOpenedTabDataFromLocalStorage,
  saveOpenedTabDataToLocalStorage,
} from './LsyRouterTabsUtil'
import { computed, onBeforeUnmount, ref, toRefs, watch } from 'vue'
import { TabPaneName, TabsPaneContext } from 'element-plus'
import {
  Refresh,
  View,
  Delete,
  CloseBold,
  ArrowDown,
} from '@element-plus/icons-vue'
import { buildWrapperCompNameByRoute } from './CommUtils'
import { RouteLocationNormalizedLoaded } from 'vue-router'
import { useRouter } from 'vue-router'
import { RouteLocationRaw } from 'vue-router'
import OpenedTabsDialog from './OpenedTabsDialog.vue'

const props = withDefaults(
  defineProps<{
    tabMetadataArr?: LsyTabMetadata[]
    tabMetadataFieldMapping?: LsyTabMetadataFieldMapping
    cardTabType?: CardTabType
    buildTabName?: (tab: LsyOpenedTabMetadata) => string
  }>(),
  {
    tabMetadataArr: () => [],
    cardTabType: undefined,
    buildTabName: (tab: LsyOpenedTabMetadata) => tab.name as string,
    tabMetadataFieldMapping: undefined,
  }
)

const { tabMetadataArr, tabMetadataFieldMapping } = toRefs(props)

/* eslint-disable */
const $emits = defineEmits({
  refresh: (dynRouteName: string) => true,
  closeAll: (dynCompNameArr: string[], toRoutePath?: string) => true,
  close: (dynRouteName: string, toRoutePath?: string) => true,
  tabClick: (dynRouteName: string, toRoutePath?: string) => true,
  closeOther: (
    dynCompName: string,
    isOperateActiveTab: boolean,
    closeAbleOpenedTabIndexArr: string[],
    toPath?: string
  ) => true,
  closeRight: (
    defaultActiveIsClosed: boolean,
    closeAbleOpenedTabIndexArr: string[],
    toPath?: string
  ) => true,
})
/* eslint-disable */

const defaultFiledMapping: LsyTabMetadataFieldMapping = {
  index: 'index',
  name: 'name',
  icon: 'icon',
  routePath: 'routePath',
  children: 'children',
  customDataMap: 'customDataMap',
  closeAble: 'closeAble',
  keepAlive: 'keepAlive',
}

const fieldMappingComputed = computed<LsyTabMetadataFieldMapping>(() => {
  return {
    ...defaultFiledMapping,
    ...tabMetadataFieldMapping.value,
  }
})

/**
 * key为TabMetadata的index
 */
const indexTabMetadataMap = computed(() => {
  const retMap = new Map<string, LsyTabMetadata>()
  convertTabMetadataArr(
    tabMetadataArr.value,
    retMap,
    fieldMappingComputed.value
  )
  return retMap
})

/**
 * 已打开的tab信息
 */
const tabArr = ref<LsyOpenedTabMetadata[]>(loadOpenedTabDataFromLocalStorage())
watch(
  tabArr,
  newVal => {
    saveOpenedTabDataToLocalStorage(newVal)
  },
  { immediate: true, deep: true }
)

const openedTabCount = computed(() => (tabArr.value ? tabArr.value.length : 0))

const $route = useRoute()
const defaultActive = ref<string>('')
const defaultActiveCanClose = ref<boolean>(false)

watch(
  [$route, indexTabMetadataMap],
  ([newRoute, newIndexTabMetadataMap]) => {
    updateTab(newRoute, newIndexTabMetadataMap)
  },
  {
    immediate: true,
  }
)
/**
 * 根据当前路由，更新已打开的tab信息(包括:更新选中的tab项，插入新tab，更新tab实际的路由跳转地址)
 * @param newRoute 路由信息
 * @param newIndexTabMetadataMap
 * @param forceCreateOrToTab 强制创建或转入tab
 */
function updateTab(
  newRoute: RouteLocationNormalizedLoaded,
  newIndexTabMetadataMap: Map<string, LsyTabMetadata>,
  forceCreateOrToTab?: boolean
) {
  const routeName = newRoute.name as string
  if (!routeName) return

  if (!newIndexTabMetadataMap || newIndexTabMetadataMap.size === 0) return

  const tabMetadata = newIndexTabMetadataMap.get(routeName)
  if (!tabMetadata) return

  const oldDefaultActive = defaultActive.value
  const openedTabArr = tabArr.value
  const oldActiveIdx = openedTabArr.findIndex(
    item => (item.index as string) === oldDefaultActive
  )
  const routeWrapperCompName = buildWrapperCompNameByRoute(newRoute)
  defaultActive.value = routeWrapperCompName
  const index = openedTabArr.findIndex(
    item => item.index === routeWrapperCompName
  )
  if (index < 0) {
    const historyState = window.history.state as WindowHistoryState
    const closeAble = newRoute.meta.closeAble === false ? false : true
    const baseTab: LsyOpenedTabMetadata = {
      ...tabMetadata,
      routePath: newRoute.fullPath,
      index: routeWrapperCompName,
      closeAble: closeAble,
      originalRouteName: routeName,
    }
    delete baseTab.children
    if (
      historyState &&
      (historyState.openInSameTab || historyState.replaced) &&
      oldActiveIdx >= 0
    ) {
      if (forceCreateOrToTab) {
        tabArr.value.push(baseTab)
      } else {
        tabArr.value.splice(oldActiveIdx, 1, baseTab)
      }
    } else {
      tabArr.value.push(baseTab)
    }
    defaultActiveCanClose.value = closeAble
  } else {
    if (!newRoute.meta.useRoutePathAsWrapperCompName) {
      // 此时表明多个url会在一个标签中打开，因此需要更新tab的路由为最新的
      tabArr.value[index].routePath = newRoute.fullPath
    }
    defaultActiveCanClose.value =
      tabArr.value[index].closeAble === false ? false : true
  }
}

function onTabRemove(tabPaneName: TabPaneName) {
  closeTab(tabPaneName as string)
}
/**
 * 关闭其他标签页
 */
function closeOtherTab() {
  onCloseOther(defaultActive.value)
}

function closeTab(dynCompName: string) {
  const openedTabArr = tabArr.value
  const idx = openedTabArr.findIndex(item => item.index === dynCompName)
  let toRoutePath: string | undefined = undefined
  if (idx >= 0) {
    // 关闭当前标签
    openedTabArr.splice(idx, 1)
    if (defaultActive.value === dynCompName) {
      // 现在关闭的tab是当前处于活动状态的tab
      let tmp
      if (openedTabArr.length === 1) {
        // 关闭当前标签之后，打开的标签只剩一个了，则转入这剩下的这个标签
        tmp = openedTabArr[0]
      } else if (idx - 1 >= 0) {
        // 当前关闭的标签非第一个，则转入当前标签页的上一个位置的标签的路由
        tmp = openedTabArr[idx - 1]
      } else {
        // 当前关闭的标签为第一个，则转入下一个位置标签的路由
        tmp = openedTabArr[idx]
      }
      if (tmp) {
        toRoutePath = tmp.routePath
      }
    }
    $emits('close', dynCompName, toRoutePath)
  }
}

const $router = useRouter()

/**
 * 关闭当前tab
 */
function closeCurTab() {
  closeTab(defaultActive.value)
}
/**
 * 根据to路由信息,创建或转入tab
 */
function createOrToTab(to: RouteLocationRaw) {
  const route = $router.resolve(to)
  updateTab(route, indexTabMetadataMap.value, true)
}
function closeAllTab() {
  const openedTabArr = tabArr.value
  let closeAbleOpenedTabIndexArr = openedTabArr
    .filter(item => item.closeAble !== false)
    .map(item => item.index as string)
  tabArr.value = extractDisableCloseTabArr(
    openedTabArr,
    closeAbleOpenedTabIndexArr
  )
  let toRoutePath: string | undefined
  if (closeAbleOpenedTabIndexArr.includes(defaultActive.value)) {
    // 获取关闭当前tab之后,需要跳转进去的路由地址
    if (tabArr.value.length > 1) {
      toRoutePath = tabArr.value[tabArr.value.length - 1].routePath as string
    } else if (tabArr.value.length === 1) {
      toRoutePath = tabArr.value[0].routePath as string
    }
  }
  $emits('closeAll', closeAbleOpenedTabIndexArr, toRoutePath)
}

function extractDisableCloseTabArr(
  openedTabArr: LsyOpenedTabMetadata[],
  closeAbleOpenedTabIndexArr: string[]
) {
  if (closeAbleOpenedTabIndexArr.length === openedTabArr.length) {
    // 所有tab都可关闭, 则保留第一个不关闭
    return [openedTabArr[0]]
  } else if (closeAbleOpenedTabIndexArr.length !== openedTabArr.length) {
    // 存在不可关闭的tab, 则过滤出剩余不会被关闭的
    return openedTabArr.filter(
      item => !closeAbleOpenedTabIndexArr.includes(item.index as string)
    )
  } else {
    // 全部都不可关闭
    return openedTabArr
  }
}

function onCloseOther(dynCompName: string, toPath?: string) {
  const isOperateActiveTab = dynCompName === defaultActive.value
  const openedTabArr = tabArr.value
  let closeAbleOpenedTabIndexArr = openedTabArr
    .filter(item => item.closeAble !== false && item.index !== dynCompName)
    .map(item => item.index as string)
  tabArr.value = extractDisableCloseTabArr(
    openedTabArr,
    closeAbleOpenedTabIndexArr
  )
  $emits(
    'closeOther',
    dynCompName,
    isOperateActiveTab,
    closeAbleOpenedTabIndexArr,
    toPath
  )
}

function onCloseRight(pos: number, dynCompName: string, toPath?: string) {
  const openedTabArr = tabArr.value
  // 获取可关闭的tab索引
  const closeAbleTabIndexArr = openedTabArr
    .filter((item, idx) => idx > pos && item.closeAble !== false)
    .map(item => item.index as string)
  const activeIsClosed = closeAbleTabIndexArr.includes(defaultActive.value)
  tabArr.value = extractDisableCloseTabArr(openedTabArr, closeAbleTabIndexArr)
  $emits('closeRight', activeIsClosed, closeAbleTabIndexArr, toPath)
}

function onTabClick({ paneName }: TabsPaneContext) {
  const openedTabArr = tabArr.value
  const idx = openedTabArr.findIndex(item => item.index === paneName)
  if (idx >= 0) {
    const { routePath } = openedTabArr[idx]
    $emits('tabClick', paneName as string, routePath)
  } else {
    $emits('tabClick', paneName as string)
  }
}

function onRefresh() {
  const dynCompName = buildWrapperCompNameByRoute($route)
  $emits('refresh', dynCompName)
}
// 该key用于解决el-tabs的标签无法重新排序问题
const elTabKey = ref<number>(1)
watch(tabArr, (newTabArr, oldTabArr) => {
  for (let i = 0; i < newTabArr.length; i++) {
    if (oldTabArr[i]) {
      if (newTabArr[i].index !== oldTabArr[i].index) {
        // 仅在已打开的新旧tab不一致时(排序不一致)，才改变el-tabs组件的key，让其重绘
        elTabKey.value += 1
        break
      }
    }
  }
})

const dialogVisible = ref<boolean>(false)

onBeforeUnmount(() => {
  clearOpenedTabDataFromLocalStorage()
})

defineExpose({
  closeAllTab,
  closeTab,
  closeCurTab,
  createOrToTab,
  closeOtherTab,
})
</script>

<template>
  <div class="flex flex-row h-full">
    <div class="flex-1 w-0">
      <el-tabs
        class="o-archetype-tabs"
        :key="elTabKey"
        :model-value="defaultActive"
        :type="cardTabType"
        @tab-remove="onTabRemove"
        @tab-click="onTabClick"
      >
        <template v-if="!$slots.label">
          <el-tab-pane
            v-for="(item, pos) in tabArr"
            :key="item.index"
            :label="props.buildTabName(item)"
            :name="item.index"
            :closable="item.closeAble && tabArr.length > 1"
          >
            <template #label>
              <span class="o-tab-item-title pl-1 pr-1 select-none">
                {{ props.buildTabName(item) }}
              </span>
            </template>
          </el-tab-pane>
        </template>
        <template v-else>
          <el-tab-pane
            v-for="item in tabArr"
            :key="item.index"
            :name="item.index"
          >
            <template #label>
              <slot
                name="label"
                :item="item"
                :cur-tab="defaultActive"
                :opened-tab-count="openedTabCount"
              ></slot>
            </template>
          </el-tab-pane>
        </template>
      </el-tabs>
    </div>
    <div class="flex-shrink-0">
      <el-dropdown class="h-full">
        <div
          class="h-full flex flex-col justify-center items-center w-10 text-center border-l-[rgba(0,21,41,.08)] border-solid border-l-2 outline-none"
        >
          <el-icon><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-if="openedTabCount > 1 && defaultActiveCanClose"
              @click="closeTab(defaultActive)"
            >
              <el-icon class="mr-1 ml-1"><CloseBold /></el-icon>关闭
            </el-dropdown-item>
            <el-dropdown-item @click="onCloseOther(defaultActive)">
              <el-icon class="mr-1 ml-1"><Delete /></el-icon>关闭其他标签页
            </el-dropdown-item>
            <el-dropdown-item v-if="defaultActive" @click="onRefresh">
              <el-icon class="mr-1 ml-1"> <Refresh /> </el-icon>
              刷新
            </el-dropdown-item>
            <el-dropdown-item @click="() => (dialogVisible = true)">
              <el-icon class="mr-1 ml-1"><View /></el-icon>所有已开标签
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <OpenedTabsDialog
      v-model:tabArr="tabArr"
      v-model:visible="dialogVisible"
      :defaultActive="defaultActive"
    ></OpenedTabsDialog>
  </div>
</template>

<style lang="scss" scoped>
.o-archetype-tabs {
  ::v-deep(.el-dropdown:focus-visible) {
    border: none;
    outline: none;
  }

  ::v-deep(.el-tabs__header) {
    margin-bottom: 0;
  }

  ::v-deep(.el-tabs__nav-prev) {
    width: 36px; /* px-to-viewport-ignore */
    box-shadow: -2px 0 5px #353434; /* px-to-viewport-ignore */
  }

  ::v-deep(.el-tabs__nav-next) {
    width: 36px; /* px-to-viewport-ignore */
    box-shadow: 2px 2px 5px #353434; /* px-to-viewport-ignore */
  }

  ::v-deep(.el-tabs__nav-wrap.is-scrollable) {
    padding: 0 36px;
  }

  ::v-deep(.el-tabs__nav-wrap::after) {
    display: none;
  }

  ::v-deep(.el-tabs__active-bar) {
    display: none;
  }

  ::v-deep(.el-tabs__item) {
    padding-right: 0.75rem !important;
    padding-left: 0.75rem !important;

    .o-tab-item-title {
      color: rgb(0 0 0 / 92%);
      transition: color 0.3s 0.1s;
    }

    &:hover {
      color: var(--primaryColor);

      .o-tab-item-title {
        color: var(--primaryColor);
      }
    }
  }

  ::v-deep(.el-tabs__item.is-active) {
    background-color: var(--primaryBgColor);

    .o-tab-item-title {
      color: var(--primaryColor);
    }
  }
}
</style>
