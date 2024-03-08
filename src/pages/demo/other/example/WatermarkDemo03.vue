<template>
  <div>
    <div class="text-sm mb-3">被加水印的元素的定位必须是相对定位</div>
    <div class="mb-3">
      <el-button @click="build">加水印</el-button>
      <el-button @click="clear">去除水印</el-button>
    </div>
    <div
      ref="waterMarkDomRef"
      class="relative bg-red-200 p-3"
      :class="shortHeight ? 'h-32' : 'h-96'"
    >
      <div>动态高度元素</div>
      <el-button type="primary" @click="() => (shortHeight = !shortHeight)">
        调整高度
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watermarkBuilder } from '@/components/lsy/watermark'
import { ref } from 'vue'

const waterMarkDomRef = ref<HTMLDivElement>()
const shortHeight = ref<boolean>(false)
const { build, clear } = watermarkBuilder(
  {
    text: '管理系统骨架',
    width: 235,
    height: 70,
    fontSize: 16,
    fontFamily: 'Microsoft Yahei',
    color: '#ffe7ba',
    angle: -20,
    zIndex: 999,
    position: 'absolute',
    textAlign: 'right',
    textBaseline: 'alphabetic',
    x: 90,
    y: 50,
  },
  () => waterMarkDomRef.value
)
</script>

<style scoped></style>
