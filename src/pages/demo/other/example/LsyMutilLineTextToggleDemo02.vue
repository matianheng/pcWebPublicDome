<template>
  <div>
    <el-input v-model="content" type="textarea"></el-input>

    <div>
      <LsyMutilLineTextToggle :content="content" :line="3">
      </LsyMutilLineTextToggle>
    </div>
    <div class="text-lg text-orange-600 bg-pink-200">我用于对比</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const content = ref<string>('测试发射点发就是两地分居啊垃圾\n新的一行')
</script>

<style scoped></style>
