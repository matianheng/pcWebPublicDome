/**
 * 判断是否 Firefox 1.0+
 *
 */
export function isFirefox() {
  // @ts-ignore
  return typeof InstallTrigger !== 'undefined'
}
/**
 * 判断是否Internet Explorer 6-11
 */
export function isIE() {
  // @ts-ignore
  return navigator.userAgent.indexOf('MSIE') !== -1 || !!document.documentMode
}
/**
 * 判断是否 Edge 20+
 */
export function isEdge() {
  // @ts-ignore
  return !isIE() && !!window.StyleMedia
}
/**
 * 判断是否 Chrome 1+
 */
export function isChrome(context = window) {
  // @ts-ignore
  return !!context.chrome
}
/**
 * 判断是否至少是 Safari 3+
 */
export function isSafari() {
  return (
    Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') >
      0 || navigator.userAgent.toLowerCase().indexOf('safari') !== -1
  )
}
/**
 * 判断是否IOS 下的 Chrome 浏览器
 */
export function isIOSChrome() {
  return navigator.userAgent.toLowerCase().indexOf('crios') !== -1
}

/**
 * 判断当前是否为一个html元素
 *
 * @param   {HTMLElement}  htmlDomOrHtmlSelector  html元素或html选择器
 *
 */
export function isHtmlElement(htmlDomOrHtmlSelector: HTMLElement | string) {
  // Check if element is instance of HTMLElement or has nodeType === 1 (for elements in iframe)
  return (
    typeof htmlDomOrHtmlSelector === 'object' &&
    htmlDomOrHtmlSelector &&
    (htmlDomOrHtmlSelector instanceof HTMLElement ||
      // @ts-ignore
      htmlDomOrHtmlSelector.nodeType === 1)
  )
}
