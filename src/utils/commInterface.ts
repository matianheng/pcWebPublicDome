export interface ResponseData<T> {
  code: number
  data: T
  msg: string
}
export interface PageDataType<T> {
  list: T[]
  total: number
  page: number
  size: number
}
