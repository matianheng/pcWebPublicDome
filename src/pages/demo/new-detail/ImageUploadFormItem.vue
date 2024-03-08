<template>
  <el-upload
    class="w-full o-upload-content"
    :show-file-list="false"
    :disabled="disabled"
    :on-success="onSuccess"
    :on-error="onError"
    :before-upload="beforeUpload"
    :http-request="httpRequest"
  >
    <img :src="imageUrlComputed" class="w-full" />
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
import { toRefs } from 'vue'
import { computed } from 'vue'
import { uploadFile } from '../mock-api/ListApi'
import { useFormItem } from 'element-plus'
import { isEmpty } from 'lodash-unified'

/**
 * 图片上传组件
 */
defineOptions({ name: 'ImageUploadFormItem' })

const props = withDefaults(
  defineProps<{
    modelValue?: string
    disabled?: boolean
  }>(),
  {
    modelValue: undefined,
  }
)

const { modelValue } = toRefs(props)

const $emits = defineEmits<{
  'update:modelValue': [val?: string]
}>()
const { formItem } = useFormItem()

const imageUrlComputed = computed({
  get() {
    return isEmpty(modelValue.value)
      ? 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
      : modelValue.value
  },
  set(val?: string) {
    $emits('update:modelValue', val)
    formItem?.validate('blur')
  },
})

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
  $emits('update:modelValue', response)
  formItem?.validate('blur')
}

function onError(
  error: Error,
  uploadFile: UploadFile,
  uploadFiles: UploadFiles
) {
  console.log('上传 onError', error, uploadFile, uploadFiles)
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
</script>

<style scoped lang="scss">
.o-upload-content {
  ::v-deep(.el-upload) {
    width: 100%;
  }
}
</style>
