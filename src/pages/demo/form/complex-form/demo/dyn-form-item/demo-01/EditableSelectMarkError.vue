<!--

@author: pan
@createDate: 2023-09-14 09:56
-->
<script setup lang="ts">
import {
  LsyDynFormData,
  LsyFormItemConfig,
} from '@/components/lsy/dyn-form/typing'
import MarkErrorPopover from './MarkErrorPopover.vue'
import { computed, ref, toRefs } from 'vue'
defineOptions({ name: 'EditableSelectMarkError' })
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
function buildEvt() {
  return itemConfig.value.customCompEvents ?? {}
}
const readonlyMarkError = computed(() => {
  return customProps.value.markError
})
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
const labelComputed = computed(() => {
  const item = options.value.find(item => item.value === modelValue?.value)
  console.log(options.value, modelValue?.value, item)
  return item?.label ?? modelValue?.value
})

interface Option {
  value: string
  label: string
}
const options = ref<Option[]>([])
const loading = ref<boolean>(true)
setTimeout(() => {
  options.value = [
    { label: '普通用户', value: 'normal' },
    { label: '超管', value: 'superAdmin' },
  ]
  loading.value = false
}, 3000)

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
  <el-select
    v-if="editable"
    v-model="valComputed"
    :disabled="disabled"
    :placeholder="placeholder"
    clearable
    :loading="loading"
    style="width: 100%"
    v-bind="itemConfig.customCompProps"
  >
    <el-option
      v-for="optionItem in options"
      :key="`${optionItem.value}`"
      :label="optionItem.label"
      :value="optionItem.value"
    />
  </el-select>
  <MarkErrorPopover
    v-else
    :val="labelComputed"
    :markError="readonlyMarkError"
    @onClearMarkError="onClearMarkError"
    @onSaveMarkError="onSaveMarkError"
  ></MarkErrorPopover>
</template>

<style lang="scss" scoped></style>
