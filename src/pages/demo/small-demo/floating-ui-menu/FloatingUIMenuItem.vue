<template>
  <div>
    <div
      ref="referenceRef"
      class="p-3 flex flex-row justify-center border-b-2 border-b-red-200 cursor-pointer"
      @click="() => onClick(menuItem)"
    >
      {{ menuItem.name }}
    </div>
    <Teleport
      v-if="menuItem.children && menuItem.children.length > 0"
      to="body"
    >
      <div
        v-if="show"
        ref="tooltipRef"
        role="tooltip"
        class="bg-gray-800 text-white fixed top-0 left-0 z-20 tooltip"
      >
        <div ref="arrowRef" class="absolute bg-gray-800 arrow"></div>
        <ul>
          <li
            v-for="child in menuItem.children"
            :key="child.key"
            class="p-3 cursor-pointer"
            @click="() => onClick(child)"
          >
            {{ child.name }}
          </li>
        </ul>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FloatingUIMenuType } from './FloatingUIMenu.d'
import { onMounted } from 'vue'
import { computePosition, flip, shift, offset, arrow } from '@floating-ui/dom'
import { nextTick } from 'vue'
import { onBeforeUnmount } from 'vue'
import { toRefs } from 'vue'
import { computed } from 'vue'

const props = defineProps<{
  menuItem: FloatingUIMenuType
  scrollTop: number
}>()
const $emits = defineEmits<{
  click: [menuItem: FloatingUIMenuType]
}>()
const tooltipRef = ref<HTMLDivElement>()
const referenceRef = ref<HTMLDivElement>()
const arrowRef = ref<HTMLDivElement>()
const show = ref<boolean>(false)
const { scrollTop } = toRefs(props)
onMounted(() => {
  init()
})

onBeforeUnmount(() => {
  destroy()
})

let offsetTop = 0
/**
 * 当前元素顶部距离body顶部的距离
 */
const realOffsetTop = computed(() => {
  console.log(scrollTop.value)
  return offsetTop - scrollTop.value + 12
})
function update() {
  const referenceDom = referenceRef.value
  const tooltipDom = tooltipRef.value
  const arrowDom = arrowRef.value
  if (!referenceDom) return
  if (!tooltipDom) return
  if (!arrowDom) return

  computePosition(referenceDom, tooltipDom, {
    // -important-: 此处的strategy值, 需要与tooltip元素的定位方式一致.
    strategy: 'fixed',
    placement: 'right',
    middleware: [
      offset(20),
      flip(),
      shift({
        padding: { left: 15, right: 15, bottom: 15, top: realOffsetTop.value },
      }),
      arrow({ element: arrowDom }),
    ],
  }).then(({ x, y, placement, middlewareData }) => {
    Object.assign(tooltipDom.style, {
      left: `${x}px`,
      top: `${y}px`,
    })

    // @ts-ignore
    const { x: arrowX, y: arrowY } = middlewareData.arrow
    const staticSide = {
      top: 'bottom',
      right: 'left',
      bottom: 'top',
      left: 'right',
    }[placement.split('-')[0]] as string

    Object.assign(arrowDom.style, {
      left: arrowX != null ? `${arrowX}px` : '',
      top: arrowY != null ? `${arrowY}px` : '',
      right: '',
      bottom: '',
      [staticSide]: '-4px',
    })
  })
}
let hideTooltipFlag: number | undefined
function showTooltip() {
  show.value = true
  nextTick(() => {
    const tooltipDom = tooltipRef.value
    if (!tooltipDom) return

    tooltipAddEvt()

    if (hideTooltipFlag) {
      // 禁止隐藏tooltipDom
      window.clearTimeout(hideTooltipFlag)
    }
    tooltipDom.style.display = 'block'

    update()
  })
}

function hideTooltip() {
  const tooltipDom = tooltipRef.value
  if (!tooltipDom) return

  hideTooltipFlag = window.setTimeout(() => {
    show.value = false
    tooltipDom.style.display = ''
  }, 200)
}
function tooltipAddEvt() {
  const tooltipDom = tooltipRef.value
  if (!tooltipDom) return
  const arr = [
    ['mouseenter', showTooltip],
    ['mouseleave', hideTooltip],
    ['focus', showTooltip],
    ['blur', hideTooltip],
  ]
  arr.forEach(([event, callback]) => {
    // @ts-ignore
    tooltipDom.addEventListener(event, callback)
  })
}
/**
 * 计算dom元素距离body元素顶部的距离
 */
function calcOffsetTop(dom: HTMLElement): number {
  // 获取dom的定位父元素
  const offsetParent = dom.offsetParent as HTMLElement
  // 获取dom距离定位父元素的顶部的距离
  const offsetTop = dom.offsetTop
  if (offsetParent) {
    // 存在定位父元素
    if (offsetParent.tagName === 'BODY') {
      // 定位父元素为body，则直接返回当前元素距离body顶部的距离
      return offsetTop
    } else {
      // 定位父元素为非body，则返回当前元素距离定位父元素顶部的距离，再加上定位父元素距离他的定位父元素顶部的距离
      return offsetTop + calcOffsetTop(offsetParent)
    }
  }
  // 不存在定位父元素，则返回0
  return 0
}
function init() {
  const referenceDom = referenceRef.value
  if (!referenceDom) return
  offsetTop = calcOffsetTop(referenceDom)
  const arr: [string, () => void][] = [
    ['mouseenter', showTooltip],
    ['mouseleave', hideTooltip],
    ['focus', showTooltip],
    ['blur', hideTooltip],
  ]
  arr.forEach(([event, callback]) => {
    referenceDom.addEventListener(event, callback)
  })
}

function destroy() {
  const referenceDom = referenceRef.value
  if (!referenceDom) return
  const arr: [string, () => void][] = [
    ['mouseenter', showTooltip],
    ['mouseleave', hideTooltip],
    ['focus', showTooltip],
    ['blur', hideTooltip],
  ]
  arr.forEach(([event, callback]) => {
    referenceDom.removeEventListener(event, callback)
  })
}

function onClick(clickedMenuItem: FloatingUIMenuType) {
  $emits('click', clickedMenuItem)
}
</script>

<style scoped lang="scss">
.arrow {
  width: 8px;
  height: 8px;
  transform: rotate(45deg);
}

.tooltip {
  display: none;
}
</style>
