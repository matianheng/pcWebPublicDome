<!--

@author: pan
@createDate: 2023-09-14 09:56
-->
<script setup lang="ts">
import {
  LsyDynFormData,
  LsyFormItemConfig,
} from '@/components/lsy/dyn-form/typing'
import { computed, toRefs } from 'vue'
import MarkErrorPopover from '../MarkErrorPopover.vue'
import { useMarkErrorHook } from './MarkErrorHooks'

defineOptions({ name: 'EditableInputMarkError' })

const props = defineProps<{
  modelValue?: string
  disabled?: boolean
  placeholder?: string
  formData: LsyDynFormData
  itemConfig: LsyFormItemConfig

  readonly?: boolean
  markError?: string
  enableMarkError?: boolean
  type?: string
  rows?: number
  resize?: 'none' | 'both' | 'horizontal' | 'vertical'
}>()
const { modelValue, itemConfig, readonly, enableMarkError, markError } =
  toRefs(props)

/* eslint-disable */
const $emits = defineEmits({
  'update:modelValue': (val?: string) => true,
})
/* eslint-disable */

const valComputed = computed({
  get() {
    return modelValue?.value
  },
  set(val?: string) {
    $emits('update:modelValue', val)
  },
})

const { onSaveMarkError, onClearMarkError } = useMarkErrorHook(itemConfig)
</script>

<template>
  <el-input
    v-if="!readonly"
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
  <MarkErrorPopover
    v-else
    :val="valComputed"
    :markError="markError"
    @onClearMarkError="onClearMarkError"
    @onSaveMarkError="onSaveMarkError"
    :disabled="!enableMarkError"
  ></MarkErrorPopover>
</template>

<style lang="scss" scoped></style>
