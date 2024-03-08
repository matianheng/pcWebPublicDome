import { WatermarkOptions } from './typing'

/**
 * 根据配置创建水印canvas
 *
 * @param   {WatermarkOptions}  options  水印配置
 *
 */
export function buildWatermarkCanvas(options: WatermarkOptions) {
  const {
    height = 20,
    width,
    text,
    fontSize = 16,
    fontFamily = 'Microsoft Yahei',
    color = 'rgba(0, 0, 0, 0.3)',
    angle = 0,
    textBaseline = 'alphabetic',
    textAlign = 'start',
  } = options
  const x = options.x === undefined ? fontSize : options.x
  const y = options.y === undefined ? fontSize : options.y
  const font = `${fontSize}px ${fontFamily}`
  const canvasDom: HTMLCanvasElement = Object.assign(
    document.createElement('canvas'),
    { width, height }
  )
  const canvasRender2D = canvasDom.getContext('2d')
  if (!canvasRender2D) return
  canvasRender2D.rotate((Math.PI / 180) * angle)
  canvasRender2D.fillStyle = color
  canvasRender2D.font = font
  canvasRender2D.textAlign = textAlign
  canvasRender2D.textBaseline = textBaseline
  canvasRender2D.fillText(text, x, y)
  return canvasDom
}
