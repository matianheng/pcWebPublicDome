<template>
  <div class="h-80 flex flex-row">
    <div class="h-full w-20 flex-shrink-0">
      <MenuTab
        :tab-arr="tabArr"
        :sticky-classify="stickyClassify"
        @tab-click="onTabClick"
      ></MenuTab>
    </div>
    <div class="h-full flex-1 w-0">
      <DynHeightLongList4
        ref="dynHeightLongListRef"
        v-model:sticky-classify="stickyClassify"
        :cache-count="20"
        :estimate-height="100"
        :estimate-classify-height="20"
        :load-data="loadData2"
        :item-comp="Item4"
        :classify-comp="ClassifyItem"
        :classify-arr="tabArr"
        @vue:mounted="onVNodeMounted"
      ></DynHeightLongList4>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ComponentExposed } from 'vue-component-type-helpers'
import { searchArticleBaseId2 } from '../../mock-api/ListApi'
import Item4 from './Item4.vue'
import ClassifyItem from './ClassifyItem.vue'
import DynHeightLongList4 from '../dyn-height/DynHeightLongList4.vue'
import { ref } from 'vue'
import MenuTab from './MenuTab.vue'
import { MenuTabInfo } from '../dyn-height/3.typing'
/**
 * 仿美团菜单列表
 */
defineOptions({ name: 'LikeMeiTuanMenuExample' })

type DynHeightLongListExportType = ComponentExposed<typeof DynHeightLongList4>
const tabArr: MenuTabInfo[] = new Array(23)
  .fill(true)
  .map((item, idx) => ({ id: idx, title: `类型${idx}` }))
const dynHeightLongListRef = ref<DynHeightLongListExportType>()
const stickyClassify = ref<string | number | undefined>()
const classify = ref<string | number | undefined>()
async function loadData2(next: boolean, id?: number | string) {
  const ret = await searchArticleBaseId2({
    flag: next ? 'next' : 'prev',
    id: id as string,
    classify: classify.value,
  })
  classify.value = undefined
  return ret
}
function onVNodeMounted() {
  dynHeightLongListRef.value?.init()
}
function onTabClick(tabInfo: MenuTabInfo) {
  classify.value = tabInfo.id
  dynHeightLongListRef.value?.init(tabInfo.id)
}
</script>

<style scoped></style>
