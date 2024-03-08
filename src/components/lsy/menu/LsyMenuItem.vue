<template>
  <el-sub-menu
    v-if="hasChildren(item)"
    :index="item.index"
    :popper-class="popperClass"
  >
    <template #title>
      <el-icon v-if="needShowIcon()" class="o-menu-icon">
        <Link v-if="!item.icon" />
        <SvgIcon v-else :name="item.icon"></SvgIcon>
      </el-icon>
      <span class="o-menu-title">{{ item.name }}</span>
    </template>
    <LsyMenuItem
      v-for="child in item.children"
      :key="child.index"
      :item="child"
      :level="level + 1"
    ></LsyMenuItem>
  </el-sub-menu>
  <el-menu-item v-else :index="item.index">
    <el-icon v-if="needShowIcon()" class="o-menu-icon">
      <Link v-if="!item.icon" />
      <SvgIcon v-else :name="item.icon"></SvgIcon>
    </el-icon>
    <span class="o-menu-title">{{ item.name }}</span>
  </el-menu-item>
</template>

<script setup lang="ts">
import { LsyMenuItemType } from './typing'
import { Link } from '@element-plus/icons-vue'

defineOptions({ name: 'LsyMenuItem' })

const props = withDefaults(
  defineProps<{
    item: LsyMenuItemType
    level: number
    popperClass?: string
  }>(),
  { popperClass: undefined }
)

function hasChildren(menu: LsyMenuItemType) {
  return (
    menu.children !== undefined &&
    null !== menu.children &&
    !menu.hasHideChild &&
    menu.children.length > 0
  )
}
function needShowIcon() {
  return props.level === 0
}
</script>

<style scoped lang="scss"></style>
