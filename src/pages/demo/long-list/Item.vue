<template>
  <div class="border-b-2 border-red-500">
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
