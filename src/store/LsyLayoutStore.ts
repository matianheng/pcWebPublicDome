import { LayoutType } from '@/components/lsy/typing'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useSystemLayoutAndMenuStore } from './LsyLayoutAndMenuStore'

export const useLsyLayoutStore = defineStore('lsy-layout-store', () => {
  const systemLayoutAndMenuStore = useSystemLayoutAndMenuStore()
  /**
   * 布局类型
   */
  const layoutType = ref<LayoutType>('Left-Top-Bottom')
  /**
   * 动效执行时间
   */
  const transitionDuration = 'duration-200'
  /**
   * 是否展开side面板(当屏幕是小屏幕时表示,是否显示drawer菜单)
   */
  const expandSidePanel = ref(true)
  /**
   * 屏幕类型: 是否宽屏幕(横向分辨率高)
   */
  const isWideScreen = ref(true)
  /**
   * 屏幕类型: 是否长屏幕(纵向分辨率高)
   */
  const isLongScreen = ref(true)
  /**
   * 是否使用多标签组件
   */
  const enableRouterTab = ref(true)
  /**
   * 是否显示控制侧边菜单或抽屉菜单显示/隐藏的控制按钮
   */
  const showSidePanelDrawerMenuToggleBtn = computed(() => {
    if (!isWideScreen.value) {
      return true
    } else {
      return layoutType.value !== 'Top-Bottom'
    }
  })

  /**
   * 是否需要展示系统侧边面板中的Logo面板
   */
  const needShowSystemSideLogo = computed(() => {
    if (!isWideScreen.value) {
      // 小屏幕一律不显示
      return false
    } else if (layoutType.value === 'Left-Top-Bottom') {
      // 左上下布局则显示
      return true
    } else {
      return false
    }
  })

  /**
   * 是否需要展示系统头部面板中的Logo面板
   */
  const needShowSystemHeaderLogo = computed(() => {
    if (!isWideScreen.value) {
      // 小屏幕一律都显示
      return true
    } else if (layoutType.value === 'Left-Top-Bottom') {
      // 左上下布局则不显示
      return false
    } else {
      return true
    }
  })

  /**
   * 是否需要展示系统侧边面板中的菜单面板
   */
  const needShowSystemSideMenu = computed(() => {
    if (
      layoutType.value === 'Left-Top-Bottom' ||
      layoutType.value === 'Top-Left-Right'
    ) {
      // 左上下布局和上左右布局则显示
      return true
    } else {
      return false
    }
  })

  /**
   * 是否需要展示系统头部面板中的菜单面板
   */
  const needShowSystemHeaderMenu = computed(() => {
    if (!isWideScreen.value) {
      // 小屏幕一律不显示
      return false
    } else if (
      layoutType.value === 'Top-Bottom' ||
      layoutType.value === 'Top-Left-Right'
    ) {
      // 上下布局和上左右布局则显示
      return true
    } else {
      return false
    }
  })

  function updateIsWideScreen(val: boolean) {
    isWideScreen.value = val
  }

  function updateIsLongScreen(val: boolean) {
    isLongScreen.value = val
  }

  /**
   * 更新侧边菜单的展开收缩状态
   * @param isExpand 是否展开
   */
  function updateExpandSidePanel(isExpand: boolean) {
    if (systemLayoutAndMenuStore.sideMenuHasData) {
      expandSidePanel.value = isExpand
    } else {
      expandSidePanel.value = false
    }
  }

  function toggleExpandSidePanel() {
    if (!isWideScreen.value || systemLayoutAndMenuStore.sideMenuHasData) {
      expandSidePanel.value = !expandSidePanel.value
    } else {
      expandSidePanel.value = false
    }
  }

  function changeLayoutType(val: LayoutType) {
    layoutType.value = val
  }

  /**
   * 是否需要显示系统侧边面板
   */
  const needShowSideComputed = computed(
    () => isWideScreen.value && layoutType.value !== 'Top-Bottom'
  )

  return {
    layoutType,
    enableRouterTab,
    showSidePanelDrawerMenuToggleBtn,
    needShowSystemSideMenu,
    needShowSystemHeaderMenu,
    needShowSystemSideLogo,
    needShowSystemHeaderLogo,
    expandSidePanel,
    isWideScreen,
    isLongScreen,
    transitionDuration,
    needShowSideComputed,
    updateExpandSidePanel,
    toggleExpandSidePanel,
    changeLayoutType,
    updateIsWideScreen,
    updateIsLongScreen,
  }
})
