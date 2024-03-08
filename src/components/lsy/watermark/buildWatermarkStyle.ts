/**
 * 创建水印节点的样式
 *
 * @param elDomHeight 水印节点的高
 * @param elDomWidth 水印节点的宽
 * @param picBase64 水印的base64图片
 * @param position 水印节点定位方式
 * @param zIndex 水印节点的z-index值
 */
export const buildWatermarkStyle = (
  picBase64: string,
  position: string,
  zIndex: number
) => {
  return {
    margin: 0,
    padding: 0,
    background: `url(${picBase64}) left top repeat`,
    'color-adjust': 'exact',
    'print-color-adjust': 'exact',
    '-webkit-print-color-adjust': 'exact',
    position,
    pointerEvents: 'none',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    display: 'block',
    visibility: 'visible',
    // 防止水印被其他元素覆盖
    'z-index': zIndex,
  }
}
