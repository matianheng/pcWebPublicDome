<template>
  <div class="p-3 shadow-sm shadow-blue-200">
    <strong class="text-lg font-normal">
      {{ dataItem.arrPos }} : {{ dataItem.customData.title }}
    </strong>
    <p>{{ dataItem.customData.content }}</p>
  </div>
</template>

<script setup lang="ts">
import type { ItemData } from './dyn-height/typing'
defineProps<{ dataItem: ItemData }>()
</script>

<style scoped></style>
