import { buildWatermarkCanvas } from './buildWatermarkCanvas'
import { WatermarkOptions } from './typing'

/**
 * 将水印作为printDom节点的背景图片
 *
 * @param options 水印配置信息
 * @param printDom 待打印节点
 */
export function drawWatermarkForPrintDomBg(
  options: WatermarkOptions,
  printDom: HTMLElement
) {
  const canvasDom = buildWatermarkCanvas(options)
  if (!canvasDom) return

  // 将canvas转换为base64编码图片
  const base64 = canvasDom.toDataURL('image/png')

  Object.assign(printDom.style, {
    background: `url(${base64}) left top repeat`,
    'color-adjust': 'exact',
    'print-color-adjust': 'exact',
    '-webkit-print-color-adjust': 'exact',
  })
}

/**
 * 将水印节点作为一个独立的节点，使用这个独立的节点作为待打印节点的水印.
 *
 * 内部实现逻辑:
 * 1. 先创建一个div作为根节点。设置为相对定位
 * 2. 将待打印节点添加到这个根节点
 * 3. 创建一个div作为水印节点，使用canvas生成一个水印，使用css进行水印循环，并将此节点设置为绝对定位. top,left,right,bottom都设置为0
 * 4. 然后返回该根节点
 *
 * @param options 水印配置信息
 * @param printDom 待打印节点
 * @return {HTMLElement} 更新之后的待打印节点
 */
export function drawWatermarkAsDivForPrintDom(
  options: WatermarkOptions,
  printDom: HTMLElement
) {
  const canvasDom = buildWatermarkCanvas(options)
  if (!canvasDom) return

  // 将canvas转换为base64编码图片
  const base64 = canvasDom.toDataURL('image/png')

  const { position = 'absolute' } = options
  const rootDivDom = document.createElement('div') as HTMLDivElement
  rootDivDom.style.position = 'relative'
  rootDivDom.appendChild(printDom)
  const waterMarkDom = document.createElement('div') as HTMLDivElement
  Object.assign(waterMarkDom.style, {
    background: `url(${base64}) left top repeat`,
    'color-adjust': 'exact',
    'print-color-adjust': 'exact',
    '-webkit-print-color-adjust': 'exact',
    position: position,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  })
  rootDivDom.appendChild(waterMarkDom)
  return rootDivDom
}
