<template>
  <el-dialog
    v-model="visibleComputed"
    :title="title"
    modal-class="o-upload-dialog"
    :append-to-body="true"
  >
    <el-form ref="elFormRef" :model="uploadFormData" class="h-full">
      <el-form-item prop="val" :rules="buildRules(rowIndex, field)">
        <NewMarkErrorPopover
          edit-mode="writable"
          :section="section"
          :mark-error-id="markErrorId"
          :row="rowIndex"
          :mark-error="markError"
          :field="field"
          :disabled="editMode !== 'markError'"
          @save-mark-error="onSaveMarkError"
        >
          <ImageUploadFormItem
            v-model="uploadFormData.val"
            :disabled="editMode !== 'writable'"
          ></ImageUploadFormItem>
        </NewMarkErrorPopover>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="onConfirm"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { toRefs } from 'vue'
import ImageUploadFormItem from './ImageUploadFormItem.vue'
import { ref } from 'vue'
import { computed } from 'vue'
import { FormInstance, FormItemRule } from 'element-plus'
import { isNotNullAndNotUndefined } from '@/utils/TypeUtils'
import NewMarkErrorPopover from './NewMarkErrorPopover.vue'
import { MarkErrorInfoType } from '../mock-api/ApiTyping'
import { EditMode } from './typing'
import { isEmpty } from 'lodash-unified'
import { nextTick } from 'vue'

const props = withDefaults(
  defineProps<{
    visible?: boolean
    rowIndex?: number
    field?: string
    val?: string
    title: string
    section: string
    rowFieldMarkErrorMap?: Map<number, Map<string, MarkErrorInfoType>>
    buildRules: (row: number, filed: string) => FormItemRule[]
    editMode: EditMode
  }>(),
  {
    visible: undefined,
    rowIndex: 0,
    field: '',
    val: undefined,
    markErrorId: undefined,
    markError: undefined,
    rowFieldMarkErrorMap: () => new Map(),
  }
)
const $emits = defineEmits<{
  'update:visible': [visible?: boolean]
  change: [rowIndex: number, field: string, val?: string]
}>()
interface UploadFormData {
  val?: string
}
const uploadFormData = ref<UploadFormData>({ val: undefined })
const elFormRef = ref<FormInstance>()
const { visible, rowIndex, field, val, rowFieldMarkErrorMap } = toRefs(props)
/**
 * 标记有误id
 */
const markErrorId = computed(
  () => rowFieldMarkErrorMap.value.get(rowIndex.value)?.get(field.value)?.id
)
/**
 * 标记有误内容
 */
const markError = computed(
  () => rowFieldMarkErrorMap.value.get(rowIndex.value)?.get(field.value)?.msg
)
function onSaveMarkError(row: number, field: string) {
  elFormRef.value?.validate()
}
const visibleComputed = computed({
  set(val?: boolean) {
    $emits('update:visible', val)
  },
  get() {
    return visible.value
  },
})
watch(
  [visible, rowIndex, field, val],
  ([newVisible, newRowIndex, newField, newVal]) => {
    if (newVisible) {
      uploadFormData.value.val = newVal
    }
  }
)
watch(
  [visible, rowIndex, field, markError],
  ([newVisible, newRowIndex, newField, newMarkError]) => {
    if (newVisible && newRowIndex >= 0 && !isEmpty(newField) && newMarkError) {
      nextTick(() => {
        console.log(elFormRef.value)
        elFormRef.value?.validate()
      })
    }
  }
)
function onCancel() {
  visibleComputed.value = false
  // 将表单数据恢复成原始数据
  uploadFormData.value.val = val.value
}
function onConfirm() {
  elFormRef.value?.validate(valid => {
    if (valid && isNotNullAndNotUndefined(rowIndex.value)) {
      visibleComputed.value = false
      //@ts-ignore
      $emits('change', rowIndex.value, field.value, uploadFormData.value.val)
    }
  })
}
</script>

<style lang="scss">
.o-upload-dialog {
  .el-dialog {
    display: flex;
    width: 340px; /* px-to-viewport-ignore */
    height: 460px; /* px-to-viewport-ignore */
    flex-direction: column;
  }

  .el-dialog__header {
    flex-shrink: 0;
  }

  .el-dialog__body {
    overflow: auto;
    padding-top: 0.4rem;
    height: 0;
    flex: 1;
  }

  .el-dialog__footer {
    flex-shrink: 0;
  }
}

@media (width >= 640px) {
  .o-upload-dialog {
    .el-dialog {
      width: 460px; /* px-to-viewport-ignore */
      height: 560px; /* px-to-viewport-ignore */
    }
  }
}

@media (width >= 1024px) {
  .o-upload-dialog {
    .el-dialog {
      width: 960px; /* px-to-viewport-ignore */
      height: 500px; /* px-to-viewport-ignore */
    }
  }
}
</style>
