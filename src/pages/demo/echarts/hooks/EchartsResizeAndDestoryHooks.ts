import * as echarts from 'echarts/core'

import { onBeforeUnmount, onMounted, Ref, ShallowRef } from 'vue'
import wonderlandEchartsTheme from '@/assets/echarts-theme/wonderland.json'
import customDarkEchartsTheme from '@/assets/echarts-theme/customDark.json'

interface EchartsTheme {
  [key: string]: any
}
type registerThemeMethod = (name: string, theme: EchartsTheme) => void

export function useEchartsResizeAndDestory(
  registerThemeMethod: registerThemeMethod,
  chartInstance: ShallowRef<echarts.ECharts | undefined>,
  echartsContainerRef: Ref<HTMLDivElement | undefined>
) {
  registerThemeMethod('wonderland', wonderlandEchartsTheme)
  registerThemeMethod('customDark', customDarkEchartsTheme)
  onMounted(() => {
    listenChartsResize()
  })
  onBeforeUnmount(() => {
    destoryEcharts()
    destoryListenChartsResize()
  })

  const observer = new ResizeObserver(() => {
    chartContainerResize()
  })
  function chartContainerResize() {
    const echartsContainer = echartsContainerRef.value
    if (!echartsContainer) return

    if (chartInstance.value) {
      chartInstance.value.resize()
    }
  }
  function listenChartsResize() {
    const echartsContainer = echartsContainerRef.value
    if (!echartsContainer) return

    observer.observe(echartsContainer)
  }
  function destoryListenChartsResize() {
    observer.disconnect()
  }
  function destoryEcharts() {
    if (chartInstance.value) {
      chartInstance.value.dispose()
      chartInstance.value = undefined
    }
  }
  return { destoryEcharts }
}
