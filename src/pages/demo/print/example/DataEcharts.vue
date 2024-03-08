<script setup lang="ts">
import { onMounted, ref, shallowRef } from 'vue'
import * as echarts from 'echarts/core'
import {
  BarChart,
  // 系列类型的定义后缀都为 SeriesOption
  BarSeriesOption,
} from 'echarts/charts'
import {
  TitleComponent,
  // 组件类型的定义后缀都为 ComponentOption
  TitleComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  GridComponent,
  GridComponentOption,
  // 数据集组件
  DatasetComponent,
  DatasetComponentOption,
  // 内置数据转换器组件 (filter, sort)
  TransformComponent,
  LegendComponent,
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { useEchartsResizeAndDestory } from '@/pages/demo/echarts/hooks/EchartsResizeAndDestoryHooks'

const echartsTheme = ref<string | undefined>()
// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
type ECOption = echarts.ComposeOption<
  | BarSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | DatasetComponentOption
>

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  LegendComponent,
])

const option: ECOption = {
  title: {
    text: 'echarts示例',
  },
  tooltip: {},
  legend: {
    data: ['销量'],
  },
  xAxis: {
    data: [],
  },
  yAxis: {},
  series: [
    {
      name: '销量',
      type: 'bar',
      data: [],
    },
  ],
}

onMounted(() => {
  init()
})

const echartsContainerRef = ref<HTMLDivElement>()
const chartInstance = shallowRef<echarts.ECharts | undefined>()

useEchartsResizeAndDestory(
  echarts.registerTheme,
  chartInstance,
  echartsContainerRef
)

function init() {
  chartInit(echartsTheme.value)
  onLoadData()
}
function chartInit(theme?: string) {
  const echartsContainer = echartsContainerRef.value
  if (!echartsContainer) return

  chartInstance.value = echarts.init(echartsContainer, theme)
  chartInstance.value.setOption(option)
}

const dataLoading = ref<boolean>(false)
function randomData() {
  return Math.ceil(Math.random() * 100)
}
function onLoadData() {
  const _chartInstance = chartInstance.value
  console.log(_chartInstance)
  if (!_chartInstance) return

  dataLoading.value = true
  setTimeout(() => {
    const data = {
      categories: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
      values: [
        randomData(),
        randomData(),
        randomData(),
        randomData(),
        randomData(),
        randomData(),
      ],
    }

    _chartInstance.setOption({
      xAxis: {
        data: data.categories,
      },
      series: [
        {
          // 根据名字对应到相应的系列
          name: '销量',
          data: data.values,
        },
      ],
    })
    dataLoading.value = false
  }, 3000)
}
</script>

<template>
  <div class="h-80 w-full flex flex-col">
    <div
      ref="echartsContainerRef"
      v-loading="dataLoading"
      class="flex-1 h-0"
    ></div>
  </div>
</template>

<style lang="scss" scoped></style>
