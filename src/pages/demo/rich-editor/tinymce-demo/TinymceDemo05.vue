<template>
  <div class="flex flex-col" :class="hClass">
    <div class="flex-shrink-0">
      <el-button type="primary" @click="() => onWrapperHeightChange(1)">
        外部容器高度增加
      </el-button>
      <el-button @click="() => onWrapperHeightChange(-1)">
        外部容器高度减小
      </el-button>
    </div>
    <LsyTinymce
      v-model="content"
      class="flex-1 h-0"
      height="100%"
      :language="language"
    ></LsyTinymce>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const content = ref<string>(
  '<p><span style="background-color: rgb(241, 196, 15);"><strong>发射点发生</strong></span>了解</p>'
)
const language = ref<string>('zh-Hans')
const hClass = ref<string>('h-[19rem]')
function onWrapperHeightChange(flag: number) {
  if (flag > 0) {
    hClass.value = 'h-[50rem]'
  } else {
    hClass.value = 'h-[19rem]'
  }
}
</script>

<style scoped></style>
