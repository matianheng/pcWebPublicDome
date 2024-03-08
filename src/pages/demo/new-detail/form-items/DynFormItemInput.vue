<template>
  <el-input
    v-if="editMode === 'writable'"
    v-model="valComputed"
    :disabled="disabled"
    :placeholder="placeholder"
    clearable
    style="width: 100%"
    :type="type"
    :rows="rows"
    :resize="resize"
  >
  </el-input>
</template>

<script setup lang="ts">
import { EditMode, LsyDynFormData, LsyFormItemConfig } from '../typing'
import { toRefs } from 'vue'
import { computed } from 'vue'

const props = defineProps<{
  modelValue?: string
  disabled?: boolean
  placeholder?: string
  formData: LsyDynFormData
  itemConfig: LsyFormItemConfig

  readonly?: boolean
  type?: string
  rows?: number
  resize?: 'none' | 'both' | 'horizontal' | 'vertical'
  /**
   * 该属性可用于在只读和标记有误模式下,更新 NewMarkErrorPopover 中的显示值
   */
  updateContent: (val: string) => void
  editMode: EditMode
}>()
const { modelValue, itemConfig, readonly } = toRefs(props)

const $emits = defineEmits<{
  'update:modelValue': [val?: string]
}>()
const valComputed = computed({
  get() {
    return modelValue?.value
  },
  set(val?: string) {
    $emits('update:modelValue', val)
  },
})
</script>

<style scoped></style>
