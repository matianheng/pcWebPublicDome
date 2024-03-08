<template>
  <LsyContentContainer
    title="展开/收缩组件"
    :enable-back-top-comp="true"
    :enable-toc="true"
  >
    <div class="pb-3">
      <el-card shadow="never">
        <template #header>
          <h3 class="font-bold">LsyMutilLineTextToggle示例</h3>
          <small>LsyMutilLineTextToggleDemo01</small>
        </template>
        <LsyMutilLineTextToggleDemo01></LsyMutilLineTextToggleDemo01>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card shadow="never">
        <template #header>
          <h3 class="font-bold">LsyMutilLineTextToggle示例</h3>
          <small>LsyMutilLineTextToggleDemo02</small>
        </template>
        <LsyMutilLineTextToggleDemo02></LsyMutilLineTextToggleDemo02>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card shadow="never">
        <template #header>
          <h3 class="font-bold">LsyMutilLineToggle示例</h3>
          <small>LsyMutilLineToggleDemo01</small>
        </template>
        <LsyMutilLineToggleDemo01></LsyMutilLineToggleDemo01>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card shadow="never">
        <template #header>
          <h3 class="font-bold">LsyMutilLineToggle示例</h3>
          <small>LsyMutilLineToggleDemo02</small>
        </template>
        <LsyMutilLineToggleDemo02></LsyMutilLineToggleDemo02>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card shadow="never">
        <template #header>
          <h3 class="font-bold">LsyMutilLineToggle示例</h3>
          <small>LsyMutilLineToggleDemo03</small>
        </template>
        <LsyMutilLineToggleDemo03></LsyMutilLineToggleDemo03>
      </el-card>
    </div>
  </LsyContentContainer>
</template>

<script setup lang="ts">
import LsyMutilLineTextToggleDemo01 from './example/LsyMutilLineTextToggleDemo01.vue'
import LsyMutilLineTextToggleDemo02 from './example/LsyMutilLineTextToggleDemo02.vue'
import LsyMutilLineToggleDemo01 from './example/LsyMutilLineToggleDemo01.vue'
import LsyMutilLineToggleDemo02 from './example/LsyMutilLineToggleDemo02.vue'
import LsyMutilLineToggleDemo03 from './example/LsyMutilLineToggleDemo03.vue'
</script>

<style scoped></style>
