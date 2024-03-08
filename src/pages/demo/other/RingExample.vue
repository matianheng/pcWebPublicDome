<template>
  <LsyContentContainer
    title="3/4环"
    :enable-back-top-comp="true"
    :enable-toc="true"
    :features="['基于svg实现']"
  >
    <div class="pb-3">
      <el-card shadow="never">
        <template #header>
          <h3 class="font-bold">仅一个环</h3>
          <small>src\pages\demo\other\example\RingDemo01Wrapper.vue</small>
        </template>
        <RingDemo01Wrapper></RingDemo01Wrapper>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card shadow="never">
        <template #header>
          <h3 class="font-bold">环+文字</h3>
          <small>src\pages\demo\other\example\RingDemo02Wrapper.vue</small>
        </template>
        <RingDemo02Wrapper></RingDemo02Wrapper>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card shadow="never">
        <template #header>
          <h3 class="font-bold">双层环</h3>
          <small>src\pages\demo\other\example\RingDemo03Wrapper.vue</small>
        </template>
        <RingDemo03Wrapper></RingDemo03Wrapper>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card shadow="never">
        <template #header>
          <h3 class="font-bold">双层环+文字</h3>
          <small>src\pages\demo\other\example\RingDemo04Wrapper.vue</small>
        </template>
        <RingDemo04Wrapper></RingDemo04Wrapper>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card shadow="never">
        <template #header>
          <h3 class="font-bold">加入动效</h3>
          <small>src\pages\demo\other\example\RingDemo05Wrapper.vue</small>
        </template>
        <RingDemo05Wrapper></RingDemo05Wrapper>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card shadow="never">
        <template #header>
          <h3 class="font-bold">其他示例</h3>
          <small>src\pages\demo\other\example\RingDemo06Wrapper.vue</small>
        </template>
        <RingDemo06Wrapper></RingDemo06Wrapper>
      </el-card>
    </div>
  </LsyContentContainer>
</template>

<script setup lang="ts">
import RingDemo01Wrapper from './example/RingDemo01Wrapper.vue'
import RingDemo02Wrapper from './example/RingDemo02Wrapper.vue'
import RingDemo03Wrapper from './example/RingDemo03Wrapper.vue'
import RingDemo04Wrapper from './example/RingDemo04Wrapper.vue'
import RingDemo05Wrapper from './example/RingDemo05Wrapper.vue'
import RingDemo06Wrapper from './example/RingDemo06Wrapper.vue'
</script>

<style scoped></style>
