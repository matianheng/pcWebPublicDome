<!--
  
整合LsyRouterTabs.vue与LsyRouterViewKeepAliveWrapper.vue组件，并通过该组件对外提供服务

@author: pan
@createDate: 2023-09-11 19:10
-->
<script setup lang="ts">
import { useLsyMenuBreadcrumbTabStore } from '@/store/LsyMenuBreadcrumbTabStore'
import { storeToRefs } from 'pinia'
import LsyRouterViewKeepAliveWrapper from './LsyRouterViewKeepAliveWrapper.vue'
import LsyRouterTabs from './LsyRouterTabs.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { emitter } from '@/utils/Emitter'
import {
  refreshCur,
  closeCurAndToRoute,
  openTabAndToRoute,
  closeOther,
} from './events'
import { RouteLocationRaw } from 'vue-router'
import {
  LsyOpenedTabMetadata,
  LsyRouterViewKeepAliveWrapperInstance,
  LsyRouterTabsInstance,
} from './typing'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const $router = useRouter()

const lsyMenuBreadcrumbTabStore = useLsyMenuBreadcrumbTabStore()
const { tabMetadataArr } = storeToRefs(lsyMenuBreadcrumbTabStore)

const routerViewKeepAliveWrapperRef =
  ref<LsyRouterViewKeepAliveWrapperInstance>()
const routerTabsRef = ref<LsyRouterTabsInstance>()
function onRefresh(dynCompName: string) {
  routerViewKeepAliveWrapperRef.value?.refresh(dynCompName)
}
function onClose(dynCompName: string, toPath?: string) {
  routerViewKeepAliveWrapperRef.value?.removeKeepAliveCache(dynCompName)
  if (toPath) {
    // 暂时停用路由更新时，对from路由的keep-alive缓存控制
    routerViewKeepAliveWrapperRef.value?.doStopFromRouteKeepAliveConfigUpdateUntilNext()
    toRoutePath(toPath)
  }
}
function toRoutePath(path?: string) {
  if (path) {
    $router.push(path)
  }
}
function onTabClick(dynCompName: string, toPath?: string) {
  toRoutePath(toPath)
}

function onCloseAll(dynCompNameArr: string[], toPath?: string) {
  removeMutilKeepAliveCache(dynCompNameArr)
  if (toRoutePath) {
    // 暂时停用路由更新时，对from路由的keep-alive缓存控制
    routerViewKeepAliveWrapperRef.value?.doStopFromRouteKeepAliveConfigUpdateUntilNext()
    toRoutePath(toPath)
  }
}
function removeMutilKeepAliveCache(dynCompNameArr: string[]) {
  if (dynCompNameArr && dynCompNameArr.length > 0) {
    routerViewKeepAliveWrapperRef.value?.removeMutilKeepAliveCache(
      dynCompNameArr
    )
  }
}
function onCloseOther(
  dynCompName: string,
  isOperateActiveTab: boolean,
  closeAbleOpenedTabIndexArr: string[],
  toPath?: string
) {
  removeMutilKeepAliveCache(closeAbleOpenedTabIndexArr)
  if (!isOperateActiveTab && toPath) {
    routerViewKeepAliveWrapperRef.value?.doStopFromRouteKeepAliveConfigUpdateUntilNext()
  }
  toRoutePath(toPath)
}

function onCloseRight(
  activeIsClosed: boolean,
  closeAbleTabIndexArr: string[],
  toPath?: string
) {
  removeMutilKeepAliveCache(closeAbleTabIndexArr)
  if (activeIsClosed && toPath) {
    routerViewKeepAliveWrapperRef.value?.doStopFromRouteKeepAliveConfigUpdateUntilNext()
  }
  toRoutePath(toPath)
}

emitter.on(refreshCur, () => {
  routerViewKeepAliveWrapperRef.value?.refreshCur()
})

emitter.on(closeCurAndToRoute, ([to, resolve]) => {
  routerTabsRef.value?.closeCurTab()
  routerViewKeepAliveWrapperRef.value?.removeCurKeepAliveCache()
  routerViewKeepAliveWrapperRef.value?.doStopFromRouteKeepAliveConfigUpdateUntilNext()
  $router.push(to).then(() => {
    resolve()
  })
})
emitter.on(closeOther, () => {
  routerTabsRef.value?.closeOtherTab()
})

emitter.on(openTabAndToRoute, (to: RouteLocationRaw) => {
  routerTabsRef.value?.createOrToTab(to)
  $router.push(to)
})

function buildTabName(tab: LsyOpenedTabMetadata) {
  return t(tab.name as string)
}
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- tab面板 -->
    <div
      class="flex-shrink-0 pl-3 pr-3 border-b-2 border-gray-100 border-solid bg-white o-lsy-main-tab"
    >
      <LsyRouterTabs
        ref="routerTabsRef"
        :tab-metadata-arr="tabMetadataArr"
        :build-tab-name="buildTabName"
        @refresh="onRefresh"
        @close="onClose"
        @tab-click="onTabClick"
        @close-all="onCloseAll"
        @close-other="onCloseOther"
        @close-right="onCloseRight"
      ></LsyRouterTabs>
    </div>
    <!-- tab内容 -->
    <div class="flex-1 h-0">
      <LsyRouterViewKeepAliveWrapper
        ref="routerViewKeepAliveWrapperRef"
        :max="5"
      ></LsyRouterViewKeepAliveWrapper>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
