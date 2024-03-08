<!--

@author: pan
@createDate: 2023-09-14 09:56
-->
<script setup lang="ts">
import {
  LsyDynFormData,
  LsyFormItemConfig,
} from '@/components/lsy/dyn-form/typing'

import { computed, ref, toRefs } from 'vue'

const props = defineProps<{
  modelValue?: string
  disabled?: boolean
  placeholder?: string
  formData: LsyDynFormData
  itemConfig: LsyFormItemConfig
}>()

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

function buildEvt() {
  return itemConfig.value.customCompEvents ?? {}
}
</script>

<template>
  <el-select
    v-model="valComputed"
    :disabled="disabled"
    :placeholder="placeholder"
    clearable
    :loading="loading"
    style="width: 100%"
    v-bind="itemConfig.customCompProps"
    v-on="buildEvt()"
  >
    <el-option
      v-for="optionItem in options"
      :key="`${optionItem.value}`"
      :label="optionItem.label"
      :value="optionItem.value"
    />
  </el-select>
</template>

<style lang="scss" scoped></style>
