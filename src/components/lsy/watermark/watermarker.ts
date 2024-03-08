import { buildWatermarkDiv } from './buildWatermarkDiv'
import { buildWatermarkStyle } from './buildWatermarkStyle'
import { WatermarkOperator, WatermarkOptions } from './typing'
type DomMMethod = () => HTMLElement | undefined

function doClear(watermarkDomId: string, observer: MutationObserver) {
  observer && observer.disconnect()
  const watermarkDom = document.getElementById(watermarkDomId)
  if (watermarkDom && watermarkDom.parentElement) {
    // @ts-ignore
    watermarkDom.disconnectObs && watermarkDom.disconnectObs()
    watermarkDom.parentElement.removeChild(watermarkDom)
  }
}

/**
 * 创建水印
 *
 * @param watermarkDomId 水印id
 * @param options 水印配置
 * @param observer 观察器实例，用于监听水印节点是否被删除
 * @param el 要添加谁赢的html元素或html选择器. 不指定时，表示给body添加水印
 */
function create(
  watermarkDomId: string,
  options: WatermarkOptions,
  observer: MutationObserver,
  el?: HTMLElement | string | DomMMethod
) {
  //获取待添加水印的节点
  let elDom: HTMLElement | null | undefined = null
  if (el === undefined) {
    elDom = document.body
  } else if (typeof el === 'string') {
    elDom = document.querySelector(el) as HTMLElement
  } else if (el instanceof Function) {
    elDom = el()
  }
  if (!elDom) return

  // 创建水印节点
  const ret = buildWatermarkDiv(options, elDom, watermarkDomId)
  if (!ret) return

  const { zIndex = 999, position = 'absolute' } = options

  const { base64, watermarkDom } = ret
  // 将水印节点作为目标节点的子节点
  elDom.appendChild(watermarkDom)
  // 监听elDom子孙节点的删除
  observer.observe(elDom, {
    childList: true,
  })

  const doBuildWatermarkStyle = () => {
    return buildWatermarkStyle(base64, position, zIndex)
  }
  const obs = new MutationObserver(() => {
    // 临时删除防篡改监听，避免死循环
    // @ts-ignore
    watermarkDom.disconnectObs && watermarkDom.disconnectObs()
    // 属性值恢复
    Object.assign(watermarkDom.style, doBuildWatermarkStyle())
    watermarkDom.id = watermarkDomId
    // 再次添加防篡改监听
    // @ts-ignore
    watermarkDom.observe && watermarkDom.observe()
  })
  // @ts-ignore
  watermarkDom.disconnectObs = () => {
    obs.disconnect()
  }
  // @ts-ignore
  watermarkDom.observe = () => {
    // 监听水印节点的style,id属性被篡改
    obs.observe(watermarkDom, {
      attributes: true,
      attributeFilter: ['style', 'id'],
    })
  }
  // @ts-ignore
  watermarkDom.observe()
}

/**
 * 水印建造者方法
 *
 * @param {WatermarkOptions} options 水印配置信息
 * @param {HTMLElement | string} el 要添加谁赢的html元素或html选择器
 *
 * @return  {[type]}  [return description]
 */
export function watermarkBuilder(
  options: WatermarkOptions,
  el?: HTMLElement | string | DomMMethod
): WatermarkOperator {
  let cacheOptions = options
  // 水印节点的id
  const watermarkDomId = `_water-markdom-id-${new Date().getTime()}`

  // 监听水印节点是否被删除，如果被删除则自动创建
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      for (let i = 0; i < mutation.removedNodes.length; i++) {
        const ele = mutation.removedNodes.item(i) as HTMLElement
        if (ele && ele.id === watermarkDomId) {
          observer.disconnect()
          //@ts-ignore
          if (ele.disconnectObs) {
            // 如果水印节点被删除，则同时去除监听
            //@ts-ignore
            ele.disconnectObs()
          }
          create(watermarkDomId, cacheOptions, observer, el)
        }
      }
    })
  })
  const build = () => create(watermarkDomId, cacheOptions, observer, el)
  const clear = () => {
    doClear(watermarkDomId, observer)
  }
  /**
   * 更新界面水印
   *
   */
  const updateWatermark = () => {
    clear()
    build()
  }
  return {
    build,
    clear,
    updateWatermark,
    updateOptions: (newOptions: WatermarkOptions, rebuildWatermark = true) => {
      cacheOptions = newOptions
      if (rebuildWatermark) {
        updateWatermark()
      }
    },
  }
}
