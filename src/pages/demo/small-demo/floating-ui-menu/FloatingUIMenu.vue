<template>
  <div ref="wrapperRef" class="overflow-auto h-full" @scroll="onScroll">
    <FloatingUIMenuItem
      v-for="menuItem in menuData"
      :key="menuItem.key"
      :menu-item="menuItem"
      :scroll-top="scrollTop"
      @click="onClick"
    ></FloatingUIMenuItem>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { FloatingUIMenuType } from './FloatingUIMenu.d'
import FloatingUIMenuItem from './FloatingUIMenuItem.vue'
import { ref } from 'vue'
defineProps<{
  menuData: FloatingUIMenuType[]
}>()
const scrollTop = ref<number>(0)
function onScroll(e: UIEvent) {
  const target = e.target as HTMLElement
  if (!target) return

  scrollTop.value = target.scrollTop
}
const $emits = defineEmits<{
  click: [item: FloatingUIMenuType]
}>()

function onClick(clickedMenuItem: FloatingUIMenuType) {
  $emits('click', clickedMenuItem)
  ElMessage.success(`${clickedMenuItem.name}被点击`)
}
</script>

<style scoped></style>
