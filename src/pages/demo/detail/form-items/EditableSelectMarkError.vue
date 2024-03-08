<!--

@author: pan
@createDate: 2023-09-14 09:56
-->
<script setup lang="ts">
import {
  LsyDynFormData,
  LsyFormItemConfig,
  OptionItem,
} from '@/components/lsy/dyn-form/typing'
import { computed, toRefs } from 'vue'
import MarkErrorPopover from '../MarkErrorPopover.vue'
import { ref } from 'vue'
import { watch } from 'vue'
import { dicMockAPI } from '../../mock-api/ListApi'
import { useMarkErrorHook } from './MarkErrorHooks'

defineOptions({ name: 'EditableSelectMarkError' })

const props = defineProps<{
  modelValue?: number
  disabled?: boolean
  placeholder?: string
  formData: LsyDynFormData
  itemConfig: LsyFormItemConfig

  readonly?: boolean
  markError?: string
  enableMarkError?: boolean
  dictType: string
}>()
const {
  modelValue,
  itemConfig,
  readonly,
  enableMarkError,
  markError,
  dictType,
} = toRefs(props)

/* eslint-disable */
const $emits = defineEmits({
  'update:modelValue': (val?: number) => true,
})
/* eslint-disable */

const valComputed = computed({
  get() {
    return modelValue?.value
  },
  set(val?: number) {
    $emits('update:modelValue', val)
  },
})

const { onSaveMarkError, onClearMarkError } = useMarkErrorHook(itemConfig)

const optionItemArr = ref<OptionItem[]>([])
const modelValueText = computed(() => {
  const item = optionItemArr.value.find(
    item => item.value === modelValue?.value
  )
  if (item) {
    return item.label
  } else if (modelValue?.value) {
    return `${modelValue.value}`
  } else {
    return ''
  }
})

const loading = ref(true)
watch(
  dictType,
  newDictType => {
    dicMockAPI(newDictType)
      .then(arr => {
        if (arr && arr.length > 0) {
          optionItemArr.value = arr.map(item => ({
            label: item.text,
            value: item.value,
          }))
        }
      })
      .finally(() => {
        loading.value = false
      })
  },
  { immediate: true }
)
</script>

<template>
  <el-select
    v-if="!readonly"
    :loading="loading"
    v-model="valComputed"
    :disabled="disabled"
    :placeholder="placeholder"
    clearable
    style="width: 100%"
  >
    <el-option
      v-for="optionItem in optionItemArr"
      :key="`${optionItem.value}`"
      :label="optionItem.label"
      :value="optionItem.value"
    />
  </el-select>
  <MarkErrorPopover
    v-else
    :val="modelValueText"
    :markError="markError"
    @onClearMarkError="onClearMarkError"
    @onSaveMarkError="onSaveMarkError"
    :disabled="!enableMarkError"
  ></MarkErrorPopover>
</template>

<style lang="scss" scoped></style>
