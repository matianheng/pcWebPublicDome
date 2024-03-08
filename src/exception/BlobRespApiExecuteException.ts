export class BlobRespApiExecuteException extends Error {
  /**
   * 错误提示信息
   */
  private msg?: string

  constructor(msg = `后端字节流响应接口异常`) {
    super(msg)
    this.msg = msg
  }
}
