<template>
  <div ref="waterMarkDomRef" class="relative">
    <div class="text-sm mb-3">被加水印的元素的定位必须是相对定位</div>
    <div class="mb-3">
      <el-button @click="build">加水印</el-button>
      <el-button @click="clear">去除水印</el-button>
    </div>
    <div class="flex flex-col">
      <div class="font-bold">
        金缕衣<small class="text-xs ml-4">杜秋娘</small>
      </div>
      <p>劝君莫惜金缕衣，</p>
      <p>劝君惜取少年时。</p>
      <p>花开堪折直须折，</p>
      <p>莫待无花空折枝。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watermarkBuilder } from '@/components/lsy/watermark'
import { ref } from 'vue'

const waterMarkDomRef = ref<HTMLDivElement>()
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
