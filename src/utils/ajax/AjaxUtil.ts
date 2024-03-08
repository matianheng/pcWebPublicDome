import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { App } from 'vue'
import { AxiosCancelError } from './AxiosCancelError'
import { setupInterceptor } from './AjaxInterceptors'

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  /**
   * 自定义请求唯一标识, 用于请求缓存以及请求取消
   */
  reqFlag?: string
  /**
   * 是否自动取消相同reqFlag的请求
   */
  cancelSame?: boolean
  /**
   * 是否启用缓存
   */
  enableCache?: boolean
}

const instance = axios.create({ timeout: 30000, withCredentials: true })

/**
 * 可取消的请求
 *
 * key为请求的唯一标识
 */
const cancelReqMap = new Map<string, AbortController>()
/**
 * 请求中的请求
 *
 * key为请求的唯一标识, value 为 response promise
 */
const pendingReqMap = new Map<string, Promise<any>>()
/**
 * 已缓存的请求
 *
 * key为请求的唯一标识, value 为 response promise
 */
const cacheReqPromiseMap = new Map<string, Promise<any>>()

// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    buildReqFlag(config as CustomAxiosRequestConfig)
    cancelReqAndRemoveCancelController(config as CustomAxiosRequestConfig)
    return config
  },
  function (error) {
    if (axios.isCancel(error)) {
      console.log('req捕获取消重复请求异常', error)
      return Promise.reject(
        new AxiosCancelError({ message: error.message, cause: error })
      )
    }
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    if (response.config) {
      removeCancelController(response.config)
    }
    // 2xx 范围内的状态码都会触发该函数。
    return response
  },
  function (error) {
    if (error.response && error.response.config) {
      removeCancelController(error.response.config)
    }
    if (axios.isCancel(error)) {
      console.log('resp捕获取消重复请求异常', error)
      return Promise.reject(
        new AxiosCancelError({ message: error.message, cause: error })
      )
    }
    // 超出 2xx 范围的状态码都会触发该函数。
    return Promise.reject(error)
  }
)

setupInterceptor(instance)

/**
 * 构建请求唯一标识. (使用 data, param, method, url 构建, 如果 config 中包含 reqFlag, 则直接返回该reqFlag)
 * @param config 请求配置
 * @param autoSetToConfig 是否将生成请求唯一标识设置到 config 中
 * @returns
 */
function buildReqFlag(
  config: CustomAxiosRequestConfig,
  autoSetToConfig = true
) {
  const { method, url, params, data, reqFlag } = config
  if (reqFlag) return reqFlag

  let tmpFlag = `${method}:${url}`
  if (params) {
    tmpFlag += `:${JSON.stringify(params)}`
  }
  if (data && data instanceof Object) {
    tmpFlag += `:${JSON.stringify(data)}`
  }
  if (autoSetToConfig) {
    config.reqFlag = tmpFlag
  }
  console.log('buildReqFlag tmpFlag', tmpFlag)
  return tmpFlag
}
/**
 * 如果cancelSame为true, 且 cancelReqMap 中存在与reqFlag匹配的AbortController，
 * 则先将该AbortController从cancelReqMap删除，再取消请求, 再将新请求加入 cancelReqMap 中
 * @param config axios配置
 */
function cancelReqAndRemoveCancelController(config: CustomAxiosRequestConfig) {
  const { cancelSame = false, reqFlag } = config
  if (cancelSame && reqFlag) {
    let abortController = removeCancelController(config)
    abortController?.abort(`取消请求[${reqFlag}]`)
    abortController = new AbortController()
    config.signal = abortController.signal
    cancelReqMap.set(reqFlag, abortController)
  }
}

function removeCancelController(config: CustomAxiosRequestConfig) {
  if (config) {
    const { reqFlag } = config
    if (reqFlag) {
      const abortController = cancelReqMap.get(reqFlag)
      if (abortController) {
        cancelReqMap.delete(reqFlag)
        return abortController
      }
    }
  }
  return undefined
}

/**
 * 根据请求标识取消请求
 * @param reqFlag 请求标识
 */
export function cancelReqByReqFlag(reqFlag: string) {
  const abortController = cancelReqMap.get(reqFlag)
  if (abortController) {
    cancelReqMap.delete(reqFlag)
    abortController.abort(`取消请求[${reqFlag}]`)
  }
}

function axiosReqMethodWrapper<T>(
  config: CustomAxiosRequestConfig
): Promise<T> {
  const { enableCache, cancelSame } = config
  const reqFlag = buildReqFlag(config)
  // 如果启用取消重复请求特性或禁用相同reqFlag请求的并发控制，则不看pending请求，否则，先查看是否存在pending中的请求，如果存在则直接返回
  let responsePromise: Promise<any> | undefined = cancelSame
    ? undefined
    : pendingReqMap.get(reqFlag)
  if (!responsePromise) {
    // 不存在pending中的请求
    try {
      if (enableCache) {
        // 启用了缓存, 则从缓存中拿
        responsePromise = cacheReqPromiseMap.get(reqFlag)
      }
      if (!responsePromise) {
        // 不存在promise, 则执行请求
        responsePromise = instance(config).finally(() => {
          // 未启用cancelSame，则请求结束，将该请求从pendingMap中删除
          if (!cancelSame) {
            pendingReqMap.delete(reqFlag)
          }
        })
        // 未启用cancelSame，则将该请求放入pendingMap
        if (!cancelSame) {
          pendingReqMap.set(reqFlag, responsePromise)
        }
        if (enableCache) {
          // 启用了缓存，则将请求缓存
          cacheReqPromiseMap.set(reqFlag, responsePromise)
        }
      } else {
        console.log(`${reqFlag} 请求已从从缓存中获取`)
      }
    } catch (e) {
      // 发生异常，则清除缓存，清除pending请求，且异常继续向上抛出
      if (!cancelSame) {
        pendingReqMap.delete(reqFlag)
      }
      if (enableCache) {
        cacheReqPromiseMap.delete(reqFlag)
      }
      throw e
    }
  }
  return responsePromise
}

/**
 * get请求
 * @param url 请求地址
 * @param config 请求配置
 * @returns 请求结果
 * @throws AxiosCancelError 当请求被取消时，会抛出该错误
 */
export function reqGet<T>(
  url: string,
  config: CustomAxiosRequestConfig = {}
): Promise<T> {
  return axiosReqMethodWrapper({ ...config, method: 'GET', url })
}
/**
 * post请求
 * @param url 请求地址
 * @param config 请求配置
 * @returns 请求结果
 * @throws AxiosCancelError 当请求被取消时，会抛出该错误
 */
export function reqPost<T>(
  url: string,
  config: CustomAxiosRequestConfig = {}
): Promise<T> {
  return axiosReqMethodWrapper({ ...config, method: 'POST', url })
}
/**
 * put请求
 * @param url 请求地址
 * @param config 请求配置
 * @returns 请求结果
 * @throws AxiosCancelError 当请求被取消时，会抛出该错误
 */
export function reqPut<T>(
  url: string,
  config: CustomAxiosRequestConfig = {}
): Promise<T> {
  return axiosReqMethodWrapper({ ...config, method: 'PUT', url })
}
/**
 * delete请求
 * @param url 请求地址
 * @param config 请求配置
 * @returns 请求结果
 * @throws AxiosCancelError 当请求被取消时，会抛出该错误
 */
export function reqDel<T>(
  url: string,
  config: CustomAxiosRequestConfig = {}
): Promise<T> {
  return axiosReqMethodWrapper({ ...config, method: 'DELETE', url })
}
export interface AjaxUtilType {
  reqGet: <T>(url: string, config?: CustomAxiosRequestConfig) => Promise<T>
  reqPost: <T>(url: string, config?: CustomAxiosRequestConfig) => Promise<T>
  reqPut: <T>(url: string, config?: CustomAxiosRequestConfig) => Promise<T>
  reqDel: <T>(url: string, config?: CustomAxiosRequestConfig) => Promise<T>
  cancelReqByReqFlag: (reqFlag: string) => void
}
export const AjaxUtil: AjaxUtilType = {
  reqGet,
  reqPost,
  reqPut,
  reqDel,
  cancelReqByReqFlag,
}

export function setupAjax(app: App) {
  app.config.globalProperties.$ajax = { reqGet, reqPost, reqDel }
}
export default instance

/**
 * 从axios响应结果中获取文件名
 * @param response axios完整响应结果
 * @param defaultFileName 在未找到文件名时的默认文件名
 * @returns 文件名
 */
export function extractFileNameFromAxiosResponse(
  response: AxiosResponse,
  defaultFileName: string
) {
  const disposition = response.headers['content-disposition'] as string
  console.log('disposition', disposition)
  if (disposition) {
    const pos = disposition.indexOf('=')
    if (pos >= 0) {
      return decodeURIComponent(disposition.substring(pos + 1))
    }
  }
  return defaultFileName
}
