<template>
  <el-link @click="onClick">
    <slot>查看/上传</slot>
  </el-link>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import { EditMode } from '../typing'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /**
     * v-model
     */
    modelValue?: string

    editMode: EditMode
    rowIndex: number
  }>(),
  { modelValue: undefined }
)
const $emits = defineEmits<{
  'update:modelValue': [val?: string]
  click: [rowIndex: number, val?: string]
}>()

const { modelValue, rowIndex } = toRefs(props)
const valComputed = computed({
  get() {
    return modelValue.value
  },
  set(val?: string) {
    $emits('update:modelValue', val)
  },
})
function onClick() {
  $emits('click', rowIndex.value, modelValue.value)
}
</script>

<style scoped></style>
