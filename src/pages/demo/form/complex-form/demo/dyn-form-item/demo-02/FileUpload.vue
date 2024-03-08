<!--

@author: pan
@createDate: 2023-09-15 12:02
-->
<script setup lang="ts">
import { computed, toRefs } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  LsyDynFormData,
  LsyFormItemConfig,
} from '@/components/lsy/dyn-form/typing'
import type { UploadProps, UploadUserFile } from 'element-plus'

const props = defineProps<{
  modelValue?: UploadUserFile[]
  disabled?: boolean
  placeholder?: string
  formData: LsyDynFormData
  itemConfig: LsyFormItemConfig
}>()

const { modelValue } = toRefs(props)

/* eslint-disable */
const $emits = defineEmits({
  'update:modelValue': (val?: UploadUserFile[]) => true,
})
/* eslint-disable */

const fileList = computed<UploadUserFile[]>({
  get() {
    return modelValue?.value as UploadUserFile[]
  },
  set(val?: UploadUserFile[]) {
    $emits('update:modelValue', val)
  },
})

// const fileList = ref<UploadUserFile[]>([
// {
//   name: 'element-plus-logo.svg',
//   url: 'https://element-plus.org/images/element-plus-logo.svg',
// },
// {
//   name: 'element-plus-logo2.svg',
//   url: 'https://element-plus.org/images/element-plus-logo.svg',
// },
// ])

const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
  console.log(file, uploadFiles)
}

const handlePreview: UploadProps['onPreview'] = uploadFile => {
  console.log(uploadFile)
}

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(
    `The limit is 3, you selected ${files.length} files this time, add up to ${
      files.length + uploadFiles.length
    } totally`
  )
}

const beforeRemove: UploadProps['beforeRemove'] = uploadFile => {
  return ElMessageBox.confirm(
    `Cancel the transfer of ${uploadFile.name} ?`
  ).then(
    () => true,
    () => false
  )
}
</script>

<template>
  <el-upload
    v-model:file-list="fileList"
    class="upload-demo"
    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
    multiple
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    :limit="3"
    :on-exceed="handleExceed"
  >
    <el-button type="primary">上传</el-button>
    <!-- <template #tip>
      <div class="el-upload__tip">
        jpg/png files with a size less than 500KB.
      </div>
    </template> -->
  </el-upload>
</template>

<style lang="scss" scoped></style>
