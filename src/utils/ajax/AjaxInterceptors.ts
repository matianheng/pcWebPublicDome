import { BizApiExecuteException } from '@/exception/BizApiExecuteException'
import { BlobRespApiExecuteException } from '@/exception/BlobRespApiExecuteException'
import { HttpStatus500Exception } from '@/exception/HttpStatus500Exception'
import { ApiResp } from '@/pages/demo/mock-api/ApiTyping'
import {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import { ElNotification } from 'element-plus'

// P.S. axios 的拦截器(无论请求拦截还是响应拦截，都是按照注册顺序依次执行的)
export function setupInterceptor(instance: AxiosInstance) {
  instance.interceptors.response.use(
    function (response) {
      const { headers } = response
      const contentType = headers['content-type']
      if (contentType === 'application/octet-stream') {
        // 后端返回的是流, 则直接返回流结果
        return response
      } else if (response.data instanceof Blob) {
        if (response.data.type.indexOf('application/json') >= 0) {
          // 处理后端流响应接口异常
          catchBlobWebAPIExp(response)
        } else {
          // 处理后端流响应接口未按约定响应返回结果
          catchNotPromiseRespExp(response)
        }
      }

      const apiResp = response.data as ApiResp<any>
      if (apiResp.status != 0) {
        /*
        -important- 实际开发中, 业务接口的异常, 可分为需要外部捕获单独处理的, 以及在这里就可以单处理的
        如: 
        1. 提交了某个表单, 但某个字段后端验证失败, 给出了提示信息, 那这种前端就可以统一在这里给出一个弹窗提示即可, 无需再向外抛出异常
        2. 像当前示例系统的获取菜单数据的接口如果发生异常，这种就需要外部做特殊处理,那么除了这里的弹窗提示外,还需将异常继续向外抛出,让调用处知道有异常了
        3. 有些异常捕获到之后,需要在这里统一进行地址跳转(如：捕获了登录失效的异常,那直接在这统一跳转到登录页即可.也无需向外抛出异常了)
         */
        const errorUrl = buildReqUrl(response.config)
        ElNotification({
          title: `接口执行异常 [ ${apiResp.status} ]`,
          message: `异常信息: [ ${apiResp.msg} ], 接口: [ ${errorUrl} ]`,
          type: 'warning',
          duration: 0,
        })
        throw new BizApiExecuteException({
          status: apiResp.status,
          msg: apiResp.msg,
          url: errorUrl,
        })
      }
      return apiResp.data
    },
    function (error) {
      console.error('ajax请求异常', error)
      const errorUrl = buildReqUrl(error.config)
      if (error instanceof AxiosError) {
        if (error.response) {
          const { status, statusText } = error.response
          if (status !== 200 && status !== 201) {
            ElNotification({
              title: '后端服务响应状态异常',
              message: `状态码:${status}, 接口: ${errorUrl}`,
              type: 'warning',
              duration: 0,
            })
            if (status === 500) {
              throw new HttpStatus500Exception({
                msg: statusText,
                url: errorUrl,
              })
            }
          }
        } else {
          if (error.code === 'ERR_NETWORK') {
            ElNotification({
              title: '网络异常',
              message: `网络无响应, 接口: ${errorUrl}`,
              type: 'warning',
              duration: 0,
            })
          } else {
            ElNotification({
              title: '未知异常',
              message: `axios code: [ ${error.code} ], axios msg: [ ${error.message} ], 接口: ${errorUrl}`,
              type: 'warning',
              duration: 0,
            })
          }
        }
      }
      throw error
    }
  )
}

function buildReqUrl(config?: InternalAxiosRequestConfig<any>) {
  let url = ''
  if (!config) {
    return url
  }
  url = config.method ?? url
  url = url ? `${url}: ` : url
  url = config.url ?? url
  return url
}
function catchBlobWebAPIExp(response: AxiosResponse) {
  // 将blob转为json
  const errorUrl = buildReqUrl(response.config)
  const reader = new FileReader()
  reader.addEventListener('loadend', () => {
    // 将会打印json格式
    const jsonStr = reader.result as string
    const jsonObj = JSON.parse(jsonStr)
    console.warn(jsonObj)
    ElNotification({
      title: `接口执行异常 [ ${jsonObj.status} ]`,
      message: `异常信息: [ ${jsonObj.msg} ], 接口: [ ${errorUrl} ]`,
      type: 'warning',
      duration: 0,
    })
  })
  // 如果转换完中文出现乱码，可以设置一下代码
  reader.readAsText(response.data, 'utf-8')
  throw new BlobRespApiExecuteException()
}

function catchNotPromiseRespExp(response: AxiosResponse) {
  const errorMsg = `后端字节流响应接口, 发生异常时, [ content-type ] 应该为 [ application/json ], 当前实际为 [ ${response.data.type} ]`
  ElNotification({
    title: `接口未按约定响应异常`,
    message: errorMsg,
    type: 'warning',
    duration: 0,
  })
  throw new BlobRespApiExecuteException(errorMsg)
}
