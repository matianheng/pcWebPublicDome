import { LsyPageParam } from '@/components/lsy/page-table/typing'

/**
 * 接口响应
 */
export interface ApiResp<T> {
  status: number
  msg: string
  data: T
}
export type PageResultApiResp<T> = ApiResp<PageResult<T>>

export interface UserInfo {
  account: string
  name: string
  city: string
  mobile: string
  email: string
  male: number
  createDate: string
  status: number
}
export interface DicItemInfo {
  value: number
  text: string
}
export interface SearchFormData {
  type?: string
  account?: string
  city?: string
  mobile?: string
  email?: string
  createDate?: string[]
}

export interface PageReq<T> {
  searchParams?: T
  pageParams?: LsyPageParam
}
/*
 * 人员状态
 * wait-fit: 待填写
 * wait-pass: 待审核
 * reject: 已驳回
 * already-pass: 已通过
 * already-giveUp: 已放弃
 */
export type PersonStatus =
  | 'wait-fit'
  | 'wait-pass'
  | 'reject'
  | 'already-pass'
  | 'already-giveUp'
export interface PersonInfo {
  status?: PersonStatus
  basic?: BasicInfoType
  eduInfoArr?: EduInfoType[]
  other?: OtherInfoType
}
/**
 * 基本信息
 */
export interface BasicInfoType {
  /**
   * 照片
   */
  pic?: string
  /**
   * 姓名
   */
  name?: string
  /**
   * 是否中国籍
   */
  isChina?: number
  /**
   * 党团关系
   */
  relation?: number
  /**
   * 居住地址
   */
  addr?: string
  /**
   * 生日
   */
  birthday?: string
  /**
   * 凑数字段a
   */
  a?: string
  /**
   * 凑数字段b
   */
  b?: string
  /**
   * 凑数字段c
   */
  c?: string
  /**
   * 凑数字段d
   */
  d?: string
}

/**
 * 学位证信息
 */
export interface GraduateDegreeDiploma {
  /**
   * 主学位证
   */
  mainGraduateDegreeDiploma?: string
  /**
   * 第二学位证
   */
  secondGraduateDegreeDiploma?: string
  /**
   * 是否双学位
   * 0. 否
   * 1. 是
   */
  doubleDegree?: number
}

/**
 * 教育信息
 */
export interface EduInfoType {
  id?: string
  /**
   * 教育类型.
   * 1: 高中或以下
   * 2: 大专
   * 3: 本科
   * 4: 研究生或以上
   */
  type?: number
  /**
   * 学校名称
   */
  school: string
  /**
   * 毕业证
   */
  graduationCertificate: string
  /**
   * 是否双学位
   * 0. 否
   * 1. 是
   */
  doubleDegree: number
  /**
   * 主学位证
   */
  mainGraduateDegreeDiploma?: string
  /**
   * 第二学位证
   */
  secondGraduateDegreeDiploma?: string
  /**
   * 学位证信息(这是前端需要的字段，后端不需要)
   */
  graduateDegreeDiploma?: GraduateDegreeDiploma
  /**
   * 受教育开始时间
   */
  startDate?: string
  /**
   * 受教育结束时间
   */
  endDate?: string
  /**
   * 开始-结束日期(前端字段: 数组第一个值为开始让日期, 数组第二个值为结束日期)
   *
   * 应该在获取到后端数据之后,将startDate和endDate转换为dateRange
   *
   * 在提交数据之前,将dateRange转换为startDate和endDate
   */
  dateRange?: [string, string]
}

/**
 * 其他信息
 */
export interface OtherInfoType {
  /**
   * 体检报告
   */
  physicalExaminationReport: string[]
  /**
   * 离职证明
   */
  resignationCertificate?: string
}
/**
 * 标记有误信息
 */
export interface MarkErrorInfoType {
  id?: string
  /**
   * 大类
   */
  section: string
  /**
   * 行号
   */
  row: number
  /**
   * 标记有误字段
   */
  field: string
  /**
   * 错误提示信息
   */
  msg: string
}
export interface ArticleType {
  id: string
  title: string
  content: string
}
