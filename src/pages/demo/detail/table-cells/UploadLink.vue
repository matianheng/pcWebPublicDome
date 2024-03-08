<template>
  <el-upload
    class="avatar-uploader"
    :show-file-list="false"
    :disabled="disabled"
    :on-success="onSuccess"
    :on-error="onError"
    :before-upload="beforeUpload"
    :http-request="httpRequest"
  >
    <el-link v-if="needShowUploadBtn">待上传</el-link>
    <el-link v-if="needShowPreviewBtn" class="mr-2" @click="onPreview">
      查看
    </el-link>
    <el-link v-if="needShowDelBtn" @click="onDel">删除</el-link>
  </el-upload>
</template>

<script setup lang="ts">
import {
  ElMessage,
  UploadFile,
  UploadFiles,
  UploadProps,
  UploadRequestOptions,
} from 'element-plus'
import { uploadFile } from '../../mock-api/ListApi'
import { useFormItem } from 'element-plus'
import { toRefs } from 'vue'
import { computed } from 'vue'

/**
 * 单文件上传
 */
defineOptions({ name: 'UploadLink' })

const props = withDefaults(
  defineProps<{ imageUrl?: string; disabled?: boolean }>(),
  {
    imageUrl: undefined,
  }
)
const $emits = defineEmits<{
  'update:imageUrl': [val?: string]
  del: []
  preview: [string]
}>()

const { imageUrl, disabled } = toRefs(props)

const needShowUploadBtn = computed(() => !imageUrl.value && !disabled.value)
const needShowPreviewBtn = computed(() => imageUrl.value)
const needShowDelBtn = computed(() => imageUrl.value && !disabled.value)

const { formItem } = useFormItem()

const beforeUpload: UploadProps['beforeUpload'] = rawFile => {
  if (['image/png', 'image/jpeg'].indexOf(rawFile.type) < 0) {
    ElMessage.error('必须是jpg或png格式!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('不能超过 2MB!')
    return false
  }
  return true
}
const onSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  console.log('上传 onSuccess', response, uploadFile)
  ElMessage({
    message: '上传成功.',
    type: 'success',
  })
  // 上传成功后端返回的是图片地址
  $emits('update:imageUrl', response)
  formItem?.validate('blur')
}

function onError(
  error: Error,
  uploadFile: UploadFile,
  uploadFiles: UploadFiles
) {
  console.log('上传 onError', error, uploadFile, uploadFiles)
  formItem?.validate('blur')
}

let x = 1
function httpRequest(options: UploadRequestOptions) {
  console.log('options', options)
  const param = x
  if (x === 1) {
    x = 2
  } else {
    x = 1
  }
  return uploadFile(options.file, `${param}`)
}

function onPreview(evt: MouseEvent) {
  console.log(imageUrl)
  if (imageUrl.value) {
    $emits('preview', imageUrl.value)
  }
  evt.stopPropagation()
  return false
}
function onDel(evt: MouseEvent) {
  $emits('del')
  $emits('update:imageUrl')
  formItem?.validate('blur')
  evt.stopPropagation()
  return false
}
</script>

<style scoped></style>
