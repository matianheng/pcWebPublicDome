<template>
  <!-- teleported设置为false的目的是防止全屏的时候dropdown不可见 -->
  <el-dropdown
    v-if="dropdownItemArr && dropdownItemArr.length > 0"
    :teleported="false"
    @command="onCommand"
  >
    <el-button>
      <slot>批量操作</slot>
      <el-icon class="el-icon--right"><arrow-down /></el-icon>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="dropdownItem in dropdownItemArr"
          :key="(dropdownItem.command as string)"
          :command="dropdownItem.command"
          :disabled="dropdownItem.disabled"
        >
          {{ buildText(dropdownItem.text) }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue'
import { DropDownItem, DropdownTextFun } from './typing'

defineOptions({ name: 'LsyDropdownButton' })
withDefaults(
  defineProps<{
    dropdownItemArr?: DropDownItem[]
  }>(),
  { dropdownItemArr: () => [] }
)
const $emits = defineEmits<{
  clickDropdownItem: [command: string | number | object]
}>()
function onCommand(command: string | number | object) {
  $emits('clickDropdownItem', command)
}
function buildText(text: string | DropdownTextFun) {
  if (text instanceof Function) {
    return text()
  } else {
    return text
  }
}
</script>

<style scoped></style>
