<template>
  <div class="o-lsy-content-container h-full">
    <el-scrollbar
      ref="elScrollRef"
      view-class="h-full"
      @scroll="onScrollWrapper"
    >
      <div class="flex flex-col" :class="`${fitAllContent ? 'h-full' : ''}`">
        <div :class="fitAllContent ? 'flex-shrink-0' : ''">
          <el-card v-if="title || desc" shadow="never">
            <h2 class="text-xl font-bold flex flex-row relative">
              <span>{{ title }}</span>
              <span
                v-if="features"
                class="cursor-pointer pl-2 pr-2"
                @click="onToggleDialogVisible"
              >
                <el-icon :size="14" class="absolute -bottom-0.5">
                  <SvgIcon name="info" />
                </el-icon>
              </span>
            </h2>
            <p class="text-gray-400" v-html="desc"></p>
          </el-card>
        </div>
        <div
          ref="contentDomRef"
          class="u-fix-bfc"
          :class="[...contentDomClsComp, fitAllContent ? 'flex-1 h-0' : '']"
        >
          <!-- 主体内容 -->
          <slot v-if="visible"></slot>
        </div>
        <el-dialog
          v-model="dialogVisible"
          title="特点/细节说明"
          modal-class="o-lsy-dialog"
        >
          <ul class="list-disc pl-4">
            <li v-for="item in features" :key="item">{{ item }}</li>
          </ul>
        </el-dialog>
      </div>
    </el-scrollbar>
    <LsyBackTopAffix
      v-if="enableBackTopComp"
      :show="systemAffixShow"
      @click="onScrollToTop"
    ></LsyBackTopAffix>
    <LsyToc v-if="enableToc" :content-root-dom="contentDomRef"></LsyToc>
  </div>
</template>

<script setup lang="ts">
import {
  ElScrollbarType,
  useRecoverElScrollbarPosition,
} from './hooks/RecoverScrollPositionHook'
import { ElScrollbar } from 'element-plus'
import { computed, toRefs, ref } from 'vue'

defineOptions({ name: 'LsyContentContainer' })

const props = withDefaults(
  defineProps<{
    /**
     * 组件内容是否占满整个父容器高度. 默认:true
     *
     * 为true, 则是类似如下形式的布局结构
     * ```html
     * <div class='h-full flex flex-col'>
     *  <div class='flex-sharking-0'>头部内容</div>
     *  <div class='flex-1 h-0'>主体内容</div>
     * </div>
     * ```
     *
     * 为false, 则是类似如下形式的布局结构 (不会通过flex布局控制高度,也不会占满父容器的所有高度)
     * ```html
     * <div>
     *  <div>头部内容</div>
     *  <div>主体内容</div>
     * </div>
     * ```
     */
    fitAllContent?: boolean
    /**
     * 主体内容dom元素是否使用统一的padding值
     */
    usePadding?: boolean
    title?: string
    /**
     * 简述. 支持渲染html内容
     */
    desc?: string
    features?: string[]
    enableToc?: boolean
    enableBackTopComp?: boolean
    /**
     * 主体内容dom节点的自定义class
     */
    contentDomCls?: string[] | string
    /**
     * 延迟渲染主体内容. 默认: false
     *
     * 当主体内容很复杂时，vue渲染界面会很耗时，会导致tab的切换出现卡顿的感觉，那么此时可以考虑将该属性设置为true，在40毫秒之后，再渲染主体内容
     */
    lazyRenderContent?: boolean
  }>(),
  {
    usePadding: true,
    title: undefined,
    desc: undefined,
    features: undefined,
    enableToc: false,
    enableBackTopComp: false,
    contentDomCls: undefined,
    fitAllContent: true,
    lazyRenderContent: false,
  }
)
const { usePadding, contentDomCls, lazyRenderContent } = toRefs(props)
const paddingClsArr = computed<string[]>(() => {
  const retArr: string[] = []
  if (usePadding.value) {
    retArr.push(`p-3`)
  }
  return retArr
})
const contentDomClsComp = computed<string[]>(() => {
  const ret: string[] = []
  if (typeof contentDomCls.value === 'string' && contentDomCls.value) {
    ret.push(contentDomCls.value)
  } else if (contentDomCls.value instanceof Array) {
    ret.push(...contentDomCls.value)
  }
  ret.push(...paddingClsArr.value)
  return ret
})

const elScrollRef = ref<ElScrollbarType>()
// @ts-ignore
const { onScroll } = useRecoverElScrollbarPosition(elScrollRef)
const systemAffixShow = ref<boolean>(false)
function onScrollWrapper({
  scrollLeft,
  scrollTop,
}: {
  scrollTop?: number
  scrollLeft?: number
}) {
  onScroll({ scrollLeft, scrollTop })
  if (scrollTop && scrollTop > 500) {
    systemAffixShow.value = true
  } else {
    systemAffixShow.value = false
  }
}
const visible = ref<boolean>(lazyRenderContent.value ? false : true)
if (lazyRenderContent.value) {
  // setTimeout(() => {
  //   visible.value = true
  // }, 16)
  requestAnimationFrame(() => {
    visible.value = true
  })
}
const contentDomRef = ref<HTMLElement>()

const dialogVisible = ref(false)
function onToggleDialogVisible() {
  dialogVisible.value = !dialogVisible.value
}
function onScrollToTop() {
  elScrollRef.value?.scrollTo({ top: 0, behavior: 'smooth' })
}
defineExpose({ elScrollRef })
</script>
<style lang="scss" scoped>
.o-lsy-content-container {
  will-change: transform, opacity;
}
</style>
