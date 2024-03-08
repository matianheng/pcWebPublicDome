<template>
  <LsyContentContainer
    title="类美团外卖菜单列表"
    :features="[
      '本地开发时,vite-plugin-vue-devtools工具,会造成该界面示例滚动卡顿,关闭vite-plugin-vue-devtools插件,即可恢复正常',
    ]"
    :enable-back-top-comp="true"
    :enable-toc="true"
  >
    <el-card class="mb-2">
      <template #header>
        <h3 class="font-bold">顶部有sticky元素</h3>
        <small>WaiMaiDemo01</small>
      </template>
      <WaiMaiDemo01></WaiMaiDemo01>
    </el-card>
    <el-card class="mb-2">
      <template #header>
        <h3 class="font-bold">顶部无sticky元素</h3>
        <small>WaiMaiDemo02</small>
      </template>
      <WaiMaiDemo02></WaiMaiDemo02>
    </el-card>
  </LsyContentContainer>
</template>

<script setup lang="ts">
import WaiMaiDemo01 from './demo/WaiMaiDemo01.vue'
import WaiMaiDemo02 from './demo/WaiMaiDemo02.vue'
</script>

<style scoped lang="scss"></style>
