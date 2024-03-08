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

defineOptions({ name: 'EditableInput' })

const props = defineProps<{
  modelValue?: string
  disabled?: boolean
  placeholder?: string
  formData: LsyDynFormData
  itemConfig: LsyFormItemConfig
}>()
interface CustomProps extends Record<string, unknown> {
  readonly: boolean
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
function buildEvt() {
  return itemConfig.value.customCompEvents ?? {}
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
    v-on="buildEvt()"
  >
  </el-input>
  <LsyDynSingleRowEllipsis
    v-else
    :content="valComputed"
    :useTooltips="true"
  ></LsyDynSingleRowEllipsis>
</template>

<style lang="scss" scoped></style>
