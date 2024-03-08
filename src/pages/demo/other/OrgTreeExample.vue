<template>
  <LsyContentContainer
    title="组织机构树"
    :enable-back-top-comp="true"
    :enable-toc="true"
    :features="['布局通过flex实现', '支持节点自定义', '线条自定义']"
  >
    <div class="pb-3">
      <el-card shadow="never">
        <template #header>
          <h3 class="font-bold">完整数据/完整展示</h3>
          <small>src\pages\demo\other\example\OrgTreeDemo01.vue</small>
        </template>
        <OrgTreeDemo01></OrgTreeDemo01>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card shadow="never">
        <template #header>
          <h3 class="font-bold">完整数据/限制初始展示层级</h3>
          <small>src\pages\demo\other\example\OrgTreeDemo02.vue</small>
        </template>
        <OrgTreeDemo02></OrgTreeDemo02>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card shadow="never">
        <template #header>
          <h3 class="font-bold">数据懒加载</h3>
          <small>src\pages\demo\other\example\OrgTreeDemo03.vue</small>
        </template>
        <OrgTreeDemo03></OrgTreeDemo03>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card shadow="never">
        <template #header>
          <h3 class="font-bold">自定义节点与懒加载</h3>
          <small>src\pages\demo\other\example\OrgTreeDemo04.vue</small>
        </template>
        <OrgTreeDemo04></OrgTreeDemo04>
      </el-card>
    </div>
  </LsyContentContainer>
</template>

<script setup lang="ts">
import OrgTreeDemo01 from './example/OrgTreeDemo01.vue'
import OrgTreeDemo02 from './example/OrgTreeDemo02.vue'
import OrgTreeDemo03 from './example/OrgTreeDemo03.vue'
import OrgTreeDemo04 from './example/OrgTreeDemo04.vue'
</script>

<style scoped></style>
