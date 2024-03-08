<template>
  <div class="c-lsy-header flex flex-row h-full">
    <!-- logo组件 -->
    <div
      v-if="showLogo"
      class="shrink-0"
      :class="[
        showLogoText
          ? tailwindSafetyListObj.wSystemSideWidth
          : tailwindSafetyListObj.wSystemSideMinWidth,
      ]"
    >
      <LsyLogo :show-text="showLogoText"></LsyLogo>
    </div>
    <!-- 控制侧边或抽屉菜单显示/隐藏的按钮 -->
    <div
      v-if="showSidePanelDrawerMenuToggleBtn"
      class="shrink-0 flex flex-col justify-center pr-2 pl-2"
    >
      <el-button
        text
        :class="layoutType !== 'Left-Top-Bottom' ? 'o-dark-hover-bg' : ''"
        @click="onToggleSideNavOrDrawerMenu"
      >
        <el-icon :size="24">
          <Fold v-if="sidePanelExpandOrDrawerMenuShowStatus" />
          <Expand v-else />
        </el-icon>
      </el-button>
    </div>
    <!-- 面包屑组件 -->
    <div
      v-if="needShowBreadcrumb"
      class="shrink-0 flex flex-col justify-center"
    >
      <LsyBreadcrumb :data-arr="breadcrumbItemMetadataArr"></LsyBreadcrumb>
    </div>
    <!-- 横向菜单组件 -->
    <div v-if="showMenu" class="flex-1 w-0 overflow-x-auto u-hidden-scrollbar">
      <LsyMenu
        popper-class="o-lsy-main-menu-horizontal"
        :menus="menus"
        mode="horizontal"
        :custom-set-active-index="customSetElMenuActiveIndex"
        :default-active="elMenuDefaultActive"
        @on-select="onMenuSelect"
      ></LsyMenu>
    </div>
    <!-- 工具栏组件 -->
    <div class="shrink-0 ml-auto">
      <LsyHeaderToolbar
        :class="layoutType !== 'Left-Top-Bottom' ? 'o-white-color' : ''"
      ></LsyHeaderToolbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { tailwindSafetyListObj } from '@/utils/TailwindSafeList'
import { LsyMenuItemType } from './menu/typing'
import { Expand, Fold } from '@element-plus/icons-vue'
import { LayoutType } from './typing'
import { LsyBreadcrumbItem } from './breadcrumb/typing'
import { toRefs } from 'vue'
import { computed } from 'vue'

defineOptions({ name: 'LsyHeader' })

const props = withDefaults(
  defineProps<{
    /**
     * 是否需要显示logo组件
     */
    showLogo?: boolean
    /**
     * 是否需要显示logo组件中的logo文本
     */
    showLogoText?: boolean
    /**
     * 是否需要显示菜单组件
     */
    showMenu?: boolean
    /**
     * 菜单数据
     */
    menus?: LsyMenuItemType[]
    /**
     * 侧边面板展开状态或抽屉菜单显示状态
     *
     * 值为true表示侧边面板展开或抽屉菜单显示
     *
     * 值为false表示侧边面板收缩或抽屉菜单隐藏
     */
    sidePanelExpandOrDrawerMenuShowStatus: boolean
    /**
     * 是否显示控制侧边菜单或抽屉菜单显示/隐藏的控制按钮. 默认:true
     */
    showSidePanelDrawerMenuToggleBtn?: boolean
    /**
     * 系统主体布局方式
     */
    layoutType: LayoutType
    /**
     * 是否手动设置菜单组件的default-active属性. 默认:false
     */
    customSetElMenuActiveIndex?: boolean
    /**
     * 对应el-menu的defaultActive属性. 仅当customSetActiveIndex为true时，才生效
     */
    elMenuDefaultActive?: string
    /**
     * 面包屑元数据
     */
    breadcrumbItemMetadataArr?: LsyBreadcrumbItem[]
    /**
     * 是否为宽屏幕
     */
    isWideScreen?: boolean
  }>(),
  {
    showLogo: false,
    showLogoText: true,
    showMenu: false,
    menus: () => [],
    showSidePanelDrawerMenuToggleBtn: true,
    customSetActiveIndex: false,
    elMenuDefaultActive: undefined,
    breadcrumbItemMetadataArr: () => [],
    isWideScreen: true,
  }
)
const $emits = defineEmits<{
  onMenuSelect: [index: string, indexPath: string[]]
  onToggleSideNavOrDrawerMenu: []
}>()

const { isWideScreen, layoutType } = toRefs(props)

const needShowBreadcrumb = computed(() => {
  if (!isWideScreen.value) {
    // 非宽屏幕，则不显示面包屑组件
    return false
  }
  // 是宽屏幕，且是左上下布局，则显示面包屑组件
  return layoutType.value === 'Left-Top-Bottom'
})
function onMenuSelect(index: string, indexPath: string[]) {
  $emits('onMenuSelect', index, indexPath)
}
function onToggleSideNavOrDrawerMenu() {
  $emits('onToggleSideNavOrDrawerMenu')
}
</script>

<style scoped lang="scss">
.el-menu.o-lsy-main-menu-horizontal {
  height: 100%;

  ::v-deep(.el-menu-item) {
    line-height: 100%;
  }
}

.o-dark-hover-bg {
  &:active,
  &:hover,
  &:focus {
    background-color: var(--lsyMenuItemHoverBgColor) !important;
  }
}

.o-white-color {
  --tw-text-opacity: 1;

  color: rgb(255 255 255 / var(--tw-text-opacity));

  ::v-deep(.o-nike-name) {
    color: rgb(255 255 255 / var(--tw-text-opacity));
  }
}
</style>
