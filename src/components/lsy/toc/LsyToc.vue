<template>
  <div v-if="hasToc" class="absolute right-3 bottom-12 z-10">
    <el-popover placement="left" title="目录" :width="200" trigger="hover">
      <template #reference>
        <el-button circle :icon="Memo"></el-button>
      </template>
      <div v-for="tocItem in tocInfoComp?.tocItemArr" :key="tocItem.tocId">
        <el-link
          :style="buildPaddingLeft(tocInfoComp?.minHType as number, tocItem.hType)"
          @click="() => onTocItemClick(tocItem.tocId)"
        >
          {{ tocItem.title }}
        </el-link>
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, computed } from 'vue'
import { Memo } from '@element-plus/icons-vue'
import { emitter } from '@/utils/Emitter'
import { rerenderTocEvt } from './TocEmitter'

defineOptions({ name: 'LsyToc' })

const props = withDefaults(
  defineProps<{
    contentRootDom?: HTMLElement
  }>(),
  { contentRootDom: undefined }
)
function buildPaddingLeft(minHType: number, hType: number) {
  return `padding-left:${(hType - minHType) * 5}px`
}
interface TocItem {
  title: string
  hType: number
  tocId: string
}
interface TocInfo {
  tocItemArr: TocItem[]
  minHType: number
}
const { contentRootDom } = toRefs(props)

function onTocItemClick(tocId: string) {
  const dom = contentRootDom.value
  if (!dom) return
  const ele = dom.querySelector(`[toc-id=${tocId}]`)
  ele?.scrollIntoView({ behavior: 'smooth' })
}
const tocInfoComp = ref<TocInfo | undefined>()

const hasToc = computed(() =>
  tocInfoComp.value ? tocInfoComp.value.tocItemArr.length > 0 : false
)
function buildToc(contentDom?: HTMLElement): TocInfo {
  const tocItemArr: TocItem[] = []
  const tocInfo: TocInfo = {
    minHType: -1,
    tocItemArr: tocItemArr,
  }
  if (!contentDom) return tocInfo

  const nodeList = contentDom.querySelectorAll('h1,h2,h3,h4,h5')
  const idSeed = new Date().getTime()

  let minHType = 6
  nodeList.forEach((ele, idx) => {
    const hType = calcHType(ele.tagName)
    const tocId = `toc-${idSeed + idx}`
    ele.setAttribute('toc-id', tocId)
    const title = ele.textContent as string
    if (hType != -1 && hType < minHType) {
      minHType = hType
    }
    tocItemArr.push({ title, hType, tocId })
  })
  tocInfo.minHType = minHType
  return tocInfo
}

function calcHType(tagName: string) {
  let ret = -1
  if (tagName.length === 2) {
    try {
      ret = parseInt(tagName.substring(1))
    } catch (error) {
      console.error(error)
    }
  }
  return ret
}
/**
 * 重新构建toc内容
 */
function rerenderToc() {
  requestAnimationFrame(() => {
    tocInfoComp.value = buildToc(contentRootDom.value)
  })
}
rerenderToc()

emitter.on(rerenderTocEvt, () => {
  rerenderToc()
})
defineExpose({ rerenderToc })
</script>

<style scoped></style>
