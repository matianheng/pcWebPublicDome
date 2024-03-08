<template>
  <div class="p-3 shadow-sm shadow-blue-200">
    <strong
      class="text-lg cursor-pointer"
      :class="{
        'font-normal text-red-300': dataItem.customData.read,
      }"
      @click="() => onClick(dataItem.customData.id, $parent as DynHeightLongListExportType)"
    >
      {{ dataItem.customData.id }} :
      {{ dataItem.customData.title }}
    </strong>
    <p>{{ dataItem.customData.content }}</p>
  </div>
</template>

<script setup lang="ts">
import type { ItemData } from './dyn-height/typing'
import DynHeightLongList from './dyn-height/DynHeightLongList.vue'
import { ComponentExposed } from 'vue-component-type-helpers'

type DynHeightLongListExportType = ComponentExposed<typeof DynHeightLongList>

defineProps<{ dataItem: ItemData }>()

function onClick(
  dataId: string | number,
  $parent: DynHeightLongListExportType
) {
  $parent.updateFieldValByDataId(dataId, 'read', true)
}
</script>

<style scoped></style>
