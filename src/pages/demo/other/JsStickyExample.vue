<template>
  <LsyContentContainer
    title="结合js实现粘性布局"
    :features="[
      '基于当前组件的实现方式, 本地修改代码后，请刷新浏览器，否则效果可能与预期不符',
      '不建议使用防抖函数来优化onScroll的执行,因为onScroll的执行频率是与屏幕刷新率一致的',
    ]"
    :enable-back-top-comp="true"
    :enable-toc="true"
  >
    <el-card class="mb-3">
      <template #header>
        <h3 class="font-bold">粘性布局元素就是标题dom本身,无多余dom</h3>
        <small>src\pages\demo\other\example\JsStickyDemo01.vue</small>
      </template>
      <JsStickyDemo01></JsStickyDemo01>
    </el-card>
    <el-card class="mb-3">
      <template #header>
        <h3 class="font-bold">粘性布局元素是独立元素</h3>
        <small>src\pages\demo\other\example\JsStickyDemo02.vue</small>
      </template>
      <JsStickyDemo02></JsStickyDemo02>
    </el-card>
    <el-card class="mb-3">
      <template #header>
        <h3 class="font-bold">综合示例</h3>
        <small>src\pages\demo\other\example\JsStickyDemo03.vue</small>
      </template>
      <JsStickyDemo03></JsStickyDemo03>
    </el-card>
  </LsyContentContainer>
</template>

<script setup lang="ts">
import JsStickyDemo01 from './example/JsStickyDemo01.vue'
import JsStickyDemo02 from './example/JsStickyDemo02.vue'
import JsStickyDemo03 from './example/JsStickyDemo03.vue'
</script>

<style scoped lang="scss"></style>
