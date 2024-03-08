export interface WatermarkOptions {
  /**
   * 水印文本
   */
  text: string
  /**
   * canvas的宽。宽度应该大于等于水印文本的宽度
   */
  width: number
  /**
   * canvas的高。高度应该大于等于水印文本的高度. 默认: 20
   */
  height?: number
  /**
   * 水印文字颜色. 默认: rgba(0, 0, 0, 0.3)
   */
  color?: string
  /**
   * 水印文字旋转角度. 支持-360到360. 默认: 0
   * 负数标识逆时针旋转，正数表示顺时针旋转
   */
  angle?: number
  /**
   * 水印节点的z-index值. 默认: 999
   */
  zIndex?: number
  /**
   * 水印节点定位方式. 默认: absolute
   */
  position?: string
  /**
   * 水印文本水平对齐方式. 默认: start. 可选值参考: https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/textAlign
   */
  textAlign?: CanvasTextAlign
  /**
   * 水印文本垂直对齐方式. 默认: alphabetic. 可选值参考: https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/textBaseline
   */
  textBaseline?: CanvasTextBaseline
  /**
   * 字体大小.单位:px 默认: 16
   */
  fontSize?: number
  /**
   * 字体. 默认: Microsoft Yahei
   */
  fontFamily?: string
  /**
   * 水印文字起点的x轴坐标
   */
  x?: number
  /**
   * 水印文字起点的y轴坐标
   */
  y?: number
}

export interface WatermarkOperator {
  /**
   * 创建水印
   */
  build: () => void
  /**
   * 清除水印
   */
  clear: () => void
  /**
   * 更新水印配置，并重新构建水印
   *
   * @param {WatermarkOptions} options 新的水印配置
   * @param {boolean} 水印配置更新之后，是否同时更新界面上的水印. 默认: true
   */
  updateOptions: (options: WatermarkOptions, rebuildWatermark?: boolean) => void
  /**
   * 更新界面水印（用于解决元素高度动态变化时，水印无法完全覆盖问题）
   */
  updateWatermark: () => void
}
