<template>
  <LsyContentContainer
    title="富文本编辑器"
    :enable-back-top-comp="true"
    :enable-toc="true"
  >
    <div class="pb-3">
      <el-card shadow="never">
        tinymce6.8.x 需要高版本浏览器(chrome 89)才可完全正确运行
      </el-card>
    </div>
    <div class="pb-3">
      <el-card shadow="never">
        <template #header>
          <h3 class="font-bold">简单示例</h3>
        </template>
        <TinymceDemo01></TinymceDemo01>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card shadow="never">
        <template #header>
          <h3 class="font-bold">设置初始内容</h3>
        </template>
        <TinymceDemo02></TinymceDemo02>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card shadow="never">
        <template #header>
          <h3 class="font-bold">禁用</h3>
        </template>
        <TinymceDemo03></TinymceDemo03>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card shadow="never">
        <template #header>
          <h3 class="font-bold">多语言切换</h3>
        </template>
        <TinymceDemo04></TinymceDemo04>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card shadow="never">
        <template #header>
          <h3 class="font-bold">高度自适应</h3>
        </template>
        <TinymceDemo05></TinymceDemo05>
      </el-card>
    </div>
  </LsyContentContainer>
</template>

<script setup lang="ts">
import TinymceDemo01 from './tinymce-demo/TinymceDemo01.vue'
import TinymceDemo02 from './tinymce-demo/TinymceDemo02.vue'
import TinymceDemo03 from './tinymce-demo/TinymceDemo03.vue'
import TinymceDemo04 from './tinymce-demo/TinymceDemo04.vue'
import TinymceDemo05 from './tinymce-demo/TinymceDemo05.vue'
</script>

<style scoped></style>
