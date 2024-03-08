<!--

@author: pan
@createDate: 2023-09-15 12:21
-->
<script setup lang="ts">
import { computed, toRefs } from 'vue'
import {
  LsyDynFormData,
  LsyFormItemConfig,
} from '@/components/lsy/dyn-form/typing'

export interface CustomScope {
  /**
   * 主送
   */
  main?: string
  /**
   * 抄送
   */
  copy?: string
}
const props = withDefaults(
  defineProps<{
    modelValue?: CustomScope
    disabled?: boolean
    placeholder?: string
    formData: LsyDynFormData
    itemConfig: LsyFormItemConfig
  }>(),
  {
    modelValue: () => ({ main: '', copy: '' }),
    placeholder: '',
  }
)

const { modelValue } = toRefs(props)
/* eslint-disable */
const $emits = defineEmits({
  'update:modelValue': (val?: CustomScope) => true,
})
/* eslint-disable */

const valComp = computed<CustomScope>({
  get() {
    return modelValue?.value
  },
  set(val?: CustomScope) {
    $emits('update:modelValue', val)
  },
})
</script>

<template>
  <div class="flex flex-col w-full">
    <div class="flex flex-row">
      <div
        class="w-32 border-r-green-600 border-r-[1px] border-solid flex justify-center flex-shrink-0"
      >
        主送
      </div>
      <div class="flex-1 w-0"><el-input v-model="valComp.main"></el-input></div>
    </div>
    <div class="flex flex-row">
      <div
        class="w-32 border-r-green-600 border-t-green-600 border-r-[1px] border-t-[1px] border-solid flex justify-center flex-shrink-0"
      >
        抄送
      </div>
      <div class="border-t-green-600 border-t-[1px] border-solid flex-1 w-0">
        <el-input v-model="valComp.copy"></el-input>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
