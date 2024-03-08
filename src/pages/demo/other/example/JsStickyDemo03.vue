<template>
  <div class="flex flex-row h-80">
    <div class="flex-shrink-0">
      <div class="h-full overflow-auto u-hidden-scrollbar">
        <div
          v-for="i in typeCount"
          :id="buildTabIndexId(i)"
          :key="i"
          class="p-3 border-b-2 border-b-red-200 last:border-b-0 cursor-pointer"
          :class="{ active: i === highlightTabIndex }"
          @click="() => onClick(i)"
        >
          索引行{{ i }}
        </div>
      </div>
    </div>
    <div class="flex-1 w-0 relative overflow-hidden">
      <!-- sticky元素 -->
      <div ref="stickyDomRef" class="sticky-dom text-sm bg-gray-400">
        索引行{{ stickyIndex }}
      </div>
      <div
        ref="JsStickyRef"
        class="JsSticky h-full overflow-auto"
        @scroll="onScroll"
      >
        <template v-for="i in typeCount" :key="i">
          <!-- 标题dom -->
          <div ref="titleArrRef" class="text-sm bg-gray-400">索引行{{ i }}</div>
          <!-- 内容dom -->
          <template v-for="j in 3" :key="j">
            <div
              class="border-b-2 border-dashed border-b-red-400 py-2 text-base"
              :class="{ itemLast: j === 3 }"
            >
              第{{ `${i}-${j}` }}项目
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

let titleDomOffsetTopArr: number[] = []
let typeCount = 20

const titleArrRef = ref<HTMLDivElement[]>([])
const stickyDomRef = ref<HTMLDivElement>()
const JsStickyRef = ref<HTMLElement>()
const stickyIndex = ref<number>(1)
const highlightTabIndex = ref<number>(1)

let executeStickyLogic = true
let flag: number | undefined
function onClick(idx: number) {
  const scrollTop = titleDomOffsetTopArr[idx - 1]
  if (scrollTop !== undefined && scrollTop >= 0) {
    // 点击事件触发滚动时，禁止执行onScroll中部分逻辑
    executeStickyLogic = false
    stopDebounceLeftItemDomScrollInView()
    // 让实际滚动距离超出一点点
    const toScrollTop = scrollTop + 1
    JsStickyRef.value?.scrollTo({ top: toScrollTop, behavior: 'smooth' })
    if (flag) {
      window.clearTimeout(flag)
    }
    // 直接更新粘性布局索引号
    stickyIndex.value = idx
    // 直接更新左侧高亮索引号
    highlightTabIndex.value = idx
    flag = window.setTimeout(() => {
      // 因为实际能滚动到的位置可能小于toScrollTop，因此需要根据滚动条的实际位置来修正stickyIndex
      updateStickyIndex(false)
      executeStickyLogic = true
    }, 800)
  }
}
function buildTabIndexId(idx: number) {
  return `tab-index-${idx}`
}
function calcTitleDomOffsetTopArr() {
  titleDomOffsetTopArr = []
  titleArrRef.value.forEach(titleDom => {
    // 获取标题dom元素，距离滚动条顶部的距离
    titleDomOffsetTopArr.push(titleDom.offsetTop)
  })
}

onMounted(() => {
  calcTitleDomOffsetTopArrAndScrollBarWidth()
})

function calcTitleDomOffsetTopArrAndScrollBarWidth() {
  calcTitleDomOffsetTopArr()

  const JsStickyDom = JsStickyRef.value
  if (!JsStickyDom) return

  calcScrollBarWidth(JsStickyDom)
}

// 竖向滚动条宽度
const scrollBarWidth = ref<number>(0)
const scrollBarWidthStr = computed<string>(() => `${scrollBarWidth.value}px`)

/**
 * 计算竖向滚动条宽度
 */
function calcScrollBarWidth(scrollDom: HTMLElement) {
  const {
    offsetWidth: containerOffsetWidth,
    clientWidth: containerClientWidth,
  } = scrollDom
  // 计算滚动条的宽度
  let tmp = containerOffsetWidth - containerClientWidth
  if (tmp !== scrollBarWidth.value) {
    scrollBarWidth.value = containerOffsetWidth - containerClientWidth
  }
}
function leftItemDomScrollInView() {
  const dom = document.getElementById(buildTabIndexId(stickyIndex.value))
  if (dom) {
    dom.scrollIntoView({ behavior: 'smooth' })
  }
}
let leftItemDomScrollInViewTimeoutFlag: number | undefined
const debounceLeftItemDomScrollInView = () => {
  stopDebounceLeftItemDomScrollInView()
  leftItemDomScrollInViewTimeoutFlag = window.setTimeout(() => {
    leftItemDomScrollInView()
  }, 300)
}

function stopDebounceLeftItemDomScrollInView() {
  if (leftItemDomScrollInViewTimeoutFlag) {
    window.clearTimeout(leftItemDomScrollInViewTimeoutFlag)
  }
}
function onScroll(evt: UIEvent) {
  const scrollDom = evt.target as HTMLElement
  if (!scrollDom) return

  calcScrollBarWidth(scrollDom)

  if (executeStickyLogic) {
    updateStickyIndex()
    debounceLeftItemDomScrollInView()
    updateStickyDomPosition(scrollDom.scrollTop)
  }
}

/**
 * 根据scrollTop值更新stick元素的显示位置
 * @param scrollTop
 */
function updateStickyDomPosition(scrollTop: number) {
  const stickyDom = stickyDomRef.value
  if (!stickyDom) return

  const _stickIndex = stickyIndex.value
  if (_stickIndex < 0) return

  const nextStickyPos = stickyIndex.value
  if (nextStickyPos < titleDomOffsetTopArr.length) {
    const nextStickTitleDomOffsetTop = titleDomOffsetTopArr[nextStickyPos]
    const flagScrollTop = nextStickTitleDomOffsetTop - 20
    if (scrollTop <= flagScrollTop) {
      stickyDom.style.top = `0`
    } else {
      // 这里实现的是让stick元素逐渐向上移动
      const diff = scrollTop - flagScrollTop
      stickyDom.style.top = `-${diff}px`
    }
  }
}

function updateStickyIndex(updateHighlightTabIndex = true) {
  const scrollDom = JsStickyRef.value
  if (!scrollDom) return

  const { scrollTop } = scrollDom
  stickyIndex.value = findStickIndex(scrollTop, titleDomOffsetTopArr) as number
  if (updateHighlightTabIndex) {
    highlightTabIndex.value = stickyIndex.value
  }
}

/**
 * 根据当前滚动条位置,计算粘性布局元素索引号
 * @param scrollTop 滚动条位置
 * @param offsetTopArr 标题dom元素，距离滚动容器顶部距离
 */
function findStickIndex(scrollTop: number, offsetTopArr: number[]) {
  // 遍历方式查找
  //   const end = offsetTopArr.length - 1
  //   for (let i = end; i >= 0; i--) {
  //     if (scrollTop >= offsetTopArr[i]) {
  //       return i + 1
  //     }
  //   }

  // 二分查找/折半查找
  if (scrollTop <= 0) {
    return 1
  }

  let start = 0
  let end = offsetTopArr.length
  let ret: number = end - 1
  while (start <= end) {
    // Math.trunc() 仅保留结果的整数部分
    let middle = Math.trunc((start + end) / 2)
    let middlePos = middle === 0 ? 0 : middle - 1
    // 获取折半之后的标题dom距离滚动容器顶部距离
    const offsetTop = offsetTopArr[middlePos]
    if (offsetTop === scrollTop) {
      // 标题dom距离滚动容器顶部距离与滚动条的offsetTop一致
      ret = middle
      break
    } else if (scrollTop < offsetTop) {
      if (ret === undefined || ret > middle) {
        ret = middle
      }
      // 标题dom距离滚动容器顶部距离大于滚动条的offsetTop，向前折半(舍弃后半部分)，继续查找
      end = middle - 1
    } else if (scrollTop > offsetTop) {
      // 标题dom距离滚动容器顶部距离小于滚动条的offsetTop，向后折半(舍弃前半部分)，继续查找
      ret = middle
      start = middle + 1
    }
  }
  return ret <= 0 ? 1 : ret
}
</script>

<style scoped lang="scss">
.sticky-dom {
  position: absolute;
  top: 0;

  // 吸顶元素的宽度为：100% - 滚动条宽度
  width: calc(100% - v-bind(scrollBarWidthStr));
}

.active {
  background-color: antiquewhite;
}

.JsSticky {
  div {
    width: 100%;
  }

  .itemLast {
    border-bottom: none;
  }
}
</style>
