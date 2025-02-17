<template>
  <div
    ref="contentRef"
    class="whitespace-pre-wrap break-all break-words overflow-hidden o-lsy-mutil-text-toggle"
  >
    <div v-if="showToggleBtn && !expand" class="float-right clear-both">
      <slot :expand="expand" :toggle="toggle">
        <el-link type="primary" size="small" @click="toggle">
          {{ toggleBtnText }}
        </el-link>
      </slot>
    </div>
    <span>{{ content }}</span>
    <div v-if="showToggleBtn && expand" class="float-right">
      <slot :expand="expand" :toggle="toggle">
        <el-link type="primary" size="small" @click="toggle">
          {{ toggleBtnText }}
        </el-link>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { add, divide, multiply } from 'lodash-unified'
import { computed } from 'vue'
import { watch } from 'vue'
import { onBeforeUnmount } from 'vue'
import { onMounted } from 'vue'
import { nextTick } from 'vue'
import { toRefs } from 'vue'
import { ref } from 'vue'

/**
 * 多行文本展开/收缩组件
 *
 * 该组件支持显示多行文本(支持显示textarea中的文本. 即:文本中包含\n则会在界面显示换行)
 */
defineOptions({ name: 'LsyMutilLineTextToggle' })

const props = withDefaults(
  defineProps<{
    /**
     * 文本内容
     */
    content?: string
    /**
     * 收缩时显示的行数. 默认:2
     */
    line?: number
    /**
     * 当不指定行高时，则程序内部自动获取容器的lineHeight属性值
     */
    lineHeight?: number
  }>(),
  { content: '', line: 2, lineHeight: undefined }
)
const { line, content, lineHeight } = toRefs(props)
const contentRef = ref<HTMLElement>()
const showToggleBtn = ref<boolean>(false)
const expand = ref<boolean>(false)
const toggleBtnText = computed(() => (expand.value ? '收缩' : '展开'))
const realHeight = ref<string>('auto')
const btnPanelTop = ref<string>('0px')
watch(
  [line, content, lineHeight],
  ([newLine, newContent, newLineHeight]) => {
    if (content.value !== newContent) {
      // 先将高度恢复成auto
      realHeight.value = 'auto'
    }
    nextTick(() => {
      // 再重新计算高度
      calcFun(newLine, newLineHeight)
    })
  },
  {
    immediate: true,
  }
)
function toggle() {
  expand.value = !expand.value
  calcFun(line.value, lineHeight.value)
}
const resizeObserver = new ResizeObserver(() => {
  // 先将高度恢复成auto
  realHeight.value = 'auto'
  nextTick(() => {
    calcFun(line.value, lineHeight.value)
  })
})
onMounted(() => {
  const contentDom = contentRef.value
  if (!contentDom) {
    return
  }
  resizeObserver.observe(contentDom)
})
onBeforeUnmount(() => {
  resizeObserver.disconnect()
})
/**
 * 计算是否需要显示展开/收缩按钮
 * 计算内容div的实际高度
 * 计算展开/收缩按钮的实际位置
 */
function calcFun(lineVal: number, lineHeightVal?: number) {
  const contentDom = contentRef.value
  if (!contentDom) {
    return
  }
  const CSSStyleDeclaration = window.getComputedStyle(contentDom)
  // 获取单行行高(这里的单行高度必然是一个px值，即使你手动将其设置为这种: line-height:1, 最终得到的也会是一个确定的px值)
  const _lineHeight = lineHeightVal
    ? lineHeightVal
    : pxToFloat(CSSStyleDeclaration.lineHeight)
  // 获取总高度
  const { scrollHeight } = contentDom
  const totalHeight = scrollHeight
  // 计算总行数
  const totalRow =
    totalHeight % _lineHeight === 0
      ? divide(totalHeight, _lineHeight)
      : add(parseInt(`${divide(totalHeight, _lineHeight)}`), 1)
  // 总函数大于配置的行数，则显示展开/收缩按钮
  showToggleBtn.value = totalRow > lineVal
  realHeight.value = calcRealHeight(lineVal)
  btnPanelTop.value = showToggleBtn.value
    ? `${calcTotalLineHeight(lineVal - 1, _lineHeight)}px`
    : '0'
}
/**
 * 计算实际高度
 */
function calcRealHeight(lineVal: number) {
  const contentDom = contentRef.value
  if (!contentDom || expand.value || !showToggleBtn.value) {
    // 默认高度,展开高度以及不显示展开/收缩按钮是的高度都为auto
    return 'auto'
  }
  // 代码执行到这就表示现在计算的是收缩后的高度: 收缩后高度 = 配置的行数 * 行高
  const CSSStyleDeclaration = window.getComputedStyle(contentDom)
  // 获取单行行高(这里的单行高度必然是一个px值，即使你手动将其设置为这种: line-height:1, 最终得到的也会是一个确定的px值)
  const lineHeight = pxToFloat(CSSStyleDeclaration.lineHeight)
  const height = calcTotalLineHeight(lineVal, lineHeight)
  return `${height}px`
}
/**
 * 根据行数和每行的高度，计算高度
 * @param line 行数
 * @param lineHeight 每行的高度
 */
function calcTotalLineHeight(lineVal: number, lineHeightVal: number) {
  return multiply(lineVal, lineHeightVal)
}
function pxToFloat(pxVal: string) {
  return parseFloat(pxVal.replace('px', ''))
}
</script>

<style scoped lang="scss">
.o-lsy-mutil-text-toggle {
  height: v-bind(realHeight);

  &::before {
    float: right;
    width: 0.5px;
    height: v-bind(btnPanelTop);
    content: ' ';
  }
}
</style>
