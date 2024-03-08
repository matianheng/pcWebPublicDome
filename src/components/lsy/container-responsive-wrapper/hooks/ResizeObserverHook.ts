import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * 根据dom宽度，计算每行能容纳的单元格数量
 */
export type UpdateRowColCountFun = (domOffsetWidth: number) => number
export function useResizeObserverHook(
  initColCount: number,
  updateRowColCountFun: UpdateRowColCountFun
) {
  const formWrapperRef = ref<HTMLElement>()
  const colCount = ref<number>(initColCount)
  const realCellCount = ref<number>(initColCount)
  const itemWidth = computed(() => {
    return `${100 / colCount.value}%`
  })
  /**
   * 是否需要显示展开/收缩按钮
   */
  const needShowToggleBtn = computed(() => {
    if (realCellCount.value - 1 === 1) {
      return false
    }
    return realCellCount.value - 1 >= colCount.value
  })
  const formWrapperDomResizeObserver: ResizeObserver = new ResizeObserver(
    onFormWrapperDomResize
  )
  onMounted(addFormWrapperDomResizeObserver)
  function addFormWrapperDomResizeObserver() {
    const divDom = formWrapperRef.value
    if (!divDom) {
      return
    }
    formWrapperDomResizeObserver.observe(divDom)
  }
  function onFormWrapperDomResize() {
    const divDom = formWrapperRef.value
    if (!divDom) {
      return
    }
    const offsetWidth = divDom.offsetWidth
    colCount.value = updateRowColCountFun(offsetWidth)
  }
  onBeforeUnmount(() => {
    const divDom = formWrapperRef.value
    if (divDom) {
      formWrapperDomResizeObserver.unobserve(divDom)
    }
    formWrapperDomResizeObserver.disconnect()
  })
  return {
    colCount,
    itemWidth,
    formWrapperRef,
    realCellCount,
    needShowToggleBtn,
  }
}
