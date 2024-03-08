<template>
  <div>
    <el-button
      v-if="showBtns.showSaveBtn"
      type="primary"
      size="small"
      @click="onSave"
      >保存</el-button
    >
    <el-button v-if="showBtns.showCancelBtn" size="small" @click="onCancel">
      取消
    </el-button>
    <el-button
      v-if="showBtns.showDelBtn"
      type="danger"
      size="small"
      @click="onDel"
    >
      删除
    </el-button>
    <el-button
      v-if="showBtns.showEditBtn"
      type="primary"
      size="small"
      @click="onEdit"
    >
      编辑
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { toRefs } from 'vue'

const props = defineProps<{
  rowIndex: number
  /**
   * 当前编辑的行
   */
  editRow: number
  /**
   * 是否有行处于保存中或删除中的后台API请求状态. 结合rowIndex===editRow可以得出是否是当前行处于这些状态
   */
  operating: boolean
}>()
const $emits = defineEmits<{
  save: [rowIndex: number]
  cancel: [rowIndex: number]
  del: [rowIndex: number]
  edit: [rowIndex: number]
}>()

const { rowIndex, editRow } = toRefs(props)
const showBtns = computed(() => ({
  showSaveBtn: rowIndex.value === editRow.value,
  showCancelBtn: rowIndex.value === editRow.value,
  showDelBtn: rowIndex.value !== editRow.value,
  showEditBtn: rowIndex.value !== editRow.value,
}))
function onSave() {
  $emits('save', rowIndex.value)
}
function onCancel() {
  $emits('cancel', rowIndex.value)
}
function onDel() {
  $emits('del', rowIndex.value)
}
function onEdit() {
  $emits('edit', rowIndex.value)
}
</script>

<style scoped></style>
