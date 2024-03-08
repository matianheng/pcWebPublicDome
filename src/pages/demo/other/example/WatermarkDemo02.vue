<template>
  <div>
    <div class="text-sm mb-3">被加水印的元素的定位必须是相对定位</div>
    <div class="text-sm mb-3">
      如果想给有滚动条的元素加水印，那就必须加在滚动条元素的父级元素
    </div>
    <div class="mb-3">
      <el-button @click="build">加水印</el-button>
      <el-button @click="clear">去除水印</el-button>
    </div>
    <div ref="waterMarkDomRef" class="relative">
      <div class="flex flex-col h-28 overflow-auto">
        <div class="font-bold">
          沁园春·雪<small class="text-xs ml-4">毛泽东</small>
        </div>
        <p>北国风光，千里冰封，万里雪飘。</p>
        <p>望长城内外，惟余莽莽；大河上下，顿失滔滔。</p>
        <p>山舞银蛇，原驰蜡象，欲与天公试比高。</p>
        <p>须晴日，看红装素裹，分外妖娆。</p>
        <p>江山如此多娇，引无数英雄竞折腰。</p>
        <p>惜秦皇汉武，略输文采；唐宗宋祖，稍逊风骚。</p>
        <p>一代天骄，成吉思汗，只识弯弓射大雕。</p>
        <p>俱往矣，数风流人物，还看今朝。</p>
      </div>
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
