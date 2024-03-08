<template>
  <div class="text-sm bg-gray-200 p-2">{{ classifyInfo.title }}</div>
</template>

<script setup lang="ts">
import { MenuTabInfo } from './dyn-height/3.typing'

defineProps<{
  classifyInfo: MenuTabInfo
}>()
</script>

<style scoped></style>
