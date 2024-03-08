import { buildWatermarkCanvas } from './buildWatermarkCanvas'
import { buildWatermarkStyle } from './buildWatermarkStyle'
import { WatermarkOptions } from './typing'

/**
 * 构建水印div，并返回水印的base64图片以及水印div
 *
 * @return   水印的base64图片和水印div节点
 */
export function buildWatermarkDiv(
  options: WatermarkOptions,
  elDom: HTMLElement,
  watermarkDomId: string
) {
  const { zIndex = 999, position = 'absolute' } = options

  // 创建水印canvas
  const canvasDom = buildWatermarkCanvas(options)
  if (!canvasDom) return

  // 将canvas转换为base64编码图片
  const base64 = canvasDom.toDataURL('image/png')
  // 创建水印节点
  const watermarkDom = document.createElement('div') as HTMLElement
  watermarkDom.id = watermarkDomId

  Object.assign(
    watermarkDom.style,
    buildWatermarkStyle(base64, position, zIndex)
  )
  return { base64, watermarkDom }
}
