<!--

@author: pan
@createDate: 2022-12-03 07:04
-->
<script setup lang="ts">
import { LsyMenuItemType } from '@/components/lsy/menu/typing'
import { useLsyLayoutStore } from '@/store/LsyLayoutStore'
import { useLsyMenuBreadcrumbTabStore } from '@/store/LsyMenuBreadcrumbTabStore'
import { useSystemLayoutAndMenuStore } from '@/store/LsyLayoutAndMenuStore'
import {
  MAIN_NAV_CLS,
  SUB_NAV_CLS,
  HEAD_SUB_NAV_CLS,
} from '@/utils/SystemConstants'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { RouteRecordName, useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { useMediaQuery } from '@/hooks/MediaQueryHook'
import { LayoutType } from '@/components/lsy/typing'
import { onMounted } from 'vue'
import { renderByRequestAnimationFrame } from '@/utils/VueComponentRenderUtil'

const lsyLayoutStore = useLsyLayoutStore()
const {
  transitionDuration,
  updateIsWideScreen,
  updateIsLongScreen,
  updateExpandSidePanel,
  toggleExpandSidePanel,
} = lsyLayoutStore
const {
  layoutType,
  enableRouterTab,
  showSidePanelDrawerMenuToggleBtn,
  needShowSideComputed,
  expandSidePanel,
  isWideScreen,
  needShowSystemHeaderLogo,
  needShowSystemSideLogo,
  needShowSystemSideMenu,
  needShowSystemHeaderMenu,
} = storeToRefs(lsyLayoutStore)

const systemLayoutAndMenuStore = useSystemLayoutAndMenuStore()
const {
  headerLayoutClsComputed,
  sideLayoutClsComputed,
  mainLayoutClsComputed,
  headerMenuData,
  sideMenuData,
} = storeToRefs(systemLayoutAndMenuStore)
// -important- 这里是系统区分屏幕特性的地方(区分屏幕长短和宽窄)
// -important- 如果要修改'screen and (min-width: 768px)'这个媒体查询, 那需要将侧边栏的显示/隐藏css控制(非展开收缩逻辑)也一同改变
useMediaQuery(
  'screen and (min-width: 768px)',
  () => {
    // 当前是宽屏幕(横向像素高)
    console.log(`当前判定为宽屏幕:${window.innerWidth}`)
    updateIsWideScreen(true)
  },
  () => {
    // 当前是宽屏幕(横向像素低)
    console.log(`当前判定为窄屏幕:${window.innerWidth}`)
    updateIsWideScreen(false)
  }
)
useMediaQuery(
  'screen and (max-height: 710px)',
  () => {
    console.log(`当前判定为短屏幕:${window.innerWidth}`)
    // 当前是短屏幕(纵向像素低)
    updateIsLongScreen(false)
  },
  () => {
    console.log(`当前判定为长屏幕:${window.innerWidth}`)
    // 当前是长屏幕(纵向像素高)
    updateIsLongScreen(true)
  }
)

const showDrawerMenu = computed<boolean>({
  set(val: boolean) {
    updateExpandSidePanel(val)
  },
  get() {
    return !isWideScreen.value && expandSidePanel.value
  },
})

const lsyMenuBreadcrumbTabStore = useLsyMenuBreadcrumbTabStore()
const { findMenuItem, updateClickedRootMenuItemRouteName } =
  lsyMenuBreadcrumbTabStore
const { menuArr, breadcrumbItemMetadataArr } = storeToRefs(
  lsyMenuBreadcrumbTabStore
)

function onHeaderMenuSelect(index: string, indexPath: string[]) {
  onMenuSelect(index, false)
}
function onSideMenuSelect(index: string, indexPath: string[]) {
  onMenuSelect(index, true)
}
function onDrawerMenuSelect(index: string, indexPath: string[]) {
  onMenuSelect(index, true)
}

const $router = useRouter()
/**
 * 菜单点击事件回调
 * @param index 菜单唯一标识(实际是路由名)
 * @param evtFromSideMenu 点击事件是否源自侧边菜单
 */
function onMenuSelect(index: string, evtFromSideMenu: boolean) {
  const clickedMenuItem = findMenuItem(index)
  if (clickedMenuItem) {
    const toRoutePath = clickedMenuItem.routePath
    if (toRoutePath) {
      $router.push({ path: toRoutePath })
    }
    if (!evtFromSideMenu && layoutType.value === 'Top-Left-Right') {
      // 点击的是头部菜单, 且布局方式为上左右布局(混合布局)，则更新选中的根菜单
      updateClickedRootMenuItemRouteName(index)
    }
  }
}
watch(
  [layoutType, sideMenuData, isWideScreen],
  ([newLayoutType, newSideMenuData, newIsWideScreen]) => {
    if (
      newLayoutType === 'Top-Left-Right' &&
      (!newSideMenuData || newSideMenuData.length === 0)
    ) {
      // 当前是混合布局且侧边菜单数据为空, 则关闭侧边面板
      updateExpandSidePanel(false)
    } else if (newIsWideScreen) {
      // (非混合布局)或(是混合布局且侧边菜单有数据), 则打开侧边面板
      updateExpandSidePanel(true)
    }
  }
)

function onToggleSideNavOrDrawerMenu() {
  toggleExpandSidePanel()
}

const elMenuDefaultActive = ref<string>()
const $route = useRoute()
watch(
  [() => $route.name, layoutType],
  ([newRouteName, newLayoutType]) => {
    updateElMenuDefaultActive(newRouteName, newLayoutType)
  },
  { immediate: true }
)

/**
 * 更新系统菜单的高亮项
 * @param newRouteName 最新路由名
 * @param newLayoutType 最新布局方式
 */
function updateElMenuDefaultActive(
  newRouteName: RouteRecordName | null | undefined,
  newLayoutType: LayoutType
) {
  if (newLayoutType === 'Top-Left-Right') {
    // 是上左右布局(混合布局)，则需要手动更新，否则菜单组件能自动更新高亮项
    if (newRouteName) {
      // 当前是上左右布局(混合布局)且当前路由存在路由名，则手动设置头部导航菜单的选中菜单项, 以及侧边菜单数据
      const item: LsyMenuItemType | undefined = findMenuItem(
        newRouteName as string
      )
      if (item) {
        // 将当前路由对应菜单项的根菜单的index值设置为选中项目
        const _index = item.rootIndex ? item.rootIndex : item.index
        // 手动设置头部菜单的激活菜单项
        elMenuDefaultActive.value = _index
        updateClickedRootMenuItemRouteName(_index)
      } else {
        elMenuDefaultActive.value = undefined
      }
    } else {
      elMenuDefaultActive.value = undefined
    }
  }
}

const renderMainContentNextTick = ref<boolean>(false)
const renderHeaderNextTick = ref<boolean>(false)
const renderSideNextTick = ref<boolean>(false)
const renderDrawerMenuNextTick = ref<boolean>(false)

onMounted(() => {
  renderByRequestAnimationFrame(
    [
      () => {
        renderMainContentNextTick.value = true
        renderHeaderNextTick.value = true
      },
      () => (renderSideNextTick.value = true),
      () => (renderDrawerMenuNextTick.value = true),
    ],
    0
  )
})
</script>

<template>
  <div class="w-full h-full o-lsy-main-layout-bg">
    <!-- 系统主体 -->
    <main
      :class="mainLayoutClsComputed"
      class="transition-expand-collapse w-full h-full"
    >
      <LsyMainContent
        v-if="renderMainContentNextTick"
        :enable-router-tab="enableRouterTab"
      ></LsyMainContent>
    </main>
    <!-- 系统头部 -->
    <header
      class="fixed top-0 right-0 transition-expand-collapse z-10"
      :class="[
        transitionDuration,
        headerLayoutClsComputed,
        // 判断头部是否为主导航，是主导航则加上 o-lsy-main-nav 类
        layoutType === 'Top-Bottom' || layoutType === 'Top-Left-Right'
          ? MAIN_NAV_CLS
          : HEAD_SUB_NAV_CLS,
      ]"
    >
      <LsyHeader
        v-if="renderHeaderNextTick"
        :show-logo-text="isWideScreen"
        :show-logo="needShowSystemHeaderLogo"
        :show-menu="needShowSystemHeaderMenu"
        :menus="headerMenuData"
        :side-panel-expand-or-drawer-menu-show-status="expandSidePanel"
        :show-side-panel-drawer-menu-toggle-btn="
          showSidePanelDrawerMenuToggleBtn
        "
        :layout-type="layoutType"
        :custom-set-el-menu-active-index="layoutType === 'Top-Left-Right'"
        :el-menu-default-active="elMenuDefaultActive"
        :breadcrumb-item-metadata-arr="breadcrumbItemMetadataArr"
        :is-wide-screen="isWideScreen"
        @on-menu-select="onHeaderMenuSelect"
        @on-toggle-side-nav-or-drawer-menu="onToggleSideNavOrDrawerMenu"
      ></LsyHeader>
    </header>
    <!-- 侧边面板 -->
    <aside
      v-show="needShowSideComputed"
      class="fixed left-0 bottom-0 transition-expand-collapse z-10"
      :class="[
        transitionDuration,
        sideLayoutClsComputed,
        // 判断侧边是否为主导航，是主导航则加上 o-lsy-main-nav 类
        layoutType === 'Left-Top-Bottom' ? MAIN_NAV_CLS : SUB_NAV_CLS,
      ]"
    >
      <LsySide
        v-if="renderSideNextTick"
        :show-logo-text="expandSidePanel"
        :show-logo="needShowSystemSideLogo"
        :show-menu="needShowSystemSideMenu"
        :menus="sideMenuData"
        :collapse-menu="!expandSidePanel"
        :menu-popper-append-cls="
          layoutType === 'Top-Left-Right' ? 'o-sub-menu-popper' : ''
        "
        @on-menu-select="onSideMenuSelect"
      ></LsySide>
    </aside>
    <!-- 移动端的抽屉菜单 -->
    <LsyDrawerMenu
      v-if="renderDrawerMenuNextTick"
      v-model:showDrawerMenu="showDrawerMenu"
      :menus="menuArr"
      @on-menu-select="onDrawerMenuSelect"
    ></LsyDrawerMenu>
  </div>
</template>

<style lang="scss" scoped>
.transition-expand-collapse {
  transition-property: left, width, top, padding-left;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: 400ms;
}

.o-lsy-main-layout-bg {
  > aside {
    will-change: width;
  }

  > main {
    will-change: padding-left;
  }
}
</style>
