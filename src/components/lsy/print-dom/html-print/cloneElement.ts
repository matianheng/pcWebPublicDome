/**
 * 自定义dom转换方法
 *
 * @param   {HTMLElement}  cloneElement  克隆的html节点对象
 * @param {HTMLElement} originEle 原始的html节点对象
 *
 * @return  {HTMLElement}  转换后的html节点对象
 */
export type CustomEleConvert = (
  element: HTMLElement,
  originEle: HTMLElement
) => HTMLElement
/**
 * 深度克隆HTML元素（之所以自己写一个clone方法而不是直接使用HTMLElement.cloneNode(true),是为了能对指定的HTML元素做一些特殊处理如：将canvas转换为图片这种操作）
 *
 * @param   {HTMLElement}  element  待clone元素
 * @param {CustomEleConvert} customEleConvert 自定义dom转换方法. 作用是将元素做自定义的处理(如:将canvas节点转换为img节点)
 */
export function cloneElement(
  element: HTMLElement,
  customEleConvert?: CustomEleConvert
) {
  // cloneNode(false)只会克隆节点本身不会克隆子孙节点(文本属于文本节点所以也是子孙节点，因此也不会被克隆)
  let clone = element.cloneNode(false) as HTMLElement
  if (customEleConvert) {
    clone = customEleConvert(clone as HTMLElement, element)
  }
  // Check if the element needs any state processing (copy user input data)
  switch (clone.tagName) {
    case 'SELECT':
      // Copy the current selection value to its clone
      // @ts-ignore
      clone.value = element.value
      break
    case 'CANVAS':
      // Copy the canvas content to its clone
      // @ts-ignore
      clone.getContext('2d').drawImage(element, 0, 0)
      break
  }

  const childNodesArray = Array.prototype.slice.call(element.childNodes)
  for (let i = 0; i < childNodesArray.length; i++) {
    const clonedChild = cloneElement(childNodesArray[i], customEleConvert)
    clone.appendChild(clonedChild)
  }

  return clone
}
