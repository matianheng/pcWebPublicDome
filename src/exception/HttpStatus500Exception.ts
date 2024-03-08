export class HttpStatus500Exception extends Error {
  /**
   * 业务异常错误提示信息
   */
  private msg?: string
  /**
   * 业务异常请求url
   */
  private url: string

  constructor({ msg: errorMsg, url: reqUrl }: { msg?: string; url: string }) {
    super(`http响应状态码500: ${errorMsg}, ${reqUrl}`)
    this.msg = errorMsg
    this.url = reqUrl
  }
}
