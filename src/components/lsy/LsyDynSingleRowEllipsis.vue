<template>
  <div
    v-if="!enableTooltips"
    ref="divRef"
    class="block overflow-hidden whitespace-nowrap overflow-ellipsis align-middle"
    :title="title"
  >
    <template v-if="content">{{ content }}</template>
    <template v-else-if="noContentInsertBlank"> &nbsp;&nbsp; </template>
  </div>
  <el-tooltip v-else :content="title" trigger="hover">
    <div
      ref="divRef"
      class="block overflow-hidden whitespace-nowrap overflow-ellipsis align-middle"
    >
      {{ content }}
    </div>
  </el-tooltip>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { computed } from 'vue'
import { toRefs } from 'vue'
import { ref } from 'vue'

defineOptions({ name: 'DynSingleRowEllipsis' })

const props = defineProps<{
  content?: string | number | boolean
  useTooltips?: boolean
  /**
   * 当content为空时, 是否插入空字符
   */
  noContentInsertBlank?: boolean
}>()

const divRef = ref<HTMLElement>()
const { content, useTooltips } = toRefs(props)
// 可选值: 'hover' | 'click' | 'focus' | 'contextmenu'
// const trigger = ref('hover')

const title = ref('')
const enableTooltips = computed(() => title.value && useTooltips.value)
onMounted(() => {
  const el = divRef.value
  if (!el) return

  const defaultView = document.defaultView
  if (!defaultView) return

  const elComputed = defaultView.getComputedStyle(el, '')
  const padding =
    parseInt(elComputed.paddingLeft.replace('px', '')) +
    parseInt(elComputed.paddingRight.replace('px', ''))

  const range = document.createRange()
  range.setStart(el, 0)
  range.setEnd(el, el.childNodes.length)
  const rangeWidth = range.getBoundingClientRect().width
  if (
    rangeWidth + padding > el.offsetWidth ||
    el.scrollWidth > el.offsetWidth
  ) {
    title.value = `${content?.value ?? ''}`
  }
})
</script>

<style scoped></style>
