<template>
  <div class="flex flex-col h-150">
    <div class="flex-shrink-0">
      <el-button type="primary" @click="() => (count = 5)">类型A</el-button>
      <el-button @click="() => (count = 29)">类型B</el-button>
    </div>
    <div class="flex-1 h-0 pt-4">
      <LsyMutilLineToggle :child-count="count" :line-height="44">
        <a
          v-for="idx in count"
          :key="idx"
          class="cursor-pointer h-9 inline-block pl-3 pr-3 leading-9 border border-solid border-red-200 mr-3 mb-2"
        >
          第{{ idx }}个选项
        </a>
      </LsyMutilLineToggle>
      <div class="text-lg text-orange-600 bg-pink-200">我用于对比</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref<number>(29)
</script>

<style scoped></style>
