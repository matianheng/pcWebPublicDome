<template>
  <div class="fixed top-0 left-0 right-0 z-20">
    <el-progress
      type="line"
      :percentage="percentage"
      :stroke-width="4"
      striped
      :show-text="false"
      :duration="30"
      striped-flow
    />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import { ref } from 'vue'
import { onMounted } from 'vue'

const percentage = ref<number>(0)
let timeoutFlag: number | undefined
onMounted(() => {
  console.log('loading组件，onMounted')
  timeoutFlag = window.setTimeout(() => {
    percentage.value = 75
  }, 20)
})
onBeforeUnmount(() => {
  if (timeoutFlag) {
    window.clearTimeout(timeoutFlag)
  }
})
function over() {
  percentage.value = 100
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve()
    }, 500)
  })
}
defineExpose({
  over,
})
</script>

<style scoped></style>
