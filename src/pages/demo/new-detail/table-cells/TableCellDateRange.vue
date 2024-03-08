<template>
  <el-date-picker
    v-if="editMode === 'writable'"
    v-model="valComputed"
    type="daterange"
    unlink-panels
    style="width: 100%"
    format="YYYY-MM-DD"
    value-format="YYYY-MM-DD"
    @change="onChange"
  />
</template>

<script setup lang="ts">
import { toRefs, watch } from 'vue'
import { EditMode } from '../typing'
import { computed } from 'vue'
import { isNotNullAndNotUndefined } from '@/utils/TypeUtils'

const props = withDefaults(
  defineProps<{
    /**
     * v-model
     */
    modelValue?: [string, string]

    updateContent: (content: string) => void
    editMode: EditMode
    rowIndex: number
  }>(),
  { modelValue: undefined }
)

const $emits = defineEmits<{
  'update:modelValue': [val?: [string, string]]
  change: [rowIndex: number, val: [string, string]]
}>()

const { modelValue, rowIndex } = toRefs(props)
const valComputed = computed({
  get() {
    return modelValue.value
  },
  set(val?: [string, string]) {
    $emits('update:modelValue', val)
  },
})
watch(
  modelValue,
  newVal => {
    if (isNotNullAndNotUndefined(newVal) && newVal?.length === 2) {
      props.updateContent(`${newVal[0]} 至 ${newVal[1]}`)
    } else {
      props.updateContent('')
    }
  },
  { immediate: true }
)
function onChange(val: [string, string]) {
  $emits('change', rowIndex.value, val)
}
</script>

<style scoped></style>
