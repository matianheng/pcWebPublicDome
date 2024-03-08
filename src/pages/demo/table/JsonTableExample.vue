<template>
  <LsyContentContainer
    title="json分页表格"
    desc="通过json配置方式快速实现分页表格"
    :features="[
      '支持el-table所有功能',
      '封装简单, 完全使用SFC方式封装, 更易懂, 更易维护, 更符合大部分vue前端的使用习惯',
      '第三方组件的封装, 可参考此类封装方式, 能在几乎不阉割原始组件的基础上进行扩展',
    ]"
    :enable-back-top-comp="true"
    :enable-toc="true"
    :lazy-render-content="true"
  >
    <div class="pb-3">
      <!-- 
        // -important- 这个v-if="stepRenderFlagArr[0]"的判断，应该尽可能的放在上级节点，这能减小vue对vNode进行差异比较的工作量，从而使界面渲染更快速
        例如: 不要将v-if="stepRenderFlagArr[0]"的判断，放在JsonTableDemo16这类组件这，这回导致初始界面渲染el-card相关的dom节点，从而会增加后续渲染JsonTableDemo16组件时，vue对比vNode的工作量
       -->
      <el-card v-if="stepRenderFlagArr[0]" shadow="never">
        <template #header>
          <h3 class="font-bold">loading控制</h3>
          <small>JsonTableDemo16</small>
        </template>
        <JsonTableDemo16></JsonTableDemo16>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card v-if="stepRenderFlagArr[1]" shadow="never">
        <template #header>
          <h3 class="font-bold">分页条控制</h3>
          <small>JsonTableDemo15</small>
        </template>
        <JsonTableDemo15></JsonTableDemo15>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card v-if="stepRenderFlagArr[2]" shadow="never">
        <template #header>
          <h3 class="font-bold">基础表格</h3>
          <small>JsonTableDemo01</small>
        </template>
        <JsonTableDemo01></JsonTableDemo01>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card v-if="stepRenderFlagArr[3]" shadow="never">
        <template #header>
          <h3 class="font-bold">带斑马纹表格</h3>
          <small>JsonTableDemo02</small>
        </template>
        <JsonTableDemo02></JsonTableDemo02>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card v-if="stepRenderFlagArr[4]" shadow="never">
        <template #header>
          <h3 class="font-bold">带边框表格</h3>
          <small>JsonTableDemo03</small>
        </template>
        <JsonTableDemo03></JsonTableDemo03>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card v-if="stepRenderFlagArr[5]" shadow="never">
        <template #header>
          <h3 class="font-bold">带状态表格</h3>
          <small>JsonTableDemo04</small>
        </template>
        <JsonTableDemo04></JsonTableDemo04>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card v-if="stepRenderFlagArr[6]" shadow="never">
        <template #header>
          <h3 class="font-bold">固定列</h3>
          <small>JsonTableDemo05</small>
        </template>
        <JsonTableDemo05></JsonTableDemo05>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card v-if="stepRenderFlagArr[7]" shadow="never">
        <template #header>
          <h3 class="font-bold">单选</h3>
          <small>JsonTableDemo06</small>
        </template>
        <JsonTableDemo06></JsonTableDemo06>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card v-if="stepRenderFlagArr[8]" shadow="never">
        <template #header>
          <h3 class="font-bold">多选</h3>
          <small>JsonTableDemo07</small>
        </template>
        <JsonTableDemo07></JsonTableDemo07>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card v-if="stepRenderFlagArr[9]" shadow="never">
        <template #header>
          <h3 class="font-bold">排序</h3>
          <small>JsonTableDemo08</small>
        </template>
        <JsonTableDemo08></JsonTableDemo08>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card v-if="stepRenderFlagArr[10]" shadow="never">
        <template #header>
          <h3 class="font-bold">自定义列模板</h3>
          <small>JsonTableDemo09</small>
        </template>
        <JsonTableDemo09></JsonTableDemo09>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card v-if="stepRenderFlagArr[11]" shadow="never">
        <template #header>
          <h3 class="font-bold">筛选</h3>
          <small>JsonTableDemo10</small>
        </template>
        <JsonTableDemo10></JsonTableDemo10>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card v-if="stepRenderFlagArr[12]" shadow="never">
        <template #header>
          <h3 class="font-bold">自定义列头</h3>
          <small>JsonTableDemo11</small>
        </template>
        <JsonTableDemo11></JsonTableDemo11>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card v-if="stepRenderFlagArr[13]" shadow="never">
        <template #header>
          <h3 class="font-bold">展开列</h3>
          <small>JsonTableDemo12</small>
        </template>
        <JsonTableDemo12></JsonTableDemo12>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card v-if="stepRenderFlagArr[14]" shadow="never">
        <template #header>
          <h3 class="font-bold">树形数据与懒加载</h3>
          <small>JsonTableDemo13</small>
        </template>
        <JsonTableDemo13></JsonTableDemo13>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card v-if="stepRenderFlagArr[15]" shadow="never">
        <template #header>
          <h3 class="font-bold">表尾合计</h3>
          <small>JsonTableDemo14</small>
        </template>
        <JsonTableDemo14></JsonTableDemo14>
      </el-card>
    </div>
  </LsyContentContainer>
</template>

<script setup lang="ts">
import { useStepRenderHooks } from '@/utils/VueComponentRenderUtil'
import JsonTableDemo01 from './json-table-demo/JsonTableDemo01.vue'
import JsonTableDemo02 from './json-table-demo/JsonTableDemo02.vue'
import JsonTableDemo03 from './json-table-demo/JsonTableDemo03.vue'
import JsonTableDemo04 from './json-table-demo/JsonTableDemo04.vue'
import JsonTableDemo05 from './json-table-demo/JsonTableDemo05.vue'
import JsonTableDemo06 from './json-table-demo/JsonTableDemo06.vue'
import JsonTableDemo07 from './json-table-demo/JsonTableDemo07.vue'
import JsonTableDemo08 from './json-table-demo/JsonTableDemo08.vue'
import JsonTableDemo09 from './json-table-demo/JsonTableDemo09.vue'
import JsonTableDemo10 from './json-table-demo/JsonTableDemo10.vue'
import JsonTableDemo11 from './json-table-demo/JsonTableDemo11.vue'
import JsonTableDemo12 from './json-table-demo/JsonTableDemo12.vue'
import JsonTableDemo13 from './json-table-demo/JsonTableDemo13.vue'
import JsonTableDemo14 from './json-table-demo/JsonTableDemo14.vue'
import JsonTableDemo15 from './json-table-demo/JsonTableDemo15.vue'
import JsonTableDemo16 from './json-table-demo/JsonTableDemo16.vue'
import { emitRerenderToc } from '@/components/lsy/toc/TocEmitter'
import { onMounted } from 'vue'

const { stepRender, stepRenderFlagArr } = useStepRenderHooks(16, () => {
  emitRerenderToc()
})
onMounted(() => {
  stepRender()
})
</script>

<style scoped></style>
