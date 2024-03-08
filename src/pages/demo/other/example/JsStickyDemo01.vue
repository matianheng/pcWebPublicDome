<template>
  <div class="relative overflow-hidden">
    <div ref="JsStickyRef" class="JsSticky" @scroll="onScroll">
      <template v-for="i in 10" :key="i">
        <!-- 标题dom -->
        <div
          :id="stickyIndex === i ? stickDomId : undefined"
          ref="titleArrRef"
          class="text-sm bg-gray-400"
          :class="{ 'sticky-dom': stickyIndex === i }"
        >
          索引行{{ i }}
        </div>
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
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

let titleDomOffsetTopArr: number[] = []
const stickDomId = `${new Date().getTime()}`

const titleArrRef = ref<HTMLDivElement[]>([])

function calcTitleDomOffsetTopArr() {
  titleDomOffsetTopArr = []
  titleArrRef.value.forEach(titleDom => {
    // 获取标题dom元素，距离滚动条顶部的距离
    titleDomOffsetTopArr.push(titleDom.offsetTop)
  })
}
const JsStickyRef = ref<HTMLElement>()

onMounted(() => {
  calcTitleDomOffsetTopArrAndScrollBarWidth()
})

function calcTitleDomOffsetTopArrAndScrollBarWidth() {
  calcTitleDomOffsetTopArr()

  const JsStickyDom = JsStickyRef.value
  if (!JsStickyDom) return

  calcScrollBarWidth(JsStickyDom)
}

const stickyIndex = ref<number>(1)
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
function onScroll(evt: UIEvent) {
  const scrollDom = evt.target as HTMLElement
  if (!scrollDom) return

  calcScrollBarWidth(scrollDom)

  const { scrollTop } = scrollDom
  stickyIndex.value = findStickIndex(scrollTop, titleDomOffsetTopArr) as number
  updateStickyDomPosition(scrollTop)
}

/**
 * 根据scrollTop值更新stick元素的显示位置
 * @param scrollTop
 */
function updateStickyDomPosition(scrollTop: number) {
  const stickyDom = document.getElementById(stickDomId)
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
  return ret
}
</script>

<style scoped lang="scss">
.JsSticky {
  overflow: auto;

  // 这里的24px是第一个title元素的实际高度
  padding-top: 24px;
  height: 300px;

  div {
    width: 100%;
  }

  .sticky-dom {
    position: absolute;
    top: 0;

    // 吸顶元素的宽度为：100% - 滚动条宽度
    width: calc(100% - v-bind(scrollBarWidthStr));
  }

  .itemLast {
    border-bottom: none;
  }
}
</style>
