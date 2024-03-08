<!--
实现keep-alive缓存控制
@author: pan
@createDate: 2023-09-07 19:58
-->
<script setup lang="ts">
import { RouteLocationNormalized, onBeforeRouteUpdate } from 'vue-router'
import { VNode, nextTick, ref, toRefs } from 'vue'
import {
  getOrWrapperVNodeToVueCom,
  removeDynNameWrapperComp,
  updateKeepAliveInclude,
} from './LsyKeepAliveWrapperUtil'
import { buildWrapperCompNameByRoute } from './CommUtils'
import { removeListStrVal } from './CommUtils'
import { useRoute } from 'vue-router'

const props = withDefaults(
  defineProps<{
    /**
     * keep-alive组件能缓存的组件最大数量
     */
    max?: number
  }>(),
  {
    max: 10,
  }
)

const { max } = toRefs(props)
const include = ref<string[]>([])

/**
 * 是否停止对from路由的keep-alive缓存控制，直到下次路由刷新时才启用. 默认:false
 */
let stopFromRouteKeepAliveConfigUpdateUntilNext = false
function doStopFromRouteKeepAliveConfigUpdateUntilNext() {
  stopFromRouteKeepAliveConfigUpdateUntilNext = true
}

// @ts-ignore
onBeforeRouteUpdate(updateFromRouteKeepAliveCache)
/**
 * 路由更新前, 更新keep-alive的include值, 达到控制keep-alive缓存的目的
 * @param to to路由
 * @param from from路由
 */
function updateFromRouteKeepAliveCache(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized
) {
  const { name: toRouteName } = to
  const { name: fromRouteName, meta } = from

  const {
    keepAlive: fromRouteEnableKeepAlive = false,
    onlyToRouteKeepAlive = [],
  } = meta

  if (!fromRouteName || stopFromRouteKeepAliveConfigUpdateUntilNext) {
    // 恢复下次路由刷新时，对from路由的keep-alive缓存控制
    stopFromRouteKeepAliveConfigUpdateUntilNext = false
    return
  }

  const fromRouteCompDynWrapperName = buildWrapperCompNameByRoute(from)

  let fromRouteRealEnableKeepAlive = fromRouteEnableKeepAlive
    ? onlyToRouteKeepAlive.length === 0 ||
      onlyToRouteKeepAlive.includes(toRouteName as string)
    : false

  // 更新from路由的keepAlive配置
  updateKeepAliveInclude(
    include.value,
    fromRouteCompDynWrapperName,
    fromRouteRealEnableKeepAlive
  )
  return new Promise(resolve => {
    nextTick(() => {
      resolve(true)
    })
  })
}

const showRouterViewComp = ref<boolean>(true)
const keepAliveRef = ref()

/**
 * 刷新keep-alive缓存
 * @param dynCompName 待刷新缓存key
 */
function refresh(dynCompName: string) {
  const includeList = include.value
  const idx = includeList.findIndex(item => item === dynCompName)
  if (idx >= 0) {
    showRouterViewComp.value = false
    const deletedRet = includeList.splice(idx, 1)
    nextTick(() => {
      showRouterViewComp.value = true
      if (deletedRet.length > 0) {
        includeList.push(dynCompName)
      }
    })
  } else {
    showRouterViewComp.value = false
    nextTick(() => {
      showRouterViewComp.value = true
    })
  }
}
const $route = useRoute()
/**
 * 刷新当前路由组件的keep-alive缓存(重新加载当前路由组件)
 */
function refreshCur() {
  const dynCompName = buildWrapperCompNameByRoute($route)
  refresh(dynCompName)
}
/**
 * 清除当前路由组件的keep-alive缓存
 */
function removeCurKeepAliveCache() {
  const dynCompName = buildWrapperCompNameByRoute($route)
  removeKeepAliveCache(dynCompName)
}
/**
 * 删除keep-alive缓存
 * @param dynCompName 待删除缓存key
 */
function removeKeepAliveCache(dynCompName: string) {
  const includeList = include.value
  removeListStrVal(includeList, dynCompName)
}
/**
 * 删除多个keep-alive缓存
 * @param dynCompNameArr 待删除缓存key
 */
function removeMutilKeepAliveCache(dynCompNameArr: string[]) {
  if (!dynCompNameArr || dynCompNameArr.length === 0) return

  const includeList = include.value
  dynCompNameArr.forEach(item => {
    removeListStrVal(includeList, item)
  })
}
function onBeforeUnmountComp(vNode: VNode) {
  if (typeof vNode.key === 'string' && vNode.key) {
    removeDynNameWrapperComp(vNode.key as string)
  }
}

const transitionName = ref('slide')

defineExpose({
  removeMutilKeepAliveCache,
  removeKeepAliveCache,
  refresh,
  doStopFromRouteKeepAliveConfigUpdateUntilNext,
  refreshCur,
  removeCurKeepAliveCache,
})
</script>

<template>
  <div class="h-full w-full relative">
    <router-view v-slot="{ Component, route }">
      <transition :name="transitionName" mode="out-in">
        <keep-alive ref="keepAliveRef" :include="include" :max="max">
          <component
            :is="
              getOrWrapperVNodeToVueCom(
                buildWrapperCompNameByRoute(route),
                Component
              )
            "
            v-if="showRouterViewComp"
            :key="buildWrapperCompNameByRoute(route)"
            @vue:before-unmount="onBeforeUnmountComp"
          ></component>
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<style lang="scss" scoped>
.slide-enter-from {
  opacity: 0;
  transform: translateY(18%);
}

.slide-enter-to {
  transform: translateY(0);
  opacity: 1;
}

.slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.slide-leave-to {
  transform: translateX(90%);
  opacity: 0;
}

.slide-enter-active {
  position: absolute;
  right: 0;
  left: 0;
  transition: all 150ms;
  transition-delay: 80ms;
}

.slide-leave-active {
  position: absolute;
  right: 0;
  left: 0;
  transition: all 450ms;
}
</style>
