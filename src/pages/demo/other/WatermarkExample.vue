<template>
  <LsyContentContainer
    title="水印组件"
    :enable-back-top-comp="true"
    :enable-toc="true"
  >
    <div class="pb-3">
      <el-card shadow="never">
        <template #header>
          <h3 class="font-bold">给整个界面加水印</h3>
          <small>src\pages\demo\other\example\WatermarkDemo04.vue</small>
        </template>
        <WatermarkDemo04></WatermarkDemo04>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card shadow="never">
        <template #header>
          <h3 class="font-bold">给普通html元素加水印</h3>
          <small>src\pages\demo\other\example\WatermarkDemo01.vue</small>
        </template>
        <WatermarkDemo01></WatermarkDemo01>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card shadow="never">
        <template #header>
          <h3 class="font-bold">给滚动容器加水印</h3>
          <small>src\pages\demo\other\example\WatermarkDemo02.vue</small>
        </template>
        <WatermarkDemo02></WatermarkDemo02>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card shadow="never">
        <template #header>
          <h3 class="font-bold">给动态高度元素加水印</h3>
          <small>src\pages\demo\other\example\WatermarkDemo03.vue</small>
        </template>
        <WatermarkDemo03></WatermarkDemo03>
      </el-card>
    </div>
  </LsyContentContainer>
</template>

<script setup lang="ts">
import WatermarkDemo01 from './example/WatermarkDemo01.vue'
import WatermarkDemo02 from './example/WatermarkDemo02.vue'
import WatermarkDemo03 from './example/WatermarkDemo03.vue'
import WatermarkDemo04 from './example/WatermarkDemo04.vue'
</script>

<style scoped></style>
