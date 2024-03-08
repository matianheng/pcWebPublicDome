<template>
  <el-drawer
    v-model="showDrawerMenuComputed"
    :show-close="false"
    class="!w-64 o-system-drawer-menu"
    direction="ltr"
  >
    <div class="h-full w-full flex flex-col">
      <div class="shrink-0">
        <LsyLogo></LsyLogo>
      </div>
      <div class="flex-1 h-0 overflow-auto">
        <el-scrollbar>
          <LsyMenu
            mode="vertical"
            :menus="menus"
            popper-class="o-lsy-main-menu-vertical"
            @on-select="onMenuSelect"
          ></LsyMenu>
        </el-scrollbar>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { LsyMenuItemType } from './typing'

defineOptions({ name: 'LsyDrawerMenu' })

const props = withDefaults(
  defineProps<{
    showDrawerMenu?: boolean
    menus?: LsyMenuItemType[]
  }>(),
  { showDrawerMenu: false, menus: () => [] }
)

const $emits = defineEmits<{
  'update:showDrawerMenu': [val: boolean]
  onMenuSelect: [index: string, indexPath: string[]]
}>()

const showDrawerMenuComputed = computed<boolean>({
  set(val: boolean) {
    $emits('update:showDrawerMenu', val)
  },
  get() {
    return props.showDrawerMenu
  },
})

function onMenuSelect(index: string, indexPath: string[]) {
  $emits('onMenuSelect', index, indexPath)
}
</script>

<style lang="scss">
.o-system-drawer-menu {
  .el-drawer__header {
    margin: 0;
    padding: 0;
  }

  .el-drawer__body {
    padding: 0;
  }
}
</style>
