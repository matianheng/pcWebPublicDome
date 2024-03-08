<template>
  <div class="c-lsy-side flex flex-col h-full">
    <div v-if="showLogo" class="shrink-0">
      <!-- 系统侧边logo组件 -->
      <LsyLogo :show-text="showLogoText"></LsyLogo>
    </div>
    <div class="flex-1 h-0 overflow-auto">
      <!-- 系统侧边菜单 -->
      <el-scrollbar view-class="h-full">
        <LsyMenu
          v-if="showMenu"
          mode="vertical"
          :menus="menus"
          :collapse="collapseMenu"
          :popper-class="`o-lsy-main-menu-vertical ${menuPopperAppendCls}`"
          @on-select="onMenuSelect"
        ></LsyMenu>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LsyMenuItemType } from './menu/typing'

defineOptions({ name: 'LsySide' })
withDefaults(
  defineProps<{
    showLogo?: boolean
    showLogoText?: boolean
    showMenu?: boolean
    menus?: LsyMenuItemType[]
    /**
     * 是否折叠菜单。默认:false
     */
    collapseMenu?: boolean
    /**
     * 菜单组件Popper附加样式
     */
    menuPopperAppendCls?: string
  }>(),
  {
    showLogo: true,
    showLogoText: true,
    showMenu: true,
    menus: () => [],
    collapseMenu: false,
    menuPopperAppendCls: '',
  }
)
const $emits = defineEmits<{
  onMenuSelect: [index: string, indexPath: string[]]
}>()
function onMenuSelect(index: string, indexPath: string[]) {
  $emits('onMenuSelect', index, indexPath)
}
</script>

<style scoped lang="scss">
.el-menu.o-lsy-main-menu-vertical.el-menu--collapse {
  width: 100%;

  ::v-deep(.el-menu-item) {
    display: flex;
    justify-content: center;
  }

  ::v-deep(.el-sub-menu__title) {
    display: flex;
    justify-content: center;
  }
}
</style>
