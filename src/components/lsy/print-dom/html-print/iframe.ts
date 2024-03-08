import { isChrome, isEdge, isFirefox, isHtmlElement, isIE } from './browser'
import { cloneElement, CustomEleConvert } from './cloneElement'

/**
 * 获取iframe的document
 *
 * @param   {HTMLIFrameElement}  iframeElement  iframe
 */
function getIframeDocument(iframeElement: HTMLIFrameElement) {
  let iframeDoc = iframeElement.contentWindow || iframeElement.contentDocument
  // @ts-ignore
  if (iframeDoc && iframeDoc.document) iframeDoc = iframeDoc.document
  return iframeDoc as Document
}

/**
 * 获取iframe的window对象
 *
 * @param   {HTMLIFrameElement}  iframeElement  [iframeElement description]
 *
 * @return  {[type]}                            [return description]
 */
function getIframeWindow(iframeElement: HTMLIFrameElement) {
  return iframeElement.contentWindow as Window
}

/**
 * 执行iframe的打印
 *
 * @param   {HTMLIFrameElement}  iframeElement  尚未插入html文档的iframe元素(即:未执行过dom.appendChild(iframeElement)的dom)
 * @param {HTMLElement} printDom 待进行局部打印的HTML元素(这应该是真实的待打印html dom的克隆对象)
 *
 * @return  {[type]}                            [return description]
 */
function iframePrint(
  iframeElement: HTMLIFrameElement,
  printDom: HTMLElement,
  cssLinkStr: string,
  customTitle = '',
  style = ''
) {
  // 如果iframe尚未插入html文档，则插入
  !iframeElement.parentElement &&
    document.getElementsByTagName('body')[0].appendChild(iframeElement)

  // 获取iframe的文档对象
  const iframeDoc = getIframeDocument(iframeElement)
  const iframeWin = getIframeWindow(iframeElement)
  iframeElement.onload = () => {
    // 将实际内容插入iframe
    iframeDoc.body.appendChild(printDom)

    // 获取待打印节点中的所有图片节点
    const images = iframeDoc.getElementsByTagName('img')

    if (images.length > 0) {
      // 待打印节点中包含图片节点，则等待图片加载完毕之后再打印
      loadIframeImages(Array.from(images)).then(() =>
        executePrint(iframeElement, iframeDoc, iframeWin)
      )
    } else {
      executePrint(iframeElement, iframeDoc, iframeWin)
    }

    // 用于在关闭打印预览窗口时，销毁iframe
    cleanUp()
  }
  iframeDoc.open()
  // 样式必须通过这种方式写入iframe, 否则iframe中会无样式
  iframeDoc.write(
    `<html>
    <head>
      <title>${customTitle}</title>${cssLinkStr}
<style>${style}</style>
</head><body></body></html>`
  )
  // close之后会触发onload
  iframeDoc.close()
}

function executePrint(
  iframeElement: HTMLIFrameElement,
  iframeDoc: Document,
  iframeWin: Window
) {
  try {
    iframeElement.focus()
    if (isEdge() || isIE()) {
      try {
        iframeDoc.execCommand('print', false)
      } catch (e) {
        iframeWin.print()
      }
    } else {
      iframeWin.print()
    }
  } finally {
    if (isFirefox()) {
      iframeElement.style.visibility = 'hidden'
      iframeElement.style.left = '-1px'
    }
  }
}

const iframeId = `printIframe-${new Date().getTime()}`

function cleanUp() {
  // Run onPrintDialogClose callback
  let event = 'mouseover'

  if (isChrome() || isFirefox()) {
    // Ps.: Firefox will require an extra click in the document to fire the focus event.
    event = 'focus'
  }

  /*
   * 销毁iframe，只能通过这种事件方式销毁, 不能直接销毁。在PC端打印预览窗体会阻塞iframe销毁的代码执行，
   * 直至打印预览窗体关闭才会执行，而部分移动端浏览器，打印预览窗口不会阻塞后续代码的执行，那么iframe就会被销毁，
   * 导致最终打印的结果是当前窗体的内容，而非iframe中的内容
   */
  const handler = () => {
    // Make sure the event only happens once.
    window.removeEventListener(event, handler)

    // Remove iframe from the DOM
    const iframe = document.getElementById(iframeId)

    if (iframe) {
      iframe.remove()
    }
  }

  window.addEventListener(event, handler)
}

/**
 * 自定义打印前的回调方法。可用于打印之前对待打印html dom对象进行一些修改. 比如: 添加水印
 *
 * @param   {HTMLElement}  printDom  待打印html节点的克隆节点，对该节点的操作不会影响原始节点
 *
 * @return  {HTMLElement}            修改之后的待打印dom节点(最终会打印这个dom节点)
 */
export type CustomPrintBeforeCall = (printDom: HTMLElement) => HTMLElement
export interface DomPrintConfig {
  /**
   * 待打印元素或待打印元素的html选择器
   */
  htmlDomOrHtmlSelector: HTMLElement | string
  /**
   * 打印样式(打印样式应该通过printCssArr传入，内部在克隆待打印html节点时，不会克隆样式)
   */
  printCssArr: string[]
  /**
   * 自定义打印样式(这里通常放动态样式)
   */
  style?: string
  /**
   * 页眉
   */
  customTitle?: string
  /**
   * 打印之前的自定义回调. 可选. 可在打印之前对待打印html dom对象进行一些修改. 比如: 添加水印
   */
  customPrintBeforeCall?: CustomPrintBeforeCall
  /**
   * 自定义dom转换方法. 会在每个dom节点克隆时调用. 作用是将元素做自定义的处理(如:将canvas节点转换为img节点)
   */
  customEleConvert?: CustomEleConvert
}
/**
 * 执行打印/打开打印预览
 *
 * @param htmlDomOrHtmlSelector 待打印元素或待打印元素的html选择器
 * @param printCssArr 打印样式(打印样式应该通过printCssArr传入，内部在克隆待打印html节点时，不会克隆样式)
 * @param customTitle 页眉
 * @param customPrintBeforeCall 打印之前的自定义回调(printDom是待打印html节点的复制节点，对该节点的操作不会影响原始节点). 可选. 可在打印之前对待打印html dom对象进行一些修改. 比如: 添加水印
 */
export function doPrint(domPrintConfig: DomPrintConfig) {
  const {
    style,
    printCssArr,
    customPrintBeforeCall,
    htmlDomOrHtmlSelector,
    customEleConvert,
    customTitle,
  } = domPrintConfig
  // 获取待局部打印的html元素
  const printDom = isHtmlElement(htmlDomOrHtmlSelector)
    ? (htmlDomOrHtmlSelector as HTMLElement)
    : (document.querySelector(htmlDomOrHtmlSelector as string) as HTMLElement)
  if (!printDom) return

  // 删除已存在的iframe
  const usedFrame = document.getElementById(iframeId)
  if (usedFrame) usedFrame.parentNode?.removeChild(usedFrame)
  // 创建一个新的iframe
  const printFrame = document.createElement('iframe')
  if (isFirefox()) {
    printFrame.setAttribute(
      'style',
      'width: 1px; height: 100px; position: fixed; left: 0; top: 0; opacity: 0; border-width: 0; margin: 0; padding: 0'
    )
  } else {
    printFrame.setAttribute(
      'style',
      'visibility: hidden; height: 0; width: 0; position: absolute; border: 0'
    )
  }
  // 设置id
  printFrame.setAttribute('id', iframeId)
  // 克隆待局部打印的html元素
  let clonePrintDom = cloneElement(printDom, customEleConvert)
  // 存在自定义的打印之前回调函数，则执行
  if (customPrintBeforeCall) {
    /*
    // important: 重要
    这里之所以最终打印返回值的dom元素，是考虑到，水印要作为待打印元素的背景
    (即待打印元素的css的background属性要被占用，而如果待打印元素本身就有背景呢!那岂不是把待打印元素的背景给冲掉了)
    为防止待打印元素的背景被水印冲掉，customPrintBeforeCall方法中可以在clonePrintDom的外部再套一个div，在这个div中加水印就没问题了
    */
    clonePrintDom = customPrintBeforeCall(clonePrintDom as HTMLElement)
  }

  let cssLinkStr = ''
  printCssArr.forEach(css => {
    cssLinkStr += `<link rel="stylesheet" href="${css}">`
  })
  // 执行iframe的print方法
  iframePrint(
    printFrame,
    clonePrintDom as HTMLElement,
    cssLinkStr,
    customTitle,
    style
  )
}

function loadIframeImages(images: HTMLImageElement[]) {
  const promises = images.map(image => {
    if (image.src && image.src !== window.location.href) {
      return loadIframeImage(image)
    }
  })

  return Promise.all(promises)
}

function loadIframeImage(image: HTMLImageElement) {
  return new Promise(resolve => {
    const pollImage = () => {
      !image ||
      typeof image.naturalWidth === 'undefined' ||
      image.naturalWidth === 0 ||
      !image.complete
        ? setTimeout(pollImage, 500)
        : resolve(true)
    }
    pollImage()
  })
}
