<template>
  <div ref="eleRef">
    <el-icon><location /></el-icon>
    <span><slot></slot></span>
  </div>
</template>

<script setup lang="ts">
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'
import { onBeforeMount, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'

const eleRef = ref<HTMLDivElement>()

onMounted(() => {
  const eleDom = eleRef.value
  if (!eleDom) return

  const parentElement = eleDom.parentElement
  if (!parentElement) return

  parentElement.addEventListener('click', onClick)
})

function onClick() {
  ElMessage.success('点击了父菜单')
}

onBeforeMount(() => {
  const eleDom = eleRef.value
  if (!eleDom) return

  const parentElement = eleDom.parentElement
  if (!parentElement) return

  parentElement.removeEventListener('click', onClick)
})
</script>

<style scoped></style>
