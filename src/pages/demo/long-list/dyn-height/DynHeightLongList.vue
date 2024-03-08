<template>
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
      <template
        v-for="dataItem in visibleDataArr"
        :key="dataItem.customData.id"
      >
        <!-- 不要试图使用slot方式实现自定义表单项，会有明显性能问题 -->
        <div :data-index="dataItem.arrPos">
          <component :is="itemComp" :data-item="dataItem"></component>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onUpdated, nextTick, ref, Component as VueComponent } from 'vue'
import type { DataPositionHeight, ItemData, PageResult } from './typing'
/**
 * 项高度不确定的长列表
 *
 * 该组件的逻辑触发点有3个, 读源码的同学, 注意从这3个地方开始切入
 * 1. init方法: 对组件数据进行初始化
 * 2. onScroll回调方法: 随着滚动, 不断更新修改组件数据
 * 3. onUpdated回调方法: 随着实际渲染, 不断修正预估项高度和实际项高度差异导致的滚动与显示差异
 */
defineOptions({
  name: 'DynHeightLongList',
})

const props = defineProps<{
  /**
   * 根据页号加载数据
   * @param pageNum 页号
   *
   * @returns list的每一项应该是 CustomData 类型
   *
   * @see typing.d.ts#CustomData
   */
  loadData: (pageNum: number) => Promise<PageResult>
  /**
   * 列表项预估高度. 单位: px (该数据定义之后不可改)
   */
  estimateHeight: number
  /**
   * 缓冲数据量(该数据定义之后不可改)
   */
  cacheCount: number
  /**
   * 自定义表单项组件(该数据定义之后不可改)
   * 表单项组件的prop为: itemData: ItemData
   */
  itemComp: VueComponent
}>()

const { loadData, estimateHeight, cacheCount, itemComp } = props
/**
 * 需要截取数据的开始索引号
 */
let start = 0
/**
 * 需要截取数据的结束索引号
 */
let end = 0
/**
 * 分页号
 */
let page = 1
/**
 * 总页数
 */
let totalPage = 0
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
 * 获取列表项数据，计算列表项位置和高度，项目数据放入allDataArr，项位置和高度信息放入allDataPositionArr
 */
async function searchData() {
  if (totalPage !== 0 && totalPage < page) {
    return
  }
  // 获取加载数据前的总数量
  const startArrPos = allDataArr.length
  // 调用外部方法，加载实际数据
  const ret = await loadData(page)
  if (!ret.list || ret.list.length === 0) return

  totalPage =
    ret.total % ret.size === 0 ? ret.total / ret.size : ret.total / ret.size + 1
  page += 1
  ret.list.forEach((item, idx) => {
    const arrPos = startArrPos + idx
    const dataItem: ItemData = {
      customData: item,
      arrPos,
    }
    allDataArr.push(dataItem)
    const height = estimateHeight
    /*
    计算当前列表项开始/结束位置
    开始位置为: 如果allDataArr为空，则开始位置为0，否则为allDataArr的长度
    结束位置为: 开始位置 + 项高度
     */
    const prevIdx = arrPos - 1
    const startPx = prevIdx < 0 ? 0 : allDataPositionArr[prevIdx].endPx
    const endPx = startPx + height
    // 保存项高度和位置信息
    allDataPositionArr.push({
      height,
      startPx,
      endPx,
    })
  })
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
  // console.log(start, end)
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
      dataLoading.value = true
      // 继续加载新数据。这里需要使用promise.then,catch方式，而非使用async await方式, 避免阻塞scroll事件, 造成界面卡顿
      searchData()
        .then(() => {
          dataLoading.value = false
          reCalcData(ele)
        })
        .catch(() => {
          dataLoading.value = false
        })
    }
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
  }
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
function init() {
  const scrollerDom = scrollerDomRef.value
  if (!scrollerDom) return

  // 获取滚动容器视口高度
  const { offsetHeight } = scrollerDom
  doInit(offsetHeight)
}
/**
 * 清空, 让组件恢复到未加载数据前的状态
 */
function clear(): Promise<void> {
  executeLongListLogicCall = false
  start = 0
  end = 0
  page = 1
  totalPage = 0
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
function scrollToDataId(dataId: string) {
  const idx = allDataArr.findIndex(item => item.customData.id === dataId)
  if (idx >= 0) {
    const dataPosition = allDataPositionArr[idx]
    if (dataPosition) {
      // 这次跳转之后, 可能预估的位置与实际位置不一样，实际dom节点有较大概率不会出现在视口中
      scrollerDomRef.value?.scrollTo({
        top: dataPosition.startPx,
        behavior: 'smooth',
      })
      setTimeout(() => {
        // 再跳转一次，这次跳转dom节点基本都出现在视口中
        scrollerDomRef.value?.scrollTo({
          top: dataPosition.startPx,
          behavior: 'smooth',
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
function updateFieldValByDataId(
  dataId: string | number,
  field: string,
  val: any
) {
  const dataItem = allDataArr.find(item => item.customData.id === dataId)
  if (dataItem) {
    dataItem.customData[field] = val
    /*
    因为直接在这里执行 visibleDataArr.value = sliceAllDataArr(start, end, allDataArr), 界面旧数据并不会更新, 而composition api又废弃了forceUpdate功能，
    但visibleDataArr.value本身确实是发生了变化，因此只能先将visibleDataArr.value设置为空(vue此时会清空界面)，再在nextTick中重新复制(vue此时会使用新数据重新渲染界面)
     */
    visibleDataArr.value = []
    nextTick(() => {
      visibleDataArr.value = sliceAllDataArr(start, end, allDataArr)
    })
  }
}

/**
 *
 * @param scrollerDomHeight 滚动容器的offsetHeight
 */
async function doInit(scrollerDomHeight: number) {
  await Promise.all([clear(), searchData()])
  end = calcEnd(start, scrollerDomHeight, allDataPositionArr)
  visibleDataArr.value = sliceAllDataArr(start, end, allDataArr)
  pillarDomHeight.value = calcPillarDomHeight(allDataPositionArr)
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
</style>
