import { defineStore } from 'pinia'
import { useLsyMenuBreadcrumbTabStore } from './LsyMenuBreadcrumbTabStore'
import { computed } from 'vue'
import { useLsyLayoutStore } from './LsyLayoutStore'
import { LsyMenuItemType } from '@/components/lsy/menu/typing'
import { tailwindSafetyListObj } from '@/utils/TailwindSafeList'
/*
该store存在的原因: pinia的store不能相互依赖 (即:LsyLayoutStore.ts, LsyMenuBreadcrumbTabStore.ts不能存在你中有我，我中有你的情况)，
因此抽取到了一个公共Store(LsyLayoutAndMenuStore.ts)
 */
export const useSystemLayoutAndMenuStore = defineStore(
  'lsy-layout-and-menu',
  () => {
    const lsyBreadcrumbTabStore = useLsyMenuBreadcrumbTabStore()
    const lsyLayoutStore = useLsyLayoutStore()

    const leftSystemSideWidthCls = computed(() => {
      return lsyLayoutStore.expandSidePanel
        ? tailwindSafetyListObj.leftSystemSideWidth
        : sideMenuHasData.value
        ? tailwindSafetyListObj.leftSystemSideMinWidth
        : 'left-0'
    })

    const headerLayoutClsComputed = computed(() => {
      let cls = `${tailwindSafetyListObj.hSystemHeaderHeight}`
      if (
        lsyLayoutStore.layoutType == 'Top-Bottom' ||
        lsyLayoutStore.layoutType == 'Top-Left-Right' ||
        !lsyLayoutStore.isWideScreen
      ) {
        // 如果是上下布局或上左右或者非宽屏幕，则header长度充满整个视口，则 left 值为 0
        cls += ` left-0`
      } else if (lsyLayoutStore.layoutType === 'Left-Top-Bottom') {
        // 左上下结构，则left值与侧边面板宽度保持一致
        cls += ` ${leftSystemSideWidthCls.value}`
      }

      return cls
    })
    const systemSideWidthCls = computed(() => {
      if (lsyLayoutStore.expandSidePanel) {
        // 展开状态是正常宽度
        return tailwindSafetyListObj.wSystemSideWidth
      } else {
        // 收缩状态, 则看侧边菜单是否有数据，有数据则是最小宽度，否则宽度为0
        return sideMenuHasData.value
          ? tailwindSafetyListObj.wSystemSideMinWidth
          : 'w-0'
      }
    })
    const sideLayoutClsComputed = computed(() => {
      let cls = ``

      if (lsyLayoutStore.layoutType === 'Left-Top-Bottom') {
        // 左上下结构
        cls += ` top-0 ${systemSideWidthCls.value}`
      } else if (lsyLayoutStore.layoutType === 'Top-Left-Right') {
        // 上左右结构
        cls += ` ${tailwindSafetyListObj.topSystemHeaderHeight} ${systemSideWidthCls.value}`
      }

      return cls
    })
    const mainPlSystemSideWidthCls = computed(() => {
      if (!lsyLayoutStore.isWideScreen) {
        // 如果不是宽屏幕，则aside不会显示，因此padding-left要设置为0
        return 'pl-0'
      }
      if (lsyLayoutStore.expandSidePanel) {
        // 如果是展开状态，那padding-left就和aside的宽度一致
        return tailwindSafetyListObj.plSystemSideWidth
      } else {
        // 收缩状态，如果侧边菜单有数据，则padding-left值与aside的最小宽度一致，否则padding-left为0
        return sideMenuHasData.value
          ? tailwindSafetyListObj.plSystemSideMinWidth
          : 'pl-0'
      }
    })
    const mainLayoutClsComputed = computed(() => {
      let cls = `${tailwindSafetyListObj.ptSystemHeaderHeight}`

      if (lsyLayoutStore.layoutType !== 'Top-Bottom') {
        // 非上下结构
        cls += ` ${mainPlSystemSideWidthCls.value}`
      }

      return cls
    })
    /**
     * 系统头部菜单数据
     */
    const headerMenuData = computed<LsyMenuItemType[]>(() => {
      if (lsyLayoutStore.layoutType === 'Top-Bottom') {
        return lsyBreadcrumbTabStore.menuArr
      } else if (lsyLayoutStore.layoutType === 'Top-Left-Right') {
        return lsyBreadcrumbTabStore.rootMenuArr
      } else {
        return []
      }
    })
    /**
     * 系统侧边菜单数据
     */
    const sideMenuData = computed<LsyMenuItemType[]>(() => {
      if (lsyLayoutStore.layoutType === 'Left-Top-Bottom') {
        // 左上下布局，则直接使用完整菜单数据
        return lsyBreadcrumbTabStore.menuArr
      } else if (lsyLayoutStore.layoutType === 'Top-Left-Right') {
        // 上左右布局，则根据头部菜单中选中的菜单项，找出对应子菜单作为侧边菜单数据
        return lsyBreadcrumbTabStore.clickedRootMenuItemRouteName ===
          undefined ||
          lsyBreadcrumbTabStore.clickedRootMenuItemRouteName === null ||
          lsyBreadcrumbTabStore.clickedRootMenuItemRouteName === ''
          ? []
          : lsyBreadcrumbTabStore.findChildMenuTree(
              lsyBreadcrumbTabStore.clickedRootMenuItemRouteName
            ) ?? []
      } else {
        return []
      }
    })
    const sideMenuHasData = computed(
      () => sideMenuData.value && sideMenuData.value.length > 0
    )
    return {
      sideMenuHasData,
      leftSystemSideWidthCls,
      headerLayoutClsComputed,
      systemSideWidthCls,
      sideLayoutClsComputed,
      mainPlSystemSideWidthCls,
      mainLayoutClsComputed,
      headerMenuData,
      sideMenuData,
    }
  }
)
