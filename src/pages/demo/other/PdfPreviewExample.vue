<template>
  <LsyContentContainer
    title="pdf预览"
    :enable-back-top-comp="true"
    :enable-toc="true"
  >
    <div class="pb-3">
      <el-card shadow="never">
        <template #header>
          <h3 class="font-bold">通过pdf文件地址,分页预览</h3>
          <small>src\pages\demo\other\example\PdfPreviewDemo01.vue</small>
        </template>
        <PdfPreviewDemo01></PdfPreviewDemo01>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card shadow="never">
        <template #header>
          <h3 class="font-bold">通过pdf文件地址,完整预览</h3>
          <small>src\pages\demo\other\example\PdfPreviewDemo02.vue</small>
        </template>
        <PdfPreviewDemo02></PdfPreviewDemo02>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card shadow="never">
        <template #header>
          <h3 class="font-bold">
            预览后端返回的字节流 (该示例仅 vite dev 方式查看)
          </h3>
          <small>src\pages\demo\other\example\PdfPreviewDemo03.vue</small>
        </template>
        <PdfPreviewDemo03></PdfPreviewDemo03>
      </el-card>
    </div>
  </LsyContentContainer>
</template>

<script setup lang="ts">
import PdfPreviewDemo01 from './example/PdfPreviewDemo01.vue'
import PdfPreviewDemo02 from './example/PdfPreviewDemo02.vue'
import PdfPreviewDemo03 from './example/PdfPreviewDemo03.vue'
</script>

<style scoped></style>
