<!--
暗黑主题切换
@file: DarkThemeChange.vue
@author: pan
-->
<script lang="ts">
export default {
  name: 'DarkThemeChange',
}
</script>
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
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { useEchartsResizeAndDestory } from '../hooks/EchartsResizeAndDestoryHooks'

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
])

const option: ECOption = {
  xAxis: {
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  yAxis: {},
  series: [
    {
      type: 'bar',
      data: [23, 24, 18, 25, 27, 28, 25],
    },
  ],
}

onMounted(() => {
  init()
})

const echartsContainerRef = ref<HTMLDivElement>()
const chartInstance = shallowRef<echarts.ECharts | undefined>()

const { destoryEcharts } = useEchartsResizeAndDestory(
  echarts.registerTheme,
  chartInstance,
  echartsContainerRef
)

function init() {
  chartInit(echartsTheme.value)
}
function chartInit(theme?: string) {
  const echartsContainer = echartsContainerRef.value
  if (!echartsContainer) return

  chartInstance.value = echarts.init(echartsContainer, theme)
  chartInstance.value.setOption(option)
}

function onChangeChartTheme(theme: string | undefined) {
  destoryEcharts()
  echartsTheme.value = theme
  chartInit(theme)
}
</script>

<template>
  <div class="h-80 w-full flex flex-col">
    <div class="flex-shrink-0">
      <el-button @click="onChangeChartTheme('dark')">echarts暗黑主题</el-button>
      <el-button @click="onChangeChartTheme(undefined)">
        echarts默认主题
      </el-button>
      <el-button @click="onChangeChartTheme('wonderland')">
        echarts wonderland 主题
      </el-button>
      <el-button @click="onChangeChartTheme('customDark')">
        echarts customDark 主题
      </el-button>
    </div>
    <div ref="echartsContainerRef" class="flex-1 h-0"></div>
  </div>
</template>

<style lang="scss" scoped></style>
