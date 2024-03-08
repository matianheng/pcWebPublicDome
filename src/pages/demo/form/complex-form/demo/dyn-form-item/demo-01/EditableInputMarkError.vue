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
import MarkErrorPopover from './MarkErrorPopover.vue'

defineOptions({ name: 'EditableInputMarkError' })

const props = defineProps<{
  modelValue?: string
  disabled?: boolean
  placeholder?: string
  formData: LsyDynFormData
  itemConfig: LsyFormItemConfig
}>()
interface CustomProps extends Record<string, unknown> {
  readonly: boolean
  markError?: string
}
const { modelValue, itemConfig } = toRefs(props)

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
function buildProps(): CustomProps {
  if (itemConfig.value.customCompProps instanceof Function) {
    return itemConfig.value.customCompProps() as CustomProps
  }
  return (itemConfig.value.customCompProps ?? {}) as CustomProps
}
const customProps = computed(() => buildProps())
const editable = computed(() => {
  return !customProps.value.readonly
})
const readonlyMarkError = computed(() => {
  return customProps.value.markError
})
function buildEvt() {
  return itemConfig.value.customCompEvents ?? {}
}

async function onSaveMarkError(
  _markError: string,
  callback: (ret: boolean) => void
) {
  const _onSaveMarkError = itemConfig.value.customCompEvents
    ?.onSaveMarkError as Function
  if (_onSaveMarkError) {
    await _onSaveMarkError(itemConfig.value.prop, _markError)
    callback(true)
  }
}
async function onClearMarkError(callback: (ret: boolean) => void) {
  const _onClearMarkError = itemConfig.value.customCompEvents
    ?.onClearMarkError as Function
  if (_onClearMarkError) {
    await _onClearMarkError(itemConfig.value.prop)
    callback(true)
  }
}
</script>

<template>
  <el-input
    v-if="editable"
    v-model="valComputed"
    :disabled="disabled"
    :placeholder="placeholder"
    clearable
    style="width: 100%"
  >
  </el-input>
  <MarkErrorPopover
    v-else
    :val="valComputed"
    :markError="readonlyMarkError"
    @onClearMarkError="onClearMarkError"
    @onSaveMarkError="onSaveMarkError"
  ></MarkErrorPopover>
</template>

<style lang="scss" scoped></style>
