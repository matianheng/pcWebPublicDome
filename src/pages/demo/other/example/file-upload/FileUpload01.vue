<template>
  <!-- limit限制的是fileList的总数量 -->
  <el-upload
    v-model:file-list="fileList"
    :http-request="httpRequest"
    multiple
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    :limit="3"
    :on-exceed="handleExceed"
  >
    <el-button type="primary" data-test="upload-btn">点击上传</el-button>
    <template #tip>
      <div class="el-upload__tip">每个 jpg/png 文件不能超过500KB.</div>
    </template>
  </el-upload>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import type {
  UploadProps,
  UploadUserFile,
  UploadRequestOptions,
} from 'element-plus'

import { uploadFile } from '@/pages/demo/mock-api/ListApi'

const fileList = ref<UploadUserFile[]>([
  {
    name: 'element-plus-logo.svg',
    url: 'https://element-plus.org/images/element-plus-logo.svg',
  },
  {
    name: 'element-plus-logo2.svg',
    url: 'https://element-plus.org/images/element-plus-logo.svg',
  },
])

const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
  ElMessage.info(
    `文件 ${file.name} 被删除, 剩余文件数量: ${uploadFiles.length}`
  )
  console.log(file, uploadFiles)
}

const handlePreview: UploadProps['onPreview'] = uploadFile => {
  ElMessage.info(`文件 ${uploadFile.name} 将被预览`)
  console.log(uploadFile)
}
// 当fileList.length超过limit时, 给出异常提示
const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(
    `总文件数不能超过 3 个. 您此次选择了 ${files.length} 个文件, 总文件数为 ${
      files.length + uploadFiles.length
    } 个, 所以上传失败!`
  )
}
// 在文件被删除前，加入确认弹窗
const beforeRemove: UploadProps['beforeRemove'] = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(`取消传输文件: ${uploadFile.name} ?`).then(
    () => true,
    () => false
  )
}
function httpRequest(options: UploadRequestOptions) {
  console.log('options', options)
  const param = 1
  return uploadFile(options.file, `${param}`)
}
</script>

<style scoped></style>
