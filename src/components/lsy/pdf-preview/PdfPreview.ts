// @ungap/global-this 这个包是用来解决 pdfjs-dist 在低版本浏览器中 `globalthis is not defined` 报错问题
import 'globalthis/auto'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import { PDFDocumentProxy, TypedArray } from 'pdfjs-dist/types/src/display/api'

// 获取设备像素比（1个物理像素对应几个逻辑像素）
// devicePixelRatio和backingStorePixelRatio的解释 详见: https://juejin.cn/post/6844904130750726158
const devicePixelRatio = window.devicePixelRatio || 1
export interface PdfCanvasInfoType {
  /**
   * 当前页pdf渲染完毕后的canvas
   */
  pdfPageCanvas: HTMLCanvasElement
  /**
   * pdfPageCanvas的宽度
   */
  width: number
  /**
   * pdfPageCanvas的高度
   */
  height: number
}
interface RenderOnePdfParam {
  /**
   * 承载pdf画板的dom容器
   */
  pdfViewerDom: HTMLElement
  /**
   * pdf文件
   */
  pdfDoc: PDFDocumentProxy
  /**
   * 缩放比例
   */
  scale: number
  /**
   * 强制每页pdf的宽度，可选. 设置了该宽度之后scale的设置将无效
   */
  width?: number
  /**
   * 每页pdf渲染完毕之后的自定义回调函数。会在每页pdf渲染完成之后插入界面之前进行调用
   *
   * @param   {PdfCanvasInfoType}  pdfPageCanvasInfo  当前页pdf渲染完毕后的canvas数据
   *
   */
  pdfPageRenderCall?: (pdfPageCanvasInfo: PdfCanvasInfoType) => void
}
interface RenderOnePagePdfParam extends RenderOnePdfParam {
  /**
   * 需要渲染的页码
   */
  pageNum: number
}
/**
 * 渲染pdf文件的指定页到画板
 * @param params 页渲染参数
 */
function renderPdfOnePage(params: RenderOnePagePdfParam) {
  const { pdfViewerDom, pdfDoc, pageNum, scale, width, pdfPageRenderCall } =
    params
  // 创建画布
  const canvas = document.createElement('canvas')
  canvas.className = 'pdfPreviewCanvas'
  pdfViewerDom.appendChild(canvas)
  // 获取2d上下文
  const context = canvas.getContext('2d')
  if (null == context) {
    return
  }
  // devicePixelRatio和backingStorePixelRatio的解释 详见: https://juejin.cn/post/6844904130750726158
  const backingStoreRatio =
    // @ts-ignore
    context.webkitBackingStorePixelRatio ||
    // @ts-ignore
    context.mozBackingStorePixelRatio ||
    // @ts-ignore
    context.msBackingStorePixelRatio ||
    // @ts-ignore
    context.oBackingStorePixelRatio ||
    // @ts-ignore
    context.backingStorePixelRatio ||
    1

  pdfDoc.getPage(pageNum).then(page => {
    // 获取当前pdf页内容, 并设置缩放
    let viewport = width
      ? page.getViewport({ scale: 1 })
      : page.getViewport({ scale: scale })

    // 计算devicePixelRatio和backingStoreRatio的比例
    const ratio = devicePixelRatio / backingStoreRatio
    /*
    设置缩放因子，该设置会影响后续画图或画文字设置的宽高等属性，在这里是为了解决pdf清晰度问题
    scale方法的解释详见：https://www.w3school.com.cn/tags/canvas_scale.asp
    */
    context.scale(devicePixelRatio, devicePixelRatio)

    const realCanvas = context.canvas
    if (width && viewport.width != width) {
      // 存在强制宽度，且当前缩放比得到的宽度和强制宽度不一致，则根据强制宽度重新计算缩放比
      const newScale = width / viewport.width
      viewport = page.getViewport({ scale: newScale })
    }
    // 这里用于解决pdf清晰度问题，根据devicePixelRatio和backingStoreRatio的比例，对画布宽高进行缩放
    realCanvas.width = viewport.width * ratio
    realCanvas.height = viewport.height * ratio

    // 将画布dom元素的宽高设置为原始高度，这样就形成了一个高像素密度的图
    realCanvas.style.width = viewport.width + 'px'
    realCanvas.style.height = viewport.height + 'px'

    // 将pdf当前页内容画到2d画板中
    page
      .render({
        canvasContext: context,
        viewport,
        /*
        devicePixelRatio和backingStoreRatio的比例不相等，则需要对画布进行适当缩放.
        transform 解释详见：
        https://juejin.cn/post/7056428474021445645
        https://blog.csdn.net/qq_45021462/article/details/120182433

        [ratio, 0, 0, ratio, 0, 0] 这实际是缩放，对应公式为：matrix(sx, 0, 0, sy, 0, 0)，等同于scale(sx, sy)
         */
        transform: ratio != 1 ? [ratio, 0, 0, ratio, 0, 0] : undefined,
      })
      .promise.then(() => {
        pdfPageRenderCall &&
          pdfPageRenderCall({
            pdfPageCanvas: canvas,
            width: viewport.width,
            height: viewport.height,
          })
      })
  })
}

/**
 * 渲染pdf到画布
 * @param params 渲染参数
 */
function renderPdfCanvas(params: RenderOnePdfParam) {
  const { pdfViewerDom, pdfDoc, scale, width, pdfPageRenderCall } = params

  // 清除原来的pdf画布
  pdfViewerDom.innerHTML = ''
  // 获取总页数
  const totalPage = pdfDoc.numPages
  // 获取显示容器
  for (let i = 1; i <= totalPage; i++) {
    // 循环处理pdf的每页
    renderPdfOnePage({
      pdfViewerDom: pdfViewerDom,
      pdfDoc,
      pageNum: i,
      scale,
      width,
      pdfPageRenderCall,
    })
  }
}
/**
 * 更新缩放比的方法. 当设置了强制宽度时, 调用该方法无效
 *
 * @param   {number}  scale  缩放比. 最小值0.5
 *
 * @return  {number}         当前实际的缩放比. 当设置了强制宽度时, 返回值永远为1
 */
export type UpdateScaleMethod = (scale: number) => number

export interface PdfPreviewConfig {
  /**
   * 初始化完成之后立刻渲染第一页. 默认:true
   * 该属性用于连续渲染
   */
  inintedRender?: boolean
  /**
   * pdf地址
   */
  pdfUrl?: string
  /**
   * pdf的流数据
   */
  data?: TypedArray
  /**
   * 承载显示pdf内容的html元素
   */
  pdfRenderContainerDom: HTMLElement
  /**
   * 缩放比例. 1表示100%, 0.5表示50%, 1.5表示150%. 最低0.5, 最高不限制. 不填默认为: 1.5
   */
  scale?: number
  /**
   * 强制保持pdf每页宽度为width指定的宽度(原本页宽大于width的会收缩,否则会拉伸), 设置了width之后, scale设置将无效
   */
  width?: number
  /**
   * 是否携带凭证(cookie信息). 不填表示false
   */
  withCredentials?: boolean
  /**
   * 自定义请求头. 可选
   */
  httpHeaders?: Record<string, unknown>
  /**
   * 每页pdf渲染完毕之后的自定义回调函数。会在每页pdf渲染完成之后插入界面之前进行调用
   *
   * @param   {PdfCanvasInfoType}  pdfPageCanvasInfo  当前页pdf渲染完毕后的canvas信息
   *
   */
  pdfPageRenderCall?: (pdfPageCanvasInfo: PdfCanvasInfoType) => void
}

export interface PdfOperateInfoType {
  /**
   * 渲染指定页
   *
   * @param   {number}  pageNum  页号. 从1开始
   * @return {number} 当前渲染的页号
   *
   */
  renderPage: (pageNum: number, newPdfViewerDom?: HTMLElement) => number
  /**
   * 渲染上一页
   * @return {number} 当前渲染的页号
   */
  renderPrevPage: () => number
  /**
   * 渲染下一页
   * @return {number} 当前渲染的页号
   */
  renderNextPage: () => number
  /**
   * 更改缩放比, 并返回当前缩放比.
   * p.s. 当初始化时, 设置了width, 则调用 changeScale 方法不会生效. 返回的缩放比永远是1
   *
   * @param   {number}  scale  缩放比. 最小0.5
   * @return {number} 当前缩放比
   */
  changeScale: (scale: number, newPdfViewerDom?: HTMLElement) => number
  /**
   * 总页数
   */
  totalPage: number
}

export interface PdfjsDistConfigType {
  /**
   * 这个是pdfjs-dist插件的东西. pdfjs-dist内部实际用的是这个。该文件在 pdfjs-dist/build/pdf.worker.min.js
   */
  workerSrc: string
  /**
   * cMapUrl这个是pdfjs-dist插件的东西. 用于解决中文显示问题. cmaps文件夹在 pdfjs-dist/cmaps
   */
  cMapUrl: string
}

let _pdfjsDistConfig: PdfjsDistConfigType
export function pdfPreviewBuilder(pdfjsDistConfig: PdfjsDistConfigType) {
  if (!_pdfjsDistConfig) {
    _pdfjsDistConfig = pdfjsDistConfig
    GlobalWorkerOptions.workerSrc = _pdfjsDistConfig.workerSrc
  }
  return {
    loadPdfDocOperateInfo,
    loadPdfAndRender,
  }
}

/**
 * 获取 pdf 分页相关操作方法
 *
 * @param config 配置信息
 */
function loadPdfDocOperateInfo(
  config: PdfPreviewConfig
): Promise<PdfOperateInfoType> {
  const {
    httpHeaders = {},
    pdfUrl,
    data,
    scale = 1.5,
    pdfRenderContainerDom,
    width,
    withCredentials = false,
    pdfPageRenderCall,
    inintedRender = true,
  } = config
  const pdfLoadingTask = data
    ? getDocument({
        data: data,
        cMapUrl: _pdfjsDistConfig.cMapUrl,
        withCredentials,
        // 可以添加请求头
        httpHeaders,
        cMapPacked: true,
      })
    : getDocument({
        url: pdfUrl,
        cMapUrl: _pdfjsDistConfig.cMapUrl,
        withCredentials,
        // 可以添加请求头
        httpHeaders,
        cMapPacked: true,
      })
  return new Promise<PdfOperateInfoType>(resolve => {
    pdfLoadingTask.promise.then(pdfDoc => {
      // 获取总页数
      const totalPage = pdfDoc.numPages
      let curPage = 0
      let cacheScale = scale
      const originPdfRenderContainerDom = pdfRenderContainerDom
      const changeScale = (newScale: number, newPdfViewerDom?: HTMLElement) => {
        if (width !== undefined && width !== null) {
          // 存在强制宽度，则禁止修改缩放
          return 1
        }
        if (newScale >= 0.5) {
          // 清除原来的pdf画布
          if (newPdfViewerDom) {
            newPdfViewerDom.innerHTML = ''
          } else {
            originPdfRenderContainerDom.innerHTML = ''
          }
          renderPdfOnePage({
            pdfViewerDom: newPdfViewerDom
              ? newPdfViewerDom
              : originPdfRenderContainerDom,
            pdfDoc,
            pageNum: curPage,
            scale: newScale,
            width,
            pdfPageRenderCall,
          })
          cacheScale = newScale
        }
        return cacheScale
      }
      /**
       * 渲染指定页
       *
       * @param   {number}  page  需要渲染的pdf页码. 从1开始
       *
       */
      const renderPage = (page: number, newPdfViewerDom?: HTMLElement) => {
        if (page >= 1 && page <= totalPage && curPage != page) {
          // 清除原来的pdf画布
          if (newPdfViewerDom) {
            newPdfViewerDom.innerHTML = ''
          } else {
            pdfRenderContainerDom.innerHTML = ''
          }
          renderPdfOnePage({
            pdfViewerDom: newPdfViewerDom
              ? newPdfViewerDom
              : pdfRenderContainerDom,
            pdfDoc,
            pageNum: page,
            scale: cacheScale,
            width,
            pdfPageRenderCall,
          })
          curPage = page
        }
        return curPage
      }
      /**
       * 渲染上一页
       */
      const renderPrevPage = () => {
        if (curPage > 1) {
          curPage--
          // 清除原来的pdf画布
          pdfRenderContainerDom.innerHTML = ''
          renderPdfOnePage({
            pdfViewerDom: pdfRenderContainerDom,
            pdfDoc,
            pageNum: curPage,
            scale: cacheScale,
            width,
            pdfPageRenderCall,
          })
        }
        return curPage
      }
      /**
       * 渲染下一页
       *
       * @return  {[type]}  [return description]
       */
      const renderNextPage = () => {
        if (curPage < totalPage) {
          curPage++
          // 清除原来的pdf画布
          pdfRenderContainerDom.innerHTML = ''

          renderPdfOnePage({
            pdfViewerDom: pdfRenderContainerDom,
            pdfDoc,
            pageNum: curPage,
            scale: cacheScale,
            width,
            pdfPageRenderCall,
          })
        }
        return curPage
      }
      if (inintedRender) {
        renderNextPage()
      }
      resolve({
        renderNextPage,
        renderPrevPage,
        renderPage,
        totalPage,
        changeScale,
      })
    })
  })
}

/**
 * 加载pdf文件，并完整渲染
 *
 * @param pdfUrl pdf地址
 * @param scale 缩放比
 * @param pdfRenderContainerDom 渲染pdf的容器dom节点
 *
 * @return  {UpdateScaleMethod}  返回更新scale的方法
 */
function loadPdfAndRender(
  config: PdfPreviewConfig
): Promise<UpdateScaleMethod> {
  const {
    httpHeaders = {},
    pdfUrl,
    data,
    scale = 1.5,
    pdfRenderContainerDom,
    width,
    withCredentials = false,
    pdfPageRenderCall,
  } = config
  const pdfLoadingTask = data
    ? getDocument({
        data: data,
        cMapUrl: _pdfjsDistConfig.cMapUrl,
        withCredentials,
        // 可以添加请求头
        httpHeaders,
        cMapPacked: true,
      })
    : getDocument({
        url: pdfUrl,
        cMapUrl: _pdfjsDistConfig.cMapUrl,
        withCredentials,
        // 可以添加请求头
        httpHeaders,
        cMapPacked: true,
      })
  return new Promise<UpdateScaleMethod>(relove => {
    pdfLoadingTask.promise.then(pdfDoc => {
      let cacheScale = scale
      if (pdfDoc) {
        renderPdfCanvas({
          pdfViewerDom: pdfRenderContainerDom,
          pdfDoc,
          scale: cacheScale,
          width,
          pdfPageRenderCall,
        })
        const updateScaleMethod = (newScale: number) => {
          if (width !== undefined && width !== null) {
            return 1
          } else if (newScale !== cacheScale && newScale >= 0.5) {
            renderPdfCanvas({
              pdfViewerDom: pdfRenderContainerDom,
              pdfDoc,
              scale: newScale,
              width,
              pdfPageRenderCall,
            })
            cacheScale = newScale
          }
          return cacheScale
        }
        relove(updateScaleMethod)
      }
    })
  })
}
