<template>
  <LsyContentContainer
    title="文件上传"
    :enable-back-top-comp="true"
    :enable-toc="true"
  >
    <el-card shadow="never" class="mb-3">
      <template #header>
        <h3 class="font-bold">单文件上传</h3>
        <small>src\pages\demo\other\example\file-upload\FileUpload01.vue</small>
      </template>
      <FileUpload01></FileUpload01>
    </el-card>
    <el-card shadow="never" class="mb-3">
      <template #header>
        <h3 class="font-bold">多文件上传</h3>
        <small>src\pages\demo\other\example\WatermarkDemo04.vue</small>
      </template>
      多文件上传
    </el-card>
    <el-card shadow="never" class="mb-3">
      <template #header>
        <h3 class="font-bold">单文件上传:文件大小/类型验证</h3>
        <small>src\pages\demo\other\example\WatermarkDemo04.vue</small>
      </template>
      单文件上传:文件大小/类型验证
    </el-card>
    <el-card shadow="never" class="mb-3">
      <template #header>
        <h3 class="font-bold">
          多文件上传:单文件大小/类型验证以及多文件总大小验证
        </h3>
        <small>src\pages\demo\other\example\WatermarkDemo04.vue</small>
      </template>
      多文件上传:单文件大小/类型验证以及多文件总大小验证
    </el-card>
  </LsyContentContainer>
</template>

<script setup lang="ts">
import FileUpload01 from './example/file-upload/FileUpload01.vue'
</script>

<style scoped></style>
