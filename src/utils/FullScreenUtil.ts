/**
 * 判断全屏是否可用(是否已存在全屏元素)
 * @returns
 */
export function fullscreenEnabled() {
  return (
    document.fullscreenElement ||
    // @ts-ignore
    document.mozFullScreenElement ||
    // @ts-ignore
    document.webkitFullscreenElement
  )
}
/**
 * 进入全屏
 * @param element 待全屏的HTML元素
 * @returns
 */
export function doFullscreen(
  element: HTMLElement,
  fullscreenParent = false
): Promise<void> {
  let fullscreenEle = fullscreenParent ? element.parentElement : element
  fullscreenEle = fullscreenEle ? fullscreenEle : element
  let result = null
  if (fullscreenEle.requestFullscreen) {
    result = fullscreenEle.requestFullscreen()
    // @ts-ignore
  } else if (fullscreenEle.mozRequestFullScreen) {
    // @ts-ignore
    result = fullscreenEle.mozRequestFullScreen()
    // @ts-ignore
  } else if (fullscreenEle.msRequestFullscreen) {
    // @ts-ignore
    result = fullscreenEle.msRequestFullscreen()
    // @ts-ignore
  } else if (fullscreenEle.webkitRequestFullscreen) {
    // @ts-ignore
    result = fullscreenEle.webkitRequestFullScreen()
  }
  return result
    ? Promise.resolve()
    : Promise.reject(new Error('当前设备不支持dom全屏'))
}

/**
 * 将ele元素进行全屏
 * @param ele 待全屏的元素
 * @param fullscreenParent 是否使用ele元素的父级元素全屏. 默认:false
 * @param fullScreenCallback 全屏/退出全屏前的回调函数(flag为true表示从非全屏进入全屏,false表示从全屏进入非全屏)
 */
export function toggleFullscreen(
  ele: HTMLElement,
  fullscreenParent = false,
  fullScreenCallback?: (flag: boolean) => void
) {
  if (fullscreenEnabled()) {
    return doExitFullscreen().then(() => {
      fullScreenCallback && fullScreenCallback(false)
    })
  } else {
    return doFullscreen(ele, fullscreenParent).then(() => {
      fullScreenCallback && fullScreenCallback(true)
    })
  }
}

/**
 * 退出全屏
 */
export function doExitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen()
    // @ts-ignore
  } else if (document.msExitFullscreen) {
    // @ts-ignore
    document.msExitFullscreen()
    // @ts-ignore
  } else if (document.mozCancelFullScreen) {
    // @ts-ignore
    document.mozCancelFullScreen()
    // @ts-ignore
  } else if (document.webkitExitFullscreen) {
    // @ts-ignore
    document.webkitExitFullscreen()
  }
  return Promise.resolve()
}

// let isFullscreen = false

// const handler = () => {
//   isFullscreen = document.fullscreenElement !== null
//   if (!isFullscreen) {
//     // 退出全屏时候解除监听，不然每次监听都会添加一次绑定
//     document.removeEventListener('fullscreenchange', handler)
//   }
// }

// document.addEventListener('fullscreenchange', handler)
