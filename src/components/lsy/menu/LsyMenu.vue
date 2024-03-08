<template>
  <el-menu
    :default-active="activeMenuItemRouteName"
    :mode="mode"
    :class="popperClass"
    :ellipsis="false"
    :collapse="mode === 'vertical' && collapse"
    :menu-trigger="menuTrigger"
    :unique-opened="true"
    @select="onSelect"
  >
    <LsyMenuItem
      v-for="item in menus"
      :key="item.index"
      :item="item"
      :level="0"
      :popper-class="popperClass"
    ></LsyMenuItem>
  </el-menu>
</template>

<script setup lang="ts">
import { LsyMenuItemType, LsyMenuMode } from './typing'
import { RouteRecordName, useRoute } from 'vue-router'
import { computed, watch } from 'vue'
import { ref } from 'vue'
import { toRefs } from 'vue'
import { reduceMenuArr } from './LsyMenuUtil'
import { nextTick } from 'vue'
import { useMediaQuery } from '@/hooks/MediaQueryHook'

defineOptions({ name: 'LsyMenu' })
const props = withDefaults(
  defineProps<{
    /**
     * 菜单数据
     */
    menus?: LsyMenuItemType[]
    /**
     * 菜单类型. 默认: horizontal
     *
     * vertical: 垂直菜单
     *
     * horizontal: 水平
     */
    mode?: LsyMenuMode
    /**
     * popper组件的自定义class
     */
    popperClass?: string
    /**
     * 是否折叠(仅在mode为vertical生效). 默认：false
     */
    collapse?: boolean
    /**
     * 是否手动设置菜单组件的 activeMenuItemRouteName 属性. 默认:false
     */
    customSetActiveIndex?: boolean
    /**
     * 对应el-menu的defaultActive属性. 仅当customSetActiveIndex为true时，才生效
     */
    defaultActive?: string
  }>(),
  {
    menus: () => [],
    mode: 'horizontal',
    popperClass: undefined,
    collapse: false,
    customSetActiveIndex: false,
    defaultActive: undefined,
  }
)
const $emits = defineEmits<{
  onSelect: [index: string, indexPath: string[]]
}>()
const $route = useRoute()
const { customSetActiveIndex, defaultActive, menus, mode } = toRefs(props)
const activeMenuItemRouteName = ref<string>()
const supportHover = ref<boolean>(false)
const menuTrigger = computed<'click' | 'hover'>(() => {
  if (supportHover.value) {
    return mode.value === 'horizontal' ? 'hover' : 'click'
  } else {
    return 'click'
  }
})
useMediaQuery(
  'screen and (any-hover: hover)',
  () => {
    console.log('支持hover')
    supportHover.value = true
  },
  () => {
    console.log('不支持hover')
    supportHover.value = false
  }
)
/**
 * key 为 LsyMenuItemType 的 index 值
 */
const routeNameMapMenu = computed<Map<string, LsyMenuItemType>>(() => {
  const map = new Map<string, LsyMenuItemType>()
  reduceMenuArr(menus.value, map)
  return map
})

watch(
  [() => $route.name, defaultActive, routeNameMapMenu],
  ([newRouteName, newDefaultActive, newRouteNameMapMenu]) => {
    // 这里既加nextTick, 又加requestAnimationFrame是为了尽量延迟菜单高亮
    nextTick(() => {
      requestAnimationFrame(() => {
        updateActiveMenuItemRouteName(
          newRouteName,
          newDefaultActive,
          newRouteNameMapMenu
        )
      })
    })
  },
  { immediate: true }
)

/**
 * 更新菜单的高亮项
 *
 * @param newRouteName 最新的路由名
 * @param newDefaultActive 最新的默认激活菜单项表示(路由名)
 * @param newRouteNameMapMenu 最新的路由名与菜单数据map
 */
function updateActiveMenuItemRouteName(
  newRouteName: RouteRecordName | null | undefined,
  newDefaultActive: string | undefined,
  newRouteNameMapMenu: Map<string, LsyMenuItemType>
) {
  if (!customSetActiveIndex.value) {
    // 手动设置activeMenuItemRouteName
    let active = newRouteName as string
    const menuItem = newRouteNameMapMenu.get(active)
    if (menuItem) {
      if (menuItem.hide && menuItem.parentIndex) {
        // 当前菜单已被设置为隐藏，则高亮父菜单
        active = menuItem.parentIndex
      }
    }
    // @ts-ignore
    activeMenuItemRouteName.value = active
  } else {
    // 自动设置activeMenuItemRouteName
    console.log('newDefaultActive', newDefaultActive)
    activeMenuItemRouteName.value = newDefaultActive
  }
}

function onSelect(index: string, indexPath: string[]) {
  $emits('onSelect', index, indexPath)
}
</script>

<style scoped lang="scss"></style>
