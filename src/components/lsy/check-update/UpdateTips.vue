<template>
  <div class="flex flex-col">
    <el-text type="warning">系统已更新,点击确认按钮将自动刷新.</el-text>
    <div class="flex flex-row mt-3">
      <el-button class="ml-auto" type="primary" @click="onUpdate">
        确认
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
function onUpdate() {
  location.reload()
}
</script>

<style scoped></style>
