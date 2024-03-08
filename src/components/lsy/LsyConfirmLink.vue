<template>
  <el-popconfirm :title="title" @confirm="onConfirm" @cancel="onCancel">
    <template #reference>
      <el-link :type="type" class="ml-2"> <slot>删除</slot> </el-link>
    </template>
  </el-popconfirm>
</template>

<script setup lang="ts">
type BtnType = 'primary' | 'success' | 'warning' | 'danger' | 'info'
withDefaults(
  defineProps<{
    title?: string
    type?: BtnType
  }>(),
  { title: '确认执行该操作?', type: 'danger' }
)

const $emits = defineEmits<{
  /**
   * 点击确认时的回调
   */
  confirm: []
  /**
   * 点击取消时的回调
   */
  cancel: []
}>()

function onConfirm() {
  $emits('confirm')
}
function onCancel() {
  $emits('cancel')
}
</script>

<style scoped></style>
