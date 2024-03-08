<template>
  <el-upload
    v-if="editMode === 'writable'"
    class="avatar-uploader"
    :show-file-list="false"
    :disabled="disabled"
    :on-success="onSuccess"
    :on-error="onError"
    :before-upload="beforeUpload"
    :http-request="httpRequest"
  >
    <el-avatar :size="180" :src="imageUrlComputed" class="avatar" />
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
import { uploadFile } from '../../mock-api/ListApi'
import { EditMode, LsyDynFormData, LsyFormItemConfig } from '../typing'
import { useFormItem } from 'element-plus'
import { isEmpty } from 'lodash-unified'

/**
 * 头像上传组件
 */
defineOptions({ name: 'AvatarUpload' })

const props = withDefaults(
  defineProps<{
    modelValue?: string
    disabled?: boolean
    placeholder?: string
    formData: LsyDynFormData
    itemConfig: LsyFormItemConfig

    /**
     * 该属性可用于在只读和标记有误模式下,更新 NewMarkErrorPopover 中的显示值
     */
    updateContent: (val: string) => void
    editMode: EditMode
  }>(),
  {
    modelValue: undefined,
    placeholder: undefined,
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
      ? 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
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

<style scoped></style>
