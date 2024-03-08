<template>
  <el-dialog
    v-model="centerDialogVisible"
    title="操作确认"
    width="30%"
    destroy-on-close
    :append-to-body="false"
    modal-class="o-lsy-dialog"
  >
    <div>
      {{ message }}
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="onConfirm"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  message: string
  confirm: () => void
  cancel: () => void
}>()
const centerDialogVisible = ref(true)
function onCancel() {
  centerDialogVisible.value = false
  props.cancel()
}
function onConfirm() {
  centerDialogVisible.value = false
  props.confirm()
}
</script>

<style scoped lang="scss"></style>
