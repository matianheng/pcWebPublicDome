<template>
  <el-form-item
    :prop="`tableArr.${rowIndex}.${field}`"
    :rules="buildRules(rowIndex, field)"
  >
    <!-- 
      // -important- 这里必须用v-show，让slot组件必渲染，使slot组件能用updateShowText方法，更新当前显示的文本
      (如：下拉选项组件实际值可能是数字，但实际需要显示数字代表的文本) 
      // -important- 为了能让slot组件能进行最大的性能优化，因此传递了renderDom，用于告知slot组件，实际是否需要渲染具体的dom节点
      (如: select组件，如果选项较多，那会创建大量dom节点，但v-show为false时，这些dom节点虽然看不到，但还是被渲染出来了，因此slot组件应该仅在renderDom为true时，才渲染实际dom节点)
      // -important- 为什么v-show写在了div标签之上，因为slot标签不允许使用v-show, 因为v-show需要动态更新css的display属性
    -->
    <div v-show="editable">
      <slot
        ref="itemRef"
        :update-show-text="updateShowText"
        :render-dom="editable"
      ></slot>
    </div>
    <MarkErrorPopover
      v-if="!editable"
      :val="showText"
      :mark-error="getRowFieldErrorMsg(rowIndex, field)"
      :disabled="true"
      @on-clear-mark-error="onClearMarkError"
      @on-save-mark-error="onSaveMarkError"
    ></MarkErrorPopover>
  </el-form-item>
</template>

<script setup lang="ts">
import MarkErrorPopover from '../MarkErrorPopover.vue'
import { SaveMarkErrorCallback } from '../typing'
import { toRefs } from 'vue'
import { FormItemRule } from 'element-plus'
import { computed } from 'vue'
import { watch } from 'vue'
import { ref } from 'vue'

const props = defineProps<{
  field: string
  value: string | number
  rowIndex: number
  editRowIndex: number
  buildRules: (rowIndex: number, field: string) => FormItemRule[] | undefined
  getRowFieldErrorMsg: (rowIndex: number, field: string) => string | undefined
}>()

const $emits = defineEmits<{
  onClearMarkError: [rowIndex: number, field: string]
  onSaveMarkError: [
    rowIndex: number,
    errorMsg: string,
    field: string,
    callback: SaveMarkErrorCallback
  ]
}>()
const itemRef = ref()
const showText = ref<string>('')
const { value, rowIndex, field, editRowIndex } = toRefs(props)
const editable = computed(() => rowIndex.value === editRowIndex.value)

watch(
  value,
  newValue => {
    showText.value = `${newValue ? newValue : ''}`
  },
  { immediate: true }
)
function updateShowText(content: string) {
  showText.value = content
}
function onClearMarkError() {
  $emits('onClearMarkError', rowIndex.value, field.value)
}
function onSaveMarkError(errorMsg: string, callback: SaveMarkErrorCallback) {
  $emits('onSaveMarkError', rowIndex.value, errorMsg, field.value, callback)
}
</script>

<style scoped></style>
