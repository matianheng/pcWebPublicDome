<template>
  <LsyContentContainer
    title="数据导出异常处理示例"
    :enable-back-top-comp="true"
    :enable-toc="true"
  >
    <el-card shadow="never">
      <div>当前示例只能使用 vite dev 方式运行</div>
      <el-button type="primary" @click="() => onExport(false)">
        数据导出(正常)
      </el-button>
      <el-button @click="() => onExport(true)">数据导出(异常)</el-button>
    </el-card>
  </LsyContentContainer>
</template>

<script setup lang="ts">
import { exportData } from '@/pages/demo/mock-api/ListApi'
async function onExport(exp: boolean) {
  const resp = await exportData(exp)
  if ('download' in document.createElement('a')) {
    // 非IE下载
    let link = document.createElement('a')
    link.download = `${resp.fileName}`
    link.style.display = 'none'
    link.href = URL.createObjectURL(resp.blob)
    document.body.appendChild(link)
    link.click()
    URL.revokeObjectURL(link.href) // 释放URL 对象
    document.body.removeChild(link)
  } else {
    // IE10+下载
    // @ts-ignore
    navigator.msSaveBlob(resp.blob)
  }
}
</script>

<style scoped></style>
