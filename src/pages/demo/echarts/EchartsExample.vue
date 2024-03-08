<template>
  <LsyContentContainer
    title="echarts使用"
    :enable-back-top-comp="true"
    :enable-toc="true"
  >
    <div class="pb-3">
      <el-card shadow="never">
        <template #header>
          <h3 class="font-bold">异步数据加载</h3>
        </template>
        <AsyncData></AsyncData>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card shadow="never">
        <template #header>
          <h3 class="font-bold">异步数据动态加载</h3>
        </template>
        <AsyncDynData></AsyncDynData>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card shadow="never">
        <template #header>
          <h3 class="font-bold">主题切换</h3>
        </template>
        <ThemeChange></ThemeChange>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card shadow="never">
        <template #header>
          <h3 class="font-bold">组织机构树</h3>
        </template>
        <EchartsOrgTree></EchartsOrgTree>
      </el-card>
    </div>
  </LsyContentContainer>
</template>

<script setup lang="ts">
import AsyncData from './demo/AsyncData.vue'
import AsyncDynData from './demo/AsyncDynData.vue'
import ThemeChange from './demo/ThemeChange.vue'
import EchartsOrgTree from './demo/EchartsOrgTree.vue'
</script>

<style scoped></style>
