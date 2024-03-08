export class BizApiExecuteException extends Error {
  /**
   * 业务异常状态码
   */
  private status: number
  /**
   * 业务异常错误提示信息
   */
  private msg?: string
  /**
   * 业务异常请求url
   */
  private url: string

  constructor({
    status: bizStatus,
    msg: errorMsg,
    url: reqUrl,
  }: {
    status: number
    msg?: string
    url: string
  }) {
    super(`业务接口执行异常: ${bizStatus}, ${errorMsg}, ${reqUrl}`)
    this.status = bizStatus
    this.msg = errorMsg
    this.url = reqUrl
  }
}
