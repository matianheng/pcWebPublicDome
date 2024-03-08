<template>
  <div
    ref="scrollerDomRef"
    class="h-full overflow-auto u-hidden-scrollbar relative"
  >
    <div
      v-for="tabInfo of tabArr"
      :key="tabInfo.id"
      ref="tabArrRef"
      class="py-2 border-b-2 border-red-100 border-solid hover:bg-slate-100 cursor-pointer"
      :class="`${clickedTabId === tabInfo.id ? 'bg-slate-200' : ''}`"
      @click="() => onClick(tabInfo)"
    >
      {{ tabInfo.title }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MenuTabInfo } from '../dyn-height/3.typing'
import { watch } from 'vue'
import { toRefs } from 'vue'
import { nextTick } from 'vue'

const props = withDefaults(
  defineProps<{
    tabArr?: MenuTabInfo[]
    stickyClassify?: string | number
  }>(),
  { tabArr: () => [], stickyClassify: undefined }
)

const $emits = defineEmits<{
  tabClick: [tabInfo: MenuTabInfo]
}>()
const tabArrRef = ref<HTMLElement[]>([])
const { stickyClassify, tabArr } = toRefs(props)
const clickedTabId = ref<string | number | undefined>()
const stopWatchStickyClassify = ref<boolean>(false)
let stopWatchTime = 0
const scrollerDomRef = ref<HTMLElement>()
watch(
  stickyClassify,
  newStickyClassify => {
    if (stopWatchTime === 0 && stopWatchStickyClassify.value) {
      stopWatchTime = new Date().getTime()
    }
    if (stopWatchTime !== 0 && stopWatchStickyClassify.value) {
      const ret = new Date().getTime() - stopWatchTime
      if (ret > 800) {
        stopWatchStickyClassify.value = false
      }
    }
    if (!stopWatchStickyClassify.value) {
      clickedTabId.value = newStickyClassify
      const idx = tabArr.value.findIndex(item => item.id === clickedTabId.value)
      if (idx >= 0) {
        const dom = tabArrRef.value[idx]
        if (dom) {
          if (scrollerDomRef.value) {
            scrollerDomRef.value.scrollTo({
              top: dom.offsetTop - 100,
              behavior: 'smooth',
            })
          }
        }
      }
    }
  },
  {
    immediate: true,
  }
)
function onClick(tabInfo: MenuTabInfo) {
  stopWatchStickyClassify.value = true
  clickedTabId.value = tabInfo.id
  stopWatchTime = 0
  nextTick(() => {
    $emits('tabClick', tabInfo)
  })
}
</script>

<style scoped lang="scss"></style>
