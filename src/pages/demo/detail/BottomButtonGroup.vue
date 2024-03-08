<template>
  <el-card class="mb-3">
    <div class="flex flex-row justify-center">
      <el-button
        v-if="['wait-fit', 'reject'].indexOf(status) >= 0"
        type="primary"
        size="large"
        @click="onSubmit"
      >
        提交
      </el-button>
      <template v-else-if="status === 'wait-pass'">
        <el-button type="primary" size="large" @click="onPass">
          审核通过
        </el-button>
        <el-button size="large" @click="onReject"> 驳回 </el-button>
      </template>
      <el-button
        v-else-if="['already-pass'].indexOf(status) >= 0"
        type="primary"
        size="large"
        @click="onConfirm"
      >
        确认分配部门
      </el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
defineProps<{
  status: string
}>()
const $emits = defineEmits<{
  /**
   * 审核通过事件
   */
  pass: []
  /**
   * 驳回审核事件
   */
  reject: []
  /**
   * 提交事件
   */
  submit: []
  /**
   * 确认部门分配事件
   */
  confirm: []
}>()
function onPass() {
  console.log('onPass')
  $emits('pass')
}
function onReject() {
  console.log('onReject')
  $emits('reject')
}
function onSubmit() {
  console.log('onReject')
  $emits('submit')
}
function onConfirm() {
  $emits('confirm')
}
</script>

<style scoped></style>
