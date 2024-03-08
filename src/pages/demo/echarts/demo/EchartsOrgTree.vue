<template>
  <div class="h-80 w-full flex flex-col">
    <div ref="echartsContainerRef" class="flex-1 h-0"></div>
  </div>
</template>

<script setup lang="ts">
import {
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  onMounted,
  ref,
  shallowRef,
} from 'vue'
import * as echarts from 'echarts/core'
import {
  TreeChart,
  // 系列类型的定义后缀都为 SeriesOption
  TreeSeriesOption,
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
import { useEchartsResizeAndDestory } from '../hooks/EchartsResizeAndDestoryHooks'

const echartsTheme = ref<string | undefined>()
// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
type ECOption = echarts.ComposeOption<
  | TreeSeriesOption
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
  TreeChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  LegendComponent,
])

const data = {
  name: '销售部',
  children: [
    {
      name: '销售一部',
      children: [
        {
          name: '任务名称1',
          itemStyle: { color: '#ff9800' },
        },
        {
          name: '任务名称2',
          itemStyle: { color: '#4d8dd9' },
        },
        {
          name: '任务名称3',
          itemStyle: { color: '#22b07b' },
        },
        {
          name: '任务名称4',
        },
        {
          name: '任务名称5',
        },
        {
          name: '任务名称6',
        },
        {
          name: '任务名称7',
        },
        {
          name: '任务名称8',
        },
      ],
    },
    {
      name: '销售二部',
    },
    {
      name: '销售三部',
      children: [
        {
          name: '任务3-1',
        },
        {
          name: '任务3-2',
        },
      ],
    },
    {
      name: '销售四部',
      children: [
        {
          name: '任务4-1',
        },
        {
          name: '任务4-2',
        },
      ],
    },
  ],
}
const option: ECOption = {
  tooltip: {
    trigger: 'item',
    triggerOn: 'mousemove',
  },
  series: [
    {
      type: 'tree',
      id: 0,
      name: 'tree1',
      data: [data],
      bottom: '30%',

      symbol: 'circle', //图形形状  rect方形  roundRect圆角 emptyCircle圆形 circle实心圆
      symbolSize: 17, //形状大小
      edgeShape: 'polyline', //线条类型  curve曲线
      roam: 'move', //移动+缩放  'scale' 或 'zoom'：只能够缩放。 'move' 或 'pan'：只能够平移。
      scaleLimit: {
        //缩放比例
        min: 0.7, //最小的缩放值
        max: 2, //最大的缩放值
      },
      layout: 'orthogonal', //树图布局，orthogonal水平垂直方向，radial径向布局 是指以根节点为圆心，每一层节点为环，一层层向外
      orient: 'TB', //树形方向  TB为上下结构  LR为左右结构
      initialTreeDepth: 1,
      lineStyle: {
        width: 0.7,
        color: '#1E9FFF',
        type: 'solid',
      },
      //   labelLayout(params) {
      //     console.log('params', params)
      //     if (params.dataIndex === 1) {
      //       return {}
      //     } else {
      //       return {
      //         y: params.rect.y - params.rect.height / 3,
      //       }
      //     }
      //   },
      label: {
        backgroundColor: '#81c5f7',
        position: 'bottom',
        verticalAlign: 'middle', //文字垂直对齐方式
        align: 'center',
        borderColor: '#1E9FFF',
        color: '#fff',
        borderWidth: 1,
        borderRadius: 5,
        // padding: 5,
        offset: [0, 30], //节点文字与圆圈之间的距离
        fontSize: 15,
        // 节点文本阴影
        shadowBlur: 10,
        shadowColor: 'rgba(0,0,0,0.25)',
        shadowOffsetX: 0,
        shadowOffsetY: 2,
        height: 30,
        width: 110,
      },
      leaves: {
        label: {
          backgroundColor: '#fff',
          color: '#333',
          position: 'inside',
          rotate: 0, //标签旋转。
          verticalAlign: 'middle',
          align: 'center',
          height: 30,
          width: 110,
          //文本框内文字超过6个字折行
          /* formatter: function(val) {
					 let strs = val.name.split(''); //字符串数组
					 let str = ''
					 for(let i = 0, s; s = strs[i++];) { //遍历字符串数组
					   str += s;
					   if(!(i % 6)) str += '\n'; //按需要求余，目前是一个字换一行
					 }
					 return str
				   }, */
          //或者
          overflow: 'break', //break为文字折行，  truncate为文字超出部分省略号显示
        },
      },
      emphasis: {
        focus: 'descendant',
      },
      expandAndCollapse: true,
      animationDuration: 550,
      animationDurationUpdate: 750,
    },
  ],
}

onMounted(() => {
  init()
})

onActivated(() => {
  //   loadData()
})
onDeactivated(() => {
  //   clearLoadDataInterval()
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
  //   loadData()
}
function chartInit(theme?: string) {
  const echartsContainer = echartsContainerRef.value
  if (!echartsContainer) return

  chartInstance.value = echarts.init(echartsContainer, theme)
  chartInstance.value.setOption(option)
}
</script>

<style scoped></style>
