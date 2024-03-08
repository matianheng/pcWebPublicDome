<template>
  <div class="h-full w-full relative">
    <!-- 外层dom必须设置为相对定位，因为柱子dom需要设置为绝对定位 -->
    <div
      ref="scrollerDomRef"
      class="h-full w-full relative overflow-y-auto contain-paint"
      @scroll="onScroll"
    >
      <!-- 这是柱子节点,只能通过height来撑开高度，不能通过translateY来撑开高度，因为translateY撑开高度，会因为列表数据刷新，而使得滚动条重新回到顶部 -->
      <div
        class="absolute top-0 left-0 right-0 z-[-1] will-change-height"
        :style="`height:${pillarDomHeight}px`"
      ></div>
      <div
        ref="contentWrapperDomRef"
        :style="`transform:translateY(${translateY}px)`"
        class="will-change-transform"
      >
        <template v-for="dataItem in visibleDataArr" :key="dataItem.key">
          <!-- data-index的作用是标识当前dom元素在allDataPositionArr中的数组下标 -->
          <div :data-index="dataItem.arrPos">
            <!-- 数据类型是2，则渲染分类项组件，否则渲染数据项组件 -->
            <component
              :is="classifyComp"
              v-if="
                dataItem.dataType === 2 &&
                classifyMap.get(dataItem.customData.classify)
              "
              :classify-info="classifyMap.get(dataItem.customData.classify)"
            ></component>
            <component
              :is="itemComp"
              v-else-if="dataItem.dataType === 1"
              :data-item="dataItem"
            ></component>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onUpdated, nextTick, ref, Component as VueComponent } from 'vue'
import type {
  DataPositionHeight,
  ItemData,
  MenuTabInfo,
  PageResult,
} from './3.typing'
import { toRefs } from 'vue'
import { computed } from 'vue'
import { throttle, debounce } from 'lodash-unified'
/**
 * 项高度不确定的长列表
 *
 * 与DynHeightLongList的区别是，这个在滚动到了顶部之后，也会调用 searchData() 向前追加新数据
 *
 * 该组件的逻辑触发点有3个, 读源码的同学, 注意从这3个地方开始切入
 * 1. init方法: 对组件数据进行初始化
 * 2. onScroll回调方法: 随着滚动, 不断更新修改组件数据
 * 3. onUpdated回调方法: 随着实际渲染, 不断修正预估项高度和实际项高度差异导致的滚动与显示差异
 */
defineOptions({
  name: 'DynHeightLongList3',
})

const props = withDefaults(
  defineProps<{
    /**
     * 根据id加载数据
     * @param next 向后查找数据还是向前查找数据。true向后,false向前
     * @param id 数据id(查询该id之前或之后的数据，返回结果中不应该再包含该id对应的数据)
     * @returns list的每一项应该是 CustomData 类型
     *
     * @see 3.typing.d.ts#CustomData
     */
    loadData: (next: boolean, id?: number | string) => Promise<PageResult>
    /**
     * 列表数据项预估高度. 单位: px (该数据定义之后不可改)
     */
    estimateHeight: number
    /**
     * 列表分类项预估高度. 单位: px (该数据定义之后不可改)
     */
    estimateClassifyHeight: number
    /**
     * 缓冲数据量(该数据定义之后不可改)
     */
    cacheCount: number
    /**
     * 自定义表单项组件(该数据定义之后不可改)
     * 表单项组件的prop为: itemData: ItemData
     */
    itemComp: VueComponent
    /**
     * 自定义分类组件
     */
    classifyComp: VueComponent
    /**
     * 分类数据
     */
    classifyArr?: MenuTabInfo[]
    /**
     * 该属性为v-model属性(外部无需修改,内部会自动更新), 用于让外部知道, 当前是哪个分类处于激活状态
     */
    stickyClassify?: string | number
  }>(),
  { stickyClassify: undefined, classifyArr: () => [] }
)
const $emits = defineEmits<{
  'update:stickyClassify': [stickyClassify?: string | number]
}>()
const { classifyArr, stickyClassify } = toRefs(props)
const stickyClassifyComp = computed<string | number | undefined>({
  get() {
    return stickyClassify.value
  },
  set(val: string | number | undefined) {
    $emits('update:stickyClassify', val)
  },
})
const classifyMap = computed(() => {
  const map = new Map<string | number, MenuTabInfo>()
  classifyArr?.value?.forEach(item => {
    map.set(item.id, item)
  })
  return map
})
// 竖向滚动条宽度
const scrollBarWidth = ref<number>(0)
const scrollBarWidthStr = computed<string>(() => `${scrollBarWidth.value}px`)
/**
 * 计算竖向滚动条宽度
 */
function calcScrollBarWidth() {
  const scrollDom = scrollerDomRef.value
  if (!scrollDom) return

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
const calcScrollBarWidthDebounce = debounce(calcScrollBarWidth, 500)
const {
  loadData,
  estimateHeight,
  estimateClassifyHeight,
  cacheCount,
  itemComp,
} = props
/**
 * 需要截取数据的开始索引号
 */
let start = 0
/**
 * 需要截取数据的结束索引号
 */
let end = 0
/**
 * 是否数据加载中
 */
const dataLoading = ref<boolean>(false)
/**
 * 所有数据(包含已渲染的和未渲染的)
 *
 * P.S. 避免变成响应式数据, 优化性能
 */
let allDataArr: ItemData[] = []
/**
 * 所有数据的位置信息(包含已渲染的和未渲染的)
 *
 *  P.S. 避免变成响应式数据, 优化性能
 */
let allDataPositionArr: DataPositionHeight[] = []
/**
 * 当前可见的数据
 *
 * 必须是响应式数据, 因为此数据变化, 要求视图也跟着变化
 */
const visibleDataArr = ref<ItemData[]>([])
/**
 * 支柱节点高度(该高度用于撑开整个虚拟列表的高度). 单位: px
 */
const pillarDomHeight = ref<number>(0)
/**
 * 列表dom节点y轴偏移量。单位: px
 */
const translateY = ref<number>(0)
/**
 * 滚动容器
 */
const scrollerDomRef = ref<HTMLDivElement>()
/**
 * 实际列表内容包裹容器
 */
const contentWrapperDomRef = ref<HTMLDivElement>()
/**
 * 是否执行长列表逻辑(执行clear(清空方法时无需执行长列表逻辑))
 */
let executeLongListLogicCall = true

/**
 * 向后追加数据的过程中，是否需要插入分类数据
 * @param startArrPos 遍历list之前allDataArr总数据量
 * @param idx 当前list遍历的数组下标
 * @param list 当前批次数据
 */
function appendNextNeedInsertClassifyData(
  startArrPos: number,
  idx: number,
  list: Record<string, any>[],
  initClassify?: number | string
) {
  if (startArrPos === 0) {
    if (undefined !== initClassify) {
      // allDataArr为空，且存在初始分类，如果初始分类与第一个数据的分类一致，则需要插入分类(说明从分类的第一条数据往后还存在至少size条数据)，否则无需插入
      return initClassify === list[0].classify
    } else {
      // allDataArr为空，且不存在初始分类，则需要插入分类
      return true
    }
  } else if (
    idx === 0 &&
    allDataArr[allDataArr.length - 1].dataType === 1 &&
    allDataArr[allDataArr.length - 1].customData.classify !== list[idx].classify
  ) {
    // idx为0表示，当前是list的第一个元素，list第一个元素的分类与allDataArr最后一个的分类不同，则插入分类数据项
    return true
  } else if (idx > 0 && list[idx].classify !== list[idx - 1].classify) {
    // 当前是list中非第一个元素，如果当前元素与上一个元素的分类不同，则需要插入分类数据项
    return true
  }
  return false
}
/**
 * 向前追加数据的过程中，是否需要插入分类数据
 * @param idx 当前list遍历的数组下标
 * @param list 当前批次数据
 */
function appendPreviewNeedInsertClassifyData(idx: number, list: any[]) {
  if (idx === 0) {
    // 当前是第一条数据，且再向前没有数据，则需要增加分类
    return !list[idx].hasPreview
  } else if (idx > 0 && list[idx].classify !== list[idx - 1].classify) {
    // 当前遍历数据与上一个数据的分类不同，则需要插入分类
    return true
  } else if (idx === list.length - 1) {
    // 当前是list最后一条数据, 此处不处理
    return false
  }
  return false
}

/**
 * 获取并填充数据
 * 如果是向后追加: 获取列表项数据，计算列表项位置和高度，项目数据放入allDataArr，项位置和高度信息放入allDataPositionArr
 * 如果是向前追加: 获取列表项数据，将新数据追加到allDataArr头部，并修改旧数据的位置信息和索引信息，以及将start，end调整为向头部追加数据之后的正确值
 * @param next 值为true，则获取后面的数据，值为false, 则获取前面的数据
 */
async function searchData(next: boolean, initClassify?: number | string) {
  // 获取加载数据前的总数量
  const startArrPos = allDataArr.length
  // 调用外部方法，加载实际数据
  let id: undefined | number | string
  if (startArrPos > 0) {
    if (next) {
      const tmp = allDataArr[startArrPos - 1]
      // 是否能继续向后加载数据
      if (!tmp.customData.hasNext) {
        return
      }
      // 需要加载后面的数据，则通过已加载数据的最后一条数据的id获取
      id = tmp.customData.id
    } else {
      // 需要加载前面的数据，则通过已加载数据的第一条数据的id获取
      const tmp = allDataArr[0]
      // 是否能继续向前加载数据
      if (!tmp.customData.hasPreview) {
        return
      }
      id = tmp.customData.id
    }
  }
  const ret = await loadData(next, id)
  if (!ret.list || ret.list.length === 0) return

  if (next) {
    // 处理向后追加的数据
    let arrPos = startArrPos
    ret.list.forEach((item, idx) => {
      if (
        appendNextNeedInsertClassifyData(arrPos, idx, ret.list, initClassify)
      ) {
        arrPos = appendClassifyItem(
          item,
          arrPos,
          allDataArr,
          allDataPositionArr
        )
      }
      arrPos = appendDataItem(item, arrPos, allDataArr, allDataPositionArr)
    })
  } else {
    // 处理向前追加的数据
    const newAllDataArr: ItemData[] = []
    const newAllDataPositionArr: DataPositionHeight[] = []
    let arrPos = 0
    ret.list.forEach((item, idx) => {
      if (appendPreviewNeedInsertClassifyData(idx, ret.list)) {
        arrPos = appendClassifyItem(
          item,
          arrPos,
          newAllDataArr,
          newAllDataPositionArr
        )
      }
      arrPos = appendDataItem(
        item,
        arrPos,
        newAllDataArr,
        newAllDataPositionArr
      )
    })
    if (
      newAllDataArr[newAllDataArr.length - 1].customData.classify !==
      allDataArr[0].customData.classify
    ) {
      // newAllDataArr的最后一个数据的分类与allDataArr的第一个数据的分类不同
      if (
        allDataArr[0].dataType !== 2 &&
        newAllDataArr[newAllDataArr.length - 1].dataType !== 2
      ) {
        // allDataArr第一条数据不是分类项, 且newAllDataArr最后一条数据不是分类项，则需要插入分类项
        arrPos = appendClassifyItem(
          allDataArr[0].customData,
          arrPos,
          newAllDataArr,
          newAllDataPositionArr
        )
      }
    }
    let realAddCount = arrPos
    allDataArr.forEach((item, idx) => {
      item.arrPos += realAddCount
      newAllDataArr.push(item)
      const dataPosition = allDataPositionArr[idx]
      const prevIdx = idx - 1
      const startPx =
        prevIdx < 0
          ? newAllDataPositionArr[realAddCount - 1].endPx
          : allDataPositionArr[prevIdx].endPx
      const endPx = startPx + dataPosition.height
      dataPosition.startPx = startPx
      dataPosition.endPx = endPx
      // 保存项高度和位置信息
      newAllDataPositionArr.push(dataPosition)
    })
    allDataArr = newAllDataArr
    allDataPositionArr = newAllDataPositionArr
    start += realAddCount
    end += realAddCount
    /*
    因为直接 visibleDataArr.value = sliceAllDataArr(start, end, allDataArr) 时，界面旧数据并不会更新，因此先清空，再在nextTick更新。
    但实际这里会触发滚动，滚动中也会更新visibleDataArr.value，因此这里可以省掉更新代码，交由滚动事件回调函数更新
     */
    visibleDataArr.value = []
    // nextTick(() => {
    //   visibleDataArr.value = sliceAllDataArr(start, end, allDataArr)
    // })
  }
}
/**
 * 向 dataArr, dataPositionArr 插入普通数据以及普通数据的位置信息
 * @param item 分类数据
 * @param arrPos 可插入分数数据数组下标值
 * @param dataArr 分类数据会插入这个数组中
 * @param dataPositionArr 分类数据的位置信息会插入这个数组中
 * @return 最新的位置信息
 */
function appendDataItem(
  item: any,
  arrPos: number,
  dataArr: ItemData[],
  dataPositionArr: DataPositionHeight[]
) {
  const dataItem: ItemData = {
    customData: item,
    arrPos,
    dataType: 1,
    key: `${item.id}`,
  }
  dataArr.push(dataItem)
  /*
        计算当前列表项开始/结束位置
        开始位置为: 如果allDataArr为空，则开始位置为0，否则为allDataArr的长度
        结束位置为: 开始位置 + 项高度
      */
  const prevIdx = arrPos - 1
  const height = estimateHeight
  const startPx = prevIdx < 0 ? 0 : allDataPositionArr[prevIdx].endPx
  const endPx = startPx + height
  // 保存项高度和位置信息
  dataPositionArr.push({
    height,
    startPx,
    endPx,
  })
  arrPos += 1
  return arrPos
}
/**
 * 向 dataArr, dataPositionArr 插入分类数据以及分类数据的位置信息
 * @param item 分类数据
 * @param arrPos 可插入分数数据数组下标值
 * @param dataArr 分类数据会插入这个数组中
 * @param dataPositionArr 分类数据的位置信息会插入这个数组中
 * @return 最新的位置信息
 */
function appendClassifyItem(
  item: any,
  arrPos: number,
  dataArr: ItemData[],
  dataPositionArr: DataPositionHeight[]
) {
  const classifyItem: ItemData = {
    customData: item,
    arrPos,
    dataType: 2,
    key: `type-${item.id}`,
  }
  dataArr.push(classifyItem)
  /*
    计算当前列表项开始/结束位置
    开始位置为: 如果allDataArr为空，则开始位置为0，否则为allDataArr的长度
    结束位置为: 开始位置 + 项高度
  */
  const prevIdx = arrPos - 1
  const height = estimateClassifyHeight
  const startPx = prevIdx < 0 ? 0 : dataPositionArr[prevIdx].endPx
  const endPx = startPx + height
  // 保存项高度和位置信息
  dataPositionArr.push({
    height,
    startPx,
    endPx,
  })
  arrPos += 1
  return arrPos
}
/**
 * 记录最后一次滚动条的scrollTop值
 */
let lastScrollTop = 0
/**
 * 是正向还是逆向滚动(正向:从上往下, 逆向:从下往上)
 * true为正向
 */
let isPositive = true
// scrollTop与视口第一个元素的startPx的差值，占第一个元素高度的百分比
let scrollTopStartPositionDeltaPercent = 0
function reCalcData(ele: HTMLElement) {
  const { scrollTop, offsetHeight } = ele
  // 滚动差值大于0，则是正向
  isPositive = scrollTop - lastScrollTop > 0

  start = calcStart(scrollTop, allDataPositionArr)
  end = calcEnd(start, offsetHeight, allDataPositionArr)
  // 根据滚动位置，实时计算视口显示数据
  visibleDataArr.value = sliceAllDataArr(start, end, allDataArr)
  // 修正显示数据在界面中的位置
  translateY.value = calcTranslateY(start, allDataPositionArr)

  if (!isPositive) {
    // 滚动条向上，则计算scrollTop与视口第一个元素的startPx的差值，占第一个元素高度的百分比
    scrollTopStartPositionDeltaPercent = calcScrollTopStartPositionDeltaPercent(
      scrollTop,
      start,
      allDataPositionArr
    )
  }
}
function findStickClassify() {
  const ele = scrollerDomRef.value
  if (!ele || !allDataArr || allDataArr.length === 0) return

  const { scrollTop } = ele

  if (scrollTop <= 0) {
    return allDataArr[0].customData.classify
  }
  let start = 0
  let end = allDataArr.length
  let ret: number = end - 1
  while (start <= end) {
    // Math.trunc() 仅保留结果的整数部分
    let middle = Math.trunc((start + end) / 2)
    let middlePos = middle === 0 ? 0 : middle - 1
    // 获取折半之后的标题dom距离滚动容器顶部距离
    const offsetTop = allDataPositionArr[middlePos].endPx
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
  ret = ret <= 0 ? 0 : ret
  const tmp = ret < allDataArr.length ? allDataArr[ret] : undefined
  return tmp ? tmp.customData.classify : undefined
}
function findStickClassifyWrapper() {
  const tmp = findStickClassify()
  if (tmp !== undefined && classifyMap.value.get(tmp)) {
    stickyClassifyComp.value = tmp
  }
}
const findStickClassifyThrottle = throttle(findStickClassifyWrapper, 400)
/**
 * 根据滚动位置，实时计算视口显示数据
 * @param evt
 */
function onScroll() {
  if (!executeLongListLogicCall) return

  const ele = scrollerDomRef.value
  if (!ele) return

  const { scrollTop, scrollHeight, clientHeight } = ele
  reCalcData(ele)
  if (isPositive) {
    // 向下滚动
    if (
      isScrollEnd(scrollTop, scrollHeight, clientHeight) &&
      !dataLoading.value
    ) {
      // 滚动到了最底部, 且当前并未加载新数据
      searchDataWrapper(true, ele)
    }
  } else {
    // 向上滚动
    if (scrollTop <= 100 && !dataLoading.value) {
      // 滚动到距离顶部100px内时, 且未加载新数据
      searchDataWrapper(false, ele)
    }
  }
  findStickClassifyThrottle()
  calcScrollBarWidthDebounce()
}

async function searchDataWrapper(next: boolean, scrollerDom: HTMLElement) {
  dataLoading.value = true
  try {
    // 滚动到距离顶部100px内时, 且未加载新数据
    await searchData(next)
    reCalcData(scrollerDom)
    findStickClassifyThrottle()
  } finally {
    dataLoading.value = false
  }
}
/**
 * 是否滚动到了底部
 */
function isScrollEnd(
  scrollTop: number,
  scrollHeight: number,
  clientHeight: number
) {
  // Math.abs(scrollHeight - clientHeight - scrollTop) < 1 : 判断滚动条是否滚动到了最底部。公式来自MDN
  // return Math.abs(scrollHeight - clientHeight - scrollTop) < 1
  /*
  上面公式可以判断完全滚动到了最底部，实际更人性化的方式是，接近底部的时候就开始加载数据，让用户在无感知的情况下就加载了后续数据，因此可以将1调整到一个适合你项目的值
   */
  return Math.abs(scrollHeight - clientHeight - scrollTop) < 100
}
function calcTranslateY(
  _start: number,
  _allDataPositionArr: DataPositionHeight[]
) {
  const actualStart = Math.max(0, _start - cacheCount)
  return _allDataPositionArr[actualStart].startPx
}
onUpdated(() => {
  if (executeLongListLogicCall) {
    updateDataPosition()
    findStickClassifyThrottle()
  }
  calcScrollBarWidthDebounce()
})
/**
 * 界面更新完毕之后，重新更新列表项的位置信息和高度信息，如果列表项高度信息发生了变更，则还需要重新计算结束位置与支柱节点高度
 */
function updateDataPosition() {
  const contentWrapperDom = contentWrapperDomRef.value
  if (!contentWrapperDom) return

  const scrollerDom = scrollerDomRef.value
  if (!scrollerDom) return

  doUpdateDataPosition(contentWrapperDom)

  end = calcEnd(start, scrollerDom.offsetHeight, allDataPositionArr)
  if (
    allDataPositionArr.length > 0 &&
    pillarDomHeight.value !==
      allDataPositionArr[allDataPositionArr.length - 1].endPx
  ) {
    // 列表实际高度与预估高度不一致，则需要重新计算可见数据和支柱节点高度
    visibleDataArr.value = sliceAllDataArr(start, end, allDataArr)
    pillarDomHeight.value = calcPillarDomHeight(allDataPositionArr)
  }

  if (!isPositive) {
    // 滚动条向上，则重新计算scrollTop
    // 先根据占比，计算出scrollTop与allDataPositionArr[start].startPx的差值
    // 这里应该优先使用scrollTop与scrollTop与allDataPositionArr[start].startPx的差值占比，而非原来scrollTop占整个滚动条的百分比，因为基数越小，误差越小
    const delta =
      allDataPositionArr[start].height * scrollTopStartPositionDeltaPercent
    // 再根据差值和allDataPositionArr[start].startPx计算新的scrollTop值
    const newScrollTop = allDataPositionArr[start].startPx + delta
    if (newScrollTop !== scrollerDom.scrollTop) {
      scrollerDom.scrollTo({ top: newScrollTop })
    }
  }
}
function calcScrollTopStartPositionDeltaPercent(
  scrollTop: number,
  _start: number,
  _allDataPositionArr: DataPositionHeight[]
) {
  if (
    !_allDataPositionArr ||
    _allDataPositionArr.length === 0 ||
    scrollTop <= 0
  )
    return 0 // _allDataPositionArr为空，则scrollTop与开始元素差值比为0

  const startPosition = _allDataPositionArr[_start]
  // 计算scrollTop与首个渲染元素的差值
  const delta = scrollTop - startPosition.startPx
  // 计算这个差值高度占首个渲染元素高度的比例
  return delta / startPosition.height
}
function doUpdateDataPosition(contentWrapperDom: HTMLElement) {
  const childrenNodes = contentWrapperDom.children

  let len = childrenNodes.length
  for (let i = 0; i < len; i++) {
    const child = childrenNodes[i]
    const ele = child as HTMLElement
    if (!ele) continue

    const indexStr = ele.dataset['index']
    if (!indexStr) continue

    let index = 0
    try {
      index = parseInt(indexStr)
    } catch (error) {
      console.error(error)
      continue
    }

    /*
    这里必须通过getBoundingClientRect()获取高度，而不能直接通过offsetHeight获取高度, 因为getBoundingClientRect()获取的高度是精确值。
    offsetHeight的高度可能比实际高度高一点点或低一点点，虚拟列表数据越多，使用offsetHeight的误差就越大
     */
    const { height } = ele.getBoundingClientRect()
    const item = allDataPositionArr[index]
    if (height !== item.height) {
      // 原本记录的高度与实际渲染高度不一致，则更新列表项高度同时更新列表项的结束位置，以及当前列表项之后的所有后续列表项的位置和高度数据
      item.height = height
      item.endPx = item.startPx + item.height
      let prevIndex = index
      for (let j = index + 1; j < allDataPositionArr.length; j++) {
        prevIndex = j - 1
        const prevItem = allDataPositionArr[prevIndex]
        const curItem = allDataPositionArr[j]
        curItem.startPx = prevItem.endPx
        curItem.endPx = curItem.startPx + curItem.height
      }
    }
  }
}
/**
 * 组件初始化
 *
 * P.S. 特别注意事项
 * 1. 因为该组件的载入可能伴随容器高度/宽度变化的动效, 而只有调用处知道动效什么时候执行完毕. 因此, 组件初始化的时机交给外部决定(让这类动效执行结束之后，再执行初始化)
 * 2. 因为该组件的实现原理, 依赖组件内部的dom挂载完毕, 因此该初始化方法，除了必须在动效执行完毕(如果有的话)，且组件已初始化完成后, 才能调用 init 方法
 */
function init(initClassify?: number | string) {
  const scrollerDom = scrollerDomRef.value
  if (!scrollerDom) return

  // 获取滚动容器视口高度
  const { offsetHeight } = scrollerDom
  doInit(offsetHeight, initClassify)
}
/**
 * 清空, 让组件恢复到未加载数据前的状态
 */
function clear(): Promise<void> {
  executeLongListLogicCall = false
  start = 0
  end = 0
  pillarDomHeight.value = 0
  translateY.value = 0
  dataLoading.value = false
  allDataArr = []
  allDataPositionArr = []
  visibleDataArr.value = []
  // 滚动条必须回到最顶部，不然重新加载数据之后会报错
  scrollerDomRef.value?.scrollTo({ top: 0 })
  return new Promise<void>(resolve => {
    // 这里的定时器的作用是等待滚动条回归到最顶部
    setTimeout(() => {
      executeLongListLogicCall = true
      resolve()
    }, 180)
  })
}
/**
 * 转到数据id对应dom节点位置
 * @param dataId 数据id
 */
function scrollToDataId(dataId: string | number) {
  const idx = allDataArr.findIndex(item => item.customData.id === dataId)
  if (idx >= 0) {
    const dataPosition = allDataPositionArr[idx]
    if (dataPosition) {
      // 这次跳转之后, 可能预估的位置与实际位置不一样，实际dom节点有较大概率不会出现在视口中
      scrollerDomRef.value?.scrollTo({
        top: dataPosition.startPx + 1,
        behavior: 'smooth',
      })
      setTimeout(() => {
        // 再跳转一次，这次跳转dom节点基本都出现在视口中
        scrollerDomRef.value?.scrollTo({
          top: dataPosition.startPx + 1,
          behavior: 'smooth',
        })
      }, 180)
    }
  }
}
function scrollToClassify(classify: string | number, smooth = false) {
  const idx = allDataArr.findIndex(
    item => item.dataType === 2 && item.customData.classify === classify
  )
  if (idx >= 0) {
    const dataPosition = allDataPositionArr[idx]
    if (dataPosition) {
      // 这次跳转之后, 可能预估的位置与实际位置不一样，实际dom节点有较大概率不会出现在视口中
      scrollerDomRef.value?.scrollTo({
        top: dataPosition.startPx + 1,
        behavior: smooth ? 'smooth' : undefined,
      })
      setTimeout(() => {
        // 再跳转一次，这次跳转dom节点基本都出现在视口中
        scrollerDomRef.value?.scrollTo({
          top: dataPosition.startPx + 1,
          behavior: smooth ? 'smooth' : undefined,
        })
      }, 180)
    }
  }
}
/**
 * 通过数据id，更新字段值
 * @param dataId 待更新数据的id
 * @param field 待更新字段名
 * @param val 待更新字段值
 */
function updateFieldValByDataId(dataId: string, field: string, val: any) {
  const dataItem = allDataArr.find(item => item.customData.id === dataId)
  if (dataItem) {
    dataItem.customData[field] = val
    /*
    因为直接在这里执行 visibleDataArr.value = sliceAllDataArr(start, end, allDataArr), 界面并不会更新, 而composition api又废弃了forceUpdate功能，
    但visibleDataArr.value本身确实是发生了变化，因此只能先将visibleDataArr.value设置为空(vue此时会清空界面)，再在nextTick中重新复制(vue此时会使用新数据重新渲染界面)
     */
    visibleDataArr.value = []
    nextTick(() => {
      visibleDataArr.value = sliceAllDataArr(start, end, allDataArr)
    })
  }
}

/**
 * 执行数据初始化, 如果存在初始分类, 则在数据初始化之后, 再执行滚动条跳转, 转到所在分类
 * @param scrollerDomHeight 滚动容器的offsetHeight
 * @param initClassify 初始分类
 */
async function doInit(
  scrollerDomHeight: number,
  initClassify?: number | string
) {
  await Promise.all([clear(), searchData(true, initClassify)])
  end = calcEnd(start, scrollerDomHeight, allDataPositionArr)
  visibleDataArr.value = sliceAllDataArr(start, end, allDataArr)
  pillarDomHeight.value = calcPillarDomHeight(allDataPositionArr)
  if (initClassify) {
    nextTick(() => {
      scrollToClassify(initClassify)
    })
  }
}
/**
 * 计算支柱节点的dom高度(取_allDataPositionArr中最后一条数据的endPx)
 * @param _allDataPositionArr 所有数据(包含已渲染和未渲染的)
 */
function calcPillarDomHeight(_allDataPositionArr: DataPositionHeight[]) {
  const len = _allDataPositionArr.length
  if (len === 0) return 0

  return _allDataPositionArr[len - 1].endPx
}
/**
 * 从所有数据中截取开始和结束位置这段区间的数据
 * @param _start 开始位置
 * @param _end 结束位置
 * @param _allDataArr 所有数据(包含已渲染和未渲染的)
 */
function sliceAllDataArr(
  _start: number,
  _end: number,
  _allDataArr: ItemData[]
) {
  const actualStart = Math.max(0, _start - cacheCount)
  const actualEnd = Math.min(_end + cacheCount, _allDataArr.length)
  return _allDataArr.slice(actualStart, actualEnd)
}
/**
 * 计算待截取数据的结束索引号
 * 1. 如果_allDataPositionArr为空，则结束位置为0
 * 2. 如果开始位置大于等于结束位置，则结束位置为开始位置
 * 3. 否则从开始位置的列表项开始，逐步累加列表项高度，直到累加高度首次超过滚动容器视口高度
 *
 * @param _start 开始位置
 * @param scrollerDomHeight 滚动容器视口高度
 * @param _allDataPositionArr 所有列表项的位置和高度信息
 */
function calcEnd(
  _start: number,
  scrollerDomHeight: number,
  _allDataPositionArr: DataPositionHeight[]
) {
  const len = _allDataPositionArr.length
  // 尚未渲染过任何元素，则开始位置和结束位置是同一个位置
  if (!_allDataPositionArr || len === 0) return 0
  // 开始位置大于等于结束位置，则将结束位置设置为开始位置
  if (_start >= len) return _start

  // 从开始位置开始，累加计算列表项的高度，直到这个累加高度大于滚动容器视口高度
  let tmpEnd = _start
  let tmpHeight = _allDataPositionArr[tmpEnd].height
  while (tmpHeight <= scrollerDomHeight && tmpEnd < len - 1) {
    tmpEnd += 1
    tmpHeight += _allDataPositionArr[tmpEnd].height
  }
  // slice方法包头不包尾，所以要+1，可能出现滚动半个item高度的情况，所以还要再+1
  return tmpEnd + 2
}
/**
 * 计算待截取数据的开始索引号
 * 1. _allDataPositionArr为空，则开始位置为0
 * 2. 否则，找到_allDataPositionArr中，首个endPx大于scrollTop的元素位置，作为待截取数据的开始索引号
 *
 * @param scrollTop 滚动条的scrollTop
 * @param _allDataPositionArr 所有数据的位置和高度信息(包含已渲染和未渲染的)
 */
function calcStart(
  scrollTop: number,
  _allDataPositionArr: DataPositionHeight[]
) {
  let tmpStart = 0
  // _allDataPositionArr为空，则开始位置为0
  if (!_allDataPositionArr || _allDataPositionArr.length === 0) return tmpStart

  // 逐一对比_allDataPositionArr中，每个列表项的endPx, 直到endPx首次大于scrollTop，则该位置为 开始位置
  while (
    _allDataPositionArr[tmpStart] &&
    _allDataPositionArr[tmpStart].endPx < scrollTop
  ) {
    tmpStart += 1
  }
  if (!_allDataPositionArr[tmpStart]) {
    tmpStart -= 1
  }
  return tmpStart
}
defineExpose({
  init,
  scrollToDataId,
  scrollToClassify,
  updateFieldValByDataId,
  clear,
})
</script>

<style scoped lang="scss">
// will-change-height, will-change-transform, contain-paint 都属于css优化范围，如果发现影响了功能或者说产生了负优化效果, 则可直接删除
// will-change 介绍: https://juejin.cn/post/7015387929870598158
// contain 介绍: https://juejin.cn/post/6958990366888607757
.will-change-height {
  will-change: height;
}

.will-change-transform {
  will-change: contents, transform;
}

.contain-paint {
  contain: paint;
}

.js-sticky-dom-width {
  // 吸顶元素的宽度为：100% - 滚动条宽度
  width: calc(100% - v-bind(scrollBarWidthStr));
}
</style>
